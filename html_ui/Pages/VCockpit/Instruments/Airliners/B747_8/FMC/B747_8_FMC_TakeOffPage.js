class FMCTakeOffPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        FMCTakeOffPage._timer = 0;
        let units = false;
        if (!mc._unitIsMetric) {
            units = true;
        }
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
        let vR = "---[color]blue";
        if (fmc.vRSpeed) {
            vR = fmc.vRSpeed + "KT[color]blue";
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
        let v2 = "---[color]blue";
        if (fmc.v2Speed) {
            v2 = fmc.v2Speed + "KT[color]blue";
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
                if (Simplane.getIsGrounded() && Simplane.getV1Airspeed() <= 0 && Simplane.getVRAirspeed() <= 0 && Simplane.getV2Airspeed() <= 0) {
                    fmc.currentFlightPhase = FlightPhase.FLIGHT_PHASE_TAKEOFF;
                }
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
            ["TAKE OFF"],
            ["FLAPS", "V1"],
            [flapsCell, v1],
            ["E/O ACCEL HT", "VR"],
            ["000FT", vR],
            ["THR REDUCTION", "V2"],
            [thrRedCell, v2],
            ["WIND/SLOPE", "CG", "TRIM"],
            ["H00/U0.0", cgCell, trimCell],
            ["RW COND", "POS"],
            ["DRY", runwayCell],
            ["__FMCSEPARATOR"],
            ["\<INDEX", "THRUST LIM>"]
        ]);
        fmc.onLeftInput[5] = () => { B747_8_FMC_InitRefIndexPage.ShowPage1(fmc); };
        fmc.onRightInput[5] = () => { FMCThrustLimPage.ShowPage1(fmc); };
    }
}
FMCTakeOffPage._timer = 0;
//# sourceMappingURL=B747_8_FMC_TakeOffPage.js.map