class Jet_PFD_NDCompass extends Jet_NDCompass {
    constructor() {
        super();
    }
    connectedCallback() {
        super.connectedCallback();
    }
    init() {
        super.init();
    }
    destroyLayout() {
        super.destroyLayout();
    }
    constructArc() {
        super.constructArc();
        if (this.aircraft == Aircraft.AS01B)
            this.constructArc_AS01B();
    }
    constructArc_AS01B() {
        this.destroyLayout();
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "-225 -215 900 516");
        this.appendChild(this.root);
        var trsGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(trsGroup, "transform", "translate(1, 160)");
        this.root.appendChild(trsGroup);
        {
            var viewBoxSize = "-225 -550 550 600";
            var circleRadius = 425;
            var dashSpacing = 72;
            if (this.isHud) {
                viewBoxSize = "-275 -550 650 700";
                circleRadius = 400;
                this.rotatingCircleTrs = "translate(0 -125)";
            }
            let viewBox = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(viewBox, "x", "-225");
            diffAndSetAttribute(viewBox, "y", "-475");
            diffAndSetAttribute(viewBox, "viewBox", viewBoxSize);
            trsGroup.appendChild(viewBox);
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rotatingCircle, "id", "RotatingCicle");
            {
                let circleGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(circleGroup, "id", "CircleGroup");
                this.rotatingCircle.appendChild(circleGroup);
                let radians = 0;
                for (let i = 0; i < dashSpacing; i++) {
                    let line = document.createElementNS(Avionics.SVG.NS, "line");
                    let bIsBig = (i % 2 == 0) ? true : false;
                    let bHasNumber = (i % 6 == 0) ? true : false;
                    let length = (bIsBig) ? 24 : 12;
                    if (this.isHud)
                        length *= 2;
                    let lineStart = 50 + circleRadius;
                    let lineEnd = lineStart - length;
                    let degrees = (radians / Math.PI) * 180;
                    diffAndSetAttribute(line, "x1", "50");
                    diffAndSetAttribute(line, "y1", lineStart + '');
                    diffAndSetAttribute(line, "x2", "50");
                    diffAndSetAttribute(line, "y2", lineEnd + '');
                    diffAndSetAttribute(line, "transform", "rotate(" + (-degrees + 180) + " 50 50)");
                    diffAndSetAttribute(line, "stroke", (this.isHud) ? "lime" : "white");
                    diffAndSetAttribute(line, "stroke-width", (this.isHud) ? "8" : "3");
                    if (bIsBig && bHasNumber) {
                        let textOffset = 30;
                        let textSize = (i % 3 == 0) ? 28 : 20;
                        if (this.isHud) {
                            textSize *= 1.5;
                            textOffset *= 1.5;
                        }
                        let text = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetText(text, fastToFixed(degrees / 10, 0));
                        diffAndSetAttribute(text, "x", "50");
                        diffAndSetAttribute(text, "y", (-(circleRadius - 50 - length - textOffset)) + '');
                        diffAndSetAttribute(text, "fill", (this.isHud) ? "lime" : "white");
                        diffAndSetAttribute(text, "font-size", textSize + '');
                        diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                        diffAndSetAttribute(text, "text-anchor", "middle");
                        diffAndSetAttribute(text, "alignment-baseline", "bottom");
                        diffAndSetAttribute(text, "transform", "rotate(" + degrees + " 50 50)");
                        circleGroup.appendChild(text);
                    }
                    radians += (2 * Math.PI) / dashSpacing;
                    circleGroup.appendChild(line);
                }
                this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.trackingGroup, "id", "trackingGroup");
                {
                    this.trackingLine = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.trackingLine, "id", "trackingLine");
                    diffAndSetAttribute(this.trackingLine, "d", "M50 70 v " + (circleRadius - 20));
                    diffAndSetAttribute(this.trackingLine, "fill", "transparent");
                    diffAndSetAttribute(this.trackingLine, "stroke", (this.isHud) ? "lime" : "white");
                    diffAndSetAttribute(this.trackingLine, "stroke-width", "3");
                    this.trackingGroup.appendChild(this.trackingLine);
                }
                this.rotatingCircle.appendChild(this.trackingGroup);
                this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.headingGroup, "id", "headingGroup");
                {
                    this.headingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.headingBug, "id", "headingBug");
                    diffAndSetAttribute(this.headingBug, "d", "M50 " + (50 + circleRadius) + " l -20 35 l 40 0 z");
                    diffAndSetAttribute(this.headingBug, "stroke", (this.isHud) ? "lime" : "white");
                    diffAndSetAttribute(this.headingBug, "stroke-width", "2");
                    this.headingGroup.appendChild(this.headingBug);
                }
                this.rotatingCircle.appendChild(this.headingGroup);
                this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.selectedHeadingGroup, "id", "selectedHeadingGroup");
                {
                    this.selectedHeadingLine = Avionics.SVG.computeDashLine(50, 70, (circleRadius - 5), 15, 3, "#ff00e0");
                    diffAndSetAttribute(this.selectedHeadingLine, "id", "selectedHeadingLine");
                    this.selectedHeadingGroup.appendChild(this.selectedHeadingLine);
                    this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.selectedHeadingBug, "id", "selectedHeadingBug");
                    diffAndSetAttribute(this.selectedHeadingBug, "d", "M50 " + (50 + circleRadius) + " h 22 v 22 h -7 l -15 -22 l -15 22 h -7 v -22 z");
                    diffAndSetAttribute(this.selectedHeadingBug, "stroke", (this.isHud) ? "lime" : "#ff00e0");
                    diffAndSetAttribute(this.selectedHeadingBug, "stroke-width", "2");
                    diffAndSetAttribute(this.selectedHeadingBug, "fill", "none");
                    this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
                }
                this.rotatingCircle.appendChild(this.selectedHeadingGroup);
                this.selectedTrackGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.selectedTrackGroup, "id", "selectedTrackGroup");
                {
                    this.selectedTrackLine = Avionics.SVG.computeDashLine(50, 70, (circleRadius - 5), 15, 3, "#ff00e0");
                    diffAndSetAttribute(this.selectedTrackLine, "id", "selectedTrackLine");
                    this.selectedTrackGroup.appendChild(this.selectedTrackLine);
                    this.selectedTrackBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.selectedTrackBug, "id", "selectedTrackBug");
                    diffAndSetAttribute(this.selectedTrackBug, "d", "M50 " + (50 + circleRadius) + " h -30 v -15 l 30 -15 l 30 15 v 15 z");
                    diffAndSetAttribute(this.selectedTrackBug, "stroke", (this.isHud) ? "lime" : "#ff00e0");
                    diffAndSetAttribute(this.selectedTrackBug, "stroke-width", "2");
                    this.selectedTrackGroup.appendChild(this.selectedTrackBug);
                }
                this.rotatingCircle.appendChild(this.selectedTrackGroup);
            }
            this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.courseGroup, "id", "CourseInfo");
            this.rotatingCircle.appendChild(this.courseGroup);
            {
                let bearingScale = 0.8;
                let bearingScaleCorrection = -((50 * bearingScale) - 50);
                let bearing = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(bearing, "id", "bearing");
                diffAndSetAttribute(bearing, "transform", "translate(" + bearingScaleCorrection + " " + bearingScaleCorrection + ") scale(" + bearingScale + ")");
                this.courseGroup.appendChild(bearing);
                {
                    this.bearing1_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing1_Vor, "d", "M60 -477 L50 -487 L40 -477 M50 -487 L50 -405 M70 -410 L30 -410     M50 510 L50 585 M65 585 L50 575 L35 585");
                    diffAndSetAttribute(this.bearing1_Vor, "stroke-width", "3");
                    diffAndSetAttribute(this.bearing1_Vor, "stroke", "green");
                    diffAndSetAttribute(this.bearing1_Vor, "fill", "none");
                    diffAndSetAttribute(this.bearing1_Vor, "id", "bearing1_Vor");
                    diffAndSetAttribute(this.bearing1_Vor, "visibility", "hidden");
                    bearing.appendChild(this.bearing1_Vor);
                    this.bearing1_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing1_Adf, "d", "M60 -477 L50 -487 L40 -477 M50 -487 L50 -405 M70 -410 L30 -410     M50 510 L50 585 M65 585 L50 575 L35 585");
                    diffAndSetAttribute(this.bearing1_Adf, "stroke-width", "3");
                    diffAndSetAttribute(this.bearing1_Adf, "stroke", "cyan");
                    diffAndSetAttribute(this.bearing1_Adf, "fill", "none");
                    diffAndSetAttribute(this.bearing1_Adf, "id", "bearing1_Adf");
                    diffAndSetAttribute(this.bearing1_Adf, "visibility", "hidden");
                    bearing.appendChild(this.bearing1_Adf);
                    this.bearing2_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing2_Vor, "d", "M60 -477 L50 -487 L40 -477 L40 -415 L30 -415 L30 -405 L70 -405 L70 -415 L60 -415 L60 -477        M65 585 L50 575 L35 585 L35 595 L50 585 L65 595 L65 585 M57 580 L57 517 L50 510 L43 517 L43 580");
                    diffAndSetAttribute(this.bearing2_Vor, "stroke-width", "3");
                    diffAndSetAttribute(this.bearing2_Vor, "stroke", "green");
                    diffAndSetAttribute(this.bearing2_Vor, "fill", "none");
                    diffAndSetAttribute(this.bearing2_Vor, "id", "bearing2_Vor");
                    diffAndSetAttribute(this.bearing2_Vor, "visibility", "hidden");
                    bearing.appendChild(this.bearing2_Vor);
                    this.bearing2_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing2_Adf, "d", "M60 -477 L50 -487 L40 -477 L40 -415 L30 -415 L30 -405 L70 -405 L70 -415 L60 -415 L60 -477        M65 585 L50 575 L35 585 L35 595 L50 585 L65 595 L65 585 M57 580 L57 517 L50 510 L43 517 L43 580");
                    diffAndSetAttribute(this.bearing2_Adf, "stroke-width", "3");
                    diffAndSetAttribute(this.bearing2_Adf, "stroke", "cyan");
                    diffAndSetAttribute(this.bearing2_Adf, "fill", "none");
                    diffAndSetAttribute(this.bearing2_Adf, "id", "bearing2_Adf");
                    diffAndSetAttribute(this.bearing2_Adf, "visibility", "hidden");
                    bearing.appendChild(this.bearing2_Adf);
                }
            }
            viewBox.appendChild(this.rotatingCircle);
        }
        if (!this.isHud) {
            this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.currentRefGroup, "id", "currentRefGroup");
            {
                let centerX = 230;
                let centerY = 130;
                let posX;
                posX = centerX - 50;
                this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.currentRefValue, "266");
                diffAndSetAttribute(this.currentRefValue, "x", posX + '');
                diffAndSetAttribute(this.currentRefValue, "y", centerY + '');
                diffAndSetAttribute(this.currentRefValue, "fill", "#FF0CE2");
                diffAndSetAttribute(this.currentRefValue, "font-size", "36");
                diffAndSetAttribute(this.currentRefValue, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.currentRefValue, "text-anchor", "end");
                diffAndSetAttribute(this.currentRefValue, "alignment-baseline", "bottom");
                this.currentRefGroup.appendChild(this.currentRefValue);
                posX -= 70;
                this.currentRefMode = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.currentRefMode, "HDG");
                diffAndSetAttribute(this.currentRefMode, "x", posX + '');
                diffAndSetAttribute(this.currentRefMode, "y", centerY + '');
                diffAndSetAttribute(this.currentRefMode, "fill", "#FF0CE2");
                diffAndSetAttribute(this.currentRefMode, "font-size", "26");
                diffAndSetAttribute(this.currentRefMode, "font-family", "Roboto-Light");
                diffAndSetAttribute(this.currentRefMode, "text-anchor", "end");
                diffAndSetAttribute(this.currentRefMode, "alignment-baseline", "bottom");
                this.currentRefGroup.appendChild(this.currentRefMode);
                posX -= 50;
                this.currentRefSelected = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.currentRefSelected, "SEL");
                diffAndSetAttribute(this.currentRefSelected, "x", posX + '');
                diffAndSetAttribute(this.currentRefSelected, "y", centerY + '');
                diffAndSetAttribute(this.currentRefSelected, "fill", "#FF0CE2");
                diffAndSetAttribute(this.currentRefSelected, "font-size", "26");
                diffAndSetAttribute(this.currentRefSelected, "font-family", "Roboto-Light");
                diffAndSetAttribute(this.currentRefSelected, "text-anchor", "end");
                diffAndSetAttribute(this.currentRefSelected, "alignment-baseline", "bottom");
                this.currentRefGroup.appendChild(this.currentRefSelected);
                posX = centerX + 50;
                this.currentRefType = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.currentRefType, "MAG");
                diffAndSetAttribute(this.currentRefType, "x", posX + '');
                diffAndSetAttribute(this.currentRefType, "y", centerY + '');
                diffAndSetAttribute(this.currentRefType, "fill", "#24F000");
                diffAndSetAttribute(this.currentRefType, "font-size", "30");
                diffAndSetAttribute(this.currentRefType, "font-family", "Roboto-Light");
                diffAndSetAttribute(this.currentRefType, "text-anchor", "start");
                diffAndSetAttribute(this.currentRefType, "alignment-baseline", "bottom");
                this.currentRefGroup.appendChild(this.currentRefType);
            }
            trsGroup.appendChild(this.currentRefGroup);
        }
    }
    update(_deltaTime) {
        super.update(_deltaTime);
    }
}
customElements.define("jet-pfd-nd-compass", Jet_PFD_NDCompass);
//# sourceMappingURL=NDCompass.js.map