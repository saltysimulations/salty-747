class SaltyBase {
    constructor() {
        this.fma = new SaltyFMA();
        this.irs = new SaltyIRS();
        this.pilots = new SaltyPilots();
        this.jettison = new SaltyJettison();
        this.speedComputer = new SaltySpeedComputer();
        this.saltyBoarding = new SaltyBoarding();
        this.saltyFueling = new SaltyFueling();
        this.saltyStates = new SaltyStates();
    }

    init() {
        this.fma.init();
        this.irs.init();
        this.pilots.init();
        this.jettison.init();
        this.speedComputer.init();
        this.saltyBoarding.init();
    }

    onFlightStart() {
        this.saltyStates.onFlightStart();
    }

    update(_deltaTime, electricityIsAvail) {
        this.fma.update();
        // alternatively may be able to use this.isElectricityAvailable() SimVar.GetSimVarValue("CIRCUIT GENERAL PANEL ON", "Bool") to get electricity status
        this.irs.update(electricityIsAvail);
        this.jettison.update();
        this.speedComputer.update();
        this.saltyBoarding.update(_deltaTime);
        this.saltyFueling.update(_deltaTime);
    }
}

