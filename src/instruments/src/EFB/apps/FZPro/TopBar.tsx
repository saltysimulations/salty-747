import React, { FC, useState } from "react";
import styled from "styled-components";

export const TopBar: FC<{ setFlightDisplayed: (toggled: boolean) => void }> = ({ setFlightDisplayed }) => {
    const [flight, setFlight] = useState<boolean>(false);

    return (
        <>
            <StatusBarFill />
            <StyledTopBar>
                <TopBarItem
                    selected={flight}
                    onClick={() => {
                        setFlight(!flight);
                        setFlightDisplayed(!flight);
                    }}
                >
                    Flight
                </TopBarItem>
                <TopBarItem>Route Info</TopBarItem>
                <TopBarItem>Pubs</TopBarItem>
            </StyledTopBar>
        </>
    );
};

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
`;
