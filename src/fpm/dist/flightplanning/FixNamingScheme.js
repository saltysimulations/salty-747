"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixNamingScheme = void 0;
/** Generates fix names based on the ARINC default naming scheme. */
class FixNamingScheme {
    /**
     * Generates a fix name for a course to distance type fix.
     * @param course The course that will be flown.
     * @param distance The distance along the course or from the reference fix.
     * @returns The generated fix name.
     */
    static courseToDistance(course, distance) {
        const roundedDistance = Math.round(distance);
        const distanceAlpha = distance > 26 ? 'Z' : this.alphabet[roundedDistance];
        return `D${course.toFixed(0).padStart(3, '0')}${distanceAlpha}`;
    }
    /**
     * Generates a fix name for a course turn to intercept type fix.
     * @param course The course that will be turned to.
     * @returns The generated fix name.
     */
    static courseToIntercept(course) {
        return `I${course.toFixed(0).padStart(3, '0')}`;
    }
}
exports.FixNamingScheme = FixNamingScheme;
FixNamingScheme.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
//# sourceMappingURL=FixNamingScheme.js.map