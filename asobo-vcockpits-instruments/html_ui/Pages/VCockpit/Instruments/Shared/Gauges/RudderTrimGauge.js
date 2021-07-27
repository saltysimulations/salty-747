class RudderTrimGauge extends AbstractGauge {
    constructor() {
        super();
        this.takeOffValue = 10;
        this.forceSvg = true;
    }
    _redrawSvg() {
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
        let width = 80;
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 " + width + " 50");
        diffAndSetAttribute(this.root, "overflow", "visible");
        this.appendChild(this.root);
        let RudText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(RudText, "x", (width / 2) + '');
        diffAndSetAttribute(RudText, "y", "20");
        diffAndSetText(RudText, "RUD");
        diffAndSetAttribute(RudText, "fill", "white");
        diffAndSetAttribute(RudText, "font-size", "20");
        diffAndSetAttribute(RudText, "text-anchor", "middle");
        this.root.appendChild(RudText);
        let horizontalBar = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(horizontalBar, "x", "0");
        diffAndSetAttribute(horizontalBar, "y", "48");
        diffAndSetAttribute(horizontalBar, "height", "2");
        diffAndSetAttribute(horizontalBar, "width", "80");
        diffAndSetAttribute(horizontalBar, "fill", "white");
        this.root.appendChild(horizontalBar);
        let leftBar = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(leftBar, "x", "0");
        diffAndSetAttribute(leftBar, "y", "35");
        diffAndSetAttribute(leftBar, "height", "15");
        diffAndSetAttribute(leftBar, "width", "2");
        diffAndSetAttribute(leftBar, "fill", "white");
        this.root.appendChild(leftBar);
        let rightBar = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(rightBar, "x", "78");
        diffAndSetAttribute(rightBar, "y", "35");
        diffAndSetAttribute(rightBar, "height", "15");
        diffAndSetAttribute(rightBar, "width", "2");
        diffAndSetAttribute(rightBar, "fill", "white");
        this.root.appendChild(rightBar);
        let greenBar = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(greenBar, "x", (this._greenStartPercent * width) + '');
        diffAndSetAttribute(greenBar, "y", "43");
        diffAndSetAttribute(greenBar, "height", "5");
        diffAndSetAttribute(greenBar, "width", (this._greenEndPercent * width - this._greenStartPercent * width) + '');
        diffAndSetAttribute(greenBar, "fill", "green");
        this.root.appendChild(greenBar);
        let whiteBar = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(whiteBar, "x", (this._whiteStartPercent * width) + '');
        diffAndSetAttribute(whiteBar, "y", "43");
        diffAndSetAttribute(whiteBar, "height", "5");
        diffAndSetAttribute(whiteBar, "width", (this._whiteEndPercent * width - this._whiteStartPercent * width) + '');
        diffAndSetAttribute(whiteBar, "fill", "white");
        this.root.appendChild(whiteBar);
        this.cursor = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(this.cursor, "d", "M-4 34 L-4 42 L0 50 L4 42 L4 34 Z");
        diffAndSetAttribute(this.cursor, "fill", "aqua");
        this.root.appendChild(this.cursor);
        this._updateValueSvg();
    }
    _drawBase() {
        throw new Error("Elev trim Gauge not implemented in Canvas");
    }
    _updateValueSvg() {
        diffAndSetAttribute(this.cursor, "transform", "translate(" + this._valuePercent * 80 + " 0 )");
    }
    _drawCursor() {
        throw new Error("Elev trim Gauge not implemented in Canvas");
    }
    connectedCallback() {
        this._redrawSvg();
    }
}
customElements.define('rudder-trim-gauge', RudderTrimGauge);
//# sourceMappingURL=RudderTrimGauge.js.map