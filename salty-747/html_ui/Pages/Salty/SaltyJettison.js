class SaltyJettison {
    constructor() {
        console.log("SaltyJettison loaded");
        this.nozzleValveOpenL = false;
        this.nozzleValveOpenR = false;
        this.jettKnobPos = 2;
        this.mlwFuel = null;
        this.minFuel = null;
        this.jettFuelTarget = null;
        this.MAX_LANDING_WGT_PLUS_3_MG = 315;
        this.JETTISON_RATE_PER_NOZZLE_IN_MG = 0.6;

        this.gallonToMegagrams = null;
        
        this.currentFuelLevel = null;

        this.jettisonActive = false;

        this.TANK_LOWER_LIMS = {
            CENTER: 7.5,
            MAIN_1: 3.2,
            MAIN_2: 8.0,
            MAIN_3: 8.0,
            MAIN_4: 3.2,
            RES_1: 0.9,
            RES_4: 0.9,
            STAB: 2.0
        }


        this.knobPosToAction = {
            2: (knobMoved) => { return;},

            1: (knobMoved) => {
                if (knobMoved) {
                    if (!this.mlwFuel) {
                        let totalWgt = SimVar.GetSimVarValue("TOTAL WEIGHT", "kg") * 0.001;
                        this.mlwFuel = this.currentFuelLevel - (totalWgt - this.MAX_LANDING_WGT_PLUS_3_MG);
                    }
                }

                SimVar.SetSimVarValue("L:747_FUEL_TO_REMAIN", "TYPE_FLOAT64", this.mlwFuel);

                if (this.currentFuelLevel <= this.mlwFuel) {this.jettisonActive = false; return; }

                this.checkFuelPumpsAndJettison();

            },

            0: (knobMoved) => {
                 if (knobMoved) {
                    this.jettFuelTarget = SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * this.gallonToMegagrams;

                    if (!this.minFuel) this.setMinFuel();
                } else {
                    this.jettFuelTarget = SimVar.GetSimVarValue("L:747_FUEL_TO_REMAIN", "TYPE_FLOAT64");
                }


                
                if (this.jettFuelTarget < this.minFuel) this.jettFuelTarget = this.minFuel;
                else if (this.jettFuelTarget > this.currentFuelLevel) this.jettFuelTarget = this.currentFuelLevel;
                

                SimVar.SetSimVarValue("L:747_FUEL_TO_REMAIN", "TYPE_FLOAT64", this.jettFuelTarget);
        
                if (this.currentFuelLevel <= this.jettFuelTarget) {this.jettisonActive = false; return; }

                this.checkFuelPumpsAndJettison();

            },

            3: (knobMoved) => { this.knobPosToAction[1](knobMoved);},
            4: (knobMoved) => { this.knobPosToAction[0](knobMoved);}

        };
    }

    setMinFuel() {
        this.minFuel = 0;

        this.minFuel += Math.min(this.TANK_LOWER_LIMS.CENTER, SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:1", "gallons") * this.gallonToMegagrams);
        this.minFuel += Math.min(this.TANK_LOWER_LIMS.STAB, SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:8", "gallons") * this.gallonToMegagrams);
        this.minFuel += Math.min(this.TANK_LOWER_LIMS.MAIN_1, SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:2", "gallons") * this.gallonToMegagrams);
        this.minFuel += Math.min(this.TANK_LOWER_LIMS.MAIN_2, SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:3", "gallons") * this.gallonToMegagrams);
        this.minFuel += Math.min(this.TANK_LOWER_LIMS.MAIN_3, SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:4", "gallons") * this.gallonToMegagrams);
        this.minFuel += Math.min(this.TANK_LOWER_LIMS.MAIN_4, SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:5", "gallons") * this.gallonToMegagrams);
        this.minFuel += Math.min(this.TANK_LOWER_LIMS.RES_1, SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:6", "gallons") * this.gallonToMegagrams);
        this.minFuel += Math.min(this.TANK_LOWER_LIMS.RES_4, SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:7", "gallons") * this.gallonToMegagrams);
    }

    init() {
        // stub
    }

    update() {
        this.gallonToMegagrams = SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilogram") * 0.001;

        this.nozzleValveOpenL = SimVar.GetSimVarValue("A:FUELSYSTEM VALVE SWITCH:24", "Enum") > 0.5;
        this.nozzleValveOpenR = SimVar.GetSimVarValue("A:FUELSYSTEM VALVE SWITCH:25", "Enum") > 0.5;

        this.currentFuelLevel = SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * this.gallonToMegagrams;

        var newKnobPos = parseInt(SimVar.GetSimVarValue("L:747_JETTISON_KNOB_POS", "Enum"));

        // jett fuel target needs to be moved from here
  
        
        this.knobPosToAction[newKnobPos](this.jettKnobPos !== newKnobPos);

        this.jettKnobPos = newKnobPos;


    }

    checkFuelPumpsAndJettison() {
        //use timer delta to calculate how much fuel to decrease in tank        

        var maxJettisonFlow = 0;
        if (this.nozzleValveOpenL) maxJettisonFlow += this.JETTISON_RATE_PER_NOZZLE_IN_MG;
        if (this.nozzleValveOpenR) maxJettisonFlow += this.JETTISON_RATE_PER_NOZZLE_IN_MG;
        if (!maxJettisonFlow) {this.jettisonActive = false; return; }


        // this is where the fuel drain order and imbalance correction logic begins
        var m2Level = SimVar.GetSimVarValue("FUEL TANK LEFT MAIN QUANTITY", "gallons") * this.gallonToMegagrams;
        var m3Level = SimVar.GetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "gallons") * this.gallonToMegagrams;
        var innerMainImbalance = m2Level - m3Level;
        var m2MaxChange = m2Level - this.TANK_LOWER_LIMS.MAIN_2;
        var m3MaxChange = m3Level - this.TANK_LOWER_LIMS.MAIN_3;

        var centerLevel = SimVar.GetSimVarValue("FUEL TANK CENTER QUANTITY", "gallons") * this.gallonToMegagrams;
        var centreMaxChange = centerLevel - this.TANK_LOWER_LIMS.CENTER;

        var m1Level = SimVar.GetSimVarValue("FUEL TANK LEFT AUX QUANTITY", "gallons") * this.gallonToMegagrams;
        var m4Level = SimVar.GetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "gallons") * this.gallonToMegagrams;
        var outerMainImbalance = m1Level - m4Level;
        var m1MaxChange = m1Level - this.TANK_LOWER_LIMS.MAIN_1;
        var m4MaxChange = m4Level - this.TANK_LOWER_LIMS.MAIN_4;

        var stabLevel = SimVar.GetSimVarValue("FUEL TANK CENTRE2 QUANTITY", "gallons") * this.gallonToMegagrams;
        var stabMaxChange = stabLevel - this.TANK_LOWER_LIMS.STAB;

        var r1Level = SimVar.GetSimVarValue("FUEL TANK LEFT TIP QUANTITY", "gallons") * this.gallonToMegagrams;
        var r4Level = SimVar.GetSimVarValue("FUEL TANK RIGHT TIP QUANTITY", "gallons") * this.gallonToMegagrams;
        var reservesImbalance = r1Level - r4Level;
        var r1MaxChange = r1Level - this.TANK_LOWER_LIMS.RES_1;
        var r4MaxChange = r4Level - this.TANK_LOWER_LIMS.RES_4;


    }


    

}
