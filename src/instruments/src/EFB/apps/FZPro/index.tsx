import React, { createContext, FC, ReactNode, useContext, useEffect, useRef, useState } from "react";

import { useNavigraphAuth } from "../../hooks/useNavigraphAuth";
import styled from "styled-components";

import { AirportChartViewer } from "./AirportChartViewer";
import { SignInPrompt } from "./SignInPrompt";
import { TopBar } from "./TopBar";
import { Chart, ChartCategory, ChartIndex } from "../../lib/navigraph";
import { DocumentLoading } from "./DocumentLoading";
import { ChartSelector } from "./ChartSelector";
import { Sidebar } from "./Sidebar";
import { AirportSelector } from "./AirportSelector";
import { Flight } from "./Flight";
import { FlightContext, FlightProvider } from "./FlightPlan";
import { Outlet } from "react-router-dom";
import { getIdentFromIcao } from "../../lib/facility";

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
    const { getChartImage, getChartIndex } = useNavigraphAuth();

    const [currentChart, setCurrentChart] = useState<Chart | null>(null);
    const [selectedAirport, setSelectedAirport] = useState<string | null>(null);
    const [chartIndex, setChartIndex] = useState<ChartIndex | null>(null);
    const [chartImage, setChartImage] = useState<string | null>(null);
    const [chartSelectorCategory, setChartSelectorCategory] = useState<ChartCategory | null>(null);
    const [airportSelectorDisplayed, setAirportSelectorDisplayed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { departureAirport } = useContext(FlightContext);

    const mainSectionRef = useRef<HTMLDivElement>(null);

    const chartCategoryToLabel = {
        arr: "Arrivals",
        dep: "Departures",
        ref: "Reference Charts",
        apt: "Taxi Charts",
        app: "Approaches",
    };

    useEffect(() => {
        const fetchChartImageUrl = async () => {
            if (currentChart) {
                setLoading(true);
                setChartImage(await getChartImage(currentChart.imageDayUrl));
            }
        }

        fetchChartImageUrl().then(() => setLoading(false));
    }, [currentChart]);

    useEffect(() => {
        const fetchChartIndex = async () => {
            if (selectedAirport) {
                getChartIndex(selectedAirport)
                    .then((index) => setChartIndex(index))
                    .catch(_ => setChartIndex(null)); // probably no charts for airport
            }
        }

        void fetchChartIndex();
    }, [selectedAirport]);

    useEffect(() => {
        if (!selectedAirport && departureAirport) {
            setSelectedAirport(getIdentFromIcao(departureAirport.icao));
        }
    }, [departureAirport]);

    return (
        <>
            <TopBar />
            <SideAndMainContainer onClick={() => {
                if (airportSelectorDisplayed) setAirportSelectorDisplayed(false);
            }}>
                <Sidebar
                    category={chartSelectorCategory}
                    setCategory={(category: ChartCategory | null) => setChartSelectorCategory(category)}
                    selectedAirport={selectedAirport ?? "APTS"}
                    setAirportSelectorDisplayed={(displayed) => setAirportSelectorDisplayed(displayed)}
                    airportSelectorDisplayed={airportSelectorDisplayed}
                />
                <MainSection ref={mainSectionRef}>
                    {loading ? <DocumentLoading /> : chartImage && mainSectionRef.current && <AirportChartViewer
                        chartImage={chartImage}
                        canvasWidth={mainSectionRef.current.clientWidth}
                        canvasHeight={mainSectionRef.current.clientHeight}
                    />}
                    {chartSelectorCategory && chartIndex &&
                        <ChartSelector
                            charts={chartIndex[chartSelectorCategory]}
                            label={chartCategoryToLabel[chartSelectorCategory]}
                            onClose={() => setChartSelectorCategory(null)}
                            onSelect={(chart) => setCurrentChart(chart)}
                            selectedChart={currentChart}
                        />}
                    <Outlet />
                </MainSection>
            </SideAndMainContainer>
            {airportSelectorDisplayed && <AirportSelector
                selectedAirport={selectedAirport}
                setSelectedAirport={(icao) => setSelectedAirport(icao)}
            />}
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
