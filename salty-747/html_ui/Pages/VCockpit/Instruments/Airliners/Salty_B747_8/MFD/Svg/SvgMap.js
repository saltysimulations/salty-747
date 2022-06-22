class SvgMap {
    constructor(_root, arg) {
        this._maxUpdateTime = 0;
        this._lastMaxUpdateTime = 0;
        this._mediumUpdateTime = 0;
        this._iterations = 0;
        this.configLoaded = false;
        this.rotateWithPlane = false;
        this.mapElements = [];

        // this.textManager = new SvgTextManager(this);
        this.elementsWithTextBox = new Set();

        this.svgLayersToUpdate = [];

        this._previousCenterCoordinates = [];
        this.planeDirection = 0;
        this.planeDirectionRadian = 0;
        this.planeAltitude = 0;
        this._ratio = 1;
        this._NMWidth = 100;
        this._ftWidth = 0;
        this._angularHeight = 0;
        this._angularWidth = 0;
        this._angularWidthNorth = 0;
        this._angularWidthSouth = 0;
        this._bottomLeftCoordinates = new LatLongAlt();
        this._topRightCoordinates = new LatLongAlt();
        this.index = SvgMap.Index;
        console.log("New SvgMap of index " + this.index);
        SvgMap.Index++;
        this.htmlRoot = _root;
        this.planeXY = new Vec2(0.5, 0.5);

        this.cosRotation = 1;   // cosine of rotation, mainly for internal use
        this.sinRotation = 0;   // sine of rotation, mainly for internal use

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
        this.svgHtmlElement.setAttribute("viewBox", "0 0 1000 1000");

        this.cityLayer = document.createElementNS(Avionics.SVG.NS, "svg");
        this.svgHtmlElement.appendChild(this.cityLayer);
        this.svgLayersToUpdate.push(this.cityLayer);

        /* Construct Altitude Range Arc */
        this.greenArc = document.createElementNS(Avionics.SVG.NS, "path");
        this.greenArc.setAttribute("d", "M 425 510, Q 500 460, 575 510")
        this.greenArc.setAttribute("stroke", "lime");
        this.greenArc.setAttribute("stroke-width", "2.5px");
        this.greenArc.setAttribute("fill", "transparent");
        this.svgHtmlElement.appendChild(this.greenArc);

        /* Construct Track Line */
        this.trackLineGroup = document.createElementNS(Avionics.SVG.NS, "g");
        this.svgHtmlElement.appendChild(this.trackLineGroup);
        this.trackline = document.createElementNS(Avionics.SVG.NS, "line");
        this.trackline.setAttribute("x1", "500");
        this.trackline.setAttribute("x2", "500");
        this.trackline.setAttribute("y1", "342");
        this.trackline.setAttribute("y2", "0");
        this.trackline.setAttribute("stroke", "white");
        this.trackline.setAttribute("stroke-width", "2.5px");
        this.trackLineGroup.appendChild(this.trackline);
        this.trackLineMarker1 = document.createElementNS(Avionics.SVG.NS, "line");
        this.trackLineMarker1.setAttribute("x1", "494");
        this.trackLineMarker1.setAttribute("x2", "506");
        this.trackLineMarker1.setAttribute("y1", "139");
        this.trackLineMarker1.setAttribute("y2", "139");
        this.trackLineMarker1.setAttribute("stroke", "white");
        this.trackLineMarker1.setAttribute("stroke-width", "2.5px");
        this.trackLineGroup.appendChild(this.trackLineMarker1);
        this.trackLineMarker2 = document.createElementNS(Avionics.SVG.NS, "line");
        this.trackLineMarker2.setAttribute("x1", "494");
        this.trackLineMarker2.setAttribute("x2", "506");
        this.trackLineMarker2.setAttribute("y1", "254");
        this.trackLineMarker2.setAttribute("y2", "254");
        this.trackLineMarker2.setAttribute("stroke", "white");
        this.trackLineMarker2.setAttribute("stroke-width", "2.5px");
        this.trackLineGroup.appendChild(this.trackLineMarker2);
        this.trackLineMarker3 = document.createElementNS(Avionics.SVG.NS, "line");
        this.trackLineMarker3.setAttribute("x1", "494");
        this.trackLineMarker3.setAttribute("x2", "506");
        this.trackLineMarker3.setAttribute("y1", "370");
        this.trackLineMarker3.setAttribute("y2", "370");
        this.trackLineMarker3.setAttribute("stroke", "white");
        this.trackLineMarker3.setAttribute("stroke-width", "2.5px");
        this.trackLineGroup.appendChild(this.trackLineMarker3);
        this.halfRangeText = document.createElementNS(Avionics.SVG.NS, "text");
        this.halfRangeText.setAttribute("x", "490");
        this.halfRangeText.setAttribute("y", "250");
        this.halfRangeText.setAttribute("stroke", "white");
        this.halfRangeText.setAttribute("fill", "white");
        this.halfRangeText.setAttribute("font-size", "23px");
        this.halfRangeText.setAttribute("text-anchor", "end");
        this.halfRangeText.textContent = "80";
        this.trackLineGroup.appendChild(this.halfRangeText);

        /* Construct Turn Prediction Arc */
        this.turnArc = document.createElementNS(Avionics.SVG.NS, "path");
        this.turnArc.setAttribute("d", "M 500, 400 a 100,100 0 1,1 200,0 a 100,100 0 1,1 -200,0 ");
        this.turnArc.setAttribute("stroke", "white");
        this.turnArc.setAttribute("stroke-width", "3px");
        this.turnArc.setAttribute("fill", "none");
        this.turnArc.setAttribute("stroke-dasharray", "40 8 40 8 40 30000");
        this.trackLineGroup.appendChild(this.turnArc);

        /* End Salty Mods */

        this.flightPlanLayer = document.createElementNS(Avionics.SVG.NS, "svg");
        this.svgHtmlElement.appendChild(this.flightPlanLayer);
        this.svgLayersToUpdate.push(this.flightPlanLayer);

        this.defaultLayer = document.createElementNS(Avionics.SVG.NS, "svg");
        this.svgHtmlElement.appendChild(this.defaultLayer);
        this.svgLayersToUpdate.push(this.defaultLayer);

        this.textLayer = document.createElementNS(Avionics.SVG.NS, "svg");
        this.svgHtmlElement.appendChild(this.textLayer);

        this.trackVectorLayer = document.createElementNS(Avionics.SVG.NS, "svg");
        this.svgHtmlElement.appendChild(this.trackVectorLayer);
        this.svgLayersToUpdate.push(this.trackVectorLayer);

        this.altitudeInterceptLayer = document.createElementNS(Avionics.SVG.NS, "svg");
        this.svgHtmlElement.appendChild(this.altitudeInterceptLayer);
        this.svgLayersToUpdate.push(this.altitudeInterceptLayer);

        // this.fuelRingLayer = document.createElementNS(Avionics.SVG.NS, "svg");
        // this.svgHtmlElement.appendChild(this.fuelRingLayer);
        // this.svgLayersToUpdate.push(this.fuelRingLayer);

        // this.rangeRingLayer = document.createElementNS(Avionics.SVG.NS, "svg");
        // this.svgHtmlElement.appendChild(this.rangeRingLayer);
        // this.svgLayersToUpdate.push(this.rangeRingLayer);

        // this.maskLayer = document.createElementNS(Avionics.SVG.NS, "svg");
        // this.svgHtmlElement.appendChild(this.maskLayer);
        // this.svgLayersToUpdate.push(this.maskLayer);

        this.planeLayer = document.createElementNS(Avionics.SVG.NS, "svg");
        this.svgHtmlElement.appendChild(this.planeLayer);
        this.svgLayersToUpdate.push(this.planeLayer);

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

    // MOD: width / height
    get aspectRatio() {
        return this._ratio;
    }

    get NMWidth() {
        return this._NMWidth;
    }

    // MOD: get the width in NM along the short axis of the map
    get NMWidthShort() {
        return this._NMWidth * Math.min(this._ratio, 1 / this._ratio);
    }

    set NMWidth(v) {
        if (this.NMWidth !== v) {
            this._NMWidth = v;
            this.computeCoordinates();
        }
    }

    setRange(r) {
        this.NMWidth = r;
    }

    // MOD: convenience methods that just pass through to MapInstrument
    get rotation() {
        return this.htmlRoot.rotation;
    }

    get overdrawFactor() {
        return this.htmlRoot.overdrawFactor;
    }

    get minVisibleX() {
        return this.htmlRoot.minVisibleX;
    }

    get maxVisibleX() {
        return this.htmlRoot.maxVisibleX;
    }

    get minVisibleY() {
        return this.htmlRoot.minVisibleY;
    }

    get maxVisibleY() {
        return this.htmlRoot.maxVisibleY;
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
        this.htmlRoot.onBeforeMapRedraw();
        if (!this.centerCoordinates) {
            return;
        }

        this.planeDirection = SimVar.GetSimVarValue("PLANE HEADING DEGREES TRUE", "degree") % 360;

        this.cosRotation = Math.cos(this.rotation * Math.PI / 180);
        this.sinRotation = Math.sin(this.rotation * Math.PI / 180);
        this.planeAltitude = SimVar.GetSimVarValue("PLANE ALT ABOVE GROUND", "feet");


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
        for (let svgLayer of this.svgLayersToUpdate) {
            for (let child of svgLayer.children) {
                child.setAttribute("needDeletion", "true");
            }
        }

        if (this.lineCanvas) {
            this.lineCanvas.getContext("2d").clearRect(0, 0, this.lineCanvas.width, this.lineCanvas.height);
        }

        let newElementsWithTextBox = new Set();
        for (let i = 0; i < this.mapElements.length; i++) {
            let svgElement = this.mapElements[i].draw(this);
            svgElement.setAttribute("needDeletion", "false");

            // if (this.mapElements[i].hasTextBox) {
            //     this.mapElements[i].getLabelElement().draw(this);
            // }
        }
        for (let svgLayer of this.svgLayersToUpdate) {
            let i = 0;
            while (i < svgLayer.children.length) {
                let e = svgLayer.children[i];
                if (e.getAttribute("needDeletion") === "true") {
                    svgLayer.removeChild(e);
                } else {
                    i++;
                }
            }
        }

        // let toRemove = [];
        // for (let e of this.elementsWithTextBox) {
        //     if (newElementsWithTextBox.has(e)) {
        //         newElementsWithTextBox.delete(e);
        //     } else {
        //         toRemove.push(e);
        //     }
        // }
        // for (let e of toRemove) {
        //     this.textManager.remove(e);
        //     this.elementsWithTextBox.delete(e);
        // }
        // for (let e of newElementsWithTextBox) {
        //     this.elementsWithTextBox.add(e);
        //     this.textManager.add(e);
        // }

        // this.textManager.update();

        if (SvgMap.LOG_PERFS) {
            let dt = performance.now() - t0;
            this._iterations += 1;
            this._mediumUpdateTime *= 99 / 100;
            this._mediumUpdateTime += dt / 100;
            this._maxUpdateTime = Math.max(dt, this._maxUpdateTime);
            this._lastMaxUpdateTime = Math.max(dt, this._lastMaxUpdateTime);
            if (this._iterations >= 60) {
                console.log("-----------------------------------------------");
                console.log("Medium Update Time   " + this._mediumUpdateTime.toFixed(3) + " ms");
                console.log("Last Max Update Time " + this._lastMaxUpdateTime.toFixed(3) + " ms");
                console.log("Max Update Time      " + this._maxUpdateTime.toFixed(3) + " ms");
                console.log("-----------------------------------------------");
                this._lastMaxUpdateTime = 0;
                this._iterations = 0;
                SvgMapElement.logPerformances();
            }
        }
        this.updateTrackLineAndArc();
    }

    appendChild(_svgElement, _svgLayer = null) {
        if (!_svgLayer) {
            _svgLayer = this.defaultLayer;
        }
        _svgLayer.appendChild(_svgElement);
    }

    resize(w, h) {
        console.log("SvgMap Resize : " + w + " " + h);
        let max = Math.max(w, h);
        this.svgHtmlElement.setAttribute("width", fastToFixed(max, 0) + "px");
        this.svgHtmlElement.setAttribute("height", fastToFixed(max, 0) + "px");
        let top = "0px";
        let left = "0px";
        if (h < max) {
            top = fastToFixed((h - max) / 2, 0) + "px";
        }
        if (w < max) {
            left = fastToFixed((w - max) / 2, 0) + "px";
        }
        this.svgHtmlElement.style.top = top;
        this.svgHtmlElement.style.left = left;
        this.lineCanvas.width = w;
        this.lineCanvas.height = h;
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

    isSegmentInFrame(s1, s2) {
        if (isNaN(s1.x) || isNaN(s1.y) || isNaN(s2.x) || isNaN(s2.y)) {
            return false;
        }
        if (Math.min(s1.x, s2.x) > 1000) {
            return false;
        }
        if (Math.max(s1.x, s2.x) < 0) {
            return false;
        }
        if (Math.min(s1.y, s2.y) > 1000) {
            return false;
        }
        if (Math.max(s1.y, s2.y) < 0) {
            return false;
        }
        return true;
    }

    coordinatesToXY(coordinates) {
        let xy = new Vec2();
        this.coordinatesToXYToRef(coordinates, xy);
        return xy;
    }

    coordinatesToXYForceCenterRotation(coordinates, center, rotation) {
        let xy = new Vec2();
        this.coordinatesToXYToRefForceCenterRotation(coordinates, xy, center, rotation);
        return xy;
    }

    latLongToXYToRef(lat, long, ref) {
        let xNorth = (long - this.centerCoordinates.long) / this._angularWidthNorth * 1000;
        let xSouth = (long - this.centerCoordinates.long) / this._angularWidthSouth * 1000;
        let deltaLat = (lat - this.centerCoordinates.lat) / this._angularHeight;
        let y = -deltaLat * 1000;
        deltaLat += 0.5;
        let x = xNorth * deltaLat + xSouth * (1 - deltaLat);
        ref.x = x * this.cosRotation - y * this.sinRotation + 500;
        ref.y = x * this.sinRotation + y * this.cosRotation + 500;
    }

    coordinatesToXYToRef(coordinates, ref) {
        let xNorth = (coordinates.long - this.centerCoordinates.long) / this._angularWidthNorth * 1000;
        let xSouth = (coordinates.long - this.centerCoordinates.long) / this._angularWidthSouth * 1000;
        let deltaLat = (coordinates.lat - this.centerCoordinates.lat) / this._angularHeight;
        let y = -deltaLat * 1000;
        deltaLat += 0.5;
        let x = xNorth * deltaLat + xSouth * (1 - deltaLat);
        ref.x = x * this.cosRotation - y * this.sinRotation + 500;
        ref.y = x * this.sinRotation + y * this.cosRotation + 500;
    }

    latLongToXYToRefForceCenter(lat, long, ref, forcedCenterCoordinates) {
        let xNorth = (long - forcedCenterCoordinates.long) / this._angularWidthNorth * 1000;
        let xSouth = (long - forcedCenterCoordinates.long) / this._angularWidthSouth * 1000;
        let deltaLat = (lat - forcedCenterCoordinates.lat) / this._angularHeight;
        let y = -deltaLat * 1000;
        deltaLat += 0.5;
        let x = xNorth * deltaLat + xSouth * (1 - deltaLat);
        ref.x = x * this.cosRotation - y * this.sinRotation + 500;
        ref.y = x * this.sinRotation + y * this.cosRotation + 500;
    }

    coordinatesToXYToRefForceCenter(coordinates, ref, center) {
        return coordinatesToXYToRefForceCenterRotation(coordinates, ref, center, this.rotation);
    }

    coordinatesToXYToRefForceCenterRotation(coordinates, ref, center, rotation) {
        let xNorth = (coordinates.long - center.long) / this._angularWidthNorth * 1000;
        let xSouth = (coordinates.long - center.long) / this._angularWidthSouth * 1000;
        let deltaLat = (coordinates.lat - center.lat) / this._angularHeight;
        let y = -deltaLat * 1000;
        deltaLat += 0.5;
        let x = xNorth * deltaLat + xSouth * (1 - deltaLat);
        let sinRotation = Math.sin(rotation * Avionics.Utils.DEG2RAD);
        let cosRotation = Math.cos(rotation * Avionics.Utils.DEG2RAD);
        ref.x = x * cosRotation - y * sinRotation + 500;
        ref.y = x * sinRotation + y * cosRotation + 500;
    }

    XYToCoordinates(xy) {
        let lat = this.centerCoordinates.lat - ((xy.y - 500) / 1000) * this._angularHeight;
        let long = this.centerCoordinates.long + ((xy.x - 500) / 1000) * this._angularWidth;
        return new LatLongAlt(lat, long);
    }

    bearingDistanceToXY(bearing, distance) {
        let x = 1000 * (this.planeXY.x + Math.sin(bearing * Avionics.Utils.DEG2RAD) * distance / this.NMWidth);
        let y = 1000 * (this.planeXY.y - Math.cos(bearing * Avionics.Utils.DEG2RAD) * distance / this.NMWidth);
        return { x: x, y: y };
    }

    // MOD: convenience method to return X,Y coordinates of plane
    getPlanePositionXY() {
        return this.coordinatesToXY(this.planeCoordinates);
    }

    // MOD: returns lat/long coordinates of (X,Y) point of map with plane at center, taking into account any current map rotation
    // (X,Y) is vector of arbitrary units where (0,0) is top left and (1000, 1000) is bottom right of map
    XYToCoordinatesFromPlaneWithRotation(xy) {
        // transform xy with opposite of map rotation;
        let transformed = new Vec2();
        transformed.x = (xy.x - 500) * this.cosRotation + (xy.y - 500) * this.sinRotation + 500;
        transformed.y = -(xy.x - 500) * this.sinRotation + (xy.y - 500) * this.cosRotation + 500;

        let lat = this.planeCoordinates.lat - ((transformed.y - 500) / 1000) * this._angularHeight;
        let long = this.planeCoordinates.long + ((transformed.x - 500) / 1000) * this._angularWidth;
        return new LatLongAlt(lat, long);
    }
    updateTrackLineAndArc() {
        /*Update Track Line*/
        let isInCTRmode = SimVar.GetSimVarValue("L:BTN_CTR_ACTIVE", "bool");
        let isInWXRmode = SimVar.GetSimVarValue("L:BTN_WX_ACTIVE", "bool");
        let mapMode = SimVar.GetSimVarValue("L:B747_MAP_MODE", "Enum");
        let mapRange = SimVar.GetSimVarValue("L:B747_8_MFD_Range", "number");
        let speed = Simplane.getGroundSpeed();
        let track = SimVar.GetSimVarValue("GPS GROUND MAGNETIC TRACK", "degrees");
        let heading = SimVar.GetSimVarValue("HEADING INDICATOR", "degrees");
        let drift = track - heading;
        const mapRangeEnumToHalfRangeText = {
            0: "0.125",
            1: "0.25",
            2: "0.5",
            3: "1",
            4: "2.5",
            5: "5",
            6: "10",
            7: "20",
            8: "40",
            9: "80",
            10: "160",
            11: "320"
        };
        let mapHalfRange = mapRangeEnumToHalfRangeText[mapRange];
        if (!isInCTRmode && mapMode !== 3) {
            this.trackLineGroup.style.visibility = "visible";
            if (!isInWXRmode) {
                this.halfRangeText.setAttribute("x", "490");
                this.halfRangeText.setAttribute("y", "262");
            }
            else {
                this.halfRangeText.setAttribute("x", "495");
                this.halfRangeText.setAttribute("y", "250");
            }
            if (speed > 10){
                this.trackLineGroup.setAttribute("transform", "rotate(" + drift + " " + 500 + " " + 500 + ")");
                this.halfRangeText.setAttribute("transform", "rotate(" + -drift + " " + 500 + " " + 250 + ")");
            }
            this.halfRangeText.textContent = mapHalfRange;
        } 
        else {
            this.trackLineGroup.style.visibility = "hidden";
        }
        /*Update Range Arc*/
        if ((mapMode == 2) && (SimVar.GetSimVarValue("RADIO HEIGHT", "feet") >= 100)){   
            let arcDeltaAlt = Simplane.getAutoPilotDisplayedAltitudeLockValue() - Simplane.getAltitude();
            let arcDeltaAltAbs = Math.abs(arcDeltaAlt);
            let verticalSpeed = SimVar.GetSimVarValue("VERTICAL SPEED", "feet per second");
            const mapRangeEnumToNM = {
                0: 0.25,
                1: 0.5,
                2: 1,
                3: 2,
                4: 5,
                5: 10,
                6: 20,
                7: 40,
                8: 80,
                9: 160,
                10: 320,
                11: 640
            };
            mapRange = mapRangeEnumToNM[mapRange];      
            let distanceToLevelArc = Math.abs(((arcDeltaAltAbs / (verticalSpeed / speed)) * 0.000164579)); //Feet to Nautical Miles
            let arcYcoord = distanceToLevelArc / mapRange * 460;
            let xError = (arcYcoord + 60) * Math.sin(drift * Math.PI / 180);
            if (!isInCTRmode) {
                this.greenArc.setAttribute("transform", `translate(${xError}, -${arcYcoord}) rotate(` + drift + " " + 500 + " " + 460 + ")");
            }           
            else {
                this.greenArc.setAttribute("transform", `translate(0, -${arcYcoord * 0.5})`);
            }            
            //Hide arc if out of compass bounds or aircraft considered at desired level or on non-intercepting flight path
            if ((arcYcoord > 460) || (arcDeltaAltAbs <= 200) || (((verticalSpeed < 0) && (arcDeltaAlt > 0)) || ((verticalSpeed > 0) && (arcDeltaAlt < 0)))) {
                this.greenArc.style.visibility = "hidden";
            }
            else {
                this.greenArc.style.visibility = "visible";
            }
        }
        else { 
            this.greenArc.style.visibility = "hidden";
        }
        /* Update Turn Prediction */
        const segDist = speed * 0.0083 / mapRange * 460;
        if (Simplane.getIsGrounded()){
            this.turnArc.setAttribute("stroke-dasharray", `0 30000`);
            this.trackline.setAttribute("y1", `${485}`);
        }
        else if (mapRange > 20) {
            this.turnArc.setAttribute("stroke-dasharray", `${segDist * 0.95} ${segDist * 0.05} ${segDist * 0.95} ${segDist * 0.05} ${segDist * 0.95} ${segDist * 0.05} 0 30000`);
            this.trackline.setAttribute("y1", `${485 - (segDist * 3)}`);
        }
        else if (mapRange == 20) {
            this.turnArc.setAttribute("stroke-dasharray", `${segDist * 0.95} ${segDist * 0.05} ${segDist * 0.95} ${segDist * 0.05} 0 30000`);
            this.trackline.setAttribute("y1", `${485 - (segDist * 2)}`);
        }
        else if (mapRange == 10 || mapRange == 5 || mapRange == 2) {
            this.turnArc.setAttribute("stroke-dasharray", `${segDist * 0.975} ${segDist * 0.025} 0 30000`);
            this.trackline.setAttribute("y1", `${485 - (segDist)}`);
        }
        else {
            this.turnArc.setAttribute("stroke-dasharray", `0 30000`);
            this.trackline.setAttribute("y1", `${485}`);
        }
        
        const bankAngle = SimVar.GetSimVarValue("ATTITUDE INDICATOR BANK DEGREES:1", "radians");
        const turnRadius = (speed * speed) / (11.26 * Math.tan(Math.abs(bankAngle))) / 4076;
        const pixelRadius = turnRadius / mapRange * 460;
        const arcDir = bankAngle < 0 ? pixelRadius * 2 : pixelRadius * -2;
        const sweepFlag = bankAngle < 0 ? 1 : 0;
        if (Math.abs(bankAngle) < 0.012) {
            this.turnArc.setAttribute("d", `M500 485, v${-600}`);
        }
        else {
            this.turnArc.setAttribute("d", `M 500, 485 a ${pixelRadius.toString()},${pixelRadius.toString()} 0 1,${sweepFlag} ${arcDir},0 a ${pixelRadius.toString()},${pixelRadius.toString()} 0 1,${sweepFlag} ${-arcDir},0 `);
        }
    }
}
SvgMap.Index = 0;
SvgMap.LOG_PERFS = false;
checkAutoload();