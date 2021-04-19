class FMCSaltyOptions {
    static ShowPage1(fmc) {
        fmc.clearDisplay();

        var IRSState = SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum");
        if (IRSState == 0) { IRSState = "NOT ALIGNED[color]red"; }
        if (IRSState == 1) { IRSState = "ALIGNING[color]yellow"; }
        if (IRSState == 2) { IRSState = "ALIGNED[color]green"; }
        /* Simbrief Options */
        let simbriefId = SaltyDataStore.get("OPTIONS_SIMBRIEF_ID", "");
        let simbriefUser = SaltyDataStore.get("OPTIONS_SIMBRIEF_USER", "");

        fmc.setTemplate([
            ["SALTY OPTIONS"],
            ["", ""],
            ["<IRS", "UNITS>"],
            ["", ""],
            ["<METAR SRC", "ATIS SRC>"],
            ["", ""],
            ["<TAF SRC", ""],
            ["", ""],
            [`<SIMBRIEF`, ""],
            ["", ""],
            ["<CPDLC[color]inop", "MISC>"],
            ["\xa0RETURN TO", ""],
            ["<INDEX", ""]
        ]);

        /* LSK1 */
        fmc.onLeftInput[0] = () => {
            FMCSaltyOptions_IrsStatus.ShowPage(fmc);
        }
        /* RSK1 */
        fmc.onRightInput[0] = () => {
            FMCSaltyOptions_Units.ShowPage(fmc);
        }
        /* LSK2 */
        fmc.onLeftInput[1] = () => {
             FMCSaltyOptions_Metar.ShowPage(fmc);
        };

        /* RSK2 */
        fmc.onRightInput[1] = () => {
              FMCSaltyOptions_Atis.ShowPage(fmc);
        };

        /* RSK3 */
        fmc.onLeftInput[2] = () => {
              FMCSaltyOptions_Taf.ShowPage(fmc);
        };
        
        /* LSK4 */
        fmc.onLeftInput[3] = () => {
              FMCSaltyOptions_Simbrief.ShowPage(fmc);
        }
        
        /* RSK5 */
        fmc.onRightInput[4] = () => {
              FMCSaltyOptions_Misc.ShowPage(fmc);
        }

        /* LSK6 */
        fmc.onLeftInput[5] = () => {
              FMC_Menu.ShowPage(fmc);
        }
    }
}
//# sourceMappingURL=B747_8_FMC_SaltyOptions.js.map