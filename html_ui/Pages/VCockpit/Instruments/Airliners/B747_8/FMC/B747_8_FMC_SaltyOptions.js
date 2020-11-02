class FMCSaltyOptions {
    static ShowPage1(fmc) {
        fmc.clearDisplay();

        var IRSState = SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum");
        if (IRSState == 0) { IRSState = "NOT ALIGNED[color]red"; }
        if (IRSState == 1) { IRSState = "ALIGNING[color]yellow"; }
        if (IRSState == 2) { IRSState = "ALIGNED[color]green"; }
        fmc.setTemplate([
            ["SALTY OPTIONS"],
            [],
            ["IRS STATUS", IRSState],
            [],
            ["", "UPDATE IRS STATUS>"],
            [],
            ["<ECL BACK", "ECL FWD>"],
            [],
            ["<ECL SELECT"],
            [],
            [],
            [],
            ["<IRS INSTANT ALIGN", ""],
        ]);
        fmc.onRightInput[1] = () => { FMCSaltyOptions.ShowPage1(fmc); };
        
        
        fmc.onRightInput[2] = () => { let cursorIndex = SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum");
                                        cursorIndex++;
                                        SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum", cursorIndex);
                                        SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool", 1);
                                    };
        
        
        fmc.onLeftInput[2] = () =>  { let cursorIndex = SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum");
                                        cursorIndex--;
                                        SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum", cursorIndex);
                                        SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool", 1);
                                    };
        
        
        
        fmc.onLeftInput[5] = () => {
           if (SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum") == 1) {
               SimVar.SetSimVarValue("L:SALTY_IRS_TIME_LEFT", "Enum", -1);
               SimVar.SetSimVarValue("L:SALTY_IRS_STATE", "Enum", 2);
           }
           if (SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum") == 0) {
               fmc.showErrorMessage("IRS KNOBS OFF");
           }
        }

    }
}
//# sourceMappingURL=B747_8_FMC_SaltyOptions.js.map