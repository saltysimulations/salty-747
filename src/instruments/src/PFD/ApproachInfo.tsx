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

const getILStext = (frequency: number, ident: string, hasSignal: boolean, course: number): string => {
    return `${hasSignal ? ident : frequency.toFixed(2)}/` + `${course.toFixed(0)}°`;
};

const getDMEtext = (hasSignal: boolean, distance: number): string => {
    const roundedDist = distance < 100 ? distance.toFixed(1) : distance.toFixed(0);
    return `DME\xa0${hasSignal && distance > 0 ? roundedDist : "---"}`;
};

export const ApproachInfo: FC = () => {
    const [locFreq] = useSimVar("NAV ACTIVE FREQUENCY:3", "MHz");
    const [ilsHasSignal] = useSimVar("NAV HAS NAV:3", "boolean");
    const [locCourse] = useSimVar("L:FLIGHTPLAN_APPROACH_COURSE", "number");
    const [ilsIdent] = useSimVar("NAV IDENT:3", "string");
    const [dmeHasSignal] = useSimVar("NAV HAS DME:3", "boolean");
    const [dmeDistance] = useSimVar("NAV DME:3", "nautical miles");

    return (
        <g visibility={locFreq != 0 ? "visible" : "hidden"}>
            <text
                x={160}
                y={100}
                className="text-2 start"
            >{getILStext(locFreq, ilsIdent, ilsHasSignal, locCourse)}
            </text>
            <text
                x={160}
                y={127}
                className="text-2 start"
            >{getDMEtext(dmeHasSignal, dmeDistance)}
            </text>
            {/* TODO RNP/ANP Source */}
            <text
                x={160}
                y={170}
                className="text-3 start"
            >
            </text>
        </g>
    );
};
