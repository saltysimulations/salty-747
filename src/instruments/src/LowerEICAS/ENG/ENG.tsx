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
import { useSimVar, useUpdate } from "react-msfs";

import "./ENG.scss";

const getDecimalString = (value: number): string => {
    let decString = value.toFixed(1);
    decString = decString.replace(".", "");
    decString = replaceChar(decString, decString.length -2, "\xa0")
    return decString;
};

const getDecimalPointString = (value: number): string => {
    let decString = value.toFixed(1);
    decString = decString.substring(decString.length - 2, decString.length - 3);
    return decString;
};

const replaceChar = (str: string, index: number, chr: string): string => {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
};

const valueToN1Bar = (val: number): number => {
    const n1Base = 348;
    const barHeight = n1Base - (val * 1.933);
    return barHeight;
};

const valueToEGTBar = (val: number): number => {
    const egtBase = 595;
    const barHeight = egtBase - (val * 0.10377);
    return barHeight;
};

const getTempPrefix = (temp: number): string => {
    let prefix = "+";
    if (temp < 0) {
        prefix = "";
    }
    return prefix;
};

const getUnits = (units: boolean): boolean => {
    return units;
};

export const ENG: FC = () => {
    const [unitsAreMetric] = useSimVar("L:SALTY_UNIT_IS_METRIC", "bool");
    const [sat] = useSimVar("STATIC AIR TEMPERATURE", "degrees");
    const [tat] = useSimVar("TOTAL AIR TEMPERATURE", "degrees");
    const [fuelTemp] = useSimVar("L:SALTY_FUEL_TEMP", "degrees");
    const [egt] = useSimVar("ENG EXHAUST GAS TEMPERATURE:1", "degrees");
    const egtRedLine = 1060;
    const egtContinuous = 1030;
    const egtStart = 750;
    const n1RedLine = 106;
    const [n2] = useSimVar("TURB ENG N2:1", "percent");
    const [n2AmberLimit] = useSimVar("L:SALTY_N1_MAX", "percent");
    const [n2Ref] = useSimVar("L:SALTY_REF_THRUST", "percent");
    const [n1Commanded] = useSimVar("TURB ENG THROTTLE COMMANDED N1", "percent");
    const [grossWeight] = useSimVar("TOTAL WEIGHT", "pounds");
    const [fuelWeight] = useSimVar("FUEL TOTAL QUANTITY WEIGHT", "pounds");

    return (    
        <g id="ENG">
            <g id="EngineStates">
                <text id="Engine1_State" x="10%" y="5%"></text>
                <text id="Engine2_State" x="25%" y="5%"></text>
                <text id="Engine3_State" x="40%" y="5%"></text>
                <text id="Engine4_State" x="55%" y="5%"></text>

                {/*N2 Gauges*/}
                {Array.from({ length: 4 }, (_, i) => {
                        const x = i * 124 + 22;
                        return (
                            <>
                                <path className="white-line" fill="none" d={`M${x || 0} 85, h91 v41 h -91 Z`} />
                            </>
                        );
                    })}
                {Array.from({ length: 4 }, (_, i) => {
                    const x = i * 124 + 108;
                    return (
                        <>
                            <text x={x} y={121} className="text-4">{getDecimalString(n2)}</text>
                            <text x={x - 21} y={121} className="decimal text-4">{getDecimalPointString(n2)}</text>
                        </>
                    );
                })}
                {Array.from({ length: 4 }, (_, i) => {
                        const x = i * 124 + 58;
                        return (
                            <>
                                <path className="white-line" fill="none" d={`M${x || 0} 143, h16 v205 h -16 Z`} />
                                <path className="white-line" fill="white" d={`M${x || 0} 348, h16 v-${348 - valueToN1Bar(n2) || 0} h -16 Z`} />
                            </>
                        );
                    })}
                    
                <text x={252} y={205} className="text-2 cyan">N</text>
                <text x={264} y={212} className="text-2 cyan">2</text>

                {/*TMC Info*/} 
                <text x={269} y={42} className="text-3 green">TO</text>
                {Array.from({ length: 4 }, (_, i) => {
                    const x = i * 124 + 95;
                    return (
                        <>
                            <text x={x} y={79} className="text-3 green">{getDecimalString(n2Ref)}</text>
                            <text x={x - 15} y={79} className="decimal text-3 green">{getDecimalPointString(n2Ref)}</text>
                            <path className="white-line" d={`M${x- 43|| 0} ${valueToN1Bar(n1Commanded) || 0}, h28`} />
                            <path className="green-line" d={`M${x- 53|| 0} ${valueToN1Bar(n2Ref) || 0}, h48`} />
                            <path className="amber-line" d={`M${x- 43|| 0} ${valueToN1Bar(n2AmberLimit) || 0}, h28`} />
                            <path className="red-line" d={`M${x- 48|| 0} ${valueToN1Bar(n1RedLine) || 0}, h38`} />
                        </>
                    );
                })}
                
            </g>

            <g id="Labels">
                <text className="text-2 Label" x={252} y={250}>FF</text>
                <text className="text-2 Label" x="32.25%" y="47%">OIL P</text>
                <text className="text-2 Label" x="32.25%" y="62%">OIL T</text>
                <text className="text-2 Label" x="32.25%" y="74%">OIL Q</text>
                <text className="text-2 Label" x="32.25%" y="86%">VIB</text>
            </g>
        </g>
    );
};