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
import { SvgGroup } from "../../Common";

const getHundredsScrollerY = (): number => {
    const [airspeed] = useSimVar("AIRSPEED INDICATED", "knots");
    let scroll = 0;
    if (airspeed >= 99 && airspeed <= 100) {
        scroll = (airspeed - 99) * 49;
    }
    else if (airspeed > 100 && airspeed < 199) {
        scroll = 49;
    }
    else if (airspeed >= 199 && airspeed <= 200) {
        scroll = (((airspeed - 199)  * 49) + 49);
    }
    else if (airspeed > 200 && airspeed < 299) {
        scroll = 98;
    }
    else if (airspeed >= 299 && airspeed <= 300) {
        scroll = (((airspeed - 299)  * 49) + 98);
    }
    else if (airspeed > 300 && airspeed < 399) {
        scroll = 147;
    }
    else if (airspeed >= 399 && airspeed <= 400) {
        scroll = (((airspeed - 399)  * 49) + 147);
    }
    else if (airspeed > 400 && airspeed <= 420) {
        scroll = 196;
    }
    return scroll;
};

const getTensScrollerY = (): number => {
    const [ias] = useSimVar("AIRSPEED INDICATED", "knots");
    let value = removeHundreds(Math.max(ias, 30));
    let scroll = 0;
    if (value >= 9 && value <= 10) {
        scroll = (value - 9) * 49;
    }
    else if (value > 10 && value < 19) {
        scroll = 49;
    }
    else if (value >= 19 && value <= 20) {
        scroll = (((value - 19)  * 49) + 49);
    }
    else if (value > 20 && value < 29) {
        scroll = 98;
    }
    else if (value >= 29 && value <= 30) {
        scroll = (((value - 29)  * 49) + 98);
    }
    else if (value > 30 && value < 39) {
        scroll = 147;
    }
    else if (value >= 39 && value <= 40) {
        scroll = (((value - 39)  * 49) + 147);
    }
    else if (value > 40 && value < 49) {
        scroll = 196;
    }
    else if (value >= 49 && value <= 50) {
        scroll = (((value - 49)  * 49) + 196);
    }
    else if (value > 50 && value < 59) {
        scroll = 245;
    }
    else if (value >= 59 && value <= 60) {
        scroll = (((value - 59)  * 49) + 245);
    }
    else if (value > 60 && value < 69) {
        scroll = 294;
    }
    else if (value >= 69 && value <= 70) {
        scroll = (((value - 69)  * 49) + 294);
    }
    else if (value > 70 && value <= 79) {
        scroll = 343;
    }
    else if (value >= 79 && value <= 80) {
        scroll = (((value - 79)  * 49) + 343);
    }
    else if (value > 80 && value <= 89) {
        scroll = 392;
    }
    else if (value >= 89 && value <= 90) {
        scroll = (((value - 89)  * 49) + 392);
    }
    else if (value > 90 && value <= 99) {
        scroll = 441;
    }
    else if (value > 99 && value <= 100) {
        scroll = (((value - 99)  * 49) + 441);
    }
    return scroll;
};

const getDigitScrollerY = (): number => {
    const [ias] = useSimVar("AIRSPEED INDICATED", "knots");
    let value = removeHundreds(Math.max(ias, 30));
    value = removeTens(value);
    let scroll = 0;
    scroll = value * 33;
    return scroll;
};

const removeHundreds = (value: number): number => {
    if (value > 400) {
        value = value - 400;
    } 
    else if (value > 300) {
        value = value - 300;
    }
    else if (value > 200) {
        value = value - 200;
    }
    else if (value > 100) {
        value = value - 100;
    }
    return value;
}

const removeTens = (value: number): number => {
    if (value > 90) {
        value = value - 90;
    } 
    else if (value > 80) {
        value = value - 80;
    }
    else if (value > 70) {
        value = value - 70;
    }
    else if (value > 70) {
        value = value - 70;
    }
    else if (value > 60) {
        value = value - 60;
    }
    else if (value > 50) {
        value = value - 50;
    }
    else if (value > 40) {
        value = value - 40;
    }
    else if (value > 30) {
        value = value - 30;
    }
    else if (value > 20) {
        value = value - 20;
    }
    else if (value > 10) {
        value = value - 10;
    }
    return value;
}

export const SpeedScroller: FC = () => {
    return (
        <g>
            <g>
            <clipPath id="asi-clip">
                <path d="M 14 348, h64, v65, h-64 Z" />
            </clipPath>

                <g clipPath="url(#asi-clip)">
                    {/* Hundreds Digits*/}
                    <g transform={`translate( 0 ${getHundredsScrollerY()} )`}>
                        <text x="37" y="200" className="text-4">4</text>
                        <text x="37" y="249" className="text-4">3</text>
                        <text x="37" y="298" className="text-4">2</text>
                        <text x="37" y="347" className="text-4">1</text>
                        <text x="37" y="396" className="text-4"></text>
                    </g>

                    {/* Tens Digits*/}
                    <g transform={`translate( 0 ${getTensScrollerY()} )`}>
                        <text x="57" y="-94" className="text-4">0</text>
                        <text x="57" y="-45" className="text-4">9</text>
                        <text x="57" y="4" className="text-4">8</text>
                        <text x="57" y="53" className="text-4">7</text>
                        <text x="57" y="102" className="text-4">6</text>
                        <text x="57" y="151" className="text-4">5</text>
                        <text x="57" y="200" className="text-4">4</text>
                        <text x="57" y="249" className="text-4">3</text>
                        <text x="57" y="298" className="text-4">2</text>
                        <text x="57" y="347" className="text-4">1</text>
                        <text x="57" y="396" className="text-4">0</text>
                    </g>

                    {/* Single Digits*/}
                    <g transform={`translate( 0 ${getDigitScrollerY()} )`}>
                        <text x="77" y="33" className="text-4">1</text>
                        <text x="77" y="66" className="text-4">0</text>
                        <text x="77" y="99" className="text-4">9</text>
                        <text x="77" y="132" className="text-4">8</text>
                        <text x="77" y="165" className="text-4">7</text>
                        <text x="77" y="198" className="text-4">6</text>
                        <text x="77" y="231" className="text-4">5</text>
                        <text x="77" y="264" className="text-4">4</text>
                        <text x="77" y="297" className="text-4">3</text>
                        <text x="77" y="330" className="text-4">2</text>
                        <text x="77" y="363" className="text-4">1</text>
                        <text x="77" y="396" className="text-4">0</text>
                        <text x="77" y="429" className="text-4">9</text>
                    </g>
                </g>
            </g>
        </g>
    );
};