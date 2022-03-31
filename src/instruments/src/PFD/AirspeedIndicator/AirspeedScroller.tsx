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

const removeHundreds = (value: number): number => value % 100;

const removeTens = (value: number): number => value % 10;

const getHundredsScrollerY = (airspeed: number): number => {
    let scroll = Math.floor(airspeed / 100) * 49;

    if (Math.floor(airspeed).toString().slice(-1) == "9" && Math.floor(airspeed).toString().slice(-2, -1) == "9") {
        let speedOver99Int = Math.round(airspeed / 100) * 100 - 1 - airspeed;
        scroll = scroll + -speedOver99Int * 49;
    }

    return scroll;
};

const getTensScrollerY = (airspeed: number): number => {
    const value = removeHundreds(Math.max(airspeed, 30));
    let scroll = Math.floor(value / 10) * 49;

    if (Math.floor(value).toString().slice(-1) == "9") {
        const speedOver9Int = Math.round(value / 10) * 10 - 1 - value;
        scroll = scroll + -speedOver9Int * 49;
    }

    return scroll;
};

const getDigitScrollerY = (airspeed: number): number => removeTens(removeHundreds(Math.max(airspeed, 30))) * 33;

export const SpeedScroller: FC = () => {
    const [airspeed] = useSimVar("AIRSPEED INDICATED", "knots");

    return (
        <g>
            <g>
                <clipPath id="asi-clip">
                    <path d="M 14 348, h64, v65, h-64 Z" />
                </clipPath>

                <g className="text-4" clipPath="url(#asi-clip)">
                    {/* Hundreds Digits*/}
                    <g transform={`translate( 0 ${getHundredsScrollerY(Math.round(airspeed * 40) / 40)} )`}>
                        {Array.from({ length: 5 }, (_, i) => {
                            const y = 200 + (49 * i);
                            let text = i == 4 ? "" : 4 - i;
                            return (
                                <>
                                    <text x="35" y={y} >{text}</text>
                                </>
                            );
                        })}
                    </g>

                    {/* Tens Digits*/}
                    <g transform={`translate( 0 ${getTensScrollerY(Math.round(airspeed * 40) / 40)} )`}>
                        {Array.from({ length: 10 }, (_, i) => {
                            const y = -45 + (49 * i);
                            let text = 9 - i;
                            return (
                                <>
                                    <text x="56" y={y} >{text}</text>
                                </>
                            );
                        })}
                        <text x="57" y="-94" >
                            0
                        </text>
                    </g>

                    {/* Single Digits*/}
                    <g transform={`translate( 0 ${getDigitScrollerY(Math.round(airspeed * 40) / 40)} )`}>
                        {Array.from({ length: 10 }, (_, i) => {
                            const y = 99 + (33 * i);
                            let text = 9 - i;
                            return (
                                <>
                                    <text x="77" y={y} >{text}</text>
                                </>
                            );
                        })}
                        <text x="77" y="33" >
                            1
                        </text>
                        <text x="77" y="66" >
                            0
                        </text>
                        <text x="77" y="99" >
                            9
                        </text>
                        <text x="77" y="429" >
                            9
                        </text>
                    </g>
                </g>
            </g>
        </g>
    );
};

const getTrendVector = (acceleration: number): number => {
    if (acceleration > 0) {
        return Math.min(acceleration * 5.925, 60.5);
    }
    else {
        return Math.max(acceleration * 5.925, -60.5);
    }
};


//TODO - This should also include some component based on airspeed change vs delta time, not just acceleration.
export const SpeedTrendVector: FC = () => {
    const [acceleration] = useSimVar('ACCELERATION BODY Z', 'Feet per second squared');
    const [airspeed] = useSimVar("AIRSPEED INDICATED", "knots");

    return (
        <g visibility={Math.abs(getTrendVector(acceleration)) < 4.5 ? "hidden" : "visible"}>
            <path fill="none" className="black-outline" d={`M 96 381, v${getTrendVector(acceleration) * -4.6 - (acceleration > 0 ? - 12 : 12)}, m-6 0, h12, m0 0, l-6 ${acceleration > 0 ? "-" : ""}12, m0 0, l-6 ${acceleration < 0 ? "-" : ""}12`} />
            <path fill="none" className="fma-line" d={`M 96 381, v${(getTrendVector(acceleration) * -4.6) - (acceleration > 0 ? - 12 : 12)}, m-6 0, h12, m0 0, l-6 ${acceleration > 0 ? "-" : ""}12, m0 0, l-6 ${acceleration < 0 ? "-" : ""}12`} />
        </g>
    );
};


