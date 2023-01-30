import { usePersistentProperty } from "@instruments/common/persistence";
import React, { FC } from "react";

import { ContentPageContainer } from "./components/ContentPageContainer";
import { ItemGroup } from "./components/ItemGroup";
import { NavigationItem } from "./components/NavigationItem";
import { SelectableItem } from "./components/SelectableItem";

export const Aircraft: FC = () => (
    <ContentPageContainer title="Aircraft">
        <ItemGroup>
            <NavigationItem name="Units" path="/settings/units" />
        </ItemGroup>
    </ContentPageContainer>
);

export const Units: FC = () => {
    const [units, setUnits] = usePersistentProperty("UNITS", "kg");

    return (
        <ContentPageContainer title="Units" backProps={{ label: "Aircraft", path: "/settings/aircraft" }}>
            <ItemGroup>
                <SelectableItem label="Kilograms (kg)" selected={units === "kg"} onClick={() => setUnits("kg")} />
                <SelectableItem label="Pounds (lbs)" selected={units === "lbs"} onClick={() => setUnits("lbs")} />
            </ItemGroup>
        </ContentPageContainer>
    );
};
