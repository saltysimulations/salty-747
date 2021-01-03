class FMCIdentPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        fmc.activeSystem = "FMC";
        let model = SimVar.GetSimVarValue("ATC MODEL", "string", "FMC");
        if (!model) {
            model = "unkn.";
        }
        let date = fmc.getNavDataDateRange();
        fmc.setTemplate([
            ["IDENT"],
            ["\xa0MODEL", "ENGINES"],
            ["747-8", "GENX-2B67B"],
            ["\xa0NAV DATA", "ACTIVE"],
            ["AIRAC", date.toString()],
            ["", ""],
            ["", date.toString()],
            ["\xa0OP PROGRAM", "CO DATA"],
            ["AW-P010-0-0", "VS1001"],
            ["\xa0OPC", "DRAG/FF"],
            ["AW-C010-0-0", "+0.0/+0.0"],
            ["__FMCSEPARATOR"],
            ["<INDEX", "POS INIT>"]
        ]);
        
        fmc.onLeftInput[5] = () => {
            B747_8_FMC_InitRefIndexPage.ShowPage1(fmc);
        };

        fmc.onRightInput[5] = () => {
            FMCPosInitPage.ShowPage1(fmc);
        };
    }
}
//# sourceMappingURL=B747_8_FMC_IdentPage.js.map