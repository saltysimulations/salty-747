import React, { FC, ReactNode, useState } from "react";
import { usePersistentProperty, usePersistentPropertyWithDefault } from "react-msfs";
import { AtisSource, MetarSource, TafSource } from "../../lib/weather";

type SettingsContextProps = {
    metarSource: MetarSource;
    setMetarSource: (source: MetarSource) => void;
    tafSource: TafSource;
    setTafSource: (source: TafSource) => void;
    atisSource: AtisSource;
    setAtisSource: (source: AtisSource) => void;
    simbridgePort: number;
    setSimbridgePort: (port: number) => void;
};

const defaults: Pick<SettingsContextProps, "metarSource" | "tafSource" | "atisSource" | "simbridgePort"> = {
    metarSource: "msfs",
    tafSource: "met",
    atisSource: "vatsim",
    simbridgePort: 8380,
};

export const SettingsContext = React.createContext<SettingsContextProps>({
    metarSource: defaults.metarSource,
    setMetarSource: () => {},
    tafSource: defaults.tafSource,
    setTafSource: () => {},
    atisSource: defaults.atisSource,
    setAtisSource: () => {},
    simbridgePort: defaults.simbridgePort,
    setSimbridgePort: () => {},
});

export const SettingsContextProvider: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
    const [metarSource, setMetarSource] = usePersistentPropertyWithDefault("SALTY_METAR_SOURCE", defaults.metarSource) as [
        MetarSource,
        (s: MetarSource) => void
    ];
    const [tafSource, setTafSource] = usePersistentPropertyWithDefault("SALTY_TAF_SOURCE", defaults.tafSource) as [
        TafSource,
        (s: TafSource) => void];

    const [atisSource, setAtisSource] = usePersistentPropertyWithDefault("SALTY_ATIS_SOURCE", defaults.atisSource) as [
        AtisSource,
        (s: AtisSource) => void
    ];

    const [simbridgePort, setSimbridgePort] = usePersistentPropertyWithDefault("SALTY_SIMBRIDGE_PORT", defaults.simbridgePort.toString());
    return (
        <SettingsContext.Provider
            value={{
                metarSource,
                setMetarSource,
                tafSource,
                setTafSource,
                atisSource,
                setAtisSource,
                simbridgePort: parseInt(simbridgePort),
                setSimbridgePort,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
