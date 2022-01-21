class SaltyBase {
    constructor() {
        this.irs = new SaltyIRS();
        this.pilots = new SaltyPilots();
        this.jettison = new SaltyJettison();
    }
    init() {
        this._deltaTime = createDeltaTimeCalculator();
        this.irs.init();
        this.pilots.init();
        this.jettison.init();
    }
    update(electricityIsAvail) {
        // alternatively may be able to use this.isElectricityAvailable() SimVar.GetSimVarValue("CIRCUIT GENERAL PANEL ON", "Bool") to get electricity status
        this.irs.update(electricityIsAvail);
        this.jettison.update();
    }
}
const createDeltaTimeCalculator = (startTime = Date.now()) => {
    let lastTime = startTime;
    return () => {
        const nowTime = Date.now();
        const deltaTime = nowTime - lastTime;
        lastTime = nowTime;
        return deltaTime;
    };
};
