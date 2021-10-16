class FMCSaltyOptions {
    static ShowPage1(fmc) {
        fmc.clearDisplay();

        var IRSState = SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum");
        if (IRSState == 0) { IRSState = "NOT ALIGNED[color]red"; }
        if (IRSState == 1) { IRSState = "ALIGNING[color]yellow"; }
        if (IRSState == 2) { IRSState = "ALIGNED[color]green"; }
        /* Simbrief Options */
        let simbriefId = SaltyDataStore.get("OPTIONS_SIMBRIEF_ID", "");
        /* Hoppie*/
        let hoppieId = SaltyDataStore.get("OPTIONS_HOPPIE_ID", "");

        /* Units */
        const storedUnits = SaltyDataStore.get("OPTIONS_UNITS", "KG");
        switch (storedUnits) {
            case "KG":
                fmc.units = 1;
                SimVar.SetSimVarValue("L:SALTY_UNIT_IS_METRIC", "bool", 1);
                break;
            case "LBS":
                fmc.units = 0;
                SimVar.SetSimVarValue("L:SALTY_UNIT_IS_METRIC", "bool", 0);
                break;
            default:
                fmc.units = 1;
                SimVar.SetSimVarValue("L:SALTY_UNIT_IS_METRIC", "bool", 1);
        }

        fmc.setTemplate([
            ["SALTY OPTIONS"],
            ["", "UNITS"],
            ["<IRS", storedUnits],
            ["", ""],
            ["<METAR SRC", "ATIS SRC>"],
            ["", ""],
            ["<TAF SRC", ""],
            ["\xa0SIMBRIEF ID", "HOPPIE LOGON"],
            [simbriefId, hoppieId],
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
            if (storedUnits == "KG") {
                SaltyDataStore.set("OPTIONS_UNITS", "LBS");
                FMCSaltyOptions.ShowPage1(fmc);
            } else if (storedUnits == "LBS") {                
                SaltyDataStore.set("OPTIONS_UNITS", "KG");
                FMCSaltyOptions.ShowPage1(fmc);
            }
        };

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
            let value = fmc.inOut;
            fmc.clearUserInput();
            SaltyDataStore.set("OPTIONS_SIMBRIEF_ID", value);
            SaltyDataStore.set("OPTIONS_SIMBRIEF_USER", "");
            FMCSaltyOptions.ShowPage1(fmc);
        }
        
        /* RSK4 */
        fmc.onRightInput[3] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            SaltyDataStore.set("OPTIONS_HOPPIE_ID", value);
            FMCSaltyOptions.ShowPage1(fmc);
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