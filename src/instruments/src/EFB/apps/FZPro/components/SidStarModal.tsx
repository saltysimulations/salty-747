import React, { FC, useContext, useEffect, useRef, useState } from "react";

import { Modal } from "../../../components/Modal";
import styled from "styled-components";
import { facilityLoader, getAirportIcaoFromIdent } from "../../../lib/facility";
import {
    AirportRunway,
    DepartureProcedure,
    FacilityType,
    OneWayRunway,
    Procedure,
    RunwayUtils
} from "@microsoft/msfs-sdk";
import { IoCheckmark } from "react-icons/all";
import ScrollContainer from "react-indiana-drag-scroll";
import { FlightContext } from "../../../lib/FlightContext";
import { ModalContext } from "../index";


type SidStarModalProps = {
    icao: string;
    type: "sid" | "star"
}

export const SidStarModal: FC<SidStarModalProps> = ({ icao, type }) => {
    const [runways, setRunways] = useState<OneWayRunway[]>([]);
    const [displayProcedures, setDisplayProcedures] = useState<Procedure[]>([])
    const [selectedRunway, setSelectedRunway] = useState<OneWayRunway | null>(null);
    const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
    const allProcedures = useRef<Procedure[]>([]);
    const flightContext = useContext(FlightContext);
    const { setModal } = useContext(ModalContext);

    useEffect(() => {
        const getData = async () => {
            const airport = await facilityLoader.getFacility(FacilityType.Airport, getAirportIcaoFromIdent(icao));

            let newRunways: OneWayRunway[] = [];
            let newProcedures: Procedure[] = [];

            RunwayUtils.getOneWayRunwaysFromAirport(airport).forEach((runway) => newRunways.push(runway));
            if (type === "sid") {
                airport.departures.forEach((dep) => newProcedures.push(dep));
            } else {
                airport.arrivals.forEach((arr) => newProcedures.push(arr));
            }

            allProcedures.current = newProcedures;
            setRunways(newRunways);
            setDisplayProcedures(allProcedures.current);
        }

        void getData();
    }, []);

    const onSelectRunway = (runway: OneWayRunway): void => {
        setSelectedRunway(runway);
        setDisplayProcedures(getMatchingProceduresFromRunway(runway));
    };

    const getMatchingProceduresFromRunway = (runway: OneWayRunway): Procedure[] => {
        const matching: Procedure[] = [];

        for (const procedure of allProcedures.current) {
            procedure.runwayTransitions.forEach((trans) => {
                const runwayString = RunwayUtils.getRunwayNameString(trans.runwayNumber, trans.runwayDesignation);

                if (runwayString === runway.designation) {
                    matching.push(procedure);
                }
            });
        }

        return matching;
    };

    const onClickAdd = () => {
        console.log("clicked")
        if (selectedRunway && selectedProcedure) {
            if (type === "sid") {
                flightContext.setDepartureRunway(selectedRunway);
                flightContext.setDepartureProcedure(selectedProcedure)
            } else {
                flightContext.setArrivalRunway(selectedRunway);
                flightContext.setArrivalProcedure(selectedProcedure);
            }
        }

        setModal(null);
    };

    return (
        <Modal>
            <SidStarModalContainer>
                <TitleSection>
                    <Cancel onClick={() => setModal(null)}>Cancel</Cancel>
                    <div>{icao} {type === "sid" ? "Departures" : "Arrivals"}</div>
                </TitleSection>
                <MainSection>
                    <SelectionColumn style={{ borderRight: "1px solid #b9b9bb" }}>
                        <ColumnTitle>
                            <div>Runway</div>
                        </ColumnTitle>
                        <ScrollContainer>
                            {runways.map((runway) => (
                                <ColumnItem
                                    onClick={() => onSelectRunway(runway)}>
                                    <div>{runway.designation}</div>
                                    {selectedRunway && selectedRunway.designation === runway.designation &&
                                        <IoCheckmark color="#1476fb" size={30} style={{ marginRight: "20px" }} />}
                                </ColumnItem>
                            ))}
                        </ScrollContainer>
                    </SelectionColumn>
                    <SelectionColumn>
                        <ColumnTitle>
                            <div>{type === "sid" ? "Departures" : "Arrivals"}</div>
                        </ColumnTitle>
                        <ScrollContainer>
                            {displayProcedures.map((proc, _) => (
                                <ColumnItem onClick={() => setSelectedProcedure(proc)}>
                                    <div>{proc.name}</div>
                                    {selectedProcedure && selectedProcedure.name === proc.name &&
                                        <IoCheckmark color="#1476fb" size={30} style={{ marginRight: "20px" }} />}
                                </ColumnItem>))}
                        </ScrollContainer>
                    </SelectionColumn>
                </MainSection>
                {selectedRunway && selectedProcedure && <AddButtonContainer onClick={onClickAdd}>
                    <div >Add {`RW${selectedRunway.designation}.${selectedProcedure.name}`} to Route</div>
                </AddButtonContainer>}
            </SidStarModalContainer>
        </Modal>
    )
};

const AddButtonContainer = styled.div`
    border-top: 1px solid #b9b9bb;
    width: 100%;
    padding: 12px;

    div {
        background: #1BAC66;
        color: white;
        font-size: 20px;
        font-weight: 400;
        width: 100%;
        padding: 20px;
        border-radius: 5px;
        text-align: center;
    }
`;

const ColumnItem = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #b9b9bb;
    align-items: center;
    background: white;
    flex-shrink: 0;

    div {
        padding: 20px;
    }
`;

const ColumnTitle = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid #b9b9bb;
    color: #4f4f4f;
    flex-shrink: 0;

    div {
        padding: 10px 25px;
    }
`;

const SidStarModalContainer = styled.div`
    width: 550px;
    height: 800px;
    display: flex;
    flex-direction: column;
    color: black;
    font-weight: 500;
    flex-shrink: 0;
    border-radius: 20px;
    overflow: hidden;
`;

const TitleSection = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-bottom: 1px solid #b9b9bb;
    white-space: nowrap;
    justify-items: center;
    font-weight: 500;
    font-size: 26px;

    div {
        padding: 25px 15px;
    }

`;

const Cancel = styled.div`
    justify-self: start;
    font-weight: 400;
    color: #1476fb;
    font-size: 24px;
`;

const MainSection = styled.div`
    width: 100%;
    display: flex;
    flex: 1 0;
`;

const SelectionColumn = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 0;
    font-size: 22px;
    flex-shrink: 0;
`;