class B747_8_FMC_InitRefIndexPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        fmc.setTemplate([
            ["INIT/REF INDEX"],
            [""],
            ["\<IDENT", "NAV DATA>"],
            [""],
            ["\<POS"],
            [""],
            ["\<PERF"],
            [""],
            ["\<THRUST LIM"],
            [""],
            ["\<TAKEOFF"],
            [""],
            ["\<APPROACH", "MAINT>"]
        ]);
        fmc.onLeftInput[0] = () => { FMCIdentPage.ShowPage1(fmc); };
        fmc.onRightInput[0] = () => { FMCNavDataPage.ShowPage1(fmc); };
        fmc.onLeftInput[1] = () => { FMCPosInitPage.ShowPage1(fmc); };
        fmc.onLeftInput[2] = () => { FMCPerfInitPage.ShowPage1(fmc); };
        fmc.onLeftInput[3] = () => { FMCThrustLimPage.ShowPage1(fmc); };
        fmc.onLeftInput[4] = () => { FMCTakeOffPage.ShowPage1(fmc); };
        fmc.onLeftInput[5] = () => { FMCApproachPage.ShowPage1(fmc); };
        fmc.onRightInput[5] = () => { FMCMaintPage.ShowPage1(fmc); };
    }
}
//# sourceMappingURL=B747_8_FMC_InitRefIndexPage.js.map