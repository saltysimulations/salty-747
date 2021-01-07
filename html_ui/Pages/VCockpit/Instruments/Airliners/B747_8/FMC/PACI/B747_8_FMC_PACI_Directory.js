class FMC_PACI_Directory {
    static ShowPage(fmc) {
        fmc.activeSystem = "PACI";
        fmc.clearDisplay();
        
        const updateView = () => {
            fmc.setTemplate([
                ["CABIN INTERPHONE"],
                ["", "", "DIRECTORY"],
                ["<DOORS", "PA AREAS>"],
                ["", ""],
                ["<GALLEYS", "ATTENDANTS>"],
                ["", ""],
                ["<PURSER", "CONFERENCE>"],
                ["", ""],
                ["<MISCELLANY", "CREW REST>"],
                ["", ""],
                ["<GND CREW", "GATELINK>"],
                ["-----", "-----", "VIDEO IN USE"],
                [`<END CALL`, "CAB INT>"]
            ]);
        }
        updateView();
        
        fmc.onLeftInput[5] = () => {
            FMC_PACI_Index.ShowPage(fmc);
        }
    }
}