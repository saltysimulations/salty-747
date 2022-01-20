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


export const PLI: FC = () => {
    const [airspeed] = useSimVar("AIRSPEED INDICATED", "knots");
    const [manSpeed] = useSimVar("L:SALTY_MANEUVERING_SPEED", "knots");
    const [selectedFlaps] = useSimVar("FLAPS HANDLE INDEX", "number");
    const [onGround] = useSimVar("RADIO HEIGHT", "feet");
    const [pitch] = useSimVar("PLANE PITCH DEGREES", "degrees");
    const [pliPitch] = useSimVar("L:74S_PLI_ANGLE", "degrees");

    const getIsPliOn = (airspeed: number, manSpeed: number, flapsHandle: number, onGround: number): boolean => {
        if ((airspeed < manSpeed || flapsHandle != 0) && onGround < 10) {
            return true;
        }
        return false;
    };

    const degreesToPixels = (angle: number): number => (angle < 0 ? Math.max(angle * 8, -12 * 8) : Math.min(angle * 8, 12 * 8));

    return (
        <g>
            {/* PLI Bars */}
            <g transform={`translate(0 ${degreesToPixels(Math.max(pliPitch, -30) - pitch) || 0})`} visibility={getIsPliOn(airspeed, manSpeed, selectedFlaps, onGround) ? "visible" : "visible"}>
                <path className="black-outline" d="M416 382, h33, m 0 0, h-8, l9 -14, m-9 14, m-9 0, l9 -14, m-18 14, l9 -14, m-17 14, v10" fill="none"/>
                <path className="amber-line" d="M416 382, h33, m 0 0, h-8, l9 -14, m-9 14, m-9 0, l9 -14, m-18 14, l9 -14, m-17 14, v10" fill="none"/>
                <path className="black-outline" d="M282 382, h-33, m 0 0, h8, l-9 -14, m9 14, m9 0, l-9 -14, m18 14, l-9 -14, m17 14, v10" fill="none"/>
                <path className="amber-line" d="M282 382, h-33, m 0 0, h8, l-9 -14, m9 14, m9 0, l-9 -14, m18 14, l-9 -14, m17 14, v10" fill="none"/>
            </g>
        </g>
    );
};