class B747_8_FMC_VNAVPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        B747_8_FMC_VNAVPage._timer = 0;
        fmc.pageUpdate = () => {
            B747_8_FMC_VNAVPage._timer++;
            if (B747_8_FMC_VNAVPage._timer >= 100) {
                B747_8_FMC_VNAVPage.ShowPage1(fmc);
            }
        };
        let crzAltCell = "□□□□□";
        if (fmc.cruiseFlightLevel) {
            crzAltCell = "FL" + fmc.cruiseFlightLevel;
        }
        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (fmc.setCruiseFlightLevelAndTemperature(value)) {
                B747_8_FMC_VNAVPage.ShowPage1(fmc);
            }
        };
        let speedTransCell = "---";
        let speed = fmc.getCrzManagedSpeed();
        if (isFinite(speed)) {
            speedTransCell = speed.toFixed(0);
        }
        speedTransCell += "/";
        if (isFinite(fmc.transitionAltitude)) {
            speedTransCell += fmc.transitionAltitude.toFixed(0);
        }
        else {
            speedTransCell += "-----";
        }
        fmc.setTemplate([
            ["CLB", "1", "3"],
            ["CRZ ALT"],
            [crzAltCell],
            ["ECON SPD"],
            [],
            ["SPD TRANS", "TRANS ALT"],
            [speedTransCell],
            ["SPD RESTR"],
            [],
            [],
            ["", "<ENG OUT"],
            [],
            []
        ]);
        fmc.onNextPage = () => { B747_8_FMC_VNAVPage.ShowPage2(fmc); };
    }
    static ShowPage2(fmc) {
        fmc.clearDisplay();
        B747_8_FMC_VNAVPage._timer = 0;
        fmc.pageUpdate = () => {
            B747_8_FMC_VNAVPage._timer++;
            if (B747_8_FMC_VNAVPage._timer >= 100) {
                B747_8_FMC_VNAVPage.ShowPage2(fmc);
            }
        };        
        let crzPageTitle = "ACT ECON CRZ"
        let crzSpeedMode = "ECON SPD"
        if (SimVar.GetSimVarValue("L:AP_SPEED_INTERVENTION_ACTIVE", "number") == 1) {
            crzPageTitle = "ACT MCP SPD CRZ"
            crzSpeedMode = "SEL SPD"
        }
        let crzSpeedCell = ""
        let machMode = Simplane.getAutoPilotMachModeActive();
        if (machMode) {
            let crzMachNo = Simplane.getAutoPilotMachHoldValue().toFixed(3);
            var radixPos = crzMachNo.indexOf('.');
            crzSpeedCell = crzMachNo.slice(radixPos);
        } else {
            crzSpeedCell = Simplane.getAutoPilotAirspeedHoldValue().toFixed(0);
        }
        let crzAltCell = "□□□□□";
        if (fmc.cruiseFlightLevel) {
            crzAltCell = "FL" + fmc.cruiseFlightLevel;
        }  
        fmc.onRightInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (fmc.setCruiseFlightLevelAndTemperature(value)) {
                B747_8_FMC_VNAVPage.ShowPage2(fmc);
            }
        };
        let n1Cell = "--%";
        let n1Value = fmc.getThrustClimbLimit();
        if (isFinite(n1Value)) {
            n1Cell = n1Value.toFixed(1) + "%";
        }

        let weightIndex = SimVar.GetSimVarValue("TOTAL WEIGHT", "pounds") - 608000;
        let maxFltLevel = 431
        if (weightIndex >= 0){
            maxFltLevel = 431 - (weightIndex / 362000 * 110)
        }
        fmc.setTemplate([
            [crzPageTitle, "2", "3"],
            ["CRZ ALT", "STEP TO"],
            [crzAltCell],
            [crzSpeedMode, "AT"],
            [crzSpeedCell],
            ["N1"],
            [n1Cell],
            ["STEP", "RECMD", "OPT\xa0\xa0\xa0MAX"],
            ["RVSM", "", "\xa0\xa0\xa0\xa0\xa0\xa0" + "FL" + maxFltLevel.toFixed(0)],
            ["__FMCSEPARATOR"],
            ["", "ENG OUT>"],
            [],
            ["<RTA PROGRESS", "LRC>"]
        ]);
        fmc.onPrevPage = () => { B747_8_FMC_VNAVPage.ShowPage1(fmc); };
        fmc.onNextPage = () => { B747_8_FMC_VNAVPage.ShowPage3(fmc); };
    }
    static ShowPage3(fmc) {
        fmc.clearDisplay();
        B747_8_FMC_VNAVPage._timer = 0;
        fmc.pageUpdate = () => {
            B747_8_FMC_VNAVPage._timer++;
            if (B747_8_FMC_VNAVPage._timer >= 100) {
                B747_8_FMC_VNAVPage.ShowPage3(fmc);
            }
        };
        let speedTransCell = "---";
        let speed = fmc.getDesManagedSpeed();
        if (isFinite(speed)) {
            speedTransCell = speed.toFixed(0);
        }
        speedTransCell += "/10000";
        fmc.setTemplate([
            ["DES", "3", "3"],
            ["E/D AT"],
            [],
            ["ECON SPD"],
            [],
            ["SPD TRANS", "WPT/ALT"],
            [speedTransCell],
            ["SPD RESTR"],
            [],
            ["PAUSE @ DIST FROM DEST"],
            ["OFF", "FORECAST>"],
            [],
            ["<OFFPATH DES"]
        ]);
        fmc.onPrevPage = () => { B747_8_FMC_VNAVPage.ShowPage2(fmc); };
    }
}
//# sourceMappingURL=B747_8_FMC_VNAVPage.js.map