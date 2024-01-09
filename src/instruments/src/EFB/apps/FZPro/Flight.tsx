import React, { FC, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { TitleAndClose } from "./components/TitleAndClose";
import { Input } from "./components/Input";
import { AiFillCloseCircle, AiOutlineCloudDownload, FaArrowsAltH } from "react-icons/all";
import { facilityLoader, getAirportIcaoFromIdent, getIdentFromIcao } from "../../lib/facility";
import { AirportFacility, FacilityType } from "@microsoft/msfs-sdk";
import { ModalContext } from "./index";
import { SidStarModal } from "./components/SidStarModal";
import { FlightContext, getDisplayArray } from "./FlightPlan";
import { useNavigate } from "react-router-dom";

export const Flight: FC = () => {
    const flightContext = useContext(FlightContext)
    const navigate = useNavigate();

    const {
        departureAirport,
        setDepartureAirport,
        arrivalAirport,
        setArrivalAirport
    } = flightContext;

    const displayArray = getDisplayArray(flightContext);

    return (
        <>
            <FlightContainer>
                <TitleAndClose label="Flight" onClose={() => navigate("/fzpro")} />
                <FlightButtons>
                    <div>New Flight</div>
                    <div>
                        <AiOutlineCloudDownload size={45} color="black" style={{ padding: 0, margin: 0 }} />
                    </div>
                </FlightButtons>
                <RouteContainer>
                    <div style={{ position: "relative" }}>
                        <DepartureArrivalField airport={departureAirport} setAirport={setDepartureAirport} type="departure" />
                        <div style={{ position: "relative", width: "70%" }}>
                            {departureAirport && arrivalAirport &&
                                <SwitchArrow><FaArrowsAltH size={30} color="626A6D" /></SwitchArrow>}
                        </div>
                        <DepartureArrivalField airport={arrivalAirport} setAirport={setArrivalAirport} type="arrival" />
                    </div>
                    <Airport>
                        <Input
                            placeholder="Enter Navaids, Waypoints and Airways"
                            style={{
                                borderRadius: 0,
                                padding: "25px 15px",
                                fontSize: "26px",
                                width: "100%",
                                height: "350px"
                            }}
                            centerPlaceholder={false}
                            textarea
                            clearOnFocusOut
                            hidePlaceholder={displayArray.length !== 0}
                        />
                        <RouteInputItemField>
                            {getDisplayArray(useContext(FlightContext)).map((item) => <InputItem>{item}</InputItem>)}
                        </RouteInputItemField>
                    </Airport>
                    <Airport>
                        <Input
                            placeholder="Enter Alternates"
                            style={{
                                borderRadius: "0 0 15px 15px",
                                padding: "25px 15px",
                                fontSize: "26px",
                                width: "100%",
                                height: "150px"
                            }}
                            centerPlaceholder={false}
                            textarea
                            clearOnFocusOut
                        />
                    </Airport>
                </RouteContainer>
            </FlightContainer>
        </>
    );
};

type DepartureArrivalFieldProps = {
    airport: AirportFacility | null,
    setAirport: (airport: AirportFacility | null) => void,
    type: "departure" | "arrival"
}
const DepartureArrivalField: FC<DepartureArrivalFieldProps> = ({ airport, setAirport, type}) => {
    const { setModal } = useContext(ModalContext);

    const inputStyle = {
        borderRadius: "15px 0 0 0",
        padding: "25px 15px",
        fontSize: "26px",
        width: "70%"
    };

    const airportIcao = airport && getIdentFromIcao(airport.icao);

    const onFocusOut = async (val: string) => {
        setAirport(await facilityLoader.getFacility(FacilityType.Airport, getAirportIcaoFromIdent(val)));
    };

    const onClickSidStar = () => {
        if (airportIcao) {
            setModal(<SidStarModal icao={airportIcao} type={type === "departure" ? "sid" : "star"} />);
        }
    };

    return (
        <Airport>
            <Input
                placeholder={type === "departure" ? "Enter an Origin" : "Enter a Destination"}
                centerPlaceholder={false}
                hidePlaceholder={!!airport}
                style={inputStyle}
                onFocusOut={onFocusOut}
                onFocus={() => setAirport(null)}
                applyFilters={(val) => val.toUpperCase()}
                clearOnFocusOut
            />
            {airport && <InputItemField>
                <InputItem>{airportIcao}</InputItem>
                <AiFillCloseCircle size={30} color="CDD1D5" onClick={() => setAirport(null)} />
            </InputItemField>}
            <SidStarSection>
                <div onClick={onClickSidStar}>{type === "departure" ? "SID" : "STAR"}</div>
            </SidStarSection>
        </Airport>
    );
};

const SwitchArrow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 25px;
    border-radius: 15px;
    border: 2px solid #b9b9bb;
    background: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const InputItemField = styled.div`
    padding: 25px 15px;
    font-size: 26px;
    width: 70%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none;
`;

const RouteInputItemField = styled.div`
    padding: 25px 15px;
    font-size: 26px;
    flex: 1;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    
    div {
        margin-right: 10px;
    }
`;

const InputItem = styled.div`
    padding: 6px 15px;
    background: #607184;
    color: white;
    border-radius: 30px;
    font-weight: 500;
`;

const SidStarSection = styled.div`
    flex-grow: 1;
    border-bottom: 1px solid #b9b9bb;
    border-left: 1px solid #b9b9bb;
    display: flex;
    align-items: center;
    justify-content: center;

    &:first-child {
        border-radius: 0 15px 0 0;
    }

    div {
        width: 75%;
        height: 60%;
        border: 2px solid #b9b9bb;
        color: #626A6D;
        font-size: 26px;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        border-radius: 5px;
    }
`;

const Airport = styled.div`
    position: relative;
    display: flex;
`;

const RouteContainer = styled.div`
    width: 98%;
    background: white;
    display: flex;
    flex-direction: column;
    border-radius: 15px;
`;

const FlightButtons = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;

    div {
        margin: 20px;
        font-size: 24px;
        font-weight: 500;
        border-radius: 8px;
        padding: 5px 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: white;
    }
`;

const FlightContainer = styled.div`
    width: 500px;
    height: 100%;
    position: absolute;
    background: #DFE5EF;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: black;
`;
