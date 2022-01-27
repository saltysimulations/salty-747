import { Module } from "../module";

export class FMCThrustManagement extends Module {
    private timeOut: number;

    constructor() {
        super();
        this.timeOut = 0;
    }

    public update(_dt: number) {
        const mode = SimVar.GetSimVarValue("L:74S_FMC_REFTHR_MODE", "enum");
        const fixedDerate = SimVar.GetSimVarValue("L:74S_FMC_REFTHR_DERATE", "enum");
        const mach = SimVar.GetSimVarValue("AIRSPEED MACH", "number");
        const oat = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "kelvin");
        const alt = SimVar.GetSimVarValue("PRESSURE ALTITUDE", "feet");
        const atm = SimVar.GetSimVarValue("L:74S_FMC_ASSUMED_TEMP", "number");

        switch (mode) {
            case 0: this.setRefThrust(this.getTakeOffRefThrust(fixedDerate, oat, alt, atm));
            case 1: this.setRefThrust(this.getClimbRefThrust(fixedDerate, oat, alt, mach));
            case 2: this.setRefThrust(this.getCruiseRefThrust(oat, mach, alt));
            case 3: this.setRefThrust(this.getContinuousRefThrust(oat, mach, alt));
            case 4: this.setRefThrust(this.getGoAroundRefThrust(oat, mach, alt));
        }
    }
    
    /**
    * Sets a Thrust Reference Value (%N1).
    * @param n1 Reference N1 to set.
    */
    public setRefThrust(n1: number) {
        SimVar.SetSimVarValue("AUTOPILOT THROTTLE MAX THRUST", "percent", (n1 - 20.2) / 0.798);
        SimVar.SetSimVarValue("K:AP_N1_REF_SET", "number", n1);
        SimVar.SetSimVarValue("L:74S_FMC_REF_N1", "number", n1);
    }

    /**
    * Gets the base TO Thrust Reference Value (%N1).
    * @param mode Fixed Derate in use (0 = TO, 1 = TO1, 2 = TO2).
    * @param temp Outside Air Temp (K).
    * @param alt Current Pressure Alt (feet).
    * @param atm Selected Assumed Temperature (degrees C).
    */
    public getTakeOffRefThrust(mode: number, temp: number, alt: number, atm: number) {
        let n1Ref = 97.9;
        switch (mode) {
            case 0: n1Ref = 97.9;
            case 1: n1Ref = 93.6;
            case 2: n1Ref = 89.4;
        }
        const isaTemp = Math.round(288.15 - 2 * (alt / 1000));
        const theta = 288.15 / (atm + 273.15);
        return n1Ref * (temp / 288.15) ** 0.5 * (theta) ** 0.5 * (288.15 / isaTemp) ** 0.5;;
    }
    
    /**
    * Gets the base CLB Thrust Reference Value (%N1).
    * @param mode Fixed Derate in use (0 = TO, 1 = TO1, 2 = TO2).
    * @param temp Outside Air Temp (K).
    * @param alt Current Pressure Alt (feet).
    * @param mach Mach Number (dimensionless).
    */
    public getClimbRefThrust(mode: number, oat: number, alt: number, mach: number) {
        const isa = Math.max(288.15 - 2 * (alt / 1000), 216.65);
        const theta = (oat / isa) * (1 + 0.2 * mach ** 2);
        let refN1 = 88.0;
        if (mode === 0) {
            refN1 = 88.00;
        }
        else if (mode === 1) {
            refN1 = 84.74;
            if (alt > 14999) {
                refN1 = 88.00;
            }
            else if (alt > 9999) {
                refN1 += 0.000652 * (alt - 10000);
                refN1 = Math.min(refN1, 88.00);
            }
        }
        else if (mode === 2) {
            refN1 = 81.48;
            if (alt > 14999) {
                refN1 = 88.00;
            }
            else if (alt > 9999) {
                refN1 += 0.001304 * (alt - 10000);
                refN1 = Math.min(refN1, 88.00);
            }
        }
        return Math.min(refN1 * (1 + 0.2 * mach ** 2) ** 0.5 * theta ** 0.5, 100);
    }

    /**
    * Gets the base CRZ Thrust Reference Value (%N1).
    * @param oat Outside Air Temp (K).
    * @param mach Mach Number (dimensionless).
    * @param alt Current Pressure Alt (feet).
    */
    public getCruiseRefThrust(oat: number, mach: number, alt: number) {
        const isa = Math.max(288.15 - 2 * (alt / 1000), 216.65);
        const theta = (oat / isa) * (1 + 0.2 * mach ** 2);
        return Math.min(90.45 * (1 + 0.2 * mach ** 2) ** 0.5 * theta ** 0.5, 100);
    }

    /**
    * Gets the base CON Thrust Reference Value (%N1).
    * @param oat Outside Air Temp (K).
    * @param mach Mach Number (dimensionless).
    * @param alt Current Pressure Alt (feet).
    */
    public getContinuousRefThrust(oat: number, mach: number, alt: number) {
        const isa = Math.max(288.15 - 2 * (alt / 1000), 216.65);
        const theta = (oat / isa) * (1 + 0.2 * mach ** 2);
        return Math.min(92.56 * (1 + 0.2 * mach ** 2) ** 0.5 * theta ** 0.5, 100);
    }

    /**
    * Gets the base GA Thrust Reference Value (%N1).
    * @param oat Outside Air Temp (K).
    * @param mach Mach Number (dimensionless).
    * @param alt Current Pressure Alt (feet).
    */
    public getGoAroundRefThrust(oat: number, mach: number, alt: number) {
        const isa = Math.max(288.15 - 2 * (alt / 1000), 216.65);
        const theta = (oat / isa) * (1 + 0.2 * mach ** 2);
        return Math.min(91.87 * (1 + 0.2 * mach ** 2) ** 0.5 * theta ** 0.5, 100);
    }
}
