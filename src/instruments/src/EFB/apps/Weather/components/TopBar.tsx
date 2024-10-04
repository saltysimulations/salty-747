import React, { useContext } from "react";
import { FC } from "react";
import styled from "styled-components";
import { IoIosRefresh } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import { WeatherContext } from "../WeatherContext";

export const TopBar: FC<{ openAirportSelector: () => void, onRefresh: () => void }> = ({ openAirportSelector, onRefresh }) => {
    const { theme, selectedAirport } = useContext(WeatherContext);

    return (
        <StyledTopBar>
            <Airport color={theme.accentTextColor} onClick={openAirportSelector}>
                <div>{selectedAirport ?? "- - - -"}</div>
                <FaChevronDown fill={theme.accentTextColor} size={28} />
            </Airport>
            <IoIosRefresh fill={theme.accentTextColor} size={32} onClick={onRefresh} />
        </StyledTopBar>
    );
};

const StyledTopBar = styled.div`
    position: absolute;
    top: 50px;
    left: 10px;
    display: flex;
    align-items: center;
`;

const Airport = styled.div`
    display: flex;
    margin: 0 25px;
    font-size: 28px;
    align-items: center;
    color: ${(props: { color: string }) => props.color};

    * {
        margin: 0 5px;
    }
`;
