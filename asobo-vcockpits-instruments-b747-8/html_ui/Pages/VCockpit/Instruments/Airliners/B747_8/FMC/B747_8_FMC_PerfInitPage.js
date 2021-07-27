class FMCPerfInitPage {
    static ShowPage1(fmc) {
        fmc.updateFuelVars().then(() => {
            fmc.clearDisplay();
            FMCPerfInitPage._timer = 0;
            fmc.pageUpdate = () => {
                FMCPerfInitPage._timer++;
                if (FMCPerfInitPage._timer >= 15) {
                    FMCPerfInitPage.ShowPage1(fmc);
                }
            };
            let grossWeightCell = "□□□.□";
            if (isFinite(fmc.getFuelVarsUpdatedGrossWeight(true))) {
                grossWeightCell = fastToFixed(fmc.getFuelVarsUpdatedGrossWeight(true), 1) + " lb";
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
                crzAltCell = fastToFixed(fmc.cruiseFlightLevel, 0);
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
                blockFuelCell = fastToFixed(fmc.getBlockFuel(true), 1) + " lb";
            }
            let zeroFuelWeightCell = "□□□.□";
            if (isFinite(fmc.getZeroFuelWeight(true))) {
                zeroFuelWeightCell = fastToFixed(fmc.getZeroFuelWeight(true), 1) + " lb";
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
                costIndex = fastToFixed(fmc.costIndex, 0);
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
                reservesCell = fastToFixed(reserves, 1) + " lb";
            }
            fmc.onLeftInput[3] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                if (fmc.setFuelReserves(value, true)) {
                    FMCPerfInitPage.ShowPage1(fmc);
                }
            };
            fmc.setTemplate([
                ["PERF INIT"],
                ["GR WT", "CRZ ALT"],
                [grossWeightCell, crzAltCell],
                ["FUEL", "COST INDEX"],
                [blockFuelCell, costIndex],
                ["ZFW", "MIN FUEL TEMP"],
                [zeroFuelWeightCell, "-37°c"],
                ["RESERVES", "CRZ CG"],
                [reservesCell, "20.0%"],
                ["DATA LINK", "STEP SIZE"],
                ["NO COMM", "RVSM"],
                ["__FMCSEPARATOR"],
                ["\<INDEX", "THRUST LIM>"]
            ]);
            fmc.onLeftInput[5] = () => { B747_8_FMC_InitRefIndexPage.ShowPage1(fmc); };
            fmc.onRightInput[5] = () => { FMCThrustLimPage.ShowPage1(fmc); };
        });
    }
}
FMCPerfInitPage._timer = 0;
//# sourceMappingURL=B747_8_FMC_PerfInitPage.js.map