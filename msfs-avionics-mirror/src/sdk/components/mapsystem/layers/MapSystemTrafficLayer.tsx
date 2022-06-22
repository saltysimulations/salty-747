import { EventBus } from '../../../data';
import { GeoPoint, GeoPointInterface } from '../../../geo';
import { BitFlags, NumberUnitInterface, ReadonlyFloat64Array, UnitFamily, UnitType } from '../../../math';
import { TCASAlertLevel, TCASEvents, TCASIntruder, TCASOperatingMode } from '../../../traffic';
import { FSComponent, VNode } from '../../FSComponent';
import { MapLayer, MapLayerProps, MapProjection, MapProjectionChangeType, MapSyncedCanvasLayer } from '../../map';
import { MapOwnshipModule } from '../modules/MapOwnshipModule';
import { MapTrafficAlertLevelVisibility, MapTrafficModule } from '../modules/MapTrafficModule';

/**
 * A map icon for a TCAS intruder.
 */
export interface MapTrafficIntruderIcon {
  /** This icon's associated intruder. */
  readonly intruder: TCASIntruder;

  /**
   * Draws this icon.
   * @param projection The map projection.
   * @param context The canvas rendering context to which to draw.
   * @param offScaleRange The distance from the own airplane to this icon's intruder beyond which the intruder is
   * considered off-scale. If the value is `NaN`, the intruder is never considered off-scale.
   */
  draw(projection: MapProjection, context: CanvasRenderingContext2D, offScaleRange: NumberUnitInterface<UnitFamily.Distance>): void;
}

/**
 * A function which creates map icons for TCAS intruders.
 * @param intruder The intruder for which to create an icon.
 * @param trafficModule The traffic module of the new icon's parent map.
 * @param ownshipModule The ownship module of the new icon's parent map.
 */
export type MapTrafficIntruderIconFactory = (intruder: TCASIntruder, trafficModule: MapTrafficModule, ownshipModule: MapOwnshipModule) => MapTrafficIntruderIcon;

/**
 * Component props for MapTrafficIntruderLayer.
 */
export interface MapTrafficIntruderLayerProps extends MapLayerProps<any> {
  /** The event bus. */
  bus: EventBus;

  /** A function which creates icons for intruders. */
  iconFactory: MapTrafficIntruderIconFactory;

  /**
   * A function which initializes global canvas styles for the layer.
   * @param context The canvas rendering context for which to initialize styles.
   */
  initCanvasStyles?: (context: CanvasRenderingContext2D) => void;
}

/**
 * A map layer which displays traffic intruders.
 */
export class MapSystemTrafficLayer extends MapLayer<MapTrafficIntruderLayerProps> {
  private readonly iconLayerRef = FSComponent.createRef<MapSyncedCanvasLayer<any>>();

  private readonly trafficModule = this.props.model.getModule(MapTrafficModule.name) as MapTrafficModule;
  private readonly ownshipModule = this.props.model.getModule(MapOwnshipModule.name) as MapOwnshipModule;

  private readonly intruderViews = {
    [TCASAlertLevel.None]: new Map<TCASIntruder, MapTrafficIntruderIcon>(),
    [TCASAlertLevel.ProximityAdvisory]: new Map<TCASIntruder, MapTrafficIntruderIcon>(),
    [TCASAlertLevel.TrafficAdvisory]: new Map<TCASIntruder, MapTrafficIntruderIcon>(),
    [TCASAlertLevel.ResolutionAdvisory]: new Map<TCASIntruder, MapTrafficIntruderIcon>()
  };

  private isInit = false;

  /** @inheritdoc */
  public onVisibilityChanged(isVisible: boolean): void {
    if (!isVisible) {
      if (this.isInit) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.iconLayerRef.instance.display!.clear();
      }
    }
  }

  /** @inheritdoc */
  public onAttached(): void {
    this.iconLayerRef.instance.onAttached();

    this.trafficModule.operatingMode.sub(this.updateVisibility.bind(this));
    this.trafficModule.show.sub(this.updateVisibility.bind(this), true);
    this.initCanvasStyles();
    this.initIntruders();
    this.initTCASHandlers();

    this.isInit = true;
  }

  /**
   * Initializes canvas styles.
   */
  private initCanvasStyles(): void {
    this.props.initCanvasStyles && this.props.initCanvasStyles(this.iconLayerRef.instance.display.context);
  }

  /**
   * Initializes all currently existing TCAS intruders.
   */
  private initIntruders(): void {
    const intruders = this.trafficModule.tcas.getIntruders();
    const len = intruders.length;
    for (let i = 0; i < len; i++) {
      this.onIntruderAdded(intruders[i]);
    }
  }

  /**
   * Initializes handlers to respond to TCAS events.
   */
  private initTCASHandlers(): void {
    const tcasSub = this.props.bus.getSubscriber<TCASEvents>();

    tcasSub.on('tcas_intruder_added').handle(this.onIntruderAdded.bind(this));
    tcasSub.on('tcas_intruder_removed').handle(this.onIntruderRemoved.bind(this));
    tcasSub.on('tcas_intruder_alert_changed').handle(this.onIntruderAlertLevelChanged.bind(this));
  }

  /** @inheritdoc */
  public onMapProjectionChanged(mapProjection: MapProjection, changeFlags: number): void {
    this.iconLayerRef.instance.onMapProjectionChanged(mapProjection, changeFlags);

    if (BitFlags.isAll(changeFlags, MapProjectionChangeType.ProjectedSize)) {
      this.initCanvasStyles();
    }
  }

  /** @inheritdoc */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onUpdated(time: number, elapsed: number): void {
    if (!this.isVisible()) {
      return;
    }

    this.redrawIntruders();
  }

  /**
   * Redraws all tracked intruders.
   */
  private redrawIntruders(): void {
    const alertLevelVisFlags = this.trafficModule.alertLevelVisibility.get();
    const offScaleRange = this.trafficModule.offScaleRange.get();

    const iconDisplay = this.iconLayerRef.instance.display;
    iconDisplay.clear();

    if (BitFlags.isAll(alertLevelVisFlags, MapTrafficAlertLevelVisibility.Other)) {
      this.intruderViews[TCASAlertLevel.None].forEach(view => {
        view.draw(this.props.mapProjection, iconDisplay.context, offScaleRange);
      });
    }
    if (BitFlags.isAll(alertLevelVisFlags, MapTrafficAlertLevelVisibility.ProximityAdvisory)) {
      this.intruderViews[TCASAlertLevel.ProximityAdvisory].forEach(view => {
        view.draw(this.props.mapProjection, iconDisplay.context, offScaleRange);
      });
    }
    if (BitFlags.isAll(alertLevelVisFlags, MapTrafficAlertLevelVisibility.TrafficAdvisory)) {
      this.intruderViews[TCASAlertLevel.TrafficAdvisory].forEach(view => {
        view.draw(this.props.mapProjection, iconDisplay.context, offScaleRange);
      });
    }
    if (BitFlags.isAll(alertLevelVisFlags, MapTrafficAlertLevelVisibility.ResolutionAdvisory)) {
      this.intruderViews[TCASAlertLevel.ResolutionAdvisory].forEach(view => {
        view.draw(this.props.mapProjection, iconDisplay.context, offScaleRange);
      });
    }
  }

  /**
   * Updates this layer's visibility.
   */
  private updateVisibility(): void {
    this.setVisible(this.trafficModule.tcas.getOperatingMode() !== TCASOperatingMode.Standby && this.trafficModule.show.get());
  }

  /**
   * A callback which is called when a TCAS intruder is added.
   * @param intruder The new intruder.
   */
  private onIntruderAdded(intruder: TCASIntruder): void {
    const icon = this.props.iconFactory(intruder, this.trafficModule, this.ownshipModule);
    this.intruderViews[intruder.alertLevel.get()].set(intruder, icon);
  }

  /**
   * A callback which is called when a TCAS intruder is removed.
   * @param intruder The removed intruder.
   */
  private onIntruderRemoved(intruder: TCASIntruder): void {
    this.intruderViews[intruder.alertLevel.get()].delete(intruder);
  }

  /**
   * A callback which is called when the alert level of a TCAS intruder is changed.
   * @param intruder The intruder.
   */
  private onIntruderAlertLevelChanged(intruder: TCASIntruder): void {
    let oldAlertLevel;
    let view = this.intruderViews[oldAlertLevel = TCASAlertLevel.None].get(intruder);
    view ??= this.intruderViews[oldAlertLevel = TCASAlertLevel.ProximityAdvisory].get(intruder);
    view ??= this.intruderViews[oldAlertLevel = TCASAlertLevel.TrafficAdvisory].get(intruder);
    view ??= this.intruderViews[oldAlertLevel = TCASAlertLevel.ResolutionAdvisory].get(intruder);

    if (view) {
      this.intruderViews[oldAlertLevel].delete(intruder);
      this.intruderViews[intruder.alertLevel.get()].set(intruder, view);
    }
  }

  /** @inheritdoc */
  public render(): VNode {
    return (
      <MapSyncedCanvasLayer ref={this.iconLayerRef} model={this.props.model} mapProjection={this.props.mapProjection} />
    );
  }
}

/**
 *
 */
export abstract class AbstractMapTrafficIntruderIcon implements MapTrafficIntruderIcon {
  private static readonly geoPointCache = [new GeoPoint(0, 0)];

  private readonly projectedPos = new Float64Array(2);

  private isOffScale = false;

  /**
   * Constructor.
   * @param intruder This icon's associated intruder.
   * @param trafficModule The traffic module for this icon's parent map.
   * @param ownshipModule The ownship module for this icon's parent map.
   */
  constructor(
    public readonly intruder: TCASIntruder,
    protected readonly trafficModule: MapTrafficModule,
    protected readonly ownshipModule: MapOwnshipModule
  ) { }

  /**
   * Draws this icon.
   * @param projection The map projection.
   * @param context The canvas rendering context to which to draw this icon.
   * @param offScaleRange The distance from the own airplane to this icon's intruder beyond which the intruder is
   * considered off-scale. If the value is `NaN`, the intruder is never considered off-scale.
   */
  public draw(projection: MapProjection, context: CanvasRenderingContext2D, offScaleRange: NumberUnitInterface<UnitFamily.Distance>): void {
    this.updatePosition(projection, offScaleRange);
    this.drawIcon(projection, context, this.projectedPos, this.isOffScale);
  }

  /**
   * Updates this icon's intruder's projected position and off-scale status.
   * @param projection The map projection.
   * @param offScaleRange The distance from the own airplane to this icon's intruder beyond which the intruder is
   * considered off-scale. If the value is `NaN`, the intruder is never considered off-scale.
   */
  protected updatePosition(projection: MapProjection, offScaleRange: NumberUnitInterface<UnitFamily.Distance>): void {
    const ownAirplanePos = this.ownshipModule.position.get();
    if (offScaleRange.isNaN()) {
      projection.project(this.intruder.position, this.projectedPos);
      this.isOffScale = false;
    } else {
      this.handleOffScaleRange(projection, ownAirplanePos, offScaleRange);
    }
  }

  /**
   * Updates this icon's intruder's projected position and off-scale status using a specific range from the own
   * airplane to define off-scale.
   * @param projection The map projection.
   * @param ownAirplanePos The position of the own airplane.
   * @param offScaleRange The distance from the own airplane to this icon's intruder beyond which the intruder is
   * considered off-scale.
   */
  protected handleOffScaleRange(projection: MapProjection, ownAirplanePos: GeoPointInterface, offScaleRange: NumberUnitInterface<UnitFamily.Distance>): void {
    const intruderPos = this.intruder.position;
    const horizontalSeparation = intruderPos.distance(ownAirplanePos);
    const offscaleRangeRad = offScaleRange.asUnit(UnitType.GA_RADIAN);
    if (horizontalSeparation > offscaleRangeRad) {
      this.isOffScale = true;
      projection.project(ownAirplanePos.offset(ownAirplanePos.bearingTo(intruderPos), offscaleRangeRad, AbstractMapTrafficIntruderIcon.geoPointCache[0]), this.projectedPos);
    } else {
      this.isOffScale = false;
      projection.project(intruderPos, this.projectedPos);
    }
  }

  /**
   * Draws this icon.
   * @param projection The map projection.
   * @param context The canvas rendering context to which to draw this icon.
   * @param projectedPos The projected position of this icon's intruder.
   * @param isOffScale Whether this icon's intruder is off-scale.
   */
  protected abstract drawIcon(
    projection: MapProjection,
    context: CanvasRenderingContext2D,
    projectedPos: ReadonlyFloat64Array,
    isOffScale: boolean
  ): void;
}