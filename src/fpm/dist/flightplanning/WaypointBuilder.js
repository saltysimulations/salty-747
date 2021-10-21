"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaypointBuilder = void 0;
const GeoMath_1 = require("./GeoMath");
/**
 * Creating a new waypoint to be added to a flight plan.
 */
class WaypointBuilder {
    /**
     * Builds a WayPoint from basic data.
     * @param ident The ident of the waypoint to be created.
     * @param coordinates The coordinates of the waypoint.
     * @param instrument The base instrument instance.
     * @returns The built waypoint.
     */
    static fromCoordinates(ident, coordinates, instrument) {
        const waypoint = new WayPoint(instrument);
        waypoint.type = 'W';
        waypoint.infos = new IntersectionInfo(instrument);
        waypoint.infos.coordinates = coordinates;
        waypoint.ident = ident;
        waypoint.infos.ident = ident;
        return waypoint;
    }
    /**
     * Builds a WayPoint from a refrence waypoint.
     * @param ident The ident of the waypoint to be created.
     * @param placeCoordinates The coordinates of the reference waypoint.
     * @param bearing The magnetic bearing from the reference waypoint.
     * @param distance The distance from the reference waypoint.
     * @param instrument The base instrument instance.
     * @returns The built waypoint.
     */
    static fromPlaceBearingDistance(ident, placeCoordinates, bearing, distance, instrument) {
        const magvar = GeoMath_1.GeoMath.getMagvar(placeCoordinates.lat, placeCoordinates.long);
        let trueBearing = GeoMath_1.GeoMath.removeMagvar(bearing, magvar);
        trueBearing = trueBearing < 0 ? 360 + trueBearing : trueBearing > 360 ? trueBearing - 360 : trueBearing;
        const coordinates = Avionics.Utils.bearingDistanceToCoordinates(trueBearing, distance, placeCoordinates.lat, placeCoordinates.long);
        return WaypointBuilder.fromCoordinates(ident, coordinates, instrument);
    }
    /**
     * Builds a WayPoint at a distance from an existing waypoint along the flight plan.
     * @param ident The ident of the waypoint to be created.
     * @param placeIndex The index of the reference waypoint in the flight plan.
     * @param distance The distance from the reference waypoint.
     * @param instrument The base instrument instance.
     * @param fpm The flightplanmanager instance.
     * @returns The built waypoint.
     */
    static fromPlaceAlongFlightPlan(ident, placeIndex, distance, instrument, fpm) {
        console.log("running fromPlaceAlongFlightPlan");
        console.log("destination? " + fpm.getDestination() ? "True" : "False");
        const destinationDistanceInFlightplan = fpm.getDestination().cumulativeDistanceInFP;
        console.log("destinationDistanceInFlightplan " + destinationDistanceInFlightplan);
        const placeDistanceFromDestination = fpm.getWaypoint(placeIndex, NaN, true).cumulativeDistanceInFP;
        console.log("placeDistanceFromDestination " + placeDistanceFromDestination);
        const distanceFromDestination = destinationDistanceInFlightplan - placeDistanceFromDestination - distance;
        console.log("distanceFromDestination " + distanceFromDestination);
        const coordinates = fpm.getCoordinatesAtNMFromDestinationAlongFlightPlan(distanceFromDestination);
        return WaypointBuilder.fromCoordinates(ident, coordinates, instrument);
    }
}
exports.WaypointBuilder = WaypointBuilder;
//# sourceMappingURL=WaypointBuilder.js.map