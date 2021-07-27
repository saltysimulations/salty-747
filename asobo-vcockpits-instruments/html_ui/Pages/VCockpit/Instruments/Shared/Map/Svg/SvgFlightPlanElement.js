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
        diffAndSetAttribute(container, "overflow", "visible");
        if (map.config.flightPlanNonActiveLegStrokeWidth > 0) {
            this._outlinePath = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(this._outlinePath, "stroke", map.config.flightPlanNonActiveLegStrokeColor);
            diffAndSetAttribute(this._outlinePath, "fill", "none");
            let outlinePathWidth = fastToFixed((map.config.flightPlanNonActiveLegStrokeWidth / map.overdrawFactor + map.config.flightPlanNonActiveLegWidth / map.overdrawFactor), 0);
            diffAndSetAttribute(this._outlinePath, "stroke-width", outlinePathWidth);
            diffAndSetAttribute(this._outlinePath, "stroke-linecap", "square");
            container.appendChild(this._outlinePath);
            this._outlineActive = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(this._outlineActive, "stroke", map.config.flightPlanActiveLegStrokeColor);
            diffAndSetAttribute(this._outlineActive, "fill", "none");
            let outlineActiveWidth = fastToFixed((map.config.flightPlanActiveLegStrokeWidth / map.overdrawFactor + map.config.flightPlanActiveLegWidth / map.overdrawFactor), 0);
            diffAndSetAttribute(this._outlineActive, "stroke-width", outlineActiveWidth);
            diffAndSetAttribute(this._outlineActive, "stroke-linecap", "square");
            container.appendChild(this._outlineActive);
            this._transitionOutlinePath = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(this._transitionOutlinePath, "stroke", map.config.flightPlanNonActiveLegStrokeColor);
            diffAndSetAttribute(this._transitionOutlinePath, "fill", "none");
            diffAndSetAttribute(this._transitionOutlinePath, "stroke-width", outlinePathWidth);
            diffAndSetAttribute(this._transitionOutlinePath, "stroke-linecap", "square");
            container.appendChild(this._transitionOutlinePath);
        }
        this._colorPath = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(this._colorPath, "stroke", map.config.flightPlanNonActiveLegColor);
        diffAndSetAttribute(this._colorPath, "fill", "none");
        if (this.flightPlanIndex === 1) {
            diffAndSetAttribute(this._colorPath, "stroke", "yellow");
        }
        let colorPathWidth = fastToFixed(map.config.flightPlanNonActiveLegWidth / map.overdrawFactor, 0);
        diffAndSetAttribute(this._colorPath, "stroke-width", colorPathWidth);
        diffAndSetAttribute(this._colorPath, "stroke-linecap", "square");
        container.appendChild(this._colorPath);
        this._colorActive = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(this._colorActive, "stroke", map.config.flightPlanActiveLegColor);
        diffAndSetAttribute(this._colorActive, "fill", "none");
        if (this.flightPlanIndex === 1) {
            diffAndSetAttribute(this._colorActive, "stroke", "yellow");
        }
        let colorActiveWidth = fastToFixed(map.config.flightPlanActiveLegWidth / map.overdrawFactor, 0);
        diffAndSetAttribute(this._colorActive, "stroke-width", colorActiveWidth);
        diffAndSetAttribute(this._colorActive, "stroke-linecap", "square");
        container.appendChild(this._colorActive);
        this._transitionPath = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(this._transitionPath, "stroke", map.config.flightPlanNonActiveLegColor);
        diffAndSetAttribute(this._transitionPath, "fill", "none");
        if (this.flightPlanIndex === 1) {
            diffAndSetAttribute(this._transitionPath, "stroke", "yellow");
        }
        diffAndSetAttribute(this._transitionPath, "stroke-width", colorPathWidth);
        diffAndSetAttribute(this._transitionPath, "stroke-linecap", "square");
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
                        if (waypoint === this.source.getDestination() && this.source.getApproachIndex() === -1 && this.source.getArrivalRunwayIndex() != -1) {
                            let infos = this.source.getDestination().infos;
                            if (infos instanceof AirportInfo) {
                                let runways = infos.unsortedOneWayRunways;
                                if (runways) {
                                    let runway = runways[this.source.getArrivalRunwayIndex()];
                                    if (runway) {
                                        wpPoints.pop();
                                        wpPoints.push(runway.beginningCoordinates.toLatLong());
                                        wpPoints.push(runway.endCoordinates.toLatLong());
                                    }
                                }
                            }
                        }
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
                            wpPoints.push(new LatLongAlt(waypoint.latitudeFP, waypoint.longitudeFP, waypoint.altitudeinFP));
                            for (let j = 0; j < wpPoints.length; j++) {
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
        if (this.points.length === 4) {
            if (!this.source.getIsDirectTo()) {
                if (this.source.getWaypoints().length <= 3) {
                    let atcTimeClimbLLA = this.source.getAtcTimeClimbLLA();
                    if (atcTimeClimbLLA) {
                        let p = map.coordinatesToXY(atcTimeClimbLLA);
                        p.refWP = undefined;
                        p.refWPIndex = 1;
                        if (isFinite(p.x) && isFinite(p.y)) {
                            this.points.splice(1, 0, p);
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
                    if (Math.abs(pPrev.x - p.x) < 3 && Math.abs(pPrev.y - p.y) < 3) {
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
                    let dot = Math.abs(xPrev * xNext + yPrev * yNext);
                    if (Math.abs(dot) > 0.99) {
                        b = Math.min(b, 10);
                    }
                    let refWPIndex = p.refWPIndex + (((bevels === 1) && (i % 2 === 0)) ? 1 : 0);
                    let refWP = (((bevels === 1) && (i % 2 === 0)) ? pNext.refWP : p.refWP);
                    let bp1 = {
                        x: p.x + xPrev * b,
                        y: p.y + yPrev * b,
                        refWP: refWP,
                        refWPIndex: refWPIndex
                    };
                    let bp2 = {
                        x: p.x + xNext * b,
                        y: p.y + yNext * b,
                        refWP: refWP,
                        refWPIndex: refWPIndex
                    };
                    let last = beveledPoints[beveledPoints.length - 1];
                    if (Math.abs(last.x - bp1.x) > 1 || Math.abs(last.y - bp1.y) > 1) {
                        beveledPoints.push(bp1);
                    }
                    last = beveledPoints[beveledPoints.length - 1];
                    if (Math.abs(last.x - bp2.x) > 1 || Math.abs(last.y - bp2.y) > 1) {
                        beveledPoints.push(bp2);
                    }
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
                diffAndSetAttribute(this._colorActive, "display", "visible");
            }
            if (this._outlineActive) {
                diffAndSetAttribute(this._outlineActive, "display", "visible");
            }
            if (this._outlineActive) {
                diffAndSetAttribute(this._outlineActive, "d", activePath);
            }
            if (this._colorActive) {
                diffAndSetAttribute(this._colorActive, "d", activePath);
            }
        }
        else {
            if (this._colorActive) {
                diffAndSetAttribute(this._colorActive, "display", "none");
            }
            if (this._outlineActive) {
                diffAndSetAttribute(this._outlineActive, "display", "none");
            }
        }
        if (this._colorPath) {
            diffAndSetAttribute(this._colorPath, "d", standardPath);
        }
        if (this._outlinePath) {
            diffAndSetAttribute(this._outlinePath, "d", standardPath);
        }
        if (this._transitionPath) {
            diffAndSetAttribute(this._transitionPath, "d", transitionPath);
        }
        if (this._transitionOutlinePath) {
            diffAndSetAttribute(this._transitionOutlinePath, "d", transitionPath);
        }
    }
    setAsDashed(_val, _force = false) {
        if (_force || (_val != this._isDashed)) {
            this._isDashed = _val;
            if (this._colorActive && this._colorPath) {
                if (this._isDashed) {
                    let length = 14;
                    let spacing = 8;
                    this._colorPath.removeAttribute("stroke-linecap");
                    diffAndSetAttribute(this._colorPath, "stroke-dasharray", length + " " + spacing);
                    this._colorActive.removeAttribute("stroke-linecap");
                    diffAndSetAttribute(this._colorActive, "stroke-dasharray", length + " " + spacing);
                }
                else {
                    this._colorPath.removeAttribute("stroke-dasharray");
                    diffAndSetAttribute(this._colorPath, "stroke-linecap", "square");
                    this._colorActive.removeAttribute("stroke-dasharray");
                    diffAndSetAttribute(this._colorActive, "stroke-linecap", "square");
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
        return this._lastAcknowledgedWaypoint;
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
        diffAndSetAttribute(container, "overflow", "visible");
        if (map.config.flightPlanDirectLegStrokeWidth > 0) {
            this._outlineLine = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(this._outlineLine, "stroke", this.overrideColor != "" ? this.overrideColor : map.config.flightPlanDirectLegStrokeColor);
            let outlineDirectLegWidth = fastToFixed((map.config.flightPlanDirectLegStrokeWidth / map.overdrawFactor + map.config.flightPlanDirectLegWidth), 0);
            diffAndSetAttribute(this._outlineLine, "stroke-width", outlineDirectLegWidth);
            diffAndSetAttribute(this._outlineLine, "stroke-linecap", "square");
            container.appendChild(this._outlineLine);
        }
        this._colorLine = document.createElementNS(Avionics.SVG.NS, "line");
        diffAndSetAttribute(this._colorLine, "stroke", this.overrideColor != "" ? this.overrideColor : map.config.flightPlanDirectLegColor);
        let colorDirectLegWidth = fastToFixed(map.config.flightPlanDirectLegWidth / map.overdrawFactor, 0);
        diffAndSetAttribute(this._colorLine, "stroke-width", colorDirectLegWidth);
        diffAndSetAttribute(this._colorLine, "stroke-linecap", "square");
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
        diffAndSetAttribute(this._colorLine, "x1", fastToFixed(p1.x, 0));
        diffAndSetAttribute(this._colorLine, "y1", fastToFixed(p1.y, 0));
        diffAndSetAttribute(this._colorLine, "x2", fastToFixed(p2.x, 0));
        diffAndSetAttribute(this._colorLine, "y2", fastToFixed(p2.y, 0));
        if (this._outlineLine) {
            diffAndSetAttribute(this._outlineLine, "x1", fastToFixed(p1.x, 0));
            diffAndSetAttribute(this._outlineLine, "y1", fastToFixed(p1.y, 0));
            diffAndSetAttribute(this._outlineLine, "x2", fastToFixed(p2.x, 0));
            diffAndSetAttribute(this._outlineLine, "y2", fastToFixed(p2.y, 0));
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
        if (d === 0) {
            p1.x = -10000;
            p1.y = -10000;
            p2.x = -10000;
            p2.y = -10000;
        }
        else {
            dx /= d;
            dy /= d;
            p1.x += dx * 5;
            p1.y += dy * 5;
            p2.x -= dx * 5;
            p2.y -= dy * 5;
        }
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
        diffAndSetAttribute(container, "overflow", "visible");
        this._path = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(this._path, "stroke", "red");
        diffAndSetAttribute(this._path, "stroke-width", "4");
        diffAndSetAttribute(this._path, "fill", "none");
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
                        d += "M" + fastToFixed(xy.x, 0) + " " + fastToFixed(xy.y, 0) + " ";
                    }
                    else {
                        d += "L" + fastToFixed(xy.x, 0) + " " + fastToFixed(xy.y, 0) + " ";
                    }
                }
            }
            diffAndSetAttribute(this._path, "d", d);
        }
    }
}
//# sourceMappingURL=SvgFlightPlanElement.js.map