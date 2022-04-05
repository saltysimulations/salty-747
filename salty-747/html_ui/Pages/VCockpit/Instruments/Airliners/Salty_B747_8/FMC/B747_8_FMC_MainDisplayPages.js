class FMCMainDisplayPages {
    static MenuPage(fmc) {
        fmc.clearDisplay();
        fmc.setTemplate([
            ["MENU"],
            ["", "EFIS CP"],
            ["\<FMC", "", "<ACT>"],
            ["", "EICAS CP"],
            ["\<ACARS"],
            ["", "CTL PNL"],
            ["", "OFF←→ON>"],
            [],
            ["\<SALTY"],
            [],
            ["", ""],
            [],
            ["\<CMC"]
        ]);
        fmc.onLeftInput[0] = () => { FMCIdentPage.ShowPage1(fmc); };
        fmc.onLeftInput[3] = () => { FMCSaltyOptions.ShowPage1(fmc); };
    }
    static PerfInitPage(fmc) {
    }
    static FuelPage(fmc) {
        fmc.clearDisplay();
        fmc.setTemplate([
            ["FUEL"],
            ["TOTAL KGS", "GW / MTW"],
            ["80880", "305.2/397.8"],
            ["LEVEL", "ZFW", "TOCG"],
            ["46,7%", "224.4", "23.0%"],
            ["", "FUEL DENSITY"],
            ["\<LONG RANGE", "0.803"],
            ["", "PLAN FUEL (KGS)"],
            ["\<MED RANGE", "N/A"],
            [],
            ["\<SHORT RANGE"],
            [],
            ["\<RETURN"]
        ]);
    }
    static PayloadPage(fmc) {
        fmc.clearDisplay();
        fmc.setTemplate([
            ["PAYLOAD"],
            ["UPR BUS", "GW / MTW"],
            ["24/42", "305.2/397.8"],
            ["MAIN PASS", "ZFW", "TOCG"],
            ["127/2254", "224.4", "23.0%"],
            ["MAIN CARGO", "LOAD LEVEL"],
            ["7695", "56.6%"],
            ["FWD/AFT CARGO", ""],
            ["9968/8735", "SET MAX>"],
            ["BULK CARGO"],
            ["1847", "SET EMPTY>"],
            [],
            ["\<RETURN", "SET RANDOM>"]
        ]);
    }
}
//# sourceMappingURL=B747_8_FMC_MainDisplayPages.js.map 