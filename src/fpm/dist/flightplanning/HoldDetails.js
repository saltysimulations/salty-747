"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoldEntry = exports.HoldState = exports.HoldTurnDirection = exports.HoldSpeedType = exports.HoldDetails = void 0;
/**
 * Details of a hold procedure for a fix.
 */
class HoldDetails {
    /**
     * Creates a default set of hold details.
     * @param course The course to create the hold details for.
     * @param courseTowardsHoldFix The course to the hold fix.
     * @returns A new set of hold details.
     */
    static createDefault(course, courseTowardsHoldFix) {
        const details = new HoldDetails();
        details.holdCourse = course;
        details.holdSpeedType = HoldSpeedType.FAA;
        details.legTime = 60;
        details.speed = Math.max(Simplane.getGroundSpeed(), 140);
        details.windDirection = SimVar.GetSimVarValue("AMBIENT WIND DIRECTION", "degrees");
        details.windSpeed = SimVar.GetSimVarValue("AMBIENT WIND VELOCITY", "knots");
        details.legDistance = details.legTime * (details.speed / 3600);
        details.turnDirection = HoldTurnDirection.Right;
        details.state = HoldState.None;
        details.entryType = HoldDetails.calculateEntryType(course, courseTowardsHoldFix, details.turnDirection);
        return details;
    }
    /**
     * Calculates a hold entry type given the hold course and current
     * inbound course. See FMS guide page 14-21.
     * @param holdCourse The course that the hold will be flown with.
     * @param inboundCourse The course that is being flown towards the hold point.
     * @param turnDirection The direction of the hold turn.
     * @returns The hold entry type for a given set of courses.
     */
    static calculateEntryType(holdCourse, inboundCourse, turnDirection) {
        const courseDiff = Avionics.Utils.diffAngle(inboundCourse, holdCourse);
        if (turnDirection === HoldTurnDirection.Right) {
            if (courseDiff >= -130 && courseDiff <= 70) {
                return HoldEntry.Direct;
            }
            else if (courseDiff < -130 || courseDiff > 175) {
                return HoldEntry.Teardrop;
            }
            else {
                return HoldEntry.Parallel;
            }
        }
        else {
            if (courseDiff >= -130 && courseDiff <= 70) {
                return HoldEntry.Direct;
            }
            else if (courseDiff > 70 || courseDiff < -175) {
                return HoldEntry.Teardrop;
            }
            else {
                return HoldEntry.Parallel;
            }
        }
    }
}
exports.HoldDetails = HoldDetails;
/** The type of hold speed restriction. */
var HoldSpeedType;
(function (HoldSpeedType) {
    /** Use FAA hold speed rules. */
    HoldSpeedType[HoldSpeedType["FAA"] = 0] = "FAA";
    /** Use ICAO hold speed rules. */
    HoldSpeedType[HoldSpeedType["ICAO"] = 1] = "ICAO";
})(HoldSpeedType = exports.HoldSpeedType || (exports.HoldSpeedType = {}));
/** The direction of the hold turn. */
var HoldTurnDirection;
(function (HoldTurnDirection) {
    /** Use a right hand turn. */
    HoldTurnDirection[HoldTurnDirection["Right"] = 0] = "Right";
    /** Use a left hand turn. */
    HoldTurnDirection[HoldTurnDirection["Left"] = 1] = "Left";
})(HoldTurnDirection = exports.HoldTurnDirection || (exports.HoldTurnDirection = {}));
/** The current state of the hold. */
var HoldState;
(function (HoldState) {
    /** The hold is not active. */
    HoldState[HoldState["None"] = 0] = "None";
    /** The hold is currently being entered. */
    HoldState[HoldState["Entering"] = 1] = "Entering";
    /** The hold is active. */
    HoldState[HoldState["Holding"] = 2] = "Holding";
    /** The hold is being exited. */
    HoldState[HoldState["Exiting"] = 3] = "Exiting";
})(HoldState = exports.HoldState || (exports.HoldState = {}));
/** The hold entry type. */
var HoldEntry;
(function (HoldEntry) {
    /** Direct hold entry. */
    HoldEntry[HoldEntry["Direct"] = 0] = "Direct";
    /** Teardrop hold entry. */
    HoldEntry[HoldEntry["Teardrop"] = 1] = "Teardrop";
    /** Parallel hold entry. */
    HoldEntry[HoldEntry["Parallel"] = 2] = "Parallel";
})(HoldEntry = exports.HoldEntry || (exports.HoldEntry = {}));
//# sourceMappingURL=HoldDetails.js.map