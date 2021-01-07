class FMC_MAINT_Index {
    static ShowPage(fmc) {
        fmc.activeSystem = "MAINT";
        fmc.clearDisplay();
        let simbriefId = SaltyDataStore.get("OPTIONS_SIMBRIEF_ID", "");
        
        const updateView = () => {
            fmc.setTemplate([
                ["MAINTENANCE"],
                ["", ""],
                ["<CROSS LOAD", "SENSORS>"],
                ["", ""],
                ["<AIRLINE POL", "DISCRETES>[color]inop"],
                ["", ""],
                ["<IRS MONITOR[color]inop", ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["", "", "__FMCSEPARATOR"],
                ["<INDEX", ""]
            ]);
        }
        updateView();
        
        /* LSK1 */
        fmc.onLeftInput[0] = () => {
            fmc.showErrorMessage("CHECK AIRLINE POLICY");
        }		
        
        /* RSK1 */
        fmc.onRightInput[0] = () => {
            FMC_MAINT_Sensors.ShowPage(fmc);
        }
        
        /* LSK2 */
        fmc.onLeftInput[1] = () => {
            FMC_MAINT_AirlinePol.ShowPage(fmc);
        }
        
        /* LSK6 */
        fmc.onLeftInput[5] = () => {
            FMC_Menu.ShowPage(fmc);
        }
    }
}