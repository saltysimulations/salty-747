class AilTrimGauge extends AbstractGauge {
    constructor() {
        super();
        this.takeOffValue = 10;
        this.forceSvg = true;
    }
    _redrawSvg() {
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 100 50");
        diffAndSetAttribute(this.root, "overflow", "visible");
        this.appendChild(this.root);
        let AlText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(AlText, "x", "50");
        diffAndSetAttribute(AlText, "y", "50");
        diffAndSetText(AlText, "AIL");
        diffAndSetAttribute(AlText, "fill", "white");
        diffAndSetAttribute(AlText, "font-size", "20");
        diffAndSetAttribute(AlText, "text-anchor", "middle");
        this.root.appendChild(AlText);
        let horizontalBar = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(horizontalBar, "x", "0");
        diffAndSetAttribute(horizontalBar, "y", "0");
        diffAndSetAttribute(horizontalBar, "height", "2");
        diffAndSetAttribute(horizontalBar, "width", "100");
        diffAndSetAttribute(horizontalBar, "fill", "white");
        this.root.appendChild(horizontalBar);
        let leftBar = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(leftBar, "x", "0");
        diffAndSetAttribute(leftBar, "y", "0");
        diffAndSetAttribute(leftBar, "height", "15");
        diffAndSetAttribute(leftBar, "width", "2");
        diffAndSetAttribute(leftBar, "fill", "white");
        this.root.appendChild(leftBar);
        let rightBar = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(rightBar, "x", "98");
        diffAndSetAttribute(rightBar, "y", "0");
        diffAndSetAttribute(rightBar, "height", "15");
        diffAndSetAttribute(rightBar, "width", "2");
        diffAndSetAttribute(rightBar, "fill", "white");
        this.root.appendChild(rightBar);
        let whiteBar = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(whiteBar, "x", (this._whiteStartPercent * 100) + '');
        diffAndSetAttribute(whiteBar, "y", "2");
        diffAndSetAttribute(whiteBar, "height", "5");
        diffAndSetAttribute(whiteBar, "width", (this._whiteEndPercent * 100 - this._whiteStartPercent * 100) + '');
        diffAndSetAttribute(whiteBar, "fill", "white");
        this.root.appendChild(whiteBar);
        this.cursor = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(this.cursor, "d", "M-4 16 L-4 8 L0 0 L4 8 L4 16 Z");
        diffAndSetAttribute(this.cursor, "fill", "aqua");
        this.root.appendChild(this.cursor);
        this._updateValueSvg();
    }
    _drawBase() {
        throw new Error("Elev trim Gauge not implemented in Canvas");
    }
    _updateValueSvg() {
        diffAndSetAttribute(this.cursor, "transform", "translate(" + this._valuePercent * 100 + " 0 )");
    }
    _drawCursor() {
        throw new Error("Elev trim Gauge not implemented in Canvas");
    }
    connectedCallback() {
        this._redrawSvg();
    }
}
customElements.define('ail-trim-gauge', AilTrimGauge);
//# sourceMappingURL=AilTrimGauge.js.map