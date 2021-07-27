class FuelRangeCircle extends HTMLElement {
    constructor() {
        super();
        this.offsetX = 0;
        this.offsetY = 0;
    }
    static get observedAttributes() {
        return [
            "offset-x",
            "offset-y",
            "radius-reserve",
            "inner-radius",
            "time-to-reserve"
        ];
    }
    connectedCallback() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        this.group = document.createElementNS(Avionics.SVG.NS, "g");
        this.root.appendChild(this.group);
        this.reserveCircle = document.createElementNS(Avionics.SVG.NS, "circle");
        diffAndSetAttribute(this.reserveCircle, "r", "300");
        diffAndSetAttribute(this.reserveCircle, "cx", "500");
        diffAndSetAttribute(this.reserveCircle, "cy", "500");
        diffAndSetAttribute(this.reserveCircle, "fill", "none");
        diffAndSetAttribute(this.reserveCircle, "stroke", "green");
        diffAndSetAttribute(this.reserveCircle, "stroke-width", "5");
        this.group.appendChild(this.reserveCircle);
        this.innerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
        diffAndSetAttribute(this.innerCircle, "r", "200");
        diffAndSetAttribute(this.innerCircle, "cx", "500");
        diffAndSetAttribute(this.innerCircle, "cy", "500");
        diffAndSetAttribute(this.innerCircle, "stroke", "green");
        diffAndSetAttribute(this.innerCircle, "fill", "none");
        diffAndSetAttribute(this.innerCircle, "stroke-width", "5");
        this.group.appendChild(this.innerCircle);
        let dashSize = 10;
        let perimeter = 2 * Math.PI * 200;
        let angle = 0;
        let id = 0;
        let offset = (360 * 2 * dashSize / perimeter);
        this.innerCircle_dash = new Array();
        while (angle < 360) {
            this.innerCircle_dash.push(document.createElementNS(Avionics.SVG.NS, "rect"));
            diffAndSetAttribute(this.innerCircle_dash[id], "x", "500");
            diffAndSetAttribute(this.innerCircle_dash[id], "y", "297.5");
            diffAndSetAttribute(this.innerCircle_dash[id], "width", dashSize + '');
            diffAndSetAttribute(this.innerCircle_dash[id], "height", "5");
            diffAndSetAttribute(this.innerCircle_dash[id], "fill", "black");
            diffAndSetAttribute(this.innerCircle_dash[id], "transform", "rotate(" + angle + " 500 500)");
            this.group.appendChild(this.innerCircle_dash[id]);
            id++;
            angle += offset;
        }
        this.timeToReserve_BG = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(this.timeToReserve_BG, "x", "460");
        diffAndSetAttribute(this.timeToReserve_BG, "y", "295");
        diffAndSetAttribute(this.timeToReserve_BG, "width", "80");
        diffAndSetAttribute(this.timeToReserve_BG, "height", "20");
        diffAndSetAttribute(this.timeToReserve_BG, "fill", "black");
        diffAndSetAttribute(this.timeToReserve_BG, "stroke", "white");
        diffAndSetAttribute(this.timeToReserve_BG, "stroke-width", "1");
        this.group.appendChild(this.timeToReserve_BG);
        this.timeToReserve_Text = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.timeToReserve_Text, "x", "500");
        diffAndSetAttribute(this.timeToReserve_Text, "y", "310");
        diffAndSetAttribute(this.timeToReserve_Text, "fill", "lime");
        diffAndSetAttribute(this.timeToReserve_Text, "font-size", "15");
        diffAndSetAttribute(this.timeToReserve_Text, "font-family", "Roboto-Bold");
        diffAndSetAttribute(this.timeToReserve_Text, "text-anchor", "middle");
        diffAndSetText(this.timeToReserve_Text, "29h00m");
        this.group.appendChild(this.timeToReserve_Text);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "offset-x":
                this.offsetX = parseFloat(newValue);
                diffAndSetAttribute(this.group, "transform", "translate(" + this.offsetX + " " + this.offsetY + ")");
                break;
            case "offset-y":
                this.offsetY = parseFloat(newValue);
                diffAndSetAttribute(this.group, "transform", "translate(" + this.offsetX + " " + this.offsetY + ")");
                break;
            case "radius-reserve":
                diffAndSetAttribute(this.reserveCircle, "r", newValue);
                break;
            case "inner-radius":
                diffAndSetAttribute(this.innerCircle, "r", newValue);
                let dashSize = 10;
                let perimeter = 2 * Math.PI * parseFloat(newValue);
                let angle = 0;
                let id = 0;
                let offset = (360 * 2 * dashSize / perimeter);
                while (angle < 360) {
                    if (id >= this.innerCircle_dash.length) {
                        this.innerCircle_dash.push(document.createElementNS(Avionics.SVG.NS, "rect"));
                        diffAndSetAttribute(this.innerCircle_dash[id], "x", "500");
                        diffAndSetAttribute(this.innerCircle_dash[id], "width", dashSize + '');
                        diffAndSetAttribute(this.innerCircle_dash[id], "height", "5");
                        diffAndSetAttribute(this.innerCircle_dash[id], "fill", "black");
                    }
                    diffAndSetAttribute(this.innerCircle_dash[id], "y", (500 - parseFloat(newValue) - 2.5) + '');
                    diffAndSetAttribute(this.innerCircle_dash[id], "transform", "rotate(" + angle + " 500 500)");
                    diffAndSetAttribute(this.innerCircle_dash[id], "visibility", "visible");
                    this.group.insertBefore(this.innerCircle_dash[id], this.timeToReserve_BG);
                    id++;
                    angle += offset;
                }
                for (let i = id; i < this.innerCircle_dash.length; i++) {
                    diffAndSetAttribute(this.innerCircle_dash[i], "visibility", "hidden");
                }
                diffAndSetAttribute(this.timeToReserve_BG, "y", (500 - parseFloat(newValue) - 5) + '');
                diffAndSetAttribute(this.timeToReserve_Text, "y", (500 - parseFloat(newValue) + 10) + '');
                break;
            case "time-to-reserve":
                let time = parseFloat(newValue);
                diffAndSetText(this.timeToReserve_Text, (Math.floor(time / 60) + '').padStart(2, "0") + "h" + (Math.floor(time % 60) + '').padStart(2, "0") + "m");
                break;
        }
    }
}
customElements.define('glasscockpit-fuel-range-circle', FuelRangeCircle);
//# sourceMappingURL=FuelRangeCircle.js.map