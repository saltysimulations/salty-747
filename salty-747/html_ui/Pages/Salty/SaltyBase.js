class SaltyBase {
    constructor() {
        this.irs = new SaltyIRS();
        this.pilots = new SaltyPilots();
        this.jettison = new SaltyJettison();
    }
    init() {
        this.irs.init();
        this.pilots.init();
        this.jettison.init();

        // setting this as a simvar to have access to it in wasm
        SimVar.SetSimVarValue("L:SALTY_PAUSE_AT_TD", "Enum", WTDataStore.get("PAUSE_AT_TD", 0));
    }
    update(electricityIsAvail) {
        // alternatively may be able to use this.isElectricityAvailable() SimVar.GetSimVarValue("CIRCUIT GENERAL PANEL ON", "Bool") to get electricity status
        this.irs.update(electricityIsAvail);
        this.jettison.update();
    }
}
