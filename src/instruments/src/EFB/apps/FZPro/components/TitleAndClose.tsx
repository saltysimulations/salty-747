import React, { FC } from "react";
import { AiFillCloseCircle } from "react-icons/all";
import styled from "styled-components";

export const TitleAndClose: FC<{ label: string, onClose: () => void }> = ({ label, onClose }) => (
    <ChartSelectorTitle>
        <div>{label}</div>
        <AiFillCloseCircle size={62} color="A9B3BE" onClick={onClose} />
    </ChartSelectorTitle>
);

const ChartSelectorTitle = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28px;
    font-weight: 500;
    border-bottom: 1px solid #b9b9bb;

    * {
        margin: 12px 12px 12px 24px;
    }
`;