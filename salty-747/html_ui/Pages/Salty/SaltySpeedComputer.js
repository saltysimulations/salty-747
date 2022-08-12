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
        const leFlapPos = SimVar.GetSimVarValue("LEADING EDGE FLAPS LEFT ANGLE", "degree");
        const teFlapPos = SimVar.GetSimVarValue("TRAILING EDGE FLAPS LEFT ANGLE", "degree");
        const baseLimit = 15 * leFlapPos;
        let gearLim = 600;
        if (gearPos != 0) {
            gearLim = Math.min(320, SimVar.GetGameVarValue("FROM MACH TO KIAS", "number", 0.82));
        }

        const flaps1to10 = Utils.Clamp(teFlapPos, 0, 10);
        const flaps10to20 = Utils.Clamp(teFlapPos -10, 0, 10);
        const flaps20to30 = Utils.Clamp(teFlapPos -20, 0, 10);
        const flapLim = 600 - baseLimit - flaps1to10 * 4 - flaps10to20 - 5 * flaps20to30;

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
            SimVar.SetSimVarValue("L:74S_ADC_MANEUVERING_SPEED", "knots", stallSpeed1G * Math.sqrt(1.3));
            SimVar.SetSimVarValue("L:74S_ADC_MINIMUM_SPEED", "knots", stallSpeed1G * Math.sqrt(gLoad));
        }
        else {
            const stallSpeed1G = a * flapSetting + b;
            SimVar.SetSimVarValue("L:74S_ADC_MANEUVERING_SPEED", "knots", stallSpeed1G * Math.sqrt(1.3));
            SimVar.SetSimVarValue("L:74S_ADC_MINIMUM_SPEED", "knots", stallSpeed1G * Math.sqrt(gLoad));
        }
    }
    computeMach() {
        const ias = SimVar.GetSimVarValue("AIRSPEED INDICATED", "knots");
        const mach = SimVar.GetGameVarValue("FROM KIAS TO MACH", "number", ias);
        SimVar.SetSimVarValue("L:74S_ADC_MACH_NUMBER", "number", mach);
    }
}
