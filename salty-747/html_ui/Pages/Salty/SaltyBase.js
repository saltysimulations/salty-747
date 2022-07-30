class SaltyBase {
    constructor() {
        this.fma = new SaltyFMA();
        this.irs = new SaltyIRS();
        this.pilots = new SaltyPilots();
        this.jettison = new SaltyJettison();
        this.speedComputer = new SaltySpeedComputer();
    }
    init() {
        this.fma.init();
        this.irs.init();
        this.pilots.init();
        this.jettison.init();
        this.speedComputer.init();
    }
    update(electricityIsAvail) {
        this.fma.update();
        // alternatively may be able to use this.isElectricityAvailable() SimVar.GetSimVarValue("CIRCUIT GENERAL PANEL ON", "Bool") to get electricity status
        this.irs.update(electricityIsAvail);
        this.jettison.update();
        this.speedComputer.update();
    }
}
