import { AirportFacility, Facility, FacilityWaypoint, IntersectionFacility, NdbFacility, VorFacility } from '../../../navigation';
import { NumberUnitSubject, UnitType } from '../../../math';
import { Subject } from '../../../sub/Subject';
import { AbstractMapModule } from './AbstractMapModule';

/**
 * A handler to determine waypoint visibility.
 */
type WaypointVisibilityHandler<T extends Facility> = (w: FacilityWaypoint<T>) => boolean;

/**
 * A map data module that controls waypoint display options.
 */
export class MapWaypointDisplayModule extends AbstractMapModule {

  /** A handler that dictates airport waypoint visibility. */
  public showAirports = Subject.create<WaypointVisibilityHandler<AirportFacility>>(() => true);

  /** A handler that dictates intersection waypoint visibility. */
  public showIntersections = Subject.create<WaypointVisibilityHandler<IntersectionFacility>>(() => false);

  /** A handler that dictates NDB waypoint visibility. */
  public showNdbs = Subject.create<WaypointVisibilityHandler<NdbFacility>>(() => true);

  /** A handler that dictates VOR waypoint visibility. */
  public showVors = Subject.create<WaypointVisibilityHandler<VorFacility>>(() => true);

  /** The maximum range at which airport waypoints should be searched for. */
  public airportsRange = NumberUnitSubject.createFromNumberUnit(UnitType.NMILE.createNumber(50));

  /** The maximum range at which intersection waypoints should be searched for. */
  public intersectionsRange = NumberUnitSubject.createFromNumberUnit(UnitType.NMILE.createNumber(50));

  /** The maximum range at which NDB waypoints should be searched for. */
  public ndbsRange = NumberUnitSubject.createFromNumberUnit(UnitType.NMILE.createNumber(500));

  /** The maximum range at which VOR waypoints should be searched for. */
  public vorsRange = NumberUnitSubject.createFromNumberUnit(UnitType.NMILE.createNumber(500));

  /** The maximum number of airports that should be displayed. */
  public numAirports = Subject.create(40);

  /** The maximum number of intersections that should be displayed. */
  public numIntersections = Subject.create(40);

  /** The maximum number of NDBs that should be displayed. */
  public numNdbs = Subject.create(40);

  /** The maximum number of VORs that should be displayed. */
  public numVors = Subject.create(40);
}