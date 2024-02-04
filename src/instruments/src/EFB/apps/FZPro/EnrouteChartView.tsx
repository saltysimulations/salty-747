import React, { FC } from "react";
import styled from "styled-components";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Map } from "leaflet";
import { useSimVar } from "react-msfs";

import "./EnrouteChartView.scss";
import "leaflet/dist/leaflet.css";


export const EnrouteChartView: FC = () => {
    const [latitude] = useSimVar("PLANE LATITUDE", "degrees");
    const [longitude] = useSimVar("PLANE LONGITUDE", "degrees");

    return (
        <Container>
            <MapContainer center={[0, 0]} zoom={10} scrollWheelZoom={true} whenCreated={(map: Map) => map.setView([latitude, longitude])}>
                <TileLayer url="https://enroute-bitmap.charts.api-v2.navigraph.com/styles/ifr.lo.night/{z}/{x}/{y}@2x.png" />
            </MapContainer>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    height: 100%;
`;
