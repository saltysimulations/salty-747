class B747_8_FMC_InitRefIndexPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        fmc.activeSystem = "FMC";
        fmc.setTemplate([
            ["INIT/REF INDEX"],
            [""],
            ["<IDENT", "NAV DATA>"],
            [""],
            ["<POS", "ALTN>"],
            [""],
            ["<PERF", "FMC COMM>"],
            [""],
            ["<THRUST LIM"],
            [""],
            ["<TAKEOFF"],
            [""],
            ["<APPROACH", "MAINT>"]
        ]);

        fmc.onLeftInput[0] = () => {
            FMCIdentPage.ShowPage1(fmc); 
        };

        fmc.onLeftInput[1] = () => {
            FMCPosInitPage.ShowPage1(fmc);
        };

        fmc.onLeftInput[2] = () => {
            FMCPerfInitPage.ShowPage1(fmc);
        };

        fmc.onLeftInput[3] = () => {
            FMCThrustLimPage.ShowPage1(fmc);
        };

        fmc.onLeftInput[4] = () => { 
           FMCTakeOffPage.ShowPage1(fmc);
        };

        fmc.onLeftInput[5] = () => {
            FMCApproachPage.ShowPage1(fmc);
        };

        fmc.onRightInput[0] = () => {
            FMCNavDataPage.ShowPage1(fmc);
        };

        fmc.onRightInput[2] = () => {
            FMC_COMM_Index.ShowPage(fmc);
        };

        fmc.onRightInput[5] = () => {
            FMC_MAINT_Index.ShowPage(fmc);
        };
    }
}
//# sourceMappingURL=B747_8_FMC_InitRefIndexPage.js.map