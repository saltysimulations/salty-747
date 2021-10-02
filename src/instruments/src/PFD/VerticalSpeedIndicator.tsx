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
import { SvgGroup } from "../Common";
import { BlackOutlineWhiteLine } from "./index";

const fpmToPixels = (fpm: number): number => {
    const seg1 = 0.08 * Math.min(Math.abs(fpm), 1000);
    const seg2 = 0.06 * Math.min(Math.max(Math.abs(fpm) - 1000, 0), 1000);
    const seg3 = 0.01 * Math.max(Math.abs(fpm) - 2000, 0);
    const pixels = fpm > 6000 || fpm < -6000 ? 180 : seg1 + seg2 + seg3;
    return fpm > 0 ? -pixels : pixels;
};

export const VSI: FC = () => {
    const [verticalSpeed] = useSimVar("VERTICAL SPEED", "feet per minute");
    return (
        <g>
            <path className="gray-bg" d="M 723 184 h 35 l 34 97 v 200 l -34 97 h -35 v -130 l 20 -10 v -114 l -20 -10 Z" />
            <VSIScale />

            <BlackOutlineWhiteLine d={`M 825 381, l -73 ${fpmToPixels(verticalSpeed)}`} whiteStroke={5} blackStroke={6} />

            <text
                x={785}
                y={verticalSpeed > 0 ? 170 - 7.33 : 630 - 7.33}
                visibility={Math.abs(verticalSpeed) < 400 ? "hidden" : "visible"}
                className="graduation-text"
                style={{ fontSize: "30px", textAnchor: "end" }}
            >
                {Math.abs(verticalSpeed) > 9975 ? 9999 : Math.round(Math.abs(verticalSpeed) / 50) * 50}
            </text>

            <rect x={792} y={290} width={8} height={190} fill="black" />
        </g>
    );
};

const VSIScale: FC = () => (
    <>
        <SvgGroup x={735} y={201 + 7.33}>
            <text x={0} y={0} className="graduation-text">
                6
            </text>
            <text x={0} y={40} className="graduation-text">
                2
            </text>
            <text x={0} y={100} className="graduation-text">
                1
            </text>
            <text x={0} y={260} className="graduation-text">
                1
            </text>
            <text x={0} y={320} className="graduation-text">
                2
            </text>
            <text x={0} y={360} className="graduation-text">
                6
            </text>
        </SvgGroup>
        <g>
            <BlackOutlineWhiteLine d="M 743 201, h 8" whiteStroke={4} blackStroke={5} />
            <BlackOutlineWhiteLine d="M 743 221, h 8" />
            <BlackOutlineWhiteLine d="M 743 241, h 8" whiteStroke={4} blackStroke={5} />
            <BlackOutlineWhiteLine d="M 743 271, h 8" />
            <BlackOutlineWhiteLine d="M 743 301, h 8" whiteStroke={4} blackStroke={5} />
            <BlackOutlineWhiteLine d="M 743 341, h 8" />
            <BlackOutlineWhiteLine d="M 743 381, h 18" whiteStroke={4} blackStroke={5} />
            <BlackOutlineWhiteLine d="M 743 421, h 8" />
            <BlackOutlineWhiteLine d="M 743 461, h 8" whiteStroke={4} blackStroke={5} />
            <BlackOutlineWhiteLine d="M 743 491, h 8" />
            <BlackOutlineWhiteLine d="M 743 521, h 8" whiteStroke={4} blackStroke={5} />
            <BlackOutlineWhiteLine d="M 743 541, h 8" />
            <BlackOutlineWhiteLine d="M 743 561, h 8" whiteStroke={4} blackStroke={5} />
        </g>
    </>
);
