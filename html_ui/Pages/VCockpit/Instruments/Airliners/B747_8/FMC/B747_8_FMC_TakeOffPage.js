class FMCTakeOffPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        fmc.updateVSpeeds();
        FMCTakeOffPage._timer = 0;
        fmc.pageUpdate = () => {
            FMCTakeOffPage._timer++;
            if (FMCTakeOffPage._timer >= 15) {
                FMCTakeOffPage.ShowPage1(fmc);
            }
        };
        let v1 = "---[color]blue";
        if (fmc.v1Speed) {
            v1 = fmc.v1Speed + "KT[color]blue";
        }
        fmc.onRightInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (value === FMCMainDisplay.clrValue) {
                fmc.v1Speed = undefined;
                SimVar.SetSimVarValue("L:AIRLINER_V1_SPEED", "Knots", -1);
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
        let vR = "---[color]blue";
        if (fmc.vRSpeed) {
            vR = fmc.vRSpeed + "KT[color]blue";
        }
        fmc.onRightInput[1] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (value === FMCMainDisplay.clrValue) {
                fmc.vRSpeed = undefined;
                SimVar.SetSimVarValue("L:AIRLINER_VR_SPEED", "Knots", -1);
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
        let v2 = "---[color]blue";
        if (fmc.v2Speed) {
            v2 = fmc.v2Speed + "KT[color]blue";
        }
        fmc.onRightInput[2] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (value === FMCMainDisplay.clrValue) {
                fmc.v2Speed = undefined;
                SimVar.SetSimVarValue("L:AIRLINER_V2_SPEED", "Knots", -1);
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
        let thrRedCell = "";
        if (isFinite(fmc.thrustReductionAltitude)) {
            thrRedCell = fmc.thrustReductionAltitude.toFixed(0);
        }
        else {
            thrRedCell = "---";
        }
        thrRedCell += "FT[color]blue";
        fmc.onLeftInput[2] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (fmc.trySetThrustReductionAccelerationAltitude(value)) {
                FMCTakeOffPage.ShowPage1(fmc);
            }
        };
        let runwayCell = "---";
        let selectedRunway = fmc.flightPlanManager.getDepartureRunway();
        if (selectedRunway) {
            runwayCell = "RW " + Avionics.Utils.formatRunway(selectedRunway.designation);
        }
        let cgCell = "--%";
        if (isFinite(fmc.zeroFuelWeightMassCenter)) {
            cgCell = fmc.zeroFuelWeightMassCenter.toFixed(0) + "%";
        }
        fmc.onRightInput[3] = () => {
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
        fmc.setTemplate([
            ["TAKEOFF REF", "1", "2"],
            ["\xa0FLAPS", "V1"],
            [flapsCell, v1],
            ["\xa0THRUST", "VR"],
            ["000FT", vR],
            ["\xa0CG\xa0\xa0\xa0TRIM", "V2"],
            [thrRedCell, v2],
            ["\xa0RWY/POS", "TOGW", "GR WT"],
            ["H00/U0.0", cgCell, trimCell],
            ["\xa0REQUEST", "REF SPDS"],
            ["<DATA", runwayCell],
            ["__FMCSEPARATOR"],
            ["<INDEX", "THRUST LIM>"]
        ]);
        fmc.onLeftInput[5] = () => { B747_8_FMC_InitRefIndexPage.ShowPage1(fmc); };
        fmc.onRightInput[5] = () => { FMCThrustLimPage.ShowPage1(fmc); };
    }
    static ShowPage2(fmc) {
        fmc.setTemplate([
            ["TAKEOFF REF", "2", "2"],
            ["", "", "ALTN THRUST EO ACCEL HT"],
            ["<TO", "1000FT"],
            ["\xa0REF OAT", "Q-CLB AT"],
            ["26°C", "1000FT"],
            ["\xa0WIND", "CLB AT"],
            ["340°/16", "3000FT"],
            ["\xa0RWY WIND", "RESTORE RATE"],
            ["14KTH 9KTR", "SLOW ←→ FAST>"],
            ["\xa0SLOPE/COND", "STD LIM TOGW"],
            ["U0.5/WET", "368.0"],
            ["__FMCSEPARATOR", "Q_CLB"],
            ["<INDEX", "OFF ←→ ARMED>"]
        ]);
    }
}
FMCTakeOffPage._timer = 0;
//# sourceMappingURL=B747_8_FMC_TakeOffPage.js.map