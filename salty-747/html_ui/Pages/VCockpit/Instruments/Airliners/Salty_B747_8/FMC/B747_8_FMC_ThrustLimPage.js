class FMCThrustLimPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        FMCThrustLimPage._timer = 0;
        fmc.pageUpdate = () => {
            FMCThrustLimPage._timer++;
            if (FMCThrustLimPage._timer >= 20) {
                FMCThrustLimPage.ShowPage1(fmc);
            }
        };
        let selectedTemp = fmc.getThrustTakeOffTemp();
        let selectedTempCell = selectedTemp == -1 ? '--' : selectedTemp + "°C";
        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (fmc.setThrustTakeOffTemp(value)) {
                FMCThrustLimPage.ShowPage1(fmc); 
            }
        };
        let toN1Cell = SimVar.GetSimVarValue('L:74S_FMC_REF_N1', 'number').toFixed(1) + "%";
        let oatValue = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");
        let oatCell = oatValue.toFixed(0) + "°C\xa0\xa0\xa0";
        let thrustTOMode = fmc.getThrustTakeOffMode();
        let thrustClimbMode = fmc.getThrustCLBMode();
        fmc.onLeftInput[1] = () => {
            fmc.setThrustTakeOffMode(0);
            fmc.setThrustCLBMode(0);

            FMCThrustLimPage.ShowPage1(fmc);
        };
        fmc.onLeftInput[2] = () => {
            fmc.setThrustTakeOffMode(1);
            fmc.setThrustCLBMode(1);
            FMCThrustLimPage.ShowPage1(fmc);
        };
        fmc.onLeftInput[3] = () => {
            fmc.setThrustTakeOffMode(2);
            fmc.setThrustCLBMode(2);
            FMCThrustLimPage.ShowPage1(fmc);
        };
        fmc.onRightInput[1] = () => {
            fmc.setThrustCLBMode(0);
            FMCThrustLimPage.ShowPage1(fmc);
        };
        fmc.onRightInput[2] = () => {
            fmc.setThrustCLBMode(1);
            FMCThrustLimPage.ShowPage1(fmc);
        };
        fmc.onRightInput[3] = () => {
            fmc.setThrustCLBMode(2);
            FMCThrustLimPage.ShowPage1(fmc);
        };
        fmc.setTemplate([
            ["THRUST LIM"],
            ["\xa0SEL", "TO N1", "OAT\xa0\xa0\xa0\xa0"],
            [selectedTempCell, toN1Cell, oatCell],
            [""],
            [`&ltTO${thrustTOMode == 0 ? "\xa0\xa0\xa0\xa0<SEL>" : ""}`, (thrustClimbMode == 0 ? "<ARM>\xa0\xa0\xa0\xa0" : "") + "CLB>"],
            ["\xa0TO 1"],
            [`&lt-20%${thrustTOMode == 1 ? "\xa0\xa0<SEL>" : ""}`, (thrustClimbMode == 1 ? "<ARM>\xa0\xa0" : "") + "CLB 1>"],
            ["\xa0TO 2"],
            [`&lt-20%${thrustTOMode == 2 ? "\xa0\xa0<SEL>" : ""}`, (thrustClimbMode == 2 ? "<ARM>\xa0\xa0" : "") + "CLB 2>"],
            [""],
            [],
            ["__FMCSEPARATOR"],
            ["\<INDEX", "TAKEOFF>"]
        ]);
        fmc.onLeftInput[5] = () => { B747_8_FMC_InitRefIndexPage.ShowPage1(fmc); };
        fmc.onRightInput[5] = () => { FMCTakeOffPage.ShowPage1(fmc); };
    }
}
//# sourceMappingURL=B747_8_FMC_ThrustLimPage.js.map