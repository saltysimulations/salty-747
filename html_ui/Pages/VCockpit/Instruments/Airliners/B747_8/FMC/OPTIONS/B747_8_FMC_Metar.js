class FMCSaltyOptions_Metar {
    static ShowPage(fmc) {
        fmc.clearDisplay();

        const storedMetarSrc = SaltyDataStore.get("OPTIONS_METAR_SRC", "MSFS");

        let msfs = "*METEOBLUE (MSFS)[color]white";
        let avwx = "*AVWX (UNREAL WEATHER)[color]white";
        let vatsim = "*VATSIM[color]white";
        let pilotedge = "*PILOTEDGE[color]white";
        let ivao = "*IVAO[color]white";

        switch (storedMetarSrc) {
            case "AVWX":
                avwx = "AVWX (UNREAL WEATHER)[color]green";
                break;
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
                msfs = "METEOBLUE (MSFS)[color]green";
        }

        const updateView = () => {
            fmc.setTemplate([
                ["METAR SRC"],
                [],
                [`${avwx}`, ""],
                [],
                [`${vatsim}`, ""],
                [],
                [`${pilotedge}`, ""],
                [],
                [`${ivao}`, ""],
                [],
                [`${msfs}`, ""],
                ["\xa0RETURN TO", ""],
                ["<OPTIONS", ""]
            ]);
        }
        updateView();

        /* LSK1 */
        fmc.onLeftInput[0] = () => {
            if (storedMetarSrc != "AVWX") {
                SaltyDataStore.set("OPTIONS_METAR_SRC", "AVWX");
                FMCSaltyOptions_Metar.ShowPage(fmc);
            }
        };

        /* LSK2 */
        fmc.onLeftInput[1] = () => {
            if (storedMetarSrc != "VATSIM") {
                SaltyDataStore.set("OPTIONS_METAR_SRC", "VATSIM");
                FMCSaltyOptions_Metar.ShowPage(fmc);
            }
        };

        /* LSK3 */
        fmc.onLeftInput[2] = () => {
            if (storedMetarSrc != "PILOTEDGE") {
                SaltyDataStore.set("OPTIONS_METAR_SRC", "PILOTEDGE");
                FMCSaltyOptions_Metar.ShowPage(fmc);
            }
        };

        /* LSK4 */
        fmc.onLeftInput[3] = () => {
            if (storedMetarSrc != "IVAO") {
                SaltyDataStore.set("OPTIONS_METAR_SRC", "IVAO");
                FMCSaltyOptions_Metar.ShowPage(fmc);
            }
        };

        /* LSK5 */
        fmc.onLeftInput[4] = () => {
            if (storedMetarSrc != "MSFS") {
                SaltyDataStore.set("OPTIONS_METAR_SRC", "MSFS");
                FMCSaltyOptions_Metar.ShowPage(fmc);
            }
        };

        /* LSK6 */
        fmc.onLeftInput[5] = () => {
            FMCSaltyOptions.ShowPage1(fmc);
        }
    }
}
//# sourceMappingURL=B747_8_FMC_SaltyOptions.js.map