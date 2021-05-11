class SaltyJettison {
    constructor() {
        console.log("SaltyJettison loaded");
    }
    init() {
        //stub
    }
    update() {
        SimVar.SetSimVarValue("L:747_FUEL_JETTISON_NOZZLE_L", "Enum", SimVar.GetSimVarValue("A:FUELSYSTEM VALVE SWITCH:24", "Enum"));
        SimVar.SetSimVarValue("L:747_FUEL_JETTISON_NOZZLE_R", "Enum", SimVar.GetSimVarValue("A:FUELSYSTEM VALVE SWITCH:25", "Enum"));
    }
}
