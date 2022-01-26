class SaltyAntiIceLogic {
    constructor() {
        console.log('Salty AntiIce Logic loaded');
    }
    init() {
        return;
    }
    getTAT() {
        let TAT = SimVar.GetSimVarValue("TOTAL AIR TEMPERATURE", "celsius");
        return TAT;
    }
    getEAI1switchPosition() {

    }
    getEAI2switchPosition() {

    }
    getEAI3switchPosition() {

    }
    getEAI4switchPosition() {

    }
    getWAIswitchPosition() {

    }
    getIce() {
        ice = SimVar.GetSimVarValue("STRUCTURAL ICE PCT", "percent");
        if (ice >= 1) {
            return true;
        }
        else {
            return false;
        }
    }
    getInCloud() {
        cloud = SimVar.GetSimVarValue("AMBIENT IN CLOUD", "bool");
        if (cloud) {
            return true;
        }
        else {
            return false;
        }
    }
    update() {
        let tat = this.getTAT();
        let ice = this.getIce();
        let cloud = this.getInCloud();
        let eai1 = this.getEAI1switchPosition();
        let eai2 = this.getEAI2switchPosition();
        let eai3 = this.getEAI3switchPosition();
        let eai4 = this.getEAI4switchPosition();
        let wai = this.getWAIswitchPosition();
        if (wai = 1) {
            if (ice || (tat < 10 && cloud)) {
                
            }
        }


    }
}