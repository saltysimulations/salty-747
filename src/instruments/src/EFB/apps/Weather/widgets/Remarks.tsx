import { Remark } from "@ninjomcs/metar-taf-parser-msfs";
import React, { FC, useContext } from "react";
import { BsExclamationTriangleFill } from "react-icons/bs";
import styled from "styled-components";
import { None, Widget } from "./Widget";
import { WeatherContext } from "../WeatherContext";

export const Remarks: FC<{ remarks: Remark[] }> = ({ remarks }) => {
    const { theme } = useContext(WeatherContext);

    return (
        <Widget
            title="REMARKS"
            gridRow="3 / 4"
            gridColumn="3 / span 2"
            scrollable={remarks.length >= 1}
            icon={<BsExclamationTriangleFill size={18} fill={theme.accentTextColor} />}
        >
            {remarks.length >= 1 || (remarks.length === 1 && !remarks[0].description) ? <RemarksContainer>
                {remarks.map(
                    (remark, i) =>
                        remark.description && (
                            <StyledRemark border={theme.accentTextColor} key={i}>{remark.description.charAt(0).toUpperCase() + remark.description.slice(1)}</StyledRemark>
                        )
                )}
            </RemarksContainer> : <None color={theme.accentTextColor}>No remarks</None>}
        </Widget>
    );
};

const StyledRemark = styled.div`
    width: 100%;
    border-bottom: 1px solid ${(props: { border: string }) => props.border};
    padding: 10px;

    &:last-child {
        border-bottom: 0;
    }
`;

const RemarksContainer = styled.div`
    font-size: 20px;
`;
