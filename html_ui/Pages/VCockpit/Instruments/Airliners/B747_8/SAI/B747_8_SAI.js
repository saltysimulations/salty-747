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

        const isInitDone = SimVar.GetSimVarValue("L:SALTY_ISFD_INIT_DONE", "Bool");

        // Hide baro if init is not done
        if (isInitDone) {
            this.baroElement.style.display = "";
        } else {
            this.baroElement.style.display = "none";
        }
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
            this.svg.setAttribute("id", "ViewBox");
            this.svg.setAttribute("viewBox", "0 0 " + this.viewboxWidth + " " + this.viewboxHeight);
            var backgroundRect = document.createElementNS(Avionics.SVG.NS, "rect");
            backgroundRect.setAttribute("id", "backgroundRect");
            {
                backgroundRect.setAttribute("x", this.left.toString());
                backgroundRect.setAttribute("y", this.top.toString());
                backgroundRect.setAttribute("width", this.width.toString());
                backgroundRect.setAttribute("height", this.height.toString());
                backgroundRect.setAttribute("fill", this.backgroundColor);
                this.svg.appendChild(backgroundRect);
            }
            if (!this.line)
                this.line = document.createElementNS(Avionics.SVG.NS, "text");
            {
                this.line.setAttribute("x", (this.left + this.width - 2).toString());
                this.line.setAttribute("y", (this.height * 0.5).toString());
                this.line.setAttribute("fill", "lightgreen");
                this.line.setAttribute("font-size", "16");
                this.line.setAttribute("font-family", "BoeingEICAS");
                this.line.setAttribute("letter-spacing", "-1.5");
                this.line.setAttribute("text-anchor", "end");
                this.line.setAttribute("alignment-baseline", "central");
                this.line.textContent = "---";
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
            this.line.textContent = fastToFixed(pressure, 0) + " HPA".toUpperCase();
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
            this.svg.setAttribute("id", "ViewBox");
            this.svg.setAttribute("viewBox", "0 0 " + this.viewboxWidth + " " + this.viewboxHeight);
            var backgroundRect = document.createElementNS(Avionics.SVG.NS, "rect");
            backgroundRect.setAttribute("id", "backgroundRect");
            {
                backgroundRect.setAttribute("x", this.left.toString());
                backgroundRect.setAttribute("y", this.top.toString());
                backgroundRect.setAttribute("width", this.width.toString());
                backgroundRect.setAttribute("height", this.height.toString());
                backgroundRect.setAttribute("fill", this.backgroundColor);
                this.svg.appendChild(backgroundRect);
            }
            var backgroundArc = document.createElementNS(Avionics.SVG.NS, "g");
            backgroundArc.setAttribute("id", "backgroundArc");
            {
                var rect = document.createElementNS(Avionics.SVG.NS, "rect");
                rect.setAttribute("x", this.left.toString());
                rect.setAttribute("y", (this.top + this.height * 0.6).toString());
                rect.setAttribute("width", this.width.toString());
                rect.setAttribute("height", (this.height * 0.4).toString());
                rect.setAttribute("fill", this.backgroundActiveColor);
                backgroundArc.appendChild(rect);
                var arcHeight = 30;
                var arc = document.createElementNS(Avionics.SVG.NS, "path");
                arc.setAttribute("d", `M${this.left - 2} ${this.top + this.height * 0.6 + 1}` +
                    ` q ${(this.width + 4) * 0.5} -${arcHeight} ,${this.width + 4} 0`);
                arc.setAttribute("fill", this.backgroundActiveColor);
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
            this.rootSVG.setAttribute("id", "ViewBox");
            this.rootSVG.setAttribute("viewBox", "0 0 250 250");
            if (!this.rootGroup) {
                this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.rootGroup.setAttribute("id", "HS");
            }
            else {
                Utils.RemoveAllChildren(this.rootGroup);
            }
            if (!this.centerSVG) {
                this.centerSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                this.centerSVG.setAttribute("id", "CenterGroup");
            }
            else
                Utils.RemoveAllChildren(this.centerSVG);
            this.centerSVG.setAttribute("x", this.left.toString());
            this.centerSVG.setAttribute("y", this.top.toString());
            this.centerSVG.setAttribute("width", this.width.toString());
            this.centerSVG.setAttribute("height", this.height.toString());
            this.centerSVG.setAttribute("overflow", "hidden");
            this.centerSVG.setAttribute("viewBox", "0 0 " + this.width + " " + this.height);
            {
                var indicatorCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                {
                    indicatorCircle.setAttribute('cx', (this.width * .5).toString());
                    indicatorCircle.setAttribute('cy', (this.width * 1.38).toString());
                    indicatorCircle.setAttribute('r', (this.width * 1.2).toString());
                    indicatorCircle.setAttribute('fill', this.backgroundActiveColor);
                }
                this.centerSVG.appendChild(indicatorCircle);
                this.compassCircle = document.createElementNS(Avionics.SVG.NS, "g");
                {
                    {
                        let angle = 0;
                        for (let i = 0; i < 72; i++) {
                            let line = document.createElementNS(Avionics.SVG.NS, "rect");
                            let length = i % 2 == 0 ? 6 : 3;
                            line.setAttribute("x", "180");
                            line.setAttribute("y", (360 - length).toString());
                            line.setAttribute("width", "1");
                            line.setAttribute("height", length.toString());
                            line.setAttribute("transform", "rotate(" + ((-angle / Math.PI) * 180 + 180) + " 180 180)");
                            line.setAttribute("fill", "white");
                            line.setAttribute("class", "lines");
                            angle += (2 * Math.PI) / 72;
                            this.compassCircle.appendChild(line);
                        }
                    }
                    {
                        let texts = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35"];
                        let angle = 0;
                        for (let i = 0; i < texts.length; i++) {
                            let text = document.createElementNS(Avionics.SVG.NS, "text");
                            text.textContent = texts[i];
                            text.setAttribute("x", "180");
                            text.setAttribute("y", "12");
                            text.setAttribute("fill", "white");
                            text.setAttribute("font-size", "16");
                            text.setAttribute("font-family", "BoeingEICAS");
                            text.setAttribute("text-anchor", "middle");
                            text.setAttribute("alignment-baseline", "central");
                            text.setAttribute("transform", "rotate(" + angle + " 180 180)");
                            text.setAttribute("angle", angle.toString());
                            angle += 360 / texts.length;
                            this.compassCircle.appendChild(text);
                            this.compassCircleTexts.push(text);
                        }
                    }
                }
                this.centerSVG.appendChild(this.compassCircle);
                var cursor = document.createElementNS(Avionics.SVG.NS, "path");
                cursor.setAttribute("id", "cursor");
                {
                    var _left = this.width * 0.5;
                    var _top = 20;
                    var _triangleSize = 15;
                    cursor.setAttribute('d', `M${_left - _triangleSize * 0.5},${_top} ` +
                        `l ${_triangleSize * 1}, 0` +
                        `l -${_triangleSize * 0.5}, ${_triangleSize * 0.6}` +
                        `l -${_triangleSize * 0.5}, -${_triangleSize * 0.6}`);
                    cursor.setAttribute("fill", "transparent");
                    cursor.setAttribute("stroke", "white");
                    cursor.setAttribute("stroke-width", "2");
                }
                this.centerSVG.appendChild(cursor);
            }
            this.rootGroup.appendChild(this.centerSVG);
            this.rootSVG.appendChild(this.rootGroup);
            this.appendChild(this.rootSVG);

            this.hdgBox = document.querySelector("#hdg-box");
        };
    }
    connectedCallback() {
        this.construct();
    }
    update(_deltaTime) {
        let _compass = SimVar.GetSimVarValue("PLANE HEADING DEGREES MAGNETIC", "degree");
        this.compassCircle.setAttribute("transform", "translate(-108,27) rotate(" + (-_compass) + " 180 180)");
        this.compassCircleTexts.forEach((text) => {
            let angle = Number(text.getAttribute('angle'));
            let angleRatio = angle / 360;
            let compassRatio = _compass / 360;
            let ratioDifference = Math.abs(angleRatio - compassRatio);
            if (ratioDifference > 0.014) {
                text.setAttribute('font-size', "16");
            }
            else {
                text.setAttribute('font-size', "20");
            }
            
            const IRSState = SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum");

            // Compass visible / not visible depending on IRS
            if (IRSState <= 1) {
                text.style.display = "none";
                cursor.style.display = "none";
                let lines = document.getElementsByClassName("lines");
                for (let i = 0; i < lines.length; i++) {
                    lines[i].style.display = "none";
                }
                this.hdgBox.style.display = "";
            }
            if (IRSState == 2) {
                text.style.display = "";
                cursor.style.display = "";
                let lines = document.getElementsByClassName("lines");
                for (let i = 0; i < lines.length; i++) {
                    lines[i].style.display = "";
                }
                this.hdgBox.style.display = "none";
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
        this.rootSVG.setAttribute("id", "ViewBox");
        this.rootSVG.setAttribute("viewBox", "0 0 250 500");
        var borderRightWidth = 2;
        var width = 40 + borderRightWidth;
        var height = 250;
        var posX = width * 0.5;
        var posY = 0;
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.rootGroup.setAttribute("id", "Airspeed");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        if (!this.centerSVG) {
            this.centerSVG = document.createElementNS(Avionics.SVG.NS, "svg");
            this.centerSVG.setAttribute("id", "CenterGroup");
        }
        else
            Utils.RemoveAllChildren(this.centerSVG);
        this.centerSVG.setAttribute("x", (posX - width * 0.5).toString());
        this.centerSVG.setAttribute("y", posY.toString());
        this.centerSVG.setAttribute("width", width.toString());
        this.centerSVG.setAttribute("height", height.toString());
        this.centerSVG.setAttribute("viewBox", "0 0 " + width + " " + height);
        {
            var _top = 0;
            var _left = 0;
            var _width = width;
            var _height = height;
            var _borderWidth = borderRightWidth;
            var bg = document.createElementNS(Avionics.SVG.NS, "rect");
            bg.setAttribute("x", _left.toString());
            bg.setAttribute("y", _top.toString());
            bg.setAttribute("width", _width.toString());
            bg.setAttribute("height", _height.toString());
            bg.setAttribute("fill", this.backgroundColor);
            this.centerSVG.appendChild(bg);
            var border = document.createElementNS(Avionics.SVG.NS, "rect");
            border.setAttribute("x", (_width - _borderWidth).toString());
            border.setAttribute("y", _top.toString());
            border.setAttribute("width", "3");
            border.setAttribute("height", _height.toString());
            border.setAttribute("fill", "black");
            this.centerSVG.appendChild(border);
            var _graduationHeight = _height * 0.5;
            if (this.airspeeds) {
                var arcGroup = document.createElementNS(Avionics.SVG.NS, "g");
                arcGroup.setAttribute("id", "Arcs");
                {
                    this.arcs = [];
                    var _arcWidth = 18;
                    var _arcPosX = _left + (_width - _borderWidth) + 3;
                    var _arcStartPosY = _top + _graduationHeight;
                    var arcHeight = this.arcToSVG(this.airspeeds.greenEnd - this.airspeeds.greenStart);
                    var arcPosY = _arcStartPosY - this.arcToSVG(this.airspeeds.greenStart) - arcHeight;
                    var arc = document.createElementNS(Avionics.SVG.NS, "rect");
                    arc.setAttribute("x", _arcPosX.toString());
                    arc.setAttribute("y", arcPosY.toString());
                    arc.setAttribute("width", _arcWidth.toString());
                    arc.setAttribute("height", arcHeight.toString());
                    arc.setAttribute("fill", this.greenColor);
                    this.arcs.push(arc);
                    var arcHeight = this.arcToSVG(this.airspeeds.yellowEnd - this.airspeeds.yellowStart);
                    var arcPosY = _arcStartPosY - this.arcToSVG(this.airspeeds.yellowStart) - arcHeight;
                    var arc = document.createElementNS(Avionics.SVG.NS, "rect");
                    arc.setAttribute("x", _arcPosX.toString());
                    arc.setAttribute("y", arcPosY.toString());
                    arc.setAttribute("width", _arcWidth.toString());
                    arc.setAttribute("height", arcHeight.toString());
                    arc.setAttribute("fill", this.yellowColor);
                    this.arcs.push(arc);
                    var arcHeight = this.arcToSVG(this.airspeeds.redEnd - this.airspeeds.redStart);
                    var arcPosY = _arcStartPosY - this.arcToSVG(this.airspeeds.redStart) - arcHeight;
                    var arc = document.createElementNS(Avionics.SVG.NS, "rect");
                    arc.setAttribute("x", _arcPosX.toString());
                    arc.setAttribute("y", arcPosY.toString());
                    arc.setAttribute("width", _arcWidth.toString());
                    arc.setAttribute("height", arcHeight.toString());
                    arc.setAttribute("fill", this.redColor);
                    this.arcs.push(arc);
                    var arcHeight = this.arcToSVG(this.airspeeds.whiteEnd - this.airspeeds.whiteStart);
                    var arcPosY = _arcStartPosY - this.arcToSVG(this.airspeeds.whiteStart) - arcHeight;
                    var arc = document.createElementNS(Avionics.SVG.NS, "rect");
                    arc.setAttribute("x", (_arcPosX + _arcWidth * 0.5).toString());
                    arc.setAttribute("y", arcPosY.toString());
                    arc.setAttribute("width", (_arcWidth * 0.5).toString());
                    arc.setAttribute("height", arcHeight.toString());
                    arc.setAttribute("fill", "white");
                    this.arcs.push(arc);
                    for (var i = 0; i < this.arcs.length; i++) {
                        arcGroup.appendChild(this.arcs[i]);
                    }
                    this.centerSVG.appendChild(arcGroup);
                }
            }
            var graduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
            graduationGroup.setAttribute("id", "Graduations");
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
                    line.SVGLine.setAttribute("x", linePosX.toString());
                    line.SVGLine.setAttribute("width", lineWidth.toString());
                    line.SVGLine.setAttribute("height", lineHeight.toString());
                    line.SVGLine.setAttribute("fill", "white");
                    if (mod == 0) {
                        line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                        line.SVGText1.setAttribute("x", (linePosX - 2).toString());
                        line.SVGText1.setAttribute("fill", "white");
                        line.SVGText1.setAttribute("font-size", (this.fontSize * 0.65).toString());
                        line.SVGText1.setAttribute("font-family", "BoeingEICAS");
                        line.SVGText1.setAttribute("letter-spacing", "-1.5");
                        line.SVGText1.setAttribute("text-anchor", "end");
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
        }
        this.rootGroup.appendChild(this.centerSVG);
        var cursorPosX = _left - 2;
        var cursorPosY = _top + _height * 0.5 + 5;
        var cursorWidth = _width + 5;
        var cursorHeight = 39;
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
            var rect = document.createElementNS(Avionics.SVG.NS, "rect");
            rect.setAttribute("x", "0");
            rect.setAttribute("y", "0");
            rect.setAttribute("width", cursorWidth.toString());
            rect.setAttribute("height", cursorHeight.toString());
            rect.setAttribute("fill", "black");
            rect.setAttribute("stroke", "white");
            rect.setAttribute("stroke-width", "4");
            this.cursorSVG.appendChild(rect);
            var _cursorPosX = this.graduationScrollPosX + 8;
            var _cursorPosY = cursorHeight * 0.5;
            this.cursorIntegrals[0].construct(this.cursorSVG, _cursorPosX - 30, _cursorPosY, _width, "BoeingEICAS", this.fontSize, "white");
            this.cursorIntegrals[1].construct(this.cursorSVG, _cursorPosX - 17, _cursorPosY, _width, "BoeingEICAS", this.fontSize, "white");
            this.cursorDecimals.construct(this.cursorSVG, _cursorPosX - 2, _cursorPosY, _width, "BoeingEICAS", this.fontSize, "white");
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

        let graduations = document.querySelector("#Graduations");
        const isInitDone = SimVar.GetSimVarValue("L:SALTY_ISFD_INIT_DONE", "Bool");
        const initSequenceTimerValue = SimVar.GetSimVarValue("L:SALTY_ISFD_INIT_TIMER", "Enum");

        // Show "lines" and numbers on the IAS indicator a while into the init sequence
        if (initSequenceTimerValue > 75 && !isInitDone) {
            graduations.style.display = "none";
        } else {
            graduations.style.display = "";
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
                    this.graduations[i].SVGLine.setAttribute("transform", "translate(" + posX.toString() + " " + posY.toString() + ")");
                    if (this.graduations[i].SVGText1) {
                        this.graduations[i].SVGText1.textContent = currentVal.toString();
                        this.graduations[i].SVGText1.setAttribute("transform", "translate(" + posX.toString() + " " + posY.toString() + ")");
                    }
                }
                if (this.graduations[i].SVGText1)
                    currentVal = this.graduationScroller.nextValue;
                currentY -= this.graduationSpacing;
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
        this.rootSVG.setAttribute("id", "ViewBox");
        this.rootSVG.setAttribute("viewBox", "0 0 250 500");
        var width = 80;
        var height = 250;
        var borderwidth = 2;
        var posX = 20 + width * 0.5;
        var posY = 0;
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.rootGroup.setAttribute("id", "Altimeter");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        if (!this.centerSVG) {
            this.centerSVG = document.createElementNS(Avionics.SVG.NS, "svg");
            this.centerSVG.setAttribute("id", "CenterGroup");
        }
        else
            Utils.RemoveAllChildren(this.centerSVG);
        this.centerSVG.setAttribute("x", posX.toString());
        this.centerSVG.setAttribute("y", posY.toString());
        this.centerSVG.setAttribute("width", width.toString());
        this.centerSVG.setAttribute("height", height.toString());
        this.centerSVG.setAttribute("viewBox", "0 0 " + width + " " + height);
        this.centerSVG.setAttribute("overflow", "hidden");
        {
            var _top = 0;
            var _left = 0;
            var _width = width;
            var _height = height;
            var bg = document.createElementNS(Avionics.SVG.NS, "rect");
            bg.setAttribute("x", _left.toString());
            bg.setAttribute("y", _top.toString());
            bg.setAttribute("width", _width.toString());
            bg.setAttribute("height", _height.toString());
            bg.setAttribute("fill", this.backgroundColor);
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
                line.SVGLine.setAttribute("x", "0");
                line.SVGLine.setAttribute("width", lineWidth.toString());
                line.SVGLine.setAttribute("height", "2");
                line.SVGLine.setAttribute("fill", "white");
                if (line.IsPrimary) {
                    line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                    line.SVGText1.setAttribute("x", (posX + 6).toString());
                    line.SVGText1.setAttribute("fill", "white");
                    line.SVGText1.setAttribute("font-size", (this.fontSize * 0.75).toString());
                    line.SVGText1.setAttribute("font-family", "BoeingEICAS");
                    line.SVGText1.setAttribute("letter-spacing", "-1.5");
                    line.SVGText1.setAttribute("text-anchor", "end");
                    line.SVGText1.setAttribute("alignment-baseline", "central");
                }
                this.graduations.push(line);
            }
            var graduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
            graduationGroup.setAttribute("id", "graduationGroup");
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
        border.setAttribute("x", "0");
        border.setAttribute("y", "0");
        border.setAttribute("width", borderwidth.toString());
        border.setAttribute("height", _height.toString());
        border.setAttribute("fill", "black");
        this.centerSVG.appendChild(border);
        this.rootGroup.appendChild(this.centerSVG);
        var cursorPosX = 6.5 + width * 0.5;
        var cursorPosY = _top + _height * 0.5 + 5;
        var cursorWidth = width;
        var cursorHeight = 39;
        if (!this.cursorSVG) {
            this.cursorSVG = document.createElementNS(Avionics.SVG.NS, "svg");
            this.cursorSVG.setAttribute("id", "CursorGroup");
        }
        else {
            Utils.RemoveAllChildren(this.cursorSVG);
        }
        this.cursorSVG.setAttribute("x", cursorPosX.toString());
        this.cursorSVG.setAttribute("y", (cursorPosY - cursorHeight * 0.5).toString());
        this.cursorSVG.setAttribute("width", cursorWidth.toString());
        this.cursorSVG.setAttribute("height", cursorHeight.toString());
        this.cursorSVG.setAttribute("viewBox", "0 0 " + cursorWidth.toString() + " " + cursorHeight.toString());
        {
            if (!this.cursorSVGShape)
                this.cursorSVGShape = document.createElementNS(Avionics.SVG.NS, "rect");
            this.cursorSVGShape.setAttribute("fill", "black");
            this.cursorSVGShape.setAttribute("width", cursorWidth.toString());
            this.cursorSVGShape.setAttribute("height", cursorHeight.toString());
            this.cursorSVGShape.setAttribute("stroke", "transparent");
            this.cursorSVGShape.setAttribute("stroke-width", "4");
            this.cursorSVG.appendChild(this.cursorSVGShape);
            var _cursorPosX = width - 5;
            var _cursorPosY = cursorHeight * 0.5;
            this.cursorIntegrals[0].construct(this.cursorSVG, _cursorPosX - 55, _cursorPosY, _width, "BoeingEICAS", this.fontSize, "white");
            this.cursorIntegrals[1].construct(this.cursorSVG, _cursorPosX - 40, _cursorPosY, _width, "BoeingEICAS", this.fontSize, "white");
            this.cursorIntegrals[2].construct(this.cursorSVG, _cursorPosX - 25, _cursorPosY, _width, "BoeingEICAS", this.fontSize, "white");
            this.cursorDecimals.construct(this.cursorSVG, _cursorPosX, _cursorPosY, _width, "BoeingEICAS", this.fontSize * 0.75, "white");
            if (!this.cursorSVGAltitudeLevelShape)
                this.cursorSVGAltitudeLevelShape = document.createElementNS(Avionics.SVG.NS, "rect");
            this.cursorSVGAltitudeLevelShape.setAttribute("fill", "rgb(96, 255, 5)");
            this.cursorSVGAltitudeLevelShape.setAttribute("x", "7");
            this.cursorSVGAltitudeLevelShape.setAttribute("y", ((cursorHeight * 0.5) * 0.5).toString());
            this.cursorSVGAltitudeLevelShape.setAttribute("width", "12");
            this.cursorSVGAltitudeLevelShape.setAttribute("height", (cursorHeight * 0.5).toString());
            this.cursorSVG.appendChild(this.cursorSVGAltitudeLevelShape);
            if (!this.cursorSVGShapeBorder)
                this.cursorSVGShapeBorder = document.createElementNS(Avionics.SVG.NS, "rect");
            this.cursorSVGShapeBorder.setAttribute("fill", "transparent");
            this.cursorSVGShapeBorder.setAttribute("width", cursorWidth.toString());
            this.cursorSVGShapeBorder.setAttribute("height", cursorHeight.toString());
            this.cursorSVGShapeBorder.setAttribute("stroke", "white");
            this.cursorSVGShapeBorder.setAttribute("stroke-width", "4");
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

        let graduations = document.querySelector("#graduationGroup");
        const isInitDone = SimVar.GetSimVarValue("L:SALTY_ISFD_INIT_DONE", "Bool");
        const initSequenceTimerValue = SimVar.GetSimVarValue("L:SALTY_ISFD_INIT_TIMER", "Enum");
        
        // Show "lines" and numbers on altitude indicator a while into the init sequence
        if (initSequenceTimerValue > 75 && !isInitDone) {
            graduations.style.display = "none";
        } else {
            graduations.style.display = "";
        }
        
    }
    updateBaroPressure() {
        if (this.pressureSVG) {
            var pressure = SimVar.GetSimVarValue("KOHLSMAN SETTING HG:2", "inches of mercury");
            this.pressureSVG.textContent = fastToFixed(pressure, 2) + " in";
        }
    }
    updateGraduationScrolling(_altitude) {
        if (this.graduations) {
            this.graduationScroller.scroll(_altitude);
            var currentVal = this.graduationScroller.firstValue;
            var currentY = this.graduationScrollPosY + this.graduationScroller.offsetY * this.graduationSpacing * (this.nbSecondaryGraduations + 1);
            var firstRoundValueY = currentY;
            for (var i = 0; i < this.totalGraduations; i++) {
                var posX = this.graduationScrollPosX;
                var posY = Math.round(currentY);
                this.graduations[i].SVGLine.setAttribute("transform", "translate(" + posX.toString() + " " + posY.toString() + ")");
                if (this.graduations[i].SVGText1) {
                    var roundedVal = 0;
                    roundedVal = Math.floor(Math.abs(currentVal));
                    var integral = Math.floor(roundedVal);
                    this.graduations[i].SVGText1.textContent = integral.toString();
                    this.graduations[i].SVGText1.setAttribute("transform", "translate(" + posX.toString() + " " + posY.toString() + ")");
                    if (this.graduations[i].SVGText2)
                        this.graduations[i].SVGText2.setAttribute("transform", "translate(" + posX.toString() + " " + posY.toString() + ")");
                    firstRoundValueY = posY;
                    currentVal = this.graduationScroller.nextValue;
                }
                currentY -= this.graduationSpacing;
            }
            if (this.graduationBarSVG) {
                this.graduationBarSVG.setAttribute("transform", "translate(0 " + firstRoundValueY + ")");
            }
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
        this.attitudeElement.setAttribute("is-backup", "true");
        if (this.gps) {
            var aspectRatio = this.gps.getAspectRatio();
            this.attitudeElement.setAttribute("aspect-ratio", aspectRatio.toString());
        }

        // INIT SEQUENCE
        this.initSequenceTimer = -1;
        this.initSequenceStarted = false;
        this.initBox = document.querySelector("#init-box");
        this.initSeconds = document.querySelector("#init-seconds");
        this.spdBox = document.querySelector("#spd-box");
        this.altBox = document.querySelector("#alt-box");
        this.attBox = document.querySelector("#att-box");
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        var xyz = Simplane.getOrientationAxis();
        if (xyz) {
            this.attitudeElement.setAttribute("pitch", (xyz.pitch / Math.PI * 180).toString());
            this.attitudeElement.setAttribute("bank", (xyz.bank / Math.PI * 180).toString());
            this.attitudeElement.setAttribute("slip_skid", Simplane.getInclinometer().toString());
        }

        const isISFDOn = SimVar.GetSimVarValue("L:B747_8_SAI_State", "Bool");
        const isInitDone = SimVar.GetSimVarValue("L:SALTY_ISFD_INIT_DONE", "Bool");
        const IRSState = SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum");

        /* _deltaTime provides the wrong value if the screen refresh rate is set to low or medium in the settings - 
        therefore, this method of getting the deltatime is being used here. In the future, this could be moved to Salty Core or Utils.*/ 
        var timeNow = Date.now();
        if (this.lastTime == null) this.lastTime = timeNow;
        var deltaTime = timeNow - this.lastTime;
        this.lastTime = timeNow;

        if (IRSState == 2) SimVar.SetSimVarValue("L:SALTY_ISFD_INIT_DONE", "Bool", 1);

        if (!this.initSequenceStarted && isISFDOn && !SimVar.GetSimVarValue("L:SALTY_ISFD_INIT_DONE", "Bool")) {
            this.initBox.style.display = "block";
            this.initSequenceTimer = 90;
            this.initSequenceStarted = true;
        }

        // Init sequence timer
        if (this.initSequenceTimer >= 0) {
            this.initSeconds.innerHTML = Math.round(this.initSequenceTimer) + " S"
            this.initSequenceTimer -= deltaTime / 1000;
            if (this.initSequenceTimer <= 0) {
                this.initBox.style.display = "none";
                SimVar.SetSimVarValue("L:SALTY_ISFD_INIT_DONE", "Bool", 1);
            }
            SimVar.SetSimVarValue("L:SALTY_ISFD_INIT_TIMER", "Enum", Math.round(this.initSequenceTimer));
        }

        // Remove SPD and ALT boxes 15 seconds into INIT sequence, also remove ATT if it is done
        if (!isInitDone) {
            this.attitudeElement.style.display = "none";
            if (Math.round(this.initSequenceTimer) <= 75) {
                this.spdBox.style.display = "none";
                this.altBox.style.display = "none";
            } else {
                this.spdBox.style.display = "";
                this.altBox.style.display = "";
            } 
        } else {
            this.spdBox.style.display = "none";
            this.altBox.style.display = "none";
            this.attBox.style.display = "none";
            this.attitudeElement.style.display = "";
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
            this.horizon_root.setAttribute("width", "100%");
            this.horizon_root.setAttribute("height", "100%");
            this.horizon_root.setAttribute("viewBox", "-200 -200 400 300");
            this.horizon_root.setAttribute("x", "-100");
            this.horizon_root.setAttribute("y", "-100");
            this.horizon_root.setAttribute("overflow", "visible");
            this.horizon_root.setAttribute("style", "position:absolute; z-index: -3; width: 100%; height:100%;");
            this.horizon_root.setAttribute("transform", "translate(0, 100)");
            this.appendChild(this.horizon_root);
            this.horizonTopColor = "#0d47a1";
            this.horizonBottomColor = "#6c4f23";
            this.horizonTop = document.createElementNS(Avionics.SVG.NS, "rect");
            this.horizonTop.setAttribute("fill", (this.backgroundVisible) ? this.horizonTopColor : "transparent");
            this.horizonTop.setAttribute("x", "-1000");
            this.horizonTop.setAttribute("y", "-1000");
            this.horizonTop.setAttribute("width", "2000");
            this.horizonTop.setAttribute("height", "2000");
            this.horizon_root.appendChild(this.horizonTop);
            this.bottomPart = document.createElementNS(Avionics.SVG.NS, "g");
            this.horizon_root.appendChild(this.bottomPart);
            this.horizonBottom = document.createElementNS(Avionics.SVG.NS, "rect");
            this.horizonBottom.setAttribute("fill", (this.backgroundVisible) ? this.horizonBottomColor : "transparent");
            this.horizonBottom.setAttribute("x", "-1500");
            this.horizonBottom.setAttribute("y", "0");
            this.horizonBottom.setAttribute("width", "3000");
            this.horizonBottom.setAttribute("height", "3000");
            this.bottomPart.appendChild(this.horizonBottom);
            let separator = document.createElementNS(Avionics.SVG.NS, "rect");
            separator.setAttribute("fill", "#e0e0e0");
            separator.setAttribute("x", "-1500");
            separator.setAttribute("y", "-3");
            separator.setAttribute("width", "3000");
            separator.setAttribute("height", "6");
            this.bottomPart.appendChild(separator);
        }
        {
            let pitchContainer = document.createElement("div");
            pitchContainer.setAttribute("id", "Pitch");
            pitchContainer.style.top = "-14%";
            pitchContainer.style.left = "-10%";
            pitchContainer.style.width = "120%";
            pitchContainer.style.height = "120%";
            pitchContainer.style.position = "absolute";
            pitchContainer.style.transform = "scale(1.35)";
            this.appendChild(pitchContainer);
            this.pitch_root = document.createElementNS(Avionics.SVG.NS, "svg");
            this.pitch_root.setAttribute("width", "100%");
            this.pitch_root.setAttribute("height", "100%");
            this.pitch_root.setAttribute("viewBox", "-200 -200 400 300");
            this.pitch_root.setAttribute("overflow", "visible");
            this.pitch_root.setAttribute("style", "position:absolute; z-index: -2;");
            pitchContainer.appendChild(this.pitch_root);
            {
                this.pitch_root_group = document.createElementNS(Avionics.SVG.NS, "g");
                this.pitch_root.appendChild(this.pitch_root_group);
                var x = -115;
                var y = -150;
                var w = 230;
                var h = 300;
                let attitudePitchContainer = document.createElementNS(Avionics.SVG.NS, "svg");
                attitudePitchContainer.setAttribute("width", w.toString());
                attitudePitchContainer.setAttribute("height", h.toString());
                attitudePitchContainer.setAttribute("x", x.toString());
                attitudePitchContainer.setAttribute("y", y.toString());
                attitudePitchContainer.setAttribute("viewBox", x + " " + y + " " + w + " " + h);
                attitudePitchContainer.setAttribute("overflow", "hidden");
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
                            rect.setAttribute("fill", "white");
                            rect.setAttribute("x", (-width / 2).toString());
                            rect.setAttribute("y", (this.bankSizeRatio * angle - height / 2).toString());
                            rect.setAttribute("width", width.toString());
                            rect.setAttribute("height", height.toString());
                            this.attitude_pitch.appendChild(rect);
                            if (text) {
                                let leftText = document.createElementNS(Avionics.SVG.NS, "text");
                                leftText.textContent = Math.abs(angle).toString();
                                leftText.setAttribute("x", ((-width / 2) - 0).toString());
                                leftText.setAttribute("y", (this.bankSizeRatio * angle - height / 2 + fontSize / 2).toString());
                                leftText.setAttribute("text-anchor", "end");
                                leftText.setAttribute("font-size", (fontSize * 1.2).toString());
                                leftText.setAttribute("font-family", "BoeingEICAS");
                                leftText.setAttribute("fill", "white");
                                this.attitude_pitch.appendChild(leftText);
                            }
                            if (angle < unusualAttitudeLowerLimit) {
                                let chevron = document.createElementNS(Avionics.SVG.NS, "path");
                                let path = "M" + -smallWidth / 2 + " " + (this.bankSizeRatio * nextAngle - bigHeight / 2) + " l" + smallWidth + "  0 ";
                                path += "L" + bigWidth / 2 + " " + (this.bankSizeRatio * angle - bigHeight / 2) + " l" + -smallWidth + " 0 ";
                                path += "L0 " + (this.bankSizeRatio * nextAngle + 20) + " ";
                                path += "L" + (-bigWidth / 2 + smallWidth) + " " + (this.bankSizeRatio * angle - bigHeight / 2) + " l" + -smallWidth + " 0 Z";
                                chevron.setAttribute("d", path);
                                chevron.setAttribute("fill", "red");
                                this.attitude_pitch.appendChild(chevron);
                            }
                            if (angle >= unusualAttitudeUpperLimit && nextAngle <= maxDash) {
                                let chevron = document.createElementNS(Avionics.SVG.NS, "path");
                                let path = "M" + -smallWidth / 2 + " " + (this.bankSizeRatio * angle - bigHeight / 2) + " l" + smallWidth + "  0 ";
                                path += "L" + (bigWidth / 2) + " " + (this.bankSizeRatio * nextAngle + bigHeight / 2) + " l" + -smallWidth + " 0 ";
                                path += "L0 " + (this.bankSizeRatio * angle - 20) + " ";
                                path += "L" + (-bigWidth / 2 + smallWidth) + " " + (this.bankSizeRatio * nextAngle + bigHeight / 2) + " l" + -smallWidth + " 0 Z";
                                chevron.setAttribute("d", path);
                                chevron.setAttribute("fill", "red");
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
            attitudeContainer.setAttribute("id", "Attitude");
            attitudeContainer.style.top = "-20%";
            attitudeContainer.style.left = "-10%";
            attitudeContainer.style.width = "120%";
            attitudeContainer.style.height = "120%";
            attitudeContainer.style.position = "absolute";
            attitudeContainer.style.transform = "scale(1.35)";
            this.appendChild(attitudeContainer);
            this.attitude_root = document.createElementNS(Avionics.SVG.NS, "svg");
            this.attitude_root.setAttribute("width", "100%");
            this.attitude_root.setAttribute("height", "100%");
            this.attitude_root.setAttribute("viewBox", "-200 -200 400 300");
            this.attitude_root.setAttribute("overflow", "visible");
            this.attitude_root.setAttribute("style", "position:absolute; z-index: 0");
            attitudeContainer.appendChild(this.attitude_root);
            {
                this.attitude_bank = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_root.appendChild(this.attitude_bank);
                let topTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                topTriangle.setAttribute("d", "M0 -160 l-7.5 -10 l15 0 Z");
                topTriangle.setAttribute("fill", "white");
                topTriangle.setAttribute("stroke", "white");
                topTriangle.setAttribute("stroke-width", "12");
                topTriangle.setAttribute("stroke-opacity", "1");
                this.attitude_bank.appendChild(topTriangle);
                let smallDashesAngle = [-50, -40, -30, -20, -10, 10, 20, 30, 40, 50];
                let smallDashesHeight = [11, 11, 22, 11, 11, 11, 11, 22, 11, 11];
                let radius = 150;
                for (let i = 0; i < smallDashesAngle.length; i++) {
                    let dash = document.createElementNS(Avionics.SVG.NS, "line");
                    dash.setAttribute("x1", "0");
                    dash.setAttribute("y1", (-radius).toString());
                    dash.setAttribute("x2", "0");
                    dash.setAttribute("y2", (-radius - smallDashesHeight[i]).toString());
                    dash.setAttribute("fill", "none");
                    dash.setAttribute("stroke", "white");
                    dash.setAttribute("stroke-width", "2");
                    dash.setAttribute("transform", "rotate(" + smallDashesAngle[i] + ",0,0)");
                    this.attitude_bank.appendChild(dash);
                }
            }
            {
                let cursors = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_root.appendChild(cursors);
                let leftUpper = document.createElementNS(Avionics.SVG.NS, "path");
                leftUpper.setAttribute("d", "M-80 20 h 50 v 20 h 10 v -32 h -60 Z");
                leftUpper.setAttribute("fill", "black");
                leftUpper.setAttribute("stroke", "white");
                leftUpper.setAttribute("stroke-width", "2");
                leftUpper.setAttribute("stroke-opacity", "1.0");
                cursors.appendChild(leftUpper);
                let rightUpper = document.createElementNS(Avionics.SVG.NS, "path");
                rightUpper.setAttribute("d", "M80 20 h -50 v 20 h -10 v -32 h 60 Z");
                rightUpper.setAttribute("fill", "black");
                rightUpper.setAttribute("stroke", "white");
                rightUpper.setAttribute("stroke-width", "2");
                rightUpper.setAttribute("stroke-opacity", "1.0");
                cursors.appendChild(rightUpper);
                let centerRect = document.createElementNS(Avionics.SVG.NS, "rect");
                centerRect.setAttribute("x", "-6");
                centerRect.setAttribute("y", "8");
                centerRect.setAttribute("height", "12");
                centerRect.setAttribute("width", "12");
                centerRect.setAttribute("stroke", "white");
                centerRect.setAttribute("stroke-width", "4");
                cursors.appendChild(centerRect);
                this.slipSkidTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                this.slipSkidTriangle.setAttribute("d", "M0 -155 l-8 20 l16 0 Z");
                this.slipSkidTriangle.setAttribute("fill", "black");
                this.slipSkidTriangle.setAttribute("stroke", "white");
                this.slipSkidTriangle.setAttribute("stroke-width", "3");
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
            this.bottomPart.setAttribute("transform", "rotate(" + this.bank + ", 0, 0) translate(0," + (this.pitch * this.bankSizeRatio) + ")");
        if (this.pitch_root_group)
            this.pitch_root_group.setAttribute("transform", "rotate(" + this.bank + ", 0, 0)");
        if (this.attitude_pitch)
            this.attitude_pitch.setAttribute("transform", "translate(0," + (this.pitch * this.bankSizeRatio * this.bankSizeRatioFactor) + ")");
        if (this.slipSkidTriangle)
            this.slipSkidTriangle.setAttribute("transform", "rotate(" + this.bank + ", 0, 0)");
        if (this.horizonTop) {
            if (this.backgroundVisible) {
                this.horizonTop.setAttribute("fill", this.horizonTopColor);
                this.horizonBottom.setAttribute("fill", this.horizonBottomColor);
            }
            else {
                this.horizonTop.setAttribute("fill", "transparent");
                this.horizonBottom.setAttribute("fill", "transparent");
            }
        }
    }
}
customElements.define('b747-8-sai-attitude-indicator', B747_8_SAI_AttitudeIndicator);
registerInstrument("b747-8-sai", B747_8_SAI);
//# sourceMappingURL=B747_8_SAI.js.map