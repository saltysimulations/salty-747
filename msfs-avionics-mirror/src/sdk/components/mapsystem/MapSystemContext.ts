import { EventBus } from '../../data';
import { VNode } from '../FSComponent';
import { MapCullableTextLabelManager, MapLayer, MapModel, MapProjection } from '../map';
import { MapSystemPlanRenderer } from './MapSystemPlanRenderer';
import { MapSystemIconFactory, MapSystemLabelFactory, MapSystemWaypointsRenderer } from './MapSystemWaypointsRenderer';
import { MapModule } from './modules/MapModule';

/**
 * A function that creates a map data module.
 */
export type MapModuleConstructor = (mapSystemContext: MapSystemContext) => MapModule;

/**
 * A function that creates a map layer.
 */
export type MapLayerConstructor = (mapSystemContext: MapSystemContext) => VNode;

/**
 * An entry in the map context layer factories collection.
 */
interface MapLayerConstructorEntry {
  /** The string key of the layer. */
  key: string;

  /** The factory that constructs the layer. */
  factory: MapLayerConstructor
}

/**
 * An entry in the map context that defines a controller to construct.
 */
interface MapSystemControllerEntry {
  /** The factory that constructs the controller. */
  factory: new (...args: any) => any;

  /** */
  args: any[];
}

/**
 * A data context for building map systems.
 */
export class MapSystemContext {

  /** The map system data modules currently installed in this context. */
  public readonly moduleFactories = new Map<string, MapModuleConstructor>();

  /** The map layers currently added to this map system. */
  public readonly layerFactories: MapLayerConstructorEntry[] = [];

  /** The built model containing all map data modules after construction. */
  public readonly model = new MapModel<any>();

  /** The built set of registered layers. */
  public readonly layers = new Map<string, MapLayer<any>>();

  /** The controllers to construct after the map has rendered. */
  public readonly controllers: MapSystemControllerEntry[] = [];

  /** The unique BingMap ID to tie this map to. */
  public bingId = 'defaultmap';

  /** The size, in pixels, of this map. */
  public size = new Float64Array([256, 256]);

  /** How long to delay binding the map in ms. Default to 3000. */
  public delay = 3000;

  /** The projection to use with this map system. */
  public readonly projection: MapProjection;

  /** The text manager to use for waypoint label layers. */
  public readonly textManager = new MapCullableTextLabelManager(false);

  /** The waypoint renderer to use to render to waypoint label layers. */
  public readonly waypointRenderer = new MapSystemWaypointsRenderer(this.textManager);

  /** The waypoint icon factory to use to render to waypoint icon layers. */
  public readonly iconFactory = new MapSystemIconFactory();

  /** The waypoint label factory to use to render to waypoint label layers. */
  public readonly labelFactory = new MapSystemLabelFactory();

  /** The flight plan renderer to use to render the flight plan. */
  public readonly planRenderer = new MapSystemPlanRenderer(1);

  /**
   * Creates an instance of a MapSystemContext.
   * @param bus The event bus to use with this instance.
   * @param projection The map projection to use with this instance.
   * @param refreshRate The refresh rate, in Hz, for the map system.
   */
  constructor(public readonly bus: EventBus = new EventBus(), projection?: MapProjection, public refreshRate = 30) {
    if (projection === undefined) {
      this.projection = new MapProjection(this.size[0], this.size[1]);
    } else {
      this.projection = projection;
    }
  }

  /**
   * Builds a map data module model.
   * @throws An error if all required modules were not registered.
   */
  public buildModel(): void {
    const requirements: string[] = [];
    const modules: MapModule[] = [];

    this.moduleFactories.forEach((c, k) => {
      const module = c(this);
      this.model.addModule(k, module);

      modules.push(module);
    });

    modules.forEach(m => requirements.push(...m.requirements()));

    const missingRequirements: string[] = [];
    requirements.forEach(r => {
      if (!this.moduleFactories.has(r)) {
        missingRequirements.push(r);
      }
    });

    if (missingRequirements.length > 0) {
      throw new Error(`Requested map modules (${missingRequirements.join(', ')}) were not found.`);
    }

    modules.forEach(m => {
      m.onInstall();
      m.startSync();
    });
  }

  /**
   * An empty map system context.
   */
  public static Empty = new MapSystemContext();
}

/**
 * A read-only interface into MapSystemContext.
 */
export interface ReadOnlyMapSystemContext {

  /** The built model containing all map data modules after construction. */
  readonly model: MapModel<any>;

  /** The built set of registered layers. */
  readonly layers: Map<string, MapLayer<any>>;

  /** The unique BingMap ID to tie this map to. */
  readonly bingId: string;

  /** The projection to use with this map system. */
  readonly projection: MapProjection;

  /** The text manager to use for waypoint label layers. */
  readonly textManager: MapCullableTextLabelManager;

  /** The waypoint renderer to use to render to waypoint label layers. */
  readonly waypointRenderer: MapSystemWaypointsRenderer;

  /** The waypoint icon factory to use to render to waypoint icon layers. */
  readonly iconFactory: MapSystemIconFactory;

  /** The waypoint label factory to use to render to waypoint label layers. */
  readonly labelFactory: MapSystemLabelFactory;

  /** The flight plan renderer to use to render the flight plan. */
  readonly planRenderer: MapSystemPlanRenderer;

  /** The event bus that is connected to the map systems. */
  readonly bus: EventBus;
}