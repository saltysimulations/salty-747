import React, { FC } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import styled, { useTheme } from "styled-components";

export const TitleAndClose: FC<{ label: string; sublabel?: string; onClose: () => void }> = ({ label, sublabel, onClose }) => {
    const theme = useTheme();

    return (
        <ChartSelectorTitle>
            <div className="margin">
                <div>{label}</div>
                <Sublabel>{sublabel}</Sublabel>
            </div>
            <AiFillCloseCircle size={62} color={theme.border} onClick={onClose} className="margin" />
        </ChartSelectorTitle>
    );
};

const Sublabel = styled.div`
    font-weight: 400;
    font-size: 22px;
    color: gray;
    margin: 3px 0;
`;

const ChartSelectorTitle = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28px;
    font-weight: 500;
    border-bottom: 1px solid ${(props) => props.theme.border};
    flex-shrink: 0;
    color: ${(props) => props.theme.text};

    .margin {
        margin: 12px 12px 12px 24px;
    }
`;