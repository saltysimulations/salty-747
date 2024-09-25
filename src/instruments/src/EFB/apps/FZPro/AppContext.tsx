import { PresetConfig } from "@navigraph/leaflet";
import React, { FC, ReactNode, useState } from "react";

type FZProContextProps = {
    enrouteChartPreset: PresetConfig,
    setEnrouteChartPreset: (preset: PresetConfig) => void,
};

const defaults = {
    enrouteChartPreset: { theme: "DAY", type: "Navigraph", source: "IFR HIGH", forceRetina: true },
};

export const FZProContext = React.createContext<FZProContextProps>({
    enrouteChartPreset: defaults.enrouteChartPreset as PresetConfig,
    setEnrouteChartPreset: () => {},
});

export const FZProContextProvider: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
    const [enrouteChartPreset, setEnrouteChartPreset] = useState<PresetConfig>(defaults.enrouteChartPreset as PresetConfig);

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
