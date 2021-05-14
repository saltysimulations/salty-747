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
            CENTER: 1.0,
            MAIN_1: 8.0,
            MAIN_2: 16.0,
            MAIN_3: 16.0,
            MAIN_4: 8.0,
            RES_1: 0.2,
            RES_4: 0.2,
            STAB: 0.4
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

                if (this.currentFuelLevel <= this.mlwFuel) {this.jettisonActive = false; return false; }

                this.checkFuelPumpsAndJettison();

                return true;

            },

            0: (knobMoved) => {
                 if (knobMoved) {
                    this.jettFuelTarget = SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * this.gallonToMegagrams;
                } else {
                    this.jettFuelTarget = SimVar.GetSimVarValue("L:747_FUEL_TO_REMAIN", "TYPE_FLOAT64");
                }

                
                if (this.jettFuelTarget < this.minFuel) this.jettFuelTarget = this.minFuel;
                else if (this.jettFuelTarget > this.currentFuelLevel) this.jettFuelTarget = this.currentFuelLevel;
                

                SimVar.SetSimVarValue("L:747_FUEL_TO_REMAIN", "TYPE_FLOAT64", this.jettFuelTarget);
        
                if (this.currentFuelLevel <= this.jettFuelTarget) {this.jettisonActive = false; return false; }

                this.checkFuelPumpsAndJettison();

                return true;

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

        this.setMinFuel();

        var newKnobPos = parseInt(SimVar.GetSimVarValue("L:747_JETTISON_KNOB_POS", "Enum"));

        // jett fuel target needs to be moved from here
  
        let publishL = 0;
        let publishR = 0;

        if (this.knobPosToAction[newKnobPos](this.jettKnobPos !== newKnobPos)) {
            if (this.nozzleValveOpenL) publishL = 1;
            if (this.nozzleValveOpenR) publishR = 1;
        }       

        this.jettKnobPos = newKnobPos;

        SimVar.SetSimVarValue("L:SALTY_FUEL_JETTISON_ACTIVE_L", "Enum", publishL);
        SimVar.SetSimVarValue("L:SALTY_FUEL_JETTISON_ACTIVE_R", "Enum", publishR);


    }

    checkFuelPumpsAndJettison() {
        //use timer delta to calculate how much fuel to decrease in tank        

        var maxJettisonFlow = 0;
        if (this.nozzleValveOpenL) maxJettisonFlow += this.JETTISON_RATE_PER_NOZZLE_IN_MG;
        if (this.nozzleValveOpenR) maxJettisonFlow += this.JETTISON_RATE_PER_NOZZLE_IN_MG;
        if (!maxJettisonFlow) {this.jettisonActive = false; return; }

        //ADD DELTA TIME IN HERE!!!!
        var remainingFlow = maxJettisonFlow * 0.04; // * delta time
        var changeOccured = 0;

        
        const balancingJettison = (_leftTankLevel, _rightTankLevel, _leftTankLowerLim, _rightTankLowerLim, _remainingFlow) => {
            let changedTankLevels = 0;
            let flow = 0;
            let imbalance = _leftTankLevel - _rightTankLevel;
            let lRemainingChange = Math.max(_leftTankLevel - _leftTankLowerLim, 0)
            let rRemainingChange = Math.max(_rightTankLevel - _rightTankLowerLim, 0);

            // IF significant imbalance use fuel imbalance to set prelim val to drain more from heavier tank
            // drain that from the heavier tank within the max change, then set new max change values, imbalance and level values
            if (imbalance >= 0.1) {
                flow = Math.min(imbalance, lRemainingChange, _remainingFlow);

                _leftTankLevel -= flow;
                imbalance -= flow;
                _remainingFlow -= flow;
                lRemainingChange -= flow;

                changedTankLevels = 1;
            } else if (imbalance <= -0.1) {
                imbalance *= -1;
                flow = Math.min(imbalance, rRemainingChange, _remainingFlow);

                _rightTankLevel -= flow;
                imbalance -= flow;
                _remainingFlow -= flow;
                rRemainingChange -= flow;

                changedTankLevels = 1;
            }

            if (imbalance < 0.1 || imbalance > -0.1 && _remainingFlow) {
                flow = Math.min(lRemainingChange, rRemainingChange, _remainingFlow / 2);

                _rightTankLevel -= flow;
                _leftTankLevel -= flow;
                _remainingFlow -= flow;

                changedTankLevels = 1;
            }

            return [_leftTankLevel, _rightTankLevel, _remainingFlow, changedTankLevels];
        };

        const singleTankJettison = (_tankLevel, _tankLowerLim, _remainingFlow) => {
            let changedTankLevels = 0;
            let flow = 0;
            let remainingChange = Math.max(_tankLevel - _tankLowerLim, 0)

            if (_remainingFlow) {
                flow = Math.min(remainingChange, _remainingFlow);

                _tankLevel -= flow;
                _remainingFlow -= flow;

                changedTankLevels = 1;
            }

            return [_tankLevel, _remainingFlow, changedTankLevels];
        };


        // this is where the fuel drain order and imbalance correction logic begins

        var m2Level = SimVar.GetSimVarValue("FUEL TANK LEFT MAIN QUANTITY", "gallons") * this.gallonToMegagrams;
        var m3Level = SimVar.GetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "gallons") * this.gallonToMegagrams;        
        [m2Level, m3Level, remainingFlow, changeOccured] = balancingJettison(m2Level, m3Level, this.TANK_LOWER_LIMS.MAIN_2, this.TANK_LOWER_LIMS.MAIN_3, remainingFlow);
        if (changeOccured) {
            SimVar.SetSimVarValue("FUEL TANK LEFT MAIN QUANTITY", "gallons", m2Level / this.gallonToMegagrams);
            SimVar.SetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "gallons", m3Level / this.gallonToMegagrams);
            changeOccured = 0;
        }
        if (!remainingFlow) return;

        var centerLevel = SimVar.GetSimVarValue("FUEL TANK CENTER QUANTITY", "gallons") * this.gallonToMegagrams;
        [centerLevel, remainingFlow, changeOccured] = singleTankJettison(centerLevel, this.TANK_LOWER_LIMS.CENTER, remainingFlow);
        if (changeOccured) {
            SimVar.SetSimVarValue("FUEL TANK CENTER QUANTITY", "gallons", centerLevel / this.gallonToMegagrams);
            changeOccured = 0;
        }
        if (!remainingFlow) return;

        var m1Level = SimVar.GetSimVarValue("FUEL TANK LEFT AUX QUANTITY", "gallons") * this.gallonToMegagrams;
        var m4Level = SimVar.GetSimVarValue("FUEL TANK RIGHT AUX QUANTITY", "gallons") * this.gallonToMegagrams;
        [m1Level, m4Level, remainingFlow, changeOccured] = balancingJettison(m1Level, m4Level, this.TANK_LOWER_LIMS.MAIN_1, this.TANK_LOWER_LIMS.MAIN_4, remainingFlow);
        if (changeOccured) {
            SimVar.SetSimVarValue("FUEL TANK LEFT AUX QUANTITY", "gallons", m1Level / this.gallonToMegagrams);
            SimVar.SetSimVarValue("FUEL TANK RIGHT AUX QUANTITY", "gallons", m4Level / this.gallonToMegagrams);
            changeOccured = 0;
        }
        if (!remainingFlow) return;

        var stabLevel = SimVar.GetSimVarValue("FUEL TANK CENTER2 QUANTITY", "gallons") * this.gallonToMegagrams;
        [stabLevel, remainingFlow, changeOccured] = singleTankJettison(stabLevel, this.TANK_LOWER_LIMS.STAB, remainingFlow);
        if (changeOccured) {
            SimVar.SetSimVarValue("FUEL TANK CENTER2 QUANTITY", "gallons", stabLevel / this.gallonToMegagrams);
            changeOccured = 0;
        }
        if (!remainingFlow) return;        

        var r1Level = SimVar.GetSimVarValue("FUEL TANK LEFT TIP QUANTITY", "gallons") * this.gallonToMegagrams;
        var r4Level = SimVar.GetSimVarValue("FUEL TANK RIGHT TIP QUANTITY", "gallons") * this.gallonToMegagrams;
        [r1Level, r4Level, remainingFlow, changeOccured] = balancingJettison(r1Level, r4Level, this.TANK_LOWER_LIMS.RES_1, this.TANK_LOWER_LIMS.RES_4, remainingFlow);
        if (changeOccured) {
            SimVar.SetSimVarValue("FUEL TANK LEFT TIP QUANTITY", "gallons", r1Level / this.gallonToMegagrams);
            SimVar.SetSimVarValue("FUEL TANK RIGHT TIP QUANTITY", "gallons", r4Level / this.gallonToMegagrams);
        }        
    }


    

}
