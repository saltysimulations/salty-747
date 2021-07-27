class B747_8_SAI extends BaseAirliners {
    get templateID() { return "B747_8_SAI"; }
    connectedCallback() {
        super.connectedCallback();
        this.addIndependentElementContainer(new NavSystemElementContainer("Altimeter", "Altimeter", new B747_8_SAI_Altimeter()));
        this.addIndependentElementContainer(new NavSystemElementContainer("Airspeed", "Airspeed", new B747_8_SAI_Airspeed()));
        this.addIndependentElementContainer(new NavSystemElementContainer("Horizon", "Horizon", new B747_8_SAI_Attitude()));
        this.addIndependentElementContainer(new NavSystemElementContainer("Compass", "Compass", new B747_8_SAI_Compass()));
        this.addIndependentElementContainer(new NavSystemElementContainer("Baro", "Baro", new B747_8_SAI_Baro()));
    }
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
    }
}
class B747_8_SAI_Baro extends NavSystemElement {
    constructor() {
        super();
    }
    init(root) {
        this.baroElement = this.gps.getChildById("Baro");
    }
    onEnter() {
    }
    isReady() {
        return true;
    }
    onUpdate(_deltaTime) {
        this.baroElement.update(_deltaTime);
    }
    onExit() {
    }
    onEvent(_event) {
        switch (_event) {
            case "BARO_INC":
                SimVar.SetSimVarValue("K:KOHLSMAN_INC", "number", 1);
                break;
            case "BARO_DEC":
                SimVar.SetSimVarValue("K:KOHLSMAN_DEC", "number", 1);
                break;
        }
    }
}
class B747_8_SAI_BaroIndicator extends HTMLElement {
    constructor() {
        super(...arguments);
        this.viewboxWidth = 250;
        this.viewboxHeight = 250;
        this.width = 145;
        this.height = 30;
        this.top = 0;
        this.left = 42;
        this.borderWidth = 2;
        this.backgroundColor = "#000";
        this.backgroundActiveColor = "#37474f";
        this.construct = () => {
            this.svg = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.svg, "id", "ViewBox");
            diffAndSetAttribute(this.svg, "viewBox", "0 0 " + this.viewboxWidth + " " + this.viewboxHeight);
            var backgroundRect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(backgroundRect, "id", "backgroundRect");
            {
                diffAndSetAttribute(backgroundRect, "x", this.left + '');
                diffAndSetAttribute(backgroundRect, "y", this.top + '');
                diffAndSetAttribute(backgroundRect, "width", this.width + '');
                diffAndSetAttribute(backgroundRect, "height", this.height + '');
                diffAndSetAttribute(backgroundRect, "fill", this.backgroundColor);
                this.svg.appendChild(backgroundRect);
            }
            if (!this.line)
                this.line = document.createElementNS(Avionics.SVG.NS, "text");
            {
                diffAndSetAttribute(this.line, "x", (this.left + this.width - 2) + '');
                diffAndSetAttribute(this.line, "y", (this.height * 0.5) + '');
                diffAndSetAttribute(this.line, "fill", "lightgreen");
                diffAndSetAttribute(this.line, "font-size", "16");
                diffAndSetAttribute(this.line, "font-family", "Roboto-Light");
                diffAndSetAttribute(this.line, "letter-spacing", "-1.5");
                diffAndSetAttribute(this.line, "text-anchor", "end");
                diffAndSetAttribute(this.line, "alignment-baseline", "central");
                diffAndSetText(this.line, "---");
                this.svg.appendChild(this.line);
            }
            this.appendChild(this.svg);
        };
    }
    connectedCallback() {
        this.construct();
    }
    update(_deltaTime) {
        if (this.line) {
            var pressure = SimVar.GetSimVarValue("KOHLSMAN SETTING HG:2", "hectopascal");
            diffAndSetText(this.line, fastToFixed(pressure, 0) + " HPA".toUpperCase());
        }
    }
}
customElements.define('b747-8-sai-baro-indicator', B747_8_SAI_BaroIndicator);
class B747_8_SAI_Compass extends NavSystemElement {
    constructor() {
        super();
    }
    init(root) {
        this.compassBackground = this.gps.getChildById("CompassBackground");
        this.compassElement = this.gps.getChildById("Compass");
    }
    onEnter() {
    }
    isReady() {
        return true;
    }
    onUpdate(_deltaTime) {
        this.compassElement.update(_deltaTime);
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
class B747_8_SAI_CompassBackground extends HTMLElement {
    constructor() {
        super(...arguments);
        this.viewboxWidth = 250;
        this.viewboxHeight = 250;
        this.width = 143;
        this.height = 30;
        this.left = 42;
        this.right = this.viewboxWidth - (this.width + this.left);
        this.top = this.viewboxHeight - this.height;
        this.borderWidth = 2;
        this.backgroundColor = "#000";
        this.backgroundActiveColor = "#37474f";
        this.construct = () => {
            this.svg = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.svg, "id", "ViewBox");
            diffAndSetAttribute(this.svg, "viewBox", "0 0 " + this.viewboxWidth + " " + this.viewboxHeight);
            var backgroundRect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(backgroundRect, "id", "backgroundRect");
            {
                diffAndSetAttribute(backgroundRect, "x", this.left + '');
                diffAndSetAttribute(backgroundRect, "y", this.top + '');
                diffAndSetAttribute(backgroundRect, "width", this.width + '');
                diffAndSetAttribute(backgroundRect, "height", this.height + '');
                diffAndSetAttribute(backgroundRect, "fill", this.backgroundColor);
                this.svg.appendChild(backgroundRect);
            }
            var backgroundArc = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(backgroundArc, "id", "backgroundArc");
            {
                var rect = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(rect, "x", this.left + '');
                diffAndSetAttribute(rect, "y", (this.top + this.height * 0.6) + '');
                diffAndSetAttribute(rect, "width", this.width + '');
                diffAndSetAttribute(rect, "height", (this.height * 0.4) + '');
                diffAndSetAttribute(rect, "fill", this.backgroundActiveColor);
                backgroundArc.appendChild(rect);
                var arcHeight = 30;
                var arc = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(arc, "d", `M${this.left - 2} ${this.top + this.height * 0.6 + 1}` +
                    ` q ${(this.width + 4) * 0.5} -${arcHeight} ,${this.width + 4} 0`);
                diffAndSetAttribute(arc, "fill", this.backgroundActiveColor);
                backgroundArc.appendChild(arc);
            }
            this.appendChild(this.svg);
        };
    }
    connectedCallback() {
        this.construct();
    }
}
customElements.define('b747-8-sai-compass-background', B747_8_SAI_CompassBackground);
class B747_8_SAI_HSIndicator extends HTMLElement {
    constructor() {
        super(...arguments);
        this.compassCircleTexts = [];
        this.width = 143;
        this.height = 50;
        this.top = 250 - this.height;
        this.left = 42;
        this.backgroundColor = "#000";
        this.backgroundActiveColor = "#37474f";
        this.construct = () => {
            this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
            diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 250 250");
            if (!this.rootGroup) {
                this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.rootGroup, "id", "HS");
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
            diffAndSetAttribute(this.centerSVG, "x", this.left + '');
            diffAndSetAttribute(this.centerSVG, "y", this.top + '');
            diffAndSetAttribute(this.centerSVG, "width", this.width + '');
            diffAndSetAttribute(this.centerSVG, "height", this.height + '');
            diffAndSetAttribute(this.centerSVG, "overflow", "hidden");
            diffAndSetAttribute(this.centerSVG, "viewBox", "0 0 " + this.width + " " + this.height);
            {
                var indicatorCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                {
                    diffAndSetAttribute(indicatorCircle, 'cx', (this.width * .5) + '');
                    diffAndSetAttribute(indicatorCircle, 'cy', (this.width * 1.38) + '');
                    diffAndSetAttribute(indicatorCircle, 'r', (this.width * 1.2) + '');
                    diffAndSetAttribute(indicatorCircle, 'fill', this.backgroundActiveColor);
                }
                this.centerSVG.appendChild(indicatorCircle);
                this.compassCircle = document.createElementNS(Avionics.SVG.NS, "g");
                {
                    {
                        let angle = 0;
                        for (let i = 0; i < 72; i++) {
                            let line = document.createElementNS(Avionics.SVG.NS, "rect");
                            let length = i % 2 == 0 ? 6 : 3;
                            diffAndSetAttribute(line, "x", "180");
                            diffAndSetAttribute(line, "y", (360 - length) + '');
                            diffAndSetAttribute(line, "width", "1");
                            diffAndSetAttribute(line, "height", length + '');
                            diffAndSetAttribute(line, "transform", "rotate(" + ((-angle / Math.PI) * 180 + 180) + " 180 180)");
                            diffAndSetAttribute(line, "fill", "white");
                            angle += (2 * Math.PI) / 72;
                            this.compassCircle.appendChild(line);
                        }
                    }
                    {
                        let texts = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35"];
                        let angle = 0;
                        for (let i = 0; i < texts.length; i++) {
                            let text = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetText(text, texts[i]);
                            diffAndSetAttribute(text, "x", "180");
                            diffAndSetAttribute(text, "y", "12");
                            diffAndSetAttribute(text, "fill", "white");
                            diffAndSetAttribute(text, "font-size", "16");
                            diffAndSetAttribute(text, "font-family", "Roboto-Light");
                            diffAndSetAttribute(text, "text-anchor", "middle");
                            diffAndSetAttribute(text, "alignment-baseline", "central");
                            diffAndSetAttribute(text, "transform", "rotate(" + angle + " 180 180)");
                            diffAndSetAttribute(text, "angle", angle + '');
                            angle += 360 / texts.length;
                            this.compassCircle.appendChild(text);
                            this.compassCircleTexts.push(text);
                        }
                    }
                }
                this.centerSVG.appendChild(this.compassCircle);
                var cursor = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(cursor, "id", "cursor");
                {
                    var _left = this.width * 0.5;
                    var _top = 20;
                    var _triangleSize = 15;
                    diffAndSetAttribute(cursor, 'd', `M${_left - _triangleSize * 0.5},${_top} ` +
                        `l ${_triangleSize * 1}, 0` +
                        `l -${_triangleSize * 0.5}, ${_triangleSize * 0.6}` +
                        `l -${_triangleSize * 0.5}, -${_triangleSize * 0.6}`);
                    diffAndSetAttribute(cursor, "fill", "transparent");
                    diffAndSetAttribute(cursor, "stroke", "white");
                    diffAndSetAttribute(cursor, "stroke-width", "2");
                }
                this.centerSVG.appendChild(cursor);
            }
            this.rootGroup.appendChild(this.centerSVG);
            this.rootSVG.appendChild(this.rootGroup);
            this.appendChild(this.rootSVG);
        };
    }
    connectedCallback() {
        this.construct();
    }
    update(_deltaTime) {
        let _compass = Simplane.getHeadingMagnetic();
        diffAndSetAttribute(this.compassCircle, "transform", "translate(-108,27) rotate(" + (-_compass) + " 180 180)");
        this.compassCircleTexts.forEach((text) => {
            let angle = Number(text.getAttribute('angle'));
            let angleRatio = angle / 360;
            let compassRatio = _compass / 360;
            let ratioDifference = Math.abs(angleRatio - compassRatio);
            if (ratioDifference > 0.014) {
                diffAndSetAttribute(text, 'font-size', "16");
            }
            else {
                diffAndSetAttribute(text, 'font-size', "20");
            }
        });
    }
}
customElements.define('b747-8-sai-hsindicator', B747_8_SAI_HSIndicator);
class B747_8_SAI_Airspeed extends NavSystemElement {
    constructor() {
        super();
    }
    init(root) {
        this.airspeedElement = this.gps.getChildById("Airspeed");
    }
    onEnter() {
    }
    isReady() {
        return true;
    }
    onUpdate(_deltaTime) {
        this.airspeedElement.update(_deltaTime);
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
class B747_8_SAI_AirspeedIndicator extends HTMLElement {
    constructor() {
        super(...arguments);
        this.greenColor = "green";
        this.yellowColor = "yellow";
        this.redColor = "red";
        this.fontSize = 25;
        this.backgroundColor = "#37474f";
        this.graduationScrollPosX = 0;
        this.graduationScrollPosY = 0;
        this.graduationSpacing = 20;
        this.graduationMinValue = 30;
        this.nbPrimaryGraduations = 11;
        this.nbSecondaryGraduations = 1;
        this.totalGraduations = this.nbPrimaryGraduations + ((this.nbPrimaryGraduations - 1) * this.nbSecondaryGraduations);
    }
    connectedCallback() {
        this.graduationScroller = new Avionics.Scroller(this.nbPrimaryGraduations, 20);
        this.cursorIntegrals = new Array();
        this.cursorIntegrals.push(new Avionics.AirspeedScroller(30, 100));
        this.cursorIntegrals.push(new Avionics.AirspeedScroller(30, 10));
        this.cursorDecimals = new Avionics.AirspeedScroller(20);
        this.construct();
    }
    construct() {
        Utils.RemoveAllChildren(this);
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 250 500");
        var borderRightWidth = 2;
        var width = 40 + borderRightWidth;
        var height = 250;
        var posX = width * 0.5;
        var posY = 0;
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "Airspeed");
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
        diffAndSetAttribute(this.centerSVG, "width", width + '');
        diffAndSetAttribute(this.centerSVG, "height", height + '');
        diffAndSetAttribute(this.centerSVG, "viewBox", "0 0 " + width + " " + height);
        {
            var _top = 0;
            var _left = 0;
            var _width = width;
            var _height = height;
            var _borderWidth = borderRightWidth;
            var bg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(bg, "x", _left + '');
            diffAndSetAttribute(bg, "y", _top + '');
            diffAndSetAttribute(bg, "width", _width + '');
            diffAndSetAttribute(bg, "height", _height + '');
            diffAndSetAttribute(bg, "fill", this.backgroundColor);
            this.centerSVG.appendChild(bg);
            var border = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(border, "x", (_width - _borderWidth) + '');
            diffAndSetAttribute(border, "y", _top + '');
            diffAndSetAttribute(border, "width", "3");
            diffAndSetAttribute(border, "height", _height + '');
            diffAndSetAttribute(border, "fill", "black");
            this.centerSVG.appendChild(border);
            var _graduationHeight = _height * 0.5;
            if (this.airspeeds) {
                var arcGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(arcGroup, "id", "Arcs");
                {
                    this.arcs = [];
                    var _arcWidth = 18;
                    var _arcPosX = _left + (_width - _borderWidth) + 3;
                    var _arcStartPosY = _top + _graduationHeight;
                    var arcHeight = this.arcToSVG(this.airspeeds.greenEnd - this.airspeeds.greenStart);
                    var arcPosY = _arcStartPosY - this.arcToSVG(this.airspeeds.greenStart) - arcHeight;
                    var arc = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(arc, "x", _arcPosX + '');
                    diffAndSetAttribute(arc, "y", arcPosY + '');
                    diffAndSetAttribute(arc, "width", _arcWidth + '');
                    diffAndSetAttribute(arc, "height", arcHeight + '');
                    diffAndSetAttribute(arc, "fill", this.greenColor);
                    this.arcs.push(arc);
                    var arcHeight = this.arcToSVG(this.airspeeds.yellowEnd - this.airspeeds.yellowStart);
                    var arcPosY = _arcStartPosY - this.arcToSVG(this.airspeeds.yellowStart) - arcHeight;
                    var arc = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(arc, "x", _arcPosX + '');
                    diffAndSetAttribute(arc, "y", arcPosY + '');
                    diffAndSetAttribute(arc, "width", _arcWidth + '');
                    diffAndSetAttribute(arc, "height", arcHeight + '');
                    diffAndSetAttribute(arc, "fill", this.yellowColor);
                    this.arcs.push(arc);
                    var arcHeight = this.arcToSVG(this.airspeeds.redEnd - this.airspeeds.redStart);
                    var arcPosY = _arcStartPosY - this.arcToSVG(this.airspeeds.redStart) - arcHeight;
                    var arc = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(arc, "x", _arcPosX + '');
                    diffAndSetAttribute(arc, "y", arcPosY + '');
                    diffAndSetAttribute(arc, "width", _arcWidth + '');
                    diffAndSetAttribute(arc, "height", arcHeight + '');
                    diffAndSetAttribute(arc, "fill", this.redColor);
                    this.arcs.push(arc);
                    var arcHeight = this.arcToSVG(this.airspeeds.whiteEnd - this.airspeeds.whiteStart);
                    var arcPosY = _arcStartPosY - this.arcToSVG(this.airspeeds.whiteStart) - arcHeight;
                    var arc = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(arc, "x", (_arcPosX + _arcWidth * 0.5) + '');
                    diffAndSetAttribute(arc, "y", arcPosY + '');
                    diffAndSetAttribute(arc, "width", (_arcWidth * 0.5) + '');
                    diffAndSetAttribute(arc, "height", arcHeight + '');
                    diffAndSetAttribute(arc, "fill", "white");
                    this.arcs.push(arc);
                    for (var i = 0; i < this.arcs.length; i++) {
                        arcGroup.appendChild(this.arcs[i]);
                    }
                    this.centerSVG.appendChild(arcGroup);
                }
            }
            var graduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(graduationGroup, "id", "Graduations");
            {
                this.graduationScrollPosX = _left + (_width - _borderWidth);
                this.graduationScrollPosY = _top + _graduationHeight;
                this.graduations = [];
                for (var i = 0; i < this.totalGraduations; i++) {
                    var line = new Avionics.SVGGraduation();
                    var mod = i % (this.nbSecondaryGraduations + 1);
                    line.IsPrimary = (mod == 0) ? true : false;
                    var lineWidth = (mod == 1) ? 10 : 4;
                    var lineHeight = (mod == 1) ? 2 : 2;
                    var linePosX = -lineWidth;
                    line.SVGLine = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(line.SVGLine, "x", linePosX + '');
                    diffAndSetAttribute(line.SVGLine, "width", lineWidth + '');
                    diffAndSetAttribute(line.SVGLine, "height", lineHeight + '');
                    diffAndSetAttribute(line.SVGLine, "fill", "white");
                    if (mod == 0) {
                        line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetAttribute(line.SVGText1, "x", (linePosX - 2) + '');
                        diffAndSetAttribute(line.SVGText1, "fill", "white");
                        diffAndSetAttribute(line.SVGText1, "font-size", (this.fontSize * 0.65) + '');
                        diffAndSetAttribute(line.SVGText1, "font-family", "Roboto-Light");
                        diffAndSetAttribute(line.SVGText1, "letter-spacing", "-1.5");
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
        }
        this.rootGroup.appendChild(this.centerSVG);
        var cursorPosX = _left - 2;
        var cursorPosY = _top + _height * 0.5 + 5;
        var cursorWidth = _width + 5;
        var cursorHeight = 39;
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
            var rect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(rect, "x", "0");
            diffAndSetAttribute(rect, "y", "0");
            diffAndSetAttribute(rect, "width", cursorWidth + '');
            diffAndSetAttribute(rect, "height", cursorHeight + '');
            diffAndSetAttribute(rect, "fill", "black");
            diffAndSetAttribute(rect, "stroke", "white");
            diffAndSetAttribute(rect, "stroke-width", "4");
            this.cursorSVG.appendChild(rect);
            var _cursorPosX = this.graduationScrollPosX + 8;
            var _cursorPosY = cursorHeight * 0.5;
            this.cursorIntegrals[0].construct(this.cursorSVG, _cursorPosX - 30, _cursorPosY, _width, "Roboto-Light", this.fontSize, "white");
            this.cursorIntegrals[1].construct(this.cursorSVG, _cursorPosX - 17, _cursorPosY, _width, "Roboto-Light", this.fontSize, "white");
            this.cursorDecimals.construct(this.cursorSVG, _cursorPosX - 2, _cursorPosY, _width, "Roboto-Light", this.fontSize, "white");
            this.rootGroup.appendChild(this.cursorSVG);
        }
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    update(dTime) {
        var indicatedSpeed = Simplane.getIndicatedSpeed();
        this.updateArcScrolling(indicatedSpeed);
        this.updateGraduationScrolling(indicatedSpeed);
        this.updateCursorScrolling(indicatedSpeed);
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
                        diffAndSetAttribute(this.graduations[i].SVGLine, "transform", "translate(" + posX + '' + " " + posY + '' + ")");
                        if (this.graduations[i].SVGText1) {
                            diffAndSetText(this.graduations[i].SVGText1, currentVal + '');
                            diffAndSetAttribute(this.graduations[i].SVGText1, "transform", "translate(" + posX + '' + " " + posY + '' + ")");
                        }
                    }
                    if (this.graduations[i].SVGText1)
                        currentVal = this.graduationScroller.nextValue;
                    currentY -= this.graduationSpacing;
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
        if (_speed < this.graduationMinValue)
            _speed = this.graduationMinValue;
        if (this.cursorIntegrals) {
            this.cursorIntegrals[0].update(_speed, 100, 100);
            this.cursorIntegrals[1].update(_speed, 10, 10);
        }
        if (this.cursorDecimals) {
            this.cursorDecimals.update(_speed);
        }
    }
}
customElements.define('b747-8-sai-airspeed-indicator', B747_8_SAI_AirspeedIndicator);
class B747_8_SAI_Altimeter extends NavSystemElement {
    constructor() {
        super();
    }
    init(root) {
        this.altimeterElement = this.gps.getChildById("Altimeter");
    }
    onEnter() {
    }
    isReady() {
        return true;
        ;
    }
    onUpdate(_deltaTime) {
        this.altimeterElement.update(_deltaTime);
    }
    onExit() {
    }
    onEvent(_event) {
        switch (_event) {
            case "BARO_INC":
                SimVar.SetSimVarValue("K:KOHLSMAN_INC", "number", 1);
                break;
            case "BARO_DEC":
                SimVar.SetSimVarValue("K:KOHLSMAN_DEC", "number", 1);
                break;
        }
    }
}
class B747_8_SAI_AltimeterIndicator extends HTMLElement {
    constructor() {
        super(...arguments);
        this.fontSize = 24;
        this.backgroundColor = "#37474f";
        this.graduationScrollPosX = 0;
        this.graduationScrollPosY = 0;
        this.nbPrimaryGraduations = 6;
        this.nbSecondaryGraduations = 1;
        this.totalGraduations = this.nbPrimaryGraduations + ((this.nbPrimaryGraduations - 1) * this.nbSecondaryGraduations);
        this.graduationSpacing = 30;
    }
    connectedCallback() {
        this.graduationScroller = new Avionics.Scroller(this.nbPrimaryGraduations, 100, true);
        this.cursorIntegrals = new Array();
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 40, 1, 10, 1000));
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 40, 1, 10, 100));
        this.cursorIntegrals.push(new Avionics.AltitudeScroller(3, 40, 1, 10, 10));
        this.cursorDecimals = new Avionics.AltitudeScroller(3, 18, 20, 100);
        this.construct();
    }
    construct() {
        Utils.RemoveAllChildren(this);
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 250 500");
        var width = 80;
        var height = 250;
        var borderwidth = 2;
        var posX = 20 + width * 0.5;
        var posY = 0;
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
        diffAndSetAttribute(this.centerSVG, "x", posX + '');
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
            diffAndSetAttribute(bg, "fill", this.backgroundColor);
            this.centerSVG.appendChild(bg);
            this.graduationScrollPosX = _left;
            this.graduationScrollPosY = _top + _height * 0.5;
            this.graduations = [];
            for (var i = 0; i < this.totalGraduations; i++) {
                var line = new Avionics.SVGGraduation();
                line.IsPrimary = true;
                if (this.nbSecondaryGraduations > 0 && (i % (this.nbSecondaryGraduations + 1)))
                    line.IsPrimary = false;
                var lineWidth = line.IsPrimary ? 0 : 12;
                line.SVGLine = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(line.SVGLine, "x", "0");
                diffAndSetAttribute(line.SVGLine, "width", lineWidth + '');
                diffAndSetAttribute(line.SVGLine, "height", "2");
                diffAndSetAttribute(line.SVGLine, "fill", "white");
                if (line.IsPrimary) {
                    line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(line.SVGText1, "x", (posX + 6) + '');
                    diffAndSetAttribute(line.SVGText1, "fill", "white");
                    diffAndSetAttribute(line.SVGText1, "font-size", (this.fontSize * 0.75) + '');
                    diffAndSetAttribute(line.SVGText1, "font-family", "Roboto-Light");
                    diffAndSetAttribute(line.SVGText1, "letter-spacing", "-1.5");
                    diffAndSetAttribute(line.SVGText1, "text-anchor", "end");
                    diffAndSetAttribute(line.SVGText1, "alignment-baseline", "central");
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
        }
        var border = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(border, "x", "0");
        diffAndSetAttribute(border, "y", "0");
        diffAndSetAttribute(border, "width", borderwidth + '');
        diffAndSetAttribute(border, "height", _height + '');
        diffAndSetAttribute(border, "fill", "black");
        this.centerSVG.appendChild(border);
        this.rootGroup.appendChild(this.centerSVG);
        var cursorPosX = 6.5 + width * 0.5;
        var cursorPosY = _top + _height * 0.5 + 5;
        var cursorWidth = width;
        var cursorHeight = 39;
        if (!this.cursorSVG) {
            this.cursorSVG = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.cursorSVG, "id", "CursorGroup");
        }
        else {
            Utils.RemoveAllChildren(this.cursorSVG);
        }
        diffAndSetAttribute(this.cursorSVG, "x", cursorPosX + '');
        diffAndSetAttribute(this.cursorSVG, "y", (cursorPosY - cursorHeight * 0.5) + '');
        diffAndSetAttribute(this.cursorSVG, "width", cursorWidth + '');
        diffAndSetAttribute(this.cursorSVG, "height", cursorHeight + '');
        diffAndSetAttribute(this.cursorSVG, "viewBox", "0 0 " + cursorWidth + '' + " " + cursorHeight + '');
        {
            if (!this.cursorSVGShape)
                this.cursorSVGShape = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.cursorSVGShape, "fill", "black");
            diffAndSetAttribute(this.cursorSVGShape, "width", cursorWidth + '');
            diffAndSetAttribute(this.cursorSVGShape, "height", cursorHeight + '');
            diffAndSetAttribute(this.cursorSVGShape, "stroke", "transparent");
            diffAndSetAttribute(this.cursorSVGShape, "stroke-width", "4");
            this.cursorSVG.appendChild(this.cursorSVGShape);
            var _cursorPosX = width - 5;
            var _cursorPosY = cursorHeight * 0.5;
            this.cursorIntegrals[0].construct(this.cursorSVG, _cursorPosX - 55, _cursorPosY, _width, "Roboto-Light", this.fontSize, "white");
            this.cursorIntegrals[1].construct(this.cursorSVG, _cursorPosX - 40, _cursorPosY, _width, "Roboto-Light", this.fontSize, "white");
            this.cursorIntegrals[2].construct(this.cursorSVG, _cursorPosX - 25, _cursorPosY, _width, "Roboto-Light", this.fontSize, "white");
            this.cursorDecimals.construct(this.cursorSVG, _cursorPosX, _cursorPosY, _width, "Roboto-Light", this.fontSize * 0.75, "white");
            if (!this.cursorSVGAltitudeLevelShape)
                this.cursorSVGAltitudeLevelShape = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.cursorSVGAltitudeLevelShape, "fill", "rgb(96, 255, 5)");
            diffAndSetAttribute(this.cursorSVGAltitudeLevelShape, "x", "7");
            diffAndSetAttribute(this.cursorSVGAltitudeLevelShape, "y", ((cursorHeight * 0.5) * 0.5) + '');
            diffAndSetAttribute(this.cursorSVGAltitudeLevelShape, "width", "12");
            diffAndSetAttribute(this.cursorSVGAltitudeLevelShape, "height", (cursorHeight * 0.5) + '');
            this.cursorSVG.appendChild(this.cursorSVGAltitudeLevelShape);
            if (!this.cursorSVGShapeBorder)
                this.cursorSVGShapeBorder = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.cursorSVGShapeBorder, "fill", "transparent");
            diffAndSetAttribute(this.cursorSVGShapeBorder, "width", cursorWidth + '');
            diffAndSetAttribute(this.cursorSVGShapeBorder, "height", cursorHeight + '');
            diffAndSetAttribute(this.cursorSVGShapeBorder, "stroke", "white");
            diffAndSetAttribute(this.cursorSVGShapeBorder, "stroke-width", "4");
            this.cursorSVG.appendChild(this.cursorSVGShapeBorder);
            this.rootGroup.appendChild(this.cursorSVG);
        }
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    update(_dTime) {
        var altitude = SimVar.GetSimVarValue("INDICATED ALTITUDE:2", "feet");
        this.updateGraduationScrolling(altitude);
        this.updateCursorScrolling(altitude);
        this.updateBaroPressure();
    }
    updateBaroPressure() {
        if (this.pressureSVG) {
            var pressure = SimVar.GetSimVarValue("KOHLSMAN SETTING HG:2", "inches of mercury");
            diffAndSetText(this.pressureSVG, fastToFixed(pressure, 2) + " in");
        }
    }
    updateGraduationScrolling(_altitude) {
        if (this.graduations) {
            engine.beginProfileEvent('updateGraduationScrolling');
            if (this.graduationScroller.scroll(_altitude)) {
                var currentVal = this.graduationScroller.firstValue;
                var currentY = this.graduationScrollPosY + this.graduationScroller.offsetY * this.graduationSpacing * (this.nbSecondaryGraduations + 1);
                var firstRoundValueY = currentY;
                for (var i = 0; i < this.totalGraduations; i++) {
                    var posX = this.graduationScrollPosX;
                    var posY = Math.round(currentY);
                    diffAndSetAttribute(this.graduations[i].SVGLine, "transform", "translate(" + posX + '' + " " + posY + '' + ")");
                    if (this.graduations[i].SVGText1) {
                        var roundedVal = 0;
                        roundedVal = Math.floor(Math.abs(currentVal));
                        var integral = Math.floor(roundedVal);
                        diffAndSetText(this.graduations[i].SVGText1, integral + '');
                        diffAndSetAttribute(this.graduations[i].SVGText1, "transform", "translate(" + posX + '' + " " + posY + '' + ")");
                        if (this.graduations[i].SVGText2)
                            diffAndSetAttribute(this.graduations[i].SVGText2, "transform", "translate(" + posX + '' + " " + posY + '' + ")");
                        firstRoundValueY = posY;
                        currentVal = this.graduationScroller.nextValue;
                    }
                    currentY -= this.graduationSpacing;
                }
                if (this.graduationBarSVG) {
                    diffAndSetAttribute(this.graduationBarSVG, "transform", "translate(0 " + firstRoundValueY + ")");
                }
            }
            engine.endProfileEvent();
        }
    }
    updateCursorScrolling(_altitude) {
        if (this.cursorIntegrals) {
            this.cursorIntegrals[0].update(_altitude, 10000, 10000);
            this.cursorIntegrals[1].update(_altitude, 1000, 1000);
            this.cursorIntegrals[2].update(_altitude, 100);
        }
        if (this.cursorDecimals) {
            this.cursorDecimals.update(_altitude);
        }
        this.cursorSVGAltitudeLevelShape.classList.toggle('hide', _altitude >= 10000);
    }
}
customElements.define('b747-8-sai-altimeter-indicator', B747_8_SAI_AltimeterIndicator);
class B747_8_SAI_Attitude extends NavSystemElement {
    init(root) {
        this.attitudeElement = this.gps.getChildById("Horizon");
        diffAndSetAttribute(this.attitudeElement, "is-backup", "true");
        if (this.gps) {
            var aspectRatio = this.gps.getAspectRatio();
            diffAndSetAttribute(this.attitudeElement, "aspect-ratio", aspectRatio + '');
        }
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        var xyz = Simplane.getOrientationAxis();
        if (xyz) {
            diffAndSetAttribute(this.attitudeElement, "pitch", (xyz.pitch / Math.PI * 180) + '');
            diffAndSetAttribute(this.attitudeElement, "bank", (xyz.bank / Math.PI * 180) + '');
            diffAndSetAttribute(this.attitudeElement, "slip_skid", Simplane.getInclinometer() + '');
        }
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
class B747_8_SAI_AttitudeIndicator extends HTMLElement {
    constructor() {
        super();
        this.backgroundVisible = true;
        this.bankSizeRatio = -8.25;
        this.bankSizeRatioFactor = 1.0;
    }
    static get observedAttributes() {
        return [
            "pitch",
            "bank",
            "slip_skid",
            "background",
        ];
    }
    connectedCallback() {
        this.construct();
    }
    construct() {
        Utils.RemoveAllChildren(this);
        this.bankSizeRatioFactor = 0.62;
        {
            this.horizon_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.horizon_root, "width", "100%");
            diffAndSetAttribute(this.horizon_root, "height", "100%");
            diffAndSetAttribute(this.horizon_root, "viewBox", "-200 -200 400 300");
            diffAndSetAttribute(this.horizon_root, "x", "-100");
            diffAndSetAttribute(this.horizon_root, "y", "-100");
            diffAndSetAttribute(this.horizon_root, "overflow", "visible");
            diffAndSetAttribute(this.horizon_root, "style", "position:absolute; z-index: -3; width: 100%; height:100%;");
            diffAndSetAttribute(this.horizon_root, "transform", "translate(0, 100)");
            this.appendChild(this.horizon_root);
            this.horizonTopColor = "#0d47a1";
            this.horizonBottomColor = "#6c4f23";
            this.horizonTop = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.horizonTop, "fill", (this.backgroundVisible) ? this.horizonTopColor : "transparent");
            diffAndSetAttribute(this.horizonTop, "x", "-1000");
            diffAndSetAttribute(this.horizonTop, "y", "-1000");
            diffAndSetAttribute(this.horizonTop, "width", "2000");
            diffAndSetAttribute(this.horizonTop, "height", "2000");
            this.horizon_root.appendChild(this.horizonTop);
            this.bottomPart = document.createElementNS(Avionics.SVG.NS, "g");
            this.horizon_root.appendChild(this.bottomPart);
            this.horizonBottom = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.horizonBottom, "fill", (this.backgroundVisible) ? this.horizonBottomColor : "transparent");
            diffAndSetAttribute(this.horizonBottom, "x", "-1500");
            diffAndSetAttribute(this.horizonBottom, "y", "0");
            diffAndSetAttribute(this.horizonBottom, "width", "3000");
            diffAndSetAttribute(this.horizonBottom, "height", "3000");
            this.bottomPart.appendChild(this.horizonBottom);
            let separator = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(separator, "fill", "#e0e0e0");
            diffAndSetAttribute(separator, "x", "-1500");
            diffAndSetAttribute(separator, "y", "-3");
            diffAndSetAttribute(separator, "width", "3000");
            diffAndSetAttribute(separator, "height", "6");
            this.bottomPart.appendChild(separator);
        }
        {
            let pitchContainer = document.createElement("div");
            diffAndSetAttribute(pitchContainer, "id", "Pitch");
            pitchContainer.style.top = "-14%";
            pitchContainer.style.left = "-10%";
            pitchContainer.style.width = "120%";
            pitchContainer.style.height = "120%";
            pitchContainer.style.position = "absolute";
            pitchContainer.style.transform = "scale(1.35)";
            this.appendChild(pitchContainer);
            this.pitch_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.pitch_root, "width", "100%");
            diffAndSetAttribute(this.pitch_root, "height", "100%");
            diffAndSetAttribute(this.pitch_root, "viewBox", "-200 -200 400 300");
            diffAndSetAttribute(this.pitch_root, "overflow", "visible");
            diffAndSetAttribute(this.pitch_root, "style", "position:absolute; z-index: -2;");
            pitchContainer.appendChild(this.pitch_root);
            {
                this.pitch_root_group = document.createElementNS(Avionics.SVG.NS, "g");
                this.pitch_root.appendChild(this.pitch_root_group);
                var x = -115;
                var y = -150;
                var w = 230;
                var h = 300;
                let attitudePitchContainer = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(attitudePitchContainer, "width", w + '');
                diffAndSetAttribute(attitudePitchContainer, "height", h + '');
                diffAndSetAttribute(attitudePitchContainer, "x", x + '');
                diffAndSetAttribute(attitudePitchContainer, "y", y + '');
                diffAndSetAttribute(attitudePitchContainer, "viewBox", x + " " + y + " " + w + " " + h);
                diffAndSetAttribute(attitudePitchContainer, "overflow", "hidden");
                this.pitch_root_group.appendChild(attitudePitchContainer);
                {
                    this.attitude_pitch = document.createElementNS(Avionics.SVG.NS, "g");
                    attitudePitchContainer.appendChild(this.attitude_pitch);
                    let maxDash = 80;
                    let fullPrecisionLowerLimit = -20;
                    let fullPrecisionUpperLimit = 20;
                    let halfPrecisionLowerLimit = -30;
                    let halfPrecisionUpperLimit = 45;
                    let unusualAttitudeLowerLimit = -30;
                    let unusualAttitudeUpperLimit = 50;
                    let bigWidth = 160;
                    let bigHeight = 3;
                    let mediumWidth = 50;
                    let mediumHeight = 3;
                    let smallWidth = 20;
                    let smallHeight = 2;
                    let fontSize = 20;
                    let angle = -maxDash;
                    let nextAngle;
                    let width;
                    let height;
                    let text;
                    while (angle <= maxDash) {
                        if (angle % 10 == 0) {
                            width = bigWidth;
                            height = bigHeight;
                            text = true;
                            if (angle >= fullPrecisionLowerLimit && angle < fullPrecisionUpperLimit) {
                                nextAngle = angle + 2.5;
                            }
                            else if (angle >= halfPrecisionLowerLimit && angle < halfPrecisionUpperLimit) {
                                nextAngle = angle + 5;
                            }
                            else {
                                nextAngle = angle + 10;
                            }
                        }
                        else {
                            if (angle % 5 == 0) {
                                width = mediumWidth;
                                height = mediumHeight;
                                text = false;
                                if (angle >= fullPrecisionLowerLimit && angle < fullPrecisionUpperLimit) {
                                    nextAngle = angle + 2.5;
                                }
                                else {
                                    nextAngle = angle + 5;
                                }
                            }
                            else {
                                width = smallWidth;
                                height = smallHeight;
                                nextAngle = angle + 2.5;
                                text = false;
                            }
                        }
                        if (angle != 0) {
                            let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                            diffAndSetAttribute(rect, "fill", "white");
                            diffAndSetAttribute(rect, "x", (-width / 2) + '');
                            diffAndSetAttribute(rect, "y", (this.bankSizeRatio * angle - height / 2) + '');
                            diffAndSetAttribute(rect, "width", width + '');
                            diffAndSetAttribute(rect, "height", height + '');
                            this.attitude_pitch.appendChild(rect);
                            if (text) {
                                let leftText = document.createElementNS(Avionics.SVG.NS, "text");
                                diffAndSetText(leftText, Math.abs(angle) + '');
                                diffAndSetAttribute(leftText, "x", ((-width / 2) - 0) + '');
                                diffAndSetAttribute(leftText, "y", (this.bankSizeRatio * angle - height / 2 + fontSize / 2) + '');
                                diffAndSetAttribute(leftText, "text-anchor", "end");
                                diffAndSetAttribute(leftText, "font-size", (fontSize * 1.2) + '');
                                diffAndSetAttribute(leftText, "font-family", "Roboto-Bold");
                                diffAndSetAttribute(leftText, "fill", "white");
                                this.attitude_pitch.appendChild(leftText);
                            }
                            if (angle < unusualAttitudeLowerLimit) {
                                let chevron = document.createElementNS(Avionics.SVG.NS, "path");
                                let path = "M" + -smallWidth / 2 + " " + (this.bankSizeRatio * nextAngle - bigHeight / 2) + " l" + smallWidth + "  0 ";
                                path += "L" + bigWidth / 2 + " " + (this.bankSizeRatio * angle - bigHeight / 2) + " l" + -smallWidth + " 0 ";
                                path += "L0 " + (this.bankSizeRatio * nextAngle + 20) + " ";
                                path += "L" + (-bigWidth / 2 + smallWidth) + " " + (this.bankSizeRatio * angle - bigHeight / 2) + " l" + -smallWidth + " 0 Z";
                                diffAndSetAttribute(chevron, "d", path);
                                diffAndSetAttribute(chevron, "fill", "red");
                                this.attitude_pitch.appendChild(chevron);
                            }
                            if (angle >= unusualAttitudeUpperLimit && nextAngle <= maxDash) {
                                let chevron = document.createElementNS(Avionics.SVG.NS, "path");
                                let path = "M" + -smallWidth / 2 + " " + (this.bankSizeRatio * angle - bigHeight / 2) + " l" + smallWidth + "  0 ";
                                path += "L" + (bigWidth / 2) + " " + (this.bankSizeRatio * nextAngle + bigHeight / 2) + " l" + -smallWidth + " 0 ";
                                path += "L0 " + (this.bankSizeRatio * angle - 20) + " ";
                                path += "L" + (-bigWidth / 2 + smallWidth) + " " + (this.bankSizeRatio * nextAngle + bigHeight / 2) + " l" + -smallWidth + " 0 Z";
                                diffAndSetAttribute(chevron, "d", path);
                                diffAndSetAttribute(chevron, "fill", "red");
                                this.attitude_pitch.appendChild(chevron);
                            }
                        }
                        angle = nextAngle;
                    }
                }
            }
        }
        {
            let attitudeContainer = document.createElement("div");
            diffAndSetAttribute(attitudeContainer, "id", "Attitude");
            attitudeContainer.style.top = "-20%";
            attitudeContainer.style.left = "-10%";
            attitudeContainer.style.width = "120%";
            attitudeContainer.style.height = "120%";
            attitudeContainer.style.position = "absolute";
            attitudeContainer.style.transform = "scale(1.35)";
            this.appendChild(attitudeContainer);
            this.attitude_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.attitude_root, "width", "100%");
            diffAndSetAttribute(this.attitude_root, "height", "100%");
            diffAndSetAttribute(this.attitude_root, "viewBox", "-200 -200 400 300");
            diffAndSetAttribute(this.attitude_root, "overflow", "visible");
            diffAndSetAttribute(this.attitude_root, "style", "position:absolute; z-index: 0");
            attitudeContainer.appendChild(this.attitude_root);
            {
                this.attitude_bank = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_root.appendChild(this.attitude_bank);
                let topTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(topTriangle, "d", "M0 -160 l-7.5 -10 l15 0 Z");
                diffAndSetAttribute(topTriangle, "fill", "white");
                diffAndSetAttribute(topTriangle, "stroke", "white");
                diffAndSetAttribute(topTriangle, "stroke-width", "12");
                diffAndSetAttribute(topTriangle, "stroke-opacity", "1");
                this.attitude_bank.appendChild(topTriangle);
                let smallDashesAngle = [-50, -40, -30, -20, -10, 10, 20, 30, 40, 50];
                let smallDashesHeight = [11, 11, 22, 11, 11, 11, 11, 22, 11, 11];
                let radius = 150;
                for (let i = 0; i < smallDashesAngle.length; i++) {
                    let dash = document.createElementNS(Avionics.SVG.NS, "line");
                    diffAndSetAttribute(dash, "x1", "0");
                    diffAndSetAttribute(dash, "y1", (-radius) + '');
                    diffAndSetAttribute(dash, "x2", "0");
                    diffAndSetAttribute(dash, "y2", (-radius - smallDashesHeight[i]) + '');
                    diffAndSetAttribute(dash, "fill", "none");
                    diffAndSetAttribute(dash, "stroke", "white");
                    diffAndSetAttribute(dash, "stroke-width", "2");
                    diffAndSetAttribute(dash, "transform", "rotate(" + smallDashesAngle[i] + ",0,0)");
                    this.attitude_bank.appendChild(dash);
                }
            }
            {
                let cursors = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_root.appendChild(cursors);
                let leftUpper = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(leftUpper, "d", "M-80 20 h 50 v 20 h 10 v -32 h -60 Z");
                diffAndSetAttribute(leftUpper, "fill", "black");
                diffAndSetAttribute(leftUpper, "stroke", "white");
                diffAndSetAttribute(leftUpper, "stroke-width", "2");
                diffAndSetAttribute(leftUpper, "stroke-opacity", "1.0");
                cursors.appendChild(leftUpper);
                let rightUpper = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(rightUpper, "d", "M80 20 h -50 v 20 h -10 v -32 h 60 Z");
                diffAndSetAttribute(rightUpper, "fill", "black");
                diffAndSetAttribute(rightUpper, "stroke", "white");
                diffAndSetAttribute(rightUpper, "stroke-width", "2");
                diffAndSetAttribute(rightUpper, "stroke-opacity", "1.0");
                cursors.appendChild(rightUpper);
                let centerRect = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(centerRect, "x", "-6");
                diffAndSetAttribute(centerRect, "y", "8");
                diffAndSetAttribute(centerRect, "height", "12");
                diffAndSetAttribute(centerRect, "width", "12");
                diffAndSetAttribute(centerRect, "stroke", "white");
                diffAndSetAttribute(centerRect, "stroke-width", "4");
                cursors.appendChild(centerRect);
                this.slipSkidTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.slipSkidTriangle, "d", "M0 -155 l-8 20 l16 0 Z");
                diffAndSetAttribute(this.slipSkidTriangle, "fill", "black");
                diffAndSetAttribute(this.slipSkidTriangle, "stroke", "white");
                diffAndSetAttribute(this.slipSkidTriangle, "stroke-width", "3");
                this.attitude_root.appendChild(this.slipSkidTriangle);
            }
        }
        this.applyAttributes();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "pitch":
                this.pitch = parseFloat(newValue);
                break;
            case "bank":
                this.bank = parseFloat(newValue);
                break;
            case "slip_skid":
                this.slipSkidValue = parseFloat(newValue);
                break;
            case "background":
                if (newValue == "false")
                    this.backgroundVisible = false;
                else
                    this.backgroundVisible = true;
                break;
            default:
                return;
        }
        this.applyAttributes();
    }
    applyAttributes() {
        if (this.bottomPart)
            diffAndSetAttribute(this.bottomPart, "transform", "rotate(" + this.bank + ", 0, 0) translate(0," + (this.pitch * this.bankSizeRatio) + ")");
        if (this.pitch_root_group)
            diffAndSetAttribute(this.pitch_root_group, "transform", "rotate(" + this.bank + ", 0, 0)");
        if (this.attitude_pitch)
            diffAndSetAttribute(this.attitude_pitch, "transform", "translate(0," + (this.pitch * this.bankSizeRatio * this.bankSizeRatioFactor) + ")");
        if (this.slipSkidTriangle)
            diffAndSetAttribute(this.slipSkidTriangle, "transform", "rotate(" + this.bank + ", 0, 0)");
        if (this.horizonTop) {
            if (this.backgroundVisible) {
                diffAndSetAttribute(this.horizonTop, "fill", this.horizonTopColor);
                diffAndSetAttribute(this.horizonBottom, "fill", this.horizonBottomColor);
            }
            else {
                diffAndSetAttribute(this.horizonTop, "fill", "transparent");
                diffAndSetAttribute(this.horizonBottom, "fill", "transparent");
            }
        }
    }
}
customElements.define('b747-8-sai-attitude-indicator', B747_8_SAI_AttitudeIndicator);
registerInstrument("b747-8-sai", B747_8_SAI);
//# sourceMappingURL=B747_8_SAI.js.map