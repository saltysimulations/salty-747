class FMCThrustLimPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        FMCThrustLimPage._timer = 0;
        fmc.pageUpdate = () => {
            FMCThrustLimPage._timer++;
            if (FMCThrustLimPage._timer >= 50) {
                FMCThrustLimPage.ShowPage1(fmc);
            }
        }
        let assumedTempSet = SimVar.GetSimVarValue("L:SALTY_ATM_SET", "bool");
        let selectedTempCell = SimVar.GetSimVarValue("L:SALTY_ASSUMED_TEMP", "number"); //fmc.getThrustTakeOffTemp() + "°";
        if (!assumedTempSet) {
            selectedTempCell = "--";
        }
        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (fmc.setThrustTakeOffTemp(value)) {
                SimVar.SetSimVarValue("L:SALTY_ATM_SET", "bool", true);
                FMCThrustLimPage.ShowPage1(fmc);
            }
            else if (value==FMCMainDisplay.clrValue) {
                SimVar.SetSimVarValue("L:SALTY_ATM_SET", "bool", false);
                FMCThrustLimPage.ShowPage1(fmc);
            }
        };
        //let toN1Cell = fmc.getThrustTakeOffLimit().toFixed(1) + "%";
        let oatValue = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");
        let oatCell = oatValue.toFixed(0) + "°C";
        let thrustTOMode = fmc.getThrustTakeOffMode();
        let thrustClimbMode = fmc.getThrustCLBMode();
        let ground = Simplane.getIsGrounded();
        fmc.onLeftInput[1] = () => {
            if (ground) {
                fmc.setThrustTakeOffMode(0);
                fmc.setThrustCLBMode(0);
                SimVar.SetSimVarValue("L:SALTY_CLB_THR_ARMED", "bool", true);
                SimVar.SetSimVarValue("L:SALTY_REF_THR_SET", "bool", true);
                //SimVar.SetSimVarValue("K:AP_N1_REF_SET", "percent", fmc.getThrustTakeOffMode(0));
                FMCThrustLimPage.ShowPage1(fmc);
            }
            else {
                fmc.setThrustCLBMode(3);
                SimVar.SetSimVarValue("L:SALTY_REF_THR_SET", "bool", true);
                //SimVar.SetSimVarValue("K:AP_N1_REF_SET", "percent", fmc.getThrustCLBMode(0));
                FMCThrustLimPage.ShowPage1(fmc);
            }
            
        };
        fmc.onLeftInput[2] = () => {
            if (ground) {
                fmc.setThrustTakeOffMode(1);
                fmc.setThrustCLBMode(1);
                SimVar.SetSimVarValue("L:SALTY_CLB_THR_ARMED", "bool", true);
                SimVar.SetSimVarValue("L:SALTY_REF_THR_SET", "bool", true);
                //SimVar.SetSimVarValue("K:AP_N1_REF_SET", "percent", fmc.getThrustTakeOffMode(1));
                FMCThrustLimPage.ShowPage1(fmc);
            }
            else {
                fmc.setThrustCLBMode(4);
                SimVar.SetSimVarValue("L:SALTY_REF_THR_SET", "bool", true);
                //SimVar.SetSimVarValue("K:AP_N1_REF_SET", "percent", fmc.getThrustCLBMode(1));
                FMCThrustLimPage.ShowPage1(fmc);
            }
        };
        fmc.onLeftInput[3] = () => {
            if (ground) {
                fmc.setThrustTakeOffMode(2);
                fmc.setThrustCLBMode(2);
                SimVar.SetSimVarValue("L:SALTY_CLB_THR_ARMED", "bool", true);
                SimVar.SetSimVarValue("L:SALTY_REF_THR_SET", "bool", true);
                //SimVar.SetSimVarValue("K:AP_N1_REF_SET", "percent", fmc.getThrustTakeOffMode(2));
                FMCThrustLimPage.ShowPage1(fmc);
            }
            else {
                fmc.setThrustCLBMode(5);
                SimVar.SetSimVarValue("L:SALTY_REF_THR_SET", "bool", true);
                //SimVar.SetSimVarValue("K:AP_N1_REF_SET", "percent", fmc.getThrustCLBMode(5));
                FMCThrustLimPage.ShowPage1(fmc);
            }
        };
        fmc.onRightInput[1] = () => {
            fmc.setThrustCLBMode(0);
            SimVar.SetSimVarValue("L:SALTY_REF_THR_SET", "bool", true);
            //SimVar.SetSimVarValue("K:AP_N1_REF_SET", "percent", fmc.getThrustCLBMode(0));
            FMCThrustLimPage.ShowPage1(fmc);
        };
        fmc.onRightInput[2] = () => {
            fmc.setThrustCLBMode(1);
            SimVar.SetSimVarValue("L:SALTY_REF_THR_SET", "bool", true);
            //SimVar.SetSimVarValue("K:AP_N1_REF_SET", "percent", fmc.getThrustCLBMode(1));
            FMCThrustLimPage.ShowPage1(fmc);
        };
        fmc.onRightInput[3] = () => {
            fmc.setThrustCLBMode(2);
            SimVar.SetSimVarValue("L:SALTY_REF_THR_SET", "bool", true);
            //SimVar.SetSimVarValue("K:AP_N1_REF_SET", "percent", fmc.getThrustCLBMode(2));
            FMCThrustLimPage.ShowPage1(fmc);
        };
        //let toN1Cell = fmc.getThrustTakeOffLimit().toFixed(1) + "%";
        //let clbN1Cell = fmc.getThrustClimbLimit().toFixed(1) + "%";
        let N1cell;
        fmc.setTemplate([
            ["THRUST LIM"],
            [(ground ? "SEL" : ""), (ground ? "TO N1" : (thrustClimbMode === 3 ? "GA N1" : (thrustClimbMode === 4 ? "CON N1" : (thrustClimbMode === 5 ? "CRZ N1" : (thrustClimbMode === 0 ? "CLB N1" : (thrustClimbMode === 1 ? "CLB 1 N1" : "CLB 2 N1")))))), (ground ? "OAT" : "")],
            [(ground ? selectedTempCell + "°": ""),(ground ? N1cell = fmc.getThrustTakeOffLimit().toFixed(1) + "%" : N1cell = fmc.getThrustClimbLimit().toFixed(1) + "%"), (ground ? oatCell : "")],
            [""],
            [(ground ? (thrustTOMode === 0 ? "&ltTO &ltSEL>" : "&ltTO") : (thrustClimbMode === 3 ? "&ltGA &ltSEL>" : "&ltGA")), (ground ? (thrustClimbMode === 0 ? "&ltARM> CLB>" : "CLB>") : (thrustClimbMode === 0 ? "&ltSEL> CLB>" : "CLB>"))],
            [(ground ? "TO 1" : "")],
            [(ground ? (thrustTOMode === 1 ? "&lt-10% &ltSEL>" : "&lt-10%") : (thrustClimbMode === 4 ? "&ltCON &ltSEL>" : "&ltCON")), (ground ? (thrustClimbMode === 1 ? "&ltARM> CLB 1>" : "CLB 1>") : (thrustClimbMode === 1) ? "&ltSEL> CLB 1>" : "CLB 1>")],
            [(ground ? "TO 2" : "")],
            [(ground ? (thrustTOMode === 2 ? "&lt-20% &ltSEL>" : "&lt-20%") : (thrustClimbMode === 5 ? "&ltCRZ &ltSEL>" : "&ltCRZ")), (ground ? (thrustClimbMode === 2 ? "&ltARM> CLB 2>" : "CLB 2>") : (thrustClimbMode === 2) ? "&ltSEL> CLB 2>" : "CLB 2>")],
            [""],
            [""],
            ["__FMCSEPARATOR"],
            ["&ltINDEX", (ground ? "TAKEOFF&gt" : "APPROACH&gt")]
        ]);
        fmc.onLeftInput[5] = () => { B747_8_FMC_InitRefIndexPage.ShowPage1(fmc); };
        fmc.onRightInput[5] = () => { (ground ? FMCTakeOffPage.ShowPage1(fmc) : FMCApproachPage.ShowPage1(fmc)); };
    }
}
//# sourceMappingURL=B747_8_FMC_ThrustLimPage.js.map