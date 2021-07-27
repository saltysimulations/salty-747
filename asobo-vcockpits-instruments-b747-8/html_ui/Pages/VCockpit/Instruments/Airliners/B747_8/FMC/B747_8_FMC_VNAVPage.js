class B747_8_FMC_VNAVPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        let crzAltCell = "□□□□□";
        if (fmc.cruiseFlightLevel) {
            crzAltCell = fmc.cruiseFlightLevel + "FL";
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
            speedTransCell = fastToFixed(speed, 0);
        }
        speedTransCell += "/";
        if (isFinite(fmc.transitionAltitude)) {
            speedTransCell += fastToFixed(fmc.transitionAltitude, 0);
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
        let crzAltCell = "□□□□□";
        if (fmc.cruiseFlightLevel) {
            crzAltCell = fmc.cruiseFlightLevel + "FL";
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
            n1Cell = fastToFixed(n1Value, 1) + "%";
        }
        fmc.setTemplate([
            ["CRZ", "2", "3"],
            ["CRZ ALT", "STEP TO"],
            [crzAltCell],
            ["ECON SPD", "AT"],
            [],
            ["N1"],
            [n1Cell],
            ["STEP", "RECMD", "OPT MAX"],
            [],
            ["", "1X @ TOD"],
            ["", "OFF"],
            ["PAUSE @ TOD"],
            ["OFF", "<LRC"]
        ]);
        fmc.onPrevPage = () => { B747_8_FMC_VNAVPage.ShowPage1(fmc); };
        fmc.onNextPage = () => { B747_8_FMC_VNAVPage.ShowPage3(fmc); };
    }
    static ShowPage3(fmc) {
        fmc.clearDisplay();
        let speedTransCell = "---";
        let speed = fmc.getDesManagedSpeed();
        if (isFinite(speed)) {
            speedTransCell = fastToFixed(speed, 0);
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
            ["\<OFFPATH DES"]
        ]);
        fmc.onPrevPage = () => { B747_8_FMC_VNAVPage.ShowPage2(fmc); };
    }
}
//# sourceMappingURL=B747_8_FMC_VNAVPage.js.map