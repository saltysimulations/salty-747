import React, { FC, useState } from "react";
import ReactDOMServer from "react-dom/server";
import styled from "styled-components";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L, { Map } from "leaflet";
import { useSimVar } from "react-msfs";
import { FiNavigation2 } from "react-icons/fi";
import { NavigraphTileLayer } from "@navigraph/leaflet"

import "./EnrouteChartView.scss";
import "leaflet/dist/leaflet.css";
import plane from "../../img/plane.svg";
import { ChartControlContainer, ChartControlItem } from "./components/ChartControls";
import { auth } from "../../lib/navigraph";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/all";

export const EnrouteChartView: FC = () => {
    const [latitude] = useSimVar("PLANE LATITUDE", "degrees");
    const [longitude] = useSimVar("PLANE LONGITUDE", "degrees");
    const [heading] = useSimVar("PLANE HEADING DEGREES TRUE", "degrees");
    const [tileLayer] = useState<NavigraphTileLayer>(
        new NavigraphTileLayer(auth, { source: "IFR HIGH", type: "Navigraph", theme: "DAY", forceRetina: true })
    );

    const whenCreated = (map: Map) => {
        tileLayer.addTo(map);
        map.setView([latitude, longitude]);
    }

    return (
        <Container>
            <MapContainer center={[0, 0]} zoom={10} scrollWheelZoom={true}
                          whenCreated={whenCreated}>
                <Controls />
                <Marker
                    position={[latitude, longitude]}
                    icon={L.divIcon({
                        html: ReactDOMServer.renderToString(
                            <FiNavigation2
                                size={60}
                                fill="magenta"
                                style={{ transformOrigin: "center", transform: `rotate(${heading}deg)` }}
                            />),
                    })}
                />
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
