class FMCMainDisplay extends BaseAirliners {
    constructor() {
        super();
        this.defaultInputErrorMessage = "INVALID ENTRY";
        this.currentFlightPlanWaypointIndex = -1;
        this._title = undefined;
        this._pageCurrent = undefined;
        this._pageCount = undefined;
        this._labels = [];
        this._lines = [];
        this._inOut = undefined;
        this.onLeftInput = [];
        this.onRightInput = [];
        this.lastPos = "";
        this.costIndex = NaN;
        this.lastUserInput = "";
        this.isDisplayingErrorMessage = false;
        this.maxCruiseFL = 390;
        this.routeIndex = 0;
        this.coRoute = "";
        this.routeIsSelected = false;
        this.routePageCurrent = 1;
        this.routePageCount = 2;
        this.tmpOrigin = "";
        this.tmpDestination = "";
        this.customV1Speed = false;
        this.customVRSpeed = false;
        this.customV2Speed = false;
        this.transitionAltitude = 5000;
        this.perfTOTemp = 20;
        this.overSpeedLimitThreshold = false;
        this._overridenFlapApproachSpeed = NaN;
        this._overridenSlatApproachSpeed = NaN;
        this.taxiFuelWeight = 0.2;
        this._routeFinalFuelWeight = NaN;
        this._routeFinalFuelTime = NaN;
        this._routeReservedWeight = NaN;
        this._routeReservedPercent = 0;
        this.zeroFuelWeight = 0;
        this.zeroFuelWeightMassCenter = 0;
        this.takeOffTrim = 0;
        this._takeOffFlap = -1;
        this.blockFuel = 0;
        this._fuelReserves = NaN;
        this.takeOffWeight = NaN;
        this.landingWeight = NaN;
        this.averageWind = NaN;
        this.perfCrzWindHeading = NaN;
        this.perfCrzWindSpeed = NaN;
        this.perfApprQNH = NaN;
        this.perfApprTemp = NaN;
        this.perfApprWindHeading = NaN;
        this.perfApprWindSpeed = NaN;
        this.perfApprTransAlt = NaN;
        this.vApp = NaN;
        this.perfApprMDA = NaN;
        this.perfApprDH = NaN;
        this.flightPhaseHasChangedToCruise = false;
        this.flightPhaseHasChangedToDescent = false;
        this._flightPhases = ["PREFLIGHT", "TAXI", "TAKEOFF", "CLIMB", "CRUISE", "DESCENT", "APPROACH", "GOAROUND"];
        if (!SimVar.GetSimVarValue("SIM ON GROUND","bool")) {
            this.currentFlightPhase = FlightPhase.FLIGHT_PHASE_CLIMB;
        }
        else {
            this.currentFlightPhase = FlightPhase.FLIGHT_PHASE_TAKEOFF;
        }
        this._lockConnectIls = false;
        this._apNavIndex = 1;
        this._apLocalizerOn = false;
        this._canSwitchToNav = false;
        this.needApproachToSwitchToNav = true;
        this._vhf1Frequency = 0;
        this._vhf2Frequency = 0;
        this._vor1FrequencyIdent = "";
        this._vor1Frequency = 0;
        this._vor1Course = 0;
        this._vor2FrequencyIdent = "";
        this._vor2Frequency = 0;
        this._vor2Course = 0;
        this._ilsFrequencyIdent = "";
        this._ilsFrequency = 0;
        this._ilsCourse = 0;
        this._adf1Frequency = 0;
        this._adf2Frequency = 0;
        this._rcl1Frequency = 0;
        this._pre2Frequency = 0;
        this._atc1Frequency = 0;
        this._radioNavOn = false;
        this._approachInitialized = false;
        this._fuelVarsUpdatedGrossWeight = 0;
        this._fuelVarsUpdatedTripCons = 0;
        this._debug = 0;
        this._checkUpdateFuel = 0;
        this._checkFlightPlan = 0;
        this._smoothedTargetHeading = NaN;
        this._smootherTargetPitch = NaN;
        FMCMainDisplay.DEBUG_INSTANCE = this;
    }
    static approachTypeStringToIndex(approachType) {
        approachType = approachType.trim();
        let index = FMCMainDisplay.approachTypes.indexOf(approachType);
        if (isFinite(index) && index > 0) {
            return index;
        }
        return 0;
    }
    getTitle() {
        if (this._title === undefined) {
            this._title = this._titleElement.textContent;
        }
        return this._title;
    }
    setTitle(content) {
        let color = content.split("[color]")[1];
        if (!color) {
            color = "white";
        }
        this._title = content.split("[color]")[0];
        this._titleElement.classList.remove("white", "blue", "yellow", "green", "red", "magenta");
        this._titleElement.classList.add(color);
        this._titleElement.innerHTML = this._title;
    }
    getPageCurrent() {
        if (this._pageCurrent === undefined) {
            this._pageCurrent = parseInt(this._pageCurrentElement.textContent);
        }
        return this._pageCurrent;
    }
    setPageCurrent(value) {
        if (typeof (value) === "number") {
            this._pageCurrent = value;
        }
        else if (typeof (value) === "string") {
            this._pageCurrent = parseInt(value);
        }
        this._pageCurrentElement.textContent = (this._pageCurrent > 0 ? this._pageCurrent : "") + "";
    }
    getPageCount() {
        if (this._pageCount === undefined) {
            this._pageCount = parseInt(this._pageCountElement.textContent);
        }
        return this._pageCount;
    }
    setPageCount(value) {
        if (typeof (value) === "number") {
            this._pageCount = value;
        }
        else if (typeof (value) === "string") {
            this._pageCount = parseInt(value);
        }
        this._pageCountElement.textContent = (this._pageCount > 0 ? this._pageCount : "") + "";
        if (this._pageCount === 0) {
            this.getChildById("page-slash").textContent = "";
        }
        else {
            this.getChildById("page-slash").textContent = "/";
        }
    }
    getLabel(row, col = 0) {
        if (!this._labels[row]) {
            this._labels[row] = [];
        }
        return this._labels[row][col];
    }
    setLabel(label, row, col = -1) {
        if (col >= this._labelElements[row].length) {
            return;
        }
        if (!this._labels[row]) {
            this._labels[row] = [];
        }
        if (!label) {
            label = "";
        }
        if (col === -1) {
            for (let i = 0; i < this._labelElements[row].length; i++) {
                this._labels[row][i] = "";
                this._labelElements[row][i].textContent = "";
            }
            col = 0;
        }
        if (label === "__FMCSEPARATOR") {
            label = "---------------------------";
        }
        if (label !== "") {
            let color = label.split("[color]")[1];
            if (!color) {
                color = "white";
            }
            let e = this._labelElements[row][col];
            e.classList.remove("white", "blue", "yellow", "green", "red", "magenta");
            e.classList.add(color);
            label = label.split("[color]")[0];
        }
        this._labels[row][col] = label;
        this._labelElements[row][col].textContent = label;
    }
    getLine(row, col = 0) {
        if (!this._lines[row]) {
            this._lines[row] = [];
        }
        return this._lines[row][col];
    }
    setLine(content, row, col = -1) {
        if (col >= this._lineElements[row].length) {
            return;
        }
        if (!content) {
            content = "";
        }
        if (!this._lines[row]) {
            this._lines[row] = [];
        }
        if (col === -1) {
            for (let i = 0; i < this._lineElements[row].length; i++) {
                this._lines[row][i] = "";
                this._lineElements[row][i].textContent = "";
            }
            col = 0;
        }
        if (content === "__FMCSEPARATOR") {
            content = "------------------------";
        }
        if (content !== "") {
            if (content.indexOf("[s-text]") !== -1) {
                content = content.replace("[s-text]", "");
                this._lineElements[row][col].classList.add("s-text");
            }
            else {
                this._lineElements[row][col].classList.remove("s-text");
            }
            let color = content.split("[color]")[1];
            if (!color) {
                color = "white";
            }
            let e = this._lineElements[row][col];
            e.classList.remove("white", "blue", "yellow", "green", "red", "magenta");
            e.classList.add(color);
            content = content.split("[color]")[0];
        }
        content = content.replace("\<", "&lt");
        this._lines[row][col] = content;
        this._lineElements[row][col].innerHTML = this._lines[row][col];
    }
    get inOut() {
        return this.getInOut();
    }
    getInOut() {
        if (this._inOut === undefined) {
            this._inOut = this._inOutElement.textContent;
        }
        return this._inOut;
    }
    set inOut(v) {
        this.setInOut(v);
    }
    setInOut(content) {
        this._inOut = content;
        this._inOutElement.textContent = this._inOut;
        if (content === FMCMainDisplay.clrValue) {
            this._inOutElement.style.paddingLeft = "8%";
        }
        else {
            this._inOutElement.style.paddingLeft = "";
        }
    }
    setTemplate(template, large = false) {
        if (template[0]) {
            this.setTitle(template[0][0]);
            this.setPageCurrent(template[0][1]);
            this.setPageCount(template[0][2]);
            this.setTitleLeft(template[0][3]);
        }
        for (let i = 0; i < 6; i++) {
            let tIndex = 2 * i + 1;
            if (template[tIndex]) {
                if (large) {
                    if (template[tIndex][1] !== undefined) {
                        this.setLine(template[tIndex][0], i, 0);
                        this.setLine(template[tIndex][1], i, 1);
                        this.setLine(template[tIndex][2], i, 2);
                        this.setLine(template[tIndex][3], i, 3);
                    } else {
                        this.setLine(template[tIndex][0], i, -1);
                    }
                } else {
                    if (template[tIndex][1] !== undefined) {
                        this.setLabel(template[tIndex][0], i, 0);
                        this.setLabel(template[tIndex][1], i, 1);
                        this.setLabel(template[tIndex][2], i, 2);
                        this.setLabel(template[tIndex][3], i, 3);
                    } else {
                        this.setLabel(template[tIndex][0], i, -1);
                    }
                }
            }
            tIndex = 2 * i + 2;
            if (template[tIndex]) {
                if (template[tIndex][1] !== undefined) {
                    this.setLine(template[tIndex][0], i, 0);
                    this.setLine(template[tIndex][1], i, 1);
                    this.setLine(template[tIndex][2], i, 2);
                    this.setLine(template[tIndex][3], i, 3);
                } else {
                    this.setLine(template[tIndex][0], i, -1);
                }
            }
        }
        if (template[13]) {
            this.setInOut(template[13][0]);
        }
        SimVar.SetSimVarValue("L:AIRLINER_MCDU_CURRENT_FPLN_WAYPOINT", "number", this.currentFlightPlanWaypointIndex);
        // Apply formatting helper to title page, lines and labels
        if (this._titleElement !== null) {
            this._titleElement.innerHTML = this._formatCell(this._titleElement.innerHTML);
        }
        this._lineElements.forEach((row) => {
            row.forEach((column) => {
                if (column !== null) {
                    column.innerHTML = this._formatCell(column.innerHTML);
                }
            });
        });
        this._labelElements.forEach((row) => {
            row.forEach((column) => {
                if (column !== null) {
                    column.innerHTML = this._formatCell(column.innerHTML);
                }
            });
        });
    }
    _formatCell(str) {
        return str
            .replace(/{big}/g, "<span class='b-text'>")
            .replace(/{small}/g, "<span class='s-text'>")
            .replace(/{big}/g, "<span class='b-text'>")
            .replace(/{amber}/g, "<span class='amber'>")
            .replace(/{red}/g, "<span class='red'>")
            .replace(/{green}/g, "<span class='green'>")
            .replace(/{cyan}/g, "<span class='cyan'>")
            .replace(/{white}/g, "<span class='white'>")
            .replace(/{magenta}/g, "<span class='magenta'>")
            .replace(/{yellow}/g, "<span class='yellow'>")
            .replace(/{inop}/g, "<span class='inop'>")
            .replace(/{sp}/g, "&nbsp;")
            .replace(/{left}/g, "<span class='left'>")
            .replace(/{right}/g, "<span class='right'>")
            .replace(/{end}/g, "</span>");
    }

    getNavDataDateRange() {
        return SimVar.GetGameVarValue("FLIGHT NAVDATA DATE RANGE", "string");
    }
    get cruiseFlightLevel() {
        return this._cruiseFlightLevel;
    }
    set cruiseFlightLevel(fl) {
        this._cruiseFlightLevel = Math.round(fl / 5) * 5;
        SimVar.SetSimVarValue("L:AIRLINER_CRUISE_ALTITUDE", "number", this._cruiseFlightLevel * 100);
    }
    getCostIndexFactor() {
        if (isFinite(this.costIndex)) {
            return this.costIndex / 999;
        }
        return 0.1;
    }
    clearUserInput() {
        if (!this.isDisplayingErrorMessage) {
            this.lastUserInput = this.inOut;
        }
        this.inOut = "";
    }
    showErrorMessage(message) {
        this.isDisplayingErrorMessage = true;
        this.inOut = message;
    }
    async tryUpdateRefAirport(airportIdent) {
        let airport = await this.dataManager.GetAirportByIdent(airportIdent);
        if (!airport) {
            this.showErrorMessage("NOT IN DATABASE");
            return false;
        }
        this.refAirport = airport;
        return true;
    }
    tryUpdateGate(gate) {
        if (gate.length > 6) {
            this.showErrorMessage(this.defaultInputErrorMessage);
            return false;
        }
        this.refGate = gate;
        return true;
    }
    tryUpdateHeading(heading) {
        let nHeading = parseInt(heading);
        if (isNaN(nHeading)) {
            this.showErrorMessage(this.defaultInputErrorMessage);
            return false;
        }
        nHeading = Math.round(nHeading) % 360;
        this.refHeading = nHeading;
        return true;
    }
    async tryUpdateIrsCoordinatesDisplay(newIrsCoordinatesDisplay) {
        if (!this.dataManager.IsValidLatLon(newIrsCoordinatesDisplay)) {
            this.showErrorMessage(this.defaultInputErrorMessage);
            return false;
        }
        this.initCoordinates = newIrsCoordinatesDisplay;
        this.lastPos = this.initCoordinates;
        return true;
    }
    setCruiseFlightLevelAndTemperature(input) {
        if (input === FMCMainDisplay.clrValue) {
            this.cruiseFlightLevel = undefined;
            this.cruiseTemperature = undefined;
            return true;
        }
        let flString = input.split("/")[0].replace("FL", "");
        let tempString = input.split("/")[1];
        let onlyTemp = flString.length === 0;
        if (tempString) {
            let temp = parseFloat(tempString);
            if (isFinite(temp)) {
                if (temp > -270 && temp < 100) {
                    this.cruiseTemperature = temp;
                }
                else {
                    if (onlyTemp) {
                        this.showErrorMessage("ENTRY OUT OF RANGE");
                        return false;
                    }
                }
            }
            else {
                if (onlyTemp) {
                    this.showErrorMessage(this.defaultInputErrorMessage);
                    return false;
                }
            }
        }
        if (flString) {
            let fl = parseFloat(flString);
            if (isFinite(fl)) {
                if (fl > 0 && fl <= this.maxCruiseFL) {
                    this.cruiseFlightLevel = fl;
                    return true;
                }
                else if (fl >= 1000 && fl <= this.maxCruiseFL * 100) {
                    this.cruiseFlightLevel = Math.floor(fl / 100);
                    return true;
                }
                this.showErrorMessage("ENTRY OUT OF RANGE");
                return false;
            }
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    trySetGroundTemperature(groundTemperature) {
        let value = parseInt(groundTemperature);
        if (isFinite(value)) {
            this.groundTemperature = value;
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    tryUpdateCostIndex(costIndex, maxValue = 1000) {
        let value = parseInt(costIndex);
        if (isFinite(value)) {
            if (value >= 0) {
                if (value < maxValue) {
                    this.costIndex = value;
                    return true;
                }
            }
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    ensureCurrentFlightPlanIsTemporary(callback = EmptyCallback.Boolean) {
        if (this.flightPlanManager.getCurrentFlightPlanIndex() === 0) {
            this.flightPlanManager.copyCurrentFlightPlanInto(1, () => {
                this.flightPlanManager.setCurrentFlightPlanIndex(1, false, (result) => {
                    SimVar.SetSimVarValue("L:FMC_FLIGHT_PLAN_IS_TEMPORARY", "number", 1);
                    SimVar.SetSimVarValue("L:MAP_SHOW_TEMPORARY_FLIGHT_PLAN", "number", 1);
                    callback(result);
                });
            });
        }
        else {
            callback(true);
        }
    }
    tryUpdateFromTo(fromTo, callback = EmptyCallback.Boolean) {
        if (fromTo === FMCMainDisplay.clrValue) {
            this.showErrorMessage("NOT ALLOWED");
            return callback(false);
        }
        let from = fromTo.split("/")[0];
        let to = fromTo.split("/")[1];
        this.dataManager.GetAirportByIdent(from).then((airportFrom) => {
            if (airportFrom) {
                this.dataManager.GetAirportByIdent(to).then((airportTo) => {
                    if (airportTo) {
                        this.eraseTemporaryFlightPlan(() => {
                            this.flightPlanManager.clearFlightPlan(() => {
                                this.flightPlanManager.setOrigin(airportFrom.icao, () => {
                                    this.tmpOrigin = airportFrom.ident;
                                    this.flightPlanManager.setDestination(airportTo.icao, () => {
                                        this.recalculateTHRRedAccTransAlt();
                                        this.tmpOrigin = airportTo.ident;
                                        this.currentFlightPhase = FlightPhase.FLIGHT_PHASE_TAKEOFF;
                                        callback(true);
                                    });
                                });
                            });
                        });
                    }
                    else {
                        this.showErrorMessage("NOT IN DATABASE");
                        callback(false);
                    }
                });
            }
            else {
                this.showErrorMessage("NOT IN DATABASE");
                callback(false);
            }
        });
    }
    async tryUpdateAltDestination(altDestIdent) {
        if (altDestIdent === "NONE") {
            this.altDestination = undefined;
            return true;
        }
        let airportAltDest = await this.dataManager.GetAirportByIdent(altDestIdent);
        if (airportAltDest) {
            this.altDestination = airportAltDest;
            return true;
        }
        this.showErrorMessage("NOT IN DATABASE");
        return false;
    }
    updateRouteOrigin(newRouteOrigin, callback = EmptyCallback.Boolean) {
        this.dataManager.GetAirportByIdent(newRouteOrigin).then(airport => {
            if (!airport) {
                this.showErrorMessage("NOT IN DATABASE");
                return callback(false);
            }
            this.flightPlanManager.clearFlightPlan(() => {
                this.flightPlanManager.setOrigin(airport.icao, () => {
                    this.tmpOrigin = airport.ident;
                    this.recalculateTHRRedAccTransAlt();
                    callback(true);
                });
            });
        });
    }
    updateRouteDestination(routeDestination, callback = EmptyCallback.Boolean) {
        this.dataManager.GetAirportByIdent(routeDestination).then(airport => {
            if (!airport) {
                this.showErrorMessage("NOT IN DATABASE");
                return callback(false);
            }
            this.flightPlanManager.setDestination(airport.icao, () => {
                this.tmpDestination = airport.ident;
                this.recalculateTHRRedAccTransAlt();
                callback(true);
            });
        });
    }
    setOriginRunway(runwayName, callback = EmptyCallback.Boolean) {
        let origin = this.flightPlanManager.getOrigin();
        if (origin && origin.infos instanceof AirportInfo) {
            let runwayIndex = origin.infos.oneWayRunways.findIndex(r => { return Avionics.Utils.formatRunway(r.designation) === Avionics.Utils.formatRunway(runwayName); });
            if (runwayIndex >= 0) {
                this.ensureCurrentFlightPlanIsTemporary(() => {
                    this.flightPlanManager.setOriginRunwayIndex(runwayIndex, () => {
                        return callback(true);
                    });
                });
            }
            else {
                this.showErrorMessage("NOT IN DATABASE");
                return callback(false);
            }
        }
        else {
            this.showErrorMessage("NO ORIGIN AIRPORT");
            return callback(false);
        }
    }
    setOriginRunwayIndex(runwayIndex, callback = EmptyCallback.Boolean) {
        this.ensureCurrentFlightPlanIsTemporary(() => {
            this.flightPlanManager.setDepartureProcIndex(-1, () => {
                this.flightPlanManager.setOriginRunwayIndex(runwayIndex, () => {
                    return callback(true);
                });
            });
        });
    }
    setRunwayIndex(runwayIndex, callback = EmptyCallback.Boolean) {
        this.ensureCurrentFlightPlanIsTemporary(() => {
            let routeOriginInfo = this.flightPlanManager.getOrigin().infos;
            if (!this.flightPlanManager.getOrigin()) {
                this.showErrorMessage("NO ORIGIN SET");
                return callback(false);
            }
            else if (runwayIndex === -1) {
                this.flightPlanManager.setDepartureRunwayIndex(-1, () => {
                    this.flightPlanManager.setOriginRunwayIndex(-1, () => {
                        return callback(true);
                    });
                });
            }
            else if (routeOriginInfo instanceof AirportInfo) {
                if (routeOriginInfo.oneWayRunways[runwayIndex]) {
                    this.flightPlanManager.setDepartureRunwayIndex(runwayIndex, () => {
                        return callback(true);
                    });
                }
            }
            else {
                this.showErrorMessage("NOT IN DATABASE");
                callback(false);
            }
        });
    }
    setDepartureIndex(departureIndex, callback = EmptyCallback.Boolean) {
        this.ensureCurrentFlightPlanIsTemporary(() => {
            let currentRunway = this.flightPlanManager.getDepartureRunway();
            this.flightPlanManager.setDepartureProcIndex(departureIndex, () => {
                if (currentRunway) {
                    let departure = this.flightPlanManager.getDeparture();
                    let departureRunwayIndex = departure.runwayTransitions.findIndex(t => {
                        return t.name.indexOf(currentRunway.designation) != -1;
                    });
                    if (departureRunwayIndex >= -1) {
                        return this.flightPlanManager.setDepartureRunwayIndex(departureRunwayIndex, () => {
                            return callback(true);
                        });
                    }
                }
                return callback(true);
            });
        });
    }
    removeDeparture() {
        this.flightPlanManager.removeDeparture();
        return true;
    }
    setApproachTransitionIndex(transitionIndex, callback = EmptyCallback.Boolean) {
        let arrivalIndex = this.flightPlanManager.getArrivalProcIndex();
        this.ensureCurrentFlightPlanIsTemporary(() => {
            this.flightPlanManager.setApproachTransitionIndex(transitionIndex, () => {
                this.flightPlanManager.setArrivalProcIndex(arrivalIndex, () => {
                    callback(true);
                });
            });
        });
    }
    setArrivalProcIndex(arrivalIndex, callback = EmptyCallback.Boolean) {
        this.ensureCurrentFlightPlanIsTemporary(() => {
            this.flightPlanManager.setArrivalProcIndex(arrivalIndex, () => {
                callback(true);
            });
        });
    }
    setArrivalIndex(arrivalIndex, transitionIndex, callback = EmptyCallback.Boolean) {
        this.ensureCurrentFlightPlanIsTemporary(() => {
            this.flightPlanManager.setArrivalEnRouteTransitionIndex(transitionIndex, () => {
                this.flightPlanManager.setArrivalProcIndex(arrivalIndex, () => {
                    callback(true);
                });
            });
        });
    }
    removeArrival() {
        this.flightPlanManager.removeDeparture();
        return true;
    }
    setApproachIndex(approachIndex, callback = EmptyCallback.Boolean) {
        this.ensureCurrentFlightPlanIsTemporary(() => {
            this.flightPlanManager.setApproachIndex(approachIndex, () => {
                let frequency = this.flightPlanManager.getApproachNavFrequency();
                if (isFinite(frequency)) {
                    let freq = Math.round(frequency * 100) / 100;
                    let approach = this.flightPlanManager.getApproach();
                    if (approach && approach.name && approach.isLocalizer()) {
                        if (this.connectIlsFrequency(freq)) {
                            SimVar.SetSimVarValue("L:FLIGHTPLAN_APPROACH_ILS", "number", freq);
                            let runway = this.flightPlanManager.getApproachRunway();
                            if (runway) {
                                SimVar.SetSimVarValue("L:FLIGHTPLAN_APPROACH_COURSE", "number", runway.direction);
                            }
                        }
                    }
                    else {
                        this.vor1Frequency = freq;
                    }
                }
                callback(true);
            });
        });
    }
    updateFlightNo(flightNo, callback = EmptyCallback.Boolean) {
        if (flightNo.length > 7) {
            this.showErrorMessage(this.defaultInputErrorMessage);
            return callback(false);
        }
        SimVar.SetSimVarValue("ATC FLIGHT NUMBER", "string", flightNo, "FMC").then(() => {
            return callback(true);
        });
    }
    updateCoRoute(coRoute, callback = EmptyCallback.Boolean) {
        if (coRoute.length > 2) {
            if (coRoute.length < 10) {
                if (coRoute === "NONE") {
                    this.coRoute = undefined;
                }
                else {
                    this.coRoute = coRoute;
                }
                return callback(true);
            }
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return callback(false);
    }
    getTotalTripTime() {
        if (this.flightPlanManager.getOrigin()) {
            return this.flightPlanManager.getOrigin().infos.totalTimeInFP;
        }
        return NaN;
    }
    getTotalTripFuelCons() {
        if (this.flightPlanManager.getDestination()) {
            return this.flightPlanManager.getOrigin().infos.totalFuelConsInFP;
        }
        return NaN;
    }
    getOrSelectWaypointByIdent(ident, callback) {
        this.dataManager.GetWaypointsByIdent(ident).then((waypoints) => {
            if (!waypoints || waypoints.length === 0) {
                return callback(undefined);
            }
            return callback(waypoints[0]);
        });
    }
    async tryAddNextAirway(newAirway) {
        this.showErrorMessage("NOT IMPLEMENTED");
        return false;
    }
    async tryAddNextWaypoint(newWaypointTo) {
        let waypoints = await this.dataManager.GetWaypointsByIdent(newWaypointTo);
        if (waypoints.length === 0) {
            this.showErrorMessage("NOT IN DATABASE");
            return false;
        }
        if (waypoints.length === 1) {
            this.flightPlanManager.addWaypoint(waypoints[0].icao);
            this.routeIsSelected = false;
            return true;
        }
        return false;
    }
    activateDirectToWaypointIdent(waypointIdent, callback = EmptyCallback.Void) {
        this.getOrSelectWaypointByIdent(waypointIdent, (w) => {
            if (w) {
                return this.activateDirectToWaypoint(w, callback);
            }
            return callback();
        });
    }
    activateDirectToWaypoint(waypoint, callback = EmptyCallback.Void) {
        this.flightPlanManager.activateDirectTo(waypoint.infos.icao, callback);
    }
    insertWaypointNextTo(newWaypointTo, referenceWaypoint, callback = EmptyCallback.Boolean) {
        let referenceWaypointIndex = this.flightPlanManager.indexOfWaypoint(referenceWaypoint);
        if (referenceWaypointIndex >= 0) {
            return this.insertWaypoint(newWaypointTo, referenceWaypointIndex + 1, callback);
        }
        this.showErrorMessage("NOT IN DATABASE");
        callback(false);
    }
    insertWaypoint(newWaypointTo, index, callback = EmptyCallback.Boolean, coords) {
        this.ensureCurrentFlightPlanIsTemporary(async () => {
            this.getOrSelectWaypointByIdent(newWaypointTo, (waypoint) => {
                if (!waypoint) {
                    this.showErrorMessage("NOT IN DATABASE");
                    return callback(false);
                }
                this.flightPlanManager.addWaypoint(waypoint.icao, index, () => {
                    return callback(true);
                });
            }, coords);
        });
    }
    insertWaypointsAlongAirway(lastWaypointIdent, index, airwayName, callback = EmptyCallback.Boolean) {
        let referenceWaypoint = this.flightPlanManager.getWaypoint(index - 1);
        if (referenceWaypoint) {
            let infos = referenceWaypoint.infos;
            if (infos instanceof WayPointInfo) {
                let airway = infos.airways.find(a => { return a.name === airwayName; });
                if (airway) {
                    let firstIndex = airway.icaos.indexOf(referenceWaypoint.icao);
                    let lastWaypointIcao = airway.icaos.find(icao => { return icao.indexOf(lastWaypointIdent) !== -1; });
                    let lastIndex = airway.icaos.indexOf(lastWaypointIcao);
                    if (firstIndex >= 0) {
                        if (lastIndex >= 0) {
                            let inc = 1;
                            if (lastIndex < firstIndex) {
                                inc = -1;
                            }
                            let count = Math.abs(lastIndex - firstIndex);
                            let asyncInsertWaypointByIcao = async (icao, index) => {
                                return new Promise(resolve => {
                                    this.flightPlanManager.addWaypoint(icao, index, () => {
                                        resolve();
                                    });
                                });
                            };
                            let outOfSync = async () => {
                                await asyncInsertWaypointByIcao(airway.icaos[firstIndex + count * inc], index);
                                callback(true);
                            };
                            outOfSync();
                            return;
                        }
                        this.showErrorMessage("2ND INDEX NOT FOUND");
                        return callback(false);
                    }
                    this.showErrorMessage("1ST INDEX NOT FOUND");
                    return callback(false);
                }
                this.showErrorMessage("NO REF WAYPOINT");
                return callback(false);
            }
            this.showErrorMessage("NO WAYPOINT INFOS");
            return callback(false);
        }
        this.showErrorMessage("NO REF WAYPOINT");
        return callback(false);
    }
    async tryInsertAirwayByWaypointIdent(newWaypointIdent, from) {
        this.showErrorMessage("NOT IMPLEMENTED");
        return false;
    }
    async tryInsertAirway(newAirway, from) {
        this.showErrorMessage("NOT IMPLEMENTED");
        return false;
    }
    removeWaypoint(index, callback = EmptyCallback.Void) {
        this.ensureCurrentFlightPlanIsTemporary(() => {
            this.flightPlanManager.removeWaypoint(index, true, callback);
        });
    }
    async tryUpdateWaypointVia(via, waypointIndex) {
        this.showErrorMessage("NOT IMPLEMENTED");
        return false;
    }
    clearDepartureDiscontinuity(callback = EmptyCallback.Void) {
        this.flightPlanManager.clearDepartureDiscontinuity(callback);
    }
    clearArrivalDiscontinuity(callback = EmptyCallback.Void) {
        this.flightPlanManager.clearArrivalDiscontinuity(callback);
    }
    eraseTemporaryFlightPlan(callback = EmptyCallback.Void) {
        this.flightPlanManager.setCurrentFlightPlanIndex(0, false, () => {
            SimVar.SetSimVarValue("L:FMC_FLIGHT_PLAN_IS_TEMPORARY", "number", 0);
            SimVar.SetSimVarValue("L:MAP_SHOW_TEMPORARY_FLIGHT_PLAN", "number", 0);
            callback();
        });
    }
    insertTemporaryFlightPlan(callback = EmptyCallback.Void) {
        if (this.flightPlanManager.getCurrentFlightPlanIndex() === 1) {
            this.flightPlanManager.copyCurrentFlightPlanInto(0, () => {
                this.flightPlanManager.setCurrentFlightPlanIndex(0, false, () => {
                    SimVar.SetSimVarValue("L:FMC_FLIGHT_PLAN_IS_TEMPORARY", "number", 0);
                    SimVar.SetSimVarValue("L:MAP_SHOW_TEMPORARY_FLIGHT_PLAN", "number", 0);
                    if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_APPROACH) {
                        this.flightPlanManager.activateApproach();
                    }
                    callback();
                });
            });
        }
    }
    _computeV1Speed() {
        this.v1Speed = 120;
        SimVar.SetSimVarValue("L:AIRLINER_V1_SPEED", "Knots", this.v1Speed);
    }
    _computeVRSpeed() {
        this.vRSpeed = 130;
        SimVar.SetSimVarValue("L:AIRLINER_VR_SPEED", "Knots", this.vRSpeed);
    }
    _computeV2Speed() {
        this.v2Speed = 140;
        SimVar.SetSimVarValue("L:AIRLINER_V2_SPEED", "Knots", this.v2Speed);
    }
    trySetV1Speed(s) {
        if (s != undefined) {
            if (!/^\d+$/.test(s)) {
                this.showErrorMessage("FORMAT ERROR");
                return false;
            }
            let v = parseInt(s);
            if (isFinite(v)) {
                if (v >= 0 && v < 1000) {
                    this.v1Speed = v;
                    this.customV1Speed = true;
                    SimVar.SetSimVarValue("L:AIRLINER_V1_SPEED", "Knots", this.v1Speed);
                    return true;
                }
                this.showErrorMessage("ENTRY OUT OF RANGE");
                return false;
            }
            this.showErrorMessage(this.defaultInputErrorMessage);
            return false;
        }
        else {
            this.v1Speed = undefined;
            this.customV1Speed = true;
            SimVar.SetSimVarValue("L:AIRLINER_V1_SPEED", "Knots", 0);
            return true;
        }
    }
    trySetVRSpeed(s) {
        if (s != undefined) {
            if (!/^\d+$/.test(s)) {
                this.showErrorMessage("FORMAT ERROR");
                return false;
            }
            let v = parseInt(s);
            if (isFinite(v)) {
                if (v >= 0 && v < 1000) {
                    this.vRSpeed = v;
                    this.customVRSpeed = true;
                    SimVar.SetSimVarValue("L:AIRLINER_VR_SPEED", "Knots", this.vRSpeed);
                    return true;
                }
                this.showErrorMessage("ENTRY OUT OF RANGE");
                return false;
            }
            this.showErrorMessage(this.defaultInputErrorMessage);
            return false;
        }
        else {
            this.vRSpeed = undefined;
            this.customVRSpeed = true;
            SimVar.SetSimVarValue("L:AIRLINER_VR_SPEED", "Knots", 0);
            return true;
        }
    }
    trySetV2Speed(s) {
        if (s != undefined) {
            if (!/^\d+$/.test(s)) {
                this.showErrorMessage("FORMAT ERROR");
                return false;
            }
            let v = parseInt(s);
            if (isFinite(v)) {
                if (v > 0 && v < 1000) {
                    this.v2Speed = v;
                    this.customV2Speed = true;
                    SimVar.SetSimVarValue("L:AIRLINER_V2_SPEED", "Knots", this.v2Speed);
                    return true;
                }
                this.showErrorMessage("ENTRY OUT OF RANGE");
                return false;
            }
            this.showErrorMessage(this.defaultInputErrorMessage);
            return false;
        }
        else {
            this.v2Speed = undefined;
            this.customV2Speed = true;
            SimVar.SetSimVarValue("L:AIRLINER_V2_SPEED", "Knots", 0);
            return true;
        }
    }
    trySetTransAltitude(s) {
        if (!/^\d+$/.test(s)) {
            this.showErrorMessage("FORMAT ERROR");
            return false;
        }
        let v = parseInt(s);
        if (isFinite(v) && v > 0) {
            this.transitionAltitude = v;
            SimVar.SetSimVarValue("L:AIRLINER_TRANS_ALT", "Number", this.v2Speed);
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    trySetAccelerationAltitude(s) {
        let accAlt = NaN;
        let airportElevation = 0;
        let origin = this.flightPlanManager.getOrigin();
        if(isFinite(origin.altitudeinFP)) {
            airportElevation = Math.round(origin.altitudeinFP / 10) * 10;
        }
        if (s) {
            accAlt = parseInt(s);
        }
        if (isFinite(accAlt)) {
            this.accelerationAltitude = accAlt + airportElevation;
            SimVar.SetSimVarValue("L:AIRLINER_ACC_ALT", "Number", this.accelerationAltitude);
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    trySetThrustReductionAltitude(s) {
        let thrRed = NaN;
        let airportElevation = 0;
        let origin = this.flightPlanManager.getOrigin();
        if(isFinite(origin.altitudeinFP)) {
            airportElevation = Math.round(origin.altitudeinFP / 10) * 10;
        }
        if (s) {
            thrRed = parseInt(s);
        }
        if (isFinite(thrRed)) {
            this.thrustReductionAltitude = thrRed + airportElevation;
            SimVar.SetSimVarValue("L:AIRLINER_THR_RED_ALT", "Number", this.thrustReductionAltitude);
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    trySetFlapsTHS(s) {
        if (s) {
            let flaps = s.split("/")[0];
            let validEntry = false;
            if (!/^\d+$/.test(flaps)) {
                this.showErrorMessage("FORMAT ERROR");
                return false;
            }
            let vFlaps = parseInt(flaps);
            if (isFinite(vFlaps)) {
                this.flaps = vFlaps;
                validEntry = true;
            }
            let vThs = s.split("/")[1];
            if (vThs) {
                if (vThs.substr(0, 2) === "UP" || vThs.substr(0, 2) === "DN") {
                    if (isFinite(parseFloat(vThs.substr(2)))) {
                        this.ths = vThs;
                        validEntry = true;
                    }
                }
            }
            if (validEntry) {
                return true;
            }
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    getFlapSpeed() {
        let phase = Simplane.getCurrentFlightPhase();
        let flapsHandleIndex = Simplane.getFlapsHandleIndex();
        let flapSpeed = 100;
        if (flapsHandleIndex == 1) {
            let slatSpeed = 0;
            if (phase == FlightPhase.FLIGHT_PHASE_TAKEOFF || phase == FlightPhase.FLIGHT_PHASE_CLIMB || phase == FlightPhase.FLIGHT_PHASE_GOAROUND) {
                slatSpeed = Simplane.getStallSpeedPredicted(flapsHandleIndex - 1) * 1.25;
            }
            else if (phase == FlightPhase.FLIGHT_PHASE_DESCENT || phase == FlightPhase.FLIGHT_PHASE_APPROACH) {
                slatSpeed = Simplane.getStallSpeedPredicted(flapsHandleIndex + 1) * 1.23;
            }
            return slatSpeed;
        }
        if (flapsHandleIndex == 2 || flapsHandleIndex == 3) {
            if (phase == FlightPhase.FLIGHT_PHASE_TAKEOFF || phase == FlightPhase.FLIGHT_PHASE_CLIMB || phase == FlightPhase.FLIGHT_PHASE_GOAROUND) {
                flapSpeed = Simplane.getStallSpeedPredicted(flapsHandleIndex - 1) * 1.26;
            }
            else if (phase == FlightPhase.FLIGHT_PHASE_DESCENT || phase == FlightPhase.FLIGHT_PHASE_APPROACH) {
                if (flapsHandleIndex == 2)
                    flapSpeed = Simplane.getStallSpeedPredicted(flapsHandleIndex + 1) * 1.47;
                else
                    flapSpeed = Simplane.getStallSpeedPredicted(flapsHandleIndex + 1) * 1.36;
            }
        }
        return flapSpeed;
    }
    getFlapTakeOffSpeed() {
        let dWeight = (this.getWeight() - 42) / (75 - 42);
        return 134 + 40 * dWeight;
    }
    getSlatTakeOffSpeed() {
        let dWeight = (this.getWeight() - 42) / (75 - 42);
        return 183 + 40 * dWeight;
    }
    getCleanTakeOffSpeed() {
        let dWeight = (this.getWeight() - 42) / (75 - 42);
        return 204 + 40 * dWeight;
    }
    updateCleanTakeOffSpeed() {
        let toGreenDotSpeed = this.getCleanTakeOffSpeed();
        if (isFinite(toGreenDotSpeed)) {
            SimVar.SetSimVarValue("L:AIRLINER_TO_GREEN_DOT_SPD", "Number", toGreenDotSpeed);
        }
    }
    setPerfTOFlexTemp(s) {
        let value = parseFloat(s);
        if (isFinite(value) && value > -270 && value < 150) {
            this.perfTOTemp = value;
            SimVar.SetSimVarValue("L:AIRLINER_TO_FLEX_TEMP", "Number", this.perfTOTemp);
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    getClbManagedSpeed() {
        let dCI = this.getCostIndexFactor();
        let flapsHandleIndex = Simplane.getFlapsHandleIndex();
        if (flapsHandleIndex != 0) {
            return this.getFlapSpeed();
        }
        let speed = 220 * (1 - dCI) + 280 * dCI;
        if (this.overSpeedLimitThreshold) {
            if (Simplane.getAltitude() < 9800) {
                speed = Math.min(speed, 250);
                this.overSpeedLimitThreshold = false;
            }
        }
        else if (!this.overSpeedLimitThreshold) {
            if (Simplane.getAltitude() < 10000) {
                speed = Math.min(speed, 250);
            }
            else {
                this.overSpeedLimitThreshold = true;
            }
        }
        return speed;
    }
    getCrzManagedSpeed() {
        let dCI = this.getCostIndexFactor();
        dCI = dCI * dCI;
        let flapsHandleIndex = SimVar.GetSimVarValue("FLAPS HANDLE INDEX", "Number");
        if (flapsHandleIndex != 0) {
            return this.getFlapSpeed();
        }
        let speed = 285 * (1 - dCI) + 310 * dCI;
        if (this.overSpeedLimitThreshold) {
            if (Simplane.getAltitude() < 9800) {
                speed = Math.min(speed, 250);
                this.overSpeedLimitThreshold = false;
            }
        }
        else if (!this.overSpeedLimitThreshold) {
            if (Simplane.getAltitude() < 10000) {
                speed = Math.min(speed, 250);
            }
            else {
                this.overSpeedLimitThreshold = true;
            }
        }
        return speed;
    }
    getDesManagedSpeed() {
        let dCI = this.getCostIndexFactor();
        let flapsHandleIndex = Simplane.getFlapsHandleIndex();
        if (flapsHandleIndex != 0) {
            return this.getFlapSpeed();
        }
        let speed = 240 * (1 - dCI) + 260 * dCI;
        if (this.overSpeedLimitThreshold) {
            if (Simplane.getAltitude() < 9800) {
                speed = Math.min(speed, 250);
                this.overSpeedLimitThreshold = false;
            }
        }
        else if (!this.overSpeedLimitThreshold) {
            if (Simplane.getAltitude() < 10000) {
                speed = Math.min(speed, 250);
            }
            else {
                this.overSpeedLimitThreshold = true;
            }
        }
        return speed;
    }
    getFlapApproachSpeed(useCurrentWeight = true) {
        if (isFinite(this._overridenFlapApproachSpeed)) {
            return this._overridenFlapApproachSpeed;
        }
        let dWeight = ((useCurrentWeight ? this.getWeight() : this.zeroFuelWeight) - 42) / (75 - 42);
        dWeight = Math.min(Math.max(dWeight, 0), 1);
        let base = Math.max(150, this.getVLS() + 5);
        return base + 40 * dWeight;
    }
    setFlapApproachSpeed(s) {
        if (s === FMCMainDisplay.clrValue) {
            this._overridenFlapApproachSpeed = NaN;
            return true;
        }
        let v = parseFloat(s);
        if (isFinite(v)) {
            if (v > 0 && v < 300) {
                this._overridenFlapApproachSpeed = v;
                return true;
            }
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    getSlatApproachSpeed(useCurrentWeight = true) {
        if (isFinite(this._overridenSlatApproachSpeed)) {
            return this._overridenSlatApproachSpeed;
        }
        let dWeight = ((useCurrentWeight ? this.getWeight() : this.zeroFuelWeight) - 42) / (75 - 42);
        dWeight = Math.min(Math.max(dWeight, 0), 1);
        let base = Math.max(157, this.getVLS() + 5);
        return base + 40 * dWeight;
    }
    setSlatApproachSpeed(s) {
        if (s === FMCMainDisplay.clrValue) {
            this._overridenSlatApproachSpeed = NaN;
            return true;
        }
        let v = parseFloat(s);
        if (isFinite(v)) {
            if (v > 0 && v < 300) {
                this._overridenSlatApproachSpeed = v;
                return true;
            }
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    getCleanApproachSpeed() {
        let dWeight = (this.getWeight() - 42) / (75 - 42);
        dWeight = Math.min(Math.max(dWeight, 0), 1);
        let base = Math.max(172, this.getVLS() + 5);
        return base + 40 * dWeight;
    }
    getManagedApproachSpeed(flapsHandleIndex = NaN) {
        if (isNaN(flapsHandleIndex)) {
            flapsHandleIndex = Simplane.getFlapsHandleIndex();
        }
        if (flapsHandleIndex === 0) {
            return this.getCleanApproachSpeed();
        }
        else if (flapsHandleIndex === 1) {
            return this.getSlatApproachSpeed();
        }
        else if (flapsHandleIndex === 2) {
            return this.getFlapApproachSpeed();
        }
        else {
            return this.getVApp();
        }
    }
    updateCleanApproachSpeed() {
        let apprGreenDotSpeed = this.getCleanApproachSpeed();
        if (isFinite(apprGreenDotSpeed)) {
            SimVar.SetSimVarValue("L:AIRLINER_APPR_GREEN_DOT_SPD", "Number", apprGreenDotSpeed);
        }
    }
    async trySetTaxiFuelWeight(s) {
        if (!/[0-9]+(\.[0-9][0-9]?)?/.test(s)) {
            this.showErrorMessage("FORMAT ERROR");
            return false;
        }
        let value = parseFloat(s);
        if (isFinite(value) && value >= 0) {
            this.taxiFuelWeight = value;
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    getRouteFinalFuelWeight() {
        if (isFinite(this._routeFinalFuelWeight)) {
            return this._routeFinalFuelWeight;
        }
        else if (isFinite(this._routeFinalFuelTime)) {
            return this.getTotalTripFuelCons() / this.getTotalTripTime() * this._routeFinalFuelTime;
        }
        return NaN;
    }
    getRouteFinalFuelTime() {
        if (isFinite(this._routeFinalFuelTime)) {
            return this._routeFinalFuelTime;
        }
        else if (isFinite(this._routeFinalFuelWeight)) {
            return this.getTotalTripTime() / this.getTotalTripFuelCons() * this._routeFinalFuelWeight;
        }
        return NaN;
    }
    async trySetRouteFinalFuel(s) {
        if (s) {
            let rteFinalWeight = parseFloat(s.split("/")[0]);
            let rteFinalTime = FMCMainDisplay.hhmmToSeconds(s.split("/")[1]);
            if (isFinite(rteFinalWeight)) {
                this._routeFinalFuelWeight = rteFinalWeight;
                this._routeFinalFuelTime = NaN;
                return true;
            }
            else if (isFinite(rteFinalTime)) {
                this._routeFinalFuelWeight = NaN;
                this._routeFinalFuelTime = rteFinalTime;
                return true;
            }
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    getRouteReservedWeight() {
        if (isFinite(this._routeReservedWeight)) {
            return this._routeReservedWeight;
        }
        else {
            return this._routeReservedPercent * this.blockFuel / 100;
        }
    }
    getRouteReservedPercent() {
        if (isFinite(this._routeReservedWeight) && isFinite(this.blockFuel)) {
            return this._routeReservedWeight / this.blockFuel * 100;
        }
        return this._routeReservedPercent;
    }
    trySetRouteReservedFuel(s) {
        if (s) {
            let rteRsvWeight = parseFloat(s.split("/")[0]);
            let rteRsvPercent = parseFloat(s.split("/")[1]);
            if (isFinite(rteRsvWeight)) {
                this._routeReservedWeight = rteRsvWeight;
                this._routeReservedPercent = 0;
                return true;
            }
            else if (isFinite(rteRsvPercent)) {
                this._routeReservedWeight = NaN;
                this._routeReservedPercent = rteRsvPercent;
                return true;
            }
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    updateTakeOffTrim() {
        let d = (this.zeroFuelWeightMassCenter - 13) / (33 - 13);
        d = Math.min(Math.max(d, -0.5), 1);
        let dW = (this.getWeight(true) - 400) / (800 - 400);
        dW = Math.min(Math.max(dW, 0), 1);
        let minTrim = 3.5 * dW + 1.5 * (1 - dW);
        let maxTrim = 8.6 * dW + 4.3 * (1 - dW);
        this.takeOffTrim = minTrim * d + maxTrim * (1 - d);
    }
    getTakeOffFlap() {
        return this._takeOffFlap;
    }
    setTakeOffFlap(s) {
        let value = Number.parseInt(s);
        if (isFinite(value)) {
            if (value === 10  || value === 20) {
                SimVar.SetSimVarValue("L:SALTY_TAKEOFF_FLAP_VALUE", "number", value);
                this._takeOffFlap = value;
                SimVar.SetSimVarValue("H:B747_8_EICAS_2_UPDATE_ECL", "bool", 1);
                return true;
            }
        }
        this.showErrorMessage("INVALID ENTRY");
        return false;
    }
    getZeroFuelWeight(useLbs = false) {
        if (useLbs) {
            return this.zeroFuelWeight * 2.204623;
        }
        return this.zeroFuelWeight;
    }
    getApproachWeight(useLbs = false) {
        return this.getWeight(useLbs) * 0.25 + this.getZeroFuelWeight(useLbs) * 0.75;
    }
    setZeroFuelWeight(s, callback = EmptyCallback.Boolean, useLbs = false) {
        let value = parseFloat(s);
        if (isFinite(value)) {
            if (!useLbs) {
                value = value * 2.204623;
            }
            Coherent.call("ZFW_VALUE_SET", value * 1000);
            this.updateFuelVars();
            this.updateTakeOffTrim();
            return callback(true);
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        callback(false);
    }
    setZeroFuelCG(s, callback = EmptyCallback.Boolean) {
        let value = parseFloat(s);
        if (isFinite(value) && value > 0 && value < 100) {
            this.zeroFuelWeightMassCenter = value;
            this.updateTakeOffTrim();
            return callback(true);
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        callback(false);
    }
    async trySetZeroFuelWeightZFWCG(s, useLbs = false) {
        let zfw = NaN;
        let zfwcg = NaN;
        if (s) {
            let sSplit = s.split("/");
            zfw = parseFloat(sSplit[0]);
            if (!useLbs) {
                zfw = zfw * 2.204623;
            }
            zfwcg = parseFloat(sSplit[1]);
        }
        if (isFinite(zfw) || isFinite(zfwcg) && zfw > 0 && zfwcg > 0) {
            if (isFinite(zfw)) {
                Coherent.call("ZFW_VALUE_SET", zfw * 1000);
                this.updateFuelVars();
            }
            if (isFinite(zfwcg)) {
                this.zeroFuelWeightMassCenter = zfwcg;
            }
            this.updateTakeOffTrim();
            this.updateCleanTakeOffSpeed();
            this.updateCleanApproachSpeed();
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    getBlockFuel(useLbs = false) {
        if (useLbs) {
            return this.blockFuel * 2.204623;
        }
        return this.blockFuel;
    }
    trySetBlockFuel(s, useLbs = false) {
        let value = parseFloat(s);
        if (isFinite(value)) {
            if (useLbs) {
                value = value / 2.204623;
            }
            this.blockFuel = value;
            this.updateTakeOffTrim();
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    getFuelReserves() {
        return this._fuelReserves;
    }
    setFuelReserves(s, useLbs = false) {
        let value = parseFloat(s);
        if (isFinite(value)) {
            if (value >= 0) {
                if (value < this.getBlockFuel(useLbs)) {
                    this._fuelReserves = value;
                    return true;
                }
            }
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    getWeight(useLbs = false) {
        let w = this.zeroFuelWeight + this.blockFuel;
        if (useLbs) {
            w *= 2.204623;
        }
        return w;
    }
    getCurrentWeight(useLbs = false) {
        return new Promise(resolve => {
            const weight = SimVar.GetSimVarValue("TOTAL WEIGHT", useLbs ? "lbs" : "kg");
            resolve(weight);
        });
    }
    setWeight(a, callback = EmptyCallback.Boolean, useLbs = false) {
        let v = NaN;
        if (typeof (a) === "number") {
            v = a;
        }
        else if (typeof (a) === "string") {
            v = parseFloat(a);
        }
        if (isFinite(v)) {
            if (useLbs) {
                v = v / 2.204623;
            }
            if (isFinite(this.zeroFuelWeight)) {
                if (v - this.zeroFuelWeight > 0) {
                    this.blockFuel = v - this.zeroFuelWeight;
                    return callback(true);
                }
            }
            else {
                this.showErrorMessage("ZFW NOT SET");
                return callback(false);
            }
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return callback(false);
    }
    async trySetTakeOffWeightLandingWeight(s) {
        let tow = NaN;
        let lw = NaN;
        if (s) {
            let sSplit = s.split("/");
            tow = parseFloat(sSplit[0]);
            lw = parseFloat(sSplit[1]);
        }
        if (isFinite(tow) || isFinite(lw)) {
            if (isFinite(tow)) {
                this.takeOffWeight = tow;
            }
            if (isFinite(lw)) {
                this.landingWeight = lw;
            }
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    async trySetAverageWind(s) {
        let value = parseFloat(s);
        if (isFinite(value)) {
            this.averageWind = value;
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    setPerfCrzWind(s) {
        let heading = NaN;
        let speed = NaN;
        if (s) {
            let sSplit = s.split("/");
            heading = parseFloat(sSplit[0]);
            speed = parseFloat(sSplit[1]);
        }
        if ((isFinite(heading) && heading >= 0 && heading < 360) || (isFinite(speed) && speed > 0)) {
            if (isFinite(heading)) {
                this.perfCrzWindHeading = heading;
            }
            if (isFinite(speed)) {
                this.perfCrzWindSpeed = speed;
            }
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    trySetPreSelectedClimbSpeed(s) {
        let v = parseFloat(s);
        if (isFinite(v)) {
            this.preSelectedClbSpeed = v;
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    trySetPreSelectedCruiseSpeed(s) {
        let v = parseFloat(s);
        if (isFinite(v)) {
            this.preSelectedCrzSpeed = v;
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    trySetPreSelectedDescentSpeed(s) {
        let v = parseFloat(s);
        if (isFinite(v)) {
            this.preSelectedDesSpeed = v;
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    setPerfApprQNH(s) {
        let value = parseFloat(s);
        if (isFinite(value)) {
            this.perfApprQNH = value;
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    setPerfApprTemp(s) {
        let value = parseFloat(s);
        if (isFinite(value) && value > -270 && value < 150) {
            this.perfApprTemp = value;
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    setPerfApprWind(s) {
        let heading = NaN;
        let speed = NaN;
        if (s) {
            let sSplit = s.split("/");
            heading = parseFloat(sSplit[0]);
            speed = parseFloat(sSplit[1]);
        }
        if ((isFinite(heading) && heading >= 0 && heading < 360) || (isFinite(speed) && speed > 0)) {
            if (isFinite(heading)) {
                this.perfApprWindHeading = heading;
            }
            if (isFinite(speed)) {
                this.perfApprWindSpeed = speed;
            }
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    setPerfApprTransAlt(s) {
        let value = parseFloat(s);
        if (isFinite(value) && value > 0 && value < 60000) {
            this.perfApprTransAlt = value;
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    getVApp() {
        if (isFinite(this.vApp)) {
            return this.vApp;
        }
        let windComp = SimVar.GetSimVarValue("AIRCRAFT WIND Z", "knots") / 3;
        windComp = Math.max(windComp, 5);
        return this.getVLS() + windComp;
    }
    setPerfApprVApp(s) {
        if (s === FMCMainDisplay.clrValue) {
            this.vApp = NaN;
        }
        let value = parseFloat(s);
        if (isFinite(value) && value > 0) {
            this.vApp = value;
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    getVLS() {
        let flapsHandleIndex = Simplane.getFlapsHandleIndex();
        if (flapsHandleIndex === 4) {
            let dWeight = (this.getWeight() - 61.4) / (82.5 - 61.4);
            return 141 + 20 * dWeight;
        }
        else {
            let dWeight = (this.getWeight() - 61.4) / (82.5 - 61.4);
            return 146 + 21 * dWeight;
        }
    }
    setPerfApprMDA(s) {
        let value = parseFloat(s);
        if (isFinite(value)) {
            this.perfApprMDA = value;
            SimVar.SetSimVarValue("L:AIRLINER_MINIMUM_DESCENT_ALTITUDE", "number", this.perfApprMDA);
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    setPerfApprDH(s) {
        let value = parseFloat(s);
        if (isFinite(value)) {
            this.perfApprDH = value;
            SimVar.SetSimVarValue("L:AIRLINER_DECISION_HEIGHT", "number", this.perfApprDH);
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    getIsFlying() {
        return this.currentFlightPhase >= FlightPhase.FLIGHT_PHASE_TAKEOFF;
    }
    async tryGoInApproachPhase() {
        if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_CLIMB) {
            this.currentFlightPhase = FlightPhase.FLIGHT_PHASE_APPROACH;
            return true;
        }
        if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_CRUISE) {
            this.currentFlightPhase = FlightPhase.FLIGHT_PHASE_APPROACH;
            return true;
        }
        if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_DESCENT) {
            this.currentFlightPhase = FlightPhase.FLIGHT_PHASE_APPROACH;
            return true;
        }
        if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_APPROACH) {
            return true;
        }
        return false;
    }

    checkUpdateFlightPhase() {
        let airSpeed = SimVar.GetSimVarValue("AIRSPEED TRUE", "knots");
        if (airSpeed > 10) {
            if (this.currentFlightPhase === 0) {
                this.currentFlightPhase = FlightPhase.FLIGHT_PHASE_TAKEOFF;
            }
            //Modified to change to FLIGHT_PHASE_CLIMB when passing acceleration altitude instead of Thrust reduction previously
            if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_TAKEOFF) {
                let enterClimbPhase = false;
                let alt = Simplane.getAltitude();
                let accelAlt = SimVar.GetSimVarValue("L:AIRLINER_ACC_ALT", "number");
                if (alt > accelAlt) {
                    this.currentFlightPhase = FlightPhase.FLIGHT_PHASE_CLIMB;
                    this.togaSpeedSet = false;
                    enterClimbPhase = true;
                }
                if (enterClimbPhase) {
                    let origin = this.flightPlanManager.getOrigin();
                    if (origin) {
                        origin.altitudeWasReached = Simplane.getAltitude();
                        origin.timeWasReached = SimVar.GetGlobalVarValue("LOCAL TIME", "seconds");
                        origin.fuelWasReached = SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilograms") / 1000;
                    }
                }
            }
            if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_CLIMB) {
                let altitude = SimVar.GetSimVarValue("INDICATED ALTITUDE", "feet");
                let cruiseFlightLevel = this.cruiseFlightLevel * 100;
                if (isFinite(cruiseFlightLevel)) {
                    if (altitude >= 0.98 * cruiseFlightLevel) {
                        this.currentFlightPhase = FlightPhase.FLIGHT_PHASE_CRUISE;
                        this.flightPhaseHasChangedToCruise = true;
                    }
                }
            }
            if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_CRUISE) {
                let altitude = SimVar.GetSimVarValue("INDICATED ALTITUDE", "feet");
                let cruiseFlightLevel = this.cruiseFlightLevel * 100;
                if (isFinite(cruiseFlightLevel)) {
                    if (altitude < 0.90 * cruiseFlightLevel && !this._isStepClimbing) {
                        this.currentFlightPhase = FlightPhase.FLIGHT_PHASE_DESCENT;
                        this.flightPhaseHasChangedToDescent = true;
                    }
                }
                //descent phase when passing calculated TOD
                let destination = this.flightPlanManager.getDestination();
                if (destination) {
                    let todDistance = SimVar.GetSimVarValue("L:WT_CJ4_TOD_REMAINING", "number");
                    if (todDistance < 1 && todDistance !== 0) {
                        this.currentFlightPhase = FlightPhase.FLIGHT_PHASE_DESCENT;
                    }
                }
            }
            if (this.currentFlightPhase != FlightPhase.FLIGHT_PHASE_APPROACH) {
                let destination = this.flightPlanManager.getDestination();
                if (destination) {
                    let lat = SimVar.GetSimVarValue("PLANE LATITUDE", "degree latitude");
                    let long = SimVar.GetSimVarValue("PLANE LONGITUDE", "degree longitude");
                    let planeLla = new LatLongAlt(lat, long);
                    let dist = Avionics.Utils.computeGreatCircleDistance(destination.infos.coordinates, planeLla);
                    if (dist < 20) {
                        this.tryGoInApproachPhase();
                    }
                }
            }
        }
        if (SimVar.GetSimVarValue("L:AIRLINER_FLIGHT_PHASE", "number") != this.currentFlightPhase) {
            SimVar.SetSimVarValue("L:AIRLINER_FLIGHT_PHASE", "number", this.currentFlightPhase);
            this.onFlightPhaseChanged();
        }
    }
    onFlightPhaseChanged() {
    }
    connectVorFrequency(_index, _freq) {
        if (_freq >= 108 && _freq <= 117.95 && RadioNav.isHz50Compliant(_freq)) {
            if (_index == 1) {
                SimVar.SetSimVarValue("L:FMC_VOR_FREQUENCY:1", "Hz", _freq * 1000000);
                if (!this.isRadioNavActive()) {
                    this.radioNav.setVORActiveFrequency(1, _freq);
                }
            }
            else if (_index == 2) {
                SimVar.SetSimVarValue("L:FMC_VOR_FREQUENCY:2", "Hz", _freq * 1000000);
                if (!this.isRadioNavActive()) {
                    this.radioNav.setVORActiveFrequency(2, _freq);
                }
            }
        }
        return false;
    }
    connectIlsFrequency(_freq) {
        if (_freq >= 108 && _freq <= 111.95 && RadioNav.isHz50Compliant(_freq)) {
            switch (this.radioNav.mode) {
                case NavMode.FOUR_SLOTS:
                    {
                        this.ilsFrequency = _freq;
                        break;
                    }
                case NavMode.TWO_SLOTS:
                    {
                        this.vor1Frequency = _freq;
                        break;
                    }
            }
            this.connectIls();
            return true;
        }
        return false;
    }
    connectIls() {
        if (this.isRadioNavActive()) {
            return;
        }
        if (this._lockConnectIls) {
            return;
        }
        this._lockConnectIls = true;
        setTimeout(() => {
            this._lockConnectIls = false;
        }, 1000);
        switch (this.radioNav.mode) {
            case NavMode.FOUR_SLOTS:
                {
                    if (Math.abs(this.radioNav.getILSActiveFrequency(1) - this.ilsFrequency) > 0.005) {
                        this.radioNav.setILSActiveFrequency(1, this.ilsFrequency);
                    }
                    break;
                }
            case NavMode.TWO_SLOTS:
                {
                    if (Math.abs(this.radioNav.getVORActiveFrequency(1) - this.vor1Frequency) > 0.005) {
                        this.radioNav.setVORActiveFrequency(1, this.vor1Frequency);
                    }
                    break;
                }
            default:
                console.error("Unknown RadioNav operating mode");
                break;
        }
    }
    setIlsFrequency(s) {
        if (s === FMCMainDisplay.clrValue) {
            this.ilsFrequency = 0;
            return true;
        }
        let v = parseFloat(s);
        if (isFinite(v)) {
            let freq = Math.round(v * 100) / 100;
            if (this.connectIlsFrequency(freq))
                return true;
            this.showErrorMessage("OUT OF RANGE");
            return false;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    initRadioNav(_boot) {
        if (this.isPrimary) {
            console.log("Init RadioNav");
            {
                if (_boot) {
                    this.vhf1Frequency = this.radioNav.getVHFActiveFrequency(this.instrumentIndex, 1);
                    this.vhf2Frequency = this.radioNav.getVHFActiveFrequency(this.instrumentIndex, 2);
                }
                else {
                    if (Math.abs(this.radioNav.getVHFActiveFrequency(this.instrumentIndex, 1) - this.vhf1Frequency) > 0.005) {
                        this.radioNav.setVHFActiveFrequency(this.instrumentIndex, 1, this.vhf1Frequency);
                    }
                    if (Math.abs(this.radioNav.getVHFActiveFrequency(this.instrumentIndex, 2) - this.vhf2Frequency) > 0.005) {
                        this.radioNav.setVHFActiveFrequency(this.instrumentIndex, 2, this.vhf2Frequency);
                    }
                }
            }
            {
                if (Math.abs(this.radioNav.getVORActiveFrequency(1) - this.vor1Frequency) > 0.005) {
                    this.radioNav.setVORActiveFrequency(1, this.vor1Frequency);
                }
                if (this.vor1Course >= 0) {
                    SimVar.SetSimVarValue("K:VOR1_SET", "number", this.vor1Course);
                }
                this.connectIls();
            }
            {
                if (Math.abs(this.radioNav.getVORActiveFrequency(2) - this.vor2Frequency) > 0.005) {
                    this.radioNav.setVORActiveFrequency(2, this.vor2Frequency);
                }
                if (this.vor2Course >= 0) {
                    SimVar.SetSimVarValue("K:VOR2_SET", "number", this.vor2Course);
                }
                if (Math.abs(this.radioNav.getILSActiveFrequency(2) - 0) > 0.005) {
                    this.radioNav.setILSActiveFrequency(2, 0);
                }
            }
            {
                if (_boot) {
                    this.adf1Frequency = this.radioNav.getADFActiveFrequency(1);
                    this.adf2Frequency = this.radioNav.getADFActiveFrequency(2);
                }
                else {
                    if (Math.abs(this.radioNav.getADFActiveFrequency(1) - this.adf1Frequency) > 0.005) {
                        SimVar.SetSimVarValue("K:ADF_ACTIVE_SET", "Frequency ADF BCD32", Avionics.Utils.make_adf_bcd32(this.adf1Frequency * 1000)).then(() => {
                        });
                    }
                    if (Math.abs(this.radioNav.getADFActiveFrequency(2) - this.adf2Frequency) > 0.005) {
                        SimVar.SetSimVarValue("K:ADF2_ACTIVE_SET", "Frequency ADF BCD32", Avionics.Utils.make_adf_bcd32(this.adf2Frequency * 1000)).then(() => {
                        });
                    }
                }
            }
            {
                if (_boot) {
                    this.atc1Frequency = SimVar.GetSimVarValue("TRANSPONDER CODE:1", "number");
                }
                else {
                    if (this.atc1Frequency > 0) {
                        SimVar.SetSimVarValue("K:XPNDR_SET", "Frequency BCD16", Avionics.Utils.make_xpndr_bcd16(this.atc1Frequency));
                    }
                    else {
                        this.atc1Frequency = SimVar.GetSimVarValue("TRANSPONDER CODE:1", "number");
                    }
                }
            }
        }
    }
    updateRadioNavState() {
        if (this.isPrimary) {
            let radioNavOn = this.isRadioNavActive();
            if (radioNavOn != this._radioNavOn) {
                this._radioNavOn = radioNavOn;
                if (!radioNavOn)
                    this.initRadioNav(false);
                if (this.refreshPageCallback)
                    this.refreshPageCallback();
            }
            let apNavIndex = 1;
            let gpsDriven = true;
            if (this.canSwitchToNav()) {
                let navid = 0;
                let ils = this.radioNav.getBestILSBeacon();
                if (ils.id > 0) {
                    navid = ils.id;
                }
                else {
                    let vor = this.radioNav.getBestVORBeacon();
                    if (vor.id > 0) {
                        navid = vor.id;
                    }
                }
                if (navid > 0) {
                    apNavIndex = navid;
                    let hasFlightplan = Simplane.getAutopilotGPSActive();
                    let apprCaptured = Simplane.getAutoPilotAPPRCaptured();
                    if (apprCaptured || !hasFlightplan) {
                        gpsDriven = false;
                    }
                }
            }
            if (apNavIndex != this._apNavIndex) {
                Simplane.setAutoPilotSelectedNav(apNavIndex);
                this._apNavIndex = apNavIndex;
            }
            let curState = SimVar.GetSimVarValue("GPS DRIVES NAV1", "Bool");
            if (curState != gpsDriven) {
                SimVar.SetSimVarValue("K:TOGGLE_GPS_DRIVES_NAV1", "Bool", 0);
            }
        }
    }
    canSwitchToNav() {
        if (!this._canSwitchToNav) {
            let altitude = Simplane.getAltitudeAboveGround();
            if (altitude >= 500) {
                this._canSwitchToNav = true;
            }
        }
        if (this._canSwitchToNav) {
            if (!this.needApproachToSwitchToNav) {
                return true;
            }
            else {
                let apprHold = SimVar.GetSimVarValue("AUTOPILOT APPROACH HOLD", "Bool");
                if (apprHold) {
                    return true;
                }
            }
        }
        return false;
    }
    isRadioNavActive() {
        return this.radioNav.getRADIONAVActive((this.isPrimary) ? 1 : 2);
    }
    get vhf1Frequency() { return this._vhf1Frequency; }
    get vhf2Frequency() { return this._vhf2Frequency; }
    get vor1FrequencyIdent() { return this._vor1FrequencyIdent; }
    get vor1Frequency() { return this._vor1Frequency; }
    get vor1Course() { return this._vor1Course; }
    get vor2FrequencyIdent() { return this._vor2FrequencyIdent; }
    get vor2Frequency() { return this._vor2Frequency; }
    get vor2Course() { return this._vor2Course; }
    get ilsFrequencyIdent() { return this._ilsFrequencyIdent; }
    get ilsFrequency() { return this._ilsFrequency; }
    get ilsCourse() { return this._ilsCourse; }
    get adf1Frequency() { return this._adf1Frequency; }
    get adf2Frequency() { return this._adf2Frequency; }
    get rcl1Frequency() { return this._rcl1Frequency; }
    get pre2Frequency() { return this._pre2Frequency; }
    get atc1Frequency() { return this._atc1Frequency; }
    set vhf1Frequency(_frq) { this._vhf1Frequency = _frq; }
    set vhf2Frequency(_frq) { this._vhf2Frequency = _frq; }
    set vor1FrequencyIdent(_ident) { this._vor1FrequencyIdent = _ident; this.radioNav.setVORActiveIdent(1, _ident); }
    set vor1Frequency(_frq) { this._vor1Frequency = _frq; this.connectVorFrequency(1, _frq); }
    set vor1Course(_crs) { this._vor1Course = _crs; }
    set vor2FrequencyIdent(_ident) { this._vor2FrequencyIdent = _ident; this.radioNav.setVORActiveIdent(2, _ident); }
    set vor2Frequency(_frq) { this._vor2Frequency = _frq; this.connectVorFrequency(2, _frq); }
    set vor2Course(_crs) { this._vor2Course = _crs; }
    set ilsFrequencyIdent(_ident) { this._ilsFrequencyIdent = _ident; this.radioNav.setILSActiveIdent(1, _ident); }
    set ilsFrequency(_frq) { this._ilsFrequency = _frq; }
    set ilsCourse(_crs) { this._ilsCourse = _crs; }
    set adf1Frequency(_frq) { this._adf1Frequency = _frq; }
    set adf2Frequency(_frq) { this._adf2Frequency = _frq; }
    set rcl1Frequency(_frq) { this._rcl1Frequency = _frq; }
    set pre2Frequency(_frq) { this._pre2Frequency = _frq; }
    set atc1Frequency(_frq) { this._atc1Frequency = _frq; }
    Init() {
        super.Init();
        this.dataManager = new FMCDataManager(this);
        this.tempCurve = new Avionics.Curve();
        this.tempCurve.interpolationFunction = Avionics.CurveTool.NumberInterpolation;
        this.tempCurve.add(-10 * 3.28084, 21.50);
        this.tempCurve.add(0 * 3.28084, 15.00);
        this.tempCurve.add(10 * 3.28084, 8.50);
        this.tempCurve.add(20 * 3.28084, 2.00);
        this.tempCurve.add(30 * 3.28084, -4.49);
        this.tempCurve.add(40 * 3.28084, -10.98);
        this.tempCurve.add(50 * 3.28084, -17.47);
        this.tempCurve.add(60 * 3.28084, -23.96);
        this.tempCurve.add(70 * 3.28084, -30.45);
        this.tempCurve.add(80 * 3.28084, -36.94);
        this.tempCurve.add(90 * 3.28084, -43.42);
        this.tempCurve.add(100 * 3.28084, -49.90);
        this.tempCurve.add(150 * 3.28084, -56.50);
        this.tempCurve.add(200 * 3.28084, -56.50);
        this.tempCurve.add(250 * 3.28084, -51.60);
        this.tempCurve.add(300 * 3.28084, -46.64);
        this.tempCurve.add(400 * 3.28084, -22.80);
        this.tempCurve.add(500 * 3.28084, -2.5);
        this.tempCurve.add(600 * 3.28084, -26.13);
        this.tempCurve.add(700 * 3.28084, -53.57);
        this.tempCurve.add(800 * 3.28084, -74.51);
        let mainFrame = this.getChildById("Electricity");
        if (mainFrame == null)
            mainFrame = this;
        this.generateHTMLLayout(mainFrame);
        this._titleElement = this.getChildById("title");
        this._pageCurrentElement = this.getChildById("page-current");
        this._pageCountElement = this.getChildById("page-count");
        this._labelElements = [];
        this._lineElements = [];
        for (let i = 0; i < 6; i++) {
            this._labelElements[i] = [
                this.getChildById("label-" + i + "-left"),
                this.getChildById("label-" + i + "-right"),
                this.getChildById("label-" + i + "-center")
            ];
            this._lineElements[i] = [
                this.getChildById("line-" + i + "-left"),
                this.getChildById("line-" + i + "-right"),
                this.getChildById("line-" + i + "-center")
            ];
        }
        this._inOutElement = this.getChildById("in-out");
        this.onMenu = () => { FMCMainDisplayPages.MenuPage(this); };
        this.onLetterInput = (l) => {
            if (this.inOut === FMCMainDisplay.clrValue) {
                this.inOut = "";
            }
            if (this.isDisplayingErrorMessage) {
                this.inOut = this.lastUserInput;
                this.isDisplayingErrorMessage = false;
            }
            this.inOut += l;
        };
        this.onSp = () => {
            if (this.inOut === FMCMainDisplay.clrValue) {
                this.inOut = "";
            }
            if (this.isDisplayingErrorMessage) {
                this.inOut = this.lastUserInput;
                this.isDisplayingErrorMessage = false;
            }
            this.inOut += " ";
        };
        this.onDel = () => { if (this.inOut.length > 0) {
            this.inOut = this.inOut.slice(0, this.inOut.length - 1);
        } };
        this.onDiv = () => {
            if (this.inOut === FMCMainDisplay.clrValue) {
                this.inOut = "";
            }
            if (this.isDisplayingErrorMessage) {
                this.inOut = this.lastUserInput;
                this.isDisplayingErrorMessage = false;
            }
            this.inOut += "/";
        };
        this.onClr = () => {
            if (this.inOut === "") {
                this.inOut = FMCMainDisplay.clrValue;
            }
            else if (this.inOut === FMCMainDisplay.clrValue) {
                this.inOut = "";
            }
            else {
                if (this.isDisplayingErrorMessage) {
                    this.inOut = this.lastUserInput;
                    this.isDisplayingErrorMessage = false;
                }
                else if (this.inOut.length > 0) {
                    this.inOut = this.inOut.substr(0, this.inOut.length - 1);
                }
            }
        };
        this.onClrLong = () => {
            if (this.inOut === "") {
                this.inOut = FMCMainDisplay.clrValue;
            }
            else if (this.inOut === FMCMainDisplay.clrValue) {
                this.inOut = "";
            }
            else {
                if (this.isDisplayingErrorMessage) {
                    this.inOut = this.lastUserInput;
                    this.isDisplayingErrorMessage = false;
                }
                else if (this.inOut.length > 0) {
                    this.inOut = "";
                }
            }
        };
        SimVar.SetSimVarValue("L:FLIGHTPLAN_USE_DECEL_WAYPOINT", "number", 1);
        SimVar.SetSimVarValue("L:AIRLINER_TO_FLEX_TEMP", "Number", this.perfTOTemp);
        this.flightPlanManager.onCurrentGameFlightLoaded(() => {
            this.flightPlanManager.updateFlightPlan(() => {
                this.flightPlanManager.updateCurrentApproach(() => {
                    this.onApproachUpdated();
                    if (Simplane.getAltitude() > 1000) {
                        if (this.flightPlanManager.getWaypoints().length === 2) {
                            Coherent.call("GET_RUNWAY_ARRIVAL").then((runwayArrivalIndex) => {
                                let destination = this.flightPlanManager.getDestination();
                                if (destination.infos instanceof AirportInfo) {
                                    let runwayArrival = destination.infos.unsortedOneWayRunways[runwayArrivalIndex];
                                    if (runwayArrival) {
                                        let ilsApproachIndex = destination.infos.approaches.findIndex(approach => {
                                            return approach.isLocalizer() && approach.name.indexOf(runwayArrival.designation) != -1;                                        });
                                        if (ilsApproachIndex) {
                                            this.setApproachIndex(ilsApproachIndex, () => {
                                                this.insertTemporaryFlightPlan();
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
                if (this.flightPlanManager.getWaypoints().length > 0) {
                    this.costIndex = 100;
                }
                this.onFMCFlightPlanLoaded();
                let callback = () => {
                    this.flightPlanManager.createNewFlightPlan();
                    let cruiseAlt = Math.floor(this.flightPlanManager.cruisingAltitude / 100);
                    console.log("FlightPlan Cruise Override. Cruising at FL" + cruiseAlt + " instead of default FL" + this.cruiseFlightLevel);
                    if (cruiseAlt > 0)
                        this.cruiseFlightLevel = cruiseAlt;
                };
                let arrivalIndex = this.flightPlanManager.getArrivalProcIndex();
                if (arrivalIndex >= 0) {
                    this.flightPlanManager.setArrivalProcIndex(arrivalIndex, callback);
                }
                else {
                    callback();
                }
                this.recalculateTHRRedAccTransAlt();
            });
        });
        this.recalculateTHRRedAccTransAlt();
    }
    onApproachUpdated() {
        if (this._approachInitialized) {
            return;
        }
        let frequency = this.flightPlanManager.getApproachNavFrequency();
        if (isFinite(frequency)) {
            let freq = Math.round(frequency * 100) / 100;
            let approach = this.flightPlanManager.getApproach();
            if (approach && approach.name && approach.name.indexOf("ILS") != -1) {
                if (this.connectIlsFrequency(freq)) {
                    SimVar.SetSimVarValue("L:FLIGHTPLAN_APPROACH_ILS", "number", freq);
                    let runway = this.flightPlanManager.getApproachRunway();
                    if (runway) {
                        SimVar.SetSimVarValue("L:FLIGHTPLAN_APPROACH_COURSE", "number", runway.direction);
                    }
                }
            }
            else {
                console.log("FMCMainDisplay - Frequency is a VOR FREQUENCY");
                this.vor1Frequency = freq;
            }
            this._approachInitialized = true;
        }
    }
    onFMCFlightPlanLoaded() {
    }
    recalculateTHRRedAccTransAlt() {
        let origin = this.flightPlanManager.getOrigin();
        if (origin) {
            if (isFinite(origin.infos.oneWayRunways[0].elevation)) {
                let altitude = Math.round(origin.infos.oneWayRunways[0].elevation * 3.28 / 10) * 10;
                this.thrustReductionAltitude = altitude + 1500;
                this.accelerationAltitude = altitude + 3000;
                if (origin.infos instanceof AirportInfo) {
                    this.transitionAltitude = origin.infos.transitionAltitude;
                }
                SimVar.SetSimVarValue("L:AIRLINER_THR_RED_ALT", "Number", this.thrustReductionAltitude);
                SimVar.SetSimVarValue("L:AIRLINER_ACC_ALT", "Number", this.accelerationAltitude);
                SimVar.SetSimVarValue("L:74S_FMC_ORIGIN_ELEVATION", "Number", altitude);
            }
        }
        else {
            let altitude = Simplane.getAltitude();
            SimVar.SetSimVarValue("L:AIRLINER_THR_RED_ALT", "Number", altitude + 1500);
            SimVar.SetSimVarValue("L:AIRLINER_ACC_ALT", "Number", altitude + 3000);
            SimVar.SetSimVarValue("L:74S_FMC_ORIGIN_ELEVATION", "Number", -1);
        }
        let destination = this.flightPlanManager.getDestination();
        if (destination) {
            if (destination.infos instanceof AirportInfo) {
                this.perfApprTransAlt = destination.infos.transitionAltitude;
                if (isFinite(origin.infos.oneWayRunways[0].elevation)) {
                    SimVar.SetSimVarValue("L:74S_FMC_DEST_ELEVATION", "Number", Math.round(destination.infos.oneWayRunways[0].elevation * 3.28 / 10) * 10);
                }
            }
        }
        else {
            SimVar.SetSimVarValue("L:74S_FMC_DEST_ELEVATION", "Number", -1);
        }
    }
    onPowerOn() {
        super.onPowerOn();
        this.updateFuelVars();
        let gpsDriven = SimVar.GetSimVarValue("GPS DRIVES NAV1", "Bool");
        if (!gpsDriven)
            SimVar.SetSimVarValue("K:TOGGLE_GPS_DRIVES_NAV1", "Bool", 0);
        this._canSwitchToNav = false;
        this.initRadioNav(true);
    }
    onShutDown() {
        super.onShutDown();
        this.clearVSpeeds();
    }
    getFuelVarsUpdatedGrossWeight(useLbs = false) {
        if (!useLbs) {
            return this._fuelVarsUpdatedGrossWeight;
        }
        return this._fuelVarsUpdatedGrossWeight * 2.204623;
    }
    getFuelVarsUpdatedTripCons(useLbs = false) {
        if (!useLbs) {
            return this._fuelVarsUpdatedTripCons;
        }
        return this._fuelVarsUpdatedTripCons * 2.204623;
    }
    updateFuelVars() {
        return new Promise(resolve => {
            this.getCurrentWeight().then(w => {
                let grossWeight = w / 1000;
                if (Math.floor(this._fuelVarsUpdatedGrossWeight) != Math.floor(grossWeight)) {
                    this._fuelVarsUpdatedGrossWeight = grossWeight;
                    this.blockFuel = SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilograms") / 1000;
                    this.zeroFuelWeight = this._fuelVarsUpdatedGrossWeight - this.blockFuel;
                    this.zeroFuelWeightMassCenter = SimVar.GetSimVarValue("CG PERCENT", "percent");
                    this.updateVSpeeds();
                    let waypointsNumber = SimVar.GetSimVarValue("C:fs9gps:FlightPlanWaypointsNumber", "number", this.instrumentIdentifier);
                    if (waypointsNumber > 1) {
                        SimVar.SetSimVarValue("C:fs9gps:FlightPlanWaypointIndex", "number", waypointsNumber - 1).then(() => {
                            this._fuelVarsUpdatedTripCons = SimVar.GetSimVarValue("C:fs9gps:FlightPlanWaypointEstimatedFuelConsumption", "gallons") * SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilograms") / 1000;
                        });
                        resolve();
                    }
                    else {
                        resolve();
                    }
                }
                else {
                    resolve();
                }
            });
        });
    }
    updateVSpeeds() {
        if (!this.customV1Speed && !this.customVRSpeed && !this.customV2Speed && !this.wasTurnedOff()) {
            this._computeV1Speed();
            this._computeVRSpeed();
            this._computeV2Speed();
        }
    }
    clearVSpeeds() {
        this.v1Speed = undefined;
        this.vRSpeed = undefined;
        this.v2Speed = undefined;
        SimVar.SetSimVarValue("L:AIRLINER_V1_SPEED", "Knots", 0);
        SimVar.SetSimVarValue("L:AIRLINER_VR_SPEED", "Knots", 0);
        SimVar.SetSimVarValue("L:AIRLINER_V2_SPEED", "Knots", 0);
        this.customV1Speed = false;
        this.customVRSpeed = false;
        this.customV2Speed = false;
    }
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
        if (this._debug++ > 180) {
            this._debug = 0;
        }
        this.checkUpdateFlightPhase();
        this._checkFlightPlan--;
        if (this._checkFlightPlan <= 0) {
            this._checkFlightPlan = 60;
            this.flightPlanManager.updateFlightPlan();
            this.flightPlanManager.updateCurrentApproach(() => {
                this.onApproachUpdated();
            });
        }
        this._checkUpdateFuel -= _deltaTime / 1000;
        if (this._checkUpdateFuel <= 0) {
            this._checkUpdateFuel = 5;
            this.updateFuelVars();
        }
        if (this.pageUpdate) {
            this.pageUpdate();
        }
        if (SimVar.GetSimVarValue("L:FMC_UPDATE_CURRENT_PAGE", "number") === 1) {
            SimVar.SetSimVarValue("L:FMC_UPDATE_CURRENT_PAGE", "number", 0);
            if (this.refreshPageCallback) {
                this.refreshPageCallback();
            }
        }
        if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_APPROACH) {
            SimVar.SetSimVarValue("L:AIRLINER_MANAGED_APPROACH_SPEED", "number", this.getManagedApproachSpeed());
        }
        this.updateRadioNavState();
    }
    onEvent(_event) {
        if (_event.indexOf("1_BTN_") !== -1 || _event.indexOf("BTN_") !== -1) {
            let input = _event.replace("1_BTN_", "").replace("BTN_", "");
            if (this.onInputAircraftSpecific(input)) {
                return;
            }
            if (input === "INIT") {
                this.onInit();
            }
            else if (input === "DEPARR") {
                this.onDepArr();
            }
            else if (input === "ATC") {
                this.onAtc();
            }
            else if (input === "FIX") {
                this.onFix();
            }
            else if (input === "HOLD") {
                this.onHold();
            }
            else if (input === "FMCCOMM") {
                this.onFmcComm();
            }
            else if (input === "PROG") {
                this.onProg();
            }
            else if (input === "MENU") {
                this.onMenu();
            }
            else if (input === "NAVRAD") {
                this.onRad();
            }
            else if (input === "PREVPAGE") {
                this.onPrevPage();
            }
            else if (input === "NEXTPAGE") {
                this.onNextPage();
            }
            else if (input === "SP") {
                this.onSp();
            }
            else if (input === "DEL") {
                this.onDel();
            }
            else if (input === "CLR") {
                this.onClr();
            }
            else if (input === "CLR_Long") {
                this.onClrLong();
            }
            else if (input === "DIV") {
                this.onDiv();
            }
            else if (input === "DOT") {
                this.inOut += ".";
            }
            else if (input === "PLUSMINUS") {
                this.inOut += "-";
            }
            else if (input === "Localizer") {
                this._apLocalizerOn = !this._apLocalizerOn;
            }
            else if (input.length === 2 && input[0] === "L") {
                let v = parseInt(input[1]);
                if (isFinite(v)) {
                    if (this.onLeftInput[v - 1]) {
                        this.onLeftInput[v - 1]();
                    }
                }
            }
            else if (input.length === 2 && input[0] === "R") {
                let v = parseInt(input[1]);
                if (isFinite(v)) {
                    if (this.onRightInput[v - 1]) {
                        this.onRightInput[v - 1]();
                    }
                }
            }
            else if (input.length === 1 && FMCMainDisplay._AvailableKeys.indexOf(input) !== -1) {
                this.onLetterInput(input);
            }
            else {
                console.log("'" + input + "'");
            }
        }
    }
    clearDisplay() {
        this.setTitle("UNTITLED");
        this.setPageCurrent(0);
        this.setPageCount(0);
        for (let i = 0; i < 6; i++) {
            this.setLabel("", i, -1);
        }
        for (let i = 0; i < 6; i++) {
            this.setLine("", i, -1);
        }
        this.onLeftInput = [];
        this.onRightInput = [];
        this.onPrevPage = undefined;
        this.onNextPage = undefined;
        this.pageUpdate = undefined;
        this.refreshPageCallback = undefined;
        this.unregisterPeriodicPageRefresh();
    }
    generateHTMLLayout(parent) {
        while (parent.children.length > 0) {
            parent.removeChild(parent.children[0]);
        }
        let header = document.createElement("div");
        header.id = "header";
        let title = document.createElement("span");
        title.id = "title";
        header.appendChild(title);
        parent.appendChild(header);
        let page = document.createElement("div");
        page.id = "page-info";
        page.classList.add("s-text");
        let pageCurrent = document.createElement("span");
        pageCurrent.id = "page-current";
        let pageSlash = document.createElement("span");
        pageSlash.id = "page-slash";
        pageSlash.textContent = "/";
        let pageCount = document.createElement("span");
        pageCount.id = "page-count";
        page.appendChild(pageCurrent);
        page.appendChild(pageSlash);
        page.appendChild(pageCount);
        parent.appendChild(page);
        for (let i = 0; i < 6; i++) {
            let label = document.createElement("div");
            label.classList.add("label", "s-text");
            let labelLeft = document.createElement("span");
            labelLeft.id = "label-" + i + "-left";
            labelLeft.classList.add("fmc-block", "label", "label-left");
            let labelRight = document.createElement("span");
            labelRight.id = "label-" + i + "-right";
            labelRight.classList.add("fmc-block", "label", "label-right");
            let labelCenter = document.createElement("span");
            labelCenter.id = "label-" + i + "-center";
            labelCenter.classList.add("fmc-block", "label", "label-center");
            label.appendChild(labelLeft);
            label.appendChild(labelRight);
            label.appendChild(labelCenter);
            parent.appendChild(label);
            let line = document.createElement("div");
            line.classList.add("line");
            let lineLeft = document.createElement("span");
            lineLeft.id = "line-" + i + "-left";
            lineLeft.classList.add("fmc-block", "line", "line-left");
            let lineRight = document.createElement("span");
            lineRight.id = "line-" + i + "-right";
            lineRight.classList.add("fmc-block", "line", "line-right");
            let lineCenter = document.createElement("span");
            lineCenter.id = "line-" + i + "-center";
            lineCenter.classList.add("fmc-block", "line", "line-center");
            line.appendChild(lineLeft);
            line.appendChild(lineRight);
            line.appendChild(lineCenter);
            parent.appendChild(line);
        }
        let footer = document.createElement("div");
        footer.classList.add("line");
        let inout = document.createElement("span");
        inout.id = "in-out";
        footer.appendChild(inout);
        parent.appendChild(footer);
    }
    static secondsTohhmm(seconds) {
        let h = Math.floor(seconds / 3600);
        seconds -= h * 3600;
        let m = Math.floor(seconds / 60);
        return h.toFixed(0).padStart(2, "0") + m.toFixed(0).padStart(2, "0");
    }
    static hhmmToSeconds(hhmm) {
        if (!hhmm) {
            return NaN;
        }
        let h = parseInt(hhmm.substring(0, 2));
        let m = parseInt(hhmm.substring(2, 4));
        return h * 3600 + m * 60;
    }
    setAPSelectedSpeed(_speed, _aircraft) {
        if (isFinite(_speed)) {
            if (Simplane.getAutoPilotMachModeActive()) {
                let mach = SimVar.GetGameVarValue("FROM KIAS TO MACH", "number", _speed);
                Coherent.call("AP_MACH_VAR_SET", 1, mach);
                SimVar.SetSimVarValue("K:AP_MANAGED_SPEED_IN_MACH_ON", "number", 1);
                return;
            }
            Coherent.call("AP_SPD_VAR_SET", 1, _speed);
            SimVar.SetSimVarValue("K:AP_MANAGED_SPEED_IN_MACH_OFF", "number", 1);
        }
    }
    setAPManagedSpeed(_speed, _aircraft) {
        if (isFinite(_speed)) {
            Coherent.call("AP_SPD_VAR_SET", 2, _speed);
        }
    }
    computeETA(distance, speed = NaN, currentTime = NaN) {
        if (isNaN(speed)) {
            speed = Simplane.getGroundSpeed();
        }
        if (speed < 10) {
            return NaN;
        }
        if (isNaN(currentTime)) {
            currentTime = SimVar.GetGlobalVarValue("ZULU TIME", "seconds");
        }
        let eteSeconds = distance / speed * 3600;
        let etaSeconds = currentTime + eteSeconds;
        etaSeconds = etaSeconds % 86400;
        return etaSeconds;
    }
    computeFuelLeft(distance, speed = NaN, currentFuel = NaN, currentFuelFlow = NaN) {
        if (isNaN(speed)) {
            speed = Simplane.getGroundSpeed();
        }
        if (speed < 10) {
            return NaN;
        }
        if (isNaN(currentFuel)) {
            currentFuel = SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilograms") / 1000;
        }
        if (isNaN(currentFuelFlow)) {
            currentFuelFlow = SimVar.GetSimVarValue("TURB ENG FUEL FLOW PPH:1", "pound per hour") + SimVar.GetSimVarValue("TURB ENG FUEL FLOW PPH:2", "pound per hour") + SimVar.GetSimVarValue("TURB ENG FUEL FLOW PPH:3", "pound per hour") + SimVar.GetSimVarValue("TURB ENG FUEL FLOW PPH:4", "pound per hour");
            currentFuelFlow = currentFuelFlow / 1000 / 2.204623;
        }
        let time = distance / speed;
        let fuel = currentFuelFlow * time;
        return currentFuel - fuel;
    }
}
FMCMainDisplay.approachTypes = [
    "UNKNOWN",
    "VFR",
    "HEL",
    "TACAN",
    "NDB",
    "LORAN",
    "RNAV",
    "VOR",
    "GPS",
    "SDF",
    "LDA",
    "LOC",
    "MLS",
    "ILS"
];
FMCMainDisplay.clrValue = "DELETE";
FMCMainDisplay._AvailableKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//# sourceMappingURL=FMCMainDisplay.js.map
