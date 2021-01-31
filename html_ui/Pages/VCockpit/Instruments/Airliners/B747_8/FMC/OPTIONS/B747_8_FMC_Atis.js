class FMCSaltyOptions_Atis {
    static ShowPage(fmc) {
        fmc.clearDisplay();

        const storedAtisSrc = SaltyDataStore.get("OPTIONS_ATIS_SRC", "FAA");

        let faa = "*FAA (US ONLY)[color]white";
        let vatsim = "*VATSIM[color]white";
        let pilotedge = "*PILOTEDGE[color]white";
        let ivao = "*IVAO[color]white";

        switch (storedAtisSrc) {
            case "VATSIM":
                vatsim = "VATSIM[color]green";
                break;
            case "PILOTEDGE":
                pilotedge = "PILOTEDGE[color]green";
                break;
            case "IVAO":
                ivao = "IVAO[color]green";
                break;
            default:
                faa = "FAA (US ONLY)[color]green";
        }

        const updateView = () => {
            fmc.setTemplate([
                ["ATIS SRC"],
                [],
                [`${vatsim}`, ""],
                [],
                [`${pilotedge}`, ""],
                [],
                [`${ivao}`, ""],
                [],
                [`${faa}`, ""],
                [],
                [``, ""],
                ["\xa0RETURN TO", ""],
                ["<OPTIONS", ""]
            ]);
        }
        updateView();

        /* LSK1 */
        fmc.onLeftInput[0] = () => {
            if (storedAtisSrc != "VATSIM") {
                SaltyDataStore.set("OPTIONS_ATIS_SRC", "VATSIM");
                FMCSaltyOptions_Atis.ShowPage(fmc);
            }
        };

        /* LSK2 */
        fmc.onLeftInput[1] = () => {
            if (storedAtisSrc != "PILOTEDGE") {
                SaltyDataStore.set("OPTIONS_ATIS_SRC", "PILOTEDGE");
                FMCSaltyOptions_Atis.ShowPage(fmc);
            }
        };

        /* LSK3 */
        fmc.onLeftInput[2] = () => {
            if (storedAtisSrc != "IVAO") {
                SaltyDataStore.set("OPTIONS_ATIS_SRC", "IVAO");
                FMCSaltyOptions_Atis.ShowPage(fmc);
            }
        };

        /* LSK4 */
        fmc.onLeftInput[3] = () => {
            if (storedAtisSrc != "FAA") {
                SaltyDataStore.set("OPTIONS_ATIS_SRC", "FAA");
                FMCSaltyOptions_Atis.ShowPage(fmc);
            }
        };

        /* LSK6 */
        fmc.onLeftInput[5] = () => {
            FMCSaltyOptions.ShowPage1(fmc);
        }
    }
}
//# sourceMappingURL=B747_8_FMC_SaltyOptions.js.map