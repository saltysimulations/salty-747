"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectTo = void 0;
/**
 * Information about the current direct-to procedures in the flight plan.
 */
class DirectTo {
    constructor() {
        /** Whether or not the current direct-to is in the flight plan. */
        this.waypointIsInFlightPlan = false;
        /** Whether or not direct-to is active. */
        this.isActive = false;
        /** The current direct-to waypoint index, if part of the flight plan. */
        this.planWaypointIndex = 0;
        /** The current active index in the direct to waypoints. */
        this.currentWaypointIndex = 0;
    }
}
exports.DirectTo = DirectTo;
//# sourceMappingURL=DirectTo.js.map