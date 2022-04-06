class Jet_PFD_ILSIndicator extends HTMLElement {
    constructor() {
        super(...arguments);
        this.loc_cursorMinX = 0;
        this.loc_cursorMaxX = 0;
        this.loc_cursorPosX = 0;
        this.loc_cursorPosY = 0;
        this.gs_cursorMinY = 0;
        this.gs_cursorMaxY = 0;
        this.gs_cursorPosX = 0;
        this.gs_cursorPosY = 0;
        this.locVisible = false;
        this.gsVisible = undefined;
        this.infoVisible = false;
        this.isHud = false;
        this._aircraft = Aircraft.A320_NEO;
    }
    static get observedAttributes() {
        return ["hud"];
    }
    get aircraft() {
        return this._aircraft;
    }
    set aircraft(_val) {
        if (this._aircraft != _val) {
            this._aircraft = _val;
            this.construct();
        }
    }
    connectedCallback() {
        this.construct();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "hud":
                this.isHud = newValue == "true";
                break;
        }
    }
    construct() {
        Utils.RemoveAllChildren(this);
        this.InfoGroup = null;
        if (this.aircraft == Aircraft.B747_8) {
            this.construct_B747_8();
        }
        this.showGlideslope(this.gsVisible);
        this.showLocalizer(this.locVisible);
        this.showNavInfo(this.infoVisible);
    }
    construct_B747_8() {
        var posX = 0;
        var posY = 0;
        var width = 500;
        var height = 500;
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        this.rootSVG.setAttribute("id", "ViewBox");
        this.rootSVG.setAttribute("viewBox", "0 0 " + width + " " + height);
        this.centerGroup = document.createElementNS(Avionics.SVG.NS, "g");
        this.centerGroup.setAttribute("id", "ILSGroup");
        this.centerGroup.setAttribute("transform", "translate(35 88) scale(0.75)");
        this.rootSVG.appendChild(this.centerGroup);
        {
            posX = 400;
            posY = 88;
            width = 40;
            height = 280;
            this.gs_mainGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.gs_mainGroup.setAttribute("id", "GlideSlopeGroup");
            {
                this.gs_cursorGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.gs_cursorGroup.setAttribute("id", "CursorGroup");
                this.gs_cursorGroup.setAttribute("transform", "translate(" + this.gs_cursorPosX + ", " + this.gs_cursorPosY + ")");
                this.gs_mainGroup.appendChild(this.gs_cursorGroup);
                {
                    this.gs_cursorShapeUp = document.createElementNS(Avionics.SVG.NS, "path");
                    this.gs_cursorShapeUp.setAttribute("fill", "transparent");
                    this.gs_cursorShapeUp.setAttribute("stroke", "#D570FF");
                    this.gs_cursorShapeUp.setAttribute("stroke-width", "3");
                    this.gs_cursorShapeUp.setAttribute("d", "M -9 0 L0 -15 L 9 0 L0 15 Z");
                    this.gs_cursorGroup.appendChild(this.gs_cursorShapeUp);
                }
                let neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
                neutralLine.setAttribute("id", "NeutralLine");
                neutralLine.setAttribute("x1", (posX + 7).toString());
                neutralLine.setAttribute("y1", (posY + height * 0.5).toString());
                neutralLine.setAttribute("x2", (posX + width - 7).toString());
                neutralLine.setAttribute("y2", (posY + height * 0.5).toString());
                neutralLine.setAttribute("stroke", "white");
                neutralLine.setAttribute("stroke-width", "3");
                this.gs_mainGroup.appendChild(neutralLine);
                let rangeFactor = 0.7;
                let nbCircles = 2;
                this.gs_cursorMinY = posY + (height * 0.5) + ((rangeFactor + 0.22) * height * 0.5);
                this.gs_cursorMaxY = posY + (height * 0.5) - ((rangeFactor + 0.22) * height * 0.5);
                this.gs_cursorPosX = posX + width * 0.5;
                this.gs_cursorPosY = posY + height * 0.5;
                for (let i = 0; i < nbCircles; i++) {
                    let y = posY + (height * 0.5) + ((rangeFactor * height * 0.5) * (i + 1)) / nbCircles;
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    circle.setAttribute("cx", this.gs_cursorPosX.toString());
                    circle.setAttribute("cy", y.toString());
                    circle.setAttribute("r", "5");
                    circle.setAttribute("fill", "none");
                    circle.setAttribute("stroke", "white");
                    circle.setAttribute("stroke-width", "3");
                    this.gs_mainGroup.appendChild(circle);
                    y = posY + (height * 0.5) - ((rangeFactor * height * 0.5) * (i + 1)) / nbCircles;
                    circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    circle.setAttribute("cx", this.gs_cursorPosX.toString());
                    circle.setAttribute("cy", y.toString());
                    circle.setAttribute("r", "5");
                    circle.setAttribute("fill", "none");
                    circle.setAttribute("stroke", "white");
                    circle.setAttribute("stroke-width", "3");
                    this.gs_mainGroup.appendChild(circle);
                }
            }
            this.centerGroup.appendChild(this.gs_mainGroup);
            posX = 110;
            posY = 384;
            width = 280;
            height = 35;
            this.loc_mainGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.loc_mainGroup.setAttribute("id", "LocalizerGroup");
            {
                this.loc_cursorGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.loc_cursorGroup.setAttribute("id", "CursorGroup");
                this.loc_cursorGroup.setAttribute("transform", "translate(" + this.loc_cursorPosX + ", " + this.loc_cursorPosY + ")");
                this.loc_mainGroup.appendChild(this.loc_cursorGroup);
                {
                    this.loc_cursorShapeRight = document.createElementNS(Avionics.SVG.NS, "path");
                    this.loc_cursorShapeRight.setAttribute("fill", "transparent");
                    this.loc_cursorShapeRight.setAttribute("stroke", "#D570FF");
                    this.loc_cursorShapeRight.setAttribute("stroke-width", "3");
                    this.loc_cursorShapeRight.setAttribute("d", "M 0 -9 L-15 0 L0 9 L15 0 Z");
                    this.loc_cursorGroup.appendChild(this.loc_cursorShapeRight);
                }
                let neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
                neutralLine.setAttribute("id", "NeutralLine");
                neutralLine.setAttribute("x1", (posX + width * 0.5).toString());
                neutralLine.setAttribute("y1", (posY + 5).toString());
                neutralLine.setAttribute("x2", (posX + width * 0.5).toString());
                neutralLine.setAttribute("y2", (posY + height - 5).toString());
                neutralLine.setAttribute("stroke", "white");
                neutralLine.setAttribute("stroke-width", "3");
                this.loc_mainGroup.appendChild(neutralLine);
                let rangeFactor = 0.7;
                let nbCircles = 2;
                this.loc_cursorMinX = posX + (width * 0.5) - ((rangeFactor + 0.18) * width * 0.5);
                this.loc_cursorMaxX = posX + (width * 0.5) + ((rangeFactor + 0.18) * width * 0.5);
                this.loc_cursorPosX = posX + width * 0.5;
                this.loc_cursorPosY = posY + height * 0.5;
                for (let i = 0; i < nbCircles; i++) {
                    let x = posX + (width * 0.5) + ((rangeFactor * width * 0.5) * (i + 1)) / nbCircles;
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    circle.setAttribute("cx", x.toString());
                    circle.setAttribute("cy", this.loc_cursorPosY.toString());
                    circle.setAttribute("r", "5");
                    circle.setAttribute("fill", "none");
                    circle.setAttribute("stroke", "white");
                    circle.setAttribute("stroke-width", "3");
                    this.loc_mainGroup.appendChild(circle);
                    x = posX + (width * 0.5) - ((rangeFactor * width * 0.5) * (i + 1)) / nbCircles;
                    circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    circle.setAttribute("cx", x.toString());
                    circle.setAttribute("cy", this.loc_cursorPosY.toString());
                    circle.setAttribute("r", "5");
                    circle.setAttribute("fill", "none");
                    circle.setAttribute("stroke", "white");
                    circle.setAttribute("stroke-width", "3");
                    this.loc_mainGroup.appendChild(circle);
                }
            }
            this.centerGroup.appendChild(this.loc_mainGroup);

            //NPS Vertical Scale
            posX = 400;
            posY = 88;
            width = 40;
            height = 280;
            this.nps_verticalGroup  = document.createElementNS(Avionics.SVG.NS, "g");
            this.nps_verticalGroup.setAttribute("id", "NPSVertGroup");
            {
                this.nps_verticalCursorGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.nps_verticalCursorGroup.setAttribute("id", "CursorGroup");
                this.nps_verticalCursorGroup.setAttribute("transform", "translate(" + this.gs_cursorPosX + ", " + this.gs_cursorPosY + ")");
                this.nps_verticalGroup.appendChild(this.nps_verticalCursorGroup);
                {
                    this.nps_verticalCursor = document.createElementNS(Avionics.SVG.NS, "path");
                    this.nps_verticalCursor.setAttribute("fill", "#D570FF");
                    this.nps_verticalCursor.setAttribute("stroke", "#D570FF");
                    this.nps_verticalCursor.setAttribute("stroke-width", "3");
                    this.nps_verticalCursor.setAttribute("d", "M -6 0 l19 8 l0 -16 Z");
                    this.nps_verticalCursorGroup.appendChild(this.nps_verticalCursor);
                }
                let neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
                neutralLine.setAttribute("id", "NeutralLine");
                neutralLine.setAttribute("x1", (posX + 7).toString());
                neutralLine.setAttribute("y1", (posY + height * 0.5).toString());
                neutralLine.setAttribute("x2", (posX + width - 10).toString());
                neutralLine.setAttribute("y2", (posY + height * 0.5).toString());
                neutralLine.setAttribute("stroke", "white");
                neutralLine.setAttribute("stroke-width", "4");
                this.nps_verticalGroup.appendChild(neutralLine);

                let upperLine = document.createElementNS(Avionics.SVG.NS, "line");
                upperLine.setAttribute("id", "UpperLine");
                upperLine.setAttribute("x1", (posX + 8).toString());
                upperLine.setAttribute("y1", (posY - 90 + height * 0.5).toString());
                upperLine.setAttribute("x2", (posX + width - 19).toString());
                upperLine.setAttribute("y2", (posY - 90 + height * 0.5).toString());
                upperLine.setAttribute("stroke", "white");
                upperLine.setAttribute("stroke-width", "4");
                this.nps_verticalGroup.appendChild(upperLine);

                let lowerLine = document.createElementNS(Avionics.SVG.NS, "line");
                lowerLine.setAttribute("id", "LowerLine");
                lowerLine.setAttribute("x1", (posX + 8).toString());
                lowerLine.setAttribute("y1", (posY + 90 + height * 0.5).toString());
                lowerLine.setAttribute("x2", (posX + width - 19).toString());
                lowerLine.setAttribute("y2", (posY + 90 + height * 0.5).toString());
                lowerLine.setAttribute("stroke", "white");
                lowerLine.setAttribute("stroke-width", "4");
                this.nps_verticalGroup.appendChild(lowerLine);

                this.upperRNPBar = document.createElementNS(Avionics.SVG.NS, "line");
                this.upperRNPBar.setAttribute("id", "UpperLine");
                this.upperRNPBar.setAttribute("x1", (posX + 10).toString());
                this.upperRNPBar.setAttribute("y1", (posY - 100 + height * 0.5).toString());
                this.upperRNPBar.setAttribute("x2", (posX + 10).toString());
                this.upperRNPBar.setAttribute("y2", (posY - 60 + height * 0.5).toString());
                this.upperRNPBar.setAttribute("stroke", "white");
                this.upperRNPBar.setAttribute("stroke-width", "6");
                this.nps_verticalGroup.appendChild(this.upperRNPBar);

                this.lowerRNPBar = document.createElementNS(Avionics.SVG.NS, "line");
                this.lowerRNPBar.setAttribute("id", "LowerLine");
                this.lowerRNPBar.setAttribute("x1", (posX + 10).toString());
                this.lowerRNPBar.setAttribute("y1", (posY + 100 + height * 0.5).toString());
                this.lowerRNPBar.setAttribute("x2", (posX + 10).toString());
                this.lowerRNPBar.setAttribute("y2", (posY + 60 + height * 0.5).toString());
                this.lowerRNPBar.setAttribute("stroke", "white");
                this.lowerRNPBar.setAttribute("stroke-width", "6");
                this.nps_verticalGroup.appendChild(this.lowerRNPBar);
            }
            this.centerGroup.appendChild(this.nps_verticalGroup);
            
            //NPS Lateral Scale
            posX = 110;
            posY = 384;
            width = 280;
            height = 35;
            this.nps_lateralGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.nps_lateralGroup.setAttribute("id", "NPSLatGroup");
            {
                this.nps_lateralCursorGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.nps_lateralCursorGroup.setAttribute("id", "CursorGroup");
                this.nps_lateralCursorGroup.setAttribute("transform", "translate(" + this.loc_cursorPosX + ", " + this.loc_cursorPosY + ")");
                this.nps_lateralGroup.appendChild(this.nps_lateralCursorGroup);
                {
                    this.nps_lateralCursor = document.createElementNS(Avionics.SVG.NS, "path");
                    this.nps_lateralCursor.setAttribute("fill", "#D570FF");
                    this.nps_lateralCursor.setAttribute("stroke", "#D570FF");
                    this.nps_lateralCursor.setAttribute("stroke-width", "3");
                    this.nps_lateralCursor.setAttribute("d", "M 0 -7 L-8 12 L8 12 Z");
                    this.nps_lateralCursorGroup.appendChild(this.nps_lateralCursor);
                }
                let neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
                neutralLine.setAttribute("id", "NeutralLine");
                neutralLine.setAttribute("x1", (posX + width * 0.5).toString());
                neutralLine.setAttribute("y1", (posY + 5).toString());
                neutralLine.setAttribute("x2", (posX + width * 0.5).toString());
                neutralLine.setAttribute("y2", (posY + height - 8).toString());
                neutralLine.setAttribute("stroke", "white");
                neutralLine.setAttribute("stroke-width", "4");
                this.nps_lateralGroup.appendChild(neutralLine);
                let rangeFactor = 0.7;
                this.loc_cursorMinX = posX + (width * 0.5) - ((rangeFactor + 0.18) * width * 0.5);
                this.loc_cursorMaxX = posX + (width * 0.5) + ((rangeFactor + 0.18) * width * 0.5);
                this.loc_cursorPosX = posX + width * 0.5;
                this.loc_cursorPosY = posY + height * 0.5;
                    
                let leftBound = document.createElementNS(Avionics.SVG.NS, "path");
                leftBound.setAttribute("d", "M 317 390 l 30 0 l 0 2 l -5 0 l 0 8 l 0 -8 l -25 0 Z");
                leftBound.setAttribute("fill", "white");
                leftBound.setAttribute("stroke", "white");
                leftBound.setAttribute("stroke-width", "4");
                this.nps_lateralGroup.appendChild(leftBound);

                let rightBound = document.createElementNS(Avionics.SVG.NS, "path");
                rightBound.setAttribute("d", "M 157 390 l 30 0 l 0 2 l -25 0 l 0 8 l 0 -8 l -5 0 Z");
                rightBound.setAttribute("fill", "white");
                rightBound.setAttribute("stroke", "white");
                rightBound.setAttribute("stroke-width", "4");
                this.nps_lateralGroup.appendChild(rightBound);
            }
            this.centerGroup.appendChild(this.nps_lateralGroup);
        }
        this.InfoGroup = document.createElementNS(Avionics.SVG.NS, "g");
        this.InfoGroup.setAttribute("id", "InfoGroup");
        this.InfoGroup.setAttribute("transform", "translate(112 73)");
        this.rootSVG.appendChild(this.InfoGroup);
        {
            this.ILSIdent = document.createElementNS(Avionics.SVG.NS, "text");
            this.ILSIdent.textContent = "";
            this.ILSIdent.setAttribute("x", "0");
            this.ILSIdent.setAttribute("y", "12");
            this.ILSIdent.setAttribute("fill", "white");
            this.ILSIdent.setAttribute("font-size", "14");
            this.ILSIdent.setAttribute("font-family", "BoeingEFIS");
            this.ILSIdent.setAttribute("text-anchor", "start");
            this.ILSIdent.setAttribute("alignment-baseline", "central");
            this.InfoGroup.appendChild(this.ILSIdent);
            this.ILSDist = document.createElementNS(Avionics.SVG.NS, "text");
            this.ILSDist.textContent = "";
            this.ILSDist.setAttribute("x", "0");
            this.ILSDist.setAttribute("y", "29");
            this.ILSDist.setAttribute("fill", "white");
            this.ILSDist.setAttribute("font-size", "14");
            this.ILSDist.setAttribute("font-family", "BoeingEFIS");
            this.ILSDist.setAttribute("text-anchor", "start");
            this.ILSDist.setAttribute("alignment-baseline", "central");
            this.InfoGroup.appendChild(this.ILSDist);
            this.ILSOrigin = document.createElementNS(Avionics.SVG.NS, "text");
            this.ILSOrigin.textContent = "ILS";
            this.ILSOrigin.setAttribute("x", "0");
            this.ILSOrigin.setAttribute("y", "50");
            this.ILSOrigin.setAttribute("fill", "white");
            this.ILSOrigin.setAttribute("font-size", "18");
            this.ILSOrigin.setAttribute("font-family", "BoeingEFIS");
            this.ILSOrigin.setAttribute("text-anchor", "start");
            this.ILSOrigin.setAttribute("alignment-baseline", "central");
            this.InfoGroup.appendChild(this.ILSOrigin);
        }
        this.appendChild(this.rootSVG);
    }
    update(_deltaTime) {
        this.updateNPS();
        if (this.gsVisible || this.locVisible || this.infoVisible) {
            let localizer = this.gps.radioNav.getBestILSBeacon();
            let isApproachLoaded = Simplane.getAutoPilotApproachLoaded();
            let approachType = Simplane.getAutoPilotApproachType();
            if (this.gs_cursorGroup && this.gsVisible) {
                if (isApproachLoaded && (approachType == 10)) {
                    let gsi = -SimVar.GetSimVarValue("GPS VERTICAL ERROR", "meters");
                    let delta = 0.5 + (gsi / 150.0) / 2;
                    let y = this.gs_cursorMinY + (this.gs_cursorMaxY - this.gs_cursorMinY) * delta;
                    y = Math.min(this.gs_cursorMinY, Math.max(this.gs_cursorMaxY, y));
                    this.gs_cursorGroup.setAttribute("transform", "translate(" + this.gs_cursorPosX + ", " + y + ")");
                    //Diamond Parked at top
                    if (delta >= 0.95) {
                        this.gs_cursorShapeUp.setAttribute("fill",  "transparent"); 
                    }
                    //Diamond Parked at bottom
                    else if (delta <= 0.05) {
                        this.gs_cursorShapeUp.setAttribute("fill",  "transparent"); 
                    }
                    //Diamond in normal range
                    else {
                        this.gs_cursorShapeUp.setAttribute("fill",  "#D570FF"); 
                    }
                    this.gs_cursorShapeUp.setAttribute("visibility", "visible");
                }
                else if (localizer && localizer.id > 0 && (SimVar.GetSimVarValue("NAV HAS GLIDE SLOPE:" + localizer.id, "Bool"))) {
                    let gsi = -SimVar.GetSimVarValue("NAV GSI:" + localizer.id, "number") / 127.0;
                    let delta = (gsi + 1.0) * 0.5;
                    let y = this.gs_cursorMinY + (this.gs_cursorMaxY - this.gs_cursorMinY) * delta;
                    y = Math.min(this.gs_cursorMinY, Math.max(this.gs_cursorMaxY, y));
                    this.gs_cursorGroup.setAttribute("transform", "translate(" + this.gs_cursorPosX + ", " + y + ")");
                    if (delta >= 0.95) {
                        this.gs_cursorShapeUp.setAttribute("fill",  "transparent"); 
                    }
                    else if (delta <= 0.05) {
                        this.gs_cursorShapeUp.setAttribute("fill",  "transparent"); 
                    }
                    else {
                        this.gs_cursorShapeUp.setAttribute("fill",  "#D570FF"); 
                    }
                    this.gs_cursorShapeUp.setAttribute("visibility", "visible");
                }
                else {
                    this.gs_cursorShapeUp.setAttribute("visibility", "hidden");
                }
            }
            if (this.loc_cursorGroup && this.locVisible) {
                if (localizer && localizer.id > 0) {
                    let cdi = SimVar.GetSimVarValue("NAV CDI:" + localizer.id, "number") / 127.0;
                    let delta = (cdi + 1.0) * 0.5;
                    let x = this.loc_cursorMinX + (this.loc_cursorMaxX - this.loc_cursorMinX) * delta;
                    x = Math.max(this.loc_cursorMinX, Math.min(this.loc_cursorMaxX, x));
                    this.loc_cursorGroup.setAttribute("transform", "translate(" + x + ", " + this.loc_cursorPosY + ")");
                    if (delta >= 0.95) {
                        this.loc_cursorShapeRight.setAttribute("fill",  "transparent"); 
                    }
                    else if (delta <= 0.05) {
                        this.loc_cursorShapeRight.setAttribute("fill",  "transparent"); 
                    }
                    else {
                        this.loc_cursorShapeRight.setAttribute("fill",  "#D570FF");
                    }
                }
                else {
                    this.loc_cursorShapeRight.setAttribute("visibility", "hidden");
                }
            }
            if (this.InfoGroup && this.infoVisible) {
                if (localizer && localizer.id > 0) {
                    this.InfoGroup.setAttribute("visibility", "visible");
                    if (this.ILSIdent) {
                        this.ILSIdent.textContent = localizer.ident;
                    }
                    else if (this.ILSFreq) {
                        this.ILSIdent.textContent = localizer.freq.toFixed(2);
                    }     
                    if (this.ILSDist)
                        this.ILSDist.textContent = SimVar.GetSimVarValue("NAV HAS DME:" + localizer.id, "Bool") ? "DME " + SimVar.GetSimVarValue("NAV DME:" + localizer.id, "nautical miles").toFixed(1) : "";
                }
                else {
                    this.InfoGroup.setAttribute("visibility", "hidden");
                }
            }
        }
    }
    updateNPS() {
        let latDeviation = SimVar.GetSimVarValue("L:WT_CJ4_XTK", "number");
        let latDeviationCorr = Utils.Clamp(-latDeviation * 300, -92, 92);
        this.nps_lateralCursor.setAttribute("d", "M " + latDeviationCorr + " -7 l-8 19 l16 0 Z");

        if (SimVar.GetSimVarValue("L:AIRLINER_FLIGHT_PHASE", "number") >= 5 && !this.gsVisible && !this.locVisible) {
            this.nps_verticalCursor.setAttribute("visibility", "visible");
            this.lowerRNPBar.setAttribute("visibility", "visible");
            this.upperRNPBar.setAttribute("visibility", "visible");
            let vertDeviation = SimVar.GetSimVarValue("L:WT_CJ4_VPATH_ALT_DEV", "number");
            let vertDeviationCorr = Utils.Clamp(vertDeviation * 2, -92, 92);
            this.nps_verticalCursor.setAttribute("d", "M -6 " + vertDeviationCorr + " l19 8 l0 -16 Z");
        }
        else {
            this.nps_verticalCursor.setAttribute("visibility", "hidden");
            this.lowerRNPBar.setAttribute("visibility", "hidden");
            this.upperRNPBar.setAttribute("visibility", "hidden");
        }


    }
    showLocalizer(_val) {
        this.locVisible = _val;
        if (this.loc_mainGroup){
            if (_val) {
            this.loc_mainGroup.setAttribute("visibility", "visible");
            this.nps_lateralGroup.setAttribute("visibility", "hidden");
            }
            else {
                this.loc_mainGroup.setAttribute("visibility", "hidden");
                this.nps_lateralGroup.setAttribute("visibility", "visible");
                this.loc_cursorShapeRight.removeAttribute("visibility");
            }
        }
    }
    showGlideslope(_val) {
        if (this.gsVisible !== _val) {
            this.gsVisible = _val;
            if (_val) {
                this.gs_mainGroup.setAttribute("visibility", "visible");
                this.nps_verticalGroup.setAttribute("visibility", "hidden");
            }
            else {
                this.gs_mainGroup.setAttribute("visibility", "hidden");
                this.nps_verticalGroup.setAttribute("visibility", "visible");
                this.gs_cursorShapeUp.removeAttribute("visibility");
            }
        }
    }
    showNavInfo(_val) {
        this.infoVisible = _val;
        if (this.InfoGroup) {
            if (_val) {
                this.InfoGroup.setAttribute("visibility", "visible");
            }
            else {
                this.InfoGroup.setAttribute("visibility", "hidden");
            }
        }
    }
}
customElements.define("jet-pfd-ils-indicator", Jet_PFD_ILSIndicator);
//# sourceMappingURL=ILSIndicator.js.map