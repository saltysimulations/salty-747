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
        this.minimumReferenceValue = 200;
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
        this.graduationScroller = new Avionics.Scroller(this.nbPrimaryGraduations, 10, true, 360);
        this.construct();
    }
    showILS(_val) {
        this._showILS = _val;
        if (!this._showILS) {
            this.ILSBeaconGroup.setAttribute("visibility", "hidden");
            this.ILSOffscreenGroup.setAttribute("visibility", "hidden");
        }
    }
    construct() {
        Utils.RemoveAllChildren(this);
        if (this.aircraft == Aircraft.B747_8) {
            this.construct_B747_8();
        }
    }
    construct_B747_8() {
        var posX = 0;
        var posY = 30;
        var width = 400;
        var height = 400;
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        this.rootSVG.setAttribute("id", "ViewBox");
        this.rootSVG.setAttribute("viewBox", "0 0 " + width + " " + height);
        {
            let circleRadius = 105;
            this.rotatingCompass = document.createElementNS(Avionics.SVG.NS, "g");
            this.rotatingCompass.setAttribute("id", "Circle");
            this.rootSVG.appendChild(this.rotatingCompass);
            this.rootSVG.style.transform = "scale(0.85, 1.05)";
            {
                this.rotatingCompassX = posX + width * 0.5;
                this.rotatingCompassY = posY + height * 0.5;
                {
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    circle.setAttribute("cx", this.rotatingCompassX.toString());
                    circle.setAttribute("cy", this.rotatingCompassY.toString());
                    circle.setAttribute("r", circleRadius.toString());
                    circle.setAttribute("fill", "#343B51");
                    this.rotatingCompass.appendChild(circle);
                }
                let graduationsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                graduationsGroup.setAttribute("id", "Graduations");
                this.rotatingCompass.appendChild(graduationsGroup);
                {
                    let angle = 0;
                    for (let i = 0; i < 72; i++) {
                        let isPrimary = (i % 2 == 0) ? true : false;
                        let length = (isPrimary) ? 4 : 2;
                        let line = document.createElementNS(Avionics.SVG.NS, "line");
                        line.setAttribute("x1", this.rotatingCompassX.toString());
                        line.setAttribute("y1", (this.rotatingCompassY - circleRadius).toString());
                        line.setAttribute("x2", this.rotatingCompassX.toString());
                        line.setAttribute("y2", (this.rotatingCompassY - circleRadius + length).toString());
                        line.setAttribute("stroke", "white");
                        line.setAttribute("stroke-width", "1");
                        line.setAttribute("transform", "rotate(" + angle + " " + this.rotatingCompassX + " " + this.rotatingCompassY + ")");
                        graduationsGroup.appendChild(line);
                        if (isPrimary) {
                            let text = document.createElementNS(Avionics.SVG.NS, "text");
                            let fontSize = (this.fontSize * 0.243);
                            if (angle % 30 == 0) {
                                fontSize = (this.fontSize * 0.3245);
                                text.setAttribute("y", (this.rotatingCompassY - circleRadius + length + 4).toString());
                            }
                            else {
                                text.setAttribute("y", (this.rotatingCompassY - circleRadius + length + 2.5).toString());
                            }
                            text.textContent = (angle / 10).toString();
                            text.setAttribute("x", this.rotatingCompassX.toString());
                            text.setAttribute("fill", "white");
                            text.setAttribute("font-size", fontSize.toString());
                            text.setAttribute("font-family", "BoeingEFIS");
                            text.setAttribute("text-anchor", "middle");
                            text.setAttribute("alignment-baseline", "central");
                            text.setAttribute("transform", "rotate(" + angle + " " + this.rotatingCompassX + " " + this.rotatingCompassY + ")");                      
                            graduationsGroup.appendChild(text);
                        }
                        angle += 360 / 72;
                    }
                }
            }
            this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.selectedHeadingGroup.setAttribute("id", "selectedHeadingGroup");
            this.rootSVG.appendChild(this.selectedHeadingGroup);
            {
                this.selectedHeadingLine = Avionics.SVG.computeDashLine(this.rotatingCompassX, this.rotatingCompassY, (-circleRadius), 15, 1, "#D570FF");
                this.selectedHeadingLine.setAttribute("id", "selectedHeadingLine");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingLine);
                this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                this.selectedHeadingBug.setAttribute("id", "Heading");
                this.selectedHeadingBug.setAttribute("fill", "transparent");
                this.selectedHeadingBug.setAttribute("stroke", "#D570FF");
                this.selectedHeadingBug.setAttribute("stroke-width", "0.8");
                this.selectedHeadingBug.setAttribute("d", "M " + this.rotatingCompassX + " " + (this.rotatingCompassY - circleRadius) + " l-5 0 l0 -4 l2.5 0 l2.5 4 l3 -4 l2.5 0 l0 4 Z");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
            }
            this.currentTrackGroup = document.createElementNS(Avionics.SVG.NS, "line");
            this.currentTrackGroup.setAttribute("id", "CurrentTrack");
            this.currentTrackGroup.setAttribute("x1", this.rotatingCompassX.toString());
            this.currentTrackGroup.setAttribute("y1", this.rotatingCompassY.toString());
            this.currentTrackGroup.setAttribute("x2", this.rotatingCompassX.toString());
            this.currentTrackGroup.setAttribute("y2", (this.rotatingCompassY - circleRadius).toString());
            this.currentTrackGroup.setAttribute("stroke", "white");
            this.currentTrackGroup.setAttribute("stroke-width", "1");
            this.rootSVG.appendChild(this.currentTrackGroup);

            this.currentTrackCrossLine = document.createElementNS(Avionics.SVG.NS, "line");
            this.currentTrackCrossLine.setAttribute("id", "TrackCross");
            this.currentTrackCrossLine.setAttribute("x1", (this.rotatingCompassX - 3).toString());
            this.currentTrackCrossLine.setAttribute("y1", (this.rotatingCompassY - (circleRadius * 0.85)).toString());
            this.currentTrackCrossLine.setAttribute("x2", (this.rotatingCompassX + 3).toString());
            this.currentTrackCrossLine.setAttribute("y2", (this.rotatingCompassY - (circleRadius * 0.85)).toString());
            this.currentTrackCrossLine.setAttribute("stroke", "white");
            this.currentTrackCrossLine.setAttribute("stroke-width", "1");
            this.rootSVG.appendChild(this.currentTrackCrossLine);
            
            let fixedElements = document.createElementNS(Avionics.SVG.NS, "g");
            fixedElements.setAttribute("id", "FixedElements");
            this.rootSVG.appendChild(fixedElements);
            {
                this.selectedHeadingText = document.createElementNS(Avionics.SVG.NS, "text");
                this.selectedHeadingText.textContent = "135";
                this.selectedHeadingText.setAttribute("x", (this.rotatingCompassX - circleRadius * 0.61).toString());
                this.selectedHeadingText.setAttribute("y", (this.rotatingCompassY - circleRadius * 0.74).toString());
                this.selectedHeadingText.setAttribute("fill", "#D570FF");
                this.selectedHeadingText.setAttribute("font-size", (this.fontSize * 0.27).toString());
                this.selectedHeadingText.setAttribute("font-family", "BoeingEFIS");
                this.selectedHeadingText.setAttribute("text-anchor", "start");
                this.selectedHeadingText.setAttribute("alignment-baseline", "central");
                this.selectedHeadingText.style.transform = "scale(1.25, 0.952)";
                fixedElements.appendChild(this.selectedHeadingText);
                this.selectedHeadingMode = document.createElementNS(Avionics.SVG.NS, "text");
                this.selectedHeadingMode.textContent = "H";
                this.selectedHeadingMode.setAttribute("x", (this.rotatingCompassX - circleRadius * 0.51).toString());
                this.selectedHeadingMode.setAttribute("y", (this.rotatingCompassY - circleRadius * 0.745).toString());
                this.selectedHeadingMode.setAttribute("fill", "#D570FF");
                this.selectedHeadingMode.setAttribute("font-size", (this.fontSize * 0.22).toString());
                this.selectedHeadingMode.setAttribute("font-family", "BoeingEFIS");
                this.selectedHeadingMode.setAttribute("text-anchor", "start");
                this.selectedHeadingMode.setAttribute("alignment-baseline", "central");
                this.selectedHeadingMode.style.transform = "scale(1.25, 0.952)";
                fixedElements.appendChild(this.selectedHeadingMode);
                this.selectedHeadingTextRef = document.createElementNS(Avionics.SVG.NS, "text");
                this.selectedHeadingTextRef.textContent = "MAG";
                this.selectedHeadingTextRef.setAttribute("x", (this.rotatingCompassX - circleRadius * 0.18).toString());
                this.selectedHeadingTextRef.setAttribute("y", (this.rotatingCompassY - circleRadius * 0.745).toString());
                this.selectedHeadingTextRef.setAttribute("fill", "lime");
                this.selectedHeadingTextRef.setAttribute("font-size", (this.fontSize * 0.22).toString());
                this.selectedHeadingTextRef.setAttribute("font-family", "BoeingEFIS");
                this.selectedHeadingTextRef.setAttribute("text-anchor", "end");
                this.selectedHeadingTextRef.setAttribute("alignment-baseline", "central");
                this.selectedHeadingTextRef.style.transform = "scale(1.25, 0.952)";
                fixedElements.appendChild(this.selectedHeadingTextRef);
                let topTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                topTriangle.setAttribute("d", "M " + this.rotatingCompassX + " " + (this.rotatingCompassY - circleRadius) + " l-3.5 -5.5 l7 0 Z");
                topTriangle.setAttribute("fill", "transparent");
                topTriangle.setAttribute("stroke", "white");
                topTriangle.setAttribute("stroke-width", "0.85");
                fixedElements.appendChild(topTriangle);
                if (!this.minimumReferenceModeText) {
                    this.minimumReferenceModeText = document.createElementNS(Avionics.SVG.NS, "text");
                }
                this.minimumReferenceModeText.textContent = "BARO";
                this.minimumReferenceModeText.setAttribute("x", (this.rotatingCompassX + circleRadius * 0.0665).toString());
                this.minimumReferenceModeText.setAttribute("y", (this.rotatingCompassY - circleRadius * 1.0475).toString());
                this.minimumReferenceModeText.setAttribute("fill", (this.isHud) ? "lime" : "#24F000");
                this.minimumReferenceModeText.setAttribute("font-size", (this.fontSize * 0.23).toString());
                this.minimumReferenceModeText.setAttribute("font-family", "BoeingEFIS");
                this.minimumReferenceModeText.setAttribute("text-anchor", "end");
                this.minimumReferenceModeText.style.transform = "scale(1.25, 0.952)";
                fixedElements.appendChild(this.minimumReferenceModeText);
                if (!this.minimumReferenceValueText) {
                    this.minimumReferenceValueText = document.createElementNS(Avionics.SVG.NS, "text");
                }
                this.minimumReferenceValueText.textContent = "210";
                this.minimumReferenceValueText.setAttribute("x", (this.rotatingCompassX + circleRadius * 0.07).toString());;
                this.minimumReferenceValueText.setAttribute("y", (this.rotatingCompassY - circleRadius * 0.975).toString());
                this.minimumReferenceValueText.setAttribute("fill", (this.isHud) ? "lime" : "#24F000");
                this.minimumReferenceValueText.setAttribute("font-size", (this.fontSize * 0.31).toString());
                this.minimumReferenceValueText.setAttribute("font-family", "BoeingEFIS");
                this.minimumReferenceValueText.setAttribute("text-anchor", "end");
                this.minimumReferenceValueText.style.transform = "scale(1.25, 0.952)";
                fixedElements.appendChild(this.minimumReferenceValueText);
            }
        }
        this.appendChild(this.rootSVG);
    }
    update(dTime) {
        this.updateMinimumText(this.minimumReferenceValue, Simplane.getMinimumReferenceMode());
        if (this.rotatingCompass)
            this.updateCircle();
        else
            this.updateRibbon();
    }
    updateRibbon() {
        var compass = SimVar.GetSimVarValue("PLANE HEADING DEGREES MAGNETIC", "degree");
        var selectedHeading = SimVar.GetSimVarValue("AUTOPILOT HEADING LOCK DIR", "degree");
        var track = SimVar.GetSimVarValue("GPS GROUND MAGNETIC TRACK", "degree");
        if (this.graduations) {
            this.graduationScroller.scroll(compass);
            var currentVal = this.graduationScroller.firstValue;
            var currentX = this.graduationScrollPosX - this.graduationScroller.offsetY * this.graduationSpacing * (this.nbSecondaryGraduations + 1);
            for (var i = 0; i < this.totalGraduations; i++) {
                var posX = currentX;
                var posY = this.graduationScrollPosY;
                this.graduations[i].SVGLine.setAttribute("transform", "translate(" + posX.toString() + " " + posY.toString() + ")");
                if (this.graduations[i].SVGText1) {
                    var roundedVal = Math.floor(currentVal / 10);
                    this.graduations[i].SVGText1.textContent = roundedVal.toString();
                    this.graduations[i].SVGText1.setAttribute("transform", "translate(" + posX.toString() + " " + posY.toString() + ")");
                    currentVal = this.graduationScroller.nextValue;
                }
                currentX += this.graduationSpacing;
            }
        }
        if (this.selectedHeadingGroup) {
            var autoPilotActive = Simplane.getAutoPilotHeadingSelected();
            if (autoPilotActive) {
                var delta = selectedHeading - compass;
                if (delta > 180)
                    delta = delta - 360;
                else if (delta < -180)
                    delta = delta + 360;
                var posX = delta * this.graduationSpacing * (this.nbSecondaryGraduations + 1) / this.graduationScroller.increment;
                this.selectedHeadingGroup.setAttribute("transform", "translate(" + posX.toString() + " 0)");
                this.selectedHeadingGroup.setAttribute("visibility", "visible");
            }
            else {
                this.selectedHeadingGroup.setAttribute("visibility", "hidden");
            }
        }
        if (this.currentTrackGroup && this.currentTrackCrossLine) {
            var delta = track - compass;
            if (delta > 180)
                delta = delta - 360;
            else if (delta < -180)
                delta = delta + 360;
            var posX = delta * this.graduationSpacing * (this.nbSecondaryGraduations + 1) / this.graduationScroller.increment;
            this.currentTrackGroup.setAttribute("transform", "translate(" + posX.toString() + " 0)");
            this.currentTrackCrossLine.setAttribute("transform", "translate(" + posX.toString() + " 0)");
        }
        if (this._showILS) {
            if (this.ILSBeaconGroup && this.ILSOffscreenGroup) {
                let localizer = this.gps.radioNav.getBestILSBeacon();
                if (localizer && localizer.id > 0) {
                    var delta = localizer.course - compass;
                    if (delta > 180)
                        delta = delta - 360;
                    else if (delta < -180)
                        delta = delta + 360;
                    var posX = delta * this.graduationSpacing * (this.nbSecondaryGraduations + 1) / this.graduationScroller.increment;
                    if (posX > -(this.refWidth * 0.5) && posX < (this.refWidth * 0.5)) {
                        this.ILSBeaconGroup.setAttribute("visibility", "visible");
                        this.ILSBeaconGroup.setAttribute("transform", "translate(" + posX.toString() + " 0)");
                        this.ILSOffscreenGroup.setAttribute("visibility", "hidden");
                    }
                    else {
                        let pos;
                        if (posX <= -(this.refWidth * 0.5))
                            pos = this.refStartX + 15;
                        else
                            pos = this.refStartX + this.refWidth - 15;
                        let rounded = Math.round(localizer.course);
                        this.ILSOffscreenText.textContent = Utils.leadingZeros(rounded, 3);
                        this.ILSOffscreenGroup.setAttribute("transform", "translate(" + pos + " 0)");
                        this.ILSOffscreenGroup.setAttribute("visibility", "visible");
                        this.ILSBeaconGroup.setAttribute("visibility", "hidden");
                    }
                }
                else {
                    this.ILSOffscreenGroup.setAttribute("visibility", "hidden");
                    this.ILSBeaconGroup.setAttribute("visibility", "hidden");
                }
            }
        }
    }
    updateCircle() {
        var compass = SimVar.GetSimVarValue("PLANE HEADING DEGREES MAGNETIC", "degree");
        if (this.rotatingCompass) {
            this.rotatingCompass.setAttribute("transform", "rotate(" + (-compass) + " " + this.rotatingCompassX + " " + this.rotatingCompassY + ")");
        }
        if (this.selectedHeadingGroup) {
            var autoPilotActive = true;
            if (autoPilotActive) {
                var selectedHeading = Simplane.getAutoPilotSelectedHeadingLockValue(false);
                var roundedSelectedHeading = Math.round(selectedHeading);
                var delta = compass - selectedHeading;
                this.selectedHeadingGroup.setAttribute("transform", "rotate(" + (-delta) + " " + this.rotatingCompassX + " " + this.rotatingCompassY + ")");
                this.selectedHeadingGroup.setAttribute("visibility", "visible");
                this.selectedHeadingText.textContent = Utils.leadingZeros(roundedSelectedHeading % 360, 3, 0);
                let headingLocked = Simplane.getAutoPilotHeadingLockActive();
                if (this.selectedHeadingLine)
                    this.selectedHeadingLine.classList.toggle('hide', headingLocked);
            }
            else {
                this.selectedHeadingGroup.setAttribute("visibility", "hidden");
                this.selectedHeadingText.textContent = "";
            }
        }
        if (this.currentTrackGroup) {
            var track = SimVar.GetSimVarValue("GPS GROUND MAGNETIC TRACK", "degree");
            var groundSpeed = SimVar.GetSimVarValue("GPS GROUND SPEED", "knots");
            if (groundSpeed <= 10)
                track = compass;
            var delta = compass - track;
            this.currentTrackGroup.setAttribute("transform", "rotate(" + (-delta) + " " + this.rotatingCompassX + " " + this.rotatingCompassY + ")");
            this.currentTrackCrossLine.setAttribute("transform", "rotate(" + (-delta) + " " + this.rotatingCompassX + " " + this.rotatingCompassY + ")");
        }
    }
    updateMinimumText(minimumAltitude, minimumMode) {
        if (minimumAltitude < -100){
            this.minimumReferenceValueText.setAttribute("visibility", "hidden");
            this.minimumReferenceModeText.setAttribute("visibility", "hidden");
        } 
        else {
            this.minimumReferenceValueText.setAttribute("visibility", "visible");
            this.minimumReferenceModeText.setAttribute("visibility", "visible");
        }
        this.minimumReferenceValueText.textContent = minimumAltitude.toFixed(0);
        this.minimumReferenceModeText.textContent = minimumMode === MinimumReferenceMode.BARO ? "BARO" : "RADIO";
    }
}
customElements.define("jet-pfd-hs-indicator", Jet_PFD_HSIndicator);
//# sourceMappingURL=HSIndicator.js.map