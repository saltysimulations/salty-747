class SvgAirlinerPlanElement extends SvgMapElement {
    constructor() {
        super();
    }
    id(map) {
        return "airliner-plan-map-" + map.index;
    }
    createDraw(map) {
        let container = document.createElementNS(Avionics.SVG.NS, "svg");
        container.id = this.id(map);
        diffAndSetAttribute(container, "width", "1");
        diffAndSetAttribute(container, "height", "1");
        diffAndSetAttribute(container, "overflow", "visible");
        this._wideRange = document.createElementNS(Avionics.SVG.NS, "circle");
        diffAndSetAttribute(this._wideRange, "cx", "500");
        diffAndSetAttribute(this._wideRange, "cy", "500");
        diffAndSetAttribute(this._wideRange, "r", "222");
        diffAndSetAttribute(this._wideRange, "fill", "none");
        diffAndSetAttribute(this._wideRange, "stroke", "white");
        diffAndSetAttribute(this._wideRange, "stroke-width", "1");
        container.appendChild(this._wideRange);
        let segCount = 30;
        for (let i = 0; i < segCount; i++) {
            let segment = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(segment, "stroke", "white");
            diffAndSetAttribute(segment, "stroke-width", "1");
            let a1 = 2 * i * 2 * Math.PI / (2 * segCount);
            let a2 = (2 * i + 1) * 2 * Math.PI / (2 * segCount);
            let x1 = 500 + 111 * Math.cos(a1);
            let y1 = 500 + 111 * Math.sin(a1);
            let x2 = 500 + 111 * Math.cos(a2);
            let y2 = 500 + 111 * Math.sin(a2);
            diffAndSetAttribute(segment, "x1", fastToFixed(x1, 0));
            diffAndSetAttribute(segment, "y1", fastToFixed(y1, 0));
            diffAndSetAttribute(segment, "x2", fastToFixed(x2, 0));
            diffAndSetAttribute(segment, "y2", fastToFixed(y2, 0));
            container.appendChild(segment);
        }
        for (let i = 0; i < 4; i++) {
            let a = i * Math.PI / 2;
            let cosa = Math.cos(a);
            let sina = Math.sin(a);
            let polygon = document.createElementNS(Avionics.SVG.NS, "polygon");
            diffAndSetAttribute(polygon, "fill", "white");
            diffAndSetAttribute(polygon, "points", fastToFixed((-10 * cosa - 212 * sina + 500), 0) + "," +
                fastToFixed((-10 * sina + 212 * cosa + 500), 0) + " " +
                fastToFixed((-222 * sina + 500), 0) + "," +
                fastToFixed((222 * cosa + 500), 0) + " " +
                fastToFixed((10 * cosa - 212 * sina + 500), 0) + "," +
                fastToFixed((10 * sina + 212 * cosa + 500), 0) + " ");
            container.appendChild(polygon);
        }
        let northMark = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(northMark, "x", "500");
        diffAndSetAttribute(northMark, "y", "310");
        diffAndSetAttribute(northMark, "text-anchor", "middle");
        diffAndSetAttribute(northMark, "fill", "white");
        diffAndSetAttribute(northMark, "font-size", "20");
        diffAndSetText(northMark, "N");
        container.appendChild(northMark);
        let eastMark = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(eastMark, "x", "700");
        diffAndSetAttribute(eastMark, "y", "505");
        diffAndSetAttribute(eastMark, "text-anchor", "middle");
        diffAndSetAttribute(eastMark, "fill", "white");
        diffAndSetAttribute(eastMark, "font-size", "20");
        diffAndSetText(eastMark, "E");
        container.appendChild(eastMark);
        let southMark = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(southMark, "x", "500");
        diffAndSetAttribute(southMark, "y", "705");
        diffAndSetAttribute(southMark, "text-anchor", "middle");
        diffAndSetAttribute(southMark, "fill", "white");
        diffAndSetAttribute(southMark, "font-size", "20");
        diffAndSetText(southMark, "S");
        container.appendChild(southMark);
        let westMark = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(westMark, "x", "300");
        diffAndSetAttribute(westMark, "y", "505");
        diffAndSetAttribute(westMark, "text-anchor", "middle");
        diffAndSetAttribute(westMark, "fill", "white");
        diffAndSetAttribute(westMark, "font-size", "20");
        diffAndSetText(westMark, "W");
        container.appendChild(westMark);
        return container;
    }
    updateDraw(map) {
    }
}
//# sourceMappingURL=SvgAirlinerElement.js.map