class Jet_MFD_NDCompass extends Jet_NDCompass {
    constructor() {
        super();
    }
    connectedCallback() {
        super.connectedCallback();
    }
    init() {
        super.init();
    }
    constructArc() {
        super.constructArc();
        if (this.aircraft == Aircraft.CJ4)
            this.constructArc_CJ4();
        else if (this.aircraft == Aircraft.B747_8)
            this.constructArc_B747_8();
        else if (this.aircraft == Aircraft.AS01B)
            this.constructArc_AS01B();
        else if (this.aircraft == Aircraft.AS03D)
            this.constructArc_AS03D();
        else
            this.constructArc_A320_Neo();
    }
    constructArc_CJ4() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "-225 -215 550 516");
        this.appendChild(this.root);
        var trsGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(trsGroup, "transform", "translate(0, 70)");
        this.root.appendChild(trsGroup);
        {
            let viewBox = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(viewBox, "x", "-225");
            diffAndSetAttribute(viewBox, "y", "-300");
            diffAndSetAttribute(viewBox, "viewBox", "-325 -350 750 600");
            trsGroup.appendChild(viewBox);
            var circleRadius = 350;
            var maskHeight = 200;
            this.arcMaskGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.arcMaskGroup, "id", "mask");
            viewBox.appendChild(this.arcMaskGroup);
            {
                let topMask = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(topMask, "d", "M0 " + -maskHeight + ", L" + circleRadius * 2 + " " + -maskHeight + ", L" + circleRadius * 2 + " " + circleRadius + ", A 25 25 0 1 0 0, " + circleRadius + "Z");
                diffAndSetAttribute(topMask, "transform", "translate(" + (50 - circleRadius) + ", " + (50 - circleRadius) + ")");
                diffAndSetAttribute(topMask, "fill", "#0e0d08");
                this.arcMaskGroup.appendChild(topMask);
            }
            var fixedGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(fixedGroup, "id", "fixedElements");
            viewBox.appendChild(fixedGroup);
            {
                var arc = new Avionics.SVGArc;
                arc.init("mainArc", circleRadius, 2, "white");
                arc.translate(50, 50);
                arc.rotate(-90 + 26.5);
                arc.setPercent(35);
                fixedGroup.appendChild(arc.svg);
                let vec = new Vec2(1, 0.45);
                vec.SetNorm(circleRadius * 0.92);
                this.addMapRange(fixedGroup, 50 - vec.x, 50 - vec.y, "white", "20", false, 1.0, false);
                {
                    var smallCircleRadius = 170;
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", "50");
                    diffAndSetAttribute(circle, "cy", "50");
                    diffAndSetAttribute(circle, "r", smallCircleRadius + '');
                    diffAndSetAttribute(circle, "fill-opacity", "0");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    diffAndSetAttribute(circle, "stroke-opacity", "1");
                    fixedGroup.appendChild(circle);
                    dashSpacing = 12;
                    let radians = 0;
                    for (let i = 0; i < dashSpacing; i++) {
                        let line = document.createElementNS(Avionics.SVG.NS, "line");
                        let length = 15;
                        let lineStart = 50 + smallCircleRadius - length * 0.5;
                        let lineEnd = 50 + smallCircleRadius + length * 0.5;
                        let degrees = (radians / Math.PI) * 180;
                        diffAndSetAttribute(line, "x1", "50");
                        diffAndSetAttribute(line, "y1", lineStart + '');
                        diffAndSetAttribute(line, "x2", "50");
                        diffAndSetAttribute(line, "y2", lineEnd + '');
                        diffAndSetAttribute(line, "transform", "rotate(" + (-degrees + 180) + " 50 50)");
                        diffAndSetAttribute(line, "stroke", "white");
                        diffAndSetAttribute(line, "stroke-width", "4");
                        diffAndSetAttribute(line, "stroke-opacity", "0.8");
                        fixedGroup.appendChild(line);
                        radians += (2 * Math.PI) / dashSpacing;
                    }
                    vec.SetNorm(smallCircleRadius * 0.82);
                    this.addMapRange(fixedGroup, 50 - vec.x, 50 - vec.y, "white", "20", false, 0.5, false);
                }
                let clipRect = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(clipRect, "x", (50 - circleRadius) + '');
                diffAndSetAttribute(clipRect, "y", (-105 - circleRadius) + '');
                diffAndSetAttribute(clipRect, "width", (circleRadius * 2) + '');
                diffAndSetAttribute(clipRect, "height", (circleRadius) + '');
                diffAndSetAttribute(clipRect, "fill", "white");
                var clipPath = document.createElementNS(Avionics.SVG.NS, "clipPath");
                diffAndSetAttribute(clipPath, "id", "clip");
                clipPath.appendChild(clipRect);
                fixedGroup.appendChild(clipPath);
            }
            var clipGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(clipGroup, "id", "clipElements");
            diffAndSetAttribute(clipGroup, "clip-path", "url(#clip)");
            viewBox.appendChild(clipGroup);
            {
                this.graduations = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.graduations, "id", "graduations");
                clipGroup.appendChild(this.graduations);
                {
                    var dashSpacing = 72;
                    let texts = ["N", "E", "S", "W"];
                    let radians = 0;
                    for (let i = 0; i < dashSpacing; i++) {
                        let line = document.createElementNS(Avionics.SVG.NS, "line");
                        let bIsBig = (i % 2 == 0) ? true : false;
                        let bIsText = (i % 6 == 0) ? true : false;
                        let length = (bIsBig) ? 15 : 8.5;
                        let lineStart = 50 + circleRadius;
                        let lineEnd = 50 + circleRadius + length;
                        let degrees = (radians / Math.PI) * 180;
                        diffAndSetAttribute(line, "x1", "50");
                        diffAndSetAttribute(line, "y1", lineStart + '');
                        diffAndSetAttribute(line, "x2", "50");
                        diffAndSetAttribute(line, "y2", lineEnd + '');
                        diffAndSetAttribute(line, "transform", "rotate(" + (-degrees + 180) + " 50 50)");
                        diffAndSetAttribute(line, "stroke", "white");
                        diffAndSetAttribute(line, "stroke-width", "3");
                        diffAndSetAttribute(line, "stroke-opacity", "0.8");
                        this.graduations.appendChild(line);
                        if (bIsText) {
                            let text = document.createElementNS(Avionics.SVG.NS, "text");
                            if (Math.round(degrees) % 90 == 0) {
                                let id = Math.round(degrees) / 90;
                                diffAndSetText(text, texts[id]);
                            }
                            else
                                diffAndSetText(text, fastToFixed(degrees / 10, 0));
                            diffAndSetAttribute(text, "x", "50");
                            diffAndSetAttribute(text, "y", (-(circleRadius - 50 + length + 10)) + '');
                            diffAndSetAttribute(text, "fill", "white");
                            diffAndSetAttribute(text, "font-size", "25");
                            diffAndSetAttribute(text, "font-family", "Roboto-Light");
                            diffAndSetAttribute(text, "text-anchor", "middle");
                            diffAndSetAttribute(text, "alignment-baseline", "bottom");
                            diffAndSetAttribute(text, "transform", "rotate(" + degrees + " 50 50)");
                            this.graduations.appendChild(text);
                        }
                        radians += (2 * Math.PI) / dashSpacing;
                    }
                }
            }
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rotatingCircle, "id", "RotatingCircle");
            viewBox.appendChild(this.rotatingCircle);
            {
                this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.courseGroup, "id", "CourseInfo");
                this.rotatingCircle.appendChild(this.courseGroup);
                {
                    let bearing = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(bearing, "id", "bearing");
                    this.courseGroup.appendChild(bearing);
                    {
                        this.bearing1_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.bearing1_Vor, "d", "M50 400 L50 360 M50 340 L50 220    M63 360 L50 340 L37 360 Z     M50 -300 L50 -260 M50 -240 L50 -120     M63 -240 L50 -260 L37 -240 Z");
                        diffAndSetAttribute(this.bearing1_Vor, "stroke", "white");
                        diffAndSetAttribute(this.bearing1_Vor, "stroke-width", "4");
                        diffAndSetAttribute(this.bearing1_Vor, "fill", "none");
                        diffAndSetAttribute(this.bearing1_Vor, "id", "bearing1_Vor");
                        diffAndSetAttribute(this.bearing1_Vor, "visibility", "hidden");
                        bearing.appendChild(this.bearing1_Vor);
                        this.bearing1_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.bearing1_Adf, "d", "M50 400 L50 220       M63 360 L50 340 L37 360       M50 -300 L50 -120      M63 -240 L50 -260 L37 -240");
                        diffAndSetAttribute(this.bearing1_Adf, "stroke", "lime");
                        diffAndSetAttribute(this.bearing1_Adf, "stroke-width", "4");
                        diffAndSetAttribute(this.bearing1_Adf, "fill", "none");
                        diffAndSetAttribute(this.bearing1_Adf, "id", "bearing1_Adf");
                        diffAndSetAttribute(this.bearing1_Adf, "visibility", "hidden");
                        bearing.appendChild(this.bearing1_Adf);
                        this.bearing2_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.bearing2_Vor, "d", "M50 400 L50 320 M58 320 L42 320    M58 320 L58 220 M42 320 L42 220     M50 -300 L50 -220   M58 -120 L58 -200 L63 -200 L50 -220 L37 -200 L42 -200 L42 -120");
                        diffAndSetAttribute(this.bearing2_Vor, "stroke", "white");
                        diffAndSetAttribute(this.bearing2_Vor, "stroke-width", "4");
                        diffAndSetAttribute(this.bearing2_Vor, "fill", "none");
                        diffAndSetAttribute(this.bearing2_Vor, "id", "bearing2_Vor");
                        diffAndSetAttribute(this.bearing2_Vor, "visibility", "hidden");
                        bearing.appendChild(this.bearing2_Vor);
                        this.bearing2_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.bearing2_Adf, "d", "M50 400 L50 300       M63 220 L63 320 L50 300 L37 320 L37 220       M50 -300 L50 -220      M63 -120 L63 -200 L50 -220 L37 -200 L37 -120");
                        diffAndSetAttribute(this.bearing2_Adf, "stroke", "lime");
                        diffAndSetAttribute(this.bearing2_Adf, "stroke-width", "4");
                        diffAndSetAttribute(this.bearing2_Adf, "fill", "none");
                        diffAndSetAttribute(this.bearing2_Adf, "id", "bearing2_Adf");
                        diffAndSetAttribute(this.bearing2_Adf, "visibility", "hidden");
                        bearing.appendChild(this.bearing2_Adf);
                    }
                    this.course = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(this.course, "id", "course");
                    this.courseGroup.appendChild(this.course);
                    {
                        this.courseColor = "";
                        if (this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                            this.courseColor = "#ff00ff";
                        }
                        else if (this.navigationMode == Jet_NDCompass_Navigation.VOR) {
                            this.courseColor = "#00ffff";
                        }
                        this.courseTO = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.courseTO, "d", "M46 110 l8 0 l0 25 l-4 5 l-4 -5 l0 -25 Z");
                        diffAndSetAttribute(this.courseTO, "fill", "none");
                        diffAndSetAttribute(this.courseTO, "transform", "rotate(180 50 50)");
                        diffAndSetAttribute(this.courseTO, "stroke", this.courseColor + '');
                        diffAndSetAttribute(this.courseTO, "stroke-width", "1");
                        this.course.appendChild(this.courseTO);
                        this.courseTOLine = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.courseTOLine, "d", "M50 140 l0 " + (circleRadius - 90) + " Z");
                        diffAndSetAttribute(this.courseTOLine, "transform", "rotate(180 50 50)");
                        diffAndSetAttribute(this.courseTOLine, "stroke", this.courseColor + '');
                        diffAndSetAttribute(this.courseTOLine, "stroke-width", "1");
                        this.course.appendChild(this.courseTOLine);
                        this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(this.courseDeviation, "x", "45");
                        diffAndSetAttribute(this.courseDeviation, "y", "-10");
                        diffAndSetAttribute(this.courseDeviation, "width", "10");
                        diffAndSetAttribute(this.courseDeviation, "height", "125");
                        diffAndSetAttribute(this.courseDeviation, "fill", this.courseColor + '');
                        this.course.appendChild(this.courseDeviation);
                        this.courseFROM = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.courseFROM, "d", "M46 -15 l8 0 l0 -20 l-8 0 l0 20 Z");
                        diffAndSetAttribute(this.courseFROM, "fill", "none");
                        diffAndSetAttribute(this.courseFROM, "transform", "rotate(180 50 50)");
                        diffAndSetAttribute(this.courseFROM, "stroke", this.courseColor + '');
                        diffAndSetAttribute(this.courseFROM, "stroke-width", "1");
                        this.course.appendChild(this.courseFROM);
                        this.courseFROMLine = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.courseFROMLine, "d", "M50 -35 l0 " + (-circleRadius + 85) + " Z");
                        diffAndSetAttribute(this.courseFROMLine, "fill", "none");
                        diffAndSetAttribute(this.courseFROMLine, "transform", "rotate(180 50 50)");
                        diffAndSetAttribute(this.courseFROMLine, "stroke", this.courseColor + '');
                        diffAndSetAttribute(this.courseFROMLine, "stroke-width", "1");
                        this.course.appendChild(this.courseFROMLine);
                        let circlePosition = [-80, -40, 40, 80];
                        for (let i = 0; i < circlePosition.length; i++) {
                            let CDICircle = document.createElementNS(Avionics.SVG.NS, "circle");
                            diffAndSetAttribute(CDICircle, "cx", (50 + circlePosition[i]) + '');
                            diffAndSetAttribute(CDICircle, "cy", "50");
                            diffAndSetAttribute(CDICircle, "r", "5");
                            diffAndSetAttribute(CDICircle, "fill", "none");
                            diffAndSetAttribute(CDICircle, "stroke", "white");
                            diffAndSetAttribute(CDICircle, "stroke-width", "2");
                            this.course.appendChild(CDICircle);
                        }
                    }
                }
                this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.trackingGroup, "id", "trackingGroup");
                {
                    let rad = 5;
                    this.trackingBug = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(this.trackingBug, "id", "trackingBug");
                    diffAndSetAttribute(this.trackingBug, "cx", "50");
                    diffAndSetAttribute(this.trackingBug, "cy", (50 + circleRadius + rad) + '');
                    diffAndSetAttribute(this.trackingBug, "r", rad + '');
                    diffAndSetAttribute(this.trackingBug, "fill", "none");
                    diffAndSetAttribute(this.trackingBug, "stroke", "#ff00e0");
                    diffAndSetAttribute(this.trackingBug, "stroke-width", "2");
                    this.trackingGroup.appendChild(this.trackingBug);
                }
                this.rotatingCircle.appendChild(this.trackingGroup);
                this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.headingGroup, "id", "headingGroup");
                {
                }
                this.rotatingCircle.appendChild(this.headingGroup);
                this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.selectedHeadingGroup, "id", "selectedHeadingGroup");
                {
                    this.selectedHeadingLine = Avionics.SVG.computeDashLine(50, 50, circleRadius, 15, 3, "#00F2FF");
                    diffAndSetAttribute(this.selectedHeadingLine, "id", "selectedHeadingLine");
                    this.selectedHeadingGroup.appendChild(this.selectedHeadingLine);
                    this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.selectedHeadingBug, "id", "selectedHeadingBug");
                    diffAndSetAttribute(this.selectedHeadingBug, "d", "M50 " + (50 + circleRadius) + " h 22 v 18 h -7 l -15 -18 l -15 18 h -7 v -18 z");
                    diffAndSetAttribute(this.selectedHeadingBug, "fill", "#00F2FF");
                    this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
                }
                this.rotatingCircle.appendChild(this.selectedHeadingGroup);
                this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.ilsGroup, "id", "ILSGroup");
                {
                    let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(ilsBug, "id", "ilsBug");
                    diffAndSetAttribute(ilsBug, "d", "M50 " + (50 + circleRadius) + " l0 40 M35 " + (50 + circleRadius + 10) + " l30 0");
                    diffAndSetAttribute(ilsBug, "fill", "transparent");
                    diffAndSetAttribute(ilsBug, "stroke", "#FF0CE2");
                    diffAndSetAttribute(ilsBug, "stroke-width", "3");
                    this.ilsGroup.appendChild(ilsBug);
                }
                this.rotatingCircle.appendChild(this.ilsGroup);
            }
            this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.currentRefGroup, "id", "currentRefGroup");
            {
                let centerX = 50;
                let centerY = -340;
                let rectWidth = 65;
                let rectHeight = 40;
                let rectArrowFactor = 0.35;
                let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(rect, "x", (centerX - rectWidth * 0.5) + '');
                diffAndSetAttribute(rect, "y", (centerY - rectHeight * 0.5) + '');
                diffAndSetAttribute(rect, "width", rectWidth + '');
                diffAndSetAttribute(rect, "height", rectHeight + '');
                diffAndSetAttribute(rect, "fill", "#0e0d08");
                this.currentRefGroup.appendChild(rect);
                let d = "M" + (centerX - (rectWidth * 0.5)) + " " + (centerY - (rectHeight * 0.5));
                d += " l0 " + rectHeight;
                d += " l" + (rectWidth * rectArrowFactor) + " 0";
                d += " l" + (rectWidth * 0.5 - rectWidth * rectArrowFactor) + " 9";
                d += " l" + (rectWidth * 0.5 - rectWidth * rectArrowFactor) + " -9";
                d += " l" + (rectWidth * rectArrowFactor) + " 0";
                d += " l0 " + (-rectHeight);
                let path = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(path, "d", d);
                diffAndSetAttribute(path, "fill", "none");
                diffAndSetAttribute(path, "stroke", "white");
                diffAndSetAttribute(path, "stroke-width", "2");
                this.currentRefGroup.appendChild(path);
                this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.currentRefValue, "");
                diffAndSetAttribute(this.currentRefValue, "x", centerX + '');
                diffAndSetAttribute(this.currentRefValue, "y", centerY + '');
                diffAndSetAttribute(this.currentRefValue, "fill", "green");
                diffAndSetAttribute(this.currentRefValue, "font-size", "28");
                diffAndSetAttribute(this.currentRefValue, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.currentRefValue, "text-anchor", "middle");
                diffAndSetAttribute(this.currentRefValue, "alignment-baseline", "central");
                this.currentRefGroup.appendChild(this.currentRefValue);
            }
            viewBox.appendChild(this.currentRefGroup);
            this.selectedRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.selectedRefGroup, "id", "selectedRefGroup");
            {
                let centerX = -150;
                let centerY = -355;
                let spaceX = 5;
                this.selectedRefMode = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.selectedRefMode, "HDG");
                diffAndSetAttribute(this.selectedRefMode, "x", (centerX - spaceX) + '');
                diffAndSetAttribute(this.selectedRefMode, "y", centerY + '');
                diffAndSetAttribute(this.selectedRefMode, "fill", "#00F2FF");
                diffAndSetAttribute(this.selectedRefMode, "font-size", "18");
                diffAndSetAttribute(this.selectedRefMode, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.selectedRefMode, "text-anchor", "end");
                diffAndSetAttribute(this.selectedRefMode, "alignment-baseline", "central");
                this.selectedRefGroup.appendChild(this.selectedRefMode);
                this.selectedRefValue = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.selectedRefValue, "");
                diffAndSetAttribute(this.selectedRefValue, "x", (centerX + spaceX) + '');
                diffAndSetAttribute(this.selectedRefValue, "y", centerY + '');
                diffAndSetAttribute(this.selectedRefValue, "fill", "#00F2FF");
                diffAndSetAttribute(this.selectedRefValue, "font-size", "23");
                diffAndSetAttribute(this.selectedRefValue, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.selectedRefValue, "text-anchor", "start");
                diffAndSetAttribute(this.selectedRefValue, "alignment-baseline", "central");
                this.selectedRefGroup.appendChild(this.selectedRefValue);
            }
            viewBox.appendChild(this.selectedRefGroup);
        }
    }
    constructArc_A320_Neo() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "-225 -215 550 516");
        this.appendChild(this.root);
        var trsGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(trsGroup, "transform", "translate(0, 200)");
        this.root.appendChild(trsGroup);
        {
            let viewBox = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(viewBox, "x", "-225");
            diffAndSetAttribute(viewBox, "y", "-475");
            diffAndSetAttribute(viewBox, "viewBox", "-225 -550 550 600");
            trsGroup.appendChild(viewBox);
            var circleRadius = 425;
            var dashSpacing = 72;
            var maskHeight = 200;
            this.arcMaskGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.arcMaskGroup, "id", "MaskGroup");
            viewBox.appendChild(this.arcMaskGroup);
            {
                let topMask = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(topMask, "d", "M0 " + -maskHeight + ", L" + circleRadius * 2 + " " + -maskHeight + ", L" + circleRadius * 2 + " " + circleRadius + ", A 25 25 0 1 0 0, " + circleRadius + "Z");
                diffAndSetAttribute(topMask, "transform", "translate(" + (50 - circleRadius) + ", " + (50 - circleRadius) + ")");
                diffAndSetAttribute(topMask, "fill", "black");
                this.arcMaskGroup.appendChild(topMask);
            }
            this.arcRangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.arcRangeGroup, "id", "ArcRangeGroup");
            viewBox.appendChild(this.arcRangeGroup);
            {
                let rads = [0.25, 0.50, 0.75];
                let cone = [Math.PI, 0.92 * Math.PI, 0.88 * Math.PI];
                let count = [10, 22, 34];
                let width = 14;
                for (let r = 0; r < rads.length; r++) {
                    let rad = circleRadius * rads[r];
                    let radians = (Math.PI - cone[r]) * 0.5;
                    for (let i = 0; i <= count[r]; i++) {
                        let line = document.createElementNS(Avionics.SVG.NS, "rect");
                        let degrees = (radians / Math.PI) * 180;
                        diffAndSetAttribute(line, "x", "50");
                        diffAndSetAttribute(line, "y", (50 + rad) + '');
                        diffAndSetAttribute(line, "width", width + '');
                        diffAndSetAttribute(line, "height", "2");
                        diffAndSetAttribute(line, "transform", "rotate(" + (-degrees - 90) + " 50 50)");
                        diffAndSetAttribute(line, "fill", "white");
                        this.arcRangeGroup.appendChild(line);
                        radians += cone[r] / (count[r] + 0.5);
                    }
                    let vec = new Vec2(1, 0.6);
                    vec.SetNorm(rad - 25);
                    this.addMapRange(this.arcRangeGroup, 50 + vec.x, 50 - vec.y, "#00F2FF", "18", false, rads[r], true);
                    this.addMapRange(this.arcRangeGroup, 50 - vec.x, 50 - vec.y, "#00F2FF", "18", false, rads[r], true);
                }
                let vec = new Vec2(1, 0.6);
                vec.SetNorm(circleRadius - 25);
                this.addMapRange(this.arcRangeGroup, 50 + vec.x, 50 - vec.y, "#00F2FF", "18", false, 1.0, true);
                this.addMapRange(this.arcRangeGroup, 50 - vec.x, 50 - vec.y, "#00F2FF", "18", false, 1.0, true);
            }
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rotatingCircle, "id", "RotatingCircle");
            viewBox.appendChild(this.rotatingCircle);
            {
                let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(circle, "cx", "50");
                diffAndSetAttribute(circle, "cy", "50");
                diffAndSetAttribute(circle, "r", circleRadius + '');
                diffAndSetAttribute(circle, "fill-opacity", "0");
                diffAndSetAttribute(circle, "stroke", "white");
                diffAndSetAttribute(circle, "stroke-width", "2");
                this.rotatingCircle.appendChild(circle);
                let graduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(graduationGroup, "id", "graduationGroup");
                {
                    let radians = 0;
                    for (let i = 0; i < dashSpacing; i++) {
                        let line = document.createElementNS(Avionics.SVG.NS, "line");
                        let bIsBig = (i % 2 == 0) ? true : false;
                        let length = (bIsBig) ? 16 : 8.5;
                        let lineStart = 50 + circleRadius;
                        let lineEnd = 50 + circleRadius + length;
                        let degrees = (radians / Math.PI) * 180;
                        diffAndSetAttribute(line, "x1", "50");
                        diffAndSetAttribute(line, "y1", lineStart + '');
                        diffAndSetAttribute(line, "x2", "50");
                        diffAndSetAttribute(line, "y2", lineEnd + '');
                        diffAndSetAttribute(line, "transform", "rotate(" + (-degrees + 180) + " 50 50)");
                        diffAndSetAttribute(line, "stroke", "white");
                        diffAndSetAttribute(line, "stroke-width", "3");
                        if (bIsBig) {
                            let text = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetText(text, fastToFixed(degrees / 10, 0));
                            diffAndSetAttribute(text, "x", "50");
                            diffAndSetAttribute(text, "y", (-(circleRadius - 50 + length + 10)) + '');
                            diffAndSetAttribute(text, "fill", "white");
                            diffAndSetAttribute(text, "font-size", (i % 3 == 0) ? "28" : "20");
                            diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                            diffAndSetAttribute(text, "text-anchor", "middle");
                            diffAndSetAttribute(text, "alignment-baseline", "bottom");
                            diffAndSetAttribute(text, "transform", "rotate(" + degrees + " 50 50)");
                            graduationGroup.appendChild(text);
                        }
                        radians += (2 * Math.PI) / dashSpacing;
                        graduationGroup.appendChild(line);
                    }
                    this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(this.courseGroup, "id", "CourseInfo");
                    this.rotatingCircle.appendChild(this.courseGroup);
                    {
                        let bearing = document.createElementNS(Avionics.SVG.NS, "g");
                        diffAndSetAttribute(bearing, "id", "bearing");
                        this.courseGroup.appendChild(bearing);
                        {
                            this.bearing1_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                            diffAndSetAttribute(this.bearing1_Vor, "d", "M50 475 L50 460 M50 440 L50 370    M63 460 L50 440 L37 460 Z     M50 -375 L50 -360 M50 -340 L50 -270     M63 -340 L50 -360 L37 -340 Z");
                            diffAndSetAttribute(this.bearing1_Vor, "stroke", "white");
                            diffAndSetAttribute(this.bearing1_Vor, "stroke-width", "4");
                            diffAndSetAttribute(this.bearing1_Vor, "fill", "none");
                            diffAndSetAttribute(this.bearing1_Vor, "id", "bearing1_Vor");
                            diffAndSetAttribute(this.bearing1_Vor, "visibility", "hidden");
                            bearing.appendChild(this.bearing1_Vor);
                            this.bearing1_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                            diffAndSetAttribute(this.bearing1_Adf, "d", "M50 475 L50 370       M63 460 L50 440 L37 460       M50 -375 L50 -270      M63 -340 L50 -360 L37 -340");
                            diffAndSetAttribute(this.bearing1_Adf, "stroke", "lime");
                            diffAndSetAttribute(this.bearing1_Adf, "stroke-width", "4");
                            diffAndSetAttribute(this.bearing1_Adf, "fill", "none");
                            diffAndSetAttribute(this.bearing1_Adf, "id", "bearing1_Adf");
                            diffAndSetAttribute(this.bearing1_Adf, "visibility", "hidden");
                            bearing.appendChild(this.bearing1_Adf);
                            this.bearing2_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                            diffAndSetAttribute(this.bearing2_Vor, "d", "M50 475 L50 420 M58 420 L42 420    M58 420 L58 370 M42 420 L42 370     M50 -375 L50 -320   M58 -270 L58 -300 L63 -300 L50 -320 L37 -300 L42 -300 L42 -270");
                            diffAndSetAttribute(this.bearing2_Vor, "stroke", "white");
                            diffAndSetAttribute(this.bearing2_Vor, "stroke-width", "4");
                            diffAndSetAttribute(this.bearing2_Vor, "fill", "none");
                            diffAndSetAttribute(this.bearing2_Vor, "id", "bearing2_Vor");
                            diffAndSetAttribute(this.bearing2_Vor, "visibility", "hidden");
                            bearing.appendChild(this.bearing2_Vor);
                            this.bearing2_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                            diffAndSetAttribute(this.bearing2_Adf, "d", "M50 475 L50 400       M63 370 L63 420 L50 400 L37 420 L37 370       M50 -375 L50 -320      M63 -270 L63 -300 L50 -320 L37 -300 L37 -270");
                            diffAndSetAttribute(this.bearing2_Adf, "stroke", "lime");
                            diffAndSetAttribute(this.bearing2_Adf, "stroke-width", "4");
                            diffAndSetAttribute(this.bearing2_Adf, "fill", "none");
                            diffAndSetAttribute(this.bearing2_Adf, "id", "bearing2_Adf");
                            diffAndSetAttribute(this.bearing2_Adf, "visibility", "hidden");
                            bearing.appendChild(this.bearing2_Adf);
                        }
                    }
                    this.rotatingCircle.appendChild(graduationGroup);
                    this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(this.trackingGroup, "id", "trackingGroup");
                    {
                        var halfw = 7;
                        var halfh = 10;
                        this.trackingLine = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.trackingLine, "id", "trackingLine");
                        diffAndSetAttribute(this.trackingLine, "d", "M50 50 v " + (circleRadius - halfh * 2));
                        diffAndSetAttribute(this.trackingLine, "fill", "transparent");
                        diffAndSetAttribute(this.trackingLine, "stroke", "#00FF21");
                        diffAndSetAttribute(this.trackingLine, "stroke-width", "3");
                        this.trackingGroup.appendChild(this.trackingLine);
                        var p1 = (50) + ", " + (50 + circleRadius);
                        var p2 = (50 + halfw) + ", " + (50 + circleRadius - halfh);
                        var p3 = (50) + ", " + (50 + circleRadius - halfh * 2);
                        var p4 = (50 - halfw) + ", " + (50 + circleRadius - halfh);
                        this.trackingBug = document.createElementNS(Avionics.SVG.NS, "polygon");
                        diffAndSetAttribute(this.trackingBug, "id", "trackingBug");
                        diffAndSetAttribute(this.trackingBug, "points", p1 + " " + p2 + " " + p3 + " " + p4);
                        diffAndSetAttribute(this.trackingBug, "stroke", "#00FF21");
                        diffAndSetAttribute(this.trackingBug, "stroke-width", "2");
                        this.trackingGroup.appendChild(this.trackingBug);
                    }
                    this.rotatingCircle.appendChild(this.trackingGroup);
                    this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(this.headingGroup, "id", "headingGroup");
                    {
                        this.headingBug = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.headingBug, "id", "headingBug");
                        diffAndSetAttribute(this.headingBug, "d", "M50 " + (50 + circleRadius) + " l -11 20 l 22 0 z");
                        diffAndSetAttribute(this.headingBug, "stroke", "white");
                        diffAndSetAttribute(this.headingBug, "stroke-width", "2");
                        this.headingGroup.appendChild(this.headingBug);
                    }
                    this.rotatingCircle.appendChild(this.headingGroup);
                    this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(this.selectedHeadingGroup, "id", "selectedHeadingGroup");
                    {
                        this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.selectedHeadingBug, "id", "selectedHeadingBug");
                        diffAndSetAttribute(this.selectedHeadingBug, "d", "M50 " + (50 + circleRadius) + " l -11 20 l 22 0 z");
                        diffAndSetAttribute(this.selectedHeadingBug, "stroke", "#00F2FF");
                        diffAndSetAttribute(this.selectedHeadingBug, "stroke-width", "2");
                        diffAndSetAttribute(this.selectedHeadingBug, "fill", "none");
                        this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
                    }
                    this.rotatingCircle.appendChild(this.selectedHeadingGroup);
                    this.selectedTrackGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(this.selectedTrackGroup, "id", "selectedTrackGroup");
                    {
                        this.selectedTrackBug = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.selectedTrackBug, "id", "selectedTrackBug");
                        diffAndSetAttribute(this.selectedTrackBug, "d", "M50 " + (50 + circleRadius) + " l -11 20 l 22 0 z");
                        diffAndSetAttribute(this.selectedTrackBug, "stroke", "#00F2FF");
                        diffAndSetAttribute(this.selectedTrackBug, "stroke-width", "2");
                        diffAndSetAttribute(this.selectedTrackBug, "fill", "none");
                        this.selectedTrackGroup.appendChild(this.selectedTrackBug);
                    }
                    this.rotatingCircle.appendChild(this.selectedTrackGroup);
                    this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(this.ilsGroup, "id", "ILSGroup");
                    {
                        let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(ilsBug, "id", "ilsBug");
                        diffAndSetAttribute(ilsBug, "d", "M50 " + (50 + circleRadius) + " l0 40 M35 " + (50 + circleRadius + 10) + " l30 0");
                        diffAndSetAttribute(ilsBug, "fill", "transparent");
                        diffAndSetAttribute(ilsBug, "stroke", "#FF0CE2");
                        diffAndSetAttribute(ilsBug, "stroke-width", "3");
                        this.ilsGroup.appendChild(ilsBug);
                    }
                    this.rotatingCircle.appendChild(this.ilsGroup);
                }
                {
                    let lineStart = 50 - circleRadius - 18;
                    let lineEnd = 50 - circleRadius + 18;
                    let neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
                    diffAndSetAttribute(neutralLine, "id", "NeutralLine");
                    diffAndSetAttribute(neutralLine, "x1", "50");
                    diffAndSetAttribute(neutralLine, "y1", lineStart + '');
                    diffAndSetAttribute(neutralLine, "x2", "50");
                    diffAndSetAttribute(neutralLine, "y2", lineEnd + '');
                    diffAndSetAttribute(neutralLine, "stroke", "yellow");
                    diffAndSetAttribute(neutralLine, "stroke-width", "4");
                    viewBox.appendChild(neutralLine);
                }
                {
                    let x = -240;
                    let y = (50 - circleRadius + 45);
                    this.selectedHeadingLeftText = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(this.selectedHeadingLeftText, "999");
                    diffAndSetAttribute(this.selectedHeadingLeftText, "x", x + '');
                    diffAndSetAttribute(this.selectedHeadingLeftText, "y", y + '');
                    diffAndSetAttribute(this.selectedHeadingLeftText, "fill", "#00F2FF");
                    diffAndSetAttribute(this.selectedHeadingLeftText, "font-size", "20");
                    diffAndSetAttribute(this.selectedHeadingLeftText, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(this.selectedHeadingLeftText, "text-anchor", "middle");
                    diffAndSetAttribute(this.selectedHeadingLeftText, "transform", "rotate(-37.5 " + x + " " + y + ")");
                    viewBox.appendChild(this.selectedHeadingLeftText);
                    x = 340;
                    y = (50 - circleRadius + 45);
                    this.selectedHeadingRightText = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(this.selectedHeadingRightText, "000");
                    diffAndSetAttribute(this.selectedHeadingRightText, "x", x + '');
                    diffAndSetAttribute(this.selectedHeadingRightText, "y", y + '');
                    diffAndSetAttribute(this.selectedHeadingRightText, "fill", "#00F2FF");
                    diffAndSetAttribute(this.selectedHeadingRightText, "font-size", "20");
                    diffAndSetAttribute(this.selectedHeadingRightText, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(this.selectedHeadingRightText, "text-anchor", "middle");
                    diffAndSetAttribute(this.selectedHeadingRightText, "transform", "rotate(37.5 " + x + " " + y + ")");
                    viewBox.appendChild(this.selectedHeadingRightText);
                }
            }
        }
    }
    constructArc_B747_8() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "-225 -215 550 516");
        this.appendChild(this.root);
        var trsGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(trsGroup, "transform", "translate(-266, -208) scale(1.15)");
        this.root.appendChild(trsGroup);
        {
            let viewBox = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(viewBox, "viewBox", "-250 -475 600 700");
            trsGroup.appendChild(viewBox);
            var circleRadius = 450;
            var dashSpacing = 72;
            var maskHeight = 200;
            this.arcMaskGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.arcMaskGroup, "id", "MaskGroup");
            viewBox.appendChild(this.arcMaskGroup);
            {
                let topMask = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(topMask, "d", "M0 " + -maskHeight + ", L" + circleRadius * 2 + " " + -maskHeight + ", L" + circleRadius * 2 + " " + circleRadius + ", A 25 25 0 1 0 0, " + circleRadius + "Z");
                diffAndSetAttribute(topMask, "transform", "translate(" + (50 - circleRadius) + ", " + (50 - circleRadius) + ")");
                diffAndSetAttribute(topMask, "fill", "black");
                this.arcMaskGroup.appendChild(topMask);
            }
            this.arcRangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.arcRangeGroup, "id", "ArcRangeGroup");
            viewBox.appendChild(this.arcRangeGroup);
            {
                let rads = [0.25, 0.50, 0.75];
                for (let r = 0; r < rads.length; r++) {
                    let rad = circleRadius * rads[r];
                    let path = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(path, "d", "M" + (50 - rad) + ",50 a1,1 0 0 1 " + (rad * 2) + ",0");
                    diffAndSetAttribute(path, "fill", "none");
                    diffAndSetAttribute(path, "stroke", "white");
                    diffAndSetAttribute(path, "stroke-width", "2");
                    this.arcRangeGroup.appendChild(path);
                }
            }
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rotatingCircle, "id", "RotatingCircle");
            viewBox.appendChild(this.rotatingCircle);
            {
                let circleGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(circleGroup, "id", "circleGroup");
                {
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", "50");
                    diffAndSetAttribute(circle, "cy", "50");
                    diffAndSetAttribute(circle, "r", circleRadius + '');
                    diffAndSetAttribute(circle, "fill-opacity", "0");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    circleGroup.appendChild(circle);
                    let radians = 0;
                    for (let i = 0; i < dashSpacing; i++) {
                        let line = document.createElementNS(Avionics.SVG.NS, "line");
                        let bIsBig = (i % 2 == 0) ? true : false;
                        let length = (bIsBig) ? 16 : 8.5;
                        let lineStart = 50 + circleRadius;
                        let lineEnd = lineStart - length;
                        let degrees = (radians / Math.PI) * 180;
                        diffAndSetAttribute(line, "x1", "50");
                        diffAndSetAttribute(line, "y1", lineStart + '');
                        diffAndSetAttribute(line, "x2", "50");
                        diffAndSetAttribute(line, "y2", lineEnd + '');
                        diffAndSetAttribute(line, "transform", "rotate(" + (-degrees + 180) + " 50 50)");
                        diffAndSetAttribute(line, "stroke", "white");
                        diffAndSetAttribute(line, "stroke-width", "3");
                        if (bIsBig) {
                            let text = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetText(text, (i % 3 == 0) ? fastToFixed(degrees / 10, 0) : "");
                            diffAndSetAttribute(text, "x", "50");
                            diffAndSetAttribute(text, "y", (-(circleRadius - 50 - length - 18)) + '');
                            diffAndSetAttribute(text, "fill", "white");
                            diffAndSetAttribute(text, "font-size", (i % 3 == 0) ? "28" : "20");
                            diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                            diffAndSetAttribute(text, "text-anchor", "middle");
                            diffAndSetAttribute(text, "alignment-baseline", "central");
                            diffAndSetAttribute(text, "transform", "rotate(" + degrees + " 50 50)");
                            circleGroup.appendChild(text);
                        }
                        radians += (2 * Math.PI) / dashSpacing;
                        circleGroup.appendChild(line);
                    }
                }
                this.rotatingCircle.appendChild(circleGroup);
                this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.trackingGroup, "id", "trackingGroup");
                {
                    this.trackingLine = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.trackingLine, "id", "trackingLine");
                    diffAndSetAttribute(this.trackingLine, "d", "M50 70 v " + (circleRadius - 20));
                    diffAndSetAttribute(this.trackingLine, "fill", "transparent");
                    diffAndSetAttribute(this.trackingLine, "stroke", "white");
                    diffAndSetAttribute(this.trackingLine, "stroke-width", "3");
                    this.trackingGroup.appendChild(this.trackingLine);
                }
                this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.headingGroup, "id", "headingGroup");
                {
                    this.headingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.headingBug, "id", "headingBug");
                    diffAndSetAttribute(this.headingBug, "d", "M50 " + (50 + circleRadius) + " l -11 20 l 22 0 z");
                    diffAndSetAttribute(this.headingBug, "fill", "none");
                    diffAndSetAttribute(this.headingBug, "stroke", "white");
                    this.headingGroup.appendChild(this.headingBug);
                }
                this.rotatingCircle.appendChild(this.headingGroup);
                this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.courseGroup, "id", "CourseInfo");
                this.rotatingCircle.appendChild(this.courseGroup);
                {
                    let bearing = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(bearing, "id", "bearing");
                    this.courseGroup.appendChild(bearing);
                    {
                        this.bearing1_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.bearing1_Vor, "d", "M60 -403 L50 -413 L40 -403 M50 -413 L50 -340 M65 -349 L35 -349     M50 445 L50 510 M65 510 L50 500 L35 510");
                        diffAndSetAttribute(this.bearing1_Vor, "stroke", "green");
                        diffAndSetAttribute(this.bearing1_Vor, "stroke-width", "3");
                        diffAndSetAttribute(this.bearing1_Vor, "fill", "none");
                        diffAndSetAttribute(this.bearing1_Vor, "id", "bearing1_Vor");
                        diffAndSetAttribute(this.bearing1_Vor, "visibility", "hidden");
                        bearing.appendChild(this.bearing1_Vor);
                        this.bearing1_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.bearing1_Adf, "d", "M60 -403 L50 -413 L40 -403 M50 -413 L50 -340 M65 -349 L35 -349     M50 445 L50 510 M65 510 L50 500 L35 510");
                        diffAndSetAttribute(this.bearing1_Adf, "stroke", "cyan");
                        diffAndSetAttribute(this.bearing1_Adf, "stroke-width", "3");
                        diffAndSetAttribute(this.bearing1_Adf, "fill", "none");
                        diffAndSetAttribute(this.bearing1_Adf, "id", "bearing1_Adf");
                        diffAndSetAttribute(this.bearing1_Adf, "visibility", "hidden");
                        bearing.appendChild(this.bearing1_Adf);
                        this.bearing2_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.bearing2_Vor, "d", "M60 -403 L50 -413 L40 -403 L40 -349 L30 -349 L30 -340 L70 -340 L70 -349 L60 -349 L60 -403        M65 510 L50 500 L35 510 L35 520 L50 510 L65 520 L65 510 M57 505 L57 452 L50 445 L43 452 L43 505");
                        diffAndSetAttribute(this.bearing2_Vor, "stroke", "green");
                        diffAndSetAttribute(this.bearing2_Vor, "stroke-width", "3");
                        diffAndSetAttribute(this.bearing2_Vor, "fill", "none");
                        diffAndSetAttribute(this.bearing2_Vor, "id", "bearing2_Vor");
                        diffAndSetAttribute(this.bearing2_Vor, "visibility", "hidden");
                        bearing.appendChild(this.bearing2_Vor);
                        this.bearing2_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.bearing2_Adf, "d", "M60 -403 L50 -413 L40 -403 L40 -349 L30 -349 L30 -340 L70 -340 L70 -349 L60 -349 L60 -403        M65 510 L50 500 L35 510 L35 520 L50 510 L65 520 L65 510 M57 505 L57 452 L50 445 L43 452 L43 505");
                        diffAndSetAttribute(this.bearing2_Adf, "stroke", "cyan");
                        diffAndSetAttribute(this.bearing2_Adf, "stroke-width", "3");
                        diffAndSetAttribute(this.bearing2_Adf, "fill", "none");
                        diffAndSetAttribute(this.bearing2_Adf, "id", "bearing2_Adf");
                        diffAndSetAttribute(this.bearing2_Adf, "visibility", "hidden");
                        bearing.appendChild(this.bearing2_Adf);
                    }
                    this.course = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(this.course, "id", "course");
                    this.courseGroup.appendChild(this.course);
                    {
                        this.courseColor = "";
                        if (this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                            this.courseColor = "#ff00ff";
                        }
                        else if (this.navigationMode == Jet_NDCompass_Navigation.VOR) {
                            this.courseColor = "#00ffff";
                        }
                        this.courseTO = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.courseTO, "d", "M46 110 l8 0 l0 25 l-4 5 l-4 -5 l0 -25 Z");
                        diffAndSetAttribute(this.courseTO, "fill", "none");
                        diffAndSetAttribute(this.courseTO, "transform", "rotate(180 50 50)");
                        diffAndSetAttribute(this.courseTO, "stroke", this.courseColor + '');
                        diffAndSetAttribute(this.courseTO, "stroke-width", "1");
                        this.course.appendChild(this.courseTO);
                        this.courseTOLine = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.courseTOLine, "d", "M50 140 l0 " + (circleRadius - 90) + " Z");
                        diffAndSetAttribute(this.courseTOLine, "transform", "rotate(180 50 50)");
                        diffAndSetAttribute(this.courseTOLine, "stroke", this.courseColor + '');
                        diffAndSetAttribute(this.courseTOLine, "stroke-width", "1");
                        this.course.appendChild(this.courseTOLine);
                        this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(this.courseDeviation, "x", "45");
                        diffAndSetAttribute(this.courseDeviation, "y", "-10");
                        diffAndSetAttribute(this.courseDeviation, "width", "10");
                        diffAndSetAttribute(this.courseDeviation, "height", "125");
                        diffAndSetAttribute(this.courseDeviation, "fill", this.courseColor + '');
                        this.course.appendChild(this.courseDeviation);
                        this.courseFROM = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.courseFROM, "d", "M46 -15 l8 0 l0 -20 l-8 0 l0 20 Z");
                        diffAndSetAttribute(this.courseFROM, "fill", "none");
                        diffAndSetAttribute(this.courseFROM, "transform", "rotate(180 50 50)");
                        diffAndSetAttribute(this.courseFROM, "stroke", this.courseColor + '');
                        diffAndSetAttribute(this.courseFROM, "stroke-width", "1");
                        this.course.appendChild(this.courseFROM);
                        this.courseFROMLine = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.courseFROMLine, "d", "M50 -35 l0 " + (-circleRadius + 85) + " Z");
                        diffAndSetAttribute(this.courseFROMLine, "fill", "none");
                        diffAndSetAttribute(this.courseFROMLine, "transform", "rotate(180 50 50)");
                        diffAndSetAttribute(this.courseFROMLine, "stroke", this.courseColor + '');
                        diffAndSetAttribute(this.courseFROMLine, "stroke-width", "1");
                        this.course.appendChild(this.courseFROMLine);
                        let circlePosition = [-80, -40, 40, 80];
                        for (let i = 0; i < circlePosition.length; i++) {
                            let CDICircle = document.createElementNS(Avionics.SVG.NS, "circle");
                            diffAndSetAttribute(CDICircle, "cx", (50 + circlePosition[i]) + '');
                            diffAndSetAttribute(CDICircle, "cy", "50");
                            diffAndSetAttribute(CDICircle, "r", "5");
                            diffAndSetAttribute(CDICircle, "fill", "none");
                            diffAndSetAttribute(CDICircle, "stroke", "white");
                            diffAndSetAttribute(CDICircle, "stroke-width", "2");
                            this.course.appendChild(CDICircle);
                        }
                    }
                }
                this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.selectedHeadingGroup, "id", "selectedHeadingGroup");
                {
                    this.selectedHeadingLine = Avionics.SVG.computeDashLine(50, 70, (circleRadius - 5), 15, 3, "#ff00e0");
                    diffAndSetAttribute(this.selectedHeadingLine, "id", "selectedHeadingLine");
                    this.selectedHeadingGroup.appendChild(this.selectedHeadingLine);
                    this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.selectedHeadingBug, "id", "selectedHeadingBug");
                    diffAndSetAttribute(this.selectedHeadingBug, "d", "M50 " + (50 + circleRadius) + " h 22 v 22 h -7 l -15 -22 l -15 22 h -7 v -22 z");
                    diffAndSetAttribute(this.selectedHeadingBug, "stroke", "#ff00e0");
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
                    diffAndSetAttribute(this.selectedTrackBug, "stroke", "#ff00e0");
                    diffAndSetAttribute(this.selectedTrackBug, "stroke-width", "2");
                    this.selectedTrackGroup.appendChild(this.selectedTrackBug);
                }
                this.rotatingCircle.appendChild(this.selectedTrackGroup);
                this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.ilsGroup, "id", "ILSGroup");
                {
                    let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(ilsBug, "id", "ilsBug");
                    diffAndSetAttribute(ilsBug, "d", "M50 " + (50 + circleRadius) + " l0 40 M35 " + (50 + circleRadius + 10) + " l30 0");
                    diffAndSetAttribute(ilsBug, "fill", "transparent");
                    diffAndSetAttribute(ilsBug, "stroke", "#FF0CE2");
                    diffAndSetAttribute(ilsBug, "stroke-width", "3");
                    this.ilsGroup.appendChild(ilsBug);
                }
                this.rotatingCircle.appendChild(this.ilsGroup);
            }
            {
                this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.currentRefGroup, "id", "currentRefGroup");
                {
                    let centerX = 50;
                    let centerY = -442;
                    let rectWidth = 65;
                    let rectHeight = 40;
                    let textOffset = 5;
                    this.currentRefMode = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(this.currentRefMode, "HDG");
                    diffAndSetAttribute(this.currentRefMode, "x", (centerX - rectWidth * 0.5 - textOffset) + '');
                    diffAndSetAttribute(this.currentRefMode, "y", centerY + '');
                    diffAndSetAttribute(this.currentRefMode, "fill", "green");
                    diffAndSetAttribute(this.currentRefMode, "font-size", "23");
                    diffAndSetAttribute(this.currentRefMode, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(this.currentRefMode, "text-anchor", "end");
                    diffAndSetAttribute(this.currentRefMode, "alignment-baseline", "central");
                    this.currentRefGroup.appendChild(this.currentRefMode);
                    let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(rect, "x", (centerX - rectWidth * 0.5) + '');
                    diffAndSetAttribute(rect, "y", (centerY - rectHeight * 0.5) + '');
                    diffAndSetAttribute(rect, "width", rectWidth + '');
                    diffAndSetAttribute(rect, "height", rectHeight + '');
                    diffAndSetAttribute(rect, "fill", "black");
                    this.currentRefGroup.appendChild(rect);
                    let path = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(path, "d", "M" + (centerX - (rectWidth * 0.5)) + " " + (centerY - (rectHeight * 0.5)) + " l0 " + rectHeight + " l" + rectWidth + " 0 l0 " + (-rectHeight));
                    diffAndSetAttribute(path, "fill", "none");
                    diffAndSetAttribute(path, "stroke", "white");
                    diffAndSetAttribute(path, "stroke-width", "1");
                    this.currentRefGroup.appendChild(path);
                    this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(this.currentRefValue, "266");
                    diffAndSetAttribute(this.currentRefValue, "x", centerX + '');
                    diffAndSetAttribute(this.currentRefValue, "y", centerY + '');
                    diffAndSetAttribute(this.currentRefValue, "fill", "white");
                    diffAndSetAttribute(this.currentRefValue, "font-size", "28");
                    diffAndSetAttribute(this.currentRefValue, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(this.currentRefValue, "text-anchor", "middle");
                    diffAndSetAttribute(this.currentRefValue, "alignment-baseline", "central");
                    this.currentRefGroup.appendChild(this.currentRefValue);
                    this.currentRefType = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(this.currentRefType, "MAG");
                    diffAndSetAttribute(this.currentRefType, "x", (centerX + rectWidth * 0.5 + textOffset) + '');
                    diffAndSetAttribute(this.currentRefType, "y", centerY + '');
                    diffAndSetAttribute(this.currentRefType, "fill", "green");
                    diffAndSetAttribute(this.currentRefType, "font-size", "23");
                    diffAndSetAttribute(this.currentRefType, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(this.currentRefType, "text-anchor", "start");
                    diffAndSetAttribute(this.currentRefType, "alignment-baseline", "central");
                    this.currentRefGroup.appendChild(this.currentRefType);
                }
                viewBox.appendChild(this.currentRefGroup);
                let rangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(rangeGroup, "id", "RangeGroup");
                diffAndSetAttribute(rangeGroup, "transform", "scale(0.8)");
                {
                    let centerX = -95;
                    let centerY = -540;
                    let textBg = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(textBg, "x", (centerX - 40) + '');
                    diffAndSetAttribute(textBg, "y", (centerY - 32) + '');
                    diffAndSetAttribute(textBg, "width", "80");
                    diffAndSetAttribute(textBg, "height", "64");
                    diffAndSetAttribute(textBg, "fill", "black");
                    diffAndSetAttribute(textBg, "stroke", "white");
                    diffAndSetAttribute(textBg, "stroke-width", "1");
                    rangeGroup.appendChild(textBg);
                    let textTitle = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(textTitle, "RANGE");
                    diffAndSetAttribute(textTitle, "x", centerX + '');
                    diffAndSetAttribute(textTitle, "y", (centerY - 15) + '');
                    diffAndSetAttribute(textTitle, "fill", "white");
                    diffAndSetAttribute(textTitle, "font-size", "25");
                    diffAndSetAttribute(textTitle, "font-family", "Roboto-Light");
                    diffAndSetAttribute(textTitle, "text-anchor", "middle");
                    diffAndSetAttribute(textTitle, "alignment-baseline", "central");
                    rangeGroup.appendChild(textTitle);
                    this.addMapRange(rangeGroup, centerX, (centerY + 15), "white", "25", false, 1.0, false);
                }
                viewBox.appendChild(rangeGroup);
            }
        }
    }
    constructArc_AS01B() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 1000 710");
        this.appendChild(this.root);
        var trsGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(trsGroup, "transform", "translate(-45, -100) scale(1.09)");
        this.root.appendChild(trsGroup);
        {
            var circleRadius;
            let viewBox = document.createElementNS(Avionics.SVG.NS, "svg");
            if (this._fullscreen) {
                diffAndSetAttribute(viewBox, "viewBox", "-250 -550 600 650");
                circleRadius = 419;
            }
            else {
                diffAndSetAttribute(viewBox, "viewBox", "-750 -1200 1400 1400");
                circleRadius = 1100;
            }
            trsGroup.appendChild(viewBox);
            this.arcMaskGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.arcMaskGroup, "id", "MaskGroup");
            viewBox.appendChild(this.arcMaskGroup);
            {
                var maskMargin = 10;
                var maskHeight = 200;
                let topMask = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(topMask, "id", "MaskGroup");
                diffAndSetAttribute(topMask, "d", "M" + (-maskMargin) + " " + -maskHeight + ", L" + (circleRadius * 2 + maskMargin) + " " + -maskHeight + ", L" + (circleRadius * 2 + maskMargin) + " " + circleRadius + ", L" + (circleRadius * 2) + " " + circleRadius + ", A 25 25 0 1 0 0, " + circleRadius + ", L" + (-maskMargin) + " " + circleRadius + " Z");
                diffAndSetAttribute(topMask, "transform", "translate(" + (50 - circleRadius) + ", " + (50 - circleRadius) + ")");
                diffAndSetAttribute(topMask, "fill", "black");
                this.arcMaskGroup.appendChild(topMask);
            }
            this.arcRangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.arcRangeGroup, "id", "ArcRangeGroup");
            viewBox.appendChild(this.arcRangeGroup);
            {
                let rads = [0.25, 0.50, 0.75];
                for (let r = 0; r < rads.length; r++) {
                    let rad = circleRadius * rads[r];
                    let path = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(path, "d", "M" + (50 - rad) + ",50 a1,1 0 0 1 " + (rad * 2) + ",0");
                    diffAndSetAttribute(path, "fill", "none");
                    diffAndSetAttribute(path, "stroke", "white");
                    diffAndSetAttribute(path, "stroke-width", "2");
                    this.arcRangeGroup.appendChild(path);
                }
            }
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rotatingCircle, "id", "RotatingCircle");
            viewBox.appendChild(this.rotatingCircle);
            {
                let circleGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(circleGroup, "id", "circleGroup");
                {
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", "50");
                    diffAndSetAttribute(circle, "cy", "50");
                    diffAndSetAttribute(circle, "r", circleRadius + '');
                    diffAndSetAttribute(circle, "fill-opacity", "0");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    circleGroup.appendChild(circle);
                    let radians = 0;
                    let dashSpacing = 72;
                    for (let i = 0; i < dashSpacing; i++) {
                        let line = document.createElementNS(Avionics.SVG.NS, "line");
                        let bIsBig = (i % 2 == 0) ? true : false;
                        let length = (bIsBig) ? 16 : 8.5;
                        let lineStart = 50 + circleRadius;
                        let lineEnd = lineStart - length;
                        let degrees = (radians / Math.PI) * 180;
                        diffAndSetAttribute(line, "x1", "50");
                        diffAndSetAttribute(line, "y1", lineStart + '');
                        diffAndSetAttribute(line, "x2", "50");
                        diffAndSetAttribute(line, "y2", lineEnd + '');
                        diffAndSetAttribute(line, "transform", "rotate(" + (-degrees + 180) + " 50 50)");
                        diffAndSetAttribute(line, "stroke", "white");
                        diffAndSetAttribute(line, "stroke-width", "3");
                        if (bIsBig) {
                            let text = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetText(text, (i % 3 == 0) ? fastToFixed(degrees / 10, 0) : "");
                            diffAndSetAttribute(text, "x", "50");
                            diffAndSetAttribute(text, "y", (-(circleRadius - 50 - length - 18)) + '');
                            diffAndSetAttribute(text, "fill", "white");
                            diffAndSetAttribute(text, "font-size", (i % 3 == 0) ? "28" : "20");
                            diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                            diffAndSetAttribute(text, "text-anchor", "middle");
                            diffAndSetAttribute(text, "alignment-baseline", "central");
                            diffAndSetAttribute(text, "transform", "rotate(" + degrees + " 50 50)");
                            circleGroup.appendChild(text);
                        }
                        radians += (2 * Math.PI) / dashSpacing;
                        circleGroup.appendChild(line);
                    }
                }
                this.rotatingCircle.appendChild(circleGroup);
                this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.trackingGroup, "id", "trackingGroup");
                {
                    this.trackingLine = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.trackingLine, "id", "trackingLine");
                    diffAndSetAttribute(this.trackingLine, "d", "M50 70 v " + (circleRadius - 20));
                    diffAndSetAttribute(this.trackingLine, "fill", "transparent");
                    diffAndSetAttribute(this.trackingLine, "stroke", "white");
                    diffAndSetAttribute(this.trackingLine, "stroke-width", "3");
                    this.trackingGroup.appendChild(this.trackingLine);
                }
                this.rotatingCircle.appendChild(this.trackingGroup);
                this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.headingGroup, "id", "headingGroup");
                {
                    this.headingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.headingBug, "id", "headingBug");
                    diffAndSetAttribute(this.headingBug, "d", "M50 " + (50 + circleRadius) + " l -11 20 l 22 0 z");
                    diffAndSetAttribute(this.headingBug, "fill", "none");
                    diffAndSetAttribute(this.headingBug, "stroke", "white");
                    this.headingGroup.appendChild(this.headingBug);
                }
                this.rotatingCircle.appendChild(this.headingGroup);
                this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.courseGroup, "id", "CourseInfo");
                this.rotatingCircle.appendChild(this.courseGroup);
                {
                    let scale;
                    let bearingScale;
                    if (this._fullscreen) {
                        scale = 0.8;
                        bearingScale = 1.0;
                        diffAndSetAttribute(this.courseGroup, "transform", "translate(10 10) scale(0.8)");
                    }
                    else {
                        scale = 1.5;
                        bearingScale = 0.8;
                        diffAndSetAttribute(this.courseGroup, "transform", "translate(-24 -24) scale(1.5)");
                    }
                    let bearingScaleCorrection = -((50 * bearingScale) - 50);
                    let bearing = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(bearing, "id", "bearing");
                    diffAndSetAttribute(bearing, "transform", "translate(" + bearingScaleCorrection + " " + bearingScaleCorrection + ") scale(" + bearingScale + ")");
                    this.courseGroup.appendChild(bearing);
                    {
                        this.bearing1_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                        if (this._fullscreen) {
                            diffAndSetAttribute(this.bearing1_Vor, "d", "M60 -477 L50 -487 L40 -477 M50 -487 L50 -405 M70 -410 L30 -410     M50 510 L50 585 M65 585 L50 575 L35 585");
                            diffAndSetAttribute(this.bearing1_Vor, "stroke-width", "3");
                        }
                        else {
                            diffAndSetAttribute(this.bearing1_Vor, "d", "M60 -870 L50 -880 L40 -870 M50 -880 L50 -805 M70 -810 L30 -810     M50 905 L50 980 M65 980 L50 970 L35 980");
                            diffAndSetAttribute(this.bearing1_Vor, "stroke-width", "4");
                        }
                        diffAndSetAttribute(this.bearing1_Vor, "stroke", "green");
                        diffAndSetAttribute(this.bearing1_Vor, "fill", "none");
                        diffAndSetAttribute(this.bearing1_Vor, "id", "bearing1_Vor");
                        diffAndSetAttribute(this.bearing1_Vor, "visibility", "hidden");
                        bearing.appendChild(this.bearing1_Vor);
                        this.bearing1_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                        if (this._fullscreen) {
                            diffAndSetAttribute(this.bearing1_Adf, "d", "M60 -477 L50 -487 L40 -477 M50 -487 L50 -405 M70 -410 L30 -410     M50 510 L50 585 M65 585 L50 575 L35 585");
                            diffAndSetAttribute(this.bearing1_Adf, "stroke-width", "3");
                        }
                        else {
                            diffAndSetAttribute(this.bearing1_Adf, "d", "M60 -870 L50 -880 L40 -870 M50 -880 L50 -805 M70 -810 L30 -810     M50 905 L50 980 M65 980 L50 970 L35 980");
                            diffAndSetAttribute(this.bearing1_Adf, "stroke-width", "4");
                        }
                        diffAndSetAttribute(this.bearing1_Adf, "stroke", "cyan");
                        diffAndSetAttribute(this.bearing1_Adf, "fill", "none");
                        diffAndSetAttribute(this.bearing1_Adf, "id", "bearing1_Adf");
                        diffAndSetAttribute(this.bearing1_Adf, "visibility", "hidden");
                        bearing.appendChild(this.bearing1_Adf);
                        this.bearing2_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                        if (this._fullscreen) {
                            diffAndSetAttribute(this.bearing2_Vor, "d", "M60 -477 L50 -487 L40 -477 L40 -415 L30 -415 L30 -405 L70 -405 L70 -415 L60 -415 L60 -477        M65 585 L50 575 L35 585 L35 595 L50 585 L65 595 L65 585 M57 580 L57 517 L50 510 L43 517 L43 580");
                            diffAndSetAttribute(this.bearing2_Vor, "stroke-width", "3");
                        }
                        else {
                            diffAndSetAttribute(this.bearing2_Vor, "d", "M60 -870 L50 -880 L40 -870 L40 -815 L30 -815 L30 -805 L70 -805 L70 -815 L60 -815 L60 -870        M65 978 L50 968 L35 978 L35 988 L50 978 L65 988 L65 978 M57 973 L57 910 L50 903 L43 910 L43 973");
                            diffAndSetAttribute(this.bearing2_Vor, "stroke-width", "4");
                        }
                        diffAndSetAttribute(this.bearing2_Vor, "stroke", "green");
                        diffAndSetAttribute(this.bearing2_Vor, "fill", "none");
                        diffAndSetAttribute(this.bearing2_Vor, "id", "bearing2_Vor");
                        diffAndSetAttribute(this.bearing2_Vor, "visibility", "hidden");
                        bearing.appendChild(this.bearing2_Vor);
                        this.bearing2_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                        if (this._fullscreen) {
                            diffAndSetAttribute(this.bearing2_Adf, "d", "M60 -477 L50 -487 L40 -477 L40 -415 L30 -415 L30 -405 L70 -405 L70 -415 L60 -415 L60 -477        M65 585 L50 575 L35 585 L35 595 L50 585 L65 595 L65 585 M57 580 L57 517 L50 510 L43 517 L43 580");
                            diffAndSetAttribute(this.bearing2_Adf, "stroke-width", "3");
                        }
                        else {
                            diffAndSetAttribute(this.bearing2_Adf, "d", "M60 -870 L50 -880 L40 -870 L40 -815 L30 -815 L30 -805 L70 -805 L70 -815 L60 -815 L60 -870        M65 978 L50 968 L35 978 L35 988 L50 978 L65 988 L65 978 M57 973 L57 910 L50 903 L43 910 L43 973");
                            diffAndSetAttribute(this.bearing2_Adf, "stroke-width", "4");
                        }
                        diffAndSetAttribute(this.bearing2_Adf, "stroke", "cyan");
                        diffAndSetAttribute(this.bearing2_Adf, "fill", "none");
                        diffAndSetAttribute(this.bearing2_Adf, "id", "bearing2_Adf");
                        diffAndSetAttribute(this.bearing2_Adf, "visibility", "hidden");
                        bearing.appendChild(this.bearing2_Adf);
                    }
                    this.course = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(this.course, "id", "course");
                    this.courseGroup.appendChild(this.course);
                    {
                        this.courseColor = "";
                        if (this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                            this.courseColor = "#ff00ff";
                        }
                        else if (this.navigationMode == Jet_NDCompass_Navigation.VOR) {
                            this.courseColor = "#00ffff";
                        }
                        this.courseTO = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.courseTO, "d", "M46 110 l8 0 l0 25 l-4 5 l-4 -5 l0 -25 Z");
                        diffAndSetAttribute(this.courseTO, "fill", "none");
                        diffAndSetAttribute(this.courseTO, "transform", "rotate(180 50 50)");
                        diffAndSetAttribute(this.courseTO, "stroke", this.courseColor + '');
                        diffAndSetAttribute(this.courseTO, "stroke-width", "1");
                        this.course.appendChild(this.courseTO);
                        this.courseTOLine = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.courseTOLine, "d", "M50 140 l0 " + ((circleRadius / scale) - 90) + " Z");
                        diffAndSetAttribute(this.courseTOLine, "transform", "rotate(180 50 50)");
                        diffAndSetAttribute(this.courseTOLine, "stroke", this.courseColor + '');
                        diffAndSetAttribute(this.courseTOLine, "stroke-width", "1");
                        this.course.appendChild(this.courseTOLine);
                        this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(this.courseDeviation, "x", "45");
                        diffAndSetAttribute(this.courseDeviation, "y", "-10");
                        diffAndSetAttribute(this.courseDeviation, "width", "10");
                        diffAndSetAttribute(this.courseDeviation, "height", "125");
                        diffAndSetAttribute(this.courseDeviation, "fill", this.courseColor + '');
                        this.course.appendChild(this.courseDeviation);
                        this.courseFROM = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.courseFROM, "d", "M46 -15 l8 0 l0 -20 l-8 0 l0 20 Z");
                        diffAndSetAttribute(this.courseFROM, "fill", "none");
                        diffAndSetAttribute(this.courseFROM, "transform", "rotate(180 50 50)");
                        diffAndSetAttribute(this.courseFROM, "stroke", this.courseColor + '');
                        diffAndSetAttribute(this.courseFROM, "stroke-width", "1");
                        this.course.appendChild(this.courseFROM);
                        this.courseFROMLine = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.courseFROMLine, "d", "M50 -35 l0 " + (-(circleRadius / scale) + 85) + " Z");
                        diffAndSetAttribute(this.courseFROMLine, "fill", "none");
                        diffAndSetAttribute(this.courseFROMLine, "transform", "rotate(180 50 50)");
                        diffAndSetAttribute(this.courseFROMLine, "stroke", this.courseColor + '');
                        diffAndSetAttribute(this.courseFROMLine, "stroke-width", "1");
                        this.course.appendChild(this.courseFROMLine);
                        let circlePosition = [-80, -40, 40, 80];
                        for (let i = 0; i < circlePosition.length; i++) {
                            let CDICircle = document.createElementNS(Avionics.SVG.NS, "circle");
                            diffAndSetAttribute(CDICircle, "cx", (50 + circlePosition[i]) + '');
                            diffAndSetAttribute(CDICircle, "cy", "50");
                            diffAndSetAttribute(CDICircle, "r", "5");
                            diffAndSetAttribute(CDICircle, "fill", "none");
                            diffAndSetAttribute(CDICircle, "stroke", "white");
                            diffAndSetAttribute(CDICircle, "stroke-width", "2");
                            this.course.appendChild(CDICircle);
                        }
                    }
                }
                this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.selectedHeadingGroup, "id", "selectedHeadingGroup");
                {
                    this.selectedHeadingLine = Avionics.SVG.computeDashLine(50, 70, (circleRadius - 5), 15, 3, "#ff00e0");
                    diffAndSetAttribute(this.selectedHeadingLine, "id", "selectedHeadingLine");
                    this.selectedHeadingGroup.appendChild(this.selectedHeadingLine);
                    this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.selectedHeadingBug, "id", "selectedHeadingBug");
                    diffAndSetAttribute(this.selectedHeadingBug, "d", "M50 " + (50 + circleRadius) + " h 22 v 22 h -7 l -15 -22 l -15 22 h -7 v -22 z");
                    diffAndSetAttribute(this.selectedHeadingBug, "stroke", "#ff00e0");
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
                    diffAndSetAttribute(this.selectedTrackBug, "stroke", "#ff00e0");
                    diffAndSetAttribute(this.selectedTrackBug, "stroke-width", "2");
                    this.selectedTrackGroup.appendChild(this.selectedTrackBug);
                }
                this.rotatingCircle.appendChild(this.selectedTrackGroup);
                this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.ilsGroup, "id", "ILSGroup");
                {
                    let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(ilsBug, "id", "ilsBug");
                    diffAndSetAttribute(ilsBug, "d", "M50 " + (50 + circleRadius) + " l0 40 M35 " + (50 + circleRadius + 10) + " l30 0");
                    diffAndSetAttribute(ilsBug, "fill", "transparent");
                    diffAndSetAttribute(ilsBug, "stroke", "#FF0CE2");
                    diffAndSetAttribute(ilsBug, "stroke-width", "3");
                    this.ilsGroup.appendChild(ilsBug);
                }
                this.rotatingCircle.appendChild(this.ilsGroup);
            }
            {
                this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.currentRefGroup, "id", "currentRefGroup");
                {
                    if (!this._fullscreen) {
                        diffAndSetAttribute(this.currentRefGroup, "transform", "translate(-10 212) scale(1.2)");
                    }
                    let centerX = 50;
                    let centerY = 50 - circleRadius - 40;
                    let rectWidth = 65;
                    let rectHeight = 40;
                    let textOffset = 5;
                    this.currentRefMode = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(this.currentRefMode, "HDG");
                    diffAndSetAttribute(this.currentRefMode, "x", (centerX - rectWidth * 0.5 - textOffset) + '');
                    diffAndSetAttribute(this.currentRefMode, "y", centerY + '');
                    diffAndSetAttribute(this.currentRefMode, "fill", "green");
                    diffAndSetAttribute(this.currentRefMode, "font-size", "23");
                    diffAndSetAttribute(this.currentRefMode, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(this.currentRefMode, "text-anchor", "end");
                    diffAndSetAttribute(this.currentRefMode, "alignment-baseline", "central");
                    this.currentRefGroup.appendChild(this.currentRefMode);
                    let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(rect, "x", (centerX - rectWidth * 0.5) + '');
                    diffAndSetAttribute(rect, "y", (centerY - rectHeight * 0.5) + '');
                    diffAndSetAttribute(rect, "width", rectWidth + '');
                    diffAndSetAttribute(rect, "height", rectHeight + '');
                    diffAndSetAttribute(rect, "fill", "black");
                    this.currentRefGroup.appendChild(rect);
                    let path = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(path, "d", "M" + (centerX - (rectWidth * 0.5)) + " " + (centerY - (rectHeight * 0.5)) + " l0 " + rectHeight + " l" + rectWidth + " 0 l0 " + (-rectHeight));
                    diffAndSetAttribute(path, "fill", "none");
                    diffAndSetAttribute(path, "stroke", "white");
                    diffAndSetAttribute(path, "stroke-width", "1");
                    this.currentRefGroup.appendChild(path);
                    this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(this.currentRefValue, "266");
                    diffAndSetAttribute(this.currentRefValue, "x", centerX + '');
                    diffAndSetAttribute(this.currentRefValue, "y", centerY + '');
                    diffAndSetAttribute(this.currentRefValue, "fill", "white");
                    diffAndSetAttribute(this.currentRefValue, "font-size", "28");
                    diffAndSetAttribute(this.currentRefValue, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(this.currentRefValue, "text-anchor", "middle");
                    diffAndSetAttribute(this.currentRefValue, "alignment-baseline", "central");
                    this.currentRefGroup.appendChild(this.currentRefValue);
                    this.currentRefType = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(this.currentRefType, "MAG");
                    diffAndSetAttribute(this.currentRefType, "x", (centerX + rectWidth * 0.5 + textOffset) + '');
                    diffAndSetAttribute(this.currentRefType, "y", centerY + '');
                    diffAndSetAttribute(this.currentRefType, "fill", "green");
                    diffAndSetAttribute(this.currentRefType, "font-size", "23");
                    diffAndSetAttribute(this.currentRefType, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(this.currentRefType, "text-anchor", "start");
                    diffAndSetAttribute(this.currentRefType, "alignment-baseline", "central");
                    this.currentRefGroup.appendChild(this.currentRefType);
                }
                viewBox.appendChild(this.currentRefGroup);
                let rangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(rangeGroup, "id", "RangeGroup");
                {
                    let centerX = -185;
                    let centerY = 50 - circleRadius;
                    if (this._fullscreen) {
                        diffAndSetAttribute(rangeGroup, "transform", "scale(0.8)");
                        centerX += 2;
                        centerY -= 141;
                    }
                    else {
                        centerY -= 40;
                    }
                    let textBg = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(textBg, "x", (centerX - 40) + '');
                    diffAndSetAttribute(textBg, "y", (centerY - 32) + '');
                    diffAndSetAttribute(textBg, "width", "80");
                    diffAndSetAttribute(textBg, "height", "64");
                    diffAndSetAttribute(textBg, "fill", "black");
                    diffAndSetAttribute(textBg, "stroke", "white");
                    diffAndSetAttribute(textBg, "stroke-width", "2");
                    rangeGroup.appendChild(textBg);
                    let textTitle = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(textTitle, "RANGE");
                    diffAndSetAttribute(textTitle, "x", centerX + '');
                    diffAndSetAttribute(textTitle, "y", (centerY - 15) + '');
                    diffAndSetAttribute(textTitle, "fill", "white");
                    diffAndSetAttribute(textTitle, "font-size", "25");
                    diffAndSetAttribute(textTitle, "font-family", "Roboto-Light");
                    diffAndSetAttribute(textTitle, "text-anchor", "middle");
                    diffAndSetAttribute(textTitle, "alignment-baseline", "central");
                    rangeGroup.appendChild(textTitle);
                    this.addMapRange(rangeGroup, centerX, (centerY + 15), "white", "25", false, 1.0, false);
                }
                viewBox.appendChild(rangeGroup);
            }
        }
    }
    constructArc_AS03D() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "-225 -215 550 516");
        this.appendChild(this.root);
        var trsGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(trsGroup, "transform", "scale(1.3) translate(-237, -180)");
        this.root.appendChild(trsGroup);
        {
            let viewBox = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(viewBox, "viewBox", "-250 -475 600 850");
            trsGroup.appendChild(viewBox);
            var circleRadius = 340;
            var dashSpacing = 72;
            this.arcMaskGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.arcMaskGroup, "id", "MaskGroup");
            viewBox.appendChild(this.arcMaskGroup);
            {
                let maskMargin = 10;
                let topMask = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(topMask, "d", "M" + (-maskMargin) + " " + -120 + ", H" + (circleRadius * 2 + maskMargin) + ", V" + circleRadius + ", H" + (circleRadius * 2) + ", A 25 25 0 1 0 0, " + circleRadius + ", H" + (-maskMargin) + " Z");
                diffAndSetAttribute(topMask, "transform", "translate(" + (50 - circleRadius) + ", " + (50 - circleRadius) + ")");
                diffAndSetAttribute(topMask, "fill", "black");
                this.arcMaskGroup.appendChild(topMask);
                let bottomMask = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(bottomMask, "d", "M" + (-maskMargin) + " " + (circleRadius * 2) + ", H" + (circleRadius * 2 + maskMargin) + ", V" + circleRadius + ", H" + (circleRadius * 2) + ", A 25 25 0 1 1 0, " + circleRadius + ", H" + (-maskMargin) + " Z");
                diffAndSetAttribute(bottomMask, "transform", "translate(" + (50 - circleRadius) + ", " + (50 - circleRadius) + ")");
                diffAndSetAttribute(bottomMask, "fill", "black");
                this.arcMaskGroup.appendChild(bottomMask);
            }
            this.arcRangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.arcRangeGroup, "id", "ArcRangeGroup");
            viewBox.appendChild(this.arcRangeGroup);
            {
                let rads = [0.25, 0.50, 0.75];
                for (let r = 0; r < rads.length; r++) {
                    let rad = circleRadius * rads[r];
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", "50");
                    diffAndSetAttribute(circle, "cy", "50");
                    diffAndSetAttribute(circle, "r", rad + '');
                    diffAndSetAttribute(circle, "fill", "none");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    this.arcRangeGroup.appendChild(circle);
                }
            }
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rotatingCircle, "id", "RotatingCircle");
            viewBox.appendChild(this.rotatingCircle);
            {
                let circleGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(circleGroup, "id", "circleGroup");
                {
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", "50");
                    diffAndSetAttribute(circle, "cy", "50");
                    diffAndSetAttribute(circle, "r", circleRadius + '');
                    diffAndSetAttribute(circle, "fill-opacity", "0");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    circleGroup.appendChild(circle);
                    let radians = 0;
                    for (let i = 0; i < dashSpacing; i++) {
                        let line = document.createElementNS(Avionics.SVG.NS, "line");
                        let bIsBig = (i % 2 == 0) ? true : false;
                        let length = (bIsBig) ? 24 : 12.75;
                        let lineStart = 50 + circleRadius;
                        let lineEnd = lineStart - length;
                        let degrees = (radians / Math.PI) * 180;
                        diffAndSetAttribute(line, "x1", "50");
                        diffAndSetAttribute(line, "y1", lineStart + '');
                        diffAndSetAttribute(line, "x2", "50");
                        diffAndSetAttribute(line, "y2", lineEnd + '');
                        diffAndSetAttribute(line, "transform", "rotate(" + (-degrees + 180) + " 50 50)");
                        diffAndSetAttribute(line, "stroke", "white");
                        diffAndSetAttribute(line, "stroke-width", "3");
                        if (bIsBig && (i % 3 == 0)) {
                            let text = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetText(text, fastToFixed(degrees / 10, 0));
                            diffAndSetAttribute(text, "x", "50");
                            diffAndSetAttribute(text, "y", (-(circleRadius - 50 - length - 18)) + '');
                            diffAndSetAttribute(text, "fill", "white");
                            diffAndSetAttribute(text, "font-size", "42");
                            diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                            diffAndSetAttribute(text, "text-anchor", "middle");
                            diffAndSetAttribute(text, "alignment-baseline", "central");
                            diffAndSetAttribute(text, "transform", "rotate(" + degrees + " 50 50)");
                            circleGroup.appendChild(text);
                        }
                        radians += (2 * Math.PI) / dashSpacing;
                        circleGroup.appendChild(line);
                    }
                }
                this.rotatingCircle.appendChild(circleGroup);
                this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.trackingGroup, "id", "trackingGroup");
                {
                    this.trackingLine = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.trackingLine, "id", "trackingLine");
                    diffAndSetAttribute(this.trackingLine, "d", "M50 70 v " + (circleRadius - 20));
                    diffAndSetAttribute(this.trackingLine, "fill", "transparent");
                    diffAndSetAttribute(this.trackingLine, "stroke", "white");
                    diffAndSetAttribute(this.trackingLine, "stroke-width", "3");
                    this.trackingGroup.appendChild(this.trackingLine);
                    this.trackingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.trackingBug, "id", "trackingBug");
                    diffAndSetAttribute(this.trackingBug, "d", "M50 " + (50 + circleRadius) + " l 11 15 l-11 15 l-11 -15 z");
                    diffAndSetAttribute(this.trackingBug, "fill", "none");
                    diffAndSetAttribute(this.trackingBug, "stroke", "green");
                    diffAndSetAttribute(this.trackingBug, "stroke-width", "5");
                    this.trackingGroup.appendChild(this.trackingBug);
                }
                this.rotatingCircle.appendChild(this.trackingGroup);
                this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.headingGroup, "id", "headingGroup");
                {
                    this.headingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.headingBug, "id", "headingBug");
                    diffAndSetAttribute(this.headingBug, "d", "M50 " + (50 + circleRadius) + " l -18 30 h36 z");
                    diffAndSetAttribute(this.headingBug, "fill", "black");
                    diffAndSetAttribute(this.headingBug, "stroke", "white");
                    diffAndSetAttribute(this.headingBug, "stroke-width", "2");
                    this.headingGroup.appendChild(this.headingBug);
                }
                this.rotatingCircle.appendChild(this.headingGroup);
                this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.courseGroup, "id", "CourseInfo");
                this.rotatingCircle.appendChild(this.courseGroup);
                {
                    let bearing = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(bearing, "id", "bearing");
                    this.courseGroup.appendChild(bearing);
                    {
                        this.bearing1_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.bearing1_Vor, "d", "M60 -385 L50 -395 L40 -385 M50 -395 L50 -322 M65 -331 L35 -331     M50 427 L50 492 M65 492 L50 482 L35 492");
                        diffAndSetAttribute(this.bearing1_Vor, "stroke", "green");
                        diffAndSetAttribute(this.bearing1_Vor, "stroke-width", "6");
                        diffAndSetAttribute(this.bearing1_Vor, "fill", "none");
                        diffAndSetAttribute(this.bearing1_Vor, "id", "bearing1_Vor");
                        diffAndSetAttribute(this.bearing1_Vor, "visibility", "hidden");
                        bearing.appendChild(this.bearing1_Vor);
                        this.bearing1_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.bearing1_Adf, "d", "M60 -385 L50 -395 L40 -385 M50 -395 L50 -322 M65 -331 L35 -331     M50 427 L50 492 M65 492 L50 482 L35 492");
                        diffAndSetAttribute(this.bearing1_Adf, "stroke", "cyan");
                        diffAndSetAttribute(this.bearing1_Adf, "stroke-width", "6");
                        diffAndSetAttribute(this.bearing1_Adf, "fill", "none");
                        diffAndSetAttribute(this.bearing1_Adf, "id", "bearing1_Adf");
                        diffAndSetAttribute(this.bearing1_Adf, "visibility", "hidden");
                        bearing.appendChild(this.bearing1_Adf);
                        this.bearing2_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.bearing2_Vor, "d", "M60 -385 L50 -395 L40 -385 L40 -331 L30 -331 L30 -322 L70 -322 L70 -331 L60 -331 L60 -385        M65 492 L50 482 L35 492 L35 502 L50 492 L65 502 L65 492 M57 487 L57 434 L50 427 L43 434 L43 487");
                        diffAndSetAttribute(this.bearing2_Vor, "stroke", "green");
                        diffAndSetAttribute(this.bearing2_Vor, "stroke-width", "6");
                        diffAndSetAttribute(this.bearing2_Vor, "fill", "none");
                        diffAndSetAttribute(this.bearing2_Vor, "id", "bearing2_Vor");
                        diffAndSetAttribute(this.bearing2_Vor, "visibility", "hidden");
                        bearing.appendChild(this.bearing2_Vor);
                        this.bearing2_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.bearing2_Adf, "d", "M60 -403 L50 -413 L40 -403 L40 -349 L30 -349 L30 -340 L70 -340 L70 -349 L60 -349 L60 -403        M65 510 L50 500 L35 510 L35 520 L50 510 L65 520 L65 510 M57 505 L57 452 L50 445 L43 452 L43 505");
                        diffAndSetAttribute(this.bearing2_Adf, "stroke", "cyan");
                        diffAndSetAttribute(this.bearing2_Adf, "stroke-width", "6");
                        diffAndSetAttribute(this.bearing2_Adf, "fill", "none");
                        diffAndSetAttribute(this.bearing2_Adf, "id", "bearing2_Adf");
                        diffAndSetAttribute(this.bearing2_Adf, "visibility", "hidden");
                        bearing.appendChild(this.bearing2_Adf);
                    }
                }
            }
            {
                this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.currentRefGroup, "id", "currentRefGroup");
                {
                    let centerX = 50;
                    let centerY = -445;
                    let rectWidth = 98;
                    let rectHeight = 60;
                    let textOffset = 5;
                    this.currentRefMode = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(this.currentRefMode, "HDG");
                    diffAndSetAttribute(this.currentRefMode, "x", (centerX - rectWidth * 0.5 - textOffset) + '');
                    diffAndSetAttribute(this.currentRefMode, "y", centerY + '');
                    diffAndSetAttribute(this.currentRefMode, "fill", "green");
                    diffAndSetAttribute(this.currentRefMode, "font-size", "35");
                    diffAndSetAttribute(this.currentRefMode, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(this.currentRefMode, "text-anchor", "end");
                    diffAndSetAttribute(this.currentRefMode, "alignment-baseline", "central");
                    this.currentRefGroup.appendChild(this.currentRefMode);
                    let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(rect, "x", (centerX - rectWidth * 0.5) + '');
                    diffAndSetAttribute(rect, "y", (centerY - rectHeight * 0.5) + '');
                    diffAndSetAttribute(rect, "width", rectWidth + '');
                    diffAndSetAttribute(rect, "height", rectHeight + '');
                    diffAndSetAttribute(rect, "fill", "black");
                    this.currentRefGroup.appendChild(rect);
                    let path = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(path, "d", "M" + (centerX - (rectWidth * 0.5)) + " " + (centerY - (rectHeight * 0.5)) + " l0 " + rectHeight + " l" + rectWidth + " 0 l0 " + (-rectHeight));
                    diffAndSetAttribute(path, "fill", "none");
                    diffAndSetAttribute(path, "stroke", "white");
                    diffAndSetAttribute(path, "stroke-width", "1");
                    this.currentRefGroup.appendChild(path);
                    this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(this.currentRefValue, "266");
                    diffAndSetAttribute(this.currentRefValue, "x", centerX + '');
                    diffAndSetAttribute(this.currentRefValue, "y", centerY + '');
                    diffAndSetAttribute(this.currentRefValue, "fill", "white");
                    diffAndSetAttribute(this.currentRefValue, "font-size", "42");
                    diffAndSetAttribute(this.currentRefValue, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(this.currentRefValue, "text-anchor", "middle");
                    diffAndSetAttribute(this.currentRefValue, "alignment-baseline", "central");
                    this.currentRefGroup.appendChild(this.currentRefValue);
                    this.currentRefType = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(this.currentRefType, "MAG");
                    diffAndSetAttribute(this.currentRefType, "x", (centerX + rectWidth * 0.5 + textOffset) + '');
                    diffAndSetAttribute(this.currentRefType, "y", centerY + '');
                    diffAndSetAttribute(this.currentRefType, "fill", "green");
                    diffAndSetAttribute(this.currentRefType, "font-size", "35");
                    diffAndSetAttribute(this.currentRefType, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(this.currentRefType, "text-anchor", "start");
                    diffAndSetAttribute(this.currentRefType, "alignment-baseline", "central");
                    this.currentRefGroup.appendChild(this.currentRefType);
                }
                viewBox.appendChild(this.currentRefGroup);
                let rangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(rangeGroup, "id", "RangeGroup");
                {
                    let centerX = 360;
                    let centerY = -365;
                    this.addMapRange(rangeGroup, centerX, centerY, "white", "35", false, 1.0, false);
                }
                viewBox.appendChild(rangeGroup);
            }
        }
    }
    constructPlan() {
        super.constructPlan();
        if (this.aircraft == Aircraft.B747_8)
            this.constructPlan_B747_8();
        else if (this.aircraft == Aircraft.AS01B)
            this.constructPlan_AS01B();
        else if (this.aircraft == Aircraft.CJ4)
            this.constructPlan_CJ4();
        else
            this.constructPlan_A320_Neo();
    }
    constructPlan_B747_8() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        {
            let circleRadius = 333;
            let outerCircleGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(outerCircleGroup);
            {
                let texts = ["N", "E", "S", "W"];
                for (let i = 0; i < 4; i++) {
                    let textGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(textGroup, "transform", "rotate(" + fastToFixed(i * 90, 0) + " 500 500)");
                    {
                        let text = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetText(text, texts[i]);
                        diffAndSetAttribute(text, "x", "500");
                        diffAndSetAttribute(text, "y", "115");
                        diffAndSetAttribute(text, "fill", "white");
                        diffAndSetAttribute(text, "font-size", "50");
                        diffAndSetAttribute(text, "font-family", "Roboto-Light");
                        diffAndSetAttribute(text, "text-anchor", "middle");
                        diffAndSetAttribute(text, "alignment-baseline", "central");
                        diffAndSetAttribute(text, "transform", "rotate(" + -fastToFixed(i * 90, 0) + " 500 115)");
                        textGroup.appendChild(text);
                        outerCircleGroup.appendChild(textGroup);
                    }
                }
                let outerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(outerCircle, "cx", "500");
                diffAndSetAttribute(outerCircle, "cy", "500");
                diffAndSetAttribute(outerCircle, "r", circleRadius + '');
                diffAndSetAttribute(outerCircle, "fill", "none");
                diffAndSetAttribute(outerCircle, "stroke", "white");
                diffAndSetAttribute(outerCircle, "stroke-width", "4");
                outerCircleGroup.appendChild(outerCircle);
                this.addMapRange(outerCircleGroup, 500, 167, "white", "30", true, 0.5, true);
                this.addMapRange(outerCircleGroup, 500, 833, "white", "30", true, 0.5, true);
            }
            let innerCircleGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(innerCircleGroup);
            {
                let innerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(innerCircle, "cx", "500");
                diffAndSetAttribute(innerCircle, "cy", "500");
                diffAndSetAttribute(innerCircle, "r", "166");
                diffAndSetAttribute(innerCircle, "fill", "none");
                diffAndSetAttribute(innerCircle, "stroke", "white");
                diffAndSetAttribute(innerCircle, "stroke-width", "4");
                innerCircleGroup.appendChild(innerCircle);
                this.addMapRange(innerCircleGroup, 500, 334, "white", "30", true, 0.25, true);
                this.addMapRange(innerCircleGroup, 500, 666, "white", "30", true, 0.25, true);
            }
            let rangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(rangeGroup, "id", "RangeGroup");
            diffAndSetAttribute(rangeGroup, "transform", "scale(1.25)");
            {
                let centerX = 245;
                let centerY = 48;
                let textBg = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(textBg, "x", (centerX - 40) + '');
                diffAndSetAttribute(textBg, "y", (centerY - 32) + '');
                diffAndSetAttribute(textBg, "width", "80");
                diffAndSetAttribute(textBg, "height", "64");
                diffAndSetAttribute(textBg, "fill", "black");
                diffAndSetAttribute(textBg, "stroke", "white");
                diffAndSetAttribute(textBg, "stroke-width", "1");
                rangeGroup.appendChild(textBg);
                let textTitle = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(textTitle, "RANGE");
                diffAndSetAttribute(textTitle, "x", centerX + '');
                diffAndSetAttribute(textTitle, "y", (centerY - 15) + '');
                diffAndSetAttribute(textTitle, "fill", "white");
                diffAndSetAttribute(textTitle, "font-size", "25");
                diffAndSetAttribute(textTitle, "font-family", "Roboto-Light");
                diffAndSetAttribute(textTitle, "text-anchor", "middle");
                diffAndSetAttribute(textTitle, "alignment-baseline", "central");
                rangeGroup.appendChild(textTitle);
                this.addMapRange(rangeGroup, centerX, (centerY + 15), "white", "25", false, 1.0, false);
            }
            this.root.appendChild(rangeGroup);
        }
    }
    constructPlan_AS01B() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        {
            let circleRadius = 333;
            let outerCircleGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(outerCircleGroup);
            {
                let texts = ["N", "E", "S", "W"];
                for (let i = 0; i < 4; i++) {
                    let textGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(textGroup, "transform", "rotate(" + fastToFixed(i * 90, 0) + " 500 500)");
                    {
                        let text = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetText(text, texts[i]);
                        diffAndSetAttribute(text, "x", "500");
                        diffAndSetAttribute(text, "y", "115");
                        diffAndSetAttribute(text, "fill", "white");
                        diffAndSetAttribute(text, "font-size", "50");
                        diffAndSetAttribute(text, "font-family", "Roboto-Light");
                        diffAndSetAttribute(text, "text-anchor", "middle");
                        diffAndSetAttribute(text, "alignment-baseline", "central");
                        diffAndSetAttribute(text, "transform", "rotate(" + -fastToFixed(i * 90, 0) + " 500 115)");
                        textGroup.appendChild(text);
                        outerCircleGroup.appendChild(textGroup);
                    }
                }
                let outerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(outerCircle, "cx", "500");
                diffAndSetAttribute(outerCircle, "cy", "500");
                diffAndSetAttribute(outerCircle, "r", circleRadius + '');
                diffAndSetAttribute(outerCircle, "fill", "none");
                diffAndSetAttribute(outerCircle, "stroke", "white");
                diffAndSetAttribute(outerCircle, "stroke-width", "4");
                outerCircleGroup.appendChild(outerCircle);
                this.addMapRange(outerCircleGroup, 500, 167, "white", "30", true, 1, true);
                this.addMapRange(outerCircleGroup, 500, 833, "white", "30", true, 1, true);
            }
            let innerCircleGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(innerCircleGroup);
            {
                let innerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(innerCircle, "cx", "500");
                diffAndSetAttribute(innerCircle, "cy", "500");
                diffAndSetAttribute(innerCircle, "r", "166");
                diffAndSetAttribute(innerCircle, "fill", "none");
                diffAndSetAttribute(innerCircle, "stroke", "white");
                diffAndSetAttribute(innerCircle, "stroke-width", "4");
                innerCircleGroup.appendChild(innerCircle);
                this.addMapRange(innerCircleGroup, 500, 334, "white", "30", true, 0.5, true);
                this.addMapRange(innerCircleGroup, 500, 666, "white", "30", true, 0.5, true);
            }
            let rangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(rangeGroup, "id", "RangeGroup");
            {
                let centerX = 145;
                let centerY = 67;
                if (this._fullscreen) {
                    diffAndSetAttribute(rangeGroup, "transform", "scale(1.27)");
                }
                else {
                    centerX = 266;
                    centerY = 98;
                }
                let textBg = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(textBg, "x", (centerX - 40) + '');
                diffAndSetAttribute(textBg, "y", (centerY - 32) + '');
                diffAndSetAttribute(textBg, "width", "80");
                diffAndSetAttribute(textBg, "height", "64");
                diffAndSetAttribute(textBg, "fill", "black");
                diffAndSetAttribute(textBg, "stroke", "white");
                diffAndSetAttribute(textBg, "stroke-width", "2");
                rangeGroup.appendChild(textBg);
                let textTitle = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(textTitle, "RANGE");
                diffAndSetAttribute(textTitle, "x", (centerX - 0.5) + '');
                diffAndSetAttribute(textTitle, "y", (centerY - 14) + '');
                diffAndSetAttribute(textTitle, "fill", "white");
                diffAndSetAttribute(textTitle, "font-size", "25");
                diffAndSetAttribute(textTitle, "font-family", "Roboto-Light");
                diffAndSetAttribute(textTitle, "text-anchor", "middle");
                diffAndSetAttribute(textTitle, "alignment-baseline", "central");
                rangeGroup.appendChild(textTitle);
                this.addMapRange(rangeGroup, (centerX - 0.5), (centerY + 15.5), "white", "25", false, 1.0, false);
            }
            this.root.appendChild(rangeGroup);
        }
    }
    constructPlan_A320_Neo() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        {
            let circleRadius = 333;
            let circleGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(circleGroup);
            {
                let texts = ["N", "E", "S", "W"];
                for (let i = 0; i < 4; i++) {
                    let triangle = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(triangle, "fill", "white");
                    diffAndSetAttribute(triangle, "d", "M500 176 L516 199 L484 199 Z");
                    diffAndSetAttribute(triangle, "transform", "rotate(" + fastToFixed(i * 90, 0) + " 500 500)");
                    circleGroup.appendChild(triangle);
                    let textGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(textGroup, "transform", "rotate(" + fastToFixed(i * 90, 0) + " 500 500)");
                    {
                        let text = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetText(text, texts[i]);
                        diffAndSetAttribute(text, "x", "500");
                        diffAndSetAttribute(text, "y", "230");
                        diffAndSetAttribute(text, "fill", "white");
                        diffAndSetAttribute(text, "font-size", "50");
                        diffAndSetAttribute(text, "font-family", "Roboto-Light");
                        diffAndSetAttribute(text, "text-anchor", "middle");
                        diffAndSetAttribute(text, "alignment-baseline", "central");
                        diffAndSetAttribute(text, "transform", "rotate(" + -fastToFixed(i * 90, 0) + " 500 230)");
                        textGroup.appendChild(text);
                        circleGroup.appendChild(textGroup);
                    }
                }
                {
                    let innerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(innerCircle, "cx", "500");
                    diffAndSetAttribute(innerCircle, "cy", "500");
                    diffAndSetAttribute(innerCircle, "r", (circleRadius * 0.5) + '');
                    diffAndSetAttribute(innerCircle, "fill", "none");
                    diffAndSetAttribute(innerCircle, "stroke", "white");
                    diffAndSetAttribute(innerCircle, "stroke-width", "4");
                    circleGroup.appendChild(innerCircle);
                    let outerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(outerCircle, "cx", "500");
                    diffAndSetAttribute(outerCircle, "cy", "500");
                    diffAndSetAttribute(outerCircle, "r", circleRadius + '');
                    diffAndSetAttribute(outerCircle, "fill", "none");
                    diffAndSetAttribute(outerCircle, "stroke", "white");
                    diffAndSetAttribute(outerCircle, "stroke-width", "4");
                    circleGroup.appendChild(outerCircle);
                    let vec = new Vec2(1, 1);
                    vec.SetNorm(333 - 45);
                    this.addMapRange(circleGroup, 500 - vec.x, 500 + vec.y, "#00F2FF", "32", false, 1.0, true);
                }
            }
        }
    }
    constructPlan_CJ4() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        {
            let circleRadius = 333;
            let circleGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(circleGroup);
            {
                let outerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(outerCircle, "cx", "500");
                diffAndSetAttribute(outerCircle, "cy", "500");
                diffAndSetAttribute(outerCircle, "r", circleRadius + '');
                diffAndSetAttribute(outerCircle, "fill", "none");
                diffAndSetAttribute(outerCircle, "stroke", "white");
                diffAndSetAttribute(outerCircle, "stroke-width", "4");
                circleGroup.appendChild(outerCircle);
                let vec = new Vec2(1, 0.45);
                vec.SetNorm(circleRadius * 0.87);
                this.addMapRange(circleGroup, 500 - vec.x, 500 - vec.y, "white", "28", false, 1.0, false);
            }
            this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.currentRefGroup, "id", "currentRefGroup");
            diffAndSetAttribute(this.currentRefGroup, "transform", "scale(1.5)");
            {
                let centerX = 332;
                let centerY = 75;
                let rectWidth = 65;
                let rectHeight = 40;
                let rectArrowFactor = 0.35;
                let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(rect, "x", (centerX - rectWidth * 0.5) + '');
                diffAndSetAttribute(rect, "y", (centerY - rectHeight * 0.5) + '');
                diffAndSetAttribute(rect, "width", rectWidth + '');
                diffAndSetAttribute(rect, "height", rectHeight + '');
                diffAndSetAttribute(rect, "fill", "#0e0d08");
                this.currentRefGroup.appendChild(rect);
                let d = "M" + (centerX - (rectWidth * 0.5)) + " " + (centerY - (rectHeight * 0.5));
                d += " l0 " + rectHeight;
                d += " l" + (rectWidth * rectArrowFactor) + " 0";
                d += " l" + (rectWidth * 0.5 - rectWidth * rectArrowFactor) + " 9";
                d += " l" + (rectWidth * 0.5 - rectWidth * rectArrowFactor) + " -9";
                d += " l" + (rectWidth * rectArrowFactor) + " 0";
                d += " l0 " + (-rectHeight);
                let path = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(path, "d", d);
                diffAndSetAttribute(path, "fill", "none");
                diffAndSetAttribute(path, "stroke", "white");
                diffAndSetAttribute(path, "stroke-width", "2");
                this.currentRefGroup.appendChild(path);
                this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.currentRefValue, "");
                diffAndSetAttribute(this.currentRefValue, "x", centerX + '');
                diffAndSetAttribute(this.currentRefValue, "y", centerY + '');
                diffAndSetAttribute(this.currentRefValue, "fill", "green");
                diffAndSetAttribute(this.currentRefValue, "font-size", "28");
                diffAndSetAttribute(this.currentRefValue, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.currentRefValue, "text-anchor", "middle");
                diffAndSetAttribute(this.currentRefValue, "alignment-baseline", "central");
                this.currentRefGroup.appendChild(this.currentRefValue);
            }
            this.root.appendChild(this.currentRefGroup);
            this.selectedRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.selectedRefGroup, "id", "selectedRefGroup");
            diffAndSetAttribute(this.selectedRefGroup, "transform", "scale(1.5)");
            {
                let centerX = 180;
                let centerY = 62;
                let spaceX = 5;
                this.selectedRefMode = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.selectedRefMode, "HDG");
                diffAndSetAttribute(this.selectedRefMode, "x", (centerX - spaceX) + '');
                diffAndSetAttribute(this.selectedRefMode, "y", centerY + '');
                diffAndSetAttribute(this.selectedRefMode, "fill", "#00F2FF");
                diffAndSetAttribute(this.selectedRefMode, "font-size", "18");
                diffAndSetAttribute(this.selectedRefMode, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.selectedRefMode, "text-anchor", "end");
                diffAndSetAttribute(this.selectedRefMode, "alignment-baseline", "central");
                this.selectedRefGroup.appendChild(this.selectedRefMode);
                this.selectedRefValue = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.selectedRefValue, "");
                diffAndSetAttribute(this.selectedRefValue, "x", (centerX + spaceX) + '');
                diffAndSetAttribute(this.selectedRefValue, "y", centerY + '');
                diffAndSetAttribute(this.selectedRefValue, "fill", "#00F2FF");
                diffAndSetAttribute(this.selectedRefValue, "font-size", "23");
                diffAndSetAttribute(this.selectedRefValue, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.selectedRefValue, "text-anchor", "start");
                diffAndSetAttribute(this.selectedRefValue, "alignment-baseline", "central");
                this.selectedRefGroup.appendChild(this.selectedRefValue);
            }
            this.root.appendChild(this.selectedRefGroup);
        }
    }
    constructRose() {
        super.constructRose();
        if (this.aircraft == Aircraft.CJ4)
            this.constructRose_CJ4();
        else if (this.aircraft == Aircraft.B747_8)
            this.constructRose_B747_8();
        else if (this.aircraft == Aircraft.AS01B)
            this.constructRose_AS01B();
        else
            this.constructRose_A320_Neo();
    }
    constructRose_A320_Neo() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        let circleRadius = 333;
        {
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rotatingCircle, "id", "RotatingCircle");
            this.root.appendChild(this.rotatingCircle);
            let outerGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(outerGroup, "id", "outerCircle");
            this.rotatingCircle.appendChild(outerGroup);
            {
                for (let i = 0; i < 72; i++) {
                    let line = document.createElementNS(Avionics.SVG.NS, "rect");
                    let length = i % 2 == 0 ? 26 : 13;
                    diffAndSetAttribute(line, "x", "498");
                    diffAndSetAttribute(line, "y", fastToFixed(833, 0));
                    diffAndSetAttribute(line, "width", "4");
                    diffAndSetAttribute(line, "height", length + '');
                    diffAndSetAttribute(line, "transform", "rotate(" + fastToFixed(i * 5, 0) + " 500 500)");
                    diffAndSetAttribute(line, "fill", "white");
                    outerGroup.appendChild(line);
                }
                for (let i = 0; i < 36; i += 3) {
                    let text = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(text, fastToFixed(i, 0));
                    diffAndSetAttribute(text, "x", "500");
                    diffAndSetAttribute(text, "y", "115");
                    diffAndSetAttribute(text, "fill", "white");
                    diffAndSetAttribute(text, "font-size", "40");
                    diffAndSetAttribute(text, "font-family", "Roboto-Light");
                    diffAndSetAttribute(text, "text-anchor", "middle");
                    diffAndSetAttribute(text, "alignment-baseline", "central");
                    diffAndSetAttribute(text, "transform", "rotate(" + fastToFixed(i * 10, 0) + " 500 500)");
                    outerGroup.appendChild(text);
                }
                let outerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(outerCircle, "cx", "500");
                diffAndSetAttribute(outerCircle, "cy", "500");
                diffAndSetAttribute(outerCircle, "r", circleRadius + '');
                diffAndSetAttribute(outerCircle, "fill", "none");
                diffAndSetAttribute(outerCircle, "stroke", "white");
                diffAndSetAttribute(outerCircle, "stroke-width", "4");
                outerGroup.appendChild(outerCircle);
                let vec = new Vec2(1, 1);
                vec.SetNorm(circleRadius - 45);
                this.addMapRange(this.root, 500 - vec.x, 500 + vec.y, "#00F2FF", "32", false, 1.0, true);
            }
            let innerGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(innerGroup, "id", "innerCircle");
            this.rotatingCircle.appendChild(innerGroup);
            {
                for (let i = 0; i < 8; i++) {
                    let line = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(line, "x", "497");
                    diffAndSetAttribute(line, "y", fastToFixed(583, 0));
                    diffAndSetAttribute(line, "width", "6");
                    diffAndSetAttribute(line, "height", "26");
                    diffAndSetAttribute(line, "transform", "rotate(" + fastToFixed(i * 45, 0) + " 500 500)");
                    diffAndSetAttribute(line, "fill", "white");
                    innerGroup.appendChild(line);
                }
                let innerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(innerCircle, "cx", "500");
                diffAndSetAttribute(innerCircle, "cy", "500");
                diffAndSetAttribute(innerCircle, "r", "166");
                diffAndSetAttribute(innerCircle, "fill", "none");
                diffAndSetAttribute(innerCircle, "stroke", "white");
                diffAndSetAttribute(innerCircle, "stroke-width", "4");
                innerGroup.appendChild(innerCircle);
            }
            this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.courseGroup, "id", "CourseInfo");
            this.rotatingCircle.appendChild(this.courseGroup);
            {
                let bearing = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(bearing, "id", "bearing");
                this.courseGroup.appendChild(bearing);
                {
                    this.bearingCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(this.bearingCircle, "cx", "500");
                    diffAndSetAttribute(this.bearingCircle, "cy", "500");
                    diffAndSetAttribute(this.bearingCircle, "r", "30");
                    diffAndSetAttribute(this.bearingCircle, "stroke", "white");
                    diffAndSetAttribute(this.bearingCircle, "stroke-width", "0.8");
                    diffAndSetAttribute(this.bearingCircle, "fill-opacity", "0");
                    diffAndSetAttribute(this.bearingCircle, "visibility", "hidden");
                    bearing.appendChild(this.bearingCircle);
                    this.bearing1_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing1_Vor, "d", "M500 832 L500 810 M500 780 L500 666     M500 334 L500 220 M500 190 L500 168     M520 220 L500 190 L480 220 Z       M520 810 L500 780 L480 810 Z");
                    diffAndSetAttribute(this.bearing1_Vor, "stroke", "white");
                    diffAndSetAttribute(this.bearing1_Vor, "stroke-width", "6");
                    diffAndSetAttribute(this.bearing1_Vor, "fill", "none");
                    diffAndSetAttribute(this.bearing1_Vor, "id", "bearing1_Vor");
                    diffAndSetAttribute(this.bearing1_Vor, "visibility", "hidden");
                    bearing.appendChild(this.bearing1_Vor);
                    this.bearing1_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing1_Adf, "d", "M500 666 L500 832 M500 334 L500 168    M520 220 L500 190 L480 220      M520 810 L500 780 L480 810");
                    diffAndSetAttribute(this.bearing1_Adf, "stroke", "lime");
                    diffAndSetAttribute(this.bearing1_Adf, "stroke-width", "6");
                    diffAndSetAttribute(this.bearing1_Adf, "fill", "none");
                    diffAndSetAttribute(this.bearing1_Adf, "id", "bearing1_Adf");
                    diffAndSetAttribute(this.bearing1_Adf, "visibility", "hidden");
                    bearing.appendChild(this.bearing1_Adf);
                    this.bearing2_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing2_Vor, "d", "M500 832 L500 740      M510 666 L510 740 L490 740 L490 666         M500 260 L500 168    M510 334 L510 290 L520 290 L500 260 L480 290 L490 290 L490 334");
                    diffAndSetAttribute(this.bearing2_Vor, "stroke", "white");
                    diffAndSetAttribute(this.bearing2_Vor, "stroke-width", "6");
                    diffAndSetAttribute(this.bearing2_Vor, "fill", "none");
                    diffAndSetAttribute(this.bearing2_Vor, "id", "bearing2_Vor");
                    diffAndSetAttribute(this.bearing2_Vor, "visibility", "hidden");
                    bearing.appendChild(this.bearing2_Vor);
                    this.bearing2_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing2_Adf, "d", "M500 832 L500 710      M520 666 L520 740 L500 710 L480 740 L480 666         M500 260 L500 168    M520 334 L520 290 L500 260 L480 290 L480 334");
                    diffAndSetAttribute(this.bearing2_Adf, "stroke", "lime");
                    diffAndSetAttribute(this.bearing2_Adf, "stroke-width", "6");
                    diffAndSetAttribute(this.bearing2_Adf, "fill", "none");
                    diffAndSetAttribute(this.bearing2_Adf, "id", "bearing2_Adf");
                    diffAndSetAttribute(this.bearing2_Adf, "visibility", "hidden");
                    bearing.appendChild(this.bearing2_Adf);
                }
                this.course = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.course, "id", "course");
                this.courseGroup.appendChild(this.course);
                {
                    this.courseColor = "";
                    if (this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                        this.courseColor = "#ff00ff";
                    }
                    else if (this.navigationMode == Jet_NDCompass_Navigation.VOR) {
                        this.courseColor = "#00ffff";
                    }
                    this.courseTO = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.courseTO, "d", "M497 666 L503 666 L503 696 L523 696 L523 702 L503 702 L503 826 L497 826 L497 702 L477 702 L477 696 L497 696 L497 666 Z");
                    diffAndSetAttribute(this.courseTO, "fill", "none");
                    diffAndSetAttribute(this.courseTO, "transform", "rotate(180 500 500)");
                    diffAndSetAttribute(this.courseTO, "stroke", this.courseColor + '');
                    diffAndSetAttribute(this.courseTO, "stroke-width", "1");
                    this.course.appendChild(this.courseTO);
                    if (this.navigationMode === Jet_NDCompass_Navigation.ILS) {
                        this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(this.courseDeviation, "x", "495");
                        diffAndSetAttribute(this.courseDeviation, "y", "333");
                        diffAndSetAttribute(this.courseDeviation, "width", "10");
                        diffAndSetAttribute(this.courseDeviation, "height", "333");
                        diffAndSetAttribute(this.courseDeviation, "fill", this.courseColor + '');
                        this.course.appendChild(this.courseDeviation);
                    }
                    else if (this.navigationMode === Jet_NDCompass_Navigation.VOR) {
                        this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(this.courseDeviation, "d", "M500 666 L500 333 L470 363 L500 333 L530 363 L500 333 Z");
                        diffAndSetAttribute(this.courseDeviation, "stroke", this.courseColor + '');
                        diffAndSetAttribute(this.courseDeviation, "stroke-width", "5");
                        this.course.appendChild(this.courseDeviation);
                    }
                    this.courseFROM = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(this.courseFROM, "x", "497");
                    diffAndSetAttribute(this.courseFROM, "y", "166");
                    diffAndSetAttribute(this.courseFROM, "width", "6");
                    diffAndSetAttribute(this.courseFROM, "height", "166");
                    diffAndSetAttribute(this.courseFROM, "fill", "none");
                    diffAndSetAttribute(this.courseFROM, "transform", "rotate(180 500 500)");
                    diffAndSetAttribute(this.courseFROM, "stroke", this.courseColor + '');
                    diffAndSetAttribute(this.courseFROM, "stroke-width", "1");
                    this.course.appendChild(this.courseFROM);
                    let circlePosition = [-166, -55, 55, 166];
                    for (let i = 0; i < circlePosition.length; i++) {
                        let CDICircle = document.createElementNS(Avionics.SVG.NS, "circle");
                        diffAndSetAttribute(CDICircle, "cx", (500 + circlePosition[i]) + '');
                        diffAndSetAttribute(CDICircle, "cy", "500");
                        diffAndSetAttribute(CDICircle, "r", "10");
                        diffAndSetAttribute(CDICircle, "stroke", "white");
                        diffAndSetAttribute(CDICircle, "stroke-width", "2");
                        this.course.appendChild(CDICircle);
                    }
                }
            }
            this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.trackingGroup, "id", "trackingGroup");
            {
                var halfw = 13;
                var halfh = 20;
                var p1 = (500) + ", " + (500 - circleRadius);
                var p2 = (500 + halfw) + ", " + (500 - circleRadius + halfh);
                var p3 = (500) + ", " + (500 - circleRadius + halfh * 2);
                var p4 = (500 - halfw) + ", " + (500 - circleRadius + halfh);
                this.trackingBug = document.createElementNS(Avionics.SVG.NS, "polygon");
                diffAndSetAttribute(this.trackingBug, "id", "trackingBug");
                diffAndSetAttribute(this.trackingBug, "points", p1 + " " + p2 + " " + p3 + " " + p4);
                diffAndSetAttribute(this.trackingBug, "stroke", "#00FF21");
                diffAndSetAttribute(this.trackingBug, "stroke-width", "2");
                this.trackingGroup.appendChild(this.trackingBug);
            }
            this.rotatingCircle.appendChild(this.trackingGroup);
            this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.headingGroup, "id", "headingGroup");
            {
            }
            this.rotatingCircle.appendChild(this.headingGroup);
            this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.selectedHeadingGroup, "id", "selectedHeadingGroup");
            {
                this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.selectedHeadingBug, "id", "selectedHeadingBug");
                diffAndSetAttribute(this.selectedHeadingBug, "d", "M500 " + (500 - circleRadius) + " l -11 -25 l 22 0 z");
                diffAndSetAttribute(this.selectedHeadingBug, "stroke", "#00F2FF");
                diffAndSetAttribute(this.selectedHeadingBug, "stroke-width", "2");
                diffAndSetAttribute(this.selectedHeadingBug, "fill", "none");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
            }
            this.rotatingCircle.appendChild(this.selectedHeadingGroup);
            if (this.navigationMode == Jet_NDCompass_Navigation.NAV || this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.ilsGroup, "id", "ILSGroup");
                {
                    let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(ilsBug, "id", "ilsBug");
                    diffAndSetAttribute(ilsBug, "d", "M500 " + (500 - circleRadius) + " l0 -40 M485 " + (500 - circleRadius - 10) + " l30 0");
                    diffAndSetAttribute(ilsBug, "fill", "transparent");
                    diffAndSetAttribute(ilsBug, "stroke", "#FF0CE2");
                    diffAndSetAttribute(ilsBug, "stroke-width", "3");
                    this.ilsGroup.appendChild(ilsBug);
                }
                this.rotatingCircle.appendChild(this.ilsGroup);
            }
            if (this.navigationMode == Jet_NDCompass_Navigation.NAV) {
                this.selectedTrackGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.selectedTrackGroup, "id", "selectedTrackGroup");
                {
                    this.selectedTrackLine = Avionics.SVG.computeDashLine(500, 500, -circleRadius, 15, 3, "#00F2FF");
                    diffAndSetAttribute(this.selectedTrackLine, "id", "selectedTrackLine");
                    this.selectedTrackGroup.appendChild(this.selectedTrackLine);
                    this.selectedTrackBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.selectedTrackBug, "id", "selectedTrackBug");
                    diffAndSetAttribute(this.selectedTrackBug, "d", "M500 " + (500 - circleRadius) + " h -30 v -15 l 30 -15 l 30 15 v 15 z");
                    diffAndSetAttribute(this.selectedTrackBug, "stroke", "#00F2FF");
                    diffAndSetAttribute(this.selectedTrackBug, "stroke-width", "2");
                    this.selectedTrackGroup.appendChild(this.selectedTrackBug);
                }
                this.rotatingCircle.appendChild(this.selectedTrackGroup);
            }
        }
        this.glideSlopeGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.glideSlopeGroup, "id", "GlideSlopeGroup");
        this.root.appendChild(this.glideSlopeGroup);
        if (this.navigationMode === Jet_NDCompass_Navigation.ILS) {
            for (let i = 0; i < 5; i++) {
                if (i != 2) {
                    let glideSlopeDot = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(glideSlopeDot, "cx", "950");
                    diffAndSetAttribute(glideSlopeDot, "cy", fastToFixed((250 + i * 125), 0));
                    diffAndSetAttribute(glideSlopeDot, "r", "10");
                    diffAndSetAttribute(glideSlopeDot, "stroke", "white");
                    diffAndSetAttribute(glideSlopeDot, "stroke-width", "2");
                    this.glideSlopeGroup.appendChild(glideSlopeDot);
                }
            }
            let glideSlopeDash = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(glideSlopeDash, "x", "935");
            diffAndSetAttribute(glideSlopeDash, "y", "498");
            diffAndSetAttribute(glideSlopeDash, "width", "30");
            diffAndSetAttribute(glideSlopeDash, "height", "4");
            diffAndSetAttribute(glideSlopeDash, "fill", "yellow");
            this.glideSlopeGroup.appendChild(glideSlopeDash);
            this.glideSlopeCursor = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(this.glideSlopeCursor, "id", "GlideSlopeCursor");
            diffAndSetAttribute(this.glideSlopeCursor, "transform", "translate(" + 950 + " " + 500 + ")");
            diffAndSetAttribute(this.glideSlopeCursor, "d", "M-15 0 L0 -20 L15 0 M-15 0 L0 20 L15 0");
            diffAndSetAttribute(this.glideSlopeCursor, "stroke", "#ff00ff");
            diffAndSetAttribute(this.glideSlopeCursor, "stroke-width", "2");
            diffAndSetAttribute(this.glideSlopeCursor, "fill", "none");
            this.glideSlopeGroup.appendChild(this.glideSlopeCursor);
        }
        {
            let lineStart = 500 - circleRadius - 22;
            let lineEnd = 500 - circleRadius + 22;
            let neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(neutralLine, "id", "NeutralLine");
            diffAndSetAttribute(neutralLine, "x1", "500");
            diffAndSetAttribute(neutralLine, "y1", lineStart + '');
            diffAndSetAttribute(neutralLine, "x2", "500");
            diffAndSetAttribute(neutralLine, "y2", lineEnd + '');
            diffAndSetAttribute(neutralLine, "stroke", "yellow");
            diffAndSetAttribute(neutralLine, "stroke-width", "6");
            this.root.appendChild(neutralLine);
        }
    }
    constructRose_B747_8() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        let circleRadius = 360;
        {
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rotatingCircle, "id", "RotatingCircle");
            this.root.appendChild(this.rotatingCircle);
            let outerGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(outerGroup, "id", "outerCircle");
            this.rotatingCircle.appendChild(outerGroup);
            {
                for (let i = 0; i < 72; i++) {
                    let line = document.createElementNS(Avionics.SVG.NS, "rect");
                    let startY = 500 - circleRadius;
                    let length = 30;
                    if (i % 2 != 0) {
                        if (this.navigationMode == Jet_NDCompass_Navigation.NONE || this.navigationMode == Jet_NDCompass_Navigation.NAV)
                            continue;
                        length = 13;
                    }
                    if (i % 9 == 0) {
                        if (this.navigationMode != Jet_NDCompass_Navigation.NONE && this.navigationMode != Jet_NDCompass_Navigation.NAV) {
                            startY -= 30;
                            length += 30;
                        }
                    }
                    diffAndSetAttribute(line, "x", "498");
                    diffAndSetAttribute(line, "y", startY + '');
                    diffAndSetAttribute(line, "width", "4");
                    diffAndSetAttribute(line, "height", length + '');
                    diffAndSetAttribute(line, "transform", "rotate(" + fastToFixed(i * 5, 0) + " 500 500)");
                    diffAndSetAttribute(line, "fill", "white");
                    outerGroup.appendChild(line);
                }
                for (let i = 0; i < 36; i += 3) {
                    let text = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(text, fastToFixed(i, 0));
                    diffAndSetAttribute(text, "x", "500");
                    diffAndSetAttribute(text, "y", (500 - circleRadius + 52) + '');
                    diffAndSetAttribute(text, "fill", "white");
                    diffAndSetAttribute(text, "font-size", "40");
                    diffAndSetAttribute(text, "font-family", "Roboto-Light");
                    diffAndSetAttribute(text, "text-anchor", "middle");
                    diffAndSetAttribute(text, "alignment-baseline", "central");
                    diffAndSetAttribute(text, "transform", "rotate(" + fastToFixed(i * 10, 0) + " 500 500)");
                    outerGroup.appendChild(text);
                }
            }
            this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.courseGroup, "id", "CourseInfo");
            this.rotatingCircle.appendChild(this.courseGroup);
            {
                let bearing = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(bearing, "id", "bearing");
                this.courseGroup.appendChild(bearing);
                {
                    this.bearing1_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing1_Vor, "d", "M510 140 L500 130 L490 140 M500 130 L500 230 M520 220 L480 220     M500 770 L500 870   M520 870 L500 860 L480 870");
                    diffAndSetAttribute(this.bearing1_Vor, "stroke", "green");
                    diffAndSetAttribute(this.bearing1_Vor, "stroke-width", "4");
                    diffAndSetAttribute(this.bearing1_Vor, "fill", "none");
                    diffAndSetAttribute(this.bearing1_Vor, "id", "bearing1_Vor");
                    diffAndSetAttribute(this.bearing1_Vor, "visibility", "hidden");
                    bearing.appendChild(this.bearing1_Vor);
                    this.bearing1_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing1_Adf, "d", "M510 140 L500 130 L490 140 M500 130 L500 230 M520 220 L480 220     M500 770 L500 870   M520 870 L500 860 L480 870");
                    diffAndSetAttribute(this.bearing1_Adf, "stroke", "cyan");
                    diffAndSetAttribute(this.bearing1_Adf, "stroke-width", "4");
                    diffAndSetAttribute(this.bearing1_Adf, "fill", "none");
                    diffAndSetAttribute(this.bearing1_Adf, "id", "bearing1_Adf");
                    diffAndSetAttribute(this.bearing1_Adf, "visibility", "hidden");
                    bearing.appendChild(this.bearing1_Adf);
                    this.bearing2_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing2_Vor, "d", "M510 140 L500 130 L490 140 L490 220 L470 220 L470 230 L530 230 L530 220 L510 220 L510 140      M500 860 L500 870    M510 865 L510 780 L500 770 L490 780 L490 865     M520 870 L500 860 L480 870 L480 880 L500 870 L520 880 L520 870");
                    diffAndSetAttribute(this.bearing2_Vor, "stroke", "green");
                    diffAndSetAttribute(this.bearing2_Vor, "stroke-width", "4");
                    diffAndSetAttribute(this.bearing2_Vor, "fill", "none");
                    diffAndSetAttribute(this.bearing2_Vor, "id", "bearing2_Vor");
                    diffAndSetAttribute(this.bearing2_Vor, "visibility", "hidden");
                    bearing.appendChild(this.bearing2_Vor);
                    this.bearing2_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing2_Adf, "d", "M510 140 L500 130 L490 140 L490 220 L470 220 L470 230 L530 230 L530 220 L510 220 L510 140      M500 860 L500 870    M510 865 L510 780 L500 770 L490 780 L490 865     M520 870 L500 860 L480 870 L480 880 L500 870 L520 880 L520 870");
                    diffAndSetAttribute(this.bearing2_Adf, "stroke", "cyan");
                    diffAndSetAttribute(this.bearing2_Adf, "stroke-width", "4");
                    diffAndSetAttribute(this.bearing2_Adf, "fill", "none");
                    diffAndSetAttribute(this.bearing2_Adf, "id", "bearing2_Adf");
                    diffAndSetAttribute(this.bearing2_Adf, "visibility", "hidden");
                    bearing.appendChild(this.bearing2_Adf);
                }
                this.course = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.course, "id", "course");
                this.courseGroup.appendChild(this.course);
                {
                    this.courseColor = "";
                    if (this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                        this.courseColor = "#ff00ff";
                    }
                    else if (this.navigationMode == Jet_NDCompass_Navigation.VOR) {
                        this.courseColor = "#00ffff";
                    }
                    this.courseTO = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.courseTO, "d", "M497 666 L503 666 L503 696 L523 696 L523 702 L503 702 L503 826 L497 826 L497 702 L477 702 L477 696 L497 696 L497 666 Z");
                    diffAndSetAttribute(this.courseTO, "fill", "none");
                    diffAndSetAttribute(this.courseTO, "transform", "rotate(180 500 500)");
                    diffAndSetAttribute(this.courseTO, "stroke", this.courseColor + '');
                    diffAndSetAttribute(this.courseTO, "stroke-width", "1");
                    this.course.appendChild(this.courseTO);
                    this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(this.courseDeviation, "x", "495");
                    diffAndSetAttribute(this.courseDeviation, "y", "333");
                    diffAndSetAttribute(this.courseDeviation, "width", "10");
                    diffAndSetAttribute(this.courseDeviation, "height", "333");
                    diffAndSetAttribute(this.courseDeviation, "fill", this.courseColor + '');
                    this.course.appendChild(this.courseDeviation);
                    this.courseFROM = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(this.courseFROM, "x", "497");
                    diffAndSetAttribute(this.courseFROM, "y", "166");
                    diffAndSetAttribute(this.courseFROM, "width", "6");
                    diffAndSetAttribute(this.courseFROM, "height", "166");
                    diffAndSetAttribute(this.courseFROM, "fill", "none");
                    diffAndSetAttribute(this.courseFROM, "transform", "rotate(180 500 500)");
                    diffAndSetAttribute(this.courseFROM, "stroke", this.courseColor + '');
                    diffAndSetAttribute(this.courseFROM, "stroke-width", "1");
                    this.course.appendChild(this.courseFROM);
                    let circlePosition = [-166, -55, 55, 166];
                    for (let i = 0; i < circlePosition.length; i++) {
                        let CDICircle = document.createElementNS(Avionics.SVG.NS, "circle");
                        diffAndSetAttribute(CDICircle, "cx", (500 + circlePosition[i]) + '');
                        diffAndSetAttribute(CDICircle, "cy", "500");
                        diffAndSetAttribute(CDICircle, "r", "10");
                        diffAndSetAttribute(CDICircle, "stroke", "white");
                        diffAndSetAttribute(CDICircle, "stroke-width", "2");
                        this.course.appendChild(CDICircle);
                    }
                }
            }
            this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.headingGroup, "id", "headingGroup");
            {
                this.headingBug = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.headingBug, "id", "headingBug");
                diffAndSetAttribute(this.headingBug, "d", "M500 " + (500 - circleRadius) + " l -11 -20 l 22 0 z");
                diffAndSetAttribute(this.headingBug, "fill", "none");
                diffAndSetAttribute(this.headingBug, "stroke", "white");
                this.headingGroup.appendChild(this.headingBug);
            }
            this.rotatingCircle.appendChild(this.headingGroup);
            this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.selectedHeadingGroup, "id", "selectedHeadingGroup");
            {
                this.selectedHeadingLine = Avionics.SVG.computeDashLine(500, 450, -(circleRadius - 50), 15, 3, "#ff00e0");
                diffAndSetAttribute(this.selectedHeadingLine, "id", "selectedHeadingLine");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingLine);
                this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.selectedHeadingBug, "id", "selectedHeadingBug");
                diffAndSetAttribute(this.selectedHeadingBug, "d", "M500 " + (500 - circleRadius) + " h 22 v -22 h -7 l -15 22 l -15 -22 h -7 v 22 z");
                diffAndSetAttribute(this.selectedHeadingBug, "stroke", "#ff00e0");
                diffAndSetAttribute(this.selectedHeadingBug, "fill", "none");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
            }
            this.rotatingCircle.appendChild(this.selectedHeadingGroup);
            if (this.navigationMode == Jet_NDCompass_Navigation.NAV || this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.ilsGroup, "id", "ILSGroup");
                {
                    let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(ilsBug, "id", "ilsBug");
                    diffAndSetAttribute(ilsBug, "d", "M500 " + (500 - circleRadius) + " l0 -40 M485 " + (500 - circleRadius - 10) + " l30 0");
                    diffAndSetAttribute(ilsBug, "fill", "transparent");
                    diffAndSetAttribute(ilsBug, "stroke", "#FF0CE2");
                    diffAndSetAttribute(ilsBug, "stroke-width", "3");
                    this.ilsGroup.appendChild(ilsBug);
                }
                this.rotatingCircle.appendChild(this.ilsGroup);
            }
            if (this.navigationMode == Jet_NDCompass_Navigation.NAV) {
                this.selectedTrackGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.selectedTrackGroup, "id", "selectedTrackGroup");
                {
                    this.selectedTrackLine = Avionics.SVG.computeDashLine(500, 450, -(circleRadius - 50), 15, 3, "#ff00e0");
                    diffAndSetAttribute(this.selectedTrackLine, "id", "selectedTrackLine");
                    this.selectedTrackGroup.appendChild(this.selectedTrackLine);
                    this.selectedTrackBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.selectedTrackBug, "id", "selectedTrackBug");
                    diffAndSetAttribute(this.selectedTrackBug, "d", "M500 " + (500 - circleRadius) + " h -30 v 15 l 30 15 l 30 -15 v -15 z");
                    diffAndSetAttribute(this.selectedTrackBug, "stroke", "#ff00e0");
                    diffAndSetAttribute(this.selectedTrackBug, "stroke-width", "2");
                    this.selectedTrackGroup.appendChild(this.selectedTrackBug);
                }
                this.rotatingCircle.appendChild(this.selectedTrackGroup);
            }
            this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.trackingGroup, "id", "trackingGroup");
            {
                this.trackingLine = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.trackingLine, "id", "trackingLine");
                diffAndSetAttribute(this.trackingLine, "d", "M500 400 v " + (-circleRadius + 100) + "M500 600 v " + (circleRadius - 100));
                diffAndSetAttribute(this.trackingLine, "fill", "transparent");
                diffAndSetAttribute(this.trackingLine, "stroke", "white");
                diffAndSetAttribute(this.trackingLine, "stroke-width", "3");
                this.trackingGroup.appendChild(this.trackingLine);
            }
            this.rotatingCircle.appendChild(this.trackingGroup);
        }
        this.glideSlopeGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.glideSlopeGroup, "id", "GlideSlopeGroup");
        diffAndSetAttribute(this.glideSlopeGroup, "transform", "translate(-20, 0)");
        this.root.appendChild(this.glideSlopeGroup);
        if (this.navigationMode === Jet_NDCompass_Navigation.ILS) {
            for (let i = 0; i < 5; i++) {
                if (i != 2) {
                    let glideSlopeDot = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(glideSlopeDot, "cx", "950");
                    diffAndSetAttribute(glideSlopeDot, "cy", fastToFixed((250 + i * 125), 0));
                    diffAndSetAttribute(glideSlopeDot, "r", "10");
                    diffAndSetAttribute(glideSlopeDot, "stroke", "white");
                    diffAndSetAttribute(glideSlopeDot, "stroke-width", "2");
                    this.glideSlopeGroup.appendChild(glideSlopeDot);
                }
            }
            let glideSlopeDash = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(glideSlopeDash, "x", "935");
            diffAndSetAttribute(glideSlopeDash, "y", "498");
            diffAndSetAttribute(glideSlopeDash, "width", "30");
            diffAndSetAttribute(glideSlopeDash, "height", "4");
            diffAndSetAttribute(glideSlopeDash, "fill", "yellow");
            this.glideSlopeGroup.appendChild(glideSlopeDash);
            this.glideSlopeCursor = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(this.glideSlopeCursor, "id", "GlideSlopeCursor");
            diffAndSetAttribute(this.glideSlopeCursor, "transform", "translate(" + 950 + " " + 500 + ")");
            diffAndSetAttribute(this.glideSlopeCursor, "d", "M-15 0 L0 -20 L15 0 M-15 0 L0 20 L15 0");
            diffAndSetAttribute(this.glideSlopeCursor, "stroke", "#ff00ff");
            diffAndSetAttribute(this.glideSlopeCursor, "stroke-width", "2");
            diffAndSetAttribute(this.glideSlopeCursor, "fill", "none");
            this.glideSlopeGroup.appendChild(this.glideSlopeCursor);
        }
        this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.currentRefGroup, "id", "currentRefGroup");
        {
            let centerX = 500;
            let centerY = (500 - circleRadius - 50);
            let rectWidth = 100;
            let rectHeight = 55;
            let textOffset = 10;
            this.currentRefMode = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.currentRefMode, "HDG");
            diffAndSetAttribute(this.currentRefMode, "x", (centerX - rectWidth * 0.5 - textOffset) + '');
            diffAndSetAttribute(this.currentRefMode, "y", centerY + '');
            diffAndSetAttribute(this.currentRefMode, "fill", "green");
            diffAndSetAttribute(this.currentRefMode, "font-size", "35");
            diffAndSetAttribute(this.currentRefMode, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.currentRefMode, "text-anchor", "end");
            diffAndSetAttribute(this.currentRefMode, "alignment-baseline", "central");
            this.currentRefGroup.appendChild(this.currentRefMode);
            let rect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(rect, "x", (centerX - rectWidth * 0.5) + '');
            diffAndSetAttribute(rect, "y", (centerY - rectHeight * 0.5) + '');
            diffAndSetAttribute(rect, "width", rectWidth + '');
            diffAndSetAttribute(rect, "height", rectHeight + '');
            diffAndSetAttribute(rect, "fill", "black");
            this.currentRefGroup.appendChild(rect);
            let path = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(path, "d", "M" + (centerX - (rectWidth * 0.5)) + " " + (centerY - (rectHeight * 0.5)) + " l0 " + rectHeight + " l" + rectWidth + " 0 l0 " + (-rectHeight));
            diffAndSetAttribute(path, "fill", "none");
            diffAndSetAttribute(path, "stroke", "white");
            diffAndSetAttribute(path, "stroke-width", "1");
            this.currentRefGroup.appendChild(path);
            this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.currentRefValue, "266");
            diffAndSetAttribute(this.currentRefValue, "x", centerX + '');
            diffAndSetAttribute(this.currentRefValue, "y", centerY + '');
            diffAndSetAttribute(this.currentRefValue, "fill", "white");
            diffAndSetAttribute(this.currentRefValue, "font-size", "35");
            diffAndSetAttribute(this.currentRefValue, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.currentRefValue, "text-anchor", "middle");
            diffAndSetAttribute(this.currentRefValue, "alignment-baseline", "central");
            this.currentRefGroup.appendChild(this.currentRefValue);
            this.currentRefType = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.currentRefType, "MAG");
            diffAndSetAttribute(this.currentRefType, "x", (centerX + rectWidth * 0.5 + textOffset) + '');
            diffAndSetAttribute(this.currentRefType, "y", centerY + '');
            diffAndSetAttribute(this.currentRefType, "fill", "green");
            diffAndSetAttribute(this.currentRefType, "font-size", "35");
            diffAndSetAttribute(this.currentRefType, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.currentRefType, "text-anchor", "start");
            diffAndSetAttribute(this.currentRefType, "alignment-baseline", "central");
            this.currentRefGroup.appendChild(this.currentRefType);
        }
        this.root.appendChild(this.currentRefGroup);
        let rangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(rangeGroup, "id", "RangeGroup");
        diffAndSetAttribute(rangeGroup, "transform", "scale(1.25)");
        {
            let centerX = 245;
            let centerY = 35;
            let textBg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(textBg, "x", (centerX - 40) + '');
            diffAndSetAttribute(textBg, "y", (centerY - 32) + '');
            diffAndSetAttribute(textBg, "width", "80");
            diffAndSetAttribute(textBg, "height", "64");
            diffAndSetAttribute(textBg, "fill", "black");
            diffAndSetAttribute(textBg, "stroke", "white");
            diffAndSetAttribute(textBg, "stroke-width", "1");
            rangeGroup.appendChild(textBg);
            let textTitle = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(textTitle, "RANGE");
            diffAndSetAttribute(textTitle, "x", centerX + '');
            diffAndSetAttribute(textTitle, "y", (centerY - 15) + '');
            diffAndSetAttribute(textTitle, "fill", "white");
            diffAndSetAttribute(textTitle, "font-size", "25");
            diffAndSetAttribute(textTitle, "font-family", "Roboto-Light");
            diffAndSetAttribute(textTitle, "text-anchor", "middle");
            diffAndSetAttribute(textTitle, "alignment-baseline", "central");
            rangeGroup.appendChild(textTitle);
            this.addMapRange(rangeGroup, centerX, (centerY + 15), "white", "25", false, 1.0, false);
        }
        this.root.appendChild(rangeGroup);
    }
    constructRose_AS01B() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        let circleRadius = 400;
        {
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rotatingCircle, "id", "RotatingCircle");
            this.root.appendChild(this.rotatingCircle);
            let outerGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(outerGroup, "id", "outerCircle");
            this.rotatingCircle.appendChild(outerGroup);
            {
                for (let i = 0; i < 72; i++) {
                    let line = document.createElementNS(Avionics.SVG.NS, "rect");
                    let startY = 500 - circleRadius;
                    let length = 30;
                    if (i % 2 != 0) {
                        if (this.navigationMode == Jet_NDCompass_Navigation.NONE || this.navigationMode == Jet_NDCompass_Navigation.NAV)
                            continue;
                        length = 13;
                    }
                    if (i % 9 == 0) {
                        if (this.navigationMode != Jet_NDCompass_Navigation.NONE && this.navigationMode != Jet_NDCompass_Navigation.NAV) {
                            startY -= 30;
                            length += 30;
                        }
                    }
                    diffAndSetAttribute(line, "x", "498");
                    diffAndSetAttribute(line, "y", startY + '');
                    diffAndSetAttribute(line, "width", "4");
                    diffAndSetAttribute(line, "height", length + '');
                    diffAndSetAttribute(line, "transform", "rotate(" + fastToFixed(i * 5, 0) + " 500 500)");
                    diffAndSetAttribute(line, "fill", "white");
                    outerGroup.appendChild(line);
                }
                for (let i = 0; i < 36; i += 3) {
                    let text = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(text, fastToFixed(i, 0));
                    diffAndSetAttribute(text, "x", "500");
                    diffAndSetAttribute(text, "y", (500 - circleRadius + 52) + '');
                    diffAndSetAttribute(text, "fill", "white");
                    diffAndSetAttribute(text, "font-size", "40");
                    diffAndSetAttribute(text, "font-family", "Roboto-Light");
                    diffAndSetAttribute(text, "text-anchor", "middle");
                    diffAndSetAttribute(text, "alignment-baseline", "central");
                    diffAndSetAttribute(text, "transform", "rotate(" + fastToFixed(i * 10, 0) + " 500 500)");
                    outerGroup.appendChild(text);
                }
            }
            this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.courseGroup, "id", "CourseInfo");
            this.rotatingCircle.appendChild(this.courseGroup);
            {
                let bearingScale = 1.11;
                let bearingScaleCorrection = -(500 * bearingScale - 500);
                let bearing = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(bearing, "id", "bearing");
                diffAndSetAttribute(bearing, "transform", "translate(" + bearingScaleCorrection + " " + bearingScaleCorrection + ") scale(" + bearingScale + ")");
                this.courseGroup.appendChild(bearing);
                {
                    this.bearing1_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing1_Vor, "d", "M510 140 L500 130 L490 140 M500 130 L500 230 M520 220 L480 220     M500 770 L500 870   M520 870 L500 860 L480 870");
                    diffAndSetAttribute(this.bearing1_Vor, "stroke", "green");
                    diffAndSetAttribute(this.bearing1_Vor, "stroke-width", "4");
                    diffAndSetAttribute(this.bearing1_Vor, "fill", "none");
                    diffAndSetAttribute(this.bearing1_Vor, "id", "bearing1_Vor");
                    diffAndSetAttribute(this.bearing1_Vor, "visibility", "hidden");
                    bearing.appendChild(this.bearing1_Vor);
                    this.bearing1_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing1_Adf, "d", "M510 140 L500 130 L490 140 M500 130 L500 230 M520 220 L480 220     M500 770 L500 870   M520 870 L500 860 L480 870");
                    diffAndSetAttribute(this.bearing1_Adf, "stroke", "cyan");
                    diffAndSetAttribute(this.bearing1_Adf, "stroke-width", "4");
                    diffAndSetAttribute(this.bearing1_Adf, "fill", "none");
                    diffAndSetAttribute(this.bearing1_Adf, "id", "bearing1_Adf");
                    diffAndSetAttribute(this.bearing1_Adf, "visibility", "hidden");
                    bearing.appendChild(this.bearing1_Adf);
                    this.bearing2_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing2_Vor, "d", "M510 140 L500 130 L490 140 L490 220 L470 220 L470 230 L530 230 L530 220 L510 220 L510 140      M500 860 L500 870    M510 865 L510 780 L500 770 L490 780 L490 865     M520 870 L500 860 L480 870 L480 880 L500 870 L520 880 L520 870");
                    diffAndSetAttribute(this.bearing2_Vor, "stroke", "green");
                    diffAndSetAttribute(this.bearing2_Vor, "stroke-width", "4");
                    diffAndSetAttribute(this.bearing2_Vor, "fill", "none");
                    diffAndSetAttribute(this.bearing2_Vor, "id", "bearing2_Vor");
                    diffAndSetAttribute(this.bearing2_Vor, "visibility", "hidden");
                    bearing.appendChild(this.bearing2_Vor);
                    this.bearing2_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing2_Adf, "d", "M510 140 L500 130 L490 140 L490 220 L470 220 L470 230 L530 230 L530 220 L510 220 L510 140      M500 860 L500 870    M510 865 L510 780 L500 770 L490 780 L490 865     M520 870 L500 860 L480 870 L480 880 L500 870 L520 880 L520 870");
                    diffAndSetAttribute(this.bearing2_Adf, "stroke", "cyan");
                    diffAndSetAttribute(this.bearing2_Adf, "stroke-width", "4");
                    diffAndSetAttribute(this.bearing2_Adf, "fill", "none");
                    diffAndSetAttribute(this.bearing2_Adf, "id", "bearing2_Adf");
                    diffAndSetAttribute(this.bearing2_Adf, "visibility", "hidden");
                    bearing.appendChild(this.bearing2_Adf);
                }
                this.course = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.course, "id", "course");
                this.courseGroup.appendChild(this.course);
                {
                    this.courseColor = "";
                    if (this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                        this.courseColor = "#ff00ff";
                    }
                    else if (this.navigationMode == Jet_NDCompass_Navigation.VOR) {
                        this.courseColor = "#00ffff";
                    }
                    this.courseTO = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.courseTO, "d", "M497 666 L503 666 L503 696 L523 696 L523 702 L503 702 L503 826 L497 826 L497 702 L477 702 L477 696 L497 696 L497 666 Z");
                    diffAndSetAttribute(this.courseTO, "fill", "none");
                    diffAndSetAttribute(this.courseTO, "transform", "rotate(180 500 500)");
                    diffAndSetAttribute(this.courseTO, "stroke", this.courseColor + '');
                    diffAndSetAttribute(this.courseTO, "stroke-width", "1");
                    this.course.appendChild(this.courseTO);
                    this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(this.courseDeviation, "x", "495");
                    diffAndSetAttribute(this.courseDeviation, "y", "333");
                    diffAndSetAttribute(this.courseDeviation, "width", "10");
                    diffAndSetAttribute(this.courseDeviation, "height", "333");
                    diffAndSetAttribute(this.courseDeviation, "fill", this.courseColor + '');
                    this.course.appendChild(this.courseDeviation);
                    this.courseFROM = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(this.courseFROM, "x", "497");
                    diffAndSetAttribute(this.courseFROM, "y", "166");
                    diffAndSetAttribute(this.courseFROM, "width", "6");
                    diffAndSetAttribute(this.courseFROM, "height", "166");
                    diffAndSetAttribute(this.courseFROM, "fill", "none");
                    diffAndSetAttribute(this.courseFROM, "transform", "rotate(180 500 500)");
                    diffAndSetAttribute(this.courseFROM, "stroke", this.courseColor + '');
                    diffAndSetAttribute(this.courseFROM, "stroke-width", "1");
                    this.course.appendChild(this.courseFROM);
                    let circlePosition = [-166, -55, 55, 166];
                    for (let i = 0; i < circlePosition.length; i++) {
                        let CDICircle = document.createElementNS(Avionics.SVG.NS, "circle");
                        diffAndSetAttribute(CDICircle, "cx", (500 + circlePosition[i]) + '');
                        diffAndSetAttribute(CDICircle, "cy", "500");
                        diffAndSetAttribute(CDICircle, "r", "10");
                        diffAndSetAttribute(CDICircle, "stroke", "white");
                        diffAndSetAttribute(CDICircle, "stroke-width", "2");
                        this.course.appendChild(CDICircle);
                    }
                }
            }
            this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.trackingGroup, "id", "trackingGroup");
            {
                this.trackingLine = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.trackingLine, "id", "trackingLine");
                diffAndSetAttribute(this.trackingLine, "d", "M500 450 v " + (-circleRadius + 50));
                diffAndSetAttribute(this.trackingLine, "fill", "transparent");
                diffAndSetAttribute(this.trackingLine, "stroke", "white");
                diffAndSetAttribute(this.trackingLine, "stroke-width", "3");
                this.trackingGroup.appendChild(this.trackingLine);
            }
            this.rotatingCircle.appendChild(this.trackingGroup);
            this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.headingGroup, "id", "headingGroup");
            {
                this.headingBug = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.headingBug, "id", "headingBug");
                diffAndSetAttribute(this.headingBug, "d", "M500 " + (500 - circleRadius) + " l -11 -20 l 22 0 z");
                diffAndSetAttribute(this.headingBug, "fill", "none");
                diffAndSetAttribute(this.headingBug, "stroke", "white");
                this.headingGroup.appendChild(this.headingBug);
            }
            this.rotatingCircle.appendChild(this.headingGroup);
            this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.selectedHeadingGroup, "id", "selectedHeadingGroup");
            {
                this.selectedHeadingLine = Avionics.SVG.computeDashLine(500, 450, -(circleRadius - 50), 15, 3, "#ff00e0");
                diffAndSetAttribute(this.selectedHeadingLine, "id", "selectedHeadingLine");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingLine);
                this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.selectedHeadingBug, "id", "selectedHeadingBug");
                diffAndSetAttribute(this.selectedHeadingBug, "d", "M500 " + (500 - circleRadius) + " h 22 v -22 h -7 l -15 22 l -15 -22 h -7 v 22 z");
                diffAndSetAttribute(this.selectedHeadingBug, "stroke", "#ff00e0");
                diffAndSetAttribute(this.selectedHeadingBug, "fill", "none");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
            }
            this.rotatingCircle.appendChild(this.selectedHeadingGroup);
            if (this.navigationMode == Jet_NDCompass_Navigation.NAV || this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.ilsGroup, "id", "ILSGroup");
                {
                    let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(ilsBug, "id", "ilsBug");
                    diffAndSetAttribute(ilsBug, "d", "M500 " + (500 - circleRadius) + " l0 -40 M485 " + (500 - circleRadius - 10) + " l30 0");
                    diffAndSetAttribute(ilsBug, "fill", "transparent");
                    diffAndSetAttribute(ilsBug, "stroke", "#FF0CE2");
                    diffAndSetAttribute(ilsBug, "stroke-width", "3");
                    this.ilsGroup.appendChild(ilsBug);
                }
                this.rotatingCircle.appendChild(this.ilsGroup);
            }
            if (this.navigationMode == Jet_NDCompass_Navigation.NAV) {
                this.selectedTrackGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.selectedTrackGroup, "id", "selectedTrackGroup");
                {
                    this.selectedTrackLine = Avionics.SVG.computeDashLine(500, 450, -(circleRadius - 50), 15, 3, "#ff00e0");
                    diffAndSetAttribute(this.selectedTrackLine, "id", "selectedTrackLine");
                    this.selectedTrackGroup.appendChild(this.selectedTrackLine);
                    this.selectedTrackBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.selectedTrackBug, "id", "selectedTrackBug");
                    diffAndSetAttribute(this.selectedTrackBug, "d", "M500 " + (500 - circleRadius) + " h -30 v 15 l 30 15 l 30 -15 v -15 z");
                    diffAndSetAttribute(this.selectedTrackBug, "stroke", "#ff00e0");
                    diffAndSetAttribute(this.selectedTrackBug, "stroke-width", "2");
                    this.selectedTrackGroup.appendChild(this.selectedTrackBug);
                }
                this.rotatingCircle.appendChild(this.selectedTrackGroup);
            }
        }
        this.glideSlopeGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.glideSlopeGroup, "id", "GlideSlopeGroup");
        this.root.appendChild(this.glideSlopeGroup);
        if (this._fullscreen)
            diffAndSetAttribute(this.glideSlopeGroup, "transform", "translate(-20, 0)");
        else
            diffAndSetAttribute(this.glideSlopeGroup, "transform", "translate(20, 20)");
        if (this.navigationMode === Jet_NDCompass_Navigation.ILS) {
            for (let i = 0; i < 5; i++) {
                if (i != 2) {
                    let glideSlopeDot = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(glideSlopeDot, "cx", "950");
                    diffAndSetAttribute(glideSlopeDot, "cy", fastToFixed((250 + i * 125), 0));
                    diffAndSetAttribute(glideSlopeDot, "r", "10");
                    diffAndSetAttribute(glideSlopeDot, "stroke", "white");
                    diffAndSetAttribute(glideSlopeDot, "stroke-width", "2");
                    this.glideSlopeGroup.appendChild(glideSlopeDot);
                }
            }
            let glideSlopeDash = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(glideSlopeDash, "x", "935");
            diffAndSetAttribute(glideSlopeDash, "y", "498");
            diffAndSetAttribute(glideSlopeDash, "width", "30");
            diffAndSetAttribute(glideSlopeDash, "height", "4");
            diffAndSetAttribute(glideSlopeDash, "fill", "yellow");
            this.glideSlopeGroup.appendChild(glideSlopeDash);
            this.glideSlopeCursor = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(this.glideSlopeCursor, "id", "GlideSlopeCursor");
            diffAndSetAttribute(this.glideSlopeCursor, "transform", "translate(" + 950 + " " + 500 + ")");
            diffAndSetAttribute(this.glideSlopeCursor, "d", "M-15 0 L0 -20 L15 0 M-15 0 L0 20 L15 0");
            diffAndSetAttribute(this.glideSlopeCursor, "stroke", "#ff00ff");
            diffAndSetAttribute(this.glideSlopeCursor, "stroke-width", "2");
            diffAndSetAttribute(this.glideSlopeCursor, "fill", "none");
            this.glideSlopeGroup.appendChild(this.glideSlopeCursor);
        }
        this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.currentRefGroup, "id", "currentRefGroup");
        {
            let centerX = 500;
            let centerY = (500 - circleRadius - 50);
            let rectWidth = 100;
            let rectHeight = 55;
            let textOffset = 10;
            this.currentRefMode = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.currentRefMode, "HDG");
            diffAndSetAttribute(this.currentRefMode, "x", (centerX - rectWidth * 0.5 - textOffset) + '');
            diffAndSetAttribute(this.currentRefMode, "y", centerY + '');
            diffAndSetAttribute(this.currentRefMode, "fill", "green");
            diffAndSetAttribute(this.currentRefMode, "font-size", "35");
            diffAndSetAttribute(this.currentRefMode, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.currentRefMode, "text-anchor", "end");
            diffAndSetAttribute(this.currentRefMode, "alignment-baseline", "central");
            this.currentRefGroup.appendChild(this.currentRefMode);
            let rect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(rect, "x", (centerX - rectWidth * 0.5) + '');
            diffAndSetAttribute(rect, "y", (centerY - rectHeight * 0.5) + '');
            diffAndSetAttribute(rect, "width", rectWidth + '');
            diffAndSetAttribute(rect, "height", rectHeight + '');
            diffAndSetAttribute(rect, "fill", "black");
            this.currentRefGroup.appendChild(rect);
            let path = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(path, "d", "M" + (centerX - (rectWidth * 0.5)) + " " + (centerY - (rectHeight * 0.5)) + " l0 " + rectHeight + " l" + rectWidth + " 0 l0 " + (-rectHeight));
            diffAndSetAttribute(path, "fill", "none");
            diffAndSetAttribute(path, "stroke", "white");
            diffAndSetAttribute(path, "stroke-width", "1");
            this.currentRefGroup.appendChild(path);
            this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.currentRefValue, "266");
            diffAndSetAttribute(this.currentRefValue, "x", centerX + '');
            diffAndSetAttribute(this.currentRefValue, "y", centerY + '');
            diffAndSetAttribute(this.currentRefValue, "fill", "white");
            diffAndSetAttribute(this.currentRefValue, "font-size", "35");
            diffAndSetAttribute(this.currentRefValue, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.currentRefValue, "text-anchor", "middle");
            diffAndSetAttribute(this.currentRefValue, "alignment-baseline", "central");
            this.currentRefGroup.appendChild(this.currentRefValue);
            this.currentRefType = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.currentRefType, "MAG");
            diffAndSetAttribute(this.currentRefType, "x", (centerX + rectWidth * 0.5 + textOffset) + '');
            diffAndSetAttribute(this.currentRefType, "y", centerY + '');
            diffAndSetAttribute(this.currentRefType, "fill", "green");
            diffAndSetAttribute(this.currentRefType, "font-size", "35");
            diffAndSetAttribute(this.currentRefType, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.currentRefType, "text-anchor", "start");
            diffAndSetAttribute(this.currentRefType, "alignment-baseline", "central");
            this.currentRefGroup.appendChild(this.currentRefType);
        }
        this.root.appendChild(this.currentRefGroup);
        let rangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(rangeGroup, "id", "RangeGroup");
        {
            let centerX = 146;
            let centerY = 43;
            if (this._fullscreen) {
                diffAndSetAttribute(rangeGroup, "transform", "scale(1.27)");
            }
            else {
                centerX = 266;
                centerY = 53;
            }
            let textBg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(textBg, "x", (centerX - 40) + '');
            diffAndSetAttribute(textBg, "y", (centerY - 32) + '');
            diffAndSetAttribute(textBg, "width", "80");
            diffAndSetAttribute(textBg, "height", "64");
            diffAndSetAttribute(textBg, "fill", "black");
            diffAndSetAttribute(textBg, "stroke", "white");
            diffAndSetAttribute(textBg, "stroke-width", "2");
            rangeGroup.appendChild(textBg);
            let textTitle = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(textTitle, "RANGE");
            diffAndSetAttribute(textTitle, "x", (centerX - 0.5) + '');
            diffAndSetAttribute(textTitle, "y", (centerY - 14) + '');
            diffAndSetAttribute(textTitle, "fill", "white");
            diffAndSetAttribute(textTitle, "font-size", "25");
            diffAndSetAttribute(textTitle, "font-family", "Roboto-Light");
            diffAndSetAttribute(textTitle, "text-anchor", "middle");
            diffAndSetAttribute(textTitle, "alignment-baseline", "central");
            rangeGroup.appendChild(textTitle);
            this.addMapRange(rangeGroup, (centerX - 0.5), (centerY + 15.5), "white", "25", false, 1.0, false);
        }
        this.root.appendChild(rangeGroup);
    }
    constructRose_CJ4() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        let circleRadius = 333;
        {
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rotatingCircle, "id", "RotatingCircle");
            this.root.appendChild(this.rotatingCircle);
            let outerGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(outerGroup, "id", "outerCircle");
            this.rotatingCircle.appendChild(outerGroup);
            {
                let texts = ["N", "E", "S", "W"];
                for (let i = 0; i < 72; i++) {
                    let line = document.createElementNS(Avionics.SVG.NS, "rect");
                    let startY = 500 - circleRadius;
                    let length = (i % 2 == 0) ? 20 : 13;
                    diffAndSetAttribute(line, "x", "498");
                    diffAndSetAttribute(line, "y", startY + '');
                    diffAndSetAttribute(line, "width", "4");
                    diffAndSetAttribute(line, "height", length + '');
                    diffAndSetAttribute(line, "transform", "rotate(" + fastToFixed(i * 5, 0) + " 500 500)");
                    diffAndSetAttribute(line, "fill", "white");
                    outerGroup.appendChild(line);
                }
                for (let i = 0; i < 36; i += 3) {
                    let text = document.createElementNS(Avionics.SVG.NS, "text");
                    if (i % 9 == 0) {
                        let id = i / 9;
                        diffAndSetText(text, texts[id]);
                    }
                    else
                        diffAndSetText(text, fastToFixed(i, 0));
                    diffAndSetAttribute(text, "x", "500");
                    diffAndSetAttribute(text, "y", (500 - circleRadius + 52) + '');
                    diffAndSetAttribute(text, "fill", "white");
                    diffAndSetAttribute(text, "font-size", "40");
                    diffAndSetAttribute(text, "font-family", "Roboto-Light");
                    diffAndSetAttribute(text, "text-anchor", "middle");
                    diffAndSetAttribute(text, "alignment-baseline", "central");
                    diffAndSetAttribute(text, "transform", "rotate(" + fastToFixed(i * 10, 0) + " 500 500)");
                    outerGroup.appendChild(text);
                }
            }
            this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.courseGroup, "id", "CourseInfo");
            this.rotatingCircle.appendChild(this.courseGroup);
            {
                let bearing = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(bearing, "id", "bearing");
                this.courseGroup.appendChild(bearing);
                {
                    this.bearing1_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing1_Vor, "d", "M500 832 L500 810 M500 780 L500 666     M500 334 L500 220 M500 190 L500 168     M520 220 L500 190 L480 220 Z       M520 810 L500 780 L480 810 Z");
                    diffAndSetAttribute(this.bearing1_Vor, "stroke", "white");
                    diffAndSetAttribute(this.bearing1_Vor, "stroke-width", "6");
                    diffAndSetAttribute(this.bearing1_Vor, "fill", "none");
                    diffAndSetAttribute(this.bearing1_Vor, "id", "bearing1_Vor");
                    diffAndSetAttribute(this.bearing1_Vor, "visibility", "hidden");
                    bearing.appendChild(this.bearing1_Vor);
                    this.bearing1_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing1_Adf, "d", "M500 666 L500 832 M500 334 L500 168    M520 220 L500 190 L480 220      M520 810 L500 780 L480 810");
                    diffAndSetAttribute(this.bearing1_Adf, "stroke", "lime");
                    diffAndSetAttribute(this.bearing1_Adf, "stroke-width", "6");
                    diffAndSetAttribute(this.bearing1_Adf, "fill", "none");
                    diffAndSetAttribute(this.bearing1_Adf, "id", "bearing1_Adf");
                    diffAndSetAttribute(this.bearing1_Adf, "visibility", "hidden");
                    bearing.appendChild(this.bearing1_Adf);
                    this.bearing2_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing2_Vor, "d", "M500 832 L500 740      M510 666 L510 740 L490 740 L490 666         M500 260 L500 168    M510 334 L510 290 L520 290 L500 260 L480 290 L490 290 L490 334");
                    diffAndSetAttribute(this.bearing2_Vor, "stroke", "white");
                    diffAndSetAttribute(this.bearing2_Vor, "stroke-width", "6");
                    diffAndSetAttribute(this.bearing2_Vor, "fill", "none");
                    diffAndSetAttribute(this.bearing2_Vor, "id", "bearing2_Vor");
                    diffAndSetAttribute(this.bearing2_Vor, "visibility", "hidden");
                    bearing.appendChild(this.bearing2_Vor);
                    this.bearing2_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.bearing2_Adf, "d", "M500 832 L500 710      M520 666 L520 740 L500 710 L480 740 L480 666         M500 260 L500 168    M520 334 L520 290 L500 260 L480 290 L480 334");
                    diffAndSetAttribute(this.bearing2_Adf, "stroke", "lime");
                    diffAndSetAttribute(this.bearing2_Adf, "stroke-width", "6");
                    diffAndSetAttribute(this.bearing2_Adf, "fill", "none");
                    diffAndSetAttribute(this.bearing2_Adf, "id", "bearing2_Adf");
                    diffAndSetAttribute(this.bearing2_Adf, "visibility", "hidden");
                    bearing.appendChild(this.bearing2_Adf);
                }
                this.course = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.course, "id", "course");
                this.courseGroup.appendChild(this.course);
                {
                    this.courseColor = "";
                    if (this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                        this.courseColor = "#ff00ff";
                    }
                    else if (this.navigationMode == Jet_NDCompass_Navigation.VOR) {
                        this.courseColor = "#00ffff";
                    }
                    this.courseTO = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.courseTO, "d", "M497 666 L503 666 L503 696 L523 696 L523 702 L503 702 L503 826 L497 826 L497 702 L477 702 L477 696 L497 696 L497 666 Z");
                    diffAndSetAttribute(this.courseTO, "fill", "none");
                    diffAndSetAttribute(this.courseTO, "transform", "rotate(180 500 500)");
                    diffAndSetAttribute(this.courseTO, "stroke", this.courseColor + '');
                    diffAndSetAttribute(this.courseTO, "stroke-width", "1");
                    this.course.appendChild(this.courseTO);
                    this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(this.courseDeviation, "x", "495");
                    diffAndSetAttribute(this.courseDeviation, "y", "333");
                    diffAndSetAttribute(this.courseDeviation, "width", "10");
                    diffAndSetAttribute(this.courseDeviation, "height", "333");
                    diffAndSetAttribute(this.courseDeviation, "fill", this.courseColor + '');
                    this.course.appendChild(this.courseDeviation);
                    this.courseFROM = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(this.courseFROM, "x", "497");
                    diffAndSetAttribute(this.courseFROM, "y", "166");
                    diffAndSetAttribute(this.courseFROM, "width", "6");
                    diffAndSetAttribute(this.courseFROM, "height", "166");
                    diffAndSetAttribute(this.courseFROM, "fill", "none");
                    diffAndSetAttribute(this.courseFROM, "transform", "rotate(180 500 500)");
                    diffAndSetAttribute(this.courseFROM, "stroke", this.courseColor + '');
                    diffAndSetAttribute(this.courseFROM, "stroke-width", "1");
                    this.course.appendChild(this.courseFROM);
                    let circlePosition = [-166, -55, 55, 166];
                    for (let i = 0; i < circlePosition.length; i++) {
                        let CDICircle = document.createElementNS(Avionics.SVG.NS, "circle");
                        diffAndSetAttribute(CDICircle, "cx", (500 + circlePosition[i]) + '');
                        diffAndSetAttribute(CDICircle, "cy", "500");
                        diffAndSetAttribute(CDICircle, "r", "10");
                        diffAndSetAttribute(CDICircle, "stroke", "white");
                        diffAndSetAttribute(CDICircle, "stroke-width", "2");
                        this.course.appendChild(CDICircle);
                    }
                }
            }
            this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.trackingGroup, "id", "trackingGroup");
            {
                let rad = 5;
                this.trackingBug = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(this.trackingBug, "id", "trackingBug");
                diffAndSetAttribute(this.trackingBug, "cx", "500");
                diffAndSetAttribute(this.trackingBug, "cy", (500 - circleRadius - rad) + '');
                diffAndSetAttribute(this.trackingBug, "r", rad + '');
                diffAndSetAttribute(this.trackingBug, "fill", "none");
                diffAndSetAttribute(this.trackingBug, "stroke", "#ff00e0");
                diffAndSetAttribute(this.trackingBug, "stroke-width", "2");
                this.trackingGroup.appendChild(this.trackingBug);
            }
            this.rotatingCircle.appendChild(this.trackingGroup);
            this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.headingGroup, "id", "headingGroup");
            {
            }
            this.rotatingCircle.appendChild(this.headingGroup);
            this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.selectedHeadingGroup, "id", "selectedHeadingGroup");
            {
                this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.selectedHeadingBug, "id", "selectedHeadingBug");
                diffAndSetAttribute(this.selectedHeadingBug, "d", "M500 " + (500 - circleRadius) + " h 22 v -18 h -7 l -15 18l -15 -18h -7 v 18 Z");
                diffAndSetAttribute(this.selectedHeadingBug, "fill", "#00F2FF");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
            }
            this.rotatingCircle.appendChild(this.selectedHeadingGroup);
            if (this.navigationMode == Jet_NDCompass_Navigation.NAV || this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.ilsGroup, "id", "ILSGroup");
                {
                    let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(ilsBug, "id", "ilsBug");
                    diffAndSetAttribute(ilsBug, "d", "M500 " + (500 - circleRadius) + " l0 -40 M485 " + (500 - circleRadius - 10) + " l30 0");
                    diffAndSetAttribute(ilsBug, "fill", "transparent");
                    diffAndSetAttribute(ilsBug, "stroke", "#FF0CE2");
                    diffAndSetAttribute(ilsBug, "stroke-width", "3");
                    this.ilsGroup.appendChild(ilsBug);
                }
                this.rotatingCircle.appendChild(this.ilsGroup);
            }
        }
        let innerCircleGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(innerCircleGroup, "id", "innerCircle");
        this.root.appendChild(innerCircleGroup);
        {
            var smallCircleRadius = 170;
            let circle = document.createElementNS(Avionics.SVG.NS, "circle");
            diffAndSetAttribute(circle, "cx", "500");
            diffAndSetAttribute(circle, "cy", "500");
            diffAndSetAttribute(circle, "r", smallCircleRadius + '');
            diffAndSetAttribute(circle, "fill-opacity", "0");
            diffAndSetAttribute(circle, "stroke", "white");
            diffAndSetAttribute(circle, "stroke-width", "2");
            diffAndSetAttribute(circle, "stroke-opacity", "1");
            innerCircleGroup.appendChild(circle);
            let dashSpacing = 12;
            let radians = 0;
            for (let i = 0; i < dashSpacing; i++) {
                let line = document.createElementNS(Avionics.SVG.NS, "line");
                let length = 15;
                let lineStart = 500 + smallCircleRadius - length * 0.5;
                let lineEnd = 500 + smallCircleRadius + length * 0.5;
                let degrees = (radians / Math.PI) * 180;
                diffAndSetAttribute(line, "x1", "500");
                diffAndSetAttribute(line, "y1", lineStart + '');
                diffAndSetAttribute(line, "x2", "500");
                diffAndSetAttribute(line, "y2", lineEnd + '');
                diffAndSetAttribute(line, "transform", "rotate(" + (-degrees + 180) + " 500 500)");
                diffAndSetAttribute(line, "stroke", "white");
                diffAndSetAttribute(line, "stroke-width", "4");
                diffAndSetAttribute(line, "stroke-opacity", "0.8");
                innerCircleGroup.appendChild(line);
                radians += (2 * Math.PI) / dashSpacing;
            }
            let vec = new Vec2(1, 0.45);
            vec.SetNorm(smallCircleRadius * 0.82);
            this.addMapRange(innerCircleGroup, 500 - vec.x, 500 - vec.y, "white", "28", false, 0.5, false);
        }
        this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.currentRefGroup, "id", "currentRefGroup");
        diffAndSetAttribute(this.currentRefGroup, "transform", "scale(1.5)");
        {
            let centerX = 332;
            let centerY = 75;
            let rectWidth = 65;
            let rectHeight = 40;
            let rectArrowFactor = 0.35;
            let rect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(rect, "x", (centerX - rectWidth * 0.5) + '');
            diffAndSetAttribute(rect, "y", (centerY - rectHeight * 0.5) + '');
            diffAndSetAttribute(rect, "width", rectWidth + '');
            diffAndSetAttribute(rect, "height", rectHeight + '');
            diffAndSetAttribute(rect, "fill", "#0e0d08");
            this.currentRefGroup.appendChild(rect);
            let d = "M" + (centerX - (rectWidth * 0.5)) + " " + (centerY - (rectHeight * 0.5));
            d += " l0 " + rectHeight;
            d += " l" + (rectWidth * rectArrowFactor) + " 0";
            d += " l" + (rectWidth * 0.5 - rectWidth * rectArrowFactor) + " 9";
            d += " l" + (rectWidth * 0.5 - rectWidth * rectArrowFactor) + " -9";
            d += " l" + (rectWidth * rectArrowFactor) + " 0";
            d += " l0 " + (-rectHeight);
            let path = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(path, "d", d);
            diffAndSetAttribute(path, "fill", "none");
            diffAndSetAttribute(path, "stroke", "white");
            diffAndSetAttribute(path, "stroke-width", "2");
            this.currentRefGroup.appendChild(path);
            this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.currentRefValue, "");
            diffAndSetAttribute(this.currentRefValue, "x", centerX + '');
            diffAndSetAttribute(this.currentRefValue, "y", centerY + '');
            diffAndSetAttribute(this.currentRefValue, "fill", "green");
            diffAndSetAttribute(this.currentRefValue, "font-size", "28");
            diffAndSetAttribute(this.currentRefValue, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.currentRefValue, "text-anchor", "middle");
            diffAndSetAttribute(this.currentRefValue, "alignment-baseline", "central");
            this.currentRefGroup.appendChild(this.currentRefValue);
        }
        this.root.appendChild(this.currentRefGroup);
        this.selectedRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.selectedRefGroup, "id", "selectedRefGroup");
        diffAndSetAttribute(this.selectedRefGroup, "transform", "scale(1.5)");
        {
            let centerX = 180;
            let centerY = 62;
            let spaceX = 5;
            this.selectedRefMode = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.selectedRefMode, "HDG");
            diffAndSetAttribute(this.selectedRefMode, "x", (centerX - spaceX) + '');
            diffAndSetAttribute(this.selectedRefMode, "y", centerY + '');
            diffAndSetAttribute(this.selectedRefMode, "fill", "#00F2FF");
            diffAndSetAttribute(this.selectedRefMode, "font-size", "18");
            diffAndSetAttribute(this.selectedRefMode, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.selectedRefMode, "text-anchor", "end");
            diffAndSetAttribute(this.selectedRefMode, "alignment-baseline", "central");
            this.selectedRefGroup.appendChild(this.selectedRefMode);
            this.selectedRefValue = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.selectedRefValue, "");
            diffAndSetAttribute(this.selectedRefValue, "x", (centerX + spaceX) + '');
            diffAndSetAttribute(this.selectedRefValue, "y", centerY + '');
            diffAndSetAttribute(this.selectedRefValue, "fill", "#00F2FF");
            diffAndSetAttribute(this.selectedRefValue, "font-size", "23");
            diffAndSetAttribute(this.selectedRefValue, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.selectedRefValue, "text-anchor", "start");
            diffAndSetAttribute(this.selectedRefValue, "alignment-baseline", "central");
            this.selectedRefGroup.appendChild(this.selectedRefValue);
        }
        this.root.appendChild(this.selectedRefGroup);
    }
}
customElements.define("jet-mfd-nd-compass", Jet_MFD_NDCompass);
//# sourceMappingURL=NDCompass.js.map