class HorizontalGauge extends AbstractGauge {
    get _cursorPercent() {
        return (this._value - this._minValue) / this._amplitude;
    }
    _redrawSvg() {
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
        diffAndSetAttribute(dashes, "x1", "0");
        diffAndSetAttribute(dashes, "y1", "15");
        diffAndSetAttribute(dashes, "x2", "100");
        diffAndSetAttribute(dashes, "y2", "15");
        diffAndSetAttribute(dashes, "fill", "none");
        diffAndSetAttribute(dashes, "stroke", "white");
        diffAndSetAttribute(dashes, "stroke-width", "10px");
        diffAndSetAttribute(dashes, "stroke-dashoffset", "1");
        diffAndSetAttribute(dashes, "stroke-dasharray", "1 " + (101 - this._stepsCount) / (this._stepsCount));
        svg.appendChild(dashes);
        if (this._lowRedLengthPercent > 0) {
            let lowRedRect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(lowRedRect, "x", fastToFixed((this._lowRedStartPercent * 100), 2));
            diffAndSetAttribute(lowRedRect, "y", "14");
            diffAndSetAttribute(lowRedRect, "width", fastToFixed(Math.max(this._lowRedLengthPercent * 100, 0), 2));
            diffAndSetAttribute(lowRedRect, "height", "6");
            diffAndSetAttribute(lowRedRect, "fill", "red");
            svg.appendChild(lowRedRect);
        }
        if (this._lowYellowLengthPercent > 0) {
            let lowYellowRect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(lowYellowRect, "x", fastToFixed((this._lowYellowStartPercent * 100), 2));
            diffAndSetAttribute(lowYellowRect, "y", "14");
            diffAndSetAttribute(lowYellowRect, "width", fastToFixed(Math.max(this._lowYellowLengthPercent * 100, 0), 2));
            diffAndSetAttribute(lowYellowRect, "height", "6");
            diffAndSetAttribute(lowYellowRect, "fill", "yellow");
            svg.appendChild(lowYellowRect);
        }
        if (this._greenLengthPercent > 0) {
            let greenRect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(greenRect, "x", fastToFixed((this._greenStartPercent * 100), 2));
            diffAndSetAttribute(greenRect, "y", "14");
            diffAndSetAttribute(greenRect, "width", fastToFixed(Math.max(this._greenLengthPercent * 100, 0), 2));
            diffAndSetAttribute(greenRect, "height", "6");
            diffAndSetAttribute(greenRect, "fill", "green");
            svg.appendChild(greenRect);
        }
        if (this._yellowLengthPercent > 0) {
            let yellowRect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(yellowRect, "x", fastToFixed((this._yellowStartPercent * 100), 2));
            diffAndSetAttribute(yellowRect, "y", "14");
            diffAndSetAttribute(yellowRect, "width", fastToFixed(Math.max(this._yellowLengthPercent * 100, 0), 2));
            diffAndSetAttribute(yellowRect, "height", "6");
            diffAndSetAttribute(yellowRect, "fill", "yellow");
            svg.appendChild(yellowRect);
        }
        if (this._redLengthPercent > 0) {
            let redRect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(redRect, "x", fastToFixed((this._redStartPercent * 100), 2));
            diffAndSetAttribute(redRect, "y", "14");
            diffAndSetAttribute(redRect, "width", fastToFixed(Math.max(this._redLengthPercent * 100, 0), 2));
            diffAndSetAttribute(redRect, "height", "6");
            diffAndSetAttribute(redRect, "fill", "red");
            svg.appendChild(redRect);
        }
        if (isFinite(this._limitLowPercent)) {
            let limitLowRect = document.createElementNS(Avionics.SVG.NS, "path");
            let d = "M " + fastToFixed((this._limitLowPercent * 100), 2) + " 10";
            d += " L " + fastToFixed((this._limitLowPercent * 100), 2) + " 20";
            diffAndSetAttribute(limitLowRect, "d", d);
            diffAndSetAttribute(limitLowRect, "fill", "none");
            diffAndSetAttribute(limitLowRect, "stroke", "red");
            diffAndSetAttribute(limitLowRect, "stroke-width", "2px");
            svg.appendChild(limitLowRect);
        }
        if (isFinite(this._limitHighPercent)) {
            let limitHighRect = document.createElementNS(Avionics.SVG.NS, "path");
            let d = "M " + fastToFixed((this._limitHighPercent * 100), 2) + " 10";
            d += " L " + fastToFixed((this._limitHighPercent * 100), 2) + " 20";
            diffAndSetAttribute(limitHighRect, "d", d);
            diffAndSetAttribute(limitHighRect, "fill", "none");
            diffAndSetAttribute(limitHighRect, "stroke", "red");
            diffAndSetAttribute(limitHighRect, "stroke-width", "2px");
            svg.appendChild(limitHighRect);
        }
        this._cursor = document.createElementNS(Avionics.SVG.NS, "path");
        this._cursor.classList.add("gauge-cursor");
        this._cursor.classList.add("horizontal-gauge-cursor");
        diffAndSetAttribute(this._cursor, "fill", "white");
        diffAndSetAttribute(this._cursor, "stroke", "black");
        let cursorPath = "M -4 0 L 4 0 L 4 8 L 0 12 L -4 8 Z";
        diffAndSetAttribute(this._cursor, "d", cursorPath);
        svg.appendChild(this._cursor);
        let horizontalGauge = document.createElementNS(Avionics.SVG.NS, "path");
        let d = "M 0 7 L 0 20 L 100 20 L 100 7";
        horizontalGauge.classList.add("gauge-base");
        horizontalGauge.classList.add("horizontal-gauge-base");
        diffAndSetAttribute(horizontalGauge, "d", d);
        diffAndSetAttribute(horizontalGauge, "fill", "none");
        diffAndSetAttribute(horizontalGauge, "stroke", "black");
        svg.appendChild(horizontalGauge);
        this._updateValue();
    }
    _updateValueSvg() {
        let cursorPercent = this._cursorPercent * 100;
        diffAndSetAttribute(this._cursor, "transform", "translate(" + cursorPercent + " 0)");
    }
    _drawBase() {
        let w = this._canvasBase.width - 2;
        let h = this._canvasBase.height - 2;
        if (w < 1 || h < 1) {
            return;
        }
        let step = w / this._stepsCount;
        for (let i = 1; i < this._stepsCount; i++) {
            CircularGauge.DrawLineFromTo(this._canvasBaseContext, i * step, h - w * 0.07, i * step, h);
            this._canvasBaseContext.strokeStyle = "white";
            this._canvasBaseContext.stroke();
        }
        if (this._lowRedLengthPercent > 0) {
            this._canvasBaseContext.fillStyle = "red";
            this._canvasBaseContext.fillRect(this._lowRedStartPercent * w, h - w * 0.05, this._lowRedLengthPercent * w, w * 0.05);
        }
        if (this._lowYellowLengthPercent > 0) {
            this._canvasBaseContext.fillStyle = "yellow";
            this._canvasBaseContext.fillRect(this._lowYellowStartPercent * w, h - w * 0.05, this._lowYellowLengthPercent * w, w * 0.05);
        }
        if (this._greenLengthPercent > 0) {
            this._canvasBaseContext.fillStyle = "green";
            this._canvasBaseContext.fillRect(this._greenStartPercent * w, h - w * 0.05, this._greenLengthPercent * w, w * 0.05);
        }
        if (this._yellowLengthPercent > 0) {
            this._canvasBaseContext.fillStyle = "yellow";
            this._canvasBaseContext.fillRect(this._yellowStartPercent * w, h - w * 0.05, this._yellowLengthPercent * w, w * 0.05);
        }
        if (this._redLengthPercent > 0) {
            this._canvasBaseContext.fillStyle = "red";
            this._canvasBaseContext.fillRect(this._redStartPercent * w, h - w * 0.05, this._redLengthPercent * w, w * 0.05);
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
        this._canvasBaseContext.textAlign = "left";
        this._canvasBaseContext.font = fastToFixed(this.fontSize, 0) + "px Roboto";
        this._canvasBaseContext.fillStyle = "white";
        this._canvasBaseContext.fillText(this._title + " " + this._unit, 0, (this.isTextUpScaled ? h - 30 : h - 26));
        this._canvasBaseContext.beginPath();
        this._canvasBaseContext.moveTo(1, h - w * 0.1);
        this._canvasBaseContext.lineTo(1, h);
        this._canvasBaseContext.lineTo(w, h);
        this._canvasBaseContext.lineTo(w, h - w * 0.1);
        this._canvasBaseContext.strokeStyle = "white";
        this._canvasBaseContext.lineWidth = 2;
        this._canvasBaseContext.stroke();
    }
    _drawCursor() {
        let w = this._canvasCursor.width - 2;
        let h = this._canvasCursor.height - 2;
        if (w < 1 || h < 1) {
            return;
        }
        let s = w / 30;
        let cursorY = h - w / 10 - 2 * s;
        this._canvasCursorContext.beginPath();
        this._canvasCursorContext.moveTo(-s + this._cursorPercent * w, 0 + cursorY);
        this._canvasCursorContext.lineTo(s + this._cursorPercent * w, 0 + cursorY);
        this._canvasCursorContext.lineTo(s + this._cursorPercent * w, 2 * s + cursorY);
        this._canvasCursorContext.lineTo(0 + this._cursorPercent * w, 3 * s + cursorY);
        this._canvasCursorContext.lineTo(-s + this._cursorPercent * w, 2 * s + cursorY);
        this._canvasCursorContext.lineTo(-s + this._cursorPercent * w, 0 + cursorY);
        this._canvasCursorContext.fillStyle = "white";
        this._canvasCursorContext.fill();
        this._canvasCursorContext.textAlign = "right";
        this._canvasCursorContext.font = fastToFixed((this.fontSize * 1.3), 0) + "px sans-serif";
        this._canvasCursorContext.fillStyle = this.getCurrentColor();
        this._canvasCursorContext.fillText(fastToFixed(this._value, this._valuePrecision), w, (this.isTextUpScaled ? h - 13 : h - 26));
    }
}
customElements.define('horizontal-gauge', HorizontalGauge);
//# sourceMappingURL=HorizontalGauge.js.map