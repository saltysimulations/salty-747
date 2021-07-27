class VerticalGauge extends AbstractGauge {
    _redrawSvg() {
        console.warn("Redraw Vertical Gauge. This should not happen every frame.");
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
        let svg = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(svg, "overflow", "visible");
        diffAndSetAttribute(svg, "width", "100%");
        diffAndSetAttribute(svg, "height", "100%");
        diffAndSetAttribute(svg, "viewBox", "0 0 100 100");
        this.appendChild(svg);
        let dashes = document.createElementNS(Avionics.SVG.NS, "line");
        dashes.classList.add("gauge-base");
        dashes.classList.add("vertical-gauge-base");
        diffAndSetAttribute(dashes, "x1", "5");
        diffAndSetAttribute(dashes, "y1", "0");
        diffAndSetAttribute(dashes, "x2", "5");
        diffAndSetAttribute(dashes, "y2", "100");
        diffAndSetAttribute(dashes, "fill", "none");
        diffAndSetAttribute(dashes, "stroke", "white");
        diffAndSetAttribute(dashes, "stroke-width", "10px");
        diffAndSetAttribute(dashes, "stroke-dashoffset", "1");
        diffAndSetAttribute(dashes, "stroke-dasharray", "1 " + (101 - this._stepsCount) / (this._stepsCount));
        svg.appendChild(dashes);
        if (this._lowRedLengthPercent > 0) {
            let lowRedRect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(lowRedRect, "x", "0");
            diffAndSetAttribute(lowRedRect, "y", fastToFixed((100 - this._lowRedEndPercent), 2));
            diffAndSetAttribute(lowRedRect, "width", "6");
            diffAndSetAttribute(lowRedRect, "height", fastToFixed(Math.max(this._lowRedEndPercent - this._lowRedStartPercent, 0), 2));
            diffAndSetAttribute(lowRedRect, "fill", "red");
            svg.appendChild(lowRedRect);
        }
        if (this._lowYellowLengthPercent > 0) {
            let lowYellowRect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(lowYellowRect, "x", "0");
            diffAndSetAttribute(lowYellowRect, "y", fastToFixed((100 - this._lowYellowEndPercent), 2));
            diffAndSetAttribute(lowYellowRect, "width", "6");
            diffAndSetAttribute(lowYellowRect, "height", fastToFixed(Math.max(this._lowYellowEndPercent - this._lowYellowStartPercent, 0), 2));
            diffAndSetAttribute(lowYellowRect, "fill", "yellow");
            svg.appendChild(lowYellowRect);
        }
        if (this._greenLengthPercent > 0) {
            let greenRect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(greenRect, "x", "0");
            diffAndSetAttribute(greenRect, "y", fastToFixed((100 - this._greenEndPercent), 2));
            diffAndSetAttribute(greenRect, "width", "6");
            diffAndSetAttribute(greenRect, "height", fastToFixed(Math.max(this._greenEndPercent - this._greenStartPercent, 0), 2));
            diffAndSetAttribute(greenRect, "fill", "green");
            svg.appendChild(greenRect);
        }
        if (this._yellowLengthPercent > 0) {
            let yellowRect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(yellowRect, "x", "0");
            diffAndSetAttribute(yellowRect, "y", fastToFixed((100 - this._yellowEndPercent), 2));
            diffAndSetAttribute(yellowRect, "width", "6");
            diffAndSetAttribute(yellowRect, "height", fastToFixed(Math.max(this._yellowEndPercent - this._yellowStartPercent, 0), 2));
            diffAndSetAttribute(yellowRect, "fill", "yellow");
            svg.appendChild(yellowRect);
        }
        if (this._redLengthPercent > 0) {
            let redRect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(redRect, "x", "0");
            diffAndSetAttribute(redRect, "y", fastToFixed((100 - this._redEndPercent), 2));
            diffAndSetAttribute(redRect, "width", "6");
            diffAndSetAttribute(redRect, "height", fastToFixed(Math.max(this._redEndPercent - this._redStartPercent, 0), 2));
            diffAndSetAttribute(redRect, "fill", "red");
            svg.appendChild(redRect);
        }
        this._cursorRect = document.createElementNS(Avionics.SVG.NS, "rect");
        this._cursorRect.classList.add("gauge-cursor");
        this._cursorRect.classList.add("vertical-gauge-cursor");
        diffAndSetAttribute(this._cursorRect, "x", "17");
        diffAndSetAttribute(this._cursorRect, "width", "8");
        diffAndSetAttribute(this._cursorRect, "fill", "white");
        svg.appendChild(this._cursorRect);
        this._cursor = document.createElementNS(Avionics.SVG.NS, "path");
        this._cursor.classList.add("gauge-cursor");
        this._cursor.classList.add("vertical-gauge-cursor");
        diffAndSetAttribute(this._cursor, "fill", "white");
        svg.appendChild(this._cursor);
        let verticalGauge = document.createElementNS(Avionics.SVG.NS, "path");
        let d = "M 13 0 L 0 0 L 0 100 L 13 100";
        verticalGauge.classList.add("gauge-base");
        verticalGauge.classList.add("vertical-gauge-base");
        diffAndSetAttribute(verticalGauge, "d", d);
        diffAndSetAttribute(verticalGauge, "fill", "none");
        diffAndSetAttribute(verticalGauge, "stroke", "white");
        svg.appendChild(verticalGauge);
        this._updateValue();
    }
    _updateValueSvg() {
        let cursorPercent = (this._value - this._minValue) / this._amplitude * 100;
        let cursorPath = "M 9 " + (100 - cursorPercent) + " L 17 " + (100 - cursorPercent) + " L 17 " + Math.min(108 - cursorPercent, 100) + " Z";
        let t0 = performance.now();
        diffAndSetAttribute(this._cursorRect, "y", fastToFixed((100 - cursorPercent), 2));
        diffAndSetAttribute(this._cursorRect, "height", fastToFixed(Math.max(cursorPercent, 0), 2));
        diffAndSetAttribute(this._cursor, "d", cursorPath);
        let t = performance.now() - t0;
        if (t > 0) {
        }
    }
    _drawBase() {
        let w = this._canvasBase.width - 2;
        let h = this._canvasBase.height - 2;
        if (w < 1 || h < 1) {
            return;
        }
        let step = h / this._stepsCount;
        for (let i = 1; i < this._stepsCount; i++) {
            CircularGauge.DrawLineFromTo(this._canvasBaseContext, 1, i * step, h * 0.07, i * step);
            this._canvasBaseContext.strokeStyle = "white";
            this._canvasBaseContext.stroke();
        }
        if (this._lowRedLengthPercent > 0) {
            this._canvasBaseContext.fillStyle = "red";
            this._canvasBaseContext.fillRect(1, h * (1 - this._lowRedEndPercent), h * 0.05, this._lowRedLengthPercent * h);
        }
        if (this._lowYellowLengthPercent > 0) {
            this._canvasBaseContext.fillStyle = "yellow";
            this._canvasBaseContext.fillRect(1, h * (1 - this._lowYellowEndPercent), h * 0.05, this._lowYellowLengthPercent * h);
        }
        if (this._greenLengthPercent > 0) {
            this._canvasBaseContext.fillStyle = "green";
            this._canvasBaseContext.fillRect(1, h * (1 - this._greenEndPercent), h * 0.05, this._greenLengthPercent * h);
        }
        if (this._yellowLengthPercent > 0) {
            this._canvasBaseContext.fillStyle = "yellow";
            this._canvasBaseContext.fillRect(1, h * (1 - this._yellowEndPercent), h * 0.05, this._yellowLengthPercent * h);
        }
        if (this._redLengthPercent > 0) {
            this._canvasBaseContext.fillStyle = "red";
            this._canvasBaseContext.fillRect(1, h * (1 - this._redEndPercent), h * 0.05, this._redLengthPercent * h);
        }
        if (isFinite(this._limitLow)) {
            CircularGauge.DrawLineFromTo(this._canvasBaseContext, this._limitLowPercent * w, h - w * 0.1, this._limitLowPercent * w, h);
            this._canvasBaseContext.strokeStyle = "red";
            this._canvasBaseContext.lineWidth = 3;
            this._canvasBaseContext.stroke();
        }
        if (isFinite(this._limitHigh)) {
            CircularGauge.DrawLineFromTo(this._canvasBaseContext, this._limitHighPercent * w, h - w * 0.1, this._limitHighPercent * w, h);
            this._canvasBaseContext.strokeStyle = "red";
            this._canvasBaseContext.lineWidth = 3;
            this._canvasBaseContext.stroke();
        }
        this._canvasBaseContext.beginPath();
        this._canvasBaseContext.moveTo(h * 0.1, 1);
        this._canvasBaseContext.lineTo(1, 1);
        this._canvasBaseContext.lineTo(1, h);
        this._canvasBaseContext.lineTo(h * 0.1, h);
        this._canvasBaseContext.strokeStyle = "white";
        this._canvasBaseContext.lineWidth = 2;
        this._canvasBaseContext.stroke();
    }
    get _cursorPercent() {
        return (this._value - this._minValue) / this._amplitude;
    }
    _drawCursor() {
        let w = this._canvasCursor.width - 2;
        let h = this._canvasCursor.height - 2;
        if (w < 1 || h < 1) {
            return;
        }
        let s = h / 30;
        let cursorX = h / 5;
        this._canvasCursorContext.beginPath();
        this._canvasCursorContext.moveTo(0 + cursorX, -s + (1 - this._cursorPercent) * h);
        this._canvasCursorContext.lineTo(0 + cursorX, s + (1 - this._cursorPercent) * h);
        this._canvasCursorContext.lineTo(-2 * s + cursorX, s + (1 - this._cursorPercent) * h);
        this._canvasCursorContext.lineTo(-3 * s + cursorX, 0 + (1 - this._cursorPercent) * h);
        this._canvasCursorContext.lineTo(-2 * s + cursorX, -s + (1 - this._cursorPercent) * h);
        this._canvasCursorContext.lineTo(0 + cursorX, -s + (1 - this._cursorPercent) * h);
        this._canvasCursorContext.fillStyle = "white";
        this._canvasCursorContext.fill();
        this._canvasCursorContext.textAlign = "right";
        this._canvasCursorContext.font = fastToFixed((this.fontSize * 1.3), 0) + "px sans-serif";
        this._canvasCursorContext.fillStyle = this.getCurrentColor();
        this._canvasCursorContext.fillText(fastToFixed(this._value, this._valuePrecision), w + 2, 18);
    }
}
customElements.define('vertical-gauge', VerticalGauge);
//# sourceMappingURL=VerticalGauge.js.map