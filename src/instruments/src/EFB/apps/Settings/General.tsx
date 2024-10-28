import React, { FC } from "react";

import { ContentPageContainer } from "./components/ContentPageContainer";
import { ItemGroup } from "../../components/ItemGroup";
import { NavigationItem } from "./components/NavigationItem";

export const General: FC = () => {
    return (
        <ContentPageContainer title="General">
            <ItemGroup>
                <NavigationItem name="About" path="/settings/about" />
                <NavigationItem name="Language & Region" gray />
            </ItemGroup>
            <ItemGroup>
                <NavigationItem name="Reset" gray />
            </ItemGroup>
        </ContentPageContainer>
    );
};


