class FlapsGauge extends AbstractGauge {
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
        this.cursor = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(this.cursor, "d", "M10 10 Q25 0 60 10 Q25 20 10 10");
        diffAndSetAttribute(this.cursor, "fill", "aqua");
        this.root.appendChild(this.cursor);
        let angles = [this._minValue, this.takeOffValue, this._maxValue];
        let texts = ["UP", "T/O", "LDG"];
        for (let i = 0; i < angles.length; i++) {
            let graduation = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(graduation, "x", "60");
            diffAndSetAttribute(graduation, "y", "10");
            diffAndSetAttribute(graduation, "height", "1");
            diffAndSetAttribute(graduation, "width", "10");
            diffAndSetAttribute(graduation, "fill", "white");
            diffAndSetAttribute(graduation, "transform", "rotate(" + angles[i] + " 10 10)");
            this.root.appendChild(graduation);
            let text = document.createElementNS(Avionics.SVG.NS, "text");
            let radAngle = angles[i] * Math.PI / 180;
            diffAndSetAttribute(text, "x", (10 + 65 * Math.cos(radAngle)) + '');
            diffAndSetAttribute(text, "y", (15 + 65 * Math.sin(radAngle)) + '');
            diffAndSetAttribute(text, "fill", "white");
            diffAndSetAttribute(text, "font-size", "10");
            diffAndSetText(text, texts[i]);
            this.root.appendChild(text);
        }
        let flapsText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(flapsText, "x", "5");
        diffAndSetAttribute(flapsText, "y", "45");
        diffAndSetAttribute(flapsText, "fill", "white");
        diffAndSetAttribute(flapsText, "font-size", "12");
        diffAndSetText(flapsText, "FLAPS");
        this.root.appendChild(flapsText);
        this._updateValueSvg();
    }
    _drawBase() {
        throw new Error("Flaps Gauge not implemented in Canvas");
    }
    _updateValueSvg() {
        diffAndSetAttribute(this.cursor, "transform", "rotate(" + this._value + " 10 10)");
    }
    _drawCursor() {
        throw new Error("Flaps Gauge not implemented in Canvas");
    }
    static get observedAttributes() {
        return [
            "value",
            "min-value",
            "take-off-value",
            "max-value"
        ];
    }
    connectedCallback() {
        this._redrawSvg();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue) {
            return;
        }
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case "take-off-value":
                this.takeOffValue = parseFloat(newValue);
                this._redrawSvg();
                break;
        }
    }
}
customElements.define('flaps-gauge', FlapsGauge);
//# sourceMappingURL=FlapsGauge.js.map