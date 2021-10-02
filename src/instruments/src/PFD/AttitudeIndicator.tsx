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
import { SvgGroup } from "../Common";
import { BlackOutlineWhiteLine } from "./index";

const AH_CENTER_X = 349;
const AH_CENTER_Y = 382;

type GraduationLineType = "large" | "half-size" | "small";
type GraduationLineProps = { type: GraduationLineType; y: number; text?: number };

const GraduationLine: FC<GraduationLineProps> = ({ type, y, text }) => {
    const getLine = (length: number) => (
        <>
            <path className="black-outline" transform={`translate(-${length / 2} ${y})`} d={`M0 0,h${length}`} />
            <path className="white-line" transform={`translate(-${length / 2} ${y})`} d={`M0 0,h${length}`} />
        </>
    );

    switch (type) {
        case "large":
            return (
                <>
                    {getLine(164)}
                    <text className="graduation-text" x={-98} y={y + 7.33}>
                        {text}
                    </text>
                    <text className="graduation-text" x={98} y={y + 7.33}>
                        {text}
                    </text>
                </>
            );
        case "half-size":
            return getLine(82);
        case "small":
            return getLine(41);
        default:
            return <></>;
    }
};

type HorizonProps = { pitch: number; roll: number; sideslip: number };

export const Horizon: FC<HorizonProps> = ({ pitch, roll, sideslip }) => {
    const pitchToGraduationPixels = (pitch: number): number => pitch * 8;

    const indexToGraduationLineType = (i: number): string | null => {
        if (i == 0) return null;
        else if (i % 4 == 0) return "large";
        else if (!(i % 2 == 0)) return "small";
        else return "half-size";
    };

    const sideslipAngleToDisplacment = (sideslip: number): number => Math.min(sideslip, 33);

    return (
        <g>
            <clipPath id="ah-clip" transform={`translate(0 18) translate(0 ${pitchToGraduationPixels(-pitch) || 0})`}>
                <path d="M156 350, h30, v-40 c 83 -115 243 -115 323 0, v40, h30, v227, h-383 Z" />
            </clipPath>

            <g transform={`rotate(${roll || 0} ${AH_CENTER_X} ${AH_CENTER_Y}) translate(0 -18) translate(0 ${pitchToGraduationPixels(pitch) || 0})`}>
                {/* AH top */}
                <rect x={0} y={-800} width={800} height={1200} fill="#1469BC" />

                {/* AH bottom*/}
                <rect x={0} y={400} width={800} height={1200} fill="#764D17" />

                {/* AH seperator*/}
                <rect x={0} y={397.5} width={800} height={4} fill="#fff" stroke="black" stroke-width="1" />

                <g clipPath="url(#ah-clip)">
                    <SvgGroup x={AH_CENTER_X} y={400}>
                        {Array.from({ length: 37 }, (_, i) => {
                            const number = ((i + 1) / 4) * 10 - 2.5;
                            return (
                                <>
                                    <GraduationLine type={indexToGraduationLineType(i)} y={i * 20} text={number} />
                                    <GraduationLine type={indexToGraduationLineType(i)} y={i * -20} text={number} />
                                </>
                            );
                        })}
                    </SvgGroup>
                </g>
            </g>

            <g transform={`rotate(${roll || 0} ${AH_CENTER_X} ${AH_CENTER_Y})`}>
                {/* Slip/Skid Indicator */}
                <g transform={`translate(${sideslipAngleToDisplacment(sideslip) || 0} 0)`}>
                    <path fill="none" stroke="black" strokeWidth="4" d="M333 214, h32, v 6, h-32, Z" stroke-linejoin="round" />
                    <path fill="none" stroke="white" strokeWidth="3" d="M333 214, h32, v 6, h-32, Z" stroke-linejoin="round" />
                </g>

                {/* Bank Pointer */}
                <path fill="none" stroke="black" strokeWidth="4" d="M349 194, l-16 20, h32, Z" stroke-linejoin="round" />
                <path fill="none" stroke="white" strokeWidth="3" d="M349 194, l-16 20, h32, Z" stroke-linejoin="round" />
            </g>

            {/* AH square masks */}
            <path d="M0 0, h799, v410 h-260 v-190 a-44,44 -44 0, 0 -44,-44 l-295,0 a-44,44 -44 0, 0 -44,44 v190, H0 Z" />
            <path d="M156 410 v123 a-44,44 -44 0, 0 44,44 h295, a-44,44 -44 0, 0 44,-44 v-123 H800 L800, 800, H0, V410 Z" />

            {/* Top triangle */}
            <path fill="white" stroke="black" strokeWidth="1" d="M349 191 l-11 -15 l22 0 Z" />

            {/* Roll indicator lines */}
            <BlackOutlineWhiteLine d="M163 275, l17 10" />
            <BlackOutlineWhiteLine d="M534 275, l-17 10" />
            <BlackOutlineWhiteLine d="M201 236, l10 10" />
            <BlackOutlineWhiteLine d="M497 236, l-10 10" />
            <BlackOutlineWhiteLine d="M236 189, l15 25" />
            <BlackOutlineWhiteLine d="M462 189, l-15 25" />
            <BlackOutlineWhiteLine d="M278 189, l4 11" />
            <BlackOutlineWhiteLine d="M420 189, l-4 11" />
            <BlackOutlineWhiteLine d="M313 179, l3 13" />
            <BlackOutlineWhiteLine d="M385 179, l-3 13" />
        </g>
    );
};
