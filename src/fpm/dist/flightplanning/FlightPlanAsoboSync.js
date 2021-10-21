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
exports.FlightPlanAsoboSync = void 0;
const WaypointBuilder_1 = require("./WaypointBuilder");
/** A class for syncing a flight plan with the game */
class FlightPlanAsoboSync {
    static init() {
        if (!FlightPlanAsoboSync.fpListenerInitialized) {
            RegisterViewListener("JS_LISTENER_FLIGHTPLAN");
            FlightPlanAsoboSync.fpListenerInitialized = true;
        }
    }
    static LoadFromGame(fpln) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("LOAD FPLN");
            return new Promise((resolve, reject) => {
                FlightPlanAsoboSync.init();
                setTimeout(() => {
                    Coherent.call("LOAD_CURRENT_GAME_FLIGHT");
                    Coherent.call("LOAD_CURRENT_ATC_FLIGHTPLAN");
                    setTimeout(() => {
                        Coherent.call("GET_FLIGHTPLAN").then((data) => __awaiter(this, void 0, void 0, function* () {
                            console.log("COHERENT GET_FLIGHTPLAN received");
                            const isDirectTo = data.isDirectTo;
                            // TODO: talk to matt about dirto
                            if (!isDirectTo) {
                                if (data.waypoints.length === 0) {
                                    resolve();
                                    return;
                                }
                                yield fpln._parentInstrument.facilityLoader.getFacilityRaw(data.waypoints[0].icao, 10000);
                                // set origin
                                yield fpln.setOrigin(data.waypoints[0].icao);
                                // set dest
                                yield fpln.setDestination(data.waypoints[data.waypoints.length - 1].icao);
                                // set route
                                const enrouteStart = (data.departureWaypointsSize == -1) ? 1 : data.departureWaypointsSize;
                                const enroute = data.waypoints.slice(enrouteStart);
                                for (let i = 0; i < enroute.length - 1; i++) {
                                    const wpt = enroute[i];
                                    console.log(wpt.icao);
                                    if (wpt.icao.trim() !== "") {
                                        yield fpln.addWaypoint(wpt.icao);
                                    }
                                    else if (wpt.ident === "Custom") {
                                        const cwpt = WaypointBuilder_1.WaypointBuilder.fromCoordinates("CUST" + i, wpt.lla, fpln._parentInstrument);
                                        yield fpln.addUserWaypoint(cwpt);
                                    }
                                }
                                // set departure
                                //  rwy index
                                yield fpln.setOriginRunwayIndex(data.originRunwayIndex);
                                //  proc index
                                yield fpln.setDepartureProcIndex(data.departureProcIndex);
                                yield fpln.setDepartureRunwayIndex(data.departureRunwayIndex);
                                //  enroutetrans index
                                yield fpln.setDepartureEnRouteTransitionIndex(data.departureEnRouteTransitionIndex);
                                // set arrival
                                //  arrivalproc index
                                yield fpln.setArrivalProcIndex(data.arrivalProcIndex);
                                //  arrivaltrans index
                                yield fpln.setArrivalEnRouteTransitionIndex(data.arrivalEnRouteTransitionIndex);
                                // set approach
                                //  approach index
                                yield fpln.setApproachIndex(data.approachIndex);
                                //  approachtrans index
                                yield fpln.setApproachTransitionIndex(data.approachTransitionIndex);
                                this.fpChecksum = fpln.getCurrentFlightPlan().checksum;
                                resolve();
                            }
                        }));
                    }, 500);
                }, 200);
            });
        });
    }
    static SaveToGame(fpln) {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line no-async-promise-executor
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                FlightPlanAsoboSync.init();
                const plan = fpln.getCurrentFlightPlan();
                if (WTDataStore.get('WT_CJ4_FPSYNC', 0) !== 0 && (plan.checksum !== this.fpChecksum)) {
                    // await Coherent.call("CREATE_NEW_FLIGHTPLAN");
                    yield Coherent.call("SET_CURRENT_FLIGHTPLAN_INDEX", 0).catch(console.log);
                    yield Coherent.call("CLEAR_CURRENT_FLIGHT_PLAN").catch(console.log);
                    if (plan.hasOrigin && plan.hasDestination) {
                        if (plan.hasOrigin) {
                            yield Coherent.call("SET_ORIGIN", plan.originAirfield.icao, false);
                        }
                        if (plan.hasDestination) {
                            yield Coherent.call("SET_DESTINATION", plan.destinationAirfield.icao, false);
                        }
                        let coIndex = 1;
                        for (let i = 0; i < plan.enroute.waypoints.length; i++) {
                            const wpt = plan.enroute.waypoints[i];
                            if (wpt.icao.trim() !== "") {
                                yield Coherent.call("ADD_WAYPOINT", wpt.icao, coIndex, false);
                                coIndex++;
                            }
                        }
                        yield Coherent.call("SET_ORIGIN_RUNWAY_INDEX", plan.procedureDetails.originRunwayIndex).catch(console.log);
                        yield Coherent.call("SET_DEPARTURE_RUNWAY_INDEX", plan.procedureDetails.departureRunwayIndex);
                        yield Coherent.call("SET_DEPARTURE_PROC_INDEX", plan.procedureDetails.departureIndex);
                        yield Coherent.call("SET_DEPARTURE_ENROUTE_TRANSITION_INDEX", plan.procedureDetails.departureTransitionIndex);
                        yield Coherent.call("SET_ARRIVAL_RUNWAY_INDEX", plan.procedureDetails.arrivalRunwayIndex);
                        yield Coherent.call("SET_ARRIVAL_PROC_INDEX", plan.procedureDetails.arrivalIndex);
                        yield Coherent.call("SET_ARRIVAL_ENROUTE_TRANSITION_INDEX", plan.procedureDetails.arrivalTransitionIndex);
                        yield Coherent.call("SET_APPROACH_INDEX", plan.procedureDetails.approachIndex).then(() => {
                            Coherent.call("SET_APPROACH_TRANSITION_INDEX", plan.procedureDetails.approachTransitionIndex);
                        });
                    }
                    this.fpChecksum = plan.checksum;
                }
                Coherent.call("RECOMPUTE_ACTIVE_WAYPOINT_INDEX");
            }));
        });
    }
}
exports.FlightPlanAsoboSync = FlightPlanAsoboSync;
FlightPlanAsoboSync.fpChecksum = 0;
FlightPlanAsoboSync.fpListenerInitialized = false;
//# sourceMappingURL=FlightPlanAsoboSync.js.map