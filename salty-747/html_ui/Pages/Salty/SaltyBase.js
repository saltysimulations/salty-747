class SaltyBase {
    constructor() {
        this.irs = new SaltyIRS();
        this.pilots = new SaltyPilots();
        this.jettison = new SaltyJettison();
        this.gpws = new GPWS();
    }
    init() {
        this.irs.init();
        this.pilots.init();
        this.jettison.init();
    }
    update(electricityIsAvail, deltaTime) {
        // alternatively may be able to use this.isElectricityAvailable() SimVar.GetSimVarValue("CIRCUIT GENERAL PANEL ON", "Bool") to get electricity status
        this.irs.update(electricityIsAvail);
        this.jettison.update();
        this.gpws.update(deltaTime);
    }
}
