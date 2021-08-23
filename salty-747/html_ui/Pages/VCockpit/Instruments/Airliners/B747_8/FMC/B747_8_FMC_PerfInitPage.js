class FMCPerfInitPage {
    static ShowPage1(fmc, store = {requestData: "<SEND", loadUplink: "", purgeUplink: "__FMCSEPARATOR", dataLink: "REQUEST", stepSizeLabel: "STEP SIZE", perfUplinkHeader: ""}) {
        fmc.updateFuelVars().then(() => {
            fmc.clearDisplay();
            let units = fmc.useLbs;
            FMCPerfInitPage._timer = 0;
            fmc.pageUpdate = () => {
                FMCPerfInitPage._timer++;
                if (FMCPerfInitPage._timer >= 15) {
                    updateView();
                }
            };
            let grossWeightCell = "□□□.□";
            fmc.onLeftInput[0] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                fmc.setWeight(value, result => {
                    if (result) {
                        updateView();
                    }
                }, units);
            };
            let crzAltCell = "□□□□□";
            fmc.onRightInput[0] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                if (fmc.setCruiseFlightLevelAndTemperature(value)) {
                    updateView();
                }
            };
            let blockFuelCell = "□□□.□";
            let zeroFuelWeightCell = "□□□.□";
            fmc.onLeftInput[2] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                if (fmc.trySetZeroFuelWeightZFWCG(value, units)) {
                    updateView();
                }
            };
            let costIndex = "□□□□";
            fmc.onRightInput[1] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                if (fmc.tryUpdateCostIndex(value, 10000)) {
                    updateView();
                }
            };
            let reservesCell = "□□□.□";
            fmc.onLeftInput[3] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                if (fmc.setFuelReserves(value, units)) {
                    updateView();
                }
            };

            const updateView = () => {
                if (isFinite(fmc.getFuelVarsUpdatedGrossWeight(units))) {
                    grossWeightCell = fmc.getFuelVarsUpdatedGrossWeight(units).toFixed(1);
                }

                if (isFinite(fmc.cruiseFlightLevel)) {
                    crzAltCell = "FL" + fmc.cruiseFlightLevel.toFixed(0);
                }

                if (isFinite(fmc.getBlockFuel(units))) {
                    blockFuelCell = fmc.getBlockFuel(units).toFixed(1);
                }

                if (isFinite(fmc.getZeroFuelWeight(units))) {
                    zeroFuelWeightCell = fmc.getZeroFuelWeight(units).toFixed(1);
                }

                if (isFinite(fmc.costIndex)) {
                    costIndex = fmc.costIndex.toFixed(0);
                }

                let reserves = fmc.getFuelReserves();
                if (isFinite(reserves)) {
                    reservesCell = reserves.toFixed(1);
                }

                let minFuelTempCell = SaltyDataStore.get("PERF_MIN_FUEL_TEMP", -37);
                let crzCg = "11.00%";
                let stepSize =  SaltyDataStore.get("PERF_STEP_SIZE", "RVSM");
                let stepSizeCell = stepSize;
                if (fmc.simbrief.perfUplinkReady && !fmc.simbrief.perfSending) {
                    store.dataLink = "";
                    store.stepSizeLabel = "";
                    store.perfUplinkHeader = "----PERF INIT DATA ----";
                    store.requestData = "<REJECT";
                    stepSizeCell = "ACCEPT>";
                    crzAltCell = fmc.simbrief.cruiseAltitude;
                    costIndex = fmc.simbrief.costIndex;
                    blockFuelCell = (parseFloat(fmc.simbrief.blockFuel) / 1000).toFixed(1);
                    zeroFuelWeightCell = (parseFloat(fmc.simbrief.estZfw) / 1000).toFixed(1);
                    grossWeightCell = ((parseFloat(zeroFuelWeightCell) + (parseFloat(blockFuelCell)))).toFixed(1); 
                    reservesCell = ((parseFloat(fmc.simbrief.finResFuel) + (parseFloat(fmc.simbrief.altnFuel))) / 1000).toFixed(1);                
                } else if (!fmc.simbrief.perfSending) {
                    store.dataLink = "REQUEST";
                    store.stepSizeLabel = "STEP SIZE";
                    store.perfUplinkHeader = "";
                    store.requestData = "<SEND";
                }
    
                fmc.setTemplate([
                    ["PERF INIT"],
                    ["\xa0GR WT", "CRZ ALT"],
                    [grossWeightCell, crzAltCell],
                    ["\xa0FUEL", "COST INDEX"],
                    [blockFuelCell, costIndex],
                    ["\xa0ZFW", "MIN FUEL TEMP"],
                    [zeroFuelWeightCell, `${minFuelTempCell}°C`],
                    ["\xa0RESERVES", "CRZ CG"],
                    [reservesCell, `${crzCg}`],
                    [`\xa0${store.dataLink}`, `${store.stepSizeLabel}`, `${store.perfUplinkHeader}`],
                    [`${store.requestData}`, `${stepSizeCell}`],
                    ["__FMCSEPARATOR"],
                    ["\<INDEX", "THRUST LIM>"]
                ]);
            }
            updateView();

            /* RSK3 */
            fmc.onRightInput[2] = () => {
                let value = fmc.inOut;
                if (value >= -99 && value <= -1) {
                    fmc.clearUserInput();
                    SaltyDataStore.set("PERF_MIN_FUEL_TEMP", value);
                } else {
                    fmc.showErrorMessage(fmc.defaultInputErrorMessage);
                }
                updateView();
            };

            /* 
                LSK5
                REQUEST DATA
                REJECT DATA
            */    
            fmc.onLeftInput[4] = () => {
                if (!fmc.simbrief.perfUplinkReady && !fmc.simbrief.perfSending) {
                    store.requestData = "\xa0SENDING";
                    fmc.simbrief.perfSending = true;
                    updateView();
                    const getInfo = async () => {
                        getSimBriefPlan(fmc, store, updateView);
                    };

                    getInfo()
                        .then(() => {
                            setTimeout(
                                function() {
                                    fmc.simbrief.perfSending = false;
                                    updateView();
                                }, fmc.getUplinkDelay()
                            );
                    });
                } else if (!fmc.simbrief.perfSending) {
                    fmc.simbrief.perfUplinkReady = false;
                    updateView();
                }
            };

            /*
                RSK5
                1. STEP SIZE
                2. ACCEPT DATA
            */
            fmc.onRightInput[4] = () => {
                if (!fmc.simbrief.perfUplinkReady) {
                    let value = fmc.inOut;
                    if (value == "RVSM" || value == "ICAO") {
                        fmc.clearUserInput();
                        SaltyDataStore.set("PERF_STEP_SIZE", value);
                    } else if (value == "R") {
                        fmc.clearUserInput();
                        SaltyDataStore.set("PERF_STEP_SIZE", "RVSM");
                    } else if (value == "I") {
                        fmc.clearUserInput();
                        SaltyDataStore.set("PERF_STEP_SIZE", "ICAO");
                    } else if (parseInt(value) <= 9900 && parseInt(value) >= 100) {
                        fmc.clearUserInput();
                        value = parseInt(value);
                        value = (value / 100).toFixed(0);
                        value = value * 100;
                        SaltyDataStore.set("PERF_STEP_SIZE", value.toString());
                    }
                    else {
                        fmc.showErrorMessage(fmc.defaultInputErrorMessage);
                    }
                } else {
                    fmc.simbrief.perfUplinkReady = false;
                    const insertInfo = async () => {
                        insertPerfUplink(fmc, updateView);

                        loadFuel(fmc, updateView);  // needs to be called here for the values to be set
                    };
                    insertInfo()
                        .then(() => {
                            setTimeout(
                                function() {
                                    updateView();
                                }, fmc.getInsertDelay()
                            );
                        }
                    );
                }
            };

            fmc.onLeftInput[5] = () => { B747_8_FMC_InitRefIndexPage.ShowPage1(fmc); };
            fmc.onRightInput[5] = () => { FMCThrustLimPage.ShowPage1(fmc); };
        });
    }
}

async function loadFuel(fmc, updateView) {
    let currentBlockFuel = fmc.simbrief.blockFuel;

    // convert to kgs
    if (fmc.simbrief.units == "lbs") {
        currentBlockFuel = currentBlockFuel / 2.204623;
    }

    // round up to nearest even number, this helps the distribution out, but might not be needed since we don't get a float from Simbrief?
    currentBlockFuel = Math.ceil(currentBlockFuel);
    if (currentBlockFuel % 2) currentBlockFuel++;   // even number so it divides right

    updateView();

    const outerTankCapacity = 4482; // Main 1 & 4 tanks - Value from flight_model.cfg
    const innerTankCapacity = 12546; // Main 2 & 3 tanks - Value from flight_model.cfg
    const centerTankCapacity = 17164; // Center - Value from flight_model.cfg
    const reserveTankCapacity = 1322; // tip - Value from flight_model.cfg

    const fuelWeightPerGallon = SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilograms");
    let currentBlockFuelInGallons = +currentBlockFuel / +fuelWeightPerGallon;

    // get an even distrib for the 4 main tanks
    const mainTankFill = Math.min(innerTankCapacity, currentBlockFuelInGallons / 4);

    // empty stab tank for load
    await SimVar.SetSimVarValue(`FUEL TANK CENTER2 QUANTITY`, "Gallons", 0);       // STAB TANK

    // main 1 and 4 tanks
    const outerTankFill = Math.min(outerTankCapacity, mainTankFill);
    await SimVar.SetSimVarValue(`FUEL TANK LEFT AUX QUANTITY`, "Gallons", outerTankFill);
    await SimVar.SetSimVarValue(`FUEL TANK RIGHT AUX QUANTITY`, "Gallons", outerTankFill);
    currentBlockFuelInGallons -= outerTankFill * 2;

    // main 2 and 3 tanks
    const innerTankFill = Math.min(innerTankCapacity, currentBlockFuelInGallons / 2);
    await SimVar.SetSimVarValue(`FUEL TANK LEFT MAIN QUANTITY`, "Gallons", innerTankFill);
    await SimVar.SetSimVarValue(`FUEL TANK RIGHT MAIN QUANTITY`, "Gallons", innerTankFill);
    currentBlockFuelInGallons -= innerTankFill * 2;

    // center tank
    const centerTankFill = Math.min(centerTankCapacity, currentBlockFuelInGallons);
    await SimVar.SetSimVarValue(`FUEL TANK CENTER QUANTITY`, "Gallons", centerTankFill);
    currentBlockFuelInGallons -= centerTankFill;

    // reserve tanks
    const reserveTankFill = Math.min(reserveTankCapacity, currentBlockFuelInGallons / 2);
    await SimVar.SetSimVarValue(`FUEL TANK LEFT TIP QUANTITY`, "Gallons", reserveTankFill);
    await SimVar.SetSimVarValue(`FUEL TANK RIGHT TIP QUANTITY`, "Gallons", reserveTankFill);
    currentBlockFuelInGallons -= reserveTankFill * 2;

    fmc.updateFuelVars();

    updateView();
}
FMCPerfInitPage._timer = 0;
//# sourceMappingURL=B747_8_FMC_PerfInitPage.js.map