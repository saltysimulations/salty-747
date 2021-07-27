class SvgMaskElement extends SvgMapElement {
    constructor(name) {
        super();
        this.name = name;
        if (!this.name) {
            this.name = fastToFixed((Math.random() * 10), 0).padStart(10, "0");
        }
    }
    id(map) {
        return "mask-" + this.name + "-map-" + map.index;
        ;
    }
    createDraw(map) {
        if (this.createDrawCallback) {
            return this.createDrawCallback(map);
        }
    }
    updateDraw(map) {
    }
}
class SvgBottomMaskElement extends SvgMaskElement {
    constructor(name, offsetX = 0, offsetY = 0) {
        super();
        this.name = name;
        if (!this.name) {
            this.name = fastToFixed((Math.random() * 10), 0).padStart(10, "0");
        }
        this.createDrawCallback = (map) => {
            let rect = document.createElementNS(Avionics.SVG.NS, "rect");
            rect.id = this.id(map);
            diffAndSetAttribute(rect, "x", offsetX + '');
            diffAndSetAttribute(rect, "y", (530 + offsetY) + '');
            diffAndSetAttribute(rect, "width", "1000");
            diffAndSetAttribute(rect, "height", "470");
            diffAndSetAttribute(rect, "fill", "black");
            return rect;
        };
    }
    id(map) {
        return "mask-" + this.name + "-map-" + map.index;
        ;
    }
}
class SvgPlanMaskElement extends SvgMaskElement {
    constructor(name, offsetX = 0, offsetY = 0) {
        super();
        this.name = name;
        if (!this.name) {
            this.name = fastToFixed((Math.random() * 10), 0).padStart(10, "0");
        }
        this.createDrawCallback = (map) => {
            this.path = document.createElementNS(Avionics.SVG.NS, "path");
            this.path.id = this.id(map);
            diffAndSetAttribute(this.path, "x", "0");
            diffAndSetAttribute(this.path, "y", "0");
            diffAndSetAttribute(this.path, "fill", "black");
            diffAndSetAttribute(this.path, "transform", "translate(" + offsetX + " " + offsetY + ")");
            let d = "M 0,0 V 1000 H 1000 V 0 Z m 500,282.07812 c 44.58849,0.034 88.09441,13.74154 124.64648,39.27735 H 774.50781 V 778.27148 H 225.49219 V 321.35547 H 375.64062 C 412.1126,295.87541 455.50922,282.16887 500,282.07812 Z";
            diffAndSetAttribute(this.path, "d", d);
            return this.path;
        };
    }
    offset(offsetX, offsetY) {
        if (this.path)
            diffAndSetAttribute(this.path, "transform", "translate(" + offsetX + " " + offsetY + ")");
    }
    id(map) {
        return "mask-" + this.name + "-map-" + map.index;
        ;
    }
}
//# sourceMappingURL=SvgMaskElement.js.map