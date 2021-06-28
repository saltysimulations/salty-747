class SvgFlightPlanElement extends SvgMapElement {
    constructor() {
        super(...arguments);
        this.flightPlanIndex = NaN;
        this.highlightActiveLeg = true;
        this.points = [];
        this.latLong = new LatLong();
        this._debugTransitionIndex = 0;
        this._lastP0X = NaN;
        this._lastP0Y = NaN;
        this.hideReachedWaypoints = true;
        this._highlightedLegIndex = -1;
        this._isDashed = false;
        this._lastAcknowledgedWaypoint = 0;
        this._lastAcknowledgedWaypointTimer = 0;
        this._isInApproach = false;
    }
    id(map) {
        return "flight-plan-" + this.flightPlanIndex + "-map-" + map.index;
        ;
    }
    createDraw(map) {
        let container = document.createElementNS(Avionics.SVG.NS, "svg");
        container.id = this.id(map);
        container.setAttribute("overflow", "visible");
        
        /* Construct Track Line */
        this.trackLineGroup = document.createElementNS(Avionics.SVG.NS, "g");
        container.appendChild(this.trackLineGroup); 
        this.trackline = document.createElementNS(Avionics.SVG.NS, "line");
        this.trackline.setAttribute("x1", "500");
        this.trackline.setAttribute("x2", "500");
        this.trackline.setAttribute("y1", "490");
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

        /* Construct Altitude Range Arc */
        this.greenArc = document.createElementNS(Avionics.SVG.NS, "path");
        this.greenArc.setAttribute("d", "M 425 510, Q 500 460, 575 510")
        this.greenArc.setAttribute("stroke", "lime");
        this.greenArc.setAttribute("stroke-width", "2.5px");
        this.greenArc.setAttribute("fill", "transparent");
        container.appendChild(this.greenArc);

        if (map.config.flightPlanNonActiveLegStrokeWidth > 0) {
            this._outlinePath = document.createElementNS(Avionics.SVG.NS, "path");
            this._outlinePath.setAttribute("stroke", map.config.flightPlanNonActiveLegStrokeColor);
            this._outlinePath.setAttribute("fill", "none");
            let outlinePathWidth = fastToFixed((map.config.flightPlanNonActiveLegStrokeWidth / map.overdrawFactor + map.config.flightPlanNonActiveLegWidth / map.overdrawFactor), 0);
            this._outlinePath.setAttribute("stroke-width", outlinePathWidth);
            this._outlinePath.setAttribute("stroke-linecap", "square");
            container.appendChild(this._outlinePath);
            this._outlineActive = document.createElementNS(Avionics.SVG.NS, "path");
            this._outlineActive.setAttribute("stroke", map.config.flightPlanActiveLegStrokeColor);
            this._outlineActive.setAttribute("fill", "none");
            let outlineActiveWidth = fastToFixed((map.config.flightPlanActiveLegStrokeWidth / map.overdrawFactor + map.config.flightPlanActiveLegWidth / map.overdrawFactor), 0);
            this._outlineActive.setAttribute("stroke-width", outlineActiveWidth);
            this._outlineActive.setAttribute("stroke-linecap", "square");
            container.appendChild(this._outlineActive);
            this._transitionOutlinePath = document.createElementNS(Avionics.SVG.NS, "path");
            this._transitionOutlinePath.setAttribute("stroke", map.config.flightPlanNonActiveLegStrokeColor);
            this._transitionOutlinePath.setAttribute("fill", "none");
            this._transitionOutlinePath.setAttribute("stroke-width", outlinePathWidth);
            this._transitionOutlinePath.setAttribute("stroke-linecap", "square");
            container.appendChild(this._transitionOutlinePath);
        }
        this._colorPath = document.createElementNS(Avionics.SVG.NS, "path");
        this._colorPath.setAttribute("stroke", map.config.flightPlanNonActiveLegColor);
        this._colorPath.setAttribute("fill", "none");
        if (this.flightPlanIndex === 1) {
            this._colorPath.setAttribute("stroke", "yellow");
        }
        let colorPathWidth = fastToFixed(map.config.flightPlanNonActiveLegWidth / map.overdrawFactor, 0);
        this._colorPath.setAttribute("stroke-width", colorPathWidth);
        this._colorPath.setAttribute("stroke-linecap", "square");
        container.appendChild(this._colorPath);
        this._colorActive = document.createElementNS(Avionics.SVG.NS, "path");
        this._colorActive.setAttribute("stroke", map.config.flightPlanActiveLegColor);
        this._colorActive.setAttribute("fill", "none");
        if (this.flightPlanIndex === 1) {
            this._colorActive.setAttribute("stroke", "yellow");
        }
        let colorActiveWidth = fastToFixed(map.config.flightPlanActiveLegWidth / map.overdrawFactor, 0);
        this._colorActive.setAttribute("stroke-width", colorActiveWidth);
        this._colorActive.setAttribute("stroke-linecap", "square");
        container.appendChild(this._colorActive);
        this._transitionPath = document.createElementNS(Avionics.SVG.NS, "path");
        this._transitionPath.setAttribute("stroke", map.config.flightPlanNonActiveLegColor);
        this._transitionPath.setAttribute("fill", "none");
        if (this.flightPlanIndex === 1) {
            this._transitionPath.setAttribute("stroke", "yellow");
        }
        this._transitionPath.setAttribute("stroke-width", colorPathWidth);
        this._transitionPath.setAttribute("stroke-linecap", "square");
        container.appendChild(this._transitionPath);
        this.setAsDashed(this._isDashed, true);
        return container;
    }
    updateDraw(map) {
        this._highlightedLegIndex = SimVar.GetSimVarValue("L:MAP_FLIGHTPLAN_HIGHLIT_WAYPOINT", "number");
        this.points = [];
        let transitionPoints = [];
        let lastLat = NaN;
        let lastLong = NaN;
        let departureRunwayCase;
        let activeWaypointIndex = -1;
        if (this.source) {
            if (this._lastAcknowledgedWaypointTimer > 0) {
                this._lastAcknowledgedWaypointTimer -= this.source.instrument.deltaTime;
                if (this._lastAcknowledgedWaypointTimer < 0)
                    this._lastAcknowledgedWaypointTimer = 0;
            }
            if (SimVar.GetSimVarValue("GPS OBS ACTIVE", "boolean")) {
                activeWaypointIndex = this.source.getActiveWaypointIndex(true);
                let waypoint = this.source.getActiveWaypoint();
                let magvar = SimVar.GetSimVarValue("MAGVAR", "degrees");
                let dir = SimVar.GetSimVarValue("GPS OBS VALUE", "degree") + magvar;
                let wpLLA = waypoint.infos.coordinates.toLatLong();
                let offsetLat = map.NMToPixels(360) * Math.cos(dir * Math.PI / 180);
                let offsetLong = map.NMToPixels(360) * Math.sin(dir * Math.PI / 180);
                let prev = map.coordinatesToXY(wpLLA);
                prev.x -= offsetLong;
                prev.y += offsetLat;
                prev.refWPIndex = -1;
                this.points.push(prev);
                let p = map.coordinatesToXY(wpLLA);
                p.refWPIndex = 0;
                this.points.push(p);
                let next = map.coordinatesToXY(wpLLA);
                next.x += offsetLong;
                next.y -= offsetLat;
                next.refWPIndex = 1;
                this.points.push(next);
            }
            else {
                let nbWaypoints = this.source.getWaypointsCount();
                activeWaypointIndex = this.source.getActiveWaypointIndex(true);
                let isInApproach = false;
                let approach = this.source.getApproach();
                if (approach) {
                    isInApproach = this.source.isActiveApproach();
                }
                if (isInApproach != this._isInApproach) {
                    this._isInApproach = isInApproach;
                    this._lastAcknowledgedWaypoint = 0;
                }
                let doLastLeg = true;
                if (approach && approach.transitions.length > 0) {
                    doLastLeg = false;
                }
                if (!this.source.getIsDirectTo() && this.source.getWaypoint(0, this.flightPlanIndex)) {
                    let departureWaypoint = this.source.getWaypoint(0, this.flightPlanIndex);
                    if (departureWaypoint.infos instanceof AirportInfo) {
                        departureRunwayCase = this.source.getDepartureRunway();
                    }
                }
                let last = nbWaypoints - (doLastLeg ? 0 : 1);
                let lastApproach = 0;
                if (approach) {
                    let lastIndex = this.source.getLastIndexBeforeApproach();
                    if (lastIndex != -1) {
                        last = lastIndex + 1;
                        lastApproach = last;
                        if (isInApproach) {
                            last--;
                            lastApproach = 0;
                        }
                    }
                }
                let first = 0;
                let firstApproach = 0;
                if (this.source.getIsDirectTo()) {
                    let directToTarget = this.source.getDirectToTarget();
                    if (directToTarget) {
                        first = this.source.getWaypoints().findIndex(wp => { return wp.icao === directToTarget.icao; });
                        if (first === -1) {
                            firstApproach = this.source.getApproachWaypoints().findIndex(wp => { return wp.icao === directToTarget.icao; });
                            if (firstApproach != -1) {
                                first = Infinity;
                            }
                        }
                    }
                }
                else if (this.hideReachedWaypoints) {
                    if (isInApproach) {
                        first = Infinity;
                        firstApproach = this.getFirstWaypointToDraw(map, activeWaypointIndex, this.source.getApproachWaypoints().length);
                    }
                    else {
                        first = this.getFirstWaypointToDraw(map, activeWaypointIndex, last);
                    }
                }
                let pIndex = 0;
                for (let i = first; i < last; i++) {
                    let waypoint = this.source.getWaypoint(i, this.flightPlanIndex);
                    if (waypoint) {
                        let wpPoints = [];
                        if (waypoint.transitionLLas) {
                            if (i == 0 || i > first) {
                                for (let j = 0; j < waypoint.transitionLLas.length; j++) {
                                    wpPoints.push(waypoint.transitionLLas[i].toLatLong());
                                }
                            }
                        }
                        wpPoints.push(waypoint.infos.coordinates.toLatLong());
                        for (let j = 0; j < wpPoints.length; j++) {
                            this.latLong = wpPoints[j];
                            if (departureRunwayCase && i === 0) {
                                this.latLong.lat = departureRunwayCase.beginningCoordinates.lat;
                                this.latLong.long = departureRunwayCase.beginningCoordinates.long;
                            }
                            if (this.latLong.lat !== lastLat && this.latLong.long !== lastLong) {
                                let deltaLong = Math.abs(lastLong - this.latLong.long);
                                if (deltaLong > 2) {
                                    let lastX = Math.cos(lastLat / 180 * Math.PI) * Math.cos(lastLong / 180 * Math.PI);
                                    let lastY = Math.cos(lastLat / 180 * Math.PI) * Math.sin(lastLong / 180 * Math.PI);
                                    let lastZ = Math.sin(lastLat / 180 * Math.PI);
                                    let X = Math.cos(this.latLong.lat / 180 * Math.PI) * Math.cos(this.latLong.long / 180 * Math.PI);
                                    let Y = Math.cos(this.latLong.lat / 180 * Math.PI) * Math.sin(this.latLong.long / 180 * Math.PI);
                                    let Z = Math.sin(this.latLong.lat / 180 * Math.PI);
                                    let stepCount = Math.floor(deltaLong / 2);
                                    for (let k = 0; k < stepCount; k++) {
                                        let d = (k + 1) / (stepCount + 1);
                                        let x = lastX * (1 - d) + X * d;
                                        let y = lastY * (1 - d) + Y * d;
                                        let z = lastZ * (1 - d) + Z * d;
                                        let long = Math.atan2(y, x) / Math.PI * 180;
                                        let hyp = Math.sqrt(x * x + y * y);
                                        let lat = Math.atan2(z, hyp) / Math.PI * 180;
                                        if (this.points[pIndex]) {
                                            map.coordinatesToXYToRef(new LatLong(lat, long), this.points[pIndex]);
                                        }
                                        else {
                                            let p = map.coordinatesToXY(new LatLong(lat, long));
                                            p.refWP = waypoint;
                                            p.refWPIndex = i;
                                            this.points.push(p);
                                        }
                                        pIndex++;
                                    }
                                }
                                lastLat = this.latLong.lat;
                                lastLong = this.latLong.long;
                                if (this.points[pIndex]) {
                                    map.coordinatesToXYToRef(this.latLong, this.points[pIndex]);
                                    if (i === 0) {
                                        if (this.points[0].x === this._lastP0X && this.points[0].y === this._lastP0Y) {
                                            this._forceFullRedraw++;
                                            if (this._forceFullRedraw < 60) {
                                                return;
                                            }
                                            this._forceFullRedraw = 0;
                                        }
                                        this._lastP0X = this.points[0].x;
                                        this._lastP0Y = this.points[0].y;
                                    }
                                }
                                else {
                                    let p = map.coordinatesToXY(this.latLong);
                                    p.refWP = waypoint;
                                    p.refWPIndex = i;
                                    this.points.push(p);
                                }
                                pIndex++;
                            }
                        }
                        if (i === 0) {
                            if (departureRunwayCase) {
                                this.latLong.lat = departureRunwayCase.endCoordinates.lat;
                                this.latLong.long = departureRunwayCase.endCoordinates.long;
                                if (this.points[pIndex]) {
                                    map.coordinatesToXYToRef(this.latLong, this.points[pIndex]);
                                }
                                else {
                                    let p = map.coordinatesToXY(this.latLong);
                                    p.refWP = waypoint;
                                    p.refWPIndex = 0;
                                    this.points.push(p);
                                }
                                pIndex++;
                            }
                        }
                    }
                }
                if (approach) {
                    let waypoints = this.source.getApproachWaypoints();
                    for (let i = firstApproach; i < waypoints.length; i++) {
                        let waypoint = waypoints[i];
                        if (waypoint) {
                            let wpPoints = [];
                            if (waypoint.transitionLLas) {
                                if (i > firstApproach || (!this.source.getIsDirectTo() && i == 0)) {
                                    for (let j = 0; j < waypoint.transitionLLas.length; j++) {
                                        wpPoints.push(waypoint.transitionLLas[j]);
                                    }
                                }
                            }
                            wpPoints.push(new LatLongAlt(waypoint.latitudeFP, waypoint.longitudeFP, waypoint.altitudeinFP));                            for (let j = 0; j < wpPoints.length; j++) {
                                if (this.points[pIndex]) {
                                    map.coordinatesToXYToRef(wpPoints[j], this.points[pIndex]);
                                    this.points[pIndex].refWP = waypoint;
                                    this.points[pIndex].refWPIndex = lastApproach + i;
                                }
                                else {
                                    let p = map.coordinatesToXY(wpPoints[j]);
                                    p.refWP = waypoint;
                                    p.refWPIndex = lastApproach + i;
                                    this.points.push(p);
                                }
                                pIndex++;
                            }
                        }
                    }
                }
            }
        }
        let logWPIndex = false;
        if (logWPIndex) {
            let indexes = "";
            this.points.forEach(p => {
                indexes += p.refWPIndex + " ";
            });
            console.log(indexes);
        }
        for (let bevels = 0; bevels < 2; bevels++) {
            let bevelAmount = map.NMToPixels(3) / (bevels + 1);
            if (this.points.length > 2) {
                let beveledPoints = [this.points[0]];
                for (let i = 1; i < this.points.length - 1; i++) {
                    let pPrev = this.points[i - 1];
                    let p = this.points[i];
                    let pNext = this.points[i + 1];
                    if ((pPrev.x == p.x && pPrev.y == p.y) || (pNext.x == p.x && pNext.y == p.y)) {
                        beveledPoints.push(p);
                        continue;
                    }
                    let xPrev = pPrev.x - p.x;
                    let yPrev = pPrev.y - p.y;
                    let dPrev = Math.sqrt(xPrev * xPrev + yPrev * yPrev);
                    xPrev /= dPrev;
                    yPrev /= dPrev;
                    let xNext = pNext.x - p.x;
                    let yNext = pNext.y - p.y;
                    let dNext = Math.sqrt(xNext * xNext + yNext * yNext);
                    xNext /= dNext;
                    yNext /= dNext;
                    let b = Math.min(dPrev / 3, dNext / 3, bevelAmount);
                    let dot = Math.abs(xPrev * xNext + yPrev * yNext) / (dPrev / dNext);
                    if (Math.abs(dot) > 0.99) {
                        b = 10;
                    }
                    let refWPIndex = p.refWPIndex + (((bevels === 1) && (i % 2 === 0)) ? 1 : 0);
                    let refWP = (((bevels === 1) && (i % 2 === 0)) ? pNext.refWP : p.refWP);
                    beveledPoints.push({
                        x: p.x + xPrev * b,
                        y: p.y + yPrev * b,
                        refWP: refWP,
                        refWPIndex: refWPIndex
                    }, {
                        x: p.x + xNext * b,
                        y: p.y + yNext * b,
                        refWP: refWP,
                        refWPIndex: refWPIndex
                    });
                }
                beveledPoints.push(this.points[this.points.length - 1]);
                this.points = beveledPoints;
                if (logWPIndex) {
                    let indexes = "";
                    this.points.forEach(p => {
                        indexes += p.refWPIndex + " ";
                    });
                    console.log(indexes);
                }
            }
        }
        if (this.points.length > 0) {
            let prevRefWPIndex = this.points[this.points.length - 1].refWPIndex;
            let prevRefWP = this.points[this.points.length - 1].refWP;
            for (let p = this.points.length - 2; p > 0; p--) {
                let point = this.points[p];
                if (point.refWPIndex > prevRefWPIndex) {
                    point.refWPIndex = prevRefWPIndex;
                    point.refWP = prevRefWP;
                }
                prevRefWPIndex = point.refWPIndex;
                prevRefWP = point.refWP;
            }
        }
        let activePath = "";
        let standardPath = "";
        let transitionPath = "";
        let showActiveLeg = false;
        let prevIsHighlit = false;
        let prevWasClipped = false;
        let first = true;
        let s1 = new Vec2();
        let s2 = new Vec2();
        let p1 = null;
        let p2 = null;
        let indexToHighlight = activeWaypointIndex;
        for (let i = 0; i < this.points.length; i++) {
            let p = this.points[i];
            if (!p || isNaN(p.x) || isNaN(p.y)) {
                continue;
            }
            if (!p1) {
                p1 = p;
                continue;
            }
            p2 = p;
            if (p1.x != p2.x || p1.y != p2.y) {
                let isHighlit = false;
                if (SimVar.GetSimVarValue("GPS OBS ACTIVE", "boolean")) {
                    if (p2.refWPIndex == 0) {
                        isHighlit = true;
                    }
                }
                else if (!this._isDashed && this.highlightActiveLeg) {
                    if (p2.refWPIndex == indexToHighlight || (indexToHighlight == 0 && p1.refWPIndex == indexToHighlight)) {
                        isHighlit = true;
                        indexToHighlight = p2.refWPIndex;
                    }
                }
                if (map.segmentVsFrame(p1, p2, s1, s2)) {
                    let x1 = fastToFixed(s1.x, 0);
                    let y1 = fastToFixed(s1.y, 0);
                    let x2 = fastToFixed(s2.x, 0);
                    let y2 = fastToFixed(s2.y, 0);
                    if (isHighlit) {
                        showActiveLeg = true;
                        if (first || prevIsHighlit != isHighlit || prevWasClipped) {
                            activePath += "M" + x1 + " " + y1 + " L" + x2 + " " + y2 + " ";
                        }
                        else {
                            activePath += "L" + x2 + " " + y2 + " ";
                        }
                    }
                    else {
                        if (first || prevIsHighlit != isHighlit || prevWasClipped) {
                            standardPath += "M" + x1 + " " + y1 + " L" + x2 + " " + y2 + " ";
                        }
                        else {
                            standardPath += "L" + x2 + " " + y2 + " ";
                        }
                    }
                    first = false;
                    prevWasClipped = (s2.Equals(p2)) ? false : true;
                }
                else {
                    prevWasClipped = true;
                }
                prevIsHighlit = isHighlit;
            }
            p1 = p2;
        }
        p1 = null;
        p2 = null;
        for (let i = 0; i < transitionPoints.length; i++) {
            let p = transitionPoints[i];
            if (!p || isNaN(p.x) || isNaN(p.y)) {
                continue;
            }
            if (!p1) {
                p1 = p;
                continue;
            }
            p2 = p;
            if (p1.x != p2.x || p1.y != p2.y) {
                if (map.segmentVsFrame(p1, p2, s1, s2)) {
                    let x1 = fastToFixed(s1.x, 0);
                    let y1 = fastToFixed(s1.y, 0);
                    let x2 = fastToFixed(s2.x, 0);
                    let y2 = fastToFixed(s2.y, 0);
                    transitionPath += "M" + x1 + " " + y1 + " L" + x2 + " " + y2 + " ";
                }
            }
            p1 = p2;
        }
        if (showActiveLeg) {
            if (this._colorActive) {
                this._colorActive.setAttribute("display", "visible");
            }
            if (this._outlineActive) {
                this._outlineActive.setAttribute("display", "visible");
            }
            if (this._outlineActive) {
                this._outlineActive.setAttribute("d", activePath);
            }
            if (this._colorActive) {
                this._colorActive.setAttribute("d", activePath);
            }
        }
        else {
            if (this._colorActive) {
                this._colorActive.setAttribute("display", "none");
            }
            if (this._outlineActive) {
                this._outlineActive.setAttribute("display", "none");
            }
        }
        if (this._colorPath) {
            this._colorPath.setAttribute("d", standardPath);
        }
        if (this._outlinePath) {
            this._outlinePath.setAttribute("d", standardPath);
        }
        if (this._transitionPath) {
            this._transitionPath.setAttribute("d", transitionPath);
        }
        if (this._transitionOutlinePath) {
            this._transitionOutlinePath.setAttribute("d", transitionPath);
        }
        this.updateTrackLineAndArc();
    }
    setAsDashed(_val, _force = false) {
        if (_force || (_val != this._isDashed)) {
            this._isDashed = _val;
            if (this._colorActive && this._colorPath) {
                if (this._isDashed) {
                    let length = 14;
                    let spacing = 8;
                    this._colorPath.removeAttribute("stroke-linecap");
                    this._colorPath.setAttribute("stroke-dasharray", length + " " + spacing);
                    this._colorActive.removeAttribute("stroke-linecap");
                    this._colorActive.setAttribute("stroke-dasharray", length + " " + spacing);
                }
                else {
                    this._colorPath.removeAttribute("stroke-dasharray");
                    this._colorPath.setAttribute("stroke-linecap", "square");
                    this._colorActive.removeAttribute("stroke-dasharray");
                    this._colorActive.setAttribute("stroke-linecap", "square");
                }
            }
        }
    }
    getFirstWaypointToDraw(_map, _active, _last) {
        let first = Math.max(0, _active - 1);
        if (first < this._lastAcknowledgedWaypoint) {
            this._lastAcknowledgedWaypoint = first;
        }
        if (first >= _last) {
            first = _last - 1;
        }
        let min = this._lastAcknowledgedWaypoint + 1;
        while (first >= min) {
            let firstWpt;
            let nextWpt;
            if (this.source.getApproach() && this.source.isActiveApproach()) {
                firstWpt = this.source.getApproachWaypoints()[first];
                nextWpt = this.source.getApproachWaypoints()[first + 1];
            }
            else {
                firstWpt = this.source.getWaypoint(first, this.flightPlanIndex);
                if ((first + 1) < _last) {
                    nextWpt = this.source.getWaypoint(first + 1, this.flightPlanIndex);
                }
                else if (this.source.getApproach()) {
                    nextWpt = this.source.getApproachWaypoints()[0];
                }
            }
            if (!nextWpt) {
                first--;
                continue;
            }
            if (firstWpt.latitudeFP !== undefined && firstWpt.longitudeFP !== undefined) {
                let p1 = _map.coordinatesToXY(new LatLong(firstWpt.latitudeFP, firstWpt.longitudeFP));
                let p2 = _map.coordinatesToXY(new LatLong(nextWpt.latitudeFP, nextWpt.longitudeFP));
                let ll = _map.coordinatesToXY(this.source.planeCoordinates);
                let v1 = Vec2.Delta(ll, p1);
                let v2 = Vec2.Delta(p2, p1);
                if (v1.GetNorm() < v2.GetNorm() * 0.1) {
                    first--;
                    continue;
                }
                v1.Normalize();
                v2.Normalize();
                let dot = v1.Dot(v2);
                if (dot < 0.5) {
                    first--;
                    continue;
                }
                if (this._lastAcknowledgedWaypointTimer <= 0) {
                    this._lastAcknowledgedWaypoint++;
                    this._lastAcknowledgedWaypointTimer = 10000;
                }
                break;
            }
        }
        return this._lastAcknowledgedWaypoint;
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
    }
}
class SvgBackOnTrackElement extends SvgMapElement {
    constructor(overrideColor = "") {
        super();
        this.overrideColor = overrideColor;
        this._id = "back-on-track-" + SvgBackOnTrackElement.ID;
        SvgBackOnTrackElement.ID++;
    }
    id(map) {
        return this._id + "-map-" + map.index;
        ;
    }
    createDraw(map) {
        let container = document.createElementNS(Avionics.SVG.NS, "svg");
        container.id = this.id(map);
        container.setAttribute("overflow", "visible");
        if (map.config.flightPlanDirectLegStrokeWidth > 0) {
            this._outlineLine = document.createElementNS(Avionics.SVG.NS, "line");
            this._outlineLine.setAttribute("stroke", this.overrideColor != "" ? this.overrideColor : map.config.flightPlanDirectLegStrokeColor);
            let outlineDirectLegWidth = fastToFixed((map.config.flightPlanDirectLegStrokeWidth / map.overdrawFactor + map.config.flightPlanDirectLegWidth), 0);
            this._outlineLine.setAttribute("stroke-width", outlineDirectLegWidth);
            this._outlineLine.setAttribute("stroke-linecap", "square");
            container.appendChild(this._outlineLine);
        }
        this._colorLine = document.createElementNS(Avionics.SVG.NS, "line");
        this._colorLine.setAttribute("stroke", this.overrideColor != "" ? this.overrideColor : map.config.flightPlanDirectLegColor);
        let colorDirectLegWidth = fastToFixed(map.config.flightPlanDirectLegWidth / map.overdrawFactor, 0);
        this._colorLine.setAttribute("stroke-width", colorDirectLegWidth);
        this._colorLine.setAttribute("stroke-linecap", "square");
        container.appendChild(this._colorLine);
        return container;
    }
    updateDraw(map) {
        let p1 = map.coordinatesToXY(this.llaRequested);
        let p2;
        if (this.targetWaypoint) {
            p2 = map.coordinatesToXY(this.targetWaypoint.infos.coordinates);
        }
        else if (this.targetLla) {
            p2 = map.coordinatesToXY(this.targetLla);
        }
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let d = Math.sqrt(dx * dx + dy * dy);
        dx /= d;
        dy /= d;
        p1.x += dx * 5;
        p1.y += dy * 5;
        p2.x -= dx * 5;
        p2.y -= dy * 5;
        this._colorLine.setAttribute("x1", fastToFixed(p1.x, 0));
        this._colorLine.setAttribute("y1", fastToFixed(p1.y, 0));
        this._colorLine.setAttribute("x2", fastToFixed(p2.x, 0));
        this._colorLine.setAttribute("y2", fastToFixed(p2.y, 0));
        if (this._outlineLine) {
            this._outlineLine.setAttribute("x1", fastToFixed(p1.x, 0));
            this._outlineLine.setAttribute("y1", fastToFixed(p1.y, 0));
            this._outlineLine.setAttribute("x2", fastToFixed(p2.x, 0));
            this._outlineLine.setAttribute("y2", fastToFixed(p2.y, 0));
        }
    }
}
SvgBackOnTrackElement.ID = 0;
class SvgDirectToElement extends SvgMapElement {
    constructor(overrideColor = "") {
        super();
        this.overrideColor = overrideColor;
        this._id = "direct-to-" + SvgDirectToElement.ID;
        SvgDirectToElement.ID++;
    }
    id(map) {
        return this._id + "-map-" + map.index;
        ;
    }
    createDraw(map) {
        let container = document.createElementNS(Avionics.SVG.NS, "svg");
        container.id = this.id(map);
        container.setAttribute("overflow", "visible");
        if (map.config.flightPlanDirectLegStrokeWidth > 0) {
            this._outlineLine = document.createElementNS(Avionics.SVG.NS, "line");
            this._outlineLine.setAttribute("stroke", this.overrideColor != "" ? this.overrideColor : map.config.flightPlanDirectLegStrokeColor);
            let outlineDirectLegWidth = fastToFixed((map.config.flightPlanDirectLegStrokeWidth / map.overdrawFactor + map.config.flightPlanDirectLegWidth), 0);
            this._outlineLine.setAttribute("stroke-width", outlineDirectLegWidth);
            this._outlineLine.setAttribute("stroke-linecap", "square");
            container.appendChild(this._outlineLine);
        }
        this._colorLine = document.createElementNS(Avionics.SVG.NS, "line");
        this._colorLine.setAttribute("stroke", this.overrideColor != "" ? this.overrideColor : map.config.flightPlanDirectLegColor);
        let colorDirectLegWidth = fastToFixed(map.config.flightPlanDirectLegWidth / map.overdrawFactor, 0);
        this._colorLine.setAttribute("stroke-width", colorDirectLegWidth);
        this._colorLine.setAttribute("stroke-linecap", "square");
        container.appendChild(this._colorLine);
        return container;
    }
    updateDraw(map) {
        let p1 = map.coordinatesToXY(this.llaRequested);
        let p2;
        if (this.targetWaypoint) {
            p2 = map.coordinatesToXY(this.targetWaypoint.infos.coordinates);
        }
        else if (this.targetLla) {
            p2 = map.coordinatesToXY(this.targetLla);
        }
        if (SimVar.GetSimVarValue("GPS OBS ACTIVE", "boolean")) {
            let magvar = SimVar.GetSimVarValue("MAGVAR", "degrees");
            let dir = SimVar.GetSimVarValue("GPS OBS VALUE", "degree") + magvar;
            let offsetLat = map.NMToPixels(360) * Math.cos(dir * Math.PI / 180);
            let offsetLong = map.NMToPixels(360) * Math.sin(dir * Math.PI / 180);
            p1.x -= offsetLong;
            p1.y += offsetLat;
            p2.x -= p1.x - p2.x;
            p2.y -= p1.y - p2.y;
        }
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let d = Math.sqrt(dx * dx + dy * dy);
        dx /= d;
        dy /= d;
        p1.x += dx * 5;
        p1.y += dy * 5;
        p2.x -= dx * 5;
        p2.y -= dy * 5;
        this._colorLine.setAttribute("x1", fastToFixed(p1.x, 0));
        this._colorLine.setAttribute("y1", fastToFixed(p1.y, 0));
        this._colorLine.setAttribute("x2", fastToFixed(p2.x, 0));
        this._colorLine.setAttribute("y2", fastToFixed(p2.y, 0));
        if (this._outlineLine) {
            this._outlineLine.setAttribute("x1", fastToFixed(p1.x, 0));
            this._outlineLine.setAttribute("y1", fastToFixed(p1.y, 0));
            this._outlineLine.setAttribute("x2", fastToFixed(p2.x, 0));
            this._outlineLine.setAttribute("y2", fastToFixed(p2.y, 0));
        }
    }
}
SvgDirectToElement.ID = 0;
class SvgApproachFlightPlanDebugElement extends SvgMapElement {
    constructor() {
        super(...arguments);
        this.flightPlanIndex = NaN;
    }
    id(map) {
        return "flight-plan-" + this.flightPlanIndex + "-map-" + map.index;
        ;
    }
    createDraw(map) {
        let container = document.createElementNS(Avionics.SVG.NS, "svg");
        container.id = this.id(map);
        container.setAttribute("overflow", "visible");
        this._path = document.createElementNS(Avionics.SVG.NS, "path");
        this._path.setAttribute("stroke", "red");
        this._path.setAttribute("stroke-width", "4");
        this._path.setAttribute("fill", "none");
        container.appendChild(this._path);
        return container;
    }
    updateDraw(map) {
        if (this.source && this.source.waypoints) {
            let d = "";
            let waypoints = this.source.waypoints;
            for (let i = 0; i < waypoints.length; i++) {
                let wpPoints = [];
                if (waypoints[i].transitionLLas) {
                    for (let j = 0; j < waypoints[i].transitionLLas.length; j++) {
                        wpPoints.push(waypoints[i].transitionLLas[j]);
                    }
                }
                wpPoints.push(waypoints[i].lla);
                for (let j = 0; j < wpPoints.length; j++) {
                    let lla = wpPoints[j];
                    let xy = map.coordinatesToXY(lla);
                    if (i === 0 && j === 0) {
                        d += "M" + xy.x.toFixed(0) + " " + xy.y.toFixed(0) + " ";
                    }
                    else {
                        d += "L" + xy.x.toFixed(0) + " " + xy.y.toFixed(0) + " ";
                    }
                }
            }
            this._path.setAttribute("d", d);
        }
    }
}
//# sourceMappingURL=SvgFlightPlanElement.js.map