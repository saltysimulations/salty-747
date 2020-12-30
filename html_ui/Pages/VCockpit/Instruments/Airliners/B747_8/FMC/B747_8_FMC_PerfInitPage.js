class FMCPerfInitPage {
    static ShowPage1(fmc, store = {requestData: "<SEND"}) {
        fmc.clearDisplay();
        fmc.updateFuelVars();
        FMCPerfInitPage._timer = 0;
        fmc.pageUpdate = () => {
            FMCPerfInitPage._timer++;
            if (FMCPerfInitPage._timer >= 15) {
                FMCPerfInitPage.ShowPage1(fmc);
            }
        };
        let grossWeightCell = "□□□.□";
        if (isFinite(fmc.getWeight(true))) {
            grossWeightCell = fmc.getWeight(true).toFixed(1);
        }
        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            fmc.setWeight(value, result => {
                if (result) {
                    FMCPerfInitPage.ShowPage1(fmc);
                }
            }, true);
        };
        let crzAltCell = "□□□□□";
        if (isFinite(fmc.cruiseFlightLevel)) {
            if (fmc.cruiseFlightLevel < 1000) {
                crzAltCell = "FL" + fmc.cruiseFlightLevel.toFixed(0);    
            } else {
                crzAltCell = fmc.cruiseFlightLevel.toFixed(0);    
            }
        }
        let blockFuelCell = "□□□.□";
        if (isFinite(fmc.getBlockFuel(true))) {
            blockFuelCell = fmc.getBlockFuel(true).toFixed(1) + " LB";
        }
        let zeroFuelWeightCell = "□□□.□";
        if (isFinite(fmc.getZeroFuelWeight(true))) {
            zeroFuelWeightCell = fmc.getZeroFuelWeight(true).toFixed(1);
        }
        fmc.onLeftInput[2] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (fmc.trySetZeroFuelWeightZFWCG(value, true)) {
                FMCPerfInitPage.ShowPage1(fmc);
            }
        };        
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
        let fuelResCell = "□□□.□";
        if (fmc.getFuelReserves()) {
            fuelResCell = fmc.getFuelReserves();
        }
        let minFuelTempCell = SaltyDataStore.get("PERF_MIN_FUEL_TEMP", -37);
        let crzCg = "11.00%";
        let stepSize =  SaltyDataStore.get("PERF_STEP_SIZE", "RVSM");

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
                [`${fuelResCell}`, `${crzCg}[s-text]`],
                ["\xa0REQUEST", "STEP SIZE"],
                [`${store.requestData}`, `${stepSize}`],
                ["__FMCSEPARATOR"],
                ["<INDEX", "THRUST LIM>"]
            ]);
        }
        updateView();

        fmc.onLeftInput[3] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            fmc.setFuelReserves(value);
        }
        
        fmc.onLeftInput[4] = () => {
            store.requestData = "SENDING\xa0";
            updateView();
            const get = async () => {
                getSimBriefPlan(fmc, store, updateView);
            };

            get()
                .then(() => {
                    fmc.insertPerfUplink(updateView);
                setTimeout(() => {
                }, 900);
            });
        };

        fmc.onLeftInput[5] = () => {
            B747_8_FMC_InitRefIndexPage.ShowPage1(fmc);
        };

        fmc.onRightInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (fmc.setCruiseFlightLevelAndTemperature(value)) {
                FMCPerfInitPage.ShowPage1(fmc);
            }
        };

        fmc.onRightInput[2] = () => {
            let value = fmc.inOut;
            if (value >= -99 && value <= -1) {
                fmc.clearUserInput();
                SaltyDataStore.set("PERF_MIN_FUEL_TEMP", value);
            } else {
                fmc.showErrorMessage(fmc.defaultInputErrorMessage);
            }            
        };

        fmc.onRightInput[4] = () => {
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
                console.log(value);
                SaltyDataStore.set("PERF_STEP_SIZE", value.toString());
            }
            else {
                fmc.showErrorMessage(fmc.defaultInputErrorMessage);
            }            
        };

        fmc.onRightInput[5] = () => {
            FMCThrustLimPage.ShowPage1(fmc);
        };
    }
}
FMCPerfInitPage._timer = 0;
//# sourceMappingURL=B747_8_FMC_PerfInitPage.js.map