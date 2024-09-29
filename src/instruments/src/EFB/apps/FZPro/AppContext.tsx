import { NavigraphRasterSource, PresetConfig } from "@navigraph/leaflet";
import React, { FC, ReactNode, useState } from "react";

type FZProContextProps = {
    enrouteChartPreset: PresetConfig;
    setEnrouteChartPreset: (preset: PresetConfig) => void;
    metar: string | null;
    setMetar: (metar: string | null) => void;
    taf: string | null;
    setTaf: (metar: string | null) => void;
    atis: string | null;
    setAtis: (atis: string | null) => void;
    weatherLastUpdated: Date | null;
    setWeatherLastUpdated: (date: Date | null) => void;
};

const defaults: Pick<FZProContextProps, "enrouteChartPreset"> = {
    enrouteChartPreset: { theme: "DAY", type: "Navigraph", source: "IFR HIGH", forceRetina: true },
};

export const FZProContext = React.createContext<FZProContextProps>({
    enrouteChartPreset: defaults.enrouteChartPreset,
    setEnrouteChartPreset: () => {},
    metar: null,
    setMetar: () => {},
    taf: null,
    setTaf: () => {},
    atis: null,
    setAtis: () => {},
    weatherLastUpdated: null,
    setWeatherLastUpdated: () => {},
});

export const FZProContextProvider: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
    const [enrouteChartPreset, setEnrouteChartPreset] = useState<PresetConfig>(defaults.enrouteChartPreset);
    const [metar, setMetar] = useState<string | null>(null);
    const [taf, setTaf] = useState<string | null>(null);
    const [atis, setAtis] = useState<string | null>(null);
    const [weatherLastUpdated, setWeatherLastUpdated] = useState<Date | null>(null);

    return (
        <FZProContext.Provider
            value={{
                enrouteChartPreset,
                setEnrouteChartPreset,
                metar,
                setMetar,
                taf,
                setTaf,
                atis,
                setAtis,
                weatherLastUpdated,
                setWeatherLastUpdated
            }}
        >
            {children}
        </FZProContext.Provider>
    );
};

export const sourceToLabel: Record<NavigraphRasterSource, string> = {
    "IFR HIGH": "High IFR",
    "IFR LOW": "Low IFR",
    VFR: "VFR",
    WORLD: "World",
} as const;
