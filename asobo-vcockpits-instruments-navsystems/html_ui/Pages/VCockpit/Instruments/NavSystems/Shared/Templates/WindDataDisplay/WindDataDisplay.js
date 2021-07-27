class WindDataDisplay extends HTMLElement {
    constructor() {
        super();
    }
    static get observedAttributes() {
        return [
            "wind-mode",
            "wind-direction",
            "wind-strength",
            "wind-true-direction",
        ];
    }
    connectedCallback() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 90 60");
        this.appendChild(this.root);
        this.windDataBackground = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(this.windDataBackground, "x", "0");
        diffAndSetAttribute(this.windDataBackground, "y", "0");
        diffAndSetAttribute(this.windDataBackground, "width", "100%");
        diffAndSetAttribute(this.windDataBackground, "height", "100%");
        diffAndSetAttribute(this.windDataBackground, "fill", "#1a1d21");
        this.root.appendChild(this.windDataBackground);
        {
            this.windDataOptn1 = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(this.windDataOptn1);
            this.o1ArrowX = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(this.o1ArrowX, "d", "M22.5 5 L17.5 15 L21 15 L21 35 L24 35 L24 15 L27.5 15 Z");
            diffAndSetAttribute(this.o1ArrowX, "fill", "white");
            this.windDataOptn1.appendChild(this.o1ArrowX);
            this.o1ArrowY = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(this.o1ArrowY, "d", "M22.5 5 L17.5 15 L21 15 L21 35 L24 35 L24 15 L27.5 15 Z");
            diffAndSetAttribute(this.o1ArrowY, "fill", "white");
            this.windDataOptn1.appendChild(this.o1ArrowY);
            this.o1TextX = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.o1TextX, "");
            diffAndSetAttribute(this.o1TextX, "fill", "white");
            diffAndSetAttribute(this.o1TextX, "x", "50");
            diffAndSetAttribute(this.o1TextX, "y", "25");
            diffAndSetAttribute(this.o1TextX, "font-size", "20");
            diffAndSetAttribute(this.o1TextX, "font-family", "Roboto-Bold");
            this.windDataOptn1.appendChild(this.o1TextX);
            this.o1TextY = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.o1TextY, "");
            diffAndSetAttribute(this.o1TextY, "fill", "white");
            diffAndSetAttribute(this.o1TextY, "x", "22.5");
            diffAndSetAttribute(this.o1TextY, "y", "55");
            diffAndSetAttribute(this.o1TextY, "font-size", "20");
            diffAndSetAttribute(this.o1TextY, "text-anchor", "middle");
            diffAndSetAttribute(this.o1TextY, "font-family", "Roboto-Bold");
            this.windDataOptn1.appendChild(this.o1TextY);
        }
        {
            this.windDataOptn2 = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(this.windDataOptn2);
            this.o2Arrow = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(this.o2Arrow, "d", "M22.5 10 L15 20 L21 20 L21 50 L24 50 L24 20 L30 20 Z");
            diffAndSetAttribute(this.o2Arrow, "fill", "white");
            this.windDataOptn2.appendChild(this.o2Arrow);
            this.o2Text = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.o2Text, "");
            diffAndSetAttribute(this.o2Text, "fill", "white");
            diffAndSetAttribute(this.o2Text, "x", "50");
            diffAndSetAttribute(this.o2Text, "y", "40");
            diffAndSetAttribute(this.o2Text, "font-size", "30");
            diffAndSetAttribute(this.o2Text, "font-family", "Roboto-Bold");
            this.windDataOptn2.appendChild(this.o2Text);
        }
        {
            this.windDataOptn3 = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(this.windDataOptn3);
            this.o3Arrow = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(this.o3Arrow, "d", "M22.5 10 L15 20 L21 20 L21 50 L24 50 L24 20 L30 20 Z");
            diffAndSetAttribute(this.o3Arrow, "fill", "white");
            this.windDataOptn3.appendChild(this.o3Arrow);
            this.o3TextDirection = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.o3TextDirection, "");
            diffAndSetAttribute(this.o3TextDirection, "fill", "white");
            diffAndSetAttribute(this.o3TextDirection, "x", "40");
            diffAndSetAttribute(this.o3TextDirection, "y", "20");
            diffAndSetAttribute(this.o3TextDirection, "font-size", "20");
            diffAndSetAttribute(this.o3TextDirection, "font-family", "Roboto-Bold");
            this.windDataOptn3.appendChild(this.o3TextDirection);
            this.o3TextSpeed = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.o3TextSpeed, "");
            diffAndSetAttribute(this.o3TextSpeed, "fill", "white");
            diffAndSetAttribute(this.o3TextSpeed, "x", "40");
            diffAndSetAttribute(this.o3TextSpeed, "y", "50");
            diffAndSetAttribute(this.o3TextSpeed, "font-size", "20");
            diffAndSetAttribute(this.o3TextSpeed, "font-family", "Roboto-Bold");
            this.windDataOptn3.appendChild(this.o3TextSpeed);
        }
        {
            this.windDataNoData = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(this.windDataNoData);
            let text = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(text, "NO WIND");
            diffAndSetAttribute(text, "fill", "white");
            diffAndSetAttribute(text, "x", "45");
            diffAndSetAttribute(text, "y", "25");
            diffAndSetAttribute(text, "font-size", "17");
            diffAndSetAttribute(text, "font-family", "Roboto-Bold");
            diffAndSetAttribute(text, "text-anchor", "middle");
            this.windDataNoData.appendChild(text);
            let text2 = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(text2, "DATA");
            diffAndSetAttribute(text2, "fill", "white");
            diffAndSetAttribute(text2, "x", "45");
            diffAndSetAttribute(text2, "y", "45");
            diffAndSetAttribute(text2, "font-size", "17");
            diffAndSetAttribute(text2, "font-family", "Roboto-Bold");
            diffAndSetAttribute(text2, "text-anchor", "middle");
            this.windDataNoData.appendChild(text2);
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "wind-mode":
                let bg = "inherit";
                let o1 = "none";
                let o2 = "none";
                let o3 = "none";
                let noData = "none";
                this.displayMode = parseFloat(newValue);
                switch (newValue) {
                    case "0":
                        bg = "none";
                        break;
                    case "1":
                        o1 = "inherit";
                        break;
                    case "2":
                        o2 = "inherit";
                        break;
                    case "3":
                        o3 = "inherit";
                        break;
                    case "4":
                        noData = "inherit";
                        break;
                }
                diffAndSetAttribute(this.windDataBackground, "display", bg);
                diffAndSetAttribute(this.windDataOptn1, "display", o1);
                diffAndSetAttribute(this.windDataOptn2, "display", o2);
                diffAndSetAttribute(this.windDataOptn3, "display", o3);
                diffAndSetAttribute(this.windDataNoData, "display", noData);
                break;
            case "wind-direction":
                diffAndSetAttribute(this.o2Arrow, "transform", "rotate(" + newValue + ", 22.5, 30)");
                diffAndSetAttribute(this.o3Arrow, "transform", "rotate(" + newValue + ", 22.5, 30)");
                this.windDirection = parseFloat(newValue);
                if (this.displayMode == 1) {
                    this.updateO1();
                }
                break;
            case "wind-strength":
                this.windSpeed = parseFloat(newValue);
                diffAndSetText(this.o2Text, fastToFixed(this.windSpeed, 0));
                diffAndSetText(this.o3TextSpeed, fastToFixed(this.windSpeed, 0) + "KT");
                if (this.displayMode == 1) {
                    this.updateO1();
                }
                break;
            case "wind-true-direction":
                diffAndSetText(this.o3TextDirection, fastToFixed(parseFloat(newValue), 0) + "°");
                break;
        }
    }
    updateO1() {
        let velX = this.windSpeed * Math.sin(this.windDirection / 180 * Math.PI);
        let velY = this.windSpeed * Math.cos(this.windDirection / 180 * Math.PI);
        if (velX > 0) {
            diffAndSetAttribute(this.o1ArrowX, "transform", "rotate(90, 22.5, 20)");
        }
        else {
            diffAndSetAttribute(this.o1ArrowX, "transform", "rotate(-90, 22.5, 20)");
        }
        diffAndSetText(this.o1TextX, fastToFixed(Math.abs(velX), 0));
        if (velY > 0) {
            diffAndSetAttribute(this.o1ArrowY, "transform", "rotate(0, 22.5, 20)");
        }
        else {
            diffAndSetAttribute(this.o1ArrowY, "transform", "rotate(180, 22.5, 20)");
        }
        diffAndSetText(this.o1TextY, fastToFixed(Math.abs(velY), 0));
    }
}
customElements.define('glasscockpit-wind-data', WindDataDisplay);
//# sourceMappingURL=WindDataDisplay.js.map