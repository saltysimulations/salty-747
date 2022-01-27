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
exports.GPS = void 0;
/**
 * Methods for interacting with the FS9GPS subsystem.
 */
class GPS {
    /**
     * Clears the FS9GPS flight plan.
     */
    static clearPlan() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalGpsWaypoints = SimVar.GetSimVarValue('C:fs9gps:FlightPlanWaypointsNumber', 'number');
            for (let i = 0; i < totalGpsWaypoints; i++) {
                //Always remove waypoint 0 here, which shifts the rest of the waypoints down one
                yield GPS.deleteWaypoint(0);
            }
        });
    }
    /**
     * Adds a waypoint to the FS9GPS flight plan by ICAO designation.
     * @param icao The MSFS ICAO to add to the flight plan.
     * @param index The index of the waypoint to add in the flight plan.
     */
    static addIcaoWaypoint(icao, index) {
        return __awaiter(this, void 0, void 0, function* () {
            yield SimVar.SetSimVarValue('C:fs9gps:FlightPlanNewWaypointICAO', 'string', icao);
            yield SimVar.SetSimVarValue('C:fs9gps:FlightPlanAddWaypoint', 'number', index);
        });
    }
    /**
     * Adds a user waypoint to the FS9GPS flight plan.
     * @param lat The latitude of the user waypoint.
     * @param lon The longitude of the user waypoint.
     * @param index The index of the waypoint to add in the flight plan.
     * @param ident The ident of the waypoint.
     */
    static addUserWaypoint(lat, lon, index, ident) {
        return __awaiter(this, void 0, void 0, function* () {
            yield SimVar.SetSimVarValue('C:fs9gps:FlightPlanNewWaypointLatitude', 'degrees', lat);
            yield SimVar.SetSimVarValue('C:fs9gps:FlightPlanNewWaypointLongitude', 'degrees', lon);
            if (ident) {
                yield SimVar.SetSimVarValue('C:fs9gps:FlightPlanNewWaypointIdent', 'string', ident);
            }
            yield SimVar.SetSimVarValue('C:fs9gps:FlightPlanAddWaypoint', 'number', index);
        });
    }
    /**
     * Deletes a waypoint from the FS9GPS flight plan.
     * @param index The index of the waypoint in the flight plan to delete.
     */
    static deleteWaypoint(index) {
        return __awaiter(this, void 0, void 0, function* () {
            yield SimVar.SetSimVarValue('C:fs9gps:FlightPlanDeleteWaypoint', 'number', index);
        });
    }
    /**
     * Sets the active FS9GPS waypoint.
     * @param {Number} index The index of the waypoint to set active.
     */
    static setActiveWaypoint(index) {
        return __awaiter(this, void 0, void 0, function* () {
            yield SimVar.SetSimVarValue('C:fs9gps:FlightPlanActiveWaypoint', 'number', index);
        });
    }
    /**
     * Gets the active FS9GPS waypoint.
     */
    static getActiveWaypoint() {
        return SimVar.GetSimVarValue('C:fs9gps:FlightPlanActiveWaypoint', 'number');
    }
    /**
     * Logs the current FS9GPS flight plan.
     */
    static logCurrentPlan() {
        return __awaiter(this, void 0, void 0, function* () {
            const waypointIdents = [];
            const totalGpsWaypoints = SimVar.GetSimVarValue('C:fs9gps:FlightPlanWaypointsNumber', 'number');
            for (let i = 0; i < totalGpsWaypoints; i++) {
                yield SimVar.SetSimVarValue('C:fs9gps:FlightPlanWaypointIndex', 'number', i);
                waypointIdents.push(SimVar.GetSimVarValue('C:fs9gps:FlightPlanWaypointIdent', 'string'));
            }
            console.log(`GPS Plan: ${waypointIdents.join(' ')}`);
        });
    }
}
exports.GPS = GPS;
//# sourceMappingURL=GPS.js.map