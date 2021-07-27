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
        if (this.aircraft == Aircraft.CJ4) {
            this.construct_CJ4();
        }
        else if (this.aircraft == Aircraft.B747_8) {
            this.construct_B747_8();
        }
        else if (this.aircraft == Aircraft.AS01B) {
            this.construct_AS01B();
        }
        else if (this.aircraft == Aircraft.AS03D) {
            this.construct_AS03D();
        }
        else {
            this.construct_A320_Neo();
        }
        this.showGlideslope(this.gsVisible);
        this.showLocalizer(this.locVisible);
        this.showNavInfo(this.infoVisible);
    }
    construct_CJ4() {
        var posX = 0;
        var posY = 0;
        var width = 500;
        var height = 500;
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 " + width + " " + height);
        this.centerGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.centerGroup, "id", "ILSGroup");
        diffAndSetAttribute(this.centerGroup, "transform", "translate(82 70) scale(0.65)");
        this.rootSVG.appendChild(this.centerGroup);
        {
            posX = 434;
            posY = 0;
            width = 27;
            height = 275;
            this.gs_mainGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.gs_mainGroup, "id", "GlideSlopeGroup");
            {
                let bg = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(bg, "x", posX + '');
                diffAndSetAttribute(bg, "y", posY + '');
                diffAndSetAttribute(bg, "width", width + '');
                diffAndSetAttribute(bg, "height", height + '');
                diffAndSetAttribute(bg, "fill", "black");
                diffAndSetAttribute(bg, "fill-opacity", "0.3");
                this.gs_mainGroup.appendChild(bg);
                let rangeFactor = 0.85;
                let nbCircles = 2;
                this.gs_cursorMinY = posY + (height * 0.5) + (rangeFactor * height * 0.5);
                this.gs_cursorMaxY = posY + (height * 0.5) - (rangeFactor * height * 0.5);
                this.gs_cursorPosX = posX + width * 0.5;
                this.gs_cursorPosY = posY + height * 0.5;
                for (let i = 0; i < nbCircles; i++) {
                    let y = posY + (height * 0.5) + ((rangeFactor * height * 0.5) * (i + 1)) / nbCircles;
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", this.gs_cursorPosX + '');
                    diffAndSetAttribute(circle, "cy", y + '');
                    diffAndSetAttribute(circle, "r", "5");
                    diffAndSetAttribute(circle, "fill", "none");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    this.gs_mainGroup.appendChild(circle);
                    y = posY + (height * 0.5) - ((rangeFactor * height * 0.5) * (i + 1)) / nbCircles;
                    circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", this.gs_cursorPosX + '');
                    diffAndSetAttribute(circle, "cy", y + '');
                    diffAndSetAttribute(circle, "r", "5");
                    diffAndSetAttribute(circle, "fill", "none");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    this.gs_mainGroup.appendChild(circle);
                }
                this.gs_cursorGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.gs_cursorGroup, "id", "CursorGroup");
                diffAndSetAttribute(this.gs_cursorGroup, "transform", "translate(" + this.gs_cursorPosX + ", " + this.gs_cursorPosY + ")");
                this.gs_mainGroup.appendChild(this.gs_cursorGroup);
                {
                    let x = 12;
                    let y = 20;
                    this.gs_cursorShapeUp = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "fill", "#FF0CE2");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "d", "M " + (-x) + " 0 L0 " + (-y) + " L" + (x) + " 0 Z");
                    this.gs_cursorGroup.appendChild(this.gs_cursorShapeUp);
                    this.gs_cursorShapeDown = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "fill", "#FF0CE2");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "d", "M " + (-x) + " 0 L0 " + (y) + " L" + (x) + " 0 Z");
                    this.gs_cursorGroup.appendChild(this.gs_cursorShapeDown);
                }
                let neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(neutralLine, "id", "NeutralLine");
                diffAndSetAttribute(neutralLine, "x1", (posX + 5) + '');
                diffAndSetAttribute(neutralLine, "y1", (posY + height * 0.5) + '');
                diffAndSetAttribute(neutralLine, "x2", (posX + width - 5) + '');
                diffAndSetAttribute(neutralLine, "y2", (posY + height * 0.5) + '');
                diffAndSetAttribute(neutralLine, "stroke", "white");
                diffAndSetAttribute(neutralLine, "stroke-width", "2");
                this.gs_mainGroup.appendChild(neutralLine);
            }
            this.centerGroup.appendChild(this.gs_mainGroup);
            posX = 114;
            posY = 323;
            width = 275;
            height = 27;
            this.loc_mainGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.loc_mainGroup, "id", "LocalizerGroup");
            {
                let bg = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(bg, "x", posX + '');
                diffAndSetAttribute(bg, "y", posY + '');
                diffAndSetAttribute(bg, "width", width + '');
                diffAndSetAttribute(bg, "height", height + '');
                diffAndSetAttribute(bg, "fill", "black");
                diffAndSetAttribute(bg, "fill-opacity", "0.3");
                this.gs_mainGroup.appendChild(bg);
                let rangeFactor = 0.85;
                let nbCircles = 2;
                this.loc_cursorMinX = posX + (width * 0.5) - (rangeFactor * width * 0.5);
                this.loc_cursorMaxX = posX + (width * 0.5) + (rangeFactor * width * 0.5);
                this.loc_cursorPosX = posX + width * 0.5;
                this.loc_cursorPosY = posY + height * 0.5;
                for (let i = 0; i < nbCircles; i++) {
                    let x = posX + (width * 0.5) + ((rangeFactor * width * 0.5) * (i + 1)) / nbCircles;
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", x + '');
                    diffAndSetAttribute(circle, "cy", this.loc_cursorPosY + '');
                    diffAndSetAttribute(circle, "r", "5");
                    diffAndSetAttribute(circle, "fill", "none");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    this.loc_mainGroup.appendChild(circle);
                    x = posX + (width * 0.5) - ((rangeFactor * width * 0.5) * (i + 1)) / nbCircles;
                    circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", x + '');
                    diffAndSetAttribute(circle, "cy", this.loc_cursorPosY + '');
                    diffAndSetAttribute(circle, "r", "5");
                    diffAndSetAttribute(circle, "fill", "none");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    this.loc_mainGroup.appendChild(circle);
                }
                this.loc_cursorGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.loc_cursorGroup, "id", "CursorGroup");
                diffAndSetAttribute(this.loc_cursorGroup, "transform", "translate(" + this.loc_cursorPosX + ", " + this.loc_cursorPosY + ")");
                this.loc_mainGroup.appendChild(this.loc_cursorGroup);
                {
                    let x = 20;
                    let y = 12;
                    this.loc_cursorShapeRight = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "fill", "#FF0CE2");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "d", "M 0 " + (-y) + " L" + (-x) + " 0 L0 " + (y) + " Z");
                    this.loc_cursorGroup.appendChild(this.loc_cursorShapeRight);
                    this.loc_cursorShapeLeft = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "fill", "#FF0CE2");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "d", "M 0 " + (-y) + " L" + (x) + " 0 L0 " + (y) + " Z");
                    this.loc_cursorGroup.appendChild(this.loc_cursorShapeLeft);
                }
                let neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(neutralLine, "id", "NeutralLine");
                diffAndSetAttribute(neutralLine, "x1", (posX + width * 0.5) + '');
                diffAndSetAttribute(neutralLine, "y1", (posY + 5) + '');
                diffAndSetAttribute(neutralLine, "x2", (posX + width * 0.5) + '');
                diffAndSetAttribute(neutralLine, "y2", (posY + height - 5) + '');
                diffAndSetAttribute(neutralLine, "stroke", "white");
                diffAndSetAttribute(neutralLine, "stroke-width", "2");
                this.loc_mainGroup.appendChild(neutralLine);
            }
            this.centerGroup.appendChild(this.loc_mainGroup);
        }
        this.appendChild(this.rootSVG);
    }
    construct_B747_8() {
        var posX = 0;
        var posY = 0;
        var width = 500;
        var height = 500;
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 " + width + " " + height);
        this.centerGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.centerGroup, "id", "ILSGroup");
        diffAndSetAttribute(this.centerGroup, "transform", "translate(35 88) scale(0.75)");
        this.rootSVG.appendChild(this.centerGroup);
        {
            posX = 418;
            posY = 45;
            width = 40;
            height = 375;
            this.gs_mainGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.gs_mainGroup, "id", "GlideSlopeGroup");
            {
                let neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(neutralLine, "id", "NeutralLine");
                diffAndSetAttribute(neutralLine, "x1", (posX + 5) + '');
                diffAndSetAttribute(neutralLine, "y1", (posY + height * 0.5) + '');
                diffAndSetAttribute(neutralLine, "x2", (posX + width - 5) + '');
                diffAndSetAttribute(neutralLine, "y2", (posY + height * 0.5) + '');
                diffAndSetAttribute(neutralLine, "stroke", "white");
                diffAndSetAttribute(neutralLine, "stroke-width", "2");
                this.gs_mainGroup.appendChild(neutralLine);
                let rangeFactor = 0.7;
                let nbCircles = 2;
                this.gs_cursorMinY = posY + (height * 0.5) + (rangeFactor * height * 0.5);
                this.gs_cursorMaxY = posY + (height * 0.5) - (rangeFactor * height * 0.5);
                this.gs_cursorPosX = posX + width * 0.5;
                this.gs_cursorPosY = posY + height * 0.5;
                for (let i = 0; i < nbCircles; i++) {
                    let y = posY + (height * 0.5) + ((rangeFactor * height * 0.5) * (i + 1)) / nbCircles;
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", this.gs_cursorPosX + '');
                    diffAndSetAttribute(circle, "cy", y + '');
                    diffAndSetAttribute(circle, "r", "5");
                    diffAndSetAttribute(circle, "fill", "none");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    this.gs_mainGroup.appendChild(circle);
                    y = posY + (height * 0.5) - ((rangeFactor * height * 0.5) * (i + 1)) / nbCircles;
                    circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", this.gs_cursorPosX + '');
                    diffAndSetAttribute(circle, "cy", y + '');
                    diffAndSetAttribute(circle, "r", "5");
                    diffAndSetAttribute(circle, "fill", "none");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    this.gs_mainGroup.appendChild(circle);
                }
                this.gs_cursorGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.gs_cursorGroup, "id", "CursorGroup");
                diffAndSetAttribute(this.gs_cursorGroup, "transform", "translate(" + this.gs_cursorPosX + ", " + this.gs_cursorPosY + ")");
                this.gs_mainGroup.appendChild(this.gs_cursorGroup);
                {
                    let x = 12;
                    let y = 20;
                    this.gs_cursorShapeUp = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "fill", "transparent");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "stroke-width", "2");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "d", "M " + (-x) + " 0 L0 " + (-y) + " L" + (x) + " 0");
                    this.gs_cursorGroup.appendChild(this.gs_cursorShapeUp);
                    this.gs_cursorShapeDown = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "fill", "transparent");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "stroke-width", "2");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "d", "M " + (-x) + " 0 L0 " + (y) + " L" + (x) + " 0");
                    this.gs_cursorGroup.appendChild(this.gs_cursorShapeDown);
                    this.gs_glidePathCursorUp = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "fill", "transparent");
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "stroke-width", "2");
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "d", "M " + (-x) + " 0 L" + (-x) + " " + (-y / 2) + " L" + (x) + " " + (-y / 2) + " L " + (x) + " 0");
                    this.gs_cursorGroup.appendChild(this.gs_glidePathCursorUp);
                    this.gs_glidePathCursorDown = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "fill", "transparent");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "stroke-width", "2");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "d", "M " + (-x) + " 0 L" + (-x) + " " + (y / 2) + " L" + (x) + " " + (y / 2) + " L " + (x) + " 0");
                    this.gs_cursorGroup.appendChild(this.gs_glidePathCursorDown);
                }
            }
            this.centerGroup.appendChild(this.gs_mainGroup);
            posX = 69;
            posY = 413;
            width = 375;
            height = 35;
            this.loc_mainGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.loc_mainGroup, "id", "LocalizerGroup");
            {
                let neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(neutralLine, "id", "NeutralLine");
                diffAndSetAttribute(neutralLine, "x1", (posX + width * 0.5) + '');
                diffAndSetAttribute(neutralLine, "y1", (posY + 5) + '');
                diffAndSetAttribute(neutralLine, "x2", (posX + width * 0.5) + '');
                diffAndSetAttribute(neutralLine, "y2", (posY + height - 5) + '');
                diffAndSetAttribute(neutralLine, "stroke", "white");
                diffAndSetAttribute(neutralLine, "stroke-width", "2");
                this.loc_mainGroup.appendChild(neutralLine);
                let rangeFactor = 0.7;
                let nbCircles = 2;
                this.loc_cursorMinX = posX + (width * 0.5) - (rangeFactor * width * 0.5);
                this.loc_cursorMaxX = posX + (width * 0.5) + (rangeFactor * width * 0.5);
                this.loc_cursorPosX = posX + width * 0.5;
                this.loc_cursorPosY = posY + height * 0.5;
                for (let i = 0; i < nbCircles; i++) {
                    let x = posX + (width * 0.5) + ((rangeFactor * width * 0.5) * (i + 1)) / nbCircles;
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", x + '');
                    diffAndSetAttribute(circle, "cy", this.loc_cursorPosY + '');
                    diffAndSetAttribute(circle, "r", "5");
                    diffAndSetAttribute(circle, "fill", "none");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    this.loc_mainGroup.appendChild(circle);
                    x = posX + (width * 0.5) - ((rangeFactor * width * 0.5) * (i + 1)) / nbCircles;
                    circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", x + '');
                    diffAndSetAttribute(circle, "cy", this.loc_cursorPosY + '');
                    diffAndSetAttribute(circle, "r", "5");
                    diffAndSetAttribute(circle, "fill", "none");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    this.loc_mainGroup.appendChild(circle);
                }
                this.loc_cursorGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.loc_cursorGroup, "id", "CursorGroup");
                diffAndSetAttribute(this.loc_cursorGroup, "transform", "translate(" + this.loc_cursorPosX + ", " + this.loc_cursorPosY + ")");
                this.loc_mainGroup.appendChild(this.loc_cursorGroup);
                {
                    let x = 20;
                    let y = 12;
                    this.loc_cursorShapeRight = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "fill", "transparent");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "stroke-width", "2");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "d", "M 0 " + (-y) + " L" + (-x) + " 0 L0 " + (y));
                    this.loc_cursorGroup.appendChild(this.loc_cursorShapeRight);
                    this.loc_cursorShapeLeft = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "fill", "transparent");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "stroke-width", "2");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "d", "M 0 " + (-y) + " L" + (x) + " 0 L0 " + (y));
                    this.loc_cursorGroup.appendChild(this.loc_cursorShapeLeft);
                }
            }
            this.centerGroup.appendChild(this.loc_mainGroup);
        }
        this.InfoGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.InfoGroup, "id", "InfoGroup");
        diffAndSetAttribute(this.InfoGroup, "transform", "translate(112 73)");
        this.rootSVG.appendChild(this.InfoGroup);
        {
            this.ILSIdent = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.ILSIdent, "ILS");
            diffAndSetAttribute(this.ILSIdent, "x", "0");
            diffAndSetAttribute(this.ILSIdent, "y", "0");
            diffAndSetAttribute(this.ILSIdent, "fill", "white");
            diffAndSetAttribute(this.ILSIdent, "font-size", "10");
            diffAndSetAttribute(this.ILSIdent, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.ILSIdent, "text-anchor", "start");
            diffAndSetAttribute(this.ILSIdent, "alignment-baseline", "central");
            this.InfoGroup.appendChild(this.ILSIdent);
            this.ILSFreq = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.ILSFreq, "109.50");
            diffAndSetAttribute(this.ILSFreq, "x", "0");
            diffAndSetAttribute(this.ILSFreq, "y", "10");
            diffAndSetAttribute(this.ILSFreq, "fill", "white");
            diffAndSetAttribute(this.ILSFreq, "font-size", "10");
            diffAndSetAttribute(this.ILSFreq, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.ILSFreq, "text-anchor", "start");
            diffAndSetAttribute(this.ILSFreq, "alignment-baseline", "central");
            this.InfoGroup.appendChild(this.ILSFreq);
            this.ILSDist = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.ILSDist, "109 NM");
            diffAndSetAttribute(this.ILSDist, "x", "0");
            diffAndSetAttribute(this.ILSDist, "y", "20");
            diffAndSetAttribute(this.ILSDist, "fill", "white");
            diffAndSetAttribute(this.ILSDist, "font-size", "10");
            diffAndSetAttribute(this.ILSDist, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.ILSDist, "text-anchor", "start");
            diffAndSetAttribute(this.ILSDist, "alignment-baseline", "central");
            this.InfoGroup.appendChild(this.ILSDist);
            this.ILSOrigin = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.ILSOrigin, "ILS/FMC");
            diffAndSetAttribute(this.ILSOrigin, "x", "0");
            diffAndSetAttribute(this.ILSOrigin, "y", "30");
            diffAndSetAttribute(this.ILSOrigin, "fill", "white");
            diffAndSetAttribute(this.ILSOrigin, "font-size", "13");
            diffAndSetAttribute(this.ILSOrigin, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.ILSOrigin, "text-anchor", "start");
            diffAndSetAttribute(this.ILSOrigin, "alignment-baseline", "central");
            this.InfoGroup.appendChild(this.ILSOrigin);
        }
        this.appendChild(this.rootSVG);
    }
    construct_AS01B() {
        var posX = 0;
        var posY = 0;
        var width = 500;
        var height = 500;
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 " + width + " " + height);
        this.centerGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.centerGroup, "id", "ILSGroup");
        diffAndSetAttribute(this.centerGroup, "transform", "translate(100 80) scale(0.6)");
        this.rootSVG.appendChild(this.centerGroup);
        {
            posX = (this.isHud) ? 500 : 405;
            posY = (this.isHud) ? 152 : 52;
            width = 35;
            height = 275;
            this.gs_mainGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.gs_mainGroup, "id", "GlideSlopeGroup");
            {
                if (!this.isHud) {
                    let bg = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(bg, "x", posX + '');
                    diffAndSetAttribute(bg, "y", posY + '');
                    diffAndSetAttribute(bg, "width", width + '');
                    diffAndSetAttribute(bg, "height", height + '');
                    diffAndSetAttribute(bg, "fill", "black");
                    diffAndSetAttribute(bg, "fill-opacity", "0.3");
                    this.gs_mainGroup.appendChild(bg);
                }
                let rangeFactor = 0.85;
                let nbCircles = 2;
                this.gs_cursorMinY = posY + (height * 0.5) + (rangeFactor * height * 0.5);
                this.gs_cursorMaxY = posY + (height * 0.5) - (rangeFactor * height * 0.5);
                this.gs_cursorPosX = posX + width * 0.5;
                this.gs_cursorPosY = posY + height * 0.5;
                for (let i = 0; i < nbCircles; i++) {
                    let y = posY + (height * 0.5) + ((rangeFactor * height * 0.5) * (i + 1)) / nbCircles;
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", this.gs_cursorPosX + '');
                    diffAndSetAttribute(circle, "cy", y + '');
                    diffAndSetAttribute(circle, "r", "5");
                    diffAndSetAttribute(circle, "fill", "none");
                    diffAndSetAttribute(circle, "stroke", (this.isHud) ? "lime" : "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    this.gs_mainGroup.appendChild(circle);
                    y = posY + (height * 0.5) - ((rangeFactor * height * 0.5) * (i + 1)) / nbCircles;
                    circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", this.gs_cursorPosX + '');
                    diffAndSetAttribute(circle, "cy", y + '');
                    diffAndSetAttribute(circle, "r", "5");
                    diffAndSetAttribute(circle, "fill", "none");
                    diffAndSetAttribute(circle, "stroke", (this.isHud) ? "lime" : "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    this.gs_mainGroup.appendChild(circle);
                }
                this.gs_cursorGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.gs_cursorGroup, "id", "CursorGroup");
                diffAndSetAttribute(this.gs_cursorGroup, "transform", "translate(" + this.gs_cursorPosX + ", " + this.gs_cursorPosY + ")");
                this.gs_mainGroup.appendChild(this.gs_cursorGroup);
                {
                    let x = 12;
                    let y = 20;
                    this.gs_cursorShapeUp = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "fill", (this.isHud) ? "lime" : "#FF0CE2");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "stroke", (this.isHud) ? "lime" : "#FF0CE2");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "stroke-width", "2");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "d", "M " + (-x) + " 0.25 L0 " + (-y) + " L" + (x) + " 0.25");
                    this.gs_cursorGroup.appendChild(this.gs_cursorShapeUp);
                    this.gs_cursorShapeDown = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "fill", (this.isHud) ? "lime" : "#FF0CE2");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "stroke", (this.isHud) ? "lime" : "#FF0CE2");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "stroke-width", "2");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "d", "M " + (-x) + " -0.25 L0 " + (y) + " L" + (x) + " -0.25");
                    this.gs_cursorGroup.appendChild(this.gs_cursorShapeDown);
                    this.gs_glidePathCursorUp = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "fill", (this.isHud) ? "lime" : "#FF0CE2");
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "stroke", (this.isHud) ? "lime" : "#FF0CE2");
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "stroke-width", "2");
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "d", "M " + (-x) + " 0.25 L" + (-x) + " " + (-y / 2) + " L" + (x) + " " + (-y / 2) + " L " + (x) + " 0.25");
                    this.gs_cursorGroup.appendChild(this.gs_glidePathCursorUp);
                    this.gs_glidePathCursorDown = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "fill", (this.isHud) ? "lime" : "#FF0CE2");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "stroke", (this.isHud) ? "lime" : "#FF0CE2");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "stroke-width", "2");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "d", "M " + (-x) + " -0.25 L" + (-x) + " " + (y / 2) + " L" + (x) + " " + (y / 2) + " L " + (x) + " -0.25");
                    this.gs_cursorGroup.appendChild(this.gs_glidePathCursorDown);
                }
                let neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(neutralLine, "id", "NeutralLine");
                diffAndSetAttribute(neutralLine, "x1", (posX + 5) + '');
                diffAndSetAttribute(neutralLine, "y1", (posY + height * 0.5) + '');
                diffAndSetAttribute(neutralLine, "x2", (posX + width - 5) + '');
                diffAndSetAttribute(neutralLine, "y2", (posY + height * 0.5) + '');
                diffAndSetAttribute(neutralLine, "stroke", (this.isHud) ? "lime" : "white");
                diffAndSetAttribute(neutralLine, "stroke-width", "2");
                this.gs_mainGroup.appendChild(neutralLine);
            }
            this.centerGroup.appendChild(this.gs_mainGroup);
            posX = 112;
            posY = 435;
            width = 275;
            height = 35;
            this.loc_mainGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.loc_mainGroup, "id", "LocalizerGroup");
            {
                if (!this.isHud) {
                    let bg = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(bg, "x", posX + '');
                    diffAndSetAttribute(bg, "y", posY + '');
                    diffAndSetAttribute(bg, "width", width + '');
                    diffAndSetAttribute(bg, "height", height + '');
                    diffAndSetAttribute(bg, "fill", "black");
                    diffAndSetAttribute(bg, "fill-opacity", "0.3");
                    this.gs_mainGroup.appendChild(bg);
                }
                let rangeFactor = 0.85;
                let nbCircles = 2;
                this.loc_cursorMinX = posX + (width * 0.5) - (rangeFactor * width * 0.5);
                this.loc_cursorMaxX = posX + (width * 0.5) + (rangeFactor * width * 0.5);
                this.loc_cursorPosX = posX + width * 0.5;
                this.loc_cursorPosY = posY + height * 0.5;
                for (let i = 0; i < nbCircles; i++) {
                    let x = posX + (width * 0.5) + ((rangeFactor * width * 0.5) * (i + 1)) / nbCircles;
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", x + '');
                    diffAndSetAttribute(circle, "cy", this.loc_cursorPosY + '');
                    diffAndSetAttribute(circle, "r", "5");
                    diffAndSetAttribute(circle, "fill", "none");
                    diffAndSetAttribute(circle, "stroke", (this.isHud) ? "lime" : "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    this.loc_mainGroup.appendChild(circle);
                    x = posX + (width * 0.5) - ((rangeFactor * width * 0.5) * (i + 1)) / nbCircles;
                    circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", x + '');
                    diffAndSetAttribute(circle, "cy", this.loc_cursorPosY + '');
                    diffAndSetAttribute(circle, "r", "5");
                    diffAndSetAttribute(circle, "fill", "none");
                    diffAndSetAttribute(circle, "stroke", (this.isHud) ? "lime" : "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    this.loc_mainGroup.appendChild(circle);
                }
                this.loc_cursorGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.loc_cursorGroup, "id", "CursorGroup");
                diffAndSetAttribute(this.loc_cursorGroup, "transform", "translate(" + this.loc_cursorPosX + ", " + this.loc_cursorPosY + ")");
                this.loc_mainGroup.appendChild(this.loc_cursorGroup);
                {
                    let x = 20;
                    let y = 12;
                    this.loc_cursorShapeRight = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "fill", (this.isHud) ? "lime" : "#FF0CE2");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "stroke", (this.isHud) ? "lime" : "#FF0CE2");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "stroke-width", "2");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "d", "M 0 " + (-y) + " L" + (-x) + " 0 L0 " + (y));
                    this.loc_cursorGroup.appendChild(this.loc_cursorShapeRight);
                    this.loc_cursorShapeLeft = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "fill", (this.isHud) ? "lime" : "#FF0CE2");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "stroke", (this.isHud) ? "lime" : "#FF0CE2");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "stroke-width", "2");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "d", "M 0 " + (-y) + " L" + (x) + " 0 L0 " + (y));
                    this.loc_cursorGroup.appendChild(this.loc_cursorShapeLeft);
                }
                let neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(neutralLine, "id", "NeutralLine");
                diffAndSetAttribute(neutralLine, "x1", (posX + width * 0.5) + '');
                diffAndSetAttribute(neutralLine, "y1", (posY + 5) + '');
                diffAndSetAttribute(neutralLine, "x2", (posX + width * 0.5) + '');
                diffAndSetAttribute(neutralLine, "y2", (posY + height - 5) + '');
                diffAndSetAttribute(neutralLine, "stroke", (this.isHud) ? "lime" : "white");
                diffAndSetAttribute(neutralLine, "stroke-width", "2");
                this.loc_mainGroup.appendChild(neutralLine);
            }
            this.centerGroup.appendChild(this.loc_mainGroup);
        }
        this.InfoGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.InfoGroup, "id", "InfoGroup");
        diffAndSetAttribute(this.InfoGroup, "transform", "translate(150 50)");
        this.rootSVG.appendChild(this.InfoGroup);
        {
            this.ILSIdent = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.ILSIdent, "ILS");
            diffAndSetAttribute(this.ILSIdent, "x", "0");
            diffAndSetAttribute(this.ILSIdent, "y", "0");
            diffAndSetAttribute(this.ILSIdent, "fill", (this.isHud) ? "lime" : "white");
            diffAndSetAttribute(this.ILSIdent, "font-size", "10");
            diffAndSetAttribute(this.ILSIdent, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.ILSIdent, "text-anchor", "start");
            diffAndSetAttribute(this.ILSIdent, "alignment-baseline", "central");
            this.InfoGroup.appendChild(this.ILSIdent);
            this.ILSFreq = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.ILSFreq, "109.50");
            diffAndSetAttribute(this.ILSFreq, "x", "0");
            diffAndSetAttribute(this.ILSFreq, "y", "10");
            diffAndSetAttribute(this.ILSFreq, "fill", (this.isHud) ? "lime" : "white");
            diffAndSetAttribute(this.ILSFreq, "font-size", "10");
            diffAndSetAttribute(this.ILSFreq, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.ILSFreq, "text-anchor", "start");
            diffAndSetAttribute(this.ILSFreq, "alignment-baseline", "central");
            this.InfoGroup.appendChild(this.ILSFreq);
            this.ILSDist = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.ILSDist, "109 NM");
            diffAndSetAttribute(this.ILSDist, "x", "0");
            diffAndSetAttribute(this.ILSDist, "y", "20");
            diffAndSetAttribute(this.ILSDist, "fill", (this.isHud) ? "lime" : "white");
            diffAndSetAttribute(this.ILSDist, "font-size", "10");
            diffAndSetAttribute(this.ILSDist, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.ILSDist, "text-anchor", "start");
            diffAndSetAttribute(this.ILSDist, "alignment-baseline", "central");
            this.InfoGroup.appendChild(this.ILSDist);
            this.ILSOrigin = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.ILSOrigin, "ILS/FMC");
            diffAndSetAttribute(this.ILSOrigin, "x", "0");
            diffAndSetAttribute(this.ILSOrigin, "y", "40");
            diffAndSetAttribute(this.ILSOrigin, "fill", (this.isHud) ? "lime" : "white");
            diffAndSetAttribute(this.ILSOrigin, "font-size", "13");
            diffAndSetAttribute(this.ILSOrigin, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.ILSOrigin, "text-anchor", "start");
            diffAndSetAttribute(this.ILSOrigin, "alignment-baseline", "central");
            this.InfoGroup.appendChild(this.ILSOrigin);
        }
        this.appendChild(this.rootSVG);
    }
    construct_AS03D() {
        let posX = 0;
        let posY = 0;
        let width = 525;
        let height = 250;
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 " + width + " " + height);
        this.centerGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.centerGroup, "id", "ILSGroup");
        this.rootSVG.appendChild(this.centerGroup);
        {
            {
                let _posX = posX + 475;
                let _posY = posY + 50;
                let _width = 25;
                let _height = 150;
                let rangeFactor = 0.85;
                let nbCircles = 2;
                this.gs_cursorMinY = _posY + (_height * 0.5) + (rangeFactor * _height * 0.5);
                this.gs_cursorMaxY = _posY + (_height * 0.5) - (rangeFactor * _height * 0.5);
                this.gs_cursorPosX = _posX + _width * 0.5;
                this.gs_cursorPosY = _posY + _height * 0.5;
                this.gs_mainGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.gs_mainGroup, "id", "GlideSlopeGroup");
                {
                    let bg = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(bg, "x", _posX + '');
                    diffAndSetAttribute(bg, "y", _posY + '');
                    diffAndSetAttribute(bg, "width", _width + '');
                    diffAndSetAttribute(bg, "height", _height + '');
                    diffAndSetAttribute(bg, "fill", "black");
                    diffAndSetAttribute(bg, "fill-opacity", "0.3");
                    this.gs_mainGroup.appendChild(bg);
                }
                {
                    for (let i = 0; i < nbCircles; i++) {
                        for (let j = 0; j < 2; j++) {
                            let y = _posY + (_height * 0.5);
                            if (j % 2 == 0)
                                y += (((rangeFactor * _height * 0.5) * (i + 1)) / nbCircles);
                            else
                                y -= (((rangeFactor * _height * 0.5) * (i + 1)) / nbCircles);
                            let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                            diffAndSetAttribute(circle, "cx", this.gs_cursorPosX + '');
                            diffAndSetAttribute(circle, "cy", y + '');
                            diffAndSetAttribute(circle, "r", "5");
                            diffAndSetAttribute(circle, "fill", "none");
                            diffAndSetAttribute(circle, "stroke", "white");
                            diffAndSetAttribute(circle, "stroke-width", "2");
                            this.gs_mainGroup.appendChild(circle);
                        }
                    }
                }
                {
                    this.gs_cursorGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(this.gs_cursorGroup, "id", "CursorGroup");
                    diffAndSetAttribute(this.gs_cursorGroup, "transform", "translate(" + this.gs_cursorPosX + ", " + this.gs_cursorPosY + ")");
                    let x = 8;
                    let y = 14;
                    this.gs_cursorShapeUp = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "fill", "#FF0CE2");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "stroke-width", "2");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "d", "M " + (-x) + " 0.25 L0 " + (-y) + " L" + (x) + " 0.25");
                    this.gs_cursorGroup.appendChild(this.gs_cursorShapeUp);
                    this.gs_cursorShapeDown = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "fill", "#FF0CE2");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "stroke-width", "2");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "d", "M " + (-x) + " -0.25 L0 " + (y) + " L" + (x) + " -0.25");
                    this.gs_cursorGroup.appendChild(this.gs_cursorShapeDown);
                    this.gs_glidePathCursorUp = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "fill", "#FF0CE2");
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "stroke-width", "2");
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "d", "M " + (-x) + " 0.25 L" + (-x) + " " + (-y / 2) + " L" + (x) + " " + (-y / 2) + " L " + (x) + " 0.25");
                    this.gs_cursorGroup.appendChild(this.gs_glidePathCursorUp);
                    this.gs_glidePathCursorDown = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "fill", "#FF0CE2");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "stroke-width", "2");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "d", "M " + (-x) + " -0.25 L" + (-x) + " " + (y / 2) + " L" + (x) + " " + (y / 2) + " L " + (x) + " -0.25");
                    this.gs_cursorGroup.appendChild(this.gs_glidePathCursorDown);
                    this.gs_mainGroup.appendChild(this.gs_cursorGroup);
                }
                {
                    let neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
                    diffAndSetAttribute(neutralLine, "id", "NeutralLine");
                    diffAndSetAttribute(neutralLine, "x1", (_posX + 5) + '');
                    diffAndSetAttribute(neutralLine, "y1", (_posY + _height * 0.5) + '');
                    diffAndSetAttribute(neutralLine, "x2", (_posX + _width - 5) + '');
                    diffAndSetAttribute(neutralLine, "y2", (_posY + _height * 0.5) + '');
                    diffAndSetAttribute(neutralLine, "stroke", "white");
                    diffAndSetAttribute(neutralLine, "stroke-width", "2");
                    this.gs_mainGroup.appendChild(neutralLine);
                }
                this.centerGroup.appendChild(this.gs_mainGroup);
            }
            {
                let _width = width * 0.4;
                let _height = 25;
                let _posX = posX + width / 2 - _width / 2;
                let _posY = 10;
                this.loc_mainGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.loc_mainGroup, "id", "LocalizerGroup");
                {
                    let bg = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(bg, "x", _posX + '');
                    diffAndSetAttribute(bg, "y", _posY + '');
                    diffAndSetAttribute(bg, "width", _width + '');
                    diffAndSetAttribute(bg, "height", _height + '');
                    diffAndSetAttribute(bg, "fill", "black");
                    diffAndSetAttribute(bg, "fill-opacity", "0.3");
                    this.loc_mainGroup.appendChild(bg);
                }
                {
                    let rangeFactor = 0.85;
                    let nbCircles = 2;
                    this.loc_cursorMinX = _posX + (_width * 0.5) - (rangeFactor * _width * 0.5);
                    this.loc_cursorMaxX = _posX + (_width * 0.5) + (rangeFactor * _width * 0.5);
                    this.loc_cursorPosX = _posX + _width * 0.5;
                    this.loc_cursorPosY = _posY + _height * 0.5;
                    for (let i = 0; i < nbCircles; i++) {
                        for (let j = 0; j < 2; j++) {
                            let x = _posX + (_width * 0.5);
                            if (j % 2 == 0)
                                x += (((rangeFactor * _width * 0.5) * (i + 1)) / nbCircles);
                            else
                                x -= (((rangeFactor * _width * 0.5) * (i + 1)) / nbCircles);
                            let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                            diffAndSetAttribute(circle, "cx", x + '');
                            diffAndSetAttribute(circle, "cy", this.loc_cursorPosY + '');
                            diffAndSetAttribute(circle, "r", "5");
                            diffAndSetAttribute(circle, "fill", "none");
                            diffAndSetAttribute(circle, "stroke", "white");
                            diffAndSetAttribute(circle, "stroke-width", "2");
                            this.loc_mainGroup.appendChild(circle);
                        }
                    }
                }
                {
                    this.loc_cursorGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(this.loc_cursorGroup, "id", "CursorGroup");
                    diffAndSetAttribute(this.loc_cursorGroup, "transform", "translate(" + this.loc_cursorPosX + ", " + this.loc_cursorPosY + ")");
                    this.loc_mainGroup.appendChild(this.loc_cursorGroup);
                    let x = 14;
                    let y = 8;
                    this.loc_cursorShapeRight = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "fill", "#FF0CE2");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "stroke-width", "2");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "d", "M 0.25 " + (-y) + " L" + (-x) + " 0 L0.25 " + (y));
                    this.loc_cursorGroup.appendChild(this.loc_cursorShapeRight);
                    this.loc_cursorShapeLeft = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "fill", "#FF0CE2");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "stroke-width", "2");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "d", "M -0.25 " + (-y) + " L" + (x) + " 0 L-0.25 " + (y));
                    this.loc_cursorGroup.appendChild(this.loc_cursorShapeLeft);
                }
                {
                    let neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
                    diffAndSetAttribute(neutralLine, "id", "NeutralLine");
                    diffAndSetAttribute(neutralLine, "x1", (_posX + _width * 0.5) + '');
                    diffAndSetAttribute(neutralLine, "y1", (_posY + 5) + '');
                    diffAndSetAttribute(neutralLine, "x2", (_posX + _width * 0.5) + '');
                    diffAndSetAttribute(neutralLine, "y2", (_posY + _height - 5) + '');
                    diffAndSetAttribute(neutralLine, "stroke", "white");
                    diffAndSetAttribute(neutralLine, "stroke-width", "2");
                    this.loc_mainGroup.appendChild(neutralLine);
                }
                this.centerGroup.appendChild(this.loc_mainGroup);
            }
        }
        this.appendChild(this.rootSVG);
    }
    construct_A320_Neo() {
        var posX = 0;
        var posY = 0;
        var width = 500;
        var height = 500;
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 " + width + " " + height);
        this.centerGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.centerGroup, "id", "ILSGroup");
        diffAndSetAttribute(this.centerGroup, "transform", "translate(35 88) scale(0.75)");
        this.rootSVG.appendChild(this.centerGroup);
        {
            posX = 407;
            posY = 35;
            width = 40;
            height = 375;
            this.neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(this.neutralLine, "id", "NeutralLine");
            diffAndSetAttribute(this.neutralLine, "x1", posX + '');
            diffAndSetAttribute(this.neutralLine, "y1", (posY + height * 0.5) + '');
            diffAndSetAttribute(this.neutralLine, "x2", (posX + width) + '');
            diffAndSetAttribute(this.neutralLine, "y2", (posY + height * 0.5) + '');
            diffAndSetAttribute(this.neutralLine, "stroke", "yellow");
            diffAndSetAttribute(this.neutralLine, "stroke-width", "5");
            this.centerGroup.appendChild(this.neutralLine);
            this.gs_mainGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.gs_mainGroup, "id", "GlideSlopeGroup");
            {
                let rangeFactor = 0.7;
                let nbCircles = 2;
                this.gs_cursorMinY = posY + (height * 0.5) + (rangeFactor * height * 0.5);
                this.gs_cursorMaxY = posY + (height * 0.5) - (rangeFactor * height * 0.5);
                this.gs_cursorPosX = posX + width * 0.5;
                this.gs_cursorPosY = posY + height * 0.5;
                for (let i = 0; i < nbCircles; i++) {
                    let y = posY + (height * 0.5) + ((rangeFactor * height * 0.5) * (i + 1)) / nbCircles;
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", this.gs_cursorPosX + '');
                    diffAndSetAttribute(circle, "cy", y + '');
                    diffAndSetAttribute(circle, "r", "5");
                    diffAndSetAttribute(circle, "fill", "none");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    this.gs_mainGroup.appendChild(circle);
                    y = posY + (height * 0.5) - ((rangeFactor * height * 0.5) * (i + 1)) / nbCircles;
                    circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", this.gs_cursorPosX + '');
                    diffAndSetAttribute(circle, "cy", y + '');
                    diffAndSetAttribute(circle, "r", "5");
                    diffAndSetAttribute(circle, "fill", "none");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    this.gs_mainGroup.appendChild(circle);
                }
                this.gs_cursorGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.gs_cursorGroup, "id", "CursorGroup");
                diffAndSetAttribute(this.gs_cursorGroup, "transform", "translate(" + this.gs_cursorPosX + ", " + this.gs_cursorPosY + ")");
                this.gs_mainGroup.appendChild(this.gs_cursorGroup);
                {
                    let x = 12;
                    let y = 20;
                    this.gs_cursorShapeUp = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "fill", "transparent");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "stroke-width", "2");
                    diffAndSetAttribute(this.gs_cursorShapeUp, "d", "M " + (-x) + " 0 L0 " + (-y) + " L" + (x) + " 0");
                    this.gs_cursorGroup.appendChild(this.gs_cursorShapeUp);
                    this.gs_cursorShapeDown = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "fill", "transparent");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "stroke-width", "2");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "d", "M " + (-x) + " 0 L0 " + (y) + " L" + (x) + " 0");
                    this.gs_cursorGroup.appendChild(this.gs_cursorShapeDown);
                    this.gs_glidePathCursorUp = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "fill", "transparent");
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "stroke-width", "2");
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "d", "M " + (-x) + " 0 L" + (-x) + " " + (-y / 2) + " L" + (x) + " " + (-y / 2) + " L " + (x) + " 0");
                    this.gs_cursorGroup.appendChild(this.gs_glidePathCursorUp);
                    this.gs_glidePathCursorDown = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "fill", "transparent");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "stroke-width", "2");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "d", "M " + (-x) + " 0 L" + (-x) + " " + (y / 2) + " L" + (x) + " " + (y / 2) + " L " + (x) + " 0");
                    this.gs_cursorGroup.appendChild(this.gs_glidePathCursorDown);
                }
            }
            this.centerGroup.appendChild(this.gs_mainGroup);
            posX = 60;
            posY = 425;
            width = 375;
            height = 35;
            this.loc_mainGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.loc_mainGroup, "id", "LocalizerGroup");
            {
                let neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(neutralLine, "id", "NeutralLine");
                diffAndSetAttribute(neutralLine, "x1", (posX + width * 0.5) + '');
                diffAndSetAttribute(neutralLine, "y1", posY + '');
                diffAndSetAttribute(neutralLine, "x2", (posX + width * 0.5) + '');
                diffAndSetAttribute(neutralLine, "y2", (posY + height) + '');
                diffAndSetAttribute(neutralLine, "stroke", "yellow");
                diffAndSetAttribute(neutralLine, "stroke-width", "5");
                this.loc_mainGroup.appendChild(neutralLine);
                let rangeFactor = 0.7;
                let nbCircles = 2;
                this.loc_cursorMinX = posX + (width * 0.5) - (rangeFactor * width * 0.5);
                this.loc_cursorMaxX = posX + (width * 0.5) + (rangeFactor * width * 0.5);
                this.loc_cursorPosX = posX + width * 0.5;
                this.loc_cursorPosY = posY + height * 0.5;
                for (let i = 0; i < nbCircles; i++) {
                    let x = posX + (width * 0.5) + ((rangeFactor * width * 0.5) * (i + 1)) / nbCircles;
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", x + '');
                    diffAndSetAttribute(circle, "cy", this.loc_cursorPosY + '');
                    diffAndSetAttribute(circle, "r", "5");
                    diffAndSetAttribute(circle, "fill", "none");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    this.loc_mainGroup.appendChild(circle);
                    x = posX + (width * 0.5) - ((rangeFactor * width * 0.5) * (i + 1)) / nbCircles;
                    circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", x + '');
                    diffAndSetAttribute(circle, "cy", this.loc_cursorPosY + '');
                    diffAndSetAttribute(circle, "r", "5");
                    diffAndSetAttribute(circle, "fill", "none");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    this.loc_mainGroup.appendChild(circle);
                }
                this.loc_cursorGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.loc_cursorGroup, "id", "CursorGroup");
                diffAndSetAttribute(this.loc_cursorGroup, "transform", "translate(" + this.loc_cursorPosX + ", " + this.loc_cursorPosY + ")");
                this.loc_mainGroup.appendChild(this.loc_cursorGroup);
                {
                    let x = 20;
                    let y = 12;
                    this.loc_cursorShapeRight = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "fill", "transparent");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "stroke-width", "2");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "d", "M 0 " + (-y) + " L" + (-x) + " 0 L0 " + (y));
                    this.loc_cursorGroup.appendChild(this.loc_cursorShapeRight);
                    this.loc_cursorShapeLeft = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "fill", "transparent");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "stroke", "#FF0CE2");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "stroke-width", "2");
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "d", "M 0 " + (-y) + " L" + (x) + " 0 L0 " + (y));
                    this.loc_cursorGroup.appendChild(this.loc_cursorShapeLeft);
                }
            }
            this.centerGroup.appendChild(this.loc_mainGroup);
        }
        this.InfoGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.InfoGroup, "id", "InfoGroup");
        diffAndSetAttribute(this.InfoGroup, "transform", "translate(13 455)");
        this.rootSVG.appendChild(this.InfoGroup);
        {
            this.ILSIdent = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.ILSIdent, "ILS");
            diffAndSetAttribute(this.ILSIdent, "x", "0");
            diffAndSetAttribute(this.ILSIdent, "y", "0");
            diffAndSetAttribute(this.ILSIdent, "fill", "#FF0CE2");
            diffAndSetAttribute(this.ILSIdent, "font-size", "16");
            diffAndSetAttribute(this.ILSIdent, "font-family", "Roboto-Light");
            diffAndSetAttribute(this.ILSIdent, "text-anchor", "start");
            diffAndSetAttribute(this.ILSIdent, "alignment-baseline", "central");
            this.InfoGroup.appendChild(this.ILSIdent);
            this.ILSFreq = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.ILSFreq, "109.50");
            diffAndSetAttribute(this.ILSFreq, "x", "0");
            diffAndSetAttribute(this.ILSFreq, "y", "15");
            diffAndSetAttribute(this.ILSFreq, "fill", "#FF0CE2");
            diffAndSetAttribute(this.ILSFreq, "font-size", "16");
            diffAndSetAttribute(this.ILSFreq, "font-family", "Roboto-Light");
            diffAndSetAttribute(this.ILSFreq, "text-anchor", "start");
            diffAndSetAttribute(this.ILSFreq, "alignment-baseline", "central");
            this.InfoGroup.appendChild(this.ILSFreq);
            this.ILSDist = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.ILSDist, "109 NM");
            diffAndSetAttribute(this.ILSDist, "x", "0");
            diffAndSetAttribute(this.ILSDist, "y", "30");
            diffAndSetAttribute(this.ILSDist, "fill", "#FF0CE2");
            diffAndSetAttribute(this.ILSDist, "font-size", "16");
            diffAndSetAttribute(this.ILSDist, "font-family", "Roboto-Light");
            diffAndSetAttribute(this.ILSDist, "text-anchor", "start");
            diffAndSetAttribute(this.ILSDist, "alignment-baseline", "central");
            this.InfoGroup.appendChild(this.ILSDist);
        }
        this.appendChild(this.rootSVG);
    }
    update(_deltaTime) {
        if (this.gsVisible || this.locVisible || this.infoVisible) {
            let localizer = this.gps.radioNav.getBestILSBeacon();
            if (this.aircraft == Aircraft.AS03D) {
                if (Simplane.getAutoPilotNavAidStateL(1) == NAV_AID_STATE.VOR)
                    localizer = this.gps.radioNav.getILSBeacon(1);
                else if (Simplane.getAutoPilotNavAidStateL(2) == NAV_AID_STATE.VOR)
                    localizer = this.gps.radioNav.getILSBeacon(2);
            }
            let isApproachLoaded = Simplane.getAutoPilotApproachLoaded();
            let approachType = Simplane.getAutoPilotApproachType();
            if (this.gs_cursorGroup && this.gsVisible) {
                if (isApproachLoaded && approachType == 10) {
                    let gsi = -SimVar.GetSimVarValue("GPS VERTICAL ERROR", "meters");
                    let delta = 0.5 + (gsi / 150.0) / 2;
                    let y = this.gs_cursorMinY + (this.gs_cursorMaxY - this.gs_cursorMinY) * delta;
                    y = Math.min(this.gs_cursorMinY, Math.max(this.gs_cursorMaxY, y));
                    diffAndSetAttribute(this.gs_cursorGroup, "transform", "translate(" + this.gs_cursorPosX + ", " + y + ")");
                    if (this.aircraft == Aircraft.AS01B) {
                        if (delta >= 0.95 || delta <= 0.05) {
                            diffAndSetAttribute(this.gs_glidePathCursorUp, "fill", "transparent");
                            diffAndSetAttribute(this.gs_glidePathCursorDown, "fill", "transparent");
                        }
                        else {
                            diffAndSetAttribute(this.gs_glidePathCursorUp, "fill", (this.isHud) ? "lime" : "#FF0CE2");
                            diffAndSetAttribute(this.gs_glidePathCursorDown, "fill", (this.isHud) ? "lime" : "#FF0CE2");
                        }
                        diffAndSetAttribute(this.gs_glidePathCursorUp, "visibility", "visible");
                        diffAndSetAttribute(this.gs_glidePathCursorDown, "visibility", "visible");
                        diffAndSetAttribute(this.gs_cursorShapeUp, "visibility", "hidden");
                        diffAndSetAttribute(this.gs_cursorShapeDown, "visibility", "hidden");
                    }
                    else {
                        if (delta >= 0.95) {
                            diffAndSetAttribute(this.gs_glidePathCursorUp, "visibility", "visible");
                            diffAndSetAttribute(this.gs_glidePathCursorDown, "visibility", "hidden");
                        }
                        else if (delta <= 0.05) {
                            diffAndSetAttribute(this.gs_glidePathCursorUp, "visibility", "hidden");
                            diffAndSetAttribute(this.gs_glidePathCursorDown, "visibility", "visible");
                        }
                        else {
                            diffAndSetAttribute(this.gs_glidePathCursorUp, "visibility", "visible");
                            diffAndSetAttribute(this.gs_glidePathCursorDown, "visibility", "visible");
                        }
                        diffAndSetAttribute(this.gs_cursorShapeUp, "visibility", "hidden");
                        diffAndSetAttribute(this.gs_cursorShapeDown, "visibility", "hidden");
                    }
                }
                else if (localizer && localizer.id > 0 && SimVar.GetSimVarValue("NAV HAS GLIDE SLOPE:" + localizer.id, "Bool")) {
                    let gsi = -SimVar.GetSimVarValue("NAV GSI:" + localizer.id, "number") / 127.0;
                    let delta = (gsi + 1.0) * 0.5;
                    let y = this.gs_cursorMinY + (this.gs_cursorMaxY - this.gs_cursorMinY) * delta;
                    y = Math.min(this.gs_cursorMinY, Math.max(this.gs_cursorMaxY, y));
                    diffAndSetAttribute(this.gs_cursorGroup, "transform", "translate(" + this.gs_cursorPosX + ", " + y + ")");
                    if (this.aircraft == Aircraft.AS01B) {
                        if (delta >= 0.95 || delta <= 0.05) {
                            diffAndSetAttribute(this.gs_cursorShapeUp, "fill", "transparent");
                            diffAndSetAttribute(this.gs_cursorShapeDown, "fill", "transparent");
                        }
                        else {
                            diffAndSetAttribute(this.gs_cursorShapeUp, "fill", (this.isHud) ? "lime" : "#FF0CE2");
                            diffAndSetAttribute(this.gs_cursorShapeDown, "fill", (this.isHud) ? "lime" : "#FF0CE2");
                        }
                        diffAndSetAttribute(this.gs_cursorShapeUp, "visibility", "visible");
                        diffAndSetAttribute(this.gs_cursorShapeDown, "visibility", "visible");
                    }
                    else {
                        if (delta >= 0.95) {
                            diffAndSetAttribute(this.gs_cursorShapeUp, "visibility", "visible");
                            diffAndSetAttribute(this.gs_cursorShapeDown, "visibility", "hidden");
                        }
                        else if (delta <= 0.05) {
                            diffAndSetAttribute(this.gs_cursorShapeUp, "visibility", "hidden");
                            diffAndSetAttribute(this.gs_cursorShapeDown, "visibility", "visible");
                        }
                        else {
                            diffAndSetAttribute(this.gs_cursorShapeUp, "visibility", "visible");
                            diffAndSetAttribute(this.gs_cursorShapeDown, "visibility", "visible");
                        }
                    }
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "visibility", "hidden");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "visibility", "hidden");
                }
                else {
                    diffAndSetAttribute(this.gs_cursorShapeUp, "visibility", "hidden");
                    diffAndSetAttribute(this.gs_cursorShapeDown, "visibility", "hidden");
                    diffAndSetAttribute(this.gs_glidePathCursorUp, "visibility", "hidden");
                    diffAndSetAttribute(this.gs_glidePathCursorDown, "visibility", "hidden");
                }
            }
            if (this.loc_cursorGroup && this.locVisible) {
                if ((!isApproachLoaded || approachType != 10) && localizer && localizer.id > 0) {
                    let cdi = SimVar.GetSimVarValue("NAV CDI:" + localizer.id, "number") / 127.0;
                    let delta = (cdi + 1.0) * 0.5;
                    let x = this.loc_cursorMinX + (this.loc_cursorMaxX - this.loc_cursorMinX) * delta;
                    x = Math.max(this.loc_cursorMinX, Math.min(this.loc_cursorMaxX, x));
                    diffAndSetAttribute(this.loc_cursorGroup, "transform", "translate(" + x + ", " + this.loc_cursorPosY + ")");
                    if (this.aircraft == Aircraft.AS01B) {
                        if (delta >= 0.95 || delta <= 0.05) {
                            diffAndSetAttribute(this.loc_cursorShapeLeft, "fill", "transparent");
                            diffAndSetAttribute(this.loc_cursorShapeRight, "fill", "transparent");
                        }
                        else {
                            diffAndSetAttribute(this.loc_cursorShapeLeft, "fill", (this.isHud) ? "lime" : "#FF0CE2");
                            diffAndSetAttribute(this.loc_cursorShapeRight, "fill", (this.isHud) ? "lime" : "#FF0CE2");
                        }
                        diffAndSetAttribute(this.loc_cursorShapeLeft, "visibility", "visible");
                        diffAndSetAttribute(this.loc_cursorShapeRight, "visibility", "visible");
                    }
                    else {
                        if (delta >= 0.95) {
                            diffAndSetAttribute(this.loc_cursorShapeLeft, "visibility", "visible");
                            diffAndSetAttribute(this.loc_cursorShapeRight, "visibility", "hidden");
                        }
                        else if (delta <= 0.05) {
                            diffAndSetAttribute(this.loc_cursorShapeLeft, "visibility", "hidden");
                            diffAndSetAttribute(this.loc_cursorShapeRight, "visibility", "visible");
                        }
                        else {
                            diffAndSetAttribute(this.loc_cursorShapeLeft, "visibility", "visible");
                            diffAndSetAttribute(this.loc_cursorShapeRight, "visibility", "visible");
                        }
                    }
                }
                else {
                    diffAndSetAttribute(this.loc_cursorShapeLeft, "visibility", "hidden");
                    diffAndSetAttribute(this.loc_cursorShapeRight, "visibility", "hidden");
                }
            }
            if (this.InfoGroup && this.infoVisible) {
                if (localizer && localizer.id > 0) {
                    diffAndSetAttribute(this.InfoGroup, "visibility", "visible");
                    if (this.ILSIdent)
                        diffAndSetText(this.ILSIdent, localizer.ident);
                    if (this.ILSFreq)
                        diffAndSetText(this.ILSFreq, fastToFixed(localizer.freq, 2));
                    if (this.ILSDist)
                        diffAndSetText(this.ILSDist, SimVar.GetSimVarValue("NAV HAS DME:" + localizer.id, "Bool") ? fastToFixed(SimVar.GetSimVarValue("NAV DME:" + localizer.id, "nautical miles"), 1) + "NM" : "");
                }
                else {
                    diffAndSetAttribute(this.InfoGroup, "visibility", "hidden");
                }
            }
        }
    }
    showLocalizer(_val) {
        this.locVisible = _val;
        if (_val) {
            diffAndSetAttribute(this.loc_mainGroup, "visibility", "visible");
        }
        else {
            diffAndSetAttribute(this.loc_mainGroup, "visibility", "hidden");
            this.loc_cursorShapeLeft.removeAttribute("visibility");
            this.loc_cursorShapeRight.removeAttribute("visibility");
        }
    }
    showGlideslope(_val) {
        if (this.gsVisible !== _val) {
            this.gsVisible = _val;
            if (_val) {
                diffAndSetAttribute(this.gs_mainGroup, "visibility", "visible");
            }
            else {
                diffAndSetAttribute(this.gs_mainGroup, "visibility", "hidden");
                this.gs_cursorShapeUp.removeAttribute("visibility");
                this.gs_cursorShapeDown.removeAttribute("visibility");
            }
        }
    }
    showNavInfo(_val) {
        this.infoVisible = _val;
        if (this.InfoGroup) {
            if (_val) {
                diffAndSetAttribute(this.InfoGroup, "visibility", "visible");
            }
            else {
                diffAndSetAttribute(this.InfoGroup, "visibility", "hidden");
            }
        }
    }
}
customElements.define("jet-pfd-ils-indicator", Jet_PFD_ILSIndicator);
//# sourceMappingURL=ILSIndicator.js.map