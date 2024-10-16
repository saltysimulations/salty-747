import { SimbriefOfp, AirportFacility, FacilityType } from "@microsoft/msfs-sdk";
import React, { FC, useState, useEffect } from "react";
import { facilityLoader, getAirportIcaoFromIdent, getIdentFromIcao } from "../../lib/facility";
import { AirportSelectorItem } from "./AirportSelectorItem";

type OfpAirportsProps = { ofp: SimbriefOfp; selectedAirport: string | null; setSelectedAirport: (ident: string) => void };

export const OfpAirports: FC<OfpAirportsProps> = ({ ofp, selectedAirport, setSelectedAirport }) => {
    const [origin, setOrigin] = useState<AirportFacility>();
    const [destination, setDestination] = useState<AirportFacility>();
    const [alternate, setAlternate] = useState<AirportFacility>();

    useEffect(() => {
        const setFacilities = async () => {
            setOrigin(await facilityLoader.getFacility(FacilityType.Airport, getAirportIcaoFromIdent(ofp.origin.icao_code)));
            setDestination(await facilityLoader.getFacility(FacilityType.Airport, getAirportIcaoFromIdent(ofp.destination.icao_code)));
            "icao_code" in ofp.alternate &&
                setAlternate(await facilityLoader.getFacility(FacilityType.Airport, getAirportIcaoFromIdent(ofp.alternate.icao_code)));
        };

        setFacilities();
    }, []);

    return (
        <>
            {origin && (
                <AirportSelectorItem
                    airport={origin}
                    isSelected={getIdentFromIcao(origin.icao) === selectedAirport}
                    label="Origin"
                    single
                    onClick={() => setSelectedAirport(getIdentFromIcao(origin.icao))}
                />
            )}
            {destination && (
                <AirportSelectorItem
                    airport={destination}
                    isSelected={getIdentFromIcao(destination.icao) === selectedAirport}
                    label="Destination"
                    single
                    onClick={() => setSelectedAirport(getIdentFromIcao(destination.icao))}
                />
            )}
            {alternate && (
                <AirportSelectorItem
                    airport={alternate}
                    isSelected={getIdentFromIcao(alternate.icao) === selectedAirport}
                    label="Alternate"
                    single
                    onClick={() => setSelectedAirport(getIdentFromIcao(alternate.icao))}
                />
            )}
        </>
    );
};
