"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightPlanManager = void 0;
/* eslint-disable @typescript-eslint/no-empty-function */
const FlightPlanSegment_1 = require("./FlightPlanSegment");
const FlightPlanAsoboSync_1 = require("./FlightPlanAsoboSync");
const ManagedFlightPlan_1 = require("./ManagedFlightPlan");
/**
 * A system for managing flight plan data used by various instruments.
 */
class FlightPlanManager {
    /**
     * Constructs an instance of the FlightPlanManager with the provided
     * parent instrument attached.
     * @param parentInstrument The parent instrument attached to this FlightPlanManager.
     */
    constructor(_parentInstrument) {
        this._parentInstrument = _parentInstrument;
        this._isRegistered = false;
        this._isMaster = false;
        this._isSyncPaused = false;
        this._currentFlightPlanVersion = 0;
        this.__currentFlightPlanIndex = 0;
        /**
         * The current stored flight plan data.
         * @type ManagedFlightPlan[]
         */
        this._flightPlans = [];
        this._loadFlightPlans();
        if (_parentInstrument.instrumentIdentifier == "B747_8_FMC") {
            this._isMaster = true;
            _parentInstrument.addEventListener("FlightStart", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const plan = new ManagedFlightPlan_1.ManagedFlightPlan();
                    plan.setParentInstrument(_parentInstrument);
                    this._flightPlans = [];
                    this._flightPlans.push(plan);
                    if (WTDataStore.get('WT_CJ4_FPSYNC', 0) !== 0) {
                        this.pauseSync();
                        yield FlightPlanAsoboSync_1.FlightPlanAsoboSync.LoadFromGame(this);
                    }
                    this.resumeSync();
                    // ctd magic sauce?
                    Coherent.call("SET_ACTIVE_WAYPOINT_INDEX", 0);
                    Coherent.call("RECOMPUTE_ACTIVE_WAYPOINT_INDEX");
                });
            }.bind(this));
        }
        FlightPlanManager.DEBUG_INSTANCE = this;
    }
    get _currentFlightPlanIndex() {
        return this.__currentFlightPlanIndex;
    }
    set _currentFlightPlanIndex(value) {
        this.__currentFlightPlanIndex = value;
    }
    /**
     * Gets the current stored version of the flight plan.
     */
    get CurrentFlightPlanVersion() {
        return this._currentFlightPlanVersion;
    }
    update(_deltaTime) {
    }
    onCurrentGameFlightLoaded(_callback) {
        _callback();
    }
    registerListener() {
    }
    addHardCodedConstraints(wp) {
    }
    /**
     * Loads sim flight plan data into WayPoint objects for consumption.
     * @param data The flight plan data to load.
     * @param currentWaypoints The waypoints array to modify with the data loaded.
     * @param callback A callback to call when the data has completed loading.
     */
    _loadWaypoints(data, currentWaypoints, callback) {
    }
    /**
     * Updates the current active waypoint index from the sim.
     */
    updateWaypointIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            //const waypointIndex = await Coherent.call("GET_ACTIVE_WAYPOINT_INDEX");
            //this._activeWaypointIndex = waypointIndex;
        });
    }
    /**
     * Scans for updates to the synchronized flight plan and loads them into the flight plan
     * manager if the flight plan is out of date.
     * @param {() => void} callback A callback to call when the update has completed.
     * @param {Boolean} log Whether or not to log the loaded flight plan value.
     */
    updateFlightPlan(callback = () => { }, log = false) {
        const flightPlanVersion = SimVar.GetSimVarValue("L:WT.FlightPlan.Version", "number");
        if (flightPlanVersion !== this._currentFlightPlanVersion) {
            this._loadFlightPlans();
            this._currentFlightPlanVersion = flightPlanVersion;
        }
        callback();
    }
    /**
     * Loads the flight plans from data storage.
     */
    _loadFlightPlans() {
        this._getFlightPlan();
        if (this._flightPlans.length === 0) {
            const newFpln = new ManagedFlightPlan_1.ManagedFlightPlan();
            newFpln.setParentInstrument(this._parentInstrument);
            this._flightPlans.push(new ManagedFlightPlan_1.ManagedFlightPlan());
        }
        else {
            this._flightPlans = this._flightPlans.map(fp => ManagedFlightPlan_1.ManagedFlightPlan.fromObject(fp, this._parentInstrument));
        }
    }
    updateCurrentApproach(callback = () => { }, log = false) {
        callback();
    }
    get cruisingAltitude() {
        return 0;
    }
    /**
     * Gets the index of the currently active flight plan.
     */
    getCurrentFlightPlanIndex() {
        return this._currentFlightPlanIndex;
    }
    /**
     * Switches the active flight plan index to the supplied index.
     * @param index The index to now use for the active flight plan.
     * @param callback A callback to call when the operation has completed.
     */
    setCurrentFlightPlanIndex(index, callback = EmptyCallback.Boolean) {
        if (index >= 0 && index < this._flightPlans.length) {
            this._currentFlightPlanIndex = index;
            callback(true);
        }
        else {
            callback(false);
        }
    }
    /**
     * Creates a new flight plan.
     * @param callback A callback to call when the operation has completed.
     */
    createNewFlightPlan(callback = EmptyCallback.Void) {
        const newFlightPlan = new ManagedFlightPlan_1.ManagedFlightPlan();
        newFlightPlan.setParentInstrument(this._parentInstrument);
        this._flightPlans.push(newFlightPlan);
        this._updateFlightPlanVersion();
        callback();
    }
    /**
     * Copies the currently active flight plan into the specified flight plan index.
     * @param index The index to copy the currently active flight plan into.
     * @param callback A callback to call when the operation has completed.
     */
    copyCurrentFlightPlanInto(index, callback = EmptyCallback.Void) {
        return __awaiter(this, void 0, void 0, function* () {
            const copiedFlightPlan = this._flightPlans[this._currentFlightPlanIndex].copy();
            const activeWaypointIndex = copiedFlightPlan.activeWaypointIndex;
            this._flightPlans[index] = copiedFlightPlan;
            if (index === 0) {
                //await GPS.setActiveWaypoint(activeWaypointIndex);
            }
            this._updateFlightPlanVersion();
            callback();
        });
    }
    /**
     * Copies the flight plan at the specified index to the currently active flight plan index.
     * @param index The index to copy into the currently active flight plan.
     * @param callback A callback to call when the operation has completed.
     */
    copyFlightPlanIntoCurrent(index, callback = EmptyCallback.Void) {
        return __awaiter(this, void 0, void 0, function* () {
            const copiedFlightPlan = this._flightPlans[index].copy();
            const activeWaypointIndex = copiedFlightPlan.activeWaypointIndex;
            this._flightPlans[this._currentFlightPlanIndex] = copiedFlightPlan;
            if (this._currentFlightPlanIndex === 0) {
                //await GPS.setActiveWaypoint(activeWaypointIndex);
            }
            this._updateFlightPlanVersion();
            callback();
        });
    }
    /**
     * Clears the currently active flight plan.
     * @param callback A callback to call when the operation has completed.
     */
    clearFlightPlan(callback = EmptyCallback.Void) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._flightPlans[this._currentFlightPlanIndex].clearPlan();
            this._updateFlightPlanVersion();
            callback();
        });
    }
    /**
     * Gets the origin of the currently active flight plan.
     */
    getOrigin() {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        return currentFlightPlan.originAirfield;
    }
    /**
     * Sets the origin in the currently active flight plan.
     * @param icao The ICAO designation of the origin airport.
     * @param callback A callback to call when the operation has completed.
     */
    setOrigin(icao, callback = () => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            const airport = yield this._parentInstrument.facilityLoader.getFacilityRaw(icao);
            yield currentFlightPlan.clearPlan();
            yield currentFlightPlan.addWaypoint(airport, 0);
            this._updateFlightPlanVersion();
            callback();
        });
    }
    /**
     * Gets the index of the active waypoint in the flight plan.
     * @param forceSimVarCall Unused
     * @param useCorrection Unused
     */
    getActiveWaypointIndex(forceSimVarCall = false, useCorrection = false) {
        return this._flightPlans[this._currentFlightPlanIndex].activeWaypointIndex;
    }
    /**
     * Sets the index of the active waypoint in the flight plan.
     * @param index The index to make active in the flight plan.
     * @param callback A callback to call when the operation has completed.
     * @param fplnIndex The index of the flight plan
     */
    setActiveWaypointIndex(index, callback = EmptyCallback.Void, fplnIndex = this._currentFlightPlanIndex) {
        const currentFlightPlan = this._flightPlans[fplnIndex];
        if (index >= 0 && index < currentFlightPlan.length) {
            currentFlightPlan.activeWaypointIndex = index;
            if (currentFlightPlan.directTo.isActive && currentFlightPlan.directTo.waypointIsInFlightPlan
                && currentFlightPlan.activeWaypointIndex > currentFlightPlan.directTo.planWaypointIndex) {
                currentFlightPlan.directTo.isActive = false;
            }
        }
        this._updateFlightPlanVersion();
        callback();
    }
    /** Unknown */
    recomputeActiveWaypointIndex(callback = EmptyCallback.Void) {
        callback();
    }
    /**
     * Gets the index of the waypoint prior to the currently active waypoint.
     * @param forceSimVarCall Unused
     */
    getPreviousActiveWaypoint(forceSimVarCall = false) {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        const previousWaypointIndex = currentFlightPlan.activeWaypointIndex - 1;
        return currentFlightPlan.getWaypoint(previousWaypointIndex);
    }
    /**
     * Gets the ident of the active waypoint.
     * @param forceSimVarCall Unused
     */
    getActiveWaypointIdent(forceSimVarCall = false) {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        if (currentFlightPlan.activeWaypoint) {
            return currentFlightPlan.activeWaypoint.ident;
        }
        return "";
    }
    /**
     * Gets the active waypoint index from fs9gps. Currently unimplemented.
     * @param forceSimVarCall Unused
     */
    getGPSActiveWaypointIndex(forceSimVarCall = false) {
        return this.getActiveWaypointIndex();
    }
    /**
     * Gets the active waypoint.
     * @param forceSimVarCall Unused
     * @param useCorrection Unused
     */
    getActiveWaypoint(forceSimVarCall = false, useCorrection = false) {
        return this._flightPlans[this._currentFlightPlanIndex].activeWaypoint;
    }
    /**
     * Gets the next waypoint following the active waypoint.
     * @param forceSimVarCall Unused
     */
    getNextActiveWaypoint(forceSimVarCall = false) {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        const nextWaypointIndex = currentFlightPlan.activeWaypointIndex + 1;
        return currentFlightPlan.getWaypoint(nextWaypointIndex);
    }
    /**
     * Gets the distance, in NM, to the active waypoint.
     */
    getDistanceToActiveWaypoint() {
        const lat = SimVar.GetSimVarValue("PLANE LATITUDE", "degree latitude");
        const long = SimVar.GetSimVarValue("PLANE LONGITUDE", "degree longitude");
        const ll = new LatLongAlt(lat, long);
        const waypoint = this.getActiveWaypoint();
        if (waypoint && waypoint.infos) {
            return Avionics.Utils.computeDistance(ll, waypoint.infos.coordinates);
        }
        return 0;
    }
    /**
     * Gets the bearing, in degrees, to the active waypoint.
     */
    getBearingToActiveWaypoint() {
        const lat = SimVar.GetSimVarValue("PLANE LATITUDE", "degree latitude");
        const long = SimVar.GetSimVarValue("PLANE LONGITUDE", "degree longitude");
        const ll = new LatLongAlt(lat, long);
        const waypoint = this.getActiveWaypoint();
        if (waypoint && waypoint.infos) {
            return Avionics.Utils.computeGreatCircleHeading(ll, waypoint.infos.coordinates);
        }
        return 0;
    }
    /**
     * Gets the estimated time enroute to the active waypoint.
     */
    getETEToActiveWaypoint() {
        const lat = SimVar.GetSimVarValue("PLANE LATITUDE", "degree latitude");
        const long = SimVar.GetSimVarValue("PLANE LONGITUDE", "degree longitude");
        const ll = new LatLongAlt(lat, long);
        const waypoint = this.getActiveWaypoint();
        if (waypoint && waypoint.infos) {
            const dist = Avionics.Utils.computeDistance(ll, waypoint.infos.coordinates);
            let groundSpeed = SimVar.GetSimVarValue("GPS GROUND SPEED", "knots");
            if (groundSpeed < 50) {
                groundSpeed = 50;
            }
            if (groundSpeed > 0.1) {
                return dist / groundSpeed * 3600;
            }
        }
        return 0;
    }
    /**
     * Gets the destination airfield of the current flight plan, if any.
     */
    getDestination() {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        return currentFlightPlan.destinationAirfield;
    }
    /**
     * Gets the currently selected departure information for the current flight plan.
     */
    getDeparture() {
        const origin = this.getOrigin();
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        if (origin) {
            const originInfos = origin.infos;
            if (originInfos.departures !== undefined && currentFlightPlan.procedureDetails.departureIndex !== -1) {
                return originInfos.departures[currentFlightPlan.procedureDetails.departureIndex];
            }
        }
        return undefined;
    }
    /**
     * Gets the currently selected arrival information for the current flight plan.
     */
    getArrival() {
        const destination = this.getDestination();
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        if (destination) {
            const originInfos = destination.infos;
            if (originInfos.arrivals !== undefined && currentFlightPlan.procedureDetails.arrivalIndex !== -1) {
                return originInfos.arrivals[currentFlightPlan.procedureDetails.arrivalIndex];
            }
        }
        return undefined;
    }
    /**
     * Gets the currently selected approach information for the current flight plan.
     */
    getAirportApproach() {
        const destination = this.getDestination();
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        if (destination) {
            const originInfos = destination.infos;
            if (originInfos.approaches !== undefined && currentFlightPlan.procedureDetails.approachIndex !== -1) {
                return originInfos.approaches[currentFlightPlan.procedureDetails.approachIndex];
            }
        }
        return undefined;
    }
    getApproachConstraints() {
        return __awaiter(this, void 0, void 0, function* () {
            const approachWaypoints = [];
            const destination = yield this._parentInstrument.facilityLoader.getFacilityRaw(this.getDestination().icao);
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            if (destination) {
                const approach = destination.approaches[currentFlightPlan.procedureDetails.approachIndex];
                if (approach) {
                    let approachTransition = approach.transitions[0];
                    if (approach.transitions.length > 0) {
                        approachTransition = approach.transitions[currentFlightPlan.procedureDetails.approachTransitionIndex];
                    }
                    if (approach && approach.finalLegs) {
                        for (let i = 0; i < approach.finalLegs.length; i++) {
                            const wp = new WayPoint(this._parentInstrument);
                            wp.icao = approach.finalLegs[i].fixIcao;
                            wp.ident = wp.icao.substr(7);
                            wp.legAltitudeDescription = approach.finalLegs[i].altDesc;
                            wp.legAltitude1 = approach.finalLegs[i].altitude1 * 3.28084;
                            wp.legAltitude2 = approach.finalLegs[i].altitude2 * 3.28084;
                            approachWaypoints.push(wp);
                        }
                    }
                    if (approachTransition && approachTransition.legs) {
                        for (let i = 0; i < approachTransition.legs.length; i++) {
                            const wp = new WayPoint(this._parentInstrument);
                            wp.icao = approachTransition.legs[i].fixIcao;
                            wp.ident = wp.icao.substr(7);
                            wp.legAltitudeDescription = approachTransition.legs[i].altDesc;
                            wp.legAltitude1 = approachTransition.legs[i].altitude1 * 3.28084;
                            wp.legAltitude2 = approachTransition.legs[i].altitude2 * 3.28084;
                            approachWaypoints.push(wp);
                        }
                    }
                }
            }
            return approachWaypoints;
        });
    }
    /**
     * Gets the departure waypoints for the current flight plan.
     */
    getDepartureWaypoints() {
        return this._flightPlans[this._currentFlightPlanIndex].departure.waypoints;
    }
    /**
     * Gets a map of the departure waypoints (?)
     */
    getDepartureWaypointsMap() {
        return this._flightPlans[this._currentFlightPlanIndex].departure.waypoints;
    }
    /**
     * Gets the enroute waypoints for the current flight plan.
     * @param outFPIndex An array of waypoint indexes to be pushed to.
     */
    getEnRouteWaypoints(outFPIndex) {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        const enrouteSegment = currentFlightPlan.enroute;
        if (enrouteSegment !== FlightPlanSegment_1.FlightPlanSegment.Empty) {
            for (let i = 0; i < enrouteSegment.waypoints.length; i++) {
                outFPIndex.push(enrouteSegment.offset + i);
            }
        }
        return enrouteSegment.waypoints;
    }
    /**
     * Gets the index of the last waypoint in the enroute segment of the current flight plan.
     */
    getEnRouteWaypointsLastIndex() {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        const enrouteSegment = currentFlightPlan.enroute;
        return enrouteSegment.offset + (enrouteSegment.waypoints.length - 1);
    }
    /**
     * Gets the arrival waypoints for the current flight plan.
     */
    getArrivalWaypoints() {
        return this._flightPlans[this._currentFlightPlanIndex].arrival.waypoints;
    }
    /**
     * Gets the arrival waypoints for the current flight plan as a map. (?)
     */
    getArrivalWaypointsMap() {
        return this._flightPlans[this._currentFlightPlanIndex].arrival.waypoints;
    }
    /**
     * Gets the waypoints for the current flight plan with altitude constraints.
     */
    getWaypointsWithAltitudeConstraints() {
        return this._flightPlans[this._currentFlightPlanIndex].waypoints;
    }
    /**
     * Gets the flight plan segment for a flight plan waypoint.
     * @param waypoint The waypoint we want to find the segment for.
     */
    getSegmentFromWaypoint(waypoint) {
        const index = waypoint === undefined ? this.getActiveWaypointIndex() : this.indexOfWaypoint(waypoint);
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        return currentFlightPlan.findSegmentByWaypointIndex(index);
    }
    /**
     * Sets the destination for the current flight plan.
     * @param icao The ICAO designation for the destination airfield.
     * @param callback A callback to call once the operation completes.
     */
    setDestination(icao, callback = () => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            const waypoint = yield this._parentInstrument.facilityLoader.getFacilityRaw(icao);
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            if (currentFlightPlan.hasDestination) {
                currentFlightPlan.removeWaypoint(currentFlightPlan.length - 1);
            }
            this._flightPlans[this._currentFlightPlanIndex].addWaypoint(waypoint);
            this._updateFlightPlanVersion();
            callback();
        });
    }
    /**
     * Adds a waypoint to the current flight plan.
     * @param icao The ICAO designation for the waypoint.
     * @param index The index of the waypoint to add.
     * @param callback A callback to call once the operation completes.
     * @param setActive Whether or not to set the added waypoint as active immediately.
     */
    addWaypoint(icao, index = Infinity, callback = () => { }, setActive = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            const waypoint = yield this._parentInstrument.facilityLoader.getFacilityRaw(icao);
            currentFlightPlan.addWaypoint(waypoint, index);
            if (setActive) {
                //currentFlightPlan.activeWaypointIndex = index;
            }
            this._updateFlightPlanVersion();
            callback();
        });
    }
    /**
     * Adds a user waypoint to the current flight plan.
     * @param waypoint The user waypoint to add.
     * @param index The index to add the waypoint at in the flight plan.
     * @param callback A callback to call once the operation completes.
     */
    addUserWaypoint(waypoint, index = Infinity, callback = () => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            currentFlightPlan.addWaypoint(waypoint, index);
            this._updateFlightPlanVersion();
            callback();
        });
    }
    /**
     * Sets the altitude for a waypoint in the current flight plan.
     * @param altitude The altitude to set for the waypoint.
     * @param index The index of the waypoint to set.
     * @param callback A callback to call once the operation is complete.
     */
    setWaypointAltitude(altitude, index, callback = () => { }) {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        const waypoint = currentFlightPlan.getWaypoint(index);
        if (waypoint) {
            waypoint.infos.coordinates.alt = altitude;
            this._updateFlightPlanVersion();
        }
        callback();
    }
    /**
     * Sets additional data on a waypoint in the current flight plan.
     * @param index The index of the waypoint to set additional data for.
     * @param key The key of the data.
     * @param value The value of the data.
     * @param callback A callback to call once the operation is complete.
     */
    setWaypointAdditionalData(index, key, value, callback = () => { }) {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        const waypoint = currentFlightPlan.getWaypoint(index);
        if (waypoint) {
            waypoint.additionalData[key] = value;
            this._updateFlightPlanVersion();
        }
        callback();
    }
    /**
     * Gets additional data on a waypoint in the current flight plan.
     * @param index The index of the waypoint to set additional data for.
     * @param key The key of the data.
     * @param callback A callback to call with the value once the operation is complete.
     */
    getWaypointAdditionalData(index, key, callback = () => { }) {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        const waypoint = currentFlightPlan.getWaypoint(index);
        if (waypoint) {
            callback(waypoint.additionalData[key]);
        }
        else {
            callback(undefined);
        }
    }
    /**
     * Reverses the currently active flight plan.
     * @param {() => void} callback A callback to call when the operation is complete.
     */
    invertActiveFlightPlan(callback = () => { }) {
        this._flightPlans[this._currentFlightPlanIndex].reverse();
        this._updateFlightPlanVersion();
        callback();
    }
    /**
     * Not sure what this is supposed to do.
     * @param callback Stuff?
     */
    getApproachIfIcao(callback = () => { }) {
        callback(this.getApproach());
    }
    /**
     * Unused
     * @param {*} _callback Unused
     */
    addFlightPlanUpdateCallback(_callback) {
    }
    /**
     * Adds a waypoint to the currently active flight plan by ident(?)
     * @param ident The ident of the waypoint.
     * @param index The index to add the waypoint at.
     * @param callback A callback to call when the operation finishes.
     */
    addWaypointByIdent(ident, index, callback = EmptyCallback.Void) {
        this.addWaypoint(ident, index, callback);
    }
    /**
     * Removes a waypoint from the currently active flight plan.
     * @param index The index of the waypoint to remove.
     * @param thenSetActive Unused
     * @param callback A callback to call when the operation finishes.
     */
    removeWaypoint(index, thenSetActive = false, callback = () => { }) {
        this._flightPlans[this._currentFlightPlanIndex].removeWaypoint(index);
        this._updateFlightPlanVersion();
        callback();
    }
    /**
     * Gets the index of a given waypoint in the current flight plan.
     * @param waypoint The waypoint to get the index of.
     */
    indexOfWaypoint(waypoint) {
        return this._flightPlans[this._currentFlightPlanIndex].waypoints.indexOf(waypoint);
    }
    /**
     * Gets the number of waypoints in a flight plan.
     * @param flightPlanIndex The index of the flight plan. If omitted, will get the current flight plan.
     */
    getWaypointsCount(flightPlanIndex = NaN) {
        var _a, _b;
        if (isNaN(flightPlanIndex)) {
            flightPlanIndex = this._currentFlightPlanIndex;
        }
        return (_b = (_a = this._flightPlans[flightPlanIndex]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    }
    /**
     * Gets a count of the number of departure waypoints in the current flight plan.
     */
    getDepartureWaypointsCount() {
        return this._flightPlans[this._currentFlightPlanIndex].departure.waypoints.length;
    }
    /**
     * Gets a count of the number of arrival waypoints in the current flight plan.
     */
    getArrivalWaypointsCount() {
        return this._flightPlans[this._currentFlightPlanIndex].arrival.waypoints.length;
    }
    /**
     * Gets a waypoint from a flight plan.
     * @param index The index of the waypoint to get.
     * @param flightPlanIndex The index of the flight plan to get the waypoint from. If omitted, will get from the current flight plan.
     * @param considerApproachWaypoints Whether or not to consider approach waypoints.
     */
    getWaypoint(index, flightPlanIndex = NaN, considerApproachWaypoints) {
        if (isNaN(flightPlanIndex)) {
            flightPlanIndex = this._currentFlightPlanIndex;
        }
        return this._flightPlans[flightPlanIndex].getWaypoint(index);
    }
    /**
     * Gets all non-approach waypoints from a flight plan.
     * @param flightPlanIndex The index of the flight plan to get the waypoints from. If omitted, will get from the current flight plan.
     */
    getWaypoints(flightPlanIndex = NaN) {
        if (isNaN(flightPlanIndex)) {
            flightPlanIndex = this._currentFlightPlanIndex;
        }
        return this._flightPlans[flightPlanIndex].nonApproachWaypoints;
    }
    /**
     * Gets all waypoints from a flight plan.
     * @param flightPlanIndex The index of the flight plan to get the waypoints from. If omitted, will get from the current flight plan.
     */
    getAllWaypoints(flightPlanIndex) {
        if (flightPlanIndex === undefined) {
            flightPlanIndex = this._currentFlightPlanIndex;
        }
        if (this._flightPlans[flightPlanIndex] === undefined) {
            return [];
        }
        return this._flightPlans[flightPlanIndex].waypoints;
    }
    /**
     * Gets the index of the departure runway in the current flight plan.
     */
    getDepartureRunwayIndex() {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        if (currentFlightPlan.hasOrigin) {
            return currentFlightPlan.procedureDetails.departureRunwayIndex;
        }
        return -1;
    }
    /**
     * Gets the string value of the departure runway in the current flight plan.
     */
    getDepartureRunway() {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        if (currentFlightPlan.hasOrigin
            && currentFlightPlan.procedureDetails.departureRunwayIndex !== -1
            && currentFlightPlan.procedureDetails.departureIndex !== -1) {
            const depRunway = currentFlightPlan.originAirfield.infos
                .departures[currentFlightPlan.procedureDetails.departureIndex]
                .runwayTransitions[currentFlightPlan.procedureDetails.departureRunwayIndex]
                .name.replace("RW", "");
            const runway = currentFlightPlan.originAirfield.infos.oneWayRunways
                .find(r => { return r.designation.indexOf(depRunway) !== -1; });
            if (runway) {
                return runway;
            }
            else {
                return undefined;
            }
        }
        else if (currentFlightPlan.procedureDetails.originRunwayIndex !== -1) {
            return currentFlightPlan.originAirfield.infos.oneWayRunways[currentFlightPlan.procedureDetails.originRunwayIndex];
        }
        return undefined;
    }
    /**
     * Gets the heading of the selected departure runway.
     */
    getDepartureRunwayDirection() {
        const origin = this.getOrigin();
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        if (origin && origin.infos instanceof AirportInfo && currentFlightPlan.procedureDetails.originRunwayIndex !== -1) {
            const runway = origin.infos.oneWayRunways[currentFlightPlan.procedureDetails.originRunwayIndex];
            return runway.direction;
        }
        return undefined;
    }
    /**
     * Gets the best runway based on the current plane heading.
     */
    getDetectedCurrentRunway() {
        const origin = this.getOrigin();
        if (origin && origin.infos instanceof AirportInfo) {
            const runways = origin.infos.oneWayRunways;
            if (runways && runways.length > 0) {
                const direction = Simplane.getHeadingMagnetic();
                let bestRunway = runways[0];
                let bestDeltaAngle = Math.abs(Avionics.Utils.diffAngle(direction, bestRunway.direction));
                for (let i = 1; i < runways.length; i++) {
                    const deltaAngle = Math.abs(Avionics.Utils.diffAngle(direction, runways[i].direction));
                    if (deltaAngle < bestDeltaAngle) {
                        bestDeltaAngle = deltaAngle;
                        bestRunway = runways[i];
                    }
                }
                return bestRunway;
            }
        }
        return undefined;
    }
    /**
     * Gets the departure procedure index for the current flight plan.
     */
    getDepartureProcIndex() {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        return currentFlightPlan.procedureDetails.departureIndex;
    }
    /**
     * Sets the departure procedure index for the current flight plan.
     * @param index The index of the departure procedure in the origin airport departures information.
     * @param callback A callback to call when the operation completes.
     */
    setDepartureProcIndex(index, callback = () => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            if (currentFlightPlan.procedureDetails.departureIndex !== index) {
                currentFlightPlan.procedureDetails.departureIndex = index;
                yield currentFlightPlan.buildDeparture();
                this._updateFlightPlanVersion();
            }
            callback();
        });
    }
    /**
     * Sets the departure runway index for the current flight plan.
     * @param index The index of the runway in the origin airport runway information.
     * @param callback A callback to call when the operation completes.
     */
    setDepartureRunwayIndex(index, callback = EmptyCallback.Void) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            if (currentFlightPlan.procedureDetails.departureIndex > -1 && index > -1) {
                const apt = currentFlightPlan.originAirfield.infos;
                const rwyTrans = apt.departures[currentFlightPlan.procedureDetails.departureIndex].runwayTransitions;
                if (rwyTrans !== undefined && rwyTrans.length - 1 < index) {
                    callback();
                    return;
                }
            }
            if (currentFlightPlan.procedureDetails.departureRunwayIndex !== index) {
                currentFlightPlan.procedureDetails.departureRunwayIndex = index;
                yield currentFlightPlan.buildDeparture();
                this._updateFlightPlanVersion();
            }
            callback();
        });
    }
    /**
     * Sets the origin runway index for the current flight plan.
     * @param index The index of the runway in the origin airport runway information.
     * @param callback A callback to call when the operation completes.
     */
    setOriginRunwayIndex(index, callback = EmptyCallback.Void) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            if (currentFlightPlan.procedureDetails.originRunwayIndex !== index) {
                currentFlightPlan.procedureDetails.originRunwayIndex = index;
                yield currentFlightPlan.buildDeparture();
                this._updateFlightPlanVersion();
            }
            callback();
        });
    }
    /**
     * Gets the departure transition index for the current flight plan.
     */
    getDepartureEnRouteTransitionIndex() {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        return currentFlightPlan.procedureDetails.departureTransitionIndex;
    }
    /**
     * Sets the departure transition index for the current flight plan.
     * @param index The index of the departure transition to select.
     * @param callback A callback to call when the operation completes.
     */
    setDepartureEnRouteTransitionIndex(index, callback = EmptyCallback.Void) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            if (currentFlightPlan.procedureDetails.departureTransitionIndex !== index) {
                currentFlightPlan.procedureDetails.departureTransitionIndex = index;
                yield currentFlightPlan.buildDeparture();
                this._updateFlightPlanVersion();
            }
            callback();
        });
    }
    /**
     * Unused
     */
    getDepartureDiscontinuity() {
    }
    /**
     * Unused
     * @param callback A callback to call when the operation completes.
     */
    clearDepartureDiscontinuity(callback = EmptyCallback.Void) {
        callback();
    }
    /**
     * Removes the departure from the currently active flight plan.
     * @param callback A callback to call when the operation completes.
     */
    removeDeparture(callback = () => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            currentFlightPlan.procedureDetails.departureIndex = -1;
            yield currentFlightPlan.buildDeparture();
            this._updateFlightPlanVersion();
            callback();
        });
    }
    /**
     * Gets the arrival procedure index in the currenly active flight plan.
     */
    getArrivalProcIndex() {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        if (currentFlightPlan.hasDestination && currentFlightPlan.procedureDetails.arrivalIndex !== -1) {
            return currentFlightPlan.procedureDetails.arrivalIndex;
        }
        return -1;
    }
    /**
     * Gets the arrival transition procedure index in the currently active flight plan.
     */
    getArrivalTransitionIndex() {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        return currentFlightPlan.procedureDetails.arrivalTransitionIndex;
    }
    /**
     * Sets the arrival procedure index for the current flight plan.
     * @param {Number} index The index of the arrival procedure to select.
     * @param {() => void} callback A callback to call when the operation completes.
     */
    setArrivalProcIndex(index, callback = () => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            if (currentFlightPlan.procedureDetails.arrivalIndex !== index) {
                currentFlightPlan.procedureDetails.arrivalIndex = index;
                yield currentFlightPlan.buildArrival();
                this._updateFlightPlanVersion();
            }
            callback();
        });
    }
    /**
     * Unused
     */
    getArrivalDiscontinuity() {
    }
    /**
     * Unused
     * @param {*} callback
     */
    clearArrivalDiscontinuity(callback = EmptyCallback.Void) {
        callback();
    }
    /**
     * Clears a discontinuity from the end of a waypoint.
     * @param index
     */
    clearDiscontinuity(index) {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        const waypoint = currentFlightPlan.getWaypoint(index);
        if (waypoint !== undefined) {
            waypoint.endsInDiscontinuity = false;
        }
        this._updateFlightPlanVersion();
    }
    /**
     * Sets the arrival transition index for the current flight plan.
     * @param {Number} index The index of the arrival transition to select.
     * @param {() => void} callback A callback to call when the operation completes.
     */
    setArrivalEnRouteTransitionIndex(index, callback = () => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            if (currentFlightPlan.procedureDetails.arrivalTransitionIndex !== index) {
                currentFlightPlan.procedureDetails.arrivalTransitionIndex = index;
                yield currentFlightPlan.buildArrival();
                this._updateFlightPlanVersion();
            }
            callback();
        });
    }
    /**
     * Sets the arrival runway index in the currently active flight plan.
     * @param {Number} index The index of the runway to select.
     * @param {() => void} callback A callback to call when the operation completes.
     */
    setArrivalRunwayIndex(index, callback = () => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            if (currentFlightPlan.procedureDetails.arrivalRunwayIndex !== index) {
                currentFlightPlan.procedureDetails.arrivalRunwayIndex = index;
                yield currentFlightPlan.buildArrival();
                this._updateFlightPlanVersion();
            }
            callback();
        });
    }
    /**
     * Sets the destination runway index in the currently active flight plan.
     * @param index The index of the runway to select.
     * @param runwayExtension The length of the runway extension fix to create, or -1 if none.
     * @param callback A callback to call when the operation completes.
     */
    setDestinationRunwayIndex(index, runwayExtension = -1, callback = () => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            if (currentFlightPlan.procedureDetails.destinationRunwayIndex !== index
                || currentFlightPlan.procedureDetails.destinationRunwayExtension !== runwayExtension) {
                currentFlightPlan.procedureDetails.destinationRunwayIndex = index;
                currentFlightPlan.procedureDetails.destinationRunwayExtension = runwayExtension;
                yield currentFlightPlan.buildApproach();
                this._updateFlightPlanVersion();
            }
            callback();
        });
    }
    /**
     * Gets the index of the approach in the currently active flight plan.
     */
    getApproachIndex() {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        return currentFlightPlan.procedureDetails.approachIndex;
    }
    /**
     * Sets the approach index in the currently active flight plan.
     * @param index The index of the approach in the destination airport information.
     * @param callback A callback to call when the operation has completed.
     * @param transition The approach transition index to set in the approach information.
     */
    setApproachIndex(index, callback = () => { }, transition = -1) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            if (currentFlightPlan.procedureDetails.approachIndex !== index) {
                currentFlightPlan.procedureDetails.approachIndex = index;
                yield currentFlightPlan.buildApproach();
                this._updateFlightPlanVersion();
            }
            callback();
        });
    }
    /**
     * Whether or not an approach is loaded in the current flight plan.
     * @param forceSimVarCall Unused
     */
    isLoadedApproach(forceSimVarCall = false) {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        return currentFlightPlan.procedureDetails.approachIndex !== -1;
    }
    /**
     * Whether or not the approach is active in the current flight plan.
     * @param forceSimVarCall Unused
     */
    isActiveApproach(forceSimVarCall = false) {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        return currentFlightPlan.approach.waypoints.length > 0
            && currentFlightPlan.activeWaypointIndex >= currentFlightPlan.approach.offset;
    }
    /**
     * Activates the approach segment in the current flight plan.
     * @param {() => void} callback
     */
    activateApproach(callback = EmptyCallback.Void) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            if (!this.isActiveApproach()) {
                //await GPS.setActiveWaypoint(currentFlightPlan.approach.offset);
            }
            callback();
        });
    }
    /**
     * Deactivates the approach segments in the current flight plan.
     */
    deactivateApproach() {
    }
    /**
     * Attemptes to auto-activate the approach in the current flight plan.
     */
    tryAutoActivateApproach() {
    }
    /**
     * Returns a value indicating if we are in a approach/arrival segment.
     */
    isApproachActivated() {
        const fpln = this.getCurrentFlightPlan();
        const segment = fpln.findSegmentByWaypointIndex(fpln.activeWaypointIndex);
        return segment.type === FlightPlanSegment_1.SegmentType.Approach || segment.type === FlightPlanSegment_1.SegmentType.Arrival;
    }
    /**
     * Gets the index of the active waypoint on the approach in the current flight plan.
     */
    getApproachActiveWaypointIndex() {
        return this._flightPlans[this._currentFlightPlanIndex].activeWaypointIndex;
    }
    /**
     * Gets the approach procedure from the current flight plan destination airport procedure information.
     */
    getApproach() {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        if (currentFlightPlan.hasDestination && currentFlightPlan.procedureDetails.approachIndex !== -1) {
            const app = currentFlightPlan.destinationAirfield.infos.approaches[currentFlightPlan.procedureDetails.approachIndex];
            if (app !== undefined) {
                app.isLocalizer = function () {
                    return this.name.indexOf("ILS") > -1 || this.name.indexOf("LOC") > -1;
                }.bind(app);
            }
            return app;
        }
        return undefined;
    }
    /**
     * Get the nav frequency for the selected approach in the current flight plan.
     * @returns The approach nav frequency, if an ILS approach.
     */
    getApproachNavFrequency() {
        const approach = this.getApproach();
        if (approach && approach.name.includes('ILS')) {
            const destination = this.getDestination();
            const approachRunway = this.getApproach().runway.trim();
            const aptInfo = destination.infos;
            const frequency = aptInfo.namedFrequencies.find(f => f.name.replace("RW0", "").replace("RW", "").indexOf(approachRunway) !== -1);
            if (frequency) {
                return frequency.value;
            }
        }
        return NaN;
    }
    /**
     * Gets the index of the approach transition in the current flight plan.
     */
    getApproachTransitionIndex() {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        return currentFlightPlan.procedureDetails.approachTransitionIndex;
    }
    /**
     * Gets the last waypoint index before the start of the approach segment in
     * the current flight plan.
     */
    getLastIndexBeforeApproach() {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        // TODO: if we have an approach return last index
        if (currentFlightPlan.approach !== FlightPlanSegment_1.FlightPlanSegment.Empty) {
            return currentFlightPlan.approach.offset - 1;
        }
        else {
            return this.getWaypointsCount();
        }
    }
    /**
     * Gets the approach runway from the current flight plan.
     */
    getApproachRunway() {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        if (currentFlightPlan.hasDestination && currentFlightPlan.procedureDetails.approachIndex !== -1) {
            const destination = currentFlightPlan.waypoints[currentFlightPlan.waypoints.length - 1];
            const approachRunwayName = destination.infos.approaches[currentFlightPlan.procedureDetails.approachIndex].runway;
            const runway = currentFlightPlan.getRunway(destination.infos.oneWayRunways, approachRunwayName);
            return runway;
        }
        return undefined;
    }
    /**
     * Gets the approach waypoints for the current flight plan.
     * @param fpIndex The flight plan index.
     */
    getApproachWaypoints(fpIndex = this._currentFlightPlanIndex) {
        return this._flightPlans[fpIndex].approach.waypoints;
    }
    /**
     * Sets the approach transition index for the current flight plan.
     * @param index The index of the transition in the destination airport approach information.
     * @param callback A callback to call when the operation completes.
     */
    setApproachTransitionIndex(index, callback = () => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            if (currentFlightPlan.procedureDetails.approachTransitionIndex !== index) {
                currentFlightPlan.procedureDetails.approachTransitionIndex = index;
                yield currentFlightPlan.buildApproach();
                this._updateFlightPlanVersion();
            }
            callback();
        });
    }
    /**
     * Removes the arrival segment from the current flight plan.
     * @param callback A callback to call when the operation completes.
     */
    removeArrival(callback = () => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            currentFlightPlan.procedureDetails.arrivalIndex = -1;
            currentFlightPlan.procedureDetails.arrivalRunwayIndex = -1;
            currentFlightPlan.procedureDetails.arrivalTransitionIndex = -1;
            yield currentFlightPlan.buildArrival();
            this._updateFlightPlanVersion();
            callback();
        });
    }
    /**
     * Activates direct-to an ICAO designated fix.
     * @param icao The ICAO designation for the fix to fly direct-to.
     * @param callback A callback to call when the operation completes.
     */
    activateDirectTo(icao, callback = EmptyCallback.Void) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            const waypointIndex = currentFlightPlan.waypoints.findIndex(w => w.icao === icao);
            yield this.activateDirectToByIndex(waypointIndex, callback);
        });
    }
    /**
     * Activates direct-to an existing waypoint in the flight plan.
     * @param waypointIndex The index of the waypoint.
     * @param callback A callback to call when the operation completes.
     */
    activateDirectToByIndex(waypointIndex, callback = EmptyCallback.Void) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            const waypoint = currentFlightPlan.getWaypoint(waypointIndex);
            if (waypointIndex !== -1) {
                this.pauseSync();
                while (currentFlightPlan.waypoints.findIndex(w => w.ident === "$DIR") > -1) {
                    currentFlightPlan.removeWaypoint(currentFlightPlan.waypoints.findIndex(w => w.ident === "$DIR"));
                }
                const newWaypointIndex = currentFlightPlan.waypoints.findIndex(x => x === waypoint);
                currentFlightPlan.addDirectTo(newWaypointIndex);
                this.resumeSync();
            }
            callback();
        });
    }
    /**
     * Cancels the current direct-to and proceeds back along the flight plan.
     * @param callback A callback to call when the operation completes.
     */
    cancelDirectTo(callback = EmptyCallback.Void) {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        //currentFlightPlan.directTo.cancel();
        callback();
    }
    /**
     * Gets whether or not the flight plan is current in a direct-to procedure.
     */
    getIsDirectTo() {
        return this._flightPlans[this._currentFlightPlanIndex].directTo.isActive;
    }
    /**
     * Gets the target of the direct-to procedure in the current flight plan.
     */
    getDirectToTarget() {
        const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
        if (currentFlightPlan.directTo.waypointIsInFlightPlan) {
            return currentFlightPlan.waypoints[currentFlightPlan.directTo.planWaypointIndex];
        }
        else {
            return currentFlightPlan.directTo.waypoint;
        }
    }
    /**
     * Gets the origin/start waypoint of the direct-to procedure in the current flight plan.
     */
    getDirecToOrigin() {
        return this._flightPlans[this._currentFlightPlanIndex].directTo.interceptPoints[0];
    }
    getCoordinatesHeadingAtDistanceAlongFlightPlan(distance) {
    }
    /**
     * Adds a hold at the specified waypoint index in the flight plan.
     * @param index The waypoint index to hold at.
     * @param details The details of the hold to execute.
     */
    addHoldAtWaypointIndex(index, details) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            const waypoint = currentFlightPlan.getWaypoint(index);
            if (waypoint) {
                const newHoldWaypoint = Object.assign(new WayPoint(this._parentInstrument), waypoint);
                newHoldWaypoint.infos = Object.assign(new WayPointInfo(this._parentInstrument), waypoint.infos);
                const segment = currentFlightPlan.findSegmentByWaypointIndex(index);
                newHoldWaypoint.hasHold = true;
                newHoldWaypoint.holdDetails = details;
                currentFlightPlan.addWaypoint(newHoldWaypoint, index + 1, segment.type);
                yield this._updateFlightPlanVersion();
            }
        });
    }
    /**
     * Modifies a hold at the specified waypoint index in the flight plan.
     * @param index The waypoint index to hold at.
     * @param details The details of the hold to execute.
     */
    modifyHoldDetails(index, details) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            const waypoint = currentFlightPlan.getWaypoint(index);
            if (waypoint && waypoint.hasHold) {
                waypoint.holdDetails = details;
                yield this._updateFlightPlanVersion();
            }
        });
    }
    /**
     * Deletes a hold at the specified waypoint index in the flight plan.
     * @param index The waypoint index to delete the hold at.
     */
    deleteHoldAtWaypointIndex(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFlightPlan = this._flightPlans[this._currentFlightPlanIndex];
            const waypoint = currentFlightPlan.getWaypoint(index);
            if (waypoint && waypoint.hasHold) {
                currentFlightPlan.removeWaypoint(index);
                yield this._updateFlightPlanVersion();
            }
        });
    }
    /**
     * Gets the coordinates of a point that is a specific distance from the destination along the flight plan.
     * @param distance The distance from destination we want the coordinates for.
     */
    getCoordinatesAtNMFromDestinationAlongFlightPlan(distance) {
        const allWaypoints = this.getAllWaypoints();
        const destination = this.getDestination();
        if (destination) {
            const fromStartDistance = destination.cumulativeDistanceInFP - distance;
            let prevIndex;
            let prev;
            let next;
            for (let i = 0; i < allWaypoints.length - 1; i++) {
                prevIndex = i;
                prev = allWaypoints[i];
                next = allWaypoints[i + 1];
                if (prev.cumulativeDistanceInFP < fromStartDistance && next.cumulativeDistanceInFP > fromStartDistance) {
                    break;
                }
            }
            const prevCD = prev.cumulativeDistanceInFP;
            const nextCD = next.cumulativeDistanceInFP;
            const d = (fromStartDistance - prevCD) / (nextCD - prevCD);
            const output = new LatLongAlt();
            output.lat = Avionics.Utils.lerpAngle(prev.infos.coordinates.lat, next.infos.coordinates.lat, d);
            output.long = Avionics.Utils.lerpAngle(prev.infos.coordinates.long, next.infos.coordinates.long, d);
            return output;
        }
    }
    /**
     * Gets the current stored flight plan
     */
    _getFlightPlan() {
        const fpln = window.localStorage.getItem(FlightPlanManager.FlightPlanKey);
        if (fpln === null || fpln === '') {
            this._flightPlans = [];
            const initFpln = new ManagedFlightPlan_1.ManagedFlightPlan();
            initFpln.setParentInstrument(this._parentInstrument);
            this._flightPlans.push(initFpln);
        }
        else {
            if (window.localStorage.getItem(FlightPlanManager.FlightPlanCompressedKey) == "1") {
                this._flightPlans = JSON.parse(LZUTF8.decompress(fpln, { inputEncoding: "StorageBinaryString" }));
            }
            else {
                this._flightPlans = JSON.parse(fpln);
            }
        }
    }
    getCurrentFlightPlan() {
        return this._flightPlans[this._currentFlightPlanIndex];
    }
    getFlightPlan(index) {
        return this._flightPlans[index];
    }
    /**
     * Updates the synchronized flight plan version and saves it to shared storage.
     */
    _updateFlightPlanVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isSyncPaused) {
                return;
            }
            let fpJson = JSON.stringify(this._flightPlans.map(fp => fp.serialize()));
            if (fpJson.length > 2500000) {
                fpJson = LZUTF8.compress(fpJson, { outputEncoding: "StorageBinaryString" });
                window.localStorage.setItem(FlightPlanManager.FlightPlanCompressedKey, "1");
            }
            else {
                window.localStorage.setItem(FlightPlanManager.FlightPlanCompressedKey, "0");
            }
            window.localStorage.setItem(FlightPlanManager.FlightPlanKey, fpJson);
            SimVar.SetSimVarValue(FlightPlanManager.FlightPlanVersionKey, 'number', ++this._currentFlightPlanVersion);
            FlightPlanAsoboSync_1.FlightPlanAsoboSync.SaveToGame(this);
        });
    }
    pauseSync() {
        this._isSyncPaused = true;
    }
    resumeSync() {
        this._isSyncPaused = false;
        this._updateFlightPlanVersion();
    }
}
exports.FlightPlanManager = FlightPlanManager;
FlightPlanManager.FlightPlanKey = "WT.FlightPlan";
FlightPlanManager.FlightPlanCompressedKey = "WT.FlightPlan.Compressed";
FlightPlanManager.FlightPlanVersionKey = "L:WT.FlightPlan.Version";
//# sourceMappingURL=FlightPlanManager.js.map