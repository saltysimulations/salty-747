class SvgAirportElement extends SvgMapElement {
    constructor() {
        super();
        this._tmpCenter = new Vec2();
    }
    get ident() {
        if (this._ident) {
            return this._ident;
        }
        if (this.source) {
            return this.source.ident;
        }
    }
    set ident(v) {
        this._ident = v;
    }
    get icao() {
        if (this._icao) {
            return this._icao;
        }
        if (this.source) {
            return this.source.icao;
        }
    }
    set icao(v) {
        this._icao = v;
    }
    get coordinates() {
        if (this._coordinates) {
            return this._coordinates;
        }
        if (this.source) {
            return this.source.coordinates;
        }
    }
    set coordinates(v) {
        this._coordinates = v;
    }
    get runways() {
        if (this._runways) {
            return this._runways;
        }
        if (this.source) {
            return this.source.runways;
        }
    }
    set runways(v) {
        this._runways = v;
    }
    id(map) {
        return "airport-" + this.icao + "-map-" + map.index;
    }
    createDraw(map) {
        let container = document.createElementNS(Avionics.SVG.NS, "svg");
        container.id = this.id(map);
        diffAndSetAttribute(container, "overflow", "visible");
        return container;
    }
    updateDraw(map) {
        console.log(this.runways.length);
        for (let i = 0; i < this.runways.length; i++) {
            let rectStroke = this.svgElement.children[i];
            if (!rectStroke) {
                rectStroke = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(rectStroke, "stroke-width", fastToFixed(map.config.runwayStrokeWidth / map.overdrawFactor, 0));
                this.svgElement.appendChild(rectStroke);
            }
            diffAndSetAttribute(rectStroke, "stroke", map.config.runwayStrokeColor);
            diffAndSetAttribute(rectStroke, "rx", fastToFixed(map.config.runwayCornerRadius / map.overdrawFactor, 0));
            diffAndSetAttribute(rectStroke, "ry", fastToFixed(map.config.runwayCornerRadius / map.overdrawFactor, 0));
        }
        for (let i = 0; i < this.runways.length; i++) {
            let runway = this.runways[i];
            let rectStroke = this.svgElement.children[i];
            let rectNoStroke = this.svgElement.children[i + this.runways.length];
            if (!rectNoStroke) {
                rectNoStroke = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(rectNoStroke, "stroke-width", fastToFixed(map.config.runwayStrokeWidth / map.overdrawFactor, 0));
                this.svgElement.appendChild(rectNoStroke);
            }
            diffAndSetAttribute(rectNoStroke, "fill", map.config.runwayFillColor);
            diffAndSetAttribute(rectNoStroke, "stroke", "none");
            diffAndSetAttribute(rectNoStroke, "rx", fastToFixed(map.config.runwayCornerRadius / map.overdrawFactor, 0));
            diffAndSetAttribute(rectNoStroke, "ry", fastToFixed(map.config.runwayCornerRadius / map.overdrawFactor, 0));
            map.coordinatesToXYToRef(new LatLongAlt(runway.latitude, runway.longitude), this._tmpCenter);
            let l = map.feetsToPixels(runway.length);
            let w = Math.max(map.feetsToPixels(runway.width), map.config.runwayMinimalWidth / map.overdrawFactor);
            let x = fastToFixed((this._tmpCenter.x - w * 0.5), 0);
            let y = fastToFixed((this._tmpCenter.y - l * 0.5), 0);
            let width = fastToFixed(w, 0);
            let height = fastToFixed(l, 0);
            let transform = "rotate(" +
                fastToFixed((runway.direction), 0) + " " +
                fastToFixed((this._tmpCenter.x), 0) + " " +
                fastToFixed((this._tmpCenter.y), 0) + ")";
            diffAndSetAttribute(rectStroke, "x", "" + x);
            diffAndSetAttribute(rectStroke, "y", "" + y);
            diffAndSetAttribute(rectStroke, "width", "" + width);
            diffAndSetAttribute(rectStroke, "height", "" + height);
            diffAndSetAttribute(rectStroke, "transform", transform);
            diffAndSetAttribute(rectNoStroke, "x", "" + x);
            diffAndSetAttribute(rectNoStroke, "y", "" + y);
            diffAndSetAttribute(rectNoStroke, "width", "" + width);
            diffAndSetAttribute(rectNoStroke, "height", "" + height);
            diffAndSetAttribute(rectNoStroke, "transform", transform);
        }
        while (this.svgElement.children.length > this.runways.length * 2) {
            this.svgElement.removeChild(this.svgElement.lastElementChild);
        }
    }
}
//# sourceMappingURL=SvgAirportElement.js.map