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
import { BlackOutlineWhiteLine } from "../index";

const getAirspeedY = (): number => {
    const [airspeed] = useSimVar("AIRSPEED INDICATED", "knots");
    let y = Math.max((airspeed - 30), 0) * 4.6;
    return y;
};

export const SpeedTape: FC = () => {
    return (
        <g>
            <clipPath id="speedtape-clip">
                <path d="M13 100, h105 v560 h -105 Z" />
            </clipPath>
            
            <g clipPath="url(#speedtape-clip)" >
                <g transform={`translate(50 ${getAirspeedY()})`}>
                    {Array.from({ length: 40 }, (_, i) => {
                        const y = (i * -46) + 382;
                        return (
                            <>
                                <BlackOutlineWhiteLine d={`M47 ${y || 0}, h15`} />
                            </>
                        );
                    })}
                    {Array.from({ length: 21 }, (_, i) => {
                        const y = (i * -92) + 428;
                        const offset = 11;
                        let text = ((i + 1) * 20).toFixed(0);
                        if (i == 0) {
                            text = "";
                        }
                        return (
                            <>
                                <text x="32" y={`${y + offset}`} className="text-3">{text}</text>
                            </>
                        );
                    })}
                </g>
            </g>
            
            <path className="gray-bg" d="M 14 332, h 71, v 100, h -71, Z" />
        </g>
    );
};
