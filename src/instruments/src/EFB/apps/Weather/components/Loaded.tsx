import { IMetar, ITAF } from "@ninjomcs/metar-taf-parser-msfs";
import React, { FC } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import styled from "styled-components";
import { WeatherData } from "instruments/src/EFB/lib/weather";
import { Taf, Remarks, Wind, Qnh, DewPoint, ObservedAt, CloudCover, Metar, Visibility } from "../widgets";
import { UpperInfo } from "./UpperInfo";

export const Loaded: FC<{ metar: IMetar; taf: ITAF | null }> = ({ metar, taf }) => {
    const { message, day, hour, minute, visibility, temperature, dewPoint, wind, clouds, remarks, altimeter } = metar;

    return (
        <ScrollContainer ignoreElements=".widget-no-scroll" style={{ width: "95%" }}>
            <UpperInfo>
                <div>{metar.station}</div>
                <div className="temp">{metar.temperature}° C</div>
                <div className="rules">{WeatherData.getFlightCategory(metar.visibility, metar.clouds)}</div>
            </UpperInfo>
            <WidgetGrid>
                {message && <Metar message={message} />}
                <Taf message={taf && taf.message ? taf.message : null} />
                {remarks && <Remarks remarks={remarks} />}
                {wind && <Wind direction={wind?.degrees} speed={wind.speed} gust={wind.gust} />}
                {altimeter && <Qnh value={altimeter.value} unit={altimeter.unit} />}
                {visibility && <Visibility visibility={visibility.value} unit={visibility.unit} />}
                {dewPoint !== undefined && temperature !== undefined && <DewPoint dewPoint={dewPoint} temperature={temperature} />}
                {day !== undefined && hour !== undefined && minute !== undefined && <ObservedAt day={day} hour={hour} minute={minute} />}
                {clouds && <CloudCover clouds={clouds} />}
            </WidgetGrid>
        </ScrollContainer>
    );
};

const WidgetGrid = styled.div`
    flex: 1;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, 200px);
    grid-auto-rows: 200px;
    grid-gap: 25px;
    justify-content: center;
`;