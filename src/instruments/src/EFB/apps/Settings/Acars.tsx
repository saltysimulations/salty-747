import React, { FC } from "react";

import { ContentPageContainer } from "./components/ContentPageContainer";
import { ItemGroup } from "../../components/ItemGroup";
import { NavigationItem } from "./components/NavigationItem";

// TODO: add sub options
export const Acars: FC = () => (
    <ContentPageContainer title="ACARS">
        <ItemGroup>
            <NavigationItem name="METAR Source" path="/settings/metar-source" />
            <NavigationItem name="TAF Source" path="/settings/taf-source" />
            <NavigationItem name="ATIS Source" path="/settings/atis-source" />
        </ItemGroup>
    </ContentPageContainer>
);

