class FMC_Fuel {
    static ShowPage(fmc) {
        fmc.clearDisplay();

        const updateView = () => {
            FMC_Fuel.ShowPage(fmc);
        };

        fmc.refreshPageCallback = () => {
            updateView();
        };

        SimVar.SetSimVarValue("L:FMC_UPDATE_CURRENT_PAGE", "number", 1);

        const refuelStartedByUser = SimVar.GetSimVarValue("L:747_FUELING_STARTED_BY_USR", "Bool");
        const refuelingRate = SaltyDataStore.get("747_REFUEL_RATE_SETTING", "REAL");

        const grossWeight = (SimVar.GetSimVarValue("TOTAL WEIGHT", SaltyUnits.userWeightUnit().toLowerCase()) * 0.001).toFixed(1);

        const gallonToMegagrams = SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", SaltyUnits.userWeightUnit().toLowerCase()) * 0.001;
        const currentFuel = (SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * gallonToMegagrams).toFixed(1);
        const targetFuel = (SimVar.GetSimVarValue("L:747_FUEL_DESIRED", "number") * 0.001).toFixed(1);

        const targetFuelText = targetFuel <= 0.01 ? "□□□.□" : `${targetFuel}{small}${SaltyUnits.userWeightUnit()}`;

        fmc.setTemplate([
            ["FUEL"],
            ["\xa0ACT FUEL", "SEL FUEL"],
            [`${currentFuel}{small}${SaltyUnits.userWeightUnit()}`, targetFuelText],
            ["\xa0GROSS WT", "REFUEL"],
            [`${grossWeight}{small}${SaltyUnits.userWeightUnit()}`, refuelStartedByUser ? "STOP>" : "START>"],
            ["\xa0CG"],
            [`${(SimVar.GetSimVarValue("CG PERCENT", "percent over 100") * 100).toFixed(1).toString()}%`],
            [""],
            ["", ""],
            ["", "OFP REQUEST"],
            [, FMC_Fuel.ofpRequestText],
            ["\xa0RETURN TO", "REFUEL RATE"],
            ["<OPTIONS", `${SaltyDataStore.get("747_REFUEL_RATE_SETTING", "REAL")}>`],
        ]);

        fmc.onRightInput[0] = () => {
            let value = fmc.inOut;
            if (value) {
                value = parseFloat(value);

                if (SaltyUnits.userToKg(value) <= 191.06) {
                    value = Math.round(value * 1000);
                }

                if (value >= 0 && SaltyUnits.userToKg(value) <= 191060) {
                    setDesiredFuel(fmc, updateView, SaltyUnits.userToKg(value));
                    fmc.clearUserInput();
                } else fmc.showErrorMessage("NOT ALLOWED");
            }
        };

        fmc.onRightInput[1] = () => {
            if (refuelingRate !== "INSTANT" && !SaltyFueling.airplaneCanFuel()) {
                fmc.showErrorMessage("FUELING NOT AVAILABLE");
            } else {
                SimVar.SetSimVarValue("L:747_FUELING_STARTED_BY_USR", "Bool", !refuelStartedByUser);
            }
        };

        fmc.onRightInput[4] = async () => {
            FMC_Fuel.ofpRequestText = "SENDING";

            setTimeout(async () => {
                if (!fmc.simbrief.blockFuel) await getSimBriefPlan(fmc);

                if (fmc.simbrief.blockFuel) {
                    Coherent.call("PLAY_INSTRUMENT_SOUND", "uplink_chime");
                    const desiredFuel = parseFloat(fmc.simbrief.blockFuel.toString());
                    setDesiredFuel(fmc, updateView, SaltyUnits.userToKg(desiredFuel));
                } else fmc.showErrorMessage("WRONG PILOT ID");

                FMC_Fuel.ofpRequestText = "SEND>";
            }, fmc.getInsertDelay())


            const desiredFuel = parseFloat(fmc.simbrief.blockFuel.toString());
            setDesiredFuel(fmc, updateView, SaltyUnits.userToKg(desiredFuel));
        };

        fmc.onLeftInput[5] = () => {
            FMCSaltyOptions.ShowPage1(fmc);
        };

        fmc.onRightInput[5] = () => {
            if (refuelingRate === "INSTANT") SaltyDataStore.set("747_REFUEL_RATE_SETTING", "REAL");
            else if (refuelingRate === "REAL") SaltyDataStore.set("747_REFUEL_RATE_SETTING", "FAST");
            else SaltyDataStore.set("747_REFUEL_RATE_SETTING", "INSTANT");
        };
    }
}

async function setDesiredFuel(fmc, updateView, blockFuel) {
    SimVar.SetSimVarValue("L:747_FUEL_DESIRED", "Number", SaltyUnits.kgToUser(blockFuel));

    const totalMainTanksCapacity = 39500;
    const resTankCapacity = 1534;
    const centerTankCapacity = 17000;
    const stabTankCapacity = 3300;
    const fuelWeightPerGallon = SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilograms");
    let currentBlockFuelInGallons = blockFuel / fuelWeightPerGallon;

    const mainTankFill = Math.min(totalMainTanksCapacity, currentBlockFuelInGallons);
    await SimVar.SetSimVarValue(`L:747_FUEL_TANK_LEFT_AUX_QUANTITY_DESIRED`, "Gallons", mainTankFill * 0.1346835443037975);
    await SimVar.SetSimVarValue(`L:747_FUEL_TANK_RIGHT_AUX_QUANTITY_DESIRED`, "Gallons", mainTankFill * 0.1346835443037975);
    await SimVar.SetSimVarValue(`L:747_FUEL_TANK_LEFT_MAIN_QUANTITY_DESIRED`, "Gallons", mainTankFill * 0.3653164556962025);
    await SimVar.SetSimVarValue(`L:747_FUEL_TANK_RIGHT_MAIN_QUANTITY_DESIRED`, "Gallons", mainTankFill * 0.3653164556962025);
    currentBlockFuelInGallons -= mainTankFill;

    const tipTankFill = Math.min(resTankCapacity, currentBlockFuelInGallons / 2);
    await SimVar.SetSimVarValue(`L:747_FUEL_TANK_LEFT_TIP_QUANTITY_DESIRED`, "Gallons", tipTankFill);
    await SimVar.SetSimVarValue(`L:747_FUEL_TANK_RIGHT_TIP_QUANTITY_DESIRED`, "Gallons", tipTankFill);
    currentBlockFuelInGallons -= tipTankFill * 2;

    const centerTankFill = Math.min(centerTankCapacity, currentBlockFuelInGallons);
    await SimVar.SetSimVarValue(`L:747_FUEL_TANK_CENTER_QUANTITY_DESIRED`, "Gallons", centerTankFill);
    currentBlockFuelInGallons -= centerTankFill;

    const stabTankFill = Math.min(stabTankCapacity, currentBlockFuelInGallons);
    await SimVar.SetSimVarValue(`L:747_FUEL_TANK_CENTER2_QUANTITY_DESIRED`, "Gallons", stabTankFill);
    currentBlockFuelInGallons -= stabTankFill;

    fmc.updateFuelVars();
    updateView();
}

FMC_Fuel.ofpRequestText = "SEND>";
