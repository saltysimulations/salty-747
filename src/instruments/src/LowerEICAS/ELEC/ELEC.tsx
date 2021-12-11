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
import img2 from '../ELEC.png';

export const ELEC: FC = () => {
    return (
        <g>
            {/*Ref Image*/}
            <image href={img2} x="-10" y="-30" width={820} height={820} opacity={0.0}/>

            {/*Static Paths*/}
            <g className="white-line">
                <g fill="none" >
                    <rect x={79} y={200} width={60} height={60}></rect>
                    <rect x={244} y={200} width={60} height={60}></rect>
                    <rect x={79} y={477} width={60} height={60}></rect>
                    <rect x={244} y={477} width={60} height={60}></rect>
                    <rect className="green-line" x={71} y={555} width={75} height={75}></rect>
                    <rect className="green-line" x={236} y={555} width={75} height={75}></rect>
                </g>
                <path d="M 103 535, v-380, h40, v-60, h12, v60, h71, v-60, h12, v60, h127, v12, h-85, v370, h-12, v-370, h-153, v370, h-12, Z"/>
                <circle cx="374" cy="161" r="6"/>
                <circle cx="426" cy="161" r="6"/>
                <g transform="translate(417)">
                    <rect x={79} y={200} width={60} height={60}></rect>
                    <rect x={244} y={200} width={60} height={60}></rect>
                    <rect x={79} y={477} width={60} height={60}></rect>
                    <rect x={244} y={477} width={60} height={60}></rect>
                    <rect className="green-line" x={72} y={555} width={75} height={75}></rect>
                    <rect className="green-line" x={237} y={555} width={75} height={75}></rect>
                </g>
                <path transform="translate(810) scale(-1, 1)" d="M 113 535, v-380, h40, v-60, h12, v60, h71, v-60, h12, v60, h127, v12, h-85, v370, h-12, v-370, h-153, v370, h-12, Z"/>
            </g>

            {/*Static Cyan Labels*/}
            <g className="text-2 cyan">
                <text x={178} y={84}>EXT 1</text>
                <text x={261} y={84}>APU 1</text>
                <text x={597} y={84}>APU 2</text>
                <text x={680} y={84}>EXT 2</text>
                <text x={417} y={195}>SSB</text>
                <text x={440} y={241}>BUS TIE</text>
                <text x={447} y={516}>GEN CONT</text>
                <text x={430} y={603}>DRIVE</text>
                <text x={115} y={665}>1</text>
                <text x={280} y={665}>2</text>
                <text x={532} y={665}>3</text>
                <text x={696} y={665}>4</text>
            </g>

            {/*Bus Status Rects*/}
            <rect x={66} y={378} width={86} height={30} rx="15" ry="15" className="green-line"></rect>
            <rect x={231} y={378} width={86} height={30} rx="15" ry="15" className="green-line"></rect>
            <rect transform="translate(417)" x={66} y={378} width={86} height={30} rx="15" ry="15" className="green-line"></rect>
            <rect transform="translate(417)" x={231} y={378} width={86} height={30} rx="15" ry="15" className="green-line"></rect>
            <text x={138} y={402} className="text-2 green">BUS 1</text>
            <text x={303} y={402} className="text-2 green">BUS 2</text>
            <text x={555} y={402} className="text-2 green">BUS 3</text>
            <text x={720} y={402} className="text-2 green">BUS 4</text>

            {/*Utility Status Labels*/}
            <text x={222} y={334} className="text-2 green">UTILITY</text>
            <text x={386} y={334} className="text-2 green">UTILITY</text>
            <text x={497} y={334} className="text-2 green">UTILITY</text>
            <text x={662} y={334} className="text-2 green">UTILITY</text>
            <path className="green-line" d="M 125 377, v-52, h12, h-12 Z"/>
            <path className="green-line" d="M 290 377, v-52, h12, h-12 Z"/>
            <g transform="translate(800) scale(-1, 1)">
                <path className="green-line" d="M 125 377, v-52, h12, h-12 Z"/>
                <path className="green-line" d="M 290 377, v-52, h12, h-12 Z"/>
            </g>

            {/*Galley Status Labels*/}
            <text x={210} y={360} className="text-2 green">GALLEY</text>
            <text x={374} y={360} className="text-2 green">GALLEY</text>
            <text x={497} y={360} className="text-2 green">GALLEY</text>
            <text x={662} y={360} className="text-2 green">GALLEY</text>
            <path className="green-line" d="M 132 377, v-25, h6, h-6 Z"/>
            <path className="green-line" d="M 297 377, v-25, h6, h-6 Z"/>
            <g transform="translate(800) scale(-1, 1)">
                <path className="green-line" d="M 132 377, v-25, h6, h-6 Z"/>
                <path className="green-line" d="M 297 377, v-25, h6, h-6 Z"/>
            </g>

            {/*SSB*/}
            <rect x={383} y={155} width={34} height={12} fill="none" className="white-line"></rect>

        </g>
    );
};