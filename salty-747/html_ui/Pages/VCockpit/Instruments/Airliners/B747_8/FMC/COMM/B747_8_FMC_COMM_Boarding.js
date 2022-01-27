class FMC_COMM_Boarding {
    static ShowPage1(fmc) {
        fmc.clearDisplay();

        function updateView() {
            FMC_COMM_Boarding.ShowPage1(fmc);
        }

        fmc.refreshPageCallback = () => {
            updateView();
        };
        SimVar.SetSimVarValue("L:FMC_UPDATE_CURRENT_PAGE", "number", 1);

        const refuelStartedByUser = SimVar.GetSimVarValue("L:747_FUELING_STARTED_BY_USR", "Bool");
        //const refuelingRate = SimVar.GetSimVarValue("L:747_REFUEL_RATE_SETTING", "Number");
        const refuelingRate = SaltyDataStore.get("747_REFUEL_RATE_SETTING", 'REAL');
        let refuelingRateText = "";
        switch (refuelingRate) {
            case "REAL":
                // Loads fuel in a realistic time
                refuelingRateText = "REAL>";
                break;
            case "FAST":
                // Loads fuel 5 times faster
                refuelingRateText = "FAST>";
                break;
            case "INSTANT":
                // Loads fuel instant
                refuelingRateText = "INSTANT>";
                break;
            default:
        }

        let blockFuel = "_____[color]yellow";
        let taxiFuel = "____[color]yellow";
        let tripFuel = "_____[color]yellow";
        let requestButton = "SEND>[color]magenta";
        let loadButton = "LOAD>[color]magenta";

        if (fmc.simbrief.sendStatus !== "READY" && fmc.simbrief.sendStatus !== "DONE") {
            requestButton = "SEND [color]inop";
        }

        if (refuelStartedByUser) {
            loadButton = "STOP>[color]yellow";
        }

        const currentBlockFuel = fmc.companyComm.blockFuel || fmc.simbrief.blockFuel;
        if (currentBlockFuel) {
            blockFuel = `${(Math.round(SaltyUnits.kgToUser(currentBlockFuel)) / 1000).toFixed(1)}[color]green`;
        }

        const currentTaxiFuel = fmc.companyComm.taxiFuel || fmc.simbrief.taxiFuel;
        if (currentTaxiFuel) {
            taxiFuel = `${Math.round(SaltyUnits.kgToUser(currentTaxiFuel))}[color]green`;
        }

        const currentTripFuel = fmc.companyComm.tripFuel || fmc.simbrief.tripFuel;
        if (currentTripFuel) {
            tripFuel = `${Math.round(SaltyUnits.kgToUser(currentTripFuel))}[color]green`;
        }

        const display = [
            ["FUEL", "1", "3"],
            ["BLOCK FUEL", "REFUEL RATE"],
            [buildTotalFuelValue(), refuelingRateText + "[color]green"],
            ["TAXI FUEL"],
            [taxiFuel],
            ["TRIP FUEL"],
            [tripFuel],
            [""],
            ["", ""],
            ["", "OFP REQUEST[color]inop"],
            [, requestButton],
            ["\xa0ACARS", "REFUEL"],
            ["<INDEX", loadButton]
        ];
        fmc.setTemplate(display);

        /* Sets total fuel target */
        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            if (value === FMCMainDisplay.clrValue) {
                fmc.companyComm.blockFuel = undefined;
                updateView();
                return true;
            }
            if (value < 191.2) {
                value = value * 1000;
            }
            const enteredFuel = SaltyUnits.userToKg(Math.round(+value));
            if (enteredFuel >= 0 && enteredFuel <= MAX_ALLOWABLE_FUEL) {
                SimVar.SetSimVarValue("L:747_FUEL_DESIRED", "Number", enteredFuel);
                fmc.companyComm.blockFuel = enteredFuel;
                fmc.simbrief.blockFuel = enteredFuel;
                loadFuel(fmc, updateView);
                fmc.clearUserInput();
                return true;
            }
            fmc.showErrorMessage("NOT ALLOWED");
            return false;
        };

        /* Rate of refueling */
        fmc.onRightInput[0] = () => {
            const refuelingRate = SaltyDataStore.get("747_REFUEL_RATE_SETTING", 'REAL');
            switch (refuelingRate) {
                case "INSTANT":
                    // Loads fuel in a realistic time
                    SaltyDataStore.set("747_REFUEL_RATE_SETTING", "REAL");
                    updateView();
                    break;
                case "REAL":
                    // Loads fuel 5 times faster
                    SaltyDataStore.set("747_REFUEL_RATE_SETTING", "FAST");
                    updateView();
                    break;
                case "FAST":
                    // Loads fuel instant
                    SaltyDataStore.set("747_REFUEL_RATE_SETTING", "INSTANT");
                    updateView();
                    break;
                default:
            };
        }
        
        /* Fetch fuel from flight plan */
        /*fmc.onRightInput[4] = () => {
            getFplnFromSimBrief(fmc, "", updateView, () => {
                setTargetPax(fmc.simbrief.paxCount).then(() => {
                    insertPerfUplink(fmc, updateView);
                });
            });
        };*/

        /* Starts refueling */ 
        fmc.onRightInput[5] = async () => {
            switch (refuelingRate) {
                case "REAL":
                    if (airplaneCanFuel()) {
                        await SimVar.SetSimVarValue("L:747_FUELING_STARTED_BY_USR", "Bool", !refuelStartedByUser);
                        updateView()
                    }
                    else {
                       fmc.showErrorMessage("ENGINES RUNNING")
                    }
                    break;
                case "FAST":
                    if (airplaneCanFuel()) {
                        await SimVar.SetSimVarValue("L:747_FUELING_STARTED_BY_USR", "Bool", !refuelStartedByUser);
                        updateView()
                    }
                    else {
                       fmc.showErrorMessage("ENGINES RUNNING")
                    }
                    break;
                case "INSTANT":
                    await SimVar.SetSimVarValue("L:747_FUELING_STARTED_BY_USR", "Bool", !refuelStartedByUser);
                    updateView()
                    break;
            }
        };
        
        fmc.onLeftInput[5] = () => {
            FMC_COMM_Index.ShowPage(fmc);
        };

        fmc.onPrevPage = () => {
            FMC_COMM_Boarding.ShowPage3(fmc);
        };

        fmc.onNextPage = () => {
            FMC_COMM_Boarding.ShowPage2(fmc);
        };

        function buildTotalFuelValue() {
            const gallonToMegagrams = SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilogram") * 0.001;
            const currentFuel = (SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons")  * gallonToMegagrams).toFixed(1);
            const targetFuel = (SimVar.GetSimVarValue("L:747_FUEL_DESIRED", "number") * 0.001).toFixed(1);
        
            const suffix = targetFuel === currentFuel ? "[color]green" : "[color]yellow";
        
            return new FMC_SingleValueField(fmc,
                "number",
                `${currentFuel} (${targetFuel})`,
                {
                    emptyValue: "__[color]yellow",
                    suffix: suffix,
                    maxLength: 3,
                    minValue: 0,
                    maxValue: MAX_ALLOWABLE_FUEL,
                },
                async (value) => {
                    updateView();
                }
            );
        }
    }

    static ShowPage2(fmc) {
        fmc.clearDisplay();

        function updateView() {
            FMC_COMM_Boarding.ShowPage2(fmc);
        }

        fmc.refreshPageCallback = () => {
            updateView();
        };
        SimVar.SetSimVarValue("L:FMC_UPDATE_CURRENT_PAGE", "number", 1);

        const boardingStartedByUser = SimVar.GetSimVarValue("L:747_BOARDING_STARTED_BY_USR", "Bool");

        let zfwcg = "__._[color]yellow";
        let requestButton = "SEND>[color]magenta";
        let loadButton = "START>[color]magenta";

        if (fmc.simbrief.sendStatus !== "READY" && fmc.simbrief.sendStatus !== "DONE") {
            requestButton = "SEND [color]inop";
        }

        if (boardingStartedByUser) {
            loadButton = "STOP>[color]yellow";
        }

        const currentZfwcg = getZfwcg();
        if (currentZfwcg !== undefined) {
            const cgColor = currentZfwcg >= 16 && currentZfwcg <= 40 ? 'green' : 'red';
            zfwcg = `${currentZfwcg.toFixed(1)}[color]${cgColor}`;
        }
        
        const boardingRate = SaltyDataStore.get("747_CONFIG_BOARDING_RATE", 'REAL');
        let boardingRateText = "";
        switch (boardingRate) {
            case "REAL":
                // Loads fuel in a realistic time
                boardingRateText = "REAL>";
                break;
            case "FAST":
                // Loads fuel 5 times faster
                boardingRateText = "FAST>";
                break;
            case "INSTANT":
                // Loads fuel instant
                boardingRateText = "INSTANT>";
                
                break;
            default:
        }

        const desiredCargo = SimVar.GetSimVarValue("L:747_DESIRED_CARGO", "number");
        let desiredCargoText = (desiredCargo / 1000).toFixed(1);
        const paxTarget = Object.values(paxStations).map((station) => SimVar.GetSimVarValue(`L:${station.simVar}_DESIRED`, "Number")).reduce((acc, cur) => acc + cur);

        /* 
            Payload display
        */
        const display = [
            ["CARGO", "2", "3"],
            [cargoStations.fwdBag.name, "CARGO"],
            [buildStationValue(fmc, cargoStations.fwdBag), desiredCargoText + ">[color]magenta"],
            [cargoStations.aftBag.name, ""],
            [buildStationValue(fmc, cargoStations.aftBag), ""],
            [cargoStations.bulkBag.name, ""],
            [buildStationValue(fmc, cargoStations.bulkBag), ""],
            ["CARGO + BAGS", "BOARDING RATE"],
            [buildTotalCargoValue(), boardingRateText + "[color]magenta"],
            ["", "REQUEST OFP[color]inop"],
            ["", requestButton],
            ["\xa0ACARS", "BOARDING"],
            ["<INDEX", loadButton]
        ];
        fmc.setTemplate(display);

        /* LSK1 */
        fmc.onRightInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (value < 44) {
                value = value * 1000;
            }
            const enteredCargo = Math.round(+value);
            if (value >= 0 && value <= 43900) {
                SimVar.SetSimVarValue("L:747_DESIRED_CARGO", "number", enteredCargo);
                setTargetCargo(paxTarget, enteredCargo);
                fmc.clearUserInput();
                return true;
            }
            fmc.showErrorMessage("NOT ALLOWED");
            return false;
        };

        /* Rate of boarding */
        fmc.onRightInput[3] = () => {
            switch (boardingRate) {
                case "INSTANT":
                    // Boards in a realistic time
                    SaltyDataStore.set("747_CONFIG_BOARDING_RATE", 'REAL');
                    updateView();
                    break;
                case "REAL":
                    // Boards 5 times faster
                    SaltyDataStore.set("747_CONFIG_BOARDING_RATE", 'FAST');
                    updateView();
                    break;
                case "FAST":
                    // Boards instant
                    SaltyDataStore.set("747_CONFIG_BOARDING_RATE", 'INSTANT');
                    updateView();
                    break;
                default:
            };
        }
        

        fmc.onRightInput[5] = async () => {
            await SimVar.SetSimVarValue("L:747_BOARDING_STARTED_BY_USR", "Bool", !boardingStartedByUser);
            updateView();
        };

        fmc.onLeftInput[5] = () => {
            FMC_COMM_Index.ShowPage(fmc);
        };

        fmc.onPrevPage = () => {
            FMC_COMM_Boarding.ShowPage1(fmc);
        };

        fmc.onNextPage = () => {
            FMC_COMM_Boarding.ShowPage3(fmc);
        };
    }

    static ShowPage3(fmc) {
        fmc.clearDisplay();

        function updateView() {
            FMC_COMM_Boarding.ShowPage3(fmc);
        }

        fmc.refreshPageCallback = () => {
            updateView();
        };
        SimVar.SetSimVarValue("L:FMC_UPDATE_CURRENT_PAGE", "number", 1);

        const boardingStartedByUser = SimVar.GetSimVarValue("L:747_BOARDING_STARTED_BY_USR", "Bool");

        let zfwcg = "__._[color]yellow";
        let requestButton = "SEND>[color]magenta";
        let loadButton = "START>[color]magenta";

        if (fmc.simbrief.sendStatus !== "READY" && fmc.simbrief.sendStatus !== "DONE") {
            requestButton = "SEND [color]inop";
        }

        if (boardingStartedByUser) {
            loadButton = "STOP>[color]yellow";
        }
        if (fmc.companyComm.cargo != undefined) {
            setTargetCargo(parseFloat(fmc.companyComm.cargo));
        }

        const currentZfwcg = getZfwcg();
        if (currentZfwcg !== undefined) {
            const cgColor = currentZfwcg >= 16 && currentZfwcg <= 40 ? 'green' : 'red';
            zfwcg = `${currentZfwcg.toFixed(1)}[color]${cgColor}`;
        }

        const paxTarget = Object.values(paxStations).map((station) => SimVar.GetSimVarValue(`L:${station.simVar}_DESIRED`, "Number")).reduce((acc, cur) => acc + cur);

        /* 
            All pax stations display
        */
        const display = [
            ["PAX", "3", "3"],
            [paxStations.businessUpper.name, "TOTAL PAX"],
            [buildStationValue(fmc, paxStations.businessUpper), paxTarget + ">[color]magenta"],
            [paxStations.firstClass.name, "ZFW CG"],
            [buildStationValue(fmc, paxStations.firstClass), zfwcg],
            [paxStations.businessMain.name, "ZFW"],
            [buildStationValue(fmc, paxStations.businessMain), `${Math.round(SaltyUnits.kgToUser(getZfw()))}[color]green`],
            [paxStations.premiumEconomy.name, , paxStations.fowardEconomy.name],
            [buildStationValue(fmc, paxStations.premiumEconomy), buildStationValue(fmc, paxStations.fowardEconomy)],
            ["PAX BOARDED", paxStations.rearEconomy.name],
            [buildTotalPaxValue(), buildStationValue(fmc, paxStations.rearEconomy)],
            ["\xa0ACARS", "BOARDING"],
            ["<INDEX", loadButton]
        ];
        fmc.setTemplate(display);

        /* RSK1 */
        fmc.onRightInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            let cargo = SimVar.GetSimVarValue("L:747_DESIRED_CARGO", "number");
            setTargetPax(value).then(() => {
                console.log(cargo);
            });
            setTargetCargo(value, cargo).then(() => {
                console.log(cargo);
            });
        };

        /* RSK6 */
        fmc.onRightInput[5] = async () => {
            await SimVar.SetSimVarValue("L:747_BOARDING_STARTED_BY_USR", "Bool", !boardingStartedByUser);
            updateView();
        };

        /* LSK5 */
        fmc.onLeftInput[5] = () => {
            FMC_COMM_Index.ShowPage(fmc);
        };

        fmc.onPrevPage = () => {
            FMC_COMM_Boarding.ShowPage2(fmc);
        };

        fmc.onNextPage = () => {
            FMC_COMM_Boarding.ShowPage1(fmc);
        };
    }
}

async function loadFuel(fmc, updateView) {
    const currentBlockFuel = fmc.companyComm.blockFuel || fmc.simbrief.blockFuel;

    fmc.companyComm.loading = true;
    updateView();

    const mainTankCapacity = 14430; // Main 2 and 3 = flight_model.cfg Left and Right Main
    const mainTipTankCapacity = 5320; // Main 1 and 4 = flight_model.cfg Left and Right Aux
    const totalMainTanksCapacity = 39500; // All main tanks capacity
    const resTankCapacity = 1534; // Res 1 and 2 = flight_model.cfg Left and Right Tip
    const centerTankCapacity = 17000; // Center tank = flight_model.cfg Center 1
    const stabTankCapacity = 3300; // Stab tank = flight_model.cfg Center 2
    const fuelWeightPerGallon = SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilograms");
    let currentBlockFuelInGallons = +currentBlockFuel / +fuelWeightPerGallon;

    const mainTankFill = Math.min(totalMainTanksCapacity, currentBlockFuelInGallons);
    await SimVar.SetSimVarValue(`L:747_FUEL_TANK_LEFT_AUX_QUANTITY_DESIRED`, "Gallons", mainTankFill * 0.1346835443037975);
    await SimVar.SetSimVarValue(`L:747_FUEL_TANK_RIGHT_AUX_QUANTITY_DESIRED`, "Gallons", mainTankFill * 0.1346835443037975);
    await SimVar.SetSimVarValue(`L:747_FUEL_TANK_LEFT_MAIN_QUANTITY_DESIRED`, "Gallons", mainTankFill * 0.3653164556962025);
    await SimVar.SetSimVarValue(`L:747_FUEL_TANK_RIGHT_MAIN_QUANTITY_DESIRED`, "Gallons", mainTankFill * 0.3653164556962025);
    console.log("mainCenter" + mainTankFill * 0.3653164556962025)
    console.log("mainOut" + mainTankFill * 0.1346835443037975)
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

    fmc.companyComm.loading = false;
    updateView();
}

const payloadConstruct = new SaltyPayloadConstructor();
const paxStations = payloadConstruct.paxStations;
const cargoStations = payloadConstruct.cargoStations;

const MAX_SEAT_AVAILABLE = 364;
const PAX_WEIGHT = 84;
const BAG_WEIGHT = 20;
const MAX_ALLOWABLE_FUEL = 193280; // in kilograms

/**
     * Calculate %MAC ZWFCG of all stations
     */
function getZfwcg() {
    const currentPaxWeight = PAX_WEIGHT + BAG_WEIGHT;

    const leMacZ = -1.47; // Value from Debug Weight
    const macSize = 36.68; // Value from Debug Aircraft Sim Tunning

    const emptyWeight = 489656 * 0.453592; // Value from flight_model.cfg to kgs
    const emptyPosition = -98; // Value from flight_model.cfg
    const emptyMoment = emptyPosition * emptyWeight;

    const paxTotalMass = Object.values(paxStations).map((station) => (SimVar.GetSimVarValue(`L:${station.simVar}_DESIRED`, "Number") * currentPaxWeight)).reduce((acc, cur) => acc + cur, 0);
    const paxTotalMoment = Object.values(paxStations).map((station) => (SimVar.GetSimVarValue(`L:${station.simVar}_DESIRED`, "Number") * currentPaxWeight) * station.position).reduce((acc, cur) => acc + cur, 0);

    const cargoTotalMass = Object.values(cargoStations).map((station) => SimVar.GetSimVarValue(`PAYLOAD STATION WEIGHT:${station.stationIndex}`, "Number")).reduce((acc, cur) => acc + cur, 0);
    const cargoTotalMoment = Object.values(cargoStations).map((station) => (SimVar.GetSimVarValue(`PAYLOAD STATION WEIGHT:${station.stationIndex}`, "Number") * station.position)).reduce((acc, cur) => acc + cur, 0);

    const totalMass = emptyWeight + paxTotalMass + cargoTotalMass;
    const totalMoment = emptyMoment + paxTotalMoment + cargoTotalMoment;

    const cgPosition = totalMoment / totalMass;
    const cgPositionToLemac = cgPosition - leMacZ;
    const cgPercentMac = -10 * (cgPositionToLemac / macSize);

    return cgPercentMac;
}

/* Get total cargo weight */
function getTotalCargo() {
    const cargoTotalMass = Object.values(cargoStations).filter((station) => station.visible).map((station) => SimVar.GetSimVarValue(`PAYLOAD STATION WEIGHT:${station.stationIndex}`, "Number")).reduce((acc, cur) => acc + cur, 0);

    return cargoTotalMass;
}

/* Gets total payload weight (pax + cargo) */
function getTotalPayload() {
    const currentPaxWeight = PAX_WEIGHT;

    const paxTotalMass = Object.values(paxStations).map((station) => (SimVar.GetSimVarValue(`L:${station.simVar}`, "Number") * currentPaxWeight)).reduce((acc, cur) => acc + cur, 0);
    const cargoTotalMass = getTotalCargo();

    return paxTotalMass + cargoTotalMass;
}

/* Gets ZFW */
function getZfw() {
    const emptyWeight = 489656 * 0.453592; // Value from flight_model.cfg to kgs
    return emptyWeight + getTotalPayload();
}

/* Sets the number of pax to load */
async function setTargetPax(numberOfPax) {

    let paxRemaining = parseInt(numberOfPax);

    async function fillStation(station, percent, paxToFill) {

        const pax = Math.min(Math.trunc(percent * paxToFill), station.seats);
        station.pax = pax;

        await SimVar.SetSimVarValue(`L:${station.simVar}_DESIRED`, "Number", parseInt(pax));

        paxRemaining -= pax;
    }

    await fillStation(paxStations['rearEconomy'], .58 , numberOfPax);
    await fillStation(paxStations['fowardEconomy'], .10 , numberOfPax);
    await fillStation(paxStations['premiumEconomy'], .09 , numberOfPax);
    await fillStation(paxStations['businessMain'], .14, numberOfPax);
    await fillStation(paxStations['firstClass'], .03 , numberOfPax);
    await fillStation(paxStations['businessUpper'], 1 , paxRemaining);
    return;
}

/* Sets the number of cargo to load */
async function setTargetCargo(numberOfPax, cargo) {
    const bagWeight = numberOfPax * 20;
    const maxLoadInCargoHold = 43900; // from flight_model.cfg
    let loadableCargoWeight = undefined;

    if (cargo == 0) {
        loadableCargoWeight = bagWeight;
        console.log(loadableCargoWeight + " cargo == 0");
    } else if ((cargo + bagWeight) > maxLoadInCargoHold) {
        loadableCargoWeight = maxLoadInCargoHold;
        console.log(loadableCargoWeight + " (cargo + bagWeight) > maxLoadInCargoHold)");
    } else {
        loadableCargoWeight = cargo + bagWeight;
        console.log(loadableCargoWeight   +  " else");
    }
    let remainingWeight = loadableCargoWeight;
    console.log(remainingWeight)

    async function fillCargo(station, percent, loadableCargoWeight) {

        const weight = Math.round(percent * loadableCargoWeight);
        station.load = weight;
        remainingWeight -= weight;
        await SimVar.SetSimVarValue(`L:${station.simVar}_DESIRED`, "Number", parseInt(weight));

    }

    await fillCargo(cargoStations['fwdBag'], .5062642369020501 , loadableCargoWeight);
    await fillCargo(cargoStations['aftBag'], .3616173120728929, loadableCargoWeight);
    await fillCargo(cargoStations['bulkBag'], 1, remainingWeight);
    return;
}

/* Calculates the number of pax in units */
function buildTotalPaxValue(fmc) {
    const currentPax = Object.values(paxStations).map((station) => SimVar.GetSimVarValue(`L:${station.simVar}`, "Number")).reduce((acc, cur) => acc + cur);
    const paxTarget = Object.values(paxStations).map((station) => SimVar.GetSimVarValue(`L:${station.simVar}_DESIRED`, "Number")).reduce((acc, cur) => acc + cur);

    const suffix = paxTarget === currentPax ? "[color]green" : "[color]yellow";

    return new FMC_SingleValueField(fmc,
        "int",
        `${currentPax} (${paxTarget})`,
        {
            emptyValue: "__[color]yellow",
            suffix: suffix,
            maxLength: 3,
            minValue: 0,
            maxValue: MAX_SEAT_AVAILABLE,
        },
        async (value) => {
            await setTargetPax(value);
            await setTargetCargo(value, '');
            updateView();
        }
    );
}

/* Calculates the number of cargo in units */      
function buildTotalCargoValue(fmc) {
    const currentLoad = Object.values(cargoStations).map((station) => SimVar.GetSimVarValue(`L:${station.simVar}`, "Number")).reduce((acc, cur) => acc + cur);
    const loadTarget = Object.values(cargoStations).map((station) => SimVar.GetSimVarValue(`L:${station.simVar}_DESIRED`, "Number")).reduce((acc, cur) => acc + cur);
    const paxTarget = Object.values(paxStations).map((station) => SimVar.GetSimVarValue(`L:${station.simVar}_DESIRED`, "Number")).reduce((acc, cur) => acc + cur);
    const suffix = loadTarget === currentLoad ? "[color]green" : "[color]yellow";

    return new FMC_SingleValueField(fmc,
        "number",
        `${(currentLoad / 1000).toFixed(1)} (${(loadTarget / 1000).toFixed(1)})`,
        {
            emptyValue: "__[color]yellow",
            clearable: true,
            suffix: suffix,
            maxLength: 4,
            minValue: 0.0,
            maxValue: 43.9,
        },
        async (value) => {
            await setTargetPax(paxTarget);
            await setTargetCargo(paxTarget, (value * 1000));
            updateView();
        }
    );

}


function buildStationValue(fmc, station) {
    const targetPax = SimVar.GetSimVarValue(`L:${station.simVar}_DESIRED`, "Number");
    const pax = SimVar.GetSimVarValue(`L:${station.simVar}`, "Number");

    const suffix = targetPax === pax ? "[color]green" : "[color]yellow";

    return new FMC_SingleValueField(fmc,
        "int",
        `${pax} (${targetPax})`,
        {
            emptyValue: "__[color]yellow",
            suffix: suffix,
            maxLength: 2,
            minValue: 0,
            maxValue: station.seats,
        },
        async (value) => {
            await SimVar.SetSimVarValue(`L:${station.simVar}_DESIRED`, "Number", value);
            updateView();
        }
    );
}

function airplaneCanFuel() {
    const gs = SimVar.GetSimVarValue("GPS GROUND SPEED", "knots");
    const isOnGround = SimVar.GetSimVarValue("SIM ON GROUND", "Bool");
    const eng1Running = SimVar.GetSimVarValue("ENG COMBUSTION:1", "Bool");
    const eng2Running = SimVar.GetSimVarValue("ENG COMBUSTION:2", "Bool");
    const eng3Running = SimVar.GetSimVarValue("ENG COMBUSTION:3", "Bool");
    const eng4Running = SimVar.GetSimVarValue("ENG COMBUSTION:4", "Bool");

    return !(gs > 0.1 || eng1Running || eng2Running || eng3Running || eng4Running || !isOnGround);
}