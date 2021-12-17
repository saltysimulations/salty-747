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

export const VerticalDeviationScale: FC = () => {
    const [gsError] = useSimVar("NAV GLIDE SLOPE ERROR:3", "degrees");
    const [locFrequency] = useSimVar("NAV ACTIVE FREQUENCY:3", "Hz");
    const [gsSignal] = useSimVar("NAV GS FLAG:3", "boolean");
    
    const getGsDisplacement = (gsError: number): number => {
        let boundedY = gsError * -2.44;
        if (boundedY > 2.33) {
            boundedY = 2.33;
        }
        else if (boundedY < -2.33) {
            boundedY = -2.33;
        }
        return 381 - (boundedY * 57);
    };

    const isGsAtMaxDeflection = (gsError: number): boolean => {
        if (Math.abs(gsError) > 0.9553 ) {
            return true;
        }
        return false;
    };

    const isGsTuned = (locFrequency: number): boolean => {
        if (locFrequency !== 0) {
            return true;
        }
        return false;
    };

    const isGsSignalReceived = (gsSignal: number): boolean => {
        if (gsSignal !== 0) {
            return true;
        }
        return false;
    };
    
    return (
        <g>
            <path 
                visibility={`${isGsSignalReceived(gsSignal) === true ? "visible" : "hidden"}`}
                d={`M 547 ${getGsDisplacement(gsError)}, l10 20, l10 -20, l-10 -20, Z`} 
                fill={`${isGsAtMaxDeflection(gsError) === true ? "none" : "#d570ff"}`} 
                className="magenta-line"
            />
            <g visibility={`${isGsTuned(locFrequency) === true ? "visible" : "hidden"}`}>
                <path d="M542 381, h30" className="fpv-outline"/> 
                <path d="M542 381, h30" className="fpv-line"/>"
                <circle cx="557" cy="438" r="6" fill="none" className="fpv-outline" />
                <circle cx="557" cy="438" r="6" fill="none" className="fpv-line" />
                <circle cx="557" cy="495" r="6" fill="none" className="fpv-outline" />
                <circle cx="557" cy="495" r="6" fill="none" className="fpv-line" />
                <circle cx="557" cy="324" r="6" fill="none" className="fpv-outline" />
                <circle cx="557" cy="324" r="6" fill="none" className="fpv-line" />
                <circle cx="557" cy="267" r="6" fill="none" className="fpv-outline" />
                <circle cx="557" cy="267" r="6" fill="none" className="fpv-line" />
            </g>
        </g>     
    );
};