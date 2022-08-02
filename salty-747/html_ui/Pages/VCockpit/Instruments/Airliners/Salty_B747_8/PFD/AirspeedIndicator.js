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
        this.altOver20k = false;
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
        else
            this.construct_A320_Neo();
    }
    construct_CJ4() {
    }
    construct_B747_8() {
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        this.rootSVG.setAttribute("id", "ViewBox");
        this.rootSVG.setAttribute("viewBox", "0 0 250 800");
        var posX = 100;
        var posY = 14;
        var width = 105;
        var height = 610;
        var arcWidth = 100;
        this.refHeight = height;
        this.stripOffsetX = -2;
        this.graduationSpacing = 54;
        this.graduationScroller = new Avionics.Scroller(this.nbPrimaryGraduations, 20);
        this.cursorIntegrals = new Array();
        this.cursorIntegrals.push(new Avionics.AirspeedScroller(52, 100));
        this.cursorIntegrals.push(new Avionics.AirspeedScroller(52, 10));
        this.cursorDecimals = new Avionics.AirspeedScroller(37);
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.rootGroup.setAttribute("id", "Airspeed");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        var sideTextHeight = 75;
        if (!this.targetSpeedSVG)
            this.targetSpeedSVG = document.createElementNS(Avionics.SVG.NS, "text");
        this.targetSpeedSVG.textContent = ".000";
        this.targetSpeedSVG.setAttribute("x", (posX + 10).toString());
        this.targetSpeedSVG.setAttribute("y", (posY + sideTextHeight * 0.5).toString());
        this.targetSpeedSVG.setAttribute("fill", "#D570FF");
        this.targetSpeedSVG.setAttribute("font-size", (this.fontSize * 1.6).toString());
        this.targetSpeedSVG.setAttribute("font-family", "BoeingEFIS");
        this.targetSpeedSVG.style.letterSpacing = "1px";
        this.targetSpeedSVG.setAttribute("text-anchor", "middle");
        this.targetSpeedSVG.setAttribute("alignment-baseline", "central");
        this.rootGroup.appendChild(this.targetSpeedSVG);
        posY += sideTextHeight;
        if (!this.centerSVG) {
            this.centerSVG = document.createElementNS(Avionics.SVG.NS, "svg");
            this.centerSVG.setAttribute("id", "CenterGroup");
        }
        else
            Utils.RemoveAllChildren(this.centerSVG);
        this.centerSVG.setAttribute("x", (posX - width * 0.5).toString());
        this.centerSVG.setAttribute("y", posY.toString());
        this.centerSVG.setAttribute("width", (width + arcWidth).toString());
        this.centerSVG.setAttribute("height", height.toString());
        this.centerSVG.setAttribute("viewBox", "0 0 " + (width + arcWidth) + " " + height);
        {
            var _top = 0;
            var _left = 7;
            var _width = width;
            var _height = height;
            var bg = document.createElementNS(Avionics.SVG.NS, "rect");
            bg.setAttribute("x", _left.toString());
            bg.setAttribute("y", _top.toString());
            bg.setAttribute("width", _width.toString());
            bg.setAttribute("height", _height.toString());
            bg.setAttribute("fill", "#343B51");
            this.centerSVG.appendChild(bg);
            var graduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
            graduationGroup.setAttribute("id", "Graduations");
            {
                this.graduationScrollPosX = _left + _width;
                this.graduationScrollPosY = -3 + _top + _height * 0.5;
                this.graduations = [];
                for (var i = 0; i < this.totalGraduations; i++) {
                    var line = new Avionics.SVGGraduation();
                    line.IsPrimary = (i % (this.nbSecondaryGraduations + 1)) ? false : true;
                    var lineWidth = line.IsPrimary ? 22 : 22;
                    var lineHeight = line.IsPrimary ? 3 : 3;
                    var linePosX = -lineWidth;
                    line.SVGLine = document.createElementNS(Avionics.SVG.NS, "rect");
                    line.SVGLine.setAttribute("x", linePosX.toString());
                    line.SVGLine.setAttribute("width", lineWidth.toString());
                    line.SVGLine.setAttribute("height", lineHeight.toString());
                    line.SVGLine.setAttribute("fill", "white");
                    if (line.IsPrimary) {
                        line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                        line.SVGText1.setAttribute("x", (linePosX - 15).toString());
                        line.SVGText1.setAttribute("fill", "white");
                        line.SVGText1.setAttribute("font-size", (this.fontSize * 1.2).toString());
                        line.SVGText1.setAttribute("font-family", "BoeingEFIS");
                        line.SVGText1.setAttribute("text-anchor", "end");
                        line.SVGText1.style.letterSpacing = "1.5px";
                        line.SVGText1.setAttribute("alignment-baseline", "central");
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
            var cursorPosY = _top + _height * 0.5;
            var cursorWidth = width;
            var cursorHeight = 76;
            if (!this.cursorSVG) {
                this.cursorSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                this.cursorSVG.setAttribute("id", "CursorGroup");
            }
            else
                Utils.RemoveAllChildren(this.cursorSVG);
            this.cursorSVG.setAttribute("x", cursorPosX.toString());
            this.cursorSVG.setAttribute("y", (cursorPosY - cursorHeight * 0.5).toString());
            this.cursorSVG.setAttribute("width", cursorWidth.toString());
            this.cursorSVG.setAttribute("height", cursorHeight.toString());
            this.cursorSVG.setAttribute("viewBox", "0 2 " + cursorWidth + " " + cursorHeight);
            {
                if (!this.cursorSVGShape)
                    this.cursorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                this.cursorSVGShape.setAttribute("fill", "black");
                this.cursorSVGShape.setAttribute("d", "M2 2 L76 2 L76 28 L88 38 L76 50 L76 78 L2 78 Z");
                this.cursorSVGShape.setAttribute("stroke", "white");
                this.cursorSVGShape.setAttribute("stroke-width", "3");
                this.cursorSVG.appendChild(this.cursorSVGShape);
                var _cursorPosX = -14;
                var _cursorPosY = cursorHeight * 0.5;
                this.cursorIntegrals[0].construct(this.cursorSVG, _cursorPosX + 42, _cursorPosY + 3, _width, "BoeingEFIS", this.fontSize * 1.5, "white");
                this.cursorIntegrals[1].construct(this.cursorSVG, _cursorPosX + 62, _cursorPosY + 3, _width, "BoeingEFIS", this.fontSize * 1.5, "white");
                this.cursorDecimals.construct(this.cursorSVG, _cursorPosX + 83, _cursorPosY + 3, _width, "BoeingEFIS", this.fontSize * 1.5, "white");
                this.cursorSVGShapeMask = document.createElementNS(Avionics.SVG.NS, "path");
                this.cursorSVGShapeMask.setAttribute("fill", "transparent");
                this.cursorSVGShapeMask.setAttribute("d", "M7 7 L71 7 L71 73 L7 73 Z");
                this.cursorSVGShapeMask.setAttribute("stroke", "black");
                this.cursorSVGShapeMask.setAttribute("stroke-width", "7");
                this.cursorSVG.appendChild(this.cursorSVGShapeMask);
            }
            if (!this.speedTrendArrowSVG) {
                this.speedTrendArrowSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                this.speedTrendArrowSVG.setAttribute("id", "SpeedTrendArrowGroup");
            }
            else
                Utils.RemoveAllChildren(this.speedTrendArrowSVG);
            this.speedTrendArrowSVG.setAttribute("x", "18");
            this.speedTrendArrowSVG.setAttribute("y", "0");
            this.speedTrendArrowSVG.setAttribute("width", "250");
            this.speedTrendArrowSVG.setAttribute("height", height.toString());
            this.speedTrendArrowSVG.setAttribute("viewBox", "0 0 250 " + height.toString());
            {
                if (!this.speedTrendArrowSVGShape)
                    this.speedTrendArrowSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                this.speedTrendArrowSVGShape.setAttribute("fill", "none");
                this.speedTrendArrowSVGShape.setAttribute("stroke", "lime");
                this.speedTrendArrowSVGShape.setAttribute("stroke-width", "2");
                this.speedTrendArrowSVG.appendChild(this.speedTrendArrowSVGShape);
            }
            var stripViewPosX = _left + _width;
            var stripViewPosY = this.stripBorderSize;
            var stripViewWidth = width;
            var stripViewHeight = _height - this.stripBorderSize * 2;
            if (!this.stripsSVG) {
                this.stripsSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                this.stripsSVG.setAttribute("id", "StripsGroup");
            }
            else
                Utils.RemoveAllChildren(this.stripsSVG);
            this.stripsSVG.setAttribute("x", stripViewPosX.toFixed(0));
            this.stripsSVG.setAttribute("y", stripViewPosY.toFixed(0));
            this.stripsSVG.setAttribute("width", stripViewWidth.toFixed(0));
            this.stripsSVG.setAttribute("height", stripViewHeight.toFixed(0));
            this.stripsSVG.setAttribute("viewBox", "0 0 " + stripViewWidth + " " + stripViewHeight);
            {
                this.stripHeight = stripViewHeight * 3;
                this.vMaxStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                this.vMaxStripSVG.setAttribute("id", "VMax");
                {
                    let stripWidth = 14;
                    let shape = document.createElementNS(Avionics.SVG.NS, "path");
                    shape.setAttribute("fill", "black");
                    shape.setAttribute("stroke", "none");
                    shape.setAttribute("d", "M 0 0 l " + stripWidth + " 0 l 0 " + (this.stripHeight) + " l " + (-stripWidth) + " 0 Z");
                    this.vMaxStripSVG.appendChild(shape);
                    let dashHeight = stripWidth * 1.0;
                    let dashSpacing = dashHeight * 1.15;
                    let y = this.stripHeight - dashHeight;
                    while (y > 0) {
                        let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                        rect.setAttribute("fill", "red");
                        rect.setAttribute("x", "0");
                        rect.setAttribute("y", y.toString());
                        rect.setAttribute("width", stripWidth.toString());
                        rect.setAttribute("height", dashHeight.toString());
                        this.vMaxStripSVG.appendChild(rect);
                        y -= dashHeight + dashSpacing;
                    }
                }
                this.stripsSVG.appendChild(this.vMaxStripSVG);
                this.stallProtMinStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                this.stallProtMinStripSVG.setAttribute("id", "StallProtMin");
                {
                    let stripWidth = 9;
                    let shape = document.createElementNS(Avionics.SVG.NS, "path");
                    shape.setAttribute("fill", "none");
                    shape.setAttribute("stroke", "orange");
                    shape.setAttribute("stroke-width", "3");
                    shape.setAttribute("d", "M 0 0 l " + stripWidth + " 0 l 0 " + (this.stripHeight) + " l " + (-stripWidth) + " 0 Z");
                    this.stallProtMinStripSVG.appendChild(shape);
                }
                this.stripsSVG.appendChild(this.stallProtMinStripSVG);
                this.stallProtMaxStripSVG = document.createElementNS(Avionics.SVG.NS, "g");
                this.stallProtMaxStripSVG.setAttribute("id", "StallProtMax");
                {
                    let stripWidth = 14;
                    let shape = document.createElementNS(Avionics.SVG.NS, "path");
                    shape.setAttribute("fill", "black");
                    shape.setAttribute("stroke", "none");
                    shape.setAttribute("d", "M 0 0 l " + stripWidth + " 0 l 0 " + (this.stripHeight) + " l " + (-stripWidth) + " 0 Z");
                    this.stallProtMaxStripSVG.appendChild(shape);
                    let dashHeight = stripWidth * 1.0;
                    let dashSpacing = dashHeight * 1.15;
                    let y = 0;
                    while (y < this.stripHeight) {
                        let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                        rect.setAttribute("fill", "red");
                        rect.setAttribute("x", "0");
                        rect.setAttribute("y", y.toString());
                        rect.setAttribute("width", stripWidth.toString());
                        rect.setAttribute("height", dashHeight.toString());
                        this.stallProtMaxStripSVG.appendChild(rect);
                        y += dashHeight + dashSpacing;
                    }
                }
                this.stripsSVG.appendChild(this.stallProtMaxStripSVG);
            }
            this.speedNotSetSVG = document.createElementNS(Avionics.SVG.NS, "g");
            this.speedNotSetSVG.setAttribute("id", "speedNotSet");
            {
                let textPosX = _left + _width * 1.25;
                let textPosY = _top + _height * 0.225;
                let textSpace = 27;
                let text = document.createElementNS(Avionics.SVG.NS, "text");
                text.textContent = "NO";
                text.setAttribute("x", textPosX.toString());
                text.setAttribute("y", textPosY.toString());
                text.setAttribute("fill", "orange");
                text.setAttribute("font-size", (this.fontSize * 1.3).toString());
                text.setAttribute("font-family", "BoeingEFIS");
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("alignment-baseline", "central");
                this.speedNotSetSVG.appendChild(text);
                textPosY += textSpace + 5;
                text = document.createElementNS(Avionics.SVG.NS, "text");
                text.textContent = "V";
                text.setAttribute("x", textPosX.toString());
                text.setAttribute("y", textPosY.toString());
                text.setAttribute("fill", "orange");
                text.setAttribute("font-size", (this.fontSize * 1.3).toString());
                text.setAttribute("font-family", "BoeingEFIS");
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("alignment-baseline", "central");
                this.speedNotSetSVG.appendChild(text);
                textPosY += textSpace + 5;
                text = document.createElementNS(Avionics.SVG.NS, "text");
                text.textContent = "S";
                text.setAttribute("x", textPosX.toString());
                text.setAttribute("y", textPosY.toString());
                text.setAttribute("fill", "orange");
                text.setAttribute("font-size", (this.fontSize * 1.3).toString());
                text.setAttribute("font-family", "BoeingEFIS");
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("alignment-baseline", "central");
                this.speedNotSetSVG.appendChild(text);
                textPosY += textSpace;
                text = document.createElementNS(Avionics.SVG.NS, "text");
                text.textContent = "P";
                text.setAttribute("x", textPosX.toString());
                text.setAttribute("y", textPosY.toString());
                text.setAttribute("fill", "orange");
                text.setAttribute("font-size", (this.fontSize * 1.3).toString());
                text.setAttribute("font-family", "BoeingEFIS");
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("alignment-baseline", "central");
                this.speedNotSetSVG.appendChild(text);
                textPosY += textSpace;
                text = document.createElementNS(Avionics.SVG.NS, "text");
                text.textContent = "D";
                text.setAttribute("x", textPosX.toString());
                text.setAttribute("y", textPosY.toString());
                text.setAttribute("fill", "orange");
                text.setAttribute("font-size", (this.fontSize * 1.3).toString());
                text.setAttribute("font-family", "BoeingEFIS");
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("alignment-baseline", "central");
                this.speedNotSetSVG.appendChild(text);
            }
            var targetSpeedPointerPosX = _left + _width * 0.77;
            var targetSpeedPointerPosY = _top + _height * 0.50;
            var targetSpeedPointerWidth = width;
            this.targetSpeedPointerHeight = 46;
            this.targetSpeedPointerSVG = document.createElementNS(Avionics.SVG.NS, "svg");
            this.targetSpeedPointerSVG.setAttribute("id", "TargetSpeedPointerGroup");
            this.targetSpeedPointerSVG.setAttribute("x", targetSpeedPointerPosX.toString());
            this.targetSpeedPointerSVG.setAttribute("y", (targetSpeedPointerPosY - this.targetSpeedPointerHeight * 0.5).toString());
            this.targetSpeedPointerSVG.setAttribute("width", targetSpeedPointerWidth.toString());
            this.targetSpeedPointerSVG.setAttribute("height", this.targetSpeedPointerHeight.toString());
            this.targetSpeedPointerSVG.setAttribute("viewBox", "0 0 " + targetSpeedPointerWidth + " " + this.targetSpeedPointerHeight);
            {
                let shape = document.createElementNS(Avionics.SVG.NS, "path");
                shape.setAttribute("fill", "none");
                shape.setAttribute("stroke", "#D570FF");
                shape.setAttribute("stroke-width", "3");
                shape.setAttribute("d", "M 0 22 L 25 10 L 52 10 L 52 34 L 25 34 Z");
                this.targetSpeedPointerSVG.appendChild(shape);
            }
            var speedMarkersPosX = _left + _width - 15;
            var speedMarkersPosY = 0;
            this.speedMarkersWidth = width;
            this.speedMarkersHeight = 70;
            let nbHandles = Simplane.getFlapsNbHandles();
            for (let i = 0; i < nbHandles; i++) {
                this.createSpeedMarker("", speedMarkersPosX, speedMarkersPosY, this.updateMarkerFlap, 1.0, 1.0, "#24F000", false, [i]);
            }
            this.createSpeedMarker("V1", speedMarkersPosX, speedMarkersPosY, this.updateMarkerV1, 1.0, 1.0, "#24F000");
            this.createSpeedMarker("VR", speedMarkersPosX, speedMarkersPosY, this.updateMarkerVR, 1.0, 1.0, "#24F000");
            this.createSpeedMarker("V2", speedMarkersPosX, speedMarkersPosY, this.updateMarkerV2, 1.0, 1.0, "#24F000");
            this.createSpeedMarker("REF", speedMarkersPosX + 6, speedMarkersPosY, this.updateMarkerVRef, 1.0, 1.0, "#24F000");
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
            this.machPrefixSVG.textContent = ".";
            this.machPrefixSVG.setAttribute("x", (posX - 16).toString());
            this.machPrefixSVG.setAttribute("y", (posY + 15 + height + sideTextHeight * 0.65).toString());
            this.machPrefixSVG.setAttribute("fill", "white");
            this.machPrefixSVG.setAttribute("font-size", (this.fontSize * 1.1).toString());
            this.machPrefixSVG.setAttribute("font-family", "BoeingEFIS");
            this.machPrefixSVG.setAttribute("text-anchor", "end");
            this.machPrefixSVG.setAttribute("alignment-baseline", "top");
            this.machPrefixSVG.style.letterSpacing = "1px";
            this.rootGroup.appendChild(this.machPrefixSVG);
            this.machValueSVG = document.createElementNS(Avionics.SVG.NS, "text");
            this.machValueSVG.textContent = "000";
            this.machValueSVG.setAttribute("x", (posX - 16).toString());
            this.machValueSVG.setAttribute("y", (posY + 15 + height + sideTextHeight * 0.65).toString());
            this.machValueSVG.setAttribute("fill", "white");
            this.machValueSVG.setAttribute("font-size", (this.fontSize * 1.6).toString());
            this.machValueSVG.setAttribute("font-family", "BoeingEFIS");
            this.machValueSVG.setAttribute("text-anchor", "start");
            this.machValueSVG.setAttribute("alignment-baseline", "top");
            this.machValueSVG.style.letterSpacing = "1px";
            this.rootGroup.appendChild(this.machValueSVG);
        }
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    construct_AS01B() {
    }
    construct_A320_Neo() {
    }
    createSpeedMarker(_text, _x, _y, _handler, _scale = 1.0, _textScale = 1.4, _color = "green", _bg = false, _params = []) {
        let svg = document.createElementNS(Avionics.SVG.NS, "svg");
        svg.setAttribute("id", _text + "_Marker");
        svg.setAttribute("x", _x.toString());
        svg.setAttribute("y", _y.toString());
        svg.setAttribute("width", (this.speedMarkersWidth * _scale).toFixed(0));
        svg.setAttribute("height", (this.speedMarkersHeight * _scale * 1.05).toFixed(0));
        svg.setAttribute("viewBox", "0 0 " + this.speedMarkersWidth + " " + (this.speedMarkersHeight * 1.05));
        let offsetY = (this.speedMarkersHeight - this.speedMarkersHeight * _scale) * 0.5;
        let line = document.createElementNS(Avionics.SVG.NS, "line");
        line.setAttribute("x1", "-20");
        line.setAttribute("y1", (offsetY + this.speedMarkersHeight * 0.5).toString());
        line.setAttribute("x2", "14");
        line.setAttribute("y2", (offsetY + this.speedMarkersHeight * 0.5).toString());
        line.setAttribute("stroke", _color);
        line.setAttribute("stroke-width", "6");
        svg.appendChild(line);
        if (_bg) {
            let textBG = document.createElementNS(Avionics.SVG.NS, "rect");
            textBG.setAttribute("x", "17");
            textBG.setAttribute("y", (offsetY + this.speedMarkersHeight * 0.3).toString());
            textBG.setAttribute("width", (this.speedMarkersWidth * 0.275).toString());
            textBG.setAttribute("height", (this.speedMarkersHeight * 0.4).toString());
            textBG.setAttribute("fill", "black");
            svg.appendChild(textBG);
        }
        let text = document.createElementNS(Avionics.SVG.NS, "text");
        text.textContent = _text;
        text.setAttribute("x", "17");
        text.setAttribute("y", (offsetY + this.speedMarkersHeight * 0.5).toString());
        text.setAttribute("fill", _color);
        text.setAttribute("font-size", (this.fontSize * _textScale).toString());
        text.setAttribute("font-family", "BoeingEFIS");
        text.setAttribute("text-anchor", "start");
        text.setAttribute("alignment-baseline", "central");
        svg.appendChild(text);
        let speed = document.createElementNS(Avionics.SVG.NS, "text");
        speed.textContent = _text;
        speed.setAttribute("x", "17");
        speed.setAttribute("y", (offsetY + this.speedMarkersHeight * 0.8).toString());
        speed.setAttribute("fill", _color);
        speed.setAttribute("font-size", (this.fontSize * _textScale).toString());
        speed.setAttribute("font-family", "BoeingEFIS");
        speed.setAttribute("text-anchor", "start");
        speed.setAttribute("alignment-baseline", "central");
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
    getStallSpeed1G() {
        let flapSetting = SimVar.GetSimVarValue("TRAILING EDGE FLAPS LEFT ANGLE", "degrees");
        let grossWeight = Math.round(Simplane.getWeight() / 1000);
        let a = -0.0008 * grossWeight - 0.5617;
        let b = 0.2237 * grossWeight + 75.764;
        let c = 0.0326 * grossWeight + 25.248;
        if (flapSetting === 0) {
            let stallSpeed1G = a * flapSetting + b + c;
            return stallSpeed1G;
        }
        else {
            let stallSpeed1G = a * flapSetting + b;
            return stallSpeed1G;
        }
    }
    update(dTime) {
        let indicatedSpeed = Simplane.getIndicatedSpeed();
        let MMO = 0.9;
        let gLoad = SimVar.GetSimVarValue("G FORCE", "GForce");
        this.updateArcScrolling(indicatedSpeed);
        this.updateGraduationScrolling(indicatedSpeed);
        this.updateCursorScrolling(indicatedSpeed);
        let speedTrend = this.computeIASAcceleration(indicatedSpeed) * 10;
        let crossSpeed = SimVar.GetGameVarValue("AIRCRAFT CROSSOVER SPEED", "Knots");
        let cruiseMach = SimVar.GetGameVarValue("AIRCRAFT CRUISE MACH", "mach");
        let crossSpeedFactor = Simplane.getCrossoverSpeedFactor(crossSpeed, cruiseMach);
        let nextFlapSpeed = Simplane.getNextFlapsExtendSpeed(this.aircraft) * crossSpeedFactor;
        let maxSpeed = Math.min(SimVar.GetGameVarValue("FROM MACH TO KIAS", "Number", MMO), Simplane.getMaxSpeed(this.aircraft));
        let greenDot = Simplane.getGreenDotSpeed() * crossSpeedFactor;
        let lowestSelectableSpeed = Simplane.getLowestSelectableSpeed();
        let stallProtectionMax = Simplane.getStallProtectionMaxSpeed();
        let stallSpeed1G = this.getStallSpeed1G();
        let stallSpeed = stallSpeed1G * Math.sqrt(gLoad);
        let stallProtectionMin = Math.round(stallSpeed1G * Math.sqrt(1.3));
        
        /* Provides Low Airspeed Warning for PFD and EICAS */
        SimVar.SetSimVarValue("L:74S_FMC_MIN_MANUEVER_SPEED", "knots", stallProtectionMin);
        if (indicatedSpeed <= stallProtectionMin && !Simplane.getIsGrounded()) {
            this.cursorSVGShape.setAttribute("stroke", "orange");
            this.cursorSVGShape.setAttribute("stroke-width", "6");
        } 
        else {
            this.cursorSVGShape.setAttribute("stroke", "white");
            this.cursorSVGShape.setAttribute("stroke-width", "3");
        }

        let altitudeAboveGround = Simplane.getAltitudeAboveGround();
        this.smoothSpeeds(indicatedSpeed, dTime, maxSpeed, lowestSelectableSpeed, stallProtectionMin, stallProtectionMax, stallSpeed);
        this.updateSpeedTrendArrow(indicatedSpeed, speedTrend);
        this.updateTargetSpeeds(indicatedSpeed, dTime);
        this.updateNextFlapSpeedIndicator(indicatedSpeed, nextFlapSpeed);
        this.updateStrip(this.vMaxStripSVG, indicatedSpeed, this._maxSpeed, false, true);
        this.updateStrip(this.vLSStripSVG, indicatedSpeed, this._lowestSelectableSpeed, (altitudeAboveGround < 100), false);
        this.updateStrip(this.stallProtMinStripSVG, indicatedSpeed, stallProtectionMin, (altitudeAboveGround < 10), false);
        this.updateStrip(this.stallProtMaxStripSVG, indicatedSpeed, stallSpeed, (altitudeAboveGround < 10), false);
        this.updateStrip(this.stallStripSVG, indicatedSpeed, stallSpeed, (altitudeAboveGround < 10), false);
        this.updateGreenDot(indicatedSpeed, greenDot);
        this.updateSpeedMarkers(indicatedSpeed);
        this.updateMachSpeed(dTime);
        this.updateSpeedOverride(dTime);
        this.updateVSpeeds();
        this.updateCursor(indicatedSpeed, altitudeAboveGround, lowestSelectableSpeed);
    }
    updateCursor(_indicatedSpeed, _altitudeAboveGround, _vls) {
        if (this.aircraft == Aircraft.AS01B && !this.isHud) {
            if (_indicatedSpeed < _vls && _altitudeAboveGround >= 10) {
                this.cursorSVGShape.setAttribute("stroke", "orange");
                this.cursorSVGShape.setAttribute("stroke-width", "5");
            }
            else {
                this.cursorSVGShape.setAttribute("stroke", "white");
                this.cursorSVGShape.setAttribute("stroke-width", "3");
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
                this.vSpeedSVG.setAttribute("visibility", "visible");
                this.v1Speed.textContent = Simplane.getV1Airspeed().toFixed(0);
                this.vRSpeed.textContent = Simplane.getVRAirspeed().toFixed(0);
                this.v2Speed.textContent = Simplane.getV2Airspeed().toFixed(0);
                this.vXSpeed.textContent = Simplane.getVXAirspeed().toFixed(0);
            }
            else {
                this.vSpeedSVG.setAttribute("visibility", "hidden");
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
    updateMachSpeed(dTime) {
        if (this.machPrefixSVG && this.machValueSVG) {
            var trueMach = Simplane.getMachSpeed();
            this.machSpeed = Utils.SmoothSin(this.machSpeed, trueMach, 0.25, dTime / 1000);
            if (this.machSpeed > 0.998)
                this.machSpeed = 0.998;
            if (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B) {
                if ((!this.machVisible && this.machSpeed >= 0.4) || (this.machVisible && this.machSpeed >= 0.4)) {
                    var fixedMach = this.machSpeed.toFixed(3);
                    var radixPos = fixedMach.indexOf('.');
                    this.machPrefixSVG.textContent = ".";
                    this.machValueSVG.textContent = fixedMach.slice(radixPos + 1);
                    this.machValueSVG.setAttribute("x", "85");
                    this.machVisible = true;
                }
                else {
                    var groundSpeed = Math.round(Simplane.getGroundSpeed());
                    this.machPrefixSVG.textContent = "GS";

                    if (groundSpeed < 10) {
                        this.machValueSVG.textContent = "\xa0\xa0" + Utils.leadingZeros(groundSpeed, 0);
                    }
                    else if (groundSpeed < 100 && groundSpeed >= 10) {
                        this.machValueSVG.textContent = "\xa0" + Utils.leadingZeros(groundSpeed, 0);
                    }  
                    else {
                        this.machValueSVG.textContent = Utils.leadingZeros(groundSpeed, 0);
                    }
                    this.machValueSVG.setAttribute("x", "90");
                    this.machVisible = true;
                }
            }
            else if (this.aircraft == Aircraft.CJ4) {
                if ((!this.machVisible && this.machSpeed >= 0.4) || (this.machVisible && this.machSpeed >= 0.35)) {
                    var fixedMach = this.machSpeed.toFixed(3);
                    var radixPos = fixedMach.indexOf('.');
                    this.machPrefixSVG.textContent = ".";
                    this.machValueSVG.textContent = fixedMach.slice(radixPos + 1);
                    this.machVisible = true;
                }
            }
            else {
                var fixedMach = this.machSpeed.toFixed(3);
                if ((!this.machVisible && this.machSpeed >= 0.5) || (this.machVisible && this.machSpeed >= 0.45)) {
                    var radixPos = fixedMach.indexOf('.');
                    this.machValueSVG.textContent = fixedMach.slice(radixPos + 1);
                    this.machVisible = true;
                }
                else {
                    this.machVisible = false;
                }
            }
        }
        if (this.machVisible) {
            this.machPrefixSVG.setAttribute("visibility", "visible");
            this.machValueSVG.setAttribute("visibility", "visible");
        }
        else {
            this.machPrefixSVG.setAttribute("visibility", "hidden");
            this.machValueSVG.setAttribute("visibility", "hidden");
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
            this.graduationScroller.scroll(_speed);
            var currentVal = this.graduationScroller.firstValue;
            var currentY = this.graduationScrollPosY + this.graduationScroller.offsetY * this.graduationSpacing * (this.nbSecondaryGraduations + 1);
            var startVal = currentVal;
            var startY = currentY;
            for (var i = 0; i < this.totalGraduations; i++) {
                var posX = this.graduationScrollPosX;
                var posY = currentY;
                if ((currentVal < this.graduationMinValue) || (currentVal == this.graduationMinValue && !this.graduations[i].SVGText1)) {
                    this.graduations[i].SVGLine.setAttribute("visibility", "hidden");
                    if (this.graduations[i].SVGText1) {
                        this.graduations[i].SVGText1.setAttribute("visibility", "hidden");
                    }
                }
                else {
                    this.graduations[i].SVGLine.setAttribute("visibility", "visible");
                    this.graduations[i].SVGLine.setAttribute("transform", "translate(" + posX.toString() + " " + posY.toString() + ")");
                    if (this.graduations[i].SVGText1) {
                        if (this.aircraft == Aircraft.CJ4) {
                            if ((currentVal % 4) == 0)
                                this.graduations[i].SVGText1.textContent = currentVal.toString();
                            else
                                this.graduations[i].SVGText1.textContent = "";
                        }
                        else if (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B) {
                            if (currentVal < this.graduationMinValue)
                                this.graduations[i].SVGText1.textContent = "";
                            else
                                this.graduations[i].SVGText1.textContent = currentVal.toString();
                        }
                        else {
                            if (currentVal < this.graduationMinValue)
                                this.graduations[i].SVGText1.textContent = "";
                            else
                                this.graduations[i].SVGText1.textContent = Utils.leadingZeros(currentVal, 3);
                        }
                        this.graduations[i].SVGText1.setAttribute("visibility", "visible");
                        this.graduations[i].SVGText1.setAttribute("transform", "translate(" + posX.toString() + " " + (posY + 2).toString() + ")");
                    }
                }
                if (this.graduations[i].SVGText1)
                    currentVal = this.graduationScroller.nextValue;
                currentY -= this.graduationSpacing;
            }
            if (this.graduationVLine) {
                var factor = 10 / this.graduationScroller.increment;
                var offsetY = (Math.min((startVal - this.graduationMinValue), 0) / 10) * this.graduationSpacing * (this.nbSecondaryGraduations) * factor;
                this.graduationVLine.setAttribute("y1", Math.ceil(startY + offsetY).toString());
                this.graduationVLine.setAttribute("y2", Math.floor(currentY + offsetY).toString());
            }
        }
    }
    updateArcScrolling(_speed) {
        if (this.arcs) {
            var offset = this.arcToSVG(_speed);
            for (var i = 0; i < this.arcs.length; i++) {
                this.arcs[i].setAttribute("transform", "translate(0 " + offset.toString() + ")");
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
                this.cursorIntegrals[0].update(speed, 100, 100);
                this.cursorIntegrals[1].update(speed, 10, 10);
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
                let arrowPath = "M 70 " + arrowBaseY + " L 70 " + arrowTopY.toFixed(1) + " ";
                if (this.aircraft == Aircraft.CJ4) {
                    arrowPath += "L 50 " + arrowTopY.toFixed(1);
                }
                else {
                    if (speedTrend > 0) {
                        arrowPath += "M 62 " + (arrowTopY + 8).toFixed(1) + " L 70 " + arrowTopY.toFixed(1) + " L 78 " + (arrowTopY + 8).toFixed(1);
                    }
                    else {
                        arrowPath += "M 62 " + (arrowTopY - 8).toFixed(1) + " L 70 " + arrowTopY.toFixed(1) + " L 78 " + (arrowTopY - 8).toFixed(1);
                    }
                }
                this.speedTrendArrowSVGShape.setAttribute("d", arrowPath);
                hideArrow = false;
            }
        }
        if (hideArrow) {
            this.speedTrendArrowSVG.setAttribute("visibility", "hidden");
        }
        else {
            this.speedTrendArrowSVG.setAttribute("visibility", "visible");
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
                                this.blueSpeedSVG.setAttribute("visibility", "visible");
                                this.blueSpeedSVG.setAttribute("y", (blueSpeedPosY - blueSpeedHeight * 0.5).toString());
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
                    this.blueSpeedSVG.setAttribute("visibility", "hidden");
                }
                if (this.blueSpeedText) {
                    if (hideBlueText) {
                        this.blueSpeedText.setAttribute("visibility", "hidden");
                    }
                    else {
                        this.blueSpeedText.setAttribute("visibility", "visible");
                        this.blueSpeedText.textContent = this.blueAirspeed.toFixed(0);
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
                            this.redSpeedSVG.setAttribute("visibility", "visible");
                            this.redSpeedSVG.setAttribute("y", (redSpeedPosY - redSpeedHeight * 0.5).toString());
                        }
                        hideRedPointer = false;
                    }
                    else {
                        hideRedText = false;
                    }
                    hudSpeed = this.redAirspeed;
                }
                if (this.redSpeedSVG && hideRedPointer) {
                    this.redSpeedSVG.setAttribute("visibility", "hidden");
                }
                if (this.redSpeedText) {
                    if (hideRedText) {
                        this.redSpeedText.setAttribute("visibility", "hidden");
                    }
                    else {
                        this.redSpeedText.setAttribute("visibility", "visible");
                        this.redSpeedText.textContent = this.redAirspeed.toFixed(0);
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
                            var fixedMach = machAirspeed.toFixed(3);
                            var radixPos = fixedMach.indexOf('.');
                            this.targetSpeedSVG.textContent = fixedMach.slice(radixPos);
                        }
                        else {
                            this.targetSpeedSVG.textContent = machAirspeed.toFixed(1);
                        }
                        target = SimVar.GetGameVarValue("FROM MACH TO KIAS", "number", machAirspeed);
                    }
                    else {
                        target = Simplane.getAutoPilotAirspeedHoldValue();
                        this.targetSpeedSVG.textContent = Utils.leadingZeros(Math.round(this.selectedAirspeed), 3);
                    }
                    if (Math.abs(this.selectedAirspeed - target) < 10)
                        this.selectedAirspeed = Utils.SmoothPow(this.selectedAirspeed, target, 1.1, dTime / 1000);
                    else
                        this.selectedAirspeed = target;
                    if (this.selectedAirspeed >= this.graduationMinValue) {
                        let pointerPosY = this.valueToSvg(currentAirspeed, this.selectedAirspeed);
                        if (pointerPosY > 0) {
                            if (this.targetSpeedPointerSVG) {
                                this.targetSpeedPointerSVG.setAttribute("visibility", "visible");
                                this.targetSpeedPointerSVG.setAttribute("y", (-2 + pointerPosY - this.targetSpeedPointerHeight * 0.5).toString());
                            }
                            hidePointer = false;
                        }
                        hudSpeed = this.selectedAirspeed;
                        hideText = false;
                    }
                    else {
                        this.targetSpeedSVG.textContent = "";
                    }
                }
                else {
                    this.selectedAirspeed = -1;
                    this.targetSpeedSVG.textContent = "";
                }
            }
            if (this.targetSpeedPointerSVG && hidePointer)
                this.targetSpeedPointerSVG.setAttribute("visibility", "hidden");
            if (this.targetSpeedBgSVG)
                this.targetSpeedBgSVG.classList.toggle('hide', hideText);
            if (this.targetSpeedIconSVG)
                this.targetSpeedIconSVG.classList.toggle('hide', hideText);
            if (Simplane.getIsGrounded() && Simplane.getV1Airspeed() <= 0 && Simplane.getVRAirspeed() <= 0 && Simplane.getV2Airspeed() <= 0) {
                takeOffSpeedNotSet = true;
            }
        }
        if (this.speedNotSetSVG) {
            this.speedNotSetSVG.setAttribute("visibility", (takeOffSpeedNotSet) ? "visible" : "hidden");
        }
        if (this.hudAPSpeed != hudSpeed) {
            this.hudAPSpeed = Math.round(hudSpeed);
            SimVar.SetSimVarValue("L:HUD_AP_SELECTED_SPEED", "Number", this.hudAPSpeed);
        }
    }
    updateNextFlapSpeedIndicator(currentAirspeed, nextFlapSpeed) {
        if (this.nextFlapSVG) {
            let hidePointer = true;
            if (nextFlapSpeed > this.graduationMinValue) {
                var nextFlapSpeedPosY = this.valueToSvg(currentAirspeed, nextFlapSpeed);
                var nextFlapSpeedHeight = 20;
                if (nextFlapSpeedPosY > 0) {
                    this.nextFlapSVG.setAttribute("y", (nextFlapSpeedPosY - nextFlapSpeedHeight * 0.5).toString());
                    hidePointer = false;
                }
            }
            if (hidePointer) {
                this.nextFlapSVG.setAttribute("visibility", "hidden");
            }
            else {
                this.nextFlapSVG.setAttribute("visibility", "visible");
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
                    this.greenDotSVG.setAttribute("y", (greenDotPosY - greenDotHeight * 0.5).toString());
                    hidePointer = false;
                }
            }
            if (hidePointer) {
                this.greenDotSVG.setAttribute("visibility", "hidden");
            }
            else {
                this.greenDotSVG.setAttribute("visibility", "visible");
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
                        _strip.setAttribute("transform", "translate(" + this.stripOffsetX + " " + vPosY + ")");
                        hideStrip = false;
                    }
                }
            }
            if (hideStrip) {
                _strip.setAttribute("visibility", "hidden");
            }
            else {
                _strip.setAttribute("visibility", "visible");
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
                _marker.svg.setAttribute("y", (posY - this.speedMarkersHeight * 0.5).toString());
                _marker.svg.setAttribute("visibility", "visible");
                hideMarker = false;
            }
        }
        if (hideMarker)
            _marker.svg.setAttribute("visibility", "hidden");
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
                _marker.svg.setAttribute("y", (posY - this.speedMarkersHeight * 0.5).toString());
                _marker.svg.setAttribute("visibility", "visible");
                hideMarker = false;
            }
        }
        if (hideMarker)
            _marker.svg.setAttribute("visibility", "hidden");
    }
    updateMarkerV1(_marker, currentAirspeed) {
        let v1Speed = Simplane.getV1Airspeed();
        if (v1Speed > 0) {
            _marker.engaged = true;
        }
        else if (_marker.engaged && !_marker.passed) {
            v1Speed = SimVar.GetSimVarValue("L:AIRLINER_V1_SPEED", "Knots");
        }
        if (v1Speed > 0 && Simplane.getIsGrounded()) {
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
            _marker.svg.setAttribute("y", (posY - this.speedMarkersHeight * 0.5).toString());
            _marker.svg.setAttribute("visibility", "visible");
        }
        else {
            _marker.svg.setAttribute("visibility", "hidden");
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
        if (vRSpeed > 0 && Simplane.getIsGrounded()) {
            var posY = this.valueToSvg(currentAirspeed, vRSpeed);
            if (posY >= this.refHeight + 25) {
                _marker.passed = true;
            }
            _marker.svg.setAttribute("y", (posY - this.speedMarkersHeight * 0.5).toString());
            _marker.svg.setAttribute("visibility", "visible");
        }
        else {
            _marker.svg.setAttribute("visibility", "hidden");
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
            _marker.svg.setAttribute("y", (posY - this.speedMarkersHeight * 0.5).toString());
            _marker.svg.setAttribute("visibility", "visible");
        }
        else {
            _marker.svg.setAttribute("visibility", "hidden");
        }
    }
    updateMarkerVRef(_marker, currentAirspeed) {
        let vRefSpeed = SimVar.GetSimVarValue("L:AIRLINER_VREF_SPEED", "Knots");
        if (vRefSpeed > 0) {
            var posY = this.valueToSvg(currentAirspeed, vRefSpeed);
            if (posY > this.refHeight - 25 && (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B)) {
                posY = this.refHeight - 45;
                _marker.setOffscreen(true, Math.round(vRefSpeed));
            }
            else {
                _marker.setOffscreen(false);
            }
            _marker.svg.setAttribute("y", (posY - this.speedMarkersHeight * 0.5).toString());
            _marker.svg.setAttribute("visibility", "visible");
        }
        else {
            _marker.svg.setAttribute("visibility", "hidden");
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
            _marker.svg.setAttribute("y", (posY - this.speedMarkersHeight * 0.5).toString());
            _marker.svg.setAttribute("visibility", "visible");
        }
        else {
            _marker.svg.setAttribute("visibility", "hidden");
        }
    }
    updateMarkerFlap(_marker, currentAirspeed) {
        let hideMarker = true;
        let phase = Simplane.getCurrentFlightPhase();
        let flapsHandleIndex = Simplane.getFlapsHandleIndex();
        let markerHandleIndex = _marker.params[0];
        let altitude = Simplane.getAltitude();
        if (phase >= FlightPhase.FLIGHT_PHASE_TAKEOFF && altitude < 20000) {
            if (markerHandleIndex == flapsHandleIndex) {
                hideMarker = false;
            }
            if (phase == FlightPhase.FLIGHT_PHASE_CLIMB || phase == FlightPhase.FLIGHT_PHASE_CRUISE || phase == FlightPhase.FLIGHT_PHASE_TAKEOFF) {
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
            if (markerHandleIndex == 0) {
                _marker.setText("UP");
            }
            else {
                let degrees = 0;
                if (this.gps.cockpitSettings && this.gps.cockpitSettings.FlapsLevels.initialised) {
                    degrees = this.gps.cockpitSettings.FlapsLevels.flapsAngle[markerHandleIndex];
                }
                else {
                    degrees = Simplane.getFlapsHandleAngle(markerHandleIndex);
                }
                _marker.setText(degrees.toFixed(0));
            }
            let vRef25 = SimVar.GetSimVarValue("L:SALTY_VREF25", "knots");
            let vRef30 = SimVar.GetSimVarValue("L:SALTY_VREF30", "knots");
            let flapMarkerSpeed = 0;
            switch (markerHandleIndex) {
                case 0:
                    flapMarkerSpeed = vRef30 + 80;
                    break;
                case 1:
                    flapMarkerSpeed = vRef30 + 60;
                    break;
                case 2:
                    flapMarkerSpeed = vRef30 + 40;
                    break;   
                case 3:
                    flapMarkerSpeed = vRef30 + 20;
                    break;   
                case 4:
                    flapMarkerSpeed = vRef30 + 10;
                    break;   
                case 5:
                    flapMarkerSpeed = vRef25;
                    break;
                case 6:
                    flapMarkerSpeed = vRef30;
                    break;         
            }
            var posY = this.valueToSvg(currentAirspeed, flapMarkerSpeed);
            _marker.svg.setAttribute("y", (posY - this.speedMarkersHeight * 0.5).toString());
            _marker.svg.setAttribute("visibility", "visible");
        }
        else {
            _marker.svg.setAttribute("visibility", "hidden");
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
        this.textSVG.textContent = _text;
    }
    setOffscreen(_offscreen, _speed = 0) {
        if (_offscreen) {
            this.lineSVG.setAttribute("visibility", "hidden");
            this.offscreenSVG.removeAttribute("visibility");
            this.offscreenSVG.textContent = _speed.toString();
        }
        else {
            this.lineSVG.removeAttribute("visibility");
            this.offscreenSVG.setAttribute("visibility", "hidden");
        }
    }
}
//# sourceMappingURL=AirspeedIndicator.js.map