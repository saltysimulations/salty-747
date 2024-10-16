import { useContext } from "react";
import { SettingsContext } from "../apps/Settings/SettingsContext";
import { SimBridge } from "../lib/simbridge";

export const useSimBridge = () => {
    const { simbridgePort } = useContext(SettingsContext);

    return new SimBridge(simbridgePort);
};
