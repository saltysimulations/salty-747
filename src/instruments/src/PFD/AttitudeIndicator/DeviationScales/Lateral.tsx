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

export const LateralDeviationScale: FC = () => {
    const [locIndbCourse] = useSimVar("NAV LOCALIZER:3", "degrees");
    const [locRadial] = useSimVar("NAV RADIAL:3", "degrees");
    const [locFrequency] = useSimVar("NAV ACTIVE FREQUENCY:3", "Hz");
    const [locSignal] = useSimVar("NAV HAS NAV:3", "boolean");
    const [radioHeight] = useSimVar("PLANE ALT ABOVE GROUND MINUS CG", "feet");
    const [flightPhase] = useSimVar("L:AIRLINER_FLIGHT_PHASE", "number");

    const getLocDisplacement = (locIndbCourse: number, locRadial: number): number => {
        const x = (locIndbCourse - (locRadial + 180 > 360 ? locRadial - 360 : locRadial + 180));
        let boundedX = x;
        if (boundedX > 2.33) {
            boundedX = 2.33;
        }
        else if (boundedX < -2.33) {
            boundedX = -2.33;
        }
        const sensitivity = showExpandedLoc(locIndbCourse, locRadial) ? 182 : 57;
        return 349 - (boundedX * sensitivity);
    };

    const isLocAtMaxDeflection = (locIndbCourse: number, locRadial: number): boolean => {
        const x = (locIndbCourse - (locRadial + 180 > 360 ? locRadial - 360 : locRadial + 180));
        if (Math.abs(x) > 2.33) {
            return true;
        }
        return false;
    };

    const isLocTuned = (locFrequency: number): boolean => {
        if (locFrequency !== 0) {
            return true;
        }
        return false;
    };

    const isLocSignalReceived = (locSignal: number): boolean => {
        if (locSignal !== 0) {
            return true;
        }
        return false;
    };

    const showExpandedLoc = (locIndbCourse: number, locRadial: number): boolean => {
        const locError = (locIndbCourse - (locRadial + 180 > 360 ? locRadial - 360 : locRadial + 180));
        if (Math.abs(locError) < 0.6) {
            return true;
        }
        return false;
    };

    const getRisingRunwayY = (height: number): number => {
        if (height <= 200) {
            return -112 + Math.max(height * 0.56, -112);
        }
        return 0;
    };

    return (
        <g>
            <g transform={`translate(${getLocDisplacement(locIndbCourse, locRadial)}, 0)`} >
                <path
                    d={`M 0 585, l-20 10, l20 10, l20, -10, Z`}
                    fill={`${isLocAtMaxDeflection(locIndbCourse, locRadial) === true ? "none" : "#d570ff"}`}
                    className="magenta-line"
                    visibility={`${isLocSignalReceived(locSignal) === true ? "visible" : "hidden"}`}
                />
                
            </g>
            
            <g clipPath="url(#rr-clip)" transform={`translate(${getLocDisplacement(locIndbCourse, locRadial)}, ${getRisingRunwayY(radioHeight)})`} visibility={`${flightPhase > 3 && radioHeight < 2500 && isLocSignalReceived(locSignal) === true ? "visible" : "hidden"}`} fill="none">
                <path
                    d={`M 0 545, h-100, l10 -20, h180, l10 20, h-100, v-20 Z`}
                    className="black-outline"
                />
                <path
                    d={`M 0 545, h-100, l10 -20, h180, l10 20, h-100, v-20 Z`}
                    className="fma-line"
                />
                <path d={`M -3 550, V${575 - getRisingRunwayY(radioHeight)}`} className="black-outline" />
                <path d={`M 3 550, V${575 - getRisingRunwayY(radioHeight)}`} className="black-outline" />
                <path d={`M -3 550, V${575 - getRisingRunwayY(radioHeight)}`} className="magenta-line" />
                <path d={`M 3 550, V${575 - getRisingRunwayY(radioHeight)}`} className="magenta-line" />
            </g>

            <g visibility={`${isLocTuned(locFrequency) === true ? "visible" : "hidden"}`}>
                <path d="M349 580, v30" className="fpv-outline" />
                <path d="M349 580, v30" className="fpv-line" />"
                <g visibility={`${(showExpandedLoc(locIndbCourse, locRadial) === false && isLocTuned(locFrequency) === true) ? "visible" : "hidden"}`}>
                    <circle cx="292" cy="595" r="6" fill="none" className="fpv-outline" />
                    <circle cx="292" cy="595" r="6" fill="none" className="fpv-line" />
                    <circle cx="235" cy="595" r="6" fill="none" className="fpv-outline" />
                    <circle cx="235" cy="595" r="6" fill="none" className="fpv-line" />
                    <circle cx="406" cy="595" r="6" fill="none" className="fpv-outline" />
                    <circle cx="406" cy="595" r="6" fill="none" className="fpv-line" />
                    <circle cx="463" cy="595" r="6" fill="none" className="fpv-outline" />
                    <circle cx="463" cy="595" r="6" fill="none" className="fpv-line" />
                </g>

                <g visibility={`${(showExpandedLoc(locIndbCourse, locRadial) === true && isLocTuned(locFrequency) === true) ? "visible" : "hidden"}`}>
                    <path d="M252 589, h12, v12, h-12, Z" fill="none" className="fpv-outline" />"
                    <path d="M252 589, h12, v12, h-12, Z" fill="none" className="fpv-line" />"
                    <path d="M446 589, h-12, v12, h12, Z" fill="none" className="fpv-outline" />"
                    <path d="M446 589, h-12, v12, h12, Z" fill="none" className="fpv-line" />"
                </g>
            </g>
            <path d="M111 175, h45, v405, h-45 Z" />
            <path d="M539 175, h45, v405, h-45 Z" />
        </g>
    );
};