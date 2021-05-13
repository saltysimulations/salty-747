class B747_8_FMC_VNAVPage {
    static ShowPage1(fmc) {
        
        /* Climb Page Refresh Timer */
        fmc.clearDisplay();
        B747_8_FMC_VNAVPage._timer = 0;
        fmc.pageUpdate = () => {
            B747_8_FMC_VNAVPage._timer++;
            if (B747_8_FMC_VNAVPage._timer >= 35) {
                B747_8_FMC_VNAVPage.ShowPage1(fmc);
            }
        };
        
        /* Climb Page Title 
        0 - ECON
        1 - MCP SPD
        2 - Fixed CAS
        3 - Fixed Mach
        4 - Envelope Limited
        */
        let clbPageTitle = "ACT ";
        let clbSpeedModeCell = "SEL SPD";
        switch (SimVar.GetSimVarValue("L:SALTY_VNAV_CLB_MODE", "Enum")) {
            case 0:
                clbPageTitle += "ECON CLB";
                clbSpeedModeCell = "ECON SPD";
                break;
            case 1:
                clbPageTitle += "MCP SPD CLB";
                break;
            case 2:
                clbPageTitle += SimVar.GetSimVarValue("L:SALTY_ECON_CLB_SPEED", "knots").toFixed(0) + "KT CLB";
                break;
            case 3:
                clbPageTitle += "CLB";
                break;
            case 3:
                clbPageTitle += "LIM SPD CLB";
                break;          
        }

        /* LSK 1L  - Cruise Level */
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

        /* LSK 2L  - Climb Speed */
        let clbSpeedCell = SimVar.GetSimVarValue("L:SALTY_ECON_CLB_SPEED", "knots").toFixed(0);
        fmc.onLeftInput[1] = () => {
            let value = fmc.inOut;
            if (value === "DELETE" && !SimVar.GetSimVarValue("L:AP_SPEED_INTERVENTION_ACTIVE", "number")) {
                fmc.inOut = "";
                fmc.setEconClimbSpeed();
                B747_8_FMC_VNAVPage.ShowPage1(fmc);
            }
            else {
                value = parseFloat(fmc.inOut);
                fmc.clearUserInput();
                if (100 < value && value < 399) {
                    SimVar.SetSimVarValue("L:SALTY_ECON_CLB_SPEED", "knots", value);
                    SimVar.SetSimVarValue("L:SALTY_VNAV_CLB_MODE" , "Enum", 2);
                    B747_8_FMC_VNAVPage.ShowPage1(fmc);
                }
                else {
                    fmc.showErrorMessage("INVALID ENTRY");
                }
            }
        };


       
        
        /* LSK 3L  - Speed Trans */
        
        
        
        
        
        
        
        
        
        
        
        
        let speedTransCell = "---";
        let flapsUPmanueverSpeed = SimVar.GetSimVarValue("L:SALTY_VREF30", "knots") + 80;
        let transSpeed = Math.max(flapsUPmanueverSpeed + 20, 250); 
        if (isFinite(transSpeed)) {
            speedTransCell = transSpeed.toFixed(0);
            speedTransCell += "/10000";
        }
        let transAltCell = "";
        let origin = fmc.flightPlanManager.getOrigin();
        if (origin) {
            if (isFinite(origin.altitudeinFP)) {
                let origin = fmc.flightPlanManager.getOrigin();
                if (origin.infos.transitionAltitude) {
                    let transitionAltitude = origin.infos.transitionAltitude;
                    transAltCell = transitionAltitude.toFixed(0);
                }
            }
        }
        let maxAngleCell = (flapsUPmanueverSpeed).toFixed(0);
        fmc.setTemplate([
            [clbPageTitle, "1", "3"],
            ["\xa0CRZ ALT"],
            [crzAltCell],
            [clbSpeedModeCell],
            [clbSpeedCell],
            ["\xa0SPD TRANS", "TRANS ALT"],
            [speedTransCell, transAltCell],
            ["\xa0SPD RESTR", "MAX ANGLE"],
            ["---/-----", maxAngleCell],
            ["__FMCSEPARATOR"],
            ["<ECON", "ENG OUT>"],
            [],
            ["", "CLB DIR>"]
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
        let crzSpeedMode = "\xa0ECON SPD"
        if (SimVar.GetSimVarValue("L:AP_SPEED_INTERVENTION_ACTIVE", "number") == 1) {
            crzPageTitle = "ACT MCP SPD CRZ"
            crzSpeedMode = "\xa0SEL SPD"
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
        fmc.onLeftInput[0] = () => {
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

        //Calculate maximum Flight level - uses linear regression derived formula from actual aircraft data
        let currentWeight = SimVar.GetSimVarValue("TOTAL WEIGHT", "pounds");
        let weightLimitedFltLevel = (((-0.02809 * currentWeight) + 56571.91142) / 100);
        let maxFltLevel = Math.min(431, weightLimitedFltLevel);
        
        fmc.setTemplate([
            [crzPageTitle, "2", "3"],
            ["\xa0CRZ ALT", "STEP TO"],
            [crzAltCell],
            [crzSpeedMode, "AT"],
            [crzSpeedCell],
            ["\xa0N1"],
            [n1Cell],
            ["\xa0STEP", "RECMD", "OPT\xa0\xa0\xa0MAX"],
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
            ["\<OFFPATH DES"]
        ]);
        fmc.onPrevPage = () => { B747_8_FMC_VNAVPage.ShowPage2(fmc); };
    }
}
//# sourceMappingURL=B747_8_FMC_VNAVPage.js.map