class SaltyBase {
    constructor() {
        this.irs = new SaltyIRS();
    }
    init() {
        this.irs.init();
    }
    update() {
        this.irs.update();
    }
}