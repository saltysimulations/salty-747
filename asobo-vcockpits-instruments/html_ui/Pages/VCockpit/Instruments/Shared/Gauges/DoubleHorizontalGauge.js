class DoubleHorizontalGauge extends HTMLElement {
    constructor() {
        super();
        this.min = NaN;
        this.max = NaN;
        this.lowLimit = NaN;
        this.highLimit = NaN;
        this.redStart = NaN;
        this.redEnd = NaN;
        this.yellowStart = NaN;
        this.yellowEnd = NaN;
        this.greenStart = NaN;
        this.greenEnd = NaN;
        this.graduations = [];
        this.graduationTexts = [];
        this.val1 = 0;
        this.val2 = 0;
        this.gaugeTitle = "";
        this.unit = "";
    }
    static get observedAttributes() {
        return [
            "value",
            "value2",
            "min-value",
            "max-value",
            "limit-low",
            "limit-high",
            "red-start",
            "red-end",
            "yellow-start",
            "yellow-end",
            "green-start",
            "green-end",
            "title",
            "unit",
            "fixed-font-size",
            "cursor-text1",
            "cursor-text2"
        ];
    }
    connectedCallback() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "-7 -10 114 60");
        this.appendChild(this.root);
        let centralLine = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(centralLine, "x", "0");
        diffAndSetAttribute(centralLine, "y", "24");
        diffAndSetAttribute(centralLine, "height", "2");
        diffAndSetAttribute(centralLine, "width", "100");
        diffAndSetAttribute(centralLine, "fill", "white");
        this.root.appendChild(centralLine);
        this.greenElement = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(this.greenElement, "x", "0");
        diffAndSetAttribute(this.greenElement, "y", "22.5");
        diffAndSetAttribute(this.greenElement, "height", "5");
        diffAndSetAttribute(this.greenElement, "width", "0");
        diffAndSetAttribute(this.greenElement, "fill", "green");
        this.root.appendChild(this.greenElement);
        this.yellowElement = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(this.yellowElement, "x", "0");
        diffAndSetAttribute(this.yellowElement, "y", "22.5");
        diffAndSetAttribute(this.yellowElement, "height", "5");
        diffAndSetAttribute(this.yellowElement, "width", "0");
        diffAndSetAttribute(this.yellowElement, "fill", "yellow");
        this.root.appendChild(this.yellowElement);
        this.redElement = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(this.redElement, "x", "0");
        diffAndSetAttribute(this.redElement, "y", "22.5");
        diffAndSetAttribute(this.redElement, "height", "5");
        diffAndSetAttribute(this.redElement, "width", "0");
        diffAndSetAttribute(this.redElement, "fill", "red");
        this.root.appendChild(this.redElement);
        this.cursor1 = document.createElementNS(Avionics.SVG.NS, "g");
        this.root.appendChild(this.cursor1);
        let cursor1Bg = document.createElementNS(Avionics.SVG.NS, "polygon");
        diffAndSetAttribute(cursor1Bg, "points", "0,25 -7,14 7,14");
        diffAndSetAttribute(cursor1Bg, "fill", "white");
        this.cursor1.appendChild(cursor1Bg);
        this.cursor1Text = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.cursor1Text, "x", "0");
        diffAndSetAttribute(this.cursor1Text, "y", "22.5");
        diffAndSetAttribute(this.cursor1Text, "fill", "black");
        diffAndSetAttribute(this.cursor1Text, "font-size", "10");
        diffAndSetAttribute(this.cursor1Text, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.cursor1Text, "text-anchor", "middle");
        diffAndSetText(this.cursor1Text, "R");
        this.cursor1.appendChild(this.cursor1Text);
        this.cursor2 = document.createElementNS(Avionics.SVG.NS, "g");
        this.root.appendChild(this.cursor2);
        let cursor2Bg = document.createElementNS(Avionics.SVG.NS, "polygon");
        diffAndSetAttribute(cursor2Bg, "points", "0,25 -7,36 7,36");
        diffAndSetAttribute(cursor2Bg, "fill", "white");
        this.cursor2.appendChild(cursor2Bg);
        this.cursor2Text = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.cursor2Text, "x", "0");
        diffAndSetAttribute(this.cursor2Text, "y", "35");
        diffAndSetAttribute(this.cursor2Text, "fill", "black");
        diffAndSetAttribute(this.cursor2Text, "font-size", "10");
        diffAndSetAttribute(this.cursor2Text, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.cursor2Text, "text-anchor", "middle");
        diffAndSetText(this.cursor2Text, "L");
        this.cursor2.appendChild(this.cursor2Text);
        this.titleElement = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.titleElement, "x", "0");
        diffAndSetAttribute(this.titleElement, "y", "14");
        diffAndSetAttribute(this.titleElement, "fill", "white");
        diffAndSetAttribute(this.titleElement, "font-size", "10");
        diffAndSetAttribute(this.titleElement, "font-family", "Roboto-Bold");
        diffAndSetText(this.titleElement, "");
        this.root.appendChild(this.titleElement);
    }
    drawArcs() {
        if (!isNaN(this.min) && !isNaN(this.max)) {
            if (!isNaN(this.redStart) && !isNaN(this.redEnd)) {
                let start = this.valueToPosX(this.redStart);
                diffAndSetAttribute(this.redElement, "x", start + '');
                diffAndSetAttribute(this.redElement, "width", (this.valueToPosX(this.redEnd) - start) + '');
            }
            if (!isNaN(this.greenStart) && !isNaN(this.greenEnd)) {
                let start = this.valueToPosX(this.greenStart);
                diffAndSetAttribute(this.greenElement, "x", start + '');
                diffAndSetAttribute(this.greenElement, "width", (this.valueToPosX(this.greenEnd) - start) + '');
            }
            if (!isNaN(this.yellowStart) && !isNaN(this.yellowEnd)) {
                let start = this.valueToPosX(this.yellowStart);
                diffAndSetAttribute(this.yellowElement, "x", start + '');
                diffAndSetAttribute(this.yellowElement, "width", (this.valueToPosX(this.yellowEnd) - start) + '');
            }
            diffAndSetAttribute(this.cursor1, "transform", "translate(" + this.valueToPosX(this.val1) + ",0)");
            diffAndSetAttribute(this.cursor2, "transform", "translate(" + this.valueToPosX(this.val2) + ",0)");
        }
    }
    drawGraduations() {
        for (let i = 0; i < this.graduations.length; i++) {
            this.graduations[i].remove();
            this.graduationTexts[i].remove();
        }
        this.graduations = [];
        this.graduationTexts = [];
        if (!isNaN(this.min) && !isNaN(this.max)) {
            for (let i = Math.ceil(this.min / 10); i <= Math.floor(this.max / 10); i++) {
                let xPos = this.valueToPosX(10 * i);
                let line = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(line, "x", (xPos - 0.5) + '');
                diffAndSetAttribute(line, "y", "20");
                diffAndSetAttribute(line, "height", "10");
                diffAndSetAttribute(line, "width", "1");
                diffAndSetAttribute(line, "fill", "white");
                this.root.appendChild(line);
                this.graduations.push(line);
                let graduationText = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetAttribute(graduationText, "x", xPos + '');
                diffAndSetAttribute(graduationText, "y", "50");
                diffAndSetAttribute(graduationText, "fill", "white");
                diffAndSetAttribute(graduationText, "font-size", "12");
                diffAndSetAttribute(graduationText, "font-family", "Roboto-Bold");
                diffAndSetAttribute(graduationText, "text-anchor", "middle");
                diffAndSetText(graduationText, i == this.max / 10 ? "F" : (10 * i) + '');
                this.root.appendChild(graduationText);
                this.graduationTexts.push(graduationText);
            }
            if (this.max % 10 != 0) {
                let xPos = this.valueToPosX(this.max);
                let line = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(line, "x", (xPos - 0.5) + '');
                diffAndSetAttribute(line, "y", "20");
                diffAndSetAttribute(line, "height", "10");
                diffAndSetAttribute(line, "width", "1");
                diffAndSetAttribute(line, "fill", "white");
                this.root.appendChild(line);
                this.graduations.push(line);
                let graduationText = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetAttribute(graduationText, "x", xPos + '');
                diffAndSetAttribute(graduationText, "y", "50");
                diffAndSetAttribute(graduationText, "fill", "white");
                diffAndSetAttribute(graduationText, "font-size", "12");
                diffAndSetAttribute(graduationText, "font-family", "Roboto-Bold");
                diffAndSetAttribute(graduationText, "text-anchor", "middle");
                diffAndSetText(graduationText, "F");
                this.root.appendChild(graduationText);
                this.graduationTexts.push(graduationText);
            }
        }
    }
    valueToPosX(_value) {
        if (this.min == this.max) {
            return this.min;
        }
        return ((_value - this.min) / (this.max - this.min)) * 100;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "value":
                this.val1 = parseFloat(newValue);
                diffAndSetAttribute(this.cursor1, "transform", "translate(" + this.valueToPosX(newValue) + ",0)");
                break;
            case "value2":
                this.val2 = parseFloat(newValue);
                diffAndSetAttribute(this.cursor2, "transform", "translate(" + this.valueToPosX(newValue) + ",0)");
                break;
            case "min-value":
                this.min = parseFloat(newValue);
                this.drawArcs();
                this.drawGraduations();
                break;
            case "max-value":
                this.max = parseFloat(newValue);
                this.drawArcs();
                this.drawGraduations();
                break;
            case "limit-low":
                break;
            case "limit-high":
                break;
            case "red-start":
                this.redStart = parseFloat(newValue);
                this.drawArcs();
                break;
            case "red-end":
                this.redEnd = parseFloat(newValue);
                this.drawArcs();
                break;
            case "yellow-start":
                this.yellowStart = parseFloat(newValue);
                this.drawArcs();
                break;
            case "yellow-end":
                this.yellowEnd = parseFloat(newValue);
                this.drawArcs();
                break;
            case "green-start":
                this.greenStart = parseFloat(newValue);
                this.drawArcs();
                break;
            case "green-end":
                this.greenEnd = parseFloat(newValue);
                this.drawArcs();
                break;
            case "title":
                this.gaugeTitle = newValue;
                diffAndSetText(this.titleElement, this.gaugeTitle + " " + this.unit);
                break;
            case "unit":
                this.unit = newValue;
                diffAndSetText(this.titleElement, this.gaugeTitle + " " + this.unit);
                break;
        }
    }
}
customElements.define('double-horizontal-gauge', DoubleHorizontalGauge);
//# sourceMappingURL=DoubleHorizontalGauge.js.map