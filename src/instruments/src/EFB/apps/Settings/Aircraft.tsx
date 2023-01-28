import React, { FC, useState } from "react";

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
    const [selectedItem, setSelectedItem] = useState<string>("kg");

    return (
        <ContentPageContainer title="Units" backProps={{ label: "Aircraft", path: "/settings/aircraft" }}>
            <ItemGroup>
                <SelectableItem label="Kilograms (kg)" selected={selectedItem === "kg"} onClick={() => setSelectedItem("kg")} />
                <SelectableItem label="Pounds (lbs)" selected={selectedItem === "lbs"} onClick={() => setSelectedItem("lbs")} />
            </ItemGroup>
        </ContentPageContainer>
    );
};
