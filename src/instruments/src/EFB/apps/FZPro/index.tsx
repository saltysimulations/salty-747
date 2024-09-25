import React, { createContext, FC, ReactNode, useContext, useEffect, useRef, useState } from "react";
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
import { FlightContext, FlightProvider } from "./FlightPlan";
import { Flight } from "./Flight";

import { charts, getChartsByCategory } from "../../lib/navigraph";
import { EnrouteChartView } from "./enroute-charts";
import { SimbriefOfp } from "@microsoft/msfs-sdk";

export const ModalContext = createContext<{ modal: ReactNode | null, setModal: (modal: ReactNode | null) => void }>({
    modal: null,
    setModal: () => {}
});

export const FZPro: FC = () => {
    const { user, initialized } = useNavigraphAuth();

    const [modal, setModal] = useState<ReactNode | null>(null);

    return (
        <RootContainer>
            <FlightProvider>
                <ModalContext.Provider value={{ modal, setModal }}>
                    {!initialized && <div>Loading</div>}

                    {(initialized && !user) ? <SignInPrompt /> : (user && <App />)}

                    {modal && <ModalOverlay onClick={() => setModal(null)} />}

                    {modal}
                </ModalContext.Provider>
            </FlightProvider>
        </RootContainer>
    );
};

const ModalOverlay = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    background: black;
    opacity: 0.6;
`;

const App: FC = () => {
    const [currentChart, setCurrentChart] = useState<Chart | null>(null);
    const [selectedAirport, setSelectedAirport] = useState<string | null>(null);
    const [chartIndex, setChartIndex] = useState<Chart[] | null>(null);
    const [chartImage, setChartImage] = useState<Blob | null>(null);
    const [chartSelectorCategory, setChartSelectorCategory] = useState<ChartCategory | null>(null);
    const [airportSelectorDisplayed, setAirportSelectorDisplayed] = useState<boolean>(false);
    const [flightDisplayed, setFlightDisplayed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const mainSectionRef = useRef<HTMLDivElement>(null);

    const chartCategoryToLabel = {
        ARR: "Arrivals",
        DEP: "Departures",
        REF: "Reference Charts",
        APT: "Taxi Charts",
        APP: "Approaches",
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
            setSelectedAirport(ofp.origin.icao_code);
        }
    };

    const handleSelectChart = (chart: Chart) => {
        setCurrentChart(chart);
        fetchChartImage(chart).then(() => setLoading(false));
    };

    const handleSelectAirport = (icao: string) => {
        setSelectedAirport(icao);
        setAirportSelectorDisplayed(false);
        void fetchChartIndex(icao);
    }

    return (
        <>
            <TopBar setFlightDisplayed={setFlightDisplayed}/>
            <SideAndMainContainer onClick={() => airportSelectorDisplayed && setAirportSelectorDisplayed(false)}>
                <Sidebar
                    category={chartSelectorCategory}
                    setCategory={(category: ChartCategory | null) => setChartSelectorCategory(category)}
                    selectedAirport={selectedAirport ?? "APTS"}
                    setAirportSelectorDisplayed={(displayed) => setAirportSelectorDisplayed(displayed)}
                    airportSelectorDisplayed={airportSelectorDisplayed}
                />
                <MainSection ref={mainSectionRef}>
                    {!loading && !chartImage && <EnrouteChartView />}
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
                    {flightDisplayed && <Flight onUplink={handleUplink} />}
                </MainSection>
            </SideAndMainContainer>
            {airportSelectorDisplayed && (
                <AirportSelector
                    selectedAirport={selectedAirport}
                    setSelectedAirport={handleSelectAirport}
                />
            )}
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
    background: #F0F4F8;
    flex-grow: 1;
    display: flex;
    position: relative;
`;

const SideAndMainContainer = styled.div`
    display: flex;
    width: 100%;
    flex-grow: 1;
`;
