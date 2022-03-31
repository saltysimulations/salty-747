/** Generates fix names based on the ARINC default naming scheme. */
export declare class FixNamingScheme {
    private static alphabet;
    /**
     * Generates a fix name for a course to distance type fix.
     * @param course The course that will be flown.
     * @param distance The distance along the course or from the reference fix.
     * @returns The generated fix name.
     */
    static courseToDistance(course: number, distance: number): string;
    /**
     * Generates a fix name for a course turn to intercept type fix.
     * @param course The course that will be turned to.
     * @returns The generated fix name.
     */
    static courseToIntercept(course: number): string;
}
