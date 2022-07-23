class FMC_MAINT_AirlinePol {
    static ShowPage(fmc) {
        fmc.clearDisplay();
        let costIndexPolicy = SaltyDataStore.get("COST_INDEX_POL", 35);
        let eoAccelHt = SaltyDataStore.get("TO_EO_ACCEL_HT", 1000);
        let accelHt = SaltyDataStore.get("TO_ACCEL_HT", 1000);
        let clbAt = SaltyDataStore.get("TO_CLB_AT", 3000);
        let qClb = SaltyDataStore.get("TO_Q_CLB_AT", 1000);
        let thrRed = SaltyDataStore.get("TO_THR_REDUCTION", 3000);
        let clbBy = SaltyDataStore.get("TO_CLB_BY", 3000);
        
        const updateView = () => {
            fmc.setTemplate([
                ["AIRLINES POLICY"],
                ["\xa0COST INDEX", ""],
                [`[${costIndexPolicy}]`, ""],
                ["EO ACCEL HT", "ACCEL HT"],
                [`[${eoAccelHt}] FT`, `[${accelHt}] FT`],
                ["Q-CLB AT", "CLB AT"],
                [`[${qClb}] FT`, `[${clbAt}] FT`],
                ["THR REDUCTION", "CLIMB BY"],
                [`[${thrRed}] FT`, `[${clbBy}] FT`],
                ["", ""],
                ["", ""],
                ["", "", "__FMCSEPARATOR"],
                ["<INDEX", ""]
            ]);
        }
        updateView();
        
        /* LSK1 */
        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            SaltyDataStore.set("COST_INDEX_POL", value);
            FMC_MAINT_AirlinePol.ShowPage(fmc);
        }
        
        /* LSK2 */
        fmc.onLeftInput[1] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            SaltyDataStore.set("TO_EO_ACCEL_HT", value);
            FMC_MAINT_AirlinePol.ShowPage(fmc);
        }
        
        /* RSK2 */
        fmc.onRightInput[1] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            SaltyDataStore.set("TO_ACCEL_HT", value);
            FMC_MAINT_AirlinePol.ShowPage(fmc);
        }
        
        /* LSK3 */
        fmc.onLeftInput[2] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            SaltyDataStore.set("TO_Q_CLB_AT", value);
            FMC_MAINT_AirlinePol.ShowPage(fmc);
        }
        
        /* RSK3 */
        fmc.onLeftInput[2] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            SaltyDataStore.set("TO_CLB_AT", value);
            FMC_MAINT_AirlinePol.ShowPage(fmc);
        }
        
        /* LSK4 */
        fmc.onLeftInput[2] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            SaltyDataStore.set("TO_THR_REDUCTION", value);
            FMC_MAINT_AirlinePol.ShowPage(fmc);
        }
        
        /* RSK4 */
        fmc.onLeftInput[2] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            SaltyDataStore.set("TO_CLB_BY", value);
            FMC_MAINT_AirlinePol.ShowPage(fmc);
        }
        
        /* LSK6 */
        fmc.onLeftInput[5] = () => {
            FMC_MAINT_Index.ShowPage(fmc);
        }
    }
}