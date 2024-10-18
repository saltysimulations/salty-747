import { AirportFacility, FacilityType } from "@microsoft/msfs-sdk";
import { CloudQuantity, DistanceUnit, ICloud, Visibility } from "@ninjomcs/metar-taf-parser-msfs";
import { facilityLoader, getAirportIcaoFromIdent, getIdentFromIcao } from "./facility";

export type MetarSource = "msfs" | "vatsim" | "ivao" | "pilotedge" | "aviationweather";

export type TafSource = "met" | "aviationweather" | "faa";

export type AtisSource = "faa" | "vatsim" | "ivao" | "pilotedge";

export type FlightCategory = "VFR" | "MVFR" | "IFR" | "LIFR";

export class WeatherData {
    private static URL = "https://api.flybywiresim.com";

    public static async fetchMetar(airport: string, source: MetarSource): Promise<string | null> {
        if (source === "msfs") {
            const facility = await facilityLoader.getFacility(FacilityType.Airport, getAirportIcaoFromIdent(airport));
            const metar = await facilityLoader.getMetar(facility);

            if (metar) {
                return metar.metarString;
            }

            return null;
        }

        const metar = await fetch(`${WeatherData.URL}/metar/${airport}?source=${source}`);

        if (!metar.ok) {
            if (metar.status === 404) {
                return null;
            }
            throw new Error(`Failed to fetch METAR: ${metar.status} ${metar.statusText}`);
        }

        const json = await metar.json();

        return json.metar;
    }

    public static async fetchTaf(airport: string, source: TafSource): Promise<string | null> {
        if (source === "met") {
            const taf = await fetch(`https://api.met.no/weatherapi/tafmetar/1.0/taf.txt?icao=${airport}`);
            const txt = await taf.text();
            const lines = txt.split("\n");
            const filtered = lines.filter((val) => val != "");

            if (!taf.ok) {
                if (taf.status === 404) {
                    return null;
                }
                throw new Error(`Failed to fetch TAF: ${taf.status} ${taf.statusText}`);
            }

            if (filtered.length === 0) {
                return null;
            }

            return filtered[filtered.length - 1];
        }

        const taf = await fetch(`${WeatherData.URL}/taf/${airport}?source=${source}`);

        if (!taf.ok) {
            if (taf.status === 404) {
                return null;
            }
            throw new Error(`Failed to fetch TAF: ${taf.status} ${taf.statusText}`);
        }

        const json = await taf.json();

        return json.taf;
    }

    public static async fetchAtis(airport: string, source: AtisSource): Promise<string | null> {
        const atis = await fetch(`${WeatherData.URL}/atis/${airport}?source=${source}`);

        if (!atis.ok) {
            if (atis.status === 404) {
                return null;
            }
            throw new Error(`Failed to fetch ATIS: ${atis.status} ${atis.statusText}`);
        }

        const json = await atis.json();

        return json.combined;
    }

    public static getFlightCategory(visibility: Visibility | undefined, clouds: ICloud[], verticalVisibility?: number): FlightCategory {
        const convertedVisibility = WeatherData.convertToMiles(visibility);
        const distance = convertedVisibility != null ? convertedVisibility : Infinity;
        const height = WeatherData.determineCeilingFromClouds(clouds)?.height ?? verticalVisibility ?? Infinity;

        let flightCategory: FlightCategory = "VFR";

        if (height <= 3000 || distance <= 5) flightCategory = "MVFR";
        if (height < 1000 || distance < 3) flightCategory = "IFR";
        if (height < 500 || distance < 1) flightCategory = "LIFR";

        return flightCategory;
    }

    public static convertToMiles(visibility?: Visibility): number | undefined {
        if (!visibility) return;

        switch (visibility.unit) {
            case DistanceUnit.StatuteMiles:
                return visibility.value;
            case DistanceUnit.Meters:
                const distance = visibility.value * 0.000621371;

                if (visibility.value % 1000 === 0 || visibility.value === 9999) return Math.round(distance);

                return +distance.toFixed(2);
        }
    }

    public static determineCeilingFromClouds(clouds: ICloud[]): ICloud | undefined {
        let ceiling: ICloud | undefined;

        clouds.forEach((cloud) => {
            if (
                cloud.height != null &&
                cloud.height < (ceiling?.height || Infinity) &&
                (cloud.quantity === CloudQuantity.OVC || cloud.quantity === CloudQuantity.BKN)
            )
                ceiling = cloud;
        });

        return ceiling;
    }
}
