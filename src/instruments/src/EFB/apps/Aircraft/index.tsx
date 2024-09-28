import React, { FC, useState } from "react";
import styled from "styled-components";
import { Outlet, useNavigate } from "react-router-dom";
import { FaTruckLoading, FaTruck } from "react-icons/fa";

export const Aircraft: FC = () => (
    <AircraftContainer>
        <StyledContent>
            <Outlet />
        </StyledContent>
        <TabSwitcher />
    </AircraftContainer>
);

const TabSwitcher: FC = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState<string>("ground-services");

    const updateTab = (name: string) => {
        setTab(name);
        navigate(`/aircraft/${name}`);
    };

    return (
        <StyledTabSwitcher>
            <div className="container">
                <Tab selected={tab === "ground-services"} onClick={() => updateTab("ground-services")}>
                    <FaTruck fill={tab === "ground-services" ? "#4FA0FC" : "#999999"} size={35} />
                    <div>Ground Services</div>
                </Tab>
                <Tab selected={tab === "payload"} onClick={() => updateTab("payload")}>
                    <FaTruckLoading fill={tab === "payload" ? "#4FA0FC" : "#999999"} size={35} />
                    <div>Fuel & Payload</div>
                </Tab>
            </div>
        </StyledTabSwitcher>
    );
};

const Tab = styled.div`
    display: flex;
    align-items: center;
    color: ${(props: { selected: boolean }) => (props.selected ? "#4FA0FC" : "#999999")};
    white-space: nowrap;

    * {
        margin: 0 7px;
    }
`;

const StyledContent = styled.div`
    width: 100%;
    flex: 1;
    background: #ffffff;
`;

const StyledTabSwitcher = styled.div`
    width: 100%;
    height: 90px;
    background: #f9f9f9;
    border-top: 1px solid lightgray;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    justify-content: center;

    .container {
        width: 80%;
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
`;

const AircraftContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
`;
