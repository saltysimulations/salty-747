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

import React, { FC, useEffect, useState } from "react";
import { useSimVar } from "react-msfs";

const getAFDSstatusText = (mode: number): string => {
    switch (mode) {
        case 0:
            return "";
        case 1:
            return "FD";
        case 2:
            return "CMD";
        case 3:
            return "LAND 2";
        case 4:
            return "LAND 3";
        case 5:
            return "AUTOLAND";
    }
    return "";
};

const getActiveAutothrottleText = (mode: number, throttleArmed: boolean): string => {
    if (!throttleArmed) {
        return "";
    }
    switch (mode) {
        case 0:
            return "";
        case 1:
            return "THR REF";
        case 2:
            return "THR";
        case 3:
            return "IDLE";
        case 4:
            return "SPD";
        case 5:
            return "HOLD";
    }
    return "";
};

const getActivePitchText = (mode: number): string => {
    switch (mode) {
        case 0:
            return "";
        case 1:
            return "TO/GA";
        case 2:
            return "ALT";
        case 3:
            return "VNAV ALT";
        case 4:
            return "VNAV PTH";
        case 5:
            return "VNAV SPD";
        case 6:
            return "VNAV";
        case 7:
            return "FLCH SPD";
        case 8:
            return "V/S";
        case 9:
            return "G/S";
        case 10:
            return "G/P";
        case 11:
            return "FLARE";
    }
    return "";
};

const getArmedPitchText = (mode: number): string => {
    switch (mode) {
        case 0:
            return "";
        case 1:
            return "G/S";
        case 2:
            return "G/P";
        case 3:
            return "VNAV";
        case 4:
            return "FLARE";
    }
    return "";
};

const getActiveRollText = (mode: number, apOn: boolean, fdOn: boolean): string => {
    if(!apOn && !fdOn) {
        return "";
    }
    switch (mode) {
        case 0:
            return "";
        case 1:
            return "TO/GA";
        case 2:
            return "HDG HOLD";
        case 3:
            return "HDG SEL";
        case 4:
            return "LNAV";
        case 5:
            return "LOC";
        case 6:
            return "FAC";
        case 7:
            return "ROLLOUT";
        case 8:
            return "ATT";
    }
    return "";
};

const getArmedRollText = (mode: number): string => {
    switch (mode) {
        case 0:
            return "";
        case 1:
            return "LOC";
        case 2:
            return "FAC";
        case 3:
            return "LNAV";
        case 4:
            return "ROLLOUT";
    }
    return "";
};

type FMAColumnProps = { x: number; y: number; topText?: string; bottomText?: string; highlightVar?: boolean; highlightVar2?: boolean };
export const FMAColumn: FC<FMAColumnProps> = ({x, y, topText, bottomText, highlightVar, highlightVar2}) => {
    const [showGreenBox, setShowGreenBox] = useState<boolean>(false);

    useEffect(() => {
        if (topText) {
            setShowGreenBox(true);
            const timeout = setTimeout(() => {
                setShowGreenBox(false);
            }, 10000);
            return () => clearTimeout(timeout);
        }
        else {
            setShowGreenBox(false);
        }
    }, [highlightVar, highlightVar2]);

    return (
        <g> 
            <g visibility = {showGreenBox == true ? "visible" : "hidden"}>
                <rect x={x - 65} y={y} width="130" height="27" fill="none" className="black-outline" />
                <rect x={x - 65} y={y} width="130" height="27" fill="none" className="fma-line" />
            </g>
                <text x={x} y={y + 25} className="text-3 green middle">{topText}</text>
                <text x={x} y={y + 48} className="text-2 middle">{bottomText}</text>
        </g>
    );
}

type AFDSstatusProps = { bottomText?: string; highlightVar?: boolean };
export const AFDSstatus: FC<AFDSstatusProps> = ({bottomText, highlightVar}) => {
    const [showGreenBox, setShowGreenBox] = useState<boolean>(false);
    const [showAmberBox, setShowAmberBox] = useState<boolean>(false);

    useEffect(() => {
        if (bottomText) {
            if (bottomText == "AUTOLAND") {
                setShowGreenBox(false);
                setShowAmberBox(true);
                const timeoutAmber = setTimeout(() => {
                    setShowAmberBox(false);
                }, 10000);
                return () => clearTimeout(timeoutAmber);
            }
            setShowAmberBox(false);
            setShowGreenBox(true);
            const timeoutGreen = setTimeout(() => {
                setShowGreenBox(false);
            }, 10000);
            return () => clearTimeout(timeoutGreen);
        }
        else {
            setShowGreenBox(false);
            setShowAmberBox(false);
        }
    }, [highlightVar]);

    return (
        <g> 
            <text x={349} y={170} className={bottomText == "AUTOLAND" ? "text-4 amber middle" : "text-4 green middle"}>{bottomText}</text>
            <text x={349} y={138} visibility = {bottomText == "AUTOLAND" ? "visible" : "hidden"} className={bottomText == "AUTOLAND" ? "text-4 amber middle" : "text-4 green middle"}>NO</text>
            <rect x={267} y={138} visibility = {showGreenBox == true ? "visible" : "hidden"} width="164" height="34" fill="none" className="fma-line" />
            <path d="M 267 138, h59, v-34, h46, v34, h59, v34, h-164, Z" visibility = {showAmberBox == true ? "visible" : "hidden"} className="amber-line" fill="none"/>

        </g>
    );
}

export const FMA: FC = () => {
    const [afdsStatus] = useSimVar("L:74S_AFDS_STATUS", "enum");
    const [fdOn] = useSimVar("AUTOPILOT FLIGHT DIRECTOR ACTIVE", "bool");
    const [apOn] = useSimVar("AUTOPILOT MASTER", "bool");
    const [throttleMode] = useSimVar("L:74S_AUTOTHROTTLE_MODE_ACTIVE", "enum");
    const [throttleArmed] = useSimVar("AUTOPILOT THROTTLE ARM", "bool");
    const [rollModeActive] = useSimVar("L:74S_ROLL_MODE_ACTIVE", "enum");
    const [rollModeArmed] = useSimVar("L:74S_ROLL_MODE_ARMED", "enum");
    const [pitchModeActive] = useSimVar("L:74S_PITCH_MODE_ACTIVE", "enum");
    const [pitchModeArmed] = useSimVar("L:74S_PITCH_MODE_ARMED", "enum");

    return (
        <g>
            <FMAColumn 
            x={208} y={10} 
            topText={getActiveAutothrottleText(throttleMode, throttleArmed)} 
            bottomText=""
            highlightVar={throttleMode}
            highlightVar2={throttleArmed} />

            <FMAColumn 
            x={356} y={10} 
            topText={getActiveRollText(rollModeActive, fdOn, apOn)} 
            bottomText={getArmedRollText(rollModeArmed)}
            highlightVar={rollModeActive}
            highlightVar2={fdOn} />

            <FMAColumn 
            x={505} y={10} 
            topText={getActivePitchText(pitchModeActive)} 
            bottomText={getArmedPitchText(pitchModeArmed)}
            highlightVar={pitchModeActive}
            highlightVar2={fdOn} />

            <AFDSstatus 
            bottomText={getAFDSstatusText(afdsStatus)} 
            highlightVar={afdsStatus} /> 
        </g>
    );
};