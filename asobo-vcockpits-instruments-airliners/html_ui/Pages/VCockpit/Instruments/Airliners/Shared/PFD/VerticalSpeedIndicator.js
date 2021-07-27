class Jet_PFD_VerticalSpeedIndicator extends HTMLElement {
    constructor() {
        super(...arguments);
        this.cursorTextColor = "rgb(26,255,0)";
        this.fontSize = 25;
        this.cursorPosX1 = 0;
        this.cursorPosY1 = 0;
        this.cursorPosX2 = 0;
        this.cursorPosY2 = 0;
        this.cursorBgOffsetY = 0;
        this.selectedCursorOffsetY = 0;
        this.maxSpeed = 0;
        this.gradSpeeds = [];
        this.gradYPos = [];
        this._aircraft = Aircraft.A320_NEO;
    }
    static get dynamicAttributes() {
        return [
            "vspeed",
            "selected_vspeed",
            "selected_vspeed_active"
        ];
    }
    static get observedAttributes() {
        return this.dynamicAttributes.concat([]);
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
    destroyLayout() {
        Utils.RemoveAllChildren(this);
        this.topSpeedText = null;
        this.bottomSpeedText = null;
        for (let i = 0; i < Jet_PFD_AttitudeIndicator.dynamicAttributes.length; i++) {
            this.removeAttribute(Jet_PFD_AttitudeIndicator.dynamicAttributes[i]);
        }
    }
    construct() {
        this.destroyLayout();
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
    }
    construct_CJ4() {
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 250 1000");
        var width = 70.5;
        var centerHeight = 495;
        var posX = width * 0.5;
        var posY = 350;
        this.maxSpeed = 4000;
        this.cursorTextColor = "rgb(26,255,0)";
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "VerticalSpeed");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        if (!this.centerGroup) {
            this.centerGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.centerGroup, "id", "CenterGroup");
        }
        else {
            Utils.RemoveAllChildren(this.centerGroup);
        }
        posY -= centerHeight;
        {
            var _top = 0;
            var _left = posX - width * 0.5;
            var _width = width;
            var _height = centerHeight;
            var bg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(bg, "x", _left + '');
            diffAndSetAttribute(bg, "y", _top + '');
            diffAndSetAttribute(bg, "width", _width + '');
            diffAndSetAttribute(bg, "height", _height + '');
            diffAndSetAttribute(bg, "fill", "black");
            diffAndSetAttribute(bg, "fill-opacity", "0.5");
            this.centerGroup.appendChild(bg);
            this.topSpeedText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.topSpeedText, "");
            diffAndSetAttribute(this.topSpeedText, "x", (_left + _width * 0.92) + '');
            diffAndSetAttribute(this.topSpeedText, "y", (_top + 18) + '');
            diffAndSetAttribute(this.topSpeedText, "fill", "green");
            diffAndSetAttribute(this.topSpeedText, "font-size", (this.fontSize * 0.85) + '');
            diffAndSetAttribute(this.topSpeedText, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.topSpeedText, "text-anchor", "end");
            diffAndSetAttribute(this.topSpeedText, "alignment-baseline", "central");
            this.centerGroup.appendChild(this.topSpeedText);
            if (!this.graduationsGroup) {
                this.graduationsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.graduationsGroup, "id", "GraduationsGroup");
            }
            else {
                Utils.RemoveAllChildren(this.graduationsGroup);
            }
            this.gradSpeeds = [500, 1000, 2000, 4000];
            this.gradYPos = [30, 55, 130, 190];
            var _gradLengths = [14, 20, 27, 35];
            this.cursorPosX1 = _left + 16;
            this.cursorPosX2 = _left + _width + 105;
            this.cursorPosY1 = _top + _height * 0.5 - 3.5;
            this.cursorPosY2 = _top + _height * 0.5 - 3.5;
            var _gradLineVec = new Vec2();
            for (var i = 0; i < this.gradSpeeds.length; i++) {
                var grad = this.gradSpeeds[i];
                var len = _gradLengths[i];
                var y = this.cursorPosY2 + this.gradYPos[i];
                _gradLineVec.x = this.cursorPosX2 - this.cursorPosX1;
                _gradLineVec.y = this.cursorPosY2 - y;
                _gradLineVec.SetNorm(len);
                var line = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(line, "x1", this.cursorPosX1 + '');
                diffAndSetAttribute(line, "y1", y + '');
                diffAndSetAttribute(line, "x2", (this.cursorPosX1 + _gradLineVec.x) + '');
                diffAndSetAttribute(line, "y2", (y + _gradLineVec.y) + '');
                diffAndSetAttribute(line, "stroke", "white");
                diffAndSetAttribute(line, "stroke-width", "1");
                this.graduationsGroup.appendChild(line);
                if (grad >= 1000) {
                    var text = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(text, (grad / 1000) + '');
                    diffAndSetAttribute(text, "x", (this.cursorPosX1 - 2) + '');
                    diffAndSetAttribute(text, "y", y + '');
                    diffAndSetAttribute(text, "fill", "white");
                    diffAndSetAttribute(text, "font-size", (this.fontSize * 0.8) + '');
                    diffAndSetAttribute(text, "font-family", "Roboto-Light");
                    diffAndSetAttribute(text, "text-anchor", "end");
                    diffAndSetAttribute(text, "alignment-baseline", "central");
                    this.graduationsGroup.appendChild(text);
                }
                y = this.cursorPosY2 - this.gradYPos[i];
                _gradLineVec.x = this.cursorPosX2 - this.cursorPosX1;
                _gradLineVec.y = this.cursorPosY2 - y;
                _gradLineVec.SetNorm(len);
                line = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(line, "x1", this.cursorPosX1 + '');
                diffAndSetAttribute(line, "y1", y + '');
                diffAndSetAttribute(line, "x2", (this.cursorPosX1 + _gradLineVec.x) + '');
                diffAndSetAttribute(line, "y2", (y + _gradLineVec.y) + '');
                diffAndSetAttribute(line, "stroke", "white");
                diffAndSetAttribute(line, "stroke-width", "1");
                this.graduationsGroup.appendChild(line);
                if (grad >= 1000) {
                    var text = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(text, (grad / 1000) + '');
                    diffAndSetAttribute(text, "x", (this.cursorPosX1 - 2) + '');
                    diffAndSetAttribute(text, "y", y + '');
                    diffAndSetAttribute(text, "fill", "white");
                    diffAndSetAttribute(text, "font-size", (this.fontSize * 0.8) + '');
                    diffAndSetAttribute(text, "font-family", "Roboto-Light");
                    diffAndSetAttribute(text, "text-anchor", "end");
                    diffAndSetAttribute(text, "alignment-baseline", "central");
                    this.graduationsGroup.appendChild(text);
                }
            }
            this.centerGroup.appendChild(this.graduationsGroup);
            let centerLine = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(centerLine, "x1", (this.cursorPosX1 - 10) + '');
            diffAndSetAttribute(centerLine, "y1", this.cursorPosY1 + '');
            diffAndSetAttribute(centerLine, "x2", (this.cursorPosX1 + 20) + '');
            diffAndSetAttribute(centerLine, "y2", this.cursorPosY1 + '');
            diffAndSetAttribute(centerLine, "stroke", "white");
            diffAndSetAttribute(centerLine, "stroke-width", "3");
            this.centerGroup.appendChild(centerLine);
            if (!this.cursorSVGGroup) {
                this.cursorSVGGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.cursorSVGGroup, "id", "CursorGroup");
            }
            else
                Utils.RemoveAllChildren(this.cursorSVGGroup);
            if (!this.cursorSVGLine)
                this.cursorSVGLine = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(this.cursorSVGLine, "x1", this.cursorPosX1 + '');
            diffAndSetAttribute(this.cursorSVGLine, "y1", this.cursorPosY1 + '');
            diffAndSetAttribute(this.cursorSVGLine, "x2", this.cursorPosX2 + '');
            diffAndSetAttribute(this.cursorSVGLine, "y2", this.cursorPosY2 + '');
            diffAndSetAttribute(this.cursorSVGLine, "stroke", this.cursorTextColor);
            diffAndSetAttribute(this.cursorSVGLine, "stroke-width", "2");
            this.cursorSVGGroup.appendChild(this.cursorSVGLine);
            this.centerGroup.appendChild(this.cursorSVGGroup);
            let selectedCursorHeight = 12;
            this.selectedCursorOffsetY = selectedCursorHeight * 0.5;
            this.selectedCursorSVG = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(this.selectedCursorSVG, "d", "M" + (this.cursorPosX1 - 14) + " 0 l5 0 l0 -5 l13 " + (selectedCursorHeight * 0.5 + 5) + " l-13 " + (selectedCursorHeight * 0.5 + 5) + "l0 -5 l-5 0 l0 " + (-selectedCursorHeight * 0.5) + "Z");
            diffAndSetAttribute(this.selectedCursorSVG, "fill", "cyan");
            diffAndSetAttribute(this.selectedCursorSVG, "visibility", "hidden");
            this.cursorSVGGroup.appendChild(this.selectedCursorSVG);
            this.bottomSpeedText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.bottomSpeedText, "");
            diffAndSetAttribute(this.bottomSpeedText, "x", (_left + _width * 0.92) + '');
            diffAndSetAttribute(this.bottomSpeedText, "y", (_top + _height * 0.95) + '');
            diffAndSetAttribute(this.bottomSpeedText, "fill", "green");
            diffAndSetAttribute(this.bottomSpeedText, "font-size", (this.fontSize * 0.85) + '');
            diffAndSetAttribute(this.bottomSpeedText, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.bottomSpeedText, "text-anchor", "end");
            diffAndSetAttribute(this.bottomSpeedText, "alignment-baseline", "central");
            this.centerGroup.appendChild(this.bottomSpeedText);
            this.rootGroup.appendChild(this.centerGroup);
        }
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    construct_B747_8() {
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 250 600");
        var width = 100;
        var height = 450;
        var posX = 0;
        var posY = (600 - height) * 0.5;
        this.maxSpeed = 6000;
        this.cursorTextColor = "rgb(255,255,255)";
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "VerticalSpeed");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        if (!this.centerGroup) {
            this.centerGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.centerGroup, "id", "CenterGroup");
        }
        else {
            Utils.RemoveAllChildren(this.centerGroup);
        }
        var smallBg = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(smallBg, "fill", "#343B51");
        diffAndSetAttribute(smallBg, "d", "M 0 0 l 0 " + (height * 0.34) + " l 30 15 l 0 " + (height - (height * 0.34 + 15) * 2) + " l -30 15 L 0 " + height + " L 45 " + height + " L 75 " + (height - 90) + " L 75 90 L 45 0 Z");
        diffAndSetAttribute(smallBg, "transform", "translate(" + posX + " " + posY + ")");
        this.centerGroup.appendChild(smallBg);
        var _width = width;
        var _height = height;
        var _top = posY;
        var _left = posX + 10;
        var _graduationStartY = _top + _height * 0.05;
        var _graduationHeight = (_top + _height * 0.95) - _graduationStartY;
        this.topSpeedText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetText(this.topSpeedText, "");
        diffAndSetAttribute(this.topSpeedText, "x", (_left - 10) + '');
        diffAndSetAttribute(this.topSpeedText, "y", (_top - 22) + '');
        diffAndSetAttribute(this.topSpeedText, "fill", "white");
        diffAndSetAttribute(this.topSpeedText, "font-size", (this.fontSize * 0.85) + '');
        diffAndSetAttribute(this.topSpeedText, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.topSpeedText, "text-anchor", "start");
        diffAndSetAttribute(this.topSpeedText, "alignment-baseline", "central");
        this.rootGroup.appendChild(this.topSpeedText);
        if (!this.graduationsGroup) {
            this.graduationsGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.graduationsGroup, "id", "GraduationsGroup");
        }
        else {
            Utils.RemoveAllChildren(this.graduationsGroup);
        }
        this.gradSpeeds = [500, 1000, 1500, 2000, 4000, 6000];
        this.gradYPos = [60, 120, 170, 220, 250, 280];
        for (var i = 0; i < this.gradYPos.length; i++) {
            this.gradYPos[i] *= height / 600;
        }
        for (var i = 0; i < this.gradSpeeds.length; i++) {
            var isPrimary = (i % 2 != 0) ? true : false;
            var lineWidth = isPrimary ? 12 : 9;
            var lineHeight = isPrimary ? 3 : 2;
            var offset = isPrimary ? 0 : 3;
            var y = _graduationStartY + _graduationHeight * 0.5 + this.gradYPos[i];
            var line = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(line, "x", (_left + _width * 0.2 + offset) + '');
            diffAndSetAttribute(line, "y", y + '');
            diffAndSetAttribute(line, "width", lineWidth + '');
            diffAndSetAttribute(line, "height", lineHeight + '');
            diffAndSetAttribute(line, "fill", "white");
            this.graduationsGroup.appendChild(line);
            if (isPrimary) {
                var text = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(text, (this.gradSpeeds[i] / 1000) + '');
                diffAndSetAttribute(text, "x", _left + '');
                diffAndSetAttribute(text, "y", y + '');
                diffAndSetAttribute(text, "fill", "white");
                diffAndSetAttribute(text, "font-size", (this.fontSize * 0.9) + '');
                diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                diffAndSetAttribute(text, "text-anchor", "start");
                diffAndSetAttribute(text, "alignment-baseline", "central");
                this.graduationsGroup.appendChild(text);
            }
            y = _graduationStartY + _graduationHeight * 0.5 - this.gradYPos[i];
            var line = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(line, "x", (_left + _width * 0.2 + offset) + '');
            diffAndSetAttribute(line, "y", y + '');
            diffAndSetAttribute(line, "width", lineWidth + '');
            diffAndSetAttribute(line, "height", lineHeight + '');
            diffAndSetAttribute(line, "fill", "white");
            this.graduationsGroup.appendChild(line);
            if (isPrimary) {
                var text = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(text, (this.gradSpeeds[i] / 1000) + '');
                diffAndSetAttribute(text, "x", _left + '');
                diffAndSetAttribute(text, "y", y + '');
                diffAndSetAttribute(text, "fill", "white");
                diffAndSetAttribute(text, "font-size", (this.fontSize * 0.9) + '');
                diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                diffAndSetAttribute(text, "text-anchor", "start");
                diffAndSetAttribute(text, "alignment-baseline", "central");
                this.graduationsGroup.appendChild(text);
            }
        }
        this.centerGroup.appendChild(this.graduationsGroup);
        {
            this.cursorPosX1 = _left + _width * 0.30;
            this.cursorPosY1 = _graduationStartY + _graduationHeight * 0.5;
            this.cursorPosX2 = _left + _width;
            this.cursorPosY2 = _graduationStartY + _graduationHeight * 0.5;
            if (!this.cursorSVGGroup) {
                this.cursorSVGGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.cursorSVGGroup, "id", "CursorGroup");
            }
            else
                Utils.RemoveAllChildren(this.cursorSVGGroup);
            if (!this.cursorSVGLine)
                this.cursorSVGLine = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(this.cursorSVGLine, "stroke", this.cursorTextColor);
            diffAndSetAttribute(this.cursorSVGLine, "stroke-width", "3");
            this.cursorSVGGroup.appendChild(this.cursorSVGLine);
            var cursorSVGNeutral = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(cursorSVGNeutral, "x1", (_left + _width * 0.2) + '');
            diffAndSetAttribute(cursorSVGNeutral, "y1", this.cursorPosY1 + '');
            diffAndSetAttribute(cursorSVGNeutral, "x2", (_left + _width * 0.5) + '');
            diffAndSetAttribute(cursorSVGNeutral, "y2", this.cursorPosY1 + '');
            diffAndSetAttribute(cursorSVGNeutral, "stroke", "white");
            diffAndSetAttribute(cursorSVGNeutral, "stroke-width", "3");
            this.cursorSVGGroup.appendChild(cursorSVGNeutral);
            let selectedCursorWidth = 18;
            let selectedCursorHeight = 12;
            this.selectedCursorOffsetY = selectedCursorHeight * 0.5;
            this.selectedCursorSVG = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.selectedCursorSVG, "x", (this.cursorPosX1 - 10) + '');
            diffAndSetAttribute(this.selectedCursorSVG, "y", "0");
            diffAndSetAttribute(this.selectedCursorSVG, "width", selectedCursorWidth + '');
            diffAndSetAttribute(this.selectedCursorSVG, "height", selectedCursorHeight + '');
            diffAndSetAttribute(this.selectedCursorSVG, "fill", "#D570FF");
            diffAndSetAttribute(this.selectedCursorSVG, "visibility", "hidden");
            this.cursorSVGGroup.appendChild(this.selectedCursorSVG);
            this.centerGroup.appendChild(this.cursorSVGGroup);
        }
        this.rootGroup.appendChild(this.centerGroup);
        this.bottomSpeedText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetText(this.bottomSpeedText, "");
        diffAndSetAttribute(this.bottomSpeedText, "x", (_left - 10) + '');
        diffAndSetAttribute(this.bottomSpeedText, "y", (_top + _height + 25) + '');
        diffAndSetAttribute(this.bottomSpeedText, "fill", "white");
        diffAndSetAttribute(this.bottomSpeedText, "font-size", (this.fontSize * 0.85) + '');
        diffAndSetAttribute(this.bottomSpeedText, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.bottomSpeedText, "text-anchor", "start");
        diffAndSetAttribute(this.bottomSpeedText, "alignment-baseline", "central");
        this.rootGroup.appendChild(this.bottomSpeedText);
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    construct_AS01B() {
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 250 600");
        var width = 100;
        var height = 450;
        var posX = 0;
        var posY = (600 - height) * 0.5;
        this.maxSpeed = 6000;
        this.cursorTextColor = "rgb(255,255,255)";
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "VerticalSpeed");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        if (!this.centerGroup) {
            this.centerGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.centerGroup, "id", "CenterGroup");
        }
        else {
            Utils.RemoveAllChildren(this.centerGroup);
        }
        var smallBg = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(smallBg, "d", "M 0 0 l 0 " + (height * 0.34) + " l 30 15 l 0 " + (height - (height * 0.34 + 15) * 2) + " l -30 15 L 0 " + height + " L 45 " + height + " L 75 " + (height - 90) + " L 75 90 L 45 0 Z");
        diffAndSetAttribute(smallBg, "transform", "translate(" + posX + " " + posY + ")");
        diffAndSetAttribute(smallBg, "fill", "black");
        diffAndSetAttribute(smallBg, "fill-opacity", "0.3");
        this.centerGroup.appendChild(smallBg);
        var _width = width;
        var _height = height;
        var _top = posY;
        var _left = posX + 10;
        var _graduationStartY = _top + _height * 0.05;
        var _graduationHeight = (_top + _height * 0.95) - _graduationStartY;
        this.topSpeedText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetText(this.topSpeedText, "");
        diffAndSetAttribute(this.topSpeedText, "x", (_left - 5) + '');
        diffAndSetAttribute(this.topSpeedText, "y", (_top - 25) + '');
        diffAndSetAttribute(this.topSpeedText, "fill", "white");
        diffAndSetAttribute(this.topSpeedText, "font-size", (this.fontSize * 0.85) + '');
        diffAndSetAttribute(this.topSpeedText, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.topSpeedText, "text-anchor", "start");
        diffAndSetAttribute(this.topSpeedText, "alignment-baseline", "central");
        this.rootGroup.appendChild(this.topSpeedText);
        if (!this.graduationsGroup) {
            this.graduationsGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.graduationsGroup, "id", "GraduationsGroup");
        }
        else {
            Utils.RemoveAllChildren(this.graduationsGroup);
        }
        this.gradSpeeds = [500, 1000, 1500, 2000, 4000, 6000];
        this.gradYPos = [60, 120, 170, 220, 250, 280];
        for (var i = 0; i < this.gradYPos.length; i++) {
            this.gradYPos[i] *= height / 600;
        }
        for (var i = 0; i < this.gradSpeeds.length; i++) {
            var isPrimary = (i % 2 != 0) ? true : false;
            var lineWidth = isPrimary ? 12 : 9;
            var lineHeight = isPrimary ? 3 : 2;
            var offset = isPrimary ? 0 : 3;
            var y = _graduationStartY + _graduationHeight * 0.5 + this.gradYPos[i];
            var line = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(line, "x", (_left + _width * 0.2 + offset) + '');
            diffAndSetAttribute(line, "y", y + '');
            diffAndSetAttribute(line, "width", lineWidth + '');
            diffAndSetAttribute(line, "height", lineHeight + '');
            diffAndSetAttribute(line, "fill", "white");
            this.graduationsGroup.appendChild(line);
            if (isPrimary) {
                var text = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(text, (this.gradSpeeds[i] / 1000) + '');
                diffAndSetAttribute(text, "x", _left + '');
                diffAndSetAttribute(text, "y", y + '');
                diffAndSetAttribute(text, "fill", "white");
                diffAndSetAttribute(text, "font-size", (this.fontSize * 0.9) + '');
                diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                diffAndSetAttribute(text, "text-anchor", "start");
                diffAndSetAttribute(text, "alignment-baseline", "central");
                this.graduationsGroup.appendChild(text);
            }
            y = _graduationStartY + _graduationHeight * 0.5 - this.gradYPos[i];
            var line = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(line, "x", (_left + _width * 0.2 + offset) + '');
            diffAndSetAttribute(line, "y", y + '');
            diffAndSetAttribute(line, "width", lineWidth + '');
            diffAndSetAttribute(line, "height", lineHeight + '');
            diffAndSetAttribute(line, "fill", "white");
            this.graduationsGroup.appendChild(line);
            if (isPrimary) {
                var text = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(text, (this.gradSpeeds[i] / 1000) + '');
                diffAndSetAttribute(text, "x", _left + '');
                diffAndSetAttribute(text, "y", y + '');
                diffAndSetAttribute(text, "fill", "white");
                diffAndSetAttribute(text, "font-size", (this.fontSize * 0.9) + '');
                diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                diffAndSetAttribute(text, "text-anchor", "start");
                diffAndSetAttribute(text, "alignment-baseline", "central");
                this.graduationsGroup.appendChild(text);
            }
        }
        this.centerGroup.appendChild(this.graduationsGroup);
        {
            this.cursorPosX1 = _left + _width * 0.30;
            this.cursorPosY1 = _graduationStartY + _graduationHeight * 0.5;
            this.cursorPosX2 = _left + _width - _width * 0.30 - 6;
            this.cursorPosY2 = _graduationStartY + _graduationHeight * 0.5;
            if (!this.cursorSVGGroup) {
                this.cursorSVGGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.cursorSVGGroup, "id", "CursorGroup");
            }
            else
                Utils.RemoveAllChildren(this.cursorSVGGroup);
            if (!this.cursorSVGLine)
                this.cursorSVGLine = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(this.cursorSVGLine, "stroke", this.cursorTextColor);
            diffAndSetAttribute(this.cursorSVGLine, "stroke-width", "3");
            this.cursorSVGGroup.appendChild(this.cursorSVGLine);
            var cursorSVGNeutral = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(cursorSVGNeutral, "x1", (_left + _width * 0.2) + '');
            diffAndSetAttribute(cursorSVGNeutral, "y1", this.cursorPosY1 + '');
            diffAndSetAttribute(cursorSVGNeutral, "x2", (_left + _width * 0.5) + '');
            diffAndSetAttribute(cursorSVGNeutral, "y2", this.cursorPosY1 + '');
            diffAndSetAttribute(cursorSVGNeutral, "stroke", "white");
            diffAndSetAttribute(cursorSVGNeutral, "stroke-width", "3");
            this.cursorSVGGroup.appendChild(cursorSVGNeutral);
            let selectedCursorWidth = 18;
            let selectedCursorHeight = 12;
            this.selectedCursorOffsetY = selectedCursorHeight * 0.5;
            this.selectedCursorSVG = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.selectedCursorSVG, "x", (this.cursorPosX1 - 10) + '');
            diffAndSetAttribute(this.selectedCursorSVG, "y", "0");
            diffAndSetAttribute(this.selectedCursorSVG, "width", selectedCursorWidth + '');
            diffAndSetAttribute(this.selectedCursorSVG, "height", selectedCursorHeight + '');
            diffAndSetAttribute(this.selectedCursorSVG, "fill", "#D570FF");
            diffAndSetAttribute(this.selectedCursorSVG, "visibility", "hidden");
            this.cursorSVGGroup.appendChild(this.selectedCursorSVG);
            this.centerGroup.appendChild(this.cursorSVGGroup);
        }
        this.rootGroup.appendChild(this.centerGroup);
        this.bottomSpeedText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetText(this.bottomSpeedText, "");
        diffAndSetAttribute(this.bottomSpeedText, "x", (_left - 5) + '');
        diffAndSetAttribute(this.bottomSpeedText, "y", (_top + _height + 25) + '');
        diffAndSetAttribute(this.bottomSpeedText, "fill", "white");
        diffAndSetAttribute(this.bottomSpeedText, "font-size", (this.fontSize * 0.85) + '');
        diffAndSetAttribute(this.bottomSpeedText, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.bottomSpeedText, "text-anchor", "start");
        diffAndSetAttribute(this.bottomSpeedText, "alignment-baseline", "central");
        this.rootGroup.appendChild(this.bottomSpeedText);
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    construct_AS03D() {
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 125 1050");
        let posX = 10;
        let posY = 125;
        let width = 120;
        let height = 800;
        this.maxSpeed = 40000;
        this.cursorTextColor = "rgb(26,255,0)";
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "VerticalSpeed");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        this.topSpeedText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetText(this.topSpeedText, "");
        diffAndSetAttribute(this.topSpeedText, "x", (width / 2) + '');
        diffAndSetAttribute(this.topSpeedText, "y", (posY - 70) + '');
        diffAndSetAttribute(this.topSpeedText, "fill", "white");
        diffAndSetAttribute(this.topSpeedText, "font-size", (this.fontSize * 1.8) + '');
        diffAndSetAttribute(this.topSpeedText, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.topSpeedText, "text-anchor", "middle");
        diffAndSetAttribute(this.topSpeedText, "alignment-baseline", "central");
        this.rootGroup.appendChild(this.topSpeedText);
        {
            if (!this.centerGroup) {
                this.centerGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.centerGroup, "id", "CenterGroup");
            }
            else {
                Utils.RemoveAllChildren(this.centerGroup);
            }
            let _width = width;
            let _height = height;
            let _top = posY;
            let _left = posX + 40;
            let _centerGroupMiddleY = _top + _height * 0.5;
            {
                if (!this.graduationsGroup) {
                    this.graduationsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(this.graduationsGroup, "id", "GraduationsGroup");
                }
                else {
                    Utils.RemoveAllChildren(this.graduationsGroup);
                }
                this.gradSpeeds = [1000, 2000, 3000, 4000, 6000, 10000, 20000, 40000];
                this.gradYPos = [50, 100, 150, 200, 250, 300, 350, 400];
                for (let i = 0; i < this.gradSpeeds.length; i++) {
                    let isPrimary = (i % 2 != 0);
                    for (let j = 0; j < 2; j++) {
                        let y = _centerGroupMiddleY;
                        if (j == 0) {
                            y -= this.gradYPos[i];
                        }
                        else {
                            y += this.gradYPos[i];
                        }
                        let line = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(line, "x", (_left) + '');
                        diffAndSetAttribute(line, "y", y + '');
                        diffAndSetAttribute(line, "width", isPrimary ? "12" : "12");
                        diffAndSetAttribute(line, "height", isPrimary ? "8" : "4");
                        diffAndSetAttribute(line, "fill", "white");
                        this.graduationsGroup.appendChild(line);
                        if (isPrimary) {
                            let text = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetText(text, (this.gradSpeeds[i] / 1000) + '');
                            diffAndSetAttribute(text, "x", (_left - 2) + '');
                            diffAndSetAttribute(text, "y", y + '');
                            diffAndSetAttribute(text, "fill", "white");
                            diffAndSetAttribute(text, "font-size", (this.fontSize * 1.8) + '');
                            diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                            diffAndSetAttribute(text, "text-anchor", "end");
                            diffAndSetAttribute(text, "alignment-baseline", "central");
                            this.graduationsGroup.appendChild(text);
                        }
                    }
                }
                this.centerGroup.appendChild(this.graduationsGroup);
            }
            {
                this.cursorPosX1 = _left + 12;
                this.cursorPosY1 = _centerGroupMiddleY;
                this.cursorPosX2 = _width;
                this.cursorPosY2 = _centerGroupMiddleY;
                if (!this.cursorSVGGroup) {
                    this.cursorSVGGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(this.cursorSVGGroup, "id", "CursorGroup");
                }
                else
                    Utils.RemoveAllChildren(this.cursorSVGGroup);
                if (!this.cursorSVGLine)
                    this.cursorSVGLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(this.cursorSVGLine, "stroke", this.cursorTextColor);
                diffAndSetAttribute(this.cursorSVGLine, "stroke-width", "6");
                this.cursorSVGGroup.appendChild(this.cursorSVGLine);
                var cursorSVGNeutral = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(cursorSVGNeutral, "x1", posX + '');
                diffAndSetAttribute(cursorSVGNeutral, "y1", this.cursorPosY1 + '');
                diffAndSetAttribute(cursorSVGNeutral, "x2", this.cursorPosX1 + '');
                diffAndSetAttribute(cursorSVGNeutral, "y2", this.cursorPosY1 + '');
                diffAndSetAttribute(cursorSVGNeutral, "stroke", "yellow");
                diffAndSetAttribute(cursorSVGNeutral, "stroke-width", "10");
                this.cursorSVGGroup.appendChild(cursorSVGNeutral);
                this.centerGroup.appendChild(this.cursorSVGGroup);
            }
            this.rootGroup.appendChild(this.centerGroup);
        }
        this.bottomSpeedText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetText(this.bottomSpeedText, "");
        diffAndSetAttribute(this.bottomSpeedText, "x", (width / 2) + '');
        diffAndSetAttribute(this.bottomSpeedText, "y", (posY + height + 70) + '');
        diffAndSetAttribute(this.bottomSpeedText, "fill", "white");
        diffAndSetAttribute(this.bottomSpeedText, "font-size", (this.fontSize * 1.8) + '');
        diffAndSetAttribute(this.bottomSpeedText, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.bottomSpeedText, "text-anchor", "middle");
        diffAndSetAttribute(this.bottomSpeedText, "alignment-baseline", "central");
        this.rootGroup.appendChild(this.bottomSpeedText);
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    construct_A320_Neo() {
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 250 600");
        var posX = 0;
        var posY = 0;
        var width = 100;
        var height = 600;
        this.maxSpeed = 6000;
        this.cursorTextColor = "rgb(26,255,0)";
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "VerticalSpeed");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        if (!this.centerGroup) {
            this.centerGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.centerGroup, "id", "CenterGroup");
        }
        else {
            Utils.RemoveAllChildren(this.centerGroup);
        }
        var smallBg = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(smallBg, "fill", "#343B51");
        diffAndSetAttribute(smallBg, "d", "M 0 0 L 0 " + height + " L 30 " + height + " L 50 " + (height - 100) + " L 50 100 L 30 0 Z");
        diffAndSetAttribute(smallBg, "transform", "translate(" + posX + " " + posY + ")");
        this.centerGroup.appendChild(smallBg);
        var _width = width;
        var _height = height;
        var _top = posY;
        var _left = posX + 50 - _width * 0.5;
        var _graduationStartY = _top + _height * 0.05;
        var _graduationHeight = (_top + _height * 0.95) - _graduationStartY;
        if (!this.graduationsGroup) {
            this.graduationsGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.graduationsGroup, "id", "GraduationsGroup");
        }
        else {
            Utils.RemoveAllChildren(this.graduationsGroup);
        }
        this.gradSpeeds = [500, 1000, 1500, 2000, 4000, 6000];
        this.gradYPos = [70, 140, 175, 210, 245, 280];
        for (var i = 0; i < this.gradSpeeds.length; i++) {
            var isPrimary = (i % 2 != 0) ? true : false;
            var y = _graduationStartY + _graduationHeight * 0.5 + this.gradYPos[i];
            var line = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(line, "x", (_left + _width * 0.2) + '');
            diffAndSetAttribute(line, "y", y + '');
            diffAndSetAttribute(line, "width", isPrimary ? "9" : "9");
            diffAndSetAttribute(line, "height", isPrimary ? "8" : "2");
            diffAndSetAttribute(line, "fill", "white");
            this.graduationsGroup.appendChild(line);
            if (isPrimary) {
                var text = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(text, (this.gradSpeeds[i] / 1000) + '');
                diffAndSetAttribute(text, "x", _left + '');
                diffAndSetAttribute(text, "y", y + '');
                diffAndSetAttribute(text, "fill", "white");
                diffAndSetAttribute(text, "font-size", (this.fontSize * 1.15) + '');
                diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                diffAndSetAttribute(text, "text-anchor", "start");
                diffAndSetAttribute(text, "alignment-baseline", "central");
                this.graduationsGroup.appendChild(text);
            }
            y = _graduationStartY + _graduationHeight * 0.5 - this.gradYPos[i];
            var line = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(line, "x", (_left + _width * 0.2) + '');
            diffAndSetAttribute(line, "y", y + '');
            diffAndSetAttribute(line, "width", isPrimary ? "9" : "9");
            diffAndSetAttribute(line, "height", isPrimary ? "8" : "2");
            diffAndSetAttribute(line, "fill", "white");
            this.graduationsGroup.appendChild(line);
            if (isPrimary) {
                var text = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(text, (this.gradSpeeds[i] / 1000) + '');
                diffAndSetAttribute(text, "x", _left + '');
                diffAndSetAttribute(text, "y", y + '');
                diffAndSetAttribute(text, "fill", "white");
                diffAndSetAttribute(text, "font-size", (this.fontSize * 1.15) + '');
                diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                diffAndSetAttribute(text, "text-anchor", "start");
                diffAndSetAttribute(text, "alignment-baseline", "central");
                this.graduationsGroup.appendChild(text);
            }
        }
        this.centerGroup.appendChild(this.graduationsGroup);
        {
            this.cursorPosX1 = _left + _width * 0.30;
            this.cursorPosY1 = _graduationStartY + _graduationHeight * 0.5;
            this.cursorPosX2 = _left + _width;
            this.cursorPosY2 = _graduationStartY + _graduationHeight * 0.5;
            if (!this.cursorSVGGroup) {
                this.cursorSVGGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.cursorSVGGroup, "id", "CursorGroup");
            }
            else
                Utils.RemoveAllChildren(this.cursorSVGGroup);
            if (!this.cursorSVGLine)
                this.cursorSVGLine = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(this.cursorSVGLine, "stroke", this.cursorTextColor);
            diffAndSetAttribute(this.cursorSVGLine, "stroke-width", "4.5");
            this.cursorSVGGroup.appendChild(this.cursorSVGLine);
            var cursorSVGNeutral = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(cursorSVGNeutral, "x1", _left + '');
            diffAndSetAttribute(cursorSVGNeutral, "y1", this.cursorPosY1 + '');
            diffAndSetAttribute(cursorSVGNeutral, "x2", this.cursorPosX1 + '');
            diffAndSetAttribute(cursorSVGNeutral, "y2", this.cursorPosY1 + '');
            diffAndSetAttribute(cursorSVGNeutral, "stroke", "yellow");
            diffAndSetAttribute(cursorSVGNeutral, "stroke-width", "8");
            this.cursorSVGGroup.appendChild(cursorSVGNeutral);
            let cursorBgWidth = 34;
            let cursorBgHeight = 25;
            this.cursorBgOffsetY = cursorBgHeight * 0.45;
            this.cursorSVGTextBg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.cursorSVGTextBg, "x", (this.cursorPosX1) + '');
            diffAndSetAttribute(this.cursorSVGTextBg, "y", (this.cursorPosY1 - this.cursorBgOffsetY) + '');
            diffAndSetAttribute(this.cursorSVGTextBg, "width", cursorBgWidth + '');
            diffAndSetAttribute(this.cursorSVGTextBg, "height", cursorBgHeight + '');
            diffAndSetAttribute(this.cursorSVGTextBg, "fill", "black");
            this.cursorSVGGroup.appendChild(this.cursorSVGTextBg);
            this.cursorSVGText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.cursorSVGText, "17");
            diffAndSetAttribute(this.cursorSVGText, "x", this.cursorPosX1 + '');
            diffAndSetAttribute(this.cursorSVGText, "y", this.cursorPosY1 + '');
            diffAndSetAttribute(this.cursorSVGText, "fill", this.cursorTextColor);
            diffAndSetAttribute(this.cursorSVGText, "font-size", (this.fontSize * 1.0) + '');
            diffAndSetAttribute(this.cursorSVGText, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.cursorSVGText, "text-anchor", "start");
            diffAndSetAttribute(this.cursorSVGText, "alignment-baseline", "central");
            this.cursorSVGGroup.appendChild(this.cursorSVGText);
            this.centerGroup.appendChild(this.cursorSVGGroup);
        }
        this.rootGroup.appendChild(this.centerGroup);
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "vspeed":
                let vSpeed = parseFloat(newValue);
                this.updateVSpeed(vSpeed);
                break;
            case "selected_vspeed_active":
                if (this.selectedCursorSVG) {
                    if (newValue == "true")
                        diffAndSetAttribute(this.selectedCursorSVG, "visibility", "visible");
                    else
                        diffAndSetAttribute(this.selectedCursorSVG, "visibility", "hidden");
                }
                break;
            case "selected_vspeed":
                let selVSpeed = parseFloat(newValue);
                this.updateSelectedVSpeed(selVSpeed);
                break;
        }
    }
    updateVSpeed(_speed) {
        if (this.gradSpeeds) {
            let vSpeed = Math.min(this.maxSpeed, Math.max(-this.maxSpeed, _speed));
            {
                let height = this.heightFromSpeed(vSpeed);
                if (vSpeed >= 0)
                    this.cursorPosY1 = this.cursorPosY2 - height;
                else
                    this.cursorPosY1 = this.cursorPosY2 + height;
                let alert = false;
                if (this.aircraft != Aircraft.AS01B && this.aircraft != Aircraft.AS03D) {
                    let altitude = Simplane.getAltitudeAboveGround();
                    if ((altitude <= 2500 && vSpeed <= -2000) || (altitude > 2500 && vSpeed <= -6000))
                        alert = true;
                }
                if (this.cursorSVGLine) {
                    diffAndSetAttribute(this.cursorSVGLine, "x1", this.cursorPosX1 + '');
                    diffAndSetAttribute(this.cursorSVGLine, "y1", this.cursorPosY1 + '');
                    diffAndSetAttribute(this.cursorSVGLine, "x2", this.cursorPosX2 + '');
                    diffAndSetAttribute(this.cursorSVGLine, "y2", this.cursorPosY2 + '');
                    if (alert)
                        diffAndSetAttribute(this.cursorSVGLine, "stroke", "orange");
                    else
                        diffAndSetAttribute(this.cursorSVGLine, "stroke", this.cursorTextColor);
                }
                if (this.cursorSVGText) {
                    let displaySpeed = Math.floor(vSpeed / 100);
                    if (Math.abs(displaySpeed) > 0) {
                        diffAndSetText(this.cursorSVGText, Math.abs(displaySpeed) + '');
                        let posY;
                        if (displaySpeed > 0)
                            posY = this.cursorPosY1 - 13;
                        else
                            posY = this.cursorPosY1 + 13;
                        diffAndSetAttribute(this.cursorSVGText, "y", posY + '');
                        if (this.cursorSVGTextBg) {
                            diffAndSetAttribute(this.cursorSVGTextBg, "y", (posY - this.cursorBgOffsetY) + '');
                            diffAndSetAttribute(this.cursorSVGTextBg, "visibility", "visible");
                        }
                    }
                    else {
                        diffAndSetText(this.cursorSVGText, "");
                        if (this.cursorSVGTextBg) {
                            diffAndSetAttribute(this.cursorSVGTextBg, "visibility", "hidden");
                        }
                    }
                    if (alert)
                        diffAndSetAttribute(this.cursorSVGText, "fill", "orange");
                    else
                        diffAndSetAttribute(this.cursorSVGText, "fill", this.cursorTextColor);
                }
            }
            {
                let threshold = 400;
                let displaySpeed = Math.abs(Math.floor(_speed));
                displaySpeed = Math.round(displaySpeed / 5) * 5;
                if (this.topSpeedText) {
                    if (_speed >= threshold)
                        diffAndSetText(this.topSpeedText, displaySpeed + '');
                    else if (_speed <= -threshold)
                        diffAndSetText(this.topSpeedText, "");
                    else
                        diffAndSetText(this.topSpeedText, "");
                }
                if (this.bottomSpeedText) {
                    if (_speed >= threshold)
                        diffAndSetText(this.bottomSpeedText, "");
                    else if (_speed <= -threshold)
                        diffAndSetText(this.bottomSpeedText, displaySpeed + '');
                    else
                        diffAndSetText(this.bottomSpeedText, "");
                }
            }
        }
    }
    updateSelectedVSpeed(_speed) {
        if (this.gradSpeeds && this.selectedCursorSVG) {
            let vSpeed = Math.min(this.maxSpeed, Math.max(-this.maxSpeed, _speed));
            let height = this.heightFromSpeed(vSpeed);
            let posY = 0;
            if (vSpeed >= 0)
                posY = this.cursorPosY2 - height;
            else
                posY = this.cursorPosY2 + height;
            diffAndSetAttribute(this.selectedCursorSVG, "transform", "translate(0 " + (posY - this.selectedCursorOffsetY) + ")");
        }
    }
    heightFromSpeed(_speed) {
        var absSpeed = Math.abs(_speed);
        var height = 0;
        var found = false;
        if (absSpeed < this.gradSpeeds[0]) {
            var percent = absSpeed / this.gradSpeeds[0];
            height = this.gradYPos[0] * percent;
        }
        else {
            for (var i = 0; i < this.gradSpeeds.length - 1; i++) {
                if (absSpeed >= this.gradSpeeds[i] && absSpeed < this.gradSpeeds[i + 1]) {
                    var percent = (absSpeed - this.gradSpeeds[i]) / (this.gradSpeeds[i + 1] - this.gradSpeeds[i]);
                    height = this.gradYPos[i] + (this.gradYPos[i + 1] - this.gradYPos[i]) * percent;
                    found = true;
                    break;
                }
            }
            if (!found)
                height = this.gradYPos[this.gradYPos.length - 1];
        }
        return height;
    }
}
customElements.define("jet-pfd-vspeed-indicator", Jet_PFD_VerticalSpeedIndicator);
//# sourceMappingURL=VerticalSpeedIndicator.js.map