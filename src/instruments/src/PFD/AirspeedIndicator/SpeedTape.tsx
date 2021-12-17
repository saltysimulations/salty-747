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

const getVRbugText = (v1: number, vR: number): string => {
    if ((vR - v1) < 4) {
        return "R"
    }
    return "VR";
};

const getCurrentFlapMarkerText = (flapsHandle: number): string => {
    switch (flapsHandle) {
        case 0:
            return "UP";
        case 1:
            return "1\xa0";
        case 2:
            return "5\xa0";
        case 3:
            return "10";
        case 4:
            return "20";
        case 5:
            return "25";
    }
    return "";
};

const getCurrentFlapMarkerSpeed = (flapsHandle: number, vRef30: number, vRef25: number, landingFlaps: number): number => {
    switch (flapsHandle) {
        case 0:
            return vRef30 + 80;
        case 1:
            return vRef30 + 60;
        case 2:
            return vRef30 + 40;
        case 3:
            return vRef30 + 20;
        case 4:
            return vRef30 + 10;
        case 5:
            if (landingFlaps === 25) {
                return -1;
            }
        return vRef25;
    }
    return -1;
};

const getNextFlapMarkerText = (flapsHandle: number, landingFlaps: number): string => {
    switch (flapsHandle) {
        case 0:
            return "";
        case 1:
            return "UP";
        case 2:
            return "1\xa0";
        case 3:
            return "5\xa0";
        case 4:
            return "10";
        case 5:
            if (landingFlaps === 25) {
                return "";
            }
            return "20";
    }
    return "";
};

const getNextFlapMarkerSpeed = (flapsHandle: number, vRef30: number, vRef25: number, landingFlaps: number): number => {
    switch (flapsHandle) {
        case 0:
            return -1;
        case 1:
            return vRef30 + 80;
        case 2:
            return vRef30 + 60;
        case 3:
            return vRef30 + 40;
        case 4:
            return vRef30 + 20;
        case 5:
            if (landingFlaps === 25) {
                return -1;
            }
            return vRef30 + 10;
    }
    return -1;
};

export const SpeedTape: FC = () => {
    const [flightPhase] = useSimVar("L:AIRLINER_FLIGHT_PHASE", "number");
    const [selectedFlaps] = useSimVar("FLAPS HANDLE INDEX", "number");
    const [landingFlaps] = useSimVar("L:SALTY_SELECTED_APPROACH_FLAP", "number");
    const [radioHeight] = useSimVar("RADIO HEIGHT", "feet");
    const [airspeed] = useSimVar("AIRSPEED INDICATED", "knots");
    const [selSpd] = useSimVar("AUTOPILOT AIRSPEED HOLD VAR", "knots");
    const [manSpeed] = useSimVar("L:SALTY_MANEUVERING_SPEED", "knots");
    const [maxSpeed] = useSimVar("L:SALTY_MAXIMUM_SPEED", "knots");
    const [v1] = useSimVar("L:AIRLINER_V1_SPEED", "knots");
    const [vR] = useSimVar("L:AIRLINER_VR_SPEED", "knots");
    const [v2] = useSimVar("L:AIRLINER_V2_SPEED", "knots");
    const [vRef25] = useSimVar("L:SALTY_VREF25", "knots");
    const [vRef30] = useSimVar("L:SALTY_VREF30", "knots");
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
                    <g visibility= {`${radioHeight < 25 ? "visible" : "hidden"}`}>
                        {/* V1 Bug */}
                        <g>
                            <path className="fpv-outline" d={`M 45 ${520 + (v1 * -4.6)}, h20`} />
                            <path className="green-line" d={`M 45 ${520 + (v1 * -4.6)}, h20`} />
                            <text x="93" y={`${Math.max(529 + (v1 * -4.6), (520 + (airspeed + 54) * -4.6))}`} className="text-2 green">V1</text>
                        </g>

                        {/* VR Bug */}
                        <g>
                            <path className="fpv-outline" d={`M 55 ${520 + (vR * -4.6)}, h10`} />
                            <path className="green-line" d={`M 55 ${520 + (vR * -4.6)}, h10`} />
                            <text x="105" y={`${529 + vR * -4.6}`} className="text-2 green">{getVRbugText(v1, vR)}</text>
                        </g>
                    </g>

                    {/* V2 Bug */}
                    <g visibility= {`${flightPhase > 2 ? "hidden" : "visible"}`}>
                        <path className="fpv-outline" d={`M 55 ${520 + (v2 * -4.6)}, h10`} />
                        <path className="green-line" d={`M 55 ${520 + (v2 * -4.6)}, h10`} />
                        <text x="93" y={`${529 + v2 * -4.6}`} className="text-2 green">V2</text>
                    </g>

                    {/* Current Flap Manuevering Speed Bug */}
                    <g visibility= {`${flightPhase > 2 ? "visible" : "visible"}`}>
                        <path className="fpv-outline" d={`M 55 ${520 + (getCurrentFlapMarkerSpeed(selectedFlaps, vRef30, vRef25, landingFlaps) * -4.6)}, h10`} />
                        <path className="green-line" d={`M 55 ${520 + (getCurrentFlapMarkerSpeed(selectedFlaps, vRef30, vRef25, landingFlaps) * -4.6)}, h10`} />
                        <text x="93" y={`${529 + (getCurrentFlapMarkerSpeed(selectedFlaps, vRef30, vRef25, landingFlaps)) * -4.6}`} className="text-2 green">{getCurrentFlapMarkerText(selectedFlaps)}</text>
                    </g>

                    {/* Next Flap Manuevering Speed Bug */}
                    <g visibility= {`${flightPhase > 2 ? "visible" : "visible"}`}>
                        <path className="fpv-outline" d={`M 55 ${520 + (getNextFlapMarkerSpeed(selectedFlaps, vRef30, vRef25, landingFlaps)* -4.6)}, h10`} />
                        <path className="green-line" d={`M 55 ${520 + (getNextFlapMarkerSpeed(selectedFlaps, vRef30, vRef25, landingFlaps)* -4.6)}, h10`} />
                        <text x="93" y={`${529 + (getNextFlapMarkerSpeed(selectedFlaps, vRef30, vRef25, landingFlaps)) * -4.6}`} className="text-2 green">{getNextFlapMarkerText(selectedFlaps, landingFlaps)}</text>
                    </g>

                    {/* Selected Airspeed Bug */}
                    <g fill="none" >
                        <path className="black-outline" d={`M 49 ${Math.max(520 + (airspeed + 61.5) * -4.6, Math.min(520 + selSpd * -4.6, 520 + (airspeed - 60.5) * -4.6))}, l 15 11.5, h32, v-23, h-32, Z`} />
                        <path className="magenta-line" d={`M 49 ${Math.max(520 + (airspeed + 61.5) * -4.6, Math.min(520 + selSpd * -4.6, 520 + (airspeed - 60.5) * -4.6))}, l 15 11.5, h32, v-23, h-32, Z`} />
                    </g>
                </g>

                {/* V1 Value Preview */}
                <g>
                    <text visibility={`${v1 - airspeed > 55 ? "visible" : "hidden"}`}x="155" y={`${155}`} className="text-2 green">{v1.toString()}</text>
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