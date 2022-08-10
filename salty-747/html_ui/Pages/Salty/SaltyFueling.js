const REFUEL_FACTOR = 2;
const CENTER_MODIFIER = 3;

class SaltyFueling {
    constructor() {}

    defuelTank(multiplier) {
        return -REFUEL_FACTOR * multiplier;
    }

    refuelTank(multiplier) {
        return REFUEL_FACTOR * multiplier;
    }

    update(_deltaTime) {
        /* Fuel current sim vars */
        const main1CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK LEFT AUX QUANTITY", "Gallons");
        const main2CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK LEFT MAIN QUANTITY", "Gallons");
        const main3CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "Gallons");
        const main4CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK RIGHT AUX QUANTITY", "Gallons");
        const res1CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK LEFT TIP QUANTITY", "Gallons");
        const res2CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK RIGHT TIP QUANTITY", "Gallons");
        const centerCurrentSimVar = SimVar.GetSimVarValue("FUEL TANK CENTER QUANTITY", "Gallons");
        const stabCurrentSimVar = SimVar.GetSimVarValue("FUEL TANK CENTER2 QUANTITY", "Gallons");

        const refuelStartedByUser = SimVar.GetSimVarValue("L:747_FUELING_STARTED_BY_USR", "Bool");
        const isOnGround = SimVar.GetSimVarValue("SIM ON GROUND", "Bool");
        const refuelingRate = SaltyDataStore.get("747_REFUEL_RATE_SETTING", "REAL");
        if (!refuelStartedByUser) {
            return;
        }
        if (
            (!SaltyFueling.airplaneCanFuel() && refuelingRate == "REAL") ||
            (!SaltyFueling.airplaneCanFuel() && refuelingRate == "FAST") ||
            (refuelingRate == "INSTANT" && !isOnGround)
        ) {
            return;
        }

        /* Fuel target sim vars */
        const main1TargetSimVar = SimVar.GetSimVarValue(`L:747_FUEL_TANK_LEFT_AUX_QUANTITY_DESIRED`, "Gallons");
        const main2TargetSimVar = SimVar.GetSimVarValue(`L:747_FUEL_TANK_LEFT_MAIN_QUANTITY_DESIRED`, "Gallons");
        const main3TargetSimVar = SimVar.GetSimVarValue(`L:747_FUEL_TANK_RIGHT_MAIN_QUANTITY_DESIRED`, "Gallons");
        const main4TargetSimVar = SimVar.GetSimVarValue(`L:747_FUEL_TANK_RIGHT_AUX_QUANTITY_DESIRED`, "Gallons");
        const res1TargetSimVar = SimVar.GetSimVarValue(`L:747_FUEL_TANK_LEFT_TIP_QUANTITY_DESIRED`, "Gallons");
        const res2TargetSimVar = SimVar.GetSimVarValue(`L:747_FUEL_TANK_RIGHT_TIP_QUANTITY_DESIRED`, "Gallons");
        const centerTargetSimVar = SimVar.GetSimVarValue(`L:747_FUEL_TANK_CENTER_QUANTITY_DESIRED`, "Gallons");
        const stabTargetSimVar = SimVar.GetSimVarValue(`L:747_FUEL_TANK_CENTER2_QUANTITY_DESIRED`, "Gallons");
        let main1Current = main1CurrentSimVar;
        let main2Current = main2CurrentSimVar;
        let main3Current = main3CurrentSimVar;
        let main4Current = main4CurrentSimVar;
        let res1Current = res1CurrentSimVar;
        let res2Current = res2CurrentSimVar;
        let centerCurrent = centerCurrentSimVar;
        let stabCurrent = stabCurrentSimVar;
        let main1Target = main1TargetSimVar;
        let main2Target = main2TargetSimVar;
        let main3Target = main3TargetSimVar;
        let main4Target = main4TargetSimVar;
        let res1Target = res1TargetSimVar;
        let res2Target = res2TargetSimVar;
        let centerTarget = centerTargetSimVar;
        let stabTarget = stabTargetSimVar;

        if (refuelingRate == "INSTANT") {
            SimVar.SetSimVarValue("FUEL TANK LEFT AUX QUANTITY", "Gallons", main1Target);
            SimVar.SetSimVarValue("FUEL TANK LEFT MAIN QUANTITY", "Gallons", main2Target);
            SimVar.SetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "Gallons", main3Target);
            SimVar.SetSimVarValue("FUEL TANK RIGHT AUX QUANTITY", "Gallons", main4Target);
            SimVar.SetSimVarValue("FUEL TANK LEFT TIP QUANTITY", "Gallons", res1Target);
            SimVar.SetSimVarValue("FUEL TANK RIGHT TIP QUANTITY", "Gallons", res2Target);
            SimVar.SetSimVarValue("FUEL TANK CENTER QUANTITY", "Gallons", centerTarget);
            SimVar.SetSimVarValue("FUEL TANK CENTER2 QUANTITY", "Gallons", stabTarget);
            SimVar.SetSimVarValue("L:747_FUELING_STARTED_BY_USR", "Bool", false);
            return;
        }
        let multiplier = 1;
        if (refuelingRate == "FAST") {
            multiplier = 3;
        }
        //DEFUELING (order is STAB, CENTER, RES, MAIN)
        /* Stab */
        if (stabCurrent > stabTarget) {
            stabCurrent += this.defuelTank(multiplier);
            if (stabCurrent < stabTarget) {
                stabCurrent = stabTarget;
            }
            SimVar.SetSimVarValue("FUEL TANK CENTER2 QUANTITY", "Gallons", stabCurrent);
            if (stabCurrent != stabTarget) {
                return;
            }
        }
        /* Center */
        if (centerCurrent > centerTarget) {
            centerCurrent += this.defuelTank(multiplier);
            if (centerCurrent < centerTarget) {
                centerCurrent = centerTarget;
            }
            SimVar.SetSimVarValue("FUEL TANK CENTER QUANTITY", "Gallons", centerCurrent);
            if (centerCurrent != centerTarget) {
                return;
            }
        }
        /* Res */
        if (res1Current > res1Target || res2Current > res2Target) {
            res1Current += this.defuelTank(multiplier) / 2;
            res2Current += this.defuelTank(multiplier) / 2;
            if (res1Current < res1Target) {
                res1Current = res1Target;
            }
            if (res2Current < res2Target) {
                res2Current = res2Target;
            }
            SimVar.SetSimVarValue("FUEL TANK LEFT TIP QUANTITY", "Gallons", res1Current);
            SimVar.SetSimVarValue("FUEL TANK RIGHT TIP QUANTITY", "Gallons", res2Current);
            if (res1Current != res1Target || res2Current != res2Target) {
                return;
            }
        }
        /* Main 2 and 3 */
        if (main2Current > main2Target || main3Current > main3Target) {
            main2Current += this.defuelTank(multiplier) / 2;
            main3Current += this.defuelTank(multiplier) / 2;
            if (main2Current < main2Target) {
                main2Current = main2Target;
            }
            if (main3Current < main3Target) {
                main3Current = main3Target;
            }
            SimVar.SetSimVarValue("FUEL TANK LEFT MAIN QUANTITY", "Gallons", main2Current);
            SimVar.SetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "Gallons", main3Current);
            if (main2Current != main2Target || main3Current != main3Target) {
                return;
            }
        }
        /* Main 1 and 4 */
        if (main1Current > main1Target || main4Current > main4Target) {
            main1Current += this.defuelTank(multiplier) / 2;
            main4Current += this.defuelTank(multiplier) / 2;
            if (main1Current < main1Target) {
                main1Current = main1Target;
            }
            if (main4Current < main4Target) {
                main4Current = main4Target;
            }
            SimVar.SetSimVarValue("FUEL TANK LEFT AUX QUANTITY", "Gallons", main1Current);
            SimVar.SetSimVarValue("FUEL TANK RIGHT AUX QUANTITY", "Gallons", main4Current);
            if (main1Current != main1Target || main4Current != main4Target) {
                return;
            }
        }

        // REFUELING (order is MAIN, RES, CENTER, STAB)
        /* Main 1 and 4 */
        if (main1Current < main1Target || main4Current < main4Target) {
            main1Current += this.refuelTank(multiplier) / 2;
            main4Current += this.refuelTank(multiplier) / 2;
            if (main1Current > main1Target) {
                main1Current = main1Target;
            }
            if (main4Current > main4Target) {
                main4Current = main4Target;
            }
            SimVar.SetSimVarValue("FUEL TANK LEFT AUX QUANTITY", "Gallons", main1Current);
            SimVar.SetSimVarValue("FUEL TANK RIGHT AUX QUANTITY", "Gallons", main4Current);
            if (main1Current != main1Target || main4Current != main4Target) {
                return;
            }
        }
        /* Main 2 and 3 */
        if (main2Current < main2Target || main3Current < main3Target) {
            main2Current += this.refuelTank(multiplier) / 2;
            main3Current += this.refuelTank(multiplier) / 2;
            if (main2Current > main2Target) {
                main2Current = main2Target;
            }
            if (main3Current > main3Target) {
                main3Current = main3Target;
            }
            SimVar.SetSimVarValue("FUEL TANK LEFT MAIN QUANTITY", "Gallons", main2Current);
            SimVar.SetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "Gallons", main3Current);
            if (main2Current != main2Target || main3Current != main3Target) {
                return;
            }
        }
        /* Res */
        if (res1Current < res1Target || res2Current < res2Target) {
            res1Current += this.refuelTank(multiplier) / 2;
            res2Current += this.refuelTank(multiplier) / 2;
            if (res1Current > res1Target) {
                res1Current = res1Target;
            }
            if (res2Current > res2Target) {
                res2Current = res2Target;
            }
            SimVar.SetSimVarValue("FUEL TANK LEFT TIP QUANTITY", "Gallons", res1Current);
            SimVar.SetSimVarValue("FUEL TANK RIGHT TIP QUANTITY", "Gallons", res2Current);
            if (res1Current != res1Target || res2Current != res2Target) {
                return;
            }
        }
        /* Center */
        if (centerCurrent < centerTarget) {
            centerCurrent += this.refuelTank(multiplier);
            if (centerCurrent > centerTarget) {
                centerCurrent = centerTarget;
            }
            SimVar.SetSimVarValue("FUEL TANK CENTER QUANTITY", "Gallons", centerCurrent);
            if (centerCurrent != centerTarget) {
                return;
            }
        }
        /* Center */
        if (stabCurrent < stabTarget) {
            stabCurrent += this.refuelTank(multiplier);
            if (stabCurrent > stabTarget) {
                stabCurrent = stabTarget;
            }
            SimVar.SetSimVarValue("FUEL TANK CENTER QUANTITY", "Gallons", stabCurrent);
            if (stabCurrent != stabTarget) {
                return;
            }
        }

        // Done fueling
        SimVar.SetSimVarValue("L:747_FUELING_STARTED_BY_USR", "Bool", false);
    }

    static airplaneCanFuel() {
        const gs = SimVar.GetSimVarValue("GPS GROUND SPEED", "knots");
        const isOnGround = SimVar.GetSimVarValue("SIM ON GROUND", "Bool");
        const eng1Running = SimVar.GetSimVarValue("ENG COMBUSTION:1", "Bool");
        const eng2Running = SimVar.GetSimVarValue("ENG COMBUSTION:2", "Bool");
        const eng3Running = SimVar.GetSimVarValue("ENG COMBUSTION:3", "Bool");
        const eng4Running = SimVar.GetSimVarValue("ENG COMBUSTION:4", "Bool");

        return !(gs > 0.1 || eng1Running || eng2Running || eng3Running || eng4Running || !isOnGround);
    }
}