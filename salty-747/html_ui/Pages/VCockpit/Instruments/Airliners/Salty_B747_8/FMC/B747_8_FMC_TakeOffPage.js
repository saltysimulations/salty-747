class FMCTakeOffPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        FMCTakeOffPage._timer = 0;
        fmc.pageUpdate = () => {
            FMCTakeOffPage._timer++;
            if (FMCTakeOffPage._timer >= 15) {
                FMCTakeOffPage.ShowPage1(fmc);
            }
        };
        let v1 = "---";
        if (fmc.v1Speed) {
            v1 = fmc.v1Speed + "KT";
        }
        fmc.onRightInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (value === FMCMainDisplay.clrValue) {
                fmc.trySetV1Speed(undefined);
                FMCTakeOffPage.ShowPage1(fmc);
            }
            else if (value === "") {
                fmc._computeV1Speed();
                FMCTakeOffPage.ShowPage1(fmc);
            }
            else {
                if (fmc.trySetV1Speed(value)) {
                    FMCTakeOffPage.ShowPage1(fmc);
                }
            }
        };
        let vR = "---";
        if (fmc.vRSpeed) {
            vR = fmc.vRSpeed + "KT";
        }
        fmc.onRightInput[1] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (value === FMCMainDisplay.clrValue) {
                fmc.trySetVRSpeed(undefined);
                FMCTakeOffPage.ShowPage1(fmc);
            }
            else if (value === "") {
                fmc._computeVRSpeed();
                FMCTakeOffPage.ShowPage1(fmc);
            }
            else {
                if (fmc.trySetVRSpeed(value)) {
                    FMCTakeOffPage.ShowPage1(fmc);
                }
            }
        };
        let v2 = "---";
        if (fmc.v2Speed) {
            v2 = fmc.v2Speed + "KT";
        }
        fmc.onRightInput[2] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (value === FMCMainDisplay.clrValue) {
                fmc.trySetV2Speed(undefined);
                FMCTakeOffPage.ShowPage1(fmc);
            }
            else if (value === "") {
                fmc._computeV2Speed();
                FMCTakeOffPage.ShowPage1(fmc);
            }
            else {
                if (fmc.trySetV2Speed(value)) {
                    FMCTakeOffPage.ShowPage1(fmc);
                }
            }
        };
        let flapsCell = "---";
        let flapsAngle = fmc.getTakeOffFlap();
        if (isFinite(flapsAngle) && flapsAngle >= 0) {
            flapsCell = flapsAngle.toFixed(0) + "°";
        }
        else {
            flapsCell = "□□°";
        }
        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (fmc.setTakeOffFlap(value)) {
                FMCTakeOffPage.ShowPage1(fmc);
            }
        };
        let thrustCell = "---";
        let selectedTemp = fmc.getThrustTakeOffTemp();
        let mode = Simplane.getEngineThrustTakeOffMode(0);
        let modeText = "";
        if (mode === 1) {
            modeText = "-1"; 
        }
        if (mode === 2) {
            modeText = "-2"; 
        }
        thrustCell = selectedTemp.toFixed(0) + "°\xa0\xa0\xa0TO" + modeText;
        let cgCell = "--%";
        if (isFinite(fmc.zeroFuelWeightMassCenter)) {
            cgCell = fmc.zeroFuelWeightMassCenter.toFixed(1) + "%";
        }
        let runwayCell = "---";
        let selectedRunway = fmc.flightPlanManager.getDepartureRunway();
        if (selectedRunway) {
            runwayCell = Avionics.Utils.formatRunway(selectedRunway.designation) +"/----[color]inop";
        }
        fmc.onLeftInput[2] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            fmc.setZeroFuelCG(value, (result) => {
                if (result) {
                    FMCTakeOffPage.ShowPage1(fmc);
                }
            });
        };
        let trimCell = "";
        if (isFinite(fmc.takeOffTrim)) {
            trimCell = fmc.takeOffTrim.toFixed(1);
        }
        let taxiBurn = 2;
        let grossWeight;
        let units = fmc.useLbs;
        if (units) {
            grossWeight = fmc.getWeight(true);
        }
        else {
            grossWeight = fmc.getWeight(false);
        }
        let grossWeightCell = "\xa0\xa0" + grossWeight.toFixed(1);
        let takeoffGrossWeight = grossWeight - taxiBurn;
        let takeoffGrossWeightCell = takeoffGrossWeight.toFixed(1);
        fmc.setTemplate([
            ["TAKEOFF REF" , "1", "2"],
            ["\xa0FLAPS", "V1"],
            [flapsCell, v1],
            ["\xa0THRUST", "VR"],
            [thrustCell, vR],
            ["\xa0CG", "V2"],
            [cgCell, v2],
            ["\xa0RWY/POS[color]inop", "TOGW", "\xa0\xa0GR\xa0WT"],
            [runwayCell, takeoffGrossWeightCell, grossWeightCell],
            ["\xa0REQUEST[color]inop", "REF SPDS[color]inop"],
            ["<SEND[color]inop", "OFF←→ON>[color]inop"],
            ["__FMCSEPARATOR"],
            ["\<INDEX", "THRUST LIM>"]
        ]);
        fmc.onNextPage = () => { FMCTakeOffPage.ShowPage2(fmc); };
        fmc.onLeftInput[5] = () => { B747_8_FMC_InitRefIndexPage.ShowPage1(fmc); };
        fmc.onRightInput[5] = () => { FMCThrustLimPage.ShowPage1(fmc); };
    }
    static ShowPage2(fmc) {
        fmc.clearDisplay();
        FMCTakeOffPage._timer = 0;
        fmc.pageUpdate = () => {
            FMCTakeOffPage._timer++;
            if (FMCTakeOffPage._timer >= 15) {
                FMCTakeOffPage.ShowPage2(fmc);
            }
        };
        //Placeholders for takeoff perf calculation for now
        let eoAccelHtCell = "1000FT[color]inop";
        let oatCell = "--°C[color]inop";
        let windCell = "---°/--KT[color]inop";   
        let slopeCondCell = "U0.0/DRY[color]inop";
        let limitTakeoffGrossWeightCell = "";
        
        //Acceleration Height Settable
        let accelHtCell = "";
        let airportElevation = 0;
        let origin = fmc.flightPlanManager.getOrigin();
        if (origin) {
            if(origin.altitudeinFP) {
                airportElevation = Math.round(origin.altitudeinFP / 10) * 10;
            }
        }
        let accelHt = SimVar.GetSimVarValue("L:AIRLINER_ACC_ALT", "number") - airportElevation;
        if (accelHt) {
            accelHtCell = accelHt.toFixed(0) + "FT";
        }
        fmc.onRightInput[1] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            fmc.trySetAccelerationAltitude(value, (result) => {
                if (result) {
                    FMCTakeOffPage.ShowPage2(fmc);
                }
            });
        };
        
        //Thrust Reduction Height Settable
        let thrRedCell = "";
        let armedCLBThrust = "CLB";
        let mode = Simplane.getEngineThrustTakeOffMode(0);
        if (mode === 1) {
            armedCLBThrust += "-1"; 
        }
        if (mode === 2) {
            armedCLBThrust += "-2"; 
        }
        let thrRedHt = SimVar.GetSimVarValue("L:AIRLINER_THR_RED_ALT", "number") - airportElevation;
        if (thrRedHt) {
            thrRedCell = armedCLBThrust + "\xa0\xa0\xa0\xa0" + thrRedHt.toFixed(0) + "FT";
        }
        fmc.onRightInput[2] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            fmc.trySetThrustReductionAltitude(value, (result) => {
                if (result) {
                    FMCTakeOffPage.ShowPage2(fmc);
                }
            });
        };

        fmc.setTemplate([
            ["TAKEOFF REF" , "2", "2"],
            ["STD THRUST[color]inop", "EO ACCEL HT[color]inop"],
            ["--[color]inop", eoAccelHtCell],
            ["\xa0REF OAT[color]inop", "ACCEL HT"],
            [oatCell, accelHtCell],
            ["\xa0WIND[color]inop", "THR REDUCTION"],
            [windCell, thrRedCell],
            ["\xa0RWY WIND[color]inop"],
            [],
            ["\xa0SLOPE/COND[color]inop", "STD LIM TOGW[color]inop"],
            [slopeCondCell, limitTakeoffGrossWeightCell],
            ["--------------------", "Q-CLB[color]inop"],
            ["\<INDEX", "OFF←→ARMED>[color]inop"]
        ]);
        fmc.onPrevPage = () => { FMCTakeOffPage.ShowPage1(fmc); };
        fmc.onLeftInput[5] = () => { B747_8_FMC_InitRefIndexPage.ShowPage1(fmc); };
    }
}
FMCTakeOffPage._timer = 0;
//# sourceMappingURL=B747_8_FMC_TakeOffPage.js.map