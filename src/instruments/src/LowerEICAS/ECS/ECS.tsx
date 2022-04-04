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
import img2 from '../ECS.png';

export const ECS: FC = () => {
    return (
        <g>
            {/*Ref Image*/}
            <image href={img2} x="0" y="-30" width={820} height={820} opacity={0.0}/>

            {/*Dynamic Elements*/}  
            <text x={374} y={77} className="text-3 magenta">22</text> {/* 1 */}
            <text x={66} y={73} className="text-2 magenta">22</text> {/* 1 */}
            <text x={148} y={73} className="text-2 magenta">22</text> {/* 1 */}
            <text x={66} y={143} className="text-2 magenta">22</text> {/* 1 */}
            <text x={148} y={143} className="text-2 magenta">22</text> {/* 1 */}
            <text x={230} y={143} className="text-2 magenta">22</text> {/* 1 */}
            <text x={312} y={143} className="text-2 magenta">22</text> {/* 1 */}
            <text x={394} y={143} className="text-2 magenta">22</text> {/* 1 */}
            
            <text x={267} y={214} className="text-2 magenta">15</text> {/* 2 */}
            <text x={109} y={73} className="text-3">20</text> {/* 3 */}
            <text x={191} y={73} className="text-3">20</text> {/* 4 */}
            <text x={109} y={143} className="text-3">20</text> {/* 5 */}
            <text x={191} y={143} className="text-3">20</text> {/* 6 */}
            <text x={273} y={143} className="text-3">20</text> {/* 7 */}
            <text x={355} y={143} className="text-3">20</text> {/* 8 */}
            <text x={437} y={143} className="text-3">20</text> {/* 9 */}
            <text x={310} y={214} className="text-3">20</text> {/* 10 */}
            <text x={377} y={214} className="text-3">20</text> {/* 11 */}
            <text x={131} y={214} className="text-3">20</text> {/* 12 */}

            <text x={529} y={89} className="text-2">OFF</text> {/* 12 */}
            <text x={529} y={137} className="text-2">OFF</text> {/* 12 */}
            <text x={529} y={185} className="text-2">OFF</text> {/* 12 */}



            <circle className="white-line" fill="none" cx="250" cy="441" r="30"/>
            <circle className="white-line" fill="none" cx="550" cy="441" r="30"/>
            
            <g> {/* APU Bleed Valve - L:SALTY_ECS_APU_BLEED_VALVE "enum" - Color: Normal White, In Transit Amber*/}
                <circle className="white-line" fill="none" cx="398.25" cy="509" r="30"/> 
                <path className="white-line" d="M370 504, h56" />
                <path className="white-line" d="M370 514, h56" />
            </g>

            <text x={362} y={28} className="text-2 cyan">TEMP °C</text>

            {/*Static Labels*/}
            <text x={94} y={43} className="text-2 cyan">F/D</text>
            <text x={175} y={43} className="text-2 cyan">U/D</text>
            <text x={326} y={77} className="text-2 cyan">MASTER</text>
            
            <path className="cyan-line" d="M279 33, h84" />
            <text x={530} y={28} className="text-2 cyan">LWR</text>
            <text x={546} y={50} className="text-2 cyan">RECIRC</text>
            <text x={734} y={58} className="text-2 cyan">OUTFLOW VALVES</text>
            <text x={616} y={82} className="text-2 cyan">L</text>
            <text x={711} y={82} className="text-2 cyan">R</text>
            <text x={623} y={191} className="text-2">AUTO</text>
            <text x={718} y={191} className="text-2">AUTO</text>
            <text x={663} y={99} className="text-2 cyan">OP</text>
            <text x={663} y={170} className="text-2 cyan">CL</text>
            <text x={82} y={113} className="text-2 cyan">A</text>
            <text x={163} y={113} className="text-2 cyan">B</text>
            <text x={244} y={113} className="text-2 cyan">C</text>
            <text x={326} y={113} className="text-2 cyan">D</text>
            <text x={409} y={113} className="text-2 cyan">E</text>
            <text x={134} y={183} className="text-2 cyan">FWD</text>
            <text x={295} y={183} className="text-2 cyan">AFT</text>
            <text x={385} y={183} className="text-2 cyan">BULK</text>
            <text x={475} y={90} className="text-2 cyan">1</text>
            <text x={475} y={138} className="text-2 cyan">2</text>
            <text x={475} y={186} className="text-2 cyan">3</text>
            <text x={321} y={361} className="text-2 cyan">PACK CONTROL</text>
            <text x={618} y={361} className="text-2 cyan">PACK CONTROL</text>
            <text x={109} y={314} className="text-2 cyan">1</text>
            <text x={404} y={314} className="text-2 cyan">2</text>
            <text x={699} y={314} className="text-2 cyan">3</text>
            <text x={69} y={403} className="text-2 cyan">DUCT</text>
            <text x={63} y={425} className="text-2 cyan">PSI</text>
            <text x={776} y={403} className="text-2 cyan">DUCT</text>
            <text x={770} y={425} className="text-2 cyan">PSI</text>
            <text x={63} y={510} className="text-2 cyan">WAI</text>
            <text x={769} y={510} className="text-2 cyan">WAI</text>
            <text x={415} y={572} className="text-2 cyan">APU</text>
            <text x={318} y={392} className="text-2 cyan">DUCT</text>
            <text x={312} y={414} className="text-2 cyan">PSI</text>
            <text x={209} y={692} className="text-2 cyan">EAI</text>
            <text x={209} y={764} className="text-2 cyan">ENG</text>
            <text x={623} y={692} className="text-2 cyan">EAI</text>
            <text x={623} y={764} className="text-2 cyan">ENG</text>
            <text x={108} y={764} className="text-2 cyan">1</text>
            <text x={285} y={764} className="text-2 cyan">2</text>
            <text x={523} y={764} className="text-2 cyan">3</text>
            <text x={698} y={764} className="text-2 cyan">4</text>

            {/*Static Paths*/}

            <path className="white-line" fill="none" d="M46 33, h-10, v48, h162, v-48, h-10" />
            <path className="white-line" fill="none" d="M106 33, h10, v48, v-48, h10" />

            <path className="white-line" fill="none" d="M56 104, h-20, v48, h410, v-48, h-20" />
            <path className="white-line" fill="none" d="M96 104, h20, v48, v-48, h20" />
            <path className="white-line" fill="none" d="M178 104, h20, v48, v-48, h20" />
            <path className="white-line" fill="none" d="M260 104, h20, v48, v-48, h20" />
            <path className="white-line" fill="none" d="M342 104, h20, v48, v-48, h20" />

            <path className="white-line" fill="none" d="M339 50, h40, v32, h-40, Z" />

            <path className="white-line" fill="none" d="M480 56, h62, v48, h-62, Z" />
            <path className="white-line" fill="none" d="M480 104, h62, v48, h-62, Z" />
            <path className="white-line" fill="none" d="M480 152, h62, v48, h-62, Z" />
            
            <path className="white-line" fill="none" d="M85 175, h-10, v48, h82, v-48, h-10" />

            <path className="white-line" fill="none" d="M246 175, h-10, v48, h166, v-48, h-10" />
            <path className="white-line" fill="none" d="M308 175, h10, v48, v-48, h10" />

            <path className="white-line" fill="none"  d="M 622 91, A 36 36 1 1 0 622 159, Z"/>
            <path className="white-line" fill="none"  d="M 575 126, h10"/>
            <path className="white-line" fill="none"  d="M 610 90, v10"/>
            <path className="white-line" fill="none"  d="M 610 150, v10"/>

            <path className="white-line" fill="none"  d="M 718 91, A 36 36 1 1 0 718 159, Z"/>
            <path className="white-line" fill="none"  d="M 671 126, h10"/>
            <path className="white-line" fill="none"  d="M 706 90, v10"/>
            <path className="white-line" fill="none"  d="M 706 150, v10"/>

            <circle className="white-line" fill="none" cx="398.25" cy="353" r="30"/>
            <circle className="white-line" fill="none" cx="103" cy="353" r="30"/>
            <circle className="white-line" fill="none" cx="693" cy="353" r="30"/>

            <circle className="white-line" fill="none" cx="103" cy="623" r="30"/>
            <circle className="white-line" fill="none" cx="279" cy="623" r="30"/>
            <circle className="white-line" fill="none" cx="517" cy="623" r="30"/>
            <circle className="white-line" fill="none" cx="693" cy="623" r="30"/>

            <path className="white-line" fill="none"  d="M 100 450, h-35"/>
            <path className="white-line" fill="none"  d="M 24 433, h40, v34, h-40, Z"/>
            <path className="white-line" fill="none"  d="M 400 395, h-35"/>
            <path className="white-line" fill="none"  d="M 324 378, h40, v34, h-40, Z"/>
            <path className="white-line" fill="none"  d="M 700 450, h35"/>
            <path className="white-line" fill="none"  d="M 735 433, h40, v34, h-40, Z"/>

            <path className="white-line" d="M 98 384, v113, h-25, l-5 5, l5 5, h25, v207, l-10 24, h30, l-10 -24, v-25, h25, l5 -5, l-5 -5, h-25, v-134, h166, v134, h-25, l-5 5, l5 5, h25, v25, l-10 24, h30, l-10 -24, v-179, h-176, v-88, h285, v32, h10, v-32, h285, v88, h-176, v179, l-10, 24, h30, l-10, -24, v-25, h25, l5 -5, l-5 -5, h-25, v-134, h166, v134, h-25, l-5 5, l5, 5, h25, v25, l-10, 24, h30, l-10, -24, v-207, h25, l5 -5, l-5 -5, h-25, v-114, h-10, v53, h-285, v-53, h-10, v53, h-285, v-53, h-10, Z"/>
        </g>
    );
};