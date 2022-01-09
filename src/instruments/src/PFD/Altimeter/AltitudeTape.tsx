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
import { useSimVar, useInteractionEvent } from "react-msfs";
import { BlackOutlineWhiteLine } from "../index";
import { removeLeadingZeros } from "@instruments/common/utils/heading";

const getRadAltClass = (radAlt: number, radioMins: number, oldClass: string): string => {
    let radAltClass = oldClass;
    if (radAlt <= radioMins && radAlt !== 0){
        radAltClass += " amber"
    }
    return radAltClass;
};

const feetToMetric = (feet: number): number => {
    const metres = Math.round(feet * 0.3048);
    return metres;
};

export const AltitudeTape: FC = () => {
    const [altitude] = useSimVar("INDICATED ALTITUDE", "feet");
    const [altAlertStatus] = useSimVar("L:SALTY_ALTITUDE_ALERT", "number");
    const [baroMins] = useSimVar("L:SALTY_MINIMUMS_ALT", "feet");
    const [selAlt] = useSimVar("AUTOPILOT ALTITUDE LOCK VAR:3", "feet");
    const [tdze] = useSimVar("L:74S_FMC_TDZE", "feet");
    const [isMtrsOn] = useSimVar("L:74S_EFIS_METRES_ON", "bool");
    const [mtrsOn, setMtrs] = useSimVar("L:74S_EFIS_METRES_ON", "bool");
    
    useInteractionEvent("B747_8_PFD_MTRS", () => {
        setMtrs(!mtrsOn);
    });

    const getAltitudeY = (altitude: number): number => {
        const y = altitude * 0.68;
        return y;
    };
      
    return (
        <g>
            <clipPath id="altitudetape-clip">
                <path d="M575 100, h125, v560, h-125 Z" />
            </clipPath>

            <g clipPath="url(#altitudetape-clip)">
                <g transform={`translate(50 ${getAltitudeY(altitude)})`}>
                    {Array.from({ length: 501 }, (_, i) => {
                        const y = i * -68 + 382;
                        const x = (i * 200) % 500 == 0 ? "M540" : "M550";
                        const length = (i * 200) % 500 == 0 ? "h25" : "h15";
                        const lineclassName = (i * 200) % 500 == 0 ? "halfThousandLine" : "white-line";
                        const outlineclassName = (i * 200) % 500 == 0 ? "halfThousandOutline" : "black-outline";
                        return (
                            <>
                                <path className={outlineclassName} d={`${x || 0} ${y || 0}, ${length || 0}`} />
                                <path className={lineclassName} d={`${x || 0} ${y || 0}, ${length || 0}`} />
                            </>
                        );
                    })}
                    {Array.from({ length: 9 }, (_, i) => {
                        const y = i * 68 + 382;
                        const x = (i * 200) % 500 == 0 ? "M540" : "M550";
                        const length = (i * 200) % 500 == 0 ? "h25" : "h15";
                        const lineclassName = (i * 200) % 500 == 0 ? "halfThousandLine" : "white-line";
                        const outlineclassName = (i * 200) % 500 == 0 ? "halfThousandOutline" : "black-outline";
                        return (
                            <>
                                <path className={outlineclassName} d={`${x || 0} ${y || 0}, ${length || 0}`} />
                                <path className={lineclassName} d={`${x || 0} ${y || 0}, ${length || 0}`} />
                            </>
                        );
                    })}
                    {Array.from({ length: 51 }, (_, i) => {
                        const y = i * -680 + 365;
                        return (
                            <>
                                <path className="fpv-outline" d={`M570 ${y || 0}, h79`} />
                                <path className="fpv-line" d={`M570 ${y || 0}, h79`} />
                                <path className="fpv-outline" d={`M570 ${y + 34 || 0}, h79`} />
                                <path className="fpv-line" d={`M570 ${y + 34 || 0}, h79`} />
                            </>
                        );
                    })}
                    {Array.from({ length: 251 }, (_, i) => {
                        const y = i * -136 + 382;
                        const offset = 11;
                        let text = ((i  * 200)).toFixed(0);
                        let hundredsText = text.substring(text.length - 3);
                        let thousandsText = text.substring(0, 2);
                        if (i < 5) {
                            thousandsText = "";
                        }
                        else if (i < 50) {
                            thousandsText = text.substring(0, 1);
                        }
                        return (
                            <>
                                <text x="641" y={`${y + offset}`} className="text-2" fillOpacity={0.9} letterSpacing={1.2}>
                                    {hundredsText}
                                </text>
                                <text x="600" y={`${y + offset}`} className="text-3" fillOpacity={0.9} letterSpacing={1.2}>
                                    {thousandsText}
                                </text>
                            </>
                        );
                    })}
                    {Array.from({ length: 5 }, (_, i) => {
                        const y = i * 136 + 382;
                        const offset = 11;
                        let text = ((i  * 200)).toFixed(0);
                        let hundredsText = "-" + text.substring(text.length - 3);
                        if (i == 0) {
                            hundredsText = ""
                        }
                        return (
                            <>
                                <text x="638" y={`${y + offset}`} className="text-2" fillOpacity={0.85} letterSpacing={1.2}>
                                    {hundredsText}
                                </text>
                            </>
                        );
                    })}

                    <path className= "gray-bg" d={`M 567 ${332 - getAltitudeY(altitude)}, h 73, v 100, h -73, Z`} />

                    {/* TDZ Indicator */}
                    <path className="black-outline" fill="none" d={`M 550 ${382 + tdze * -0.68}, h 100, m -5 0, l 5 5, m -5 -5, m -10.6 0, l 18 18, m-18 -18, m-10.6 0, l 28 28, m-28 -28, m-10.6 0, l38 38, m-38 -38, m-10.6 0, l38 38, m-38 -38, m-10.6 0, l38 38, m-38 -38, m-10.6 0, l38 38, m-38 -38, m-10.6 0, l38 38, m-38 -38, m-10.6 0, l38 38, m-38 -38, m-10.6 0, l38 38, m-10.6 0, l-27.5 -27.5, m0 10.6, l16.75 16.75`} />
                    <path className="amber-line" fill ="none" d={`M 550 ${382 + tdze * -0.68}, h 100, m -5 0, l 5 5, m -5 -5, m -10.6 0, l 18 18, m-18 -18, m-10.6 0, l 28 28, m-28 -28, m-10.6 0, l38 38, m-38 -38, m-10.6 0, l38 38, m-38 -38, m-10.6 0, l38 38, m-38 -38, m-10.6 0, l38 38, m-38 -38, m-10.6 0, l38 38, m-38 -38, m-10.6 0, l38 38, m-38 -38, m-10.6 0, l38 38, m-10.6 0, l-27.5 -27.5, m0 10.6, l16.75 16.75`} />

                    {/* Minimums Bug */}
                    <path className="fpv-outline" fill="none" d={`M 650 ${382 + baroMins * -0.68}, h -100, l-20 20, v -40, l20, 20`} />
                    <path className="green-line" fill="none" d={`M 650 ${382 + baroMins * -0.68}, h -100, l-20 20, v -40, l20, 20`}/>

                    {/* Altitude Bug */}
                    <path className="black-outline" fill="none" d={`M 550 ${Math.max(382 + (altitude + 420) * -0.68, Math.min(382 + selAlt * -0.68, 382 + (altitude - 410) * -0.68))}, l -10 15, v23, h50, v-76, h-50, v23, Z`} />
                    <path className="magenta-line" fill="none" d={`M 550 ${Math.max(382 + (altitude + 420) * -0.68, Math.min(382 + selAlt * -0.68, 382 + (altitude - 410) * -0.68))}, l -10 15, v23, h50, v-76, h-50, v23, Z`} />
                </g>
            </g>

            {/* Metres Display */}
            <g visibility={isMtrsOn? "visible" : "hidden"}>

                {/* Metres Box */}
                <g>
                    <path
                        className="indication"
                        style={{ strokeWidth: "5px", stroke: "black" }}
                        d="M 632 314, h 104, v 30, h-104, Z"
                    />
                    <path
                        style={{ strokeWidth: "3px" }}
                        className="indication"
                        d="M 632 314, h 104, v 30, h-104, Z"
                    />
                    <text x="715" y="339" className="text-3 end">{feetToMetric(altitude)}</text>
                    <text x="728" y="339" className="text-2 cyan end">M</text>
                </g>

                {/* Metres Selected Alt */}
                <g>
                    <text x="681" y="41" className="text-3 magenta end">
                        {Math.round(feetToMetric(selAlt / 10) * 10)}
                    </text>
                    <text x="682" y="41" className="text-2 cyan start">
                        M
                    </text>
                </g>
            </g>

            {/* Altimeter Scroller Box */}
            <path
                className="indication"
                style={{ strokeWidth: "5px", stroke: "black" }}
                d="M 632 342 h 104 v 78 h -104 v -28 l -14 -11 l 14 -11 Z"
            />
            <path 
                style={{ strokeWidth: (altAlertStatus != 0 ? "9px" : "3px"), stroke: (altAlertStatus != 2 ? "white" : "#ffc400") }}
                className="indication" 
                d="M 632 342 h 104 v 78 h -104 v -28 l -14 -11 l 14 -11 Z" 
            />
        </g>     
    );
};

export const CommandAlt: FC = () => {
    const [selAlt] = useSimVar("AUTOPILOT ALTITUDE LOCK VAR:3", "feet");
    const [altAlertStatus] = useSimVar("L:SALTY_ALTITUDE_ALERT", "number");

    const getLargeSelAltText = (altitude: number): string => {
        let text = altitude.toString().substring(0, altitude >= 10000 ? 2 : 1);
        if (altitude < 1000) {
            text = "";
        }
        return text;
    };
    
    const getSmallSelAltText = (altitude: number): string => {
        const string = altitude.toString();
        const text = string.substring(string.length - 3)
        return text;
    };

    return (
        <g>
            <text x="648" y="80" className="text-4 magenta">
                {getLargeSelAltText(selAlt)}
            </text>
            <text x="695" y="80" className="text-3 magenta">
                {getSmallSelAltText(selAlt)}
            </text>
            <path className="indication"
                d="M 600 45, h 100, v40, h-100, Z"
                fill="none"
                visibility={(altAlertStatus == 1 ? "visible" : "hidden")} />
        </g>
    );
}

export const BaroSetting: FC = () => {
    const [preselBaroHg] = useSimVar("L:XMLVAR_Baro1_SavedPressure", "inHg");
    const [baroHg] = useSimVar("KOHLSMAN SETTING HG", "inHg");
    const [units] = useSimVar("L:XMLVAR_Baro_Selector_HPA_1", "bool");

    const getIsStd = (): boolean => {
        const [isStd] = useSimVar("KOHLSMAN SETTING STD", "bool");
        return isStd;
    };

    return (
        <g>
            <text x="682" y="710" className="text-4 green" visibility= {getIsStd() == true ? "visible" : "hidden"}>
                STD
            </text>
            <text 
                x={units === 0 ? "685": "680"} 
                y="710" 
                className="text-3 green" 
                visibility= {getIsStd() == false ? "visible" : "hidden"}>
                {units === 0 ? baroHg.toFixed(2): (baroHg * 33.86).toFixed(0)}
            </text>
            <text 
                x={units === 0 ? "715": "725"} 
                y="710" 
                className="text-2 green" 
                visibility= {getIsStd() == false ? "visible" : "hidden"}>
                {units === 0 ? " IN": " HPA"}
            </text>
            <text 
                x="720" 
                y="745" 
                visibility={preselBaroHg == -1 ? "hidden" : "visible"}
                className="text-2">
                {units === 0 ? preselBaroHg.toFixed(2) + " IN": (preselBaroHg * 33.86).toFixed(0) + " HPA"}
            </text>
        </g>
    );
};

export const Minimums: FC = () => {
    const [baroMins] = useSimVar("L:SALTY_MINS_BARO", "feet");
    const [radioMins] = useSimVar("L:SALTY_MINS_RADIO", "feet");
    const [radAlt] = useSimVar("RADIO HEIGHT", "feet");

    return (
        < g>
            < g visibility={baroMins >= -100 ? "visible" : "hidden"}>
                <text x="530" y="640" className="text-2 green" >
                    BARO
                </text>
                <text x="530" y="668" className="text-3 green">
                    {baroMins}
                </text>
            </g>

            < g visibility={radioMins > 0 ? "visible" : "hidden"}>
                <text x="550" y="85" className={getRadAltClass(radAlt, radioMins, "text-2 green")}>
                    RADIO
                </text>
                <text x="550" y="113" className={getRadAltClass(radAlt, radioMins, "text-3 green")}>
                    {radioMins}
                </text>
            </g>

        </g>

    );
};

export const RadioAltimeter: FC = () => {
    const [radAlt] = useSimVar("RADIO HEIGHT", "feet");
    const [radioMins] = useSimVar("L:SALTY_MINS_RADIO", "feet");

    const getRadAltRounded = (): number => {
        let alt = 0;
        if (radAlt > 500) {
            alt = Math.round(radAlt / 20) * 20;
        } 
        else if (radAlt > 100) {
            alt = Math.round(radAlt / 10) * 10;
        }
        else {
            alt = Math.round(radAlt / 2) * 2;  
        }
        return alt;
    };

    return (
        < g>
            < g visibility={radAlt <= 2500 ? "visible" : "hidden"}>
                <text x="550" y="150" className={getRadAltClass(radAlt, radioMins, "text-4")}>
                    {getRadAltRounded()}
                </text>
            </g>

        </g>

    );
};