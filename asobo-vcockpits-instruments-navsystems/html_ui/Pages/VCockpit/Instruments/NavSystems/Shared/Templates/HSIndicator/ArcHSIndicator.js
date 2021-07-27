class ArcHSIIndicator extends HSIndicator {
    createSVG() {
        Utils.RemoveAllChildren(this);
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "-28 -15 156 116");
        this.appendChild(this.root);
        {
            {
                let arcSize = 55;
                let arcRadius = 77.5;
                let arcWidth = 5;
                let beginPointHalfUnitSize = (arcSize / 2) / arcRadius;
                let beginPointTopX = 50 - Math.sin(beginPointHalfUnitSize) * (arcRadius + arcWidth / 2);
                let beginPointBotX = 50 - Math.sin(beginPointHalfUnitSize) * (arcRadius - arcWidth / 2);
                let endPointTopX = 50 + Math.sin(beginPointHalfUnitSize) * (arcRadius + arcWidth / 2);
                let endPointBotX = 50 + Math.sin(beginPointHalfUnitSize) * (arcRadius - arcWidth / 2);
                let pointTopY = 120 - Math.cos(beginPointHalfUnitSize) * (arcRadius + arcWidth / 2);
                let pointBotY = 120 - Math.cos(beginPointHalfUnitSize) * (arcRadius - arcWidth / 2);
                let turnRateBackground = document.createElementNS(Avionics.SVG.NS, "path");
                let path = "M" + beginPointBotX + " " + pointBotY + "A " + (arcRadius - arcWidth / 2) + " " + (arcRadius - arcWidth / 2) + " 0 0 1 " + endPointBotX + " " + pointBotY;
                path += "L" + endPointTopX + " " + pointTopY + "A " + (arcRadius + arcWidth / 2) + " " + (arcRadius + arcWidth / 2) + " 0 0 0 " + beginPointTopX + " " + pointTopY;
                diffAndSetAttribute(turnRateBackground, "d", path);
                diffAndSetAttribute(turnRateBackground, "fill", "#1a1d21");
                diffAndSetAttribute(turnRateBackground, "fill-opacity", "0.25");
                this.root.appendChild(turnRateBackground);
                let lines = [-18, -9, 9, 18];
                for (let i = 0; i < lines.length; i++) {
                    let line = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(line, "x", "49.5");
                    diffAndSetAttribute(line, "y", (45 - arcWidth) + '');
                    diffAndSetAttribute(line, "width", "1");
                    diffAndSetAttribute(line, "height", arcWidth + '');
                    diffAndSetAttribute(line, "transform", "rotate(" + lines[i] + " 50 120)");
                    diffAndSetAttribute(line, "fill", "white");
                    this.root.appendChild(line);
                }
            }
            {
                let turnRateArc = document.createElementNS(Avionics.SVG.NS, "path");
                this.turnRateArc = turnRateArc;
                diffAndSetAttribute(turnRateArc, "fill", "#d12bc7");
                this.root.appendChild(turnRateArc);
            }
        }
        {
            this.backgroundCircle = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(this.backgroundCircle);
            {
                let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(circle, "cx", "50");
                diffAndSetAttribute(circle, "cy", "120");
                diffAndSetAttribute(circle, "r", "75");
                diffAndSetAttribute(circle, "fill", "#1a1d21");
                diffAndSetAttribute(circle, "fill-opacity", "0.25");
                this.backgroundCircle.appendChild(circle);
            }
            {
                let angle = 0;
                for (let i = 0; i < 72; i++) {
                    let line = document.createElementNS(Avionics.SVG.NS, "rect");
                    let length = i % 2 == 0 ? 4 : 2;
                    diffAndSetAttribute(line, "x", "49.5");
                    diffAndSetAttribute(line, "y", "45");
                    diffAndSetAttribute(line, "width", "1");
                    diffAndSetAttribute(line, "height", length + '');
                    diffAndSetAttribute(line, "transform", "rotate(" + ((-angle / Math.PI) * 180 + 180) + " 50 120)");
                    diffAndSetAttribute(line, "fill", "white");
                    angle += (2 * Math.PI) / 72;
                    this.backgroundCircle.appendChild(line);
                }
            }
            {
                let texts = ["N", "3", "6", "E", "12", "15", "S", "21", "24", "W", "30", "33"];
                let angle = 0;
                for (let i = 0; i < texts.length; i++) {
                    let text = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(text, texts[i]);
                    diffAndSetAttribute(text, "x", "50");
                    diffAndSetAttribute(text, "y", (i % 3) == 0 ? "59" : "56");
                    diffAndSetAttribute(text, "fill", "white");
                    diffAndSetAttribute(text, "font-size", (i % 3) == 0 ? "18" : "10");
                    diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(text, "text-anchor", "middle");
                    diffAndSetAttribute(text, "alignment-baseline", "central");
                    diffAndSetAttribute(text, "transform", "rotate(" + angle + " 50 120)");
                    angle += 360 / texts.length;
                    this.backgroundCircle.appendChild(text);
                }
            }
            {
                this.headingBug = document.createElementNS(Avionics.SVG.NS, "polygon");
                diffAndSetAttribute(this.headingBug, "points", "46,45 47,45 50,49 53,45 54,45 54,50 46,50");
                diffAndSetAttribute(this.headingBug, "fill", "aqua");
                this.backgroundCircle.appendChild(this.headingBug);
            }
        }
        {
            this.currentTrackIndicator = document.createElementNS(Avionics.SVG.NS, "polygon");
            diffAndSetAttribute(this.currentTrackIndicator, "points", "50,41 52,45 50,49 48,45");
            diffAndSetAttribute(this.currentTrackIndicator, "fill", "#d12bc7");
            this.backgroundCircle.appendChild(this.currentTrackIndicator);
        }
        {
            this.course = document.createElementNS(Avionics.SVG.NS, "g");
            this.backgroundCircle.appendChild(this.course);
            {
                this.beginArrow = document.createElementNS(Avionics.SVG.NS, "polygon");
                diffAndSetAttribute(this.beginArrow, "points", "51,192 49,192 49,60 45,60 50,49 55,60 51,60");
                diffAndSetAttribute(this.beginArrow, "fill", "#d12bc7");
                this.course.appendChild(this.beginArrow);
            }
        }
        {
            let topTriangle = document.createElementNS(Avionics.SVG.NS, "polygon");
            diffAndSetAttribute(topTriangle, "points", "46,42 54,42 50,48");
            diffAndSetAttribute(topTriangle, "fill", "white");
            diffAndSetAttribute(topTriangle, "stroke", "black");
            this.root.appendChild(topTriangle);
        }
        {
            let bearingRectangle = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(bearingRectangle, "x", "35");
            diffAndSetAttribute(bearingRectangle, "y", "30");
            diffAndSetAttribute(bearingRectangle, "height", "12");
            diffAndSetAttribute(bearingRectangle, "width", "30");
            diffAndSetAttribute(bearingRectangle, "fill", "#1a1d21");
            this.root.appendChild(bearingRectangle);
            let bearingText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(bearingText, "fill", "white");
            diffAndSetAttribute(bearingText, "text-anchor", "middle");
            diffAndSetAttribute(bearingText, "x", "50");
            diffAndSetAttribute(bearingText, "y", "40");
            diffAndSetAttribute(bearingText, "font-size", "11");
            diffAndSetAttribute(bearingText, "font-family", "Roboto-Bold");
            this.bearingText = bearingText;
            this.root.appendChild(bearingText);
        }
        if (this.displayStyle == HSIndicatorDisplayType.HUD_Simplified)
            return;
        {
            let headingRectangle = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(headingRectangle, "x", "-28");
            diffAndSetAttribute(headingRectangle, "y", "48");
            diffAndSetAttribute(headingRectangle, "height", "8");
            diffAndSetAttribute(headingRectangle, "width", "36");
            diffAndSetAttribute(headingRectangle, "fill", "#1a1d21");
            diffAndSetAttribute(headingRectangle, "fill-opacity", "1");
            this.root.appendChild(headingRectangle);
            let headingLeftText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(headingLeftText, "HDG");
            diffAndSetAttribute(headingLeftText, "fill", "white");
            diffAndSetAttribute(headingLeftText, "x", "-26");
            diffAndSetAttribute(headingLeftText, "y", "54.4");
            diffAndSetAttribute(headingLeftText, "font-size", "7");
            diffAndSetAttribute(headingLeftText, "font-family", "Roboto");
            this.root.appendChild(headingLeftText);
            let headingValue = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(headingValue, "fill", "#36c8d2");
            diffAndSetAttribute(headingValue, "x", "-10");
            diffAndSetAttribute(headingValue, "y", "54.4");
            diffAndSetAttribute(headingValue, "font-size", "7");
            diffAndSetAttribute(headingValue, "font-family", "Roboto");
            this.headingText = headingValue;
            this.root.appendChild(headingValue);
        }
        {
            let courseRectangle = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(courseRectangle, "x", "92");
            diffAndSetAttribute(courseRectangle, "y", "48");
            diffAndSetAttribute(courseRectangle, "height", "8");
            diffAndSetAttribute(courseRectangle, "width", "36");
            diffAndSetAttribute(courseRectangle, "fill", "#1a1d21");
            this.root.appendChild(courseRectangle);
            let courseLeftText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(courseLeftText, "CRS");
            diffAndSetAttribute(courseLeftText, "fill", "white");
            diffAndSetAttribute(courseLeftText, "x", "94");
            diffAndSetAttribute(courseLeftText, "y", "54.4");
            diffAndSetAttribute(courseLeftText, "font-size", "7");
            diffAndSetAttribute(courseLeftText, "font-family", "Roboto");
            this.root.appendChild(courseLeftText);
            let courseValue = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(courseValue, "fill", "#d12bc7");
            diffAndSetAttribute(courseValue, "x", "110");
            diffAndSetAttribute(courseValue, "y", "54.4");
            diffAndSetAttribute(courseValue, "font-size", "7");
            diffAndSetAttribute(courseValue, "font-family", "Roboto");
            this.courseText = courseValue;
            this.root.appendChild(courseValue);
        }
        {
            this.navSourceBg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.navSourceBg, "fill", "#1a1d21");
            diffAndSetAttribute(this.navSourceBg, "fill-opacity", "1");
            diffAndSetAttribute(this.navSourceBg, "x", "27");
            diffAndSetAttribute(this.navSourceBg, "y", "74.5");
            diffAndSetAttribute(this.navSourceBg, "height", "7");
            diffAndSetAttribute(this.navSourceBg, "width", "16");
            this.root.appendChild(this.navSourceBg);
            this.navSource = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.navSource, "GPS");
            diffAndSetAttribute(this.navSource, "fill", "#d12bc7");
            diffAndSetAttribute(this.navSource, "x", "35");
            diffAndSetAttribute(this.navSource, "y", "80");
            diffAndSetAttribute(this.navSource, "font-size", "6");
            diffAndSetAttribute(this.navSource, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.navSource, "text-anchor", "middle");
            this.root.appendChild(this.navSource);
            this.flightPhaseBg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.flightPhaseBg, "fill", "#1a1d21");
            diffAndSetAttribute(this.flightPhaseBg, "fill-opacity", "1");
            diffAndSetAttribute(this.flightPhaseBg, "x", "56");
            diffAndSetAttribute(this.flightPhaseBg, "y", "74.5");
            diffAndSetAttribute(this.flightPhaseBg, "height", "7");
            diffAndSetAttribute(this.flightPhaseBg, "width", "18");
            this.root.appendChild(this.flightPhaseBg);
            let flightPhase = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(flightPhase, "TERM");
            diffAndSetAttribute(flightPhase, "fill", "#d12bc7");
            diffAndSetAttribute(flightPhase, "x", "65");
            diffAndSetAttribute(flightPhase, "y", "80");
            diffAndSetAttribute(flightPhase, "font-size", "6");
            diffAndSetAttribute(flightPhase, "font-family", "Roboto-Bold");
            diffAndSetAttribute(flightPhase, "text-anchor", "middle");
            this.flightPhase = flightPhase;
            this.root.appendChild(flightPhase);
        }
        {
            let cdiBackground = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(cdiBackground, "x", "10");
            diffAndSetAttribute(cdiBackground, "y", "90");
            diffAndSetAttribute(cdiBackground, "width", "80");
            diffAndSetAttribute(cdiBackground, "height", "15");
            diffAndSetAttribute(cdiBackground, "fill", "#1a1d21");
            diffAndSetAttribute(cdiBackground, "stroke", "white");
            diffAndSetAttribute(cdiBackground, "stroke-width", "1");
            this.root.appendChild(cdiBackground);
            let circlePosition = [-30, -15, 15, 30];
            for (let i = 0; i < circlePosition.length; i++) {
                let CDICircle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(CDICircle, "cx", (50 + circlePosition[i]) + '');
                diffAndSetAttribute(CDICircle, "cy", "96");
                diffAndSetAttribute(CDICircle, "r", "1.5");
                diffAndSetAttribute(CDICircle, "stroke", "white");
                diffAndSetAttribute(CDICircle, "stroke-width", "0.75");
                diffAndSetAttribute(CDICircle, "fill-opacity", "0");
                this.root.appendChild(CDICircle);
            }
            this.cdiCentralLine = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.cdiCentralLine, "x", "49.75");
            diffAndSetAttribute(this.cdiCentralLine, "y", "90");
            diffAndSetAttribute(this.cdiCentralLine, "width", "0.5");
            diffAndSetAttribute(this.cdiCentralLine, "height", "15");
            diffAndSetAttribute(this.cdiCentralLine, "fill", "white");
            this.root.appendChild(this.cdiCentralLine);
            {
                let CDISvg = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(CDISvg, "x", "10");
                diffAndSetAttribute(CDISvg, "y", "90");
                diffAndSetAttribute(CDISvg, "width", "80");
                diffAndSetAttribute(CDISvg, "height", "15");
                diffAndSetAttribute(CDISvg, "viewBox", "10 90 80 15");
                this.root.appendChild(CDISvg);
                this.CDI = document.createElementNS(Avionics.SVG.NS, "g");
                CDISvg.appendChild(this.CDI);
                this.toIndicator = document.createElementNS(Avionics.SVG.NS, "polygon");
                diffAndSetAttribute(this.toIndicator, "points", "50,94 46,98 54,98");
                diffAndSetAttribute(this.toIndicator, "fill", "#d12bc7");
                this.CDI.appendChild(this.toIndicator);
                this.fromIndicator = document.createElementNS(Avionics.SVG.NS, "polygon");
                diffAndSetAttribute(this.fromIndicator, "points", "50,98 46,94 54,94");
                diffAndSetAttribute(this.fromIndicator, "fill", "#d12bc7");
                this.CDI.appendChild(this.fromIndicator);
            }
            this.crossTrackError = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.crossTrackError, "3.15NM");
            diffAndSetAttribute(this.crossTrackError, "fill", "#d12bc7");
            diffAndSetAttribute(this.crossTrackError, "x", "50");
            diffAndSetAttribute(this.crossTrackError, "y", "99");
            diffAndSetAttribute(this.crossTrackError, "font-size", "6");
            diffAndSetAttribute(this.crossTrackError, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.crossTrackError, "text-anchor", "middle");
            this.root.appendChild(this.crossTrackError);
        }
        {
            {
                this.dme = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.dme, "display", "none");
                this.root.appendChild(this.dme);
                let dmeZone = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(dmeZone, "x", "-15");
                diffAndSetAttribute(dmeZone, "y", "20");
                diffAndSetAttribute(dmeZone, "height", "26");
                diffAndSetAttribute(dmeZone, "width", "36");
                diffAndSetAttribute(dmeZone, "fill", "#1a1d21");
                diffAndSetAttribute(dmeZone, "fill-opacity", "1");
                this.dme.appendChild(dmeZone);
                let dme1 = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(dme1, "DME");
                diffAndSetAttribute(dme1, "fill", "white");
                diffAndSetAttribute(dme1, "x", "-13");
                diffAndSetAttribute(dme1, "y", "26");
                diffAndSetAttribute(dme1, "font-size", "6");
                diffAndSetAttribute(dme1, "font-family", "Roboto-Bold");
                diffAndSetAttribute(dme1, "text-anchor", "start");
                this.dme.appendChild(dme1);
                this.dmeSource = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.dmeSource, "NAV1");
                diffAndSetAttribute(this.dmeSource, "fill", "#36c8d2");
                diffAndSetAttribute(this.dmeSource, "x", "-13");
                diffAndSetAttribute(this.dmeSource, "y", "32");
                diffAndSetAttribute(this.dmeSource, "font-size", "6");
                diffAndSetAttribute(this.dmeSource, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.dmeSource, "text-anchor", "start");
                this.dme.appendChild(this.dmeSource);
                this.dmeIdent = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.dmeIdent, "117.80");
                diffAndSetAttribute(this.dmeIdent, "fill", "#36c8d2");
                diffAndSetAttribute(this.dmeIdent, "x", "-13");
                diffAndSetAttribute(this.dmeIdent, "y", "38");
                diffAndSetAttribute(this.dmeIdent, "font-size", "6");
                diffAndSetAttribute(this.dmeIdent, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.dmeIdent, "text-anchor", "start");
                this.dme.appendChild(this.dmeIdent);
                this.dmeDistance = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.dmeDistance, "97.7NM");
                diffAndSetAttribute(this.dmeDistance, "fill", "white");
                diffAndSetAttribute(this.dmeDistance, "x", "-13");
                diffAndSetAttribute(this.dmeDistance, "y", "44");
                diffAndSetAttribute(this.dmeDistance, "font-size", "6");
                diffAndSetAttribute(this.dmeDistance, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.dmeDistance, "text-anchor", "start");
                this.dme.appendChild(this.dmeDistance);
            }
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "toggle_dme":
                this.isDmeDisplayed = !this.isDmeDisplayed;
                if (this.dme) {
                    if (this.isDmeDisplayed) {
                        diffAndSetAttribute(this.dme, "display", "inherit");
                    }
                    else {
                        diffAndSetAttribute(this.dme, "display", "none");
                    }
                }
                break;
        }
        if (oldValue == newValue)
            return;
        switch (name) {
            case "rotation":
                diffAndSetAttribute(this.backgroundCircle, "transform", "rotate(" + (-newValue) + " 50 120)");
                if (this.bearingText) {
                    let brg = fastToFixed(parseFloat(newValue), 0);
                    diffAndSetText(this.bearingText, "000".slice(brg.length) + brg + "°");
                }
                break;
            case "heading_bug_rotation":
                diffAndSetAttribute(this.headingBug, "transform", "rotate(" + (newValue) + ", 50, 120)");
                if (this.headingText) {
                    let headingValue = parseFloat(newValue);
                    if (headingValue == 0) {
                        headingValue = 360;
                    }
                    let hdg = fastToFixed(headingValue, 0);
                    diffAndSetText(this.headingText, "000".slice(hdg.length) + hdg + "°");
                }
                break;
            case "course":
                if (this.course) {
                    diffAndSetAttribute(this.course, "transform", "rotate(" + (newValue) + ", 50, 120)");
                    if (this.courseText) {
                        let crs = fastToFixed(parseFloat(newValue), 0);
                        diffAndSetText(this.courseText, "000".slice(crs.length) + crs + "°");
                    }
                }
                break;
            case "course_deviation":
                if (this.CDI) {
                    let deviation = parseFloat(newValue);
                    if (this.sourceIsGps) {
                        this.crossTrackGoal = (Math.min(Math.max(deviation, -this.crosstrackFullError * 4 / 3), this.crosstrackFullError * 4 / 3) * (30 / this.crosstrackFullError));
                        if (Math.abs(deviation) < this.crosstrackFullError) {
                            diffAndSetAttribute(this.crossTrackError, "visibility", "hidden");
                            diffAndSetAttribute(this.cdiCentralLine, "visibility", "visible");
                        }
                        else {
                            diffAndSetAttribute(this.crossTrackError, "visibility", "visible");
                            diffAndSetAttribute(this.cdiCentralLine, "visibility", "hidden");
                            diffAndSetText(this.crossTrackError, fastToFixed(Math.abs(deviation), 1) + "NM");
                        }
                    }
                    else {
                        diffAndSetAttribute(this.crossTrackError, "visibility", "hidden");
                        this.crossTrackGoal = (Math.min(Math.max(deviation, -4 / 3), 4 / 3) * 30);
                    }
                }
                break;
            case "turn_rate":
                {
                    if (this.turnRateArc) {
                        let value = Math.max(Math.min(parseFloat(newValue), 4), -4);
                        let arcAngle = 6 * value * Math.PI / 180;
                        let arcRadius = 78;
                        let arcWidth = 2;
                        let arrowWidth = 6;
                        let beginPointTopX = 50;
                        let beginPointBotX = 50;
                        let beginPointTopY = 120 - arcRadius - (arcWidth / 2);
                        let beginPointBotY = 120 - arcRadius + (arcWidth / 2);
                        let endPointTopX = 50 + Math.sin(arcAngle) * (arcRadius + arcWidth / 2);
                        let endPointBotX = 50 + Math.sin(arcAngle) * (arcRadius - arcWidth / 2);
                        let endPointTopY = 120 - Math.cos(arcAngle) * (arcRadius + arcWidth / 2);
                        let endPointBotY = 120 - Math.cos(arcAngle) * (arcRadius - arcWidth / 2);
                        let path;
                        if (value == 4 || value == -4) {
                            let endPointArrowTopX = 50 + Math.sin(arcAngle) * (arcRadius + arrowWidth / 2);
                            let endPointArrowBotX = 50 + Math.sin(arcAngle) * (arcRadius - arrowWidth / 2);
                            let endPointArrowTopY = 120 - Math.cos(arcAngle) * (arcRadius + arrowWidth / 2);
                            let endPointArrowBotY = 120 - Math.cos(arcAngle) * (arcRadius - arrowWidth / 2);
                            let endPointArrowEndX = 50 + Math.sin(arcAngle + (value > 0 ? 0.1 : -0.1)) * (arcRadius);
                            let endPointArrowEndY = 120 - Math.cos(arcAngle + (value > 0 ? 0.1 : -0.1)) * (arcRadius);
                            path = "M" + beginPointBotX + " " + beginPointBotY + "A " + (arcRadius - arcWidth / 2) + " " + (arcRadius - arcWidth / 2) + " 0 0 " + (arcAngle > 0 ? "1" : "0") + " " + endPointBotX + " " + endPointBotY;
                            path += "L" + endPointArrowBotX + " " + endPointArrowBotY + " L" + endPointArrowEndX + " " + endPointArrowEndY + " L" + endPointArrowTopX + " " + endPointArrowTopY;
                            path += "L" + endPointTopX + " " + endPointTopY + "A " + (arcRadius + arcWidth / 2) + " " + (arcRadius + arcWidth / 2) + " 0 0 " + (arcAngle > 0 ? "0" : "1") + " " + beginPointTopX + " " + beginPointTopY;
                        }
                        else {
                            path = "M" + beginPointBotX + " " + beginPointBotY + "A " + (arcRadius - arcWidth / 2) + " " + (arcRadius - arcWidth / 2) + " 0 0 " + (arcAngle > 0 ? "1" : "0") + " " + endPointBotX + " " + endPointBotY;
                            path += "L" + endPointTopX + " " + endPointTopY + "A " + (arcRadius + arcWidth / 2) + " " + (arcRadius + arcWidth / 2) + " 0 0 " + (arcAngle > 0 ? "0" : "1") + " " + beginPointTopX + " " + beginPointTopY;
                        }
                        diffAndSetAttribute(this.turnRateArc, "d", path);
                    }
                }
                break;
            case "nav_source":
                if (this.navSource) {
                    diffAndSetText(this.navSource, newValue);
                    switch (newValue) {
                        case "GPS":
                            this.sourceIsGps = true;
                            diffAndSetAttribute(this.beginArrow, "fill", "#d12bc7");
                            diffAndSetAttribute(this.beginArrow, "fill-opacity", "1");
                            diffAndSetAttribute(this.beginArrow, "stroke", "");
                            diffAndSetAttribute(this.navSource, "fill", "#d12bc7");
                            diffAndSetAttribute(this.flightPhase, "visibility", "visible");
                            diffAndSetAttribute(this.flightPhaseBg, "visibility", "visible");
                            diffAndSetAttribute(this.toIndicator, "fill", "#d12bc7");
                            diffAndSetAttribute(this.fromIndicator, "fill", "#d12bc7");
                            break;
                        case "VOR1":
                        case "LOC1":
                            this.sourceIsGps = false;
                            diffAndSetAttribute(this.beginArrow, "fill", "#10c210");
                            diffAndSetAttribute(this.beginArrow, "fill-opacity", "1");
                            diffAndSetAttribute(this.beginArrow, "stroke", "");
                            diffAndSetAttribute(this.navSource, "fill", "#10c210");
                            diffAndSetAttribute(this.flightPhase, "visibility", "hidden");
                            diffAndSetAttribute(this.flightPhaseBg, "visibility", "hidden");
                            diffAndSetAttribute(this.toIndicator, "fill", "#10c210");
                            diffAndSetAttribute(this.fromIndicator, "fill", "#10c210");
                            break;
                        case "VOR2":
                        case "LOC2":
                            this.sourceIsGps = false;
                            diffAndSetAttribute(this.beginArrow, "fill-opacity", "0");
                            diffAndSetAttribute(this.beginArrow, "stroke", "#10c210");
                            diffAndSetAttribute(this.navSource, "fill", "#10c210");
                            diffAndSetAttribute(this.flightPhase, "visibility", "hidden");
                            diffAndSetAttribute(this.flightPhaseBg, "visibility", "hidden");
                            diffAndSetAttribute(this.toIndicator, "fill", "#10c210");
                            diffAndSetAttribute(this.fromIndicator, "fill", "#10c210");
                            break;
                    }
                }
                break;
            case "flight_phase":
                if (this.flightPhase) {
                    diffAndSetText(this.flightPhase, newValue);
                }
                break;
            case "crosstrack_full_error":
                this.crosstrackFullError = parseFloat(newValue);
                break;
            case "show_dme":
                this.isDmeDisplayed = newValue == "true";
                if (this.dme) {
                    if (this.isDmeDisplayed) {
                        diffAndSetAttribute(this.dme, "display", "inherit");
                    }
                    else {
                        diffAndSetAttribute(this.dme, "display", "none");
                    }
                }
                break;
            case "dme_source":
                if (this.dmeSource)
                    diffAndSetText(this.dmeSource, newValue);
                break;
            case "dme_ident":
                if (this.dmeIdent)
                    diffAndSetText(this.dmeIdent, newValue);
                break;
            case "dme_distance":
                if (this.dmeDistance)
                    diffAndSetText(this.dmeDistance, (newValue == "" ? "" : fastToFixed(parseFloat(newValue), 1) + " NM"));
                break;
            case "to_from":
                if (this.toIndicator && this.fromIndicator) {
                    switch (newValue) {
                        case "0":
                            diffAndSetAttribute(this.toIndicator, "display", "none");
                            diffAndSetAttribute(this.fromIndicator, "display", "none");
                            break;
                        case "1":
                            diffAndSetAttribute(this.toIndicator, "display", "inherit");
                            diffAndSetAttribute(this.fromIndicator, "display", "none");
                            break;
                        case "2":
                            diffAndSetAttribute(this.toIndicator, "display", "none");
                            diffAndSetAttribute(this.fromIndicator, "display", "inherit");
                            break;
                    }
                }
                break;
            case "current_track":
                if (this.currentTrackIndicator)
                    diffAndSetAttribute(this.currentTrackIndicator, "transform", "rotate(" + (newValue) + ", 50, 120)");
                break;
        }
    }
    onEvent(_event) {
    }
    update(_deltaTime) {
        super.update(_deltaTime);
        if (SimVar.GetSimVarValue("L:PFD_DME_Displayed", "number") != 0) {
            diffAndSetAttribute(this, "show_dme", "true");
        }
        else {
            diffAndSetAttribute(this, "show_dme", "false");
        }
    }
}
customElements.define('glasscockpit-hsi-arc', ArcHSIIndicator);
//# sourceMappingURL=ArcHSIndicator.js.map