class FMC_MAINT_Options {
    static ShowPage(fmc) {
        fmc.clearDisplay();
        
        const updateView = () => {
            fmc.setTemplate([
                ["OPTIONS"],
                ["\xa0MAINT", "", "INOP PAGE"],
                [``, ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["", ""],
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