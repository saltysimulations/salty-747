import { useEffect, useState } from "react";
import { BoeingSettings, boeingUserSettings, boeingUserSettingsDefaults } from "../lib/settings";


export const useSetting = <T extends keyof BoeingSettings & string>(setting: T) => {
    const defaultValue = boeingUserSettingsDefaults.find(obj => obj.name === setting)!.defaultValue;

    const [state, setState] = useState<typeof defaultValue>(defaultValue);

    useEffect(() => {
        const sub = boeingUserSettings.getSetting(setting)
            .sub((value) => setState(value as typeof defaultValue), true);

        return () => sub.destroy();
    }, []);

    return [
        state,
        (newValue: typeof defaultValue) => boeingUserSettings.getSetting(setting).set(newValue)
    ] as const;
}
