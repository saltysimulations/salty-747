import styled from "styled-components";
import React, { FC } from "react";
import { ChartCategory } from "../../lib/navigraph";
import { IoIosArrowDown } from "react-icons/all";

type SidebarProps = {
    category: ChartCategory | null,
    setCategory: (category: ChartCategory | null) => void,
    selectedAirport: string,
    setAirportSelectorDisplayed: (toggled: boolean) => void;
    airportSelectorDisplayed: boolean;
}

export const Sidebar: FC<SidebarProps> = ({
                                              category,
                                              setCategory,
                                              selectedAirport,
                                              setAirportSelectorDisplayed,
                                              airportSelectorDisplayed
                                          }) => {
    const onButtonClick = (newCategory: ChartCategory | null) => {
        if (airportSelectorDisplayed) setAirportSelectorDisplayed(false);

        if (selectedAirport !== "APTS") {
            setCategory(category === newCategory ? null : newCategory);
        }
    };

    return (
        <StyledSidebar>
            <UpperSection>
                <AirportSelectLabel onClick={() => setAirportSelectorDisplayed(!airportSelectorDisplayed)}>
                    <div>{selectedAirport}</div>
                    <IoIosArrowDown size={22} />
                </AirportSelectLabel>
                <ChartCategories>
                    <SidebarButtonContainer>
                        <ChartCategoryButton selected={category === "ref"}
                                             available={selectedAirport !== "APTS"}
                                             onClick={() => onButtonClick("ref")}>REF</ChartCategoryButton>
                        <ChartCategoryButton selected={false}
                                             available={selectedAirport !== "APTS"}
                                             onClick={() => onButtonClick(null)}>CO</ChartCategoryButton>
                        <ChartCategoryButton selected={category === "arr"}
                                             available={selectedAirport !== "APTS"}
                                             onClick={() => onButtonClick("arr")}>STAR</ChartCategoryButton>
                        <ChartCategoryButton selected={category === "app"}
                                             available={selectedAirport !== "APTS"}
                                             onClick={() => onButtonClick("app")}>APP</ChartCategoryButton>
                        <ChartCategoryButton selected={category === "apt"}
                                             available={selectedAirport !== "APTS"}
                                             onClick={() => onButtonClick("apt")}>TAXI</ChartCategoryButton>
                        <ChartCategoryButton selected={category === "dep"}
                                             available={selectedAirport !== "APTS"}
                                             onClick={() => onButtonClick("dep")}>SID</ChartCategoryButton>
                    </SidebarButtonContainer>
                </ChartCategories>
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

const ChartCategoryButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 25px 0;
    font-size: 28px;
    font-weight: 500;
    border-bottom: 1px solid #2B2F37;
    background: ${(props: { selected: boolean, available: boolean }) => {
        if (props.available) {
            return props.selected ? "#305A7E" : "transparent"
        } else {
            return "#3F424D"
        }
    }};
    color: ${(props: { available: boolean }) => props.available ? "white" : "#191D24"};

    &:last-child {
        border: none;
    }
`;

const ChartCategories = styled.div`
    background-color: #2B2F37;
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
    background-color: #40444D;

    div:nth-child(1) {
        border-radius: 15px 15px 0 0;
    }

    div:last-child {
        border-radius: 0 0 15px 15px;
    }
`;

const StyledSidebar = styled.div`
    background: #22242D;
    width: 120px;
    border-top: 1px solid #40444D;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: white;
`;
