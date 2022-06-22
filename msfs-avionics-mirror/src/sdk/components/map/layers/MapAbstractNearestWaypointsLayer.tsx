import { BitFlags, GeoPoint, GeoPointInterface, GeoPointReadOnly, LatLonInterface, UnitType, Vec2Math } from '../../..';
import { EventBus } from '../../../data';
import {
  ICAO, NearestSearchResults, FacilitySearchType, FacilityLoader, NearestAirportSearchSession,
  NearestIntersectionSearchSession, NearestSearchSession, NearestVorSearchSession, FacilityRepository, Facility, FacilityWaypointCache
} from '../../../navigation';
import { MapWaypointRenderer } from '../MapWaypointRenderer';
import { MapLayer, MapLayerProps } from '../MapLayer';
import { MapProjection, MapProjectionChangeType } from '../MapProjection';

/**
 * Facility search types supported by MapAbstractNearestWaypointsLayer.
 */
export type MapAbstractNearestWaypointsLayerSearchTypes
  = FacilitySearchType.Airport
  | FacilitySearchType.Vor
  | FacilitySearchType.Ndb
  | FacilitySearchType.Intersection;

/**
 * Component props for MapAbstractNearestWaypointsLayer.
 */
export interface MapAbstractNearestWaypointsLayerProps<M, R extends MapWaypointRenderer<any> = MapWaypointRenderer<any>>
  extends MapLayerProps<M> {

  /** The event bus. */
  bus: EventBus;

  /** The waypoint renderer to use. */
  waypointRenderer: R;

  /**
   * Whether to search using the map target as the center of the search. By
   * default the layer uses the map center and not the map target (which includes the offset).
   */
  useMapTargetAsSearchCenter?: boolean;
}

/**
 * An abstract implementation of a map layer which displays waypoints (airports, navaids, and intersections) within a
 * search radius.
 */
export abstract class MapAbstractNearestWaypointsLayer
  <
  M,
  R extends MapWaypointRenderer<any> = MapWaypointRenderer<any>,
  P extends MapAbstractNearestWaypointsLayerProps<M, R> = MapAbstractNearestWaypointsLayerProps<M, R>
  >
  extends MapLayer<P> {

  public static readonly SEARCH_RADIUS_OVERDRAW_FACTOR = Math.SQRT2;
  protected readonly searchItemLimits = {
    [FacilitySearchType.Airport]: 500,
    [FacilitySearchType.Vor]: 250,
    [FacilitySearchType.Ndb]: 250,
    [FacilitySearchType.Intersection]: 500
  };

  protected readonly searchRadiusLimits = {
    [FacilitySearchType.Airport]: Number.POSITIVE_INFINITY,
    [FacilitySearchType.Vor]: Number.POSITIVE_INFINITY,
    [FacilitySearchType.Ndb]: Number.POSITIVE_INFINITY,
    [FacilitySearchType.Intersection]: Number.POSITIVE_INFINITY
  };

  protected readonly defaultSearchDebounceDelay = 500;

  protected readonly facLoader = new FacilityLoader(FacilityRepository.getRepository(this.props.bus), this.onFacilityLoaderInitialized.bind(this));
  protected readonly facWaypointCache = FacilityWaypointCache.getCache();

  protected facilitySearches?: {
    /** A nearest airport search session. */
    [FacilitySearchType.Airport]: MapAbstractNearestWaypointsLayerSearch,
    /** A nearest VOR search session. */
    [FacilitySearchType.Vor]: MapAbstractNearestWaypointsLayerSearch,
    /** A nearest NDB search session. */
    [FacilitySearchType.Ndb]: MapAbstractNearestWaypointsLayerSearch,
    /** A nearest intersection search session. */
    [FacilitySearchType.Intersection]: MapAbstractNearestWaypointsLayerSearch
  };

  protected searchRadius = 0;
  protected searchMargin = 0;
  protected defaultRenderRole = 1;

  protected readonly icaosToShow = new Set<string>();

  protected isInit = false;

  /**
   * A callback called when the facility loaded finishes initialization.
   */
  private onFacilityLoaderInitialized(): void {
    Promise.all([
      this.facLoader.startNearestSearchSession(FacilitySearchType.Airport),
      this.facLoader.startNearestSearchSession(FacilitySearchType.Vor),
      this.facLoader.startNearestSearchSession(FacilitySearchType.Ndb),
      this.facLoader.startNearestSearchSession(FacilitySearchType.Intersection)
    ]).then((value: [
      NearestAirportSearchSession,
      NearestVorSearchSession,
      NearestSearchSession<string, string>,
      NearestIntersectionSearchSession
    ]) => {
      const [airportSession, vorSession, ndbSession, intSession] = value;
      const callback = this.processSearchResults.bind(this);
      this.facilitySearches = {
        [FacilitySearchType.Airport]: new MapAbstractNearestWaypointsLayerSearch(airportSession, callback),
        [FacilitySearchType.Vor]: new MapAbstractNearestWaypointsLayerSearch(vorSession, callback),
        [FacilitySearchType.Ndb]: new MapAbstractNearestWaypointsLayerSearch(ndbSession, callback),
        [FacilitySearchType.Intersection]: new MapAbstractNearestWaypointsLayerSearch(intSession, callback)
      };

      if (this.isInit) {
        this.tryRefreshAllSearches(this.getSearchCenter(), this.searchRadius);
      }
    });
  }

  /** @inheritdoc */
  public onAttached(): void {
    super.onAttached();
    this.isInit = false;
    this.doInit();
    this.isInit = true;
    this.tryRefreshAllSearches(this.getSearchCenter(), this.searchRadius);
  }

  /**
   * Initializes this layer.
   */
  protected doInit(): void {
    this.initWaypointRenderer();
    this.updateSearchRadius();
  }

  /**
   * Gets the search center for the waypoint searches on this layer.
   * @returns The waypoint search center geo point.
   */
  protected getSearchCenter(): GeoPointReadOnly {
    return this.props.useMapTargetAsSearchCenter ? this.props.mapProjection.getTarget() : this.props.mapProjection.getCenter();
  }

  /**
   * Initializes this layer's waypoint renderer.
   */
  protected abstract initWaypointRenderer(): void;

  /** @inheritdoc */
  public onMapProjectionChanged(mapProjection: MapProjection, changeFlags: number): void {
    super.onMapProjectionChanged(mapProjection, changeFlags);

    if (BitFlags.isAny(changeFlags, MapProjectionChangeType.Range | MapProjectionChangeType.RangeEndpoints | MapProjectionChangeType.ProjectedSize)) {
      this.updateSearchRadius();
      this.tryRefreshAllSearches(this.getSearchCenter(), this.searchRadius);
    } else if (BitFlags.isAll(changeFlags, MapProjectionChangeType.Center)) {
      this.tryRefreshAllSearches(this.getSearchCenter(), this.searchRadius);
    }
  }

  /**
   * Updates the desired nearest facility search radius based on the current map projection.
   */
  protected updateSearchRadius(): void {
    const mapHalfDiagRange = Vec2Math.abs(this.props.mapProjection.getProjectedSize()) * this.props.mapProjection.getProjectedResolution() / 2;
    this.searchRadius = mapHalfDiagRange * MapAbstractNearestWaypointsLayer.SEARCH_RADIUS_OVERDRAW_FACTOR;
    this.searchMargin = mapHalfDiagRange * (MapAbstractNearestWaypointsLayer.SEARCH_RADIUS_OVERDRAW_FACTOR - 1);
  }

  /** @inheritdoc */
  public onUpdated(time: number, elapsed: number): void {
    this.updateSearches(elapsed);
  }

  /**
   * Updates this layer's facility searches.
   * @param elapsed The elapsed time, in milliseconds, since the last update.
   */
  protected updateSearches(elapsed: number): void {
    if (!this.facilitySearches) {
      return;
    }

    this.facilitySearches[FacilitySearchType.Airport].update(elapsed);
    this.facilitySearches[FacilitySearchType.Vor].update(elapsed);
    this.facilitySearches[FacilitySearchType.Ndb].update(elapsed);
    this.facilitySearches[FacilitySearchType.Intersection].update(elapsed);
  }

  /**
   * Attempts to refresh all of the nearest facility searches.
   * @param center The center of the search area.
   * @param radius The radius of the search area, in great-arc radians.
   */
  protected tryRefreshAllSearches(center: GeoPointInterface, radius: number): void {
    this.tryRefreshSearch(FacilitySearchType.Airport, center, radius);
    this.tryRefreshSearch(FacilitySearchType.Vor, center, radius);
    this.tryRefreshSearch(FacilitySearchType.Ndb, center, radius);
    this.tryRefreshSearch(FacilitySearchType.Intersection, center, radius);
  }

  /**
   * Attempts to refresh a nearest search. The search will only be refreshed if `this.shouldRefreshSearch()` returns
   * true and and the desired search radius is different from the last refreshed search radius or the desired search
   * center is outside of the margin of the last refreshed search center.
   * @param type The type of nearest search to refresh.
   * @param center The center of the search area.
   * @param radius The radius of the search area, in great-arc radians.
   */
  protected tryRefreshSearch(type: MapAbstractNearestWaypointsLayerSearchTypes, center: GeoPointInterface, radius: number): void {
    const search = this.facilitySearches && this.facilitySearches[type];

    if (!search || !this.shouldRefreshSearch(type, center, radius)) {
      return;
    }

    if (search.lastRadius !== radius || search.lastCenter.distance(center) >= this.searchMargin) {
      this.scheduleSearchRefresh(type, search, center, radius);
    }
  }

  /**
   * Checks whether one of this layer's searches should be refreshed.
   * @param type The type of nearest search to refresh.
   * @param center The center of the search area.
   * @param radius The radius of the search area, in great-arc radians.
   * @returns Whether the search should be refreshed.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected shouldRefreshSearch(type: MapAbstractNearestWaypointsLayerSearchTypes, center: GeoPointInterface, radius: number): boolean {
    return true;
  }

  /**
   * Schedules a refresh of this one of this layer's searches.
   * @param type The type of nearest search to refresh.
   * @param search The search to refresh.
   * @param center The center of the search area.
   * @param radius The radius of the search area, in great-arc radians.
   */
  protected scheduleSearchRefresh(
    type: MapAbstractNearestWaypointsLayerSearchTypes,
    search: MapAbstractNearestWaypointsLayerSearch,
    center: GeoPointInterface,
    radius: number
  ): void {
    let itemLimit = this.searchItemLimits[type];
    let radiusLimit = this.searchRadiusLimits[type];

    if (radiusLimit === undefined || (radiusLimit !== undefined && !isFinite(radiusLimit))) {
      radiusLimit = radius;
    }

    radiusLimit = radiusLimit < radius ? radiusLimit : radius;

    if (itemLimit === undefined) {
      itemLimit = 40;
    }

    search.scheduleRefresh(center, radiusLimit, itemLimit, this.defaultSearchDebounceDelay);
  }

  /**
   * Processes nearest facility search results. New facilities are registered, while removed facilities are
   * deregistered.
   * @param results Nearest facility search results.
   */
  protected processSearchResults(results: NearestSearchResults<string, string> | undefined): void {
    if (!results) {
      return;
    }

    const numAdded = results.added.length;
    for (let i = 0; i < numAdded; i++) {
      const icao = results.added[i];
      if (icao === undefined || icao === ICAO.emptyIcao) {
        continue;
      }

      this.registerIcao(icao);
    }

    const numRemoved = results.removed.length;
    for (let i = 0; i < numRemoved; i++) {
      const icao = results.removed[i];
      if (icao === undefined || icao === ICAO.emptyIcao) {
        continue;
      }

      this.deregisterIcao(icao);
    }
  }

  /**
   * Registers an ICAO string with this layer. Once an ICAO is registered, its corresponding facility is drawn to this
   * layer using a waypoint renderer.
   * @param icao The ICAO string to register.
   */
  protected registerIcao(icao: string): void {
    this.icaosToShow.add(icao);
    this.facLoader.getFacility(ICAO.getFacilityType(icao), icao).then(facility => {
      if (!this.icaosToShow.has(icao)) {
        return;
      }

      this.registerWaypointWithRenderer(this.props.waypointRenderer, facility);
    });
  }

  /**
   * Registers a facility with this layer's waypoint renderer.
   * @param renderer This layer's waypoint renderer.
   * @param facility The facility to register.
   */
  protected registerWaypointWithRenderer(renderer: R, facility: Facility): void {
    const waypoint = this.facWaypointCache.get(facility);
    renderer.register(waypoint, this.defaultRenderRole, 'waypoints-layer');
  }

  /**
   * Deregisters an ICAO string from this layer.
   * @param icao The ICAO string to deregister.
   */
  protected deregisterIcao(icao: string): void {
    this.icaosToShow.delete(icao);
    this.facLoader.getFacility(ICAO.getFacilityType(icao), icao).then(facility => {
      if (this.icaosToShow.has(icao)) {
        return;
      }

      this.deregisterWaypointWithRenderer(this.props.waypointRenderer, facility);
    });
  }

  /**
   * Deregisters a facility from this layer's waypoint renderer.
   * @param renderer This layer's waypoint renderer.
   * @param facility The facility to deregister.
   */
  protected deregisterWaypointWithRenderer(renderer: R, facility: Facility): void {
    const waypoint = this.facWaypointCache.get(facility);
    renderer.deregister(waypoint, this.defaultRenderRole, 'waypoints-layer');
  }
}

/**
 * A nearest facility search for MapAbstractNearestWaypointsLayer.
 */
export class MapAbstractNearestWaypointsLayerSearch {
  private readonly _lastCenter = new GeoPoint(0, 0);
  private _lastRadius = 0;

  private maxItemCount = 0;

  private refreshDebounceTimer = 0;
  private isRefreshScheduled = false;

  // eslint-disable-next-line jsdoc/require-returns
  /**
   * The center of this search's last refresh.
   */
  public get lastCenter(): GeoPointReadOnly {
    return this._lastCenter.readonly;
  }

  // eslint-disable-next-line jsdoc/require-returns
  /**
   * The radius of this search's last refresh, in great-arc radians.
   */
  public get lastRadius(): number {
    return this._lastRadius;
  }

  /**
   * Constructor.
   * @param session The session used by this search.
   * @param refreshCallback A callback which is called every time the search refreshes.
   */
  constructor(
    private readonly session: NearestSearchSession<string, string>,
    private readonly refreshCallback: (results: NearestSearchResults<string, string>) => void
  ) {
  }

  /**
   * Schedules a refresh of this search.  If a refresh was previously scheduled but not yet executed, this new
   * scheduled refresh will replace the old one.
   * @param center The center of the search area.
   * @param radius The radius of the search area, in great-arc radians.
   * @param maxItemCount The maximum number of results returned by the refresh.
   * @param delay The delay, in milliseconds, before the refresh is executed.
   */
  public scheduleRefresh(center: LatLonInterface, radius: number, maxItemCount: number, delay: number): void {
    this._lastCenter.set(center);
    this._lastRadius = radius;
    this.maxItemCount = maxItemCount;

    this.refreshDebounceTimer = delay;
    this.isRefreshScheduled = true;
  }

  /**
   * Updates this search. Executes any pending refreshes if their delay timers have expired.
   * @param elapsed The elapsed time, in milliseconds, since the last update.
   */
  public update(elapsed: number): void {
    if (!this.isRefreshScheduled) {
      return;
    }

    this.refreshDebounceTimer = Math.max(0, this.refreshDebounceTimer - elapsed);
    if (this.refreshDebounceTimer === 0) {
      this.refresh();
      this.isRefreshScheduled = false;
    }
  }

  /**
   * Refreshes this search.
   * @returns a Promise which is fulfilled when the refresh completes.
   */
  private async refresh(): Promise<void> {
    const results = await this.session.searchNearest(
      this._lastCenter.lat,
      this._lastCenter.lon,
      UnitType.GA_RADIAN.convertTo(this._lastRadius, UnitType.METER),
      this.maxItemCount
    );

    this.refreshCallback(results);
  }
}