"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SegmentType = exports.FlightPlanSegment = void 0;
/**
 * A segment of a flight plan.
 */
class FlightPlanSegment {
    /**
     * Creates a new FlightPlanSegment.
     * @param type The type of the flight plan segment.
     * @param offset The offset within the original flight plan that
     * the segment starts at.
     * @param waypoints The waypoints in the flight plan segment.
     */
    constructor(type, offset, waypoints) {
        this.type = type;
        this.offset = offset;
        this.waypoints = waypoints;
    }
}
exports.FlightPlanSegment = FlightPlanSegment;
/** An empty flight plan segment. */
FlightPlanSegment.Empty = new FlightPlanSegment(-1, -1, []);
/** Types of flight plan segments. */
var SegmentType;
(function (SegmentType) {
    /** The origin airfield segment. */
    SegmentType[SegmentType["Origin"] = 0] = "Origin";
    /** The departure segment. */
    SegmentType[SegmentType["Departure"] = 1] = "Departure";
    /** The enroute segment. */
    SegmentType[SegmentType["Enroute"] = 2] = "Enroute";
    /** The arrival segment. */
    SegmentType[SegmentType["Arrival"] = 3] = "Arrival";
    /** The approach segment. */
    SegmentType[SegmentType["Approach"] = 4] = "Approach";
    /** The missed approach segment. */
    SegmentType[SegmentType["Missed"] = 5] = "Missed";
    /** The destination airfield segment. */
    SegmentType[SegmentType["Destination"] = 6] = "Destination";
})(SegmentType = exports.SegmentType || (exports.SegmentType = {}));
//# sourceMappingURL=FlightPlanSegment.js.map