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
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        this.group = document.createElementNS(Avionics.SVG.NS, "g");
        this.root.appendChild(this.group);
        this.reserveCircle = document.createElementNS(Avionics.SVG.NS, "circle");
        this.reserveCircle.setAttribute("r", "300");
        this.reserveCircle.setAttribute("cx", "500");
        this.reserveCircle.setAttribute("cy", "500");
        this.reserveCircle.setAttribute("fill", "none");
        this.reserveCircle.setAttribute("stroke", "green");
        this.reserveCircle.setAttribute("stroke-width", "5");
        this.group.appendChild(this.reserveCircle);
        this.innerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
        this.innerCircle.setAttribute("r", "200");
        this.innerCircle.setAttribute("cx", "500");
        this.innerCircle.setAttribute("cy", "500");
        this.innerCircle.setAttribute("stroke", "green");
        this.innerCircle.setAttribute("fill", "none");
        this.innerCircle.setAttribute("stroke-width", "5");
        this.group.appendChild(this.innerCircle);
        let dashSize = 10;
        let perimeter = 2 * Math.PI * 200;
        let angle = 0;
        let id = 0;
        let offset = (360 * 2 * dashSize / perimeter);
        this.innerCircle_dash = new Array();
        while (angle < 360) {
            this.innerCircle_dash.push(document.createElementNS(Avionics.SVG.NS, "rect"));
            this.innerCircle_dash[id].setAttribute("x", "500");
            this.innerCircle_dash[id].setAttribute("y", "297.5");
            this.innerCircle_dash[id].setAttribute("width", dashSize.toString());
            this.innerCircle_dash[id].setAttribute("height", "5");
            this.innerCircle_dash[id].setAttribute("fill", "black");
            this.innerCircle_dash[id].setAttribute("transform", "rotate(" + angle + " 500 500)");
            this.group.appendChild(this.innerCircle_dash[id]);
            id++;
            angle += offset;
        }
        this.timeToReserve_BG = document.createElementNS(Avionics.SVG.NS, "rect");
        this.timeToReserve_BG.setAttribute("x", "460");
        this.timeToReserve_BG.setAttribute("y", "295");
        this.timeToReserve_BG.setAttribute("width", "80");
        this.timeToReserve_BG.setAttribute("height", "20");
        this.timeToReserve_BG.setAttribute("fill", "black");
        this.timeToReserve_BG.setAttribute("stroke", "white");
        this.timeToReserve_BG.setAttribute("stroke-width", "1");
        this.group.appendChild(this.timeToReserve_BG);
        this.timeToReserve_Text = document.createElementNS(Avionics.SVG.NS, "text");
        this.timeToReserve_Text.setAttribute("x", "500");
        this.timeToReserve_Text.setAttribute("y", "310");
        this.timeToReserve_Text.setAttribute("fill", "lime");
        this.timeToReserve_Text.setAttribute("font-size", "15");
        this.timeToReserve_Text.setAttribute("font-family", "Roboto-Bold");
        this.timeToReserve_Text.setAttribute("text-anchor", "middle");
        this.timeToReserve_Text.textContent = "29h00m";
        this.group.appendChild(this.timeToReserve_Text);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "offset-x":
                this.offsetX = parseFloat(newValue);
                this.group.setAttribute("transform", "translate(" + this.offsetX + " " + this.offsetY + ")");
                break;
            case "offset-y":
                this.offsetY = parseFloat(newValue);
                this.group.setAttribute("transform", "translate(" + this.offsetX + " " + this.offsetY + ")");
                break;
            case "radius-reserve":
                this.reserveCircle.setAttribute("r", newValue);
                break;
            case "inner-radius":
                this.innerCircle.setAttribute("r", newValue);
                let dashSize = 10;
                let perimeter = 2 * Math.PI * parseFloat(newValue);
                let angle = 0;
                let id = 0;
                let offset = (360 * 2 * dashSize / perimeter);
                while (angle < 360) {
                    if (id >= this.innerCircle_dash.length) {
                        this.innerCircle_dash.push(document.createElementNS(Avionics.SVG.NS, "rect"));
                        this.innerCircle_dash[id].setAttribute("x", "500");
                        this.innerCircle_dash[id].setAttribute("width", dashSize.toString());
                        this.innerCircle_dash[id].setAttribute("height", "5");
                        this.innerCircle_dash[id].setAttribute("fill", "black");
                    }
                    this.innerCircle_dash[id].setAttribute("y", (500 - parseFloat(newValue) - 2.5).toString());
                    this.innerCircle_dash[id].setAttribute("transform", "rotate(" + angle + " 500 500)");
                    this.innerCircle_dash[id].setAttribute("visibility", "visible");
                    this.group.insertBefore(this.innerCircle_dash[id], this.timeToReserve_BG);
                    id++;
                    angle += offset;
                }
                for (let i = id; i < this.innerCircle_dash.length; i++) {
                    this.innerCircle_dash[i].setAttribute("visibility", "hidden");
                }
                this.timeToReserve_BG.setAttribute("y", (500 - parseFloat(newValue) - 5).toString());
                this.timeToReserve_Text.setAttribute("y", (500 - parseFloat(newValue) + 10).toString());
                break;
            case "time-to-reserve":
                let time = parseFloat(newValue);
                this.timeToReserve_Text.textContent = Math.floor(time / 60).toString().padStart(2, "0") + "h" + Math.floor(time % 60).toString().padStart(2, "0") + "m";
                break;
        }
    }
}
customElements.define('glasscockpit-fuel-range-circle', FuelRangeCircle);
//# sourceMappingURL=FuelRangeCircle.js.map