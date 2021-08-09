import { TerrainAPI } from "./TerrainAPI";
import { GeoMath } from "../fpm/flightplanning/GeoMath";

enum GPWSAlert {
    Terrain = "SALTY_TERRAIN",
    CautionTerrain = "SALTY_CAUTION_TERRAIN",
    TooLowTerrain = "SALTY_TOO_LOW_TERRAIN",
    PullUp = "SALTY_PULL_UP",
}

export class GPWS {
    private api = new TerrainAPI("https://api.open-elevation.com/api/v1/");
    private timeSinceLastQuery = 0;

    public update(deltaTime: number) {
        // Only query every few seconds to avoid spamming the API with requests
        this.timeSinceLastQuery += deltaTime / 1000;
        if (this.timeSinceLastQuery >= 3) {
            this.timeSinceLastQuery = 0;
        } else return;

        const projectedCoords = this.projectedCoordinatesInSeconds(30);

        console.log(
            `Current coordinates: ${SimVar.GetSimVarValue("PLANE LATITUDE", "Degrees")} ${SimVar.GetSimVarValue("PLANE LONGITUDE", "Degrees")}`
        );
        console.log(`Projected coordintes in 30 seconds: ${projectedCoords.lat} ${projectedCoords.long}`);
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

    private enableAlert(alert: GPWSAlert) {
        !SimVar.GetSimVarValue(`L:${alert}`, "Boolean") && SimVar.SetSimVarValue(`L:${alert}`, "Boolean", 1);
    }

    private removeAlert(alert: GPWSAlert) {
        SimVar.GetSimVarValue(`L:${alert}`, "Boolean") && SimVar.SetSimVarValue(`L:${alert}`, "Boolean", 0);
    }
}
