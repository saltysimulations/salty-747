import React, { createContext, FC, ReactNode, useState } from "react";
import { AirportFacility, ArrivalProcedure, DepartureProcedure, OneWayRunway } from "@microsoft/msfs-sdk";

type Flight = {
    departureAirport: AirportFacility | null,
    setDepartureAirport: (airport: AirportFacility | null) => void,
    arrivalAirport: AirportFacility | null,
    setArrivalAirport: (airport: AirportFacility | null) => void,
    departureRunway: OneWayRunway | null,
    setDepartureRunway: (runway: OneWayRunway | null) => void,
    arrivalRunway: OneWayRunway | null,
    setArrivalRunway: (runway: OneWayRunway | null) => void,
    departureProcedure: DepartureProcedure | null,
    setDepartureProcedure: (procedure: DepartureProcedure | null) => void,
    arrivalProcedure: ArrivalProcedure | null,
    setArrivalProcedure: (procedure: ArrivalProcedure | null) => void,
}

export const FlightContext = createContext<Flight>({
    arrivalAirport: null,
    arrivalProcedure: null,
    arrivalRunway: null,
    departureAirport: null,
    departureProcedure: null,
    departureRunway: null,
    setArrivalAirport: () => {},
    setArrivalProcedure: () => {},
    setArrivalRunway: () =>  {},
    setDepartureAirport: () => {},
    setDepartureProcedure: () => {},
    setDepartureRunway: () => {}
});

export const FlightProvider: FC<{ children: ReactNode | ReactNode[]}> = ({ children }) => {
    const [departureAirport, setDepartureAirport] = useState<AirportFacility | null>(null);
    const [arrivalAirport, setArrivalAirport] = useState<AirportFacility | null>(null);
    const [departureRunway, setDepartureRunway] = useState<OneWayRunway | null>(null);
    const [arrivalRunway, setArrivalRunway] = useState<OneWayRunway | null>(null);
    const [departureProcedure, setDepartureProcedure] = useState<DepartureProcedure| null> (null);
    const [arrivalProcedure, setArrivalProcedure] = useState<ArrivalProcedure | null>(null);

    return (
        <FlightContext.Provider value={{
            departureAirport,
            setDepartureAirport,
            arrivalAirport,
            setArrivalAirport,
            departureRunway,
            setDepartureRunway,
            arrivalRunway,
            setArrivalRunway,
            departureProcedure,
            setDepartureProcedure,
            arrivalProcedure,
            setArrivalProcedure
        }}>
            {children}
        </FlightContext.Provider>
    );
};

export const getDisplayArray = (flight: Flight): string[] => {
    const array = [];

    if (flight.departureRunway && flight.departureProcedure) {
        array.unshift(`RW${flight.departureRunway.designation}.${flight.departureProcedure.name}`)
    }

    if (flight.arrivalRunway && flight.arrivalProcedure) {
        array.push(`${flight.arrivalProcedure?.name}.RW${flight.arrivalRunway?.designation}`)
    }

    return array;
};