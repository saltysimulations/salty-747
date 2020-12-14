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
            grossWeightCell = fmc.getWeight(true).toFixed(0);
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
            crzAltCell = fmc.cruiseFlightLevel.toFixed(0);
        }
        fmc.onRightInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (fmc.setCruiseFlightLevelAndTemperature(value)) {
                FMCPerfInitPage.ShowPage1(fmc);
            }
        };
        let blockFuelCell = "□□□.□";
        if (isFinite(fmc.getBlockFuel(true))) {
            blockFuelCell = fmc.getBlockFuel(true).toFixed(1) + " lb";
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
        let costIndex = "□□□";
        if (fmc.costIndex) {
            costIndex = fmc.costIndex + "[color]blue";
        }
        const updateView = () => {
            fmc.setTemplate([
                ["PERF INIT"],
                ["\xa0GR WT", "CRZ ALT"],
                [grossWeightCell, crzAltCell],
                ["\xa0FUEL", "COST INDEX"],
                [blockFuelCell, costIndex],
                ["\xa0ZFW", "MIN FUEL TEMP"],
                [zeroFuelWeightCell, "-37°c"],
                ["\xa0RESERVES", "CRZ CG"],
                ["□□□.□", "20.0%"],
                ["\xa0REQUEST", "STEP SIZE"],
                [`${store.requestData}`, "RVSM"],
                ["__FMCSEPARATOR"],
                ["<INDEX", "THRUST LIM>"]
            ]);
        }
        updateView();
        
        fmc.onLeftInput[4] = () => {
            store.requestData = "SENDING\xa0";
            updateView();
            const get = async () => {
                getSimBriefPlan(fmc, updateView);
            };

            get()
                .then(() => {
                    insertRteUplink();
                setTimeout(() => {
                }, 900);
            });
        };

        fmc.onLeftInput[5] = () => {
            B747_8_FMC_InitRefIndexPage.ShowPage1(fmc);
        };

        fmc.onRightInput[5] = () => {
            FMCThrustLimPage.ShowPage1(fmc);
        };
    }
}
FMCPerfInitPage._timer = 0;
//# sourceMappingURL=B747_8_FMC_PerfInitPage.js.map