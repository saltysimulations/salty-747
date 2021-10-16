class FMC_COMM_Boarding {
    static ShowPage1(fmc) {
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();

        function updateView() {
            FMC_COMM_Boarding.ShowPage1(fmc);
        }

        const maxAllowableFuel = 193280; // in kilograms

        let blockFuel = "_____[color]amber";
        let taxiFuel = "____[color]amber";
        let tripFuel = "_____[color]amber";
        let requestButton = "SEND>[color]magenta";
        let loadButton = "<LOAD[color]magenta";

        if (fmc.simbrief.sendStatus !== "READY" && fmc.simbrief.sendStatus !== "DONE") {
            requestButton = "SEND [color]magenta";
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
            ["BOARDING", "1", "2"],
            ["BLOCK FUEL"],
            [blockFuel],
            ["TAXI FUEL"],
            [taxiFuel],
            ["TRIP FUEL"],
            [tripFuel],
            [""],
            ["", "PRINT>[color]inop"],
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
            if (value < 193) {
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
            getFplnFromSimBrief(fmc);
            console.log(fmc.companyComm.tripFuel);
        };
        
        fmc.onLeftInput[5] = () => {
            FMC_COMM_Index.ShowPage(fmc);
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

        const boardingStartedByUser = SimVar.GetSimVarValue("L:A32NX_BOARDING_STARTED_BY_USR", "Bool");

        let zfwcg = "__._[color]amber";
        let requestButton = "SEND>[color]magenta";
        let loadButton = "START>[color]magenta";

        if (fmc.simbrief.sendStatus !== "READY" && fmc.simbrief.sendStatus !== "DONE") {
            requestButton = "SEND [color]magenta";
        }

        if (boardingStartedByUser) {
            loadButton = "STOP>[color]yellow";
        }

        function buildStationValue(station) {
            const targetPax = SimVar.GetSimVarValue(`L:${station.simVar}_DESIRED`, "Number");
            const pax = SimVar.GetSimVarValue(`L:${station.simVar}`, "Number");

            const suffix = targetPax === pax ? "[color]green" : "[color]magenta";

            return new FMC_SingleValueField(fmc,
                "int",
                `${pax} (${targetPax})`,
                {
                    emptyValue: "__[color]amber",
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

        async function setTargetPax(numberOfPax) {

            let paxRemaining = parseInt(numberOfPax);

            async function fillStation(station, percent, paxToFill) {

                const pax = Math.min(Math.round(percent * paxToFill), station.seats);
                station.pax = pax;

                await SimVar.SetSimVarValue(`L:${station.simVar}_DESIRED`, "Number", parseInt(pax));

                paxRemaining -= pax;
            }

            await fillStation(paxStations['rows22_29'], .275 , numberOfPax);
            await fillStation(paxStations['rows14_21'], .275, numberOfPax);
            await fillStation(paxStations['rows7_13'], .240 , numberOfPax);
            await fillStation(paxStations['rows1_6'], 1 , paxRemaining);
            return;
        }

        const currentZfwcg = getZfwcg();
        if (currentZfwcg !== undefined) {
            const cgColor = currentZfwcg >= 16 && currentZfwcg <= 40 ? 'green' : 'red';
            zfwcg = `${currentZfwcg.toFixed(1)}{end}[color]${cgColor}`;
        }

        function buildTotalPaxValue() {
            const currentPax = Object.values(paxStations).map((station) => SimVar.GetSimVarValue(`L:${station.simVar}`, "Number")).reduce((acc, cur) => acc + cur);
            const paxTarget = Object.values(paxStations).map((station) => SimVar.GetSimVarValue(`L:${station.simVar}_DESIRED`, "Number")).reduce((acc, cur) => acc + cur);

            const suffix = paxTarget === currentPax ? "[color]green" : "[color]magenta";

            return new FMC_SingleValueField(fmc,
                "int",
                `${currentPax} (${paxTarget})`,
                {
                    emptyValue: "__[color]amber",
                    suffix: suffix,
                    maxLength: 3,
                    minValue: 0,
                    maxValue: MAX_SEAT_AVAILABLE,
                },
                async (value) => {
                    await setTargetPax(value);
                    updateView();
                }
            );

        }

        const display = [
            ["W/B", "2", "2", "AOC"],
            ["TOTAL PAX", "PAYLOAD"],
            [buildTotalPaxValue(), `${Math.round(SaltyUnits.kgToUser(getTotalPayload()))}[color]green`],
            [paxStations.rows1_6.name, "ZFW"],
            [buildStationValue(paxStations.rows1_6), `${Math.round(SaltyUnits.kgToUser(getZfw()))}[color]green`],
            [paxStations.rows7_13.name, "ZFW CG"],
            [buildStationValue(paxStations.rows7_13), zfwcg],
            [paxStations.rows14_21.name, "CARGO"],
            [buildStationValue(paxStations.rows14_21), `${Math.round(SaltyUnits.kgToUser(getTotalCargo()))} >[color]inop`],
            [paxStations.rows22_29.name, "OFP REQUEST"],
            [buildStationValue(paxStations.rows22_29), requestButton],
            ["", "BOARDING"],
            ["<AOC MENU", loadButton]
        ];
        fmc.setTemplate(display);

        fmc.rightInputDelay[4] = () => {
            return fmc.getDelayBasic();
        };
        fmc.onRightInput[4] = () => {
            getSimBriefOfp(fmc, updateView, () => {
                setTargetPax(fmc.simbrief.paxCount).then(() => {
                    updateView();
                });
            });
        };

        fmc.rightInputDelay[5] = () => {
            return fmc.getDelayBasic();
        };
        fmc.onRightInput[5] = async () => {
            await SimVar.SetSimVarValue("L:A32NX_BOARDING_STARTED_BY_USR", "Bool", !boardingStartedByUser);

            updateView();
        };

        fmc.leftInputDelay[5] = () => {
            return fmc.getDelaySwitchPage();
        };
        fmc.onLeftInput[5] = () => {
            CDUAocMenu.ShowPage(fmc);
        };

        fmc.onPrevPage = () => {
            CDUAocOfpData.ShowPage(fmc);
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

    const leMacZ = -5.39; // Value from Debug Weight
    const macSize = 13.45; // Value from Debug Aircraft Sim Tunning

    const emptyWeight = 485300 * 0.453592; // Value from flight_model.cfg to kgs
    const emptyPosition = -98; // Value from flight_model.cfg
    const emptyMoment = emptyPosition * emptyWeight;

    const paxTotalMass = Object.values(paxStations).map((station) => (SimVar.GetSimVarValue(`L:${station.simVar}_DESIRED`, "Number") * currentPaxWeight)).reduce((acc, cur) => acc + cur, 0);
    const paxTotalMoment = Object.values(paxStations).map((station) => (SimVar.GetSimVarValue(`L:${station.simVar}_DESIRED`, "Number") * currentPaxWeight) * station.position).reduce((acc, cur) => acc + cur, 0);

    const payloadTotalMass = Object.values(cargoStations).map((station) => SimVar.GetSimVarValue(`L:${station.simVar}`, "Number")).reduce((acc, cur) => acc + cur, 0);
    const payloadTotalMoment = Object.values(cargoStations).map((station) => (SimVar.GetSimVarValue(`L:${station.simVar}`, "Number") * station.position)).reduce((acc, cur) => acc + cur, 0);

    const totalMass = emptyWeight + paxTotalMass + payloadTotalMass;
    const totalMoment = emptyMoment + paxTotalMoment + payloadTotalMoment;

    const cgPosition = totalMoment / totalMass;
    const cgPositionToLemac = cgPosition - leMacZ;
    const cgPercentMac = -100 * (cgPositionToLemac / macSize);

    return cgPercentMac;
}

function getTotalCargo() {
    const cargoTotalMass = Object.values(cargoStations).filter((station) => station.visible).map((station) => SimVar.GetSimVarValue(`L:${station.simVar}`, "Number")).reduce((acc, cur) => acc + cur, 0);

    return cargoTotalMass;
}

function getTotalPayload() {
    const currentPaxWeight = PAX_WEIGHT + BAG_WEIGHT;

    const paxTotalMass = Object.values(paxStations).map((station) => (SimVar.GetSimVarValue(`L:${station.simVar}_DESIRED`, "Number") * currentPaxWeight)).reduce((acc, cur) => acc + cur, 0);
    const cargoTotalMass = getTotalCargo();

    return paxTotalMass + cargoTotalMass;
}

function getZfw() {
    const emptyWeight = 485300 * 0.453592; // Value from flight_model.cfg to kgs
    return emptyWeight + getTotalPayload();
}