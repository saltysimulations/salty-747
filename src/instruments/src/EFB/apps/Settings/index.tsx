import React, { FC } from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { Categories } from "./Categories";

export const Settings: FC = () => {
    return (
        <SettingsContainer>
            <CategoriesSection>
                <Categories />
            </CategoriesSection>
            <ContentSection>
                <Outlet />
            </ContentSection>
        </SettingsContainer>
    );
};

const CategoriesSection = styled.div`
    width: 35vw;
    height: 100vh;
    background: #f2f2f7;
    display: flex;
    justify-content: center;
    border-right: 1px solid #b9b9bb;
    flex-shrink: 0;
`;

const ContentSection = styled.div`
    height: 100vh;
    flex-grow: 1;
    background: #f2f2f7;
    display: flex;
    justify-content: center;
`;

const SettingsContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    color: black;
    font-weight: 400;
`;
