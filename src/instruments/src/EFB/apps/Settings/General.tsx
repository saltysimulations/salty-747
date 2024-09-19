import React, { FC } from "react";

import { ContentPageContainer } from "./components/ContentPageContainer";
import { ItemGroup } from "../../components/ItemGroup";
import { NavigationItem } from "./components/NavigationItem";

export const General: FC = () => {
    return (
        <ContentPageContainer title="General">
            <ItemGroup>
                <NavigationItem name="About" path="/settings/about" />
            </ItemGroup>
            <ItemGroup>
                <NavigationItem name="Game Controller" gray />
                <NavigationItem name="Language & Region" />
                <NavigationItem name="Fonts" gray />
            </ItemGroup>
            <ItemGroup>
                <NavigationItem name="Reset" />
            </ItemGroup>
        </ContentPageContainer>
    );
};


