import React, { useContext } from "react";
import { FC } from "react";
import styled from "styled-components";
import { IoIosRefresh } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { WeatherContext } from "../WeatherContext";

type TopBarProps = {
    openAirportSelector: () => void;
    onRefresh: () => void;
    onUplink: () => void;
};

export const TopBar: FC<TopBarProps> = ({ openAirportSelector, onRefresh, onUplink }) => {
    const { theme, selectedAirport } = useContext(WeatherContext);

    return (
        <StyledTopBar>
            <Icon color={theme.accentTextColor} onClick={openAirportSelector}>
                <div>{selectedAirport ?? "- - - -"}</div>
                <FaChevronDown fill={theme.accentTextColor} size={28} />
            </Icon>
            <Icon onClick={onUplink}>
                <AiOutlineCloudDownload fill={theme.accentTextColor} size={36} />
            </Icon>
            <Icon onClick={onRefresh}>
                <IoIosRefresh fill={theme.accentTextColor} size={32} />
            </Icon>
        </StyledTopBar>
    );
};


const StyledTopBar = styled.div`
    position: absolute;
    top: 50px;
    left: 10px;
    display: flex;
    align-items: center;
    padding: 0 5px;
`;

const Icon = styled.div`
    display: flex;
    margin: 8px;
    font-size: 28px;
    align-items: center;
    color: ${(props: { color?: string }) => props.color ?? "white"};

    * {
        margin: 0 5px;
    }
`;
