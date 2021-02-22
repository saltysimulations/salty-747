class FMCNavDataPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        fmc.setTemplate([
            ["REF NAV DATA"],
            ["\xa0IDENT", "CHANNEL"],
            ["GMWH", "20242"],
            ["\xa0LATITUDE", "LONGITUDE"],
            ["N47°13.5", "W119°19.6"],
            ["\xa0MAG VAR/LENGTH", "ELEVATION"],
            ["E18", "1163FT"],
            [""],
            [""],
            [""],
            [""],
            [""],
            ["<INDEX"]
        ]);
        fmc.onLeftInput[5] = () => { B747_8_FMC_InitRefIndexPage.ShowPage1(fmc); };
    }
}
//# sourceMappingURL=B747_8_FMC_NavDataPage.js.map