class FMCSaltyOptions_IrsStatus {
    static ShowPage(fmc) {
        fmc.clearDisplay();

        var IRSState = SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum");
        if (IRSState == 0) { IRSState = "NOT ALIGNED[color]red"; }
        if (IRSState == 1) { IRSState = "ALIGNING[color]yellow"; }
        if (IRSState == 2) { IRSState = "ALIGNED[color]green"; }

        fmc.setTemplate([
            ["SALTY OPTIONS"],
            [],
            ["IRS STATUS", IRSState],
            ["", ""],
            ["", "UPDATE IRS STATUS>"],
            ["", ""],
            ["<IRS INSTANT ALIGN", ""],
            ["", ""],
            ["<ECL BACK", "ECL FWD>"],
            ["", ""],
            ["<NEXT CHKL", "ECL SELECT>"],
            ["\xa0RETURN TO", ""],
            ["<OPTIONS", ""]
        ]);

        /* RSK2 */
        fmc.onRightInput[1] = () => {
          FMCSaltyOptions_IrsStatus.ShowPage(fmc);
        };

        /* LSK3 */
        fmc.onLeftInput[2] = () => {
           if (SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum") == 1) {
               SimVar.SetSimVarValue("L:SALTY_IRS_TIME_LEFT", "Enum", -1);
               SimVar.SetSimVarValue("L:SALTY_IRS_STATE", "Enum", 2);
           }
           if (SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum") == 0) {
               fmc.showErrorMessage("IRS KNOBS OFF");
           }
        }
        /* LSK 4 */
        fmc.onRightInput[3] = () => { let cursorIndex = SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum");
                                        cursorIndex++;
                                        SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum", cursorIndex);
                                        SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool", 1);
                                    };
           
        fmc.onLeftInput[3] = () =>  { let cursorIndex = SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum");
                                        cursorIndex--;
                                        SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum", cursorIndex);
                                        SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool", 1);
        };
        /* LSK 5 */
        fmc.onLeftInput[4] = () => {
            if (_event == "EICAS_CHANGE_PAGE_chkl") {
                let eclToDraw = B747_8_EICAS.sequenceElectronicChecklist();
                if (B747_8_EICAS.currentPage !== `CHKL-${eclToDraw}`) {
                    B747_8_EICAS.changePage(`CHKL-${eclToDraw}`);
                    B747_8_EICAS.currentPage = `CHKL-${eclToDraw}`;
                }
            } else if (B747_8_EICAS.currentPage !== _event) {
                B747_8_EICAS.currentPage = _event;
            } else {
                B747_8_EICAS.changePage("BLANK");
                B747_8_EICAS.currentPage = "blank";
                return;
            }
        }
        fmc.onRightInput[4] = () => { SimVar.SetSimVarValue("L:SALTY_ECL_BTN", "bool", 1); };

        /* LSK6 */
        fmc.onLeftInput[5] = () => {
            FMCSaltyOptions.ShowPage1(fmc);
        }
    }
}
//# sourceMappingURL=B747_8_FMC_SaltyOptions.js.map