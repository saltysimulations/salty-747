class SaltyJettison {
    constructor() {
        console.log("SaltyJettison loaded");
        this.nozzleValveOpenL = false;
        this.nozzleValveOpenR = false;
        this.jettKnobPos = 2;
        this.saltyMLWFuel = null;
        this.jettFuelTarget = null;
        this.MAX_LANDING_WGT_PLUS_3_TON = 315;
        this.JETTISON_RATE_PER_NOZZLE_IN_TON = 0.9;

        this.knobPosToAction = {
            2: (knobMoved) => { return;},

            1: (knobMoved) => {
                if (knobMoved && !this.saltyMLWFuel) {
                    let totalWgt = SimVar.GetSimVarValue("TOTAL WEIGHT", "kg") * 0.001;
                    this.saltyMLWFuel = SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilogram") * 0.001 - (totalWgt - this.MAX_LANDING_WGT_PLUS_3_TON);                    
                }

                SimVar.SetSimVarValue("L:747_FUEL_TO_REMAIN", "TYPE_FLOAT64", this.saltyMLWFuel);

                // if fuel level less than or equal to MLW_FUEL+3 return here
                // (ALSO minimum jett level)


                //if (this.nozzleValveOpenL) this.flowFuelNozzleL(mlwFuel);
                //if (this.nozzleValveOpenR) this.flowFuelNozzleR(mlwFuel);  
            },

            0: (knobMoved) => {
                 if (knobMoved) {
                    this.jettFuelTarget = SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilogram") * 0.001;
                    SimVar.SetSimVarValue("L:747_FUEL_TO_REMAIN", "TYPE_FLOAT64", this.jettFuelTarget);
                } 
                            
                // if fuel level less than or equal to jettFuelTarget return here
                // (ALSO minimum jett level)

                //if (this.nozzleValveOpenL) this.flowFuelNozzleL(jettFuelTarget);
                //if (this.nozzleValveOpenR) this.flowFuelNozzleR(jettFuelTarget); 
            },
            3: (knobMoved) => { this.knobPosToAction[1](knobMoved);},
            4: (knobMoved) => { this.knobPosToAction[0](knobMoved);},

        };
    }

    init() {
        // stub
    }

    update() {
        this.nozzleValveOpenL = SimVar.GetSimVarValue("A:FUELSYSTEM VALVE SWITCH:24", "Enum") > 0.5;
        this.nozzleValveOpenR = SimVar.GetSimVarValue("A:FUELSYSTEM VALVE SWITCH:25", "Enum") > 0.5;

        var newKnobPos = parseInt(SimVar.GetSimVarValue("L:747_JETTISON_KNOB_POS", "Enum"));

        // jett fuel target needs to be moved from here
  
        
        this.knobPosToAction[newKnobPos](this.jettKnobPos !== newKnobPos);

        this.jettKnobPos = newKnobPos;


    }

    flowFuelNozzleL() {
        //use timer delta to calculate how much fuel to decrease in tank
    }

    flowFuelNozzleR() {
        //use timer delta to calculate how much fuel to decrease in tank
    }

    

}
