import { AirportFacility, FacilityType } from "@microsoft/msfs-sdk";
import { facilityLoader, getIdentFromIcao } from "../../../lib/facility";
import React, { FC, useState } from "react";
import styled, { css } from "styled-components";
import { TitleAndClose } from "../components/TitleAndClose";
import { Info } from "./Info";
import { Weather } from "./Weather";
import { Comms } from "./Comms";

type Tab = "info" | "weather" | "comms";

export const InfoWx: FC<{ airport: AirportFacility, onClose: () => void }> = ({ airport, onClose }) => {
    const [tabSelector, setTabSelector] = useState<Tab>("info");

    const getSection = (tab: Tab): React.ReactNode => {
        if (tab === "info") {
            return <Info airport={airport} />;
        } else if (tab === "weather") {
            return <Weather airport={airport} />;
        }

        return <Comms airport={airport} />;
    };

    return (
        <Container>
            <TitleAndClose label={getIdentFromIcao(airport.icao)} sublabel={Utils.Translate(airport.name)?.toUpperCase() ?? undefined} onClose={onClose} />
            <TabSwitcher>
                <TabElement selected={tabSelector === "info"} onClick={() => setTabSelector("info")}>
                    Info
                </TabElement>
                <TabElement selected={tabSelector === "weather"} onClick={() => setTabSelector("weather")}>
                    WX & ATIS
                </TabElement>
                <TabElement selected={tabSelector === "comms"} onClick={() => setTabSelector("comms")}>
                    Comms
                </TabElement>
            </TabSwitcher>
            {getSection(tabSelector)}
        </Container>
    );
};

export const InfoField = styled.div`
    flex: 1;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    background: ${(props) => props.theme.invert.primary};
    border-bottom: 1px solid ${(props) => props.theme.border};
`;

export const InfoFieldContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: 24px;
    border-top: 1px solid ${(props) => props.theme.border};
`;

export const SectionLabel = styled.div`
    width: 100%;
    font-size: 24px;
    color: gray;
    font-weight: 500;
    padding: 8px 25px;
    margin: 20px 0 0 0;
    display: flex;
    justify-content: space-between;
`;

const TabElement = styled.div<{ selected?: boolean }>`
    flex: 1;
    background: ${(props) => (props.selected ? props.theme.accent : "transparent")};
    padding: 8px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    font-size: 22px;
    font-weight: 500;
`;

const TabSwitcher = styled.div`
    display: flex;
    background: ${(props) => props.theme.invert.primary};
    width: 90%;
    margin-top: 30px;
    border-radius: 15px;
    border: 2px solid ${(props) => props.theme.invert.primary};
    flex-shrink: 0;
`;

const Container = styled.div`
    width: 500px;
    height: 95%;
    position: absolute;
    background: ${(props) => props.theme.invert.bg};
    border-radius: 25px;
    box-shadow: 2px 2px 10px ${(props) => props.theme.border};
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: ${(props) => props.theme.text};
`;
