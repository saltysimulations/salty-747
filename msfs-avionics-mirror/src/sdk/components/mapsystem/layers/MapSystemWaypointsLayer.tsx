import { FacilitySearchType, FacilityWaypoint, Waypoint, WaypointTypes } from '../../../navigation';
import { UnitType } from '../../../math';
import { FSComponent, VNode } from '../../FSComponent';
import { MapAbstractNearestWaypointsLayer, MapAbstractNearestWaypointsLayerProps, MapSyncedCanvasLayer } from '../../map';
import { MapSystemIconFactory, MapSystemLabelFactory, MapSystemWaypointsRenderer } from '../MapSystemWaypointsRenderer';
import { MapWaypointDisplayModule } from '../modules/MapWaypointDisplayModule';
import { MapSystemWaypointRoles } from '../MapSystemWaypointRoles';

/**
 * Props on the MapSystemWaypointsLayer component.
 */
export interface MapSystemWaypointsLayerProps extends MapAbstractNearestWaypointsLayerProps<any, MapSystemWaypointsRenderer> {
  /** The icon factory to use with this component. */
  iconFactory: MapSystemIconFactory;

  /** The label factory to use with this component. */
  labelFactory: MapSystemLabelFactory;
}

/**
 * A class that renders waypoints into a layer.
 */
export class MapSystemWaypointsLayer extends MapAbstractNearestWaypointsLayer<any, MapSystemWaypointsRenderer, MapSystemWaypointsLayerProps> {
  protected readonly canvasLayer = FSComponent.createRef<MapSyncedCanvasLayer>();
  protected readonly displayModule = this.props.model.getModule(MapWaypointDisplayModule.name) as MapWaypointDisplayModule;

  protected currentRole: number | undefined;

  /** @inheritdoc */
  public onAttached(): void {
    this.canvasLayer.instance.onAttached();
    this.initEventHandlers();
    super.onAttached();
  }

  /** @inheritdoc */
  public onUpdated(time: number, elapsed: number): void {
    if (this.isVisible()) {
      super.onUpdated(time, elapsed);
      this.props.waypointRenderer.update(this.props.mapProjection);
    }

    this.canvasLayer.instance.onUpdated(time, elapsed);
  }

  /** @inheritdoc */
  protected initEventHandlers(): void {
    this.displayModule.numAirports.sub(num => this.searchItemLimits[FacilitySearchType.Airport] = num, true);
    this.displayModule.numIntersections.sub(num => this.searchItemLimits[FacilitySearchType.Intersection] = num, true);
    this.displayModule.numVors.sub(num => this.searchItemLimits[FacilitySearchType.Vor] = num, true);
    this.displayModule.numNdbs.sub(num => this.searchItemLimits[FacilitySearchType.Ndb] = num, true);

    this.displayModule.airportsRange.sub(num => this.searchRadiusLimits[FacilitySearchType.Airport] = num.asUnit(UnitType.GA_RADIAN), true);
    this.displayModule.intersectionsRange.sub(num => this.searchRadiusLimits[FacilitySearchType.Intersection] = num.asUnit(UnitType.GA_RADIAN), true);
    this.displayModule.vorsRange.sub(num => this.searchRadiusLimits[FacilitySearchType.Vor] = num.asUnit(UnitType.GA_RADIAN), true);
    this.displayModule.ndbsRange.sub(num => this.searchRadiusLimits[FacilitySearchType.Ndb] = num.asUnit(UnitType.GA_RADIAN), true);

    this.props.waypointRenderer.onRolesAdded.on(() => this.initWaypointRenderer());
  }

  /** @inheritdoc */
  protected initWaypointRenderer(): void {
    let hasDefaultId = false;

    const groupRoles = this.props.waypointRenderer.getRoleNamesByGroup(MapSystemWaypointRoles.Normal);
    groupRoles.forEach(id => {
      const roleId = this.props.waypointRenderer.getRoleFromName(id);
      if (roleId !== undefined) {
        this.props.waypointRenderer.setCanvasContext(roleId, this.canvasLayer.instance.display.context);
        this.props.waypointRenderer.setIconFactory(roleId, this.props.iconFactory);
        this.props.waypointRenderer.setLabelFactory(roleId, this.props.labelFactory);
        this.props.waypointRenderer.setVisibilityHandler(roleId, this.isWaypointVisible.bind(this));

        if (!hasDefaultId) {
          this.defaultRenderRole = roleId;
          hasDefaultId = true;
        }
      }
    });
  }

  /** @inheritdoc */
  public setVisible(val: boolean): void {
    super.setVisible(val);
    this.canvasLayer.instance.setVisible(val);
  }

  /**
   * Checks to see if a waypoint should be visible.
   * @param waypoint The waypoint to check.
   * @returns True if visible, false otherwise.
   */
  protected isWaypointVisible(waypoint: Waypoint): boolean {
    if (waypoint instanceof FacilityWaypoint) {
      switch (waypoint.type) {
        case WaypointTypes.Airport:
          return this.displayModule.showAirports.get()(waypoint);
        case WaypointTypes.Intersection:
          return this.displayModule.showIntersections.get()(waypoint);
        case WaypointTypes.VOR:
          return this.displayModule.showVors.get()(waypoint);
        case WaypointTypes.NDB:
          return this.displayModule.showNdbs.get()(waypoint);
      }
    }

    return false;
  }

  /** @inheritdoc */
  public render(): VNode {
    return (
      <MapSyncedCanvasLayer ref={this.canvasLayer} model={this.props.model} mapProjection={this.props.mapProjection} />
    );
  }
}

