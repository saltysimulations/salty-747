class VerticalSpeedIndicator extends HTMLElement {
    constructor() {
        super();
    }
    static get observedAttributes() {
        return [
            "vspeed"
        ];
    }
    connectedCallback() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 -25 100 550");
        this.appendChild(this.root);
        let background = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(background, "d", "M0 0 L0 500 L75 500 L75 300 L10 250 L75 200 L75 0 Z");
        diffAndSetAttribute(background, "fill", "#1a1d21");
        diffAndSetAttribute(background, "fill-opacity", "0.25");
        this.root.appendChild(background);
        let dashes = [-200, -150, -100, -50, 50, 100, 150, 200];
        let height = 3;
        let width = 10;
        let fontSize = 30;
        for (let i = 0; i < dashes.length; i++) {
            let rect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(rect, "x", "0");
            diffAndSetAttribute(rect, "y", (250 - dashes[i] - height / 2) + '');
            diffAndSetAttribute(rect, "height", height + '');
            diffAndSetAttribute(rect, "width", ((dashes[i] % 100) == 0 ? 2 * width : width) + '');
            diffAndSetAttribute(rect, "fill", "white");
            this.root.appendChild(rect);
            if ((dashes[i] % 100) == 0) {
                let text = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(text, (dashes[i] / 100) + '');
                diffAndSetAttribute(text, "y", ((250 - dashes[i] - height / 2) + fontSize / 3) + '');
                diffAndSetAttribute(text, "x", (3 * width) + '');
                diffAndSetAttribute(text, "fill", "white");
                diffAndSetAttribute(text, "font-size", fontSize + '');
                diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                this.root.appendChild(text);
            }
        }
        {
            this.indicator = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(this.indicator);
            let indicatorBackground = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(indicatorBackground, "d", "M10 250 L35 275 L130 275 L130 225 L35 225 Z");
            diffAndSetAttribute(indicatorBackground, "fill", "#1a1d21");
            this.indicator.appendChild(indicatorBackground);
            this.indicatorText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.indicatorText, "-0000");
            diffAndSetAttribute(this.indicatorText, "x", "35");
            diffAndSetAttribute(this.indicatorText, "y", "260");
            diffAndSetAttribute(this.indicatorText, "fill", "white");
            diffAndSetAttribute(this.indicatorText, "font-size", fontSize + '');
            diffAndSetAttribute(this.indicatorText, "font-family", "Roboto-Bold");
            this.indicator.appendChild(this.indicatorText);
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "vspeed":
                let vSpeed = parseFloat(newValue);
                diffAndSetAttribute(this.indicator, "transform", "translate(0, " + -Math.max(Math.min(vSpeed, 2500), -2500) / 10 + ")");
                diffAndSetText(this.indicatorText, Math.abs(vSpeed) >= 100 ? fastToFixed(vSpeed, 0) : "");
                break;
        }
    }
}
customElements.define('glasscockpit-vertical-speed-indicator', VerticalSpeedIndicator);
//# sourceMappingURL=VerticalSpeedIndicator.js.map