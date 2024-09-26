import styled, { css } from "styled-components";
import React, { FC, useContext } from "react";
import { ChartCategory } from "navigraph/charts";
import { IoIosArrowDown, IoIosGlobe } from "react-icons/io";
import { FZProContext, sourceToLabel } from "./AppContext";
import { NavigraphRasterSource } from "@navigraph/leaflet";

type SidebarProps = {
    category: ChartCategory | null;
    setCategory: (category: ChartCategory | null) => void;
    selectedAirport: string;
    setAirportSelectorDisplayed: (toggled: boolean) => void;
    airportSelectorDisplayed: boolean;
    viewingEnrouteChart: boolean;
    setViewingEnrouteChart: () => void;
};

export const Sidebar: FC<SidebarProps> = ({
    category,
    setCategory,
    selectedAirport,
    setAirportSelectorDisplayed,
    airportSelectorDisplayed,
    viewingEnrouteChart,
    setViewingEnrouteChart,
}) => {
    const { enrouteChartPreset } = useContext(FZProContext);

    const onButtonClick = (newCategory: ChartCategory | null) => {
        if (airportSelectorDisplayed) setAirportSelectorDisplayed(false);

        if (selectedAirport !== "APTS") {
            setCategory(category === newCategory ? null : newCategory);
        }
    };

    const chartCategoryToLabel: Record<ChartCategory, string> = {
        REF: "REF",
        ARR: "STAR",
        APP: "APP",
        APT: "TAXI",
        DEP: "SID",
    } as const;

    return (
        <StyledSidebar>
            <UpperSection>
                <AirportSelectLabel onClick={() => setAirportSelectorDisplayed(!airportSelectorDisplayed)}>
                    <div>{selectedAirport}</div>
                    <IoIosArrowDown size={22} />
                </AirportSelectLabel>
                <ChartCategories>
                    <SidebarButtonContainer>
                        {(Object.keys(chartCategoryToLabel) as Array<ChartCategory>).map((cat) => (
                            <ChartCategoryButton
                                selected={category === cat}
                                available={selectedAirport !== "APTS"}
                                onClick={() => onButtonClick(cat)}
                            >
                                {chartCategoryToLabel[cat]}
                            </ChartCategoryButton>
                        ))}
                    </SidebarButtonContainer>
                </ChartCategories>
                <EnrouteChartButton selected={viewingEnrouteChart} available={true} onClick={setViewingEnrouteChart}>
                    <IoIosGlobe size={40} />
                    <div>{sourceToLabel[enrouteChartPreset.source]}</div>
                </EnrouteChartButton>
            </UpperSection>
        </StyledSidebar>
    );
};

const UpperSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 50px 0 0 0;
`;

const AirportSelectLabel = styled.div`
    display: flex;
    margin: 22px 0;
    font-size: 22px;
    font-weight: 500;

    * {
        margin: 0 2px;
    }
`;

const ChartButton = css`
    background: ${(props: { selected: boolean; available: boolean }) => {
        if (props.available) {
            return props.selected ? "#305A7E" : "#40444d";
        } else {
            return "#3F424D";
        }
    }};
    color: ${(props: { available: boolean }) => (props.available ? "white" : "#191D24")};
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
`;

const EnrouteChartButton = styled.div`
    ${ChartButton}
    flex-direction: column;
    width: 90%;
    padding: 10px 0;
    font-size: 20px;
    border-radius: 15px;
    margin-top: 40px;

    * {
        margin: 3px;
    }
`;

const ChartCategoryButton = styled.div`
    ${ChartButton}
    width: 100%;
    padding: 25px 0;
    font-size: 28px;
    border-bottom: 1px solid #2b2f37;

    &:last-child {
        border: none;
    }
`;

const ChartCategories = styled.div`
    background-color: #2b2f37;
    width: 100%;
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const SidebarButtonContainer = styled.div`
    width: 90%;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #40444d;

    div:nth-child(1) {
        border-radius: 15px 15px 0 0;
    }

    div:last-child {
        border-radius: 0 0 15px 15px;
    }
`;

const StyledSidebar = styled.div`
    background: #22242d;
    width: 120px;
    border-top: 1px solid #40444d;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: white;
`;
