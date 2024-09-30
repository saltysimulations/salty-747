import React, { FC, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { IoRefresh } from "react-icons/io5";
import { InfoField, InfoFieldContainer, SectionLabel } from ".";
import { WeatherData } from "../../../lib/weather";
import { AirportFacility } from "@microsoft/msfs-sdk";
import { getIdentFromIcao } from "instruments/src/EFB/lib/facility";
import { FZProContext } from "../AppContext";
import ScrollContainer from "react-indiana-drag-scroll";
import { SettingsContext } from "../../Settings/SettingsContext";

export const Weather: FC<{ airport: AirportFacility }> = ({ airport }) => {
    const [metarLoading, setMetarLoading] = useState<boolean>(false);
    const [tafLoading, setTafLoading] = useState<boolean>(false);
    const [atisLoading, setAtisLoading] = useState<boolean>(false);

    const { metar, setMetar, taf, setTaf, atis, setAtis, weatherLastUpdated, setWeatherLastUpdated } = useContext(FZProContext);
    const { metarSource, tafSource, atisSource } = useContext(SettingsContext);

    const lastUpdatedString = () => {
        if (weatherLastUpdated) {
            const hours = weatherLastUpdated.getUTCHours();
            const minutes = weatherLastUpdated.getUTCMinutes();

            return `${hours < 10 ? `0${hours}` : hours}${minutes < 10 ? `0${minutes}` : minutes}Z`;
        }
    };

    const setAllLoading = (loading: boolean) => {
        setMetarLoading(loading);
        setTafLoading(loading);
        setAtisLoading(loading);
    };

    const fetchData = async () => {
        setAllLoading(true);
        setMetar(await WeatherData.fetchMetar(airport, metarSource));
        setTaf(await WeatherData.fetchTaf(getIdentFromIcao(airport.icao), tafSource));
        setAtis(await WeatherData.fetchAtis(getIdentFromIcao(airport.icao), atisSource));
        setAllLoading(false)
        setWeatherLastUpdated(new Date(Date.now()));
    };

    useEffect(() => {
        if ((!metar || !taf) && !weatherLastUpdated) {
            void fetchData();
        }
    }, []);

    return (
        <WeatherContainer>
            <ScrollContainer style={{ width: "100%" }}>
                <WeatherTextSection name="METAR" loading={metarLoading} text={metar} />
                <WeatherTextSection name="TAF" loading={tafLoading} text={taf} />
                <WeatherTextSection name="ATIS" loading={atisLoading} text={atis} />
            </ScrollContainer>
            <LastUpdated>
                <div>
                    <div>Last Updated:</div>
                    <Time>{lastUpdatedString()}</Time>
                </div>
                <Refresh>
                    <IoRefresh size={30} fill="#4fa0fc" />
                    <div onClick={() => fetchData()}>Refresh</div>
                </Refresh>
            </LastUpdated>
        </WeatherContainer>
    );
};

const WeatherTextSection: FC<{ name: string; loading: boolean; text: string | null }> = ({ name, loading, text }) => (
    <>
        <SectionLabel>
            <div>{name}</div>
        </SectionLabel>
        <InfoFieldContainer>
            <InfoField>
                <div>{loading ? `Fetching ${name}...` : text ?? `${name} NOT AVAILABLE`}</div>
            </InfoField>
        </InfoFieldContainer>
    </>
);

const WeatherContainer = styled.div`
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
`;

const Time = styled.div`
    font-size: 22px;
    color: gray;
    margin-top: 4px;
`;

const Refresh = styled.div`
    display: flex;
    align-items: center;
    color: #4fa0fc;

    * {
        margin: 0 3px;
    }
`;

const LastUpdated = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    font-size: 24px;
    font-weight: 500;
    border-top: 1px solid lightgray;
`;

const Taf = styled.div`
    color: lime;
`;
