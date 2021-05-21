class FMC_PACI_Index {
    static ShowPage(fmc, store = {"printCell": "PRINT LOG"}) {
        fmc.activeSystem = "PACI";
        fmc.clearDisplay();
        
        const updateView = () => {
            store.printCell = store.printCell;
            fmc.setTemplate([
                ["CABIN INTERPHONE"],
                ["SPEED DIAL", "CALL QUEUE"],
                ["<PA CALL", "DOOR 1R>"],
                ["", ""],
                ["<ALL CALL", "GALLEY FWD>"],
                ["", ""],
                ["<PURSER", "DOOR 3L>"],
                ["", ""],
                ["<GALLEY FWD", ""],
                ["", ""],
                ["<GND CREW", ""],
                ["------", "------", "PA IN USE"],
                [`<SEND`, "DIRECTORY>"]
            ]);
        }
        updateView();
        
        fmc.onLeftInput[5] = () => {
            FMC_Menu.ShowPage(fmc);
        }
    }
}