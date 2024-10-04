import { IMetar, ITAF } from "@ninjomcs/metar-taf-parser-msfs";
import React, { FC, ReactNode, useState } from "react";
import { themes, WeatherTheme } from "./themes";


type WeatherContextProps = {
    metar: IMetar | null;
    setMetar: (metar: IMetar | null) => void;
    taf: ITAF | null;
    setTaf: (metar: ITAF | null) => void;
    theme: WeatherTheme;
    setTheme: (theme: WeatherTheme) => void;
    selectedAirport: string | null;
    setSelectedAirport: (icao: string | null) => void;
};

export const WeatherContext = React.createContext<WeatherContextProps>({
    metar: null,
    setMetar: () => {},
    taf: null,
    setTaf: () => {},
    theme: themes.few,
    setTheme: () => {},
    selectedAirport: null,
    setSelectedAirport: () => {},
});

export const WeatherContextProvider: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
    const [theme, setTheme] = useState<WeatherTheme>(themes.few);
    const [metar, setMetar] = useState<IMetar | null>(null);
    const [taf, setTaf] = useState<ITAF | null>(null);
    const [selectedAirport, setSelectedAirport] = useState<string | null>(null);

    return (
        <WeatherContext.Provider value={{ metar, setMetar, taf, setTaf, theme, setTheme, selectedAirport, setSelectedAirport }}>
            {children}
        </WeatherContext.Provider>
    );
};
