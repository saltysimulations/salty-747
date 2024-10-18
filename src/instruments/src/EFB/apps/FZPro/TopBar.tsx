import React, { FC, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { MdSatelliteAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

type TopBarProps = {
    setFlightDisplayed: (toggled: boolean) => void;
    flightDisplayed: boolean;
    viewingTop: string;
    viewingBottom: string | null;
};

export const TopBar: FC<TopBarProps> = ({ setFlightDisplayed, flightDisplayed, viewingTop, viewingBottom }) => {

    const navigate = useNavigate();

    return (
        <>
            <StatusBarFill />
            <StyledTopBar>
                <TopBarSection>
                    <TopBarItem selected={flightDisplayed} onClick={() => setFlightDisplayed(!flightDisplayed)}>
                        Flight
                    </TopBarItem>
                </TopBarSection>
                <TopBarSection>
                    <Viewing>
                        <div>{viewingTop}</div>
                        {viewingBottom && <div style={{ fontSize: "20px", fontWeight: "400", color: "lightgray" }}>{viewingBottom}</div>}
                    </Viewing>
                </TopBarSection>
                <TopBarSection>
                    <Icons>
                        <MdSatelliteAlt size={35} fill="white" />
                        <IoMdSettings size={40} onClick={() => navigate("/settings/general")} />
                    </Icons>
                </TopBarSection>
            </StyledTopBar>
        </>
    );
};

const Icons = styled.div`
    display: flex;
    margin: auto;
    flex: 1;
    justify-content: flex-end;
    align-items: center;

    * {
        margin: 0 20px;
    }
`;

const Viewing = styled.div`
    font-size: 26px;
    display: flex;
    flex-direction: column;
    margin: auto;
    align-items: center;
    text-align: center;

    * {
        margin: 1px 0;
    }
`;

const TopBarSection = styled.div`
    flex: 1;
    display: flex;
`;

const StatusBarFill = styled.div`
    width: 100%;
    height: 32px;
    background: #22242d;
`;

const TopBarItem = styled.div`
    margin: 15px 10px;
    padding: 10px 20px;
    background: ${(props: { selected?: boolean }) => (props.selected ? "#017ACA" : "#40444D")};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    border-radius: 8px;
`;

const StyledTopBar = styled.div`
    width: 100%;
    background: #22242d;
    display: flex;
    font-weight: 500;
`;
