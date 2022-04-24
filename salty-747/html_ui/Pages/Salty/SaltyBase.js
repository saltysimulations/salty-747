class SaltyBase {
    constructor() {
        this.irs = new SaltyIRS();
        this.pilots = new SaltyPilots();
        this.jettison = new SaltyJettison();
        this.fadec = new SaltyFADEC();
        this.fuel = new SaltyFuel();
    }
    init() {
        this.irs.init();
        this.pilots.init();
        this.jettison.init();
        this.fadec.init();
        this.fuel.init();
    }
    update(electricityIsAvail) {
        // alternatively may be able to use this.isElectricityAvailable() SimVar.GetSimVarValue("CIRCUIT GENERAL PANEL ON", "Bool") to get electricity status
        this.irs.update(electricityIsAvail);
        this.jettison.update();
        this.fadec.update();
        this.fuel.update();
    }
}
