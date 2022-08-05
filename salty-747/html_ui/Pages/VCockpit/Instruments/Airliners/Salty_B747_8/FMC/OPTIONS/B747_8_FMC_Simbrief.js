class FMCSaltyOptions_Simbrief {
    static ShowPage(fmc) {
        fmc.clearDisplay();
        let simbriefId = SaltyDataStore.get("OPTIONS_SIMBRIEF_ID", "");
        let simbriefUser = SaltyDataStore.get("OPTIONS_SIMBRIEF_USER", "");

        fmc.setTemplate([
            ["SIMBRIEF OPTIONS"],
            ["SIMBRIEF ID", ""],
            [`[${simbriefId}]`, ``],
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
              SaltyDataStore.set("OPTIONS_SIMBRIEF_ID", value);
              SaltyDataStore.set("OPTIONS_SIMBRIEF_USER", "");
              FMCSaltyOptions_Simbrief.ShowPage(fmc);
        }


        /* RSK1 */
        /*fmc.onRightInput[0] = () => {
              let value = fmc.inOut;
              fmc.clearUserInput();
              SaltyDataStore.set("OPTIONS_SIMBRIEF_ID", "");
              SaltyDataStore.set("OPTIONS_SIMBRIEF_USER", value);
              FMCSaltyOptions_Simbrief.ShowPage(fmc);
        }*/

        /* LSK6 */
        fmc.onLeftInput[5] = () => {
            FMCSaltyOptions.ShowPage1(fmc);
        }
    }
}
//# sourceMappingURL=B747_8_FMC_SaltyOptions.js.map