class FMC_COMM_Postflight {
    static ShowPage(fmc) {
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();
        let currUTC = fmc.getTimeString(new Date());
        
        const updateView = () => {
            fmc.setTemplate([
                [`${currUTC} ACARS POSTFLIGHT`],
                ["\xa0CURR FLIGHT", ""],
                ["<EVENT TIMES", ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["\xa0RECEIVED", ""],
                ["<MESSAGES", "REQUESTS>"],
                ["\xa0ACARS", ""],
                ["<INDEX", ""],
            ]);
        }
        updateView();
        
        fmc.onLeftInput[0] = () => {
            FMC_COMM_CurrentFlight.ShowPage(fmc);
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
    }
}