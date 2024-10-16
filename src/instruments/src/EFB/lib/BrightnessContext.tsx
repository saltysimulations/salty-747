import React, { FC, ReactNode, useEffect } from "react";
import { useSimVarSyncedPersistentProperty } from "react-msfs";

export const BrightnessContext = React.createContext<{ brightness: number; setBrightness: (brightness: number) => void }>({
    brightness: 2,
    setBrightness: () => {},
});

export const BrightnessProvider: FC<{ children?: ReactNode | ReactNode[] }> = ({ children }) => {
    const [brightness, setBrightness] = useSimVarSyncedPersistentProperty("L:SALTY_EFB_BRIGHTNESS", "enum", "SALTY_EFB_BRIGHTNESS");

    useEffect(() => {
        if (!brightness) {
            setBrightness(2);
        }
    }, []);

    return <BrightnessContext.Provider value={{ brightness, setBrightness }}>{children}</BrightnessContext.Provider>;
};
