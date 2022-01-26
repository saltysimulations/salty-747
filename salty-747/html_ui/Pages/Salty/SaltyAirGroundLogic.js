class SaltyAirGroundLogic {
    constructor() {
        console.log('Salty Air/Ground logic loaded');
    }
    init() {
        return;
    }
    RMGisOnGround() {
        let compression = SimVar.GetSimVarValue("CONTACT POINT COMPRESSION:1", "percent");
        if (compression > 5) {
            return true;
        }
        else {
            return false;
        }
    }
    LMGisOnGround() {
        let compression = SimVar.GetSimVarValue("CONTACT POINT COMPRESSION:2", "percent");
        if (compression > 5) {
            return true;
        }
        else {
            return false;
        }
    }
    SaltyisOnGround(){
        let RMG = this.RMGisOnGround();
        let LMG = this.LMGisOnGround();
        if (!RMG && !LMG) {
            return false;
        }
        else {
            return true;
        }
    }
    update() {
        let ground = this.SaltyisOnGround();
        SimVar.SetSimVarValue("L:SALTY_GROUND", "bool", ground);
        return ground;
    }    
}