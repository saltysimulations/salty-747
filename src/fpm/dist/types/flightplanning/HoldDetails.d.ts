/**
 * Details of a hold procedure for a fix.
 */
export declare class HoldDetails {
    /** The course to fly the hold at. */
    holdCourse: number;
    /** Whether or not the hold course is a true course. */
    isHoldCourseTrue: boolean;
    /** The direction to turn in the hold. */
    turnDirection: HoldTurnDirection;
    /** The amount of time for each hold leg, in seconds. */
    legTime: number;
    /** The amount of distance for each hold leg, in seconds. */
    legDistance: number;
    /** The speed at which to fly the hold, in knots indicated airspeed. */
    speed: number;
    /** The type of hold speed restriction. */
    holdSpeedType: HoldSpeedType;
    /** The time to expect further clearance. */
    efcTime: Date;
    /** The current hold state. */
    state: HoldState;
    /** The hold entry type. */
    entryType: HoldEntry;
    /** The recorded wind direction. */
    windDirection: number;
    /** The recorded wind speed. */
    windSpeed: number;
    /**
     * Creates a default set of hold details.
     * @param course The course to create the hold details for.
     * @param courseTowardsHoldFix The course to the hold fix.
     * @returns A new set of hold details.
     */
    static createDefault(course: number, courseTowardsHoldFix: number): HoldDetails;
    /**
     * Calculates a hold entry type given the hold course and current
     * inbound course. See FMS guide page 14-21.
     * @param holdCourse The course that the hold will be flown with.
     * @param inboundCourse The course that is being flown towards the hold point.
     * @param turnDirection The direction of the hold turn.
     * @returns The hold entry type for a given set of courses.
     */
    static calculateEntryType(holdCourse: number, inboundCourse: number, turnDirection: HoldTurnDirection): HoldEntry;
}
/** The type of hold speed restriction. */
export declare enum HoldSpeedType {
    /** Use FAA hold speed rules. */
    FAA = 0,
    /** Use ICAO hold speed rules. */
    ICAO = 1
}
/** The direction of the hold turn. */
export declare enum HoldTurnDirection {
    /** Use a right hand turn. */
    Right = 0,
    /** Use a left hand turn. */
    Left = 1
}
/** The current state of the hold. */
export declare enum HoldState {
    /** The hold is not active. */
    None = 0,
    /** The hold is currently being entered. */
    Entering = 1,
    /** The hold is active. */
    Holding = 2,
    /** The hold is being exited. */
    Exiting = 3
}
/** The hold entry type. */
export declare enum HoldEntry {
    /** Direct hold entry. */
    Direct = 0,
    /** Teardrop hold entry. */
    Teardrop = 1,
    /** Parallel hold entry. */
    Parallel = 2
}
