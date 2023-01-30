import React, { FC } from "react";

import { ContentPageContainer } from "./components/ContentPageContainer";
import { usePersistentNumberProperty, usePersistentProperty } from "@instruments/common/persistence";
import { ItemGroup } from "./components/ItemGroup";
import { Toggle } from "./components/Toggle";
import { NavigationItem } from "./components/NavigationItem";
import { SelectableItem } from "./components/SelectableItem";

export const Simulation: FC = () => {
    const [autoFuelManagement, setAutoFuelManagement] = usePersistentNumberProperty("AUTO_FUEL", 0);
    const [fpSync, setFpSync] = usePersistentNumberProperty("FP_SYNC", 0);
    const [pauseAtTd, setPauseAtTd] = usePersistentNumberProperty("PAUSE_AT_TD", 0);

    return (
        <ContentPageContainer title="Simulation">
            <ItemGroup>
                <Toggle label="Flight Plan Sync" enabled={fpSync === 1} onClick={(enabled) => setFpSync(enabled ? 0 : 1)} />
                <Toggle label="Pause at T/D" enabled={pauseAtTd === 1} onClick={(enabled) => setPauseAtTd(enabled ? 0 : 1)} />
                <Toggle
                    label="Automatic Fuel Management"
                    enabled={autoFuelManagement === 1}
                    onClick={(enabled) => setAutoFuelManagement(enabled ? 0 : 1)}
                />
            </ItemGroup>
            <ItemGroup>
                <NavigationItem name="Pilot Visibility" path="/settings/pilot-visibility" />
                <NavigationItem name="IRS Alignment" path="/settings/units" />
            </ItemGroup>
        </ContentPageContainer>
    );
};

export const PilotVisibility: FC = () => {
    const [pilotVisibility, setPilotVisibility] = usePersistentProperty("PILOT_VISIBILITY", "off");

    return (
        <ContentPageContainer title="Pilot Visibility" backProps={{ label: "Simulation", path: "/settings/simulation" }}>
            <ItemGroup>
                <SelectableItem label="Off" selected={pilotVisibility === "off"} onClick={() => setPilotVisibility("off")} />
                <SelectableItem label="Captain Only" selected={pilotVisibility === "captain"} onClick={() => setPilotVisibility("captain")} />
                <SelectableItem label="First Officer Only" selected={pilotVisibility === "fo"} onClick={() => setPilotVisibility("fo")} />
                <SelectableItem label="Captain & First Officer" selected={pilotVisibility === "both"} onClick={() => setPilotVisibility("both")} />
            </ItemGroup>
        </ContentPageContainer>
    );
};
