import React, { FC, useContext, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { parseMetar, parseTAF } from "@ninjomcs/metar-taf-parser-msfs";
import { SimbriefClient } from "@microsoft/msfs-sdk";
import { WeatherContext } from "./WeatherContext";
import { determineTheme } from "./themes";
import { WeatherData } from "../../lib/weather";
import { SettingsContext } from "../Settings/SettingsContext";
import { TopBar } from "./components/TopBar";
import { AirportSelector } from "../FZPro/AirportSelector";
import { useSimVar } from "react-msfs";
import { FlightContext } from "../../lib/FlightContext";
import { useSetting } from "../../hooks/useSettings";
import { ModalContext } from "../..";
import { InfoModal } from "../../components/InfoModal";
import { UpperInfo } from "./components/UpperInfo";
import { Loaded } from "./components/Loaded";

export const Weather: FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [airportSelectorDisplayed, setAirportSelectorDisplayed] = useState<boolean>(false);

    const { metar, setMetar, taf, setTaf, theme, setTheme, selectedAirport, setSelectedAirport } = useContext(WeatherContext);
    const { metarSource, tafSource } = useContext(SettingsContext);
    const { setOfp } = useContext(FlightContext);
    const { setModal } = useContext(ModalContext);

    const [simbriefUsername] = useSetting("boeingMsfsSimbriefUsername");

    const [currentTime] = useSimVar("E:ZULU TIME", "seconds");

    const handleSelectAirport = async (icao: string) => {
        setLoading(true);
        setAirportSelectorDisplayed(false);
        setSelectedAirport(icao);

        const metarMessage = await WeatherData.fetchMetar(icao, metarSource);
        const tafMessage = await WeatherData.fetchTaf(icao, tafSource);

        if (metarMessage) {
            const parsedMetar = parseMetar(metarMessage);
            setMetar(parsedMetar);
            setTheme(determineTheme(parsedMetar.clouds, new Date(currentTime * 1000).getUTCHours()));
            tafMessage && setTaf(parseTAF(tafMessage));
        } else {
            setSelectedAirport(null);
            setModal(<InfoModal title="Error" description="Failed to fetch METAR" />);
        }

        setLoading(false);
    };

    console.log("øtt")

    const onUplink = async () => {
        try {
            const newOfp = await SimbriefClient.getOfp(await SimbriefClient.getSimbriefUserIDFromUsername(simbriefUsername as string));
            setOfp(newOfp);
            handleSelectAirport(newOfp.destination.icao_code);
        } catch (_) {
            setModal(<InfoModal title="Error" description="Failed to fetch SimBrief OFP" />);
        }
    };

    useEffect(() => {
        if (metar) {
            setTheme(determineTheme(metar.clouds, new Date(currentTime * 1000).getUTCHours()));
        }
    }, []);

    return (
        <WeatherContainer>
            <LoadingBackground opacity={loading || !selectedAirport ? 1 : 0} />
            <Background src={theme.background} opacity={!loading && selectedAirport ? 1 : 0} />
            <TopBar
                openAirportSelector={() => setAirportSelectorDisplayed(!airportSelectorDisplayed)}
                onRefresh={() => selectedAirport && handleSelectAirport(selectedAirport)}
                onUplink={onUplink}
            />
            {airportSelectorDisplayed && <AirportSelector selectedAirport={selectedAirport} setSelectedAirport={handleSelectAirport} />}
            {!loading && metar ? (
                <Loaded metar={metar} taf={taf} />
            ) : (
                !metar && (
                    <>
                        <UpperInfo>
                            <div>----</div>
                            <div className="temp">--° C</div>
                        </UpperInfo>
                        <NotLoaded>Select an airport or import from SimBrief</NotLoaded>
                    </>
                )
            )}
        </WeatherContainer>
    );
};

const NotLoaded = styled.div`
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
`;

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

const WeatherContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
