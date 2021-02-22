class FMCThrustLimPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        let selectedTempCell = fmc.getThrustTakeOffTemp();
        if (selectedTempCell === null) {
            selectedTempCell = "--";
        }
        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (fmc.setThrustTakeOffTemp(value)) {
                FMCThrustLimPage.ShowPage1(fmc);
            }
        };
        let toN1Cell = fmc.getThrustTakeOffLimit().toFixed(1) + "%";
        let clbN1Cell = fmc.getThrustClimbLimit().toFixed(1) + "%";
        let oatValue = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");
        let oatCell = oatValue.toFixed(0) + "°C";
        let thrustTOMode = fmc.getThrustTakeOffMode();
        let thrustClimbMode = fmc.getThrustCLBMode();
        fmc.onLeftInput[1] = () => {
            if (Simplane.getIsGrounded()) {
                fmc.setThrustTakeOffMode(0);
                fmc.setThrustCLBMode(0);
                FMCThrustLimPage.ShowPage1(fmc);
            }
            else {
                fmc.setThrustCLBMode(3);
                FMCThrustLimPage.ShowPage1(fmc);
            }
            
        };
        fmc.onLeftInput[2] = () => {
            if (Simplane.getIsGrounded()) {
                fmc.setThrustTakeOffMode(1);
                fmc.setThrustCLBMode(1);
                FMCThrustLimPage.ShowPage1(fmc);
            }
            else {
                fmc.setThrustCLBMode(4);
                FMCThrustLimPage.ShowPage1(fmc);
            }
        };
        fmc.onLeftInput[3] = () => {
            if (Simplane.getIsGrounded()) {
                fmc.setThrustTakeOffMode(2);
                fmc.setThrustCLBMode(2);
                FMCThrustLimPage.ShowPage1(fmc);
            }
            else {
                fmc.setThrustCLBMode(5);
                FMCThrustLimPage.ShowPage1(fmc);
            }
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
            [(Simplane.getIsGrounded() ? "SEL" : ""), (Simplane.getIsGrounded() ? "TO N1" : "CLB N1"), (Simplane.getIsGrounded() ? "OAT" : "")],
            [(Simplane.getIsGrounded() ? selectedTempCell + "°": ""),(Simplane.getIsGrounded() ? toN1Cell : clbN1Cell), (Simplane.getIsGrounded() ? oatCell : "")],
            [""],
            [(Simplane.getIsGrounded() ? "TO" + (thrustTOMode === 0 ? " <SEL>" : "") : "GA" + (thrustClimbMode === 3 ? " <SEL>" : "")), (Simplane.getIsGrounded() ? (thrustClimbMode === 0 ? "<ARM> " : "") : "<SEL> ") + "CLB>"],
            [(Simplane.getIsGrounded() ? "TO 1" : "")],
            [(Simplane.getIsGrounded() ? "-10%" + (thrustTOMode === 1 ? " <SEL>" : "") : "CON" + (thrustClimbMode === 4 ? " <SEL>" : "")), (Simplane.getIsGrounded() ? (thrustClimbMode === 1 ? "<ARM> " : "") : "<SEL> ") + "CLB 1>"],
            [(Simplane.getIsGrounded() ? "TO 2" : "")],
            [(Simplane.getIsGrounded() ? "-20%" + (thrustTOMode === 2 ? " <SEL>" : "") : "CRZ" + (thrustClimbMode === 5 ? " <SEL>" : "")), (Simplane.getIsGrounded() ? (thrustClimbMode === 2 ? "<ARM> " : "") : "<SEL> ") + "CLB 2>"],
            [""],
            [""],
            ["__FMCSEPARATOR"],
            ["<INDEX", "TAKEOFF>"]
        ]);
        fmc.onLeftInput[5] = () => { B747_8_FMC_InitRefIndexPage.ShowPage1(fmc); };
        fmc.onRightInput[5] = () => { FMCTakeOffPage.ShowPage1(fmc); };
    }
}
//# sourceMappingURL=B747_8_FMC_ThrustLimPage.js.map