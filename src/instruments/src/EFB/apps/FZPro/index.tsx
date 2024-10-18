import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { Chart, ChartCategory } from "navigraph/charts";

import { useNavigraphAuth } from "../../hooks/useNavigraphAuth";
import styled from "styled-components";

import { AirportChartViewer } from "../../components/charts/AirportChartViewer";
import { SignInPrompt } from "./SignInPrompt";
import { TopBar } from "./TopBar";
import { DocumentLoading } from "../../components/charts/DocumentLoading";
import { ChartSelector } from "./ChartSelector";
import { Sidebar } from "./Sidebar";
import { AirportSelector } from "../../components/airport-selector";
import { FlightContext } from "../../lib/FlightContext";
import { Flight } from "./Flight";

import { charts, getChartsByCategory } from "../../lib/navigraph";
import { EnrouteChartView } from "./enroute-charts";
import { FacilityType, SimbriefOfp } from "@microsoft/msfs-sdk";
import { FZProContext, sourceToLabel } from "./AppContext";
import { InfoWx } from "./info-wx";
import { facilityLoader, getAirportIcaoFromIdent } from "../../lib/facility";
import { ThemeSwitchContext } from "../../lib/Theme";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "../..";
import { InfoModal } from "../../components/InfoModal";

export const FZPro: FC = () => {
    const { user, initialized } = useNavigraphAuth();
    const navigate = useNavigate();

    const { setModal } = useContext(ModalContext);

    const hasChartsSubscription = user?.subscriptions.includes("charts");

    useEffect(() => {
        if (initialized && user && !hasChartsSubscription) {
            navigate("/");
            setModal(<InfoModal title="No charts subscription" description="This app requires a Navigraph Charts subscription." />);
        }
    }, []);

    return (
        <RootContainer>
            {!initialized && <div>Loading</div>}

            {(initialized && !user) ? <SignInPrompt /> : user && hasChartsSubscription && <App />}
        </RootContainer>
    );
};

const App: FC = () => {
    const [chartSelectorCategory, setChartSelectorCategory] = useState<ChartCategory | null>(null);
    const [airportSelectorDisplayed, setAirportSelectorDisplayed] = useState<boolean>(false);
    const [flightDisplayed, setFlightDisplayed] = useState<boolean>(false);
    const [infoWxDisplayed, setInfoWxDisplayed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [mainSectionWidth, setMainSectionWidth] = useState<number>();
    const [mainSectionHeight, setMainSectionHeight] = useState<number>();

    const {
        enrouteChartPreset,
        currentChart,
        setCurrentChart,
        chartImage,
        setChartImage,
        chartIndex,
        setChartIndex,
        selectedAirport,
        setSelectedAirport,
        airportFacility,
        setAirportFacility,
    } = useContext(FZProContext);
    const { ofp } = useContext(FlightContext);
    const { theme: selectedTheme } = useContext(ThemeSwitchContext);

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
        setChartImage(await charts.getChartImage({ chart, theme: selectedTheme }));
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

    const setDimensions = (node: HTMLDivElement | null) => {
        node && setMainSectionWidth(node.clientWidth);
        node && setMainSectionHeight(node.clientHeight);
    };

    return (
        <>
            <TopBar setFlightDisplayed={setFlightDisplayed} flightDisplayed={flightDisplayed} viewingTop={topBarLabel()} viewingBottom={topBarSecondaryLabel()} />
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
                <MainSection ref={setDimensions}>
                    {viewingEnrouteChart && <EnrouteChartView />}
                    {loading ? (
                        <DocumentLoading />
                    ) : (
                        chartImage &&
                        mainSectionWidth &&
                        mainSectionHeight && (
                            <AirportChartViewer chartImage={chartImage} canvasWidth={mainSectionWidth} canvasHeight={mainSectionHeight} />
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
    background: ${(props) => props.theme.bg};
    flex-grow: 1;
    display: flex;
    position: relative;
`;

const SideAndMainContainer = styled.div`
    display: flex;
    width: 100%;
    flex-grow: 1;
`;
