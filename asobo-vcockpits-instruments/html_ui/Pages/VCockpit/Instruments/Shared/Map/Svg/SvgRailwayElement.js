class SvgRailwayElement extends SvgMapElement {
    constructor() {
        super(...arguments);
        this.ident = "Bdx-Medoc";
    }
    id(map) {
        return "railway-" + this.ident + "-map-" + map.index;
        ;
    }
    createDraw(map) {
        let container = document.createElementNS(Avionics.SVG.NS, "svg");
        container.id = this.id(map);
        diffAndSetAttribute(container, "overflow", "visible");
        let shape = document.createElementNS(Avionics.SVG.NS, "path");
        shape.classList.add("map-railway");
        diffAndSetAttribute(shape, "stroke", map.config.railwayStrokeColor);
        diffAndSetAttribute(shape, "stroke-width", fastToFixed(map.config.railwayWidth / map.overdrawFactor, 0));
        diffAndSetAttribute(shape, "fill", "none");
        container.appendChild(shape);
        let shapeRail = document.createElementNS(Avionics.SVG.NS, "path");
        shapeRail.classList.add("map-railway");
        diffAndSetAttribute(shapeRail, "stroke", map.config.railwayStrokeColor);
        diffAndSetAttribute(shapeRail, "stroke-width", fastToFixed((map.config.railwayWidth / map.overdrawFactor * 3), 0));
        diffAndSetAttribute(shapeRail, "stroke-dasharray", map.config.railwayWidth / map.overdrawFactor + " " + map.config.railwayDashLength / map.overdrawFactor);
        diffAndSetAttribute(shapeRail, "fill", "none");
        container.appendChild(shapeRail);
        return container;
    }
    updateDraw(map) {
        let points = "";
        let pos = new Vec2();
        let s1 = new Vec2();
        let s2 = new Vec2();
        let p1 = null;
        let p2 = null;
        let first = true;
        let prevWasClipped = false;
        for (let i = 0; i < this.path.length; i++) {
            map.coordinatesToXYToRef(this.path[i], pos);
            if (!pos || isNaN(pos.x) || isNaN(pos.y)) {
                continue;
            }
            if (!p1) {
                p1 = pos;
                continue;
            }
            p2 = pos;
            if (p1.x != p2.x || p1.y != p2.y) {
                if (map.segmentVsFrame(p1, p2, s1, s2)) {
                    let x1 = fastToFixed(s1.x, 0);
                    let y1 = fastToFixed(s1.y, 0);
                    let x2 = fastToFixed(s2.x, 0);
                    let y2 = fastToFixed(s2.y, 0);
                    if (first || prevWasClipped) {
                        points += "M" + x1 + " " + y1 + " L" + x2 + " " + y2 + " ";
                    }
                    else {
                        points += "L" + x2 + " " + y2 + " ";
                    }
                    first = false;
                    prevWasClipped = (s2.Equals(p2)) ? false : true;
                }
                else {
                    prevWasClipped = true;
                }
            }
            p1 = p2;
        }
        diffAndSetAttribute(this.svgElement.children[0], "d", points);
        diffAndSetAttribute(this.svgElement.children[1], "d", points);
    }
}
//# sourceMappingURL=SvgRailwayElement.js.map