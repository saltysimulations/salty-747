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
            this.ILSIdent.setAttribute("font-family", "BoeingEICAS");
            this.ILSIdent.setAttribute("text-anchor", "start");
            this.ILSIdent.setAttribute("alignment-baseline", "central");
            this.InfoGroup.appendChild(this.ILSIdent);
            this.ILSDist = document.createElementNS(Avionics.SVG.NS, "text");
            this.ILSDist.textContent = "";
            this.ILSDist.setAttribute("x", "0");
            this.ILSDist.setAttribute("y", "29");
            this.ILSDist.setAttribute("fill", "white");
            this.ILSDist.setAttribute("font-size", "14");
            this.ILSDist.setAttribute("font-family", "BoeingEICAS");
            this.ILSDist.setAttribute("text-anchor", "start");
            this.ILSDist.setAttribute("alignment-baseline", "central");
            this.InfoGroup.appendChild(this.ILSDist);
            this.ILSOrigin = document.createElementNS(Avionics.SVG.NS, "text");
            this.ILSOrigin.textContent = "ILS";
            this.ILSOrigin.setAttribute("x", "0");
            this.ILSOrigin.setAttribute("y", "50");
            this.ILSOrigin.setAttribute("fill", "white");
            this.ILSOrigin.setAttribute("font-size", "18");
            this.ILSOrigin.setAttribute("font-family", "BoeingEICAS");
            this.ILSOrigin.setAttribute("text-anchor", "start");
            this.ILSOrigin.setAttribute("alignment-baseline", "central");
            this.InfoGroup.appendChild(this.ILSOrigin);
        }
        this.appendChild(this.rootSVG);
    }
    update(_deltaTime) {
        if (this.gsVisible || this.locVisible || this.infoVisible) {
            let localizer = this.gps.radioNav.getBestILSBeacon();
            let isApproachLoaded = Simplane.getAutoPilotApproachLoaded();
            let approachType = Simplane.getAutoPilotApproachType();
            if (this.gs_cursorGroup && this.gsVisible) {
                if (isApproachLoaded && approachType == 10) {
                    let gsi = -SimVar.GetSimVarValue("GPS VERTICAL ERROR", "meters");
                    let delta = 0.5 + (gsi / 150.0) / 2;
                    let y = this.gs_cursorMinY + (this.gs_cursorMaxY - this.gs_cursorMinY) * delta;
                    y = Math.min(this.gs_cursorMinY, Math.max(this.gs_cursorMaxY, y));
                    this.gs_cursorGroup.setAttribute("transform", "translate(" + this.gs_cursorPosX + ", " + y + ")");
                    //Diamond Parked at top
                    if (delta >= 0.95) {
                        this.gs_cursorShapeUp.setAttribute("visibility", "visible");
                        this.gs_cursorShapeUp.setAttribute("fill",  "transparent"); 
                    }
                    //Diamond Parked at bottom
                    else if (delta <= 0.05) {
                        this.gs_cursorShapeUp.setAttribute("visibility", "visible");
                        this.gs_cursorShapeUp.setAttribute("fill",  "transparent"); 
                    }
                    //Diamond in normal range
                    else {
                        this.gs_cursorShapeUp.setAttribute("visibility", "visible");
                        this.gs_cursorShapeUp.setAttribute("fill",  "#D570FF"); 
                    }
                    this.gs_cursorShapeUp.setAttribute("visibility", "hidden");
                }
                else if (localizer && localizer.id > 0 && (SimVar.GetSimVarValue("NAV HAS GLIDE SLOPE:" + localizer.id, "Bool") || (isApproachLoaded && approachType == 4))) {
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
                }
                else {
                    this.gs_cursorShapeUp.setAttribute("visibility", "hidden");
                }
            }
            if (this.loc_cursorGroup && this.locVisible) {
                if ((!isApproachLoaded || approachType != 10) && localizer && localizer.id > 0) {
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
    showLocalizer(_val) {
        this.locVisible = _val;
        if (this.loc_mainGroup){
            if (_val) {
            this.loc_mainGroup.setAttribute("visibility", "visible");
            }
            else {
                this.loc_mainGroup.setAttribute("visibility", "hidden");
                this.loc_cursorShapeRight.removeAttribute("visibility");
            }
        }
    }
    showGlideslope(_val) {
        if (this.gsVisible !== _val) {
            this.gsVisible = _val;
            if (_val) {
                this.gs_mainGroup.setAttribute("visibility", "visible");
            }
            else {
                this.gs_mainGroup.setAttribute("visibility", "hidden");
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