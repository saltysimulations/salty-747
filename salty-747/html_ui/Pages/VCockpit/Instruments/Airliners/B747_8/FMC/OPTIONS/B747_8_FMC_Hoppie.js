class FMCSaltyOptions_Hoppie {
    static ShowPage(fmc) {
        fmc.clearDisplay();
        let hoppieId = SaltyDataStore.get("OPTIONS_HOPPIE_ID", "");

        fmc.setTemplate([
            ["HOPPIE OPTIONS"],
            ["HOPPIE ID", ""],
            [`[${hoppieId}]`, ``],
            ["", ""],
            ["", ""],
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
              let value = fmc.inOut;
              fmc.clearUserInput();
              SaltyDataStore.set("OPTIONS_HOPPIE_ID", value);
              FMCSaltyOptions_Hoppie.ShowPage(fmc);
        }

        /* LSK6 */
        fmc.onLeftInput[5] = () => {
            FMCSaltyOptions.ShowPage1(fmc);
        }
    }
}
//# sourceMappingURL=B747_8_FMC_SaltyOptions.js.map