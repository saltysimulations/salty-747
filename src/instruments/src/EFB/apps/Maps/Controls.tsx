import React, { FC } from "react";
import styled, { css } from "styled-components";
import { FiNavigation, FiInfo } from "react-icons/fi";

export const Controls: FC = () => (
    <ControlsContainer>
        <ControlItem top>
            <FiInfo style={controlIconStyles} />
        </ControlItem>
        <ControlItem>
            <FiNavigation style={controlIconStyles} />
        </ControlItem>
    </ControlsContainer>
);

const controlIconStyles = { width: "100%", height: "60%", stroke: "rgb(27, 117, 240)", strokeWidth: "1px" };

const ControlItem = styled.div`
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    ${(props: { top?: boolean }) =>
        props.top &&
        css`
            border-bottom: 1px solid lightgray;
        `}
`;

const ControlsContainer = styled.div`
    width: 60px;
    height: 120px;
    position: absolute;
    left: 96%;
    top: 50px;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    border-radius: 15px;
    z-index: 999;
`;
