class HorizontalCompass extends HTMLElement {
    static get observedAttributes() {
        return [
            "bearing",
            "course-active",
            "course"
        ];
    }
    connectedCallback() {
        this.createSVG();
    }
    createSVG() {
        let width = 288;
        let truncateLeft_Text = this.getAttribute("TruncateLeft");
        let truncateRight_Text = this.getAttribute("TruncateRight");
        let truncateLeft = 0;
        let truncateRight = 0;
        if (truncateLeft_Text) {
            truncateLeft = parseInt(truncateLeft_Text);
            width -= truncateLeft;
        }
        if (truncateRight_Text) {
            truncateRight = parseInt(truncateRight_Text);
            width -= truncateRight;
        }
        let center = (width - truncateLeft + truncateRight) / 2;
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 " + width + " 20");
        this.appendChild(this.root);
        let background = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(background, "x", "0");
        diffAndSetAttribute(background, "y", "0");
        diffAndSetAttribute(background, "width", width + '');
        diffAndSetAttribute(background, "height", "20");
        diffAndSetAttribute(background, "fill", "#1a1d21");
        diffAndSetAttribute(background, "fill-opacity", "0.25");
        this.root.appendChild(background);
        this.movingRibbon = document.createElementNS(Avionics.SVG.NS, "g");
        this.root.appendChild(this.movingRibbon);
        this.digits = [];
        for (let i = -8; i <= 8; i++) {
            let digit = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(digit, "fill", "white");
            diffAndSetAttribute(digit, "text-anchor", "middle");
            diffAndSetAttribute(digit, "x", (center + 20.6 * i) + '');
            diffAndSetAttribute(digit, "y", "16");
            diffAndSetAttribute(digit, "font-size", "8");
            diffAndSetAttribute(digit, "font-family", "Roboto-Bold");
            diffAndSetText(digit, "XXX");
            this.movingRibbon.appendChild(digit);
            this.digits.push(digit);
        }
        for (let i = -80; i <= 80; i++) {
            let rect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(rect, "x", (center - 0.5 + 2.06 * i) + '');
            diffAndSetAttribute(rect, "y", i % 5 == 0 ? "17" : "18.5");
            diffAndSetAttribute(rect, "width", "1");
            diffAndSetAttribute(rect, "height", i % 5 == 0 ? "3" : "1.5");
            diffAndSetAttribute(rect, "fill", "white");
            this.movingRibbon.appendChild(rect);
        }
        this.courseElement = document.createElementNS(Avionics.SVG.NS, "polygon");
        diffAndSetAttribute(this.courseElement, "points", center + ",20 " + (center + 6) + ",16 " + (center + 10) + ",16 " + (center + 10) + ",20 " + (center - 10) + ",20 " + (center - 10) + ",16 " + (center - 6) + ",16");
        diffAndSetAttribute(this.courseElement, "fill", "aqua");
        this.root.appendChild(this.courseElement);
        let bearingBackground = document.createElementNS(Avionics.SVG.NS, "polygon");
        diffAndSetAttribute(bearingBackground, "points", center + ",20 " + (center + 6) + ",16 " + (center + 14) + ",16 " + (center + 14) + ",0 " + (center - 14) + ",0 " + (center - 14) + ",16 " + (center - 6) + ",16");
        diffAndSetAttribute(bearingBackground, "fill", "black");
        this.root.appendChild(bearingBackground);
        this.bearingText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.bearingText, "fill", "white");
        diffAndSetAttribute(this.bearingText, "text-anchor", "middle");
        diffAndSetAttribute(this.bearingText, "x", center + '');
        diffAndSetAttribute(this.bearingText, "y", "13");
        diffAndSetAttribute(this.bearingText, "font-size", "14");
        diffAndSetAttribute(this.bearingText, "font-family", "Roboto-Bold");
        diffAndSetText(this.bearingText, "XXX");
        this.root.appendChild(this.bearingText);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue) {
            return;
        }
        switch (name) {
            case "bearing":
                this.bearing = parseFloat(newValue);
                let roundedBearing = Math.round(this.bearing / 10) * 10;
                let bearingString = Math.round(this.bearing) + '';
                diffAndSetText(this.bearingText, "000".slice(0, 3 - bearingString.length) + bearingString);
                for (let i = -8; i <= 8; i++) {
                    let string = ((roundedBearing + i * 10 + 360) % 360) + '';
                    diffAndSetText(this.digits[i + 8], "000".slice(0, 3 - string.length) + string);
                }
                diffAndSetAttribute(this.movingRibbon, "transform", "translate(" + ((roundedBearing - this.bearing) * 2.06) + ",0)");
                diffAndSetAttribute(this.courseElement, "transform", "translate(" + ((this.course - this.bearing) * 2.06) + ",0)");
                break;
            case "course-active":
                if (newValue == "True") {
                    diffAndSetAttribute(this.courseElement, "visibility", "");
                }
                else {
                    diffAndSetAttribute(this.courseElement, "visibility", "hidden");
                }
                break;
            case "course":
                this.course = parseFloat(newValue);
                diffAndSetAttribute(this.courseElement, "transform", "translate(" + ((this.course - this.bearing) * 2.06) + ",0)");
                break;
        }
    }
}
customElements.define('glasscockpit-horizontal-compass', HorizontalCompass);
//# sourceMappingURL=HorizontalCompass.js.map