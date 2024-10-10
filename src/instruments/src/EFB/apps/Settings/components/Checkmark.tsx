import React, { FC } from "react";
import { IoIosCheckmark } from "react-icons/io";
import styled from "styled-components";

type ChechmarkProps = {
    selected: boolean;
};

export const Checkmark: FC<ChechmarkProps> = ({ selected }) => (
    <StyledCheckmark selected={selected}>
        <IoIosCheckmark size={50} fill="white" />
    </StyledCheckmark>
);

const StyledCheckmark = styled.div<{ selected: boolean }>`
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 1px solid lightgray;
    background: ${({ selected }) => selected ? "#4FA0FC" : "white"};
    display: flex;
    justify-content: center;
    align-items: center;
`;