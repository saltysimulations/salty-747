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
    }
    update() {
        this.irs.update();
        this.jettison.update();
    }
}
