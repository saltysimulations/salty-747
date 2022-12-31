class FMC_COMM_Index {
    static ShowPage(fmc) {
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();

        const updateView = () => {
            fmc.setTemplate([
                ["ACARS INDEX"],
                ["", ""],
                ["<PREFLIGHT", "REQUESTS>"],
                ["", ""],
                ["<INFLIGHT", ""],
                ["", ""],
                ["<POSTFLIGHT", ""],
                ["\xa0RECEIVED", ""],
                ["<MESSAGES", ""],
                ["", ""],
                ["", ""],
                ["", "LINK\xa0"],
                ["", "STATUS>"]
            ]);
        }
        updateView();

        /* LSK1 */
        fmc.onLeftInput[0] = () => {
            FMC_COMM_Preflight.ShowPage(fmc);
        }

        /* RSK1 */
        fmc.onRightInput[0] = () => {
            FMC_COMM_Requests.ShowPage(fmc);
        }

        /* LSK2 */
        fmc.onLeftInput[1] = () => {
            FMC_COMM_Inflight.ShowPage(fmc);
        }

        /* LSK3 */
        fmc.onLeftInput[2] = () => {
            FMC_COMM_Postflight.ShowPage(fmc);
        }

        /* LSK4 */
        fmc.onLeftInput[3] = () => {
            FMC_COMM_Log.ShowPage(fmc);
        }

        /* RSK1 */
        fmc.onRightInput[5] = () => {
            FMC_COMM_LinkStatus.ShowPage(fmc);
        }
    }
}