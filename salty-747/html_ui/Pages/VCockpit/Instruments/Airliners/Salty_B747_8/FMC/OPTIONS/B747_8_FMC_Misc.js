class FMCSaltyOptions_Misc {
    static ShowPage(fmc) {
        fmc.clearDisplay();
        let displayCurrentPilotsOption;
        const storedPilotsVis = SaltyDataStore.get("OPTIONS_PILOTS_VISIBILITY", "0");
        switch(storedPilotsVis) {
            case '1':
                displayCurrentPilotsOption = `{small}NONE{end}/{green}PILOT{end}/{small}COPILOT{end}/{small}BOTH{end}`;
                break;
            case '2':
                displayCurrentPilotsOption = `{small}NONE{end}/{small}PILOT{end}/{green}COPILOT{end}/{small}BOTH{end}`;
                break;
            case '3':
                displayCurrentPilotsOption = `{small}NONE{end}/{small}PILOT{end}/{small}COPILOT{end}/{green}BOTH{end}`;
                break;
            default:
                displayCurrentPilotsOption = `{green}NONE{end}/{small}PILOT{end}/{small}COPILOT{end}/{small}BOTH{end}`;
        }

        const onGreen = "{green}ON{end}/{small}OFF{end}";
        const offGreen = "{small}ON{end}/{green}OFF{end}";

        const fpSync = WTDataStore.get("WT_CJ4_FPSYNC", 0);
        const fpSyncDisplayOption = fpSync >= 1 ? onGreen : offGreen;

        const pauseAtTd = WTDataStore.get("PAUSE_AT_TD", 0);
        const pauseAtTdDisplayOption = pauseAtTd >= 1 ? onGreen : offGreen;

        const autoFuel = WTDataStore.get("AUTO_FUEL", 0);
        const autoFuelDisplayOption = autoFuel >= 1 ? onGreen : offGreen;

        fmc.setTemplate([
            ["MISC OPTIONS"],
            ["", "", "PILOTS VISIBILITY"],
            ["<", ">", `${displayCurrentPilotsOption}`],
            ["", "", "FP SYNC (WORLD MAP FP)"],
            [`< ${fpSyncDisplayOption}`, "", ""],
            ["", "", "PAUSE AT T/D"],
            [`< ${pauseAtTdDisplayOption}`, `${pauseAtTd >= 1 ? "UNPAUSE>" : ""}`],
            ["", "", "AUTOMATIC FUEL MANAGEMENT"],
            [`< ${autoFuelDisplayOption}`, ""],
            ["", ""],
            ["", ""],
            ["\xa0RETURN TO", ""],
            ["<OPTIONS", ""],
        ]);

        /* LSK1 */
        fmc.onLeftInput[0] = () => {
            let newPVOption = +storedPilotsVis;
            if (newPVOption == 0) {
                newPVOption = 3;
            } else {
                newPVOption--;
            }
            SaltyDataStore.set("OPTIONS_PILOTS_VISIBILITY", newPVOption+"");
            SetPilotVar(newPVOption);
            FMCSaltyOptions_Misc.ShowPage(fmc);
        }

        /* RSK1 */
        fmc.onRightInput[0] = () => {
            let newPVOption = +storedPilotsVis;
            if (newPVOption == 3) {
                newPVOption = 0;
            } else {
                newPVOption++;
            }
            SaltyDataStore.set("OPTIONS_PILOTS_VISIBILITY", newPVOption+"");
            SetPilotVar(newPVOption);
            FMCSaltyOptions_Misc.ShowPage(fmc);
        }

        fmc.onRightInput[2] = () => {
            SimVar.SetSimVarValue("K:PAUSE_OFF", "number", 0);
        }

        fmc.onLeftInput[1] = () => {
            WTDataStore.set("WT_CJ4_FPSYNC", fpSync >= 1 ? 0 : 1);
            fmc.showErrorMessage("RESTART FLIGHT TO APPLY");
            FMCSaltyOptions_Misc.ShowPage(fmc);
        }

        fmc.onLeftInput[2] = () => {
            WTDataStore.set("PAUSE_AT_TD", pauseAtTd >= 1 ? 0 : 1);
            FMCSaltyOptions_Misc.ShowPage(fmc);
        };

        fmc.onLeftInput[3] = () => {
            WTDataStore.set("AUTO_FUEL", autoFuel >= 1 ? 0 : 1);
            FMCSaltyOptions_Misc.ShowPage(fmc);
        };

        /* LSK6 */
        fmc.onLeftInput[5] = () => {
            FMCSaltyOptions.ShowPage1(fmc);
        }

        function SetPilotVar(option) {
            switch(option) {
                case 1:
                    SimVar.SetSimVarValue("L:SALTY_VIS_PILOT_0", "Number", 0);
                    SimVar.SetSimVarValue("L:SALTY_VIS_PILOT_1", "Number", 1);
                    break;
                case 2:
                    SimVar.SetSimVarValue("L:SALTY_VIS_PILOT_0", "Number", 1);
                    SimVar.SetSimVarValue("L:SALTY_VIS_PILOT_1", "Number", 0);
                    break;
                case 3:
                    SimVar.SetSimVarValue("L:SALTY_VIS_PILOT_0", "Number", 0);
                    SimVar.SetSimVarValue("L:SALTY_VIS_PILOT_1", "Number", 0);
                    break;
                default:
                    SimVar.SetSimVarValue("L:SALTY_VIS_PILOT_0", "Number", 1);
                    SimVar.SetSimVarValue("L:SALTY_VIS_PILOT_1", "Number", 1);
            }
        }
    }
}
//# sourceMappingURL=B747_8_FMC_SaltyOptions.js.map
