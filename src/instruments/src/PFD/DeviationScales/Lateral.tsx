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
import { BlackOutlineWhiteLine } from "../index";
import { removeLeadingZeros } from "@instruments/common/utils/heading";

export const LateralDeviationScale: FC = () => {
    const [locIndbCourse] = useSimVar("NAV LOCALIZER:3", "degrees");
    const [locRadial] = useSimVar("NAV RADIAL:3", "degrees");
    const [locFrequency] = useSimVar("NAV ACTIVE FREQUENCY:3", "Hz");
    const [locSignal] = useSimVar("NAV HAS NAV:3", "boolean");
    

    const getLocDisplacement = (locIndbCourse: number, locRadial: number): number => {
        const x = (locIndbCourse - (locRadial + 180 > 360 ? locRadial -360 : locRadial + 180));
        let boundedX = x;
        if (boundedX > 2.33) {
            boundedX = 2.33;
        }
        else if (boundedX < -2.33) {
            boundedX = -2.33;
        }
        return 349 - (boundedX * 57);
    };

    const isLocAtMaxDeflection = (locIndbCourse: number, locRadial: number): boolean => {
        const x = (locIndbCourse - (locRadial + 180 > 360 ? locRadial -360 : locRadial + 180));
        if (Math.abs(x) > 2.33 ) {
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
    
    return (
        <g>
            <path 
                visibility={`${isLocSignalReceived(locSignal) === true ? "visible" : "hidden"}`}
                d={`M ${getLocDisplacement(locIndbCourse, locRadial)} 585, l-20 10, l20 10, l20, -10, Z`} 
                fill={`${isLocAtMaxDeflection(locIndbCourse, locRadial) === true ? "none" : "#d570ff"}`} 
                className="magenta-line"
            />
            <g visibility={`${isLocTuned(locFrequency) === true ? "visible" : "hidden"}`}>
                <path d="M349 580, v30" className="fpv-outline"/> 
                <path d="M349 580, v30" className="fpv-line"/>"
                <circle cx="292" cy="595" r="6" fill="none" className="fpv-outline" />
                <circle cx="292" cy="595" r="6" fill="none" className="fpv-line" />
                <circle cx="235" cy="595" r="6" fill="none" className="fpv-outline" />
                <circle cx="235" cy="595" r="6" fill="none" className="fpv-line" />
                <circle cx="406" cy="595" r="6" fill="none" className="fpv-outline" />
                <circle cx="406" cy="595" r="6" fill="none" className="fpv-line" />
                <circle cx="463" cy="595" r="6" fill="none" className="fpv-outline" />
                <circle cx="463" cy="595" r="6" fill="none" className="fpv-line" />
            </g>
        </g>     
    );
};