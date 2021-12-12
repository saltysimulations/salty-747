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


export const FD: FC = () => {
    const [isFdOn] = useSimVar("AUTOPILOT FLIGHT DIRECTOR ACTIVE", "bool");
    const [fdPitch] = useSimVar("AUTOPILOT FLIGHT DIRECTOR PITCH", "degrees");
    const [fdRoll] = useSimVar("AUTOPILOT FLIGHT DIRECTOR BANK", "degrees");
    const [pitch] = useSimVar("PLANE PITCH DEGREES", "degrees");
    const [bank] = useSimVar("PLANE BANK DEGREES", "degrees");

    const degreesToPixels = (angle: number): number => (angle < 0 ? Math.max(angle * 8, -12 * 8) : Math.min(angle * 8, 12 * 8));

    return (
        <g>
            {/* Center Square Background */}
            <path d="M343 377, h11, v11, h-11, Z" strokeWidth="4" stroke="black" fill="black" />

            {/* FD Bar Pitch */}
            <g transform={`translate(0 ${degreesToPixels(fdPitch - pitch) || 0})`} visibility={isFdOn ? "visible" : "hidden"}>
                <path className="fd-bar-outline" d="M239 382, h220" />
                <path className="fd-bar" d="M239 382, h220" />
            </g>

            {/* FD Bar Roll */}
            <g transform={`translate(${degreesToPixels((-fdRoll + bank) / 4) || 0} 0)`} visibility={isFdOn ? "visible" : "hidden"}>
                <path className="fd-bar-outline" d="M349 272, v220" />
                <path className="fd-bar" d="M349 272, v220" />
            </g>

            {/* Center Square Foreground */}
            <path d="M343 377, h11, v11, h-11, Z" strokeWidth="3" stroke="white" fill="none" />
        </g>
    );
};