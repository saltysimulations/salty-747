/**
 * Salty 74S
 * Copyright (C) 2021 Salty Simulations and its contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { FC } from "react";
import styled from "styled-components";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L, { Map } from "leaflet";
import { useSimVar } from "react-msfs";
import "leaflet/dist/leaflet.css";

import "./Map.scss";
import { Controls } from "./Controls";

import plane from "../../img/plane.svg";

// TODO: Make map controls functional, revise plane icon
export const Maps: FC = () => {
    const [latitude] = useSimVar("PLANE LATITUDE", "degrees");
    const [longitude] = useSimVar("PLANE LONGITUDE", "degrees");
    const [heading] = useSimVar("PLANE HEADING DEGREES TRUE", "degrees");

    return (
        <MapRoot>
            <MapContainer center={[0, 0]} zoom={8} scrollWheelZoom={true} whenCreated={(map: Map) => map.setView([latitude, longitude])}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    position={[latitude, longitude]}
                    icon={L.divIcon({
                        iconSize: [50, 50],
                        iconAnchor: [25, 25],
                        html: `<img src="${plane}" width="50" style="transform-origin: center; transform: rotate(${heading}deg);" alt="" />`,
                    })}
                />
                <Controls />
            </MapContainer>
        </MapRoot>
    );
};

const MapRoot = styled.div`
    width: 100%;
    height: 100%;
`;
