import { DefaultUserSettingManager } from "@microsoft/msfs-sdk";
import { eventBus } from "./index";

export enum BoeingNdHdgTrkUpMode {
    HDG,
    TRK
};

export enum BoeingIrsAlignTimeMode {
    Instant,
    Accelerated,
    Realistic
};

export enum BoeingAutoFuelMode {
    ON,
    OFF
};

export const boeingUserSettingsDefaults = [
    {
        name: 'boeingMsfsNdHdgTrkUpMode',
        defaultValue: BoeingNdHdgTrkUpMode.TRK as BoeingNdHdgTrkUpMode,
    },
    {
        name: 'boeingMsfsIrsAlignTime',
        defaultValue: BoeingIrsAlignTimeMode.Accelerated as BoeingIrsAlignTimeMode,
    },
    {
        name: 'boeingMsfsSelcal',
        defaultValue: 'DM-ES' as string,
    },
    {
        name: 'boeingMsfsAutoFuelManagement',
        defaultValue: BoeingAutoFuelMode.OFF as BoeingAutoFuelMode,
    },
    {
        name: 'boeingMsfsSimbriefUserID',
        defaultValue: -1 as number,
    },
    {
        name: 'boeingMsfsSimbriefUsername',
        defaultValue: '' as string,
    },
] as const;

/** Generates the UserSettingDefinition type based on the settings object */
export type BoeingSettings = {
    readonly [Item in typeof boeingUserSettingsDefaults[number]as Item['name']]: Item['defaultValue'];
};

export const boeingUserSettings = new DefaultUserSettingManager(eventBus, boeingUserSettingsDefaults);
