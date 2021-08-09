import { TerrainAPI } from "./TerrainAPI";
import { GeoMath } from "../fpm/flightplanning/GeoMath";

enum GPWSAlert {
    Terrain = "SALTY_TERRAIN",
    TerrainTerrain = "SALTY_TERRAIN_TERRAIN",
    CautionTerrain = "SALTY_CAUTION_TERRAIN",
    TooLowTerrain = "SALTY_TOO_LOW_TERRAIN",
    PullUp = "SALTY_PULL_UP",
}

/**
 * A simulation of the Honeywell MK V / MK VII Enhanced Ground Proximity Warning System (EGPWS)
 */
export class GPWS {
    private api = new TerrainAPI("https://api.open-elevation.com/api/v1/");
    private timeSinceLastQuery = 0;

    public update(deltaTime: number) {
        // Only query every few seconds to avoid spamming the API with requests
        this.timeSinceLastQuery += deltaTime / 1000;
        if (this.timeSinceLastQuery >= 3) {
            this.timeSinceLastQuery = 0;
        } else return;

        if (SimVar.GetSimVarValue("SIM ON GROUND", "Boolean")) return;

        const queryCoordinates = this.getNeededCoordinateQueries();

        this.api
            .elevationAtCoords(queryCoordinates)
            .then((elevations) => {
                /* for (const [key, value] of elevations) {
                    console.log(`${key.lat}, ${key.long} elevation: ${value}`);
                } */
                console.log("Successfully queried API")
                this.determineLookAheadAlerting(Array.from(elevations.values()));
            })
            .catch((e) => console.log(e));
    }

    /**
     * Get projected coordinates after a set amount of seconds
     * @param seconds Seconds to get the projected coordinate
     * @returns The projected coordinates
     */
    private projectedCoordinatesInSeconds(seconds: number): LatLongAlt {
        const speed = SimVar.GetSimVarValue("AIRSPEED INDICATED", "knots");
        const heading = SimVar.GetSimVarValue("PLANE HEADING DEGREES TRUE", "Radians") * Avionics.Utils.RAD2DEG;
        const referenceCoordinates = new LatLongAlt(
            SimVar.GetSimVarValue("PLANE LATITUDE", "Degrees"),
            SimVar.GetSimVarValue("PLANE LONGITUDE", "Degrees")
        );

        const projectedDistance = (speed * seconds) / 3600;
        const projectedCoordinates = GeoMath.relativeBearingDistanceToCoords(heading, projectedDistance, referenceCoordinates);

        return projectedCoordinates;
    }

    /**
     * Get projected altitude after a set amount of seconds
     * @param seconds Seconds to get the projected altitude
     * @returns The projected altitude
     */
    private projectedAltitudeInSeconds(seconds: number): number {
        const verticalSpeed = SimVar.GetSimVarValue("VERTICAL SPEED", "feet per second");
        const altitude = SimVar.GetSimVarValue("PLANE ALTITUDE", "feet");

        return altitude - (verticalSpeed >= 0 ? -(verticalSpeed * seconds) : Math.abs(verticalSpeed * seconds));
    }

    /**
     * Gets the projected coordintes for the next 60 seconds
     * @returns Array of projected coordintes
     */
    private getNeededCoordinateQueries(): LatLongAlt[] {
        const coordinates = [];

        for (let i = 1; i <= 60; i++) {
            coordinates.push(this.projectedCoordinatesInSeconds(i));
        }

        return coordinates;
    }

    /**
     * Simulate look ahead terrain alerting
     * @param elevations The elevations for the next 60 seconds, array index is second - 1
     */
    private determineLookAheadAlerting(elevations: number[]) {
        for (let i = 0; i < elevations.length; i++) {
            const projectedAltitude = this.projectedAltitudeInSeconds(i);

            if (i <= 29 && projectedAltitude <= elevations[i]) {
                console.log(`TERRAIN TERRAIN PULL UP ${projectedAltitude} ${elevations[i]}`);
                break;
            } else if (i > 29 && projectedAltitude <= elevations[i]) {
                console.log(`CAUTION TERRAIN ${projectedAltitude} ${elevations[i]}`);
                break;
            } else {
                console.log("NO WARNING");
            }
        }
    }

    private enableAlert(alert: GPWSAlert) {
        !SimVar.GetSimVarValue(`L:${alert}`, "Boolean") && SimVar.SetSimVarValue(`L:${alert}`, "Boolean", 1);
    }

    private removeAlert(alert: GPWSAlert) {
        SimVar.GetSimVarValue(`L:${alert}`, "Boolean") && SimVar.SetSimVarValue(`L:${alert}`, "Boolean", 0);
    }
}
