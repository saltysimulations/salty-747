import { AirportFacility, AirportRunway, RunwaySurfaceType } from "@microsoft/msfs-sdk";
import React, { FC } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import styled, { css } from "styled-components";
import { InfoField, InfoFieldContainer, SectionLabel } from ".";

type InfoProps = {
    airport: AirportFacility;
};

export const Info: FC<InfoProps> = ({ airport }) => {
    const designatorToString: Record<RunwayDesignator, string> = {
        0: "",
        1: "L",
        2: "R",
        3: "C",
        4: "",
        5: "",
        6: "",
    };

    const getRunwayString = (runway: AirportRunway): string => {
        const runways = runway.designation.split("-");
        const firstRunway = runways[0].padStart(2, "0");
        const secondRunway = runways[1].padStart(2, "0");

        return `${firstRunway}${designatorToString[runway.designatorCharPrimary]} - ${secondRunway}${
            designatorToString[runway.designatorCharSecondary]
        }`;
    };

    return (
        <ScrollContainer style={{ width: "100%" }}>
            <InfoContainer>
                <AirportInfo>
                    <div>{Utils.Translate(airport.city.split(",")[0])}</div>
                    <div>{`${airport.lat.toFixed(4)}, ${airport.lon.toFixed(4)}`}</div>
                </AirportInfo>
                <SectionLabel>Runways</SectionLabel>
                <InfoFieldContainer>
                    {airport.runways.map((runway, i) => (
                        <InfoField key={i}>
                            <LeftRunwayInfo>
                                <div className="black">{getRunwayString(runway)}</div>
                                <div>{RunwaySurfaceType[runway.surface]}</div>
                            </LeftRunwayInfo>
                            <RightRunwayInfo>
                                <div className="black">
                                    {Math.round(runway.length * 3.281)} ft x {Math.round(runway.width * 3.281)} ft
                                </div>
                                <div>
                                    {Math.round(runway.length)} m x {Math.round(runway.width)} m
                                </div>
                            </RightRunwayInfo>
                        </InfoField>
                    ))}
                </InfoFieldContainer>
            </InfoContainer>
        </ScrollContainer>
    );
};

const InfoContainer = styled.div`
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const RunwayInfo = css`
    color: gray;

    .black {
        color: ${(props) => props.theme.text};
        font-weight: 500;
    }

    * {
        margin: 4px;
    }
`;

const RightRunwayInfo = styled.div`
    ${RunwayInfo}
    font-weight: 500;
    text-align: right;
`;

const LeftRunwayInfo = styled.div`
    ${RunwayInfo}
`;

const AirportInfo = styled.div`
    width: 90%;
    font-size: 22px;
    margin-top: 30px;
    font-weight: 500;

    * {
        margin: 4px;
    }
`;
