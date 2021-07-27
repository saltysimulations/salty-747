var CitySize;
(function (CitySize) {
    CitySize[CitySize["Large"] = 0] = "Large";
    CitySize[CitySize["Medium"] = 1] = "Medium";
    CitySize[CitySize["Small"] = 2] = "Small";
})(CitySize || (CitySize = {}));
class SvgCityElement extends SvgMapElement {
    constructor() {
        super();
        this.name = "";
        this.size = 1;
        this._lastX = 0;
        this._lastY = 0;
    }
    id(map) {
        return "city-" + this.name + "-map-" + map.index;
        ;
    }
    imageFileName() {
        let fName = "ICON_MAP_MEDIUM_CITY.svg";
        if (this.size === CitySize.Small) {
            fName = "ICON_MAP_SMALL_CITY.svg";
        }
        else if (this.size === CitySize.Large) {
            fName = "ICON_MAP_LARGE_CITY.svg";
        }
        return fName;
    }
    createDraw(map) {
        let container = document.createElementNS(Avionics.SVG.NS, "svg");
        container.id = this.id(map);
        diffAndSetAttribute(container, "overflow", "visible");
        let text = document.createElementNS(Avionics.SVG.NS, "text");
        text.classList.add("map-city-text");
        diffAndSetText(text, this.name);
        diffAndSetAttribute(text, "text-anchor", "middle");
        diffAndSetAttribute(text, "x", fastToFixed((map.config.cityIconSize / map.overdrawFactor * 0.5), 0));
        diffAndSetAttribute(text, "y", fastToFixed((map.config.cityIconSize / map.overdrawFactor * map.config.cityLabelDistance * 0.5), 0));
        diffAndSetAttribute(text, "fill", map.config.cityLabelColor);
        diffAndSetAttribute(text, "stroke", map.config.cityLabelStrokeColor);
        diffAndSetAttribute(text, "stroke-width", fastToFixed(map.config.cityLabelStrokeWidth / map.overdrawFactor, 0));
        diffAndSetAttribute(text, "font-size", fastToFixed(map.config.cityLabelFontSize / map.overdrawFactor, 0));
        diffAndSetAttribute(text, "font-family", map.config.cityLabelFontFamily);
        container.appendChild(text);
        if (map.config.cityLabelUseBackground) {
            setTimeout(() => {
                let bbox = text.getBBox();
                let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                rect.classList.add("map-city-text-background");
                diffAndSetAttribute(rect, "width", fastToFixed((bbox.width - 4 + map.config.cityLabelBackgroundPaddingRight / map.overdrawFactor + map.config.cityLabelBackgroundPaddingLeft), 0));
                diffAndSetAttribute(rect, "height", fastToFixed(Math.max((bbox.height - 17 + map.config.cityLabelBackgroundPaddingTop / map.overdrawFactor + map.config.cityLabelBackgroundPaddingBottom), 1), 0));
                diffAndSetAttribute(rect, "x", fastToFixed((bbox.x + 4 - map.config.cityLabelBackgroundPaddingLeft), 0));
                diffAndSetAttribute(rect, "y", fastToFixed((bbox.y + 10 - map.config.cityLabelBackgroundPaddingTop), 0));
                diffAndSetAttribute(rect, "fill", map.config.cityLabelBackgroundColor);
                diffAndSetAttribute(rect, "stroke", map.config.cityLabelBackgroundStrokeColor);
                diffAndSetAttribute(rect, "stroke-width", fastToFixed(map.config.cityLabelBackgroundStrokeWidth / map.overdrawFactor, 0));
                container.insertBefore(rect, text);
            }, 0);
        }
        let image;
        image = document.createElementNS(Avionics.SVG.NS, "image");
        image.classList.add("map-city-icon");
        diffAndSetAttribute(image, "width", "100%");
        diffAndSetAttribute(image, "height", "100%");
        image.setAttributeNS("http://www.w3.org/1999/xlink", "href", map.config.imagesDir + this.imageFileName() + "?_= " + new Date().getTime());
        container.appendChild(image);
        diffAndSetAttribute(container, "width", fastToFixed(map.config.cityIconSize / map.overdrawFactor, 0));
        diffAndSetAttribute(container, "height", fastToFixed(map.config.cityIconSize / map.overdrawFactor, 0));
        return container;
    }
    updateDraw(map) {
        map.latLongToXYToRef(this.lat, this.long, this);
        if (isFinite(this.x) && isFinite(this.y)) {
            if (Math.abs(this.x - this._lastX) > 0.1 || Math.abs(this.y - this._lastY) > 0.1) {
                diffAndSetAttribute(this.svgElement, "x", fastToFixed((this.x - map.config.cityIconSize / map.overdrawFactor * 0.5), 1));
                diffAndSetAttribute(this.svgElement, "y", fastToFixed((this.y - map.config.cityIconSize / map.overdrawFactor * 0.5), 2));
                this._lastX = this.x;
                this._lastY = this.y;
            }
        }
    }
}
//# sourceMappingURL=SvgCityElement.js.map