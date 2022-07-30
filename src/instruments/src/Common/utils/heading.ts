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

export const getHeadingDelta = (heading1: number, heading2: number): number => {
    let headingDelta = heading1 - heading2;
    if (headingDelta > 180) {
        headingDelta -= 360;
    } else if (headingDelta < -180) {
        headingDelta += 360;
    }
    return headingDelta;
};

export const removeLeadingZeros = (oldString: string): string => {
    let newString = oldString.replace('0', '');
    return newString;
};

export const getDriftAngle = (heading: number, track: number): number => getHeadingDelta(heading, track) * -1;
