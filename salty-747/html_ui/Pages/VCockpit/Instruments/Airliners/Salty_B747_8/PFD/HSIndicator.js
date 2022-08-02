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
        const width = 1300;
        const height = 1300;

        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        this.rootSVG.setAttribute("id", "ViewBox");
        this.rootSVG.setAttribute("viewBox", "-293 296 " + width + " " + height);
        {
            this.circleBg = document.createElementNS(Avionics.SVG.NS, "path");
            this.circleBg.setAttribute("d", "M142 785, h412, c -103 -140, -306 -140, -412 0 Z");
            this.circleBg.setAttribute("fill", "#343B51");
            this.rootSVG.appendChild(this.circleBg);
        }
        {
            const headingPointer = document.createElementNS(Avionics.SVG.NS, "path");
            headingPointer.setAttribute("d", "M349 677 l-11 -20 l22 0 Z");
            headingPointer.setAttribute("fill", "none");
            headingPointer.setAttribute("stroke", "white");
            headingPointer.setAttribute("stroke-width", "3");
            headingPointer.setAttribute("stroke-linejoin", "round");
            this.rootSVG.appendChild(headingPointer);
        }
        {
            this.rotatingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.rotatingSubGroup = document.createElementNS(Avionics.SVG.NS, "g");
            for (let i = 0; i < 36; i++) {
                const rotation = (i) * 10;
                const isBigHeading = rotation % 3 === 0 ? true : false;
                const line = document.createElementNS(Avionics.SVG.NS, "path");
                line.setAttribute("d", `M349 680.5, v12`);
                line.setAttribute("stroke", "white");
                line.setAttribute("stroke-width", "2");
                line.setAttribute("class", `${i}`);
                this.rotatingGroup.appendChild(line);

                const shortLine = document.createElementNS(Avionics.SVG.NS, "path");
                shortLine.setAttribute("d", `M349 680.5, v8`);
                shortLine.setAttribute("stroke", "white");
                shortLine.setAttribute("stroke-width", "2");
                shortLine.setAttribute("class", `${i + 0.5}`);
                this.rotatingGroup.appendChild(shortLine);

                const text = document.createElementNS(Avionics.SVG.NS, "text");
                const fontSize = isBigHeading ? 30 : 22;
                text.textContent = (rotation / 10).toString();
                text.setAttribute("x", "349");
                text.setAttribute("y", `${isBigHeading ? 708 : 705}`);
                text.setAttribute("fill", "white");
                text.setAttribute("font-size", fontSize.toString());
                text.setAttribute("font-family", "BoeingEFIS");
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("alignment-baseline", "central");
                text.setAttribute("class", `${i}`);                    
                this.rotatingGroup.appendChild(text);
            }
            this.rootSVG.appendChild(this.rotatingGroup);      
        }
        {
            this.hdgBug = document.createElementNS(Avionics.SVG.NS, "path");
            this.hdgBug.setAttribute("d", "M 335 679, h28, v-14, h-4, l-7 14, h-6, l-7 -14, h-4, Z");
            this.hdgBug.setAttribute("fill", "none");
            this.hdgBug.setAttribute("stroke", "#D570FF");
            this.hdgBug.setAttribute("stroke-width", "3px");
            this.rootSVG.appendChild(this.hdgBug);

            this.hdgBugText = document.createElementNS(Avionics.SVG.NS, "text");
            this.hdgBugText.setAttribute("x", "305");;
            this.hdgBugText.setAttribute("y", "777");
            this.hdgBugText.setAttribute("fill", "#D570FF");
            this.hdgBugText.textContent = "---";
            this.hdgBugText.setAttribute("font-size", "30");
            this.hdgBugText.setAttribute("text-anchor", "end");
            this.rootSVG.appendChild(this.hdgBugText);

            this.hdgBugTextRef = document.createElementNS(Avionics.SVG.NS, "text");
            this.hdgBugTextRef.setAttribute("x", "319");;
            this.hdgBugTextRef.setAttribute("y", "777");
            this.hdgBugTextRef.setAttribute("fill", "#D570FF");
            this.hdgBugTextRef.textContent = "H";
            this.hdgBugTextRef.setAttribute("font-size", "22");
            this.hdgBugTextRef.setAttribute("text-anchor", "end");
            this.rootSVG.appendChild(this.hdgBugTextRef);

            this.hdgModeText = document.createElementNS(Avionics.SVG.NS, "text");
            this.hdgModeText.setAttribute("x", "435");
            this.hdgModeText.setAttribute("y", "777");
            this.hdgModeText.setAttribute("fill", "lime");
            this.hdgModeText.textContent = "MAG";
            this.hdgModeText.setAttribute("font-size", "22");
            this.hdgModeText.setAttribute("text-anchor", "end");
            this.rootSVG.appendChild(this.hdgModeText);
        }
        {
            this.trkLine = document.createElementNS(Avionics.SVG.NS, "path");
            this.trkLine.setAttribute("d", "M349 680, v150, M343 751, h12 ");
            this.trkLine.setAttribute("fill", "none");
            this.trkLine.setAttribute("stroke", "white");
            this.trkLine.setAttribute("stroke-width", "3px");
            this.rootSVG.appendChild(this.trkLine);
        }
        {
            if (!this.minimumReferenceModeText) {
                this.minimumReferenceModeText = document.createElementNS(Avionics.SVG.NS, "text");
            }
            this.minimumReferenceModeText.textContent = "BARO";
            this.minimumReferenceModeText.setAttribute("x", "525");
            this.minimumReferenceModeText.setAttribute("y", "655");
            this.minimumReferenceModeText.setAttribute("fill", "lime");
            this.minimumReferenceModeText.setAttribute("font-size", "22");
            this.minimumReferenceModeText.setAttribute("font-family", "BoeingEFIS");
            this.minimumReferenceModeText.setAttribute("text-anchor", "end");
            this.rootSVG.appendChild(this.minimumReferenceModeText);
            if (!this.minimumReferenceValueText) {
                this.minimumReferenceValueText = document.createElementNS(Avionics.SVG.NS, "text");
            }
            this.minimumReferenceValueText.textContent = "210";
            this.minimumReferenceValueText.setAttribute("x", "525");
            this.minimumReferenceValueText.setAttribute("y", "685");
            this.minimumReferenceValueText.setAttribute("fill", "lime");
            this.minimumReferenceValueText.setAttribute("font-size", "30");
            this.minimumReferenceValueText.setAttribute("font-family", "BoeingEFIS");
            this.minimumReferenceValueText.setAttribute("text-anchor", "end");
            this.rootSVG.appendChild(this.minimumReferenceValueText);
        }
        this.appendChild(this.rootSVG);
    }
    update(dTime) {
        this.updateHeadingInstrument();
        this.updateMinimumText(this.minimumReferenceValue, Simplane.getMinimumReferenceMode());
    }
    updateHeadingInstrument() {
        if (this.rotatingGroup) {
            const heading = SimVar.GetSimVarValue("PLANE HEADING DEGREES MAGNETIC", "degree");
            const mcpHeading = SimVar.GetSimVarValue("AUTOPILOT HEADING LOCK DIR:1", "degree");
            const magTrack = SimVar.GetSimVarValue("GPS GROUND MAGNETIC TRACK", "degree");
            const elements = this.rotatingGroup.children;
            for (let i = 0; i < elements.length; i++) {
                const rotation = ((elements[i].getAttribute("class")) * 10);
                elements[i].setAttribute("transform", `rotate(${-1 * this.getHeadingDelta(heading, rotation)* 1.6} 349 ${900 + this.normalizeArc(heading, rotation)})`);
            }
            this.hdgBug.setAttribute("transform", `rotate(${Math.min(-Math.min(this.getHeadingDelta(heading, mcpHeading) * 1.6, 53), 53)} 349 ${900 + this.normalizeArc(heading, mcpHeading)})`);
            if (!Simplane.getIsGrounded()) {
                this.trkLine.setAttribute("transform", `rotate(${this.getHeadingDelta(heading, heading - this.getHeadingDelta(heading, magTrack) * -1.6)} 349 ${900 + this.normalizeArc(heading, heading - this.getHeadingDelta(-heading, magTrack))})`);
            }
            this.hdgBugText.textContent = `${this.getHdgSelString(mcpHeading)}`;
        }    
    }
    getHeadingDelta(heading1, heading2) {
        let headingDelta = heading1 - heading2;
        if (headingDelta > 180) {
            headingDelta -= 360;
        } else if (headingDelta < -180) {
            headingDelta += 360;
        }
        return headingDelta;
    }
    normalizeArc(heading, indicatorHeading) {
        return Math.min(Math.abs(this.getHeadingDelta(heading, indicatorHeading) * 100), 30)
    }
    getHdgSelString(mcpHeading) {
        let hdgString = mcpHeading.toFixed(0);
        if (hdgString.length == 2) {
            hdgString = "0" + hdgString;
        } else if (hdgString.length == 1) {
            hdgString = "00" + hdgString;
        }
        return hdgString;
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