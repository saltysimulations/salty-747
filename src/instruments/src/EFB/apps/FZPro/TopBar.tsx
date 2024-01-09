import React, { FC } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

export const TopBar: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isNothingSelected = location.pathname === "/fzpro";

    return (
        <>
            <StatusBarFill />
            <StyledTopBar>
                <TopBarItem selected={location.pathname === "/fzpro/flight"}
                            onClick={() => navigate(isNothingSelected ? "/fzpro/flight" : "/fzpro")}>Flight</TopBarItem>
                <TopBarItem>Route Info</TopBarItem>
                <TopBarItem>Pubs</TopBarItem>
            </StyledTopBar>
        </>
    )
};

const StatusBarFill = styled.div`
    width: 100%;
    height: 32px;
    background: #22242D;
`;

const TopBarItem = styled.div`
    margin: 15px 10px;
    padding: 10px 20px;
    background: ${(props: { selected?: boolean }) => props.selected ? "#017ACA" : "#40444D"};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    border-radius: 8px;
`;

const StyledTopBar = styled.div`
    width: 100%;
    background: #22242D;
    display: flex;
`;