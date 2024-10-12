import React, { FC, ReactNode, useContext } from "react";

import { ContentPageContainer } from "./components/ContentPageContainer";
import { ItemGroup } from "../../components/ItemGroup";
import styled from "styled-components";
import { ListItem } from "../../components/ListItem";

import saltyLogo from "../../img/salty-logo.svg";

export const About: FC = () => (
    <ContentPageContainer title="About" backProps={{ label: "General", path: "/settings/general" }}>
        <ItemGroup>
            <ListItem>
                <Name>Name</Name>
                <Value>saltPad</Value>
            </ListItem>
            <ListItem>
                <Name>saltPadOS Version</Name>
                <Value>1.0</Value>
            </ListItem>
            <ListItem>
                <Name>74S Version</Name>
                <Value>0.7.0</Value>
            </ListItem>
        </ItemGroup>
        <LicenseContainer>
            <div className="margin">Copyright (C) 2024 Salty Simulations and its contributors</div>
            <div className="margin">
                This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published
                by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
            </div>
            <div>
                This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
                MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
            </div>
            <div className="me">Written with &lt;3 by Natalie &lt;hi@ninjo.gay&gt;</div>
        </LicenseContainer>
        <img src={saltyLogo} width={350} />
    </ContentPageContainer>
);



const Name = styled.div`
    margin: 0 25px;
`;

const Value = styled.div`
    margin: 0 25px;
    color: gray;
`;

const LicenseContainer = styled.div`
    padding: 25px;
    background: ${(props) => props.theme.primary};
    color: ${(props) => props.theme.text};
    border-radius: 25px;
    margin-bottom: 50px;
    text-align: start;
    font-size: 22px;
    border: 1px solid ${(props) => props.theme.border};

    .me {
        margin-top: 16px;
    }

    .margin {
        margin-bottom: 8px;
    }
`;
