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

import React, { FC, useState } from "react";
import { render } from "../Common";
import { useInteractionEvent, useInteractionSimVar, useSimVar } from "react-msfs";

import { ECS } from "./ECS/ECS";
import { DRS } from "./DRS/DRS";
import { ELEC } from "./ELEC/ELEC";
import { HYD } from "./HYD/HYD";

import "./index.scss";

type BlackOutlineWhiteLineProps = { d: string; blackStroke?: number; whiteStroke?: number; color?: string };
export const BlackOutlineWhiteLine: FC<BlackOutlineWhiteLineProps> = ({ d, blackStroke = 4, whiteStroke = 3, color = "white" }) => (
    <>
        <path stroke="black" strokeWidth={blackStroke} strokeLinecap="round" d={d}></path>
        <path stroke={color} strokeWidth={whiteStroke} strokeLinecap="round" d={d}></path>
    </>
);

/*onEvent(_event) {
    var prefix = this.getLowerScreenChangeEventNamePrefix();
    super.onEvent(_event);
    if (this.currentPage !== _event) {
        this.currentPage = _event;
    } 
    else if (_event.substring(0,18) == prefix) {
        this.changePage("BLANK");
        SimVar.SetSimVarValue("L:XMLVAR_EICAS_CURRENT_PAGE", "Enum", -1);
        this.currentPage = "blank";
        return;
    }

    // if the event contains "EICAS_CHANGE_PAGE_{x}", the EICAS will display the page indicated by {x}; e.g. EICAS_CHANGE_PAGE_FUEL shows the fuel page
    if (_event.indexOf(prefix) >= 0) {
        var pageName = _event.replace(prefix, "");
        this.changePage(pageName);
    }
    else {
        // else the event is not a CHANGE_PAGE event, and therefore needs to be passed to the lower screen event handlers
        for (let i = 0; i < this.lowerScreenPages.length; i++) {
            this.lowerScreenPages[i].onEvent(_event);
        }
    }
}*/

/*0: <ENG/>,*/
/*1: <STAT/>,*/
/*3: <FUEL/>,*/
/*4: <ECS/>,*/
/*5: <FCTL/>,*/
/*8: <GEAR/>,*/
/*9: <INFO/>,*/
/*10: <CHKL/>,*/
/*10: <NAV/>,*/
function setCurrentPage(currentPage: number) {
    switch (currentPage) {
        case 2:
            return <ELEC/>;
        case 6:
            return <HYD/>;
        case 7:
            return <DRS/>;
        default:
            return <ELEC/>
    }
}

const LowerEICAS: FC = () => {
    const [currentPage] = useSimVar("L:XMLVAR_EICAS_CURRENT_PAGE", "enum");
    var pageToRender = setCurrentPage(currentPage);

    return (
        <>
            <div className="LcdOverlay" style={{ opacity: "0.2" }} />
            <svg className="pfd-svg" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg"> 
            {pageToRender}
            </svg>
        </>
    );
};

render(<LowerEICAS />);
