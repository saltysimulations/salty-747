import React, { FC, useContext } from "react";
import styled from "styled-components";
import { TitleAndClose } from "./components/TitleAndClose";
import { AiOutlineCloudDownload } from "react-icons/all";
import { SimbriefClient, SimbriefOfp } from "@microsoft/msfs-sdk";
import { FlightContext } from "./FlightPlan";
import { useNavigate } from "react-router-dom";
import { useSetting } from "../../hooks/useSettings";
import ScrollContainer from "react-indiana-drag-scroll";

export const Flight: FC = () => {
    const flightContext = useContext(FlightContext);
    const { ofp, setOfp } = flightContext;

    const navigate = useNavigate();

    const [simbriefUsername] = useSetting("boeingMsfsSimbriefUsername");

    const onUplink = async () => {
        setOfp(await SimbriefClient.getOfp(await SimbriefClient.getSimbriefUserIDFromUsername(simbriefUsername as string)));
    };

    // TODO: make this return route instead of every fix
    const navlogToRoute = (ofp: SimbriefOfp): string[] => {
        const arr = [];

        const last = ofp.navlog.fix.length - 1;
        const depString =
            parseInt(ofp.navlog.fix[0].is_sid_star) === 1 ? `RW${ofp.origin.plan_rwy}.${ofp.navlog.fix[0].via_airway}` : `${ofp.origin.plan_rwy}`;
        const arrString =
            parseInt(ofp.navlog.fix[last].is_sid_star) === 1
                ? `RW${ofp.destination.plan_rwy}.${ofp.navlog.fix[last].via_airway}`
                : `${ofp.destination.plan_rwy}`;

        arr.push(depString);

        for (const fix of ofp.navlog.fix) {
            if (fix.ident !== "TOC" && fix.ident !== "TOD" && parseInt(fix.is_sid_star) !== 1) {
                arr.push(fix.ident);
            }
        }

        arr.push(arrString);

        return arr;
    };

    return (
        <>
            <FlightContainer>
                <TitleAndClose label="Flight" onClose={() => navigate("/fzpro")} />
                <FlightButtons>
                    <div onClick={() => setOfp(null)}>New Flight</div>
                    <div onClick={onUplink}>
                        <AiOutlineCloudDownload size={45} color="black" style={{ padding: 0, margin: 0 }} />
                    </div>
                </FlightButtons>
                <RouteContainer>
                    <FlightColumn label="ORIGIN" height={50} items={ofp && [<InputItem>{ofp.origin.icao_code}</InputItem>]} />
                    <FlightColumn label="ARRIVAL" height={50} items={ofp && [<InputItem>{ofp.destination.icao_code}</InputItem>]} />
                    <FlightColumn
                        label="NAVAIDS, WAYPOINTS, AIRWAYS"
                        height={300}
                        items={ofp && navlogToRoute(ofp).map((item, i) => <InputItem key={i}>{item}</InputItem>)}
                    />
                    <FlightColumn
                        label="ALTERNATES"
                        height={125}
                        items={ofp && "icao_code" in ofp.alternate ? [<InputItem>{ofp.alternate.icao_code}</InputItem>] : null}
                    />
                </RouteContainer>
            </FlightContainer>
        </>
    );
};

type FlightColumnProps = {
    label: string;
    height: number;
    items?: React.ReactNode[] | null;
};

const FlightColumn: FC<FlightColumnProps> = ({ label, height, items }) => (
    <InfoContainer>
        <InfoLabel>{label}</InfoLabel>
        <ScrollContainer>
            <FlightColumnInner height={height} multiple={items ? items.length > 1 : false}>
                {items}
            </FlightColumnInner>
        </ScrollContainer>
    </InfoContainer>
);

type FlightColumnInnerProps = { height: number; multiple: boolean };

const FlightColumnInner = styled.div`
    display: flex;
    height: ${(props: FlightColumnInnerProps) => props.height}px;
    flex-flow: row wrap;
    overflow: hidden;
    align-items: ${(props: FlightColumnInnerProps) => (props.multiple ? "start" : "center")};
    ${(props: FlightColumnInnerProps) => props.multiple && "align-content: flex-start;"};
`;

const InputItem = styled.div`
    padding: 6px 15px;
    font-size: 24px;
    margin: 5px;
    background: #607184;
    color: white;
    border-radius: 30px;
    font-weight: 500;
    flex: 0 0;
    align-self: start;
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid lightgray;
`;

const InfoLabel = styled.div`
    color: gray;
    font-size: 18px;
    margin: 5px;
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
    background: #dfe5ef;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: black;
`;
