import { AirportFacility, FacilityType } from "@microsoft/msfs-sdk";
import { facilityLoader, getAirportIcaoFromIdent, getIdentFromIcao } from "./facility";

export type MetarSource = "msfs" | "vatsim" | "ivao" | "pilotedge" | "aviationweather";

export type TafSource = "aviationweather" | "faa";

export type AtisSource = "faa" | "vatsim" | "ivao" | "pilotedge";

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
}
