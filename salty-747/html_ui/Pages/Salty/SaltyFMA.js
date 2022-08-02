class SaltyFMA {
    constructor() {
    }
    init() {
    }
    update() {
        const fmaValues = localStorage.getItem("CJ4_fmaValues");
        if (fmaValues) {
            const parsedFmaValues = JSON.parse(fmaValues);
            const throttleMode = parsedFmaValues.autoThrottle;
            const rollMode = parsedFmaValues.lateralMode;
            const armedRollMode = parsedFmaValues.lateralArmed;
            const pitchMode = parsedFmaValues.verticalMode;  
            const approachType = parsedFmaValues.approachType;
            const armedPitchMode = "";

            this.setAfdsMode();
            this.setThrottleMode(throttleMode);
            this.setRollMode(rollMode);
            this.setArmedRollMode(armedRollMode);
            this.setPitchMode(pitchMode);
            this.setArmedPitchMode(armedPitchMode, pitchMode, approachType);
        } 
    }
    setAfdsMode() {
        if (Simplane.getAutoPilotActive()) {
            SimVar.SetSimVarValue("L:74S_AFDS_STATUS", "enum", 2);
        }
        else if (Simplane.getAutoPilotFlightDirectorActive(1)) {
            SimVar.SetSimVarValue("L:74S_AFDS_STATUS", "enum", 1);
        }
        else {
            SimVar.SetSimVarValue("L:74S_AFDS_STATUS", "enum", 0);
        }
    }
    setThrottleMode(throttleMode) {
        if (!Simplane.getAutoPilotThrottleArmed()) {
            SimVar.SetSimVarValue("L:74S_AUTOTHROTTLE_MODE_ACTIVE", "enum", 0);
        }
        if (throttleMode == "SPD") {
            SimVar.SetSimVarValue("L:74S_AUTOTHROTTLE_MODE_ACTIVE", "enum", 4);
        }
        else if (throttleMode == "THR" ) {
            SimVar.SetSimVarValue("L:74S_AUTOTHROTTLE_MODE_ACTIVE", "enum", 2);
        }
        else if (throttleMode == "THRREF") {
            SimVar.SetSimVarValue("L:74S_AUTOTHROTTLE_MODE_ACTIVE", "enum", 1);
        }
        else if (throttleMode == "HOLD") {
            SimVar.SetSimVarValue("L:74S_AUTOTHROTTLE_MODE_ACTIVE", "enum", 5);
        }
        else if (throttleMode == "IDLE") {
            SimVar.SetSimVarValue("L:74S_AUTOTHROTTLE_MODE_ACTIVE", "enum", 3);
        }
    }
    setRollMode(rollMode) {
        if (!Simplane.getAutoPilotActive(0) && !Simplane.getAutoPilotFlightDirectorActive(1)) {
            SimVar.SetSimVarValue("L:74S_ROLL_MODE_ACTIVE", "enum", 0);
        }
        else if (rollMode == "HDGHOLD") {
            SimVar.SetSimVarValue("L:74S_ROLL_MODE_ACTIVE", "enum", 2);
        }
        else if (rollMode == "HDG") {
            SimVar.SetSimVarValue("L:74S_ROLL_MODE_ACTIVE", "enum", 3);
        }
        else if (rollMode == "LNV1") {
            SimVar.SetSimVarValue("L:74S_ROLL_MODE_ACTIVE", "enum", 4);
        }
        else if (rollMode == "APPR LNV1") {
            SimVar.SetSimVarValue("L:74S_ROLL_MODE_ACTIVE", "enum", 6);
        }
        else if (rollMode == "APPR LOC1") {
            SimVar.SetSimVarValue("L:74S_ROLL_MODE_ACTIVE", "enum", 5);
        }
        else if (rollMode == "TO" || rollMode == "GA" || rollMode == "ROLL") {
            SimVar.SetSimVarValue("L:74S_ROLL_MODE_ACTIVE", "enum", 1);
        }
        else if (rollMode == "ROLLOUT") {
            SimVar.SetSimVarValue("L:74S_ROLL_MODE_ACTIVE", "enum", 7);
        }
        else if (rollMode == "ATT") {
            SimVar.SetSimVarValue("L:74S_ROLL_MODE_ACTIVE", "enum", 8);
        }
    }
    setArmedRollMode(armedRollMode) {
        if (!Simplane.getAutoPilotActive(0) && !Simplane.getAutoPilotFlightDirectorActive(1)) {
            SimVar.SetSimVarValue("L:74S_ROLL_MODE_ARMED", "enum", 0);
        }
        else if (armedRollMode == "APPR LNV1") {
            SimVar.SetSimVarValue("L:74S_ROLL_MODE_ARMED", "enum", 2);
        }
        else if (armedRollMode == "APPR LOC1") {
            SimVar.SetSimVarValue("L:74S_ROLL_MODE_ARMED", "enum", 1);
        }
        else if (armedRollMode == "LNV1") {
            SimVar.SetSimVarValue("L:74S_ROLL_MODE_ARMED", "enum", 3);
        }
        else {
            SimVar.SetSimVarValue("L:74S_ROLL_MODE_ARMED", "enum", 0);
        }
    }
    setPitchMode(pitchMode) {
        const roundedAlt = Math.round(Simplane.getAltitude() / 100) * 100;
        const targetAlt = SimVar.GetSimVarValue("AUTOPILOT ALTITUDE LOCK VAR:3", "feet");
        const crzAlt = SimVar.GetSimVarValue("L:AIRLINER_CRUISE_ALTITUDE", "number");
        if(!Simplane.getAutoPilotActive(0) && !Simplane.getAutoPilotFlightDirectorActive(1)){
            SimVar.SetSimVarValue("L:74S_PITCH_MODE_ACTIVE", "enum", 0);
        }
        else if (pitchMode === "VPATH" || pitchMode === "VALTV CAP" || pitchMode === "VALTV" 
            || pitchMode === "VALTS" && (targetAlt === crzAlt)
            || pitchMode === "VALTS CAP" && (targetAlt === crzAlt)
            || pitchMode === "VALT" && (roundedAlt === crzAlt)) {
            SimVar.SetSimVarValue("L:74S_PITCH_MODE_ACTIVE", "enum", 4);
        }
        else if (pitchMode === "VALTS" || pitchMode === "VALTS CAP" || pitchMode === "VALT") {
            SimVar.SetSimVarValue("L:74S_PITCH_MODE_ACTIVE", "enum", 3);
        }
        else if (pitchMode === "VFLC") {
            SimVar.SetSimVarValue("L:74S_PITCH_MODE_ACTIVE", "enum", 5);
        }
        else if (pitchMode === "ALTS CAP" || pitchMode === "ALTS" || pitchMode === "ALT") {
            SimVar.SetSimVarValue("L:74S_PITCH_MODE_ACTIVE", "enum", 2);
        }
        else if (pitchMode === "FLC") {
            SimVar.SetSimVarValue("L:74S_PITCH_MODE_ACTIVE", "enum", 7);
        }
        else if (pitchMode === "VS") {
            SimVar.SetSimVarValue("L:74S_PITCH_MODE_ACTIVE", "enum", 8);
        }
        else if (pitchMode === "TO" || pitchMode === "GA") {
            SimVar.SetSimVarValue("L:74S_PITCH_MODE_ACTIVE", "enum", 1);
        }
        else if (pitchMode === "GP") {
            SimVar.SetSimVarValue("L:74S_PITCH_MODE_ACTIVE", "enum", 10);
        }
        else if (pitchMode === "GS") {
            SimVar.SetSimVarValue("L:74S_PITCH_MODE_ACTIVE", "enum", 9);
        }
        else if (pitchMode === "FLARE") {
            SimVar.SetSimVarValue("L:74S_PITCH_MODE_ACTIVE", "enum", 11);
        }
    }
    setArmedPitchMode(armedPitchMode, pitchMode, approachType) {
        if (!Simplane.getAutoPilotActive(0) && !Simplane.getAutoPilotFlightDirectorActive(1)) {
            SimVar.SetSimVarValue("L:74S_PITCH_MODE_ARMED", "enum", 0);
        }
        else if (SimVar.GetSimVarValue("L:AP_APP_ARMED", "bool") === 1) {
            if (approachType === "rnav" && pitchMode !== "GP") {
                SimVar.SetSimVarValue("L:74S_PITCH_MODE_ARMED", "enum", 2);
            }
            else if (approachType === "ils" && pitchMode !== "GS") {
                SimVar.SetSimVarValue("L:74S_PITCH_MODE_ARMED", "enum", 1);
            }
            else {
                SimVar.SetSimVarValue("L:74S_PITCH_MODE_ARMED", "enum", 0);
            }
        }
        else if (SimVar.GetSimVarValue("L:AP_VNAV_ARMED", "number") === 1 && SimVar.GetSimVarValue("L:WT_CJ4_VNAV_ON", "number") === 0) {
            SimVar.SetSimVarValue("L:74S_PITCH_MODE_ARMED", "enum", 3);
        }
        else if (armedPitchMode === "FLARE") {
            SimVar.SetSimVarValue("L:74S_PITCH_MODE_ARMED", "enum", 4);
        }
        else {
            SimVar.SetSimVarValue("L:74S_PITCH_MODE_ARMED", "enum", 0);
        }
    }
}
