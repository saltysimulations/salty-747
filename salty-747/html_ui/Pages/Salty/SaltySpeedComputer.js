class SaltySpeedComputer {
    constructor() {
        console.log("Speed Computer loaded");
    }
    init() {

    }
    update() {
        this.updateMaxSpeed();
        this.updateMinSpeeds();
        this.computeMach();
    }
    updateMaxSpeed() {
        const vmo = Math.min(360, SimVar.GetGameVarValue("FROM MACH TO KIAS", "number", 0.9));
        const gearPos = SimVar.GetSimVarValue("GEAR POSITION", "number");
        let gearLim = 600;
        if (gearPos != 0) {
            gearLim = Math.min(320, SimVar.GetGameVarValue("FROM MACH TO KIAS", "number", 0.82));
        }
        let flapLim = 0;
        switch (SimVar.GetSimVarValue("FLAPS HANDLE INDEX", "number")) {
            case 0:
                flapLim = 600; 
                break;
            case 1:
                flapLim = 285;
                break;
            case 2:
                flapLim = 265;
                break;
            case 3:
                flapLim = 245;
                break;
            case 4:
                flapLim = 235;
                break;
            case 5:
                flapLim = 210;
                break;
            case 6:
                flapLim = 185;
                break;
        }
        const maxSpeed = Math.min(vmo, Math.min(gearLim, flapLim));
        SimVar.SetSimVarValue("L:74S_ADC_MAXIMUM_SPEED", "knots", maxSpeed);
    }
    updateMinSpeeds() {
        const gLoad = SimVar.GetSimVarValue("G FORCE", "GForce");
        const flapSetting = SimVar.GetSimVarValue("TRAILING EDGE FLAPS LEFT ANGLE", "degrees");
        const grossWeight = Math.round(Simplane.getWeight() / 1000);
        const a = -0.0008 * grossWeight - 0.5617;
        const b = 0.2237 * grossWeight + 75.764;
        const c = 0.0326 * grossWeight + 25.248;
        if (flapSetting === 0) {
            const stallSpeed1G = a * flapSetting + b + c;
            SimVar.SetSimVarValue("L:74S_ADC_MANUEVERING_SPEED", "knots", stallSpeed1G * Math.sqrt(1.3));
            SimVar.SetSimVarValue("L:74S_ADC_MINIMUM_SPEED", "knots", stallSpeed1G * Math.sqrt(gLoad));
        }
        else {
            const stallSpeed1G = a * flapSetting + b;
            SimVar.SetSimVarValue("L:74S_ADC_MANUEVERING_SPEED", "knots", stallSpeed1G * Math.sqrt(1.3));
            SimVar.SetSimVarValue("L:74S_ADC_MINIMUM_SPEED", "knots", stallSpeed1G * Math.sqrt(gLoad));
        }
    }
    computeMach() {
        const ias = SimVar.GetSimVarValue("AIRSPEED INDICATED", "knots");
        const mach = SimVar.GetGameVarValue("FROM KIAS TO MACH", "number", ias);
        SimVar.SetSimVarValue("L:74S_ADC_MACH_NUMBER", "number", mach);
    }
}
