class FMC_CMC_Index {
    static ShowPage(fmc, store = {"printCell": "PRINT LOG"}) {
        fmc.activeSystem = "SAT";
        fmc.clearDisplay();
        
        const updateView = () => {
            store.printCell = store.printCell;
            fmc.setTemplate([
                ["ATC INDEX"],
                ["", ""],
                ["<EMERGENCY", "POS REPORT>"],
                ["", ""],
                ["<REQUEST", "WHEN CAN WE>"],
                ["", ""],
                ["<REPORT", "FREE TEXT>"],
                ["", ""],
                ["<LOG", "CLEARANCE>"],
                ["", ""],
                ["<LOGON/STATUS", "VOICE>"],
                ["", "", "__FMCSEPARATOR"],
                [`<${store.printCell}`, ""]
            ]);
        }
        updateView();
        
        fmc.onLeftInput[5] = () => {
            FMC_Menu.ShowPage(fmc);
        }
    }
}