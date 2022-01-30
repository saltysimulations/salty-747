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

const removeTenThousands = (value: number): number => value % 10000;

const removeThousands = (value: number): number => value % 1000;

const removeHundreds = (value: number): number => value % 100;

const getTenThousandsScrollerY = (altitude: number): number => {
    let scroll = Math.floor(altitude / 10000) * 49;

    if (Math.floor(altitude).toString().slice(-4, -1) == "998" || Math.floor(altitude).toString().slice(-4, -1) == "999") {
        const altOver9980 = Math.round(altitude / 10000) * 10000 - 20 - altitude;
        scroll = scroll -altOver9980 * (altitude >= 0 ? 2.45 : -2.45);
    }

    return scroll;
};

const getThousandsScrollerY = (altitude: number): number => {
    const value = removeTenThousands(altitude);
    let scroll = altitude >= 0 ? Math.floor(value / 1000) * 49 : Math.ceil(value / 1000) * -49;

    if (Math.floor(value).toString().slice(-3, -1) == "98" || Math.floor(value).toString().slice(-3, -1) == "99") {
        const altOver9980 = Math.round(value / 1000) * 1000 - 20 - value;
        scroll = scroll -altOver9980 * (altitude >= 0 ? 2.45 : -2.45);
    }

    return scroll;
};

const getHundredsScrollerY = (altitude: number): number => {
    const value = removeThousands(altitude);
    let scroll = altitude >= 0 ? Math.floor(value / 100) * 49 : Math.ceil(value / 100) * -49;

    if (Math.floor(value).toString().slice(-2, -1) == "8" || Math.floor(value).toString().slice(-2, -1) == "9") {
        const altOver80 = Math.round(value / 100) * 100 - 20 - value;
        scroll = scroll -altOver80 * (altitude >= 0 ? 2.45 : -2.45);
    }

    return scroll;
};

const getTwentiesScrollerY = (altitude: number): number => {
    const value = removeHundreds(altitude);
    const scroll = altitude >= 0 ? value * 1.3 : -value * 1.3;
    return scroll;
};

export const AltitudeScroller: FC = () => {
    const [altitude] = useSimVar("INDICATED ALTITUDE", "feet");

    return (
        <g>
            <g>
                <clipPath id="alt-clip">
                    <path d="M 632 350 h 104 v 62 h -104 Z" />
                </clipPath>

                <g  clipPath="url(#alt-clip)">
                    {/* Ten Thousands Digits*/}
                    <g transform={`translate( 0 ${getTenThousandsScrollerY(Math.round(altitude * 5) / 5)} )`}>
                        {Array.from({ length: 6 }, (_, i) => {
                            const y = i == 5 ? 396 : 151 + (49 * i);
                            const text = i == 5 ? "@" : 5 - i;
                            const size = i == 5 ? "tenkMarker" : "text-4";
                            const x = i == 5 ? 658 : 659;
                            return (
                                <>
                                    <text className={size} x={x} y={y} >{text}</text>
                                </>
                            );
                        })}
                        <text className="text-4" x="659" y="445" >
                            -
                        </text>
                    </g>

                    {/* Thousands Digits*/}
                    <g className="text-4" transform={`translate( 0 ${getThousandsScrollerY(Math.round(altitude * 5) / 5)} )`}>
                        {Array.from({ length: 10 }, (_, i) => {
                            const y = -45 + (49 * i);
                            let text = 9 - i;
                            return (
                                <>
                                    <text x="681" y={y} >{text}</text>
                                </>
                            );
                        })}
                        <text x="681" y="-94" >
                            0
                        </text>
                    </g>

                    {/* Hundreds Digits*/}
                    <g className="text-3" transform={`translate( 0 ${getHundredsScrollerY(Math.round(altitude * 5) / 5)} )`}>
                        {Array.from({ length: 10 }, (_, i) => {
                            const y = -49 + (49 * i);
                            let text = 9 - i;
                            return (
                                <>
                                    <text x="700" y={y} >{text}</text>
                                </>
                            );
                        })}
                        <text x="700" y="-147" >
                            1
                        </text>
                        <text x="700" y="-98" >
                            0
                        </text>
                        <text x="700" y="439" >
                            9
                        </text>
                    </g>

                    {/* Twenties */}
                    <g className="text-3" transform={`translate( 0 ${getTwentiesScrollerY(Math.round(altitude * 5) / 5)} )`}>
                        {Array.from({ length: 5 }, (_, i) => {
                            const y = (26 * i) + 288;
                            let text = (((9 - i) * 20) % 100).toFixed(0);
                            if (text === "0") {
                                text = "00"
                            }
                            return (
                                <>
                                    <text x="732" y={y} >{text}</text>
                                </>
                            );
                        })}
                        <text x="732" y="236" >
                            20
                        </text>
                        <text x="732" y="262" >
                            00
                        </text>
                        <text x="732" y="418" >
                            80
                        </text>
                    </g>
                </g>
            </g>
        </g>
    );
};