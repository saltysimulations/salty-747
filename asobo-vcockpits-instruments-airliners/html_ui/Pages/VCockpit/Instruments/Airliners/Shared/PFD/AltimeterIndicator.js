class Jet_PFD_AltimeterIndicator extends HTMLElement {
    constructor() {
        super(...arguments);
        this.strokeSize = "3";
        this.fontSize = 25;
        this.refHeight = 0;
        this.borderSize = 0;
        this.graduationScrollPosX = 0;
        this.graduationScrollPosY = 0;
        this.nbPrimaryGraduations = 7;
        this.nbSecondaryGraduations = 4;
        this.totalGraduations = this.nbPrimaryGraduations + ((this.nbPrimaryGraduations - 1) * this.nbSecondaryGraduations);
        this.graduationSpacing = 42;
        this.groundRibbonHasFixedHeight = false;
        this.groundReference = 0;
        this.groundLineSVGHeight = 0;
        this.mtrsVisible = false;
        this.minimumReferenceValue = 200;
        this.hudAPAltitude = 0;
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
    showMTRS(_active) {
        this.mtrsVisible = _active;
    }
    isMTRSVisible() {
        return this.mtrsVisible;
    }
    construct() {
        Utils.RemoveAllChildren(this);
        this.graduations = [];
        this.borderSize = 0;
        this.groundRibbonHasFixedHeight = false;
        this.groundLineSVGHeight = 0;
        this.thousandIndicator = null;
        this.targetAltitudeIndicatorSVGText = null;
        this.cursorSVGAltitudeLevelShape = null;
        this.cursorIntegrals = null;
        this.cursorDecimals = null;
        this.groundReference = Simplane.getGroundReference();
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
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 250 500");
        var width = 140;
        var height = 415;
        var posX = width * 0.5;
        var posY = 452.5;
        var gradWidth = 110;
        this.refHeight = height;
        this.nbPrimaryGraduations = 7;
        this.nbSecondaryGraduations = 0;
        this.graduationSpacing = 90;
        this.totalGraduations = this.nbPrimaryGraduations + ((this.nbPrimaryGraduations - 1) * this.nbSecondaryGraduations);
        this.graduationScroller = new Avionics.Scroller(this.nbPrimaryGraduations, 100, true);
        this.cursorIntegrals = new Array();
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 52, 1, 10, 10));
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 52, 1, 10, 100));
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 52, 1, 10, 1000));
        this.cursorDecimals = new Avionics.AltitudeScroller(5, 25, 10, 100);
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "Altimeter");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        if (!this.pressureSVG)
            this.pressureSVG = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetText(this.pressureSVG, "");
        diffAndSetAttribute(this.pressureSVG, "x", (posX - 45) + '');
        diffAndSetAttribute(this.pressureSVG, "y", (posY + 20) + '');
        diffAndSetAttribute(this.pressureSVG, "fill", "cyan");
        diffAndSetAttribute(this.pressureSVG, "font-size", (this.fontSize * 0.87) + '');
        diffAndSetAttribute(this.pressureSVG, "font-family", "Roboto-Light");
        diffAndSetAttribute(this.pressureSVG, "text-anchor", "center");
        this.rootGroup.appendChild(this.pressureSVG);
        posY -= height;
        if (!this.centerSVG) {
            this.centerSVG = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.centerSVG, "id", "CenterGroup");
        }
        else
            Utils.RemoveAllChildren(this.centerSVG);
        diffAndSetAttribute(this.centerSVG, "x", (posX - width * 0.5) + '');
        diffAndSetAttribute(this.centerSVG, "y", posY + '');
        diffAndSetAttribute(this.centerSVG, "width", width + '');
        diffAndSetAttribute(this.centerSVG, "height", height + '');
        diffAndSetAttribute(this.centerSVG, "viewBox", "0 0 " + width + " " + height);
        diffAndSetAttribute(this.centerSVG, "overflow", "hidden");
        {
            var _top = 0;
            var _left = 0;
            var _width = width;
            var _height = height;
            var bg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(bg, "x", _left + '');
            diffAndSetAttribute(bg, "y", _top + '');
            diffAndSetAttribute(bg, "width", _width + '');
            diffAndSetAttribute(bg, "height", _height + '');
            diffAndSetAttribute(bg, "fill", "black");
            diffAndSetAttribute(bg, "fill-opacity", "0.5");
            this.centerSVG.appendChild(bg);
            this.groundRibbonHasFixedHeight = true;
            var groundRibbonPosX = _left;
            var groundRibbonPosY = 0;
            var groundRibbonWidth = _width;
            var groundRibbonHeight = _height;
            if (!this.groundRibbonSVG) {
                this.groundRibbonSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.groundRibbonSVG, "id", "GroundRibbonGroup");
            }
            else
                Utils.RemoveAllChildren(this.groundRibbonSVG);
            diffAndSetAttribute(this.groundRibbonSVG, "x", groundRibbonPosX + '');
            diffAndSetAttribute(this.groundRibbonSVG, "y", groundRibbonPosY + '');
            diffAndSetAttribute(this.groundRibbonSVG, "width", groundRibbonWidth + '');
            diffAndSetAttribute(this.groundRibbonSVG, "height", groundRibbonHeight + '');
            diffAndSetAttribute(this.groundRibbonSVG, "viewBox", "0 0 " + groundRibbonWidth + " " + groundRibbonHeight);
            {
                var dashHeight = 4;
                var dashEndPos = _height;
                var dashPos = -120;
                while (dashPos < dashEndPos) {
                    let dashLine = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(dashLine, "x", "0");
                    diffAndSetAttribute(dashLine, "y", dashPos + '');
                    diffAndSetAttribute(dashLine, "width", groundRibbonWidth + '');
                    diffAndSetAttribute(dashLine, "height", dashHeight + '');
                    diffAndSetAttribute(dashLine, "transform", "skewY(45)");
                    diffAndSetAttribute(dashLine, "fill", "orange");
                    this.groundRibbonSVG.appendChild(dashLine);
                    dashPos += dashHeight * 6;
                }
                if (!this.groundRibbonSVGShape)
                    this.groundRibbonSVGShape = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(this.groundRibbonSVGShape, "fill", "orange");
                diffAndSetAttribute(this.groundRibbonSVGShape, "stroke", "orange");
                diffAndSetAttribute(this.groundRibbonSVGShape, "stroke-width", "2");
                diffAndSetAttribute(this.groundRibbonSVGShape, "width", groundRibbonWidth + '');
                diffAndSetAttribute(this.groundRibbonSVGShape, "height", "2");
                diffAndSetAttribute(this.groundRibbonSVGShape, "x", "0");
                this.groundRibbonSVG.appendChild(this.groundRibbonSVGShape);
            }
            this.centerSVG.appendChild(this.groundRibbonSVG);
            this.graduationScrollPosX = _left + gradWidth;
            this.graduationScrollPosY = _top + _height * 0.5;
            for (var i = 0; i < this.totalGraduations; i++) {
                var line = new Avionics.SVGGraduation();
                line.IsPrimary = true;
                if (this.nbSecondaryGraduations > 0 && (i % (this.nbSecondaryGraduations + 1)))
                    line.IsPrimary = false;
                var lineWidth = line.IsPrimary ? 15 : 4;
                line.SVGLine = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(line.SVGLine, "x", "0");
                diffAndSetAttribute(line.SVGLine, "width", lineWidth + '');
                diffAndSetAttribute(line.SVGLine, "height", "2");
                diffAndSetAttribute(line.SVGLine, "fill", "white");
                if (line.IsPrimary) {
                    line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(line.SVGText1, "x", "-28");
                    diffAndSetAttribute(line.SVGText1, "fill", "white");
                    diffAndSetAttribute(line.SVGText1, "font-size", (this.fontSize * 1) + '');
                    diffAndSetAttribute(line.SVGText1, "font-family", "Roboto-Light");
                    diffAndSetAttribute(line.SVGText1, "text-anchor", "end");
                    diffAndSetAttribute(line.SVGText1, "alignment-baseline", "central");
                    line.SVGText2 = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(line.SVGText2, "x", "-28");
                    diffAndSetAttribute(line.SVGText2, "fill", "white");
                    diffAndSetAttribute(line.SVGText2, "font-size", (this.fontSize * 0.72) + '');
                    diffAndSetAttribute(line.SVGText2, "font-family", "Roboto-Light");
                    diffAndSetAttribute(line.SVGText2, "text-anchor", "start");
                    diffAndSetAttribute(line.SVGText2, "alignment-baseline", "central");
                }
                this.graduations.push(line);
            }
            var graduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(graduationGroup, "id", "graduationGroup");
            for (var i = 0; i < this.totalGraduations; i++) {
                var line = this.graduations[i];
                graduationGroup.appendChild(line.SVGLine);
                if (line.SVGText1)
                    graduationGroup.appendChild(line.SVGText1);
                if (line.SVGText2)
                    graduationGroup.appendChild(line.SVGText2);
            }
            this.centerSVG.appendChild(graduationGroup);
            var cursorPosX = _left + 10;
            var cursorPosY = _top + _height * 0.5;
            var cursorWidth = width;
            var cursorHeight = 80;
            if (!this.cursorSVG) {
                this.cursorSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.cursorSVG, "id", "CursorGroup");
            }
            else
                Utils.RemoveAllChildren(this.cursorSVG);
            diffAndSetAttribute(this.cursorSVG, "x", cursorPosX + '');
            diffAndSetAttribute(this.cursorSVG, "y", (cursorPosY - cursorHeight * 0.5) + '');
            diffAndSetAttribute(this.cursorSVG, "width", cursorWidth + '');
            diffAndSetAttribute(this.cursorSVG, "height", cursorHeight + '');
            diffAndSetAttribute(this.cursorSVG, "viewBox", "0 0 " + cursorWidth + " " + cursorHeight);
            {
                if (!this.cursorSVGShape)
                    this.cursorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.cursorSVGShape, "fill", "black");
                diffAndSetAttribute(this.cursorSVGShape, "d", "M0 0 L95 0 L95 30 L105 40 L95 50 L95 80 L0 80 Z");
                diffAndSetAttribute(this.cursorSVGShape, "stroke", "white");
                diffAndSetAttribute(this.cursorSVGShape, "stroke-width", "0.85");
                this.cursorSVG.appendChild(this.cursorSVGShape);
                var _cursorPosX = -3;
                var _cursorPosY = cursorHeight * 0.5;
                this.cursorIntegrals[0].construct(this.cursorSVG, _cursorPosX + 63, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.25, "green");
                this.cursorIntegrals[1].construct(this.cursorSVG, _cursorPosX + 44, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.25, "green");
                this.cursorIntegrals[2].construct(this.cursorSVG, _cursorPosX + 25, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.25, "green");
                this.cursorDecimals.construct(this.cursorSVG, _cursorPosX + 95, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 0.95, "green");
                this.centerSVG.appendChild(this.cursorSVG);
            }
            var targetAltitudeIndicatorPosX = gradWidth - 13;
            var targetAltitudeIndicatorPosY = _top + _height * 0.5;
            var targetAltitudeIndicatorWidth = 100;
            var targetAltitudeIndicatorHeight = 100;
            if (!this.targetAltitudeIndicatorSVG) {
                this.targetAltitudeIndicatorSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "id", "TargetAltitudeIndicator");
            }
            else
                Utils.RemoveAllChildren(this.targetAltitudeIndicatorSVG);
            diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "x", targetAltitudeIndicatorPosX + '');
            diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "y", (targetAltitudeIndicatorPosY - targetAltitudeIndicatorHeight * 0.5) + '');
            diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "width", targetAltitudeIndicatorWidth + '');
            diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "height", targetAltitudeIndicatorHeight + '');
            diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "viewBox", "0 0 100 100");
            {
                if (!this.targetAltitudeIndicatorSVGShape)
                    this.targetAltitudeIndicatorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "fill", "none");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "stroke", "cyan");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "stroke-width", "2");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "d", "M 10 10 L 40 10 L 40 90 L 10 90 L 10 58 L 18 50 L 10 42 Z");
                this.targetAltitudeIndicatorSVG.appendChild(this.targetAltitudeIndicatorSVGShape);
            }
            this.centerSVG.appendChild(this.targetAltitudeIndicatorSVG);
        }
        this.rootGroup.appendChild(this.centerSVG);
        this.targetAltitudeBgSVG = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(this.targetAltitudeBgSVG, "fill", "black");
        diffAndSetAttribute(this.targetAltitudeBgSVG, "x", "5");
        diffAndSetAttribute(this.targetAltitudeBgSVG, "y", (posY - 40) + '');
        diffAndSetAttribute(this.targetAltitudeBgSVG, "width", "110");
        diffAndSetAttribute(this.targetAltitudeBgSVG, "height", "35");
        diffAndSetAttribute(this.targetAltitudeBgSVG, "fill", "black");
        diffAndSetAttribute(this.targetAltitudeBgSVG, "fill-opacity", "0.5");
        this.rootGroup.appendChild(this.targetAltitudeBgSVG);
        this.targetAltitudeTextSVG1 = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "x", "85");
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "y", (posY - 10) + '');
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "fill", "cyan");
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "font-size", (this.fontSize * 1.3) + '');
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "font-family", "Roboto-Light");
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "text-anchor", "end");
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "alignment-baseline", "bottom");
        this.rootGroup.appendChild(this.targetAltitudeTextSVG1);
        this.targetAltitudeTextSVG2 = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "x", "85");
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "y", (posY - 10) + '');
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "width", _width + '');
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "fill", "cyan");
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "font-size", (this.fontSize * 0.9) + '');
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "font-family", "Roboto-Light");
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "text-anchor", "start");
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "alignment-baseline", "bottom");
        this.rootGroup.appendChild(this.targetAltitudeTextSVG2);
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    construct_B747_8() {
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 250 800");
        var posX = 100;
        var posY = 0;
        var width = 105;
        var height = 640;
        var arcWidth = 70;
        this.refHeight = height;
        this.nbSecondaryGraduations = 1;
        this.totalGraduations = this.nbPrimaryGraduations + ((this.nbPrimaryGraduations - 1) * this.nbSecondaryGraduations);
        this.graduationSpacing = 80;
        this.graduationScroller = new Avionics.Scroller(this.nbPrimaryGraduations, 200, true);
        this.cursorIntegrals = new Array();
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 55, 1, 10, 10));
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 55, 1, 10, 100));
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 55, 1, 10, 1000));
        this.cursorDecimals = new Avionics.AltitudeScroller(5, 25, 20, 100);
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "Altimeter");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        var sideTextHeight = 70;
        posY += sideTextHeight * 0.5;
        this.targetAltitudeTextSVG1 = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "x", "115");
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "y", (posY + sideTextHeight * 0.5) + '');
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "fill", "#D570FF");
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "font-size", (this.fontSize * 1.6) + '');
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "text-anchor", "end");
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "alignment-baseline", "bottom");
        this.rootGroup.appendChild(this.targetAltitudeTextSVG1);
        this.targetAltitudeTextSVG2 = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "x", "115");
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "y", (posY + sideTextHeight * 0.5) + '');
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "width", width + '');
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "fill", "#D570FF");
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "font-size", (this.fontSize * 1.3) + '');
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "text-anchor", "start");
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "alignment-baseline", "bottom");
        this.rootGroup.appendChild(this.targetAltitudeTextSVG2);
        posY += sideTextHeight * 0.835;
        if (!this.centerSVG) {
            this.centerSVG = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.centerSVG, "id", "CenterGroup");
        }
        else
            Utils.RemoveAllChildren(this.centerSVG);
        diffAndSetAttribute(this.centerSVG, "x", (posX - width * 0.5) + '');
        diffAndSetAttribute(this.centerSVG, "y", posY + '');
        diffAndSetAttribute(this.centerSVG, "width", (width + arcWidth) + '');
        diffAndSetAttribute(this.centerSVG, "height", height + '');
        diffAndSetAttribute(this.centerSVG, "viewBox", "0 0 " + (width + arcWidth) + " " + height);
        {
            var _top = 0;
            var _left = 20;
            var _width = width;
            var _height = height;
            var bg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(bg, "x", _left + '');
            diffAndSetAttribute(bg, "y", _top + '');
            diffAndSetAttribute(bg, "width", _width + '');
            diffAndSetAttribute(bg, "height", _height + '');
            diffAndSetAttribute(bg, "fill", "#343B51");
            this.centerSVG.appendChild(bg);
            this.graduationScrollPosX = _left;
            this.graduationScrollPosY = _top + _height * 0.5;
            for (var i = 0; i < this.totalGraduations; i++) {
                var line = new Avionics.SVGGraduation();
                line.IsPrimary = true;
                if (this.nbSecondaryGraduations > 0 && (i % (this.nbSecondaryGraduations + 1)))
                    line.IsPrimary = false;
                var lineWidth = (line.IsPrimary) ? 22 : 22;
                var lineHeight = (line.IsPrimary) ? 3 : 3;
                line.SVGLine = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(line.SVGLine, "x", "0");
                diffAndSetAttribute(line.SVGLine, "width", lineWidth + '');
                diffAndSetAttribute(line.SVGLine, "height", lineHeight + '');
                diffAndSetAttribute(line.SVGLine, "fill", "white");
                this.centerSVG.appendChild(line.SVGLine);
                if (line.IsPrimary) {
                    var xPos = lineWidth + 40;
                    line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(line.SVGText1, "x", xPos + '');
                    diffAndSetAttribute(line.SVGText1, "y", "10");
                    diffAndSetAttribute(line.SVGText1, "fill", "white");
                    diffAndSetAttribute(line.SVGText1, "font-size", (this.fontSize * 1.15) + '');
                    diffAndSetAttribute(line.SVGText1, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(line.SVGText1, "text-anchor", "end");
                    diffAndSetAttribute(line.SVGText1, "alignment-baseline", "bottom");
                    this.centerSVG.appendChild(line.SVGText1);
                    line.SVGText2 = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(line.SVGText2, "x", xPos + '');
                    diffAndSetAttribute(line.SVGText2, "y", "10");
                    diffAndSetAttribute(line.SVGText2, "fill", "white");
                    diffAndSetAttribute(line.SVGText2, "font-size", (this.fontSize * 0.85) + '');
                    diffAndSetAttribute(line.SVGText2, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(line.SVGText2, "text-anchor", "start");
                    diffAndSetAttribute(line.SVGText2, "alignment-baseline", "bottom");
                    this.centerSVG.appendChild(line.SVGText2);
                }
                this.graduations.push(line);
            }
            this.groundRibbonHasFixedHeight = true;
            var groundRibbonPosX = _left;
            var groundRibbonPosY = 0;
            var groundRibbonWidth = _width;
            var groundRibbonHeight = 40;
            if (!this.groundRibbonSVG) {
                this.groundRibbonSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.groundRibbonSVG, "id", "GroundRibbonGroup");
            }
            else
                Utils.RemoveAllChildren(this.groundRibbonSVG);
            diffAndSetAttribute(this.groundRibbonSVG, "x", groundRibbonPosX + '');
            diffAndSetAttribute(this.groundRibbonSVG, "y", groundRibbonPosY + '');
            diffAndSetAttribute(this.groundRibbonSVG, "width", groundRibbonWidth + '');
            diffAndSetAttribute(this.groundRibbonSVG, "height", groundRibbonHeight + '');
            diffAndSetAttribute(this.groundRibbonSVG, "viewBox", "0 0 " + groundRibbonWidth + " " + groundRibbonHeight);
            {
                var dashHeight = 5;
                var dashEndPos = _height;
                var dashPos = -100;
                while (dashPos < (dashEndPos - dashHeight * 2)) {
                    let dashLine = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(dashLine, "x", "0");
                    diffAndSetAttribute(dashLine, "y", dashPos + '');
                    diffAndSetAttribute(dashLine, "width", groundRibbonWidth + '');
                    diffAndSetAttribute(dashLine, "height", dashHeight + '');
                    diffAndSetAttribute(dashLine, "transform", "skewY(45)");
                    diffAndSetAttribute(dashLine, "fill", "orange");
                    this.groundRibbonSVG.appendChild(dashLine);
                    dashPos += dashHeight * 2;
                }
                if (!this.groundRibbonSVGShape)
                    this.groundRibbonSVGShape = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(this.groundRibbonSVGShape, "fill", "orange");
                diffAndSetAttribute(this.groundRibbonSVGShape, "stroke", "orange");
                diffAndSetAttribute(this.groundRibbonSVGShape, "stroke-width", "2");
                diffAndSetAttribute(this.groundRibbonSVGShape, "width", groundRibbonWidth + '');
                diffAndSetAttribute(this.groundRibbonSVGShape, "height", "5");
                diffAndSetAttribute(this.groundRibbonSVGShape, "x", "0");
                this.groundRibbonSVG.appendChild(this.groundRibbonSVGShape);
            }
            this.centerSVG.appendChild(this.groundRibbonSVG);
            let singleLineHeight = 500 * this.graduationSpacing * (this.nbSecondaryGraduations + 1) / this.graduationScroller.increment;
            let groundStripPosX = _left;
            let groundStripPosY = 0;
            let groundStripWidth = width;
            this.groundLineSVGHeight = singleLineHeight * 2;
            if (!this.groundLineSVG) {
                this.groundLineSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.groundLineSVG, "id", "GroundLineGroup");
            }
            else
                Utils.RemoveAllChildren(this.groundLineSVG);
            diffAndSetAttribute(this.groundLineSVG, "x", groundStripPosX + '');
            diffAndSetAttribute(this.groundLineSVG, "y", groundStripPosY + '');
            diffAndSetAttribute(this.groundLineSVG, "width", groundStripWidth + '');
            diffAndSetAttribute(this.groundLineSVG, "height", this.groundLineSVGHeight + '');
            diffAndSetAttribute(this.groundLineSVG, "viewBox", "0 0 " + groundStripWidth + " " + this.groundLineSVGHeight);
            {
                let whiteLine = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(whiteLine, "fill", "white");
                diffAndSetAttribute(whiteLine, "x", "0");
                diffAndSetAttribute(whiteLine, "y", "0");
                diffAndSetAttribute(whiteLine, "width", "5");
                diffAndSetAttribute(whiteLine, "height", singleLineHeight + '');
                this.groundLineSVG.appendChild(whiteLine);
                let amberLine = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(amberLine, "fill", "orange");
                diffAndSetAttribute(amberLine, "x", "0");
                diffAndSetAttribute(amberLine, "y", singleLineHeight + '');
                diffAndSetAttribute(amberLine, "width", "5");
                diffAndSetAttribute(amberLine, "height", singleLineHeight + '');
                this.groundLineSVG.appendChild(amberLine);
            }
            this.centerSVG.appendChild(this.groundLineSVG);
            this.thousandIndicator = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.thousandIndicator, "id", "thousandGroup");
            {
                let topLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(topLine, "x1", (_left + 5) + '');
                diffAndSetAttribute(topLine, "y1", "-18");
                diffAndSetAttribute(topLine, "x2", _width + '');
                diffAndSetAttribute(topLine, "y2", "-18");
                diffAndSetAttribute(topLine, "stroke", "white");
                diffAndSetAttribute(topLine, "stroke-width", "3");
                this.thousandIndicator.appendChild(topLine);
                let bottomLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(bottomLine, "x1", (_left + 5) + '');
                diffAndSetAttribute(bottomLine, "y1", "18");
                diffAndSetAttribute(bottomLine, "x2", _width + '');
                diffAndSetAttribute(bottomLine, "y2", "18");
                diffAndSetAttribute(bottomLine, "stroke", "white");
                diffAndSetAttribute(bottomLine, "stroke-width", "3");
                this.thousandIndicator.appendChild(bottomLine);
            }
            this.centerSVG.appendChild(this.thousandIndicator);
            var targetAltitudeIndicatorWidth = 100;
            var targetAltitudeIndicatorHeight = 100;
            var targetAltitudeIndicatorPosX = 0;
            if (!this.targetAltitudeIndicatorSVG) {
                this.targetAltitudeIndicatorSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "id", "TargetAltitudeIndicator");
            }
            else
                Utils.RemoveAllChildren(this.targetAltitudeIndicatorSVG);
            diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "x", targetAltitudeIndicatorPosX + '');
            diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "width", targetAltitudeIndicatorWidth + '');
            diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "height", targetAltitudeIndicatorHeight + '');
            diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "viewBox", "0 0 100 100");
            {
                if (!this.targetAltitudeIndicatorSVGShape)
                    this.targetAltitudeIndicatorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "fill", "none");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "stroke", "#D570FF");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "stroke-width", "2");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "d", "M 10 10 L 50 10 L 50 90 L 10 90 L 10 60 L 18 50 L 10 40 Z");
                this.targetAltitudeIndicatorSVG.appendChild(this.targetAltitudeIndicatorSVGShape);
            }
            this.centerSVG.appendChild(this.targetAltitudeIndicatorSVG);
            var cursorPosX = _left + 15;
            var cursorPosY = _top + _height * 0.5 + 2;
            var cursorWidth = width + arcWidth;
            var cursorHeight = 80;
            if (!this.cursorSVG) {
                this.cursorSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.cursorSVG, "id", "CursorGroup");
            }
            else
                Utils.RemoveAllChildren(this.cursorSVG);
            diffAndSetAttribute(this.cursorSVG, "x", cursorPosX + '');
            diffAndSetAttribute(this.cursorSVG, "y", (cursorPosY - cursorHeight * 0.5) + '');
            diffAndSetAttribute(this.cursorSVG, "width", cursorWidth + '');
            diffAndSetAttribute(this.cursorSVG, "height", cursorHeight + '');
            diffAndSetAttribute(this.cursorSVG, "viewBox", "0 0 " + cursorWidth + " " + cursorHeight);
            {
                var _cursorPosX = 21;
                var _cursorPosY = cursorHeight * 0.5;
                if (!this.cursorSVGShape)
                    this.cursorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.cursorSVGShape, "fill", "black");
                diffAndSetAttribute(this.cursorSVGShape, "d", "M 15 0 L 130 0 L 130 80 L 15 80 L 15 53 L 0 40 L 15 27 Z");
                diffAndSetAttribute(this.cursorSVGShape, "stroke", "white");
                diffAndSetAttribute(this.cursorSVGShape, "stroke-width", this.strokeSize);
                this.cursorSVG.appendChild(this.cursorSVGShape);
                this.cursorIntegrals[0].construct(this.cursorSVG, _cursorPosX + 69, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.6, "white");
                this.cursorIntegrals[1].construct(this.cursorSVG, _cursorPosX + 44, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.6, "white");
                this.cursorIntegrals[2].construct(this.cursorSVG, _cursorPosX + 19, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.6, "white");
                this.cursorDecimals.construct(this.cursorSVG, _cursorPosX + 104, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.15, "white");
                if (!this.cursorSVGAltitudeLevelShape)
                    this.cursorSVGAltitudeLevelShape = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(this.cursorSVGAltitudeLevelShape, "fill", "#24F000");
                diffAndSetAttribute(this.cursorSVGAltitudeLevelShape, "x", "18");
                diffAndSetAttribute(this.cursorSVGAltitudeLevelShape, "y", ((cursorHeight * 0.62) * 0.5) + '');
                diffAndSetAttribute(this.cursorSVGAltitudeLevelShape, "width", "20");
                diffAndSetAttribute(this.cursorSVGAltitudeLevelShape, "height", (cursorHeight * 0.4) + '');
                this.cursorSVG.appendChild(this.cursorSVGAltitudeLevelShape);
            }
            this.centerSVG.appendChild(this.cursorSVG);
        }
        this.rootGroup.appendChild(this.centerSVG);
        let mtrsGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(mtrsGroup, "id", "MetersGroup");
        {
            this.mtrsSelectedGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.mtrsSelectedGroup, "id", "SelectedGroup");
            {
                this.mtrsSelectedSVGText = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetAttribute(this.mtrsSelectedSVGText, "x", "158");
                diffAndSetAttribute(this.mtrsSelectedSVGText, "y", (sideTextHeight * 0.5) + '');
                diffAndSetAttribute(this.mtrsSelectedSVGText, "fill", "#D570FF");
                diffAndSetAttribute(this.mtrsSelectedSVGText, "font-size", (this.fontSize * 1.2) + '');
                diffAndSetAttribute(this.mtrsSelectedSVGText, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.mtrsSelectedSVGText, "text-anchor", "end");
                diffAndSetAttribute(this.mtrsSelectedSVGText, "alignment-baseline", "bottom");
                this.mtrsSelectedGroup.appendChild(this.mtrsSelectedSVGText);
                var mtrsSelectedSVGUnit = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(mtrsSelectedSVGUnit, "M");
                diffAndSetAttribute(mtrsSelectedSVGUnit, "x", "158");
                diffAndSetAttribute(mtrsSelectedSVGUnit, "y", (sideTextHeight * 0.5) + '');
                diffAndSetAttribute(mtrsSelectedSVGUnit, "fill", "cyan");
                diffAndSetAttribute(mtrsSelectedSVGUnit, "font-size", (this.fontSize * 0.9) + '');
                diffAndSetAttribute(mtrsSelectedSVGUnit, "font-family", "Roboto-Bold");
                diffAndSetAttribute(mtrsSelectedSVGUnit, "text-anchor", "start");
                diffAndSetAttribute(mtrsSelectedSVGUnit, "alignment-baseline", "bottom");
                this.mtrsSelectedGroup.appendChild(mtrsSelectedSVGUnit);
            }
            mtrsGroup.appendChild(this.mtrsSelectedGroup);
            var mtrsCursorPosX = _left + 62.5;
            var mtrsCursorPosY = _top + _height * 0.558;
            var mtrsCursorWidth = width + arcWidth;
            var mtrsCursorHeight = 36;
            this.mtrsCursorGroup = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.mtrsCursorGroup, "id", "MetersCursorGroup");
            diffAndSetAttribute(this.mtrsCursorGroup, "x", mtrsCursorPosX + '');
            diffAndSetAttribute(this.mtrsCursorGroup, "y", (mtrsCursorPosY - mtrsCursorHeight * 0.5) + '');
            diffAndSetAttribute(this.mtrsCursorGroup, "width", mtrsCursorWidth + '');
            diffAndSetAttribute(this.mtrsCursorGroup, "height", mtrsCursorHeight + '');
            diffAndSetAttribute(this.mtrsCursorGroup, "viewBox", "0 0 " + mtrsCursorWidth + " " + mtrsCursorHeight);
            {
                var mtrsCursorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(mtrsCursorSVGShape, "fill", "black");
                diffAndSetAttribute(mtrsCursorSVGShape, "d", "M 15 0 L 130 0 L 130 36 L 15 36 Z");
                diffAndSetAttribute(mtrsCursorSVGShape, "stroke", "white");
                diffAndSetAttribute(mtrsCursorSVGShape, "stroke-width", this.strokeSize);
                this.mtrsCursorGroup.appendChild(mtrsCursorSVGShape);
                this.mtrsCursorSVGText = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetAttribute(this.mtrsCursorSVGText, "x", "110");
                diffAndSetAttribute(this.mtrsCursorSVGText, "y", (mtrsCursorHeight * 0.84) + '');
                diffAndSetAttribute(this.mtrsCursorSVGText, "fill", "white");
                diffAndSetAttribute(this.mtrsCursorSVGText, "font-size", (this.fontSize * 1.2) + '');
                diffAndSetAttribute(this.mtrsCursorSVGText, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.mtrsCursorSVGText, "text-anchor", "end");
                diffAndSetAttribute(this.mtrsCursorSVGText, "alignment-baseline", "bottom");
                this.mtrsCursorGroup.appendChild(this.mtrsCursorSVGText);
                let mtrsCursorSVGUnit = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(mtrsCursorSVGUnit, "M");
                diffAndSetAttribute(mtrsCursorSVGUnit, "x", "110");
                diffAndSetAttribute(mtrsCursorSVGUnit, "y", (mtrsCursorHeight * 0.84) + '');
                diffAndSetAttribute(mtrsCursorSVGUnit, "fill", "cyan");
                diffAndSetAttribute(mtrsCursorSVGUnit, "font-size", (this.fontSize * 0.9) + '');
                diffAndSetAttribute(mtrsCursorSVGUnit, "font-family", "Roboto-Bold");
                diffAndSetAttribute(mtrsCursorSVGUnit, "text-anchor", "start");
                diffAndSetAttribute(mtrsCursorSVGUnit, "alignment-baseline", "bottom");
                this.mtrsCursorGroup.appendChild(mtrsCursorSVGUnit);
            }
            mtrsGroup.appendChild(this.mtrsCursorGroup);
        }
        this.rootGroup.appendChild(mtrsGroup);
        if (!this.minimumReferenceModeText) {
            this.minimumReferenceModeText = document.createElementNS(Avionics.SVG.NS, "text");
        }
        diffAndSetText(this.minimumReferenceModeText, "BARO");
        diffAndSetAttribute(this.minimumReferenceModeText, "x", "62");
        diffAndSetAttribute(this.minimumReferenceModeText, "y", (posY + height - 45) + '');
        diffAndSetAttribute(this.minimumReferenceModeText, "fill", (this.isHud) ? "lime" : "#24F000");
        diffAndSetAttribute(this.minimumReferenceModeText, "font-size", (this.fontSize * 0.9) + '');
        diffAndSetAttribute(this.minimumReferenceModeText, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.minimumReferenceModeText, "text-anchor", "end");
        diffAndSetAttribute(this.minimumReferenceModeText, "letter-spacing", "-1px");
        this.rootGroup.appendChild(this.minimumReferenceModeText);
        if (!this.minimumReferenceValueText) {
            this.minimumReferenceValueText = document.createElementNS(Avionics.SVG.NS, "text");
        }
        diffAndSetText(this.minimumReferenceValueText, "210");
        diffAndSetAttribute(this.minimumReferenceValueText, "x", "62");
        diffAndSetAttribute(this.minimumReferenceValueText, "y", (posY + height - 15) + '');
        diffAndSetAttribute(this.minimumReferenceValueText, "fill", (this.isHud) ? "lime" : "#24F000");
        diffAndSetAttribute(this.minimumReferenceValueText, "font-size", (this.fontSize) + '');
        diffAndSetAttribute(this.minimumReferenceValueText, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.minimumReferenceValueText, "text-anchor", "end");
        diffAndSetAttribute(this.minimumReferenceValueText, "letter-spacing", "-1px");
        this.rootGroup.appendChild(this.minimumReferenceValueText);
        if (!this.minimumReferenceCursor) {
            this.minimumReferenceCursor = document.createElementNS(Avionics.SVG.NS, "path");
        }
        diffAndSetAttribute(this.minimumReferenceCursor, "fill", "none");
        diffAndSetAttribute(this.minimumReferenceCursor, "d", "M 25 0 L 2 25 L 2 -25 L 25 0 L 120 0");
        diffAndSetAttribute(this.minimumReferenceCursor, "stroke", (this.isHud) ? "lime" : "#24F000");
        diffAndSetAttribute(this.minimumReferenceCursor, "stroke-width", this.strokeSize);
        this.centerSVG.appendChild(this.minimumReferenceCursor);
        if (!this.pressureSVG)
            this.pressureSVG = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetText(this.pressureSVG, "");
        diffAndSetAttribute(this.pressureSVG, "x", "170");
        diffAndSetAttribute(this.pressureSVG, "y", (posY + height + sideTextHeight * 0.5) + '');
        diffAndSetAttribute(this.pressureSVG, "fill", "#24F000");
        diffAndSetAttribute(this.pressureSVG, "font-size", (this.fontSize * 1.0) + '');
        diffAndSetAttribute(this.pressureSVG, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.pressureSVG, "text-anchor", "end");
        diffAndSetAttribute(this.pressureSVG, "alignment-baseline", "central");
        diffAndSetAttribute(this.pressureSVG, "letter-spacing", "-3px");
        this.rootGroup.appendChild(this.pressureSVG);
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    construct_AS01B() {
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 250 800");
        var posX = 100;
        var posY = 30;
        var width = 105;
        var height = 640;
        var arcWidth = 70;
        this.refHeight = height;
        this.nbSecondaryGraduations = 1;
        this.totalGraduations = this.nbPrimaryGraduations + ((this.nbPrimaryGraduations - 1) * this.nbSecondaryGraduations);
        this.graduationSpacing = 80;
        this.graduationScroller = new Avionics.Scroller(this.nbPrimaryGraduations, 200, true);
        this.cursorIntegrals = new Array();
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 55, 1, 10, 10));
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 55, 1, 10, 100));
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 55, 1, 10, 1000));
        this.cursorDecimals = new Avionics.AltitudeScroller(5, 25, 20, 100);
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "Altimeter");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        var sideTextHeight = 75;
        if (!this.isHud) {
            this.targetAltitudeBgSVG = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.targetAltitudeBgSVG, "x", "67.5");
            diffAndSetAttribute(this.targetAltitudeBgSVG, "y", (posY + 15) + '');
            diffAndSetAttribute(this.targetAltitudeBgSVG, "width", "105");
            diffAndSetAttribute(this.targetAltitudeBgSVG, "height", "44");
            diffAndSetAttribute(this.targetAltitudeBgSVG, "fill", "black");
            this.rootGroup.appendChild(this.targetAltitudeBgSVG);
        }
        this.targetAltitudeTextSVG1 = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "x", "115");
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "y", (posY + sideTextHeight * 0.5 + 12) + '');
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "fill", (this.isHud) ? "lime" : "#D570FF");
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "font-size", (this.fontSize * 1.55) + '');
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "text-anchor", "end");
        diffAndSetAttribute(this.targetAltitudeTextSVG1, "alignment-baseline", "bottom");
        this.rootGroup.appendChild(this.targetAltitudeTextSVG1);
        this.targetAltitudeTextSVG2 = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "x", "115");
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "y", (posY + sideTextHeight * 0.5 + 12) + '');
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "width", width + '');
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "fill", (this.isHud) ? "lime" : "#D570FF");
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "font-size", (this.fontSize * 1.25) + '');
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "text-anchor", "start");
        diffAndSetAttribute(this.targetAltitudeTextSVG2, "alignment-baseline", "bottom");
        this.rootGroup.appendChild(this.targetAltitudeTextSVG2);
        posY += sideTextHeight;
        if (!this.centerSVG) {
            this.centerSVG = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.centerSVG, "id", "CenterGroup");
        }
        else
            Utils.RemoveAllChildren(this.centerSVG);
        diffAndSetAttribute(this.centerSVG, "x", (posX - width * 0.5) + '');
        diffAndSetAttribute(this.centerSVG, "y", posY + '');
        diffAndSetAttribute(this.centerSVG, "width", (width + arcWidth) + '');
        diffAndSetAttribute(this.centerSVG, "height", height + '');
        diffAndSetAttribute(this.centerSVG, "viewBox", "0 0 " + (width + arcWidth) + " " + height);
        {
            var _top = 0;
            var _left = 20;
            var _width = width;
            var _height = height;
            if (this.isHud) {
                var topLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(topLine, "x1", _left + '');
                diffAndSetAttribute(topLine, "y1", _top + '');
                diffAndSetAttribute(topLine, "x2", (_left + _width) + '');
                diffAndSetAttribute(topLine, "y2", _top + '');
                diffAndSetAttribute(topLine, "stroke", "lime");
                diffAndSetAttribute(topLine, "stroke-width", "6");
                this.centerSVG.appendChild(topLine);
                var verticalLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(verticalLine, "x1", _left + '');
                diffAndSetAttribute(verticalLine, "y1", _top + '');
                diffAndSetAttribute(verticalLine, "x2", _left + '');
                diffAndSetAttribute(verticalLine, "y2", (_top + _height) + '');
                diffAndSetAttribute(verticalLine, "stroke", "lime");
                diffAndSetAttribute(verticalLine, "stroke-width", "6");
                this.centerSVG.appendChild(verticalLine);
                var bottomLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(bottomLine, "x1", _left + '');
                diffAndSetAttribute(bottomLine, "y1", (_top + _height) + '');
                diffAndSetAttribute(bottomLine, "x2", (_left + _width) + '');
                diffAndSetAttribute(bottomLine, "y2", (_top + _height) + '');
                diffAndSetAttribute(bottomLine, "stroke", "lime");
                diffAndSetAttribute(bottomLine, "stroke-width", "6");
                this.centerSVG.appendChild(bottomLine);
            }
            else {
                var bg = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(bg, "x", _left + '');
                diffAndSetAttribute(bg, "y", _top + '');
                diffAndSetAttribute(bg, "width", _width + '');
                diffAndSetAttribute(bg, "height", _height + '');
                diffAndSetAttribute(bg, "fill", "black");
                diffAndSetAttribute(bg, "fill-opacity", "0.3");
                this.centerSVG.appendChild(bg);
            }
            this.graduationScrollPosX = _left;
            this.graduationScrollPosY = _top + _height * 0.5;
            for (var i = 0; i < this.totalGraduations; i++) {
                var line = new Avionics.SVGGraduation();
                line.IsPrimary = true;
                if (this.nbSecondaryGraduations > 0 && (i % (this.nbSecondaryGraduations + 1)))
                    line.IsPrimary = false;
                var lineWidth = (line.IsPrimary) ? 22 : 22;
                var lineHeight = (line.IsPrimary) ? 3 : 3;
                line.SVGLine = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(line.SVGLine, "x", "0");
                diffAndSetAttribute(line.SVGLine, "width", lineWidth + '');
                diffAndSetAttribute(line.SVGLine, "height", lineHeight + '');
                diffAndSetAttribute(line.SVGLine, "fill", (this.isHud) ? "lime" : "white");
                this.centerSVG.appendChild(line.SVGLine);
                if (line.IsPrimary) {
                    var xPos = lineWidth + 40;
                    line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(line.SVGText1, "x", xPos + '');
                    diffAndSetAttribute(line.SVGText1, "y", "10");
                    diffAndSetAttribute(line.SVGText1, "fill", (this.isHud) ? "lime" : "white");
                    diffAndSetAttribute(line.SVGText1, "font-size", (this.fontSize * 1.15) + '');
                    diffAndSetAttribute(line.SVGText1, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(line.SVGText1, "text-anchor", "end");
                    diffAndSetAttribute(line.SVGText1, "alignment-baseline", "bottom");
                    this.centerSVG.appendChild(line.SVGText1);
                    line.SVGText2 = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(line.SVGText2, "x", xPos + '');
                    diffAndSetAttribute(line.SVGText2, "y", "10");
                    diffAndSetAttribute(line.SVGText2, "fill", (this.isHud) ? "lime" : "white");
                    diffAndSetAttribute(line.SVGText2, "font-size", (this.fontSize * 0.85) + '');
                    diffAndSetAttribute(line.SVGText2, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(line.SVGText2, "text-anchor", "start");
                    diffAndSetAttribute(line.SVGText2, "alignment-baseline", "bottom");
                    this.centerSVG.appendChild(line.SVGText2);
                }
                this.graduations.push(line);
            }
            this.groundRibbonHasFixedHeight = true;
            var groundRibbonPosX = _left;
            var groundRibbonPosY = 0;
            var groundRibbonWidth = _width;
            var groundRibbonHeight = 40;
            if (!this.groundRibbonSVG) {
                this.groundRibbonSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.groundRibbonSVG, "id", "GroundRibbonGroup");
            }
            else
                Utils.RemoveAllChildren(this.groundRibbonSVG);
            diffAndSetAttribute(this.groundRibbonSVG, "x", groundRibbonPosX + '');
            diffAndSetAttribute(this.groundRibbonSVG, "y", groundRibbonPosY + '');
            diffAndSetAttribute(this.groundRibbonSVG, "width", groundRibbonWidth + '');
            diffAndSetAttribute(this.groundRibbonSVG, "height", groundRibbonHeight + '');
            diffAndSetAttribute(this.groundRibbonSVG, "viewBox", "0 0 " + groundRibbonWidth + " " + groundRibbonHeight);
            {
                var dashHeight = 5;
                var dashEndPos = _height;
                var dashPos = -100;
                while (dashPos < (dashEndPos - dashHeight * 2)) {
                    let dashLine = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(dashLine, "x", "0");
                    diffAndSetAttribute(dashLine, "y", dashPos + '');
                    diffAndSetAttribute(dashLine, "width", groundRibbonWidth + '');
                    diffAndSetAttribute(dashLine, "height", dashHeight + '');
                    diffAndSetAttribute(dashLine, "transform", "skewY(45)");
                    diffAndSetAttribute(dashLine, "fill", (this.isHud) ? "lime" : "orange");
                    this.groundRibbonSVG.appendChild(dashLine);
                    dashPos += dashHeight * 2;
                }
                if (!this.groundRibbonSVGShape)
                    this.groundRibbonSVGShape = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(this.groundRibbonSVGShape, "fill", (this.isHud) ? "lime" : "orange");
                diffAndSetAttribute(this.groundRibbonSVGShape, "stroke", (this.isHud) ? "lime" : "orange");
                diffAndSetAttribute(this.groundRibbonSVGShape, "stroke-width", "2");
                diffAndSetAttribute(this.groundRibbonSVGShape, "width", groundRibbonWidth + '');
                diffAndSetAttribute(this.groundRibbonSVGShape, "height", "5");
                diffAndSetAttribute(this.groundRibbonSVGShape, "x", "0");
                this.groundRibbonSVG.appendChild(this.groundRibbonSVGShape);
            }
            this.centerSVG.appendChild(this.groundRibbonSVG);
            let singleLineHeight = 500 * this.graduationSpacing * (this.nbSecondaryGraduations + 1) / this.graduationScroller.increment;
            let groundStripPosX = _left - 6;
            let groundStripPosY = 0;
            let groundStripWidth = width;
            this.groundLineSVGHeight = singleLineHeight * 2;
            if (!this.groundLineSVG) {
                this.groundLineSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.groundLineSVG, "id", "GroundLineGroup");
            }
            else
                Utils.RemoveAllChildren(this.groundLineSVG);
            diffAndSetAttribute(this.groundLineSVG, "x", groundStripPosX + '');
            diffAndSetAttribute(this.groundLineSVG, "y", groundStripPosY + '');
            diffAndSetAttribute(this.groundLineSVG, "width", groundStripWidth + '');
            diffAndSetAttribute(this.groundLineSVG, "height", this.groundLineSVGHeight + '');
            diffAndSetAttribute(this.groundLineSVG, "viewBox", "0 0 " + groundStripWidth + " " + this.groundLineSVGHeight);
            {
                let whiteLine = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(whiteLine, "fill", (this.isHud) ? "lime" : "white");
                diffAndSetAttribute(whiteLine, "x", "0");
                diffAndSetAttribute(whiteLine, "y", "0");
                diffAndSetAttribute(whiteLine, "width", "6");
                diffAndSetAttribute(whiteLine, "height", singleLineHeight + '');
                this.groundLineSVG.appendChild(whiteLine);
                let amberLine = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(amberLine, "fill", (this.isHud) ? "lime" : "orange");
                diffAndSetAttribute(amberLine, "x", "0");
                diffAndSetAttribute(amberLine, "y", singleLineHeight + '');
                diffAndSetAttribute(amberLine, "width", "6");
                diffAndSetAttribute(amberLine, "height", singleLineHeight + '');
                this.groundLineSVG.appendChild(amberLine);
            }
            this.centerSVG.appendChild(this.groundLineSVG);
            this.thousandIndicator = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.thousandIndicator, "id", "thousandGroup");
            {
                let topLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(topLine, "x1", (_left + 5) + '');
                diffAndSetAttribute(topLine, "y1", "-18");
                diffAndSetAttribute(topLine, "x2", _width + '');
                diffAndSetAttribute(topLine, "y2", "-18");
                diffAndSetAttribute(topLine, "stroke", (this.isHud) ? "lime" : "white");
                diffAndSetAttribute(topLine, "stroke-width", "3");
                this.thousandIndicator.appendChild(topLine);
                let bottomLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(bottomLine, "x1", (_left + 5) + '');
                diffAndSetAttribute(bottomLine, "y1", "18");
                diffAndSetAttribute(bottomLine, "x2", _width + '');
                diffAndSetAttribute(bottomLine, "y2", "18");
                diffAndSetAttribute(bottomLine, "stroke", (this.isHud) ? "lime" : "white");
                diffAndSetAttribute(bottomLine, "stroke-width", "3");
                this.thousandIndicator.appendChild(bottomLine);
            }
            this.centerSVG.appendChild(this.thousandIndicator);
            var targetAltitudeIndicatorWidth = 100;
            var targetAltitudeIndicatorHeight = 100;
            var targetAltitudeIndicatorPosX = 0;
            if (!this.targetAltitudeIndicatorSVG) {
                this.targetAltitudeIndicatorSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "id", "TargetAltitudeIndicator");
            }
            else
                Utils.RemoveAllChildren(this.targetAltitudeIndicatorSVG);
            diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "x", targetAltitudeIndicatorPosX + '');
            diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "width", targetAltitudeIndicatorWidth + '');
            diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "height", targetAltitudeIndicatorHeight + '');
            diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "viewBox", "0 0 100 100");
            {
                if (!this.targetAltitudeIndicatorSVGShape)
                    this.targetAltitudeIndicatorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "fill", "none");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "stroke", (this.isHud) ? "lime" : "#D570FF");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "stroke-width", "2");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "d", "M 10 20 L 55 20 L 55 80 L 10 80 L 10 60 L 18 50 L 10 40 Z");
                this.targetAltitudeIndicatorSVG.appendChild(this.targetAltitudeIndicatorSVGShape);
            }
            this.centerSVG.appendChild(this.targetAltitudeIndicatorSVG);
            var cursorPosX = _left + 15;
            var cursorPosY = _top + _height * 0.5 + 2;
            var cursorWidth = width + arcWidth;
            var cursorHeight = 80;
            if (!this.cursorSVG) {
                this.cursorSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.cursorSVG, "id", "CursorGroup");
            }
            else
                Utils.RemoveAllChildren(this.cursorSVG);
            diffAndSetAttribute(this.cursorSVG, "x", cursorPosX + '');
            diffAndSetAttribute(this.cursorSVG, "y", (cursorPosY - cursorHeight * 0.5) + '');
            diffAndSetAttribute(this.cursorSVG, "width", cursorWidth + '');
            diffAndSetAttribute(this.cursorSVG, "height", cursorHeight + '');
            diffAndSetAttribute(this.cursorSVG, "viewBox", "0 0 " + cursorWidth + " " + cursorHeight);
            {
                var _cursorPosX = 21;
                var _cursorPosY = cursorHeight * 0.5;
                if (!this.cursorSVGShape)
                    this.cursorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.cursorSVGShape, "fill", "black");
                diffAndSetAttribute(this.cursorSVGShape, "d", "M 15 0 L 130 0 L 130 80 L 15 80 L 15 53 L 0 40 L 15 27 Z");
                diffAndSetAttribute(this.cursorSVGShape, "stroke", (this.isHud) ? "lime" : "white");
                diffAndSetAttribute(this.cursorSVGShape, "stroke-width", this.strokeSize);
                this.cursorSVG.appendChild(this.cursorSVGShape);
                this.cursorIntegrals[0].construct(this.cursorSVG, _cursorPosX + 69, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.6, (this.isHud) ? "lime" : "white");
                this.cursorIntegrals[1].construct(this.cursorSVG, _cursorPosX + 44, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.6, (this.isHud) ? "lime" : "white");
                this.cursorIntegrals[2].construct(this.cursorSVG, _cursorPosX + 19, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.6, (this.isHud) ? "lime" : "white");
                this.cursorDecimals.construct(this.cursorSVG, _cursorPosX + 104, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.15, (this.isHud) ? "lime" : "white");
                if (!this.cursorSVGAltitudeLevelShape)
                    this.cursorSVGAltitudeLevelShape = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(this.cursorSVGAltitudeLevelShape, "fill", (this.isHud) ? "lime" : "#24F000");
                diffAndSetAttribute(this.cursorSVGAltitudeLevelShape, "x", "18");
                diffAndSetAttribute(this.cursorSVGAltitudeLevelShape, "y", ((cursorHeight * 0.62) * 0.5) + '');
                diffAndSetAttribute(this.cursorSVGAltitudeLevelShape, "width", "20");
                diffAndSetAttribute(this.cursorSVGAltitudeLevelShape, "height", (cursorHeight * 0.4) + '');
                this.cursorSVG.appendChild(this.cursorSVGAltitudeLevelShape);
            }
            this.centerSVG.appendChild(this.cursorSVG);
        }
        this.rootGroup.appendChild(this.centerSVG);
        let mtrsGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(mtrsGroup, "id", "MetersGroup");
        {
            this.mtrsSelectedGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.mtrsSelectedGroup, "id", "SelectedGroup");
            {
                if (!this.isHud) {
                    let bg = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(bg, "x", "67");
                    diffAndSetAttribute(bg, "y", "0");
                    diffAndSetAttribute(bg, "width", "105");
                    diffAndSetAttribute(bg, "height", "30");
                    diffAndSetAttribute(bg, "fill", "black");
                    diffAndSetAttribute(bg, "fill-opacity", "0.5");
                    this.mtrsSelectedGroup.appendChild(bg);
                }
                this.mtrsSelectedSVGText = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetAttribute(this.mtrsSelectedSVGText, "x", "158");
                diffAndSetAttribute(this.mtrsSelectedSVGText, "y", "25");
                diffAndSetAttribute(this.mtrsSelectedSVGText, "fill", (this.isHud) ? "lime" : "#D570FF");
                diffAndSetAttribute(this.mtrsSelectedSVGText, "font-size", (this.fontSize * 1.2) + '');
                diffAndSetAttribute(this.mtrsSelectedSVGText, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.mtrsSelectedSVGText, "text-anchor", "end");
                diffAndSetAttribute(this.mtrsSelectedSVGText, "alignment-baseline", "bottom");
                this.mtrsSelectedGroup.appendChild(this.mtrsSelectedSVGText);
                var mtrsSelectedSVGUnit = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(mtrsSelectedSVGUnit, "M");
                diffAndSetAttribute(mtrsSelectedSVGUnit, "x", "158");
                diffAndSetAttribute(mtrsSelectedSVGUnit, "y", "25");
                diffAndSetAttribute(mtrsSelectedSVGUnit, "fill", (this.isHud) ? "lime" : "cyan");
                diffAndSetAttribute(mtrsSelectedSVGUnit, "font-size", (this.fontSize * 0.9) + '');
                diffAndSetAttribute(mtrsSelectedSVGUnit, "font-family", "Roboto-Bold");
                diffAndSetAttribute(mtrsSelectedSVGUnit, "text-anchor", "start");
                diffAndSetAttribute(mtrsSelectedSVGUnit, "alignment-baseline", "bottom");
                this.mtrsSelectedGroup.appendChild(mtrsSelectedSVGUnit);
            }
            mtrsGroup.appendChild(this.mtrsSelectedGroup);
            var mtrsCursorPosX = _left + 62.5;
            var mtrsCursorPosY = _top + _height * 0.578;
            var mtrsCursorWidth = width + arcWidth;
            var mtrsCursorHeight = 36;
            this.mtrsCursorGroup = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.mtrsCursorGroup, "id", "MetersCursorGroup");
            diffAndSetAttribute(this.mtrsCursorGroup, "x", mtrsCursorPosX + '');
            diffAndSetAttribute(this.mtrsCursorGroup, "y", (mtrsCursorPosY - mtrsCursorHeight * 0.5) + '');
            diffAndSetAttribute(this.mtrsCursorGroup, "width", mtrsCursorWidth + '');
            diffAndSetAttribute(this.mtrsCursorGroup, "height", mtrsCursorHeight + '');
            diffAndSetAttribute(this.mtrsCursorGroup, "viewBox", "0 0 " + mtrsCursorWidth + " " + mtrsCursorHeight);
            {
                var mtrsCursorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(mtrsCursorSVGShape, "fill", "black");
                diffAndSetAttribute(mtrsCursorSVGShape, "d", "M 15 0 L 130 0 L 130 36 L 15 36 Z");
                diffAndSetAttribute(mtrsCursorSVGShape, "stroke", (this.isHud) ? "lime" : "white");
                diffAndSetAttribute(mtrsCursorSVGShape, "stroke-width", this.strokeSize);
                this.mtrsCursorGroup.appendChild(mtrsCursorSVGShape);
                this.mtrsCursorSVGText = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetAttribute(this.mtrsCursorSVGText, "x", "110");
                diffAndSetAttribute(this.mtrsCursorSVGText, "y", (mtrsCursorHeight * 0.84) + '');
                diffAndSetAttribute(this.mtrsCursorSVGText, "fill", (this.isHud) ? "lime" : "white");
                diffAndSetAttribute(this.mtrsCursorSVGText, "font-size", (this.fontSize * 1.2) + '');
                diffAndSetAttribute(this.mtrsCursorSVGText, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.mtrsCursorSVGText, "text-anchor", "end");
                diffAndSetAttribute(this.mtrsCursorSVGText, "alignment-baseline", "bottom");
                this.mtrsCursorGroup.appendChild(this.mtrsCursorSVGText);
                let mtrsCursorSVGUnit = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(mtrsCursorSVGUnit, "M");
                diffAndSetAttribute(mtrsCursorSVGUnit, "x", "110");
                diffAndSetAttribute(mtrsCursorSVGUnit, "y", (mtrsCursorHeight * 0.84) + '');
                diffAndSetAttribute(mtrsCursorSVGUnit, "fill", (this.isHud) ? "lime" : "cyan");
                diffAndSetAttribute(mtrsCursorSVGUnit, "font-size", (this.fontSize * 0.9) + '');
                diffAndSetAttribute(mtrsCursorSVGUnit, "font-family", "Roboto-Bold");
                diffAndSetAttribute(mtrsCursorSVGUnit, "text-anchor", "start");
                diffAndSetAttribute(mtrsCursorSVGUnit, "alignment-baseline", "bottom");
                this.mtrsCursorGroup.appendChild(mtrsCursorSVGUnit);
            }
            mtrsGroup.appendChild(this.mtrsCursorGroup);
        }
        this.rootGroup.appendChild(mtrsGroup);
        if (!this.minimumReferenceModeText) {
            this.minimumReferenceModeText = document.createElementNS(Avionics.SVG.NS, "text");
        }
        diffAndSetText(this.minimumReferenceModeText, "BARO");
        diffAndSetAttribute(this.minimumReferenceModeText, "x", "62");
        diffAndSetAttribute(this.minimumReferenceModeText, "y", (posY + height - 45) + '');
        diffAndSetAttribute(this.minimumReferenceModeText, "fill", (this.isHud) ? "lime" : "#24F000");
        diffAndSetAttribute(this.minimumReferenceModeText, "font-size", (this.fontSize * 0.9) + '');
        diffAndSetAttribute(this.minimumReferenceModeText, "font-family", "Roboto-Light");
        diffAndSetAttribute(this.minimumReferenceModeText, "text-anchor", "end");
        diffAndSetAttribute(this.minimumReferenceModeText, "letter-spacing", "-1px");
        this.rootGroup.appendChild(this.minimumReferenceModeText);
        if (!this.minimumReferenceValueText) {
            this.minimumReferenceValueText = document.createElementNS(Avionics.SVG.NS, "text");
        }
        diffAndSetText(this.minimumReferenceValueText, "210");
        diffAndSetAttribute(this.minimumReferenceValueText, "x", "62");
        diffAndSetAttribute(this.minimumReferenceValueText, "y", (posY + height - 15) + '');
        diffAndSetAttribute(this.minimumReferenceValueText, "fill", (this.isHud) ? "lime" : "#24F000");
        diffAndSetAttribute(this.minimumReferenceValueText, "font-size", (this.fontSize) + '');
        diffAndSetAttribute(this.minimumReferenceValueText, "font-family", "Roboto-Light");
        diffAndSetAttribute(this.minimumReferenceValueText, "text-anchor", "end");
        diffAndSetAttribute(this.minimumReferenceValueText, "letter-spacing", "-1px");
        this.rootGroup.appendChild(this.minimumReferenceValueText);
        if (!this.minimumReferenceCursor) {
            this.minimumReferenceCursor = document.createElementNS(Avionics.SVG.NS, "path");
        }
        diffAndSetAttribute(this.minimumReferenceCursor, "fill", "none");
        diffAndSetAttribute(this.minimumReferenceCursor, "d", "M 25 0 L 2 25 L 2 -25 L 25 0 L 120 0");
        diffAndSetAttribute(this.minimumReferenceCursor, "stroke", (this.isHud) ? "lime" : "#24F000");
        diffAndSetAttribute(this.minimumReferenceCursor, "stroke-width", this.strokeSize);
        this.centerSVG.appendChild(this.minimumReferenceCursor);
        if (!this.pressureSVG)
            this.pressureSVG = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetText(this.pressureSVG, "---");
        diffAndSetAttribute(this.pressureSVG, "x", "130");
        diffAndSetAttribute(this.pressureSVG, "y", (posY + height + sideTextHeight * 0.5 - 5) + '');
        diffAndSetAttribute(this.pressureSVG, "fill", (this.isHud) ? "lime" : "#24F000");
        diffAndSetAttribute(this.pressureSVG, "font-size", (this.fontSize * 1.15) + '');
        diffAndSetAttribute(this.pressureSVG, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.pressureSVG, "text-anchor", "middle");
        diffAndSetAttribute(this.pressureSVG, "alignment-baseline", "central");
        diffAndSetAttribute(this.pressureSVG, "letter-spacing", "-3px");
        this.rootGroup.appendChild(this.pressureSVG);
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    construct_AS03D() {
        Utils.RemoveAllChildren(this);
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 250 1050");
        let posX = 20;
        let posY = 0;
        let width = 200;
        let height = 800;
        let sideTextHeight = 125;
        this.refHeight = height;
        this.nbSecondaryGraduations = 1;
        this.totalGraduations = this.nbPrimaryGraduations + ((this.nbPrimaryGraduations - 1) * this.nbSecondaryGraduations);
        this.graduationSpacing = 80;
        this.graduationScroller = new Avionics.Scroller(this.nbPrimaryGraduations, 200, true);
        this.cursorIntegrals = new Array();
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 55, 1, 10, 10));
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 55, 1, 10, 100));
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 55, 1, 10, 1000));
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 55, 1, 10, 10000));
        this.cursorDecimals = new Avionics.AltitudeScroller(5, 25, 20, 100);
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "Altimeter");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        {
            this.targetAltitudeTextSVG1 = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.targetAltitudeTextSVG1, "x", "130");
            diffAndSetAttribute(this.targetAltitudeTextSVG1, "y", (posY + sideTextHeight * 0.5 + 12) + '');
            diffAndSetAttribute(this.targetAltitudeTextSVG1, "fill", "#D570FF");
            diffAndSetAttribute(this.targetAltitudeTextSVG1, "font-size", (this.fontSize * 2) + '');
            diffAndSetAttribute(this.targetAltitudeTextSVG1, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.targetAltitudeTextSVG1, "text-anchor", "end");
            diffAndSetAttribute(this.targetAltitudeTextSVG1, "alignment-baseline", "bottom");
            this.rootGroup.appendChild(this.targetAltitudeTextSVG1);
            this.targetAltitudeTextSVG2 = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.targetAltitudeTextSVG2, "x", "130");
            diffAndSetAttribute(this.targetAltitudeTextSVG2, "y", (posY + sideTextHeight * 0.5 + 12) + '');
            diffAndSetAttribute(this.targetAltitudeTextSVG2, "width", width + '');
            diffAndSetAttribute(this.targetAltitudeTextSVG2, "fill", "#D570FF");
            diffAndSetAttribute(this.targetAltitudeTextSVG2, "font-size", (this.fontSize * 1.8) + '');
            diffAndSetAttribute(this.targetAltitudeTextSVG2, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.targetAltitudeTextSVG2, "text-anchor", "start");
            diffAndSetAttribute(this.targetAltitudeTextSVG2, "alignment-baseline", "bottom");
            this.rootGroup.appendChild(this.targetAltitudeTextSVG2);
            posY += sideTextHeight;
        }
        {
            if (!this.centerSVG) {
                this.centerSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.centerSVG, "id", "CenterGroup");
            }
            else
                Utils.RemoveAllChildren(this.centerSVG);
            diffAndSetAttribute(this.centerSVG, "x", posX + '');
            diffAndSetAttribute(this.centerSVG, "y", posY + '');
            diffAndSetAttribute(this.centerSVG, "width", width + '');
            diffAndSetAttribute(this.centerSVG, "height", height + '');
            diffAndSetAttribute(this.centerSVG, "viewBox", "0 0 " + width + " " + height);
            {
                let _top = 0;
                let _left = 20;
                let _width = width;
                let _height = height;
                {
                    let graduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(graduationGroup, "id", "Graduations");
                    this.graduationScrollPosX = _left;
                    this.graduationScrollPosY = _top + _height * 0.5;
                    for (let i = 0; i < this.totalGraduations; i++) {
                        let line = new Avionics.SVGGraduation();
                        line.IsPrimary = (this.nbSecondaryGraduations > 0 && (i % (this.nbSecondaryGraduations + 1))) ? false : true;
                        let lineWidth = (line.IsPrimary) ? 22 : 22;
                        let lineHeight = (line.IsPrimary) ? 3 : 3;
                        line.SVGLine = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(line.SVGLine, "x", "0");
                        diffAndSetAttribute(line.SVGLine, "width", lineWidth + '');
                        diffAndSetAttribute(line.SVGLine, "height", lineHeight + '');
                        diffAndSetAttribute(line.SVGLine, "fill", "white");
                        graduationGroup.appendChild(line.SVGLine);
                        if (line.IsPrimary) {
                            let xPos = lineWidth + 85;
                            line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetAttribute(line.SVGText1, "x", xPos + '');
                            diffAndSetAttribute(line.SVGText1, "y", "15");
                            diffAndSetAttribute(line.SVGText1, "fill", "white");
                            diffAndSetAttribute(line.SVGText1, "font-size", (this.fontSize * 1.8) + '');
                            diffAndSetAttribute(line.SVGText1, "font-family", "Roboto-Bold");
                            diffAndSetAttribute(line.SVGText1, "text-anchor", "end");
                            diffAndSetAttribute(line.SVGText1, "alignment-baseline", "bottom");
                            graduationGroup.appendChild(line.SVGText1);
                            line.SVGText2 = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetAttribute(line.SVGText2, "x", xPos + '');
                            diffAndSetAttribute(line.SVGText2, "y", "15");
                            diffAndSetAttribute(line.SVGText2, "fill", "white");
                            diffAndSetAttribute(line.SVGText2, "font-size", (this.fontSize * 1.6) + '');
                            diffAndSetAttribute(line.SVGText2, "font-family", "Roboto-Bold");
                            diffAndSetAttribute(line.SVGText2, "text-anchor", "start");
                            diffAndSetAttribute(line.SVGText2, "alignment-baseline", "bottom");
                            graduationGroup.appendChild(line.SVGText2);
                        }
                        this.graduations.push(line);
                    }
                    this.centerSVG.appendChild(graduationGroup);
                }
                {
                    this.groundRibbonHasFixedHeight = true;
                    let groundRibbonPosX = _left;
                    let groundRibbonPosY = 0;
                    let groundRibbonWidth = _width;
                    let groundRibbonHeight = 500;
                    if (!this.groundRibbonSVG) {
                        this.groundRibbonSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                        diffAndSetAttribute(this.groundRibbonSVG, "id", "GroundRibbonGroup");
                    }
                    else
                        Utils.RemoveAllChildren(this.groundRibbonSVG);
                    diffAndSetAttribute(this.groundRibbonSVG, "x", groundRibbonPosX + '');
                    diffAndSetAttribute(this.groundRibbonSVG, "y", groundRibbonPosY + '');
                    diffAndSetAttribute(this.groundRibbonSVG, "width", groundRibbonWidth + '');
                    diffAndSetAttribute(this.groundRibbonSVG, "height", groundRibbonHeight + '');
                    diffAndSetAttribute(this.groundRibbonSVG, "viewBox", "0 0 " + groundRibbonWidth + " " + groundRibbonHeight);
                    {
                        let dashHeight = 10;
                        let dashEndPos = _height;
                        let dashPos = -150;
                        while (dashPos < (dashEndPos - dashHeight * 2)) {
                            let dashLine = document.createElementNS(Avionics.SVG.NS, "rect");
                            diffAndSetAttribute(dashLine, "x", "0");
                            diffAndSetAttribute(dashLine, "y", dashPos + '');
                            diffAndSetAttribute(dashLine, "width", groundRibbonWidth + '');
                            diffAndSetAttribute(dashLine, "height", dashHeight + '');
                            diffAndSetAttribute(dashLine, "transform", "skewY(45)");
                            diffAndSetAttribute(dashLine, "fill", "orange");
                            this.groundRibbonSVG.appendChild(dashLine);
                            dashPos += dashHeight * 3;
                        }
                        if (!this.groundRibbonSVGShape)
                            this.groundRibbonSVGShape = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(this.groundRibbonSVGShape, "fill", "orange");
                        diffAndSetAttribute(this.groundRibbonSVGShape, "stroke", "orange");
                        diffAndSetAttribute(this.groundRibbonSVGShape, "stroke-width", "2");
                        diffAndSetAttribute(this.groundRibbonSVGShape, "width", groundRibbonWidth + '');
                        diffAndSetAttribute(this.groundRibbonSVGShape, "height", "5");
                        diffAndSetAttribute(this.groundRibbonSVGShape, "x", "0");
                        this.groundRibbonSVG.appendChild(this.groundRibbonSVGShape);
                    }
                    this.centerSVG.appendChild(this.groundRibbonSVG);
                }
                {
                    let singleLineHeight = 500 * this.graduationSpacing * (this.nbSecondaryGraduations + 1) / this.graduationScroller.increment;
                    let groundStripPosX = _left - 6;
                    let groundStripPosY = 0;
                    let groundStripWidth = width;
                    this.groundLineSVGHeight = singleLineHeight * 2;
                    if (!this.groundLineSVG) {
                        this.groundLineSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                        diffAndSetAttribute(this.groundLineSVG, "id", "GroundLineGroup");
                    }
                    else
                        Utils.RemoveAllChildren(this.groundLineSVG);
                    diffAndSetAttribute(this.groundLineSVG, "x", groundStripPosX + '');
                    diffAndSetAttribute(this.groundLineSVG, "y", groundStripPosY + '');
                    diffAndSetAttribute(this.groundLineSVG, "width", groundStripWidth + '');
                    diffAndSetAttribute(this.groundLineSVG, "height", this.groundLineSVGHeight + '');
                    diffAndSetAttribute(this.groundLineSVG, "viewBox", "0 0 " + groundStripWidth + " " + this.groundLineSVGHeight);
                    {
                        let whiteLine = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(whiteLine, "fill", "white");
                        diffAndSetAttribute(whiteLine, "x", "0");
                        diffAndSetAttribute(whiteLine, "y", "0");
                        diffAndSetAttribute(whiteLine, "width", "6");
                        diffAndSetAttribute(whiteLine, "height", singleLineHeight + '');
                        this.groundLineSVG.appendChild(whiteLine);
                        let amberLine = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(amberLine, "fill", "orange");
                        diffAndSetAttribute(amberLine, "x", "0");
                        diffAndSetAttribute(amberLine, "y", singleLineHeight + '');
                        diffAndSetAttribute(amberLine, "width", "6");
                        diffAndSetAttribute(amberLine, "height", singleLineHeight + '');
                        this.groundLineSVG.appendChild(amberLine);
                    }
                    this.centerSVG.appendChild(this.groundLineSVG);
                }
                {
                    let targetAltitudeIndicatorWidth = 100;
                    let targetAltitudeIndicatorHeight = 100;
                    let targetAltitudeIndicatorPosX = 0;
                    if (!this.targetAltitudeIndicatorSVG) {
                        this.targetAltitudeIndicatorSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                        diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "id", "TargetAltitudeIndicator");
                    }
                    else
                        Utils.RemoveAllChildren(this.targetAltitudeIndicatorSVG);
                    diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "x", targetAltitudeIndicatorPosX + '');
                    diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "width", targetAltitudeIndicatorWidth + '');
                    diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "height", targetAltitudeIndicatorHeight + '');
                    diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "viewBox", "0 0 100 100");
                    {
                        if (!this.targetAltitudeIndicatorSVGShape)
                            this.targetAltitudeIndicatorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "fill", "none");
                        diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "stroke", "#D570FF");
                        diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "stroke-width", "6");
                        diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "d", "M 10 20 L 55 20 L 55 80 L 10 80 L 10 60 L 18 50 L 10 40 Z");
                        this.targetAltitudeIndicatorSVG.appendChild(this.targetAltitudeIndicatorSVGShape);
                    }
                    this.centerSVG.appendChild(this.targetAltitudeIndicatorSVG);
                }
                {
                    let cursorPosX = _left + 15;
                    let cursorPosY = _top + _height * 0.5;
                    let cursorWidth = width;
                    let cursorHeight = 80;
                    if (!this.cursorSVG) {
                        this.cursorSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                        diffAndSetAttribute(this.cursorSVG, "id", "CursorGroup");
                    }
                    else
                        Utils.RemoveAllChildren(this.cursorSVG);
                    diffAndSetAttribute(this.cursorSVG, "x", cursorPosX + '');
                    diffAndSetAttribute(this.cursorSVG, "y", (cursorPosY - cursorHeight * 0.5) + '');
                    diffAndSetAttribute(this.cursorSVG, "width", cursorWidth + '');
                    diffAndSetAttribute(this.cursorSVG, "height", cursorHeight + '');
                    diffAndSetAttribute(this.cursorSVG, "viewBox", "0 0 " + cursorWidth + " " + cursorHeight);
                    {
                        let _cursorPosX = 45;
                        let _cursorPosY = cursorHeight * 0.5 + 1.5;
                        this.cursorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.cursorSVGShape, "fill", "black");
                        diffAndSetAttribute(this.cursorSVGShape, "stroke", "white");
                        diffAndSetAttribute(this.cursorSVGShape, "stroke-width", "6");
                        diffAndSetAttribute(this.cursorSVGShape, "d", "M 30 0 h135 v " + cursorHeight + '' + "h-135 l-30 " + (-cursorHeight / 2) + '' + " l30 " + (-cursorHeight / 2) + '' + " Z");
                        this.cursorSVG.appendChild(this.cursorSVGShape);
                        this.cursorIntegrals[0].construct(this.cursorSVG, _cursorPosX + 81, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 2, "white");
                        this.cursorIntegrals[1].construct(this.cursorSVG, _cursorPosX + 54, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 2, "white");
                        this.cursorIntegrals[2].construct(this.cursorSVG, _cursorPosX + 27, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 2, "white");
                        this.cursorIntegrals[3].construct(this.cursorSVG, _cursorPosX, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 2, "white");
                        this.cursorDecimals.construct(this.cursorSVG, _cursorPosX + 117, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.3, "white");
                    }
                    this.centerSVG.appendChild(this.cursorSVG);
                }
            }
            this.rootGroup.appendChild(this.centerSVG);
        }
        {
            if (!this.pressureSVG)
                this.pressureSVG = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.pressureSVG, "---");
            diffAndSetAttribute(this.pressureSVG, "x", (posX + width / 2) + '');
            diffAndSetAttribute(this.pressureSVG, "y", (posY + height + sideTextHeight * 0.5 + 10) + '');
            diffAndSetAttribute(this.pressureSVG, "fill", "white");
            diffAndSetAttribute(this.pressureSVG, "font-size", (this.fontSize * 1.8) + '');
            diffAndSetAttribute(this.pressureSVG, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.pressureSVG, "text-anchor", "middle");
            diffAndSetAttribute(this.pressureSVG, "alignment-baseline", "central");
            diffAndSetAttribute(this.pressureSVG, "letter-spacing", "-3px");
            this.rootGroup.appendChild(this.pressureSVG);
        }
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    construct_A320_Neo() {
        Utils.RemoveAllChildren(this);
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 250 750");
        var posX = 75;
        var posY = 25;
        var width = 75;
        var height = 480;
        var arcWidth = 40;
        this.refHeight = height;
        this.borderSize = 5;
        this.graduationScroller = new Avionics.Scroller(this.nbPrimaryGraduations, 500, true);
        this.cursorIntegrals = new Array();
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 75, 1, 10, 10));
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 75, 1, 10, 100));
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 75, 1, 10, 1000));
        this.cursorDecimals = new Avionics.AltitudeScroller(5, 25, 20, 100);
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "Altimeter");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        if (!this.centerSVG) {
            this.centerSVG = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.centerSVG, "id", "CenterGroup");
        }
        else
            Utils.RemoveAllChildren(this.centerSVG);
        diffAndSetAttribute(this.centerSVG, "x", (posX - width * 0.5) + '');
        diffAndSetAttribute(this.centerSVG, "y", posY + '');
        diffAndSetAttribute(this.centerSVG, "width", (25 + width + arcWidth) + '');
        diffAndSetAttribute(this.centerSVG, "height", height + '');
        diffAndSetAttribute(this.centerSVG, "viewBox", "0 0 " + (25 + width + arcWidth) + " " + height);
        {
            var _top = 0;
            var _left = 25;
            var _width = width;
            var _height = height;
            var bg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(bg, "x", _left + '');
            diffAndSetAttribute(bg, "y", _top + '');
            diffAndSetAttribute(bg, "width", _width + '');
            diffAndSetAttribute(bg, "height", _height + '');
            diffAndSetAttribute(bg, "fill", "#343B51");
            this.centerSVG.appendChild(bg);
            var topLine = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(topLine, "x1", _left + '');
            diffAndSetAttribute(topLine, "y1", (_top + 2) + '');
            diffAndSetAttribute(topLine, "x2", (_left + _width + arcWidth) + '');
            diffAndSetAttribute(topLine, "y2", (_top + 2) + '');
            diffAndSetAttribute(topLine, "stroke", "white");
            diffAndSetAttribute(topLine, "stroke-width", "4");
            this.centerSVG.appendChild(topLine);
            var bottomLine = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(bottomLine, "x1", _left + '');
            diffAndSetAttribute(bottomLine, "y1", (_top + _height - 2) + '');
            diffAndSetAttribute(bottomLine, "x2", (_left + _width + arcWidth) + '');
            diffAndSetAttribute(bottomLine, "y2", (_top + _height - 2) + '');
            diffAndSetAttribute(bottomLine, "stroke", "white");
            diffAndSetAttribute(bottomLine, "stroke-width", "4");
            this.centerSVG.appendChild(bottomLine);
            this.graduationScrollPosX = 0;
            this.graduationScrollPosY = _top + _height * 0.5;
            for (var i = 0; i < this.totalGraduations; i++) {
                var line = new Avionics.SVGGraduation();
                line.IsPrimary = true;
                if (this.nbSecondaryGraduations > 0 && (i % (this.nbSecondaryGraduations + 1)))
                    line.IsPrimary = false;
                var lineWidth = (line.IsPrimary) ? 9 : 9;
                var lineHeight = (line.IsPrimary) ? 4 : 4;
                line.SVGLine = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(line.SVGLine, "x", (_left + _width - lineWidth) + '');
                diffAndSetAttribute(line.SVGLine, "width", lineWidth + '');
                diffAndSetAttribute(line.SVGLine, "height", lineHeight + '');
                diffAndSetAttribute(line.SVGLine, "fill", "white");
                if (line.IsPrimary) {
                    line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(line.SVGText1, "x", (_left + _width - lineWidth - 3) + '');
                    diffAndSetAttribute(line.SVGText1, "fill", "white");
                    diffAndSetAttribute(line.SVGText1, "font-size", (this.fontSize * 1.4) + '');
                    diffAndSetAttribute(line.SVGText1, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(line.SVGText1, "text-anchor", "end");
                    diffAndSetAttribute(line.SVGText1, "alignment-baseline", "central");
                }
                this.graduations.push(line);
            }
            for (var i = 0; i < this.totalGraduations; i++) {
                var line = this.graduations[i];
                this.centerSVG.appendChild(line.SVGLine);
                if (line.SVGText1) {
                    this.centerSVG.appendChild(line.SVGText1);
                }
            }
            var groundRibbonPosX = _left + _width;
            var groundRibbonPosY = 0;
            var groundRibbonWidth = 100;
            var groundRibbonHeight = _height;
            if (!this.groundRibbonSVG) {
                this.groundRibbonSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.groundRibbonSVG, "id", "GroundRibbonGroup");
            }
            else
                Utils.RemoveAllChildren(this.groundRibbonSVG);
            diffAndSetAttribute(this.groundRibbonSVG, "x", groundRibbonPosX + '');
            diffAndSetAttribute(this.groundRibbonSVG, "y", groundRibbonPosY + '');
            diffAndSetAttribute(this.groundRibbonSVG, "width", groundRibbonWidth + '');
            diffAndSetAttribute(this.groundRibbonSVG, "height", groundRibbonHeight + '');
            diffAndSetAttribute(this.groundRibbonSVG, "viewBox", "0 0 " + groundRibbonWidth + " " + groundRibbonHeight);
            {
                if (!this.groundRibbonSVGShape)
                    this.groundRibbonSVGShape = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(this.groundRibbonSVGShape, "fill", "red");
                diffAndSetAttribute(this.groundRibbonSVGShape, "stroke", "red");
                diffAndSetAttribute(this.groundRibbonSVGShape, "stroke-width", "2");
                diffAndSetAttribute(this.groundRibbonSVGShape, "width", "12");
                diffAndSetAttribute(this.groundRibbonSVGShape, "x", "2");
                this.groundRibbonSVG.appendChild(this.groundRibbonSVGShape);
            }
            this.centerSVG.appendChild(this.groundRibbonSVG);
            var targetAltitudeIndicatorWidth = 100;
            var targetAltitudeIndicatorHeight = 150;
            var targetAltitudeIndicatorPosX = _left - 9;
            if (!this.targetAltitudeIndicatorSVG) {
                this.targetAltitudeIndicatorSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "id", "TargetAltitudeIndicator");
            }
            else
                Utils.RemoveAllChildren(this.targetAltitudeIndicatorSVG);
            diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "x", targetAltitudeIndicatorPosX + '');
            diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "width", targetAltitudeIndicatorWidth + '');
            diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "height", targetAltitudeIndicatorHeight + '');
            diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "viewBox", "0 0 100 150");
            {
                if (!this.targetAltitudeIndicatorSVGShape)
                    this.targetAltitudeIndicatorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "fill", "none");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "stroke", "cyan");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "stroke-width", "2");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "d", "M 0 0 L 35 0 L 35 100 L 0 100 L 0 55 L 6 50 L 0 45 Z");
                this.targetAltitudeIndicatorSVG.appendChild(this.targetAltitudeIndicatorSVGShape);
                let textBg = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(textBg, "x", "8");
                diffAndSetAttribute(textBg, "y", "35");
                diffAndSetAttribute(textBg, "width", (_width + 2) + '');
                diffAndSetAttribute(textBg, "height", "30");
                diffAndSetAttribute(textBg, "fill", "black");
                this.targetAltitudeIndicatorSVG.appendChild(textBg);
                this.targetAltitudeIndicatorSVGText = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.targetAltitudeIndicatorSVGText, "35000");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGText, "x", (8 + _width + 18) + '');
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGText, "y", "49");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGText, "fill", "cyan");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGText, "font-size", (this.fontSize * 1.15) + '');
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGText, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGText, "text-anchor", "end");
                diffAndSetAttribute(this.targetAltitudeIndicatorSVGText, "alignment-baseline", "central");
                this.targetAltitudeIndicatorSVG.appendChild(this.targetAltitudeIndicatorSVGText);
            }
            this.centerSVG.appendChild(this.targetAltitudeIndicatorSVG);
            var cursorPosX = _left - 2;
            var cursorPosY = _top + _height * 0.5;
            var cursorWidth = width + arcWidth;
            var cursorHeight = 80;
            if (!this.cursorSVG) {
                this.cursorSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.cursorSVG, "id", "CursorGroup");
            }
            else
                Utils.RemoveAllChildren(this.cursorSVG);
            diffAndSetAttribute(this.cursorSVG, "x", cursorPosX + '');
            diffAndSetAttribute(this.cursorSVG, "y", (cursorPosY - cursorHeight * 0.5) + '');
            diffAndSetAttribute(this.cursorSVG, "width", cursorWidth + '');
            diffAndSetAttribute(this.cursorSVG, "height", cursorHeight + '');
            diffAndSetAttribute(this.cursorSVG, "viewBox", "0 0 " + cursorWidth + " " + cursorHeight);
            {
                var _cursorPosX = 5;
                var _cursorPosY = cursorHeight * 0.5 - 2;
                if (!this.cursorSVGShape)
                    this.cursorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.cursorSVGShape, "fill", "black");
                diffAndSetAttribute(this.cursorSVGShape, "d", "M 0 17.5 L 77 17.5 L 77 0 L 115 0 L 115 80 L 77 80 L 77 62.5 L 0 62.5 Z");
                diffAndSetAttribute(this.cursorSVGShape, "stroke", "white");
                diffAndSetAttribute(this.cursorSVGShape, "stroke-width", this.strokeSize);
                this.cursorSVG.appendChild(this.cursorSVGShape);
                let integralsGroup = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(integralsGroup, "x", "0");
                diffAndSetAttribute(integralsGroup, "y", "20");
                diffAndSetAttribute(integralsGroup, "width", cursorWidth + '');
                diffAndSetAttribute(integralsGroup, "height", (cursorHeight - 40) + '');
                diffAndSetAttribute(integralsGroup, "viewBox", "0 0 " + cursorWidth + " " + cursorHeight);
                this.cursorSVG.appendChild(integralsGroup);
                {
                    this.cursorIntegrals[0].construct(integralsGroup, _cursorPosX + 91, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 3.35, "rgb(36,255,0)");
                    this.cursorIntegrals[1].construct(integralsGroup, _cursorPosX + 43, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 3.35, "rgb(36,255,0)");
                    this.cursorIntegrals[2].construct(integralsGroup, _cursorPosX - 5, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 3.35, "rgb(36,255,0)");
                }
                this.cursorDecimals.construct(this.cursorSVG, _cursorPosX + 109, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.15, "rgb(36,255,0)");
            }
            this.centerSVG.appendChild(this.cursorSVG);
            if (!this.targetAltitudeText) {
                this.targetAltitudeText = document.createElement("div");
                this.targetAltitudeText.id = "TargetAltitudeText";
            }
            else {
                Utils.RemoveAllChildren(this.targetAltitudeText);
            }
            this.targetAltitudeText.style.fontSize = "45px";
            this.targetAltitudeText.style.color = "cyan";
            this.targetAltitudeText.style.position = "absolute";
            this.targetAltitudeText.style.top = "-20px";
            this.targetAltitudeText.style.left = "115px";
            this.appendChild(this.targetAltitudeText);
        }
        this.rootGroup.appendChild(this.centerSVG);
        if (!this.pressureSVG)
            this.pressureSVG = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetText(this.pressureSVG, "---");
        diffAndSetAttribute(this.pressureSVG, "x", "70");
        diffAndSetAttribute(this.pressureSVG, "y", (posY + height + 90) + '');
        diffAndSetAttribute(this.pressureSVG, "fill", "cyan");
        diffAndSetAttribute(this.pressureSVG, "font-size", (this.fontSize * 1.05) + '');
        diffAndSetAttribute(this.pressureSVG, "font-family", "Roboto-Light");
        diffAndSetAttribute(this.pressureSVG, "text-anchor", "start");
        diffAndSetAttribute(this.pressureSVG, "alignment-baseline", "central");
        diffAndSetAttribute(this.pressureSVG, "letter-spacing", "-3px");
        this.rootGroup.appendChild(this.pressureSVG);
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    update(_dTime) {
        let indicatedAltitude = Simplane.getAltitude();
        let groundReference = indicatedAltitude - Simplane.getAltitudeAboveGround(true);
        let baroMode = Simplane.getPressureSelectedMode(this.aircraft);
        let selectedAltitude;
        if (this.aircraft === Aircraft.AS01B || this.aircraft === Aircraft.B747_8) {
            selectedAltitude = Math.max(0, Simplane.getAutoPilotDisplayedAltitudeLockValue());
        }
        else if (this.aircraft === Aircraft.AS03D) {
            selectedAltitude = Math.round(Math.max(0, SimVar.GetSimVarValue("GPS WP NEXT ALT", "feet")));
        }
        else {
            selectedAltitude = Math.max(0, Simplane.getAutoPilotAltitudeLockValue());
            if (selectedAltitude === 0) {
                selectedAltitude = Math.max(0, Simplane.getAutoPilotDisplayedAltitudeLockValue());
            }
        }
        engine.beginProfileEvent("updateGraduationScrolling");
        this.updateGraduationScrolling(indicatedAltitude);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateCursorScrolling");
        this.updateCursorScrolling(indicatedAltitude);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateGroundReference");
        this.updateGroundReference(indicatedAltitude, groundReference, _dTime);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateTargetAltitude");
        this.updateTargetAltitude(indicatedAltitude, selectedAltitude, baroMode);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateBaroPressure");
        this.updateBaroPressure(baroMode);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateMtrs");
        this.updateMtrs(indicatedAltitude, selectedAltitude);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateMinimumReference");
        this.updateMinimumReference(indicatedAltitude, this.minimumReferenceValue, Simplane.getMinimumReferenceMode());
        engine.endProfileEvent();
    }
    updateMtrs(_altitude, _selected) {
        if (this.mtrsVisible) {
            if (this.mtrsSelectedGroup) {
                var APMode = this.getAutopilotMode();
                if (APMode != AutopilotMode.MANAGED) {
                    let meters = Math.round(_selected * 0.3048);
                    diffAndSetText(this.mtrsSelectedSVGText, meters + '');
                    diffAndSetAttribute(this.mtrsSelectedGroup, "visibility", "visible");
                }
                else {
                    diffAndSetAttribute(this.mtrsSelectedGroup, "visibility", "hidden");
                }
            }
            if (this.mtrsCursorGroup) {
                let meters = Math.round(_altitude * 0.3048);
                diffAndSetText(this.mtrsCursorSVGText, meters + '');
                diffAndSetAttribute(this.mtrsCursorGroup, "visibility", "visible");
            }
        }
        else {
            if (this.mtrsSelectedGroup)
                diffAndSetAttribute(this.mtrsSelectedGroup, "visibility", "hidden");
            if (this.mtrsCursorGroup)
                diffAndSetAttribute(this.mtrsCursorGroup, "visibility", "hidden");
        }
    }
    updateBaroPressure(_mode) {
        if (this.pressureSVG) {
            var units = Simplane.getPressureSelectedUnits();
            var pressure = Simplane.getPressureValue(units);
            if (_mode == "STD") {
                diffAndSetText(this.pressureSVG, "STD");
            }
            else {
                if (this.aircraft == Aircraft.A320_NEO) {
                    if (_mode == "QFE") {
                        diffAndSetText(this.pressureSVG, "QFE ");
                    }
                    else {
                        diffAndSetText(this.pressureSVG, "QNH ");
                    }
                    if (units == "millibar") {
                        this.pressureSVG.textContent += fastToFixed(pressure, 0);
                    }
                    else {
                        this.pressureSVG.textContent += fastToFixed(pressure, 2);
                    }
                }
                else if (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B) {
                    if (units == "millibar") {
                        diffAndSetText(this.pressureSVG, fastToFixed(pressure, 0) + " HPA");
                    }
                    else {
                        diffAndSetText(this.pressureSVG, fastToFixed(pressure, 2) + " IN");
                    }
                }
                else {
                    if (units == "millibar") {
                        diffAndSetText(this.pressureSVG, fastToFixed(pressure, 0) + " Hpa");
                    }
                    else {
                        diffAndSetText(this.pressureSVG, fastToFixed(pressure, 2) + " inHg");
                    }
                }
            }
        }
    }
    updateGraduationScrolling(_altitude) {
        let showThousandIndicator = false;
        if (this.graduations && this.graduationScroller.scroll(_altitude)) {
            var currentVal = this.graduationScroller.firstValue;
            var currentY = this.graduationScrollPosY + this.graduationScroller.offsetY * this.graduationSpacing * (this.nbSecondaryGraduations + 1);
            for (var i = 0; i < this.totalGraduations; i++) {
                var posX = this.graduationScrollPosX;
                var posY = currentY;
                diffAndSetAttribute(this.graduations[i].SVGLine, "transform", "translate(" + posX + '' + " " + posY + '' + ")");
                if (this.graduations[i].SVGText1) {
                    var roundedVal = 0;
                    var divider = 100;
                    if (this.aircraft == Aircraft.CJ4) {
                        roundedVal = Math.floor(Math.abs(currentVal));
                        let mod = roundedVal % 1000;
                        if (mod != 0)
                            roundedVal = mod;
                    }
                    else if (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B || this.aircraft == Aircraft.AS03D) {
                        roundedVal = Math.floor(Math.abs(currentVal));
                        divider = 1000;
                    }
                    else {
                        roundedVal = Math.floor(Math.abs(currentVal) / 100);
                    }
                    if (!this.graduations[i].SVGText2) {
                        diffAndSetText(this.graduations[i].SVGText1, Utils.leadingZeros(roundedVal, 3));
                    }
                    else {
                        var integral = Math.floor(roundedVal / divider);
                        var modulo = Math.floor(roundedVal - (integral * divider));
                        if (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B || this.aircraft == Aircraft.AS03D)
                            diffAndSetText(this.graduations[i].SVGText1, (integral > 0) ? integral + '' : "");
                        else
                            diffAndSetText(this.graduations[i].SVGText1, integral + '');
                        if (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B || this.aircraft == Aircraft.AS03D)
                            diffAndSetText(this.graduations[i].SVGText2, Utils.leadingZeros(modulo, 3));
                        else
                            diffAndSetText(this.graduations[i].SVGText2, Utils.leadingZeros(modulo, 2));
                    }
                    diffAndSetAttribute(this.graduations[i].SVGText1, "transform", "translate(" + posX + '' + " " + posY + '' + ")");
                    if (this.graduations[i].SVGText2)
                        diffAndSetAttribute(this.graduations[i].SVGText2, "transform", "translate(" + posX + '' + " " + posY + '' + ")");
                    if (this.thousandIndicator && (currentVal % 1000) == 0) {
                        diffAndSetAttribute(this.thousandIndicator, "transform", "translate(" + posX + '' + " " + posY + '' + ")");
                        showThousandIndicator = true;
                    }
                    currentVal = this.graduationScroller.nextValue;
                }
                currentY -= this.graduationSpacing;
            }
            if (this.thousandIndicator)
                diffAndSetAttribute(this.thousandIndicator, "visibility", (showThousandIndicator) ? "visible" : "hidden");
        }
    }
    updateCursorScrolling(_altitude) {
        if (this.cursorIntegrals) {
            engine.beginProfileEvent("cursorIntegrals");
            let hideZeros = (this.aircraft == Aircraft.A320_NEO) ? true : false;
            for (let i = 0; i < this.cursorIntegrals.length; i++) {
                let divider = fastPow10(i + 2);
                this.cursorIntegrals[i].update(_altitude, divider, (hideZeros) ? divider : undefined);
            }
            engine.endProfileEvent();
        }
        if (this.cursorDecimals) {
            this.cursorDecimals.update(_altitude);
        }
        if (this.cursorSVGAltitudeLevelShape) {
            engine.beginProfileEvent("classList.toggle");
            this.cursorSVGAltitudeLevelShape.classList.toggle('hide', _altitude >= 9990);
            engine.endProfileEvent();
        }
    }
    valueToSvg(current, target) {
        let _top = 0;
        let _height = this.refHeight;
        let deltaValue = current - target;
        let deltaSVG = deltaValue * this.graduationSpacing * (this.nbSecondaryGraduations + 1) / this.graduationScroller.increment;
        let posY = _top + _height * 0.5 + deltaSVG;
        return posY;
    }
    updateGroundReference(currentAltitude, groundReference, _dTime) {
        this.groundReference = Utils.SmoothPow(this.groundReference, groundReference, 1.2, _dTime / 1000);
        let currentY = this.valueToSvg(currentAltitude, this.groundReference);
        if (this.groundRibbonSVG && this.groundRibbonSVGShape) {
            let rectHeight = (this.refHeight - currentY - this.borderSize);
            if (rectHeight > 0) {
                diffAndSetAttribute(this.groundRibbonSVG, "visibility", "visible");
                diffAndSetAttribute(this.groundRibbonSVG, "y", currentY + '');
                if (!this.groundRibbonHasFixedHeight)
                    diffAndSetAttribute(this.groundRibbonSVGShape, "height", rectHeight + '');
            }
            else {
                diffAndSetAttribute(this.groundRibbonSVG, "visibility", "hidden");
            }
        }
        if (this.groundLineSVG) {
            if (currentY > 0) {
                diffAndSetAttribute(this.groundLineSVG, "visibility", "visible");
                diffAndSetAttribute(this.groundLineSVG, "y", (currentY - this.groundLineSVGHeight) + '');
            }
            else {
                diffAndSetAttribute(this.groundLineSVG, "visibility", "hidden");
            }
        }
    }
    getAutopilotMode() {
        if (this.aircraft == Aircraft.A320_NEO) {
            if (Simplane.getAutoPilotAltitudeManaged() && SimVar.GetSimVarValue("L:AP_CURRENT_TARGET_ALTITUDE_IS_CONSTRAINT", "number") != 0)
                return AutopilotMode.MANAGED;
            return AutopilotMode.SELECTED;
        }
        else {
            return AutopilotMode.SELECTED;
        }
    }
    updateTargetAltitude(currentAltitude, targetAltitude, baroMode) {
        let hudAltitude = 0;
        if (this.targetAltitudeIndicatorSVG) {
            var APMode = this.getAutopilotMode();
            var stdMode = (baroMode == "STD") ? true : false;
            if (this.aircraft == Aircraft.CJ4 || this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B) {
                if (APMode != AutopilotMode.MANAGED) {
                    let deltaAltitude = targetAltitude - currentAltitude;
                    let divider = 100;
                    let refDelta = 275;
                    let textAlwaysVisible = false;
                    let leadingZeros = 2;
                    if (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B) {
                        divider = 1000;
                        refDelta = 410;
                        textAlwaysVisible = true;
                        leadingZeros = 3;
                        deltaAltitude = Utils.Clamp(deltaAltitude, -refDelta * 0.99, refDelta * 0.99);
                    }
                    var integral = Math.floor(targetAltitude / divider);
                    var modulo = Math.floor(targetAltitude - (integral * divider));
                    if (stdMode && targetAltitude >= 1000) {
                        diffAndSetText(this.targetAltitudeTextSVG1, "FL");
                        diffAndSetText(this.targetAltitudeTextSVG2, Math.floor(targetAltitude / 100) + '');
                    }
                    else {
                        diffAndSetText(this.targetAltitudeTextSVG1, integral + '');
                        diffAndSetText(this.targetAltitudeTextSVG2, Utils.leadingZeros(modulo, leadingZeros));
                    }
                    hudAltitude = targetAltitude;
                    if (deltaAltitude < -refDelta || deltaAltitude > refDelta) {
                        diffAndSetAttribute(this.targetAltitudeTextSVG1, "visibility", "visible");
                        diffAndSetAttribute(this.targetAltitudeTextSVG2, "visibility", "visible");
                        if (this.targetAltitudeBgSVG)
                            diffAndSetAttribute(this.targetAltitudeBgSVG, "visibility", "visible");
                        diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "visibility", "hidden");
                    }
                    else {
                        diffAndSetAttribute(this.targetAltitudeTextSVG1, "visibility", (textAlwaysVisible) ? "visible" : "hidden");
                        diffAndSetAttribute(this.targetAltitudeTextSVG2, "visibility", (textAlwaysVisible) ? "visible" : "hidden");
                        if (this.targetAltitudeBgSVG)
                            diffAndSetAttribute(this.targetAltitudeBgSVG, "visibility", (textAlwaysVisible) ? "visible" : "hidden");
                        var offsetY = this.valueToSvg(currentAltitude, currentAltitude + deltaAltitude);
                        offsetY -= 48;
                        diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "y", offsetY + '');
                        diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "visibility", "visible");
                    }
                }
                else {
                    diffAndSetAttribute(this.targetAltitudeTextSVG1, "visibility", "hidden");
                    diffAndSetAttribute(this.targetAltitudeTextSVG2, "visibility", "hidden");
                    if (this.targetAltitudeBgSVG)
                        diffAndSetAttribute(this.targetAltitudeBgSVG, "visibility", "hidden");
                    diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "visibility", "hidden");
                }
            }
            else if (this.aircraft == Aircraft.A320_NEO) {
                let textContent;
                if (stdMode && targetAltitude >= 1000)
                    textContent = "FL" + Math.abs(targetAltitude / 100) + '';
                else
                    textContent = fastToFixed(targetAltitude, 0);
                let deltaAltitude = targetAltitude - currentAltitude;
                if (deltaAltitude < -650) {
                    diffAndSetText(this.targetAltitudeText, textContent);
                    this.targetAltitudeText.style.top = "720px";
                    this.targetAltitudeText.style.left = "115px";
                    diffAndSetStyle(this.targetAltitudeText, StyleProperty.display, "block");
                    this.targetAltitudeText.style.color = (APMode == AutopilotMode.SELECTED) ? "cyan" : "magenta";
                    diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "visibility", "hidden");
                }
                else if (deltaAltitude > 650) {
                    diffAndSetText(this.targetAltitudeText, textContent);
                    this.targetAltitudeText.style.top = "-20px";
                    this.targetAltitudeText.style.left = "115px";
                    diffAndSetStyle(this.targetAltitudeText, StyleProperty.display, "block");
                    this.targetAltitudeText.style.color = (APMode == AutopilotMode.SELECTED) ? "cyan" : "magenta";
                    diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "visibility", "hidden");
                }
                else {
                    diffAndSetStyle(this.targetAltitudeText, StyleProperty.display, "none");
                    var offsetY = this.valueToSvg(currentAltitude, targetAltitude);
                    offsetY -= 51;
                    diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "y", offsetY + '');
                    diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "visibility", "visible");
                    diffAndSetAttribute(this.targetAltitudeIndicatorSVGShape, "stroke", (APMode == AutopilotMode.SELECTED) ? "cyan" : "magenta");
                    if (this.targetAltitudeIndicatorSVGText) {
                        if (targetAltitude >= 10)
                            diffAndSetText(this.targetAltitudeIndicatorSVGText, fastToFixed(targetAltitude, 0));
                        else
                            diffAndSetText(this.targetAltitudeIndicatorSVGText, "100");
                        diffAndSetAttribute(this.targetAltitudeIndicatorSVGText, "fill", (APMode == AutopilotMode.SELECTED) ? "cyan" : "magenta");
                    }
                }
                hudAltitude = targetAltitude;
            }
            else if (this.aircraft == Aircraft.AS03D) {
                if (SimVar.GetSimVarValue("GPS IS ACTIVE FLIGHT PLAN", "number")) {
                    let divider = 100;
                    let refDelta = 600;
                    let deltaAltitude = targetAltitude - currentAltitude;
                    deltaAltitude = Utils.Clamp(deltaAltitude, -refDelta, refDelta);
                    let integral = Math.floor(targetAltitude / divider);
                    let modulo = Math.floor(targetAltitude - (integral * divider));
                    diffAndSetText(this.targetAltitudeTextSVG1, integral + '');
                    diffAndSetText(this.targetAltitudeTextSVG2, Utils.leadingZeros(modulo, 2));
                    let offsetY = this.valueToSvg(currentAltitude, currentAltitude + deltaAltitude);
                    offsetY -= 48;
                    diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "y", offsetY + '');
                    diffAndSetAttribute(this.targetAltitudeTextSVG1, "visibility", "visible");
                    diffAndSetAttribute(this.targetAltitudeTextSVG2, "visibility", "visible");
                    diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "visibility", "visible");
                }
                else {
                    diffAndSetAttribute(this.targetAltitudeTextSVG1, "visibility", "hidden");
                    diffAndSetAttribute(this.targetAltitudeTextSVG2, "visibility", "hidden");
                    diffAndSetAttribute(this.targetAltitudeIndicatorSVG, "visibility", "hidden");
                }
            }
        }
        if (this.hudAPAltitude != hudAltitude) {
            this.hudAPAltitude = Math.round(hudAltitude);
            SimVar.SetSimVarValue("L:HUD_AP_SELECTED_ALTITUDE", "Number", this.hudAPAltitude);
        }
    }
    updateMinimumReference(indicatedAltitude, minimumAltitude, minimumMode) {
        if (!this.minimumReferenceCursor || !this.minimumReferenceValueText || !this.minimumReferenceModeText) {
            return;
        }
        var currentY = 0;
        if (minimumMode === MinimumReferenceMode.BARO) {
            currentY = this.valueToSvg(indicatedAltitude, minimumAltitude);
        }
        else {
            currentY = this.valueToSvg(indicatedAltitude, minimumAltitude - Simplane.getAltitudeAboveGround() + indicatedAltitude);
        }
        diffAndSetAttribute(this.minimumReferenceCursor, "transform", "translate(0, " + fastToFixed(currentY, 1) + ")");
        diffAndSetText(this.minimumReferenceValueText, fastToFixed(minimumAltitude, 0));
        diffAndSetText(this.minimumReferenceModeText, minimumMode === MinimumReferenceMode.BARO ? "BARO" : "RADIO");
        ;
    }
}
customElements.define("jet-pfd-altimeter-indicator", Jet_PFD_AltimeterIndicator);
//# sourceMappingURL=AltimeterIndicator.js.map