import { NavigraphRasterSource, PresetConfig } from "@navigraph/leaflet";
import React, { FC, ReactNode, useState } from "react";

type FZProContextProps = {
    enrouteChartPreset: PresetConfig,
    setEnrouteChartPreset: (preset: PresetConfig) => void,
};

const defaults: Pick<FZProContextProps, "enrouteChartPreset"> = {
    enrouteChartPreset: { theme: "DAY", type: "Navigraph", source: "IFR HIGH", forceRetina: true },
};

export const FZProContext = React.createContext<FZProContextProps>({
    enrouteChartPreset: defaults.enrouteChartPreset,
    setEnrouteChartPreset: () => {},
});

export const FZProContextProvider: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
    const [enrouteChartPreset, setEnrouteChartPreset] = useState<PresetConfig>(defaults.enrouteChartPreset);

    return (
        <FZProContext.Provider
            value={{
                enrouteChartPreset,
                setEnrouteChartPreset,
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
