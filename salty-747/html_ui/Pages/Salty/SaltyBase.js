class SaltyBase {
    constructor() {
        this.irs = new SaltyIRS();
        this.pilots = new SaltyPilots();
        this.jettison = new SaltyJettison();
        this.airground = new SaltyAirGroundLogic();
        //this.flightphase = new SaltyFlightPhaseLogic();
        this.adc = new SaltyADC();
        //this.fadec = new SaltyFADEC();
    }
    init() {
        this.irs.init();
        this.pilots.init();
        this.jettison.init();
        this.airground.init();
        //this.flightphase.init();
        this.adc.init();
        //this.fadec.init();
    }
    update(electricityIsAvail) {
        // alternatively may be able to use this.isElectricityAvailable() SimVar.GetSimVarValue("CIRCUIT GENERAL PANEL ON", "Bool") to get electricity status
        this.irs.update(electricityIsAvail);
        this.jettison.update();
        this.airground.update();
        //this.flightphase.update();
        this.adc.update();
        //this.fadec.update();
    }
}
