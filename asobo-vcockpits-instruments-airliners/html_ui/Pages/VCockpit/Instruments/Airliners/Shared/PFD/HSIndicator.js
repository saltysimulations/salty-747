class Jet_PFD_HSIndicator extends HTMLElement {
    constructor() {
        super(...arguments);
        this.cursorOpacity = "1.0";
        this.strokeOpacity = "0.75";
        this.strokeColor = "rgb(255,255,255)";
        this.strokeSize = 6;
        this.fontSize = 25;
        this.refStartX = 0;
        this.refWidth = 0;
        this.graduationScrollPosX = 0;
        this.graduationScrollPosY = 0;
        this.nbPrimaryGraduations = 7;
        this.nbSecondaryGraduations = 1;
        this.totalGraduations = this.nbPrimaryGraduations + ((this.nbPrimaryGraduations - 1) * this.nbSecondaryGraduations);
        this.graduationSpacing = 50;
        this._showILS = false;
        this._aircraft = Aircraft.A320_NEO;
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
    showILS(_val) {
        this._showILS = _val;
        if (!this._showILS) {
            diffAndSetAttribute(this.ILSBeaconGroup, "visibility", "hidden");
            diffAndSetAttribute(this.ILSOffscreenGroup, "visibility", "hidden");
        }
    }
    construct() {
        Utils.RemoveAllChildren(this);
        if (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B) {
            this.construct_B747_8();
        }
        else if (this.aircraft == Aircraft.AS03D) {
            this.construct_AS03D();
        }
        else {
            this.construct_A320_Neo();
        }
    }
    construct_B747_8() {
        let posX = 0;
        let posY = 0;
        let width = 400;
        let height = 400;
        this.nbPrimaryGraduations = 7;
        this.nbSecondaryGraduations = 1;
        this.totalGraduations = this.nbPrimaryGraduations + ((this.nbPrimaryGraduations - 1) * this.nbSecondaryGraduations);
        this.graduationSpacing = 50;
        this.graduationScroller = new Avionics.Scroller(this.nbPrimaryGraduations, 10, true, 360);
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 " + width + " " + height);
        {
            let circleRadius = 80;
            this.rotatingCompass = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rotatingCompass, "id", "Circle");
            this.rootSVG.appendChild(this.rotatingCompass);
            {
                this.rotatingCompassX = posX + width * 0.5;
                this.rotatingCompassY = posY + height * 0.5;
                {
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", this.rotatingCompassX + '');
                    diffAndSetAttribute(circle, "cy", this.rotatingCompassY + '');
                    diffAndSetAttribute(circle, "r", circleRadius + '');
                    diffAndSetAttribute(circle, "fill", "#343B51");
                    this.rotatingCompass.appendChild(circle);
                }
                let graduationsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(graduationsGroup, "id", "Graduations");
                this.rotatingCompass.appendChild(graduationsGroup);
                {
                    let angle = 0;
                    for (let i = 0; i < 72; i++) {
                        let isPrimary = (i % 2 == 0) ? true : false;
                        let length = (isPrimary) ? 3 : 2;
                        let line = document.createElementNS(Avionics.SVG.NS, "line");
                        diffAndSetAttribute(line, "x1", this.rotatingCompassX + '');
                        diffAndSetAttribute(line, "y1", (this.rotatingCompassY - circleRadius) + '');
                        diffAndSetAttribute(line, "x2", this.rotatingCompassX + '');
                        diffAndSetAttribute(line, "y2", (this.rotatingCompassY - circleRadius + length) + '');
                        diffAndSetAttribute(line, "stroke", "white");
                        diffAndSetAttribute(line, "stroke-width", "0.75");
                        diffAndSetAttribute(line, "transform", "rotate(" + angle + " " + this.rotatingCompassX + " " + this.rotatingCompassY + ")");
                        graduationsGroup.appendChild(line);
                        if (isPrimary) {
                            let fontSize = (this.fontSize * 0.20);
                            if (angle % 90 == 0)
                                fontSize = (this.fontSize * 0.3);
                            let text = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetText(text, (angle / 10) + '');
                            diffAndSetAttribute(text, "x", this.rotatingCompassX + '');
                            diffAndSetAttribute(text, "y", (this.rotatingCompassY - circleRadius + length + 4) + '');
                            diffAndSetAttribute(text, "fill", "white");
                            diffAndSetAttribute(text, "font-size", fontSize + '');
                            diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                            diffAndSetAttribute(text, "text-anchor", "middle");
                            diffAndSetAttribute(text, "alignment-baseline", "central");
                            diffAndSetAttribute(text, "transform", "rotate(" + angle + " " + this.rotatingCompassX + " " + this.rotatingCompassY + ")");
                            graduationsGroup.appendChild(text);
                        }
                        angle += 360 / 72;
                    }
                }
            }
            this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.selectedHeadingGroup, "id", "selectedHeadingGroup");
            this.rootSVG.appendChild(this.selectedHeadingGroup);
            {
                this.selectedHeadingLine = Avionics.SVG.computeDashLine(this.rotatingCompassX, this.rotatingCompassY, (-circleRadius), 15, 1, "#ff00e0");
                diffAndSetAttribute(this.selectedHeadingLine, "id", "selectedHeadingLine");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingLine);
                this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.selectedHeadingBug, "id", "Heading");
                diffAndSetAttribute(this.selectedHeadingBug, "fill", "transparent");
                diffAndSetAttribute(this.selectedHeadingBug, "stroke", "#FF0CE2");
                diffAndSetAttribute(this.selectedHeadingBug, "stroke-width", "0.75");
                diffAndSetAttribute(this.selectedHeadingBug, "d", "M " + this.rotatingCompassX + " " + (this.rotatingCompassY - circleRadius) + " l-6 0 l0 -5 l3 0 l3 5 l3 -5 l3 0 l0 5 Z");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
            }
            this.currentTrackGroup = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(this.currentTrackGroup, "id", "CurrentTrack");
            diffAndSetAttribute(this.currentTrackGroup, "x1", this.rotatingCompassX + '');
            diffAndSetAttribute(this.currentTrackGroup, "y1", this.rotatingCompassY + '');
            diffAndSetAttribute(this.currentTrackGroup, "x2", this.rotatingCompassX + '');
            diffAndSetAttribute(this.currentTrackGroup, "y2", (this.rotatingCompassY - circleRadius) + '');
            diffAndSetAttribute(this.currentTrackGroup, "stroke", "white");
            diffAndSetAttribute(this.currentTrackGroup, "stroke-width", "0.75");
            this.rootSVG.appendChild(this.currentTrackGroup);
            let fixedElements = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(fixedElements, "id", "FixedElements");
            this.rootSVG.appendChild(fixedElements);
            {
                this.selectedHeadingText = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.selectedHeadingText, "135H");
                diffAndSetAttribute(this.selectedHeadingText, "x", (this.rotatingCompassX - circleRadius * 0.225) + '');
                diffAndSetAttribute(this.selectedHeadingText, "y", (this.rotatingCompassY - circleRadius * 0.725) + '');
                diffAndSetAttribute(this.selectedHeadingText, "fill", "#FF0CE2");
                diffAndSetAttribute(this.selectedHeadingText, "font-size", (this.fontSize * 0.25) + '');
                diffAndSetAttribute(this.selectedHeadingText, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.selectedHeadingText, "text-anchor", "start");
                diffAndSetAttribute(this.selectedHeadingText, "alignment-baseline", "central");
                fixedElements.appendChild(this.selectedHeadingText);
                this.selectedHeadingTextRef = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.selectedHeadingTextRef, "MAG");
                diffAndSetAttribute(this.selectedHeadingTextRef, "x", (this.rotatingCompassX + circleRadius * 0.225) + '');
                diffAndSetAttribute(this.selectedHeadingTextRef, "y", (this.rotatingCompassY - circleRadius * 0.725) + '');
                diffAndSetAttribute(this.selectedHeadingTextRef, "fill", "lime");
                diffAndSetAttribute(this.selectedHeadingTextRef, "font-size", (this.fontSize * 0.2) + '');
                diffAndSetAttribute(this.selectedHeadingTextRef, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.selectedHeadingTextRef, "text-anchor", "end");
                diffAndSetAttribute(this.selectedHeadingTextRef, "alignment-baseline", "central");
                fixedElements.appendChild(this.selectedHeadingTextRef);
                let topTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(topTriangle, "d", "M " + this.rotatingCompassX + " " + (this.rotatingCompassY - circleRadius) + " l-3.5 -5.5 l7 0 Z");
                diffAndSetAttribute(topTriangle, "fill", "transparent");
                diffAndSetAttribute(topTriangle, "stroke", "white");
                diffAndSetAttribute(topTriangle, "stroke-width", "0.5");
                fixedElements.appendChild(topTriangle);
            }
        }
        this.appendChild(this.rootSVG);
    }
    construct_AS03D() {
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 1260 150");
        this.refStartX = 0;
        this.refWidth = 1260;
        let posX = this.refStartX;
        let posY = 5;
        let width = this.refWidth;
        let height = 140;
        this.nbPrimaryGraduations = 11;
        this.nbSecondaryGraduations = 1;
        this.totalGraduations = this.nbPrimaryGraduations + ((this.nbPrimaryGraduations - 1) * this.nbSecondaryGraduations);
        this.graduationSpacing = 50;
        this.graduationScroller = new Avionics.Scroller(this.nbPrimaryGraduations, 10, true, 360);
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "HS");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        this.rootSVG.appendChild(this.rootGroup);
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
            diffAndSetAttribute(this.centerSVG, "overflow", "hidden");
            diffAndSetAttribute(this.centerSVG, "viewBox", "0 0 " + width + " " + height);
            {
                let _top = posY + 22;
                let _left = 0;
                let _width = width;
                let _height = 100;
                let graduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(graduationGroup, "id", "Graduations");
                {
                    this.graduations = [];
                    this.graduationScrollPosX = _left + _width * 0.5;
                    this.graduationScrollPosY = _top;
                    for (let i = 0; i < this.totalGraduations; i++) {
                        let line = new Avionics.SVGGraduation();
                        line.IsPrimary = (i % (this.nbSecondaryGraduations + 1)) ? false : true;
                        let lineWidth = line.IsPrimary ? 8 : 7;
                        let lineHeight = line.IsPrimary ? 40 : 22;
                        let linePosY = 0;
                        line.SVGLine = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(line.SVGLine, "y", linePosY + '');
                        diffAndSetAttribute(line.SVGLine, "width", lineWidth + '');
                        diffAndSetAttribute(line.SVGLine, "height", lineHeight + '');
                        diffAndSetAttribute(line.SVGLine, "fill", "white");
                        if (line.IsPrimary) {
                            line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetAttribute(line.SVGText1, "y", (linePosY + lineHeight + 40) + '');
                            diffAndSetAttribute(line.SVGText1, "fill", "white");
                            diffAndSetAttribute(line.SVGText1, "font-size", (this.fontSize * 2.5) + '');
                            diffAndSetAttribute(line.SVGText1, "font-family", "Roboto-Bold");
                            diffAndSetAttribute(line.SVGText1, "text-anchor", "middle");
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
                }
                this.centerSVG.appendChild(graduationGroup);
                this.managedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.managedHeadingGroup, "id", "ManagedHeading");
                {
                    let headingPosX = _left + _width * 0.5 + 4;
                    let headingPosY = posY;
                    let headingWidth = 100;
                    let headingHeight = _height;
                    let headingSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                    diffAndSetAttribute(headingSVG, "x", (headingPosX - headingWidth * 0.5) + '');
                    diffAndSetAttribute(headingSVG, "y", headingPosY + '');
                    diffAndSetAttribute(headingSVG, "width", headingWidth + '');
                    diffAndSetAttribute(headingSVG, "height", headingHeight + '');
                    diffAndSetAttribute(headingSVG, "viewBox", "0 0 " + headingWidth + " " + headingHeight);
                    {
                        let headingShape = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(headingShape, "fill", "transparent");
                        diffAndSetAttribute(headingShape, "stroke", "#D570FF");
                        diffAndSetAttribute(headingShape, "stroke-width", "8");
                        diffAndSetAttribute(headingShape, "d", "M5 10 h30 l15 12 l15 -12 h30 v60 h-90 Z");
                        headingSVG.appendChild(headingShape);
                    }
                    this.managedHeadingGroup.appendChild(headingSVG);
                }
                this.centerSVG.appendChild(this.managedHeadingGroup);
                this.currentTrackGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.currentTrackGroup, "id", "CurrentTrack");
                {
                    let trackPosX = _left + _width * 0.5;
                    let trackPosY = posY + 15;
                    let trackWidth = 40;
                    let trackHeight = _height;
                    let trackSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                    diffAndSetAttribute(trackSVG, "x", (trackPosX - trackWidth * 0.5) + '');
                    diffAndSetAttribute(trackSVG, "y", trackPosY + '');
                    diffAndSetAttribute(trackSVG, "width", trackWidth + '');
                    diffAndSetAttribute(trackSVG, "height", trackHeight + '');
                    diffAndSetAttribute(trackSVG, "viewBox", "0 0 " + trackWidth + " " + trackHeight);
                    {
                        let trackShape = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(trackShape, "fill", "transparent");
                        diffAndSetAttribute(trackShape, "stroke", "#00FF21");
                        diffAndSetAttribute(trackShape, "stroke-width", "6");
                        diffAndSetAttribute(trackShape, "d", "M20 0 l-18 25 l18 25 l18 -25 Z");
                        trackSVG.appendChild(trackShape);
                    }
                    this.currentTrackGroup.appendChild(trackSVG);
                }
                this.centerSVG.appendChild(this.currentTrackGroup);
                {
                    let cursorPosX = _left + _width * 0.5;
                    let cursorPosY = posY + 10;
                    let cursorWidth = 10;
                    let cursorHeight = 60;
                    this.cursorSVG = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(this.cursorSVG, "id", "CursorGroup");
                    {
                        let cursorShape = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(cursorShape, "fill", "yellow");
                        diffAndSetAttribute(cursorShape, "fill-opacity", this.cursorOpacity);
                        diffAndSetAttribute(cursorShape, "width", cursorWidth + '');
                        diffAndSetAttribute(cursorShape, "height", cursorHeight + '');
                        diffAndSetAttribute(cursorShape, "x", (cursorPosX - cursorWidth * 0.5) + '');
                        diffAndSetAttribute(cursorShape, "y", cursorPosY + '');
                        this.cursorSVG.appendChild(cursorShape);
                    }
                    this.centerSVG.appendChild(this.cursorSVG);
                }
            }
            this.rootGroup.appendChild(this.centerSVG);
        }
        this.appendChild(this.rootSVG);
    }
    construct_A320_Neo() {
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 550 250");
        this.refStartX = 25;
        this.refWidth = 500;
        let posX = this.refStartX;
        let posY = 5;
        let width = this.refWidth;
        let height = 100;
        this.nbPrimaryGraduations = 7;
        this.nbSecondaryGraduations = 1;
        this.totalGraduations = this.nbPrimaryGraduations + ((this.nbPrimaryGraduations - 1) * this.nbSecondaryGraduations);
        this.graduationSpacing = 50;
        this.graduationScroller = new Avionics.Scroller(this.nbPrimaryGraduations, 10, true, 360);
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "HS");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        this.rootSVG.appendChild(this.rootGroup);
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
        diffAndSetAttribute(this.centerSVG, "overflow", "hidden");
        diffAndSetAttribute(this.centerSVG, "viewBox", "0 0 " + width + " " + height);
        this.rootGroup.appendChild(this.centerSVG);
        {
            let _top = 35;
            let _left = 0;
            let _width = width;
            let _height = 80;
            let bg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(bg, "x", _left + '');
            diffAndSetAttribute(bg, "y", _top + '');
            diffAndSetAttribute(bg, "width", _width + '');
            diffAndSetAttribute(bg, "height", _height + '');
            diffAndSetAttribute(bg, "fill", "#343B51");
            diffAndSetAttribute(bg, "stroke", this.strokeColor);
            diffAndSetAttribute(bg, "stroke-width", this.strokeSize + '');
            diffAndSetAttribute(bg, "stroke-opacity", this.strokeOpacity);
            this.centerSVG.appendChild(bg);
            let graduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(graduationGroup, "id", "Graduations");
            {
                this.graduationScrollPosX = _left + _width * 0.5;
                this.graduationScrollPosY = _top;
                if (!this.graduations) {
                    this.graduations = [];
                    for (let i = 0; i < this.totalGraduations; i++) {
                        let line = new Avionics.SVGGraduation();
                        line.IsPrimary = (i % (this.nbSecondaryGraduations + 1)) ? false : true;
                        let lineWidth = line.IsPrimary ? 5 : 5;
                        let lineHeight = line.IsPrimary ? 25 : 12;
                        let linePosY = 0;
                        line.SVGLine = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(line.SVGLine, "y", linePosY + '');
                        diffAndSetAttribute(line.SVGLine, "width", lineWidth + '');
                        diffAndSetAttribute(line.SVGLine, "height", lineHeight + '');
                        diffAndSetAttribute(line.SVGLine, "fill", "white");
                        if (line.IsPrimary) {
                            line.SVGText1 = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetAttribute(line.SVGText1, "y", (linePosY + lineHeight + 20) + '');
                            diffAndSetAttribute(line.SVGText1, "fill", "white");
                            diffAndSetAttribute(line.SVGText1, "font-size", (this.fontSize * 1.35) + '');
                            diffAndSetAttribute(line.SVGText1, "font-family", "Roboto-Bold");
                            diffAndSetAttribute(line.SVGText1, "text-anchor", "middle");
                            diffAndSetAttribute(line.SVGText1, "alignment-baseline", "central");
                        }
                        this.graduations.push(line);
                    }
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
            this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.selectedHeadingGroup, "id", "Heading");
            {
                let headingPosX = _left + _width * 0.5 - 2;
                let headingPosY = posY;
                let headingWidth = 35;
                let headingHeight = _height;
                let headingSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(headingSVG, "x", (headingPosX - headingWidth * 0.5) + '');
                diffAndSetAttribute(headingSVG, "y", headingPosY + '');
                diffAndSetAttribute(headingSVG, "width", headingWidth + '');
                diffAndSetAttribute(headingSVG, "height", headingHeight + '');
                diffAndSetAttribute(headingSVG, "viewBox", "0 0 " + headingWidth + " " + headingHeight);
                {
                    let headingShape = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(headingShape, "fill", "transparent");
                    diffAndSetAttribute(headingShape, "stroke", "#00F2FF");
                    diffAndSetAttribute(headingShape, "stroke-width", "4");
                    diffAndSetAttribute(headingShape, "d", "M20 24 l -12 -20 l 24 0 z");
                    headingSVG.appendChild(headingShape);
                }
                this.selectedHeadingGroup.appendChild(headingSVG);
            }
            this.centerSVG.appendChild(this.selectedHeadingGroup);
            this.currentTrackGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.currentTrackGroup, "id", "CurrentTrack");
            {
                let trackPosX = _left + _width * 0.5;
                let trackPosY = posY + 30;
                let trackWidth = 28;
                let trackHeight = _height;
                let trackSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(trackSVG, "x", (trackPosX - trackWidth * 0.5) + '');
                diffAndSetAttribute(trackSVG, "y", trackPosY + '');
                diffAndSetAttribute(trackSVG, "width", trackWidth + '');
                diffAndSetAttribute(trackSVG, "height", trackHeight + '');
                diffAndSetAttribute(trackSVG, "viewBox", "0 0 " + trackWidth + " " + trackHeight);
                {
                    let trackShape = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(trackShape, "fill", "transparent");
                    diffAndSetAttribute(trackShape, "stroke", "#00FF21");
                    diffAndSetAttribute(trackShape, "stroke-width", "4");
                    diffAndSetAttribute(trackShape, "d", "M13 0 l-13 17 l13 17 l13 -17 Z");
                    trackSVG.appendChild(trackShape);
                }
                this.currentTrackGroup.appendChild(trackSVG);
            }
            this.centerSVG.appendChild(this.currentTrackGroup);
            this.ILSBeaconGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.ILSBeaconGroup, "id", "ILSBeacon");
            {
                let ilsPosX = _left + _width * 0.5 + 2.5;
                let ilsPosY = posY + 45;
                let ilsWidth = 30;
                let ilsHeight = _height;
                let ilsSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(ilsSVG, "x", (ilsPosX - ilsWidth * 0.5) + '');
                diffAndSetAttribute(ilsSVG, "y", ilsPosY + '');
                diffAndSetAttribute(ilsSVG, "width", ilsWidth + '');
                diffAndSetAttribute(ilsSVG, "height", ilsHeight + '');
                diffAndSetAttribute(ilsSVG, "viewBox", "0 0 " + ilsWidth + " " + ilsHeight);
                {
                    let ilsShape = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(ilsShape, "fill", "transparent");
                    diffAndSetAttribute(ilsShape, "stroke", "#FF0CE2");
                    diffAndSetAttribute(ilsShape, "stroke-width", "5");
                    diffAndSetAttribute(ilsShape, "d", "M15 0 l0 50 M0 40 l30 0");
                    ilsSVG.appendChild(ilsShape);
                }
                this.ILSBeaconGroup.appendChild(ilsSVG);
            }
            this.centerSVG.appendChild(this.ILSBeaconGroup);
            let cursorPosX = _left + _width * 0.5;
            let cursorPosY = posY;
            let cursorWidth = 35;
            let cursorHeight = _height;
            if (!this.cursorSVG) {
                this.cursorSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.cursorSVG, "id", "CursorGroup");
            }
            else
                Utils.RemoveAllChildren(this.cursorSVG);
            diffAndSetAttribute(this.cursorSVG, "x", (cursorPosX - cursorWidth * 0.5) + '');
            diffAndSetAttribute(this.cursorSVG, "y", cursorPosY + '');
            diffAndSetAttribute(this.cursorSVG, "width", cursorWidth + '');
            diffAndSetAttribute(this.cursorSVG, "height", cursorHeight + '');
            diffAndSetAttribute(this.cursorSVG, "viewBox", "0 0 " + cursorWidth + " " + cursorHeight);
            {
                let cursorShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(cursorShape, "fill", "yellow");
                diffAndSetAttribute(cursorShape, "fill-opacity", this.cursorOpacity);
                diffAndSetAttribute(cursorShape, "d", "M 15 2 L 25 2 L 25 53 L 15 53 L 15 2 Z");
                this.cursorSVG.appendChild(cursorShape);
            }
            this.centerSVG.appendChild(this.cursorSVG);
        }
        let rectWidth = 70;
        this.ILSOffscreenGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.ILSOffscreenGroup, "id", "ILSOffscreen");
        this.rootSVG.appendChild(this.ILSOffscreenGroup);
        {
            let rect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(rect, "x", (-rectWidth * 0.5) + '');
            diffAndSetAttribute(rect, "y", "60");
            diffAndSetAttribute(rect, "width", rectWidth + '');
            diffAndSetAttribute(rect, "height", "40");
            diffAndSetAttribute(rect, "fill", "black");
            diffAndSetAttribute(rect, "stroke", "white");
            diffAndSetAttribute(rect, "stroke-width", "3");
            this.ILSOffscreenGroup.appendChild(rect);
            this.ILSOffscreenText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.ILSOffscreenText, "x", "0");
            diffAndSetAttribute(this.ILSOffscreenText, "y", (60 + 20) + '');
            diffAndSetAttribute(this.ILSOffscreenText, "fill", "#FF0CE2");
            diffAndSetAttribute(this.ILSOffscreenText, "font-size", (this.fontSize * 1.35) + '');
            diffAndSetAttribute(this.ILSOffscreenText, "font-family", "Roboto-Light");
            diffAndSetAttribute(this.ILSOffscreenText, "text-anchor", "middle");
            diffAndSetAttribute(this.ILSOffscreenText, "alignment-baseline", "central");
            this.ILSOffscreenGroup.appendChild(this.ILSOffscreenText);
        }
        this.appendChild(this.rootSVG);
    }
    update(dTime) {
        if (this.rotatingCompass)
            this.updateCircle();
        else
            this.updateRibbon();
    }
    updateRibbon() {
        let compass = Simplane.getHeadingMagnetic();
        let selectedHeading = Simplane.getAutoPilotHeadingLockValueDegrees();
        let managedHeading = SimVar.GetSimVarValue("GPS WP BEARING", "degree");
        managedHeading = 90;
        let track = Simplane.getTrackAngle();
        if (this.graduations && this.graduationScroller.scroll(compass)) {
            let currentVal = this.graduationScroller.firstValue;
            let currentX = this.graduationScrollPosX - this.graduationScroller.offsetY * this.graduationSpacing * (this.nbSecondaryGraduations + 1);
            for (let i = 0; i < this.totalGraduations; i++) {
                let posX = currentX;
                let posY = this.graduationScrollPosY;
                diffAndSetAttribute(this.graduations[i].SVGLine, "transform", "translate(" + posX + '' + " " + posY + '' + ")");
                if (this.graduations[i].SVGText1) {
                    let roundedVal = Math.floor(currentVal / 10);
                    diffAndSetText(this.graduations[i].SVGText1, roundedVal + '');
                    diffAndSetAttribute(this.graduations[i].SVGText1, "transform", "translate(" + posX + '' + " " + posY + '' + ")");
                    currentVal = this.graduationScroller.nextValue;
                }
                currentX += this.graduationSpacing;
            }
        }
        if (this.selectedHeadingGroup) {
            let autoPilotActive = Simplane.getAutoPilotHeadingSelected();
            if (autoPilotActive) {
                let delta = selectedHeading - compass;
                if (delta > 180)
                    delta = delta - 360;
                else if (delta < -180)
                    delta = delta + 360;
                let posX = delta * this.graduationSpacing * (this.nbSecondaryGraduations + 1) / this.graduationScroller.increment;
                diffAndSetAttribute(this.selectedHeadingGroup, "transform", "translate(" + posX + '' + " 0)");
                diffAndSetAttribute(this.selectedHeadingGroup, "visibility", "visible");
            }
            else {
                diffAndSetAttribute(this.selectedHeadingGroup, "visibility", "hidden");
            }
        }
        if (this.managedHeadingGroup) {
            let flightPlanActive = SimVar.GetSimVarValue("GPS IS ACTIVE FLIGHT PLAN", "number");
            if (flightPlanActive) {
                let delta = managedHeading - compass;
                if (delta > 180)
                    delta = delta - 360;
                else if (delta < -180)
                    delta = delta + 360;
                let posX = delta * this.graduationSpacing * (this.nbSecondaryGraduations + 1) / this.graduationScroller.increment;
                diffAndSetAttribute(this.managedHeadingGroup, "transform", "translate(" + posX + '' + " 0)");
                diffAndSetAttribute(this.managedHeadingGroup, "visibility", "visible");
            }
            else {
                diffAndSetAttribute(this.managedHeadingGroup, "visibility", "hidden");
            }
        }
        if (this.currentTrackGroup) {
            let delta = track - compass;
            if (delta > 180)
                delta = delta - 360;
            else if (delta < -180)
                delta = delta + 360;
            let posX = delta * this.graduationSpacing * (this.nbSecondaryGraduations + 1) / this.graduationScroller.increment;
            diffAndSetAttribute(this.currentTrackGroup, "transform", "translate(" + posX + '' + " 0)");
        }
        if (this._showILS) {
            if (this.ILSBeaconGroup && this.ILSOffscreenGroup) {
                let localizer = this.gps.radioNav.getBestILSBeacon();
                if (localizer && localizer.id > 0) {
                    let delta = localizer.course - compass;
                    if (delta > 180)
                        delta = delta - 360;
                    else if (delta < -180)
                        delta = delta + 360;
                    let posX = delta * this.graduationSpacing * (this.nbSecondaryGraduations + 1) / this.graduationScroller.increment;
                    if (posX > -(this.refWidth * 0.5) && posX < (this.refWidth * 0.5)) {
                        diffAndSetAttribute(this.ILSBeaconGroup, "visibility", "visible");
                        diffAndSetAttribute(this.ILSBeaconGroup, "transform", "translate(" + posX + '' + " 0)");
                        diffAndSetAttribute(this.ILSOffscreenGroup, "visibility", "hidden");
                    }
                    else {
                        let pos;
                        if (posX <= -(this.refWidth * 0.5))
                            pos = this.refStartX + 15;
                        else
                            pos = this.refStartX + this.refWidth - 15;
                        let rounded = Math.round(localizer.course);
                        diffAndSetText(this.ILSOffscreenText, Utils.leadingZeros(rounded, 3));
                        diffAndSetAttribute(this.ILSOffscreenGroup, "transform", "translate(" + pos + " 0)");
                        diffAndSetAttribute(this.ILSOffscreenGroup, "visibility", "visible");
                        diffAndSetAttribute(this.ILSBeaconGroup, "visibility", "hidden");
                    }
                }
                else {
                    diffAndSetAttribute(this.ILSOffscreenGroup, "visibility", "hidden");
                    diffAndSetAttribute(this.ILSBeaconGroup, "visibility", "hidden");
                }
            }
        }
    }
    updateCircle() {
        let compass = Simplane.getHeadingMagnetic();
        if (this.rotatingCompass) {
            diffAndSetAttribute(this.rotatingCompass, "transform", "rotate(" + (-compass) + " " + this.rotatingCompassX + " " + this.rotatingCompassY + ")");
        }
        if (this.selectedHeadingGroup) {
            let autoPilotActive = true;
            if (autoPilotActive) {
                let selectedHeading = Simplane.getAutoPilotHeadingLockValueDegrees();
                let delta = compass - selectedHeading;
                diffAndSetAttribute(this.selectedHeadingGroup, "transform", "rotate(" + (-delta) + " " + this.rotatingCompassX + " " + this.rotatingCompassY + ")");
                diffAndSetAttribute(this.selectedHeadingGroup, "visibility", "visible");
                diffAndSetText(this.selectedHeadingText, Math.round(selectedHeading) + "H");
                let headingLocked = Simplane.getAutoPilotHeadingLockActive();
                if (this.selectedHeadingLine)
                    this.selectedHeadingLine.classList.toggle('hide', headingLocked);
            }
            else {
                diffAndSetAttribute(this.selectedHeadingGroup, "visibility", "hidden");
                diffAndSetText(this.selectedHeadingText, "");
            }
        }
        if (this.currentTrackGroup) {
            let track = Simplane.getTrackAngle();
            let groundSpeed = Simplane.getGroundSpeed();
            if (groundSpeed <= 10)
                track = compass;
            let delta = compass - track;
            diffAndSetAttribute(this.currentTrackGroup, "transform", "rotate(" + (-delta) + " " + this.rotatingCompassX + " " + this.rotatingCompassY + ")");
        }
    }
}
customElements.define("jet-pfd-hs-indicator", Jet_PFD_HSIndicator);
//# sourceMappingURL=HSIndicator.js.map