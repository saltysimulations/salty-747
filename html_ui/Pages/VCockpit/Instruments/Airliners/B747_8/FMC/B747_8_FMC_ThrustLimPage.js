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
        let ground = Simplane.getIsGrounded();
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
            [(ground ? "SEL" : ""), (ground ? "TO N1" : "CLB N1"), (ground ? "OAT" : "")],
            [(ground ? selectedTempCell + "°": ""),(ground ? toN1Cell : clbN1Cell), (ground ? oatCell : "")],
            ["<AA", "BBB>", " <SEL> " + " <ARM> "],
            ["<TO", "CLB>", " <SEL> " + " <ARM> "],
            [(ground ? "TO 1" : "")],
            [(ground ? (thrustTOMode === 1 ? "<-10% <SEL>" : "<-10%") : (thrustClimbMode === 4 ? "<CON <SEL>" : "<CON")), (ground ? (thrustClimbMode === 1 ? "<ARM> CLB 1>" : "CLB 1>") : (thrustClimbMode === 1) ? "<SEL> CLB 1>" : "CLB 1>")],
            [(ground ? "TO 2" : "")],
            [(ground ? (thrustTOMode === 2 ? "<-20% <SEL>" : "<-20%") : (thrustClimbMode === 5 ? "<CRZ <SEL>" : "<CRZ")), (ground ? (thrustClimbMode === 2 ? "<ARM> CLB 2>" : "CLB 2>") : (thrustClimbMode === 2) ? "<SEL> CLB2>" : "CLB 2>")],
            [""],
            [""],
            ["__FMCSEPARATOR"],
            ["\<INDEX", "TAKEOFF>"]
        ]);
        fmc.onLeftInput[5] = () => { B747_8_FMC_InitRefIndexPage.ShowPage1(fmc); };
        fmc.onRightInput[5] = () => { FMCTakeOffPage.ShowPage1(fmc); };
    }
}
//# sourceMappingURL=B747_8_FMC_ThrustLimPage.js.map