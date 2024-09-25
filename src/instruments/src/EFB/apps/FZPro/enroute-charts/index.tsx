import React, { FC, useContext, useEffect, useState } from "react";
import { useSimVar } from "react-msfs";
import { NavigraphTileLayer, PresetConfig } from "@navigraph/leaflet";
import { auth } from "../../../lib/navigraph";
import L, { Map } from "leaflet";
import { FlightContext } from "../FlightPlan";
import { SimbriefOfp } from "@microsoft/msfs-sdk";
import { MapContainer, Marker, Polyline } from "react-leaflet";
import { Controls } from "./Controls";
import ReactDOMServer from "react-dom/server";
import { FiNavigation2 } from "react-icons/all";
import { WaypointMarkers } from "./WaypointMarkers";
import styled from "styled-components";
import "./EnrouteChartView.scss";
import { FZProContext } from "../AppContext";

export const EnrouteChartView: FC = () => {
    const [latitude] = useSimVar("PLANE LATITUDE", "degrees");
    const [longitude] = useSimVar("PLANE LONGITUDE", "degrees");
    const [heading] = useSimVar("PLANE HEADING DEGREES TRUE", "degrees");

    const { ofp } = useContext(FlightContext);
    const { enrouteChartPreset: preset } = useContext(FZProContext);

    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [tileLayer] = useState<NavigraphTileLayer>(new NavigraphTileLayer(auth, preset));
    const [polyline, setPolyline] = useState<L.LatLngExpression[]>();



    const buildPolyline = (ofp: SimbriefOfp): L.LatLngExpression[] =>
        ofp.navlog.fix.map((fix) => new L.LatLng(parseFloat(fix.pos_lat), parseFloat(fix.pos_long)));

    const whenCreated = (map: Map) => {
        tileLayer.addTo(map);
        map.setView([latitude, longitude]);
        setMapLoaded(true);
    };

    const polylineColor = preset.theme === "DAY" ? "#08068B" : "#8af3ff";

    useEffect(() => {
        ofp && setPolyline(buildPolyline(ofp));
    }, [ofp]);

    useEffect(() => {
        mapLoaded && tileLayer.setPreset(preset);
    }, [preset]);

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
                        iconAnchor: [30, 30],
                    })}
                />
                {ofp && <WaypointMarkers fixes={ofp.navlog.fix} theme={preset.theme ?? "DAY"} />}
                {ofp && polyline && (
                    <Polyline pathOptions={{ color: polylineColor }} opacity={0.6} smoothFactor={10} weight={6} positions={polyline} />
                )}
            </MapContainer>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    height: 100%;
`;
