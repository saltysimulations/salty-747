class B747_8_FMC_VNAVPage {

    /* PAGE 1 - VNAV CLIMB - */
    static ShowPage1(fmc) {

        /* Climb Page Refresh Timer */
        fmc.clearDisplay();
        B747_8_FMC_VNAVPage._timer = 0;
        fmc.pageUpdate = () => {
            B747_8_FMC_VNAVPage._timer++;
            if (B747_8_FMC_VNAVPage._timer >= 35) {
                if (fmc.flightPhaseHasChangedToCruise === true) {
                    fmc.flightPhaseHasChangedToCruise = false;
                    B747_8_FMC_VNAVPage.ShowPage2(fmc);
                }
                else if (fmc.flightPhaseHasChangedToDescent === true) {
                    fmc.flightPhaseHasChangedToDescent = false;
                    B747_8_FMC_VNAVPage.ShowPage3(fmc);
                }
                else {
                    B747_8_FMC_VNAVPage.ShowPage1(fmc);
                }
            }
        };

        /* Climb Page Title, 0 - ECON, 1 - MCP SPD, 2 - Fixed CAS, 3 - Fixed Mach, 4 - Envelope Limited */
        let clbPageTitle = "\xa0\xa0\xa0\xa0";
        if (Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_CLIMB) {
            clbPageTitle = "ACT ";
        }
        let clbSpeedModeCell = "\xa0SEL SPD";
        let clbMode = SimVar.GetSimVarValue("L:SALTY_VNAV_CLB_MODE", "Enum");
        if (SimVar.GetSimVarValue("L:AP_SPEED_INTERVENTION_ACTIVE", "number") == 1) {
            SimVar.SetSimVarValue("L:SALTY_VNAV_CLB_MODE", "Enum", 1);
        }
        switch (clbMode) {
            case 0:
                clbPageTitle += "ECON CLB";
                clbSpeedModeCell = "\xa0ECON SPD";
                break;
            case 1:
                clbPageTitle += "MCP SPD CLB";
                break;
            case 2:
                clbPageTitle += SimVar.GetSimVarValue("L:SALTY_VNAV_CLB_SPEED", "knots").toFixed(0) + "KT CLB";
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
            if (Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_CLIMB) {
                crzAltCell += "[color]magenta";
            }
        }
        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (fmc.setCruiseFlightLevelAndTemperature(value)) {
                B747_8_FMC_VNAVPage.ShowPage1(fmc);
            }
        };

        /* LSK 2L  - Climb Speed */
        let clbSpeedCell = fmc.getClbManagedSpeed(true).toFixed(0);
        let machMode = Simplane.getAutoPilotMachModeActive();
        if (clbMode === 2) {
            clbSpeedCell = SimVar.GetSimVarValue("L:SALTY_VNAV_CLB_SPEED", "knots").toFixed(0);
        }
        if (Simplane.getAltitude() > 10000 && Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_CLIMB) {
            clbSpeedCell += "[color]magenta";
        }
        if (fmc.getCrzMach() !== 1 && clbMode !== 2) {
            if (Simplane.getAltitude() > 10000 && Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_CLIMB) {
                if (machMode) {
                    clbSpeedCell = fmc.getClbManagedSpeed(true).toFixed(0) + "/{magenta}" + fmc.getCrzMach().toFixed(3).substring(1) + "{end}";
                }
                else {
                    clbSpeedCell = "{magenta}" + fmc.getClbManagedSpeed(true).toFixed(0) + "{end}/" + fmc.getCrzMach().toFixed(3).substring(1);
                }
            }
            else {
                clbSpeedCell = fmc.getClbManagedSpeed(true).toFixed(0) + "/" + fmc.getCrzMach().toFixed(3).substring(1);
            }
        }
        if (Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_CLIMB && SimVar.GetSimVarValue("L:AP_VNAV_ACTIVE", "bool") && clbMode == 1) {
            if (machMode) {
                clbSpeedCell = Simplane.getAutoPilotMachHoldValue().toFixed(3).substring(1);
            } else {
                clbSpeedCell = Simplane.getAutoPilotAirspeedHoldValue().toFixed(0);
            }
            clbSpeedCell += "[color]magenta";
        }
        if (isNaN(fmc.cruiseFlightLevel)) {
            clbSpeedCell = "";
        }

        fmc.onLeftInput[1] = () => {
            let value = fmc.inOut;
            if (value === "DELETE" && !SimVar.GetSimVarValue("L:AP_SPEED_INTERVENTION_ACTIVE", "number")) {
                fmc.inOut = "";
                SimVar.SetSimVarValue("L:SALTY_VNAV_CLB_MODE" , "Enum", 0);
                B747_8_FMC_VNAVPage.ShowPage1(fmc);
            }
            else {
                value = parseFloat(fmc.inOut);
                fmc.clearUserInput();
                if (150 < value && value < 360) {
                    SimVar.SetSimVarValue("L:SALTY_VNAV_CLB_SPEED", "knots", value);
                    SimVar.SetSimVarValue("L:SALTY_VNAV_CLB_MODE" , "Enum", 2);
                    B747_8_FMC_VNAVPage.ShowPage1(fmc);
                }
                else {
                    fmc.showErrorMessage("INVALID ENTRY");
                }
            }
        };

        /* LSK 3L  - Speed Transition */
        let spdTransCell = "---";
        let flapsUPmanueverSpeed = SimVar.GetSimVarValue("L:SALTY_VREF30", "knots") + 80;
        let transSpeed = Math.max(flapsUPmanueverSpeed + 20, 250);
        let spdRestr = SimVar.GetSimVarValue("L:SALTY_SPEED_RESTRICTION", "knots");
        let spdRestrAlt = SimVar.GetSimVarValue("L:SALTY_SPEED_RESTRICTION_ALT", "feet");
        if (isFinite(transSpeed)) {
            spdTransCell = transSpeed.toFixed(0);
            if (Simplane.getAltitude() < 10000 && Simplane.getAltitude() > spdRestrAlt && Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_CLIMB) {
                if (clbMode !== 1) {
                    spdTransCell = "{magenta}" + spdTransCell + "{end}";
                }
            }
            spdTransCell += "/10000";
        }

        /* LSK 3R  - Transition Altitude */
        let transAltCell = "";
        let origin = fmc.flightPlanManager.getOrigin();
        if (origin) {
            if (origin.infos.transitionAltitude) {
                let transitionAltitude = origin.infos.transitionAltitude;
                transAltCell = transitionAltitude.toFixed(0);
            }
        }

        /* LSK 4L  - Speed Restriction */
        let spdRestrCell = "---/-----";
        if (spdRestr !== 0) {
            if (Simplane.getAltitude() < spdRestrAlt && Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_CLIMB && clbMode !== 1) {
                spdRestrCell = "{magenta}" + parseInt(spdRestr) + "{end}/" + parseInt(spdRestrAlt);
            }
            else {
                spdRestrCell = parseInt(spdRestr) + "/" + parseInt(spdRestrAlt);
            }
        }
        fmc.onLeftInput[3] = () => {
            let value = fmc.inOut;
            if (value === "DELETE") {
                fmc.inOut = ""
                fmc.setSpeedRestriction(0, 0, false);
                B747_8_FMC_VNAVPage.ShowPage1(fmc);
            }
            else {
                let rSpeed = value.split("/")[0];
                rSpeed = parseInt(rSpeed);
                let rAlt = value.split("/")[1];
                rAlt = parseInt(rAlt);
                if ((rSpeed > 100 && rSpeed < 399) && (rAlt > 0 && rAlt < 45100)) {
                    fmc.setSpeedRestriction(rSpeed, rAlt, false);
                    fmc.inOut = "";
                    B747_8_FMC_VNAVPage.ShowPage1(fmc);
                }
                else {
                    fmc.showErrorMessage("INVALID ENTRY");
                }
            }
        };

        /* LSK 4R  - Max Angle */
        let maxAngleCell = (flapsUPmanueverSpeed).toFixed(0);

        /* LSK 5L  - ECON Button */
        let lsk5lCell = "";
        if (clbMode !== 0 && clbMode !== 1) [
            lsk5lCell = "<ECON"
        ]
        fmc.onLeftInput[4] = () => {
            if (clbMode !== 0 && clbMode !== 1) {
                SimVar.SetSimVarValue("L:SALTY_VNAV_CLB_MODE" , "Enum", 0);
                B747_8_FMC_VNAVPage.ShowPage1(fmc);
            }
        };

        /* Climb Page Template */
        fmc.setTemplate([
            [clbPageTitle, "1", "3"],
            ["\xa0CRZ ALT"],
            [crzAltCell],
            [clbSpeedModeCell],
            [clbSpeedCell],
            ["\xa0SPD TRANS", "TRANS ALT"],
            [spdTransCell, transAltCell],
            ["\xa0SPD RESTR", "MAX ANGLE"],
            [spdRestrCell, maxAngleCell],
            ["__FMCSEPARATOR"],
            [lsk5lCell, "ENG OUT>"],
            [],
            ["", "CLB DIR>"]
        ]);
        fmc.onNextPage = () => { B747_8_FMC_VNAVPage.ShowPage2(fmc); };
    }

    /* PAGE 2 - VNAV CRUISE - */
    static ShowPage2(fmc) {
        fmc.clearDisplay();
        B747_8_FMC_VNAVPage._timer = 0;
        fmc.pageUpdate = () => {
            B747_8_FMC_VNAVPage._timer++;
            if (B747_8_FMC_VNAVPage._timer >= 35) {
                if (fmc.flightPhaseHasChangedToDescent === true) {
                    fmc.flightPhaseHasChangedToDescent = false;
                    B747_8_FMC_VNAVPage.ShowPage3(fmc);
                }
                else {
                    B747_8_FMC_VNAVPage.ShowPage2(fmc);
                }
            }
        };

        /* Cruise Page Title, 0 - ECON, 1 - LRC, 2 - MCP SPD, 3 - Fixed CAS, 4 - Fixed Mach, 5 - Envelope Limited */
        let crzMode = SimVar.GetSimVarValue("L:SALTY_VNAV_CRZ_MODE", "Enum");
        let crzPageTitle = "\xa0\xa0\xa0\xa0";
        let crzSpeedModeCell = "\xa0SEL SPD";
        if (Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_CRUISE) {
            crzPageTitle = "ACT ";
        }
        if (SimVar.GetSimVarValue("L:AP_SPEED_INTERVENTION_ACTIVE", "number") == 1) {
            SimVar.SetSimVarValue("L:SALTY_VNAV_CRZ_MODE", "Enum", 2);
        }
        switch (SimVar.GetSimVarValue("L:SALTY_VNAV_CRZ_MODE", "Enum")) {
            case 0:
                crzPageTitle += "ECON CRZ";
                crzSpeedModeCell = "\xa0ECON SPD";
                break;
            case 1:
                crzPageTitle += "LRC CRZ";
                crzSpeedModeCell = "\xa0LRC";
                break;
            case 2:
                crzPageTitle += "MCP SPD CRZ";
                crzSpeedModeCell = "\xa0SEL SPD";
                break;
            case 3:
                crzPageTitle +=  SimVar.GetSimVarValue("L:SALTY_CRZ_SPEED", "knots").toFixed(0) + "KT CRZ";
                crzSpeedModeCell = "\xa0SEL SPD";
                break;
            case 4:
                let machString = SimVar.GetSimVarValue("L:SALTY_CRZ_MACH", "mach").toFixed(3);
                crzPageTitle += "M." + machString.slice(2 , 5) + " CRZ";
                crzSpeedModeCell = "\xa0SEL SPD";
                break;
            case 5:
                crzPageTitle += "LIM SPD CRZ";
                crzSpeedModeCell = "\xa0SEL SPD";
                break;
        }

        /* LSK 1L  - Cruise Alt */
        let crzAltCell = "□□□□□";
        if (fmc.cruiseFlightLevel) {
            crzAltCell = "FL" + fmc.cruiseFlightLevel;
            if (Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_CRUISE) {
                crzAltCell = "{magenta}FL" + fmc.cruiseFlightLevel + "{end}";
            }
        }
        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (fmc.setCruiseFlightLevelAndTemperature(value)) {
                B747_8_FMC_VNAVPage.ShowPage2(fmc);
            }
        };

        /* LSK 2L  - Cruise Speed */
        let crzSpeedCell = ""
        let crzSpeed = fmc.getCrzManagedSpeed(true);
        let crzMach = fmc.getCrzMach();
        if (crzMach !== 1) {
            crzSpeedCell = crzMach.toFixed(3).substring(1);
        }
        else {
            crzSpeedCell = crzSpeed.toFixed(0);
        }
        if (Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_CRUISE && SimVar.GetSimVarValue("L:AP_VNAV_ACTIVE", "bool") && crzMode === 2) {
            let machMode = Simplane.getAutoPilotMachModeActive();
            if (machMode) {
                let crzMachNo = Simplane.getAutoPilotMachHoldValue().toFixed(3);
                var radixPos = crzMachNo.indexOf('.');
                crzSpeedCell = crzMachNo.slice(radixPos);
            } else {
                crzSpeedCell = Simplane.getAutoPilotAirspeedHoldValue().toFixed(0);
            }
        }
        else if (crzMode === 3) {
            crzSpeedCell = crzSpeed.toFixed(0);
        }
        else if (crzMode === 4) {
            crzSpeedCell = SimVar.GetSimVarValue("L:SALTY_CRZ_MACH", "mach").toFixed(3).substring(1);
        }
        if (Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_CRUISE) {
            crzSpeedCell += "[color]magenta";
        }
        if (isNaN(crzSpeed) || isNaN(crzMach)) {
            crzSpeedCell = "";
        }
        fmc.onLeftInput[1] = () => {
            let value = fmc.inOut;
            if (crzMode === 2) {
                fmc.showErrorMessage("INVALID ENTRY");
            }
            else if (value === "DELETE" && !SimVar.GetSimVarValue("L:AP_SPEED_INTERVENTION_ACTIVE", "number")) {
                fmc.inOut = "";
                fmc.setEconCruiseSpeed();
                B747_8_FMC_VNAVPage.ShowPage2(fmc);
            }
            else {
                fmc.clearUserInput();
                if (value.charAt(0) == ".") {
                    value = value.substring(0);
                    value = parseFloat(value);
                    let speedFromMach = SimVar.GetGameVarValue("FROM MACH TO KIAS", "number", value);
                    SimVar.SetSimVarValue("L:SALTY_CRZ_MACH", "mach", value);
                    SimVar.SetSimVarValue("L:SALTY_CRZ_SPEED", "knots", speedFromMach);
                    SimVar.SetSimVarValue("L:SALTY_VNAV_CRZ_MODE" , "Enum", 4);
                    if (Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_CRUISE) {
                        fmc.managedMachOn();
                    }
                }
                else if (150 < value && value < 360) {
                    value = parseFloat(value);
                    SimVar.SetSimVarValue("L:SALTY_CRZ_SPEED", "knots", value);
                    SimVar.SetSimVarValue("L:SALTY_VNAV_CRZ_MODE" , "Enum", 3);
                    if (Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_CRUISE) {
                        fmc.managedMachOff();
                    }
                }
                else {
                    fmc.showErrorMessage("INVALID ENTRY");
                }
            }
        };

        /* LSK 3L  - N1 */
        let n1Cell = "--%";
        let n1Value = fmc.getThrustClimbLimit();
        if (isFinite(n1Value)) {
            n1Cell = n1Value.toFixed(1) + "%";
        }

        /* Maximum Flight level - Calculates uses linear regression derived formula from actual aircraft data */
        let currentWeight = SimVar.GetSimVarValue("TOTAL WEIGHT", "kilograms");
        let maxFltLevel = Math.min(431,(((-0.04894505 * currentWeight) + 54680.43956044) / 100));
        let optFltLevel  = Math.min(431,(((-0.06056044 * currentWeight) + 56063.51648352) / 100)) ;
        let recmdFltLevel = Math.round(optFltLevel / 10) * 10;

        /* LSK 5L  - ECON Button */
        let lsk5lCell = "";

        if (crzMode !== 0 && crzMode !== 2) [
            lsk5lCell = "<ECON"
        ]
        fmc.onLeftInput[4] = () => {
            if (crzMode !== 0 && crzMode !== 2) {
                SimVar.SetSimVarValue("L:SALTY_VNAV_CRZ_MODE" , "Enum", 0);
                B747_8_FMC_VNAVPage.ShowPage2(fmc);
            }
        };

        /* Cruise Page Template */
        fmc.setTemplate([
            [crzPageTitle, "2", "3"],
            ["\xa0CRZ ALT", "STEP TO"],
            [crzAltCell],
            [crzSpeedModeCell, "AT"],
            [crzSpeedCell],
            ["\xa0N1"],
            [n1Cell],
            ["\xa0STEP", "MAX\xa0\xa0\xa0RECMD", "OPT\xa0\xa0\xa0\xa0\xa0\xa0"],
            ["RVSM", "FL" + recmdFltLevel.toFixed(0), "\xa0FL" + optFltLevel.toFixed(0) + "\xa0\xa0" + "FL" + maxFltLevel.toFixed(0)],
            ["__FMCSEPARATOR"],
            [lsk5lCell, "ENG OUT>"],
            [],
            ["<RTA PROGRESS", "LRC>"]
        ]);
        fmc.onPrevPage = () => { B747_8_FMC_VNAVPage.ShowPage1(fmc); };
        fmc.onNextPage = () => { B747_8_FMC_VNAVPage.ShowPage3(fmc); };
    }

    /* PAGE 3 - VNAV DESCENT - */
    static ShowPage3(fmc) {
        fmc.clearDisplay();
        B747_8_FMC_VNAVPage._timer = 0;
        fmc.pageUpdate = () => {
            B747_8_FMC_VNAVPage._timer++;
            if (B747_8_FMC_VNAVPage._timer >= 35) {
                B747_8_FMC_VNAVPage.ShowPage3(fmc);
            }
        };

        /* Descent Page Title, 0 - ECON, 1 - MCP SPD, 2 - Fixed CAS, 3 - Fixed Mach, 4 - Envelope Limited, 5 - End of Descent */
        let desMode = SimVar.GetSimVarValue("L:SALTY_VNAV_DES_MODE", "Enum");
        let altitude = Simplane.getAltitude();
        let desPageTitle = "\xa0\xa0\xa0\xa0";
        let desSpeedModeCell = "\xa0SEL SPD";
        if (Simplane.getCurrentFlightPhase() >= FlightPhase.FLIGHT_PHASE_DESCENT) {
            desPageTitle = "ACT ";
        }
        if (SimVar.GetSimVarValue("L:AP_SPEED_INTERVENTION_ACTIVE", "number") == 1) {
            SimVar.SetSimVarValue("L:SALTY_VNAV_DES_MODE", "Enum", 1);
        }
        switch (SimVar.GetSimVarValue("L:SALTY_VNAV_DES_MODE", "Enum")) {
            case 0:
                desPageTitle += "ECON DES";
                desSpeedModeCell = "\xa0ECON SPD";
                break;
            case 1:
                desPageTitle += "MCP SPD DES";
                desSpeedModeCell = "\xa0SEL SPD";
                break;
            case 2:
                desPageTitle += SimVar.GetSimVarValue("L:SALTY_DES_SPEED", "knots").toFixed(0) + "KT DES";
                desSpeedModeCell = "\xa0SEL SPD";
                break;
            case 3:
                let machString = SimVar.GetSimVarValue("L:SALTY_DES_MACH", "mach").toFixed(3);
                desPageTitle += "M." + machString.slice(2, 5) + " DES";
                desSpeedModeCell = "\xa0SEL SPD";
                break;
            case 4:
                desPageTitle += "LIM SPD CRZ";
                desSpeedModeCell = "\xa0SEL SPD";
                break;
            case 5:
                desPageTitle += "END OF DES";
                desSpeedModeCell = "\xa0SEL SPD";
                break;
        }

        /* LSK 2L  - Descent Speed */
        let desSpeedCell = SimVar.GetSimVarValue("L:SALTY_DES_SPEED", "knots").toFixed(0);
        let machMode = Simplane.getAutoPilotMachModeActive();
        if (Simplane.getCurrentFlightPhase() >= FlightPhase.FLIGHT_PHASE_DESCENT && SimVar.GetSimVarValue("L:AP_VNAV_ACTIVE", "bool") && desMode === 1) {
            if (machMode) {
                let desMachNo = Simplane.getAutoPilotMachHoldValue().toFixed(3);
                var radixPos = desMachNo.indexOf('.');
                desSpeedCell = desMachNo.slice(radixPos);
            }
            else {
                desSpeedCell = Simplane.getAutoPilotAirspeedHoldValue().toFixed(0);
            }
            if (altitude > 10500) {
                desSpeedCell += "[color]magenta";
            }
        }
        else if (fmc.getCrzMach() !== 1) {
            if (Simplane.getAltitude() > 10000 && Simplane.getCurrentFlightPhase() >= FlightPhase.FLIGHT_PHASE_DESCENT) {
                if (machMode) {
                    desSpeedCell = "{magenta}" + fmc.getCrzMach().toFixed(3).substring(1) + "{end}/" + fmc.getDesManagedSpeed(true).toFixed(0);
                }
                else {
                    desSpeedCell = fmc.getCrzMach().toFixed(3).substring(1) + "/{magenta}" + fmc.getDesManagedSpeed(true).toFixed(0) + "{end}";
                }
            }
            else {
                desSpeedCell = fmc.getCrzMach().toFixed(3).substring(1) + "/" + fmc.getDesManagedSpeed(true).toFixed(0);
            }
        }
        else {
            desSpeedCell = fmc.getDesManagedSpeed(true).toFixed(0);
        }
        if (desMode === 2) {
            desSpeedCell = SimVar.GetSimVarValue("L:SALTY_DES_SPEED", "knots").toFixed(0);
            if (altitude > 10500) {
                desSpeedCell += "[color]magenta";
            }
        }
        if (isNaN(fmc.cruiseFlightLevel)) {
            desSpeedCell = "";
        }

        fmc.onLeftInput[1] = () => {
            let value = fmc.inOut;
            if (desMode === 1) {
                fmc.showErrorMessage("INVALID ENTRY");
            }
            else if (value === "DELETE" && !SimVar.GetSimVarValue("L:AP_SPEED_INTERVENTION_ACTIVE", "number")) {
                fmc.inOut = "";
                SimVar.SetSimVarValue("L:SALTY_VNAV_DES_MODE" , "Enum", 0);
                B747_8_FMC_VNAVPage.ShowPage3(fmc);
            }
            else {
                fmc.clearUserInput();
                if (150 < value && value < 360) {
                    value = parseFloat(value);
                    SimVar.SetSimVarValue("L:SALTY_DES_SPEED", "knots", value);
                    SimVar.SetSimVarValue("L:SALTY_VNAV_DES_MODE" , "Enum", 2);
                }
                else {
                    fmc.showErrorMessage("INVALID ENTRY");
                }
            }
        };

        /* LSK 3L  - Speed Transition */
        let spdRestr = SimVar.GetSimVarValue("L:SALTY_SPEED_RESTRICTION_DES", "knots");
        let spdRestrAlt = SimVar.GetSimVarValue("L:SALTY_SPEED_RESTRICTION_DES_ALT", "feet");
        let speedTransCell = "240/10000";
        if (altitude < 10500 && Simplane.getCurrentFlightPhase() >= FlightPhase.FLIGHT_PHASE_DESCENT) {
            speedTransCell = "{magenta}240{end}/10000";
        }

        /* LSK 4L  - Speed Restriction - Not used yet */
        let spdRestrCell = "---/-----";
        if (spdRestr !== 0) {
            if (Simplane.getAltitude() < spdRestrAlt && Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_DESCENT) {
                spdRestrCell = "{magenta}" + parseInt(spdRestr) + "{end}/" + parseInt(spdRestrAlt);
            }
            else {
                spdRestrCell = parseInt(spdRestr) + "/" + parseInt(spdRestrAlt);
            }
        }
        fmc.onLeftInput[3] = () => {
            let value = fmc.inOut;
            if (value === "DELETE") {
                fmc.inOut = ""
                fmc.setSpeedRestriction(0, 0, true);
                B747_8_FMC_VNAVPage.ShowPage3(fmc);
            }
            else {
                let rSpeed = value.split("/")[0];
                rSpeed = parseInt(rSpeed);
                let rAlt = value.split("/")[1];
                rAlt = parseInt(rAlt);
                if ((rSpeed > 100 && rSpeed < 399) && (rAlt > 0 && rAlt < 45100)) {
                    fmc.setSpeedRestriction(rSpeed, rAlt, true);
                    fmc.inOut = "";
                    B747_8_FMC_VNAVPage.ShowPage3(fmc);
                }
                else {
                    fmc.showErrorMessage("INVALID ENTRY");
                }
            }
        };

        fmc.setTemplate([
            [desPageTitle, "3", "3"],
            ["\xa0E/D AT"],
            [],
            [desSpeedModeCell],
            [desSpeedCell],
            ["\xa0SPD TRANS"],
            [speedTransCell],
            ["\xa0SPD RESTR"],
            [spdRestrCell],
            ["__FMCSEPARATOR"],
            ["", "FORECAST>"],
            [],
            ["\<OFFPATH DES", "DES DIR>"]
        ]);
        fmc.onPrevPage = () => { B747_8_FMC_VNAVPage.ShowPage2(fmc); };
    }
}
//# sourceMappingURL=B747_8_FMC_VNAVPage.js.map