class AOAIndicator extends HTMLElement {
    constructor() {
        super();
        this.redPercent = 17;
        this.whiteBarAngle = 50;
    }
    static get observedAttributes() {
        return [
            "aoa"
        ];
    }
    connectedCallback() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 100 100");
        this.appendChild(this.root);
        let background = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(background, "x", "0");
        diffAndSetAttribute(background, "y", "0");
        diffAndSetAttribute(background, "width", "100");
        diffAndSetAttribute(background, "height", "100");
        diffAndSetAttribute(background, "fill", "#1a1d21");
        diffAndSetAttribute(background, "fill-opacity", "0.25");
        this.root.appendChild(background);
        let whiteCircle = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(whiteCircle, "d", "M10 90 A80 80 0 0 1 90 10 ");
        diffAndSetAttribute(whiteCircle, "fill", "none");
        diffAndSetAttribute(whiteCircle, "stroke", "white");
        diffAndSetAttribute(whiteCircle, "stroke-width", "4");
        this.root.appendChild(whiteCircle);
        let angleBegin = Math.PI * (1.5 - this.redPercent / 200);
        let xBegin = 90 + 80 * Math.cos(angleBegin);
        let yBegin = 90 + 80 * Math.sin(angleBegin);
        let redCircle = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(redCircle, "d", "M" + xBegin + " " + yBegin + " A80 80 0 0 1 90 10 ");
        diffAndSetAttribute(redCircle, "fill", "none");
        diffAndSetAttribute(redCircle, "stroke", "red");
        diffAndSetAttribute(redCircle, "stroke-width", "4");
        this.root.appendChild(redCircle);
        let whiteBar = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(whiteBar, "x", "-10");
        diffAndSetAttribute(whiteBar, "y", "90");
        diffAndSetAttribute(whiteBar, "width", "15");
        diffAndSetAttribute(whiteBar, "height", "2");
        diffAndSetAttribute(whiteBar, "fill", "white");
        diffAndSetAttribute(whiteBar, "transform", "rotate(" + this.whiteBarAngle + " 90 90)");
        this.root.appendChild(whiteBar);
        this.cursor = document.createElementNS(Avionics.SVG.NS, "polygon");
        diffAndSetAttribute(this.cursor, "points", "10,90 30,82.5 30,97.5");
        diffAndSetAttribute(this.cursor, "fill", "white");
        diffAndSetAttribute(this.cursor, "stroke", "black");
        this.root.appendChild(this.cursor);
        let AOAText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(AOAText, "x", "60");
        diffAndSetAttribute(AOAText, "y", "70");
        diffAndSetAttribute(AOAText, "fill", "white");
        diffAndSetAttribute(AOAText, "font-size", "17");
        diffAndSetAttribute(AOAText, "font-family", "Roboto-Bold");
        diffAndSetText(AOAText, "AOA");
        this.root.appendChild(AOAText);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "aoa":
                let value = parseFloat(newValue);
                diffAndSetAttribute(this.cursor, "transform", "rotate(" + (50 + value / 16 * (value < 0 ? 50 : 40)) + " 90 90)");
                diffAndSetAttribute(this.cursor, "fill", ((50 + value / 16 * 40) > (90 - this.redPercent) ? "red" : "white"));
                break;
        }
    }
}
customElements.define('glasscockpit-aoa-indicator', AOAIndicator);
//# sourceMappingURL=AngleOfAttackIndicator.js.map