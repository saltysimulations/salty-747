/**
 * A segment of a flight plan.
 */
export declare class FlightPlanSegment {
    type: SegmentType;
    offset: number;
    waypoints: WayPoint[];
    /**
     * Creates a new FlightPlanSegment.
     * @param type The type of the flight plan segment.
     * @param offset The offset within the original flight plan that
     * the segment starts at.
     * @param waypoints The waypoints in the flight plan segment.
     */
    constructor(type: SegmentType, offset: number, waypoints: WayPoint[]);
    /** An empty flight plan segment. */
    static Empty: FlightPlanSegment;
}
/** Types of flight plan segments. */
export declare enum SegmentType {
    /** The origin airfield segment. */
    Origin = 0,
    /** The departure segment. */
    Departure = 1,
    /** The enroute segment. */
    Enroute = 2,
    /** The arrival segment. */
    Arrival = 3,
    /** The approach segment. */
    Approach = 4,
    /** The missed approach segment. */
    Missed = 5,
    /** The destination airfield segment. */
    Destination = 6
}
