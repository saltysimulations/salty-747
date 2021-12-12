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
import { render } from "../Common";
import { useSimVar } from "react-msfs";

import "./index.scss";
import "../Common/pixels.scss";
import img from './EICAS.png';

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

type BlackOutlineWhiteLineProps = { d: string; blackStroke?: number; whiteStroke?: number; color?: string };
export const BlackOutlineWhiteLine: FC<BlackOutlineWhiteLineProps> = ({ d, blackStroke = 4, whiteStroke = 3, color = "white" }) => (
    <>
        <path stroke="black" strokeWidth={blackStroke} strokeLinecap="round" d={d}></path>
        <path stroke={color} strokeWidth={whiteStroke} strokeLinecap="round" d={d}></path>
    </>
);

const UpperEICAS: FC = () => {
    const [unitsAreMetric] = useSimVar("L:SALTY_UNIT_IS_METRIC", "bool");
    const [sat] = useSimVar("STATIC AIR TEMPERATURE", "degrees");
    const [tat] = useSimVar("TOTAL AIR TEMPERATURE", "degrees");
    const [fuelTemp] = useSimVar("L:SALTY_FUEL_TEMP", "degrees");
    const [egt] = useSimVar("ENG EXHAUST GAS TEMPERATURE:1", "degrees");
    const egtRedLine = 1060;
    const egtContinuous = 1030;
    const egtStart = 750;
    const n1RedLine = 106;
    const [n1] = useSimVar("TURB ENG N1:1", "percent");
    const [n1AmberLimit] = useSimVar("L:SALTY_N1_MAX", "percent");
    const [n1Ref] = useSimVar("L:SALTY_REF_THRUST", "percent");
    const [n1Commanded] = useSimVar("TURB ENG THROTTLE COMMANDED N1", "percent");
    const [grossWeight] = useSimVar("TOTAL WEIGHT", "pounds");
    const [fuelWeight] = useSimVar("FUEL TOTAL QUANTITY WEIGHT", "pounds");

    const [cabinAlt] = useSimVar("PRESSURIZATION CABIN ALTITUDE", "feet");
    const [ductPress] = useSimVar("L:SALTY_DUCT_PRESSURE", "psi");
    const [cabinRate] = useSimVar("PRESSURIZATION CABIN ALTITUDE RATE", "feet per minute");
    const [landingAlt] = useSimVar("L:SALTY_LANDING_ALT", "feet");
    const [deltaP] = useSimVar("PRESSURIZATION PRESSURE DIFFERENTIAL", "number");
    const [stabTrim] = useSimVar("ELEVATOR TRIM PCT", "percent");
    return (
        <>
            <div className="LcdOverlay" style={{ opacity: "0.2" }} />
            <svg className="pfd-svg" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg"> 
                
                {/*Ref Image*/}
                <image href={img} x="0" y="0" width={800} height={800} opacity={0.3}/>

                {/*TAT Info*/}   
                <text x={95} y={42} className="text-2 cyan">TAT</text>
                <text x={155} y={42} className="text-3">{getTempPrefix(sat) + sat.toFixed(0)}</text>
                <text x={168} y={42} className="text-2">C</text>

                {/*N1 Gauges*/}
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
                            <text x={x} y={121} className="text-4">{getDecimalString(n1)}</text>
                            <text x={x - 21} y={121} className="decimal text-4">{getDecimalPointString(n1)}</text>
                        </>
                    );
                })}
                {Array.from({ length: 4 }, (_, i) => {
                        const x = i * 124 + 58;
                        return (
                            <>
                                <path className="white-line" fill="none" d={`M${x || 0} 143, h16 v205 h -16 Z`} />
                                <path className="white-line" fill="white" d={`M${x || 0} 348, h16 v-${348 - valueToN1Bar(n1) || 0} h -16 Z`} />
                            </>
                        );
                    })}
                    
                <text x={252} y={205} className="text-2 cyan">N</text>
                <text x={264} y={212} className="text-2 cyan">1</text>

                {/*TMC Info*/} 
                <text x={269} y={42} className="text-3 green">TO</text>
                {Array.from({ length: 4 }, (_, i) => {
                    const x = i * 124 + 95;
                    return (
                        <>
                            <text x={x} y={79} className="text-3 green">{getDecimalString(n1Ref)}</text>
                            <text x={x - 15} y={79} className="decimal text-3 green">{getDecimalPointString(n1Ref)}</text>
                            <path className="white-line" d={`M${x- 43|| 0} ${valueToN1Bar(n1Commanded) || 0}, h28`} />
                            <path className="green-line" d={`M${x- 53|| 0} ${valueToN1Bar(n1Ref) || 0}, h48`} />
                            <path className="amber-line" d={`M${x- 43|| 0} ${valueToN1Bar(n1AmberLimit) || 0}, h28`} />
                            <path className="red-line" d={`M${x- 48|| 0} ${valueToN1Bar(n1RedLine) || 0}, h38`} />
                        </>
                    );
                })}

                {/*EGT Gauges*/}
                
                {Array.from({ length: 4 }, (_, i) => {
                        const x = i * 124 + 22;
                        return (
                            <>
                                <path className="white-line" fill="none" d={`M${x || 0} 427, h91 v41 h -91 Z`} />
                            </>
                        );
                    })}
                {Array.from({ length: 4 }, (_, i) => {
                    const x = i * 124 + 108;
                    return (
                        <>
                            <text x={x} y={463} className="text-4">{egt.toFixed(0)}</text>
                        </>
                    );
                })}
                {Array.from({ length: 4 }, (_, i) => {
                    const x = i * 124 + 58;
                    return (
                        <>
                            <path className="white-line" fill="none" d={`M${x || 0} 485, h16 v110 h -16 Z`} />
                            <path className="white-line" fill="white" d={`M${x || 0} 595, h16 v-${595 - valueToEGTBar(egt)} h -16 Z`} />
                            <path className="amber-line" d={`M${x - 6 || 0} ${valueToEGTBar(egtContinuous) || 0}, h28`} />
                            <path className="red-line" d={`M${x - 6 || 0} ${valueToEGTBar(egtStart) || 0}, h28`} />
                            <path className="red-line" d={`M${x - 11 || 0} ${valueToEGTBar(egtRedLine) || 0}, h38`} />

                        </>
                    );
                })}
                <text x={270} y={535} className="text-2 cyan">EGT</text>

                {/*Pressurisation Info*/}
                <text x={310} y={710} className="text-2 cyan">DUCT PRESS</text>
                <text x={165} y={710} className="text-3">{ductPress.toFixed(0)}</text>
                <text x={370} y={710} className="text-3">{ductPress.toFixed(0)}</text>
                <text x={120} y={750} className="text-2 cyan">CAB ALT</text>
                <text x={198} y={750} className="text-3">{cabinAlt.toFixed(0)}</text>
                <text x={293} y={750} className="text-2 cyan">RATE</text>
                <text x={373} y={750} className="text-3">{cabinRate.toFixed(0)}</text>
                <text x={120} y={776} className="text-2 cyan">LDG ALT</text>
                <text x={198} y={776} className="text-3">{landingAlt.toFixed(0)}</text>
                <text x={258} y={776} className="text-2"> AUTO</text>
                <text x={325} y={776} className="text-2 cyan">ΔP</text>
                <text x={373} y={776} className="text-3">{getDecimalString(deltaP)}</text>
                <text x={358} y={776} className="text-3 decimal">{getDecimalPointString(deltaP)}</text>

                {/*Weight Info*/}
                <text x={450} y={714} className="text-2 cyan">GROSS</text>
                <text x={415} y={735} className="text-2 cyan">WT</text>
                <text x={549} y={735} className="text-4">{getUnits(unitsAreMetric) ? getDecimalString(grossWeight / 1000 * 0.4535) : getDecimalString(grossWeight / 1000)}</text>
                <text x={528} y={735} className="text-4 decimal">{getUnits(unitsAreMetric) ? getDecimalPointString(grossWeight / 1000 * 0.4535) : getDecimalPointString(grossWeight / 1000 * 0.4535) }</text>
                <text x={620} y={735} className="text-2">{getUnits(unitsAreMetric) ? "KGS" : "LBS" + " X"}</text>
                <text x={608} y={756} className="text-2">1000</text>
                <text x={450} y={756} className="text-2 cyan">TOTAL</text>
                <text x={438} y={776} className="text-2 cyan">FUEL</text>
                <text x={549} y={776} className="text-4">{getUnits(unitsAreMetric) ? getDecimalString(fuelWeight / 1000 * 0.4535) : getDecimalString(fuelWeight / 1000)}</text>
                <text x={528} y={776} className="text-4 decimal">{getUnits(unitsAreMetric) ? getDecimalPointString(fuelWeight / 1000 * 0.4535) : getDecimalPointString(fuelWeight / 1000 * 0.4535) }</text>

                {/*Fuel & SAT Info*/}
                <text x={702} y={735} className="text-2 cyan">SAT</text>
                <text x={760} y={735} className="text-3">{getTempPrefix(tat) + tat.toFixed(0)}</text>               
                <text x={773} y={735} className="text-2">C</text>
                <text x={702} y={756} className="text-2 cyan">FUEL</text>
                <text x={702} y={776} className="text-2 cyan">TEMP</text>
                <text x={760} y={776} className="text-3">{getTempPrefix(fuelTemp) + fuelTemp.toFixed(0)}</text>               
                <text x={773} y={776} className="text-2">C</text>

                {/*STAB Indicator*/}
                <text x={769} y={437} className="text-2 cyan">ND</text>
                <text x={769} y={659} className="text-2 cyan">NU</text>
                <path className="white-line" fill="none" d={`M746 450, h7, v180, h-7`} />
                <text x={743} y={457} className="text-2">0</text>
                <text x={743} y={639} className="text-2">15</text>
                <path className="green-line" fill="lime" d={`M737 500, h10, v80, h-10, Z`} />
                <path className="green-line" fill="lime" d={`M760 500, l10 -5, v10, Z`} />
                <text x={730} y={515} className="text-2 cyan">S</text>
                <text x={730} y={536} className="text-2 cyan">T</text>
                <text x={730} y={557} className="text-2 cyan">A</text>
                <text x={730} y={578} className="text-2 cyan">B</text>
                <path className="minimums-line" fill="none" d={`M723 667, h58, v36, h-58, Z`} />
                <text x={776} y={696} className="text-3 green">{getDecimalString(stabTrim)}</text>
                <text x={760} y={696} className="text-3 green decimal">{getDecimalPointString(stabTrim)}</text>
                
                {/*EICAS Messages*/}
                <text x={762} y={42} className="text-3 amber">DOOR R UPPER DK</text>
                <text x={657} y={275} className="text-3">PACKS OFF</text>
                <text x={702} y={335} className="text-3">DOORS MANUAL</text>
                <text x={732} y={305} className="text-3">PARK BRAKE SET</text>
            </svg>
        </>
    );
};

render(<UpperEICAS />);
