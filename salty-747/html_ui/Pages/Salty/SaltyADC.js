class SaltyADC {
    constructor() {
        this.ncd = -1;              //No Computed Data state
        this.a0 = 340.294;          //Speed of sound at ISA sea level (M/sec)
        this.p0 = 101325            //Standard pressure (Pascals)
        this.temp0 = 288.15;        //ISA Temp at sea level (Kelvin)
        this.r = 8.31446261815324;  //Gas constant (J.K/mol)
        this.g = 9.80665;           //Accel due to gravity (M/sec^2)
        this.mm = 0.0289644;        //Molar mass of air (kg/mol)
        this.mToFeet = 3.28084;     //Metres to feet
        this.mpsToKnots = 1,944012; //Metres per sec to knots
        this.rho0 = 1.225;          //Kg per cubic meter
        this.l0 = -0.0065;          //Lapse rate in °K/meter
        this.h1 = 11000;            //36089 ft of height in ISA
        this.temp1 = 216.65;        //Temperature in °K at 36089 ft
        this.p1 = 22632;            //Pressure in Pa at 36089 ft
        this.h0 = 0;

        //Alt samples for vertical speed
        this.altSample = false;
        this.t0 = 0;
        this.t1 = 0;
        this.alt0 = 0;
        this.alt1 = 0;

        console.log("Salty ADC loaded");
    }
    init() {
        //this.irsTimer = -1;
    }
    update() {
        //Return No Computed Data if ADC unpowered or in fault state.
        if ((SimVar.GetSimVarValue("ELECTRICAL MAIN BUS VOLTAGE", "volts") < 20) || SimVar.GetSimVarValue("L:74S_ADC_STATE", "enum") === -1) {
            SimVar.SetSimVarValue("L:74S_ADC_CAS", "knots", this.ncd);
            SimVar.SetSimVarValue("L:74S_ADC_TAS", "knots", this.ncd);
            SimVar.SetSimVarValue("L:74S_ADC_MACH", "number", this.ncd);
            SimVar.SetSimVarValue("L:74S_ADC_SAT", "number", this.ncd);
            SimVar.SetSimVarValue("L:74S_ADC_ALT", "feet", this.ncd);
            SimVar.SetSimVarValue("L:74S_ADC_BARO_CORR_ALT", "feet", this.ncd);
            SimVar.SetSimVarValue("L:74S_ADC_ALT_RATE", "feet", this.ncd);
            SimVar.SetSimVarValue("L:74S_ADC_VMO", "knots", this.ncd);
            SimVar.SetSimVarValue("L:74S_ADC_OVERSPEED_DISCREET", "boolean", this.ncd);
            return;
        }

        //Inputs
        const q = SimVar.GetSimVarValue("DYNAMIC PRESSURE", "pascal");
        const p = SimVar.GetSimVarValue("AMBIENT PRESSURE", "pascal");
        const tat = SimVar.GetSimVarValue("TOTAL AIR TEMPERATURE", "kelvin");
        const baroSetting = SimVar.GetSimVarValue("KOHLSMAN SETTING MB:0", "pascal");
        //const mach = SimVar.GetSimVarValue("AIRSPEED MACH", "mach");

        //Intermediate Values
        const mach = this.calculateMach(q, p);
        const sat = this.calculateSAT(mach, tat);
        const satC = this.SATtoCelsius(sat);
        const alt = this.calculateAlt(p);
        const baroCorrAlt = this.calculateBaroCorrAlt(p, baroSetting);
        const vmo = this.getBarberPoleSpeed();
        const eas = this.calculateEAS(mach, p);
        const tas = this.calculateTAS(mach, sat);
        const qc = this.calculateQC(p, mach);
        const cas = this.calculateCAS(qc);
        const isOverspeed = this.getIsOverspeed(vmo, cas);
        const altRate = this.calculateAltRate();

        //Outputs
        SimVar.SetSimVarValue("L:74S_ADC_CAS", "knots", cas);
        SimVar.SetSimVarValue("L:74S_ADC_TAS", "knots", tas);
        SimVar.SetSimVarValue("L:74S_ADC_EAS", "knots", eas);
        SimVar.SetSimVarValue("L:74S_ADC_MACH", "number", mach);
        SimVar.SetSimVarValue("L:74S_ADC_SAT", "number", satC);
        SimVar.SetSimVarValue("L:74S_ADC_ALT", "feet", alt);
        SimVar.SetSimVarValue("L:74S_ADC_BARO_CORR_ALT", "feet", baroCorrAlt);
        SimVar.SetSimVarValue("L:74S_ADC_ALT_RATE", "feet", altRate);
        SimVar.SetSimVarValue("L:74S_ADC_VMO", "knots", vmo);
        SimVar.SetSimVarValue("L:74S_ADC_OVERSPEED_DISCREET", "boolean", isOverspeed);
    }

    getBarberPoleSpeed() {
        const vmo = Math.min(365, this.calculateMMO());
        if (vmo < 150 || vmo > 450) {
            return this.ncd;
        }
        return vmo;
    }

    calculateMMO() {
        const mmo = 0.9;
        const mmoInKnots = SimVar.GetGameVarValue("FROM MACH TO KIAS", "number", mmo);
        return mmoInKnots;
    }

    getIsOverspeed(vmo, cas) {
        const isOverspeed = cas > vmo ? true : false;
        return isOverspeed;
    }
    
    calculateQC(p, mach) {
        const qc = ((1 + 0.2 * mach ** 2) ** 3.5 - 1) * p;
        return qc; 
    }

    calculateCAS(qc) {
        const cas = this.a0 * (5 * (((qc / this.p0) + 1) ** (2 / 7) - 1)) ** 0.5 * this.mpsToKnots;
        if (cas < 30 || cas > 450) {
            return this.ncd;
        }
        return cas;
    }

    calculateEAS(mach, p) {
        const eas = this.a0 * mach * (p / this.p0) ** 0.5 * this.mpsToKnots;
        return eas;
    }

    calculateTAS(mach, sat) {
        const tas = this.a0 * mach * (sat / this.temp0) ** 0.5 * this.mpsToKnots;
        if (tas < 100 || tas > 599) {
            return this.ncd;
        }
        return tas;
    }

    calculateMach(q, p) {
        const mach = ((2 * q) / (1.4 * p)) ** 0.5;
        if (mach < 0.1 || mach > 1.0) {
            return this.ncd;
        }
        return mach;
    }

    calculateSAT(mach, tat) {
        const sat = tat / (1 + 0.2 * mach ** 2);
        if (sat < -174.15 || sat > 333.15) {
            return this.ncd;
        }
        return sat;
    }

    SATtoCelsius(sat) {
        const satC = sat - 273.15;
        return satC;
    }

    /*calculateAlt(p) {
        //const alt = ((this.r * sat) / (this.g * this.mm)) * Math.log(this.p0 / p) * this.mToFeet;
        const altH = this.h1 - ((this.r * this.t1) / (this.g0 * this.mm)) * Math.log(p / this.p1);
        SimVar.SetSimVarValue ("L:74S_ADC_ALTH", "feet", altH);
        const altL = this.h0 + ((p / this.p0) ** ((-this.r * this.l0) / (this.g0 * this.mm)) - 1) * (this.t0 / this.l0);
        SimVar.SetSimVarValue("L:74S_ADC_ALTL", "feet", altL);
        const alt = 15000;
        if (!this.altSample) {
            this.alt0 = alt;
            this.t0 = performance.now();
            this.altSample = true;
        }
        else {
            this.alt1 = alt;
            this.t1 = performance.now();
            this.altSample = false;
        }
        if (alt < -1000 || alt > 50000) {
            return this.ncd;
        }
        if (p >= 22632) {
            if (!this.altSample) {
                this.alt0 = altL;
                this.t0 = performance.now();
                this.altSample = true;
            }
            else {
                this.alt1 = altL;
                this.t1 = performance.now();
                this.altSample = false;
            }
            if (altL < -1000 || altL > 50000) {
                return this.ncd;
            }
            //SimVar.SetSimVarValue("L:74S_ADC_ALTL", "feet", altL);
            const alt = altL;
            return alt;
        }
        else {
            if (!this.altSample) {
                this.alt0 = altH;
                this.t0 = performance.now();
                this.altSample = true;
            }
            else {
                this.alt1 = altH;
                this.t1 = performance.now();
                this.altSample = false;
            }
            if (altH < -1000 || altH > 50000) {
                return this.ncd;
            }
            //SimVar.SetSimVarValue("L:74S_ADC_ALTH", "feet", altH);
            const alt = altH;
            return alt;
        }
    }*/

    calculateAlt(p) {
        //const alt = ((this.r * sat) / (this.g * this.mm)) * Math.log(this.p0 / p) * this.mToFeet;
        const altH = (this.h1 - ((this.r * this.temp1) / (this.g * this.mm)) * Math.log(p / this.p1)) * this.mToFeet;
        const altL = (this.h0 + ((p / this.p0) ** ((-this.r * this.l0) / (this.g * this.mm)) - 1) * (this.temp0 / this.l0)) * this.mToFeet;
        /*if (!this.altSample) {
            this.alt0 = alt;
            this.t0 = performance.now();
            this.altSample = true;
        }
        else {
            this.alt1 = alt;
            this.t1 = performance.now();
            this.altSample = false;
        }
        if (alt < -1000 || alt > 50000) {
            return this.ncd;
        }*/
        if (p >= 22632) {
            if (!this.altSample) {
                this.alt0 = altL;
                this.t0 = performance.now();
                this.altSample = true;
            }
            else {
                this.alt1 = altL;
                this.t1 = performance.now();
                this.altSample = false;
            }
            if (altL < -1000 || altL > 50000) {
                return this.ncd;
            }
            const alt = altL;
            return alt;
        }
        else {
            if (!this.altSample) {
                this.alt0 = altH;
                this.t0 = performance.now();
                this.altSample = true;
            }
            else {
                this.alt1 = altH;
                this.t1 = performance.now();
                this.altSample = false;
            }
            if (altH < -1000 || altH > 50000) {
                return this.ncd;
            }
            const alt = altH;
            return alt;
        }
    }

    /*calculateBaroCorrAlt(sat, p, baroSetting) {
        const alt = ((this.r * sat) / (this.g * this.mm)) * Math.log(baroSetting / p) * this.mToFeet;
        if (alt < -1000 || alt > 50000) {
            return this.ncd;
        }
        return alt;
    }*/

    calculateBaroCorrAlt(p, baroSetting) {
        const altcorr = ((p / baroSetting) ** ((-this.r * this.l0) / (this.g * this.mm)) - 1) * (this.temp0 / this.l0) * this.mToFeet;
        if (altcorr < -1000 || altcorr > 50000) {
            return this.ncd;
        }
        return altcorr;
    }

    calculateAltRate() {
        const vs = (this.alt1 - this.alt0) / (this.t1 - this.t0) * 60;
        if (vs < -20000 || vs > 20000) {
            return this.ncd;
        }
        return vs * 1000;
    }
}
