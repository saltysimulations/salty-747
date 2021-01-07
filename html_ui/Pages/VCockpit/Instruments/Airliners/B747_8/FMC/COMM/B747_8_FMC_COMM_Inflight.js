class FMC_COMM_Inflight {
    static ShowPage(fmc) {
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();
        
        const updateView = () => {
            fmc.setTemplate([
                ["INFLIGHT"],
                ["\xa0POSITION", "DEST ETA"],
                ["<REPORT", "----Z"],
                ["\xa0DEVIATE TO[color]inop", ""],
                ["<ALTN[s-text][color]inop", ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["\xa0RECEIVED", ""],
                ["<MESSAGES", "REQUESTS>"],
                ["\xa0ACARS", "", ""],
                ["<INDEX", "POSTFLIGHT>"]
            ]);
        }
        updateView();
        
        fmc.onLeftInput[0] = () => {
            FMC_PosReport.ShowPage(fmc);
        }

        /* LSK5 */
        fmc.onLeftInput[4] = () => {
            FMC_COMM_Log.ShowPage(fmc);
        }
        
        fmc.onLeftInput[4] = () => {
            FMC_ATC_Log.ShowPage(fmc);
        }
        
        fmc.onLeftInput[5] = () => {
            FMC_COMM_Index.ShowPage(fmc);
        }
        
        fmc.onRightInput[4] = () => {
            FMC_COMM_Requests.ShowPage(fmc);
        }
        
        fmc.onRightInput[5] = () => {
            FMC_COMM_Postflight.ShowPage(fmc);
        }
    }
}