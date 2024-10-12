import styled, { useTheme } from "styled-components";
import React, { FC, useEffect, useState } from "react";
import { Input } from "../../components/Input";
import { useNavigraphAuth } from "../../hooks/useNavigraphAuth";
import { ListItemDescription, ListItemLabel, ListItemTitle } from "./components/ListItems";
import { IoMdCheckmark } from "react-icons/io";
import { facilityLoader, getIdentFromIcao } from "../../lib/facility";
import { AirportClass, AirportFacility, FacilitySearchType, FacilityType } from "@microsoft/msfs-sdk";
import ScrollContainer from "react-indiana-drag-scroll";

type AirportSelectorProps = {
    setSelectedAirport: (icao: string) => void;
    selectedAirport: string | null;
}

export const AirportSelector: FC<AirportSelectorProps> = ({ setSelectedAirport, selectedAirport }) => {
    const [search, setSearch] = useState<string>("");
    const [searchResults, setSearchResults] = useState<AirportFacility[] | null>(null);
    const theme = useTheme();

    useEffect(() => {
        setSearchResults(null);
        let current = true;

        const doSearch = async () => {
            const newResults = [];

            const icaos = await facilityLoader.searchByIdent(FacilitySearchType.Airport, search, 20);

            for (const icao of icaos) {
                const facility = await facilityLoader.getFacility(FacilityType.Airport, icao);

                if (facility.airportClass === AirportClass.HardSurface) {
                    newResults.push(facility);
                }

            }

            current && setSearchResults(newResults);
        }

        void doSearch();

        return () => {
            current = false;
        }

    }, [search]);

    return (
        <StyledAirportSelector>
            <Input
                placeholder="Search All Airports"
                style={{ width: "90%", margin: "20px 0", border: `1px solid ${theme.border}`, color: theme.text }}
                onUpdateValue={(icao) => setSearch(icao)}
                applyFilters={(value: string) => value.toUpperCase()}
                autoFocus
            />
            <ScrollContainer style={{ width: "100%" }}>
                {searchResults &&
                    searchResults.map((searchResult, i) => (
                        <AirportSelectorItem onClick={() => setSelectedAirport(getIdentFromIcao(searchResult.icao))} key={i}>
                            <ListItemDescription>
                                <ListItemTitle>{getIdentFromIcao(searchResult.icao)}</ListItemTitle>
                                <ListItemLabel>{Utils.Translate(searchResult.name)}</ListItemLabel>
                            </ListItemDescription>
                            {getIdentFromIcao(searchResult.icao) === selectedAirport && (
                                <IoMdCheckmark color="#1476fb" size={40} style={{ margin: "0 25px" }} />
                            )}
                        </AirportSelectorItem>
                    ))}
            </ScrollContainer>
        </StyledAirportSelector>
    );
};

const AirportSelectorItem = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid ${(props) => props.theme.border};
    align-items: center;
    background: ${(props) => props.theme.invert.primary};
    flex-shrink: 0;
`;

const StyledAirportSelector = styled.div`
    width: 500px;
    height: 800px;
    border: 1px solid ${(props) => props.theme.border};
    border-radius: 15px;
    position: absolute;
    background: ${(props) => props.theme.primary};
    display: flex;
    flex-direction: column;
    align-items: center;
    color: black;
    box-shadow: 2px 2px 10px ${(props) => props.theme.border};
    left: 150px;
    top: 50px;
    overflow: hidden;
    z-index: 999;
`;
