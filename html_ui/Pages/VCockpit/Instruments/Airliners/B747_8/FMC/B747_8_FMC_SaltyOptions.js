class FMCSaltyOptions {
    static ShowPage1(fmc) {
        fmc.clearDisplay(); 
        let units = SaltyDataStore.get("OPTIONS_UNITS", true);
        let unitsCell = "";
        if (units) {
            unitsCell = "KG";
        } else {
            unitsCell = "LBS";
        }
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
            [`[${unitsCell}]`],
            [],
            [],
            [],
            [],
            [],
            ["<IRS INSTANT ALIGN", ""]
        ]);
        fmc.onRightInput[1] = () => { FMCSaltyOptions.ShowPage1(fmc); };

        fmc.onLeftInput[2] = () => {
            if (units) {
                SaltyDataStore.set("OPTIONS_UNITS", false);
                FMCSaltyOptions.ShowPage1(fmc);
            } else {
                SaltyDataStore.set("OPTIONS_UNITS", true);
                FMCSaltyOptions.ShowPage1(fmc);
            }
        }

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