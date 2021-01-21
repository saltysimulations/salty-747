class B747_8_FMC_MainDisplay extends Boeing_FMC {
    constructor() {
        super(...arguments);
        this.activeSystem = "FMC";
        this._registered = false;
        this._lastActiveWP = 0;
        this._wasApproachActive = false;
        this.selectedApproachFlap = NaN;
        this.selectedApproachSpeed = NaN;
        this._climbN1Table = [
            [91, 91.6, 92.9, 94.1, 96.1, 97.6, 99.8, 101.2, 101.5, 100.7],
            [92.8, 93.2, 93.8, 93.1, 94.7, 96.2, 98.3, 99.7, 100.0, 99.2],
            [94.2, 95.0, 95.4, 94.8, 95.0, 94.9, 96.7, 98.2, 98.4, 97.7],
            [92.7, 95.5, 97.0, 96.4, 96.6, 96.5, 95.2, 96.6, 96.8, 96.1],
            [91.2, 93.9, 96.6, 97.9, 98.2, 98.0, 96.9, 95.5, 95.2, 94.5],
            [90.4, 93.1, 95.8, 97.3, 99.0, 98.9, 97.8, 96.5, 95.9, 95.2],
            [89.6, 92.3, 95.0, 96.5, 98.7, 99.7, 98.7, 97.6, 97.0, 96.3],
            [88.8, 91.5, 94.1, 95.6, 97.9, 99.6, 99.7, 98.6, 98.0, 97.3],
            [88.0, 90.7, 93.3, 94.8, 97.0, 98.7, 100.8, 99.6, 99.0, 98.3],
            [87.2, 89.8, 92.4, 93.9, 96.1, 97.8, 101.1, 100.8, 100.0, 99.3],
            [86.4, 89.0, 91.5, 93.0, 95.2, 96.8, 100.2, 101.4, 100.9, 100.3],
            [85.5, 88.1, 90.7, 92.1, 94.3, 95.9, 99.2, 101.0, 100.9, 100.8],
            [84.7, 87.3, 89.8, 91.2, 93.4, 95.0, 98.3, 100.0, 99.9, 99.9],
            [83.9, 86.4, 88.9, 90.3, 92.4, 94.0, 97.3, 99.0, 98.9, 98.9],
            [83.0, 85.5, 88.0, 89.4, 91.5, 93.1, 96.3, 98.0, 97.9, 97.9],
            [82.2, 84.7, 87.1, 88.5, 90.6, 92.1, 95.3, 97.0, 96.9, 96.8],
            [81.3, 83.8, 86.2, 87.5, 89.6, 91.2, 94.3, 96.0, 95.9, 95.8]
        ];
        this._climbN1TempRow = [60, 50, 40, 30, 20, 15, 10, 5, 0, -5, -10, -15, -20, -25, -30, -35, -40];
        this._takeOffN1Table = [
            [89.7, 90.1, 90.6, 90.6, 90.6, 90.5, 90.4, 90.4, 90.3, 90.3, 89.7, 89.2, 88.5],
            [92.5, 93, 93.4, 93.4, 93.4, 93.3, 93.3, 93.2, 93.2, 93.2, 92.6, 92, 91.4],
            [93.9, 94.4, 94.8, 94.8, 94.8, 94.7, 94.6, 94.6, 94.6, 94.5, 94, 93.4, 92.8],
            [95.2, 95.7, 96.2, 96.1, 96.1, 96, 96, 95.9, 95.9, 95.9, 95.3, 94.7, 94.2],
            [96.5, 97, 97.5, 97.4, 97.3, 97.3, 97.3, 97.2, 97.2, 97.2, 96.6, 96, 95.5],
            [97.5, 98.2, 98.9, 98.7, 98.5, 98.4, 98.4, 98.5, 98.4, 98.4, 97.9, 97.3, 96.7],
            [97.8, 98.9, 99.8, 99.7, 99.7, 99.5, 99.3, 99.3, 99.2, 99.3, 8.8, 98.4, 98],
            [97.2, 98.8, 100.4, 100.4, 100.4, 100.4, 100.4, 100.1, 100, 99.9, 99.5, 99.2, 98.8],
            [96.4, 98, 99.6, 100.1, 100.7, 101.1, 101.1, 101.1, 101.7, 101.3, 100.3, 99.9, 99.5],
            [95.6, 97.2, 98.8, 99.3, 99.9, 100.5, 101.1, 101.8, 102.2, 102.4, 102.1, 101.5, 100.3],
            [94.8, 96.3, 97.9, 98.4, 99, 99.6, 1012, 101, 101.7, 102.5, 102.5, 102.2, 1011],
            [93.9, 95.5, 97.1, 97.6, 981, 98.8, 99.4, 100.1, 100.8, 101.6, 101.8, 102, 102.3],
            [93.1, 94.7, 96.2, 96.7, 97.3, 97.9, 98.5, 991, 99.9, 100.7, 100.9, 101.2, 101.4],
            [92.3, 93.8, 95.3, 95.8, 96.4, 97, 97.6, 98.3, 99.1, 99.8, 100, 100.3, 100.6],
            [90.6, 92.1, 93.6, 94.1, 94.6, 95.2, 95.9, 96.6, 97.3, 98, 8.3, 98.5, 98.8],
            [88.8, 90.3, 91.8, 92.3, 92.8, 93.4, 94.1, 94.8, 95.5, 96.3, 96.5, 96.7, 97],
            [87.0, 815, 89.9, 90.4, 91, 91.6, 92.3, 93, 93.7, 94.4, 94.7, 94.9, 95.2],
            [85.2, 86.7, 88.1, 88.6, 89.1, 89.8, 90.5, 91.2, 91.9, 92.6, 92.8, 93.1, 93.4],
            [83.4, 84.8, 861, 86.7, 87.3, 87.9, 88.6, 89.3, 90, 90.7, 91, 91.2, 91.5]
        ];
        this._takeOffN1TempRow = [70, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0, -10, -20, -30, -40, -50];
        this._thrustTakeOffMode = 1;
        this._thrustCLBMode = 1;
        this._thrustTakeOffTemp = 20;
        this._lastUpdateAPTime = NaN;
        this.refreshFlightPlanCooldown = 0;
        this.updateAutopilotCooldown = 0;
        this._hasSwitchedToHoldOnTakeOff = false;
        this._previousApMasterStatus = false;
        this._apMasterStatus = false;
        this._apHasDeactivated = false;
        this._previousAThrStatus = false;
        this._aThrStatus = false;
        this._aThrHasActivated = false;
        this._hasReachedTopOfDescent = false;
        this._apCooldown = 500;

        /* SALTY 747 VARS */
        this._TORwyWindHdg = "";
        this._TORwyWindSpd = "";
        this.messages = [];
        this.sentMessages = [];
        this.atcComm = {            
            estab: false,
            loggedTo: "",
            nextCtr: "",
            maxUlDelay: "",
            ads: "",
            adsEmerg: "",
            dlnkStatus: "NO COMM",
            uplinkPeding: false,
            fltNo: "",
            origin: "",
            planDep: "",
            dest: "",
            eta: "",
            altn: "",
            company: ""
        };
        this.companyComm = {
            estab: false,
            company: "",
        };
        this.simbrief = {
            route: "",
            cruiseAltitude: "",
            originIcao: "",
            destinationIcao: "",
            blockFuel: "",
            payload: "",
            estZfw: "",
            costIndex: "",
            navlog: "",
            icao_airline: "",
            flight_number: "",
            alternateIcao: "",
            avgTropopause: "",
            ete: "",
            blockTime: "",
            outTime: "",
            onTime: "",
            inTime: "",
            offTime: "",
            taxiFuel: "",
            tripFuel: "",
            altnFuel: "",
            finResFuel: "",
            contFuel: "",
            route_distance: "",
            rteUplinkReady: false,            
            perfUplinkReady: false
        }
        this.fixInfo = [];
        this.pdc = {
            fltNo: "",
            dept: "",
            atis: "",
            stand: "",
            acType: "",
            dest: "",
            freeText: "",
            ats: "",
            sendStatus: ""
        }
    }
    get templateID() { return "B747_8_FMC"; }
    connectedCallback() {
        super.connectedCallback();
        RegisterViewListener("JS_LISTENER_KEYEVENT", () => {
            console.log("JS_LISTENER_KEYEVENT registered.");
            RegisterViewListener("JS_LISTENER_FACILITY", () => {
                console.log("JS_LISTENER_FACILITY registered.");
                this._registered = true;
            });
        });
    }
    Init() {
        super.Init();
        let oat = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");
        this._thrustTakeOffTemp = Math.ceil(oat / 10) * 10;
        this.aircraftType = Aircraft.B747_8;
        this.maxCruiseFL = 430;
        this.onInit = () => {
            B747_8_FMC_InitRefIndexPage.ShowPage1(this);
        };
        this.onLegs = () => {
            B747_8_FMC_LegsPage.ShowPage1(this);
        };
        this.onRte = () => {
            FMCRoutePage.ShowPage1(this);
        };
        this.onDepArr = () => {
            B747_8_FMC_DepArrIndexPage.ShowPage1(this);
        };
        this.onRad = () => {
            B747_8_FMC_NavRadioPage.ShowPage(this);
        };
        this.onVNAV = () => {
            B747_8_FMC_VNAVPage.ShowPage1(this);
        };
        this.onProg = () => {
            B747_8_FMC_ProgPage.ShowPage1(this);
        };
        this.onAtc = () => { 
            FMC_ATC_Index.ShowPage(this);
        };
        this.onFmcComm = () => { 
            FMC_COMM_Index.ShowPage(this);
        };
        this.onMenu = () => { 
            FMC_Menu.ShowPage(this);
        };
        FMC_Menu.ShowPage(this);
        this.saltyBase = new SaltyBase();
        this.saltyBase.init();
    }
    onPowerOn() {
        super.onPowerOn();
        this.deactivateLNAV();
        this.deactivateVNAV();
        Coherent.call("GENERAL_ENG_THROTTLE_MANAGED_MODE_SET", ThrottleMode.HOLD);
    }
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
        if (this.refreshPageCallback && this._lastActiveWP != this.currFlightPlanManager.getActiveWaypointIndex() || this._wasApproachActive != this.currFlightPlanManager.isActiveApproach()) {
            this._lastActiveWP = this.currFlightPlanManager.getActiveWaypointIndex();
            this._wasApproachActive = this.currFlightPlanManager.isActiveApproach();
            this.refreshPageCallback();
        }
        this.updateAutopilot();
        this.saltyBase.update();
    }
    onEvent(_event) {
        if (_event.indexOf("1_BTN_") !== -1 || _event.indexOf("2_BTN_") !== -1 || _event.indexOf("BTN_") !== -1 ||  _event.indexOf("3_") !== -1) {
            const input = _event.replace("1_BTN_", "").replace("2_BTN_", "").replace("BTN_", "").replace("3_", "");
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
    onInputAircraftSpecific(input) {
        console.log("B747_8_FMC_MainDisplay.onInputAircraftSpecific input = '" + input + "'");
        if (input === "LEGS") {
            if (this.onLegs) {
                this.onLegs();
            }
            return true;
        }
        if (input === "RTE") {
            if (this.onRte) {
                this.onRte();
            }
            return true;
        }
        if (input === "VNAV") {
            if (this.onVNAV) {
                this.onVNAV();
            }
        }
        if (input === "PROG") {
            if (this.onProg) {
                this.onProg();
            }
        }
        if (input === "ATC") {
            if (this.onAtc) {
                this.onAtc();
            }
        }
        if (input === "FMCCOMM") {
            if (this.onFmcComm) {
                this.onFmcComm();
            }
        }
        if (input === "MENU") {
            if (this.onMenu) {
                this.onMenu();
            }
        }
        return false;
    }
    _getIndexFromTemp(temp) {
        if (temp < -10)
            return 0;
        if (temp < 0)
            return 1;
        if (temp < 10)
            return 2;
        if (temp < 20)
            return 3;
        if (temp < 30)
            return 4;
        if (temp < 40)
            return 5;
        if (temp < 43)
            return 6;
        if (temp < 45)
            return 7;
        if (temp < 47)
            return 8;
        if (temp < 49)
            return 9;
        if (temp < 51)
            return 10;
        if (temp < 53)
            return 11;
        if (temp < 55)
            return 12;
        if (temp < 57)
            return 13;
        if (temp < 59)
            return 14;
        if (temp < 61)
            return 15;
        if (temp < 63)
            return 16;
        if (temp < 65)
            return 17;
        if (temp < 66)
            return 18;
        return 19;
    }
    getTakeOffFLapHandle(){
        switch(this.getTakeOffFlap()){
            case 0: return 0;
            case 1: return 1;
            case 5: return 2;
            case 10: return 3;
            case 20: return 4;
            case 25: return 5;
            case 30: return 6;
        }
    }
    _computeV1Speed() {
        let runwayCoef = 1.0;
        {
            let runway = this.flightPlanManager.getDepartureRunway();
            if (!runway) {
                runway = this.flightPlanManager.getDetectedCurrentRunway();
            }
            console.log(runway);
            if (runway) {
                let f = (runway.length - 1500) / (2500 - 1500);
                runwayCoef = Utils.Clamp(f, 0, 1);
            }
        }
        let dWeightCoeff = (this.getWeight(true) - 550) / (1000 - 550);
        dWeightCoeff = Utils.Clamp(dWeightCoeff, 0, 1);
        dWeightCoeff = 0.73 + (1.13 - 0.73) * dWeightCoeff;
        let flapsHandleIndex = this.getTakeOffFLapHandle();
        let temp = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");
        let index = this._getIndexFromTemp(temp);
        console.log("Index From Temp = " + index);
        let min = B747_8_FMC_MainDisplay._v1s[index][0];
        let max = B747_8_FMC_MainDisplay._v1s[index][1];
        this.v1Speed = min * (1 - runwayCoef) + max * runwayCoef;
        this.v1Speed *= dWeightCoeff;
        this.v1Speed -= (flapsHandleIndex - 3) * 12;
        this.v1Speed = Math.round(this.v1Speed);
        SimVar.SetSimVarValue("L:AIRLINER_V1_SPEED", "Knots", this.v1Speed);
        console.log("Computed V1Speed = " + this.v1Speed);
    }
    _computeVRSpeed() {
        let runwayCoef = 1.0;
        {
            let runway = this.flightPlanManager.getDepartureRunway();
            if (!runway) {
                runway = this.flightPlanManager.getDetectedCurrentRunway();
            }
            console.log(runway);
            if (runway) {
                let f = (runway.length - 1500) / (2500 - 1500);
                runwayCoef = Utils.Clamp(f, 0, 1);
            }
        }
        let dWeightCoeff = (this.getWeight(true) - 550) / (1000 - 550);
        dWeightCoeff = Utils.Clamp(dWeightCoeff, 0, 1);
        dWeightCoeff = 0.8 + (1.22 - 0.8) * dWeightCoeff;
        let flapsHandleIndex = this.getTakeOffFLapHandle();
        let temp = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");
        let index = this._getIndexFromTemp(temp);
        console.log("Index From Temp = " + index);
        let min = B747_8_FMC_MainDisplay._vRs[index][0];
        let max = B747_8_FMC_MainDisplay._vRs[index][1];
        this.vRSpeed = min * (1 - runwayCoef) + max * runwayCoef;
        this.vRSpeed *= dWeightCoeff;
        this.vRSpeed -= (flapsHandleIndex - 3) * 11;
        this.vRSpeed = Math.round(this.vRSpeed);
        SimVar.SetSimVarValue("L:AIRLINER_VR_SPEED", "Knots", this.vRSpeed);
        console.log("Computed VRSpeed = " + this.vRSpeed);
    }
    _computeV2Speed() {
        let runwayCoef = 1.0;
        {
            let runway = this.flightPlanManager.getDepartureRunway();
            if (!runway) {
                runway = this.flightPlanManager.getDetectedCurrentRunway();
            }
            console.log(runway);
            if (runway) {
                let f = (runway.length - 1500) / (2500 - 1500);
                runwayCoef = Utils.Clamp(f, 0, 1);
            }
        }
        let dWeightCoeff = (this.getWeight(true) - 550) / (1000 - 550);
        dWeightCoeff = Utils.Clamp(dWeightCoeff, 0, 1);
        dWeightCoeff = 0.93 + (1.26 - 0.93) * dWeightCoeff;
        let flapsHandleIndex = this.getTakeOffFLapHandle();
        let temp = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");
        let index = this._getIndexFromTemp(temp);
        console.log("Index From Temp = " + index);
        let min = B747_8_FMC_MainDisplay._v2s[index][0];
        let max = B747_8_FMC_MainDisplay._v2s[index][1];
        this.v2Speed = min * (1 - runwayCoef) + max * runwayCoef;
        this.v2Speed *= dWeightCoeff;
        this.v2Speed -= (flapsHandleIndex - 3) * 12;
        this.v2Speed = Math.round(this.v2Speed);
        SimVar.SetSimVarValue("L:AIRLINER_V2_SPEED", "Knots", this.v2Speed);
        console.log("Computed VRSpeed = " + this.v2Speed);
    }
    getFlapTakeOffSpeed() {
        let dWeight = (this.getWeight(true) - 500) / (900 - 500);
        return 134 + 40 * dWeight;
    }
    getSlatTakeOffSpeed() {
        let dWeight = (this.getWeight(true) - 500) / (900 - 500);
        return 183 + 40 * dWeight;
    }
    getCleanTakeOffSpeed() {
        let dWeight = (this.getWeight(true) - 500) / (900 - 500);
        return 204 + 40 * dWeight;
    }
    getClbManagedSpeed() {
        let dCI = this.getCostIndexFactor();
        let speed = 310 * (1 - dCI) + 330 * dCI;
        if (Simplane.getAltitude() < 10000) {
            speed = Math.min(speed, 250);
        }
        return speed;
    }
    getCrzManagedSpeed(highAltitude = false) {
        let dCI = this.getCostIndexFactor();
        dCI = dCI * dCI;
        let speed = 310 * (1 - dCI) + 330 * dCI;
        if (!highAltitude && Simplane.getAltitude() < 10000) {
            speed = Math.min(speed, 250);
        }
        return speed;
    }
    getDesManagedSpeed() {
        let dCI = this.getCostIndexFactor();
        let speed = 240 * (1 - dCI) + 260 * dCI;
        if (Simplane.getAltitude() < 10000) {
            speed = Math.min(speed, 250);
        }
        return speed;
    }
    getVRef(flapsHandleIndex = NaN, useCurrentWeight = true) {
        if (isNaN(flapsHandleIndex)) {
            flapsHandleIndex = Simplane.getFlapsHandleIndex();
        }
        let dWeight = ((useCurrentWeight ? this.getWeight(true) : this.getApproachWeight(true)) - 440) / (1012 - 440);
        let min = 205;
        let max = 266;
        if (flapsHandleIndex >= 9) {
            min = 121;
            max = 187;
        }
        else if (flapsHandleIndex >= 8) {
            min = 124;
            max = 191;
        }
        else if (flapsHandleIndex >= 7) {
            min = 134;
            max = 194;
        }
        else if (flapsHandleIndex >= 3) {
            min = 144;
            max = 204;
        }
        else if (flapsHandleIndex >= 2) {
            min = 164;
            max = 224;
        }
        else if (flapsHandleIndex >= 1) {
            min = 185;
            max = 244;
        }
        return min + (max - min) * dWeight;
    }
    getManagedApproachSpeed(flapsHandleIndex = NaN, useCurrentWeight = true) {
        return this.getVRef(flapsHandleIndex, useCurrentWeight) - 5;
    }
    getCleanApproachSpeed() {
        let dWeight = (this.getWeight(true) - 258.4) / (447.5 - 258.4);
        return 152 + 40 * dWeight;
    }
    getSlatApproachSpeed(useCurrentWeight = true) {
        return this.getVRef(8, useCurrentWeight);
    }
    getFlapApproachSpeed(useCurrentWeight = true) {
        return this.getVRef(9, useCurrentWeight);
    }
    setSelectedApproachFlapSpeed(s) {
        let flap = NaN;
        let speed = NaN;
        if (s) {
            let sSplit = s.split("/");
            flap = parseInt(sSplit[0]);
            speed = parseInt(sSplit[1]);
        }
        if (isFinite(flap) || isFinite(speed)) {
            if (isFinite(flap) && flap >= 0 && flap < 60) {
                this.selectedApproachFlap = flap;
            }
            if (isFinite(speed) && speed >= 10 && speed < 300) {
                this.selectedApproachSpeed = speed;
            }
            return true;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    clearDisplay() {
        super.clearDisplay();
        this.onPrevPage = EmptyCallback.Void;
        this.onNextPage = EmptyCallback.Void;
    }
    getOrSelectWaypointByIdent(ident, callback) {
        this.dataManager.GetWaypointsByIdent(ident).then((waypoints) => {
            if (!waypoints || waypoints.length === 0) {
                return callback(undefined);
            }
            if (waypoints.length === 1) {
                return callback(waypoints[0]);
            }
            B747_8_FMC_SelectWptPage.ShowPage(this, waypoints, callback);
        });
    }
    getClimbThrustN1(temperature, altitude) {
        let lineIndex = 0;
        for (let i = 0; i < this._climbN1TempRow.length; i++) {
            lineIndex = i;
            if (temperature > this._climbN1TempRow[i]) {
                break;
            }
        }
        let rowIndex = Math.floor(altitude / 5000);
        rowIndex = Math.max(0, rowIndex);
        rowIndex = Math.min(rowIndex, this._climbN1Table[0].length - 1);
        return this._climbN1Table[lineIndex][rowIndex];
    }
    getTakeOffThrustN1(temperature, airportAltitude) {
        let lineIndex = 0;
        for (let i = 0; i < this._takeOffN1TempRow.length; i++) {
            lineIndex = i;
            if (temperature > this._takeOffN1TempRow[i]) {
                break;
            }
        }
        let rowIndex = Math.floor(airportAltitude / 1000) + 2;
        rowIndex = Math.max(0, rowIndex);
        rowIndex = Math.min(rowIndex, this._takeOffN1Table[0].length - 1);
        return this._takeOffN1Table[lineIndex][rowIndex];
    }
    getThrustTakeOffMode() {
        return this._thrustTakeOffMode;
    }
    setThrustTakeOffMode(m) {
        if (m >= 0 && m <= 2) {
            this._thrustTakeOffMode = m;
            SimVar.SetSimVarValue("L:AIRLINER_THRUST_TAKEOFF_MODE", "number", this._thrustTakeOffMode);
        }
    }
    getThrustCLBMode() {
        return this._thrustCLBMode;
    }
    setThrustCLBMode(m) {
        if (m >= 0 && m <= 2) {
            this._thrustCLBMode = m;
            SimVar.SetSimVarValue("L:AIRLINER_THRUST_CLIMB_MODE", "number", this._thrustCLBMode);
        }
    }
    getThrustTakeOffTemp() {
        return this._thrustTakeOffTemp;
    }
    setThrustTakeOffTemp(s) {
        let v = parseFloat(s);
        if (isFinite(v)) {
            let oat = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");
            if (v >= oat && v < 80) {
                this._thrustTakeOffTemp = v;
                return true;
            }
            this.showErrorMessage("OUT OF RANGE");
            return false;
        }
        this.showErrorMessage(this.defaultInputErrorMessage);
        return false;
    }
    getThrustTakeOffLimit() {
        let airport = this.flightPlanManager.getOrigin();
        if (airport) {
            let altitude = airport.infos.coordinates.alt;
            let n1 = this.getTakeOffThrustN1(this.getThrustTakeOffTemp(), altitude) - this.getThrustTakeOffMode() * 10;
            return n1;
        }
        return 95;
    }
    getThrustClimbLimit() {
        let altitude = Simplane.getAltitude();
        let temperature = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");
        return this.getClimbThrustN1(temperature, altitude) - this.getThrustCLBMode() * 8.6;
    }
    updateAutopilot() {
        let now = performance.now();
        let dt = now - this._lastUpdateAPTime;
        this._lastUpdateAPTime = now;
        if (isFinite(dt)) {
            this.updateAutopilotCooldown -= dt;
        }
        if (SimVar.GetSimVarValue("L:AIRLINER_FMC_FORCE_NEXT_UPDATE", "number") === 1) {
            SimVar.SetSimVarValue("L:AIRLINER_FMC_FORCE_NEXT_UPDATE", "number", 0);
            this.updateAutopilotCooldown = -1;
        }
        if (this.updateAutopilotCooldown < 0) {
            let currentApMasterStatus = SimVar.GetSimVarValue("AUTOPILOT MASTER", "boolean");
            if (currentApMasterStatus != this._apMasterStatus) {
                this._apMasterStatus = currentApMasterStatus;
                this._forceNextAltitudeUpdate = true;
                if (currentApMasterStatus) {
                    if (this.flightPlanManager.hasFlightPlan()) {
                        this.activateLNAV();
                        this.activateVNAV();
                    }
                    else {
                        this.activateFLCH();
                    }
                }
            }
            this._apHasDeactivated = !currentApMasterStatus && this._previousApMasterStatus;
            this._previousApMasterStatus = currentApMasterStatus;
            let currentAThrMasterStatus = Simplane.getAutoPilotThrottleActive(1);
            if (currentAThrMasterStatus != this._aThrStatus) {
                this._aThrStatus = currentAThrMasterStatus;
            }
            this._aThrHasActivated = currentAThrMasterStatus && !this._previousAThrStatus;
            this._previousAThrStatus = currentAThrMasterStatus;
            if (this.currentFlightPhase <= FlightPhase.FLIGHT_PHASE_TAKEOFF) {
                let n1 = this.getThrustTakeOffLimit() / 100;
                SimVar.SetSimVarValue("AUTOPILOT THROTTLE MAX THRUST", "number", n1);
            }
            if (!this.getIsAltitudeHoldActive()) {
                Coherent.call("AP_ALT_VAR_SET_ENGLISH", 1, Simplane.getAutoPilotDisplayedAltitudeLockValue(), this._forceNextAltitudeUpdate);
            }
            let vRef = 0;
            if (this.currentFlightPhase >= FlightPhase.FLIGHT_PHASE_DESCENT) {
                vRef = 1.3 * Simplane.getStallSpeed();
            }
            SimVar.SetSimVarValue("L:AIRLINER_VREF_SPEED", "knots", vRef);
            if (this._apHasDeactivated) {
                this.deactivateVNAV();
                if (!this.getIsSPDActive()) {
                    this.activateSPD();
                }
            }
            if (this._aThrHasActivated) {
                if (this.getIsSPDActive()) {
                    this.activateSPD();
                }
            }
            if (this._pendingLNAVActivation) {
                let altitude = Simplane.getAltitudeAboveGround();
                if (altitude > 50) {
                    this._pendingLNAVActivation = false;
                    this.doActivateLNAV();
                }
            }
            if (this._isLNAVActive) {
                let altitude = Simplane.getAltitudeAboveGround();
                if (altitude > 50) {
                    this._pendingLNAVActivation = false;
                    this.doActivateLNAV();
                }
            }
            if (this._pendingVNAVActivation) {
                let altitude = Simplane.getAltitudeAboveGround();
                if (altitude > 400) {
                    this._pendingVNAVActivation = false;
                    this.doActivateVNAV();
                }
            }
            if (currentApMasterStatus && SimVar.GetSimVarValue("L:AP_VNAV_ACTIVE", "number") === 1) {
                let targetAltitude = Simplane.getAutoPilotAltitudeLockValue();
                let altitude = Simplane.getAltitude();
                let deltaAltitude = Math.abs(targetAltitude - altitude);
                if (deltaAltitude > 1000) {
                    if (!Simplane.getAutoPilotFLCActive()) {
                        SimVar.SetSimVarValue("K:FLIGHT_LEVEL_CHANGE_ON", "Number", 1);
                    }
                }
            }
            if (this.getIsFLCHActive() && !Simplane.getAutoPilotGlideslopeActive() && !Simplane.getAutoPilotGlideslopeHold()) {
                let targetAltitude = Simplane.getAutoPilotAltitudeLockValue();
                let altitude = Simplane.getAltitude();
                let deltaAltitude = Math.abs(targetAltitude - altitude);
                if (deltaAltitude < 150) {
                    this.activateAltitudeHold(true);
                }
            }
            if (this.getIsVSpeedActive()) {
                let targetAltitude = Simplane.getAutoPilotAltitudeLockValue();
                let altitude = Simplane.getAltitude();
                let deltaAltitude = Math.abs(targetAltitude - altitude);
                if (deltaAltitude < 150) {
                    this.activateAltitudeHold(true);
                }
            }
            if (this._pendingHeadingSelActivation) {
                let altitude = Simplane.getAltitudeAboveGround();
                if (altitude > 400) {
                    this._pendingHeadingSelActivation = false;
                    this.doActivateHeadingSel();
                }
            }
            if (this._pendingSPDActivation) {
                let altitude = Simplane.getAltitudeAboveGround();
                if (altitude > 400) {
                    this._pendingSPDActivation = false;
                    this.doActivateSPD();
                }
            }
            if (Simplane.getAutoPilotGlideslopeActive()) {
                if (this.getIsVNAVActive()) {
                    this.deactivateVNAV();
                }
                if (this.getIsVSpeedActive()) {
                    this.deactivateVSpeed();
                }
                if (this.getIsAltitudeHoldActive()) {
                    this.deactivateAltitudeHold();
                }
                if (!this.getIsSPDActive()) {
                    this.activateSPD();
                }
            }
            SimVar.SetSimVarValue("SIMVAR_AUTOPILOT_AIRSPEED_MIN_CALCULATED", "knots", Simplane.getStallProtectionMinSpeed());
            SimVar.SetSimVarValue("SIMVAR_AUTOPILOT_AIRSPEED_MAX_CALCULATED", "knots", Simplane.getMaxSpeed(Aircraft.B747_8));
            let currentAltitude = Simplane.getAltitude();
            let groundSpeed = Simplane.getGroundSpeed();
            let apTargetAltitude = Simplane.getAutoPilotAltitudeLockValue("feet");
            let planeHeading = Simplane.getHeadingMagnetic();
            let planeCoordinates = new LatLong(SimVar.GetSimVarValue("PLANE LATITUDE", "degree latitude"), SimVar.GetSimVarValue("PLANE LONGITUDE", "degree longitude"));
            if (this.currentFlightPhase >= FlightPhase.FLIGHT_PHASE_CLIMB) {
                let activeWaypoint = this.flightPlanManager.getActiveWaypoint();
                if (activeWaypoint != this._activeWaypoint) {
                    console.log("Update FMC Active Waypoint");
                    if (this._activeWaypoint) {
                        this._activeWaypoint.altitudeWasReached = Simplane.getAltitudeAboveGround();
                        this._activeWaypoint.timeWasReached = SimVar.GetGlobalVarValue("LOCAL TIME", "seconds");
                        this._activeWaypoint.fuelWasReached = SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilograms") / 1000;
                    }
                    this._activeWaypoint = activeWaypoint;
                }
            }
            if (this.getIsVNAVActive()) {
                let prevWaypoint = this.flightPlanManager.getPreviousActiveWaypoint();
                let nextWaypoint = this.flightPlanManager.getActiveWaypoint();
                if (nextWaypoint && (nextWaypoint.legAltitudeDescription === 3 || nextWaypoint.legAltitudeDescription === 4)) {
                    let targetAltitude = nextWaypoint.legAltitude1;
                    if (nextWaypoint.legAltitudeDescription === 4) {
                        targetAltitude = Math.max(nextWaypoint.legAltitude1, nextWaypoint.legAltitude2);
                    }
                    let showTopOfDescent = false;
                    let topOfDescentLat;
                    let topOfDescentLong;
                    this._hasReachedTopOfDescent = true;
                    if (currentAltitude > targetAltitude + 40) {
                        let vSpeed = 3000;
                        let descentDuration = Math.abs(targetAltitude - currentAltitude) / vSpeed / 60;
                        let descentDistance = descentDuration * groundSpeed;
                        let distanceToTarget = Avionics.Utils.computeGreatCircleDistance(prevWaypoint.infos.coordinates, nextWaypoint.infos.coordinates);
                        showTopOfDescent = true;
                        let f = 1 - descentDistance / distanceToTarget;
                        topOfDescentLat = Avionics.Utils.lerpAngle(planeCoordinates.lat, nextWaypoint.infos.lat, f);
                        topOfDescentLong = Avionics.Utils.lerpAngle(planeCoordinates.long, nextWaypoint.infos.long, f);
                        if (distanceToTarget + 1 > descentDistance) {
                            this._hasReachedTopOfDescent = false;
                        }
                    }
                    if (showTopOfDescent) {
                        SimVar.SetSimVarValue("L:AIRLINER_FMS_SHOW_TOP_DSCNT", "number", 1);
                        SimVar.SetSimVarValue("L:AIRLINER_FMS_LAT_TOP_DSCNT", "number", topOfDescentLat);
                        SimVar.SetSimVarValue("L:AIRLINER_FMS_LONG_TOP_DSCNT", "number", topOfDescentLong);
                    }
                    else {
                        SimVar.SetSimVarValue("L:AIRLINER_FMS_SHOW_TOP_DSCNT", "number", 0);
                    }
                    let selectedAltitude = Simplane.getAutoPilotSelectedAltitudeLockValue("feet");
                    if (!this.flightPlanManager.getIsDirectTo() &&
                        isFinite(nextWaypoint.legAltitude1) &&
                        nextWaypoint.legAltitude1 < 20000 &&
                        nextWaypoint.legAltitude1 > selectedAltitude &&
                        Simplane.getAltitude() > nextWaypoint.legAltitude1 - 200) {
                        Coherent.call("AP_ALT_VAR_SET_ENGLISH", 2, nextWaypoint.legAltitude1, this._forceNextAltitudeUpdate);
                        this._forceNextAltitudeUpdate = false;
                        SimVar.SetSimVarValue("L:AP_CURRENT_TARGET_ALTITUDE_IS_CONSTRAINT", "number", 1);
                    }
                    else {
                        let altitude = Simplane.getAutoPilotSelectedAltitudeLockValue("feet");
                        if (isFinite(altitude)) {
                            Coherent.call("AP_ALT_VAR_SET_ENGLISH", 2, this.cruiseFlightLevel * 100, this._forceNextAltitudeUpdate);
                            this._forceNextAltitudeUpdate = false;
                            SimVar.SetSimVarValue("L:AP_CURRENT_TARGET_ALTITUDE_IS_CONSTRAINT", "number", 0);
                        }
                    }
                }
                else {
                    let altitude = Simplane.getAutoPilotSelectedAltitudeLockValue("feet");
                    if (isFinite(altitude)) {
                        Coherent.call("AP_ALT_VAR_SET_ENGLISH", 2, this.cruiseFlightLevel * 100, this._forceNextAltitudeUpdate);
                        this._forceNextAltitudeUpdate = false;
                        SimVar.SetSimVarValue("L:AP_CURRENT_TARGET_ALTITUDE_IS_CONSTRAINT", "number", 0);
                    }
                }
            }
            else if (!this.getIsFLCHActive() && this.getIsSPDActive()) {
                this.setAPSpeedHoldMode();
            }
            if (this.getIsVNAVArmed() && !this.getIsVNAVActive()) {
                if (Simplane.getAutoPilotThrottleArmed()) {
                    if (!this._hasSwitchedToHoldOnTakeOff) {
                        let speed = Simplane.getIndicatedSpeed();
                        if (speed > 65) {
                            Coherent.call("GENERAL_ENG_THROTTLE_MANAGED_MODE_SET", ThrottleMode.HOLD);
                            this._hasSwitchedToHoldOnTakeOff = true;
                        }
                    }
                }
            }
            if (this._isHeadingHoldActive) {
                Coherent.call("HEADING_BUG_SET", 2, this._headingHoldValue);
            }
            if (!this.flightPlanManager.isActiveApproach() && this.currentFlightPhase != FlightPhase.FLIGHT_PHASE_APPROACH) {
                let activeWaypoint = this.flightPlanManager.getActiveWaypoint();
                let nextActiveWaypoint = this.flightPlanManager.getNextActiveWaypoint();
                if (activeWaypoint && nextActiveWaypoint) {
                    let pathAngle = nextActiveWaypoint.bearingInFP - activeWaypoint.bearingInFP;
                    while (pathAngle < 180) {
                        pathAngle += 360;
                    }
                    while (pathAngle > 180) {
                        pathAngle -= 360;
                    }
                    let absPathAngle = 180 - Math.abs(pathAngle);
                    let airspeed = Simplane.getIndicatedSpeed();
                    if (airspeed < 400) {
                        let turnRadius = airspeed * 360 / (1091 * 0.36 / airspeed) / 3600 / 2 / Math.PI;
                        let activateDistance = Math.pow(90 / absPathAngle, 1.6) * turnRadius * 1.2;
                        let distanceToActive = Avionics.Utils.computeGreatCircleDistance(planeCoordinates, activeWaypoint.infos.coordinates);
                        if (distanceToActive < activateDistance) {
                            this.flightPlanManager.setActiveWaypointIndex(this.flightPlanManager.getActiveWaypointIndex() + 1);
                        }
                    }
                }
            }
            if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_TAKEOFF) {
                if (this.getIsVNAVActive()) {
                    let speed = this.getTakeOffManagedSpeed();
                    this.setAPManagedSpeed(speed, Aircraft.B747_8);
                }
            }
            else if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_CLIMB) {
                if (this.getIsVNAVActive()) {
                    let speed = this.getClbManagedSpeed();
                    this.setAPManagedSpeed(speed, Aircraft.B747_8);
                    let altitude = Simplane.getAltitudeAboveGround();
                    let n1 = 100;
                    if (altitude < this.thrustReductionAltitude) {
                        n1 = this.getThrustTakeOffLimit() / 100;
                    }
                    else {
                        n1 = this.getThrustClimbLimit() / 100;
                    }
                    SimVar.SetSimVarValue("AUTOPILOT THROTTLE MAX THRUST", "number", n1);
                }
            }
            else if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_CRUISE) {
                if (this.getIsVNAVActive()) {
                    let speed = this.getCrzManagedSpeed();
                    this.setAPManagedSpeed(speed, Aircraft.B747_8);
                    let altitude = Simplane.getAltitudeAboveGround();
                    let n1 = 100;
                    if (altitude < this.thrustReductionAltitude) {
                        n1 = this.getThrustTakeOffLimit() / 100;
                    }
                    else {
                        n1 = this.getThrustClimbLimit() / 100;
                    }
                    SimVar.SetSimVarValue("AUTOPILOT THROTTLE MAX THRUST", "number", n1);
                }
            }
            else if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_DESCENT) {
                if (this.getIsVNAVActive()) {
                    let speed = this.getDesManagedSpeed();
                    this.setAPManagedSpeed(speed, Aircraft.B747_8);
                }
            }
            else if (this.currentFlightPhase === FlightPhase.FLIGHT_PHASE_APPROACH) {
                if (this.getIsVNAVActive()) {
                    let speed = this.getManagedApproachSpeed();
                    this.setAPManagedSpeed(speed, Aircraft.B747_8);
                }
                if (Simplane.getAutoPilotThrottleActive()) {
                    let altitude = Simplane.getAltitudeAboveGround();
                    if (altitude < 25) {
                        if (Simplane.getEngineThrottleMode(0) != ThrottleMode.IDLE) {
                            Coherent.call("GENERAL_ENG_THROTTLE_MANAGED_MODE_SET", ThrottleMode.IDLE);
                        }
                    }
                }
            }
            this.updateAutopilotCooldown = this._apCooldown;
        }
    }
    static stringTohhmm(value) {
        value = value.padStart(4, "0");
        const h = parseInt(value.slice(0, 2));
        const m = parseInt(value.slice(2, 4));
        return h.toFixed(0).padStart(2, "0") + ":" + m.toFixed(0).padStart(2, "0");
    }
    
    refreshGrossWeight(_force = false) {
        let gw = 0;
        let isInMetric = BaseAirliners.unitIsMetric(Aircraft.A320_NEO);
        if (isInMetric) {
            gw = Math.round(SimVar.GetSimVarValue("TOTAL WEIGHT", "kg"));
            if (this.gwUnit)
                this.gwUnit.textContent = "KG";
        }
        else {
            gw = Math.round(SimVar.GetSimVarValue("TOTAL WEIGHT", "lbs"));
            if (this.gwUnit)
                this.gwUnit.textContent = "LBS";
        }
        if ((gw != this.currentGW) || _force) {
            this.currentGW = gw;
            if (this.gwValue != null) {
                this.gwValue.textContent = this.currentGW.toString();
            }
        }
    }

    // SALTY 747 FUNCTIONS
    // INCOMING AOC MESSAGES
    getMessages() {
        return this.messages;
    }
    getMessage(id, type) {
        const messages = this.messages;
        const currentMessageIndex = messages.findIndex(m => m["id"].toString() === id.toString());
        if (type === 'previous') {
            if (messages[currentMessageIndex - 1]) {
                return messages[currentMessageIndex - 1];
            }
            return null;
        } else if (type === 'next') {
            if (messages[currentMessageIndex + 1]) {
                return messages[currentMessageIndex + 1];
            }
            return null;
        }
        return messages[currentMessageIndex];
    }
    getMessageIndex(id) {
        return this.messages.findIndex(m => m["id"].toString() === id.toString());
    }
    addMessage(message) {
        this.messages.unshift(message);
        const cMsgCnt = SimVar.GetSimVarValue("L:SALTY_747_COMPANY_MSG_COUNT", "Number");
        SimVar.SetSimVarValue("L:SALTY_747_COMPANY_MSG_COUNT", "Number", cMsgCnt + 1);
    }
    deleteMessage(id) {
        if (!this.messages[id]["opened"]) {
            const cMsgCnt = SimVar.GetSimVarValue("L:SALTY_747_COMPANY_MSG_COUNT", "Number");
            SimVar.SetSimVarValue("L:SALTY_747_COMPANY_MSG_COUNT", "Number", cMsgCnt <= 1 ? 0 : cMsgCnt - 1);
        }
        this.messages.splice(id, 1);
    }

    // OUTGOING/SENT AOC MESSAGES

    /* Delay when uplinking data */
    getUplinkDelay() {
        return 1000 + 750 * Math.random();
    }
    /* Delay when inserting data */
    getInsertDelay() {
        return 650 + 500 * Math.random();
    }
    getSentMessages() {
        return this.sentMessages;
    }
    getSentMessage(id, type) {
        const messages = this.sentMessages;
        const currentMessageIndex = messages.findIndex(m => m["id"].toString() === id.toString());
        if (type === 'previous') {
            if (messages[currentMessageIndex - 1]) {
                return messages[currentMessageIndex - 1];
            }
            return null;
        } else if (type === 'next') {
            if (messages[currentMessageIndex + 1]) {
                return messages[currentMessageIndex + 1];
            }
            return null;
        }
        return messages[currentMessageIndex];
    }
    getSentMessageIndex(id) {
        return this.sentMessages.findIndex(m => m["id"].toString() === id.toString());
    }
    addSentMessage(message) {
        this.sentMessages.unshift(message);
    }
    deleteSentMessage(id) {
        this.sentMessages.splice(id, 1);
    }
    getTimeString(time) {
        var hours = time.getUTCHours();
        hours = hours.toString();
        hours = hours.padStart(2, "0");
        var minutes = time.getUTCMinutes();
        minutes = minutes.toString();
        minutes = minutes.padStart(2, "0");
        var timeString = hours + minutes + "Z";
        return timeString
    }

    /* VISUALS */

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
        this._titleElement.classList.remove("white", "blue", "yellow", "green", "red", "inop");
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
            label = "------------------------";
        }
        if (label !== "") {
            let color = label.split("[color]")[1];
            if (!color) {
                color = "white";
            }
            let e = this._labelElements[row][col];
            e.classList.remove("white", "blue", "yellow", "green", "red", "inop");
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
            e.classList.remove("white", "blue", "yellow", "green", "red", "magenta", "inop");
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
    setTemplate(template) {
        if (template[0]) {
            this.setTitle(template[0][0]);
            this.setPageCurrent(template[0][1]);
            this.setPageCount(template[0][2]);
        }
        for (let i = 0; i < 6; i++) {
            let tIndex = 2 * i + 1;
            if (template[tIndex]) {
                if (template[tIndex][1] !== undefined) {
                    this.setLabel(template[tIndex][0], i, 0);
                    this.setLabel(template[tIndex][1], i, 1);
                    this.setLabel(template[tIndex][2], i, 2);
                    this.setLabel(template[tIndex][3], i, 3);
                }
                else {
                    this.setLabel(template[tIndex][0], i, -1);
                }
            }
            tIndex = 2 * i + 2;
            if (template[tIndex]) {
                if (template[tIndex][1] !== undefined) {
                    this.setLine(template[tIndex][0], i, 0);
                    this.setLine(template[tIndex][1], i, 1);
                    this.setLine(template[tIndex][2], i, 2);
                    this.setLine(template[tIndex][3], i, 3);
                }
                else {
                    this.setLine(template[tIndex][0], i, -1);
                }
            }
        }
        if (template[13]) {
            this.setInOut(template[13][0]);
        }
        SimVar.SetSimVarValue("L:AIRLINER_MCDU_CURRENT_FPLN_WAYPOINT", "number", this.currentFlightPlanWaypointIndex);
    }
}
B747_8_FMC_MainDisplay._v1s = [
    [130, 156],
    [128, 154],
    [127, 151],
    [125, 149],
    [123, 147],
    [122, 145],
    [121, 143],
    [120, 143],
    [120, 143],
    [120, 142],
    [119, 142],
    [119, 142],
    [119, 142],
    [119, 141],
    [118, 141],
    [118, 141],
    [118, 140],
    [118, 140],
    [117, 140],
    [117, 140],
];
B747_8_FMC_MainDisplay._vRs = [
    [130, 158],
    [128, 156],
    [127, 154],
    [125, 152],
    [123, 150],
    [122, 148],
    [121, 147],
    [120, 146],
    [120, 146],
    [120, 145],
    [119, 145],
    [119, 144],
    [119, 144],
    [119, 143],
    [118, 143],
    [118, 142],
    [118, 142],
    [118, 141],
    [117, 141],
    [117, 140],
];
B747_8_FMC_MainDisplay._v2s = [
    [135, 163],
    [133, 160],
    [132, 158],
    [130, 157],
    [129, 155],
    [127, 153],
    [127, 151],
    [126, 150],
    [125, 150],
    [125, 149],
    [124, 149],
    [124, 148],
    [124, 148],
    [123, 147],
    [123, 146],
    [123, 146],
    [123, 145],
    [122, 145],
    [122, 144],
    [121, 144],
];
registerInstrument("fmc-b747-8-main-display", B747_8_FMC_MainDisplay);
//# sourceMappingURL=B747_8_FMC_MainDisplay.js.map