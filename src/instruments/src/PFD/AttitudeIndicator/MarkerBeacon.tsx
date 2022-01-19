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

import React, { FC, useEffect, useState } from "react";
import { useSimVar } from "react-msfs";

export const MarkerBeacon: FC = () => {
    const [markerState] = useSimVar("MARKER BEACON STATE", "enum");

    const getTextColour = (i: number): string => {
        if (i == 1) return "cyan";
        else if (i == 2) return "amber";
        else if (i == 3) return "white";
        else return "";
    };

    const getRingColour = (i: number): string => {
        if (i == 1) return "cyan";
        else if (i == 2) return "#ffc400";
        else if (i == 3) return "white";
        else return "";
    };

    const getBeaconText = (i: number): string => {
        if (i == 1) return "OM";
        else if (i == 2) return "MM";
        else if (i == 3) return "IM";
        else return "";
    };

    return (
        <g visibility={markerState == 0 ? "hidden" : "visible"}>
            {/* Marker Circle */}
            <circle cx="510" cy="210" r="22" fill="black" className="fpv-outline" />
            <circle cx="510" cy="210" r="22" fill="black" strokeWidth="3px" stroke={getRingColour(markerState)} />
            
            {/* Marker Text */}
            <text x="510" y="221" className={`text-3 ${getTextColour(markerState)} middle`} fillOpacity={0.9}>{getBeaconText(markerState)}</text>
        </g>
    );
};