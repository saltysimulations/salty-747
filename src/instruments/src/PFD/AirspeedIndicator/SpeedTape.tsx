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
import { useSimVar } from "react-msfs";
import { BlackOutlineWhiteLine } from "../index";
import { removeLeadingZeros } from "@instruments/common/utils/heading";

const getAirspeedY = (airspeed: number): number => {
    let y = Math.max(airspeed - 30, 0) * 4.6;
    return y;
};

const getManeuveringBandY = (airspeed: number, manSpeed: number): number => {
    let y = (airspeed - manSpeed) * 4.6;
    return y;
};

const getMaxSpeedBandY = (airspeed: number, maxSpeed: number): number => {
    let y = (airspeed - maxSpeed) * 4.6;
    return y;
};

export const SpeedTape: FC = () => {
    const [airspeed] = useSimVar("AIRSPEED INDICATED", "knots");
    const [selSpd] = useSimVar("AUTOPILOT AIRSPEED HOLD VAR:1", "knots");
    const [manSpeed] = useSimVar("L:SALTY_MANEUVERING_SPEED", "knots");
    const [maxSpeed] = useSimVar("L:SALTY_MAXIMUM_SPEED", "knots");
    return (
        <g>
            <clipPath id="speedtape-clip">
                <path d="M13 100, h200 v560 h -200 Z" />
            </clipPath>

            <g clipPath="url(#speedtape-clip)">
                <g transform={`translate(50 ${getAirspeedY(airspeed)})`}>
                    {Array.from({ length: 40 }, (_, i) => {
                        const y = i * -46 + 382;
                        return (
                            <>
                                <BlackOutlineWhiteLine d={`M47 ${y || 0}, h15`} />
                            </>
                        );
                    })}
                    {Array.from({ length: 21 }, (_, i) => {
                        const y = i * -92 + 428;
                        const offset = 11;
                        let text = ((i + 1) * 20).toFixed(0);
                        if (i == 0) {
                            text = "";
                        }
                        return (
                            <>
                                <text x="32" y={`${y + offset}`} className="text-3 white">
                                    {text}
                                </text>
                            </>
                        );
                    })}
                    {/* Selected Airspeed Bug */}
                    <g fill="none" >
                        <path className="black-outline" d={`M 49 ${Math.max(520 + (airspeed + 61.5) * -4.6, Math.min(520 + selSpd * -4.6, 520 + (airspeed - 60.5) * -4.6))}, l 15 11.5, h32, v-23, h-32, Z`}/>
                        <path className="magenta-line" d={`M 49 ${Math.max(520 + (airspeed + 61.5) * -4.6, Math.min(520 + selSpd * -4.6, 520 + (airspeed - 60.5) * -4.6))}, l 15 11.5, h32, v-23, h-32, Z`}/>
                    </g>
                </g>

                {/*Maneuvering Speed Band*/}
                <g transform={`translate(50 ${getManeuveringBandY(airspeed, manSpeed)})`}>
                    <path className="black-outline" d="M 62 382, h7, v 1800" fill="none" />
                    <path className="amber-line" d="M 62 382, h7, v 1800" fill="none" />
                </g>

                {/*Maximum Speed Band*/}
                <g transform={`translate(50 ${getMaxSpeedBandY(airspeed, maxSpeed)})`}>
                    <path className="red-band" d="M 60 -1820, h7, v 2202" fill="none" />
                </g>
            </g>
            <path className="gray-bg" d="M 14 332, h 71, v 100, h -71, Z" />

            {/* Scroller Box */}
            <path className="indication" style={{ strokeWidth: "5px",  stroke: "black "}} d="M 10 342 h 72 v 28 l 14 11 l -14 11 v 28 h -72 Z" />
            <path className="indication" style={{ strokeWidth: airspeed < manSpeed ? "9px" : "3px", stroke: airspeed < manSpeed ? "#ffc400" : "white" }} d="M 10 342 h 72 v 28 l 14 11 l -14 11 v 28 h -72 Z" />
        </g>
        
    );
};

export const CommandSpeed: FC = () => {
    const [airspeed] = useSimVar("AUTOPILOT AIRSPEED HOLD VAR", "knots");
    const [machSpeed] = useSimVar("AUTOPILOT MACH HOLD VAR", "number");
    const [isInMach] = useSimVar("L:XMLVAR_AirSpeedIsInMach", "bool");

    return (
        <g>
            <text x="105" y="80" className="text-4 magenta">
                {isInMach ? removeLeadingZeros(machSpeed.toFixed(3) ?? 0) : airspeed.toFixed(0) ?? 0}
            </text>
        </g>
    );
};

export const MachGS: FC = () => {
    const [machSpeed] = useSimVar("L:SALTY_ADC_CURRENT_MACH", "number");
    const [groundSpeed] = useSimVar("GPS GROUND SPEED", "knots");

    return (
        <g>
            <text 
                x="100" y="730" 
                className="text-4"
                style = {{visibility: machSpeed >= 0.4 ? "visible" : "hidden"}}>
                {removeLeadingZeros(machSpeed.toFixed(3) ?? 0)}
            </text>
            <g style = {{visibility: machSpeed < 0.4 ? "visible" : "hidden"}}>
                <text x="46" y="730" className="text-3">
                    GS
                </text>
                <text 
                    x="110" y="730" 
                    className="text-4">
                    {groundSpeed.toFixed(0) ?? 0}
                </text>
            </g>
        </g>
    );
};