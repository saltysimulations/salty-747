import { SegmentType, FlightPlanSegment } from './FlightPlanSegment';
import { ProcedureDetails } from './ProcedureDetails';
import { DirectTo } from './DirectTo';
/**
 * A flight plan managed by the FlightPlanManager.
 */
export declare class ManagedFlightPlan {
    /** Whether or not the flight plan has an origin airfield. */
    originAirfield?: WayPoint;
    /** Whether or not the flight plan has a destination airfield. */
    destinationAirfield?: WayPoint;
    /** The cruise altitude for this flight plan. */
    cruiseAltitude: number;
    /** The index of the currently active waypoint. */
    activeWaypointIndex: number;
    /** The details for selected procedures on this flight plan. */
    procedureDetails: ProcedureDetails;
    /** The details of any direct-to procedures on this flight plan. */
    directTo: DirectTo;
    /** The departure segment of the flight plan. */
    get departure(): FlightPlanSegment;
    /** The enroute segment of the flight plan. */
    get enroute(): FlightPlanSegment;
    /** The arrival segment of the flight plan. */
    get arrival(): FlightPlanSegment;
    /** The approach segment of the flight plan. */
    get approach(): FlightPlanSegment;
    /** The approach segment of the flight plan. */
    get missed(): FlightPlanSegment;
    /** Whether the flight plan has an origin airfield. */
    get hasOrigin(): WayPoint;
    /** Whether the flight plan has a destination airfield. */
    get hasDestination(): WayPoint;
    /** The currently active waypoint. */
    get activeWaypoint(): WayPoint;
    /** The parent instrument this flight plan is attached to locally. */
    private _parentInstrument?;
    /** The current active segments of the flight plan. */
    private _segments;
    /** The waypoints of the flight plan. */
    get waypoints(): WayPoint[];
    /** The length of the flight plan. */
    get length(): number;
    get checksum(): number;
    /** The non-approach waypoints of the flight plan. */
    get nonApproachWaypoints(): WayPoint[];
    /**
     * Sets the parent instrument that the flight plan is attached to locally.
     * @param instrument The instrument that the flight plan is attached to.
     */
    setParentInstrument(instrument: BaseInstrument): void;
    /**
     * Clears the flight plan.
     */
    clearPlan(): Promise<void>;
    /**
     * Syncs the flight plan to FS9GPS.
     */
    syncToGPS(): Promise<void>;
    /**
     * Adds a waypoint to the flight plan.
     * @param waypoint The waypoint to add.
     * @param index The index to add the waypoint at. If ommitted the waypoint will
     * be appended to the end of the flight plan.
     * @param segmentType The type of segment to add the waypoint to.
     */
    addWaypoint(waypoint: WayPoint, index?: number | undefined, segmentType?: SegmentType): void;
    /**
     * Removes a waypoint from the flight plan.
     * @param index The index of the waypoint to remove.
     */
    removeWaypoint(index: number): void;
    /**
     * Gets a waypoint by index from the flight plan.
     * @param index The index of the waypoint to get.
     */
    getWaypoint(index: number): WayPoint;
    /**
     * Adds a plan segment to the flight plan.
     * @param type The type of the segment to add.
     */
    addSegment(type: SegmentType): FlightPlanSegment;
    /**
     * Removes a plan segment from the flight plan.
     * @param type The type of plan segment to remove.
     */
    removeSegment(type: SegmentType): void;
    /**
     * Reflows waypoint index offsets accross plans segments.
     */
    reflowSegments(): void;
    /**
     * Gets a flight plan segment of the specified type.
     * @param type The type of flight plan segment to get.
     * @returns The found segment, or FlightPlanSegment.Empty if not found.
     */
    getSegment(type: number): FlightPlanSegment;
    /**
     * Finds a flight plan segment by waypoint index.
     * @param index The index of the waypoint to find the segment for.
     * @returns The located segment, if any.
     */
    findSegmentByWaypointIndex(index: number): FlightPlanSegment;
    /**
     * Recalculates all waypoint bearings and distances in the flight plan.
     */
    reflowDistances(): void;
    /**
     * Copies a sanitized version of the flight plan for shared data storage.
     * @returns The sanitized flight plan.
     */
    serialize(): any;
    /**
     * Copies the flight plan.
     * @returns The copied flight plan.
     */
    copy(): ManagedFlightPlan;
    /**
     * Reverses the flight plan.
     */
    reverse(): void;
    /**
     * Goes direct to the specified waypoint index in the flight plan.
     * @param index The waypoint index to go direct to.
     */
    addDirectTo(index: number): void;
    /**
     * Calculates an intercept path to a direct-to waypoint.
     * @param waypoint The waypoint to calculate the path to.
     * @returns The waypoints that make up the intercept path.
     */
    calculateDirectIntercept(waypoint: WayPoint): WayPoint[];
    /**
     * Builds a departure into the flight plan from indexes in the departure airport information.
     */
    buildDeparture(): Promise<void>;
    /**
     * Builds an arrival into the flight plan from indexes in the arrival airport information.
     */
    buildArrival(): Promise<void>;
    /**
     * Builds an approach into the flight plan from indexes in the arrival airport information.
     */
    buildApproach(): Promise<void>;
    /**
     * Truncates a flight plan segment. If the active waypoint index is current in the segment,
     * a discontinuity will be added at the end of the active waypoint and the startIndex will
     * point to the next waypoint in the segment after the active.
     * @param type The type of segment to truncate.
     * @returns A segment to add to and a starting waypoint index.
     */
    truncateSegment(type: SegmentType): {
        startIndex: number;
        segment: FlightPlanSegment;
    };
    /**
     * Gets the runway information from a given runway name.
     * @param runways The collection of runways to search.
     * @param runwayName The runway name.
     * @returns The found runway, if any.
     */
    getRunway(runways: OneWayRunway[], runwayName: string): OneWayRunway;
    /**
     * Converts a plain object into a ManagedFlightPlan.
     * @param flightPlanObject The object to convert.
     * @param parentInstrument The parent instrument attached to this flight plan.
     * @returns The converted ManagedFlightPlan.
     */
    static fromObject(flightPlanObject: any, parentInstrument: BaseInstrument): ManagedFlightPlan;
}
