class FMC_COMM_Boarding {
    static ShowPage1(fmc) {
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();

        function updateView() {
            FMC_COMM_Boarding.ShowPage1(fmc);
        }

        const maxAllowableFuel = 193280; // in kilograms

        let blockFuel = "_____[color]yellow";
        let taxiFuel = "____[color]yellow";
        let tripFuel = "_____[color]yellow";
        let requestButton = "SEND>[color]magenta";
        let loadButton = "<LOAD[color]magenta";

        if (fmc.simbrief.sendStatus !== "READY" && fmc.simbrief.sendStatus !== "DONE") {
            requestButton = "SEND [color]inop";
        }

        if (fmc.companyComm.loading) {
            loadButton = " LOAD[color]magenta";
        }

        const currentBlockFuel = fmc.companyComm.blockFuel|| fmc.simbrief.blockFuel;
        if (currentBlockFuel) {
            blockFuel = `${Math.round(SaltyUnits.kgToUser(currentBlockFuel))}[color]magenta`;
        }

        const currentTaxiFuel = fmc.companyComm.taxiFuel || fmc.simbrief.taxiFuel;
        if (currentTaxiFuel) {
            taxiFuel = `${Math.round(SaltyUnits.kgToUser(currentTaxiFuel))}[color]magenta`;
        }

        const currentTripFuel = fmc.companyComm.tripFuel || fmc.simbrief.tripFuel;
        if (currentTripFuel) {
            tripFuel = `${Math.round(SaltyUnits.kgToUser(currentTripFuel))}[color]magenta`;
        }

        const display = [
            ["FUEL", "1", "3"],
            ["BLOCK FUEL"],
            [blockFuel],
            ["TAXI FUEL"],
            [taxiFuel],
            ["TRIP FUEL"],
            [tripFuel],
            [""],
            ["", ""],
            ["REFUEL", "OFP REQUEST[color]magenta"],
            [loadButton, requestButton],
            ["\xa0ACARS", ""],
            ["<INDEX", ""]
        ];
        fmc.setTemplate(display);

        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            if (value === FMCMainDisplay.clrValue) {
                fmc.companyComm.blockFuel = undefined;
                updateView();
                return true;
            }
            if (value < 999) {
                value = value * 1000;
            }
            const enteredFuel = SaltyUnits.userToKg(Math.round(+value));
            if (enteredFuel >= 0 && enteredFuel <= maxAllowableFuel) {
                fmc.companyComm.blockFuel = enteredFuel;
                fmc.clearUserInput();
                updateView();
                return true;
            }
            fmc.showErrorMessage("NOT ALLOWED");
            return false;
        };
        
        fmc.onLeftInput[1] = (value) => {
            if (value === FMCMainDisplay.clrValue) {
                fmc.simbrief.taxiFuel = undefined;
                updateView();
                return true;
            }
            const enteredFuel = SaltyUnits.userToKg(Math.round(+value));
            if (enteredFuel >= 0 && enteredFuel <= maxAllowableFuel) {
                fmc.simbrief.taxiFuel = enteredFuel;
                updateView();
                return true;
            }
            fmc.showErrorMessage("NOT ALLOWED");
            return false;
        };
        
        fmc.onLeftInput[2] = (value) => {
            if (value === FMCMainDisplay.clrValue) {
                fmc.simbrief.tripFuel = undefined;
                updateView();
                return true;
            }
            const enteredFuel = SaltyUnits.userToKg(Math.round(+value));
            if (enteredFuel >= 0 && enteredFuel <= maxAllowableFuel) {
                fmc.companyComm.tripFuel = enteredFuel;
                updateView();
                return true;
            }
            fmc.showErrorMessage("NOT ALLOWED");
            return false;
        };
        
        fmc.onLeftInput[4] = () => {
            const onGround = SimVar.GetSimVarValue("SIM ON GROUND", "Bool");
            const gs = SimVar.GetSimVarValue("GPS GROUND SPEED", "knots");
            const oneEngineRunning = SimVar.GetSimVarValue('GENERAL ENG COMBUSTION:1', 'bool') ||
                SimVar.GetSimVarValue('GENERAL ENG COMBUSTION:2', 'bool') || SimVar.GetSimVarValue('GENERAL ENG COMBUSTION:3', 'bool') ||
                SimVar.GetSimVarValue('GENERAL ENG COMBUSTION:4', 'bool');
            if (gs < 1 && onGround && currentBlockFuel && !oneEngineRunning) {
                loadFuel(fmc, updateView);
                updateView();
            } else {
                fmc.showErrorMessage("NOT ALLOWED");
            }
        };
        
        fmc.onRightInput[4] = () => {
            getFplnFromSimBrief(fmc, "", updateView, () => {
                setTargetPax(fmc.simbrief.paxCount).then(() => {
                    fmc.simbrief.perfUplinkReady = true;
                    insertPerfUplink(fmc, updateView);
                });
            });
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
    }

    static ShowPage2(fmc) {
        fmc.clearDisplay();
        fmc.activeSystem = 'ATSU';

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

        /* 
            Payload display
        */
        const display = [
            ["PAX", "2", "3"],
            ["TOTAL PAX", "TOTAL CARGO"],
            [buildTotalPaxValue(fmc), buildTotalCargoValue(fmc)],
            [cargoStations.fwdBag.name, ""],
            [buildStationValue(fmc, cargoStations.fwdBag), ""],
            [cargoStations.aftBag.name, ""],
            [buildStationValue(fmc, cargoStations.aftBag), ""],
            [cargoStations.bulkBag.name, ""],
            [buildStationValue(fmc, cargoStations.bulkBag), ""],
            ["", "REQUEST OFP"],
            ["", requestButton],
            ["\xa0ACARS", "BOARDING"],
            ["<INDEX", loadButton]
        ];
        fmc.setTemplate(display);

        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            setTargetPax(value).then(() => {
                console.log(value);
            });
        };

        fmc.onRightInput[0] = () => {
            let value = fmc.inOut;
            value = parseFloat(value);
            if (value < 100) {
                value = value * 1000;
            }
            fmc.clearUserInput();
            setTargetCargo(fmc.companyComm.paxCount, value).then(() => {
                console.log(value);
            });
        };

        fmc.onRightInput[4] = () => {
            getFplnFromSimBrief(fmc, "", updateView, () => {
                setTargetPax(fmc.companyComm.paxCount).then(() => {
                    fmc.simbrief.perfUplinkReady = true;
                    insertPerfUplink(fmc, updateView);
                });
                setTargetCargo(fmc.companyComm.cargo).then(() => {
                    fmc.simbrief.perfUplinkReady = true;
                    insertPerfUplink(fmc, updateView);
                });
            });
        };

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
        fmc.activeSystem = 'ATSU';

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
            setCargoTarget(parseFloat(fmc.companyComm.cargo));
        }

        const currentZfwcg = getZfwcg();
        if (currentZfwcg !== undefined) {
            const cgColor = currentZfwcg >= 16 && currentZfwcg <= 40 ? 'green' : 'red';
            zfwcg = `${currentZfwcg.toFixed(1)}[color]${cgColor}`;
        }

        /* 
            All pax stations display
        */
        const display = [
            ["PAX", "2", "3"],
            [paxStations.businessUpper.name, "ZFW"],
            [buildStationValue(fmc, paxStations.businessUpper), `${Math.round(SaltyUnits.kgToUser(getZfw()))}[color]green`],
            [paxStations.firstClass.name, "ZFW CG"],
            [buildStationValue(fmc, paxStations.firstClass), zfwcg],
            [paxStations.businessMain.name, paxStations.fowardEconomy.name],
            [buildStationValue(fmc, paxStations.businessMain), buildStationValue(fmc, paxStations.fowardEconomy)],
            [paxStations.premiumEconomy.name, paxStations.rearEconomy.name],
            [buildStationValue(fmc, paxStations.premiumEconomy), buildStationValue(fmc, paxStations.rearEconomy)],
            ["", ""],
            ["", ""],
            ["\xa0ACARS", ""],
            ["<INDEX", ""]
        ];
        fmc.setTemplate(display);

        /* LSK1 */
        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (value < 100) {
                console.log(value * 1000);
                value = value * 1000;
                setCargoTarget(value);
            } else {
                setCargoTarget(value);
            }
        };

        /* RSK5 */
        fmc.onRightInput[4] = () => {
            getPayloadAndFuel(fmc, () => {
                setCargoTarget(fmc.companyComm.cargo);
                updateView();
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
    const resTankCapacity = 1534; // Res 1 and 2 = flight_model.cfg Left and Right Tip
    const centerTankCapacity = 17000; // Center tank = flight_model.cfg Center 1
    const stabTankCapacity = 3300; // Stab tank = flight_model.cfg Center 2

    const fuelWeightPerGallon = SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilograms");
    let currentBlockFuelInGallons = +currentBlockFuel / +fuelWeightPerGallon;
    console.log("INITIAL BLOCK IN GALLONS IS: " + currentBlockFuelInGallons);

    const mainTankFill = Math.min(mainTankCapacity, currentBlockFuelInGallons / 2);
    await SimVar.SetSimVarValue(`FUEL TANK LEFT MAIN QUANTITY`, "Gallons", mainTankFill);
    await SimVar.SetSimVarValue(`FUEL TANK RIGHT MAIN QUANTITY`, "Gallons", mainTankFill);
    currentBlockFuelInGallons -= mainTankFill * 2;
    console.log("TANK IS: MAIN 2 and 3, CAPACITY: " + mainTankCapacity + ", FILLED: " + mainTankFill +", REMAINING: " + currentBlockFuelInGallons);

    const mainTipTankFill = Math.min(mainTipTankCapacity, currentBlockFuelInGallons / 2);
    await SimVar.SetSimVarValue(`FUEL TANK LEFT AUX QUANTITY`, "Gallons", mainTipTankFill);
    await SimVar.SetSimVarValue(`FUEL TANK RIGHT AUX QUANTITY`, "Gallons", mainTipTankFill);
    currentBlockFuelInGallons -= mainTipTankFill * 2;
    console.log("TANK IS: MAIN 1 and 4, CAPACITY" + mainTipTankCapacity + ", REMAINING IS: " + currentBlockFuelInGallons);


    const tipTankFill = Math.min(resTankCapacity, currentBlockFuelInGallons / 2);
    await SimVar.SetSimVarValue(`FUEL TANK LEFT TIP QUANTITY`, "Gallons", tipTankFill);
    await SimVar.SetSimVarValue(`FUEL TANK RIGHT TIP QUANTITY`, "Gallons", tipTankFill);
    currentBlockFuelInGallons -= tipTankFill * 2;
    console.log("TANK IS: RES 1 and 2, CAPACITY" + resTankCapacity + ", REMAINING IS: " + currentBlockFuelInGallons);

    const centerTankFill = Math.min(centerTankCapacity, currentBlockFuelInGallons);
    await SimVar.SetSimVarValue(`FUEL TANK CENTER QUANTITY`, "Gallons", centerTankFill);
    currentBlockFuelInGallons -= centerTankFill;
    console.log("TANK IS: CENTER, CAPACITY" + centerTankCapacity + ", REMAINING IS: " + currentBlockFuelInGallons);

    const stabTankFill = Math.min(stabTankCapacity, currentBlockFuelInGallons);
    await SimVar.SetSimVarValue(`FUEL TANK CENTER2 QUANTITY`, "Gallons", stabTankFill);
    currentBlockFuelInGallons -= stabTankFill;
    console.log("TANK IS: STAB, CAPACITY" + stabTankCapacity + ", REMAINING IS: " + currentBlockFuelInGallons);

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
async function setTargetCargo(numberOfPax, simbriefCargo) {
    const bagWeight = numberOfPax * 20;
    const maxLoadInCargoHold = 43900; // from flight_model.cfg
    let loadableCargoWeight = undefined;

    if (simbriefCargo == 0) {
        loadableCargoWeight = bagWeight;
        console.log("if (simbriefCargo == 0) {: " + loadableCargoWeight);
    } else if ((simbriefCargo + bagWeight) > maxLoadInCargoHold) {
        loadableCargoWeight = maxLoadInCargoHold;
        console.log("} else if ((simbriefCargo + bagWeight) > maxLoadInCargoHold) {: " + loadableCargoWeight);
    } else {
        loadableCargoWeight = simbriefCargo + bagWeight;
        console.log("bagWeight " + bagWeight);
        console.log("simbriefCargo " + simbriefCargo);
        console.log("loadableCargoWeight " + loadableCargoWeight);
    }
    let remainingWeight = loadableCargoWeight;

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
            maxValue: 7.0,
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