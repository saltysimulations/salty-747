class SaltyPilots {
    constructor() {
        console.log('Salty Pilots constructed');
    }
    init() {
        const storedPilotsVis = SaltyDataStore.get("OPTIONS_PILOTS_VISIBILITY", "0")
        switch(storedPilotsVis) {
            case "1":
                SimVar.SetSimVarValue("L:SALTY_VIS_PILOT_0", "Number", 0);
                SimVar.SetSimVarValue("L:SALTY_VIS_PILOT_1", "Number", 1);
                break;
            case "2":
                SimVar.SetSimVarValue("L:SALTY_VIS_PILOT_0", "Number", 1);
                SimVar.SetSimVarValue("L:SALTY_VIS_PILOT_1", "Number", 0);
                break;
            case "3":
                SimVar.SetSimVarValue("L:SALTY_VIS_PILOT_0", "Number", 0);
                SimVar.SetSimVarValue("L:SALTY_VIS_PILOT_1", "Number", 0);
                break;
            default:
                SimVar.SetSimVarValue("L:SALTY_VIS_PILOT_0", "Number", 1);
                SimVar.SetSimVarValue("L:SALTY_VIS_PILOT_1", "Number", 1);
        }
    }
}
