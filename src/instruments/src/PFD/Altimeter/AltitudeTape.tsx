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

const getAltitudeY = (altitude: number): number => {
    const y = altitude * 0.68;
    return y;
};

const getLargeSelAltText = (altitude: number): string => {
    let text = altitude.toString().substring(0, altitude >= 10000 ? 2 : 1);
    if (altitude < 1000) {
        text = "";
    }
    return text;
};

const getSmallSelAltText = (altitude: number): string => {
    const string = altitude.toString();
    const text = string.substring(string.length - 3)
    return text;
};

export const AltitudeTape: FC = () => {
    const [altitude] = useSimVar("INDICATED ALTITUDE", "feet");
    const [altAlertStatus] = useSimVar("L:SALTY_ALTITUDE_ALERT", "number");
    return (
        <g>
            <clipPath id="altitudetape-clip">
                <path d="M590 100, h110, v560, h-110 Z" />
            </clipPath>

            <g clipPath="url(#altitudetape-clip)">
                <g transform={`translate(50 ${getAltitudeY(altitude)})`}>
                    {Array.from({ length: 501 }, (_, i) => {
                        const y = i * -68 + 382;
                        const x = (i * 200) % 500 == 0 ? "M540" : "M550";
                        const length = (i * 200) % 500 == 0 ? "h25" : "h15";
                        const lineclassName = (i * 200) % 500 == 0 ? "halfThousandLine" : "white-line";
                        const outlineclassName = (i * 200) % 500 == 0 ? "halfThousandOutline" : "black-outline";
                        return (
                            <>
                                <path className={outlineclassName} d={`${x || 0} ${y || 0}, ${length || 0}`} />
                                <path className={lineclassName} d={`${x || 0} ${y || 0}, ${length || 0}`} />
                            </>
                        );
                    })}
                    {Array.from({ length: 9 }, (_, i) => {
                        const y = i * 68 + 382;
                        const x = (i * 200) % 500 == 0 ? "M540" : "M550";
                        const length = (i * 200) % 500 == 0 ? "h25" : "h15";
                        const lineclassName = (i * 200) % 500 == 0 ? "halfThousandLine" : "white-line";
                        const outlineclassName = (i * 200) % 500 == 0 ? "halfThousandOutline" : "black-outline";
                        return (
                            <>
                                <path className={outlineclassName} d={`${x || 0} ${y || 0}, ${length || 0}`} />
                                <path className={lineclassName} d={`${x || 0} ${y || 0}, ${length || 0}`} />
                            </>
                        );
                    })}
                    {Array.from({ length: 51 }, (_, i) => {
                        const y = i * -680 + 365;
                        return (
                            <>
                                <path className="fpv-outline" d={`M570 ${y || 0}, h79`} />
                                <path className="fpv-line" d={`M570 ${y || 0}, h79`} />
                                <path className="fpv-outline" d={`M570 ${y + 34 || 0}, h79`} />
                                <path className="fpv-line" d={`M570 ${y + 34 || 0}, h79`} />
                            </>
                        );
                    })}
                    {Array.from({ length: 251 }, (_, i) => {
                        const y = i * -136 + 382;
                        const offset = 11;
                        let text = ((i  * 200)).toFixed(0);
                        let hundredsText = text.substring(text.length - 3);
                        let thousandsText = text.substring(0, 2);
                        if (i < 5) {
                            thousandsText = "";
                        }
                        else if (i < 50) {
                            thousandsText = text.substring(0, 1);
                        }
                        return (
                            <>
                                <text x="638" y={`${y + offset}`} className="text-2">
                                    {hundredsText}
                                </text>
                                <text x="600" y={`${y + offset}`} className="text-3">
                                    {thousandsText}
                                </text>
                            </>
                        );
                    })}
                    {Array.from({ length: 5 }, (_, i) => {
                        const y = i * 136 + 382;
                        const offset = 11;
                        let text = ((i  * 200)).toFixed(0);
                        let hundredsText = "-" + text.substring(text.length - 3);
                        if (i == 0) {
                            hundredsText = ""
                        }
                        return (
                            <>
                                <text x="638" y={`${y + offset}`} className="text-2">
                                    {hundredsText}
                                </text>
                            </>
                        );
                    })}
                </g>
            </g>
            <path className="gray-bg" d="M 615 332, h 73, v 100, h -73, Z" />

            {/* Altimeter Scroller Box */}
            <path
                className="indication"
                style={{ strokeWidth: "5px", stroke: "black" }}
                d="M 632 342 h 104 v 78 h -104 v -28 l -14 -11 l 14 -11 Z"
            />
            <path 
                style={{ strokeWidth: (altAlertStatus != 0 ? "9px" : "3px"), stroke: (altAlertStatus != 2 ? "white" : "#ffc400") }}
                className="indication" 
                d="M 632 342 h 104 v 78 h -104 v -28 l -14 -11 l 14 -11 Z" />
        </g>     
    );
};

export const CommandAlt: FC = () => {
    const [selAlt] = useSimVar("AUTOPILOT ALTITUDE LOCK VAR:1", "feet");
    const [altAlertStatus] = useSimVar("L:SALTY_ALTITUDE_ALERT", "number");

    return (
        <g>
            <text x="648" y="80" className="text-4 magenta">
                {getLargeSelAltText(selAlt)}
            </text>
            <text x="695" y="80" className="text-3 magenta">
                {getSmallSelAltText(selAlt)}
            </text>
            <path className= "indication" 
                d="M 600 45, h 100, v40, h-100, Z" 
                fill= "none"
                visibility = {( altAlertStatus == 1 ? "visible" : "hidden")}/>
        </g>
    );
};