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
import img2 from '../HYD.png';

const getDecimalString = (value: number): string => {
    let decString = value.toFixed(2);
    decString = decString.replace(".", "");
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

export const HYD: FC = () => {
    return (
        <g>
            {/*Ref Image*/}
            <image href={img2} x="-10" y="-10" width={820} height={820} opacity={0.0}/>

            {/*System 1 Static Paths*/}
            <g className="white-line">
                <circle cx="43.5" cy="430" r="28"/>
                <circle cx="205.5" cy="430" r="28"/>
                <circle cx="125.5" cy="498" r="18"/>
                <path fill="none" d="M 66 570, h-13, v65, h60, v-65, h-12"/>
                <rect fill="none" x={104} y={340} width={43} height={43}></rect>
                <path fill="black" d="M 66 628, v-80, h-28, v-230,  h45, v-20, m10 0, v20, h118, v230, h-111, v68, m-10 0, v-79, h30, v-208, h-71, v208, h27, v91, M 131 537, h69, v-208, h-69, Z"/>
                <path fill="none" d="M 78 570, h10"/>
            </g>

            {/*System 2 Static Paths*/}
            <g className="white-line">
                <circle cx="273.5" cy="430" r="28"/>
                <circle cx="355.5" cy="498" r="18"/>
                <path fill="none" d="M 296 570, h-13, v65, h60, v-65, h-12"/>
                <rect fill="none" x={334} y={340} width={43} height={43}></rect>
                <path fill="black" d="M 296 628, v-80, h-28, v-230, h45, v-20, m10 0, v20, h38, v230, h-31, v68, m-10 0, v-79, h30, v-208, h-71, v208, h27, v91"/>
                <path fill="none" d="M 308 570, h10"/>
            </g>

            {/*System 3 Static Paths*/}
            <g className="white-line">
                <circle cx="463.5" cy="430" r="28" />
                <circle cx="545.5" cy="498" r="18" />
                <path fill="none" d="M 486 570, h-13, v65, h60, v-65, h-12" />
                <rect fill="none" x={524} y={340} width={43} height={43}></rect>
                <rect fill="none" x={372} y={432} width={43} height={43}></rect>
                <path fill="black" d="M 486 628, v-80, h-98, v-230, h115, v-20, m10 0, v20, h38, v230, h-31, v68, m-10 0, v-79, h30, v-208, h-71, v208, h27, v91, m -97 -91, h59, v-208, h-59, Z" />
                <path fill="none" d="M 498 570, h10" />
            </g>

            {/*System 4 Static Paths*/}
            <g className="white-line">
                <circle cx="593.5" cy="430" r="28"/>
                <circle cx="755.5" cy="430" r="28"/>
                <circle cx="675.5" cy="498" r="18"/>
                <path fill="none" d="M 616 570, h-13, v65, h60, v-65, h-12"/>
                <rect fill="none" x={654} y={340} width={43} height={43}></rect>
                <path fill="black" d="M 616 628, v-80, h-28, v-230, h45, v-20, m10 0, v20, h118, v230, h-111, v68, m-10 0, v-79, h30, v-208, h-71, v208, h27, v91, M 681 537, h69, v-208, h-69, Z"/>
                <path fill="none" d="M 628 570, h10"/>
            </g>

            {/*Static Cyan Labels*/}
            <g className="text-2 cyan">
                <text x={410} y={677}>QTY</text>
                <text x={421} y={708}>PRESS</text>
                <text x={412} y={742}>TEMP</text>
                <text x={100} y={370}>EDP</text>
                <text x={173} y={439}>AUX</text>
                <text x={112} y={439}>DEM</text>
                <text x={105} y={507}>SOV</text>
                <text x={86} y={773}>1</text>
                <text x={314} y={773}>2</text>
                <text x={511} y={773}>3</text>
                <text x={638} y={773}>4</text>
                <text x={330} y={370}>EDP</text>
                <text x={342} y={439}>DEM</text>
                <text x={335} y={507}>SOV</text>
                <text x={520} y={370}>EDP</text>
                <text x={532} y={439}>DEM</text>
                <text x={525} y={507}>SOV</text>
                <text x={440} y={500}>RAT</text>
                <text x={650} y={370}>EDP</text>
                <text x={723} y={439}>AUX</text>
                <text x={662} y={439}>DEM</text>
                <text x={655} y={507}>SOV</text>
            </g>

            {/*System 1 Values*/}
            <text className="text-3 white decimal" x={74} y={677}>{getDecimalPointString(1.00)}</text>
            <text className="text-3 white" x={104} y={677}>{getDecimalString(1.00)}</text>
            <text className="text-3 amber" x={112} y={708}>40</text>
            <text className="text-3 white" x={103} y={743}>15</text>

            {/*System 2 Values*/}
            <text className="text-3 white decimal" x={304} y={677}>{getDecimalPointString(1.00)}</text>
            <text className="text-3 white" x={334} y={677}>{getDecimalString(1.00)}</text>
            <text className="text-3 amber" x={342} y={708}>40</text>
            <text className="text-3 white" x={331} y={743}>15</text>

            {/*System 3 Values*/}
            <text className="text-3 white decimal" x={498} y={677}>{getDecimalPointString(1.00)}</text>
            <text className="text-3 white" x={528} y={677}>{getDecimalString(1.00)}</text>
            <text className="text-3 amber" x={537} y={708}>40</text>
            <text className="text-3 white" x={528} y={743}>15</text>

            {/*System 4 Values*/}
            <text className="text-3 white decimal" x={625} y={677}>{getDecimalPointString(1.00)}</text>
            <text className="text-3 white" x={655} y={677}>{getDecimalString(1.00)}</text>
            <text className="text-3 amber" x={662} y={708}>40</text>
            <text className="text-3 white" x={655} y={743}>15</text>

            {/*System 1 Dependants*/}
            <g className="text-2 amber">
                <text x={181} y={175}>INBD TE FLAPS</text>
                <text x={134} y={195}>BODY GEAR</text>
                <text x={158} y={215}>AUTOPILOT C</text>
                <text x={170} y={235}>L OUTBD ELEV</text>
                <text x={134} y={255}>NOSE GEAR</text>
                <text x={122} y={275}>STEERING</text>
                <text x={146} y={295}>THRUST REV</text>
            </g>
            <path className="cyan-line" fill="none" d="M 30 150, h160, h-80, v-95, h28, v-35, v80"/>

            {/*System 2 Dependants*/}
            <g className="text-2 amber">
                <text x={358} y={235}>AUTOPILOT R</text>
                <text x={393} y={255}>SPLR 2,3,10,11</text>
                <text x={393} y={275}>YAW DAMPER LWR</text>
                <text x={346} y={295}>THRUST REV</text>
            </g>
            <path className="cyan-line" fill="none" d="M 230 210, h160, h-80, v-155, h-28, v-35, v80, v-45, h60, v-35, v60"/>
            <path className="cyan-line" fill="none" d="M 310 210, v-65, h24, v34, v-64, v30, h-24, v-42, h205, v-21, v42"/>

            {/*System 3 Dependants*/}
            <g className="text-2 amber">
                <text x={538} y={235}>AUTOPILOT L</text>
                <text x={561} y={255}>SPLR 1,4,9,12</text>
                <text x={573} y={275}>YAW DAMPER UPR</text>
                <text x={526} y={295}>THRUST REV</text>
            </g>
            <path className="cyan-line" fill="none" d="M 410 210, h160, h-80, v-65, h-20, v-30, v64, v-34, h20, v-40"/>


            {/*System 4 Dependants*/}
            <g className="text-2 amber">
                <text x={761} y={215}>OUTBD TE FLAPS</text>
                <text x={737} y={235}>R OUTBD ELEV</text>
                <text x={737} y={255}>SPLR 5,6,7,8</text>
                <text x={702} y={275}>WING GEAR</text>
                <text x={714} y={295}>THRUST REV</text>
            </g>
            <path className="cyan-line" fill="none" d="M 600 190, h160, h-80, v-87, h-25, v20, v-40, v20, h25, v-50, h-205, v30, v-60"/>

            {/*System 1 & 2 Dependants*/}
            <g className="text-2 amber">
                <text x={274} y={40}>L OUTBD AIL</text>
                <text x={262} y={60}>UPR RUDDER</text>
                <text x={262} y={80}>L INBD AIL</text>
                <text x={274} y={100}>L INBD ELEV</text>
            </g>

            {/*System 1 & 2 & 4 Dependants*/}
            <g className="text-2 amber">
                <text x={421} y={40}>BRAKES</text>
                <text x={468} y={60}>R INBD AIL</text>
                <text x={468} y={80}>LWR RUDDER</text>
            </g>

            {/*System 2 & 3 Dependants*/}
            <g className="text-2 amber">
                <text x={444} y={135}>ELEV FEEL</text>
                <text x={444} y={155}>STAB TRIM</text>
                <text x={468} y={175}>PITCH AUGMT</text>
            </g>

            {/*System 2 & 3 & 4 Dependants*/}
            <g className="text-2 amber">
                <text x={651} y={102}>R OUTBD AIL</text>
                <text x={651} y={122}>R INBD ELEV</text>
            </g>
        </g>
    );
};