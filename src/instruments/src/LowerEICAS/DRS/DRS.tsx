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
import img3 from '../DRS.png';

export const DRS: FC = () => {
    const [entry1L] = useSimVar('INTERACTIVE POINT OPEN:10', 'percent', 1000);
    const [entry5R] = useSimVar('INTERACTIVE POINT OPEN:1', 'percent', 1000);
    const [cargoFwd] = useSimVar('INTERACTIVE POINT OPEN:12', 'percent', 1000);

    return (
        <g>
            {/*Ref Image*/}
            <image href={img3} x="25" y="25" width={750} height={750} opacity={0.0}/>

            {/*Escape Slide Status*/}  
            <text x={333} y={211} id="entry1L" className="text-3">{entry1L > 20 ? 'M' : 'A'}</text>
            <text x={333} y={286} className="text-3">A</text>
            <text x={333} y={327} className="text-3">A</text>
            <text x={333} y={431} className="text-3">A</text>
            <text x={333} y={541} className="text-3">A</text>
            <text x={333} y={643} className="text-3">A</text>

            <text x={483} y={211} className="text-3">A</text>
            <text x={483} y={286} className="text-3">A</text>
            <text x={483} y={327} className="text-3">A</text>
            <text x={483} y={431} className="text-3">A</text>
            <text x={483} y={541} className="text-3">A</text>
            <text x={483} y={643} className="text-3">{entry5R > 20 ? 'M' : 'A'}</text>

            {/*Door Status*/}
            <rect className="hidden-line" x="382" y="164" width="14" height="14"/>
            <rect className="hidden-line" x="390" y="354" width="20" height="20"/>
            <rect className={entry1L > 20 ? 'amber-line' : 'hidden-line'} x="356" y="194" width="23" height="12"/>
            <rect className="hidden-line" x="371" y="270" width="23" height="12"/>
            <rect className="hidden-line" x="356" y="310" width="23" height="12"/>
            <rect className="hidden-line" x="356" y="414" width="23" height="12"/>
            <rect className="hidden-line" x="356" y="524" width="23" height="12"/>
            <rect className="hidden-line" x="356" y="624" width="23" height="12"/>

            <rect className="hidden-line" x="421" y="194" width="23" height="12"/>
            <rect className="hidden-line" x="406" y="270" width="23" height="12"/>
            <rect className="hidden-line" x="421" y="310" width="23" height="12"/>
            <rect className="hidden-line" x="421" y="414" width="23" height="12"/>
            <rect className="hidden-line" x="421" y="524" width="23" height="12"/>
            <rect className={entry5R > 20 ? 'amber-line' : 'hidden-line'} x="421" y="624" width="23" height="12"/>

            <rect className={cargoFwd > 20 ? 'amber-line' : 'hidden-line'} x="421" y="224" width="28" height="28"/>
            <rect className="hidden-line" x="421" y="552" width="28" height="28"/>
            <rect className="hidden-line" x="429" y="586" width="20" height="20"/>

            {/*Door Labels*/}
            <text x={227} y={181} className="text-3 cyan">MAIN ELEC</text>
            <text x={197} y={211} className="text-3 cyan">ENTRY 1</text>
            <text x={243} y={286} className="text-3 cyan">UPPER DECK</text>
            <text x={197} y={327} className="text-3 cyan">ENTRY 2</text>
            <text x={197} y={431} className="text-3 cyan">ENTRY 3</text>
            <text x={197} y={541} className="text-3 cyan">ENTRY 4</text>
            <text x={197} y={643} className="text-3 cyan">ENTRY 5</text>
            <text x={655} y={211} className="text-3 cyan">ENTRY 1</text>
            <text x={685} y={249} className="text-3 cyan">FWD CARGO</text>
            <text x={700} y={286} className="text-3 cyan">UPPER DECK</text>
            <text x={655} y={327} className="text-3 cyan">ENTRY 2</text>
            <text x={655} y={431} className="text-3 cyan">ENTRY 3</text>
            <text x={655} y={541} className="text-3 cyan">ENTRY 4</text>
            <text x={655} y={643} className="text-3 cyan">ENTRY 5</text>
            <text x={670} y={374} className="text-3 cyan">CTR ELEC</text>
            <text x={685} y={578} className="text-3 cyan">AFT CARGO</text>
            <text x={700} y={609} className="text-3 cyan">BULK CARGO</text>
    
            <path className="cyan-line" d="M333 170, h-92" />
            <path className="cyan-line" d="M306 200, h-95" />
            <path className="cyan-line" d="M306 316, h-95" />
            <path className="cyan-line" d="M306 276, h-48" />
            <path className="cyan-line" d="M306 420, h-95" />
            <path className="cyan-line" d="M306 529, h-95" />
            <path className="cyan-line" d="M306 631, h-95" />
            <path className="cyan-line" d="M538 200, h-40" />
            <path className="cyan-line" d="M538 238, h-68" />
            <path className="cyan-line" d="M538 276, h-40" />
            <path className="cyan-line" d="M538 316, h-40" />
            <path className="cyan-line" d="M538 420, h-40" />
            <path className="cyan-line" d="M538 529, h-40" />
            <path className="cyan-line" d="M538 631, h-40" />
            <path className="cyan-line" d="M538 363, h-68" />
            <path className="cyan-line" d="M538 566, h-68" />
            <path className="cyan-line" d="M538 596, h-68" />

            {/*Aircraft Shape*/}
            <path className="white-line" fill="none" d="M365 755 q -20 -40, -20 -95, v-495, q 4 -60, 30 -110, q 25 -44, 50 0, q 27 60, 30 110, v495, q 0 40, -20 95 " />
            <path className="white-line" fill="none" d="M345.5 672 c 15 58, 95 58, 109 0" />
            <path className="white-line" fill="none" d="M348 708 l-50 50" />
            <path className="white-line" fill="none" d="M450 708 l50 50" />
            <path className="white-line" fill="none" d="M345 460 l-125 45" />
            <path className="white-line" fill="none" d="M455 460 l 125 45" />
            <path className="white-line" fill="none" d="M300 335 l-95 65" />
            <path className="white-line" fill="none" d="M150 439 l-95 65" />
            <path className="white-line" fill="none" d="M500 335 l26 18" />
            <path className="white-line" fill="none" d="M567 381 l26 18" />
            <path className="white-line" fill="none" d="M650 439 l95 65" />
        </g>
    );
};