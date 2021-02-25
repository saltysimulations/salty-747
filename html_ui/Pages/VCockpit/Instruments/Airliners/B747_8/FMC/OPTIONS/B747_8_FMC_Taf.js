class FMCSaltyOptions_Taf {
    static ShowPage(fmc) {
        fmc.clearDisplay();

        const storedTafSrc = SaltyDataStore.get("OPTIONS_TAF_SRC", "NOAA");

        let noaa = "*NOAA[color]white";
        let ivao = "*IVAO[color]white";

        switch (storedTafSrc) {
            case "IVAO":
                ivao = "IVAO[color]green";
                break;
            default:
                noaa = "NOAA[color]green";
        }

        fmc.setTemplate([
            ["SALTY OPTIONS"],
            ["", ""],
            [ivao, ""],
            ["", ""],
            [noaa, ""],
            ["", ""],
            ["", ""],
            ["", ""],
            ["", ""],
            ["", ""],
            ["", ""],
            ["\xa0RETURN TO", ""],
            ["<OPTIONS", ""]
        ]);

        /* LSK1 */
        fmc.onLeftInput[0] = () => {
            SaltyDataStore.set("OPTIONS_TAF_SRC", "IVAO");
            FMCSaltyOptions_Taf.ShowPage(fmc);
        }

        /* LSK2 */
        fmc.onLeftInput[1] = () => {
            SaltyDataStore.set("OPTIONS_TAF_SRC", "NOAA");
             FMCSaltyOptions_Taf.ShowPage(fmc);
        };

        /* LSK6 */
        fmc.onLeftInput[5] = () => {
            FMCSaltyOptions.ShowPage1(fmc);
        }
    }
}
//# sourceMappingURL=B747_8_FMC_SaltyOptions.js.map