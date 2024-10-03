import React, { FC, useContext, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { parseMetar, parseTAF } from "@ninjomcs/metar-taf-parser-msfs";
import ScrollContainer from "react-indiana-drag-scroll";
import { WeatherContext } from "./WeatherContext";
import { cavokTheme } from "./themes";
import { WeatherData } from "../../lib/weather";
import { SettingsContext } from "../Settings/SettingsContext";
import { CloudCover, DewPoint, Metar, ObservedAt, Qnh, Remarks, Taf, Visibility, Wind } from "./widgets";

export const Weather: FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { metar, setMetar, taf, setTaf, theme, setTheme } = useContext(WeatherContext);
    const { metarSource, tafSource } = useContext(SettingsContext);
    const { message, day, hour, minute, visibility, temperature, dewPoint, wind, clouds, remarks, altimeter } = metar ?? {};

    const fetchData = async (icao: string) => {
        const metarMessage = await WeatherData.fetchMetar(icao, metarSource);
        const tafMessage = await WeatherData.fetchTaf(icao, tafSource);

        metarMessage && setMetar(parseMetar(metarMessage));
        tafMessage && setTaf(parseTAF(tafMessage));
    };

    useEffect(() => {
        const start = async () => {
            if (!metar) {
                setLoading(true);
                await fetchData("KJFK");
                setTheme(cavokTheme);
                setLoading(false);
            }
        };

        start();
    }, []);

    return (
        <WeatherContainer>
            <LoadingBackground opacity={loading ? 1 : 0} />
            <Background src={theme.background} opacity={loading ? 0 : 1} />
            <ScrollContainer ignoreElements=".widget-no-scroll" style={{ width: "95%" }}>
                {!loading && metar ? (
                    <>
                        <UpperInfo>
                            <div>{metar.station}</div>
                            <div className="temp">{metar.temperature}° C</div>
                            <div className="rules">VFR</div>
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
                    </>
                ) : (
                    <UpperInfo>
                        <div>----</div>
                        <div className="temp">--° C</div>
                    </UpperInfo>
                )}
            </ScrollContainer>
        </WeatherContainer>
    );
};

const Bg = css`
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: -1;
    transition: opacity 1s;
    opacity: ${(props: { opacity: number }) => props.opacity};
`;

const LoadingBackground = styled.img`
    ${Bg}
    background: linear-gradient(0deg, rgba(76, 153, 226, 1) 0%, rgba(0, 45, 164, 1) 100%);
`;

const Background = styled.img`
    object-fit: cover;
    opacity: 0;
    ${Bg}
`;

const WidgetGrid = styled.div`
    flex: 1;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, 200px);
    grid-auto-rows: 200px;
    grid-gap: 25px;
    justify-content: center;
`;

const UpperInfo = styled.div`
    font-size: 52px;
    font-weight: 500;
    margin: 120px 0 60px 0;
    text-align: center;

    .temp {
        font-size: 120px;
        font-weight: 300;
    }

    .rules {
        font-size: 32px;
    }

    * {
        text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
    }
`;

const WeatherContainer = styled.div`
    height: 100vh;
    width: 100vw;
    background-position: center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: background 1s ease-out;
`;
