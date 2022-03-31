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
import { BlackOutlineWhiteLine } from "./index";
import { getHeadingDelta, getDriftAngle } from "../Common/utils/heading";

const arcCorrection = (heading: number, indicatorHeading: number): number => Math.min(Math.abs(getHeadingDelta(heading, indicatorHeading) * 100), 30);

const HeadingLineElement: FC<{ rotation: number; text?: boolean }> = ({ rotation, text = false }) => {
    const [heading] = useSimVar("PLANE HEADING DEGREES MAGNETIC", "degrees");
    const [irsState] = useSimVar("L:SALTY_IRS_STATE", "enum");

    return (
        <g transform={`rotate(${-getHeadingDelta(Math.round(heading * 10) / 10, rotation) * 1.6 ?? 0} 349 ${900 + arcCorrection(Math.round(heading * 10), rotation) ?? 0})`}>
            <BlackOutlineWhiteLine d={`M349 680.5, v${text ? 11 : 5.5}`} />
            {text && (
                <text
                    x="349"
                    y={rotation % 3 === 0 ? 718 : 712}
                    className={`${rotation % 3 === 0 ? "text-3" : "text-2"}`}
                    fillOpacity={`${rotation % 3 === 0 ? "1" : "0.9"}`}
                    style={{ textAnchor: "middle" }}
                    visibility= {irsState == 2 ? 'visible' : 'hidden'}
                >
                    {rotation == 360 ? "0" : rotation / 10}
                </text>
            )}
        </g>
    );
};

const HeadingLines: FC = () => (
    <>
        {Array.from({ length: 36 }, (_, i) => {
            const rotation = (i + 1) * 10;
            return (
                <>
                    <HeadingLineElement rotation={rotation} text />
                    <HeadingLineElement rotation={rotation - 5} />
                </>
            );
        })}
    </>
);

const MemoizedHeadingLines = React.memo(HeadingLines);

export const HeadingDisplay: FC = () => {
    const [heading] = useSimVar("PLANE HEADING DEGREES MAGNETIC", "degrees");
    const [mcpHeading] = useSimVar("AUTOPILOT HEADING LOCK DIR:1", "degrees");
    const [track] = useSimVar("GPS GROUND MAGNETIC TRACK", "degrees");
    const [irsState] = useSimVar("L:SALTY_IRS_STATE", "enum");

    const getSelHeadingString = (): string => {
        let hdgString = mcpHeading.toFixed(0);
        if (hdgString.length == 2) {
            hdgString = "0" + hdgString;
        } else if (hdgString.length == 1) {
            hdgString = "00" + hdgString;
        }

        return hdgString;
    };

    return (
        <g>
            <g>
                <HeadingDisplayFail />
            </g>

            <g visibility= {irsState >= 1 ? 'visible' : 'hidden'}>
                <path className="gray-bg" d="M142 785, h412, c -103 -140, -306 -140, -412 0 Z" />

                {/* Heading Triangle */}
                <path className="fpv-outline" fill="none" d="M349 677 l-11 -20 l22 0 Z" stroke-linejoin="round" />
                <path className="fpv-line" fill="none" d="M349 677 l-11 -20 l22 0 Z" stroke-linejoin="round" />

                <g>
                    <MemoizedHeadingLines />
                </g>
                {/* Text Values */}
                <text x="435" y="777" className="text-2 green">
                    MAG
                </text>
            </g>

            <g visibility= {irsState == 2 ? 'visible' : 'hidden'}>
                <text x="305" y="777" className="text-3 magenta">
                    {getSelHeadingString()}
                </text>
                <text x="319" y="777" className="text-2 magenta">
                    H
                </text>

                {/* Heading Bug */}
                <g fill="none" transform={`rotate(${Math.min(-Math.min(getHeadingDelta(Math.round(heading * 10) / 10, mcpHeading) * 1.6, 55), 55) || 0} 349 ${900 + arcCorrection(Math.round(heading * 10) / 10, mcpHeading) || 0})`}>
                    <path className="black-outline" d="M 335 679, h28, v-14, h-4, l-7 14, h-6, l-7 -14, h-4, Z"></path>
                    <path className="magenta-line" d="M 335 679, h28, v-14, h-4, l-7 14, h-6, l-7 -14, h-4, Z"></path>
                </g>

                {/* Track Line */}
                <g
                    transform={`rotate(${getHeadingDelta(Math.round(heading * 10) / 10, Math.round(heading * 10) / 10 - getDriftAngle(Math.round(heading * 10) / 10, Math.round(track * 10) / 10)) * 1.6 || 0} 349 ${900 + arcCorrection(Math.round(heading * 10) / 10, Math.round(heading * 10) / 10 - getDriftAngle(Math.round(heading * 10) / 10, Math.round(track * 10) / 10)) || 0
                        })`}
                >
                    <path className="black-outline" d="M349 680, v150" />
                    <path className="black-outline" d="M343 751, h12" />
                    <path className="white-line" d="M349 680, v150" />
                    <path className="white-line" d="M343 751, h12" />
                </g>
            </g>

            <rect x="200" y="785" width="300" height="5" fill="black" />
            <rect x="110" y="789" width="480" height="15" fill="black" />
        </g>
    );
};

export const HeadingDisplayFail: FC = () => {
    const [irsState] = useSimVar("L:SALTY_IRS_STATE", "enum");
    
    return (
        <g visibility= {irsState == 0 ? 'visible' : 'hidden'}>
            <rect x="322" y="749.5" width="52" height="27" className="amber-line" fill="none"/>
            <text x="348" y="774" className="text-3 amber middle">HDG</text>
        </g>
    );
};
