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
import { SvgGroup } from "../../Common";

type FDProps = { isFdOn: boolean; fdPitch: number; fdRoll: number };

export const FD: FC<FDProps> = ({ isFdOn, fdPitch, fdRoll }) => {
    const degreesToPixels = (angle: number): number => {
        if (angle > 12) {
            angle = 12;
        }
        else if (angle < -12) {
            angle = -12;
        }
        const pixels = angle * 8;
        return pixels;
    };

    return (
        <g>
            {/* Aircraft wing symbols */}
            <path className="cursor" d="M190 377, h84, v30 h-11 v-20 h-73 Z" />
            <path className="cursor" d="M422 377, h84, v11, h-73, v20, h-11 Z" />

            {/* Center Square Background */}
            <path d="M343 377, h11, v11, h-11, Z" strokeWidth="4" stroke="black" fill="black" />

            {/* FD Bar Pitch */}
            <g transform={`translate(0 ${degreesToPixels(-fdPitch) || 0})`} visibility={isFdOn ? 'visible' : 'hidden'}>
                <path className="fd-bar-outline"d="M239 382, h220" />
                <path className="fd-bar"d="M239 382, h220" />
            </g>

            {/* FD Bar Roll */}
            <g transform={`translate(${degreesToPixels(-fdRoll) || 0} 0)`} visibility={isFdOn ? 'visible' : 'hidden'}>
                <path className="fd-bar-outline"d="M349 272, v220" />
                <path className="fd-bar"d="M349 272, v220" />
            </g>

            {/* Center Square Foreground */}
            <path d="M343 377, h11, v11, h-11, Z" strokeWidth="3" stroke="white" fill="none" />
        </g>
    );
};
