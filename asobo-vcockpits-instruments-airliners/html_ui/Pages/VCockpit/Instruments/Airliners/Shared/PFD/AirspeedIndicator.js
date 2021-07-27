class Jet_PFD_AirspeedIndicator extends HTMLElement {
    constructor() {
        super(...arguments);
        this.cursorOpacity = "1.0";
        this.fontSize = 25;
        this.machVisible = false;
        this.machSpeed = 0;
        this.refHeight = 0;
        this.targetSpeedPointerHeight = 0;
        this.stripHeight = 0;
        this.stripBorderSize = 0;
        this.stripOffsetX = 0;
        this.speedMarkers = new Array();
        this.speedMarkersWidth = 50;
        this.speedMarkersHeight = 50;
        this.graduationScrollPosX = 0;
        this.graduationScrollPosY = 0;
        this.graduationSpacing = 30;
        this.graduationMinValue = 30;
        this.nbPrimaryGraduations = 11;
        this.nbSecondaryGraduations = 1;
        this.totalGraduations = this.nbPrimaryGraduations + ((this.nbPrimaryGraduations - 1) * this.nbSecondaryGraduations);
        this.hudAPSpeed = 0;
        this.isHud = false;
        this._aircraft = Aircraft.A320_NEO;
        this._computedIASAcceleration = 0;
        this._lowestSelectableSpeed = 0;
        this._alphaProtectionMin = 0;
        this._alphaProtectionMax = 0;
        this._stallSpeed = 0;
        this._maxSpeed = 600;
        this._lastMaxSpeedOverride = 600;
        this._lastMaxSpeedOverrideTime = 0;
        this._smoothFactor = 0.5;
        this.blueAirspeed = -1;
        this.redAirspeed = -1;
        this.selectedAirspeed = -1;
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
        this.machPrefixSVG = null;
        this.machValueSVG = null;
        this.groundSpeedSVG = null;
        this.cursorIntegrals = null;
        this.cursorDecimals = null;
        this.targetSpeedSVG = null;
        this.targetSpeedBgSVG = null;
        this.targetSpeedIconSVG = null;
        this.targetSpeedPointerSVG = null;
        this.speedTrendArrowSVG = null;
        this.speedTrendArrowSVGShape = null;
        this.blueSpeedSVG = null;
        this.blueSpeedText = null;
        this.redSpeedSVG = null;
        this.redSpeedText = null;
        this.speedNotSetSVG = null;
        this.nextFlapSVG = null;
        this.nextFlapSVGShape = null;
        this.greenDotSVG = null;
        this.greenDotSVGShape = null;
        this.stripsSVG = null;
        this.vMaxStripSVG = null;
        this.vLSStripSVG = null;
        this.stallProtMinStripSVG = null;
        this.stallProtMaxStripSVG = null;
        this.stallStripSVG = null;
        this.speedMarkerSVG = null;
        this.speedMarkersWidth = null;
        this.speedMarkersHeight = null;
        this.speedMarkers.splice(0, this.speedMarkers.length);
        this.vSpeedSVG = null;
        this.v1Speed = null;
        this.vRSpeed = null;
        this.v2Speed = null;
        this.vXSpeed = null;
        this.graduationVLine = null;
        this.stripBorderSize = 0;
        this.stripOffsetX = 0;
        if (this.aircraft == Aircraft.CJ4)
            this.construct_CJ4();
        else if (this.aircraft == Aircraft.B747_8)
            this.construct_B747_8();
        else if (this.aircraft == Aircraft.AS01B)
            this.construct_AS01B();
        else if (this.aircraft == Aircraft.AS03D)
            this.construct_AS03D();
        else
            this.construct_A320_Neo();
    }
    construct_CJ4() {
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 250 500");
        var width = 140;
        var height = 415;
        var posX = width * 0.5;
        var posY = 452.5;
        var gradWidth = 90;
        this.refHeight = height;
        this.graduationSpacing = 27.5;
        this.graduationScroller = new Avionics.Scroller(this.nbPrimaryGraduations, 10);
        this.cursorIntegrals = new Array();
        this.cursorIntegrals.push(new Avionics.AirspeedScroller(66, 10));
        this.cursorIntegrals.push(new Avionics.AirspeedScroller(66, 100));
        this.cursorDecimals = new Avionics.AirspeedScroller(30);
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "Airspeed");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        {
            this.machPrefixSVG = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.machPrefixSVG, "M.");
            diffAndSetAttribute(this.machPrefixSVG, "x", (posX - 20) + '');
            diffAndSetAttribute(this.machPrefixSVG, "y", (posY + 32) + '');
            diffAndSetAttribute(this.machPrefixSVG, "fill", "cyan");
            diffAndSetAttribute(this.machPrefixSVG, "font-size", (this.fontSize * 1.1) + '');
            diffAndSetAttribute(this.machPrefixSVG, "font-family", "Roboto-Light");
            diffAndSetAttribute(this.machPrefixSVG, "text-anchor", "end");
            diffAndSetAttribute(this.machPrefixSVG, "alignment-baseline", "top");
            this.rootGroup.appendChild(this.machPrefixSVG);
            this.machValueSVG = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.machValueSVG, "422");
            diffAndSetAttribute(this.machValueSVG, "x", (posX - 18) + '');
            diffAndSetAttribute(this.machValueSVG, "y", (posY + 32) + '');
            diffAndSetAttribute(this.machValueSVG, "fill", "cyan");
            diffAndSetAttribute(this.machValueSVG, "font-size", (this.fontSize * 1.0) + '');
            diffAndSetAttribute(this.machValueSVG, "font-family", "Roboto-Light");
            diffAndSetAttribute(this.machValueSVG, "text-anchor", "start");
            diffAndSetAttribute(this.machPrefixSVG, "alignment-baseline", "top");
            this.rootGroup.appendChild(this.machValueSVG);
        }
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
            var graduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(graduationGroup, "id", "Graduations");
            {
                this.graduationScrollPosX = _left + gradWidth;
                this.graduationScrollPosY = _top + _height * 0.5;
                this.graduations = [];
                for (var i = 0; i < this.totalGraduations; i++) {
                    var line = new Avionics.SVGGraduation();
                    line.IsPrimary = (i % (this.nbSecondaryGraduations + 1)) ? false : true;
                    var lineWidth = line.IsPrimary ? 20 : 8;
                    var lineHeight = line.IsPrimary ? 2 : 2;
                    var linePosX = -lineWidth;
                    line.SVGLine = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(line.SVGLine, "x", linePosX + '');
                    diffAndSetAttribute(line.SVGLine, "width", lineWidth + '');
                    diffAndSetAttribute(line.SVGLine, "height", lineHeight + '');
                    diffAndSetAttribute(line.SVGLine, "fill", "white");
                    if (line.IsPrimary) {
                        line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetAttribute(line.SVGText1, "x", (linePosX - 8) + '');
                        diffAndSetAttribute(line.SVGText1, "fill", "white");
                        diffAndSetAttribute(line.SVGText1, "font-size", (this.fontSize * 0.75) + '');
                        diffAndSetAttribute(line.SVGText1, "font-family", "Roboto-Light");
                        diffAndSetAttribute(line.SVGText1, "text-anchor", "end");
                        diffAndSetAttribute(line.SVGText1, "alignment-baseline", "central");
                    }
                    this.graduations.push(line);
                }
                this.graduationVLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(this.graduationVLine, "x1", this.graduationScrollPosX + '');
                diffAndSetAttribute(this.graduationVLine, "y1", "0");
                diffAndSetAttribute(this.graduationVLine, "x2", this.graduationScrollPosX + '');
                diffAndSetAttribute(this.graduationVLine, "y2", "0");
                diffAndSetAttribute(this.graduationVLine, "stroke", "white");
                diffAndSetAttribute(this.graduationVLine, "stroke-width", "2");
                for (var i = 0; i < this.totalGraduations; i++) {
                    var line = this.graduations[i];
                    graduationGroup.appendChild(line.SVGLine);
                    if (line.SVGText1) {
                        graduationGroup.appendChild(line.SVGText1);
                    }
                }
                graduationGroup.appendChild(this.graduationVLine);
                this.centerSVG.appendChild(graduationGroup);
            }
            var cursorPosX = _left - 18;
            var cursorPosY = _top + _height * 0.5 + 2;
            var cursorWidth = width;
            var cursorHeight = 64;
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
            diffAndSetAttribute(this.cursorSVG, "viewBox", "0 7 " + cursorWidth + " " + cursorHeight);
            {
                var _cursorPosX = -2;
                var _cursorPosY = cursorHeight * 0.5 + 7;
                if (!this.cursorSVGShape)
                    this.cursorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.cursorSVGShape, "fill", "black");
                diffAndSetAttribute(this.cursorSVGShape, "d", "M24 22 L62 22 L62 8 L86 8 L86 28 L105 39 L86 50 L86 71 L62 71 L62 56 L24 56 Z");
                diffAndSetAttribute(this.cursorSVGShape, "stroke", "white");
                diffAndSetAttribute(this.cursorSVGShape, "stroke-width", "2");
                this.cursorSVG.appendChild(this.cursorSVGShape);
                let integralsGroup = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(integralsGroup, "x", "0");
                diffAndSetAttribute(integralsGroup, "y", "28");
                diffAndSetAttribute(integralsGroup, "width", cursorWidth + '');
                diffAndSetAttribute(integralsGroup, "height", (cursorHeight - 40) + '');
                diffAndSetAttribute(integralsGroup, "viewBox", "0 0 " + cursorWidth + " " + cursorHeight);
                this.cursorSVG.appendChild(integralsGroup);
                {
                    this.cursorIntegrals[0].construct(integralsGroup, _cursorPosX + 56, _cursorPosY - 15, _width, "Roboto-Bold", this.fontSize * 3.1, "green");
                    this.cursorIntegrals[1].construct(integralsGroup, _cursorPosX + 9, _cursorPosY - 15, _width, "Roboto-Bold", this.fontSize * 3.1, "green");
                }
                this.cursorDecimals.construct(this.cursorSVG, _cursorPosX + 86, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.2, "green");
            }
            if (!this.speedTrendArrowSVG) {
                this.speedTrendArrowSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.speedTrendArrowSVG, "id", "SpeedTrendArrowGroup");
            }
            else
                Utils.RemoveAllChildren(this.speedTrendArrowSVG);
            diffAndSetAttribute(this.speedTrendArrowSVG, "x", "68");
            diffAndSetAttribute(this.speedTrendArrowSVG, "y", "0");
            diffAndSetAttribute(this.speedTrendArrowSVG, "width", "250");
            diffAndSetAttribute(this.speedTrendArrowSVG, "height", height + '');
            diffAndSetAttribute(this.speedTrendArrowSVG, "viewBox", "0 0 250 " + height + '');
            {
                if (!this.speedTrendArrowSVGShape)
                    this.speedTrendArrowSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.speedTrendArrowSVGShape, "fill", "none");
                diffAndSetAttribute(this.speedTrendArrowSVGShape, "stroke", "magenta");
                diffAndSetAttribute(this.speedTrendArrowSVGShape, "stroke-width", "2");
                this.speedTrendArrowSVG.appendChild(this.speedTrendArrowSVGShape);
                let dash = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(dash, "x1", "55");
                diffAndSetAttribute(dash, "y1", (height * 0.5) + '');
                diffAndSetAttribute(dash, "x2", "71");
                diffAndSetAttribute(dash, "y2", (height * 0.5) + '');
                diffAndSetAttribute(dash, "stroke", "white");
                diffAndSetAttribute(dash, "stroke-width", "3");
                this.speedTrendArrowSVG.appendChild(dash);
            }
            var stripViewPosX = _left + gradWidth + 2;
            var stripViewPosY = this.stripBorderSize;
            var stripViewWidth = width;
            var stripViewHeight = _height - this.stripBorderSize * 2;
            if (!this.stripsSVG) {
                this.stripsSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.stripsSVG, "id", "StripsGroup");
            }
            else
                Utils.RemoveAllChildren(this.stripsSVG);
            diffAndSetAttribute(this.stripsSVG, "x", fastToFixed(stripViewPosX, 0));
            diffAndSetAttribute(this.stripsSVG, "y", fastToFixed(stripViewPosY, 0));
            diffAndSetAttribute(this.stripsSVG, "width", fastToFixed(stripViewWidth, 0));
            diffAndSetAttribute(this.stripsSVG, "height", fastToFixed(stripViewHeight, 0));
            diffAndSetAttribute(this.stripsSVG, "viewBox", "0 0 " + stripViewWidth + " " + stripViewHeight);
            {
                this.stripHeight = stripViewHeight * 3;
                this.vMaxStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.vMaxStripSVG, "id", "VMax");
                {
                    let stripWidth = 9;
                    let shape = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(shape, "fill", "red");
                    diffAndSetAttribute(shape, "d", "M 0 0 l " + stripWidth + " 0 l 0 " + (this.stripHeight) + " l " + (-stripWidth) + " 0 Z");
                    this.vMaxStripSVG.appendChild(shape);
                }
                this.stripsSVG.appendChild(this.vMaxStripSVG);
                this.stallStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.stallStripSVG, "id", "Stall");
                {
                    let stripWidth = 9;
                    let shape = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(shape, "fill", "red");
                    diffAndSetAttribute(shape, "d", "M 0 0 l " + stripWidth + " 0 l 0 " + (this.stripHeight) + " l " + (-stripWidth) + " 0 Z");
                    this.stallStripSVG.appendChild(shape);
                }
                this.stripsSVG.appendChild(this.stallStripSVG);
            }
            var targetSpeedPointerPosX = _left + gradWidth;
            var targetSpeedPointerPosY = _top + _height * 0.5;
            var targetSpeedPointerWidth = width;
            this.targetSpeedPointerHeight = 47;
            this.targetSpeedPointerSVG = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.targetSpeedPointerSVG, "id", "TargetSpeedPointerGroup");
            diffAndSetAttribute(this.targetSpeedPointerSVG, "x", targetSpeedPointerPosX + '');
            diffAndSetAttribute(this.targetSpeedPointerSVG, "y", (targetSpeedPointerPosY - this.targetSpeedPointerHeight * 0.5) + '');
            diffAndSetAttribute(this.targetSpeedPointerSVG, "width", targetSpeedPointerWidth + '');
            diffAndSetAttribute(this.targetSpeedPointerSVG, "height", this.targetSpeedPointerHeight + '');
            diffAndSetAttribute(this.targetSpeedPointerSVG, "viewBox", "0 0 " + targetSpeedPointerWidth + " " + this.targetSpeedPointerHeight);
            {
                let shape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(shape, "fill", "none");
                diffAndSetAttribute(shape, "stroke", "cyan");
                diffAndSetAttribute(shape, "stroke-width", "2");
                diffAndSetAttribute(shape, "d", "M 0 22 L 25 10 L 46 10 L 46 34 L 25 34 Z");
                this.targetSpeedPointerSVG.appendChild(shape);
            }
            var speedMarkersPosX = _left + gradWidth;
            var speedMarkersPosY = 0;
            this.speedMarkersWidth = width;
            this.speedMarkersHeight = 70;
            this.createSpeedMarker("1", speedMarkersPosX, speedMarkersPosY, this.updateMarkerV1, 0.8, 0.9, "cyan", false);
            this.createSpeedMarker("R", speedMarkersPosX, speedMarkersPosY, this.updateMarkerVR, 0.8, 0.9, "cyan", false);
            this.createSpeedMarker("2", speedMarkersPosX, speedMarkersPosY, this.updateMarkerV2, 0.8, 0.9, "cyan", false);
            this.createSpeedMarker("RF", speedMarkersPosX, speedMarkersPosY, this.updateMarkerVRef, 0.8, 0.9, "cyan", false);
            this.createSpeedMarker("T", speedMarkersPosX, speedMarkersPosY, this.updateMarkerVX, 0.8, 0.9, "cyan", false);
            this.centerSVG.appendChild(this.stripsSVG);
            this.centerSVG.appendChild(this.speedMarkerSVG);
            this.centerSVG.appendChild(this.targetSpeedPointerSVG);
            this.centerSVG.appendChild(this.cursorSVG);
            this.centerSVG.appendChild(this.speedTrendArrowSVG);
        }
        this.rootGroup.appendChild(this.centerSVG);
        this.vSpeedSVG = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.vSpeedSVG, "id", "VSpeeds");
        {
            let speedX = posX - 62;
            let speedY = posY + height - 18;
            let title = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(title, "V1");
            diffAndSetAttribute(title, "x", speedX + '');
            diffAndSetAttribute(title, "y", speedY + '');
            diffAndSetAttribute(title, "fill", "magenta");
            diffAndSetAttribute(title, "font-size", (this.fontSize * 0.8) + '');
            diffAndSetAttribute(title, "font-family", "Roboto-Bold");
            diffAndSetAttribute(title, "text-anchor", "start");
            diffAndSetAttribute(title, "alignment-baseline", "central");
            this.vSpeedSVG.appendChild(title);
            this.v1Speed = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.v1Speed, "x", (speedX + 30) + '');
            diffAndSetAttribute(this.v1Speed, "y", speedY + '');
            diffAndSetAttribute(this.v1Speed, "fill", "magenta");
            diffAndSetAttribute(this.v1Speed, "font-size", (this.fontSize * 0.8) + '');
            diffAndSetAttribute(this.v1Speed, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.v1Speed, "text-anchor", "start");
            diffAndSetAttribute(this.v1Speed, "alignment-baseline", "central");
            this.vSpeedSVG.appendChild(this.v1Speed);
            speedY -= 25;
            title = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(title, "VR");
            diffAndSetAttribute(title, "x", speedX + '');
            diffAndSetAttribute(title, "y", speedY + '');
            diffAndSetAttribute(title, "fill", "magenta");
            diffAndSetAttribute(title, "font-size", (this.fontSize * 0.8) + '');
            diffAndSetAttribute(title, "font-family", "Roboto-Bold");
            diffAndSetAttribute(title, "text-anchor", "start");
            diffAndSetAttribute(title, "alignment-baseline", "central");
            this.vSpeedSVG.appendChild(title);
            this.vRSpeed = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.vRSpeed, "x", (speedX + 30) + '');
            diffAndSetAttribute(this.vRSpeed, "y", speedY + '');
            diffAndSetAttribute(this.vRSpeed, "fill", "magenta");
            diffAndSetAttribute(this.vRSpeed, "font-size", (this.fontSize * 0.8) + '');
            diffAndSetAttribute(this.vRSpeed, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.vRSpeed, "text-anchor", "start");
            diffAndSetAttribute(this.vRSpeed, "alignment-baseline", "central");
            this.vSpeedSVG.appendChild(this.vRSpeed);
            speedY -= 25;
            title = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(title, "V2");
            diffAndSetAttribute(title, "x", speedX + '');
            diffAndSetAttribute(title, "y", speedY + '');
            diffAndSetAttribute(title, "fill", "magenta");
            diffAndSetAttribute(title, "font-size", (this.fontSize * 0.8) + '');
            diffAndSetAttribute(title, "font-family", "Roboto-Bold");
            diffAndSetAttribute(title, "text-anchor", "start");
            diffAndSetAttribute(title, "alignment-baseline", "central");
            this.vSpeedSVG.appendChild(title);
            this.v2Speed = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.v2Speed, "x", (speedX + 30) + '');
            diffAndSetAttribute(this.v2Speed, "y", speedY + '');
            diffAndSetAttribute(this.v2Speed, "fill", "magenta");
            diffAndSetAttribute(this.v2Speed, "font-size", (this.fontSize * 0.8) + '');
            diffAndSetAttribute(this.v2Speed, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.v2Speed, "text-anchor", "start");
            diffAndSetAttribute(this.v2Speed, "alignment-baseline", "central");
            this.vSpeedSVG.appendChild(this.v2Speed);
            speedY -= 25;
            title = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(title, "VT");
            diffAndSetAttribute(title, "x", speedX + '');
            diffAndSetAttribute(title, "y", speedY + '');
            diffAndSetAttribute(title, "fill", "magenta");
            diffAndSetAttribute(title, "font-size", (this.fontSize * 0.8) + '');
            diffAndSetAttribute(title, "font-family", "Roboto-Bold");
            diffAndSetAttribute(title, "text-anchor", "start");
            diffAndSetAttribute(title, "alignment-baseline", "central");
            this.vSpeedSVG.appendChild(title);
            this.vXSpeed = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.vXSpeed, "x", (speedX + 30) + '');
            diffAndSetAttribute(this.vXSpeed, "y", speedY + '');
            diffAndSetAttribute(this.vXSpeed, "fill", "magenta");
            diffAndSetAttribute(this.vXSpeed, "font-size", (this.fontSize * 0.8) + '');
            diffAndSetAttribute(this.vXSpeed, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.vXSpeed, "text-anchor", "start");
            diffAndSetAttribute(this.vXSpeed, "alignment-baseline", "central");
            this.vSpeedSVG.appendChild(this.vXSpeed);
        }
        this.rootGroup.appendChild(this.vSpeedSVG);
        this.targetSpeedIconSVG = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(this.targetSpeedIconSVG, "fill", "black");
        diffAndSetAttribute(this.targetSpeedIconSVG, "d", "M13 22 l15 -8 l15 0 l0 16 l-15 0 l-15 -8 Z");
        diffAndSetAttribute(this.targetSpeedIconSVG, "fill", "none");
        diffAndSetAttribute(this.targetSpeedIconSVG, "stroke", "cyan");
        diffAndSetAttribute(this.targetSpeedIconSVG, "stroke-width", "0.85");
        this.rootGroup.appendChild(this.targetSpeedIconSVG);
        this.targetSpeedSVG = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetText(this.targetSpeedSVG, "260");
        diffAndSetAttribute(this.targetSpeedSVG, "x", (posX - 20) + '');
        diffAndSetAttribute(this.targetSpeedSVG, "y", (posY - 8) + '');
        diffAndSetAttribute(this.targetSpeedSVG, "fill", "green");
        diffAndSetAttribute(this.targetSpeedSVG, "font-size", (this.fontSize * 0.9) + '');
        diffAndSetAttribute(this.targetSpeedSVG, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.targetSpeedSVG, "text-anchor", "start");
        this.rootGroup.appendChild(this.targetSpeedSVG);
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
        var arcWidth = 100;
        this.refHeight = height;
        this.stripOffsetX = -2;
        this.graduationSpacing = 54;
        this.graduationScroller = new Avionics.Scroller(this.nbPrimaryGraduations, 20);
        this.cursorIntegrals = new Array();
        this.cursorIntegrals.push(new Avionics.AirspeedScroller(52, 10));
        this.cursorIntegrals.push(new Avionics.AirspeedScroller(52, 100));
        this.cursorDecimals = new Avionics.AirspeedScroller(37);
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "Airspeed");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        var sideTextHeight = 75;
        if (!this.targetSpeedSVG)
            this.targetSpeedSVG = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetText(this.targetSpeedSVG, ".000");
        diffAndSetAttribute(this.targetSpeedSVG, "x", (posX + 10) + '');
        diffAndSetAttribute(this.targetSpeedSVG, "y", (posY + sideTextHeight * 0.5) + '');
        diffAndSetAttribute(this.targetSpeedSVG, "fill", "#D570FF");
        diffAndSetAttribute(this.targetSpeedSVG, "font-size", (this.fontSize * 1.6) + '');
        diffAndSetAttribute(this.targetSpeedSVG, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.targetSpeedSVG, "text-anchor", "middle");
        diffAndSetAttribute(this.targetSpeedSVG, "alignment-baseline", "central");
        this.rootGroup.appendChild(this.targetSpeedSVG);
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
            var _left = 7;
            var _width = width;
            var _height = height;
            var bg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(bg, "x", _left + '');
            diffAndSetAttribute(bg, "y", _top + '');
            diffAndSetAttribute(bg, "width", _width + '');
            diffAndSetAttribute(bg, "height", _height + '');
            diffAndSetAttribute(bg, "fill", "#343B51");
            this.centerSVG.appendChild(bg);
            var graduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(graduationGroup, "id", "Graduations");
            {
                this.graduationScrollPosX = _left + _width;
                this.graduationScrollPosY = _top + _height * 0.5;
                this.graduations = [];
                for (var i = 0; i < this.totalGraduations; i++) {
                    var line = new Avionics.SVGGraduation();
                    line.IsPrimary = (i % (this.nbSecondaryGraduations + 1)) ? false : true;
                    var lineWidth = line.IsPrimary ? 22 : 22;
                    var lineHeight = line.IsPrimary ? 3 : 3;
                    var linePosX = -lineWidth;
                    line.SVGLine = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(line.SVGLine, "x", linePosX + '');
                    diffAndSetAttribute(line.SVGLine, "width", lineWidth + '');
                    diffAndSetAttribute(line.SVGLine, "height", lineHeight + '');
                    diffAndSetAttribute(line.SVGLine, "fill", "white");
                    if (line.IsPrimary) {
                        line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetAttribute(line.SVGText1, "x", (linePosX - 10) + '');
                        diffAndSetAttribute(line.SVGText1, "fill", "white");
                        diffAndSetAttribute(line.SVGText1, "font-size", (this.fontSize * 1.1) + '');
                        diffAndSetAttribute(line.SVGText1, "font-family", "Roboto-Bold");
                        diffAndSetAttribute(line.SVGText1, "text-anchor", "end");
                        diffAndSetAttribute(line.SVGText1, "alignment-baseline", "central");
                    }
                    this.graduations.push(line);
                }
                for (var i = 0; i < this.totalGraduations; i++) {
                    var line = this.graduations[i];
                    graduationGroup.appendChild(line.SVGLine);
                    if (line.SVGText1) {
                        graduationGroup.appendChild(line.SVGText1);
                    }
                }
                this.centerSVG.appendChild(graduationGroup);
            }
            var cursorPosX = _left - 7;
            var cursorPosY = _top + _height * 0.5 + 3;
            var cursorWidth = width;
            var cursorHeight = 76;
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
            diffAndSetAttribute(this.cursorSVG, "viewBox", "0 2 " + cursorWidth + " " + cursorHeight);
            {
                if (!this.cursorSVGShape)
                    this.cursorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.cursorSVGShape, "fill", "black");
                diffAndSetAttribute(this.cursorSVGShape, "d", "M2 2 L76 2 L76 28 L88 38 L76 50 L76 78 L2 78 Z");
                diffAndSetAttribute(this.cursorSVGShape, "stroke", "white");
                diffAndSetAttribute(this.cursorSVGShape, "stroke-width", "0.85");
                this.cursorSVG.appendChild(this.cursorSVGShape);
                var _cursorPosX = -14;
                var _cursorPosY = cursorHeight * 0.5;
                this.cursorIntegrals[0].construct(this.cursorSVG, _cursorPosX + 64, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.5, "white");
                this.cursorIntegrals[1].construct(this.cursorSVG, _cursorPosX + 40, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.5, "white");
                this.cursorDecimals.construct(this.cursorSVG, _cursorPosX + 87, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.5, "white");
            }
            if (!this.speedTrendArrowSVG) {
                this.speedTrendArrowSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.speedTrendArrowSVG, "id", "SpeedTrendArrowGroup");
            }
            else
                Utils.RemoveAllChildren(this.speedTrendArrowSVG);
            diffAndSetAttribute(this.speedTrendArrowSVG, "x", "18");
            diffAndSetAttribute(this.speedTrendArrowSVG, "y", "0");
            diffAndSetAttribute(this.speedTrendArrowSVG, "width", "250");
            diffAndSetAttribute(this.speedTrendArrowSVG, "height", height + '');
            diffAndSetAttribute(this.speedTrendArrowSVG, "viewBox", "0 0 250 " + height + '');
            {
                if (!this.speedTrendArrowSVGShape)
                    this.speedTrendArrowSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.speedTrendArrowSVGShape, "fill", "none");
                diffAndSetAttribute(this.speedTrendArrowSVGShape, "stroke", "green");
                diffAndSetAttribute(this.speedTrendArrowSVGShape, "stroke-width", "2");
                this.speedTrendArrowSVG.appendChild(this.speedTrendArrowSVGShape);
            }
            var stripViewPosX = _left + _width;
            var stripViewPosY = this.stripBorderSize;
            var stripViewWidth = width;
            var stripViewHeight = _height - this.stripBorderSize * 2;
            if (!this.stripsSVG) {
                this.stripsSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.stripsSVG, "id", "StripsGroup");
            }
            else
                Utils.RemoveAllChildren(this.stripsSVG);
            diffAndSetAttribute(this.stripsSVG, "x", fastToFixed(stripViewPosX, 0));
            diffAndSetAttribute(this.stripsSVG, "y", fastToFixed(stripViewPosY, 0));
            diffAndSetAttribute(this.stripsSVG, "width", fastToFixed(stripViewWidth, 0));
            diffAndSetAttribute(this.stripsSVG, "height", fastToFixed(stripViewHeight, 0));
            diffAndSetAttribute(this.stripsSVG, "viewBox", "0 0 " + stripViewWidth + " " + stripViewHeight);
            {
                this.stripHeight = stripViewHeight * 3;
                this.vMaxStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.vMaxStripSVG, "id", "VMax");
                {
                    let stripWidth = 14;
                    let shape = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(shape, "fill", "black");
                    diffAndSetAttribute(shape, "stroke", "none");
                    diffAndSetAttribute(shape, "d", "M 0 0 l " + stripWidth + " 0 l 0 " + (this.stripHeight) + " l " + (-stripWidth) + " 0 Z");
                    this.vMaxStripSVG.appendChild(shape);
                    let dashHeight = stripWidth * 1.0;
                    let dashSpacing = dashHeight * 1.15;
                    let y = this.stripHeight - dashHeight;
                    while (y > 0) {
                        let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(rect, "fill", "red");
                        diffAndSetAttribute(rect, "x", "0");
                        diffAndSetAttribute(rect, "y", y + '');
                        diffAndSetAttribute(rect, "width", stripWidth + '');
                        diffAndSetAttribute(rect, "height", dashHeight + '');
                        this.vMaxStripSVG.appendChild(rect);
                        y -= dashHeight + dashSpacing;
                    }
                }
                this.stripsSVG.appendChild(this.vMaxStripSVG);
                this.stallProtMinStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.stallProtMinStripSVG, "id", "StallProtMin");
                {
                    let stripWidth = 9;
                    let shape = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(shape, "fill", "none");
                    diffAndSetAttribute(shape, "stroke", "orange");
                    diffAndSetAttribute(shape, "stroke-width", "3");
                    diffAndSetAttribute(shape, "d", "M 0 0 l " + stripWidth + " 0 l 0 " + (this.stripHeight) + " l " + (-stripWidth) + " 0 Z");
                    this.stallProtMinStripSVG.appendChild(shape);
                }
                this.stripsSVG.appendChild(this.stallProtMinStripSVG);
                this.stallProtMaxStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.stallProtMaxStripSVG, "id", "StallProtMax");
                {
                    let stripWidth = 14;
                    let shape = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(shape, "fill", "black");
                    diffAndSetAttribute(shape, "stroke", "none");
                    diffAndSetAttribute(shape, "d", "M 0 0 l " + stripWidth + " 0 l 0 " + (this.stripHeight) + " l " + (-stripWidth) + " 0 Z");
                    this.stallProtMaxStripSVG.appendChild(shape);
                    let dashHeight = stripWidth * 1.0;
                    let dashSpacing = dashHeight * 1.15;
                    let y = 0;
                    while (y < this.stripHeight) {
                        let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(rect, "fill", "red");
                        diffAndSetAttribute(rect, "x", "0");
                        diffAndSetAttribute(rect, "y", y + '');
                        diffAndSetAttribute(rect, "width", stripWidth + '');
                        diffAndSetAttribute(rect, "height", dashHeight + '');
                        this.stallProtMaxStripSVG.appendChild(rect);
                        y += dashHeight + dashSpacing;
                    }
                }
                this.stripsSVG.appendChild(this.stallProtMaxStripSVG);
            }
            this.speedNotSetSVG = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.speedNotSetSVG, "id", "speedNotSet");
            {
                let textPosX = _left + _width * 1.25;
                let textPosY = _top + _height * 0.325;
                let textSpace = 25;
                let text = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(text, "NO");
                diffAndSetAttribute(text, "x", textPosX + '');
                diffAndSetAttribute(text, "y", textPosY + '');
                diffAndSetAttribute(text, "fill", "orange");
                diffAndSetAttribute(text, "font-size", (this.fontSize * 1.0) + '');
                diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                diffAndSetAttribute(text, "text-anchor", "middle");
                diffAndSetAttribute(text, "alignment-baseline", "central");
                this.speedNotSetSVG.appendChild(text);
                textPosY += textSpace;
                text = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(text, "V");
                diffAndSetAttribute(text, "x", textPosX + '');
                diffAndSetAttribute(text, "y", textPosY + '');
                diffAndSetAttribute(text, "fill", "orange");
                diffAndSetAttribute(text, "font-size", (this.fontSize * 1.0) + '');
                diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                diffAndSetAttribute(text, "text-anchor", "middle");
                diffAndSetAttribute(text, "alignment-baseline", "central");
                this.speedNotSetSVG.appendChild(text);
                textPosY += textSpace;
                text = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(text, "S");
                diffAndSetAttribute(text, "x", textPosX + '');
                diffAndSetAttribute(text, "y", textPosY + '');
                diffAndSetAttribute(text, "fill", "orange");
                diffAndSetAttribute(text, "font-size", (this.fontSize * 1.0) + '');
                diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                diffAndSetAttribute(text, "text-anchor", "middle");
                diffAndSetAttribute(text, "alignment-baseline", "central");
                this.speedNotSetSVG.appendChild(text);
                textPosY += textSpace;
                text = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(text, "P");
                diffAndSetAttribute(text, "x", textPosX + '');
                diffAndSetAttribute(text, "y", textPosY + '');
                diffAndSetAttribute(text, "fill", "orange");
                diffAndSetAttribute(text, "font-size", (this.fontSize * 1.0) + '');
                diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                diffAndSetAttribute(text, "text-anchor", "middle");
                diffAndSetAttribute(text, "alignment-baseline", "central");
                this.speedNotSetSVG.appendChild(text);
                textPosY += textSpace;
                text = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(text, "D");
                diffAndSetAttribute(text, "x", textPosX + '');
                diffAndSetAttribute(text, "y", textPosY + '');
                diffAndSetAttribute(text, "fill", "orange");
                diffAndSetAttribute(text, "font-size", (this.fontSize * 1.0) + '');
                diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                diffAndSetAttribute(text, "text-anchor", "middle");
                diffAndSetAttribute(text, "alignment-baseline", "central");
                this.speedNotSetSVG.appendChild(text);
            }
            var targetSpeedPointerPosX = _left + _width * 0.77;
            var targetSpeedPointerPosY = _top + _height * 0.5;
            var targetSpeedPointerWidth = width;
            this.targetSpeedPointerHeight = 46;
            this.targetSpeedPointerSVG = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.targetSpeedPointerSVG, "id", "TargetSpeedPointerGroup");
            diffAndSetAttribute(this.targetSpeedPointerSVG, "x", targetSpeedPointerPosX + '');
            diffAndSetAttribute(this.targetSpeedPointerSVG, "y", (targetSpeedPointerPosY - this.targetSpeedPointerHeight * 0.5) + '');
            diffAndSetAttribute(this.targetSpeedPointerSVG, "width", targetSpeedPointerWidth + '');
            diffAndSetAttribute(this.targetSpeedPointerSVG, "height", this.targetSpeedPointerHeight + '');
            diffAndSetAttribute(this.targetSpeedPointerSVG, "viewBox", "0 0 " + targetSpeedPointerWidth + " " + this.targetSpeedPointerHeight);
            {
                let shape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(shape, "fill", "none");
                diffAndSetAttribute(shape, "stroke", "#D570FF");
                diffAndSetAttribute(shape, "stroke-width", "2");
                diffAndSetAttribute(shape, "d", "M 0 22 L 25 10 L 52 10 L 52 34 L 25 34 Z");
                this.targetSpeedPointerSVG.appendChild(shape);
            }
            var speedMarkersPosX = _left + _width - 5;
            var speedMarkersPosY = 0;
            this.speedMarkersWidth = width;
            this.speedMarkersHeight = 70;
            let nbHandles = Simplane.getFlapsNbHandles();
            for (let i = 0; i < nbHandles; i++) {
                this.createSpeedMarker("", speedMarkersPosX, speedMarkersPosY, this.updateMarkerFlap, 0.8, 1.4, "#24F000", false, [i]);
            }
            this.createSpeedMarker("V1", speedMarkersPosX, speedMarkersPosY, this.updateMarkerV1, 0.8, 1.2, "#24F000");
            this.createSpeedMarker("VR", speedMarkersPosX, speedMarkersPosY, this.updateMarkerVR, 0.8, 1.2, "#24F000");
            this.createSpeedMarker("V2", speedMarkersPosX, speedMarkersPosY, this.updateMarkerV2, 0.8, 1.2, "#24F000");
            this.createSpeedMarker("REF", speedMarkersPosX, speedMarkersPosY, this.updateMarkerVRef, 0.8, 1.2, "#24F000");
            this.centerSVG.appendChild(this.stripsSVG);
            this.centerSVG.appendChild(this.speedNotSetSVG);
            this.centerSVG.appendChild(this.speedMarkerSVG);
            this.centerSVG.appendChild(this.targetSpeedPointerSVG);
            this.centerSVG.appendChild(this.cursorSVG);
            this.centerSVG.appendChild(this.speedTrendArrowSVG);
        }
        this.rootGroup.appendChild(this.centerSVG);
        {
            this.machPrefixSVG = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.machPrefixSVG, ".");
            diffAndSetAttribute(this.machPrefixSVG, "x", (posX - 4) + '');
            diffAndSetAttribute(this.machPrefixSVG, "y", (posY + height + sideTextHeight * 0.65) + '');
            diffAndSetAttribute(this.machPrefixSVG, "fill", "white");
            diffAndSetAttribute(this.machPrefixSVG, "font-size", (this.fontSize * 1.1) + '');
            diffAndSetAttribute(this.machPrefixSVG, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.machPrefixSVG, "text-anchor", "end");
            diffAndSetAttribute(this.machPrefixSVG, "alignment-baseline", "top");
            this.rootGroup.appendChild(this.machPrefixSVG);
            this.machValueSVG = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.machValueSVG, "000");
            diffAndSetAttribute(this.machValueSVG, "x", (posX) + '');
            diffAndSetAttribute(this.machValueSVG, "y", (posY + height + sideTextHeight * 0.65) + '');
            diffAndSetAttribute(this.machValueSVG, "fill", "white");
            diffAndSetAttribute(this.machValueSVG, "font-size", (this.fontSize * 1.25) + '');
            diffAndSetAttribute(this.machValueSVG, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.machValueSVG, "text-anchor", "start");
            diffAndSetAttribute(this.machValueSVG, "alignment-baseline", "top");
            this.rootGroup.appendChild(this.machValueSVG);
        }
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    construct_AS01B() {
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 250 800");
        var posX = 100;
        var posY = 0;
        var width = 105;
        var height = 640;
        var arcWidth = 35;
        this.refHeight = height;
        this.stripOffsetX = -2;
        this.graduationSpacing = 54;
        this.graduationScroller = new Avionics.Scroller(this.nbPrimaryGraduations, 20);
        this.cursorIntegrals = new Array();
        this.cursorIntegrals.push(new Avionics.AirspeedScroller(52, 10));
        this.cursorIntegrals.push(new Avionics.AirspeedScroller(52, 100));
        this.cursorDecimals = new Avionics.AirspeedScroller(37);
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "Airspeed");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        var sideTextHeight = 80;
        if (!this.isHud) {
            this.targetSpeedBgSVG = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.targetSpeedBgSVG, "x", "90");
            diffAndSetAttribute(this.targetSpeedBgSVG, "y", "20");
            diffAndSetAttribute(this.targetSpeedBgSVG, "width", "80");
            diffAndSetAttribute(this.targetSpeedBgSVG, "height", "45");
            diffAndSetAttribute(this.targetSpeedBgSVG, "fill", "black");
            this.rootGroup.appendChild(this.targetSpeedBgSVG);
        }
        if (!this.targetSpeedSVG)
            this.targetSpeedSVG = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetText(this.targetSpeedSVG, ".000");
        diffAndSetAttribute(this.targetSpeedSVG, "x", "165");
        diffAndSetAttribute(this.targetSpeedSVG, "y", (posY + sideTextHeight * 0.5) + '');
        diffAndSetAttribute(this.targetSpeedSVG, "fill", (this.isHud) ? "lime" : "#D570FF");
        diffAndSetAttribute(this.targetSpeedSVG, "font-size", (this.fontSize * 1.5) + '');
        diffAndSetAttribute(this.targetSpeedSVG, "font-family", "Roboto-bold");
        diffAndSetAttribute(this.targetSpeedSVG, "text-anchor", "end");
        diffAndSetAttribute(this.targetSpeedSVG, "alignment-baseline", "central");
        this.rootGroup.appendChild(this.targetSpeedSVG);
        posY += sideTextHeight;
        if (!this.centerSVG) {
            this.centerSVG = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.centerSVG, "id", "CenterGroup");
        }
        else
            Utils.RemoveAllChildren(this.centerSVG);
        diffAndSetAttribute(this.centerSVG, "x", (posX - width * 0.5) + '');
        diffAndSetAttribute(this.centerSVG, "y", posY + '');
        diffAndSetAttribute(this.centerSVG, "width", (width + 30 + arcWidth) + '');
        diffAndSetAttribute(this.centerSVG, "height", height + '');
        diffAndSetAttribute(this.centerSVG, "viewBox", "0 0 " + (width + arcWidth) + " " + height);
        {
            var _top = 0;
            var _left = 7;
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
                diffAndSetAttribute(verticalLine, "x1", (_left + _width) + '');
                diffAndSetAttribute(verticalLine, "y1", _top + '');
                diffAndSetAttribute(verticalLine, "x2", (_left + _width) + '');
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
            var graduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(graduationGroup, "id", "Graduations");
            {
                this.graduationScrollPosX = _left + _width;
                this.graduationScrollPosY = _top + _height * 0.505;
                this.graduations = [];
                for (var i = 0; i < this.totalGraduations; i++) {
                    var line = new Avionics.SVGGraduation();
                    line.IsPrimary = (i % (this.nbSecondaryGraduations + 1)) ? false : true;
                    var lineWidth = line.IsPrimary ? 22 : 22;
                    var lineHeight = line.IsPrimary ? 3 : 3;
                    var linePosX = -lineWidth;
                    line.SVGLine = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(line.SVGLine, "x", linePosX + '');
                    diffAndSetAttribute(line.SVGLine, "width", lineWidth + '');
                    diffAndSetAttribute(line.SVGLine, "height", lineHeight + '');
                    diffAndSetAttribute(line.SVGLine, "fill", (this.isHud) ? "lime" : "white");
                    if (line.IsPrimary) {
                        line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetAttribute(line.SVGText1, "x", (linePosX - 10) + '');
                        diffAndSetAttribute(line.SVGText1, "fill", (this.isHud) ? "lime" : "white");
                        diffAndSetAttribute(line.SVGText1, "font-size", (this.fontSize * 1.1) + '');
                        diffAndSetAttribute(line.SVGText1, "font-family", "Roboto-Bold");
                        diffAndSetAttribute(line.SVGText1, "text-anchor", "end");
                        diffAndSetAttribute(line.SVGText1, "alignment-baseline", "central");
                    }
                    this.graduations.push(line);
                }
                for (var i = 0; i < this.totalGraduations; i++) {
                    var line = this.graduations[i];
                    graduationGroup.appendChild(line.SVGLine);
                    if (line.SVGText1) {
                        graduationGroup.appendChild(line.SVGText1);
                    }
                }
                this.centerSVG.appendChild(graduationGroup);
            }
            var cursorPosX = _left - 7;
            var cursorPosY = _top + _height * 0.5 + 7;
            var cursorWidth = width;
            var cursorHeight = 76;
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
            diffAndSetAttribute(this.cursorSVG, "viewBox", "0 2 " + cursorWidth + " " + cursorHeight);
            {
                if (!this.cursorSVGShape)
                    this.cursorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.cursorSVGShape, "fill", "black");
                diffAndSetAttribute(this.cursorSVGShape, "d", "M2 2 L76 2 L76 28 L88 38 L76 50 L76 78 L2 78 Z");
                diffAndSetAttribute(this.cursorSVGShape, "stroke", (this.isHud) ? "lime" : "white");
                diffAndSetAttribute(this.cursorSVGShape, "stroke-width", "3");
                this.cursorSVG.appendChild(this.cursorSVGShape);
                var _cursorPosX = -14;
                var _cursorPosY = cursorHeight * 0.5;
                this.cursorIntegrals[0].construct(this.cursorSVG, _cursorPosX + 64, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.5, (this.isHud) ? "lime" : "white");
                this.cursorIntegrals[1].construct(this.cursorSVG, _cursorPosX + 40, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.5, (this.isHud) ? "lime" : "white");
                this.cursorDecimals.construct(this.cursorSVG, _cursorPosX + 87, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.5, (this.isHud) ? "lime" : "white");
            }
            this.speedNotSetSVG = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.speedNotSetSVG, "id", "speedNotSet");
            {
                let textPosX = _left + _width * 1.25;
                let textPosY = _top + _height * 0.325;
                let textSpace = 25;
                let text = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(text, "NO");
                diffAndSetAttribute(text, "x", textPosX + '');
                diffAndSetAttribute(text, "y", textPosY + '');
                diffAndSetAttribute(text, "fill", (this.isHud) ? "lime" : "orange");
                diffAndSetAttribute(text, "font-size", (this.fontSize * 1.0) + '');
                diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                diffAndSetAttribute(text, "text-anchor", "middle");
                diffAndSetAttribute(text, "alignment-baseline", "central");
                this.speedNotSetSVG.appendChild(text);
                textPosY += textSpace;
                text = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(text, "V");
                diffAndSetAttribute(text, "x", textPosX + '');
                diffAndSetAttribute(text, "y", textPosY + '');
                diffAndSetAttribute(text, "fill", (this.isHud) ? "lime" : "orange");
                diffAndSetAttribute(text, "font-size", (this.fontSize * 1.0) + '');
                diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                diffAndSetAttribute(text, "text-anchor", "middle");
                diffAndSetAttribute(text, "alignment-baseline", "central");
                this.speedNotSetSVG.appendChild(text);
                textPosY += textSpace;
                text = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(text, "S");
                diffAndSetAttribute(text, "x", textPosX + '');
                diffAndSetAttribute(text, "y", textPosY + '');
                diffAndSetAttribute(text, "fill", (this.isHud) ? "lime" : "orange");
                diffAndSetAttribute(text, "font-size", (this.fontSize * 1.0) + '');
                diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                diffAndSetAttribute(text, "text-anchor", "middle");
                diffAndSetAttribute(text, "alignment-baseline", "central");
                this.speedNotSetSVG.appendChild(text);
                textPosY += textSpace;
                text = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(text, "P");
                diffAndSetAttribute(text, "x", textPosX + '');
                diffAndSetAttribute(text, "y", textPosY + '');
                diffAndSetAttribute(text, "fill", (this.isHud) ? "lime" : "orange");
                diffAndSetAttribute(text, "font-size", (this.fontSize * 1.0) + '');
                diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                diffAndSetAttribute(text, "text-anchor", "middle");
                diffAndSetAttribute(text, "alignment-baseline", "central");
                this.speedNotSetSVG.appendChild(text);
                textPosY += textSpace;
                text = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(text, "D");
                diffAndSetAttribute(text, "x", textPosX + '');
                diffAndSetAttribute(text, "y", textPosY + '');
                diffAndSetAttribute(text, "fill", (this.isHud) ? "lime" : "orange");
                diffAndSetAttribute(text, "font-size", (this.fontSize * 1.0) + '');
                diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                diffAndSetAttribute(text, "text-anchor", "middle");
                diffAndSetAttribute(text, "alignment-baseline", "central");
                this.speedNotSetSVG.appendChild(text);
            }
            var targetSpeedPointerPosX = _left + _width * 0.77;
            var targetSpeedPointerPosY = _top + _height * 0.5;
            var targetSpeedPointerWidth = width;
            this.targetSpeedPointerHeight = 40;
            this.targetSpeedPointerSVG = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.targetSpeedPointerSVG, "id", "TargetSpeedPointerGroup");
            diffAndSetAttribute(this.targetSpeedPointerSVG, "x", targetSpeedPointerPosX + '');
            diffAndSetAttribute(this.targetSpeedPointerSVG, "y", (targetSpeedPointerPosY - this.targetSpeedPointerHeight * 0.5) + '');
            diffAndSetAttribute(this.targetSpeedPointerSVG, "width", targetSpeedPointerWidth + '');
            diffAndSetAttribute(this.targetSpeedPointerSVG, "height", this.targetSpeedPointerHeight + '');
            diffAndSetAttribute(this.targetSpeedPointerSVG, "viewBox", "0 0 " + targetSpeedPointerWidth + " " + this.targetSpeedPointerHeight);
            {
                let shape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(shape, "fill", "none");
                diffAndSetAttribute(shape, "stroke", (this.isHud) ? "lime" : "#D570FF");
                diffAndSetAttribute(shape, "stroke-width", "2");
                diffAndSetAttribute(shape, "d", "M 0 22 L 25 10 L 52 10 L 52 34 L 25 34 Z");
                this.targetSpeedPointerSVG.appendChild(shape);
            }
            if (!this.speedTrendArrowSVG) {
                this.speedTrendArrowSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.speedTrendArrowSVG, "id", "SpeedTrendArrowGroup");
            }
            else
                Utils.RemoveAllChildren(this.speedTrendArrowSVG);
            diffAndSetAttribute(this.speedTrendArrowSVG, "x", "18");
            diffAndSetAttribute(this.speedTrendArrowSVG, "y", "0");
            diffAndSetAttribute(this.speedTrendArrowSVG, "width", "250");
            diffAndSetAttribute(this.speedTrendArrowSVG, "height", height + '');
            diffAndSetAttribute(this.speedTrendArrowSVG, "viewBox", "0 0 250 " + height + '');
            {
                if (!this.speedTrendArrowSVGShape)
                    this.speedTrendArrowSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.speedTrendArrowSVGShape, "fill", "none");
                diffAndSetAttribute(this.speedTrendArrowSVGShape, "stroke", (this.isHud) ? "lime" : "green");
                diffAndSetAttribute(this.speedTrendArrowSVGShape, "stroke-width", "2");
                this.speedTrendArrowSVG.appendChild(this.speedTrendArrowSVGShape);
            }
            var stripViewPosX = _left + _width;
            var stripViewPosY = this.stripBorderSize;
            var stripViewWidth = width;
            var stripViewHeight = _height - this.stripBorderSize * 2;
            if (!this.stripsSVG) {
                this.stripsSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.stripsSVG, "id", "StripsGroup");
            }
            else
                Utils.RemoveAllChildren(this.stripsSVG);
            diffAndSetAttribute(this.stripsSVG, "x", fastToFixed(stripViewPosX, 0));
            diffAndSetAttribute(this.stripsSVG, "y", fastToFixed(stripViewPosY, 0));
            diffAndSetAttribute(this.stripsSVG, "width", fastToFixed(stripViewWidth, 0));
            diffAndSetAttribute(this.stripsSVG, "height", fastToFixed(stripViewHeight, 0));
            diffAndSetAttribute(this.stripsSVG, "viewBox", "0 0 " + stripViewWidth + " " + stripViewHeight);
            {
                this.stripHeight = stripViewHeight * 3;
                this.vMaxStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.vMaxStripSVG, "id", "VMax");
                {
                    let stripWidth = 14;
                    if (!this.isHud) {
                        let shape = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(shape, "fill", "black");
                        diffAndSetAttribute(shape, "stroke", "none");
                        diffAndSetAttribute(shape, "d", "M 0 0 l " + stripWidth + " 0 l 0 " + (this.stripHeight) + " l " + (-stripWidth) + " 0 Z");
                        this.vMaxStripSVG.appendChild(shape);
                    }
                    let dashHeight = stripWidth * 1.0;
                    let dashSpacing = dashHeight * 1.15;
                    let y = this.stripHeight - dashHeight;
                    while (y > 0) {
                        let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                        (this.isHud) ? diffAndSetAttribute(rect, "stroke", "lime") : diffAndSetAttribute(rect, "fill", "red");
                        diffAndSetAttribute(rect, "x", "0");
                        diffAndSetAttribute(rect, "y", y + '');
                        diffAndSetAttribute(rect, "width", stripWidth + '');
                        diffAndSetAttribute(rect, "height", dashHeight + '');
                        this.vMaxStripSVG.appendChild(rect);
                        y -= dashHeight + dashSpacing;
                    }
                }
                this.stripsSVG.appendChild(this.vMaxStripSVG);
                this.stallProtMinStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.stallProtMinStripSVG, "id", "StallProtMin");
                {
                    let stripWidth = 9;
                    let shape = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(shape, "fill", "none");
                    diffAndSetAttribute(shape, "stroke", (this.isHud) ? "lime" : "orange");
                    diffAndSetAttribute(shape, "stroke-width", "3");
                    diffAndSetAttribute(shape, "d", "M 0 0 l " + stripWidth + " 0 l 0 " + (this.stripHeight) + " l " + (-stripWidth) + " 0 Z");
                    this.stallProtMinStripSVG.appendChild(shape);
                }
                this.stripsSVG.appendChild(this.stallProtMinStripSVG);
                this.stallProtMaxStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.stallProtMaxStripSVG, "id", "StallProtMax");
                {
                    let stripWidth = 14;
                    if (!this.isHud) {
                        let shape = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(shape, "fill", "black");
                        diffAndSetAttribute(shape, "stroke", "none");
                        diffAndSetAttribute(shape, "d", "M 0 0 l " + stripWidth + " 0 l 0 " + (this.stripHeight) + " l " + (-stripWidth) + " 0 Z");
                        this.stallProtMaxStripSVG.appendChild(shape);
                    }
                    let dashHeight = stripWidth * 1.0;
                    let dashSpacing = dashHeight * 1.15;
                    let y = 0;
                    while (y < this.stripHeight) {
                        let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                        (this.isHud) ? diffAndSetAttribute(rect, "stroke", "lime") : diffAndSetAttribute(rect, "fill", "red");
                        diffAndSetAttribute(rect, "x", "0");
                        diffAndSetAttribute(rect, "y", y + '');
                        diffAndSetAttribute(rect, "width", stripWidth + '');
                        diffAndSetAttribute(rect, "height", dashHeight + '');
                        this.stallProtMaxStripSVG.appendChild(rect);
                        y += dashHeight + dashSpacing;
                    }
                }
                this.stripsSVG.appendChild(this.stallProtMaxStripSVG);
            }
            var speedMarkersPosX = _left + _width - 5;
            var speedMarkersPosY = 0;
            this.speedMarkersWidth = width;
            this.speedMarkersHeight = 70;
            let nbHandles = Simplane.getFlapsNbHandles();
            for (let i = 0; i < nbHandles; i++) {
                this.createSpeedMarker("", speedMarkersPosX, speedMarkersPosY, this.updateMarkerFlap, 0.8, 1, (this.isHud) ? "lime" : "#24F000", false, [i]);
            }
            this.createSpeedMarker("V1", speedMarkersPosX, speedMarkersPosY, this.updateMarkerV1, 0.8, 1, (this.isHud) ? "lime" : "#24F000");
            this.createSpeedMarker("VR", speedMarkersPosX, speedMarkersPosY, this.updateMarkerVR, 0.8, 1, (this.isHud) ? "lime" : "#24F000");
            this.createSpeedMarker("V2", speedMarkersPosX, speedMarkersPosY, this.updateMarkerV2, 0.8, 1, (this.isHud) ? "lime" : "#24F000");
            this.createSpeedMarker("REF", speedMarkersPosX, speedMarkersPosY, this.updateMarkerVRef, 0.8, 1, (this.isHud) ? "lime" : "#24F000");
            this.centerSVG.appendChild(this.stripsSVG);
            this.centerSVG.appendChild(this.speedNotSetSVG);
            this.centerSVG.appendChild(this.cursorSVG);
            this.centerSVG.appendChild(this.speedMarkerSVG);
            this.centerSVG.appendChild(this.targetSpeedPointerSVG);
            this.centerSVG.appendChild(this.speedTrendArrowSVG);
        }
        this.rootGroup.appendChild(this.centerSVG);
        {
            this.machPrefixSVG = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.machPrefixSVG, ".");
            diffAndSetAttribute(this.machPrefixSVG, "x", (posX + 8) + '');
            diffAndSetAttribute(this.machPrefixSVG, "y", (posY + height + sideTextHeight * 0.58) + '');
            diffAndSetAttribute(this.machPrefixSVG, "fill", (this.isHud) ? "lime" : "white");
            diffAndSetAttribute(this.machPrefixSVG, "font-size", (this.fontSize * 1.1) + '');
            diffAndSetAttribute(this.machPrefixSVG, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.machPrefixSVG, "text-anchor", "end");
            diffAndSetAttribute(this.machPrefixSVG, "alignment-baseline", "top");
            this.rootGroup.appendChild(this.machPrefixSVG);
            this.machValueSVG = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.machValueSVG, "000");
            diffAndSetAttribute(this.machValueSVG, "x", (posX + 12) + '');
            diffAndSetAttribute(this.machValueSVG, "y", (posY + height + sideTextHeight * 0.58) + '');
            diffAndSetAttribute(this.machValueSVG, "fill", (this.isHud) ? "lime" : "white");
            diffAndSetAttribute(this.machValueSVG, "font-size", (this.fontSize * 1.25) + '');
            diffAndSetAttribute(this.machValueSVG, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.machValueSVG, "text-anchor", "start");
            diffAndSetAttribute(this.machValueSVG, "alignment-baseline", "top");
            this.rootGroup.appendChild(this.machValueSVG);
        }
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    construct_AS03D() {
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "width", "100%");
        diffAndSetAttribute(this.rootSVG, "height", "100%");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 250 1050");
        let posX = 50;
        let posY = 0;
        let width = 150;
        let height = 800;
        let arcWidth = 50;
        let sideTextHeight = 125;
        this.refHeight = height;
        this.stripOffsetX = -2;
        this.graduationSpacing = 54;
        this.graduationScroller = new Avionics.Scroller(this.nbPrimaryGraduations, 20);
        this.cursorIntegrals = new Array();
        this.cursorIntegrals.push(new Avionics.AirspeedScroller(52, 10));
        this.cursorIntegrals.push(new Avionics.AirspeedScroller(52, 100));
        this.cursorIntegrals.push(new Avionics.AirspeedScroller(52, 1000));
        this.cursorDecimals = new Avionics.AirspeedScroller(37);
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "Airspeed");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        {
            let textPosX = posX + 150;
            this.machPrefixSVG = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.machPrefixSVG, "M");
            diffAndSetAttribute(this.machPrefixSVG, "x", (posX + 20) + '');
            diffAndSetAttribute(this.machPrefixSVG, "y", (posY + sideTextHeight * 0.72) + '');
            diffAndSetAttribute(this.machPrefixSVG, "fill", "white");
            diffAndSetAttribute(this.machPrefixSVG, "font-size", (this.fontSize * 1.6) + '');
            diffAndSetAttribute(this.machPrefixSVG, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.machPrefixSVG, "text-anchor", "end");
            diffAndSetAttribute(this.machPrefixSVG, "alignment-baseline", "top");
            this.rootGroup.appendChild(this.machPrefixSVG);
            this.machValueSVG = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.machValueSVG, ".000");
            diffAndSetAttribute(this.machValueSVG, "x", (textPosX) + '');
            diffAndSetAttribute(this.machValueSVG, "y", (posY + sideTextHeight * 0.72) + '');
            diffAndSetAttribute(this.machValueSVG, "fill", "white");
            diffAndSetAttribute(this.machValueSVG, "font-size", (this.fontSize * 2) + '');
            diffAndSetAttribute(this.machValueSVG, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.machValueSVG, "text-anchor", "end");
            diffAndSetAttribute(this.machValueSVG, "alignment-baseline", "top");
            this.rootGroup.appendChild(this.machValueSVG);
            let groundSpeedPrefix = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(groundSpeedPrefix, "GS");
            diffAndSetAttribute(groundSpeedPrefix, "x", (posX + 20) + '');
            diffAndSetAttribute(groundSpeedPrefix, "y", (posY + sideTextHeight * 0.36) + '');
            diffAndSetAttribute(groundSpeedPrefix, "fill", "white");
            diffAndSetAttribute(groundSpeedPrefix, "font-size", (this.fontSize * 1.6) + '');
            diffAndSetAttribute(groundSpeedPrefix, "font-family", "Roboto-Bold");
            diffAndSetAttribute(groundSpeedPrefix, "text-anchor", "end");
            diffAndSetAttribute(groundSpeedPrefix, "alignment-baseline", "top");
            this.rootGroup.appendChild(groundSpeedPrefix);
            this.groundSpeedSVG = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.groundSpeedSVG, "00000");
            diffAndSetAttribute(this.groundSpeedSVG, "x", (textPosX) + '');
            diffAndSetAttribute(this.groundSpeedSVG, "y", (posY + sideTextHeight * 0.36) + '');
            diffAndSetAttribute(this.groundSpeedSVG, "fill", "white");
            diffAndSetAttribute(this.groundSpeedSVG, "font-size", (this.fontSize * 2) + '');
            diffAndSetAttribute(this.groundSpeedSVG, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.groundSpeedSVG, "text-anchor", "end");
            diffAndSetAttribute(this.groundSpeedSVG, "alignment-baseline", "top");
            this.rootGroup.appendChild(this.groundSpeedSVG);
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
            diffAndSetAttribute(this.centerSVG, "width", (width + arcWidth) + '');
            diffAndSetAttribute(this.centerSVG, "height", height + '');
            diffAndSetAttribute(this.centerSVG, "viewBox", "0 0 " + (width + arcWidth) + " " + height);
            {
                let _top = 0;
                let _left = 0;
                let _width = width;
                let _height = height;
                {
                    let graduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(graduationGroup, "id", "Graduations");
                    this.graduationScrollPosX = _left + _width;
                    this.graduationScrollPosY = _top + _height * 0.5;
                    this.graduations = [];
                    for (let i = 0; i < this.totalGraduations; i++) {
                        let line = new Avionics.SVGGraduation();
                        line.IsPrimary = (i % (this.nbSecondaryGraduations + 1)) ? false : true;
                        let lineWidth = line.IsPrimary ? 22 : 22;
                        let lineHeight = line.IsPrimary ? 3 : 3;
                        let linePosX = -lineWidth;
                        line.SVGLine = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(line.SVGLine, "x", linePosX + '');
                        diffAndSetAttribute(line.SVGLine, "width", lineWidth + '');
                        diffAndSetAttribute(line.SVGLine, "height", lineHeight + '');
                        diffAndSetAttribute(line.SVGLine, "fill", "white");
                        if (line.IsPrimary) {
                            line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetAttribute(line.SVGText1, "x", (linePosX - 10) + '');
                            diffAndSetAttribute(line.SVGText1, "fill", "white");
                            diffAndSetAttribute(line.SVGText1, "font-size", (this.fontSize * 1.5) + '');
                            diffAndSetAttribute(line.SVGText1, "font-family", "Roboto-Bold");
                            diffAndSetAttribute(line.SVGText1, "text-anchor", "end");
                            diffAndSetAttribute(line.SVGText1, "alignment-baseline", "central");
                        }
                        this.graduations.push(line);
                    }
                    for (let i = 0; i < this.totalGraduations; i++) {
                        let line = this.graduations[i];
                        graduationGroup.appendChild(line.SVGLine);
                        if (line.SVGText1) {
                            graduationGroup.appendChild(line.SVGText1);
                        }
                    }
                    this.centerSVG.appendChild(graduationGroup);
                }
                {
                    let cursorPosX = _left;
                    let cursorPosY = _top + _height * 0.5;
                    let cursorWidth = width;
                    let cursorHeight = 72;
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
                    diffAndSetAttribute(this.cursorSVG, "viewBox", "0 2 " + cursorWidth + " " + cursorHeight);
                    {
                        if (!this.cursorSVGShape)
                            this.cursorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.cursorSVGShape, "fill", "black");
                        diffAndSetAttribute(this.cursorSVGShape, "d", "M2 2 h114 v26 l12 10 l-12 10 v26 h-114 Z");
                        this.cursorSVG.appendChild(this.cursorSVGShape);
                        let _cursorPosX = -14;
                        let _cursorPosY = cursorHeight * 0.5;
                        this.cursorIntegrals[0].construct(this.cursorSVG, _cursorPosX + 88, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.5, "white");
                        this.cursorIntegrals[1].construct(this.cursorSVG, _cursorPosX + 64, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.5, "white");
                        this.cursorIntegrals[2].construct(this.cursorSVG, _cursorPosX + 40, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.5, "white");
                        this.cursorDecimals.construct(this.cursorSVG, _cursorPosX + 113, _cursorPosY, _width, "Roboto-Bold", this.fontSize * 1.5, "white");
                    }
                }
                {
                    if (!this.speedTrendArrowSVG) {
                        this.speedTrendArrowSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                        diffAndSetAttribute(this.speedTrendArrowSVG, "id", "SpeedTrendArrowGroup");
                    }
                    else
                        Utils.RemoveAllChildren(this.speedTrendArrowSVG);
                    diffAndSetAttribute(this.speedTrendArrowSVG, "x", "58");
                    diffAndSetAttribute(this.speedTrendArrowSVG, "y", "0");
                    diffAndSetAttribute(this.speedTrendArrowSVG, "width", "250");
                    diffAndSetAttribute(this.speedTrendArrowSVG, "height", height + '');
                    diffAndSetAttribute(this.speedTrendArrowSVG, "viewBox", "0 0 250 " + height + '');
                    {
                        if (!this.speedTrendArrowSVGShape)
                            this.speedTrendArrowSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.speedTrendArrowSVGShape, "fill", "none");
                        diffAndSetAttribute(this.speedTrendArrowSVGShape, "stroke", "green");
                        diffAndSetAttribute(this.speedTrendArrowSVGShape, "stroke-width", "5");
                        this.speedTrendArrowSVG.appendChild(this.speedTrendArrowSVGShape);
                    }
                }
                {
                    let stripViewPosX = _left + _width;
                    let stripViewPosY = this.stripBorderSize;
                    let stripViewWidth = width;
                    let stripViewHeight = _height - this.stripBorderSize * 2;
                    if (!this.stripsSVG) {
                        this.stripsSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                        diffAndSetAttribute(this.stripsSVG, "id", "StripsGroup");
                    }
                    else
                        Utils.RemoveAllChildren(this.stripsSVG);
                    diffAndSetAttribute(this.stripsSVG, "x", fastToFixed(stripViewPosX, 0));
                    diffAndSetAttribute(this.stripsSVG, "y", fastToFixed(stripViewPosY, 0));
                    diffAndSetAttribute(this.stripsSVG, "width", fastToFixed(stripViewWidth, 0));
                    diffAndSetAttribute(this.stripsSVG, "height", fastToFixed(stripViewHeight, 0));
                    diffAndSetAttribute(this.stripsSVG, "viewBox", "0 0 " + stripViewWidth + " " + stripViewHeight);
                    this.stripHeight = stripViewHeight * 3;
                    {
                        this.vMaxStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                        diffAndSetAttribute(this.vMaxStripSVG, "id", "VMax");
                        let stripWidth = 14;
                        let shape = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(shape, "fill", "black");
                        diffAndSetAttribute(shape, "x", "0");
                        diffAndSetAttribute(shape, "y", "0");
                        diffAndSetAttribute(shape, "width", stripWidth + '');
                        diffAndSetAttribute(shape, "height", this.stripHeight + '');
                        this.vMaxStripSVG.appendChild(shape);
                        let dashHeight = stripWidth * 1.0;
                        let dashSpacing = dashHeight * 1.15;
                        let y = this.stripHeight - dashHeight;
                        while (y > 0) {
                            let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                            diffAndSetAttribute(rect, "fill", "red");
                            diffAndSetAttribute(rect, "x", "0");
                            diffAndSetAttribute(rect, "y", y + '');
                            diffAndSetAttribute(rect, "width", stripWidth + '');
                            diffAndSetAttribute(rect, "height", dashHeight + '');
                            this.vMaxStripSVG.appendChild(rect);
                            y -= dashHeight + dashSpacing;
                        }
                        this.stripsSVG.appendChild(this.vMaxStripSVG);
                    }
                    {
                        this.stallProtMinStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                        diffAndSetAttribute(this.stallProtMinStripSVG, "id", "StallProtMin");
                        let stripWidth = 9;
                        let shape = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(shape, "fill", "orange");
                        diffAndSetAttribute(shape, "x", "0");
                        diffAndSetAttribute(shape, "y", "0");
                        diffAndSetAttribute(shape, "width", stripWidth + '');
                        diffAndSetAttribute(shape, "height", this.stripHeight + '');
                        this.stallProtMinStripSVG.appendChild(shape);
                        this.stripsSVG.appendChild(this.stallProtMinStripSVG);
                    }
                    {
                        this.stallProtMaxStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                        diffAndSetAttribute(this.stallProtMaxStripSVG, "id", "StallProtMax");
                        let stripWidth = 14;
                        let shape = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(shape, "fill", "black");
                        diffAndSetAttribute(shape, "x", "0");
                        diffAndSetAttribute(shape, "y", "0");
                        diffAndSetAttribute(shape, "width", stripWidth + '');
                        diffAndSetAttribute(shape, "height", this.stripHeight + '');
                        this.stallProtMaxStripSVG.appendChild(shape);
                        let dashHeight = stripWidth * 1.0;
                        let dashSpacing = dashHeight * 1.15;
                        let y = 0;
                        while (y < this.stripHeight) {
                            let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                            diffAndSetAttribute(rect, "fill", "red");
                            diffAndSetAttribute(rect, "x", "0");
                            diffAndSetAttribute(rect, "y", y + '');
                            diffAndSetAttribute(rect, "width", stripWidth + '');
                            diffAndSetAttribute(rect, "height", dashHeight + '');
                            this.stallProtMaxStripSVG.appendChild(rect);
                            y += dashHeight + dashSpacing;
                        }
                        this.stripsSVG.appendChild(this.stallProtMaxStripSVG);
                    }
                }
                this.centerSVG.appendChild(this.stripsSVG);
                this.centerSVG.appendChild(this.cursorSVG);
                this.centerSVG.appendChild(this.speedTrendArrowSVG);
            }
        }
        this.rootGroup.appendChild(this.centerSVG);
        {
        }
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    construct_A320_Neo() {
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 215 605");
        var posX = 94;
        var posY = 60;
        var width = 105;
        var height = 480;
        var arcWidth = 40;
        this.refHeight = height;
        this.stripBorderSize = 4;
        this.stripOffsetX = -2;
        this.graduationSpacing = 57;
        this.graduationScroller = new Avionics.Scroller(this.nbPrimaryGraduations, 20);
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "Airspeed");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        {
            if (!this.blueSpeedText) {
                this.blueSpeedText = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetAttribute(this.blueSpeedText, "id", "BlueAirspeedText");
            }
            else {
                Utils.RemoveAllChildren(this.blueSpeedText);
            }
            diffAndSetAttribute(this.blueSpeedText, "x", (posX + 72) + '');
            diffAndSetAttribute(this.blueSpeedText, "y", (posY + 20) + '');
            diffAndSetAttribute(this.blueSpeedText, "fill", "cyan");
            diffAndSetAttribute(this.blueSpeedText, "font-size", (this.fontSize * 1.1) + '');
            diffAndSetAttribute(this.blueSpeedText, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.blueSpeedText, "text-anchor", "start");
            diffAndSetAttribute(this.blueSpeedText, "alignment-baseline", "central");
            if (!this.redSpeedText) {
                this.redSpeedText = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetAttribute(this.redSpeedText, "id", "RedAirspeedText");
            }
            else {
                Utils.RemoveAllChildren(this.redSpeedText);
            }
            diffAndSetAttribute(this.redSpeedText, "x", (posX + 75) + '');
            diffAndSetAttribute(this.redSpeedText, "y", (posY - 17) + '');
            diffAndSetAttribute(this.redSpeedText, "fill", "magenta");
            diffAndSetAttribute(this.redSpeedText, "font-size", (this.fontSize * 1.1) + '');
            diffAndSetAttribute(this.redSpeedText, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.redSpeedText, "text-anchor", "end");
            diffAndSetAttribute(this.redSpeedText, "alignment-baseline", "central");
            if (!this.speedNotSetSVG) {
                this.speedNotSetSVG = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetAttribute(this.speedNotSetSVG, "id", "speedNotSet");
            }
            else {
                Utils.RemoveAllChildren(this.speedNotSetSVG);
            }
            diffAndSetText(this.speedNotSetSVG, "SPD SEL");
            diffAndSetAttribute(this.speedNotSetSVG, "x", (posX + 60) + '');
            diffAndSetAttribute(this.speedNotSetSVG, "y", (posY - 15) + '');
            diffAndSetAttribute(this.speedNotSetSVG, "fill", "red");
            diffAndSetAttribute(this.speedNotSetSVG, "font-size", (this.fontSize * 1.0) + '');
            diffAndSetAttribute(this.speedNotSetSVG, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.speedNotSetSVG, "text-anchor", "end");
            diffAndSetAttribute(this.speedNotSetSVG, "alignment-baseline", "central");
            this.rootGroup.appendChild(this.blueSpeedText);
            this.rootGroup.appendChild(this.redSpeedText);
            this.rootGroup.appendChild(this.speedNotSetSVG);
        }
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
            var _left = 0;
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
            var graduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(graduationGroup, "id", "Graduations");
            {
                this.graduationScrollPosX = _left + _width;
                this.graduationScrollPosY = _top + _height * 0.5;
                this.graduations = [];
                for (var i = 0; i < this.totalGraduations; i++) {
                    var line = new Avionics.SVGGraduation();
                    line.IsPrimary = (i % (this.nbSecondaryGraduations + 1)) ? false : true;
                    var lineWidth = line.IsPrimary ? 16 : 16;
                    var lineHeight = line.IsPrimary ? 6 : 6;
                    var linePosX = -lineWidth;
                    line.SVGLine = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(line.SVGLine, "x", linePosX + '');
                    diffAndSetAttribute(line.SVGLine, "width", lineWidth + '');
                    diffAndSetAttribute(line.SVGLine, "height", lineHeight + '');
                    diffAndSetAttribute(line.SVGLine, "fill", "white");
                    if (line.IsPrimary) {
                        line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetAttribute(line.SVGText1, "x", (linePosX - 6) + '');
                        diffAndSetAttribute(line.SVGText1, "fill", "white");
                        diffAndSetAttribute(line.SVGText1, "font-size", (this.fontSize * 1.7) + '');
                        diffAndSetAttribute(line.SVGText1, "font-family", "Roboto-Bold");
                        diffAndSetAttribute(line.SVGText1, "text-anchor", "end");
                        diffAndSetAttribute(line.SVGText1, "alignment-baseline", "central");
                    }
                    this.graduations.push(line);
                }
                this.graduationVLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(this.graduationVLine, "x1", this.graduationScrollPosX + '');
                diffAndSetAttribute(this.graduationVLine, "y1", "0");
                diffAndSetAttribute(this.graduationVLine, "x2", this.graduationScrollPosX + '');
                diffAndSetAttribute(this.graduationVLine, "y2", "0");
                diffAndSetAttribute(this.graduationVLine, "stroke", "white");
                diffAndSetAttribute(this.graduationVLine, "stroke-width", "6");
                for (var i = 0; i < this.totalGraduations; i++) {
                    var line = this.graduations[i];
                    graduationGroup.appendChild(line.SVGLine);
                    if (line.SVGText1) {
                        graduationGroup.appendChild(line.SVGText1);
                    }
                }
                graduationGroup.appendChild(this.graduationVLine);
                this.centerSVG.appendChild(graduationGroup);
            }
            var cursorPosX = _left + _width * 0.5;
            var cursorPosY = _top + _height * 0.5 + 3;
            var cursorWidth = width;
            var cursorHeight = 23;
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
                diffAndSetAttribute(this.cursorSVGShape, "fill", "yellow");
                diffAndSetAttribute(this.cursorSVGShape, "fill-opacity", this.cursorOpacity);
                diffAndSetAttribute(this.cursorSVGShape, "d", "M 25 9 L 55 9 L 78 1 L 78 21 L 55 13 L 25 13 Z");
                this.cursorSVG.appendChild(this.cursorSVGShape);
            }
            if (!this.speedTrendArrowSVG) {
                this.speedTrendArrowSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.speedTrendArrowSVG, "id", "SpeedTrendArrowGroup");
            }
            else
                Utils.RemoveAllChildren(this.speedTrendArrowSVG);
            diffAndSetAttribute(this.speedTrendArrowSVG, "x", "18");
            diffAndSetAttribute(this.speedTrendArrowSVG, "y", "0");
            diffAndSetAttribute(this.speedTrendArrowSVG, "width", "250");
            diffAndSetAttribute(this.speedTrendArrowSVG, "height", height + '');
            diffAndSetAttribute(this.speedTrendArrowSVG, "viewBox", "0 0 250 " + height + '');
            {
                if (!this.speedTrendArrowSVGShape)
                    this.speedTrendArrowSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.speedTrendArrowSVGShape, "fill", "none");
                diffAndSetAttribute(this.speedTrendArrowSVGShape, "stroke", "yellow");
                diffAndSetAttribute(this.speedTrendArrowSVGShape, "stroke-width", "2");
                this.speedTrendArrowSVG.appendChild(this.speedTrendArrowSVGShape);
            }
            var greenDotPosX = _left + _width * 0.9;
            var greenDotPosY = _top + _height * 0.5;
            var greenDotWidth = width;
            var greenDotHeight = 20;
            if (!this.greenDotSVG) {
                this.greenDotSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.greenDotSVG, "id", "GreenDotIndicatorGroup");
            }
            else
                Utils.RemoveAllChildren(this.greenDotSVG);
            diffAndSetAttribute(this.greenDotSVG, "x", fastToFixed(greenDotPosX, 0));
            diffAndSetAttribute(this.greenDotSVG, "y", fastToFixed((greenDotPosY - greenDotHeight * 0.5), 0));
            diffAndSetAttribute(this.greenDotSVG, "width", fastToFixed(greenDotWidth, 0));
            diffAndSetAttribute(this.greenDotSVG, "height", fastToFixed(greenDotHeight, 0));
            diffAndSetAttribute(this.greenDotSVG, "viewBox", "0 0 " + greenDotWidth + " " + greenDotHeight);
            {
                if (!this.greenDotSVGShape)
                    this.greenDotSVGShape = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(this.greenDotSVGShape, "fill", "none");
                diffAndSetAttribute(this.greenDotSVGShape, "stroke", "rgb(36,255,0)");
                diffAndSetAttribute(this.greenDotSVGShape, "stroke-width", "4");
                diffAndSetAttribute(this.greenDotSVGShape, "cx", "10");
                diffAndSetAttribute(this.greenDotSVGShape, "cy", "10");
                diffAndSetAttribute(this.greenDotSVGShape, "r", "7");
                this.greenDotSVG.appendChild(this.greenDotSVGShape);
            }
            var blueSpeedPosX = _left + _width * 1.025;
            var blueSpeedPosY = _top + _height * 0.5;
            var blueSpeedWidth = width;
            var blueSpeedHeight = 44;
            if (!this.blueSpeedSVG) {
                this.blueSpeedSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.blueSpeedSVG, "id", "BlueSpeedGroup");
            }
            else
                Utils.RemoveAllChildren(this.blueSpeedSVG);
            diffAndSetAttribute(this.blueSpeedSVG, "x", blueSpeedPosX + '');
            diffAndSetAttribute(this.blueSpeedSVG, "y", (blueSpeedPosY - blueSpeedHeight * 0.5) + '');
            diffAndSetAttribute(this.blueSpeedSVG, "width", blueSpeedWidth + '');
            diffAndSetAttribute(this.blueSpeedSVG, "height", blueSpeedHeight + '');
            diffAndSetAttribute(this.blueSpeedSVG, "viewBox", "0 0 " + blueSpeedWidth + " " + blueSpeedHeight);
            {
                let shape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(shape, "fill", "none");
                diffAndSetAttribute(shape, "stroke", "cyan");
                diffAndSetAttribute(shape, "stroke-width", "2");
                diffAndSetAttribute(shape, "d", "M 0 22 L 25 0 L 25 44 Z");
                this.blueSpeedSVG.appendChild(shape);
            }
            var redSpeedPosX = _left + _width * 1.025;
            var redSpeedPosY = _top + _height * 0.5;
            var redSpeedWidth = width;
            var redSpeedHeight = 44;
            if (!this.redSpeedSVG) {
                this.redSpeedSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.redSpeedSVG, "id", "redAirspeedPointerGroup");
            }
            else
                Utils.RemoveAllChildren(this.redSpeedSVG);
            diffAndSetAttribute(this.redSpeedSVG, "x", redSpeedPosX + '');
            diffAndSetAttribute(this.redSpeedSVG, "y", (redSpeedPosY - redSpeedHeight * 0.5) + '');
            diffAndSetAttribute(this.redSpeedSVG, "width", redSpeedWidth + '');
            diffAndSetAttribute(this.redSpeedSVG, "height", redSpeedHeight + '');
            diffAndSetAttribute(this.redSpeedSVG, "viewBox", "0 0 " + redSpeedWidth + " " + redSpeedHeight);
            {
                let shape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(shape, "fill", "none");
                diffAndSetAttribute(shape, "stroke", "magenta");
                diffAndSetAttribute(shape, "stroke-width", "2");
                diffAndSetAttribute(shape, "d", "M 0 22 L 25 0 L 25 44 Z");
                this.redSpeedSVG.appendChild(shape);
            }
            var nextFlapPosX = _left + _width * 0.8;
            var nextFlapPosY = _top + _height * 0.5;
            var nextFlapWidth = width;
            var nextFlapHeight = 20;
            if (!this.nextFlapSVG) {
                this.nextFlapSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.nextFlapSVG, "id", "NextFlapIndicatorGroup");
            }
            else
                Utils.RemoveAllChildren(this.nextFlapSVG);
            diffAndSetAttribute(this.nextFlapSVG, "x", fastToFixed(nextFlapPosX, 0));
            diffAndSetAttribute(this.nextFlapSVG, "y", fastToFixed((nextFlapPosY - nextFlapHeight * 0.5), 0));
            diffAndSetAttribute(this.nextFlapSVG, "width", fastToFixed(nextFlapWidth, 0));
            diffAndSetAttribute(this.nextFlapSVG, "height", fastToFixed(nextFlapHeight, 0));
            diffAndSetAttribute(this.nextFlapSVG, "viewBox", "0 0 " + nextFlapWidth + " " + nextFlapHeight);
            {
                if (!this.nextFlapSVGShape)
                    this.nextFlapSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.nextFlapSVGShape, "fill", "none");
                diffAndSetAttribute(this.nextFlapSVGShape, "stroke", "orange");
                diffAndSetAttribute(this.nextFlapSVGShape, "stroke-width", "4");
                diffAndSetAttribute(this.nextFlapSVGShape, "d", "M 0 4 L 15 4 M 0 16 L 15 16");
                this.nextFlapSVG.appendChild(this.nextFlapSVGShape);
            }
            var stripViewPosX = _left + _width + 4;
            var stripViewPosY = this.stripBorderSize;
            var stripViewWidth = width;
            var stripViewHeight = _height - this.stripBorderSize * 2;
            if (!this.stripsSVG) {
                this.stripsSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.stripsSVG, "id", "StripsGroup");
            }
            else
                Utils.RemoveAllChildren(this.stripsSVG);
            diffAndSetAttribute(this.stripsSVG, "x", fastToFixed(stripViewPosX, 0));
            diffAndSetAttribute(this.stripsSVG, "y", fastToFixed(stripViewPosY, 0));
            diffAndSetAttribute(this.stripsSVG, "width", fastToFixed(stripViewWidth, 0));
            diffAndSetAttribute(this.stripsSVG, "height", fastToFixed(stripViewHeight, 0));
            diffAndSetAttribute(this.stripsSVG, "viewBox", "0 0 " + stripViewWidth + " " + stripViewHeight);
            {
                this.stripHeight = stripViewHeight * 3;
                this.vMaxStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.vMaxStripSVG, "id", "VMax");
                {
                    let stripWidth = 14;
                    let shape = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(shape, "fill", "black");
                    diffAndSetAttribute(shape, "stroke", "red");
                    diffAndSetAttribute(shape, "d", "M 0 0 l " + stripWidth + " 0 l 0 " + (this.stripHeight) + " l " + (-stripWidth) + " 0 Z");
                    this.vMaxStripSVG.appendChild(shape);
                    let dashHeight = stripWidth * 1.0;
                    let dashSpacing = dashHeight * 0.75;
                    let y = this.stripHeight - dashHeight;
                    while (y > 0) {
                        let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(rect, "fill", "red");
                        diffAndSetAttribute(rect, "x", "0");
                        diffAndSetAttribute(rect, "y", y + '');
                        diffAndSetAttribute(rect, "width", stripWidth + '');
                        diffAndSetAttribute(rect, "height", dashHeight + '');
                        this.vMaxStripSVG.appendChild(rect);
                        y -= dashHeight + dashSpacing;
                    }
                }
                this.stripsSVG.appendChild(this.vMaxStripSVG);
                this.vLSStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.vLSStripSVG, "id", "VLS");
                {
                    let stripWidth = 9;
                    let shape = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(shape, "fill", "black");
                    diffAndSetAttribute(shape, "stroke", "orange");
                    diffAndSetAttribute(shape, "d", "M 0 0 l " + stripWidth + " 0 l 0 " + (this.stripHeight) + " l " + (-stripWidth) + " 0 Z");
                    this.vLSStripSVG.appendChild(shape);
                }
                this.stripsSVG.appendChild(this.vLSStripSVG);
                this.stallProtMinStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.stallProtMinStripSVG, "id", "StallProtMin");
                {
                    let stripWidth = 14;
                    let shape = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(shape, "fill", "black");
                    diffAndSetAttribute(shape, "stroke", "orange");
                    diffAndSetAttribute(shape, "d", "M 0 0 l " + stripWidth + " 0 l 0 " + (this.stripHeight) + " l " + (-stripWidth) + " 0 Z");
                    this.stallProtMinStripSVG.appendChild(shape);
                    let dashHeight = stripWidth * 1.0;
                    let dashSpacing = dashHeight * 0.75;
                    let y = 0;
                    while (y < this.stripHeight) {
                        let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(rect, "fill", "orange");
                        diffAndSetAttribute(rect, "x", "0");
                        diffAndSetAttribute(rect, "y", y + '');
                        diffAndSetAttribute(rect, "width", stripWidth + '');
                        diffAndSetAttribute(rect, "height", dashHeight + '');
                        this.stallProtMinStripSVG.appendChild(rect);
                        y += dashHeight + dashSpacing;
                    }
                }
                this.stripsSVG.appendChild(this.stallProtMinStripSVG);
                this.stallProtMaxStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.stallProtMaxStripSVG, "id", "StallProtMax");
                {
                    let stripWidth = 19;
                    let shape = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(shape, "fill", "red");
                    diffAndSetAttribute(shape, "stroke", "red");
                    diffAndSetAttribute(shape, "d", "M 0 0 l " + stripWidth + " 0 l 0 " + (this.stripHeight) + " l " + (-stripWidth) + " 0 Z");
                    this.stallProtMaxStripSVG.appendChild(shape);
                }
                this.stripsSVG.appendChild(this.stallProtMaxStripSVG);
            }
            var speedMarkersPosX = _left + _width;
            var speedMarkersPosY = 0;
            this.speedMarkersWidth = width;
            this.speedMarkersHeight = 50;
            this.createSpeedMarker("1", speedMarkersPosX, speedMarkersPosY, this.updateMarkerV1, 1.0, 1.0, "cyan");
            this.createSpeedMarker("F", speedMarkersPosX, speedMarkersPosY, this.updateMarkerF);
            this.createSpeedMarker("S", speedMarkersPosX, speedMarkersPosY, this.updateMarkerS);
            this.centerSVG.appendChild(this.stripsSVG);
            this.centerSVG.appendChild(this.cursorSVG);
            this.centerSVG.appendChild(this.speedTrendArrowSVG);
            this.centerSVG.appendChild(this.redSpeedSVG);
            this.centerSVG.appendChild(this.blueSpeedSVG);
            this.centerSVG.appendChild(this.speedMarkerSVG);
            this.centerSVG.appendChild(this.nextFlapSVG);
            this.centerSVG.appendChild(this.greenDotSVG);
        }
        this.rootGroup.appendChild(this.centerSVG);
        {
            this.machPrefixSVG = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.machPrefixSVG, ".");
            diffAndSetAttribute(this.machPrefixSVG, "x", (posX - 10) + '');
            diffAndSetAttribute(this.machPrefixSVG, "y", (posY + height + 45) + '');
            diffAndSetAttribute(this.machPrefixSVG, "fill", "rgb(36,255,0)");
            diffAndSetAttribute(this.machPrefixSVG, "font-size", (this.fontSize * 1.4) + '');
            diffAndSetAttribute(this.machPrefixSVG, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.machPrefixSVG, "text-anchor", "end");
            diffAndSetAttribute(this.machPrefixSVG, "alignment-baseline", "central");
            this.rootGroup.appendChild(this.machPrefixSVG);
            this.machValueSVG = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.machValueSVG, "000");
            diffAndSetAttribute(this.machValueSVG, "x", (posX - 10) + '');
            diffAndSetAttribute(this.machValueSVG, "y", (posY + height + 45) + '');
            diffAndSetAttribute(this.machValueSVG, "fill", "rgb(36,255,0)");
            diffAndSetAttribute(this.machValueSVG, "font-size", (this.fontSize * 1.4) + '');
            diffAndSetAttribute(this.machValueSVG, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.machValueSVG, "text-anchor", "start");
            diffAndSetAttribute(this.machValueSVG, "alignment-baseline", "central");
            this.rootGroup.appendChild(this.machValueSVG);
        }
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    createSpeedMarker(_text, _x, _y, _handler, _scale = 1.0, _textScale = 1.4, _color = "green", _bg = false, _params = []) {
        let svg = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(svg, "id", _text + "_Marker");
        diffAndSetAttribute(svg, "x", _x + '');
        diffAndSetAttribute(svg, "y", _y + '');
        diffAndSetAttribute(svg, "width", fastToFixed((this.speedMarkersWidth * _scale), 0));
        diffAndSetAttribute(svg, "height", fastToFixed((this.speedMarkersHeight * _scale * 1.05), 0));
        diffAndSetAttribute(svg, "viewBox", "0 0 " + this.speedMarkersWidth + " " + (this.speedMarkersHeight * 1.05));
        let offsetY = (this.speedMarkersHeight - this.speedMarkersHeight * _scale) * 0.5;
        let line = document.createElementNS(Avionics.SVG.NS, "line");
        diffAndSetAttribute(line, "x1", "0");
        diffAndSetAttribute(line, "y1", (offsetY + this.speedMarkersHeight * 0.5) + '');
        diffAndSetAttribute(line, "x2", "15");
        diffAndSetAttribute(line, "y2", (offsetY + this.speedMarkersHeight * 0.5) + '');
        diffAndSetAttribute(line, "stroke", _color);
        diffAndSetAttribute(line, "stroke-width", "6");
        svg.appendChild(line);
        if (_bg) {
            let textBG = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(textBG, "x", "17");
            diffAndSetAttribute(textBG, "y", (offsetY + this.speedMarkersHeight * 0.3) + '');
            diffAndSetAttribute(textBG, "width", (this.speedMarkersWidth * 0.275) + '');
            diffAndSetAttribute(textBG, "height", (this.speedMarkersHeight * 0.4) + '');
            diffAndSetAttribute(textBG, "fill", "black");
            svg.appendChild(textBG);
        }
        let text = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetText(text, _text);
        diffAndSetAttribute(text, "x", "17");
        diffAndSetAttribute(text, "y", (offsetY + this.speedMarkersHeight * 0.5) + '');
        diffAndSetAttribute(text, "fill", _color);
        diffAndSetAttribute(text, "font-size", (this.fontSize * _textScale) + '');
        diffAndSetAttribute(text, "font-family", "Roboto-Bold");
        diffAndSetAttribute(text, "text-anchor", "start");
        diffAndSetAttribute(text, "alignment-baseline", "central");
        svg.appendChild(text);
        let speed = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetText(speed, _text);
        diffAndSetAttribute(speed, "x", "17");
        diffAndSetAttribute(speed, "y", (offsetY + this.speedMarkersHeight * 0.8) + '');
        diffAndSetAttribute(speed, "fill", _color);
        diffAndSetAttribute(speed, "font-size", (this.fontSize * _textScale) + '');
        diffAndSetAttribute(speed, "font-family", "Roboto-Bold");
        diffAndSetAttribute(speed, "text-anchor", "start");
        diffAndSetAttribute(speed, "alignment-baseline", "central");
        svg.appendChild(speed);
        let marker = new AirspeedMarker(line, text, speed, _handler.bind(this));
        marker.svg = svg;
        marker.params = _params;
        this.speedMarkers.push(marker);
        if (!this.speedMarkerSVG)
            this.speedMarkerSVG = document.createElementNS(Avionics.SVG.NS, "g");
        this.speedMarkerSVG.appendChild(svg);
        return marker;
    }
    update(dTime) {
        let indicatedSpeed = Simplane.getIndicatedSpeed();
        engine.beginProfileEvent("Scrolling");
        engine.beginProfileEvent("updateArcScrolling");
        this.updateArcScrolling(indicatedSpeed);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateGraduationScrolling");
        this.updateGraduationScrolling(indicatedSpeed);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateCursorScrolling");
        this.updateCursorScrolling(indicatedSpeed);
        engine.endProfileEvent();
        engine.endProfileEvent();
        engine.beginProfileEvent("Compute Values");
        let speedTrend = this.computeIASAcceleration(indicatedSpeed) * 10;
        let crossSpeed = Simplane.getCrossoverSpeed();
        let cruiseMach = Simplane.getCruiseMach();
        let crossSpeedFactor = Simplane.getCrossoverSpeedFactor(crossSpeed, cruiseMach);
        let maxSpeed = Simplane.getMaxSpeed(this.aircraft) * crossSpeedFactor;
        let greenDot = Simplane.getGreenDotSpeed() * crossSpeedFactor;
        let lowestSelectableSpeed = Simplane.getLowestSelectableSpeed();
        let stallProtectionMin = Simplane.getStallProtectionMinSpeed();
        let stallProtectionMax = Simplane.getStallProtectionMaxSpeed();
        let stallSpeed = Simplane.getStallSpeed();
        let altitudeAboveGround = Simplane.getAltitudeAboveGround();
        this.smoothSpeeds(indicatedSpeed, dTime, maxSpeed, lowestSelectableSpeed, stallProtectionMin, stallProtectionMax, stallSpeed);
        this.updateNextFlapSpeedIndicator(indicatedSpeed, crossSpeedFactor);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateSpeedTrendArrow");
        this.updateSpeedTrendArrow(indicatedSpeed, speedTrend);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateTargetSpeeds");
        this.updateTargetSpeeds(indicatedSpeed, dTime);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateNextFlapSpeedIndicator");
        this.updateNextFlapSpeedIndicator(indicatedSpeed, crossSpeedFactor);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateStrips");
        this.updateStrip(this.vMaxStripSVG, indicatedSpeed, this._maxSpeed, false, true);
        this.updateStrip(this.vLSStripSVG, indicatedSpeed, this._lowestSelectableSpeed, (altitudeAboveGround < 100), false);
        this.updateStrip(this.stallProtMinStripSVG, indicatedSpeed, this._alphaProtectionMin, (altitudeAboveGround < 10), false);
        this.updateStrip(this.stallProtMaxStripSVG, indicatedSpeed, this._alphaProtectionMax, (altitudeAboveGround < 10), false);
        this.updateStrip(this.stallStripSVG, indicatedSpeed, this._stallSpeed, (altitudeAboveGround < 10), false);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateGreenDot");
        this.updateGreenDot(indicatedSpeed, greenDot);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateSpeedMarkers");
        this.updateSpeedMarkers(indicatedSpeed);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateMachSpeed");
        this.updateMachSpeed(dTime);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateGroundSpeed");
        this.updateGroundSpeed(dTime);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateSpeedOverride");
        this.updateSpeedOverride(dTime);
        engine.endProfileEvent();
        engine.beginProfileEvent("updateVSpeeds");
        this.updateVSpeeds();
        engine.endProfileEvent();
        engine.beginProfileEvent("updateCursor");
        this.updateCursor(indicatedSpeed, altitudeAboveGround, lowestSelectableSpeed);
        engine.endProfileEvent();
    }
    updateCursor(_indicatedSpeed, _altitudeAboveGround, _vls) {
        if (this.aircraft == Aircraft.AS01B && !this.isHud) {
            if (_indicatedSpeed < _vls && _altitudeAboveGround >= 10) {
                diffAndSetAttribute(this.cursorSVGShape, "stroke", "orange");
                diffAndSetAttribute(this.cursorSVGShape, "stroke-width", "5");
            }
            else {
                diffAndSetAttribute(this.cursorSVGShape, "stroke", "white");
                diffAndSetAttribute(this.cursorSVGShape, "stroke-width", "3");
            }
        }
    }
    smoothSpeeds(_indicatedSpeed, _dTime, _maxSpeed, _lowestSelectableSpeed, _stallProtectionMin, _stallProtectionMax, _stallSpeed) {
        let refSpeed = _maxSpeed;
        if (this.vLSStripSVG) {
            let delta = _lowestSelectableSpeed - refSpeed;
            if (delta >= 0)
                _lowestSelectableSpeed -= delta + 5;
            refSpeed = _lowestSelectableSpeed;
        }
        if (this.stallProtMinStripSVG) {
            let delta = _stallProtectionMin - refSpeed;
            if (delta >= 0)
                _stallProtectionMin -= delta + 5;
            refSpeed = _stallProtectionMin;
        }
        if (this.stallProtMaxStripSVG) {
            let delta = _stallProtectionMax - refSpeed;
            if (delta >= 0)
                _stallProtectionMax -= delta + 5;
            refSpeed = _stallProtectionMax;
        }
        if (this.stallStripSVG) {
            let delta = _stallSpeed - refSpeed;
            if (delta >= 0)
                _stallProtectionMax -= delta + 5;
            refSpeed = _stallSpeed;
        }
        let seconds = _dTime / 1000;
        this._maxSpeed = Utils.SmoothSin(this._maxSpeed, _maxSpeed, this._smoothFactor, seconds);
        this._lowestSelectableSpeed = Utils.SmoothSin(this._lowestSelectableSpeed, _lowestSelectableSpeed, this._smoothFactor, seconds);
        this._alphaProtectionMin = Utils.SmoothSin(this._alphaProtectionMin, _stallProtectionMin, this._smoothFactor, seconds);
        this._alphaProtectionMax = Utils.SmoothSin(this._alphaProtectionMax, _stallProtectionMax, this._smoothFactor, seconds);
        this._stallSpeed = Utils.SmoothSin(this._stallSpeed, _stallSpeed, this._smoothFactor, seconds);
        let delta = this._alphaProtectionMax - _indicatedSpeed;
        if (delta >= 0) {
            this._alphaProtectionMax -= delta;
        }
    }
    updateSpeedOverride(_dTime) {
        if (Math.abs(this._maxSpeed - this._lastMaxSpeedOverride) >= 5) {
            this._lastMaxSpeedOverrideTime += _dTime / 1000;
            if (this._lastMaxSpeedOverrideTime > 5) {
                SimVar.SetGameVarValue("AIRCRAFT_MAXSPEED_OVERRIDE", "knots", this._maxSpeed);
                this._lastMaxSpeedOverride = this._maxSpeed;
                this._lastMaxSpeedOverrideTime = 0;
            }
        }
        else {
            this._lastMaxSpeedOverrideTime = 0;
        }
    }
    updateVSpeeds() {
        if (this.vSpeedSVG) {
            if (Simplane.getIndicatedSpeed() < 30) {
                diffAndSetAttribute(this.vSpeedSVG, "visibility", "visible");
                diffAndSetText(this.v1Speed, fastToFixed(Simplane.getV1Airspeed(), 0));
                diffAndSetText(this.vRSpeed, fastToFixed(Simplane.getVRAirspeed(), 0));
                diffAndSetText(this.v2Speed, fastToFixed(Simplane.getV2Airspeed(), 0));
                diffAndSetText(this.vXSpeed, fastToFixed(Simplane.getVXAirspeed(), 0));
            }
            else {
                diffAndSetAttribute(this.vSpeedSVG, "visibility", "hidden");
            }
        }
    }
    computeIASAcceleration(_currentAirspeed) {
        let speed = _currentAirspeed;
        if (speed < this.graduationMinValue)
            speed = this.graduationMinValue;
        let time = performance.now() / 1000;
        if (!this._lastIASTime) {
            this._lastIASTime = {
                ias: speed,
                t: time
            };
            return;
        }
        let dTime = time - this._lastIASTime.t;
        if (dTime > 0) {
            let frameIASAcceleration = (speed - this._lastIASTime.ias) / dTime;
            this._computedIASAcceleration = Utils.SmoothSin(this._computedIASAcceleration, frameIASAcceleration, 0.28, dTime);
        }
        this._lastIASTime.ias = speed;
        this._lastIASTime.t = time;
        return this._computedIASAcceleration;
    }
    getAutopilotMode() {
        if (this.aircraft == Aircraft.A320_NEO) {
            if (Simplane.getAutoPilotAirspeedHoldActive())
                return AutopilotMode.SELECTED;
            return AutopilotMode.MANAGED;
        }
        else if (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B) {
            if (Simplane.getAutoPilotAirspeedHoldActive())
                return AutopilotMode.HOLD;
            else {
                return AutopilotMode.SELECTED;
            }
        }
        else {
            return AutopilotMode.SELECTED;
        }
    }
    updateGroundSpeed(dTime) {
        if (this.groundSpeedSVG) {
            let groundSpeed = Math.round(Simplane.getGroundSpeed());
            diffAndSetText(this.groundSpeedSVG, Utils.leadingZeros(groundSpeed, 3));
        }
    }
    updateMachSpeed(dTime) {
        if (this.machPrefixSVG && this.machValueSVG) {
            let trueMach = Simplane.getMachSpeed();
            this.machSpeed = Utils.SmoothSin(this.machSpeed, trueMach, 0.25, dTime / 1000);
            if (this.aircraft == Aircraft.AS03D) {
                if (!this.machVisible)
                    this.machVisible = true;
                let [integer, decimals] = fastToFixed(this.machSpeed, 2).split('.');
                if (integer > "0") {
                    diffAndSetText(this.machValueSVG, integer + ".");
                }
                else {
                    diffAndSetText(this.machValueSVG, ".");
                }
                this.machValueSVG.textContent += decimals;
            }
            else {
                if (this.machSpeed > 0.998)
                    this.machSpeed = 0.998;
                if (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B) {
                    if ((!this.machVisible && this.machSpeed >= 0.4) || (this.machVisible && this.machSpeed >= 0.35)) {
                        var fixedMach = fastToFixed(this.machSpeed, 3);
                        var radixPos = fixedMach.indexOf('.');
                        diffAndSetText(this.machPrefixSVG, ".");
                        diffAndSetText(this.machValueSVG, fixedMach.slice(radixPos + 1));
                        this.machVisible = true;
                    }
                    else {
                        var groundSpeed = Math.round(Simplane.getGroundSpeed());
                        diffAndSetText(this.machPrefixSVG, "GS");
                        diffAndSetText(this.machValueSVG, Utils.leadingZeros(groundSpeed, 3));
                        this.machVisible = true;
                    }
                }
                else if (this.aircraft == Aircraft.CJ4) {
                    if ((!this.machVisible && this.machSpeed >= 0.4) || (this.machVisible && this.machSpeed >= 0.35)) {
                        var fixedMach = fastToFixed(this.machSpeed, 3);
                        var radixPos = fixedMach.indexOf('.');
                        diffAndSetText(this.machPrefixSVG, ".");
                        diffAndSetText(this.machValueSVG, fixedMach.slice(radixPos + 1));
                        this.machVisible = true;
                    }
                }
                else {
                    var fixedMach = fastToFixed(this.machSpeed, 3);
                    if ((!this.machVisible && this.machSpeed >= 0.5) || (this.machVisible && this.machSpeed >= 0.45)) {
                        var radixPos = fixedMach.indexOf('.');
                        diffAndSetText(this.machValueSVG, fixedMach.slice(radixPos + 1));
                        this.machVisible = true;
                    }
                    else {
                        this.machVisible = false;
                    }
                }
            }
            if (this.machVisible) {
                diffAndSetAttribute(this.machPrefixSVG, "visibility", "visible");
                diffAndSetAttribute(this.machValueSVG, "visibility", "visible");
            }
            else {
                diffAndSetAttribute(this.machPrefixSVG, "visibility", "hidden");
                diffAndSetAttribute(this.machValueSVG, "visibility", "hidden");
            }
        }
    }
    arcToSVG(_value) {
        var pixels = (_value * this.graduationSpacing * (this.nbSecondaryGraduations + 1)) / 10;
        return pixels;
    }
    updateGraduationScrolling(_speed) {
        if (this.graduations) {
            if (_speed < this.graduationMinValue)
                _speed = this.graduationMinValue;
            if (this.graduationScroller.scroll(_speed)) {
                var currentVal = this.graduationScroller.firstValue;
                var currentY = this.graduationScrollPosY + this.graduationScroller.offsetY * this.graduationSpacing * (this.nbSecondaryGraduations + 1);
                var startVal = currentVal;
                var startY = currentY;
                for (var i = 0; i < this.totalGraduations; i++) {
                    var posX = this.graduationScrollPosX;
                    var posY = currentY;
                    if ((currentVal < this.graduationMinValue) || (currentVal == this.graduationMinValue && !this.graduations[i].SVGText1)) {
                        diffAndSetAttribute(this.graduations[i].SVGLine, "visibility", "hidden");
                        if (this.graduations[i].SVGText1) {
                            diffAndSetAttribute(this.graduations[i].SVGText1, "visibility", "hidden");
                        }
                    }
                    else {
                        diffAndSetAttribute(this.graduations[i].SVGLine, "visibility", "visible");
                        diffAndSetAttribute(this.graduations[i].SVGLine, "transform", "translate(" + posX + '' + " " + posY + '' + ")");
                        if (this.graduations[i].SVGText1) {
                            if (this.aircraft == Aircraft.CJ4) {
                                if ((currentVal % 4) == 0)
                                    diffAndSetText(this.graduations[i].SVGText1, currentVal + '');
                                else
                                    diffAndSetText(this.graduations[i].SVGText1, "");
                            }
                            else if (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B) {
                                if (currentVal < this.graduationMinValue)
                                    diffAndSetText(this.graduations[i].SVGText1, "");
                                else
                                    diffAndSetText(this.graduations[i].SVGText1, currentVal + '');
                            }
                            else {
                                if (currentVal < this.graduationMinValue)
                                    diffAndSetText(this.graduations[i].SVGText1, "");
                                else
                                    diffAndSetText(this.graduations[i].SVGText1, Utils.leadingZeros(currentVal, 3));
                            }
                            diffAndSetAttribute(this.graduations[i].SVGText1, "visibility", "visible");
                            diffAndSetAttribute(this.graduations[i].SVGText1, "transform", "translate(" + posX + '' + " " + posY + '' + ")");
                        }
                    }
                    if (this.graduations[i].SVGText1)
                        currentVal = this.graduationScroller.nextValue;
                    currentY -= this.graduationSpacing;
                }
                if (this.graduationVLine) {
                    var factor = 10 / this.graduationScroller.increment;
                    var offsetY = (Math.min((startVal - this.graduationMinValue), 0) / 10) * this.graduationSpacing * (this.nbSecondaryGraduations) * factor;
                    diffAndSetAttribute(this.graduationVLine, "y1", Math.ceil(startY + offsetY) + '');
                    diffAndSetAttribute(this.graduationVLine, "y2", Math.floor(currentY + offsetY) + '');
                }
            }
        }
    }
    updateArcScrolling(_speed) {
        if (this.arcs) {
            var offset = this.arcToSVG(_speed);
            for (var i = 0; i < this.arcs.length; i++) {
                diffAndSetAttribute(this.arcs[i], "transform", "translate(0 " + offset + '' + ")");
            }
        }
    }
    updateCursorScrolling(_speed) {
        if (_speed < this.graduationMinValue && this.aircraft != Aircraft.B747_8 && this.aircraft != Aircraft.AS01B) {
            if (this.cursorIntegrals) {
                for (let i = 0; i < this.cursorIntegrals.length; i++) {
                    this.cursorIntegrals[i].clear("-");
                }
            }
            if (this.cursorDecimals) {
                this.cursorDecimals.clear();
            }
        }
        else {
            let speed = Math.max(_speed, this.graduationMinValue);
            if (this.cursorIntegrals) {
                for (let i = 0; i < this.cursorIntegrals.length; i++) {
                    let divider = fastPow10(i + 1);
                    this.cursorIntegrals[i].update(speed, divider, divider);
                }
            }
            if (this.cursorDecimals) {
                this.cursorDecimals.update(speed);
            }
        }
    }
    valueToSvg(current, target) {
        var _top = 0;
        var _height = this.refHeight;
        if (current < this.graduationMinValue)
            current = this.graduationMinValue;
        let deltaValue = current - target;
        let deltaSVG = deltaValue * this.graduationSpacing * (this.nbSecondaryGraduations + 1) / this.graduationScroller.increment;
        var posY = _top + _height * 0.5 + deltaSVG;
        posY += 2.5;
        return posY;
    }
    updateSpeedTrendArrow(currentAirspeed, speedTrend, hide = false) {
        let hideArrow = true;
        if (this.speedTrendArrowSVG && !hide) {
            if (Math.abs(speedTrend) > 1) {
                if (currentAirspeed < this.graduationMinValue)
                    currentAirspeed = this.graduationMinValue;
                let arrowBaseY = this.valueToSvg(currentAirspeed, currentAirspeed);
                let arrowTopY = this.valueToSvg(currentAirspeed, currentAirspeed + speedTrend);
                let arrowPath = "M 70 " + arrowBaseY + " L 70 " + fastToFixed(arrowTopY, 1) + " ";
                if (this.aircraft == Aircraft.CJ4) {
                    arrowPath += "L 50 " + fastToFixed(arrowTopY, 1);
                }
                else {
                    if (speedTrend > 0) {
                        arrowPath += "M 62 " + fastToFixed((arrowTopY + 8), 1) + " L 70 " + fastToFixed(arrowTopY, 1) + " L 78 " + fastToFixed((arrowTopY + 8), 1);
                    }
                    else {
                        arrowPath += "M 62 " + fastToFixed((arrowTopY - 8), 1) + " L 70 " + fastToFixed(arrowTopY, 1) + " L 78 " + fastToFixed((arrowTopY - 8), 1);
                    }
                }
                diffAndSetAttribute(this.speedTrendArrowSVGShape, "d", arrowPath);
                hideArrow = false;
            }
        }
        if (hideArrow) {
            diffAndSetAttribute(this.speedTrendArrowSVG, "visibility", "hidden");
        }
        else {
            diffAndSetAttribute(this.speedTrendArrowSVG, "visibility", "visible");
        }
    }
    updateTargetSpeeds(currentAirspeed, dTime) {
        let takeOffSpeedNotSet = false;
        let hudSpeed = -1;
        if (this.aircraft == Aircraft.A320_NEO) {
            let hideBluePointer = true;
            let hideBlueText = true;
            {
                let forceHidePointer = false;
                let blueAirspeed = Simplane.getV1Airspeed();
                if (blueAirspeed >= 0) {
                    forceHidePointer = true;
                }
                else {
                    let isSelected = Simplane.getAutoPilotAirspeedSelected();
                    if (isSelected) {
                        if (Simplane.getAutoPilotMachModeActive())
                            blueAirspeed = SimVar.GetGameVarValue("FROM MACH TO KIAS", "number", Simplane.getAutoPilotMachHoldValue());
                        else
                            blueAirspeed = Simplane.getAutoPilotAirspeedHoldValue();
                    }
                }
                if (Math.abs(this.blueAirspeed - blueAirspeed) < 10)
                    this.blueAirspeed = Utils.SmoothPow(this.blueAirspeed, blueAirspeed, 1.1, dTime / 1000);
                else
                    this.blueAirspeed = blueAirspeed;
                if (this.blueAirspeed > this.graduationMinValue) {
                    let blueSpeedPosY = this.valueToSvg(currentAirspeed, this.blueAirspeed);
                    let blueSpeedHeight = 44;
                    if (blueSpeedPosY > 0) {
                        if (!forceHidePointer) {
                            if (this.blueSpeedSVG) {
                                diffAndSetAttribute(this.blueSpeedSVG, "visibility", "visible");
                                diffAndSetAttribute(this.blueSpeedSVG, "y", (blueSpeedPosY - blueSpeedHeight * 0.5) + '');
                            }
                            hideBluePointer = false;
                        }
                    }
                    else {
                        hideBlueText = false;
                    }
                    hudSpeed = this.blueAirspeed;
                }
                if (this.blueSpeedSVG && hideBluePointer) {
                    diffAndSetAttribute(this.blueSpeedSVG, "visibility", "hidden");
                }
                if (this.blueSpeedText) {
                    if (hideBlueText) {
                        diffAndSetAttribute(this.blueSpeedText, "visibility", "hidden");
                    }
                    else {
                        diffAndSetAttribute(this.blueSpeedText, "visibility", "visible");
                        diffAndSetText(this.blueSpeedText, fastToFixed(this.blueAirspeed, 0));
                    }
                }
            }
            let hideRedPointer = true;
            let hideRedText = true;
            {
                let redAirspeed = Simplane.getV2Airspeed();
                if (redAirspeed < 0) {
                    let isManaged = Simplane.getAutoPilotAirspeedManaged();
                    if (isManaged) {
                        if (Simplane.getAutoPilotMachModeActive())
                            redAirspeed = SimVar.GetGameVarValue("FROM MACH TO KIAS", "number", Simplane.getAutoPilotMachHoldValue());
                        else
                            redAirspeed = Simplane.getAutoPilotAirspeedHoldValue();
                    }
                }
                if (Math.abs(this.redAirspeed - redAirspeed) < 10)
                    this.redAirspeed = Utils.SmoothPow(this.redAirspeed, redAirspeed, 1.1, dTime / 1000);
                else
                    this.redAirspeed = redAirspeed;
                if (this.redAirspeed > this.graduationMinValue) {
                    let redSpeedPosY = this.valueToSvg(currentAirspeed, this.redAirspeed);
                    let redSpeedHeight = 44;
                    if (redSpeedPosY > 0) {
                        if (this.redSpeedSVG) {
                            diffAndSetAttribute(this.redSpeedSVG, "visibility", "visible");
                            diffAndSetAttribute(this.redSpeedSVG, "y", (redSpeedPosY - redSpeedHeight * 0.5) + '');
                        }
                        hideRedPointer = false;
                    }
                    else {
                        hideRedText = false;
                    }
                    hudSpeed = this.redAirspeed;
                }
                if (this.redSpeedSVG && hideRedPointer) {
                    diffAndSetAttribute(this.redSpeedSVG, "visibility", "hidden");
                }
                if (this.redSpeedText) {
                    if (hideRedText) {
                        diffAndSetAttribute(this.redSpeedText, "visibility", "hidden");
                    }
                    else {
                        diffAndSetAttribute(this.redSpeedText, "visibility", "visible");
                        diffAndSetText(this.redSpeedText, fastToFixed(this.redAirspeed, 0));
                    }
                }
            }
            if (hideRedPointer && hideRedText && hideBluePointer && hideBlueText) {
                takeOffSpeedNotSet = true;
            }
        }
        else {
            let hideText = true;
            let hidePointer = true;
            if (this.targetSpeedSVG) {
                var APMode = this.getAutopilotMode();
                if (APMode != AutopilotMode.MANAGED) {
                    let target = 0;
                    if (Simplane.getAutoPilotMachModeActive()) {
                        let machAirspeed = Simplane.getAutoPilotMachHoldValue();
                        if (machAirspeed < 1.0) {
                            var fixedMach = fastToFixed(machAirspeed, 3);
                            var radixPos = fixedMach.indexOf('.');
                            diffAndSetText(this.targetSpeedSVG, fixedMach.slice(radixPos));
                        }
                        else {
                            diffAndSetText(this.targetSpeedSVG, fastToFixed(machAirspeed, 1));
                        }
                        target = SimVar.GetGameVarValue("FROM MACH TO KIAS", "number", machAirspeed);
                    }
                    else {
                        target = Simplane.getAutoPilotAirspeedHoldValue();
                        diffAndSetText(this.targetSpeedSVG, Utils.leadingZeros(Math.round(this.selectedAirspeed), 3));
                    }
                    if (Math.abs(this.selectedAirspeed - target) < 10)
                        this.selectedAirspeed = Utils.SmoothPow(this.selectedAirspeed, target, 1.1, dTime / 1000);
                    else
                        this.selectedAirspeed = target;
                    if (this.selectedAirspeed >= this.graduationMinValue) {
                        let pointerPosY = this.valueToSvg(currentAirspeed, this.selectedAirspeed);
                        if (pointerPosY > 0) {
                            if (this.targetSpeedPointerSVG) {
                                diffAndSetAttribute(this.targetSpeedPointerSVG, "visibility", "visible");
                                diffAndSetAttribute(this.targetSpeedPointerSVG, "y", (pointerPosY - this.targetSpeedPointerHeight * 0.5) + '');
                            }
                            hidePointer = false;
                        }
                        hudSpeed = this.selectedAirspeed;
                        hideText = false;
                    }
                    else {
                        diffAndSetText(this.targetSpeedSVG, "");
                    }
                }
                else {
                    this.selectedAirspeed = -1;
                    diffAndSetText(this.targetSpeedSVG, "");
                }
            }
            if (this.targetSpeedPointerSVG && hidePointer)
                diffAndSetAttribute(this.targetSpeedPointerSVG, "visibility", "hidden");
            if (this.targetSpeedBgSVG)
                this.targetSpeedBgSVG.classList.toggle('hide', hideText);
            if (this.targetSpeedIconSVG)
                this.targetSpeedIconSVG.classList.toggle('hide', hideText);
            if (Simplane.getIsGrounded() && Simplane.getV1Airspeed() <= 0 && Simplane.getVRAirspeed() <= 0 && Simplane.getV2Airspeed() <= 0) {
                takeOffSpeedNotSet = true;
            }
        }
        if (this.speedNotSetSVG) {
            diffAndSetAttribute(this.speedNotSetSVG, "visibility", (takeOffSpeedNotSet) ? "visible" : "hidden");
        }
        if (this.hudAPSpeed != hudSpeed) {
            this.hudAPSpeed = Math.round(hudSpeed);
            SimVar.SetSimVarValue("L:HUD_AP_SELECTED_SPEED", "Number", this.hudAPSpeed);
        }
    }
    updateNextFlapSpeedIndicator(currentAirspeed, crossSpeedFactor) {
        if (this.nextFlapSVG) {
            let nextFlapSpeed = Simplane.getNextFlapsExtendSpeed(this.aircraft) * crossSpeedFactor;
            let hidePointer = true;
            if (nextFlapSpeed > this.graduationMinValue) {
                var nextFlapSpeedPosY = this.valueToSvg(currentAirspeed, nextFlapSpeed);
                var nextFlapSpeedHeight = 20;
                if (nextFlapSpeedPosY > 0) {
                    diffAndSetAttribute(this.nextFlapSVG, "y", (nextFlapSpeedPosY - nextFlapSpeedHeight * 0.5) + '');
                    hidePointer = false;
                }
            }
            if (hidePointer) {
                diffAndSetAttribute(this.nextFlapSVG, "visibility", "hidden");
            }
            else {
                diffAndSetAttribute(this.nextFlapSVG, "visibility", "visible");
            }
        }
    }
    updateGreenDot(currentAirspeed, _greenDot) {
        if (this.greenDotSVG) {
            let hidePointer = true;
            if (_greenDot > this.graduationMinValue) {
                var greenDotPosY = this.valueToSvg(currentAirspeed, _greenDot);
                var greenDotHeight = 20;
                if (greenDotPosY > 0) {
                    diffAndSetAttribute(this.greenDotSVG, "y", (greenDotPosY - greenDotHeight * 0.5) + '');
                    hidePointer = false;
                }
            }
            if (hidePointer) {
                diffAndSetAttribute(this.greenDotSVG, "visibility", "hidden");
            }
            else {
                diffAndSetAttribute(this.greenDotSVG, "visibility", "visible");
            }
        }
    }
    updateStrip(_strip, currentAirspeed, maxSpeed, _forceHide, _topToBottom) {
        if (_strip) {
            let hideStrip = true;
            if (!_forceHide) {
                if (maxSpeed > this.graduationMinValue) {
                    let vPosY = this.valueToSvg(currentAirspeed, maxSpeed);
                    if (vPosY > 0) {
                        if (_topToBottom)
                            vPosY -= this.stripHeight + this.stripBorderSize;
                        diffAndSetAttribute(_strip, "transform", "translate(" + this.stripOffsetX + " " + vPosY + ")");
                        hideStrip = false;
                    }
                }
            }
            if (hideStrip) {
                diffAndSetAttribute(_strip, "visibility", "hidden");
            }
            else {
                diffAndSetAttribute(_strip, "visibility", "visible");
            }
        }
    }
    updateSpeedMarkers(currentAirspeed) {
        for (let i = 0; i < this.speedMarkers.length; i++) {
            this.speedMarkers[i].update(currentAirspeed);
        }
    }
    updateMarkerF(_marker, currentAirspeed) {
        let hideMarker = true;
        let phase = Simplane.getCurrentFlightPhase();
        let flapsHandleIndex = Simplane.getFlapsHandleIndex();
        if (flapsHandleIndex == 2 || flapsHandleIndex == 3) {
            let flapSpeed = 0;
            if (phase == FlightPhase.FLIGHT_PHASE_TAKEOFF || phase == FlightPhase.FLIGHT_PHASE_CLIMB || phase == FlightPhase.FLIGHT_PHASE_GOAROUND) {
                flapSpeed = Simplane.getStallSpeedPredicted(flapsHandleIndex - 1) * 1.26;
            }
            else if (phase == FlightPhase.FLIGHT_PHASE_DESCENT || phase == FlightPhase.FLIGHT_PHASE_APPROACH) {
                if (flapsHandleIndex == 2)
                    flapSpeed = Simplane.getStallSpeedPredicted(flapsHandleIndex + 1) * 1.47;
                else
                    flapSpeed = Simplane.getStallSpeedPredicted(flapsHandleIndex + 1) * 1.36;
            }
            if (flapSpeed >= 60) {
                let posY = this.valueToSvg(currentAirspeed, flapSpeed);
                diffAndSetAttribute(_marker.svg, "y", (posY - this.speedMarkersHeight * 0.5) + '');
                diffAndSetAttribute(_marker.svg, "visibility", "visible");
                hideMarker = false;
            }
        }
        if (hideMarker)
            diffAndSetAttribute(_marker.svg, "visibility", "hidden");
    }
    updateMarkerS(_marker, currentAirspeed) {
        let hideMarker = true;
        let phase = Simplane.getCurrentFlightPhase();
        let flapsHandleIndex = Simplane.getFlapsHandleIndex();
        if (flapsHandleIndex == 1) {
            let slatSpeed = 0;
            if (phase == FlightPhase.FLIGHT_PHASE_TAKEOFF || phase == FlightPhase.FLIGHT_PHASE_CLIMB || phase == FlightPhase.FLIGHT_PHASE_GOAROUND) {
                slatSpeed = Simplane.getStallSpeedPredicted(flapsHandleIndex - 1) * 1.25;
            }
            else if (phase == FlightPhase.FLIGHT_PHASE_DESCENT || phase == FlightPhase.FLIGHT_PHASE_APPROACH) {
                slatSpeed = Simplane.getStallSpeedPredicted(flapsHandleIndex + 1) * 1.23;
            }
            if (slatSpeed >= 60) {
                var posY = this.valueToSvg(currentAirspeed, slatSpeed);
                diffAndSetAttribute(_marker.svg, "y", (posY - this.speedMarkersHeight * 0.5) + '');
                diffAndSetAttribute(_marker.svg, "visibility", "visible");
                hideMarker = false;
            }
        }
        if (hideMarker)
            diffAndSetAttribute(_marker.svg, "visibility", "hidden");
    }
    updateMarkerV1(_marker, currentAirspeed) {
        let v1Speed = Simplane.getV1Airspeed();
        if (v1Speed > 0) {
            _marker.engaged = true;
        }
        else if (_marker.engaged && !_marker.passed) {
            v1Speed = Simplane.getV1AirspeedR();
        }
        if (v1Speed > 0) {
            var posY = this.valueToSvg(currentAirspeed, v1Speed);
            if (posY < 25 && (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B)) {
                posY = 25;
                _marker.setOffscreen(true, Math.round(v1Speed));
            }
            else {
                _marker.setOffscreen(false);
                if (posY >= this.refHeight + 25) {
                    _marker.passed = true;
                }
            }
            diffAndSetAttribute(_marker.svg, "y", (posY - this.speedMarkersHeight * 0.5) + '');
            diffAndSetAttribute(_marker.svg, "visibility", "visible");
        }
        else {
            diffAndSetAttribute(_marker.svg, "visibility", "hidden");
        }
    }
    updateMarkerVR(_marker, currentAirspeed) {
        let vRSpeed = Simplane.getVRAirspeed();
        if (vRSpeed > 0) {
            _marker.engaged = true;
        }
        else if (_marker.engaged && !_marker.passed) {
            vRSpeed = SimVar.GetSimVarValue("L:AIRLINER_VR_SPEED", "Knots");
        }
        if (vRSpeed > 0) {
            var posY = this.valueToSvg(currentAirspeed, vRSpeed);
            if (posY >= this.refHeight + 25) {
                _marker.passed = true;
            }
            diffAndSetAttribute(_marker.svg, "y", (posY - this.speedMarkersHeight * 0.5) + '');
            diffAndSetAttribute(_marker.svg, "visibility", "visible");
        }
        else {
            diffAndSetAttribute(_marker.svg, "visibility", "hidden");
        }
    }
    updateMarkerV2(_marker, currentAirspeed) {
        let v2Speed = Simplane.getV2Airspeed();
        if (v2Speed > 0) {
            _marker.engaged = true;
        }
        else if (_marker.engaged && !_marker.passed) {
            v2Speed = SimVar.GetSimVarValue("L:AIRLINER_V2_SPEED", "Knots");
        }
        if (v2Speed > 0) {
            var posY = this.valueToSvg(currentAirspeed, v2Speed);
            if (posY >= this.refHeight + 25) {
                _marker.passed = true;
            }
            diffAndSetAttribute(_marker.svg, "y", (posY - this.speedMarkersHeight * 0.5) + '');
            diffAndSetAttribute(_marker.svg, "visibility", "visible");
        }
        else {
            diffAndSetAttribute(_marker.svg, "visibility", "hidden");
        }
    }
    updateMarkerVRef(_marker, currentAirspeed) {
        let vRefSpeed = Simplane.getREFAirspeed();
        if (vRefSpeed > 0) {
            var posY = this.valueToSvg(currentAirspeed, vRefSpeed);
            if (posY > this.refHeight - 25 && (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B)) {
                posY = this.refHeight - 25;
                _marker.setOffscreen(true, Math.round(vRefSpeed));
            }
            else {
                _marker.setOffscreen(false);
            }
            diffAndSetAttribute(_marker.svg, "y", (posY - this.speedMarkersHeight * 0.5) + '');
            diffAndSetAttribute(_marker.svg, "visibility", "visible");
        }
        else {
            diffAndSetAttribute(_marker.svg, "visibility", "hidden");
        }
    }
    updateMarkerVX(_marker, currentAirspeed) {
        let vxSpeed = Simplane.getVXAirspeed();
        if (vxSpeed > 0) {
            _marker.engaged = true;
        }
        else if (_marker.engaged && !_marker.passed) {
            vxSpeed = SimVar.GetSimVarValue("L:AIRLINER_VX_SPEED", "Knots");
        }
        if (vxSpeed > 0) {
            var posY = this.valueToSvg(currentAirspeed, vxSpeed);
            if (posY >= this.refHeight + 25) {
                _marker.passed = true;
            }
            diffAndSetAttribute(_marker.svg, "y", (posY - this.speedMarkersHeight * 0.5) + '');
            diffAndSetAttribute(_marker.svg, "visibility", "visible");
        }
        else {
            diffAndSetAttribute(_marker.svg, "visibility", "hidden");
        }
    }
    updateMarkerFlap(_marker, currentAirspeed) {
        let hideMarker = true;
        let phase = Simplane.getCurrentFlightPhase();
        let flapsHandleIndex = Simplane.getFlapsHandleIndex();
        let markerHandleIndex = _marker.params[0];
        let altitude = Simplane.getAltitude();
        if (phase >= FlightPhase.FLIGHT_PHASE_TAKEOFF && altitude < 20000) {
            if (this.aircraft == Aircraft.AS01B && markerHandleIndex == flapsHandleIndex) {
                hideMarker = false;
            }
            if (phase == FlightPhase.FLIGHT_PHASE_CLIMB || phase == FlightPhase.FLIGHT_PHASE_CRUISE) {
                if (markerHandleIndex == (flapsHandleIndex - 1)) {
                    hideMarker = false;
                }
            }
            else {
                if (markerHandleIndex == (flapsHandleIndex + 1)) {
                    hideMarker = false;
                }
            }
        }
        if (!hideMarker) {
            let limitSpeed = 0;
            if (markerHandleIndex == 0) {
                limitSpeed = Simplane.getFlapsLimitSpeed(this.aircraft, 1) + 20;
                _marker.setText("UP");
            }
            else {
                limitSpeed = Simplane.getFlapsLimitSpeed(this.aircraft, markerHandleIndex);
                let degrees = 0;
                if (this.gps.cockpitSettings && this.gps.cockpitSettings.FlapsLevels.initialised) {
                    degrees = this.gps.cockpitSettings.FlapsLevels.flapsAngle[markerHandleIndex];
                }
                else {
                    degrees = Simplane.getFlapsHandleAngle(markerHandleIndex);
                }
                _marker.setText(fastToFixed(degrees, 0));
            }
            let speedBuffer = 50;
            {
                let weightRatio = Simplane.getWeight() / Simplane.getMaxWeight();
                weightRatio = (weightRatio - 0.65) / (1 - 0.65);
                weightRatio = 1.0 - Utils.Clamp(weightRatio, 0, 1);
                let altitudeRatio = Simplane.getAltitude() / 30000;
                altitudeRatio = 1.0 - Utils.Clamp(altitudeRatio, 0, 1);
                speedBuffer *= (weightRatio * 0.7 + altitudeRatio * 0.3);
            }
            var posY = this.valueToSvg(currentAirspeed, limitSpeed - speedBuffer);
            diffAndSetAttribute(_marker.svg, "y", (posY - this.speedMarkersHeight * 0.5) + '');
            diffAndSetAttribute(_marker.svg, "visibility", "visible");
        }
        else {
            diffAndSetAttribute(_marker.svg, "visibility", "hidden");
        }
    }
}
customElements.define("jet-pfd-airspeed-indicator", Jet_PFD_AirspeedIndicator);
class AirspeedMarker {
    constructor(_lineSVG, _textSVG, _offscreenSVG, _handler) {
        this.engaged = false;
        this.passed = false;
        this.lineSVG = _lineSVG;
        this.textSVG = _textSVG;
        this.offscreenSVG = _offscreenSVG;
        this.handler = _handler;
        this.setOffscreen(false);
    }
    update(_indicatedSpeed) {
        this.handler(this, _indicatedSpeed);
    }
    setText(_text) {
        diffAndSetText(this.textSVG, _text);
    }
    setOffscreen(_offscreen, _speed = 0) {
        if (_offscreen) {
            diffAndSetAttribute(this.lineSVG, "visibility", "hidden");
            this.offscreenSVG.removeAttribute("visibility");
            diffAndSetText(this.offscreenSVG, _speed + '');
        }
        else {
            this.lineSVG.removeAttribute("visibility");
            diffAndSetAttribute(this.offscreenSVG, "visibility", "hidden");
        }
    }
}
//# sourceMappingURL=AirspeedIndicator.js.map