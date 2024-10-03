import React, { FC, useContext } from "react";
import styled from "styled-components";
import { Widget } from "./Widget";
import { WeatherContext } from "../WeatherContext";

export const Taf: FC<{ message: string | null}> = ({ message }) => {
    const { theme } = useContext(WeatherContext);

    return (
        <Widget title="TAF" scrollable gridRow="1 / span 2" gridColumn="5 / span 2">
            {message ? <RawData>{message}</RawData> : <Unavailable color={theme.accentTextColor}>TAF not available</Unavailable>}
        </Widget>
    );
};

const Unavailable = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 26px;
    color: ${(props: { color: string }) => props.color}
`;

const RawData = styled.div`
    font-size: 26px;
`;
