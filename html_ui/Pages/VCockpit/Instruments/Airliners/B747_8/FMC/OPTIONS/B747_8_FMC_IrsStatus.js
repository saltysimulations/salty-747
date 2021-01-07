class FMCSaltyOptions_IrsStatus {
    static ShowPage(fmc) {
        fmc.clearDisplay();

        var IRSState = SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum");
        if (IRSState == 0) { IRSState = "NOT ALIGNED[color]red"; }
        if (IRSState == 1) { IRSState = "ALIGNING[color]yellow"; }
        if (IRSState == 2) { IRSState = "ALIGNED[color]green"; }

        fmc.setTemplate([
            ["SALTY OPTIONS"],
            [],
            ["IRS STATUS", IRSState],
            ["", ""],
            ["", "UPDATE IRS STATUS>"],
            ["", ""],
            ["<IRS INSTANT ALIGN", ""],
            ["", ""],
            ["", ""],
            ["", ""],
            ["", ""],
            ["\xa0RETURN TO", ""],
            ["<OPTIONS", ""]
        ]);

        /* RSK2 */
        fmc.onRightInput[1] = () => {
          FMCSaltyOptions_IrsStatus.ShowPage(fmc);
        };

        /* LSK3 */
        fmc.onLeftInput[2] = () => {
           if (SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum") == 1) {
               SimVar.SetSimVarValue("L:SALTY_IRS_TIME_LEFT", "Enum", -1);
               SimVar.SetSimVarValue("L:SALTY_IRS_STATE", "Enum", 2);
           }
           if (SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum") == 0) {
               fmc.showErrorMessage("IRS KNOBS OFF");
           }
        }

        /* LSK6 */
        fmc.onLeftInput[5] = () => {
            FMCSaltyOptions.ShowPage1(fmc);
        }
    }
}
//# sourceMappingURL=B747_8_FMC_SaltyOptions.js.map