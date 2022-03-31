"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoMath = void 0;
const WorldMagneticModel_1 = require("./WorldMagneticModel");
/** A class for geographical mathematics. */
class GeoMath {
    /**
     * Gets coordinates at a relative bearing and distance from a set of coordinates.
     * @param course The course, in degrees, from the reference coordinates.
     * @param distanceInNM The distance, in nautical miles, from the reference coordinates.
     * @param referenceCoordinates The reference coordinates to calculate from.
     * @returns The calculated coordinates.
     */
    static relativeBearingDistanceToCoords(course, distanceInNM, referenceCoordinates) {
        const courseRadians = course * Avionics.Utils.DEG2RAD;
        const distanceRadians = (Math.PI / (180 * 60)) * distanceInNM;
        const refLat = referenceCoordinates.lat * Avionics.Utils.DEG2RAD;
        const refLon = -(referenceCoordinates.long * Avionics.Utils.DEG2RAD);
        const lat = Math.asin(Math.sin(refLat) * Math.cos(distanceRadians) + Math.cos(refLat) * Math.sin(distanceRadians) * Math.cos(courseRadians));
        const dlon = Math.atan2(Math.sin(courseRadians) * Math.sin(distanceRadians) * Math.cos(refLat), Math.cos(distanceRadians) - Math.sin(refLat) * Math.sin(lat));
        const lon = Avionics.Utils.fmod(refLon - dlon + Math.PI, 2 * Math.PI) - Math.PI;
        return new LatLongAlt(lat * Avionics.Utils.RAD2DEG, -(lon * Avionics.Utils.RAD2DEG));
    }
    /**
     * Gets a magnetic heading given a true course and a magnetic variation.
     * @param trueCourse The true course to correct.
     * @param magneticVariation The measured magnetic variation.
     * @returns The magnetic heading, corrected for magnetic variation.
     */
    static correctMagvar(trueCourse, magneticVariation) {
        return trueCourse - GeoMath.normalizeMagVar(magneticVariation);
    }
    /**
     * Gets a true course given a magnetic heading and a magnetic variation.
     * @param headingMagnetic The magnetic heading to correct.
     * @param magneticVariation The measured magnetic variation.
     * @returns The true course, corrected for magnetic variation.
     */
    static removeMagvar(headingMagnetic, magneticVariation) {
        return headingMagnetic + GeoMath.normalizeMagVar(magneticVariation);
    }
    /**
     * Gets a magnetic variation difference in 0-360 degrees.
     * @param magneticVariation The magnetic variation to normalize.
     * @returns A normalized magnetic variation.
     */
    static normalizeMagVar(magneticVariation) {
        let normalizedMagVar;
        if (magneticVariation <= 180) {
            normalizedMagVar = magneticVariation;
        }
        else {
            normalizedMagVar = magneticVariation - 360;
        }
        return normalizedMagVar;
    }
    /**
     * Gets the magnetic variation for a given latitude and longitude.
     * @param lat The latitude to get a magvar for.
     * @param lon The longitude to get a magvar for.
     * @returns The magnetic variation at the specific latitude and longitude.
     */
    static getMagvar(lat, lon) {
        return GeoMath.magneticModel.declination(0, lat, lon, 2020);
    }
}
exports.GeoMath = GeoMath;
GeoMath.magneticModel = new WorldMagneticModel_1.WorldMagneticModel();
//# sourceMappingURL=GeoMath.js.map