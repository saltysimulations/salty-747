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
        this.hasSetDepRunway = false;
    }
    id(map) {
        return "flight-plan-" + this.flightPlanIndex + "-map-" + map.index;
        ;
    }

    appendToMap(map) {
        map.appendChild(this.svgElement, map.flightPlanLayer);
    }

    createDraw(map) {
        let container = document.createElementNS(Avionics.SVG.NS, "foreignObject");
        container.id = this.id(map);
        container.setAttribute('width', '1024px');
        container.setAttribute('height', '1024px');
        container.setAttribute('x', '0');
        container.setAttribute('y', '0');

        this._flightPathCanvas = document.createElement('canvas');
        this._flightPathCanvas.setAttribute('width', '1024px');
        this._flightPathCanvas.setAttribute('height', '1024px');
        container.appendChild(this._flightPathCanvas);

        return container;
    }
    updateDraw(map) {
        if (this.source) {
            /** @type {FlightPlanManager} */
            const fpm = this.source;
            /** @type {WayPoint[]} */

            const context = this._flightPathCanvas.getContext('2d');
            context.clearRect(0, 0, 1024, 1024);

            const fplnCount = (SimVar.GetSimVarValue("L:MAP_SHOW_TEMPORARY_FLIGHT_PLAN", "number") === 1) ? 2 : 1;
            for (let index = 0; index < fplnCount; index++) {
                const plan = fpm.getFlightPlan(index);
                if (!plan) {
                    continue;
                }
                const waypoints = plan.waypoints;

                const activeWaypointIndex = plan.activeWaypointIndex;
                const missedSegment = plan.getSegment(SegmentType.Missed);
                const approachSegment = plan.getSegment(SegmentType.Approach);
                const drawDestination = approachSegment.waypoints.length === 0;

                if (waypoints.length > 1) {

                    const inMissedApproach = activeWaypointIndex >= missedSegment.offset;
                    let mainPathEnd = inMissedApproach ? waypoints.length - 1 : missedSegment.offset;

                    if (drawDestination) {
                        mainPathEnd++;
                    }

                    //Runway icons
                    this.hasSetDepRunway = false;
                    this.drawRunways(waypoints, 0, waypoints.length - 1, map, '#FFFFFF', (index !== 0), false);

                    //Active leg
                    if (waypoints[activeWaypointIndex] && waypoints[activeWaypointIndex - 1]) {
                        this.buildPathFromWaypoints(waypoints, activeWaypointIndex - 1, activeWaypointIndex + 1, map, '#D570FF', (index !== 0), false);
                    }

                    //Missed approach preview
                    if (missedSegment.offset > -1) {
                        this.buildPathFromWaypoints(waypoints, missedSegment.offset - 1, waypoints.length - 1, map, '#00FFFF', true, true);
                    }

                    //Remainder of plan
                    this.buildPathFromWaypoints(waypoints, activeWaypointIndex, mainPathEnd, map, '#D570FF', (index !== 0), false);
                    
                }
            }
        }
    }

    /**
     * Builds a path string from supplied waypoints.
     * @param {WayPoint[]} waypoints The waypoints to build the path from.
     * @param {MapInstrument} map The map instrument to convert coordinates with.
     * @returns {string} A path string.
     */
    buildPathFromWaypoints(waypoints, startIndex, endIndex, map, style = 'white', isDashed = false, isMissed = false) {
        const context = this._flightPathCanvas.getContext('2d');
        context.beginPath();

        context.lineWidth = 3;
        context.strokeStyle = style;
        if (isDashed === true & !isMissed) {
            context.strokeStyle = "white";
            context.setLineDash([20, 20]);
        } else if (isMissed) {
            context.setLineDash([20, 20]);
        } else {
            context.setLineDash([]);
        }

        let prevWaypoint;
        for (let i = startIndex; i < endIndex; i++) {
            const waypoint = waypoints[i];
            const pos = map.coordinatesToXY(waypoint.infos.coordinates);
            const nextWaypoint = waypoints[i + 1];
            let nextPos;
            let prevPos;
            let shouldSkipDraw = false;
            if (i > startIndex + 1) {
                prevPos = map.coordinatesToXY(prevWaypoint.infos.coordinates);
                if (i < endIndex - 1) {
                    nextPos = map.coordinatesToXY(nextWaypoint.infos.coordinates);
                }
                if (nextPos && prevPos) {
                    if (!this.isWaypointOnScreen(prevPos) && !this.isWaypointOnScreen(nextPos) && !this.isWaypointOnScreen(pos)) {
                        //DO NOT DRAW IF OFF MAP
                        shouldSkipDraw = true;
                    }
                }
            }
            if (!shouldSkipDraw) {
                if (i === startIndex || (prevWaypoint && prevWaypoint.endsInDiscontinuity)) {
                    context.moveTo(pos.x, pos.y);
                }
                else {
                    //Draw great circle segments if more than 2 degrees longitude difference
                    const longDiff = Math.abs(waypoint.infos.coordinates.long - prevWaypoint.infos.coordinates.long);
                    if (longDiff > 2) {
                        const numSegments = Math.floor(longDiff / 2);
                        const startingLatLon = new LatLon(prevWaypoint.infos.coordinates.lat, prevWaypoint.infos.coordinates.long);
                        const endingLatLon = new LatLon(waypoint.infos.coordinates.lat, waypoint.infos.coordinates.long);
    
                        const segmentPercent = 1 / numSegments;
                        for (let j = 0; j <= numSegments; j++) {
                            const segmentEnd = startingLatLon.intermediatePointTo(endingLatLon, j * segmentPercent);
                            const segmentEndVec = map.coordinatesToXY(new LatLongAlt(segmentEnd.lat, segmentEnd.lon));
    
                            context.lineTo(segmentEndVec.x, segmentEndVec.y);
                        }
                    }
                    else {
                        context.lineTo(pos.x, pos.y);
                    }
                }
            }
            prevWaypoint = waypoint;
        }
        context.stroke();

        //DRAW HOLDS - ALWAYS NON-DASHED
        context.setLineDash([]);
        context.beginPath();
        for (let i = startIndex + 1; i < endIndex; i++) {
            const waypoint = waypoints[i];
            if (waypoint.hasHold) {
                let course = waypoint.holdDetails.holdCourse;
                if (!waypoint.holdDetails.isHoldCourseTrue) {
                    const magVar = GeoMath.getMagvar(waypoint.infos.coordinates.lat, waypoint.infos.coordinates.long);
                    course = AutopilotMath.normalizeHeading(course + magVar);
                }

                const corners = HoldsDirector.calculateHoldFixes(waypoint.infos.coordinates, waypoint.holdDetails)
                    .map(c => map.coordinatesToXY(c));

                context.moveTo(corners[0].x, corners[0].y);
                this.drawHoldArc(corners[0], corners[1], context, waypoint.holdDetails.turnDirection === 1);
                context.lineTo(corners[2].x, corners[2].y);
                this.drawHoldArc(corners[2], corners[3], context, waypoint.holdDetails.turnDirection === 1);
                context.lineTo(corners[0].x, corners[0].y);
            }
        }
        context.stroke();
    }
    drawRunways(waypoints, startIndex, endIndex, map, style = 'white') {
        const mapRange = SimVar.GetSimVarValue("L:B747_8_MFD_RANGE", "Enum");
        if (this.source && mapRange < 8) {
            const fpm = this.source;
            const context = this._flightPathCanvas.getContext('2d');
            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = style;
            for (let i = startIndex + 1; i < endIndex; i++) {
                const waypoint = waypoints[i];
                if (waypoint.ident.substring(0,2) === "RW") {
                    let runwayHeading;
                    let runway;
                    if (fpm.getDepartureRunwayDirection() != undefined && !this.hasSetDepRunway) {
                        runwayHeading = fpm.getDepartureRunwayDirection();
                        this.hasSetDepRunway = true;
                    }
                    else if (fpm.getApproachRunway() != undefined) {
                        runway = fpm.getApproachRunway();
                        runwayHeading = runway.direction;
                    }
                    let reciprocalHeading = runwayHeading - 180;
                    let leftPerpHeading = runwayHeading - 90;
                    let rightPerpHeading = runwayHeading + 90;
                    if (runwayHeading < 0){
                        reciprocalHeading =+ 360;
                    }
                    if (leftPerpHeading < 0){
                        leftPerpHeading =+ 360;
                    }
                    if (rightPerpHeading < 0){
                        rightPerpHeading =+ 360;
                    }
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
                    const pos = map.coordinatesToXY(waypoint.infos.coordinates);
                    const width = 0.015 * mapRangeEnumToNM[mapRange];
                    const runwayLength = 3;
                    const centreLineLength = 14.2;
                    //Runway waypoint
                    const coords = waypoint.infos.coordinates;
                    //Extended centreline plotting coords (Dashed)
                    const pos2 = map.coordinatesToXY(Avionics.Utils.bearingDistanceToCoordinates(reciprocalHeading, centreLineLength, coords.lat, coords.long));
                    const pos3 = map.coordinatesToXY(Avionics.Utils.bearingDistanceToCoordinates(runwayHeading, runwayLength, coords.lat, coords.long));
                    const pos4 = map.coordinatesToXY(Avionics.Utils.bearingDistanceToCoordinates(runwayHeading, runwayLength + centreLineLength, coords.lat, coords.long));
                    context.setLineDash([10, 10]);
                    context.moveTo(pos.x, pos.y);
                    context.lineTo(pos2.x, pos2.y);
                    context.moveTo(pos3.x, pos3.y);
                    context.lineTo(pos4.x, pos4.y);
                    context.stroke();
                    //Runway shoulder plotting coords (Solid)
                    context.beginPath();
                    const pos5LLA = Avionics.Utils.bearingDistanceToCoordinates(leftPerpHeading, width, coords.lat, coords.long);
                    const pos5 = map.coordinatesToXY(pos5LLA);
                    const pos6 = map.coordinatesToXY(Avionics.Utils.bearingDistanceToCoordinates(runwayHeading, runwayLength, pos5LLA.lat, pos5LLA.long));
                    context.setLineDash([]);
                    context.moveTo(pos5.x, pos5.y);
                    context.lineTo(pos6.x, pos6.y);
                    const pos7LLA = Avionics.Utils.bearingDistanceToCoordinates(rightPerpHeading, width, coords.lat, coords.long);
                    const pos7 = map.coordinatesToXY(pos7LLA);
                    const pos8 = map.coordinatesToXY(Avionics.Utils.bearingDistanceToCoordinates(runwayHeading, runwayLength, pos7LLA.lat, pos7LLA.long));
                    context.moveTo(pos7.x, pos7.y);
                    context.lineTo(pos8.x, pos8.y);
                    context.stroke();
                }
            }
        }
    }
    isWaypointOnScreen(pos) {
        const coordLimit = 1024;
        if (pos.x > coordLimit || pos.x < 0 || pos.y > coordLimit || pos.y < 0) {
            return false;
        }
        return true;
    }
    /**
     * 
     * @param {Vec2} p1 
     * @param {Vec2} p2 
     * @param {CanvasRenderingContext2D} context 
     */
    drawHoldArc(p1, p2, context, counterClockwise) {
        const cx = (p1.x + p2.x) / 2;
        const cy = (p1.y + p2.y) / 2;
        const radius = p1.Distance(p2) / 2;

        const a1 = Math.atan2(p1.y - cy, p1.x - cx);
        const a2 = Math.atan2(p2.y - cy, p2.x - cx);

        context.arc(cx, cy, radius, a1, a2, counterClockwise);
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
            let outlineDirectLegWidth = fastToFixed((map.config.flightPlanDirectLegStrokeWidth + map.config.flightPlanDirectLegWidth), 0);
            this._outlineLine.setAttribute("stroke-width", outlineDirectLegWidth);
            this._outlineLine.setAttribute("stroke-linecap", "square");
            container.appendChild(this._outlineLine);
        }
        this._colorLine = document.createElementNS(Avionics.SVG.NS, "line");
        this._colorLine.setAttribute("stroke", this.overrideColor != "" ? this.overrideColor : map.config.flightPlanDirectLegColor);
        let colorDirectLegWidth = fastToFixed(map.config.flightPlanDirectLegWidth, 0);
        this._colorLine.setAttribute("stroke-width", colorDirectLegWidth);
        this._colorLine.setAttribute("stroke-linecap", "square");
        container.appendChild(this._colorLine);
        return container;
    }
    updateDraw(map) {
    }
}
SvgBackOnTrackElement.ID = 0;
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