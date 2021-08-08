interface TerrainResponse {
    results: [{
        latitude: number,
        longitude: number,
        elevation: number,
    }]
}

/**
 * A class for querying the Open Elevation API
 */
export class TerrainAPI {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    /**
     * Get the elevation at a specific location
     * @param coordinates The coordinates to get the elevation at
     * @returns A map of coordinates with the associated elevation
     */
    public async elevationAtCoords(coordinates: LatLongAlt[]): Promise<Map<LatLongAlt, number>> {
        const map = new Map<LatLongAlt, number>();
        const query = this.getQueryFromArray(coordinates);
        const data = await fetch(`${this.url}lookup?locations=${query}`);
        const elevationData: TerrainResponse = await data.json();

        for (let i = 0; i < coordinates.length; i++) {
            map.set(coordinates[i], elevationData.results[i].elevation);
        }

        return map;
    }

    private getQueryFromArray(coordinates: LatLongAlt[]): string {
        const query = [];
        for (const coordinate of coordinates) {
            const tempCoordinates = [coordinate.lat, coordinate.long];
            query.push(tempCoordinates.join());
        }

        return query.join("|");
    }
}
