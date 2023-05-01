import styled from "styled-components";
import React, { FC, useState } from "react";
import { Input } from "./components/Input";
import { useNavigraphAuth } from "../../hooks/useNavigraphAuth";
import { AirportInfo } from "../../lib/navigraph";
import { ListItemDescription, ListItemLabel, ListItemTitle } from "./components/ListItems";
import { IoCheckmark } from "react-icons/all";

type AirportSelectorProps = {
    setSelectedAirport: (icao: string) => void;
    selectedAirport: string | null;
}

export const AirportSelector: FC<AirportSelectorProps> = ({ setSelectedAirport, selectedAirport }) => {
    const { getAirportInfo } = useNavigraphAuth();

    const [searchResult, setSearchResult] = useState<AirportInfo | null>(null);

    return (
        <StyledAirportSelector>
            <Input
                placeholder="Search All Airports"
                width="90%"
                margin="20px 0"
                onFocusOut={async (icao) => setSearchResult(await getAirportInfo(icao))}
                applyFilters={(value: string) => value.toUpperCase()}
            />
            {searchResult && <AirportSelectorItem>
                <ListItemDescription onClick={() => setSelectedAirport(searchResult.icao)}>
                    <ListItemTitle>{searchResult.icao} / {searchResult.iata}</ListItemTitle>
                    <ListItemLabel>{searchResult.name}</ListItemLabel>
                </ListItemDescription>
                {searchResult.icao === selectedAirport && <IoCheckmark color="#1476fb" size={40} style={{ margin: "0 25px" }} />}
            </AirportSelectorItem>}
        </StyledAirportSelector>
    );
};

const AirportSelectorItem = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #b9b9bb;
    align-items: center;
    background: white;
`;

const StyledAirportSelector = styled.div`
    width: 500px;
    height: 800px;
    border: 1px solid #b9b9bb;
    border-radius: 15px;
    position: absolute;
    background: #F0F4F8;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: black;
    box-shadow: 2px 2px 10px #b9b9bb;
    left: 150px;
    top: 50px;
`;
