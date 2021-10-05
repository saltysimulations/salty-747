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

                <g clipPath="url(#asi-clip)">
                    {/* Hundreds Digits*/}
                    <g transform={`translate( 0 ${getHundredsScrollerY(airspeed)} )`}>
                        <text x="37" y="200" className="text-4">
                            4
                        </text>
                        <text x="37" y="249" className="text-4">
                            3
                        </text>
                        <text x="37" y="298" className="text-4">
                            2
                        </text>
                        <text x="37" y="347" className="text-4">
                            1
                        </text>
                        <text x="37" y="396" className="text-4" />
                    </g>

                    {/* Tens Digits*/}
                    <g transform={`translate( 0 ${getTensScrollerY(airspeed)} )`}>
                        <text x="57" y="-94" className="text-4">
                            0
                        </text>
                        <text x="57" y="-45" className="text-4">
                            9
                        </text>
                        <text x="57" y="4" className="text-4">
                            8
                        </text>
                        <text x="57" y="53" className="text-4">
                            7
                        </text>
                        <text x="57" y="102" className="text-4">
                            6
                        </text>
                        <text x="57" y="151" className="text-4">
                            5
                        </text>
                        <text x="57" y="200" className="text-4">
                            4
                        </text>
                        <text x="57" y="249" className="text-4">
                            3
                        </text>
                        <text x="57" y="298" className="text-4">
                            2
                        </text>
                        <text x="57" y="347" className="text-4">
                            1
                        </text>
                        <text x="57" y="396" className="text-4">
                            0
                        </text>
                    </g>

                    {/* Single Digits*/}
                    <g transform={`translate( 0 ${getDigitScrollerY(airspeed)} )`}>
                        <text x="77" y="33" className="text-4">
                            1
                        </text>
                        <text x="77" y="66" className="text-4">
                            0
                        </text>
                        <text x="77" y="99" className="text-4">
                            9
                        </text>
                        <text x="77" y="132" className="text-4">
                            8
                        </text>
                        <text x="77" y="165" className="text-4">
                            7
                        </text>
                        <text x="77" y="198" className="text-4">
                            6
                        </text>
                        <text x="77" y="231" className="text-4">
                            5
                        </text>
                        <text x="77" y="264" className="text-4">
                            4
                        </text>
                        <text x="77" y="297" className="text-4">
                            3
                        </text>
                        <text x="77" y="330" className="text-4">
                            2
                        </text>
                        <text x="77" y="363" className="text-4">
                            1
                        </text>
                        <text x="77" y="396" className="text-4">
                            0
                        </text>
                        <text x="77" y="429" className="text-4">
                            9
                        </text>
                    </g>
                </g>
            </g>
        </g>
    );
};
