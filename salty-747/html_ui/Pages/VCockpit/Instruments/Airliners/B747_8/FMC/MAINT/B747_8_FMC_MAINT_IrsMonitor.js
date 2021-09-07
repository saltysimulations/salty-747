class FMC_MAINT_IrsMonitor {
    static ShowPage(fmc) {
        fmc.clearDisplay();
        let simbriefId = SaltyDataStore.get("OPTIONS_SIMBRIEF_ID", "");
        
        const updateView = () => {
            fmc.setTemplate([
                ["IRS MONITOR"],
                ["\xa0IRS 1", ""],
                [`OK`, ""],
                ["\xa0IRS2", ""],
                ["OK", ""],
                ["\xa0IRS 3", ""],
                [`OK`, ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["", "", "__FMCSEPARATOR"],
                ["<INDEX", ""]
            ]);
        }
        updateView();
        
        fmc.onLeftInput[5] = () => {
            FMC_MAINT_Index.ShowPage(fmc);
        }
    }
}