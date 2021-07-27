class CDI extends HTMLElement {
    constructor() {
        super(...arguments);
        this.deviation = 0;
        this.isFrom = false;
        this.scale = 5;
    }
    static get observedAttributes() {
        return [
            "deviation",
            "scale",
            "toFrom",
            "active"
        ];
    }
    connectedCallback() {
        this.createSVG();
    }
    createSVG() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 100 15");
        this.appendChild(this.root);
        let background = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(background, "x", "0");
        diffAndSetAttribute(background, "y", "0");
        diffAndSetAttribute(background, "width", "100");
        diffAndSetAttribute(background, "height", "15");
        diffAndSetAttribute(background, "fill", "#1a1d21");
        diffAndSetAttribute(background, "fill-opacity", "0.25");
        diffAndSetAttribute(background, "stroke", "white");
        diffAndSetAttribute(background, "stroke-width", "0.75");
        this.root.appendChild(background);
        for (let i = -4; i <= 4; i++) {
            if (i != 0) {
                let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(circle, "cx", (50 + 10 * i) + '');
                diffAndSetAttribute(circle, "cy", "7.5");
                diffAndSetAttribute(circle, "r", "2");
                diffAndSetAttribute(circle, "fill", "none");
                diffAndSetAttribute(circle, "stroke", "white");
                diffAndSetAttribute(circle, "stroke-width", "0.5");
                this.root.appendChild(circle);
            }
        }
        let centerLine = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(centerLine, "x", "49.75");
        diffAndSetAttribute(centerLine, "y", "0");
        diffAndSetAttribute(centerLine, "width", "0.5");
        diffAndSetAttribute(centerLine, "height", "15");
        diffAndSetAttribute(centerLine, "fill", "white");
        this.root.appendChild(centerLine);
        let autoText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(autoText, "fill", "white");
        diffAndSetAttribute(autoText, "text-anchor", "middle");
        diffAndSetAttribute(autoText, "x", "10");
        diffAndSetAttribute(autoText, "y", "14");
        diffAndSetAttribute(autoText, "font-size", "5");
        diffAndSetAttribute(autoText, "font-family", "Roboto-Bold");
        diffAndSetText(autoText, "AUTO");
        this.root.appendChild(autoText);
        this.scaleText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.scaleText, "fill", "white");
        diffAndSetAttribute(this.scaleText, "text-anchor", "middle");
        diffAndSetAttribute(this.scaleText, "x", "90");
        diffAndSetAttribute(this.scaleText, "y", "14");
        diffAndSetAttribute(this.scaleText, "font-size", "5");
        diffAndSetAttribute(this.scaleText, "font-family", "Roboto-Bold");
        diffAndSetText(this.scaleText, "5NM");
        this.root.appendChild(this.scaleText);
        this.deviationIndicator = document.createElementNS(Avionics.SVG.NS, "polygon");
        diffAndSetAttribute(this.deviationIndicator, "points", "45,12.5 55,12.5 50,2.5");
        diffAndSetAttribute(this.deviationIndicator, "fill", "magenta");
        diffAndSetAttribute(this.deviationIndicator, "stroke", "black");
        diffAndSetAttribute(this.deviationIndicator, "stroke-width", "0.25");
        diffAndSetAttribute(this.deviationIndicator, "transform-origin", "center");
        this.root.appendChild(this.deviationIndicator);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue) {
            return;
        }
        switch (name) {
            case "deviation":
                this.deviation = parseFloat(newValue);
                this.updateDeviation();
                break;
            case "scale":
                this.scale = parseFloat(newValue);
                diffAndSetText(this.scaleText, newValue + "NM");
                this.updateDeviation();
                break;
            case "toFrom":
                if (newValue == "From") {
                    this.isFrom = true;
                }
                else {
                    this.isFrom = false;
                }
                this.updateDeviation();
                break;
            case "active":
                if (newValue == "True") {
                    diffAndSetAttribute(this.deviationIndicator, "visibility", "");
                }
                else {
                    diffAndSetAttribute(this.deviationIndicator, "visibility", "hidden");
                }
                break;
        }
    }
    updateDeviation() {
        diffAndSetAttribute(this.deviationIndicator, "transform", "translate(" + Math.max(-40, Math.min(40, 40 * this.deviation / this.scale)) + ", 0)" + (this.isFrom ? " scale(1,-1)" : ""));
    }
}
customElements.define('glasscockpit-cdi', CDI);
//# sourceMappingURL=CDI.js.map