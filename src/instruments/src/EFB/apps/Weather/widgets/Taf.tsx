import React, { FC, useContext } from "react";
import styled from "styled-components";
import { None, Widget } from "./Widget";
import { WeatherContext } from "../WeatherContext";

export const Taf: FC<{ message: string | null}> = ({ message }) => {
    const { theme } = useContext(WeatherContext);

    return (
        <Widget title="TAF" scrollable={!!message} gridRow="1 / span 2" gridColumn="5 / span 2">
            {message ? <RawData>{message}</RawData> : <None color={theme.accentTextColor}>TAF not available</None>}
        </Widget>
    );
};

const RawData = styled.div`
    font-size: 26px;
    padding: 5px 10px 10px 10px;
`;
