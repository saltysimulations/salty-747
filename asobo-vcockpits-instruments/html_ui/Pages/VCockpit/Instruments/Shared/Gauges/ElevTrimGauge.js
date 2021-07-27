class ElevTrimGauge extends AbstractGauge {
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
        diffAndSetAttribute(this.root, "viewBox", "0 0 50 130");
        diffAndSetAttribute(this.root, "overflow", "visible");
        this.appendChild(this.root);
        let elevText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(elevText, "x", "15");
        diffAndSetAttribute(elevText, "y", "12");
        diffAndSetText(elevText, "ELEV");
        diffAndSetAttribute(elevText, "fill", "white");
        diffAndSetAttribute(elevText, "font-size", "12");
        this.root.appendChild(elevText);
        let verticalBar = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(verticalBar, "x", "40");
        diffAndSetAttribute(verticalBar, "y", "18");
        diffAndSetAttribute(verticalBar, "height", "100");
        diffAndSetAttribute(verticalBar, "width", "2");
        diffAndSetAttribute(verticalBar, "fill", "white");
        this.root.appendChild(verticalBar);
        let topBar = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(topBar, "x", "30");
        diffAndSetAttribute(topBar, "y", "18");
        diffAndSetAttribute(topBar, "height", "2");
        diffAndSetAttribute(topBar, "width", "10");
        diffAndSetAttribute(topBar, "fill", "white");
        this.root.appendChild(topBar);
        let dnText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(dnText, "x", "10");
        diffAndSetAttribute(dnText, "y", "24");
        diffAndSetText(dnText, "DN");
        diffAndSetAttribute(dnText, "fill", "white");
        diffAndSetAttribute(dnText, "font-size", "12");
        this.root.appendChild(dnText);
        let BottomBar = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(BottomBar, "x", "30");
        diffAndSetAttribute(BottomBar, "y", "116");
        diffAndSetAttribute(BottomBar, "height", "2");
        diffAndSetAttribute(BottomBar, "width", "10");
        diffAndSetAttribute(BottomBar, "fill", "white");
        this.root.appendChild(BottomBar);
        let upText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(upText, "x", "10");
        diffAndSetAttribute(upText, "y", "124");
        diffAndSetText(upText, "UP");
        diffAndSetAttribute(upText, "fill", "white");
        diffAndSetAttribute(upText, "font-size", "12");
        this.root.appendChild(upText);
        let greenBar = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(greenBar, "x", "35");
        diffAndSetAttribute(greenBar, "y", (18 + this._greenStartPercent * 100) + '');
        diffAndSetAttribute(greenBar, "height", (this._greenEndPercent * 100 - this._greenStartPercent * 100) + '');
        diffAndSetAttribute(greenBar, "width", "5");
        diffAndSetAttribute(greenBar, "fill", "green");
        this.root.appendChild(greenBar);
        this.cursor = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(this.cursor, "d", "M30 14 L35 14 L40 18 L35 22 L30 22 Z");
        diffAndSetAttribute(this.cursor, "fill", "aqua");
        this.root.appendChild(this.cursor);
        this._updateValueSvg();
    }
    _drawBase() {
        throw new Error("Elev trim Gauge not implemented in Canvas");
    }
    _updateValueSvg() {
        diffAndSetAttribute(this.cursor, "transform", "translate(0 " + this._valuePercent * 100 + ")");
    }
    _drawCursor() {
        throw new Error("Elev trim Gauge not implemented in Canvas");
    }
    connectedCallback() {
        this._redrawSvg();
    }
}
customElements.define('elev-trim-gauge', ElevTrimGauge);
//# sourceMappingURL=ElevTrimGauge.js.map