/** A class for geographical mathematics. */
export declare class GeoMath {
    private static magneticModel;
    /**
     * Gets coordinates at a relative bearing and distance from a set of coordinates.
     * @param course The course, in degrees, from the reference coordinates.
     * @param distanceInNM The distance, in nautical miles, from the reference coordinates.
     * @param referenceCoordinates The reference coordinates to calculate from.
     * @returns The calculated coordinates.
     */
    static relativeBearingDistanceToCoords(course: number, distanceInNM: number, referenceCoordinates: LatLongAlt): LatLongAlt;
    /**
     * Gets a magnetic heading given a true course and a magnetic variation.
     * @param trueCourse The true course to correct.
     * @param magneticVariation The measured magnetic variation.
     * @returns The magnetic heading, corrected for magnetic variation.
     */
    static correctMagvar(trueCourse: number, magneticVariation: number): number;
    /**
     * Gets a true course given a magnetic heading and a magnetic variation.
     * @param headingMagnetic The magnetic heading to correct.
     * @param magneticVariation The measured magnetic variation.
     * @returns The true course, corrected for magnetic variation.
     */
    static removeMagvar(headingMagnetic: number, magneticVariation: number): number;
    /**
     * Gets a magnetic variation difference in 0-360 degrees.
     * @param magneticVariation The magnetic variation to normalize.
     * @returns A normalized magnetic variation.
     */
    private static normalizeMagVar;
    /**
     * Gets the magnetic variation for a given latitude and longitude.
     * @param lat The latitude to get a magvar for.
     * @param lon The longitude to get a magvar for.
     * @returns The magnetic variation at the specific latitude and longitude.
     */
    static getMagvar(lat: number, lon: number): number;
}
