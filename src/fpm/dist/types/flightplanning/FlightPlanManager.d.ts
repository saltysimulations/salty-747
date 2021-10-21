import { FlightPlanSegment } from './FlightPlanSegment';
import { HoldDetails } from './HoldDetails';
import { ManagedFlightPlan } from './ManagedFlightPlan';
/**
 * A system for managing flight plan data used by various instruments.
 */
export declare class FlightPlanManager {
    _parentInstrument: BaseInstrument;
    private _isRegistered;
    private _isMaster;
    private _isSyncPaused;
    private _currentFlightPlanVersion;
    private __currentFlightPlanIndex;
    static DEBUG_INSTANCE: FlightPlanManager;
    static FlightPlanKey: string;
    static FlightPlanCompressedKey: string;
    static FlightPlanVersionKey: string;
    /**
     * The current stored flight plan data.
     * @type ManagedFlightPlan[]
     */
    private _flightPlans;
    /**
     * Constructs an instance of the FlightPlanManager with the provided
     * parent instrument attached.
     * @param parentInstrument The parent instrument attached to this FlightPlanManager.
     */
    constructor(_parentInstrument: BaseInstrument);
    get _currentFlightPlanIndex(): number;
    set _currentFlightPlanIndex(value: number);
    /**
     * Gets the current stored version of the flight plan.
     */
    get CurrentFlightPlanVersion(): number;
    update(_deltaTime: number): void;
    onCurrentGameFlightLoaded(_callback: () => void): void;
    registerListener(): void;
    addHardCodedConstraints(wp: any): void;
    /**
     * Loads sim flight plan data into WayPoint objects for consumption.
     * @param data The flight plan data to load.
     * @param currentWaypoints The waypoints array to modify with the data loaded.
     * @param callback A callback to call when the data has completed loading.
     */
    private _loadWaypoints;
    /**
     * Updates the current active waypoint index from the sim.
     */
    updateWaypointIndex(): Promise<void>;
    /**
     * Scans for updates to the synchronized flight plan and loads them into the flight plan
     * manager if the flight plan is out of date.
     * @param {() => void} callback A callback to call when the update has completed.
     * @param {Boolean} log Whether or not to log the loaded flight plan value.
     */
    updateFlightPlan(callback?: () => void, log?: boolean): void;
    /**
     * Loads the flight plans from data storage.
     */
    _loadFlightPlans(): void;
    updateCurrentApproach(callback?: () => void, log?: boolean): void;
    get cruisingAltitude(): number;
    /**
     * Gets the index of the currently active flight plan.
     */
    getCurrentFlightPlanIndex(): number;
    /**
     * Switches the active flight plan index to the supplied index.
     * @param index The index to now use for the active flight plan.
     * @param callback A callback to call when the operation has completed.
     */
    setCurrentFlightPlanIndex(index: number, callback?: (arg0: boolean) => void): void;
    /**
     * Creates a new flight plan.
     * @param callback A callback to call when the operation has completed.
     */
    createNewFlightPlan(callback?: () => void): void;
    /**
     * Copies the currently active flight plan into the specified flight plan index.
     * @param index The index to copy the currently active flight plan into.
     * @param callback A callback to call when the operation has completed.
     */
    copyCurrentFlightPlanInto(index: number, callback?: () => void): Promise<void>;
    /**
     * Copies the flight plan at the specified index to the currently active flight plan index.
     * @param index The index to copy into the currently active flight plan.
     * @param callback A callback to call when the operation has completed.
     */
    copyFlightPlanIntoCurrent(index: number, callback?: () => void): Promise<void>;
    /**
     * Clears the currently active flight plan.
     * @param callback A callback to call when the operation has completed.
     */
    clearFlightPlan(callback?: () => void): Promise<void>;
    /**
     * Gets the origin of the currently active flight plan.
     */
    getOrigin(): WayPoint | undefined;
    /**
     * Sets the origin in the currently active flight plan.
     * @param icao The ICAO designation of the origin airport.
     * @param callback A callback to call when the operation has completed.
     */
    setOrigin(icao: string, callback?: () => void): Promise<void>;
    /**
     * Gets the index of the active waypoint in the flight plan.
     * @param forceSimVarCall Unused
     * @param useCorrection Unused
     */
    getActiveWaypointIndex(forceSimVarCall?: boolean, useCorrection?: boolean): number;
    /**
     * Sets the index of the active waypoint in the flight plan.
     * @param index The index to make active in the flight plan.
     * @param callback A callback to call when the operation has completed.
     * @param fplnIndex The index of the flight plan
     */
    setActiveWaypointIndex(index: number, callback?: () => void, fplnIndex?: number): void;
    /** Unknown */
    recomputeActiveWaypointIndex(callback?: () => void): void;
    /**
     * Gets the index of the waypoint prior to the currently active waypoint.
     * @param forceSimVarCall Unused
     */
    getPreviousActiveWaypoint(forceSimVarCall?: boolean): WayPoint;
    /**
     * Gets the ident of the active waypoint.
     * @param forceSimVarCall Unused
     */
    getActiveWaypointIdent(forceSimVarCall?: boolean): string;
    /**
     * Gets the active waypoint index from fs9gps. Currently unimplemented.
     * @param forceSimVarCall Unused
     */
    getGPSActiveWaypointIndex(forceSimVarCall?: boolean): number;
    /**
     * Gets the active waypoint.
     * @param forceSimVarCall Unused
     * @param useCorrection Unused
     */
    getActiveWaypoint(forceSimVarCall?: boolean, useCorrection?: boolean): WayPoint;
    /**
     * Gets the next waypoint following the active waypoint.
     * @param forceSimVarCall Unused
     */
    getNextActiveWaypoint(forceSimVarCall?: boolean): WayPoint;
    /**
     * Gets the distance, in NM, to the active waypoint.
     */
    getDistanceToActiveWaypoint(): number;
    /**
     * Gets the bearing, in degrees, to the active waypoint.
     */
    getBearingToActiveWaypoint(): number;
    /**
     * Gets the estimated time enroute to the active waypoint.
     */
    getETEToActiveWaypoint(): number;
    /**
     * Gets the destination airfield of the current flight plan, if any.
     */
    getDestination(): WayPoint | undefined;
    /**
     * Gets the currently selected departure information for the current flight plan.
     */
    getDeparture(): any | undefined;
    /**
     * Gets the currently selected arrival information for the current flight plan.
     */
    getArrival(): any | undefined;
    /**
     * Gets the currently selected approach information for the current flight plan.
     */
    getAirportApproach(): any | undefined;
    getApproachConstraints(): Promise<WayPoint[]>;
    /**
     * Gets the departure waypoints for the current flight plan.
     */
    getDepartureWaypoints(): WayPoint[];
    /**
     * Gets a map of the departure waypoints (?)
     */
    getDepartureWaypointsMap(): WayPoint[];
    /**
     * Gets the enroute waypoints for the current flight plan.
     * @param outFPIndex An array of waypoint indexes to be pushed to.
     */
    getEnRouteWaypoints(outFPIndex: number[]): WayPoint[];
    /**
     * Gets the index of the last waypoint in the enroute segment of the current flight plan.
     */
    getEnRouteWaypointsLastIndex(): number;
    /**
     * Gets the arrival waypoints for the current flight plan.
     */
    getArrivalWaypoints(): WayPoint[];
    /**
     * Gets the arrival waypoints for the current flight plan as a map. (?)
     */
    getArrivalWaypointsMap(): WayPoint[];
    /**
     * Gets the waypoints for the current flight plan with altitude constraints.
     */
    getWaypointsWithAltitudeConstraints(): WayPoint[];
    /**
     * Gets the flight plan segment for a flight plan waypoint.
     * @param waypoint The waypoint we want to find the segment for.
     */
    getSegmentFromWaypoint(waypoint: WayPoint | undefined): FlightPlanSegment;
    /**
     * Sets the destination for the current flight plan.
     * @param icao The ICAO designation for the destination airfield.
     * @param callback A callback to call once the operation completes.
     */
    setDestination(icao: string, callback?: () => void): Promise<void>;
    /**
     * Adds a waypoint to the current flight plan.
     * @param icao The ICAO designation for the waypoint.
     * @param index The index of the waypoint to add.
     * @param callback A callback to call once the operation completes.
     * @param setActive Whether or not to set the added waypoint as active immediately.
     */
    addWaypoint(icao: string, index?: number, callback?: () => void, setActive?: boolean): Promise<void>;
    /**
     * Adds a user waypoint to the current flight plan.
     * @param waypoint The user waypoint to add.
     * @param index The index to add the waypoint at in the flight plan.
     * @param callback A callback to call once the operation completes.
     */
    addUserWaypoint(waypoint: WayPoint, index?: number, callback?: () => void): Promise<void>;
    /**
     * Sets the altitude for a waypoint in the current flight plan.
     * @param altitude The altitude to set for the waypoint.
     * @param index The index of the waypoint to set.
     * @param callback A callback to call once the operation is complete.
     */
    setWaypointAltitude(altitude: number, index: number, callback?: () => void): void;
    /**
     * Sets additional data on a waypoint in the current flight plan.
     * @param index The index of the waypoint to set additional data for.
     * @param key The key of the data.
     * @param value The value of the data.
     * @param callback A callback to call once the operation is complete.
     */
    setWaypointAdditionalData(index: number, key: string, value: any, callback?: () => void): void;
    /**
     * Gets additional data on a waypoint in the current flight plan.
     * @param index The index of the waypoint to set additional data for.
     * @param key The key of the data.
     * @param callback A callback to call with the value once the operation is complete.
     */
    getWaypointAdditionalData(index: number, key: string, callback?: (any: any) => void): void;
    /**
     * Reverses the currently active flight plan.
     * @param {() => void} callback A callback to call when the operation is complete.
     */
    invertActiveFlightPlan(callback?: () => void): void;
    /**
     * Not sure what this is supposed to do.
     * @param callback Stuff?
     */
    getApproachIfIcao(callback?: (any: any) => void): void;
    /**
     * Unused
     * @param {*} _callback Unused
     */
    addFlightPlanUpdateCallback(_callback: any): void;
    /**
     * Adds a waypoint to the currently active flight plan by ident(?)
     * @param ident The ident of the waypoint.
     * @param index The index to add the waypoint at.
     * @param callback A callback to call when the operation finishes.
     */
    addWaypointByIdent(ident: string, index: number, callback?: () => void): void;
    /**
     * Removes a waypoint from the currently active flight plan.
     * @param index The index of the waypoint to remove.
     * @param thenSetActive Unused
     * @param callback A callback to call when the operation finishes.
     */
    removeWaypoint(index: number, thenSetActive?: boolean, callback?: () => void): void;
    /**
     * Gets the index of a given waypoint in the current flight plan.
     * @param waypoint The waypoint to get the index of.
     */
    indexOfWaypoint(waypoint: WayPoint): number;
    /**
     * Gets the number of waypoints in a flight plan.
     * @param flightPlanIndex The index of the flight plan. If omitted, will get the current flight plan.
     */
    getWaypointsCount(flightPlanIndex?: number): number;
    /**
     * Gets a count of the number of departure waypoints in the current flight plan.
     */
    getDepartureWaypointsCount(): number;
    /**
     * Gets a count of the number of arrival waypoints in the current flight plan.
     */
    getArrivalWaypointsCount(): number;
    /**
     * Gets a waypoint from a flight plan.
     * @param index The index of the waypoint to get.
     * @param flightPlanIndex The index of the flight plan to get the waypoint from. If omitted, will get from the current flight plan.
     * @param considerApproachWaypoints Whether or not to consider approach waypoints.
     */
    getWaypoint(index: number, flightPlanIndex: number, considerApproachWaypoints: boolean): WayPoint;
    /**
     * Gets all non-approach waypoints from a flight plan.
     * @param flightPlanIndex The index of the flight plan to get the waypoints from. If omitted, will get from the current flight plan.
     */
    getWaypoints(flightPlanIndex?: number): WayPoint[];
    /**
     * Gets all waypoints from a flight plan.
     * @param flightPlanIndex The index of the flight plan to get the waypoints from. If omitted, will get from the current flight plan.
     */
    getAllWaypoints(flightPlanIndex?: number): WayPoint[];
    /**
     * Gets the index of the departure runway in the current flight plan.
     */
    getDepartureRunwayIndex(): number;
    /**
     * Gets the string value of the departure runway in the current flight plan.
     */
    getDepartureRunway(): OneWayRunway;
    /**
     * Gets the heading of the selected departure runway.
     */
    getDepartureRunwayDirection(): Number;
    /**
     * Gets the best runway based on the current plane heading.
     */
    getDetectedCurrentRunway(): OneWayRunway;
    /**
     * Gets the departure procedure index for the current flight plan.
     */
    getDepartureProcIndex(): number;
    /**
     * Sets the departure procedure index for the current flight plan.
     * @param index The index of the departure procedure in the origin airport departures information.
     * @param callback A callback to call when the operation completes.
     */
    setDepartureProcIndex(index: number, callback?: () => void): Promise<void>;
    /**
     * Sets the departure runway index for the current flight plan.
     * @param index The index of the runway in the origin airport runway information.
     * @param callback A callback to call when the operation completes.
     */
    setDepartureRunwayIndex(index: number, callback?: () => void): Promise<void>;
    /**
     * Sets the origin runway index for the current flight plan.
     * @param index The index of the runway in the origin airport runway information.
     * @param callback A callback to call when the operation completes.
     */
    setOriginRunwayIndex(index: number, callback?: () => void): Promise<void>;
    /**
     * Gets the departure transition index for the current flight plan.
     */
    getDepartureEnRouteTransitionIndex(): number;
    /**
     * Sets the departure transition index for the current flight plan.
     * @param index The index of the departure transition to select.
     * @param callback A callback to call when the operation completes.
     */
    setDepartureEnRouteTransitionIndex(index: number, callback?: () => void): Promise<void>;
    /**
     * Unused
     */
    getDepartureDiscontinuity(): void;
    /**
     * Unused
     * @param callback A callback to call when the operation completes.
     */
    clearDepartureDiscontinuity(callback?: () => void): void;
    /**
     * Removes the departure from the currently active flight plan.
     * @param callback A callback to call when the operation completes.
     */
    removeDeparture(callback?: () => void): Promise<void>;
    /**
     * Gets the arrival procedure index in the currenly active flight plan.
     */
    getArrivalProcIndex(): number;
    /**
     * Gets the arrival transition procedure index in the currently active flight plan.
     */
    getArrivalTransitionIndex(): number;
    /**
     * Sets the arrival procedure index for the current flight plan.
     * @param {Number} index The index of the arrival procedure to select.
     * @param {() => void} callback A callback to call when the operation completes.
     */
    setArrivalProcIndex(index: any, callback?: () => void): Promise<void>;
    /**
     * Unused
     */
    getArrivalDiscontinuity(): void;
    /**
     * Unused
     * @param {*} callback
     */
    clearArrivalDiscontinuity(callback?: () => void): void;
    /**
     * Clears a discontinuity from the end of a waypoint.
     * @param index
     */
    clearDiscontinuity(index: number): void;
    /**
     * Sets the arrival transition index for the current flight plan.
     * @param {Number} index The index of the arrival transition to select.
     * @param {() => void} callback A callback to call when the operation completes.
     */
    setArrivalEnRouteTransitionIndex(index: any, callback?: () => void): Promise<void>;
    /**
     * Sets the arrival runway index in the currently active flight plan.
     * @param {Number} index The index of the runway to select.
     * @param {() => void} callback A callback to call when the operation completes.
     */
    setArrivalRunwayIndex(index: any, callback?: () => void): Promise<void>;
    /**
     * Sets the destination runway index in the currently active flight plan.
     * @param index The index of the runway to select.
     * @param runwayExtension The length of the runway extension fix to create, or -1 if none.
     * @param callback A callback to call when the operation completes.
     */
    setDestinationRunwayIndex(index: number, runwayExtension?: number, callback?: () => void): Promise<void>;
    /**
     * Gets the index of the approach in the currently active flight plan.
     */
    getApproachIndex(): number;
    /**
     * Sets the approach index in the currently active flight plan.
     * @param index The index of the approach in the destination airport information.
     * @param callback A callback to call when the operation has completed.
     * @param transition The approach transition index to set in the approach information.
     */
    setApproachIndex(index: number, callback?: () => void, transition?: number): Promise<void>;
    /**
     * Whether or not an approach is loaded in the current flight plan.
     * @param forceSimVarCall Unused
     */
    isLoadedApproach(forceSimVarCall?: boolean): boolean;
    /**
     * Whether or not the approach is active in the current flight plan.
     * @param forceSimVarCall Unused
     */
    isActiveApproach(forceSimVarCall?: boolean): boolean;
    /**
     * Activates the approach segment in the current flight plan.
     * @param {() => void} callback
     */
    activateApproach(callback?: () => void): Promise<void>;
    /**
     * Deactivates the approach segments in the current flight plan.
     */
    deactivateApproach(): void;
    /**
     * Attemptes to auto-activate the approach in the current flight plan.
     */
    tryAutoActivateApproach(): void;
    /**
     * Returns a value indicating if we are in a approach/arrival segment.
     */
    isApproachActivated(): boolean;
    /**
     * Gets the index of the active waypoint on the approach in the current flight plan.
     */
    getApproachActiveWaypointIndex(): number;
    /**
     * Gets the approach procedure from the current flight plan destination airport procedure information.
     */
    getApproach(): any;
    /**
     * Get the nav frequency for the selected approach in the current flight plan.
     * @returns The approach nav frequency, if an ILS approach.
     */
    getApproachNavFrequency(): number;
    /**
     * Gets the index of the approach transition in the current flight plan.
     */
    getApproachTransitionIndex(): number;
    /**
     * Gets the last waypoint index before the start of the approach segment in
     * the current flight plan.
     */
    getLastIndexBeforeApproach(): number;
    /**
     * Gets the approach runway from the current flight plan.
     */
    getApproachRunway(): OneWayRunway;
    /**
     * Gets the approach waypoints for the current flight plan.
     * @param fpIndex The flight plan index.
     */
    getApproachWaypoints(fpIndex?: number): WayPoint[];
    /**
     * Sets the approach transition index for the current flight plan.
     * @param index The index of the transition in the destination airport approach information.
     * @param callback A callback to call when the operation completes.
     */
    setApproachTransitionIndex(index: number, callback?: () => void): Promise<void>;
    /**
     * Removes the arrival segment from the current flight plan.
     * @param callback A callback to call when the operation completes.
     */
    removeArrival(callback?: () => void): Promise<void>;
    /**
     * Activates direct-to an ICAO designated fix.
     * @param icao The ICAO designation for the fix to fly direct-to.
     * @param callback A callback to call when the operation completes.
     */
    activateDirectTo(icao: string, callback?: () => void): Promise<void>;
    /**
     * Activates direct-to an existing waypoint in the flight plan.
     * @param waypointIndex The index of the waypoint.
     * @param callback A callback to call when the operation completes.
     */
    activateDirectToByIndex(waypointIndex: number, callback?: () => void): Promise<void>;
    /**
     * Cancels the current direct-to and proceeds back along the flight plan.
     * @param callback A callback to call when the operation completes.
     */
    cancelDirectTo(callback?: () => void): void;
    /**
     * Gets whether or not the flight plan is current in a direct-to procedure.
     */
    getIsDirectTo(): boolean;
    /**
     * Gets the target of the direct-to procedure in the current flight plan.
     */
    getDirectToTarget(): WayPoint;
    /**
     * Gets the origin/start waypoint of the direct-to procedure in the current flight plan.
     */
    getDirecToOrigin(): WayPoint;
    getCoordinatesHeadingAtDistanceAlongFlightPlan(distance: any): void;
    /**
     * Adds a hold at the specified waypoint index in the flight plan.
     * @param index The waypoint index to hold at.
     * @param details The details of the hold to execute.
     */
    addHoldAtWaypointIndex(index: number, details: HoldDetails): Promise<void>;
    /**
     * Modifies a hold at the specified waypoint index in the flight plan.
     * @param index The waypoint index to hold at.
     * @param details The details of the hold to execute.
     */
    modifyHoldDetails(index: number, details: HoldDetails): Promise<void>;
    /**
     * Deletes a hold at the specified waypoint index in the flight plan.
     * @param index The waypoint index to delete the hold at.
     */
    deleteHoldAtWaypointIndex(index: number): Promise<void>;
    /**
     * Gets the coordinates of a point that is a specific distance from the destination along the flight plan.
     * @param distance The distance from destination we want the coordinates for.
     */
    getCoordinatesAtNMFromDestinationAlongFlightPlan(distance: number): LatLongAlt;
    /**
     * Gets the current stored flight plan
     */
    _getFlightPlan(): void;
    getCurrentFlightPlan(): ManagedFlightPlan;
    getFlightPlan(index: any): ManagedFlightPlan;
    /**
     * Updates the synchronized flight plan version and saves it to shared storage.
     */
    _updateFlightPlanVersion(): Promise<void>;
    pauseSync(): void;
    resumeSync(): void;
}
