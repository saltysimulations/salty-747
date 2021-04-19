class SaltyBase {
    constructor() {
        this.irs = new SaltyIRS();
	this.pilots = new SaltyPilots();
    }
    init() {
        this.irs.init();
	this.pilots.init();
    }
    update() {
        this.irs.update();
    }
}