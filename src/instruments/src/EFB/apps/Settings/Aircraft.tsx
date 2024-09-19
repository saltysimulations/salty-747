import React, { FC } from "react";

import { ContentPageContainer } from "./components/ContentPageContainer";
import { usePersistentProperty } from "@instruments/common/persistence";
import { ItemGroup } from "../../components/ItemGroup";
import { Toggle } from "./components/Toggle";
import { NavigationItem } from "./components/NavigationItem";
import { SelectableItem } from "./components/SelectableItem";

import { BoeingAutoFuelMode, BoeingIrsAlignTimeMode, BoeingNdHdgTrkUpMode } from "../../lib/settings";
import { useSetting } from "../../hooks/useSettings";

export const Aircraft: FC = () => {
    const [trkUp, setTrkUp] = useSetting("boeingMsfsNdHdgTrkUpMode");
    const [autoFuelManagement, setAutoFuelManagement] = useSetting("boeingMsfsAutoFuelManagement");

    return (
        <ContentPageContainer title="Aircraft">
            <ItemGroup>
                <Toggle label="ND Track Up"
                        enabled={trkUp === BoeingNdHdgTrkUpMode.TRK}
                        onClick={(enabled) => setTrkUp(enabled ? BoeingNdHdgTrkUpMode.HDG : BoeingNdHdgTrkUpMode.TRK)}
                />
                <Toggle
                    label="Automatic Fuel Management"
                    enabled={autoFuelManagement === BoeingAutoFuelMode.ON}
                    onClick={(enabled) => setAutoFuelManagement(enabled ? BoeingAutoFuelMode.OFF : BoeingAutoFuelMode.ON)}
                />
            </ItemGroup>
            <ItemGroup>
                <NavigationItem name="IRS Alignment Time" path="/settings/irs-alignment" />
                <NavigationItem name="Pilot Visibility" path="/settings/pilot-visibility" />
            </ItemGroup>
        </ContentPageContainer>
    );
};

export const IRSAlignment: FC = () => {
    const [irsAlignmentTime, setirsAlignmentTime] = useSetting("boeingMsfsIrsAlignTime");

    return (
        <ContentPageContainer title="IRS Alignment Time" backProps={{ label: "Aircraft", path: "/settings/aircraft" }}>
            <ItemGroup>
                <SelectableItem label="Realistic" selected={irsAlignmentTime === BoeingIrsAlignTimeMode.Realistic} onClick={() => setirsAlignmentTime(BoeingIrsAlignTimeMode.Realistic)} />
                <SelectableItem label="Accelerated" selected={irsAlignmentTime === BoeingIrsAlignTimeMode.Accelerated} onClick={() => setirsAlignmentTime(BoeingIrsAlignTimeMode.Accelerated)} />
                <SelectableItem label="Instant" selected={irsAlignmentTime === BoeingIrsAlignTimeMode.Instant} onClick={() => setirsAlignmentTime(BoeingIrsAlignTimeMode.Instant)} />
            </ItemGroup>
        </ContentPageContainer>
    );
};

export const PilotVisibility: FC = () => {
    const [pilotVisibility, setPilotVisibility] = usePersistentProperty("PILOT_VISIBILITY", "off");

    return (
        <ContentPageContainer title="Pilot Visibility" backProps={{ label: "Aircraft", path: "/settings/aircraft" }}>
            <ItemGroup>
                <SelectableItem label="Off" selected={pilotVisibility === "off"} onClick={() => setPilotVisibility("off")} />
                <SelectableItem label="Captain Only" selected={pilotVisibility === "captain"} onClick={() => setPilotVisibility("captain")} />
                <SelectableItem label="First Officer Only" selected={pilotVisibility === "fo"} onClick={() => setPilotVisibility("fo")} />
                <SelectableItem label="Captain & First Officer" selected={pilotVisibility === "both"} onClick={() => setPilotVisibility("both")} />
            </ItemGroup>
        </ContentPageContainer>
    );
};
