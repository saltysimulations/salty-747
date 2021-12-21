/**
 * A class for mapping raw facility data to WayPoints.
 */
export declare class RawDataMapper {
    /**
     * Maps a raw facility record to a WayPoint.
     * @param facility The facility record to map.
     * @param instrument The instrument to attach to the WayPoint.
     * @returns The mapped waypoint.
     */
    static toWaypoint(facility: any, instrument: BaseInstrument): WayPoint;
    /**
     * A comparer for sorting runways by number, and then by L, C, and R.
     * @param r1 The first runway to compare.
     * @param r2 The second runway to compare.
     * @returns -1 if the first is before, 0 if equal, 1 if the first is after.
     */
    static sortRunways(r1: OneWayRunway, r2: OneWayRunway): number;
    /**
     * Generates a runway transition name from the designated runway in the transition data.
     * @param runwayTransition The runway transition to generate the name for.
     * @returns The runway transition name.
     */
    static generateRunwayTransitionName(runwayTransition: RunwayTransition): string;
    /**
     * Generates an arrival transition name from a provided arrival enroute transition.
     * @param enrouteTransition The enroute transition to generate a name for.
     * @returns The generated transition name.
     */
    static generateArrivalTransitionName(enrouteTransition: EnrouteTransition): string;
    /**
     * Generates a departure transition name from a provided departure enroute transition.
     * @param enrouteTransition The enroute transition to generate a name for.
     * @returns The generated transition name.
     */
    static generateDepartureEnRouteTransitionName(enrouteTransition: EnrouteTransition): string;
}
