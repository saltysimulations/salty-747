class ElevatorTrim extends HTMLElement {
    constructor() {
        super();
    }
    static get observedAttributes() {
        return [
            "trim"
        ];
    }
    connectedCallback() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 30 100");
        this.appendChild(this.root);
        let background = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(background, "x", "0");
        diffAndSetAttribute(background, "y", "0");
        diffAndSetAttribute(background, "width", "30");
        diffAndSetAttribute(background, "height", "100");
        diffAndSetAttribute(background, "fill", "#1a1d21");
        diffAndSetAttribute(background, "fill-opacity", "0.25");
        this.root.appendChild(background);
        let leftbar = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(leftbar, "x", "3");
        diffAndSetAttribute(leftbar, "y", "20");
        diffAndSetAttribute(leftbar, "height", "60");
        diffAndSetAttribute(leftbar, "width", "2");
        diffAndSetAttribute(leftbar, "fill", "white");
        this.root.appendChild(leftbar);
        let topBar = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(topBar, "x", "3");
        diffAndSetAttribute(topBar, "y", "20");
        diffAndSetAttribute(topBar, "height", "2");
        diffAndSetAttribute(topBar, "width", "20");
        diffAndSetAttribute(topBar, "fill", "white");
        this.root.appendChild(topBar);
        let bottomBar = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(bottomBar, "x", "3");
        diffAndSetAttribute(bottomBar, "y", "78");
        diffAndSetAttribute(bottomBar, "height", "2");
        diffAndSetAttribute(bottomBar, "width", "20");
        diffAndSetAttribute(bottomBar, "fill", "white");
        this.root.appendChild(bottomBar);
        let dnText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(dnText, "x", "6");
        diffAndSetAttribute(dnText, "y", "15");
        diffAndSetAttribute(dnText, "font-family", "Roboto-Bold");
        diffAndSetAttribute(dnText, "font-size", "15");
        diffAndSetAttribute(dnText, "fill", "white");
        diffAndSetText(dnText, "DN");
        this.root.appendChild(dnText);
        let upText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(upText, "x", "6");
        diffAndSetAttribute(upText, "y", "95");
        diffAndSetAttribute(upText, "font-family", "Roboto-Bold");
        diffAndSetAttribute(upText, "font-size", "15");
        diffAndSetAttribute(upText, "fill", "white");
        diffAndSetText(upText, "UP");
        this.root.appendChild(upText);
        this.cursor = document.createElementNS(Avionics.SVG.NS, "g");
        this.root.appendChild(this.cursor);
        let cursorBg = document.createElementNS(Avionics.SVG.NS, "polygon");
        diffAndSetAttribute(cursorBg, "points", "5,50 20,42 20,58");
        diffAndSetAttribute(cursorBg, "fill", "white");
        this.cursor.appendChild(cursorBg);
        let cursorText = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(cursorText, "x", "12");
        diffAndSetAttribute(cursorText, "y", "54");
        diffAndSetAttribute(cursorText, "font-family", "Roboto-Bold");
        diffAndSetAttribute(cursorText, "font-size", "10");
        diffAndSetAttribute(cursorText, "fill", "black");
        diffAndSetText(cursorText, "E");
        this.cursor.appendChild(cursorText);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "trim":
                diffAndSetAttribute(this.cursor, "transform", "translate(0," + (parseFloat(newValue) * 30) + ")");
                break;
        }
    }
}
customElements.define('glasscockpit-elevator-trim', ElevatorTrim);
//# sourceMappingURL=ElevatorTrim.js.map