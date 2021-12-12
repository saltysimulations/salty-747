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
import { useInteractionEvent } from "react-msfs";

export const FPV: FC = () => {
    const [isFPVon] = useSimVar("L:SALTY_FPV_ON", "bool");
    const [vertVelocity] = useSimVar("VELOCITY WORLD Y", "feet per second");
    const [horizVelocity] = useSimVar("VELOCITY BODY Z", "feet per second");
    const [pitch] = useSimVar("PLANE PITCH DEGREES", "degrees");
    const [roll] = useSimVar("PLANE BANK DEGREES", "degrees");
    const [heading] = useSimVar("PLANE HEADING DEGREES TRUE", "degrees");
    const [track] = useSimVar("GPS GROUND TRUE TRACK", "degrees");
    const [fpv, setFpv] = useSimVar("L:SALTY_FPV_ON", "bool");

    useInteractionEvent("B747_8_PFD_FPV", () => {
        setFpv(!fpv);
    });

    const degreesToPixels = (angle: number): number => (angle < 0 ? Math.max(angle * 8, -16 * 8) : Math.min(angle * 8, 22.5 * 8));

    const vertVecToPixels = (): number => {
        const fpa = 180/Math.PI * Math.asin(vertVelocity / horizVelocity);
        return degreesToPixels(fpa + pitch);
    };

    const trackToPixels = (): number => {
        let driftAngle = heading - track;
        if (driftAngle > 180) {
            driftAngle -= 360;
        } else if (driftAngle < -180) {
            driftAngle += 360;
        }
        if (driftAngle > 0) {
            driftAngle = Math.min(driftAngle, 35);
        }
        else {
            driftAngle = Math.max(driftAngle, -35);
        }
        return degreesToPixels(driftAngle * -0.25);
    };

    return (
        <g  transform={`translate(${trackToPixels() || 0} ${-vertVecToPixels() || 0})`} visibility={isFPVon ? "visible" : "hidden"}>
            <g>
                <g transform={`rotate(${-roll || 0} 349 382)`}>
                    {/* FPV symbol */}
                    <path className="fpv-outline" d="M311 382, h28" />
                    <path className="fpv-outline" d="M359 382, h28" />
                    <path className="fpv-outline" d="M349 372, v-14" />
                    <circle className="fpv-outline" cx="349" cy="382" r="10" stroke="white" fill="none" />
                    <path className="fpv-line" d="M311 382, h28" />
                    <path className="fpv-line" d="M359 382, h28" />
                    <path className="fpv-line" d="M349 372, v-14" />
                    <circle className="fpv-line" cx="349" cy="382" r="10" fill="none" />
                </g>
            </g>
        </g>
    );
};
