class B747_8_FMC_ForecastPage {
    
    static ShowPage(fmc) {
        let transAltCell = "□□□□□";
        transAltCell = "FL" + (fmc.transLvl / 100).toString();
        let altCell1 = "-----";
        let altCell2 = "-----";
        let altCell3 = "-----";
        let altCell4 = "-----";
        let spdCell1 = "-----";
        let spdCell2 = "-----";
        let spdCell3 = "-----";
        let spdCell4 = "-----";
        let dirCell1 = "-----";
        let dirCell2 = "-----";
        let dirCell3 = "-----";
        let dirCell4 = "-----";
        if (fmc.desForWindAlt.unit1 != "") {
            altCell1 = fmc.desForWindAlt.unit1
        }
        if (fmc.desForWindAlt.unit2 != "") {
            altCell2 = fmc.desForWindAlt.unit2
        }
        
        /* Climb Page Refresh Timer */
        fmc.clearDisplay();
        fmc.setTemplate([
            ["DESCENT FORECAST"],
            ["\xa0TRANS LVL", "TAI ON/OFF"],
            [transAltCell, "-----/-----"],
            ["\xa0ALT", "WIND DIR/SPD"],
            [altCell1, dirCell1 + "°/" + spdCell1 + "KT"],
            [""],
            [altCell2, dirCell2 + "°/" + spdCell2 + "KT"],
            [""],
            [altCell3, dirCell3 + "°/" + spdCell3 + "KT"],
            [""],
            [altCell4, dirCell4 + "°/" + spdCell4 + "KT"],
            [""],
            [""]
        ]);

        /* LSK 1L  - Trans Level */
        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.transLvl = value;
            SimVar.SetSimVarValue("L:XMLVAR_TransLvl", "feets", value);
            B747_8_FMC_ForecastPage.ShowPage(fmc);
            fmc.clearUserInput();
        };
    }
}
//# sourceMappingURL=B747_8_FMC_VNAVPage.js.map