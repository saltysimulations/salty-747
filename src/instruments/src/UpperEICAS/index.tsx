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

type BlackOutlineWhiteLineProps = { d: string; blackStroke?: number; whiteStroke?: number; color?: string };
export const BlackOutlineWhiteLine: FC<BlackOutlineWhiteLineProps> = ({ d, blackStroke = 4, whiteStroke = 3, color = "white" }) => (
    <>
        <path stroke="black" strokeWidth={blackStroke} strokeLinecap="round" d={d}></path>
        <path stroke={color} strokeWidth={whiteStroke} strokeLinecap="round" d={d}></path>
    </>
);

const UpperEICAS: FC = () => {
    const n1RedLine = 106;
    const [n1] = useSimVar("TURB ENG N1:1", "percent");
    const [n1AmberLimit] = useSimVar("L:SALTY_N1_MAX", "percent");
    const [n1Ref] = useSimVar("L:SALTY_REF_THRUST", "percent");
    return (
        <>
            <div className="LcdOverlay" style={{ opacity: "0.2" }} />
            <svg className="pfd-svg" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg"> 
                
                {/*Ref Image*/}
                <image href={img} x="0" y="0" width={800} height={800} opacity={0.4}/>

                {/*TAT Info*/}   
                <text x={95} y={42} className="text-3 cyan">SAT</text>

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
                        const x = i * 124 + 57;
                        return (
                            <>
                                <path className="white-line" fill="none" d={`M${x || 0} 143, h20 v205 h -20 Z`} />
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
                            <path className="green-line" d={`M${x- 52|| 0} ${valueToN1Bar(n1Ref) || 0}, h48`} />
                            <path className="amber-line" d={`M${x- 42|| 0} ${valueToN1Bar(n1AmberLimit) || 0}, h28`} />
                            <path className="red-line" d={`M${x- 47|| 0} ${valueToN1Bar(n1RedLine) || 0}, h38`} />
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
                    const x = i * 124 + 57;
                    return (
                        <>
                            <path className="white-line" fill="none" d={`M${x || 0} 485, h20 v110 h -20 Z`} />
                        </>
                    );
                })}
                <text x={270} y={535} className="text-2 cyan">EGT</text>

                {/*Pressurisation Info*/}
                <text x={310} y={710} className="text-2 cyan">DUCT PRESS</text>
                <text x={120} y={750} className="text-2 cyan">CAB ALT</text>
                <text x={293} y={750} className="text-2 cyan">RATE</text>
                <text x={120} y={776} className="text-2 cyan">LDG ALT</text>
                <text x={325} y={776} className="text-2 cyan">ΔP</text>

                {/*Weight Info*/}
                <text x={450} y={714} className="text-2 cyan">GROSS</text>
                <text x={415} y={735} className="text-2 cyan">WT</text>
                <text x={450} y={756} className="text-2 cyan">TOTAL</text>
                <text x={438} y={776} className="text-2 cyan">FUEL</text>

                {/*Fuel Info*/}
                <text x={702} y={735} className="text-2 cyan">SAT</text>
                <text x={702} y={756} className="text-2 cyan">FUEL</text>
                <text x={702} y={776} className="text-2 cyan">TEMP</text>
            </svg>
        </>
    );
};

render(<UpperEICAS />);
