class FMCSaltyOptions_Units {
    static ShowPage(fmc) {
        fmc.clearDisplay();
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

        const updateView = () => {
            fmc.setTemplate([
                ["UNITS"],
                [],
                [`*${storedUnits}`, ""],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [``, ""],
                ["\xa0RETURN TO", ""],
                ["<OPTIONS", ""]
            ]);
        }
        updateView();

        /* LSK1 */
        fmc.onLeftInput[0] = () => {
            if (storedUnits == "KG") {
                SaltyDataStore.set("OPTIONS_UNITS", "LBS");
                FMCSaltyOptions_Units.ShowPage(fmc);
            } else if (storedUnits == "LBS") {                
                SaltyDataStore.set("OPTIONS_UNITS", "KG");
                FMCSaltyOptions_Units.ShowPage(fmc);
            }
        };

        /* LSK6 */
        fmc.onLeftInput[5] = () => {
            FMCSaltyOptions.ShowPage1(fmc);
        }
    }
}
//# sourceMappingURL=B747_8_FMC_SaltyOptions.js.map
