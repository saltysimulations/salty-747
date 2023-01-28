import React, { FC } from "react";

import { ContentPageContainer } from "./components/ContentPageContainer";
import { usePersistentNumberProperty } from "@instruments/common/persistence";
import { ItemGroup } from "./components/ItemGroup";
import { Toggle } from "./components/Toggle";
import { NavigationItem } from "./components/NavigationItem";

export const Simulation: FC = () => {
    const [autoFuelManagement, setAutoFuelManagement] = usePersistentNumberProperty("AUTO_FUEL", 0);

    return (
        <ContentPageContainer title="Simulation">
            <ItemGroup>
                <Toggle label="Flight Plan Sync" enabled={autoFuelManagement === 1} onClick={(enabled) => setAutoFuelManagement(enabled ? 0 : 1)} />
                <Toggle label="Pause at T/D" enabled={autoFuelManagement === 1} onClick={(enabled) => setAutoFuelManagement(enabled ? 0 : 1)} />
                <Toggle
                    label="Automatic Fuel Management"
                    enabled={autoFuelManagement === 1}
                    onClick={(enabled) => setAutoFuelManagement(enabled ? 0 : 1)}
                />
            </ItemGroup>
            <ItemGroup>
                <NavigationItem name="Pilot Visibility" path="/settings/units" />
                <NavigationItem name="IRS Alignment" path="/settings/units" />
            </ItemGroup>
        </ContentPageContainer>
    );
};
