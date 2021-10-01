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
import { render } from "../Common";
import { Horizon } from "./AttitudeIndicator";

import "./index.scss";
import "../Common/pixels.scss";

type BlackOutlineWhiteLineProps = { d: string };

export const BlackOutlineWhiteLine: FC<BlackOutlineWhiteLineProps> = ({ d }) => (
    <>
        <path className="black-outline" d={d}></path>
        <path className="white-line" d={d}></path>
    </>
);

const PFD: React.FC = () => {
    const [pitch] = useSimVar("PLANE PITCH DEGREES", "degrees");

    return (
        <>
            <div className="LcdOverlay" style={{ opacity: "0.2" }} />
            <svg className="pfd-svg" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                <Horizon pitch={pitch} />

                <path className="gray-bg" d="M13 100, h100 v560 h -100 Z" />
                <path className="gray-bg" d="M600 100, h100 v560 h-100 Z" />
                <path className="gray-bg" d="M724 188, h35 l34 97 v 200 l-35 97 h-35 v-130 l20 -10 v-120 l-20 -10 Z" />
                <path className="gray-bg" d="M130 0, h450, v60, h-450 Z" />
                <path className="gray-bg" d="M140 785, h412, c -103 -140, -309 -140, -412 0 Z" />

                <path className="cursor" d="M190 377, h84, v30 h-11 v-20 h-73 Z" />
                <path className="cursor" d="M422 377, h84, v11, h-73, v20, h-11 Z" />
                <path className="cursor" d="M343 377, h11, v11, h-11, Z" />

                {/* Heading triangle */}
                <path className="cursor" d="M349 680 l-13 -23 l26 0 Z" />

                {/* FMA lines */}
                <BlackOutlineWhiteLine d="M286 0, v60" />
                <BlackOutlineWhiteLine d="M428 0, v60" />

                <path className="indication" d="M 10 342 h 72 v 28 l 14 11 l -14 11 v 28 h -72 Z" />
                <path className="indication" d="M 632 342 h 104 v 78 h -104 v -28 l -14 -11 l 14 -11 Z" />
            </svg>
        </>
    );
};

render(<PFD />);
