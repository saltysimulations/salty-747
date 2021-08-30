class Boeing_FMC extends FMCMainDisplay {
    constructor() {
        super(...arguments);
        this._forceNextAltitudeUpdate = false;
        this._lastTargetAirspeed = 200;
        this._isLNAVActive = false;
        this._pendingLNAVActivation = false;
        this._isVNAVActive = false;
        this._pendingVNAVActivation = false;
        this._isFLCHActive = false;
        this._pendingFLCHActivation = false;
        this._isSPDActive = false;
        this._pendingSPDActivation = false;
        this._isSpeedInterventionActive = false;
        this._isHeadingHoldActive = false;
        this._headingHoldValue = 0;
        this._pendingHeadingSelActivation = false;
        this._isVSpeedActive = false;
        this._isAltitudeHoldActive = false;
        this._altitudeHoldValue = 0;
        this._onAltitudeHoldDeactivate = EmptyCallback.Void;
        this._isRouteActivated = false;
        this._isStepClimbing = false;
    }
    Init() {
        super.Init();
        this.maxCruiseFL = 450;
        this.cruiseFlightLevel = 100;
        this.onExec = () => {
            if (this.onExecPage) {
                console.log("if this.onExecPage");
                this.onExecPage();
            }
            else {
                this._isRouteActivated = false;
                this._activatingDirectToExisting = false;
                this.fpHasChanged = false;
            }
        };
        this.onExecPage = undefined;
        this.onExecDefault = () => {
            if (this.getIsRouteActivated() && !this._activatingDirectTo) {
                this.insertTemporaryFlightPlan(() => {
                    this.copyAirwaySelections();
                    this._isRouteActivated = false;
                    this._activatingDirectToExisting = false;
                    this.fpHasChanged = false;
                    SimVar.SetSimVarValue("L:FMC_EXEC_ACTIVE", "number", 0);
                    if (this.refreshPageCallback) {
                        this.refreshPageCallback();
                    }
                });
            } else if (this.getIsRouteActivated() && this._activatingDirectTo) {
                const activeIndex = this.flightPlanManager.getActiveWaypointIndex();
                this.insertTemporaryFlightPlan(() => {
                    this.flightPlanManager.activateDirectToByIndex(activeIndex, () => {
                        this.synchronizeTemporaryAndActiveFlightPlanWaypoints();
                        this._isRouteActivated = false;
                        this._activatingDirectToExisting = false;
                        this._activatingDirectTo = false;
                        this.fpHasChanged = false;
                        SimVar.SetSimVarValue("L:FMC_EXEC_ACTIVE", "number", 0);
                        if (this.refreshPageCallback) {
                            this.refreshPageCallback();
                        }
                    });
                });
            } else {
                this.fpHasChanged = false;
                this._isRouteActivated = false;
                SimVar.SetSimVarValue("L:FMC_EXEC_ACTIVE", "number", 0);
                if (this.refreshPageCallback) {
                    this._activatingDirectTo = false;
                    this.fpHasChanged = false;
                    this.refreshPageCallback();
                }
            }
        };
        this.onDel = () => {
            if (this.inOut.length === 0) {
                this.inOut = "DELETE";
            }
        };
        this.onClr = () => {
            if (this.isDisplayingErrorMessage) {
                this.inOut = this.lastUserInput;
                this.isDisplayingErrorMessage = false;
            }
            else if (this.inOut.length > 0) {
                if (this.inOut === "DELETE") {
                    this.inOut = "";
                }
                else {
                    this.inOut = this.inOut.substr(0, this.inOut.length - 1);
                }
            }
        };
        let flapAngles = [0, 1, 5, 10, 15, 17, 18, 20, 25, 30];
        let flapIndex = Simplane.getFlapsHandleIndex(true);
        if (flapIndex >= 1) {
            this._takeOffFlap = flapAngles[flapIndex];
        }
    }
    onEvent(_event) {
        super.onEvent(_event);
        console.log("B747_8_FMC_MainDisplay onEvent " + _event);
        if (_event.indexOf("AP_LNAV") != -1) {
            this._navModeSelector.onNavChangedEvent('NAV_PRESSED');
        }
        else if (_event.indexOf("AP_HEADING_HOLD") != -1) {
            this._navModeSelector.onNavChangedEvent('HDG_HOLD_PRESSED');
        }
        else if (_event.indexOf("AP_HEADING_SEL") != -1) {
            if (this._isHeadingHoldActive === true) {
                SimVar.SetSimVarValue("L:AP_HEADING_HOLD_ACTIVE", "number", 0);
                this._isHeadingHoldActive = false;
            }
            this._navModeSelector.onNavChangedEvent('HDG_PRESSED');
        }
        else if (_event.indexOf("AP_LOC_ARM") != -1) {
            if (SimVar.GetSimVarValue("L:AP_LOC_ARMED", "bool") === 0) {
                SimVar.SetSimVarValue("L:AP_LOC_ARMED", "bool", 1);
            }
            else if (SimVar.GetSimVarValue("L:AP_LOC_ARMED", "bool") === 1) {
                SimVar.SetSimVarValue("L:AP_LOC_ARMED", "bool", 0);
            }
            this._navModeSelector.onNavChangedEvent('LOC_PRESSED');
        }
        else if (_event.indexOf("AP_APP_ARM") != -1) {
            if (SimVar.GetSimVarValue("L:AP_APP_ARMED", "bool") === 0) {
                SimVar.SetSimVarValue("L:AP_APP_ARMED", "bool", 1);
            }
            else if (SimVar.GetSimVarValue("L:AP_APP_ARMED", "bool") === 1 
            && this._navModeSelector.currentVerticalActiveState !== VerticalNavModeState.GP
            && this._navModeSelector.currentVerticalActiveState !== VerticalNavModeState.GS) {
                SimVar.SetSimVarValue("L:AP_APP_ARMED", "bool", 0);
            }
            if (SimVar.GetSimVarValue("L:AP_LOC_ARMED", "bool") === 0) {
                this._navModeSelector.onNavChangedEvent('LOC_PRESSED');
            }
        }
        else if (_event.indexOf("AP_VNAV") != -1) {
            SimVar.SetSimVarValue("L:AP_VNAV_ARMED", "number", 1);
            let altitude = Simplane.getAltitudeAboveGround();
            if (altitude < 400) {
                this._pendingVNAVActivation = true;
            }
            else {
                this._navModeSelector.onNavChangedEvent('VNAV_PRESSED');
            }
        }
        else if (_event.indexOf("AP_FLCH") != -1) {
            this._navModeSelector.onNavChangedEvent('FLC_PRESSED');
        }
        else if (_event.indexOf("AP_VSPEED") != -1) {
            this._navModeSelector.onNavChangedEvent('VS_PRESSED');
            this.activateSPD();
        }
        else if (_event.indexOf("AP_FD_TOGGLE") != -1) {
            this._navModeSelector.onNavChangedEvent('FD_TOGGLE');
        }
        else if (_event.indexOf("AP_SPD") != -1) {
            if (SimVar.GetSimVarValue("AUTOPILOT THROTTLE ARM", "Bool")) {
                this.activateSPD();
            }
            else {
                this.deactivateSPD();
            }
        }
        else if (_event.indexOf("AP_SPEED_INTERVENTION") != -1) {
            this.toggleSpeedIntervention();
        }
        else if (_event.indexOf("AP_ALT_INTERVENTION") != -1) {
            if (this.getIsVNAVActive()) {
                let mcpAlt = Simplane.getAutoPilotDisplayedAltitudeLockValue();
                let altitude = Simplane.getAltitude();
                if (SimVar.GetSimVarValue("L:WT_CJ4_TOD_REMAINING", "number") < 50) {
                    this.currentFlightPhase = FlightPhase.FLIGHT_PHASE_DESCENT;
                    this._navModeSelector.isEarlyDescent = true;
                }
                else if (Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_CLIMB && mcpAlt > this.cruiseFlightLevel * 100) {
                    this.cruiseFlightLevel = Math.floor(mcpAlt / 100);
                }
                else if (Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_CRUISE) {
                    if (mcpAlt > this.cruiseFlightLevel * 100) {
                        this._isStepClimbing = true;
                    }
                    this.cruiseFlightLevel = Math.floor(mcpAlt / 100);
                }
                if (mcpAlt !== Math.round(altitude/100) * 100){
                    this._navModeSelector.onNavChangedEvent('ALT_INT_PRESSED');
                }
            }      
        }
        else if (_event.indexOf("AP_ALT_HOLD") != -1) {
            this.toggleAltitudeHold();
        }
        else if (_event.indexOf("THROTTLE_TO_GA") != -1) {
            this.setAPSpeedHoldMode();
            this._navModeSelector.activateThrustRefMode(); 
        }
        else if (_event.indexOf("EXEC") != -1) {
            this.onExec();
        }
    }
    getIsLNAVArmed() {
        return this._pendingLNAVActivation;
    }
    getIsLNAVActive() {
        return this._isLNAVActive;
    }
    toggleLNAV() {
        if (this.getIsLNAVArmed()) {
            this.deactivateLNAV();
        }
        else {
            this.activateLNAV();
        }
    }
    activateLNAV() {
        if (this.flightPlanManager.getWaypointsCount() === 0) {
            return;
        }
        SimVar.SetSimVarValue("L:AP_LNAV_ARMED", "number", 1);
        let altitude = Simplane.getAltitudeAboveGround();
        if (altitude < 50) {
            this._pendingLNAVActivation = true;
        }
        else {
            this.doActivateLNAV();
        }
        this.deactivateHeadingHold();
    }
    doActivateLNAV() {
        this._isLNAVActive = true;
        this._pendingLNAVActivation = false;
        if (SimVar.GetSimVarValue("AUTOPILOT APPROACH HOLD", "boolean")) {
            return;
        }
        SimVar.SetSimVarValue("L:AP_LNAV_ACTIVE", "number", 1);
        SimVar.SetSimVarValue("K:AP_NAV1_HOLD_ON", "number", 1);
    }
    deactivateLNAV() {
        this._pendingLNAVActivation = false;
        this._isLNAVActive = false;
        SimVar.SetSimVarValue("L:AP_LNAV_ARMED", "number", 0);
        SimVar.SetSimVarValue("L:AP_LNAV_ACTIVE", "number", 0);
    }
    getIsVNAVArmed() {
        return this._pendingVNAVActivation;
    }
    getIsVNAVActive() {
        return SimVar.GetSimVarValue("L:WT_CJ4_VNAV_ON", "bool");
    }
    toggleVNAV() {
        if (this.getIsVNAVArmed()) {
            this.deactivateVNAV();
            SimVar.SetSimVarValue("K:ALTITUDE_SLOT_INDEX_SET", "number", 1);
            SimVar.SetSimVarValue("K:SPEED_SLOT_INDEX_SET", "number", 1);
        }
        else {
            this.activateVNAV();
        }
    }
    activateVNAV() {
        if (this.flightPlanManager.getWaypointsCount() === 0) {
            return;
        }
        SimVar.SetSimVarValue("L:AP_VNAV_ARMED", "number", 1);
        let altitude = Simplane.getAltitudeAboveGround();
        if (altitude < 400) {
            this._pendingVNAVActivation = true;
        }
        else {
            this.doActivateVNAV();
        }
        this.deactivateAltitudeHold();
        this.deactivateFLCH();
        this.deactivateVSpeed();
        if (this.aircraftType != Aircraft.AS01B)
            this.deactivateSPD();
    }
    doActivateVNAV() {
        this._isVNAVActive = true;
        SimVar.SetSimVarValue("L:AP_VNAV_ACTIVE", "number", 1);
        SimVar.SetSimVarValue("K:FLIGHT_LEVEL_CHANGE_ON", "Number", 1);
        this._pendingVNAVActivation = false;
        this.activateTHRREFMode();
        SimVar.SetSimVarValue("K:SPEED_SLOT_INDEX_SET", "number", 2);
        SimVar.SetSimVarValue("K:ALTITUDE_SLOT_INDEX_SET", "number", 2);
        if (this.aircraftType == Aircraft.AS01B)
            this.activateSPD();
    }
    setThrottleMode(_mode) {
        if (this.getIsSPDActive() && this.aircraftType == Aircraft.AS01B)
            Coherent.call("GENERAL_ENG_THROTTLE_MANAGED_MODE_SET", ThrottleMode.AUTO);
        else
            Coherent.call("GENERAL_ENG_THROTTLE_MANAGED_MODE_SET", _mode);
    }
    deactivateVNAV() {
        this._pendingVNAVActivation = false;
        this._isVNAVActive = false;
        this._pendingVNAVActivation = false;
        SimVar.SetSimVarValue("L:AP_VNAV_ARMED", "number", 0);
        SimVar.SetSimVarValue("L:AP_VNAV_ACTIVE", "number", 0);
        this.deactivateSpeedIntervention();
    }
    getIsFLCHArmed() {
        return this._pendingFLCHActivation;
    }
    getIsFLCHActive() {
        return this._isFLCHActive;
    }
    toggleFLCH() {
        if (this.getIsFLCHArmed()) {
            this.deactivateFLCH();
        }
        else {
            this.activateFLCH();
        }
    }
    activateFLCH() {
        this._isFLCHActive = true;
        SimVar.SetSimVarValue("L:AP_FLCH_ACTIVE", "number", 1);
        this.deactivateVNAV();
        this.deactivateAltitudeHold();
        this.deactivateVSpeed();
        let altitude = Simplane.getAltitudeAboveGround();
        if (altitude < 400) {
            this._pendingFLCHActivation = true;
        }
        else {
            this.doActivateFLCH();
        }
    }
    doActivateFLCH() {
        this._pendingFLCHActivation = false;
        SimVar.SetSimVarValue("K:ALTITUDE_SLOT_INDEX_SET", "number", 1);
        let altitude = Simplane.getAltitude();
        let displayedAltitude = Simplane.getAutoPilotDisplayedAltitudeLockValue();
        Coherent.call("AP_ALT_VAR_SET_ENGLISH", 1, displayedAltitude, this._forceNextAltitudeUpdate);
        if (!Simplane.getAutoPilotFLCActive()) {
            SimVar.SetSimVarValue("K:FLIGHT_LEVEL_CHANGE_ON", "Number", 1);
        }
        if (displayedAltitude >= altitude + 2000) {
            SimVar.SetSimVarValue("AUTOPILOT THROTTLE MAX THRUST", "number", this.getThrustClimbLimit());
            this.setThrottleMode(ThrottleMode.CLIMB);
        }
        else if (displayedAltitude + 2000 <= altitude) {
            SimVar.SetSimVarValue("AUTOPILOT THROTTLE MAX THRUST", "number", 25);
            this.setThrottleMode(ThrottleMode.CLIMB);
        }
        else {
            this.activateSPD();
        }
        SimVar.SetSimVarValue("K:SPEED_SLOT_INDEX_SET", "number", 1);
    }
    deactivateFLCH() {
        this._isFLCHActive = false;
        this._pendingFLCHActivation = false;
        SimVar.SetSimVarValue("L:AP_FLCH_ACTIVE", "number", 0);
        this.deactivateSpeedIntervention();
    }
    getIsSPDArmed() {
        return this._pendingSPDActivation;
    }
    getIsSPDActive() {
        return this._isSPDActive;
    }
    toggleSPD() {
        if (this.getIsSPDArmed()) {
            this.deactivateSPD();
        }
        else {
            this.activateSPD();
        }
    }
    activateSPD() {
        let altitude = Simplane.getAltitudeAboveGround();
        if (altitude < 400) {
            this._pendingSPDActivation = true;
        }
        else {
            this.doActivateSPD();
        }
        SimVar.SetSimVarValue("L:AP_SPD_ACTIVE", "number", 1);
        this._isSPDActive = true;
    }
    doActivateSPD() {
        this._pendingSPDActivation = false;
        if (Simplane.getAutoPilotMachModeActive()) {
            let currentMach = Simplane.getAutoPilotMachHoldValue();
            Coherent.call("AP_MACH_VAR_SET", 1, currentMach);
            SimVar.SetSimVarValue("K:AP_MANAGED_SPEED_IN_MACH_ON", "number", 1);
        }
        else {
            let currentSpeed = Simplane.getAutoPilotAirspeedHoldValue();
            Coherent.call("AP_SPD_VAR_SET", 1, currentSpeed);
            SimVar.SetSimVarValue("K:AP_MANAGED_SPEED_IN_MACH_OFF", "number", 1);
        }
        if (!this._isFLCHActive) {
            this.setAPSpeedHoldMode();
        }
        this.setThrottleMode(ThrottleMode.AUTO);
        let stayManagedSpeed = (this._pendingVNAVActivation || this._isVNAVActive) && !this._isSpeedInterventionActive;
        if (!stayManagedSpeed) {
            SimVar.SetSimVarValue("K:SPEED_SLOT_INDEX_SET", "number", 1);
        }
    }
    deactivateSPD() {
        SimVar.SetSimVarValue("L:AP_SPD_ACTIVE", "number", 0);
        this._isSPDActive = false;
        this._pendingSPDActivation = false;
    }
    getIsSpeedInterventionActive() {
        return this._isSpeedInterventionActive;
    }
    toggleSpeedIntervention() {
        if (this.getIsSpeedInterventionActive()) {
            this.deactivateSpeedIntervention();
        }
        else {
            this.activateSpeedIntervention();
        }
    }
    activateSpeedIntervention() {
        if (!this.getIsVNAVActive()) {
            return;
        }
        this._isSpeedInterventionActive = true;
        if (Simplane.getAutoPilotMachModeActive()) {
            let currentMach = Simplane.getAutoPilotMachHoldValue();
            Coherent.call("AP_MACH_VAR_SET", 1, currentMach);
        }
        else {
            let currentSpeed = Simplane.getAutoPilotAirspeedHoldValue();
            Coherent.call("AP_SPD_VAR_SET", 1, currentSpeed);
        }
        SimVar.SetSimVarValue("L:AP_SPEED_INTERVENTION_ACTIVE", "number", 1);
        SimVar.SetSimVarValue("K:SPEED_SLOT_INDEX_SET", "number", 1);
    }
    deactivateSpeedIntervention() {
        this._isSpeedInterventionActive = false;
        SimVar.SetSimVarValue("L:AP_SPEED_INTERVENTION_ACTIVE", "number", 0);
        if (this.getIsVNAVActive()) {
            SimVar.SetSimVarValue("K:SPEED_SLOT_INDEX_SET", "number", 2);
            SimVar.SetSimVarValue("L:SALTY_VNAV_CLB_MODE", "Enum", 0);
            SimVar.SetSimVarValue("L:SALTY_VNAV_CRZ_MODE", "Enum", 0);
            SimVar.SetSimVarValue("L:SALTY_VNAV_DES_MODE", "Enum", 0);
        }
    }
    activateTHRREFMode() {
        let altitude = Simplane.getAltitudeAboveGround();
        if (Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_TAKEOFF && altitude <= 500) {
            this.setThrottleMode(ThrottleMode.TOGA);
            return;
        } else {
            this.setThrottleMode(ThrottleMode.CLIMB);
        }
        let n1 = 100;
        if (altitude < this.thrustReductionAltitude) {
            n1 = this.getThrustTakeOffLimit();
        }
        else {
            n1 = this.getThrustClimbLimit();
        }
        SimVar.SetSimVarValue("AUTOPILOT THROTTLE MAX THRUST", "number", n1);
    }
    getIsHeadingHoldActive() {
        return this._isHeadingHoldActive;
    }
    toggleHeadingHold() {
        if (this.getIsHeadingHoldActive()) {
            let altitude = Simplane.getAltitudeAboveGround();
            if (altitude < 50) {
                this.deactivateHeadingHold();
            }
            else {
                this.activateHeadingHold();
            }
        }
        else {
            this.activateHeadingHold();
        }
    }
    activateHeadingHold() {
        this._isHeadingHoldActive = true;
        if (!SimVar.GetSimVarValue("AUTOPILOT HEADING LOCK", "Boolean")) {
            SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "Number", 1);
        }
        SimVar.SetSimVarValue("L:AP_HEADING_HOLD_ACTIVE", "number", 1);
        this._headingHoldValue = Simplane.getHeadingMagnetic();
        SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 3);
        Coherent.call("HEADING_BUG_SET", 3, this._headingHoldValue);
    }
    deactivateHeadingHold() {
        this._isHeadingHoldActive = false;
        SimVar.SetSimVarValue("L:AP_HEADING_HOLD_ACTIVE", "number", 0);
    }
    activateHeadingSel() {
        this.deactivateHeadingHold();
        this.deactivateLNAV();
        SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 1);
        let altitude = Simplane.getAltitudeAboveGround();
        if (altitude < 400) {
            this._pendingHeadingSelActivation = true;
        }
        else {
            this.doActivateHeadingSel();
        }
    }
    doActivateHeadingSel() {
        this._pendingHeadingSelActivation = false;
        if (!SimVar.GetSimVarValue("AUTOPILOT HEADING LOCK", "Boolean")) {
            SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "Number", 1);
        }
    }
    getIsTHRActive() {
        return false;
    }
    getIsVSpeedActive() {
        return this._isVSpeedActive;
    }
    toggleVSpeed() {
        if (this.getIsVSpeedActive()) {
            let altitude = Simplane.getAltitudeAboveGround();
            if (altitude < 50) {
                this.deactivateVSpeed();
                this.deactivateSPD();
            }
            else {
                this.activateVSpeed();
            }
        }
        else {
            this.activateVSpeed();
        }
    }
    activateVSpeed() {
        this._isVSpeedActive = true;
        this.deactivateVNAV();
        this.deactivateAltitudeHold();
        this.deactivateFLCH();
        this.activateSPD();
        SimVar.SetSimVarValue("K:ALTITUDE_SLOT_INDEX_SET", "number", 1);
        let displayedAltitude = Simplane.getAutoPilotDisplayedAltitudeLockValue();
        Coherent.call("AP_ALT_VAR_SET_ENGLISH", 1, displayedAltitude, this._forceNextAltitudeUpdate);
        setTimeout(() => {
            let currentVSpeed = Simplane.getVerticalSpeed();
            Coherent.call("AP_VS_VAR_SET_ENGLISH", 0, currentVSpeed);
            if (!SimVar.GetSimVarValue("AUTOPILOT VERTICAL HOLD", "Boolean")) {
                SimVar.SetSimVarValue("K:AP_PANEL_VS_HOLD", "Number", 1);
            }
        }, 200);
        SimVar.SetSimVarValue("L:AP_VS_ACTIVE", "number", 1);
    }
    deactivateVSpeed() {
        this._isVSpeedActive = false;
        SimVar.SetSimVarValue("L:AP_VS_ACTIVE", "number", 0);
    }
    activateAltitudeSel() {
        let displayedAltitude = Simplane.getAutoPilotDisplayedAltitudeLockValue();
        this.cruiseFlightLevel = Math.floor(displayedAltitude / 100);
    }
    toggleAltitudeHold() {
        if (this.getIsAltitudeHoldActive()) {
            let altitude = Simplane.getAltitudeAboveGround();
            if (altitude < 50) {
                this.deactivateAltitudeHold();
                this.deactivateSPD();
            }
        }
        else {
            this.activateAltitudeHold();
        }
    }
    getIsAltitudeHoldActive() {
        return this._isAltitudeHoldActive;
    }
    activateAltitudeHold(useCurrentAutopilotTarget = false) {
        this.deactivateVNAV();
        this.deactivateFLCH();
        this.deactivateVSpeed();
        this.activateSPD();
        this._isAltitudeHoldActive = true;
        SimVar.SetSimVarValue("L:AP_ALT_HOLD_ACTIVE", "number", 1);
        if (useCurrentAutopilotTarget) {
            this._altitudeHoldValue = Simplane.getAutoPilotAltitudeLockValue("feet");
        }
        else {
            this._altitudeHoldValue = Simplane.getAltitude();
            this._altitudeHoldValue = Math.round(this._altitudeHoldValue / 100) * 100;
        }
        SimVar.SetSimVarValue("K:ALTITUDE_SLOT_INDEX_SET", "number", 1);
        Coherent.call("AP_ALT_VAR_SET_ENGLISH", 1, this._altitudeHoldValue, this._forceNextAltitudeUpdate);
        if (!SimVar.GetSimVarValue("AUTOPILOT ALTITUDE LOCK", "Boolean")) {
            SimVar.SetSimVarValue("K:AP_PANEL_ALTITUDE_HOLD", "Number", 1);
        }
    }
    deactivateAltitudeHold() {
        this._isAltitudeHoldActive = false;
        SimVar.SetSimVarValue("L:AP_ALT_HOLD_ACTIVE", "number", 0);
        Coherent.call("AP_ALT_VAR_SET_ENGLISH", 1, Simplane.getAutoPilotDisplayedAltitudeLockValue(), this._forceNextAltitudeUpdate);
        if (this._onAltitudeHoldDeactivate) {
            let cb = this._onAltitudeHoldDeactivate;
            this._onAltitudeHoldDeactivate = undefined;
            cb();
        }
    }
    getThrustTakeOffLimit() {
        return 100;
    }
    getThrustClimbLimit() {
        return 100;
    }
    getVRef(flapsHandleIndex = NaN, useCurrentWeight = true) {
        return 200;
    }
    getTakeOffManagedSpeed() {
        if (this.v2Speed) {
            return this.v2Speed;
        }
        let takeoffSpeed = Simplane.getAutoPilotAirspeedHoldValue();
        return takeoffSpeed;
    }
    getIsRouteActivated() {
        return this._isRouteActivated;
    }
    activateRoute(directTo = false, callback = EmptyCallback.Void) {
        if (directTo) {
            this._activatingDirectTo = true;
        }
        this._isRouteActivated = true;
        this.fpHasChanged = true;
        SimVar.SetSimVarValue("L:FMC_EXEC_ACTIVE", "number", 1);
        callback();
    }
    setBoeingDirectTo(directToWaypointIdent, directToWaypointIndex, callback = EmptyCallback.Boolean) {
        let waypoints = this.flightPlanManager.getWaypoints();
        let waypointIndex = waypoints.findIndex(w => { return w.ident === directToWaypointIdent; });
        if (waypointIndex === -1) {
            waypoints = this.flightPlanManager.getApproachWaypoints();
            if (waypoints) {
                let waypoint = waypoints.find(w => { return w.ident === directToWaypointIdent; });
                if (waypoint) {
                    return this.flightPlanManager.activateDirectTo(waypoint.icao, () => {
                        return callback(true);
                    });
                }
            }
        }
        if (waypointIndex > -1) {
            this.setDepartureIndex(-1, () => {
                let i = directToWaypointIndex;
                let removeWaypointMethod = () => {
                    if (i < waypointIndex) {
                        console.log("Remove Waypoint " + this.flightPlanManager.getWaypoints()[directToWaypointIndex].ident);
                        this.flightPlanManager.removeWaypoint(directToWaypointIndex, false, () => {
                            i++;
                            removeWaypointMethod();
                        });
                    }
                    else {
                        callback(true);
                    }
                };
                removeWaypointMethod();
            });
        }
        else {
            callback(false);
        }
    }
    // Copy airway selections from temporary to active flightplan
    copyAirwaySelections() {
        const temporaryFPWaypoints = this.flightPlanManager.getWaypoints(1);
        const activeFPWaypoints = this.flightPlanManager.getWaypoints(0);
        for (let i = 0; i < activeFPWaypoints.length; i++) {
            if (activeFPWaypoints[i].infos && temporaryFPWaypoints[i] && activeFPWaypoints[i].icao === temporaryFPWaypoints[i].icao && temporaryFPWaypoints[i].infos) {
                activeFPWaypoints[i].infos.airwayIn = temporaryFPWaypoints[i].infos.airwayIn;
                activeFPWaypoints[i].infos.airwayOut = temporaryFPWaypoints[i].infos.airwayOut;
            }
        }
    }
    //function added to set departure enroute transition index
    setDepartureEnrouteTransitionIndex(departureEnrouteTransitionIndex, callback = EmptyCallback.Boolean) {
        this.ensureCurrentFlightPlanIsTemporary(() => {
            this.flightPlanManager.setDepartureEnRouteTransitionIndex(departureEnrouteTransitionIndex, () => {
                callback(true);
            });
        });
    }
    //function added to set arrival runway transition index
    setArrivalRunwayTransitionIndex(arrivalRunwayTransitionIndex, callback = EmptyCallback.Boolean) {
        this.ensureCurrentFlightPlanIsTemporary(() => {
            this.flightPlanManager.setArrivalRunwayIndex(arrivalRunwayTransitionIndex, () => {
                callback(true);
            });
        });
    }
    //function added to set arrival and runway transition
    setArrivalAndRunwayIndex(arrivalIndex, enrouteTransitionIndex, callback = EmptyCallback.Boolean) {
        this.ensureCurrentFlightPlanIsTemporary(() => {
            let landingRunway = this.vfrLandingRunway;
            if (landingRunway === undefined) {
                landingRunway = this.flightPlanManager.getApproachRunway();
            }
            this.flightPlanManager.setArrivalProcIndex(arrivalIndex, () => {
                this.flightPlanManager.setArrivalEnRouteTransitionIndex(enrouteTransitionIndex, () => {
                    if (landingRunway) {
                        const arrival = this.flightPlanManager.getArrival();
                        const arrivalRunwayIndex = arrival.runwayTransitions.findIndex(t => {
                            return t.name.indexOf(landingRunway.designation) != -1;
                        });
                        if (arrivalRunwayIndex >= -1) {
                            return this.flightPlanManager.setArrivalRunwayIndex(arrivalRunwayIndex, () => {
                                return callback(true);
                            });
                        }
                    }
                    return callback(true);
                });
            });
        });
    }
}
//# sourceMappingURL=Boeing_FMC.js.map