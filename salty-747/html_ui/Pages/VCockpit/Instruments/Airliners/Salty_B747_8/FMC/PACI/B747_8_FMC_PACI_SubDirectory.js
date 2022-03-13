class FMC_PACI_SubDirectory {
    static ShowPage(fmc) {
        fmc.activeSystem = "PACI";
        fmc.clearDisplay();
        
        const updateView = () => {
            fmc.setTemplate([
                ["CABIN INTERPHONE"],
                ["", "", "DOORS"],
                ["<DOOR 1L", "DOOR 1R>"],
                ["", ""],
                ["<DOOR 2L", "DOOR 2R>"],
                ["", ""],
                ["<DOOR 3L", "DOOR 3R>"],
                ["", ""],
                ["<DOOR 4L", "DOOR 4R>"],
                ["", ""],
                ["", ""],
                ["", "", "__FMCSEPARATOR"],
                [`<END CALL`, "CAB INT>"]
            ]);
        }
        updateView();
        
        fmc.onRightInput[5] = () => {
            FMC_PACI_Index.ShowPage(fmc);
        }
    }
}