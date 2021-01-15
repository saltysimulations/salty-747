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
        if (this.aircraft == Aircraft.B747_8) {
            this.construct_B747_8();
        }
    }
    construct_B747_8() {
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        this.rootSVG.setAttribute("id", "ViewBox");
        this.rootSVG.setAttribute("viewBox", "0 0 250 800");
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
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 55, 1, 10, 1000));
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 55, 1, 10, 100));
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 55, 1, 10, 10));
        this.cursorDecimals = new Avionics.AltitudeScroller(5, 32, 20, 100);
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.rootGroup.setAttribute("id", "Altimeter");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        var sideTextHeight = 70;
        posY += sideTextHeight * 0.5;
        this.targetAltitudeTextSVG1 = document.createElementNS(Avionics.SVG.NS, "text");
        this.targetAltitudeTextSVG1.setAttribute("x", "115");
        this.targetAltitudeTextSVG1.setAttribute("y", (posY + sideTextHeight * 0.5).toString());
        this.targetAltitudeTextSVG1.setAttribute("fill", "#D570FF");
        this.targetAltitudeTextSVG1.setAttribute("font-size", (this.fontSize * 1.8).toString());
        this.targetAltitudeTextSVG1.setAttribute("font-family", "BoeingEICAS");
        this.targetAltitudeTextSVG1.setAttribute("text-anchor", "end");
        this.targetAltitudeTextSVG1.setAttribute("alignment-baseline", "bottom");
        this.targetAltitudeTextSVG1.style.letterSpacing = "3px";
        this.rootGroup.appendChild(this.targetAltitudeTextSVG1);
        this.targetAltitudeTextSVG2 = document.createElementNS(Avionics.SVG.NS, "text");
        this.targetAltitudeTextSVG2.setAttribute("x", "117");
        this.targetAltitudeTextSVG2.setAttribute("y", (posY + sideTextHeight * 0.5).toString());
        this.targetAltitudeTextSVG2.setAttribute("width", width.toString());
        this.targetAltitudeTextSVG2.setAttribute("fill", "#D570FF");
        this.targetAltitudeTextSVG2.setAttribute("font-size", (this.fontSize * 1.45).toString());
        this.targetAltitudeTextSVG2.setAttribute("font-family", "BoeingEICAS");
        this.targetAltitudeTextSVG2.setAttribute("text-anchor", "start");
        this.targetAltitudeTextSVG2.setAttribute("alignment-baseline", "bottom");
        this.targetAltitudeTextSVG2.style.letterSpacing = "3px";
        this.rootGroup.appendChild(this.targetAltitudeTextSVG2);
        posY += sideTextHeight * 0.835;
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
            var _left = 20;
            var _width = width;
            var _height = height;
            var bg = document.createElementNS(Avionics.SVG.NS, "rect");
            bg.setAttribute("x", _left.toString());
            bg.setAttribute("y", _top.toString());
            bg.setAttribute("width", _width.toString());
            bg.setAttribute("height", _height.toString());
            bg.setAttribute("fill", "#343B51");
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
                line.SVGLine.setAttribute("x", "0");
                line.SVGLine.setAttribute("width", lineWidth.toString());
                line.SVGLine.setAttribute("height", lineHeight.toString());
                line.SVGLine.setAttribute("fill", "white");
                this.centerSVG.appendChild(line.SVGLine);
                if (line.IsPrimary) {
                    var xPos = lineWidth + 40;
                    line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                    line.SVGText1.setAttribute("x", xPos.toString());
                    line.SVGText1.setAttribute("y", "10");
                    line.SVGText1.setAttribute("fill", "white");
                    line.SVGText1.setAttribute("font-size", (this.fontSize * 1.15).toString());
                    line.SVGText1.setAttribute("font-family", "BoeingEICAS");
                    line.SVGText1.setAttribute("text-anchor", "end");
                    line.SVGText1.setAttribute("alignment-baseline", "bottom");
                    this.centerSVG.appendChild(line.SVGText1);
                    line.SVGText2 = document.createElementNS(Avionics.SVG.NS, "text");
                    line.SVGText2.setAttribute("x", xPos.toString());
                    line.SVGText2.setAttribute("y", "10");
                    line.SVGText2.setAttribute("fill", "white");
                    line.SVGText2.setAttribute("font-size", (this.fontSize * 0.85).toString());
                    line.SVGText2.setAttribute("font-family", "BoeingEICAS");
                    line.SVGText2.setAttribute("text-anchor", "start");
                    line.SVGText2.setAttribute("alignment-baseline", "bottom");
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
                this.groundRibbonSVG.setAttribute("id", "GroundRibbonGroup");
            }
            else
                Utils.RemoveAllChildren(this.groundRibbonSVG);
            this.groundRibbonSVG.setAttribute("x", groundRibbonPosX.toString());
            this.groundRibbonSVG.setAttribute("y", groundRibbonPosY.toString());
            this.groundRibbonSVG.setAttribute("width", groundRibbonWidth.toString());
            this.groundRibbonSVG.setAttribute("height", groundRibbonHeight.toString());
            this.groundRibbonSVG.setAttribute("viewBox", "0 0 " + groundRibbonWidth + " " + groundRibbonHeight);
            {
                var dashHeight = 5;
                var dashEndPos = _height;
                var dashPos = -100;
                while (dashPos < (dashEndPos - dashHeight * 2)) {
                    let dashLine = document.createElementNS(Avionics.SVG.NS, "rect");
                    dashLine.setAttribute("x", "0");
                    dashLine.setAttribute("y", dashPos.toString());
                    dashLine.setAttribute("width", groundRibbonWidth.toString());
                    dashLine.setAttribute("height", dashHeight.toString());
                    dashLine.setAttribute("transform", "skewY(45)");
                    dashLine.setAttribute("fill", "orange");
                    this.groundRibbonSVG.appendChild(dashLine);
                    dashPos += dashHeight * 2;
                }
                if (!this.groundRibbonSVGShape)
                    this.groundRibbonSVGShape = document.createElementNS(Avionics.SVG.NS, "rect");
                this.groundRibbonSVGShape.setAttribute("fill", "orange");
                this.groundRibbonSVGShape.setAttribute("stroke", "orange");
                this.groundRibbonSVGShape.setAttribute("stroke-width", "2");
                this.groundRibbonSVGShape.setAttribute("width", groundRibbonWidth.toString());
                this.groundRibbonSVGShape.setAttribute("height", "5");
                this.groundRibbonSVGShape.setAttribute("x", "0");
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
                this.groundLineSVG.setAttribute("id", "GroundLineGroup");
            }
            else
                Utils.RemoveAllChildren(this.groundLineSVG);
            this.groundLineSVG.setAttribute("x", groundStripPosX.toString());
            this.groundLineSVG.setAttribute("y", groundStripPosY.toString());
            this.groundLineSVG.setAttribute("width", groundStripWidth.toString());
            this.groundLineSVG.setAttribute("height", this.groundLineSVGHeight.toString());
            this.groundLineSVG.setAttribute("viewBox", "0 0 " + groundStripWidth + " " + this.groundLineSVGHeight);
            {
                let whiteLine = document.createElementNS(Avionics.SVG.NS, "rect");
                whiteLine.setAttribute("fill", "white");
                whiteLine.setAttribute("x", "0");
                whiteLine.setAttribute("y", "0");
                whiteLine.setAttribute("width", "5");
                whiteLine.setAttribute("height", singleLineHeight.toString());
                this.groundLineSVG.appendChild(whiteLine);
                let amberLine = document.createElementNS(Avionics.SVG.NS, "rect");
                amberLine.setAttribute("fill", "orange");
                amberLine.setAttribute("x", "0");
                amberLine.setAttribute("y", singleLineHeight.toString());
                amberLine.setAttribute("width", "5");
                amberLine.setAttribute("height", singleLineHeight.toString());
                this.groundLineSVG.appendChild(amberLine);
            }
            this.centerSVG.appendChild(this.groundLineSVG);
            this.thousandIndicator = document.createElementNS(Avionics.SVG.NS, "g");
            this.thousandIndicator.setAttribute("id", "thousandGroup");
            {
                let topLine = document.createElementNS(Avionics.SVG.NS, "line");
                topLine.setAttribute("x1", (_left + 5).toString());
                topLine.setAttribute("y1", "-18");
                topLine.setAttribute("x2", _width.toString());
                topLine.setAttribute("y2", "-18");
                topLine.setAttribute("stroke", "white");
                topLine.setAttribute("stroke-width", "3");
                this.thousandIndicator.appendChild(topLine);
                let bottomLine = document.createElementNS(Avionics.SVG.NS, "line");
                bottomLine.setAttribute("x1", (_left + 5).toString());
                bottomLine.setAttribute("y1", "18");
                bottomLine.setAttribute("x2", _width.toString());
                bottomLine.setAttribute("y2", "18");
                bottomLine.setAttribute("stroke", "white");
                bottomLine.setAttribute("stroke-width", "3");
                this.thousandIndicator.appendChild(bottomLine);
            }
            this.centerSVG.appendChild(this.thousandIndicator);
            var targetAltitudeIndicatorWidth = 100;
            var targetAltitudeIndicatorHeight = 100;
            var targetAltitudeIndicatorPosX = 0;
            if (!this.targetAltitudeIndicatorSVG) {
                this.targetAltitudeIndicatorSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                this.targetAltitudeIndicatorSVG.setAttribute("id", "TargetAltitudeIndicator");
            }
            else
                Utils.RemoveAllChildren(this.targetAltitudeIndicatorSVG);
            this.targetAltitudeIndicatorSVG.setAttribute("x", targetAltitudeIndicatorPosX.toString());
            this.targetAltitudeIndicatorSVG.setAttribute("width", targetAltitudeIndicatorWidth.toString());
            this.targetAltitudeIndicatorSVG.setAttribute("height", targetAltitudeIndicatorHeight.toString());
            this.targetAltitudeIndicatorSVG.setAttribute("viewBox", "0 0 100 100");
            {
                if (!this.targetAltitudeIndicatorSVGShape)
                    this.targetAltitudeIndicatorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                this.targetAltitudeIndicatorSVGShape.setAttribute("fill", "none");
                this.targetAltitudeIndicatorSVGShape.setAttribute("stroke", "#D570FF");
                this.targetAltitudeIndicatorSVGShape.setAttribute("stroke-width", "3");
                this.targetAltitudeIndicatorSVGShape.setAttribute("d", "M 10 10 L 50 10 L 50 90 L 10 90 L 10 60 L 18 50 L 10 40 Z");
                this.targetAltitudeIndicatorSVG.appendChild(this.targetAltitudeIndicatorSVGShape);
            }
            this.centerSVG.appendChild(this.targetAltitudeIndicatorSVG);
            var cursorPosX = _left + 15;
            var cursorPosY = _top + _height * 0.5 + 2;
            var cursorWidth = width + arcWidth;
            var cursorHeight = 80;
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
            this.cursorSVG.setAttribute("viewBox", "0 0 " + cursorWidth + " " + cursorHeight);
            {
                var _cursorPosX = 21;
                var _cursorPosY = cursorHeight * 0.5;
                if (!this.cursorSVGShape)
                    this.cursorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                this.cursorSVGShape.setAttribute("fill", "black");
                this.cursorSVGShape.setAttribute("d", "M 15 0 L 130 0 L 130 80 L 15 80 L 15 53 L 0 40 L 15 27 Z");
                this.cursorSVGShape.setAttribute("stroke", "white");
                this.cursorSVGShape.setAttribute("stroke-width", this.strokeSize);
                this.cursorSVG.appendChild(this.cursorSVGShape);
                this.cursorIntegrals[0].construct(this.cursorSVG, _cursorPosX + 22, _cursorPosY + 2, _width, "BoeingEICAS", this.fontSize * 1.8, "white");
                this.cursorIntegrals[1].construct(this.cursorSVG, _cursorPosX + 47, _cursorPosY + 2, _width, "BoeingEICAS", this.fontSize * 1.8, "white");
                this.cursorIntegrals[2].construct(this.cursorSVG, _cursorPosX + 69, _cursorPosY + 2, _width, "BoeingEICAS", this.fontSize * 1.4, "white");
                this.cursorDecimals.construct(this.cursorSVG, _cursorPosX + 104, _cursorPosY + 2, _width, "BoeingEICAS", this.fontSize * 1.4, "white");
                if (!this.cursorSVGAltitudeLevelShape)
                    this.cursorSVGAltitudeLevelShape = document.createElementNS(Avionics.SVG.NS, "rect");
                this.cursorSVGAltitudeLevelShape.setAttribute("fill", "#24F000");
                this.cursorSVGAltitudeLevelShape.setAttribute("x", "23");
                this.cursorSVGAltitudeLevelShape.setAttribute("y", ((cursorHeight * 0.57) * 0.5).toString());
                this.cursorSVGAltitudeLevelShape.setAttribute("width", "20");
                this.cursorSVGAltitudeLevelShape.setAttribute("height", (cursorHeight * 0.43).toString());
                this.cursorSVG.appendChild(this.cursorSVGAltitudeLevelShape);
            }
            this.centerSVG.appendChild(this.cursorSVG);
        }
        this.rootGroup.appendChild(this.centerSVG);
        let mtrsGroup = document.createElementNS(Avionics.SVG.NS, "g");
        mtrsGroup.setAttribute("id", "MetersGroup");
        {
            this.mtrsSelectedGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.mtrsSelectedGroup.setAttribute("id", "SelectedGroup");
            {
                this.mtrsSelectedSVGText = document.createElementNS(Avionics.SVG.NS, "text");
                this.mtrsSelectedSVGText.setAttribute("x", "158");
                this.mtrsSelectedSVGText.setAttribute("y", (sideTextHeight * 0.5).toString());
                this.mtrsSelectedSVGText.setAttribute("fill", "#D570FF");
                this.mtrsSelectedSVGText.setAttribute("font-size", (this.fontSize * 1.2).toString());
                this.mtrsSelectedSVGText.setAttribute("font-family", "BoeingEICAS");
                this.mtrsSelectedSVGText.setAttribute("text-anchor", "end");
                this.mtrsSelectedSVGText.setAttribute("alignment-baseline", "bottom");
                this.mtrsSelectedGroup.appendChild(this.mtrsSelectedSVGText);
                var mtrsSelectedSVGUnit = document.createElementNS(Avionics.SVG.NS, "text");
                mtrsSelectedSVGUnit.textContent = "M";
                mtrsSelectedSVGUnit.setAttribute("x", "158");
                mtrsSelectedSVGUnit.setAttribute("y", (sideTextHeight * 0.5).toString());
                mtrsSelectedSVGUnit.setAttribute("fill", "cyan");
                mtrsSelectedSVGUnit.setAttribute("font-size", (this.fontSize * 0.9).toString());
                mtrsSelectedSVGUnit.setAttribute("font-family", "BoeingEICAS");
                mtrsSelectedSVGUnit.setAttribute("text-anchor", "start");
                mtrsSelectedSVGUnit.setAttribute("alignment-baseline", "bottom");
                this.mtrsSelectedGroup.appendChild(mtrsSelectedSVGUnit);
            }
            mtrsGroup.appendChild(this.mtrsSelectedGroup);
            var mtrsCursorPosX = _left + 62.5;
            var mtrsCursorPosY = _top + _height * 0.558;
            var mtrsCursorWidth = width + arcWidth;
            var mtrsCursorHeight = 36;
            this.mtrsCursorGroup = document.createElementNS(Avionics.SVG.NS, "svg");
            this.mtrsCursorGroup.setAttribute("id", "MetersCursorGroup");
            this.mtrsCursorGroup.setAttribute("x", mtrsCursorPosX.toString());
            this.mtrsCursorGroup.setAttribute("y", (mtrsCursorPosY - mtrsCursorHeight * 0.5).toString());
            this.mtrsCursorGroup.setAttribute("width", mtrsCursorWidth.toString());
            this.mtrsCursorGroup.setAttribute("height", mtrsCursorHeight.toString());
            this.mtrsCursorGroup.setAttribute("viewBox", "0 0 " + mtrsCursorWidth + " " + mtrsCursorHeight);
            {
                var mtrsCursorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                mtrsCursorSVGShape.setAttribute("fill", "black");
                mtrsCursorSVGShape.setAttribute("d", "M 15 0 L 130 0 L 130 36 L 15 36 Z");
                mtrsCursorSVGShape.setAttribute("stroke", "white");
                mtrsCursorSVGShape.setAttribute("stroke-width", this.strokeSize);
                this.mtrsCursorGroup.appendChild(mtrsCursorSVGShape);
                this.mtrsCursorSVGText = document.createElementNS(Avionics.SVG.NS, "text");
                this.mtrsCursorSVGText.setAttribute("x", "95");
                this.mtrsCursorSVGText.setAttribute("y", (mtrsCursorHeight * 0.84).toString());
                this.mtrsCursorSVGText.setAttribute("fill", "white");
                this.mtrsCursorSVGText.setAttribute("font-size", (this.fontSize * 1.2).toString());
                this.mtrsCursorSVGText.setAttribute("font-family", "BoeingEICAS");
                this.mtrsCursorSVGText.setAttribute("text-anchor", "end");
                this.mtrsCursorSVGText.setAttribute("alignment-baseline", "bottom");
                this.mtrsCursorGroup.appendChild(this.mtrsCursorSVGText);
                let mtrsCursorSVGUnit = document.createElementNS(Avionics.SVG.NS, "text");
                mtrsCursorSVGUnit.textContent = "M";
                mtrsCursorSVGUnit.setAttribute("x", "100");
                mtrsCursorSVGUnit.setAttribute("y", (mtrsCursorHeight * 0.84).toString());
                mtrsCursorSVGUnit.setAttribute("fill", "cyan");
                mtrsCursorSVGUnit.setAttribute("font-size", (this.fontSize * 0.9).toString());
                mtrsCursorSVGUnit.setAttribute("font-family", "BoeingEICAS");
                mtrsCursorSVGUnit.setAttribute("text-anchor", "start");
                mtrsCursorSVGUnit.setAttribute("alignment-baseline", "bottom");
                this.mtrsCursorGroup.appendChild(mtrsCursorSVGUnit);
            }
            mtrsGroup.appendChild(this.mtrsCursorGroup);
        }
        this.rootGroup.appendChild(mtrsGroup);
        if (!this.minimumReferenceModeText) {
            this.minimumReferenceModeText = document.createElementNS(Avionics.SVG.NS, "text");
        }
        this.minimumReferenceModeText.textContent = "BARO";
        this.minimumReferenceModeText.setAttribute("x", "60");
        this.minimumReferenceModeText.setAttribute("y", (posY + height - 15).toString());
        this.minimumReferenceModeText.setAttribute("fill", (this.isHud) ? "lime" : "#24F000");
        this.minimumReferenceModeText.setAttribute("font-size", (this.fontSize).toString());
        this.minimumReferenceModeText.setAttribute("font-family", "BoeingEICAS");
        this.minimumReferenceModeText.setAttribute("text-anchor", "end");
        this.rootGroup.appendChild(this.minimumReferenceModeText);
        if (!this.minimumReferenceValueText) {
            this.minimumReferenceValueText = document.createElementNS(Avionics.SVG.NS, "text");
        }
        this.minimumReferenceValueText.textContent = "210";
        this.minimumReferenceValueText.setAttribute("x", "38");
        this.minimumReferenceValueText.setAttribute("y", (posY + height + 15).toString());
        this.minimumReferenceValueText.setAttribute("fill", (this.isHud) ? "lime" : "#24F000");
        this.minimumReferenceValueText.setAttribute("font-size", (this.fontSize * 1.2).toString());
        this.minimumReferenceValueText.setAttribute("font-family", "BoeingEICAS");
        this.minimumReferenceValueText.setAttribute("text-anchor", "middle");
        this.rootGroup.appendChild(this.minimumReferenceValueText);
        if (!this.minimumReferenceCursor) {
            this.minimumReferenceCursor = document.createElementNS(Avionics.SVG.NS, "path");
        }
        this.minimumReferenceCursor.setAttribute("fill", "none");
        this.minimumReferenceCursor.setAttribute("d", "M 25 0 L 2 25 L 2 -25 L 25 0 L 120 0");
        this.minimumReferenceCursor.setAttribute("stroke", (this.isHud) ? "lime" : "#24F000");
        this.minimumReferenceCursor.setAttribute("stroke-width", this.strokeSize);
        this.centerSVG.appendChild(this.minimumReferenceCursor);
        if (!this.pressureSVG)
            this.pressureSVG = document.createElementNS(Avionics.SVG.NS, "text");
        this.pressureSVG.textContent = "";
        this.pressureSVG.setAttribute("x", "170");
        this.pressureSVG.setAttribute("y", (posY + height + sideTextHeight * 0.5).toString());
        this.pressureSVG.setAttribute("fill", "#24F000");
        this.pressureSVG.setAttribute("font-size", (this.fontSize * 1.0).toString());
        this.pressureSVG.setAttribute("font-family", "BoeingEICAS");
        this.pressureSVG.setAttribute("text-anchor", "end");
        this.pressureSVG.setAttribute("alignment-baseline", "central");
        this.rootGroup.appendChild(this.pressureSVG);
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    update(_dTime) {
        let indicatedAltitude = Simplane.getAltitude();
        var groundReference = indicatedAltitude - Simplane.getAltitudeAboveGround();
        var baroMode = Simplane.getPressureSelectedMode(this.aircraft);
        var selectedAltitude;
        if (this.aircraft === Aircraft.AS01B || this.aircraft === Aircraft.B747_8) {
            selectedAltitude = Math.max(0, Simplane.getAutoPilotDisplayedAltitudeLockValue());
        }
        else {
            selectedAltitude = Math.max(0, Simplane.getAutoPilotAltitudeLockValue());
        }
        this.updateGraduationScrolling(indicatedAltitude);
        this.updateCursorScrolling(indicatedAltitude);
        this.updateGroundReference(indicatedAltitude, groundReference);
        this.updateTargetAltitude(indicatedAltitude, selectedAltitude, baroMode);
        this.updateBaroPressure(baroMode);
        this.updateMtrs(indicatedAltitude, selectedAltitude);
        this.updateMinimumReference(indicatedAltitude, this.minimumReferenceValue, Simplane.getMinimumReferenceMode());
    }
    updateMtrs(_altitude, _selected) {
        if (this.mtrsVisible) {
            if (this.mtrsSelectedGroup) {
                var APMode = this.getAutopilotMode();
                if (APMode != AutopilotMode.MANAGED) {
                    let meters = Math.round(_selected * 0.3048);
                    this.mtrsSelectedSVGText.textContent = meters.toString();
                    this.mtrsSelectedGroup.setAttribute("visibility", "visible");
                }
                else {
                    this.mtrsSelectedGroup.setAttribute("visibility", "hidden");
                }
            }
            if (this.mtrsCursorGroup) {
                let meters = Math.round(_altitude * 0.3048);
                this.mtrsCursorSVGText.textContent = meters.toString();
                this.mtrsCursorGroup.setAttribute("visibility", "visible");
            }
        }
        else {
            if (this.mtrsSelectedGroup)
                this.mtrsSelectedGroup.setAttribute("visibility", "hidden");
            if (this.mtrsCursorGroup)
                this.mtrsCursorGroup.setAttribute("visibility", "hidden");
        }
    }
    updateBaroPressure(_mode) {
        if (this.pressureSVG) {
            var units = Simplane.getPressureSelectedUnits();
            var pressure = Simplane.getPressureValue(units);
            if (_mode == "STD") {
                this.pressureSVG.textContent = "STD";
                this.pressureSVG.setAttribute("x", "150");
                this.pressureSVG.setAttribute("font-size", "42");
            }
            else {
                if (this.aircraft == Aircraft.A320_NEO) {
                    if (_mode == "QFE") {
                        this.pressureSVG.textContent = "QFE ";
                    }
                    else {
                        this.pressureSVG.textContent = "QNH ";
                    }
                    if (units == "millibar") {
                        this.pressureSVG.textContent += pressure.toFixed(0);
                    }
                    else {
                        this.pressureSVG.textContent += pressure.toFixed(2);
                    }
                }
                else if (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B) {
                    if (units == "millibar") {
                        this.pressureSVG.textContent = pressure.toFixed(0) + " HPA";
                        this.pressureSVG.setAttribute("x", "170");
                        this.pressureSVG.setAttribute("font-size", "25");
                    }
                    else {
                        this.pressureSVG.textContent = pressure.toFixed(2) + " IN";
                        this.pressureSVG.setAttribute("x", "170");
                        this.pressureSVG.setAttribute("font-size", "25");
                    }
                }
                else {
                    if (units == "millibar") {
                        this.pressureSVG.textContent = pressure.toFixed(0) + " Hpa";
                    }
                    else {
                        this.pressureSVG.textContent = pressure.toFixed(2) + " inHg";
                    }
                }
            }
        }
    }
    updateGraduationScrolling(_altitude) {
        let showThousandIndicator = false;
        if (this.graduations) {
            this.graduationScroller.scroll(_altitude);
            var currentVal = this.graduationScroller.firstValue;
            var currentY = this.graduationScrollPosY + this.graduationScroller.offsetY * this.graduationSpacing * (this.nbSecondaryGraduations + 1);
            for (var i = 0; i < this.totalGraduations; i++) {
                var posX = this.graduationScrollPosX;
                var posY = currentY;
                this.graduations[i].SVGLine.setAttribute("transform", "translate(" + posX.toString() + " " + posY.toString() + ")");
                if (this.graduations[i].SVGText1) {
                    var roundedVal = 0;
                    var divider = 100;
                    if (this.aircraft == Aircraft.CJ4) {
                        roundedVal = Math.floor(Math.abs(currentVal));
                        let mod = roundedVal % 1000;
                        if (mod != 0)
                            roundedVal = mod;
                    }
                    else if (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B) {
                        roundedVal = Math.floor(Math.abs(currentVal));
                        divider = 1000;
                    }
                    else {
                        roundedVal = Math.floor(Math.abs(currentVal) / 100);
                    }
                    if (!this.graduations[i].SVGText2) {
                        this.graduations[i].SVGText1.textContent = Utils.leadingZeros(roundedVal, 3);
                    }
                    else {
                        var integral = Math.floor(roundedVal / divider);
                        var modulo = Math.floor(roundedVal - (integral * divider));
                        if (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B)
                            this.graduations[i].SVGText1.textContent = (integral > 0) ? integral.toString() : "";
                        else
                            this.graduations[i].SVGText1.textContent = integral.toString();
                        if (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B)
                            this.graduations[i].SVGText2.textContent = Utils.leadingZeros(modulo, 3);
                        else
                            this.graduations[i].SVGText2.textContent = Utils.leadingZeros(modulo, 2);
                    }
                    this.graduations[i].SVGText1.setAttribute("transform", "translate(" + posX.toString() + " " + posY.toString() + ")");
                    if (this.graduations[i].SVGText2)
                        this.graduations[i].SVGText2.setAttribute("transform", "translate(" + posX.toString() + " " + posY.toString() + ")");
                    if (this.thousandIndicator && (currentVal % 1000) == 0) {
                        this.thousandIndicator.setAttribute("transform", "translate(" + posX.toString() + " " + posY.toString() + ")");
                        showThousandIndicator = true;
                    }
                    currentVal = this.graduationScroller.nextValue;
                }
                currentY -= this.graduationSpacing;
            }
        }
        if (this.thousandIndicator)
            this.thousandIndicator.setAttribute("visibility", (showThousandIndicator) ? "visible" : "hidden");
    }
    updateCursorScrolling(_altitude) {
        if (this.cursorIntegrals) {
            let hideZeros = (this.aircraft == Aircraft.A320_NEO) ? true : false;
            this.cursorIntegrals[0].update(_altitude, 10000, (hideZeros) ? 10000 : undefined);
            this.cursorIntegrals[1].update(_altitude, 1000, (hideZeros) ? 1000 : undefined);
            this.cursorIntegrals[2].update(_altitude, 100);
        }
        if (this.cursorDecimals) {
            this.cursorDecimals.update(_altitude);
        }
        if (this.cursorSVGAltitudeLevelShape)
            this.cursorSVGAltitudeLevelShape.classList.toggle('hide', _altitude >= 10000);
    }
    valueToSvg(current, target) {
        var _top = 0;
        var _height = this.refHeight;
        let deltaValue = current - target;
        let deltaSVG = deltaValue * this.graduationSpacing * (this.nbSecondaryGraduations + 1) / this.graduationScroller.increment;
        var posY = _top + _height * 0.5 + deltaSVG;
        return posY;
    }
    updateGroundReference(currentAltitude, groundReference) {
        var currentY = this.valueToSvg(currentAltitude, groundReference);
        if (this.groundRibbonSVG && this.groundRibbonSVGShape) {
            var rectHeight = (this.refHeight - currentY - this.borderSize);
            if (rectHeight > 0) {
                this.groundRibbonSVG.setAttribute("visibility", "visible");
                this.groundRibbonSVG.setAttribute("y", currentY.toString());
                if (!this.groundRibbonHasFixedHeight)
                    this.groundRibbonSVGShape.setAttribute("height", rectHeight.toString());
            }
            else {
                this.groundRibbonSVG.setAttribute("visibility", "hidden");
            }
        }
        if (this.groundLineSVG) {
            if (currentY > 0) {
                this.groundLineSVG.setAttribute("visibility", "visible");
                this.groundLineSVG.setAttribute("y", (currentY - this.groundLineSVGHeight).toString());
            }
            else {
                this.groundLineSVG.setAttribute("visibility", "hidden");
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
                        this.targetAltitudeTextSVG1.textContent = "FL";
                        this.targetAltitudeTextSVG2.textContent = Math.floor(targetAltitude / 100).toString();
                    }
                    else {
                        this.targetAltitudeTextSVG1.textContent = integral.toString();
                        this.targetAltitudeTextSVG2.textContent = Utils.leadingZeros(modulo, leadingZeros);
                    }
                    hudAltitude = targetAltitude;
                    if (deltaAltitude < -refDelta || deltaAltitude > refDelta) {
                        this.targetAltitudeTextSVG1.setAttribute("visibility", "visible");
                        this.targetAltitudeTextSVG2.setAttribute("visibility", "visible");
                        if (this.targetAltitudeBgSVG)
                            this.targetAltitudeBgSVG.setAttribute("visibility", "visible");
                        this.targetAltitudeIndicatorSVG.setAttribute("visibility", "hidden");
                    }
                    else {
                        this.targetAltitudeTextSVG1.setAttribute("visibility", (textAlwaysVisible) ? "visible" : "hidden");
                        this.targetAltitudeTextSVG2.setAttribute("visibility", (textAlwaysVisible) ? "visible" : "hidden");
                        if (this.targetAltitudeBgSVG)
                            this.targetAltitudeBgSVG.setAttribute("visibility", (textAlwaysVisible) ? "visible" : "hidden");
                        var offsetY = this.valueToSvg(currentAltitude, currentAltitude + deltaAltitude);
                        offsetY -= 48;
                        this.targetAltitudeIndicatorSVG.setAttribute("y", offsetY.toString());
                        this.targetAltitudeIndicatorSVG.setAttribute("visibility", "visible");
                    }
                }
                else {
                    this.targetAltitudeTextSVG1.setAttribute("visibility", "hidden");
                    this.targetAltitudeTextSVG2.setAttribute("visibility", "hidden");
                    if (this.targetAltitudeBgSVG)
                        this.targetAltitudeBgSVG.setAttribute("visibility", "hidden");
                    this.targetAltitudeIndicatorSVG.setAttribute("visibility", "hidden");
                }
            }
            else if (this.aircraft == Aircraft.A320_NEO) {
                let textContent;
                if (stdMode && targetAltitude >= 1000)
                    textContent = "FL" + Math.abs(targetAltitude / 100).toString();
                else
                    textContent = targetAltitude.toFixed(0);
                let deltaAltitude = targetAltitude - currentAltitude;
                if (deltaAltitude < -650) {
                    this.targetAltitudeText.textContent = textContent;
                    this.targetAltitudeText.style.top = "720px";
                    this.targetAltitudeText.style.left = "115px";
                    this.targetAltitudeText.style.display = "block";
                    this.targetAltitudeText.style.color = (APMode == AutopilotMode.SELECTED) ? "cyan" : "magenta";
                    this.targetAltitudeIndicatorSVG.setAttribute("visibility", "hidden");
                }
                else if (deltaAltitude > 650) {
                    this.targetAltitudeText.textContent = textContent;
                    this.targetAltitudeText.style.top = "-20px";
                    this.targetAltitudeText.style.left = "115px";
                    this.targetAltitudeText.style.display = "block";
                    this.targetAltitudeText.style.color = (APMode == AutopilotMode.SELECTED) ? "cyan" : "magenta";
                    this.targetAltitudeIndicatorSVG.setAttribute("visibility", "hidden");
                }
                else {
                    this.targetAltitudeText.style.display = "none";
                    var offsetY = this.valueToSvg(currentAltitude, targetAltitude);
                    offsetY -= 51;
                    this.targetAltitudeIndicatorSVG.setAttribute("y", offsetY.toString());
                    this.targetAltitudeIndicatorSVG.setAttribute("visibility", "visible");
                    this.targetAltitudeIndicatorSVGShape.setAttribute("stroke", (APMode == AutopilotMode.SELECTED) ? "cyan" : "magenta");
                    if (this.targetAltitudeIndicatorSVGText) {
                        if (targetAltitude >= 10)
                            this.targetAltitudeIndicatorSVGText.textContent = targetAltitude.toFixed(0);
                        else
                            this.targetAltitudeIndicatorSVGText.textContent = "100";
                        this.targetAltitudeIndicatorSVGText.setAttribute("fill", (APMode == AutopilotMode.SELECTED) ? "cyan" : "magenta");
                    }
                }
                hudAltitude = targetAltitude;
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
        this.minimumReferenceCursor.setAttribute("transform", "translate(0, " + currentY.toFixed(1) + ")");
        this.minimumReferenceValueText.textContent = minimumAltitude.toFixed(0);
        this.minimumReferenceModeText.textContent = minimumMode === MinimumReferenceMode.BARO ? "BARO" : "RADIO";
        ;
    }
}
customElements.define("jet-pfd-altimeter-indicator", Jet_PFD_AltimeterIndicator);
//# sourceMappingURL=AltimeterIndicator.js.map