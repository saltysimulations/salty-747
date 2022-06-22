import { Subject, Subscribable } from '../..';
import { EventBus } from '../../data';
import { FlightPlanner } from '../../flightplan';
import { ClockEvents } from '../../instruments';
import { Waypoint } from '../../navigation';
import { TCAS } from '../../traffic';
import { ComponentProps, FSComponent, NodeReference, VNode } from '../FSComponent';
import {
  MapBingLayer, MapComponent, MapComponentProps, MapCullableLocationTextLabel, MapCullableTextLayer, MapLayer, MapProjection, MapWaypointIcon
} from '../map';
import { MapSystemFlightPlanLayer } from '../mapsystem/layers/MapSystemFlightPlanLayer';
import { MapSystemOwnshipLayer } from './layers/MapSystemOwnshipLayer';
import { MapSystemWaypointsLayer } from './layers/MapSystemWaypointsLayer';
import { MapSystemContext, ReadOnlyMapSystemContext } from './MapSystemContext';
import { LegStyleHandler, LegWaypointHandler, MapSystemPlanRenderer } from './MapSystemPlanRenderer';
import { MapSystemIconFactory, MapSystemLabelFactory, MapSystemWaypointsRenderer } from './MapSystemWaypointsRenderer';
import { MapColorsModule } from './modules/MapColorsModule';
import { MapFlightPlanModule } from './modules/MapFlightPlanModule';
import { MapIndexedRangeModule } from './modules/MapIndexedRangeModule';
import { MapModule } from './modules/MapModule';
import { MapOwnshipModule } from './modules/MapOwnshipModule';
import { MapPositionModule } from './modules/MapPositionModule';
import { MapWaypointDisplayModule } from './modules/MapWaypointDisplayModule';
import { MapWxrModule } from './modules/MapWxrModule';
import { MapSystemWaypointRoles } from './MapSystemWaypointRoles';
import { MapTrafficModule } from './modules/MapTrafficModule';
import { MapSystemTrafficLayer, MapTrafficIntruderIconFactory } from './layers/MapSystemTrafficLayer';

/**
 * Props on the MapSystem component.
 */
export interface MapSystemProps extends ComponentProps {
  /** The unique BingMap ID to assign to this map system. */
  bingId: string;

  /** The CSS class to apply to the map system container. */
  class?: string;

  /** A callback fired when the map system's projected size changes. */
  onProjectedSizeChanged?: (component: MapSystemComponent) => void;
}

/**
 * Props on the internal MapSystemComponent component.
 */
interface MapSystemComponentProps extends MapComponentProps<any> {
  /** The CSS class to apply to the map system container. */
  class?: string;

  /** A callback fired when the map system's projected size changes. */
  onProjectedSizeChanged?: (component: MapSystemComponent) => void;

  /** The map system context to use with this map system. */
  context: MapSystemContext;
}

/**
 * A compiled map system available after build.
 */
export interface CompiledMapSystem {
  /** The map system context. */
  context: ReadOnlyMapSystemContext;

  /** The reference to the map system component, available after rendering. */
  ref: NodeReference<MapComponent>;

  /** The compiled JSX map system component. */
  Map: (props: MapSystemProps) => MapComponent;
}

/**
 * A type that describes parameters to controller constructors.
 */
type ControllerParams<T extends new (...args: [ReadOnlyMapSystemContext, ...any | never]) => any> =
  T extends new (...args: [ReadOnlyMapSystemContext, ...infer P]) => any ? P : never;

/**
 * A class that builds dynamic components for complex map systems.
 */
export class MapSystemBuilder {

  /**
   * Creates an instance of a map system builder.
   * @param bus The event bus to use with this instance.
   * @param projection The optional external map projection to use with this instance.
   * @returns A new MapSystemBuilder.
   */
  public static create(bus: EventBus, projection = new MapProjection(256, 256)): MapSystemBuilder {
    return new MapSystemBuilder(bus, projection);
  }

  protected readonly context: MapSystemContext;

  /**
   * Creates an instance of a map system builder.
   * @param bus The event bus to use with this instance.
   * @param projection The map projection to use with this instance.
   */
  protected constructor(bus: EventBus, projection: MapProjection) {
    this.context = new MapSystemContext(bus, projection, 30);
  }

  /**
   * Sets up a default map system, with a single BingMap terrain layer, default black ground with blue water terrain colors,
   * absolute terrain, and pre-wired to aircraft position and rotation.
   * @returns The modified MapSystemBuilder.
   */
  public withTerrainMap(): this {
    this.context.moduleFactories.set(MapPositionModule.name, context => new MapPositionModule(context));
    this.context.moduleFactories.set(MapIndexedRangeModule.name, context => new MapIndexedRangeModule(context));
    this.context.moduleFactories.set(MapColorsModule.name, context => new MapColorsModule(context));
    this.context.moduleFactories.set(MapWxrModule.name, context => new MapWxrModule(context));

    this.context.layerFactories.push({ key: MapBingLayer.name, factory: this.buildDefaultBingLayer.bind(this) });
    return this;
  }

  /**
   * Sets up a layer containing the aircraft ownship icon.
   * @param imageFilePath A subscribable to the path containing the ownship icon file.
   * @param size The size of the icon square, in pixels.
   * @param anchor The point on the icon which is anchored to the airplane's position, expressed relative to the icon's width and
   * height, with [0, 0] at the top left and [1, 1] at the bottom right.
   * @param className The name of the CSS class to apply to this layer container.
   * @returns The modified MapSystemBuilder.
   */
  public withOwnshipIcon(imageFilePath: Subscribable<string>, size: number, anchor?: Subscribable<Float64Array>, className?: string): this {
    this.context.moduleFactories.set(MapOwnshipModule.name, context => new MapOwnshipModule(context));
    this.context.layerFactories.push({
      key: MapSystemOwnshipLayer.name,
      factory: context => (
        <MapSystemOwnshipLayer imageFilePath={imageFilePath} iconSize={size} mapProjection={context.projection} model={context.model}
          iconAnchor={anchor !== undefined ? anchor : Subject.create(new Float64Array([0, 0]))} class={className} />
      )
    });

    return this;
  }

  /**
   * Adds a waypoint display system to the map system.
   * @param builder An optional configuration builder that will configure the waypoint display.
   * @returns The modified MapSystemBuilder.
   */
  public withWaypointDisplay(builder?: (context: MapSystemContext, builder: WaypointDisplayBuilder) => void): this {
    this.context.moduleFactories.set(MapWaypointDisplayModule.name, context => new MapWaypointDisplayModule(context));

    this.context.waypointRenderer.addRenderRole(MapSystemWaypointRoles.Normal, undefined, MapSystemWaypointRoles.Normal);

    let useMapTargetAsSearchCenter = false;
    if (builder !== undefined) {
      const b = new WaypointDisplayBuilder(this.context.iconFactory, this.context.labelFactory, this.context.waypointRenderer);
      builder(this.context, b);

      useMapTargetAsSearchCenter = b.getIsCenterTarget();
      this.context.textManager.setCullingEnabled(b.getCullingEnabled());
    }

    this.context.layerFactories.push({
      key: MapSystemWaypointsLayer.name,
      factory: (context: MapSystemContext): VNode => <MapSystemWaypointsLayer bus={context.bus} waypointRenderer={context.waypointRenderer} model={context.model}
        mapProjection={context.projection} iconFactory={context.iconFactory} labelFactory={context.labelFactory} useMapTargetAsSearchCenter={useMapTargetAsSearchCenter} />
    });

    return this.withTextLabels();
  }

  /**
   * Adds a flight plan display to the map system.
   * @param flightPlanner The flight planner to use with this layer. If more than one flight play display
   * layer is added, subsequent layers will use the same flight planner.
   * @param planIndex The index of the flight plan to display.
   * @param builder An optional configuration builder that will configure the flight plan display.
   * @returns The modified MapSystemBuilder.
   */
  public withFlightPlanDisplay(flightPlanner: FlightPlanner, planIndex: number,
    builder?: (context: MapSystemContext, builder: FlightPlanDisplayBuilder) => void): this {
    const existingModule = this.context.moduleFactories.has(MapFlightPlanModule.name);
    if (!existingModule) {
      this.context.moduleFactories.set(MapFlightPlanModule.name, context => new MapFlightPlanModule(flightPlanner, context));
    }

    this.context.layerFactories.push({
      key: `${MapSystemFlightPlanLayer.name}_${planIndex}`,
      factory: context => (<MapSystemFlightPlanLayer bus={context.bus} waypointRenderer={context.waypointRenderer}
        iconFactory={context.iconFactory} labelFactory={context.labelFactory} mapProjection={context.projection} model={context.model}
        flightPathRenderer={context.planRenderer} planIndex={planIndex} />)
    });

    if (builder !== undefined) {
      const b = new FlightPlanDisplayBuilder(this.context.iconFactory, this.context.labelFactory,
        this.context.waypointRenderer, this.context.planRenderer, planIndex);
      builder(this.context, b);
    }

    const flightPlanRoles = this.context.waypointRenderer.getRoleNamesByGroup(`${MapSystemWaypointRoles.FlightPlan}_${planIndex}`);
    if (flightPlanRoles.length === 0) {
      this.context.waypointRenderer.insertRenderRole(MapSystemWaypointRoles.FlightPlan, MapSystemWaypointRoles.Normal, undefined, `${MapSystemWaypointRoles.FlightPlan}_${planIndex}`);
    }

    return this.withTextLabels();
  }

  /**
   * Adds a traffic display to the map system.
   * @param tcas The TCAS used by the traffic display.
   * @param iconFactory A function which creates intruder icons for the traffic display.
   * @param initCanvasStyles A function which initializes global canvas styles for the traffic display.
   * @returns The modified MapSystemBuilder.
   */
  public withTrafficDisplay(tcas: TCAS, iconFactory: MapTrafficIntruderIconFactory, initCanvasStyles?: (context: CanvasRenderingContext2D) => void): this {
    this.context.moduleFactories.set(MapTrafficModule.name, context => new MapTrafficModule(tcas, context));

    this.context.layerFactories.push({
      key: MapSystemTrafficLayer.name,
      factory: (context: MapSystemContext): VNode => {
        return (
          <MapSystemTrafficLayer
            bus={context.bus} model={context.model} mapProjection={context.projection}
            iconFactory={iconFactory} initCanvasStyles={initCanvasStyles}
          />
        );
      }
    });

    return this;
  }

  /**
   * Adds the text label layer to the map system. If the text label layer was already added, then it will
   * be moved to the top of the layer stack.
   * @param cullingEnabled True if text label collision culling should be enabled, false otherwise.
   * @returns The modified MapSystemBuilder.
   */
  public withTextLabels(cullingEnabled?: boolean): this {
    const existingLayerIndex = this.context.layerFactories.findIndex(v => v.key === MapCullableTextLayer.name);
    if (existingLayerIndex !== -1) {
      this.context.layerFactories.splice(existingLayerIndex, 1);
    }

    if (cullingEnabled !== undefined) {
      this.context.textManager.setCullingEnabled(cullingEnabled);
    }

    this.context.layerFactories.push({
      key: MapCullableTextLayer.name,
      factory: (context: MapSystemContext): VNode => <MapCullableTextLayer manager={context.textManager} model={context.model} mapProjection={context.projection} />
    });

    return this;
  }

  /**
   * Configures the map system such that the map position center is offset by the specified [x, y]
   * number of pixels.
   * @param offset The offset in pixels, in [x, y] format.
   * @returns The modified MapSystemBuilder.
   */
  public withCenterOffset(offset: Float64Array): this {
    this.context.projection.set({ targetProjectedOffset: offset });
    return this;
  }

  /**
   * Configures the map system to the specified projected size. The map projection will automatically
   * add sufficient boundary outsize of this projected size to account for map corners during map rotations.
   * @param size The projected size of the map in pixels, in [width, height] format.
   * @returns The modified MapSystemBuilder.
   */
  public withSize(size: Float64Array): this {
    this.context.size = size;
    return this;
  }

  /**
   * Configures the map system to wait a certain amount of time before binding the map.
   * This is mainly used as a workaround for a native bug in the weather renderer
   * to make some instruments bind the map beofre others.
   * If you don't know if you have the issue, then you don't have to use this setting.
   * @param delay How long to delay in ms before binding the map.
   * @returns The modified MapSystemBuilder.
   */
  public withDelay(delay: number): this {
    this.context.delay = delay;
    return this;
  }

  /**
   * Configures the map system to add a layer to the map. Layers are rendered in the order
   * that they are added to the system.
   * @param key The string key of the layer.
   * @param factory The factory that constructs the layer.
   * @returns The modified MapSystemBuilder.
   */
  public withLayer(key: string, factory: (context: MapSystemContext) => VNode): this {
    this.context.layerFactories.push({ key, factory });
    return this;
  }

  /**
   * Configures the map system to add a map data module to the map. Modules may request that other
   * modules be present when the map system is built; if these modules are not added then the map
   * system may fail to build.
   * @param key The string key of the map data module, which may be used by other modules to check for
   * module dependencies.
   * @param factory The factory that constructs the module.
   * @returns The modified MapSystemBuilder.
   */
  public withModule(key: string, factory: (context: MapSystemContext) => MapModule): this {
    this.context.moduleFactories.set(key, factory);
    return this;
  }

  /**
   * Configures the map system to use a controller, which is constructed after the map system has rendered.
   * @param controller The controller to use.
   * @param args The arguments to pass to the controller's constructor.
   * @returns The modified map builder.
   */
  public withController<T extends new (...args: [ReadOnlyMapSystemContext, ...any | never]) => any>(controller: T, ...args: ControllerParams<T>): this {
    if (args === undefined || (args !== undefined && args.length === 0)) {
      args = [this.context] as any;
    } else {
      args.splice(0, 0, this.context);
    }

    this.context.controllers.push({ factory: controller, args: args });
    return this;
  }

  /**
   * A generalized builder function that supplies the current map system context.
   * @param builder The builder to use to configure the map system.
   * @returns The modified MapSystemBuilder.
   */
  public with(builder: (context: MapSystemContext) => void): this {
    builder(this.context);
    return this;
  }

  /**
   * Configures the map to synchronize at a specified refresh rate.
   * @param refreshRate The refresh rate to update at, in Hz.
   * @returns The modified MapSystemBuilder.
   */
  public withRefreshRate(refreshRate: number): this {
    this.context.refreshRate = refreshRate;
    return this;
  }

  /**
   * Builds the map system and returns a dynamic component that can be used to render
   * the built map system.
   * @returns The compiled map system.
   */
  public build(): CompiledMapSystem {
    const ref = FSComponent.createRef<MapComponent>();
    const compiledMapSystem: CompiledMapSystem = {
      context: this.context,
      ref: ref,
      Map: (props: MapSystemProps): MapComponent => {
        this.context.buildModel();
        this.context.bingId = props.bingId;

        const systemProps: MapSystemComponentProps = {
          model: this.context.model,
          children: this.context.layerFactories.map(f => {
            const vnode = f.factory(this.context);
            this.context.layers.set(f.key, vnode.instance as MapLayer<any>);

            return vnode;
          }),
          class: props.class,
          bus: this.context.bus,
          updateFreq: Subject.create(this.context.refreshRate),
          projectedWidth: this.context.size[0],
          projectedHeight: this.context.size[1],
          projection: this.context.projection,
          ref: ref,
          context: this.context
        };

        this.context.bus.getSubscriber<ClockEvents>().on('realTime').handle(() => this.context.projection.applyQueued());

        ref.instance = new MapSystemComponent(systemProps);
        return ref.instance;
      }
    };

    return compiledMapSystem;
  }

  /**
   * Builds the default map system BingMap layer.
   * @param context The map system context.
   * @returns The built default BingMap layer.
   */
  protected buildDefaultBingLayer(context: MapSystemContext): VNode {
    const colorModule = this.context.model.getModule(MapColorsModule.name) as MapColorsModule;
    const wxrModule = this.context.model.getModule(MapWxrModule.name) as MapWxrModule;

    return (
      <MapBingLayer
        bingId={context.bingId}
        mapProjection={context.projection}
        earthColors={colorModule.colors}
        reference={colorModule.terrainReference}
        model={context.model}
        wxrMode={wxrModule.wxrMode}
        delay={context.delay}
      />
    );
  }

  /**
   * Builds the default waypoint display layers.
   * @param useTargetAsSearchCenter Whether or not to use the map target as the waypoint search center instead
   * of the map center.
   * @returns The built default waypoint display layers.
   */
  protected buildDefaultWaypointLayer(useTargetAsSearchCenter: boolean): any {
    return {
      waypoints: (context: MapSystemContext): VNode => <MapSystemWaypointsLayer bus={context.bus} waypointRenderer={context.waypointRenderer} model={context.model}
        mapProjection={context.projection} iconFactory={context.iconFactory} labelFactory={context.labelFactory} useMapTargetAsSearchCenter={useTargetAsSearchCenter} />,
      labels: (context: MapSystemContext): VNode => <MapCullableTextLayer manager={context.textManager} model={context.model} mapProjection={context.projection} />,
    };
  }
}

/**
 * A component that encompasses the compiled map system.
 */
export class MapSystemComponent extends MapComponent<MapSystemComponentProps> {

  private readonly controllers: any[] = [];

  /** @inheritdoc */
  public onAfterRender(thisNode: VNode): void {
    super.onAfterRender(thisNode);

    const controllers = this.props.context.controllers;
    for (let i = 0; i < controllers.length; i++) {
      this.controllers.push(new controllers[i].factory(...controllers[i].args));
    }
  }

  /** @inheritdoc */
  protected onProjectedSizeChanged(): void {
    this.props.onProjectedSizeChanged && this.props.onProjectedSizeChanged(this);
  }

  /** @inheritdoc */
  public render(): VNode {
    return (
      <div class={this.props.class}>
        {this.props.children}
      </div>
    );
  }
}

/**
 * A class that builds a configuration for the waypoint display.
 */
export class WaypointDisplayBuilder {

  protected roleGroup: string = MapSystemWaypointRoles.Normal;
  protected isCenterTarget = false;
  protected labelCullingEnabled = false;

  /**
   * Creates an instance of the WaypointDisplayBuilder.
   * @param iconFactory The icon factory to use with this builder.
   * @param labelFactory The label factory to use with this builder.
   * @param waypointRenderer The waypoint renderer to use with this builder.
   */
  constructor(protected readonly iconFactory: MapSystemIconFactory, protected readonly labelFactory: MapSystemLabelFactory,
    protected readonly waypointRenderer: MapSystemWaypointsRenderer) { }

  /**
   * Adds a icon configuration to the waypoint display system.
   * @param role The role to add this waypoint display config for.
   * @param type The type of waypoint to add an icon for.
   * @param config The waypoint icon factory to add as a configuration.
   * @returns The modified builder.
   */
  public addIcon<T extends Waypoint>(role: number | string, type: string, config: (waypoint: T) => MapWaypointIcon<T>): this {
    this.iconFactory.addIconFactory<T>(this.determineRoleId(role), type, config);
    return this;
  }

  /**
   * Adds a default icon configuration to the waypoint display system, if no other configuration is found.
   * @param role The role to add this waypoint display config for.
   * @param config The waypoint icon factory to add as a configuration.
   * @returns The modified builder.
   */
  public addDefaultIcon<T extends Waypoint>(role: number | string, config: (waypoint: T) => MapWaypointIcon<T>): this {
    this.iconFactory.addDefaultIconFactory<T>(this.determineRoleId(role), config);
    return this;
  }

  /**
   * Adds a label configuration to the waypoint display system.
   * @param role The role to add this waypoint display config for.
   * @param type The type of waypoint to add an label for.
   * @param config The waypoint label factory to add as a configuration.
   * @returns The modified builder.
   */
  public addLabel<T extends Waypoint>(role: number | string, type: string, config: (waypoint: T) => MapCullableLocationTextLabel): this {
    this.labelFactory.addLabelFactory<T>(this.determineRoleId(role), type, config);
    return this;
  }

  /**
   * Adds a label configuration to the waypoint display system.
   * @param role The role to add this waypoint display config for.
   * @param config The waypoint label factory to add as a configuration.
   * @returns The modified builder.
   */
  public addDefaultLabel<T extends Waypoint>(role: number | string, config: (waypoint: T) => MapCullableLocationTextLabel): this {
    this.labelFactory.addDefaultLabelFactory<T>(this.determineRoleId(role), config);
    return this;
  }

  /**
   * Determines the role ID given either a numeric or string based role.
   * @param role The role to determine.
   * @returns The numeric role ID.
   */
  private determineRoleId(role: number | string): number {
    let roleId = 0;
    if (typeof role === 'string') {
      const roleIdFromName = this.waypointRenderer.getRoleFromName(role);
      if (roleIdFromName !== undefined) {
        roleId = roleIdFromName;
      }
    } else {
      roleId = role;
    }

    return roleId;
  }

  /**
   * Registers a waypoint display role for use with the flight plan rendering
   * system.
   * @param name The name of the role to register.
   * @returns The modified builder.
   */
  public registerRole(name: string): this {
    this.waypointRenderer.addRenderRole(name, undefined, this.roleGroup);

    return this;
  }

  /**
   * Gets the ID of a role in the waypoint display system.
   * @param role The name of the role to get the ID for.
   * @returns The ID of the role.
   * @throws An error if an invalid role name is supplied.
   */
  public getRoleId(role: string): number {
    const roleId = this.waypointRenderer.getRoleFromName(role);
    if (roleId === undefined) {
      throw new Error(`The role with name ${role} was not defined and could not be found.`);
    }

    return roleId;
  }

  /**
   * Configures the center for waypoint searches for this display.
   * @param center If center, then waypoint searches will use the map center. If target,
   * waypoint searches will use the map target with offset.
   * @returns The modified builder.
   */
  public withSearchCenter(center: 'center' | 'target'): this {
    if (center === 'center') {
      this.isCenterTarget = false;
    } else {
      this.isCenterTarget = true;
    }

    return this;
  }

  /**
   * Configures whether or not collision culling of the map's labels is enabled.
   * @param enabled Will cull if true, will not cull if false.
   * @returns The modified builder.
   */
  public withLabelCulling(enabled: true): this {
    this.labelCullingEnabled = enabled;
    return this;
  }

  /**
   * Gets if the waypoint search is using the map target with offset as the search center.
   * @returns True if the search center is the map target, false if it is the map center.
   */
  public getIsCenterTarget(): boolean {
    return this.isCenterTarget;
  }

  /**
   * Gets whether or not collision culling of the map's labels is enabled.
   * @returns True if culling enabled, false otherwise.
   */
  public getCullingEnabled(): boolean {
    return this.labelCullingEnabled;
  }
}

/**
 * A class that builds the configuration for the flight plan display.
 */
export class FlightPlanDisplayBuilder extends WaypointDisplayBuilder {

  protected roleGroup: string = MapSystemWaypointRoles.FlightPlan;

  /**
   * Creates an instance of the WaypointDisplayBuilder.
   * @param iconFactory The icon factory to use with this builder.
   * @param labelFactory The label factory to use with this builder.
   * @param waypointRenderer The waypoint renderer to use with this builder.
   * @param flightPlanRenderer The flight plan renderer to use with this builder.
   * @param planIndex The flight plan index to be displayed by this system.
   */
  constructor(iconFactory: MapSystemIconFactory, labelFactory: MapSystemLabelFactory, waypointRenderer: MapSystemWaypointsRenderer,
    private readonly flightPlanRenderer: MapSystemPlanRenderer, private readonly planIndex: number) {
    super(iconFactory, labelFactory, waypointRenderer);

    this.roleGroup = `${MapSystemWaypointRoles.FlightPlan}_${planIndex}`;
    flightPlanRenderer.legStyleHandlers;
  }

  /**
   * Registers a waypoint display role for use with the flight plan rendering
   * system.
   * @param name The name of the role to register.
   * @returns The modified builder.
   */
  public registerRole(name: string): this {
    this.waypointRenderer.insertRenderRole(name, MapSystemWaypointRoles.Normal, undefined, this.roleGroup);
    return this;
  }

  /**
   * Configures the flight path display to use styles returned by the provided function.
   * @param handler The handler to use to return the required path rendering styles.
   * @returns The modified builder.
   */
  public withLegPathStyles(handler: LegStyleHandler): this {
    this.flightPlanRenderer.legStyleHandlers.set(this.planIndex, handler);
    return this;
  }

  /**
   * Configures the flight plan waypoint display to use the roles returned by the
   * provided function.
   * @param handler The handler to use to return the required waypoint display roles.
   * @returns The modified builder.
   */
  public withLegWaypointRoles(handler: LegWaypointHandler): this {
    this.flightPlanRenderer.legWaypointHandlers.set(this.planIndex, handler);
    return this;
  }
}