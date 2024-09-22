import React, { FC, useContext, useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import styled from "styled-components";
import { MapContainer, Marker, useMap, Polyline } from "react-leaflet";
import L, { Map } from "leaflet";
import { useSimVar } from "react-msfs";
import { FiNavigation2, GiStarShuriken } from "react-icons/all";
import { NavigraphTileLayer } from "@navigraph/leaflet"
import { ChartControlContainer, ChartControlItem } from "./components/ChartControls";
import { auth } from "../../lib/navigraph";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/all";
import { FlightContext } from "./FlightPlan";
import { SimbriefOfp } from "@microsoft/msfs-sdk";

import "./EnrouteChartView.scss";
import "leaflet/dist/leaflet.css";

export const EnrouteChartView: FC = () => {
    const [latitude] = useSimVar("PLANE LATITUDE", "degrees");
    const [longitude] = useSimVar("PLANE LONGITUDE", "degrees");
    const [heading] = useSimVar("PLANE HEADING DEGREES TRUE", "degrees");

    const [tileLayer] = useState<NavigraphTileLayer>(
        new NavigraphTileLayer(auth, { source: "IFR HIGH", type: "Navigraph", theme: "DAY", forceRetina: true })
    );
    const [polyline, setPolyline] = useState<L.LatLngExpression[]>();

    const { ofp } = useContext(FlightContext);

    const whenCreated = (map: Map) => {
        tileLayer.addTo(map);
        map.setView([latitude, longitude]);
    }

    const buildPolyline = (ofp: SimbriefOfp): L.LatLngExpression[] =>
        ofp.navlog.fix.map((fix) => new L.LatLng(parseFloat(fix.pos_lat), parseFloat(fix.pos_long)));

    useEffect(() => {
        ofp && setPolyline(buildPolyline(ofp));
    }, [ofp]);

    return (
        <Container>
            <MapContainer center={[0, 0]} zoom={10} scrollWheelZoom={true} whenCreated={whenCreated}>
                <Controls />
                <Marker
                    position={[latitude, longitude]}
                    icon={L.divIcon({
                        html: ReactDOMServer.renderToString(
                            <FiNavigation2 size={60} fill="magenta" style={{ transformOrigin: "center", transform: `rotate(${heading}deg)` }} />
                        ),
                    })}
                />
                {ofp &&
                    ofp.navlog.fix.map((fix, index) => (
                        fix.ident !== "TOD" && fix.ident !== "TOC" && <Marker
                            position={[parseFloat(fix.pos_lat), parseFloat(fix.pos_long)]}
                            icon={L.divIcon({
                                html: ReactDOMServer.renderToString(
                                    <Waypoint>
                                        <GiStarShuriken size={35} fill="black" style={{ position: "absolute" }} />
                                        <div>{fix.ident}</div>
                                    </Waypoint>
                                ),
                                iconAnchor: [17.5, 17.5],
                            })}
                            key={index}
                        />
                    ))}
                {ofp && polyline && <Polyline color="#08068B" opacity={0.6} smoothFactor={10} weight={6} positions={polyline} />}
            </MapContainer>
        </Container>
    );
};

const Controls: FC = () => {
    const map = useMap();

    return (
        <ChartControlContainer>
            <ChartControlItem onClick={() => map.zoomIn()}>
                <AiOutlineZoomIn color="white" size={45} />
            </ChartControlItem>
            <ChartControlItem onClick={() => map.zoomOut()}>
                <AiOutlineZoomOut color="white" size={45} />
            </ChartControlItem>
        </ChartControlContainer>
    );
};

const Container = styled.div`
    width: 100%;
    height: 100%;
`;

const Waypoint = styled.div`
    color: black;
    font-size: 20px;
    font-weight: 500;

    div {
        margin-left: 35px;
    }
`;
