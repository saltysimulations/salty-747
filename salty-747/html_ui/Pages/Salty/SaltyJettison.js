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
        this.JETTISON_RATE_PER_NOZZLE_IN_MG_PER_MIN = 0.6;

        this.lastTime = null;
        this.deltaTime = null;

        this.gallonToMegagrams = null;

        this.currentFuelLevel = null;

        this.TANK_LOWER_LIMS = {
            CENTER: 1.0,
            MAIN_1: 8.0,
            MAIN_2: 16.0,
            MAIN_3: 16.0,
            MAIN_4: 8.0,
            RES_1: 0.2,
            RES_4: 0.2,
            STAB: 0.4,
        };

        this.knobPosToAction = {
            2: (knobMoved) => {
                return false;
            },

            1: (knobMoved) => {
                if (knobMoved) {
                    let totalWgt = SimVar.GetSimVarValue("TOTAL WEIGHT", "kg") * 0.001;
                    this.mlwFuel = this.currentFuelLevel - (totalWgt - this.MAX_LANDING_WGT_PLUS_3_MG);
                }

                SimVar.SetSimVarValue("L:747_FUEL_TO_REMAIN", "TYPE_FLOAT64", this.mlwFuel);

                if (this.currentFuelLevel <= this.mlwFuel) {
                    return false;
                }

                this.runJettison(true);
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

                if (this.currentFuelLevel <= this.jettFuelTarget) {
                    return false;
                }

                this.runJettison(false);
                return true;
            },

            3: (knobMoved) => {
                return this.knobPosToAction[1](knobMoved);
            },
            4: (knobMoved) => {
                return this.knobPosToAction[0](knobMoved);
            },
        };
    }

    setMinFuel() {
        this.minFuel = 0;

        this.minFuel += Math.min(
            this.TANK_LOWER_LIMS.CENTER,
            SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:1", "gallons") * this.gallonToMegagrams
        );
        this.minFuel += Math.min(this.TANK_LOWER_LIMS.STAB, SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:8", "gallons") * this.gallonToMegagrams);
        this.minFuel += Math.min(
            this.TANK_LOWER_LIMS.MAIN_1,
            SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:2", "gallons") * this.gallonToMegagrams
        );
        this.minFuel += Math.min(
            this.TANK_LOWER_LIMS.MAIN_2,
            SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:3", "gallons") * this.gallonToMegagrams
        );
        this.minFuel += Math.min(
            this.TANK_LOWER_LIMS.MAIN_3,
            SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:4", "gallons") * this.gallonToMegagrams
        );
        this.minFuel += Math.min(
            this.TANK_LOWER_LIMS.MAIN_4,
            SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:5", "gallons") * this.gallonToMegagrams
        );
        this.minFuel += Math.min(this.TANK_LOWER_LIMS.RES_1, SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:6", "gallons") * this.gallonToMegagrams);
        this.minFuel += Math.min(this.TANK_LOWER_LIMS.RES_4, SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:7", "gallons") * this.gallonToMegagrams);
    }

    init() {
        // stub
    }

    update() {
        this.gallonToMegagrams = SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilogram") * 0.001;

        this.nozzleValveOpenL = SimVar.GetSimVarValue("A:FUELSYSTEM VALVE SWITCH:24", "Enum") > 0;
        this.nozzleValveOpenR = SimVar.GetSimVarValue("A:FUELSYSTEM VALVE SWITCH:25", "Enum") > 0;

        this.currentFuelLevel = SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * this.gallonToMegagrams;

        this.setMinFuel();

        // Calculate deltatime
        var timeNow = Date.now();
        if (this.lastTime == null) this.lastTime = timeNow;
        this.deltaTime = (timeNow - this.lastTime) / 1000;
        this.lastTime = timeNow;

        var newKnobPos = parseInt(SimVar.GetSimVarValue("L:747_JETTISON_KNOB_POS", "Enum"));

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
        var jettisonRateToFlow = (this.JETTISON_RATE_PER_NOZZLE_IN_MG_PER_MIN * this.deltaTime) / 60;
        if (this.nozzleValveOpenL) maxJettisonFlow += jettisonRateToFlow;
        if (this.nozzleValveOpenR) maxJettisonFlow += jettisonRateToFlow;
        if (!maxJettisonFlow) {
            return maxJettisonFlow;
        }

        var remainingFlow = maxJettisonFlow;

        const balancingJettison = (_leftTankLevel, _rightTankLevel, _leftTankLowerLim, _rightTankLowerLim, _remainingFlow) => {
            let changedTankLevels = 0;
            let flow = 0;
            let imbalance = _leftTankLevel - _rightTankLevel;
            let lRemainingChange = Math.max(_leftTankLevel - _leftTankLowerLim, 0);
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

            if (imbalance < 0.1 && imbalance > -0.1 && _remainingFlow) {
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
            let remainingChange = Math.max(_tankLevel - _tankLowerLim, 0);

            if (_remainingFlow) {
                flow = Math.min(remainingChange, _remainingFlow);

                _tankLevel -= flow;
                _remainingFlow -= flow;

                changedTankLevels = 1;
            }

            return [_tankLevel, _remainingFlow, changedTankLevels];
        };

        const jettisonStage = (_simVars, _lowerLims, _remainingFlow) => {
            let changeOccured = 0;
            let tankLevels = [];

            if (_lowerLims.length === 2 && _simVars.length === 2) {
                tankLevels[0] = SimVar.GetSimVarValue(_simVars[0], "gallons") * this.gallonToMegagrams;
                tankLevels[1] = SimVar.GetSimVarValue(_simVars[1], "gallons") * this.gallonToMegagrams;

                [tankLevels[0], tankLevels[1], _remainingFlow, changeOccured] = balancingJettison(
                    tankLevels[0],
                    tankLevels[1],
                    _lowerLims[0],
                    _lowerLims[1],
                    _remainingFlow
                );

                if (changeOccured) {
                    SimVar.SetSimVarValue(_simVars[0], "gallons", tankLevels[0] / this.gallonToMegagrams);
                    SimVar.SetSimVarValue(_simVars[1], "gallons", tankLevels[1] / this.gallonToMegagrams);
                }
            } else if (_lowerLims.length === 1 && _simVars.length === 1) {
                tankLevels[0] = SimVar.GetSimVarValue(_simVars[0], "gallons") * this.gallonToMegagrams;

                [tankLevels[0], _remainingFlow, changeOccured] = singleTankJettison(tankLevels[0], _lowerLims[0], _remainingFlow);
                if (changeOccured) {
                    SimVar.SetSimVarValue(_simVars[0], "gallons", tankLevels[0] / this.gallonToMegagrams);
                }
            }

            return _remainingFlow;
        };

        // The order in which jettison drains the fuel tanks:
        var centreLim;
        if (SimVar.GetSimVarValue("FUELSYSTEM PUMP ACTIVE:1", "Bool") || SimVar.GetSimVarValue("FUELSYSTEM PUMP ACTIVE:2", "Bool"))
            centreLim = this.TANK_LOWER_LIMS.CENTER;
        else centreLim = 10000;
        remainingFlow = jettisonStage(["FUEL TANK CENTER QUANTITY"], [centreLim], remainingFlow);
        if (!remainingFlow) return maxJettisonFlow;

        var stabLim;
        if (SimVar.GetSimVarValue("FUELSYSTEM PUMP ACTIVE:15", "Bool") || SimVar.GetSimVarValue("FUELSYSTEM PUMP ACTIVE:16", "Bool"))
            stabLim = this.TANK_LOWER_LIMS.STAB;
        else stabLim = 10000;
        remainingFlow = jettisonStage(["FUEL TANK CENTER2 QUANTITY"], [stabLim], remainingFlow);
        if (!remainingFlow) return maxJettisonFlow;

        var res1Lim, main1Lim, main2Lim;
        if (SimVar.GetSimVarValue("FUELSYSTEM PUMP ACTIVE:7", "Bool") && SimVar.GetSimVarValue("FUELSYSTEM PUMP ACTIVE:8", "Bool")) {
            res1Lim = this.TANK_LOWER_LIMS.RES_1;
            main1Lim = this.TANK_LOWER_LIMS.MAIN_1;
            main2Lim = this.TANK_LOWER_LIMS.MAIN_2;
        } else {
            res1Lim = 10000;
            main1Lim = 10000;
            main2Lim = 10000;
        }

        var res4Lim, main3Lim, main4Lim;
        if (SimVar.GetSimVarValue("FUELSYSTEM PUMP ACTIVE:11", "Bool") && SimVar.GetSimVarValue("FUELSYSTEM PUMP ACTIVE:12", "Bool")) {
            res4Lim = this.TANK_LOWER_LIMS.RES_4;
            main3Lim = this.TANK_LOWER_LIMS.MAIN_3;
            main4Lim = this.TANK_LOWER_LIMS.MAIN_4;
        } else {
            res4Lim = 10000;
            main3Lim = 10000;
            main4Lim = 10000;
        }

        remainingFlow = jettisonStage(["FUEL TANK LEFT TIP QUANTITY", "FUEL TANK RIGHT TIP QUANTITY"], [res1Lim, res4Lim], remainingFlow);
        if (!remainingFlow) return maxJettisonFlow;

        remainingFlow = jettisonStage(["FUEL TANK LEFT MAIN QUANTITY", "FUEL TANK RIGHT MAIN QUANTITY"], [main2Lim, main3Lim], remainingFlow);
        if (!remainingFlow) return maxJettisonFlow;

        remainingFlow = jettisonStage(["FUEL TANK LEFT AUX QUANTITY", "FUEL TANK RIGHT AUX QUANTITY"], [main1Lim, main4Lim], remainingFlow);
        if (!remainingFlow) return maxJettisonFlow;

        return maxJettisonFlow - remainingFlow;
    }

    runJettison(jettType) {
        var flowChanged = this.checkFuelPumpsAndJettison();

        var flowRatePerMin = (flowChanged / this.deltaTime) * 60;

        if (flowRatePerMin <= 0.000001) {
            SimVar.SetSimVarValue("L:SALTY_JETTISON_MIN_REMAINING", "TYPE_FLOAT64", 999);
            return;
        }

        flowRatePerMin *= 1.4;

        var minRemaining;
        if (jettType) minRemaining = (this.currentFuelLevel - this.mlwFuel) / flowRatePerMin;
        else minRemaining = (this.currentFuelLevel - this.jettFuelTarget) / flowRatePerMin;

        SimVar.SetSimVarValue("L:SALTY_JETTISON_MIN_REMAINING", "TYPE_FLOAT64", Math.min(minRemaining, 999));

        return;
    }
}
