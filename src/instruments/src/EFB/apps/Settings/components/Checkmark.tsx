import React, { FC } from "react";
import { IoIosCheckmark } from "react-icons/io";
import styled from "styled-components";

type ChechmarkProps = {
    selected: boolean;
    onClick: () => void;
};

export const Checkmark: FC<ChechmarkProps> = ({ selected, onClick }) => (
    <StyledCheckmark selected={selected} onClick={onClick}>
       {selected && <IoIosCheckmark size={50} fill="white" />}
    </StyledCheckmark>
);

const StyledCheckmark = styled.div<{ selected: boolean }>`
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 1px solid ${(props) => props.theme.border};
    background: ${(props) => props.selected ? props.theme.select : "transparent"};
    display: flex;
    justify-content: center;
    align-items: center;
`;