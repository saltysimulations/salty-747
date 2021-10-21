import { FlightPlanManager } from "./FlightPlanManager";
/**
 * Creating a new waypoint to be added to a flight plan.
 */
export declare class WaypointBuilder {
    /**
     * Builds a WayPoint from basic data.
     * @param ident The ident of the waypoint to be created.
     * @param coordinates The coordinates of the waypoint.
     * @param instrument The base instrument instance.
     * @returns The built waypoint.
     */
    static fromCoordinates(ident: string, coordinates: LatLongAlt, instrument: BaseInstrument): WayPoint;
    /**
     * Builds a WayPoint from a refrence waypoint.
     * @param ident The ident of the waypoint to be created.
     * @param placeCoordinates The coordinates of the reference waypoint.
     * @param bearing The magnetic bearing from the reference waypoint.
     * @param distance The distance from the reference waypoint.
     * @param instrument The base instrument instance.
     * @returns The built waypoint.
     */
    static fromPlaceBearingDistance(ident: string, placeCoordinates: LatLongAlt, bearing: number, distance: number, instrument: BaseInstrument): WayPoint;
    /**
     * Builds a WayPoint at a distance from an existing waypoint along the flight plan.
     * @param ident The ident of the waypoint to be created.
     * @param placeIndex The index of the reference waypoint in the flight plan.
     * @param distance The distance from the reference waypoint.
     * @param instrument The base instrument instance.
     * @param fpm The flightplanmanager instance.
     * @returns The built waypoint.
     */
    static fromPlaceAlongFlightPlan(ident: string, placeIndex: number, distance: number, instrument: BaseInstrument, fpm: FlightPlanManager): WayPoint;
}
