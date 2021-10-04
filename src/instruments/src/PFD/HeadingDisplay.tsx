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
import { BlackOutlineWhiteLine } from "./index";

export const HeadingDisplay: FC = () => {
    const [heading] = useSimVar("PLANE HEADING DEGREES MAGNETIC", "degrees");
    const [mcpheading] = useSimVar("AUTOPILOT HEADING LOCK DIR:1", "degrees");
    const [track] = useSimVar("GPS GROUND MAGNETIC TRACK", "degrees");

    const arcCorrection = (indicatorHeading: number): number => {
        let headingDelta = heading - indicatorHeading;
        if (headingDelta > 180) {
            headingDelta -= 360;
        } else if (headingDelta < -180) {
            headingDelta += 360;
        }
        let corr = Math.min(Math.abs(headingDelta), 30);
        return corr;
    };

    const getHeadingDelta = (indicatorHeading: number): number => {
        let headingDelta = heading - indicatorHeading;
        if (headingDelta > 180) {
            headingDelta -= 360;
        } else if (headingDelta < -180) {
            headingDelta += 360;
        }
        return headingDelta * 1.6;
    };

    const getSelHeadingString = (): string => {
        let hdgString = mcpheading.toFixed(0);
        if (hdgString == '0') {
            hdgString = '360';
        }
        if (hdgString.length == 2) {
            hdgString = "0" + hdgString;
        }
        else if (hdgString.length == 1) {
            hdgString = "00" + hdgString;
        }
        return hdgString;
    };

    const getDriftAngle = (): number => {
        let driftAngle = heading - track;
        if (driftAngle > 180) {
            driftAngle -= 360;
        } else if (driftAngle < -180) {
            driftAngle += 360;
        }
        return driftAngle * -1;
    };

    return (
        <g>
            <g>
                <g transform={`rotate(${-getHeadingDelta(360) || 0} 349 ${900 + arcCorrection(360) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="364" y="718" className="text-3" >36</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(30) || 0} 349 ${900 + arcCorrection(30) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="357" y="718" className="text-3" >3</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(60) || 0} 349 ${900 + arcCorrection(60) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="357" y="718" className="text-3" >6</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(90) || 0} 349 ${900 + arcCorrection(90) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="357" y="718" className="text-3" >9</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(120) || 0} 349 ${900 + arcCorrection(120) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="364" y="718" className="text-3" >12</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(150) || 0} 349 ${900 + arcCorrection(150) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="364" y="718" className="text-3" >15</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(180) || 0} 349 ${900 + arcCorrection(180) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="364" y="718" className="text-3" >18</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(210) || 0} 349 ${900 + arcCorrection(210) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="364" y="718" className="text-3" >21</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(240) || 0} 349 ${900 + arcCorrection(240) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="364" y="718" className="text-3" >24</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(270) || 0} 349 ${900 + arcCorrection(270) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="364" y="718" className="text-3" >27</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(300) || 0} 349 ${900 + arcCorrection(300) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="364" y="718" className="text-3" >30</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(330) || 0} 349 ${900 + arcCorrection(330) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="364" y="718" className="text-3" >33</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(10) || 0} 349 ${900 + arcCorrection(10) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="355" y="712" className="text-2" >1</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(20) || 0} 349 ${900 + arcCorrection(20) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="355" y="712" className="text-2" >2</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(40) || 0} 349 ${900 + arcCorrection(40) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="355" y="712" className="text-2" >4</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(50) || 0} 349 ${900 + arcCorrection(50) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="355" y="712" className="text-2" >5</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(70) || 0} 349 ${900 + arcCorrection(70) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="355" y="712" className="text-2" >7</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(80) || 0} 349 ${900 + arcCorrection(80) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="355" y="712" className="text-2" >8</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(100) || 0} 349 ${900 + arcCorrection(100) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >10</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(110) || 0} 349 ${900 + arcCorrection(110) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >11</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(130) || 0} 349 ${900 + arcCorrection(130) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >13</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(140) || 0} 349 ${900 + arcCorrection(140) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >14</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(160) || 0} 349 ${900 + arcCorrection(160) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >16</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(170) || 0} 349 ${900 + arcCorrection(170) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >17</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(190) || 0} 349 ${900 + arcCorrection(190) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >19</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(200) || 0} 349 ${900 + arcCorrection(200) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >20</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(220) || 0} 349 ${900 + arcCorrection(220) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >22</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(230) || 0} 349 ${900 + arcCorrection(230) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >23</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(250) || 0} 349 ${900 + arcCorrection(250) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >25</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(260) || 0} 349 ${900 + arcCorrection(260) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >26</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(280) || 0} 349 ${900 + arcCorrection(280) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >28</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(290) || 0} 349 ${900 + arcCorrection(290) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >29</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(310) || 0} 349 ${900 + arcCorrection(310) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >31</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(320) || 0} 349 ${900 + arcCorrection(320) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >32</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(340) || 0} 349 ${900 + arcCorrection(340) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >34</text>
                </g>
                <g transform={`rotate(${-getHeadingDelta(350) || 0} 349 ${900 + arcCorrection(350) || 0})`}>
                    <BlackOutlineWhiteLine d="M349 678, v13" />
                    <text x="361" y="712" className="text-2" >35</text>
                </g>

                <g>
                    <g transform={`rotate(${-getHeadingDelta(5) || 0} 349 ${900 + arcCorrection(5) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(15) || 0} 349 ${900 + arcCorrection(15) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(25) || 0} 349 ${900 + arcCorrection(25) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(35) || 0} 349 ${900 + arcCorrection(35) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(45) || 0} 349 ${900 + arcCorrection(45) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(55) || 0} 349 ${900 + arcCorrection(55) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(65) || 0} 349 ${900 + arcCorrection(65) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(75) || 0} 349 ${900 + arcCorrection(75) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(85) || 0} 349 ${900 + arcCorrection(85) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(95) || 0} 349 ${900 + arcCorrection(95) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(105) || 0} 349 ${900 + arcCorrection(105) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(115) || 0} 349 ${900 + arcCorrection(115) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(125) || 0} 349 ${900 + arcCorrection(125) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(135) || 0} 349 ${900 + arcCorrection(135) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(145) || 0} 349 ${900 + arcCorrection(145) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(155) || 0} 349 ${900 + arcCorrection(155) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(165) || 0} 349 ${900 + arcCorrection(165) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(175) || 0} 349 ${900 + arcCorrection(175) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(185) || 0} 349 ${900 + arcCorrection(185) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(195) || 0} 349 ${900 + arcCorrection(195) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(205) || 0} 349 ${900 + arcCorrection(205) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(215) || 0} 349 ${900 + arcCorrection(215) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(225) || 0} 349 ${900 + arcCorrection(225) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(235) || 0} 349 ${900 + arcCorrection(235) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(245) || 0} 349 ${900 + arcCorrection(245) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(255) || 0} 349 ${900 + arcCorrection(255) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(265) || 0} 349 ${900 + arcCorrection(265) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(275) || 0} 349 ${900 + arcCorrection(275) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(285) || 0} 349 ${900 + arcCorrection(285) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(295) || 0} 349 ${900 + arcCorrection(295) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(305) || 0} 349 ${900 + arcCorrection(305) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(315) || 0} 349 ${900 + arcCorrection(315) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(325) || 0} 349 ${900 + arcCorrection(325) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(335) || 0} 349 ${900 + arcCorrection(335) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(345) || 0} 349 ${900 + arcCorrection(345) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                    <g transform={`rotate(${-getHeadingDelta(355) || 0} 349 ${900 + arcCorrection(355) || 0})`}>
                        <BlackOutlineWhiteLine d="M349 678, v7" />
                    </g>
                </g>
            </g>

            {/* Text Values */}
            <text x="435" y="777" className="text-2-green">MAG</text>
            <text x="305" y="777" className="text-3-magenta">{getSelHeadingString()}</text>
            <text x="317" y="777" className="text-2-magenta">H</text>


            {/* Heading Bug */}
            <g transform={`rotate(${-getHeadingDelta(mcpheading) || 0} 349 ${900 + arcCorrection(mcpheading) || 0})`}>
                <path className="black-outline" d="M 335 679, h28, v-14, h-4, l-7 14, h-6, l-7 -14, h-4, Z" ></path>
                <path className="magenta-line" d="M 335 679, h28, v-14, h-4, l-7 14, h-6, l-7 -14, h-4, Z" ></path>
            </g>

            {/* Heading Triangle */}
            <path className="fpv-outline" fill="none" d="M349 677 l-11 -20 l22 0 Z" stroke-linejoin="round"/>
            <path className="fpv-line" fill="none" d="M349 677 l-11 -20 l22 0 Z" stroke-linejoin="round"/>
            
            {/* Track Line */}
            <g transform={`rotate(${getHeadingDelta(heading - getDriftAngle()) || 0} 349 ${900 + arcCorrection(heading - getDriftAngle()) || 0})`}>
                <BlackOutlineWhiteLine d="M349 678, v150" />
                <BlackOutlineWhiteLine d="M343 751, h12" />
            </g>

            <rect x="130" y="789" width="440" height="15" fill="black" ></rect>
        </g>
    );
};