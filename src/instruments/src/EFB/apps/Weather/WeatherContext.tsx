import { IMetar, ITAF } from "@ninjomcs/metar-taf-parser-msfs";
import React, { FC, ReactNode, useState } from "react";
import { cavokTheme, WeatherTheme } from "./themes";


type WeatherContextProps = {
    metar: IMetar | null;
    setMetar: (metar: IMetar | null) => void;
    taf: ITAF | null;
    setTaf: (metar: ITAF | null) => void;
    theme: WeatherTheme;
    setTheme: (theme: WeatherTheme) => void;
};

export const WeatherContext = React.createContext<WeatherContextProps>({
    metar: null,
    setMetar: () => {},
    taf: null,
    setTaf: () => {},
    theme: cavokTheme,
    setTheme: () => {},
});

export const WeatherContextProvider: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
    const [theme, setTheme] = useState<WeatherTheme>(cavokTheme);
    const [metar, setMetar] = useState<IMetar | null>(null);
    const [taf, setTaf] = useState<ITAF | null>(null);

    return (
        <WeatherContext.Provider value={{ metar, setMetar, taf, setTaf, theme, setTheme }}>{children}</WeatherContext.Provider>
    );
};
