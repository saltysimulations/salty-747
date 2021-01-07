class FMC_COMM_LinkStatus {
    static ShowPage(fmc, store = {status: "OK"}) {
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();
        
        const updateView = () => {
            fmc.setTemplate([
                ["ATC LINK STATUS"],
                ["", ""],
                ["", ""],
                ["\xa0STATUS", ""],
                [`${store.status}`, ""],
                ["\xa0DETAILS", ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["\xa0ACARS", ""],
                ["<INDEX", "RECHECK>"]
            ]);
        }
        updateView();
        
        fmc.onLeftInput[5] = () => {
            FMC_COMM_Index.ShowPage(fmc);
        }
        
        fmc.onRightInput[5] = () => {
            store.status = "";
            updateView();
            setTimeout(
                function() {
                    store.status = "OK";
                    updateView();
                }, 500
            );
            updateView();
        }
    }
}