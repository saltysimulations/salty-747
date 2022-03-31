class SaltyFlightPhaseLogic {
    constructor() {
        console.log('Salty Flight Phase logic loaded');
    }
    init () {
        return;
    }
    AreFlapsExtended() {
        let teFlaps = (SimVar.GetSimVarValue("TRAILING EDGE FLAPS LEFT ANGLE", "degrees") + SimVar.GetSimVarValue("TRAILING EDGE FLAPS RIGHT ANGLE", "degrees")) / 2 ;
        let leFlaps = (SimVar.GetSimVarValue("LEADING EDGE FLAPS LEFT ANGLE", "degrees") + SimVar.GetSimVarValue("LEADING EDGE FLAPS RIGHT ANGLE", "degrees")) / 2;
        if (teFlaps > 0 || leFlaps > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    TimeSinceLastEngineShutdown() {
        let t = 0;
        let engines = this.AnyEngineRunning();
    }
    AnyEngineRunning() {
        let n = 0;
        for (let i = 1; i < 5; i++) {
            if (SimVar.GetSimVarValue(`ENG COMBUSTION:${i}`, "bool")) {
                return true;
            }
            return false;
        }
        if (n != 0) {
            return true;
        }
    }
    /*AnyEngineRunning() {
        if (SimVar.GetSimVarValue("ENG COMBUSTION:1", "bool") || SimVar.GetSimVarValue("ENG COMBUSTION:2", "bool") || SimVar.GetSimVarValue("ENG COMBUSTION:3", "bool") || SimVar.GetSimVarValue("ENG COMBUSTION:4", "bool")) {
            let b = true;
            SimVar.SetSimVarValue("L:SALTY_ENG_RUN", "bool", b);
            return b;
        }
    }*/
    NumberOfEnginesRunning() {
        let n = 0;
        for (let i = 1; i <= 4; i++) {
            if (SimVar.GetSimVarValue(`ENG COMBUSTION:${i}`, "bool")) {
                n++;
            }
        }
        SimVar.SetSimVarValue("L:SALTY_ENG_NBR", "number", n);
        return n;
    }
    Phase() {
        let ground = SimVar.GetSimVarValue("L:SALTY_GROUND", "bool");
        let flaps = this.AreFlapsExtended();
        let engines = this.AnyEngineRunning();
        let running = this.NumberOfEnginesRunning();
        let speed = Simplane.getGroundSpeed();
        let waypoint = undefined;
        let runway = undefined;
        let distance = undefined;
        let toga = SimVar.GetSimVarValue("AUTOPILOT TAKEOFF POWER ACTIVE", "bool");
        let altredclb = SimVar.GetSimVarValue("L:SALTY_CLB_THR_RED_ALT", "number");
        let alt = Simplane.getAltitude();
        let altrestr = SimVar.GetSimVarValue("L:SALTY_ALT_RESTR", "number");
        let mcpalt = Simplane.getAutoPilotDisplayedAltitudeLockValue();
        if (ground) {
            if (!engines && speed < 1 && !toga) {
                let phase = 0;
                SimVar.SetSimVarValue("L:SALTY_PHASE", "Enum",  phase); //preflight
                return phase;
            }
            else if (toga && alt < altredclb) {
                let phase = 1;
                SimVar.SetSimVarValue("L:SALTY_PHASE", "Enum", phase); //takeoff
                return phase;
            }
            else if (ground && running <= 1) {
                let phase = 7;
                SimVar.SetSimVarValue("L:SALTY_PHASE", "Enum", phase); //flight complete
                return phase;
            }
        }
        else {
            if (alt >= altredclb && alt < mcpalt && alt < altrestr) {
                let phase = 2;
                SimVar.SetSimVarValue("L:SALTY_PHASE", "Enum", phase); //climb
                return phase;
            }
            else if (alt == mcpalt || alt == altrestr) {
                let phase = 3;
                SimVar.SetSimVarValue("L:SALTY_PHASE", "Enum", phase); //cruise
                return phase;
            }
            else if (alt > mcpalt || alt > altrestr) {
                let phase = 4;
                SimVar.SetSimVarValue("L:SALTY_PHASE", "Enum", phase); //descent
                return phase;
            }
            else if (SimVar.GetSimVarValue("L:SALTY_PHASE", "Enum") == 4 && flaps || waypoint || (runway && distance <= 25)) {
                let phase = 5;
                SimVar.SetSimVarValue("L:SALTY_PHASE", "Enum", phase); //approach
                return phase;
            }
            else if (toga && flaps) {
                let phase = 6;
                SimVar.SetSimVarValue("L:SALTY_PHASE", "Enum", phase); //goaround
                return phase;
            }
        }
    }
    update() {
        let phase = this.Phase();
        return phase;
    }
}