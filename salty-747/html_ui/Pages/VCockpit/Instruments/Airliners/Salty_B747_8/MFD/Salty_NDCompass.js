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
        else
            this.constructArc_A320_Neo();
    }
    constructArc_CJ4() {
    }
    constructArc_A320_Neo() {
    }
    constructArc_B747_8() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("height", "100%");
        this.root.setAttribute("viewBox", "-225 -215 550 516");
        this.appendChild(this.root);
        var trsGroup = document.createElementNS(Avionics.SVG.NS, "g");
        trsGroup.setAttribute("transform", "translate(-266, -208) scale(1.15)");
        this.root.appendChild(trsGroup);
        {
            let viewBox = document.createElementNS(Avionics.SVG.NS, "svg");
            viewBox.setAttribute("viewBox", "-250 -475 600 700");
            trsGroup.appendChild(viewBox);
            var circleRadius = 450;
            var dashSpacing = 72;
            var maskHeight = 200;
            this.arcMaskGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.arcMaskGroup.setAttribute("id", "MaskGroup");
            viewBox.appendChild(this.arcMaskGroup);
            {
                let topMask = document.createElementNS(Avionics.SVG.NS, "path");
                topMask.setAttribute("d", "M0 " + -maskHeight + ", L" + circleRadius * 2 + " " + -maskHeight + ", L" + circleRadius * 2 + " " + circleRadius + ", A 25 25 0 1 0 0, " + circleRadius + "Z");
                topMask.setAttribute("transform", "translate(" + (50 - circleRadius) + ", " + (50 - circleRadius) + ")");
                topMask.setAttribute("fill", "black");
                this.arcMaskGroup.appendChild(topMask);
            }
            this.arcRangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.arcRangeGroup.setAttribute("id", "ArcRangeGroup");
            viewBox.appendChild(this.arcRangeGroup);
            {
                let rads = [0.25, 0.50, 0.75];
                for (let r = 0; r < rads.length; r++) {
                    let rad = circleRadius * rads[r];
                    let path = document.createElementNS(Avionics.SVG.NS, "path");
                    path.setAttribute("d", "M" + (50 - rad) + ",50 a1,1 0 0 1 " + (rad * 2) + ",0");
                    path.setAttribute("fill", "none");
                    path.setAttribute("stroke", "white");
                    path.setAttribute("stroke-width", "2");
                    this.arcRangeGroup.appendChild(path);
                }
            }
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            this.rotatingCircle.setAttribute("id", "RotatingCircle");
            viewBox.appendChild(this.rotatingCircle);
            {
                let circleGroup = document.createElementNS(Avionics.SVG.NS, "g");
                circleGroup.setAttribute("id", "circleGroup");
                {
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    circle.setAttribute("cx", "50");
                    circle.setAttribute("cy", "50");
                    circle.setAttribute("r", circleRadius.toString());
                    circle.setAttribute("fill-opacity", "0");
                    circle.setAttribute("stroke", "white");
                    circle.setAttribute("stroke-width", "2.5");
                    circleGroup.appendChild(circle);
                    let radians = 0;
                    for (let i = 0; i < dashSpacing; i++) {
                        let line = document.createElementNS(Avionics.SVG.NS, "line");
                        let bIsBig = (i % 2 == 0) ? true : false;
                        let length = (bIsBig) ? 28 : 12;
                        let lineStart = 50 + circleRadius;
                        let lineEnd = lineStart - length;
                        let degrees = (radians / Math.PI) * 180;
                        line.setAttribute("x1", "50");
                        line.setAttribute("y1", lineStart.toString());
                        line.setAttribute("x2", "50");
                        line.setAttribute("y2", lineEnd.toString());
                        line.setAttribute("transform", "rotate(" + (-degrees + 180) + " 50 50)");
                        line.setAttribute("stroke", "white");
                        line.setAttribute("stroke-width", "2.5");
                        if (bIsBig) {
                            let text = document.createElementNS(Avionics.SVG.NS, "text");
                            text.textContent = (i % 3 == 0) ? fastToFixed(degrees / 10, 0) : "";
                            text.setAttribute("x", "50");
                            text.setAttribute("y", (-(circleRadius - 45 - length - 18)).toString());
                            text.setAttribute("fill", "white");
                            text.setAttribute("font-size", (i % 3 == 0) ? "28" : "20");
                            text.setAttribute("font-family", "BoeingEFIS");
                            text.setAttribute("text-anchor", "middle");
                            text.setAttribute("alignment-baseline", "central");
                            text.setAttribute("transform", "rotate(" + degrees + " 50 50)");
                            circleGroup.appendChild(text);
                        }
                        radians += (2 * Math.PI) / dashSpacing;
                        circleGroup.appendChild(line);
                    }
                }
                this.rotatingCircle.appendChild(circleGroup);
                this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.trackingGroup.setAttribute("id", "trackingGroup");
                {
                    this.trackingLine = document.createElementNS(Avionics.SVG.NS, "path");
                    this.trackingLine.setAttribute("id", "trackingLine");
                    this.trackingLine.setAttribute("d", "M50 70 v " + (circleRadius - 20));
                    this.trackingLine.setAttribute("fill", "transparent");
                    this.trackingLine.setAttribute("stroke", "white");
                    this.trackingLine.setAttribute("stroke-width", "3");
                    this.trackingGroup.appendChild(this.trackingLine);
                }
                this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.headingGroup.setAttribute("id", "headingGroup");
                {
                    this.headingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    this.headingBug.setAttribute("id", "headingBug");
                    this.headingBug.setAttribute("d", "M50 " + (50 + circleRadius) + " l -11 20 l 22 0 Z");
                    this.headingBug.setAttribute("fill", "none");
                    this.headingBug.setAttribute("stroke", "white");
                    this.headingBug.setAttribute("stroke-width", "2");
                    this.headingGroup.appendChild(this.headingBug);
                }
                this.rotatingCircle.appendChild(this.headingGroup);
                this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.courseGroup.setAttribute("id", "CourseInfo");
                this.rotatingCircle.appendChild(this.courseGroup);
                {
                    let bearing = document.createElementNS(Avionics.SVG.NS, "g");
                    bearing.setAttribute("id", "bearing");
                    this.courseGroup.appendChild(bearing);
                    {
                        this.bearing1_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                        this.bearing1_Vor.setAttribute("d", "M50 -403 L45 -410 L40 -403 M45 -410 L45 -345 M55 -349 L35 -349     M50 445 L50 510 M65 510 L50 500 L35 510");
                        this.bearing1_Vor.setAttribute("stroke", "lime");
                        this.bearing1_Vor.setAttribute("stroke-width", "2");
                        this.bearing1_Vor.setAttribute("fill", "none");
                        this.bearing1_Vor.setAttribute("id", "bearing1_Vor");
                        this.bearing1_Vor.setAttribute("visibility", "hidden");
                        bearing.appendChild(this.bearing1_Vor);
                        this.bearing1_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                        this.bearing1_Adf.setAttribute("d", "M50 -403 L45 -410 L40 -403 M45 -410 L45 -345 M55 -349 L35 -349     M50 445 L50 510 M65 510 L50 500 L35 510");
                        this.bearing1_Adf.setAttribute("stroke", "cyan");
                        this.bearing1_Adf.setAttribute("stroke-width", "2");
                        this.bearing1_Adf.setAttribute("fill", "none");
                        this.bearing1_Adf.setAttribute("id", "bearing1_Adf");
                        this.bearing1_Adf.setAttribute("visibility", "hidden");
                        bearing.appendChild(this.bearing1_Adf);
                        this.bearing2_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                        this.bearing2_Vor.setAttribute("d", "M50 -403 L45 -410 L40 -403 L40 -349 L30 -349 L30 -340 L60 -340 L60 -349 L50 -349 L50 -403        M65 510 L50 500 L35 510 L35 520 L50 510 L65 520 L65 510 M57 505 L57 452 L50 445 L43 452 L43 505");
                        this.bearing2_Vor.setAttribute("stroke", "lime");
                        this.bearing2_Vor.setAttribute("stroke-width", "2");
                        this.bearing2_Vor.setAttribute("fill", "none");
                        this.bearing2_Vor.setAttribute("id", "bearing2_Vor");
                        this.bearing2_Vor.setAttribute("visibility", "hidden");
                        bearing.appendChild(this.bearing2_Vor);
                        this.bearing2_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                        this.bearing2_Adf.setAttribute("d", "M50 -403 L45 -410 L40 -403 L40 -349 L30 -349 L30 -340 L60 -340 L60 -349 L50 -349 L50 -403       M65 510 L50 500 L35 510 L35 520 L50 510 L65 520 L65 510 M57 505 L57 452 L50 445 L43 452 L43 505");
                        this.bearing2_Adf.setAttribute("stroke", "cyan");
                        this.bearing2_Adf.setAttribute("stroke-width", "2");
                        this.bearing2_Adf.setAttribute("fill", "none");
                        this.bearing2_Adf.setAttribute("id", "bearing2_Adf");
                        this.bearing2_Adf.setAttribute("visibility", "hidden");
                        bearing.appendChild(this.bearing2_Adf);
                    }
                    this.course = document.createElementNS(Avionics.SVG.NS, "g");
                    this.course.setAttribute("id", "course");
                    this.courseGroup.appendChild(this.course);
                    {
                        this.courseColor = "";
                        if (this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                            this.courseColor = "#D570FF";
                        }
                        else if (this.navigationMode == Jet_NDCompass_Navigation.VOR) {
                            this.courseColor = "#00ffff";
                        }
                        this.courseTO = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseTO.setAttribute("d", "M46 110 l8 0 l0 25 l-4 5 l-4 -5 l0 -25 Z");
                        this.courseTO.setAttribute("fill", "none");
                        this.courseTO.setAttribute("transform", "rotate(180 50 50)");
                        this.courseTO.setAttribute("stroke", this.courseColor.toString());
                        this.courseTO.setAttribute("stroke-width", "1");
                        this.course.appendChild(this.courseTO);
                        this.courseTOLine = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseTOLine.setAttribute("d", "M50 140 l0 " + (circleRadius - 90) + " Z");
                        this.courseTOLine.setAttribute("transform", "rotate(180 50 50)");
                        this.courseTOLine.setAttribute("stroke", this.courseColor.toString());
                        this.courseTOLine.setAttribute("stroke-width", "1");
                        this.course.appendChild(this.courseTOLine);
                        this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "rect");
                        this.courseDeviation.setAttribute("x", "45");
                        this.courseDeviation.setAttribute("y", "-10");
                        this.courseDeviation.setAttribute("width", "10");
                        this.courseDeviation.setAttribute("height", "125");
                        this.courseDeviation.setAttribute("fill", this.courseColor.toString());
                        this.course.appendChild(this.courseDeviation);
                        this.courseFROM = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseFROM.setAttribute("d", "M46 -15 l8 0 l0 -20 l-8 0 l0 20 Z");
                        this.courseFROM.setAttribute("fill", "none");
                        this.courseFROM.setAttribute("transform", "rotate(180 50 50)");
                        this.courseFROM.setAttribute("stroke", this.courseColor.toString());
                        this.courseFROM.setAttribute("stroke-width", "1");
                        this.course.appendChild(this.courseFROM);
                        this.courseFROMLine = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseFROMLine.setAttribute("d", "M50 -35 l0 " + (-circleRadius + 85) + " Z");
                        this.courseFROMLine.setAttribute("fill", "none");
                        this.courseFROMLine.setAttribute("transform", "rotate(180 50 50)");
                        this.courseFROMLine.setAttribute("stroke", this.courseColor.toString());
                        this.courseFROMLine.setAttribute("stroke-width", "1");
                        this.course.appendChild(this.courseFROMLine);
                    }
                }
                this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.selectedHeadingGroup.setAttribute("id", "selectedHeadingGroup");
                {
                    this.selectedHeadingLine = Avionics.SVG.computeDashLine(50, 70, (circleRadius - 5), 15, 3, "#D570FF");
                    this.selectedHeadingLine.setAttribute("id", "selectedHeadingLine");
                    this.selectedHeadingGroup.appendChild(this.selectedHeadingLine);
                    this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    this.selectedHeadingBug.setAttribute("id", "selectedHeadingBug");
                    this.selectedHeadingBug.setAttribute("d", "M43 " + (50 + circleRadius) + " h 22 v 12 h -8 l -7 -12 l -7 12 h -8 v -12 z");
                    this.selectedHeadingBug.setAttribute("stroke", "#D570FF");
                    this.selectedHeadingBug.setAttribute("fill", "none");
                    this.selectedHeadingBug.setAttribute("stroke-width", "2");
                    this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
                }
                this.rotatingCircle.appendChild(this.selectedHeadingGroup);
                this.selectedTrackGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.selectedTrackGroup.setAttribute("id", "selectedTrackGroup");
                {
                    this.selectedTrackLine = Avionics.SVG.computeDashLine(50, 70, (circleRadius - 5), 15, 3, "#D570FF");
                    this.selectedTrackLine.setAttribute("id", "selectedTrackLine");
                    this.selectedTrackGroup.appendChild(this.selectedTrackLine);
                    this.selectedTrackBug = document.createElementNS(Avionics.SVG.NS, "path");
                    this.selectedTrackBug.setAttribute("id", "selectedTrackBug");
                    this.selectedTrackBug.setAttribute("d", "M50 " + (5 + circleRadius) + " h -30 v -15 l 30 -15 l 30 15 v 15 z");
                    this.selectedTrackBug.setAttribute("stroke", "#D570FF");
                    this.selectedTrackBug.setAttribute("stroke-width", "2");
                    this.selectedTrackGroup.appendChild(this.selectedTrackBug);
                }
                this.rotatingCircle.appendChild(this.selectedTrackGroup);
                this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.ilsGroup.setAttribute("id", "ILSGroup");
                {
                    let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                    ilsBug.setAttribute("id", "ilsBug");
                    ilsBug.setAttribute("d", "M50 " + (50 + circleRadius) + " l0 40 M35 " + (50 + circleRadius + 10) + " l30 0");
                    ilsBug.setAttribute("fill", "transparent");
                    ilsBug.setAttribute("stroke", "#FF0CE2");
                    ilsBug.setAttribute("stroke-width", "3");
                    this.ilsGroup.appendChild(ilsBug);
                }
                this.rotatingCircle.appendChild(this.ilsGroup);
            }
            {
                this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.currentRefGroup.setAttribute("id", "currentRefGroup");
                {
                    let centerX = 50;
                    let centerY = -442;
                    let rectWidth = 65;
                    let rectHeight = 40;
                    let textOffset = 5;
                    this.currentRefMode = document.createElementNS(Avionics.SVG.NS, "text");
                    this.currentRefMode.textContent = "HDG";
                    this.currentRefMode.setAttribute("x", (centerX - rectWidth * 0.5 - textOffset).toString());
                    this.currentRefMode.setAttribute("y", (centerY + 5).toString());
                    this.currentRefMode.setAttribute("fill", "lime");
                    this.currentRefMode.setAttribute("font-size", "26");
                    this.currentRefMode.setAttribute("font-family", "BoeingEFIS");
                    this.currentRefMode.setAttribute("text-anchor", "end");
                    this.currentRefMode.setAttribute("alignment-baseline", "central");
                    this.currentRefGroup.appendChild(this.currentRefMode);
                    let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                    rect.setAttribute("x", (centerX - rectWidth * 0.5).toString());
                    rect.setAttribute("y", (centerY - rectHeight * 0.5).toString());
                    rect.setAttribute("width", rectWidth.toString());
                    rect.setAttribute("height", rectHeight.toString());
                    rect.setAttribute("fill", "black");
                    this.currentRefGroup.appendChild(rect);
                    let path = document.createElementNS(Avionics.SVG.NS, "path");
                    path.setAttribute("d", "M" + (centerX - (rectWidth * 0.5)) + " " + (centerY - (rectHeight * 0.5)) + " l0 " + rectHeight + " l" + rectWidth + " 0 l0 " + (-rectHeight));
                    path.setAttribute("fill", "none");
                    path.setAttribute("stroke", "white");
                    path.setAttribute("stroke-width", "2");
                    this.currentRefGroup.appendChild(path);
                    this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
                    this.currentRefValue.textContent = "266";
                    this.currentRefValue.setAttribute("x", centerX.toString());
                    this.currentRefValue.setAttribute("y", (centerY + 2).toString());
                    this.currentRefValue.setAttribute("fill", "white");
                    this.currentRefValue.setAttribute("font-size", "30");
                    this.currentRefValue.setAttribute("font-family", "BoeingEFIS");
                    this.currentRefValue.setAttribute("text-anchor", "middle");
                    this.currentRefValue.setAttribute("alignment-baseline", "central");
                    this.currentRefValue.style.letterSpacing = "1px";
                    this.currentRefGroup.appendChild(this.currentRefValue);
                    this.currentRefType = document.createElementNS(Avionics.SVG.NS, "text");
                    this.currentRefType.textContent = "MAG";
                    this.currentRefType.setAttribute("x", (centerX + rectWidth * 0.5 + textOffset).toString());
                    this.currentRefType.setAttribute("y", (centerY + 5).toString());
                    this.currentRefType.setAttribute("fill", "lime");
                    this.currentRefType.setAttribute("font-size", "26");
                    this.currentRefType.setAttribute("font-family", "BoeingEFIS");
                    this.currentRefType.setAttribute("text-anchor", "start");
                    this.currentRefType.setAttribute("alignment-baseline", "central");
                    this.currentRefGroup.appendChild(this.currentRefType);
                }
                viewBox.appendChild(this.currentRefGroup);
                let rangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
                rangeGroup.setAttribute("id", "RangeGroup");
                rangeGroup.setAttribute("transform", "scale(0.8)");
                {
                    let centerX = -95;
                    let centerY = -540;
                    let textBg = document.createElementNS(Avionics.SVG.NS, "rect");
                    textBg.setAttribute("x", (centerX - 40).toString());
                    textBg.setAttribute("y", (centerY - 32).toString());
                    textBg.setAttribute("width", "80");
                    textBg.setAttribute("height", "64");
                    textBg.setAttribute("fill", "black");
                    textBg.setAttribute("stroke", "white");
                    textBg.setAttribute("stroke-width", "2");
                    rangeGroup.appendChild(textBg);
                    let textTitle = document.createElementNS(Avionics.SVG.NS, "text");
                    textTitle.textContent = "RANGE";
                    textTitle.setAttribute("x", centerX.toString());
                    textTitle.setAttribute("y", (centerY - 10).toString());
                    textTitle.setAttribute("fill", "white");
                    textTitle.setAttribute("font-size", "25");
                    textTitle.setAttribute("font-family", "BoeingEFIS");
                    textTitle.setAttribute("text-anchor", "middle");
                    textTitle.setAttribute("alignment-baseline", "central");
                    rangeGroup.appendChild(textTitle);
                    this.addMapRange(rangeGroup, centerX, (centerY + 15), "white", "30", false, 1.0, false);
                }
                viewBox.appendChild(rangeGroup);
            }
        }
    }
    updateIRS() {
        const IRSState = SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum");
        if (IRSState == 0) {
            if (this.displayMode === Jet_NDCompass_Display.ARC) {
                this.currentRefValue.setAttribute("display", "none");
                this.currentRefType.setAttribute("display", "none");
                this.currentRefMode.setAttribute("display", "none");
                this.rotatingCircle.setAttribute("display", "none");
            }
        }
        if (IRSState == 1) {
            if (this.displayMode === Jet_NDCompass_Display.ARC) {
                this.currentRefValue.setAttribute("display", "");
                this.currentRefValue.textContent = "---";
                this.currentRefType.setAttribute("display", "");
                this.currentRefMode.setAttribute("display", "");
                this.rotatingCircle.setAttribute("display", "");
                this.trackingGroup.setAttribute("display", "none");
            }
        }
        if (IRSState == 2) {
            if (this.displayMode === Jet_NDCompass_Display.ARC) {
                this.currentRefValue.setAttribute("display", "");
                this.currentRefType.setAttribute("display", "");
                this.currentRefMode.setAttribute("display", "");
                this.rotatingCircle.setAttribute("display", "");
            }
        }
    }
    constructArc_AS01B() {
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
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("height", "100%");
        this.root.setAttribute("viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        {
            let circleRadius = 333;
            let outerCircleGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(outerCircleGroup);
            {
                this.planMaskGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.planMaskTop = document.createElementNS(Avionics.SVG.NS, "path");
                this.planMaskTop.setAttribute("d", "M 0 0 L 1000 0 L 1000 500 L 833 500 A 333 333 0 0 0 167 500 L 0 500 Z");
                this.planMaskGroup.appendChild(this.planMaskTop);
                this.planMaskBottom = document.createElementNS(Avionics.SVG.NS, "path");
                this.planMaskBottom.setAttribute("d", "M 0 500 L 167 500 A 333 333 0 0 0 833 500 L 1000 500 L 1000 1000 L 0 1000 Z");
                this.planMaskGroup.appendChild(this.planMaskBottom);
                
                
                
                
                
                outerCircleGroup.appendChild(this.planMaskGroup);
                

                let texts = ["N\u2191", "E", "S", "W"];
                for (let i = 0; i < 4; i++) {
                    let textGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    textGroup.setAttribute("transform", "rotate(" + fastToFixed(i * 90, 0) + " 500 500)");
                    {
                        let text = document.createElementNS(Avionics.SVG.NS, "text");
                        text.textContent = texts[i];
                        text.setAttribute("x", "500");
                        text.setAttribute("y", "115");
                        text.setAttribute("fill", "lime");
                        if (i !== 0) {
                            text.setAttribute("font-size", "36");
                        }
                        else {
                            text.setAttribute("font-size", "50");
                        }
                        text.setAttribute("font-family", "BoeingEFIS");
                        text.setAttribute("text-anchor", "middle");
                        text.setAttribute("alignment-baseline", "central");
                        text.setAttribute("transform", "rotate(" + -fastToFixed(i * 90, 0) + " 500 115)");
                        textGroup.appendChild(text);
                        outerCircleGroup.appendChild(textGroup);
                    }
                }
                let outerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                outerCircle.setAttribute("cx", "500");
                outerCircle.setAttribute("cy", "500");
                outerCircle.setAttribute("r", circleRadius.toString());
                outerCircle.setAttribute("fill", "none");
                outerCircle.setAttribute("stroke", "white");
                outerCircle.setAttribute("stroke-width", "4");
                outerCircleGroup.appendChild(outerCircle);
                this.addMapRange(outerCircleGroup, 500, 167, "white", "30", true, 0.5, true);
                this.addMapRange(outerCircleGroup, 500, 833, "white", "30", true, 0.5, true);
            }
            let innerCircleGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(innerCircleGroup);
            {
                let innerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                innerCircle.setAttribute("cx", "500");
                innerCircle.setAttribute("cy", "500");
                innerCircle.setAttribute("r", "166");
                innerCircle.setAttribute("fill", "none");
                innerCircle.setAttribute("stroke", "white");
                innerCircle.setAttribute("stroke-width", "4");
                innerCircleGroup.appendChild(innerCircle);
                this.addMapRange(innerCircleGroup, 500, 334, "white", "30", true, 0.25, true);
                this.addMapRange(innerCircleGroup, 500, 666, "white", "30", true, 0.25, true);
            }
            let rangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
            rangeGroup.setAttribute("id", "RangeGroup");
            rangeGroup.setAttribute("transform", "scale(1.25)");
            {
                let centerX = 245;
                let centerY = 48;
                let textBg = document.createElementNS(Avionics.SVG.NS, "rect");
                textBg.setAttribute("x", (centerX - 40).toString());
                textBg.setAttribute("y", (centerY - 32).toString());
                textBg.setAttribute("width", "80");
                textBg.setAttribute("height", "64");
                textBg.setAttribute("fill", "black");
                textBg.setAttribute("stroke", "white");
                textBg.setAttribute("stroke-width", "2");
                rangeGroup.appendChild(textBg);
                let textTitle = document.createElementNS(Avionics.SVG.NS, "text");
                textTitle.textContent = "RANGE";
                textTitle.setAttribute("x", centerX.toString());
                textTitle.setAttribute("y", (centerY - 15).toString());
                textTitle.setAttribute("fill", "white");
                textTitle.setAttribute("font-size", "25");
                textTitle.setAttribute("font-family", "BoeingEFIS");
                textTitle.setAttribute("text-anchor", "middle");
                textTitle.setAttribute("alignment-baseline", "central");
                rangeGroup.appendChild(textTitle);
                this.addMapRange(rangeGroup, centerX, (centerY + 15), "white", "30", false, 1.0, false);
            }
            this.root.appendChild(rangeGroup);
        }
    }
    constructPlan_AS01B() {
    }
    constructPlan_A320_Neo() {
    }
    constructPlan_CJ4() {
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
    }
    constructRose_B747_8() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("height", "100%");
        this.root.setAttribute("viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        let circleRadius = 360;
        {
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            this.rotatingCircle.setAttribute("id", "RotatingCircle");
            this.root.appendChild(this.rotatingCircle);
            let outerGroup = document.createElementNS(Avionics.SVG.NS, "g");
            outerGroup.setAttribute("id", "outerCircle");
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
                    line.setAttribute("x", "498");
                    line.setAttribute("y", startY.toString());
                    line.setAttribute("width", "4");
                    line.setAttribute("height", length.toString());
                    line.setAttribute("transform", "rotate(" + fastToFixed(i * 5, 0) + " 500 500)");
                    line.setAttribute("fill", "white");
                    outerGroup.appendChild(line);
                }
                for (let i = 0; i < 36; i += 3) {
                    let text = document.createElementNS(Avionics.SVG.NS, "text");
                    text.textContent = fastToFixed(i, 0);
                    text.setAttribute("x", "500");
                    text.setAttribute("y", (500 - circleRadius + 52).toString());
                    text.setAttribute("fill", "white");
                    text.setAttribute("font-size", "32");
                    text.setAttribute("font-family", "BoeingEFIS");
                    text.setAttribute("text-anchor", "middle");
                    text.setAttribute("alignment-baseline", "central");
                    text.setAttribute("transform", "rotate(" + fastToFixed(i * 10, 0) + " 500 500)");
                    outerGroup.appendChild(text);
                }
            }
            this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.courseGroup.setAttribute("id", "CourseInfo");
            this.rotatingCircle.appendChild(this.courseGroup);
            {
                let bearing = document.createElementNS(Avionics.SVG.NS, "g");
                bearing.setAttribute("id", "bearing");
                this.courseGroup.appendChild(bearing);
                {
                    this.bearing1_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                    this.bearing1_Vor.setAttribute("d", "M510 140 L500 130 L490 140 M500 130 L500 230 M520 220 L480 220     M500 770 L500 870   M520 870 L500 860 L480 870");
                    this.bearing1_Vor.setAttribute("stroke", "lime");
                    this.bearing1_Vor.setAttribute("stroke-width", "4");
                    this.bearing1_Vor.setAttribute("fill", "none");
                    this.bearing1_Vor.setAttribute("id", "bearing1_Vor");
                    this.bearing1_Vor.setAttribute("visibility", "hidden");
                    bearing.appendChild(this.bearing1_Vor);
                    this.bearing1_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                    this.bearing1_Adf.setAttribute("d", "M510 140 L500 130 L490 140 M500 130 L500 230 M520 220 L480 220     M500 770 L500 870   M520 870 L500 860 L480 870");
                    this.bearing1_Adf.setAttribute("stroke", "cyan");
                    this.bearing1_Adf.setAttribute("stroke-width", "4");
                    this.bearing1_Adf.setAttribute("fill", "none");
                    this.bearing1_Adf.setAttribute("id", "bearing1_Adf");
                    this.bearing1_Adf.setAttribute("visibility", "hidden");
                    bearing.appendChild(this.bearing1_Adf);
                    this.bearing2_Vor = document.createElementNS(Avionics.SVG.NS, "path");
                    this.bearing2_Vor.setAttribute("d", "M510 140 L500 130 L490 140 L490 220 L470 220 L470 230 L530 230 L530 220 L510 220 L510 140      M500 860 L500 870    M510 865 L510 780 L500 770 L490 780 L490 865     M520 870 L500 860 L480 870 L480 880 L500 870 L520 880 L520 870");
                    this.bearing2_Vor.setAttribute("stroke", "lime");
                    this.bearing2_Vor.setAttribute("stroke-width", "4");
                    this.bearing2_Vor.setAttribute("fill", "none");
                    this.bearing2_Vor.setAttribute("id", "bearing2_Vor");
                    this.bearing2_Vor.setAttribute("visibility", "hidden");
                    bearing.appendChild(this.bearing2_Vor);
                    this.bearing2_Adf = document.createElementNS(Avionics.SVG.NS, "path");
                    this.bearing2_Adf.setAttribute("d", "M510 140 L500 130 L490 140 L490 220 L470 220 L470 230 L530 230 L530 220 L510 220 L510 140      M500 860 L500 870    M510 865 L510 780 L500 770 L490 780 L490 865     M520 870 L500 860 L480 870 L480 880 L500 870 L520 880 L520 870");
                    this.bearing2_Adf.setAttribute("stroke", "cyan");
                    this.bearing2_Adf.setAttribute("stroke-width", "4");
                    this.bearing2_Adf.setAttribute("fill", "none");
                    this.bearing2_Adf.setAttribute("id", "bearing2_Adf");
                    this.bearing2_Adf.setAttribute("visibility", "hidden");
                    bearing.appendChild(this.bearing2_Adf);
                }
                this.course = document.createElementNS(Avionics.SVG.NS, "g");
                this.course.setAttribute("id", "course");
                this.courseGroup.appendChild(this.course);
                {
                    this.courseColor = "";
                    if (this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                        this.courseColor = "#D570FF";
                    }
                    else if (this.navigationMode == Jet_NDCompass_Navigation.VOR) {
                        this.courseColor = "#00ffff";
                    }
                    this.courseTO = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseTO.setAttribute("d", "M497 666 L503 666 L503 696 L523 696 L523 702 L503 702 L503 826 L497 826 L497 702 L477 702 L477 696 L497 696 L497 666 Z");
                    this.courseTO.setAttribute("fill", "none");
                    this.courseTO.setAttribute("transform", "rotate(180 500 500)");
                    this.courseTO.setAttribute("stroke", this.courseColor.toString());
                    this.courseTO.setAttribute("stroke-width", "1");
                    this.course.appendChild(this.courseTO);
                    this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "rect");
                    this.courseDeviation.setAttribute("x", "495");
                    this.courseDeviation.setAttribute("y", "333");
                    this.courseDeviation.setAttribute("width", "10");
                    this.courseDeviation.setAttribute("height", "333");
                    this.courseDeviation.setAttribute("fill", this.courseColor.toString());
                    this.course.appendChild(this.courseDeviation);
                    this.courseFROM = document.createElementNS(Avionics.SVG.NS, "rect");
                    this.courseFROM.setAttribute("x", "497");
                    this.courseFROM.setAttribute("y", "166");
                    this.courseFROM.setAttribute("width", "6");
                    this.courseFROM.setAttribute("height", "166");
                    this.courseFROM.setAttribute("fill", "none");
                    this.courseFROM.setAttribute("transform", "rotate(180 500 500)");
                    this.courseFROM.setAttribute("stroke", this.courseColor.toString());
                    this.courseFROM.setAttribute("stroke-width", "1");
                    this.course.appendChild(this.courseFROM);
                    let circlePosition = [-166, -55, 55, 166];
                    for (let i = 0; i < circlePosition.length; i++) {
                        let CDICircle = document.createElementNS(Avionics.SVG.NS, "circle");
                        CDICircle.setAttribute("cx", (500 + circlePosition[i]).toString());
                        CDICircle.setAttribute("cy", "500");
                        CDICircle.setAttribute("r", "10");
                        CDICircle.setAttribute("stroke", "white");
                        CDICircle.setAttribute("stroke-width", "2");
                        this.course.appendChild(CDICircle);
                    }
                }
                this.bearingCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                this.bearingCircle.setAttribute("cx", "500");
                this.bearingCircle.setAttribute("cy", "500");
                this.bearingCircle.setAttribute("r", "30");
                this.bearingCircle.setAttribute("stroke", "white");
                this.bearingCircle.setAttribute("stroke-width", "0.8");
                this.bearingCircle.setAttribute("fill-opacity", "0");
                this.bearingCircle.setAttribute("visibility", "hidden");
                this.courseGroup.appendChild(this.bearingCircle);
            }
            this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.headingGroup.setAttribute("id", "headingGroup");
            {
                this.headingBug = document.createElementNS(Avionics.SVG.NS, "path");
                this.headingBug.setAttribute("id", "headingBug");
                this.headingBug.setAttribute("d", "M500 " + (500 - circleRadius) + " l -11 -20 l 22 0 z");
                this.headingBug.setAttribute("fill", "none");
                this.headingBug.setAttribute("stroke", "white");
                this.headingGroup.appendChild(this.headingBug);
            }
            this.rotatingCircle.appendChild(this.headingGroup);
            this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.selectedHeadingGroup.setAttribute("id", "selectedHeadingGroup");
            {
                this.selectedHeadingLine = Avionics.SVG.computeDashLine(500, 450, -(circleRadius - 20), 8, 3, "#D570FF");
                this.selectedHeadingLine.setAttribute("id", "selectedHeadingLine");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingLine);
                this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                this.selectedHeadingBug.setAttribute("id", "selectedHeadingBug");
                this.selectedHeadingBug.setAttribute("d", "M500 " + (500 - circleRadius) + " h 22 v -22 h -7 l -15 22 l -15 -22 h -7 v 22 z");
                this.selectedHeadingBug.setAttribute("stroke-width", "3");
                this.selectedHeadingBug.setAttribute("stroke", "#D570FF");
                this.selectedHeadingBug.setAttribute("fill", "none");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
            }
            this.rotatingCircle.appendChild(this.selectedHeadingGroup);
            if (this.navigationMode == Jet_NDCompass_Navigation.NAV || this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.ilsGroup.setAttribute("id", "ILSGroup");
                {
                    let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                    ilsBug.setAttribute("id", "ilsBug");
                    ilsBug.setAttribute("d", "M500 " + (500 - circleRadius) + " l0 -40 M485 " + (500 - circleRadius - 10) + " l30 0");
                    ilsBug.setAttribute("fill", "transparent");
                    ilsBug.setAttribute("stroke", "#FF0CE2");
                    ilsBug.setAttribute("stroke-width", "3");
                    this.ilsGroup.appendChild(ilsBug);
                }
                this.rotatingCircle.appendChild(this.ilsGroup);
            }
            if (this.navigationMode == Jet_NDCompass_Navigation.NAV) {
                this.selectedTrackGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.selectedTrackGroup.setAttribute("id", "selectedTrackGroup");
                {
                    this.selectedTrackLine = Avionics.SVG.computeDashLine(500, 450, -(circleRadius - 50), 15, 3, "#D570FF");
                    this.selectedTrackLine.setAttribute("id", "selectedTrackLine");
                    this.selectedTrackGroup.appendChild(this.selectedTrackLine);
                    this.selectedTrackBug = document.createElementNS(Avionics.SVG.NS, "path");
                    this.selectedTrackBug.setAttribute("id", "selectedTrackBug");
                    this.selectedTrackBug.setAttribute("d", "M500 " + (500 - circleRadius) + " h -30 v 15 l 30 15 l 30 -15 v -15 z");
                    this.selectedTrackBug.setAttribute("stroke", "#D570FF");
                    this.selectedTrackBug.setAttribute("stroke-width", "2");
                    this.selectedTrackGroup.appendChild(this.selectedTrackBug);
                }
                this.rotatingCircle.appendChild(this.selectedTrackGroup);
            }
            this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.trackingGroup.setAttribute("id", "trackingGroup");
            {
                this.trackingLine = document.createElementNS(Avionics.SVG.NS, "path");
                this.trackingLine.setAttribute("id", "trackingLine");
                this.trackingLine.setAttribute("d", "M500 400 v " + (-circleRadius + 100) + "M500 600 v " + (circleRadius - 100));
                this.trackingLine.setAttribute("fill", "transparent");
                this.trackingLine.setAttribute("stroke", "white");
                this.trackingLine.setAttribute("stroke-width", "3");
                this.trackingGroup.appendChild(this.trackingLine);
            }
            this.rotatingCircle.appendChild(this.trackingGroup);
        }
        this.glideSlopeGroup = document.createElementNS(Avionics.SVG.NS, "g");
        this.glideSlopeGroup.setAttribute("id", "GlideSlopeGroup");
        this.glideSlopeGroup.setAttribute("transform", "translate(-20, 0)");
        this.root.appendChild(this.glideSlopeGroup);
        if (this.navigationMode === Jet_NDCompass_Navigation.ILS) {
            for (let i = 0; i < 5; i++) {
                if (i != 2) {
                    let glideSlopeDot = document.createElementNS(Avionics.SVG.NS, "circle");
                    glideSlopeDot.setAttribute("cx", "950");
                    glideSlopeDot.setAttribute("cy", (250 + i * 125).toFixed(0));
                    glideSlopeDot.setAttribute("r", "10");
                    glideSlopeDot.setAttribute("stroke", "white");
                    glideSlopeDot.setAttribute("stroke-width", "2");
                    this.glideSlopeGroup.appendChild(glideSlopeDot);
                }
            }
            let glideSlopeDash = document.createElementNS(Avionics.SVG.NS, "rect");
            glideSlopeDash.setAttribute("x", "935");
            glideSlopeDash.setAttribute("y", "498");
            glideSlopeDash.setAttribute("width", "30");
            glideSlopeDash.setAttribute("height", "4");
            glideSlopeDash.setAttribute("fill", "yellow");
            this.glideSlopeGroup.appendChild(glideSlopeDash);
            this.glideSlopeCursor = document.createElementNS(Avionics.SVG.NS, "path");
            this.glideSlopeCursor.setAttribute("id", "GlideSlopeCursor");
            this.glideSlopeCursor.setAttribute("transform", "translate(" + 950 + " " + 500 + ")");
            this.glideSlopeCursor.setAttribute("d", "M-15 0 L0 -20 L15 0 M-15 0 L0 20 L15 0");
            this.glideSlopeCursor.setAttribute("stroke", "#D570FF");
            this.glideSlopeCursor.setAttribute("stroke-width", "2");
            this.glideSlopeCursor.setAttribute("fill", "none");
            this.glideSlopeGroup.appendChild(this.glideSlopeCursor);
        }
        this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
        this.currentRefGroup.setAttribute("id", "currentRefGroup");
        {
            let centerX = 500;
            let centerY = (500 - circleRadius - 50);
            let rectWidth = 100;
            let rectHeight = 55;
            let textOffset = 10;
            this.currentRefMode = document.createElementNS(Avionics.SVG.NS, "text");
            this.currentRefMode.textContent = "HDG";
            this.currentRefMode.setAttribute("x", (centerX - rectWidth * 0.5 - textOffset).toString());
            this.currentRefMode.setAttribute("y", centerY.toString());
            this.currentRefMode.setAttribute("fill", "lime");
            this.currentRefMode.setAttribute("font-size", "35");
            this.currentRefMode.setAttribute("font-family", "BoeingEFIS");
            this.currentRefMode.setAttribute("text-anchor", "end");
            this.currentRefMode.setAttribute("alignment-baseline", "central");
            this.currentRefGroup.appendChild(this.currentRefMode);
            let rect = document.createElementNS(Avionics.SVG.NS, "rect");
            rect.setAttribute("x", (centerX - rectWidth * 0.5).toString());
            rect.setAttribute("y", (centerY - rectHeight * 0.5).toString());
            rect.setAttribute("width", rectWidth.toString());
            rect.setAttribute("height", rectHeight.toString());
            rect.setAttribute("fill", "black");
            this.currentRefGroup.appendChild(rect);
            let path = document.createElementNS(Avionics.SVG.NS, "path");
            path.setAttribute("d", "M" + (centerX - (rectWidth * 0.5)) + " " + (centerY - (rectHeight * 0.5)) + " l0 " + rectHeight + " l" + rectWidth + " 0 l0 " + (-rectHeight));
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "white");
            path.setAttribute("stroke-width", "2");
            this.currentRefGroup.appendChild(path);
            this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
            this.currentRefValue.textContent = "266";
            this.currentRefValue.setAttribute("x", centerX.toString());
            this.currentRefValue.setAttribute("y", centerY.toString());
            this.currentRefValue.setAttribute("fill", "white");
            this.currentRefValue.setAttribute("font-size", "45");
            this.currentRefValue.setAttribute("font-family", "BoeingEFIS");
            this.currentRefValue.setAttribute("text-anchor", "middle");
            this.currentRefValue.setAttribute("alignment-baseline", "central");
            this.currentRefGroup.appendChild(this.currentRefValue);
            this.currentRefType = document.createElementNS(Avionics.SVG.NS, "text");
            this.currentRefType.textContent = "MAG";
            this.currentRefType.setAttribute("x", (centerX + rectWidth * 0.5 + textOffset).toString());
            this.currentRefType.setAttribute("y", centerY.toString());
            this.currentRefType.setAttribute("fill", "lime");
            this.currentRefType.setAttribute("font-size", "35");
            this.currentRefType.setAttribute("font-family", "BoeingEFIS");
            this.currentRefType.setAttribute("text-anchor", "start");
            this.currentRefType.setAttribute("alignment-baseline", "central");
            this.currentRefGroup.appendChild(this.currentRefType);
        }
        this.root.appendChild(this.currentRefGroup);
        let rangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
        rangeGroup.setAttribute("id", "RangeGroup");
        rangeGroup.setAttribute("transform", "scale(1.25)");
        {
            let centerX = 245;
            let centerY = 35;
            let textBg = document.createElementNS(Avionics.SVG.NS, "rect");
            textBg.setAttribute("x", (centerX - 40).toString());
            textBg.setAttribute("y", (centerY - 32).toString());
            textBg.setAttribute("width", "80");
            textBg.setAttribute("height", "64");
            textBg.setAttribute("fill", "black");
            textBg.setAttribute("stroke", "white");
            textBg.setAttribute("stroke-width", "2");
            rangeGroup.appendChild(textBg);
            let textTitle = document.createElementNS(Avionics.SVG.NS, "text");
            textTitle.textContent = "RANGE";
            textTitle.setAttribute("x", centerX.toString());
            textTitle.setAttribute("y", (centerY - 15).toString());
            textTitle.setAttribute("fill", "white");
            textTitle.setAttribute("font-size", "25");
            textTitle.setAttribute("font-family", "BoeingEFIS");
            textTitle.setAttribute("text-anchor", "middle");
            textTitle.setAttribute("alignment-baseline", "central");
            rangeGroup.appendChild(textTitle);
            this.addMapRange(rangeGroup, centerX, (centerY + 15), "white", "30", false, 1.0, false);
        }
        this.root.appendChild(rangeGroup);
    }
    constructRose_AS01B() {
    }
    constructRose_CJ4() {
    }
}
customElements.define("jet-mfd-nd-compass", Jet_MFD_NDCompass);
//# sourceMappingURL=NDCompass.js.map