import { FlightPlanSegment } from "./FlightPlanSegment";
/**
 * Information about the current direct-to procedures in the flight plan.
 */
export declare class DirectTo {
    /** Whether or not the current direct-to is in the flight plan. */
    waypointIsInFlightPlan: boolean;
    /** Whether or not direct-to is active. */
    isActive: boolean;
    /** The current direct-to waypoint, if not part of the flight plan. */
    waypoint?: WayPoint;
    /** The current direct-to waypoint index, if part of the flight plan. */
    planWaypointIndex: number;
    /** The intercept points towards the direct. */
    interceptPoints?: WayPoint[];
    /** The current active index in the direct to waypoints. */
    currentWaypointIndex: number;
    /** The segments of the direct plan. */
    segments?: FlightPlanSegment[];
}
