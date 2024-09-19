import React, { FC } from "react";
import styled from "styled-components";

import { ListItem } from "../../../components/ListItem";

type ToggleProps = { label: string; enabled: boolean; onClick: (enabled: boolean) => void };

export const Toggle: FC<ToggleProps> = ({ label, enabled, onClick }) => (
    <ListItem noMouseDownEffect>
        <div className="side">{label}</div>
        <StyledToggle className="side" enabled={enabled} onClick={() => onClick(enabled)}>
            <StyledToggleCircle enabled={enabled} />
        </StyledToggle>
    </ListItem>
);

const StyledToggleCircle = styled.div`
    border-radius: 50%;
    width: 46px;
    height: 46px;
    margin: 0 2px;
    background: white;
    transform: ${(props: { enabled: boolean }) => (props.enabled ? "translate(35px, 0)" : "translate(0)")};
    transition: transform 0.1s linear;
`;

const StyledToggle = styled.div`
    width: 85px;
    height: 50px;
    background: ${(props: { enabled: boolean }) => (props.enabled ? "#33c961" : "#e9e9eb")};
    border-radius: 50px;
    display: flex;
    align-items: center;
`;
