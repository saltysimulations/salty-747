var EMapRotationMode;
(function (EMapRotationMode) {
    EMapRotationMode[EMapRotationMode["NorthUp"] = 0] = "NorthUp";
    EMapRotationMode[EMapRotationMode["TrackUp"] = 1] = "TrackUp";
    EMapRotationMode[EMapRotationMode["DTKUp"] = 2] = "DTKUp";
    EMapRotationMode[EMapRotationMode["HDGUp"] = 3] = "HDGUp";
    EMapRotationMode[EMapRotationMode["KeepCurrent"] = 4] = "KeepCurrent";
})(EMapRotationMode || (EMapRotationMode = {}));
class SvgMap {
    constructor(_root, arg) {
        this._maxUpdateTime = 0;
        this._lastMaxUpdateTime = 0;
        this._totalUpdateTime = 0;
        this._mediumUpdateTime = 0;
        this._iterations = 0;
        this._iterationsNoReset = 0;
        this.configLoaded = false;
        this.rotationMode = EMapRotationMode.NorthUp;
        this.overdrawFactor = 1;
        this.lineCanvasClipping = new Avionics.Intersect();
        this.mapElements = [];
        this._elementsWithTextBox = [];
        this._previousCenterCoordinates = [];
        this.planeDirection = 0;
        this.planeDirectionRadian = 0;
        this.mapUpDirection = 0;
        this.mapUpDirectionRadian = 0;
        this.mapRightDirection = 0;
        this.planeAltitude = 0;
        this._ratio = 1;
        this._NMWidth = 100;
        this._ftWidth = 0;
        this._angularHeight = 0;
        this._angularWidth = 0;
        this._angularWidthNorth = 0;
        this._angularWidthSouth = 0;
        this._frameClipping = new Avionics.Intersect();
        this._bottomLeftCoordinates = new LatLongAlt();
        this._topRightCoordinates = new LatLongAlt();
        this._lastMapElementsCount = -1;
        this.index = SvgMap.Index;
        console.log("New SvgMap of index " + this.index);
        SvgMap.Index++;
        this.htmlRoot = _root;
        this._planeXY = new Vec2(0.5, 0.5);
        let configPath = "./";
        let elementId = "MapSVG";
        if (typeof (arg) === "string") {
            configPath = arg;
        }
        else if (arg) {
            if (arg.svgElement instanceof Element) {
                this._svgHtmlElement = arg.svgElement;
            }
            else if (typeof (arg.svgElementId) === "string") {
                elementId = arg.svgElementId;
            }
            if (typeof (arg.configPath) === "string") {
                configPath = arg.configPath;
            }
        }
        if (!this._svgHtmlElement) {
            this._svgHtmlElement = _root.querySelector("#" + elementId);
        }
        diffAndSetAttribute(this.svgHtmlElement, "viewBox", "0 0 1000 1000");
        this._frameClipping.initRect(1000, 1000);
        let loadConfig = () => {
            if (typeof (SvgMapConfig) !== "undefined") {
                this.config = new SvgMapConfig();
                this.config.load(configPath, () => {
                    this.configLoaded = true;
                });
            }
            else {
                setTimeout(loadConfig, 200);
            }
        };
        loadConfig();
    }
    get svgHtmlElement() {
        return this._svgHtmlElement;
    }
    get lineCanvas() {
        return this._lineCanvas;
    }
    set lineCanvas(_canvas) {
        this._lineCanvas = _canvas;
        if (_canvas) {
            this.lineCanvasClipping.initRect(_canvas.width, _canvas.height);
        }
    }
    get lastCenterCoordinates() {
        if (this._previousCenterCoordinates.length <= 0)
            return null;
        return this._previousCenterCoordinates[this._previousCenterCoordinates.length - 1];
    }
    get centerCoordinates() {
        if (this._previousCenterCoordinates.length <= 0)
            return null;
        return this._previousCenterCoordinates[0];
    }
    setCenterCoordinates(a, b, c) {
        if (a === undefined) {
            return;
        }
        let lat = NaN;
        let long = NaN;
        if ((a instanceof LatLong) || (a instanceof LatLongAlt) || (typeof (a.lat) === "number" && typeof (a.long) === "number")) {
            lat = a.lat;
            long = a.long;
        }
        else if (typeof (a) === "number" && typeof (b) === "number") {
            if (isFinite(a)) {
                lat = a;
            }
            if (isFinite(b)) {
                long = b;
            }
        }
        if (isFinite(lat) && isFinite(long)) {
            if (!isFinite(c))
                c = 5;
            this._previousCenterCoordinates.push(new LatLong(lat, long));
            while (this._previousCenterCoordinates.length > c) {
                this._previousCenterCoordinates.splice(0, 1);
            }
        }
    }
    get planeCoordinates() {
        return this._planeCoordinates;
    }
    setPlaneCoordinates(a, b, c) {
        if (a === undefined) {
            return false;
        }
        let lat = NaN;
        let long = NaN;
        let smoothness = 0;
        let unsmoothedMove = false;
        if (((a instanceof LatLong) || (a instanceof LatLongAlt)) && (typeof (a.lat) === "number" && typeof (a.long) === "number")) {
            lat = a.lat;
            long = a.long;
            if (isFinite(b)) {
                smoothness = Math.min(1, Math.max(b, 0));
            }
        }
        else if (typeof (a) === "number" && typeof (b) === "number") {
            if (isFinite(a)) {
                lat = a;
            }
            if (isFinite(b)) {
                long = b;
            }
            if (isFinite(c)) {
                smoothness = Math.min(1, Math.max(c, 0));
            }
        }
        if (isFinite(lat) && isFinite(long)) {
            if (!this._planeCoordinates) {
                this._planeCoordinates = new LatLong(lat, long);
            }
            else {
                if (Math.abs(this._planeCoordinates.lat - lat) > 0.01 || Math.abs(this._planeCoordinates.long - long) > 0.01) {
                    this._planeCoordinates.lat = lat;
                    this._planeCoordinates.long = long;
                    if (Math.abs(this._planeCoordinates.lat - lat) > 0.5 || Math.abs(this._planeCoordinates.long - long) > 0.5) {
                        unsmoothedMove = true;
                    }
                }
                else {
                    this._planeCoordinates.lat *= smoothness;
                    this._planeCoordinates.lat += lat * (1 - smoothness);
                    this._planeCoordinates.long *= smoothness;
                    this._planeCoordinates.long += long * (1 - smoothness);
                }
            }
        }
        return unsmoothedMove;
    }
    get NMWidth() {
        return this._NMWidth;
    }
    set NMWidth(v) {
        if (this.NMWidth !== v) {
            this._NMWidth = v;
            this.computeCoordinates();
        }
    }
    setRange(r) {
        if (this._ratio < 1) {
            this.NMWidth = r / this._ratio;
        }
        else {
            this.NMWidth = r * this._ratio;
        }
    }
    computeCoordinates() {
        this._ftWidth = 6076.11 * this._NMWidth;
        if (this.centerCoordinates) {
            let centerCoordinates = this.centerCoordinates;
            this._angularWidth = this._NMWidth / 60 / Math.cos(centerCoordinates.lat * Avionics.Utils.DEG2RAD);
            this._angularHeight = this._NMWidth / 60;
            this._bottomLeftCoordinates.lat = centerCoordinates.lat - this._angularHeight * 0.5;
            this._bottomLeftCoordinates.long = centerCoordinates.long - this._angularWidth * 0.5;
            this._topRightCoordinates.lat = centerCoordinates.lat + this._angularHeight * 0.5;
            this._topRightCoordinates.long = centerCoordinates.long + this._angularWidth * 0.5;
            this._angularWidthNorth = this._NMWidth / 60 / Math.cos(this._topRightCoordinates.lat * Avionics.Utils.DEG2RAD);
            this._angularWidthSouth = this._NMWidth / 60 / Math.cos(this._bottomLeftCoordinates.lat * Avionics.Utils.DEG2RAD);
        }
    }
    get angularWidth() {
        return this._angularWidth;
    }
    get angularHeight() {
        return this._angularHeight;
    }
    get ftWidth() {
        return this._ftWidth;
    }
    get bottomLeftCoordinates() {
        return this._bottomLeftCoordinates;
    }
    get topRightCoordinates() {
        return this._topRightCoordinates;
    }
    update() {
        if (!this.configLoaded) {
            return;
        }
        engine.beginProfileEvent("SvgMap::update");
        engine.beginProfileEvent("onBeforeMapRedraw");
        this.htmlRoot.onBeforeMapRedraw();
        engine.endProfileEvent();
        if (!this.centerCoordinates) {
            engine.endProfileEvent();
            return;
        }
        if (!this.flightPlanLayer) {
            this.flightPlanLayer = document.createElementNS(Avionics.SVG.NS, "g");
            this.svgHtmlElement.appendChild(this.flightPlanLayer);
        }
        if (!this.defaultLayer) {
            this.defaultLayer = document.createElementNS(Avionics.SVG.NS, "g");
            this.svgHtmlElement.appendChild(this.defaultLayer);
        }
        if (!this.textLayer) {
            this.textLayer = document.createElementNS(Avionics.SVG.NS, "g");
            this.svgHtmlElement.appendChild(this.textLayer);
        }
        if (!this.maskLayer) {
            this.maskLayer = document.createElementNS(Avionics.SVG.NS, "g");
            this.svgHtmlElement.appendChild(this.maskLayer);
        }
        if (!this.planeLayer) {
            this.planeLayer = document.createElementNS(Avionics.SVG.NS, "g");
            this.svgHtmlElement.appendChild(this.planeLayer);
        }
        let newPlaneDirectionDeg = Simplane.getHeadingTrue();
        while (newPlaneDirectionDeg < 0) {
            newPlaneDirectionDeg += 360;
        }
        while (newPlaneDirectionDeg >= 360) {
            newPlaneDirectionDeg -= 360;
        }
        this.planeDirection = newPlaneDirectionDeg;
        this.planeDirectionRadian = -this.planeDirection / 180 * Math.PI;
        this.cosPlaneDirection = Math.cos(this.planeDirectionRadian);
        this.sinPlaneDirection = Math.sin(this.planeDirectionRadian);
        switch (this.rotationMode) {
            case EMapRotationMode.KeepCurrent:
                break;
            case EMapRotationMode.DTKUp:
                this.mapUpDirection = SimVar.GetSimVarValue("GPS WP DESIRED TRACK", "degrees");
                break;
            case EMapRotationMode.HDGUp:
                this.mapUpDirection = Simplane.getHeadingTrue();
                break;
            case EMapRotationMode.TrackUp:
                this.mapUpDirection = SimVar.GetSimVarValue("GPS GROUND TRUE TRACK", "degrees");
                break;
            case EMapRotationMode.NorthUp:
            default:
                this.mapUpDirection = 0;
                break;
        }
        while (this.mapUpDirection < 0) {
            this.mapUpDirection += 360;
        }
        while (this.mapUpDirection >= 360) {
            this.mapUpDirection -= 360;
        }
        this.mapUpDirectionRadian = -this.mapUpDirection / 180 * Math.PI;
        this.cosMapUpDirection = Math.cos(this.mapUpDirectionRadian);
        this.sinMapUpDirection = Math.sin(this.mapUpDirectionRadian);
        this.mapRightDirection = this.mapUpDirection - 90;
        while (this.mapRightDirection < 0) {
            this.mapRightDirection += 360;
        }
        let mapRightDirectionRadian = -this.mapRightDirection / 180 * Math.PI;
        this.cosMapRightDirection = Math.cos(mapRightDirectionRadian);
        this.sinMapRightDirection = Math.sin(mapRightDirectionRadian);
        this.planeAltitude = Simplane.getAltitudeAboveGround();
        let w = this.htmlRoot.getWidth();
        let h = this.htmlRoot.getHeight();
        let r = w / h;
        if (isFinite(r) && r > 0) {
            this._ratio = r;
        }
        if (this._lastW !== w || this._lastH !== h) {
            this._lastW = w;
            this._lastH = h;
            this.resize(w, h);
        }
        this.computeCoordinates();
        let t0 = 0;
        if (SvgMap.LOG_PERFS) {
            t0 = performance.now();
        }
        ;
        engine.beginProfileEvent("Mark all elements for deletion");
        for (let i = 0; i < this.planeLayer.children.length; i++) {
            this.planeLayer.children[i]["needDeletion"] = true;
        }
        for (let i = 0; i < this.maskLayer.children.length; i++) {
            this.maskLayer.children[i]["needDeletion"] = true;
        }
        for (let i = 0; i < this.defaultLayer.children.length; i++) {
            this.defaultLayer.children[i]["needDeletion"] = true;
        }
        for (let i = 0; i < this.flightPlanLayer.children.length; i++) {
            this.flightPlanLayer.children[i]["needDeletion"] = true;
        }
        engine.endProfileEvent();
        if (this.lineCanvas) {
            engine.beginProfileEvent("Clear canvas");
            this.lineCanvas.getContext("2d").clearRect(0, 0, this.lineCanvas.width, this.lineCanvas.height);
            engine.endProfileEvent();
        }
        let insertionsCount = this.mapElements.length - this._lastMapElementsCount;
        engine.beginProfileEvent("draw all map elements");
        for (let i = 0; i < this.mapElements.length; i++) {
            let svgElement = this.mapElements[i].draw(this);
            svgElement["needDeletion"] = false;
        }
        engine.endProfileEvent();
        let deletionCount = 0;
        let i = 0;
        engine.beginProfileEvent("recycle plane elements");
        while (i < this.planeLayer.children.length) {
            let e = this.planeLayer.children[i];
            if (e["needDeletion"] === true) {
                this.planeLayer.removeChild(e);
                deletionCount++;
            }
            else {
                i++;
            }
        }
        engine.endProfileEvent();
        i = 0;
        engine.beginProfileEvent("recycle default elements");
        while (i < this.defaultLayer.children.length) {
            let e = this.defaultLayer.children[i];
            if (e["needDeletion"] === true) {
                this.defaultLayer.removeChild(e);
                deletionCount++;
                if (e.getAttribute("hasTextBox") === "true") {
                    let textElement = this.htmlRoot.querySelector("#" + e.id + "-text-" + this.index);
                    if (textElement) {
                        this.textLayer.removeChild(textElement);
                    }
                    let rectElement = this.htmlRoot.querySelector("#" + e.id + "-rect-" + this.index);
                    if (rectElement) {
                        this.textLayer.removeChild(rectElement);
                    }
                }
            }
            else {
                i++;
            }
        }
        engine.endProfileEvent();
        engine.beginProfileEvent("recycle flightPlan elements");
        i = 0;
        while (i < this.flightPlanLayer.children.length) {
            let e = this.flightPlanLayer.children[i];
            if (e["needDeletion"] === true) {
                this.flightPlanLayer.removeChild(e);
                deletionCount++;
            }
            else {
                i++;
            }
        }
        engine.endProfileEvent();
        engine.beginProfileEvent("recycle mask elements");
        i = 0;
        while (i < this.maskLayer.children.length) {
            let e = this.maskLayer.children[i];
            if (e["needDeletion"] === true) {
                this.maskLayer.removeChild(e);
                deletionCount++;
            }
            else {
                i++;
            }
        }
        engine.endProfileEvent();
        if (this.config.preventLabelOverlap) {
            engine.beginProfileEvent("prevent label overlap");
            if (deletionCount > 0 || insertionsCount != 0) {
                this._elementsWithTextBox = [];
                for (let i = 0; i < this.mapElements.length; i++) {
                    let e = this.mapElements[i];
                    if (e instanceof SvgNearestAirportElement) {
                        this._elementsWithTextBox.push(e);
                    }
                    else if (e instanceof SvgWaypointElement) {
                        this._elementsWithTextBox.push(e);
                    }
                    else if (e instanceof SvgConstraintElement) {
                        this._elementsWithTextBox.push(e);
                    }
                }
            }
            if (!this.textManager) {
                this.textManager = new SvgTextManager();
            }
            this.textManager.update(this, this._elementsWithTextBox);
            engine.endProfileEvent();
        }
        if (SvgMap.LOG_PERFS) {
            let dt = performance.now() - t0;
            this._totalUpdateTime += dt;
            this._iterations += 1;
            this._iterationsNoReset += 1;
            this._maxUpdateTime = Math.max(dt, this._maxUpdateTime);
            this._lastMaxUpdateTime = Math.max(dt, this._lastMaxUpdateTime);
            if (this._iterations >= 100) {
                this._mediumUpdateTime = this._totalUpdateTime / this._iterations;
                console.log("Medium Update Time   " + fastToFixed(this._mediumUpdateTime, 3) + " ms");
                console.log("Max Update Time      " + fastToFixed(this._maxUpdateTime, 3) + " ms");
                this._iterations = 0;
                this._totalUpdateTime = 0;
                this._maxUpdateTime = 0;
            }
        }
        engine.endProfileEvent();
    }
    appendChild(mapElement, svgElement) {
        if (mapElement instanceof SvgAirplaneElement) {
            this.planeLayer.appendChild(svgElement);
        }
        else if (mapElement instanceof SvgMaskElement) {
            this.maskLayer.appendChild(svgElement);
        }
        else if (mapElement instanceof SvgFlightPlanElement) {
            this.flightPlanLayer.appendChild(svgElement);
        }
        else if (mapElement instanceof SvgBackOnTrackElement) {
            this.flightPlanLayer.appendChild(svgElement);
        }
        else if (mapElement instanceof SvgWaypointElement) {
            this.defaultLayer.appendChild(svgElement);
            if (mapElement._label) {
                this.textLayer.appendChild(mapElement._label);
            }
            mapElement.needRepaint = true;
        }
        else {
            this.defaultLayer.appendChild(svgElement);
        }
    }
    resize(w, h) {
        console.log("SvgMap Resize : " + w + " " + h);
        let max = Math.max(w, h);
        diffAndSetAttribute(this.svgHtmlElement, "width", fastToFixed(max, 0) + "px");
        diffAndSetAttribute(this.svgHtmlElement, "height", fastToFixed(max, 0) + "px");
        let top = "0px";
        let left = "0px";
        top = fastToFixed(((h - max) - h * (1 - 1 / this.overdrawFactor)) / 2, 0) + "px";
        left = fastToFixed(((w - max) - w * (1 - 1 / this.overdrawFactor)) / 2, 0) + "px";
        this.svgHtmlElement.style.top = top;
        this.svgHtmlElement.style.left = left;
        if (this.lineCanvas) {
            this.lineCanvas.width = w;
            this.lineCanvas.height = h;
            this.lineCanvasClipping.initRect(w, h);
        }
    }
    NMToPixels(distanceInNM) {
        return distanceInNM / this._NMWidth * 1000;
    }
    feetsToPixels(distanceInFeets) {
        return distanceInFeets / this._ftWidth * 1000;
    }
    deltaLatitudeToPixels(deltaLatitude) {
        return deltaLatitude / this._angularHeight * 1000;
    }
    deltaLongitudeToPixels(deltaLongitude) {
        return deltaLongitude / this._angularWidth * 1000;
    }
    deltaLatitudeToNM(deltaLatitude) {
        return deltaLatitude / this._angularHeight * this.NMWidth;
    }
    deltaLongitudeToNM(deltaLongitude) {
        return deltaLongitude / this._angularWidth * this.NMWidth;
    }
    isInFrame(arg, safetyMarginFactor = 0) {
        if (arg && typeof (arg.x) === "number" && typeof (arg.y) === "number") {
            return this.isVec2InFrame(arg, safetyMarginFactor);
        }
        if (arg instanceof LatLong || arg instanceof LatLongAlt) {
            return this.isLatLongInFrame(arg, safetyMarginFactor);
        }
    }
    isVec2InFrame(p, safetyMarginFactor = 0) {
        return p.x >= (0 - 1000 * safetyMarginFactor) && p.y >= (0 - 1000 * safetyMarginFactor) && p.x < (1000 + 1000 * safetyMarginFactor) && p.y < (1000 + 1000 * safetyMarginFactor);
    }
    isLatLongInFrame(ll, safetyMarginFactor = 0) {
        let dLat = this._angularHeight * safetyMarginFactor;
        let dLong = this._angularWidth * safetyMarginFactor;
        return (ll.lat >= this._bottomLeftCoordinates.lat - dLat &&
            ll.long >= this._bottomLeftCoordinates.long - dLong &&
            ll.lat <= this._topRightCoordinates.lat + dLat &&
            ll.long <= this._topRightCoordinates.long + dLong);
    }
    segmentVsFrame(s1, s2, out1, out2) {
        return this._frameClipping.segmentVsRect(s1, s2, out1, out2);
    }
    coordinatesToXY(coordinates) {
        let xy = new Vec2();
        this.coordinatesToXYToRef(coordinates, xy);
        return xy;
    }
    latLongToXYToRef(lat, long, ref) {
        let xNorth = (long - this.centerCoordinates.long) / this._angularWidthNorth * 1000;
        let xSouth = (long - this.centerCoordinates.long) / this._angularWidthSouth * 1000;
        let deltaLat = (lat - this.centerCoordinates.lat) / this._angularHeight;
        let y = -deltaLat * 1000;
        deltaLat += 0.5;
        let x = xNorth * deltaLat + xSouth * (1 - deltaLat);
        if (this.rotationMode != EMapRotationMode.NorthUp) {
            ref.x = x * this.cosMapUpDirection - y * this.sinMapUpDirection + 500;
            ref.y = x * this.sinMapUpDirection + y * this.cosMapUpDirection + 500;
        }
        else {
            ref.x = x + 500;
            ref.y = y + 500;
        }
    }
    coordinatesToXYToRef(coordinates, ref) {
        let xNorth = (coordinates.long - this.centerCoordinates.long) / this._angularWidthNorth * 1000;
        let xSouth = (coordinates.long - this.centerCoordinates.long) / this._angularWidthSouth * 1000;
        let deltaLat = (coordinates.lat - this.centerCoordinates.lat) / this._angularHeight;
        let y = -deltaLat * 1000;
        deltaLat += 0.5;
        let x = xNorth * deltaLat + xSouth * (1 - deltaLat);
        if (this.rotationMode != EMapRotationMode.NorthUp) {
            ref.x = x * this.cosMapUpDirection - y * this.sinMapUpDirection + 500;
            ref.y = x * this.sinMapUpDirection + y * this.cosMapUpDirection + 500;
        }
        else {
            ref.x = x + 500;
            ref.y = y + 500;
        }
    }
    latLongToXYToRefForceCenter(lat, long, ref, forcedCenterCoordinates) {
        let xNorth = (long - forcedCenterCoordinates.long) / this._angularWidthNorth * 1000;
        let xSouth = (long - forcedCenterCoordinates.long) / this._angularWidthSouth * 1000;
        let deltaLat = (lat - forcedCenterCoordinates.lat) / this._angularHeight;
        let y = -deltaLat * 1000;
        deltaLat += 0.5;
        let x = xNorth * deltaLat + xSouth * (1 - deltaLat);
        if (this.rotationMode != EMapRotationMode.NorthUp) {
            ref.x = x * this.cosMapUpDirection - y * this.sinMapUpDirection + 500;
            ref.y = x * this.sinMapUpDirection + y * this.cosMapUpDirection + 500;
        }
        else {
            ref.x = x + 500;
            ref.y = y + 500;
        }
    }
    coordinatesToXYToRefForceCenter(coordinates, ref, forcedCenterCoordinates) {
        let xNorth = (coordinates.long - forcedCenterCoordinates.long) / this._angularWidthNorth * 1000;
        let xSouth = (coordinates.long - forcedCenterCoordinates.long) / this._angularWidthSouth * 1000;
        let deltaLat = (coordinates.lat - forcedCenterCoordinates.lat) / this._angularHeight;
        let y = -deltaLat * 1000;
        deltaLat += 0.5;
        let x = xNorth * deltaLat + xSouth * (1 - deltaLat);
        if (this.rotationMode != EMapRotationMode.NorthUp) {
            ref.x = x * this.cosMapUpDirection - y * this.sinMapUpDirection + 500;
            ref.y = x * this.sinMapUpDirection + y * this.cosMapUpDirection + 500;
        }
        else {
            ref.x = x + 500;
            ref.y = y + 500;
        }
    }
    XYToCoordinates(xy) {
        let lat = this.centerCoordinates.lat - ((xy.y - 500) / 1000) * this._angularHeight;
        let long = this.centerCoordinates.long + ((xy.x - 500) / 1000) * this._angularWidth;
        return new LatLongAlt(lat, long);
    }
    bearingDistanceToXY(bearing, distance) {
        let x = 1000 * (this._planeXY.x + Math.sin(bearing * Avionics.Utils.DEG2RAD) * distance / this.NMWidth);
        let y = 1000 * (this._planeXY.y - Math.cos(bearing * Avionics.Utils.DEG2RAD) * distance / this.NMWidth);
        return { x: x, y: y };
    }
}
SvgMap.Index = 0;
SvgMap.LOG_PERFS = false;
checkAutoload();
//# sourceMappingURL=SvgMap.js.map