/**
 * Creates a collection of waypoints from a legs procedure.
 */
export declare class LegsProcedure {
    private _legs;
    private _previousFix;
    private _fixMinusTwo;
    private _instrument;
    /** The current index in the procedure. */
    private _currentIndex;
    /** Whether or not there is a discontinuity pending to be mapped. */
    private _isDiscontinuityPending;
    /** A collection of the loaded facilities needed for this procedure. */
    private _facilities;
    /** Whether or not the facilities have completed loading. */
    private _facilitiesLoaded;
    /**The collection of facility promises to await on first load. */
    private _facilitiesToLoad;
    /** Whether or not a non initial-fix procedure start has been added to the procedure. */
    private _addedProcedureStart;
    /** A normalization factor for calculating distances from triangular ratios. */
    static distanceNormalFactorNM: number;
    /** A collection of filtering rules for filtering ICAO data to pre-load for the procedure. */
    private legFilteringRules;
    /**
     * Creates an instance of a LegsProcedure.
     * @param _legs The legs that are part of the procedure.
     * @param _previousFix The previous fix before the procedure starts.
     * @param _fixMinusTwo The fix before the previous fix.
     * @param _instrument The instrument that is attached to the flight plan.
     */
    constructor(_legs: ProcedureLeg[], _previousFix: WayPoint, _fixMinusTwo: WayPoint, _instrument: BaseInstrument);
    /**
     * Checks whether or not there are any legs remaining in the procedure.
     * @returns True if there is a next leg, false otherwise.
     */
    hasNext(): boolean;
    /**
     * Gets the next mapped leg from the procedure.
     * @returns The mapped waypoint from the leg of the procedure.
     */
    getNext(): Promise<WayPoint>;
    private altitudeIsVerticalAngleInfo;
    /**
     * Maps a heading until distance from origin leg.
     * @param leg The procedure leg to map.
     * @param prevLeg The previously mapped waypoint in the procedure.
     * @returns The mapped leg.
     */
    mapHeadingUntilDistanceFromOrigin(leg: ProcedureLeg, prevLeg: WayPoint): WayPoint;
    /**
     * Maps a bearing/distance fix in the procedure.
     * @param leg The procedure leg to map.
     * @returns The mapped leg.
     */
    mapBearingAndDistanceFromOrigin(leg: ProcedureLeg): WayPoint;
    /**
     * Maps a radial on the origin for a specified distance leg in the procedure.
     * @param leg The procedure leg to map.
     * @param prevLeg The previously mapped leg.
     * @returns The mapped leg.
     */
    mapOriginRadialForDistance(leg: ProcedureLeg, prevLeg: WayPoint): WayPoint;
    /**
     * Maps a heading turn to intercept the next leg in the procedure.
     * @param leg The procedure leg to map.
     * @param prevLeg The previously mapped leg.
     * @param nextLeg The next leg in the procedure to intercept.
     * @returns The mapped leg.
     */
    mapHeadingToInterceptNextLeg(leg: ProcedureLeg, prevLeg: WayPoint, nextLeg: ProcedureLeg): WayPoint;
    /**
     * Maps flying a heading until crossing a radial of a reference fix.
     * @param leg The procedure leg to map.
     * @param prevLeg The previously mapped leg.
     * @returns The mapped leg.
     */
    mapHeadingUntilRadialCrossing(leg: ProcedureLeg, prevLeg: WayPoint): WayPoint;
    /**
     * Maps flying a heading until a proscribed altitude.
     * @param leg The procedure leg to map.
     * @param prevLeg The previous leg in the procedure.
     * @returns The mapped leg.
     */
    mapHeadingUntilAltitude(leg: ProcedureLeg, prevLeg: WayPoint): WayPoint;
    /**
     * Maps a vectors instruction.
     * @param leg The procedure leg to map.
     * @param prevLeg The previous leg in the procedure.
     * @returns The mapped leg.
     */
    mapVectors(leg: ProcedureLeg, prevLeg: WayPoint): WayPoint;
    /**
     * Maps an exact fix leg in the procedure.
     * @param leg The procedure leg to map.
     * @param prevLeg The previous mapped leg in the procedure.
     * @returns The mapped leg.
     */
    mapExactFix(leg: ProcedureLeg, prevLeg: WayPoint): WayPoint;
    /**
     * Maps a hold leg in the procedure.
     * @param leg The procedure leg to map.
     * @param fixMinusTwo The fix that is two previous to this leg.
     * @returns The mapped leg.
     */
    mapHold(leg: ProcedureLeg, fixMinusTwo: WayPoint): WayPoint;
    /**
     * Gets the difference between two headings in zero north normalized radians.
     * @param a The degrees of heading a.
     * @param b The degrees of heading b.
     * @returns The difference between the two headings in zero north normalized radians.
     */
    private deltaAngleRadians;
    /**
     * Gets an ident from an ICAO.
     * @param icao The icao to pull the ident from.
     * @returns The parsed ident.
     */
    private getIdent;
    /**
     * Checks if an ICAO is valid to load.
     * @param icao The icao to check.
     * @returns Whether or not the ICAO is valid.
     */
    private isIcaoValid;
    /**
     * Builds a WayPoint from basic data.
     * @param ident The ident of the waypoint.
     * @param coordinates The coordinates of the waypoint.
     * @param magneticVariation The magnetic variation of the waypoint, if any.
     * @returns The built waypoint.
     */
    buildWaypoint(ident: string, coordinates: LatLongAlt, magneticVariation?: number): WayPoint;
}
