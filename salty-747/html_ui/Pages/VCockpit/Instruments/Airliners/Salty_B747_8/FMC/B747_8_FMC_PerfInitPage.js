class FMCPerfInitPage {
    static ShowPage1(fmc, store = {requestData: "<SEND", loadUplink: "", purgeUplink: "__FMCSEPARATOR", dataLink: "REQUEST", stepSizeLabel: "STEP SIZE", perfUplinkHeader: ""}) {
        fmc.updateFuelVars().then(() => {
            fmc.clearDisplay();
            let units = fmc.useLbs;
            FMCPerfInitPage._timer = 0;
            fmc.pageUpdate = () => {
                FMCPerfInitPage._timer++;
                if (FMCPerfInitPage._timer >= 15) {
                    FMCPerfInitPage.ShowPage1(fmc);
                }
            };
            let grossWeightCell = "□□□.□";
            if (isFinite(fmc.getFuelVarsUpdatedGrossWeight(units))) {
                grossWeightCell = fmc.getFuelVarsUpdatedGrossWeight(units).toFixed(1);
            }
            fmc.onLeftInput[0] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                fmc.setWeight(value, result => {
                    if (result) {
                        FMCPerfInitPage.ShowPage1(fmc);
                    }
                }, units);
            };
            let crzAltCell = "□□□□□";
            if (isFinite(fmc.cruiseFlightLevel)) {
                crzAltCell = "FL" + fmc.cruiseFlightLevel.toFixed(0);
            }
            fmc.onRightInput[0] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                if (fmc.setCruiseFlightLevelAndTemperature(value)) {
                    FMCPerfInitPage.ShowPage1(fmc);
                }
            };
            let blockFuelCell = "□□□.□";
            if (isFinite(fmc.getBlockFuel(units))) {
                blockFuelCell = fmc.getBlockFuel(units).toFixed(1);
            }
            let zeroFuelWeightCell = "□□□.□";
            if (isFinite(fmc.getZeroFuelWeight(units))) {
                zeroFuelWeightCell = fmc.getZeroFuelWeight(units).toFixed(1);
            }
            let costIndex = "□□□□";
            if (isFinite(fmc.costIndex)) {
                costIndex = fmc.costIndex.toFixed(0);
            }
            fmc.onRightInput[1] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                if (fmc.tryUpdateCostIndex(value, 10000)) {
                    FMCPerfInitPage.ShowPage1(fmc);
                }
            };
            let reservesCell = "□□□.□";
            let reserves = fmc.getFuelReserves();
            if (isFinite(reserves)) {
                reservesCell = reserves.toFixed(1);
            }
            fmc.onLeftInput[3] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                if (fmc.setFuelReserves(value, units)) {
                    FMCPerfInitPage.ShowPage1(fmc);
                }
            };

            let minFuelTempCell = SaltyDataStore.get("PERF_MIN_FUEL_TEMP", -37);
            let crzCg = "11.00%";
            let stepSize =  SaltyDataStore.get("PERF_STEP_SIZE", "RVSM");
            let stepSizeCell;
            if (this.perfUplinkReady) {
                store.dataLink = "";
                store.stepSizeLabel = "";
                store.perfUplinkHeader = "----PERF INIT DATA ----";
                store.requestData = "<REJECT";
                stepSizeCell = "ACCEPT>";
                crzAltCell = "FL" + fmc.simbrief.cruiseAltitude.substr(0, fmc.simbrief.cruiseAltitude.length - 2);
                costIndex = fmc.simbrief.costIndex;
                // zeroFuelWeightCell = (parseFloat(fmc.simbrief.estZfw) / 1000).toFixed(1);
                grossWeightCell = ((parseFloat(zeroFuelWeightCell) + (parseFloat(blockFuelCell)))).toFixed(1);
                reservesCell = ((parseFloat(fmc.simbrief.finResFuel) + (parseFloat(fmc.simbrief.altnFuel))) / 1000).toFixed(1);
            } else {
                store.dataLink = "REQUEST";
                store.stepSizeLabel = "STEP SIZE";
                store.perfUplinkHeader = "";
                store.requestData = "<SEND";
                stepSizeCell = stepSize;
            }

            const updateView = () => {
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
                FMCPerfInitPage.ShowPage1(fmc);
            };

            /*
                LSK5
                REQUEST DATA
                REJECT DATA
            */
            fmc.onLeftInput[4] = () => {
                if (!this.perfUplinkReady) {
                    store.requestData = "\xa0SENDING";
                    updateView();
                    getSimBriefPlan(fmc, store).then((result) => {
                        setTimeout(() => {
                            store.requestData = "<SEND";
                            if (result) {
                                this.perfUplinkReady = true;
                                fmc.setMsg("PERF INIT UPLINK");
                                Coherent.call("PLAY_INSTRUMENT_SOUND", "uplink_chime");
                            } else {
                                fmc.showErrorMessage("WRONG PILOT ID");
                            }
                            FMCPerfInitPage.ShowPage1(fmc);
                        }, fmc.getInsertDelay());
                    });
                } else {
                    this.perfUplinkReady = false;
                    updateView();
                }
            };

            /*
                RSK5
                1. STEP SIZE
                2. ACCEPT DATA
            */
            fmc.onRightInput[4] = () => {
                if (!this.perfUplinkReady) {
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
                    } else {
                        fmc.showErrorMessage(fmc.defaultInputErrorMessage);
                    }
                } else {
                    this.perfUplinkReady = false;
                    insertPerfUplink(fmc);
                }
            };

            fmc.onLeftInput[5] = () => { B747_8_FMC_InitRefIndexPage.ShowPage1(fmc); };
            fmc.onRightInput[5] = () => { FMCThrustLimPage.ShowPage1(fmc); };
        });
    }
}
FMCPerfInitPage._timer = 0;
//# sourceMappingURL=B747_8_FMC_PerfInitPage.js.map