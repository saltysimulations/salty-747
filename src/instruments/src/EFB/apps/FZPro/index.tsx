import React, { createContext, FC, ReactNode, useContext, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Chart, ChartCategory } from "navigraph/charts";

import { useNavigraphAuth } from "../../hooks/useNavigraphAuth";
import styled from "styled-components";

import { AirportChartViewer } from "./AirportChartViewer";
import { SignInPrompt } from "./SignInPrompt";
import { TopBar } from "./TopBar";
import { DocumentLoading } from "./DocumentLoading";
import { ChartSelector } from "./ChartSelector";
import { Sidebar } from "./Sidebar";
import { AirportSelector } from "./AirportSelector";
import { FlightContext, FlightProvider } from "../../lib/FlightContext";
import { Flight } from "./Flight";

import { charts, getChartsByCategory } from "../../lib/navigraph";
import { EnrouteChartView } from "./enroute-charts";
import { AirportFacility, FacilityType, SimbriefOfp } from "@microsoft/msfs-sdk";
import { FZProContext, sourceToLabel } from "./AppContext";
import { InfoWx } from "./info-wx";
import { facilityLoader, getAirportIcaoFromIdent } from "../../lib/facility";

export const FZPro: FC = () => {
    const { user, initialized } = useNavigraphAuth();

    return (
        <RootContainer>
            <FlightProvider>
                {!initialized && <div>Loading</div>}

                {initialized && !user ? <SignInPrompt /> : user && <App />}
            </FlightProvider>
        </RootContainer>
    );
};

const App: FC = () => {
    const [currentChart, setCurrentChart] = useState<Chart | null>(null);
    const [selectedAirport, setSelectedAirport] = useState<string | null>(null);
    const [airportFacility, setAirportFacility] = useState<AirportFacility | null>(null);
    const [chartIndex, setChartIndex] = useState<Chart[] | null>(null);
    const [chartImage, setChartImage] = useState<Blob | null>(null);
    const [chartSelectorCategory, setChartSelectorCategory] = useState<ChartCategory | null>(null);
    const [airportSelectorDisplayed, setAirportSelectorDisplayed] = useState<boolean>(false);
    const [flightDisplayed, setFlightDisplayed] = useState<boolean>(false);
    const [infoWxDisplayed, setInfoWxDisplayed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const { enrouteChartPreset } = useContext(FZProContext);
    const { ofp } = useContext(FlightContext);

    const mainSectionRef = useRef<HTMLDivElement>(null);

    const chartCategoryToLabel = {
        ARR: "Arrivals",
        DEP: "Departures",
        REF: "Reference Charts",
        APT: "Taxi Charts",
        APP: "Approaches",
    };

    const viewingEnrouteChart = !loading && !chartImage && !currentChart;

    const topBarLabel = (): string => {
        if (viewingEnrouteChart) {
            return ofp ? `${ofp.origin.icao_code} - ${ofp.destination.icao_code}` : sourceToLabel[enrouteChartPreset.source];
        } else return `${currentChart?.name}`;
    };

    const topBarSecondaryLabel = (): string | null => {
        if (viewingEnrouteChart) {
            return ofp ? sourceToLabel[enrouteChartPreset.source] : null;
        } else return null;
    };

    const fetchChartIndex = (icao: string) => {
        charts
            .getChartsIndex({ icao })
            .then((index) => setChartIndex(index))
            .catch((_) => setChartIndex(null)); // probably no charts for airport
    };

    const fetchChartImage = async (chart: Chart) => {
        setLoading(true);
        setChartImage(await charts.getChartImage({ chart, theme: "light" }));
    };

    const handleUplink = (ofp: SimbriefOfp) => {
        if (!selectedAirport) {
            handleSelectAirport(ofp.origin.icao_code);
        }
    };

    const handleSelectChart = (chart: Chart) => {
        setCurrentChart(chart);
        fetchChartImage(chart).then(() => setLoading(false));
    };

    const handleSelectAirport = async (icao: string) => {
        setSelectedAirport(icao);
        setAirportSelectorDisplayed(false);
        setAirportFacility(await facilityLoader.getFacility(FacilityType.Airport, getAirportIcaoFromIdent(icao)));
        void fetchChartIndex(icao);
    };

    return (
        <>
            <TopBar setFlightDisplayed={setFlightDisplayed} viewingTop={topBarLabel()} viewingBottom={topBarSecondaryLabel()} />
            <SideAndMainContainer onClick={() => airportSelectorDisplayed && setAirportSelectorDisplayed(false)}>
                <Sidebar
                    category={chartSelectorCategory}
                    setCategory={(category: ChartCategory | null) => setChartSelectorCategory(category)}
                    selectedAirport={selectedAirport ?? "APTS"}
                    setAirportSelectorDisplayed={(displayed) => setAirportSelectorDisplayed(displayed)}
                    airportSelectorDisplayed={airportSelectorDisplayed}
                    infoWxDisplayed={infoWxDisplayed}
                    setInfoWxDisplayed={setInfoWxDisplayed}
                    viewingEnrouteChart={!loading && !chartImage}
                    setViewingEnrouteChart={() => {
                        setChartImage(null);
                        setCurrentChart(null);
                        setChartSelectorCategory(null);
                    }}
                />
                <MainSection ref={mainSectionRef}>
                    {viewingEnrouteChart && <EnrouteChartView />}
                    {loading ? (
                        <DocumentLoading />
                    ) : (
                        chartImage &&
                        mainSectionRef.current && (
                            <AirportChartViewer
                                chartImage={chartImage}
                                canvasWidth={mainSectionRef.current.clientWidth}
                                canvasHeight={mainSectionRef.current.clientHeight}
                            />
                        )
                    )}
                    {chartSelectorCategory && chartIndex && (
                        <ChartSelector
                            charts={getChartsByCategory(chartIndex, chartSelectorCategory)}
                            label={chartCategoryToLabel[chartSelectorCategory]}
                            onClose={() => setChartSelectorCategory(null)}
                            onSelect={handleSelectChart}
                            selectedChart={currentChart}
                        />
                    )}
                    {flightDisplayed && <Flight onUplink={handleUplink} onClose={() => setFlightDisplayed(false)} />}
                    {infoWxDisplayed && airportFacility && <InfoWx airport={airportFacility} onClose={() => setInfoWxDisplayed(false)} />}
                </MainSection>
            </SideAndMainContainer>
            {airportSelectorDisplayed && <AirportSelector selectedAirport={selectedAirport} setSelectedAirport={handleSelectAirport} />}
        </>
    );
};

const RootContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
`;

const MainSection = styled.div`
    background: #f0f4f8;
    flex-grow: 1;
    display: flex;
    position: relative;
`;

const SideAndMainContainer = styled.div`
    display: flex;
    width: 100%;
    flex-grow: 1;
`;
