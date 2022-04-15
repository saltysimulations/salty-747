class FMC_ATC_Index {
    static ShowPage(fmc, store = {"printCell": "PRINT LOG"}) {
        fmc.activeSystem = "DLNK";
        let lines = [];

        fmc.clearDisplay();
        if (fmc.atcComm.estab && !fmc.atcComm.uplinkPeding) {
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
            
            fmc.onLeftInput[0] = () => {
                FMC_ATC_EmergencyReport.ShowPage(fmc);
            }
            
            fmc.onLeftInput[1] = () => {
                FMC_ATC_Request.ShowPage(fmc);
            }
            
            fmc.onLeftInput[2] = () => {
                FMC_ATC_Report.ShowPage(fmc);
            }
            
            fmc.onLeftInput[3] = () => {
                FMC_ATC_Log.ShowPage(fmc);
            }
            
            fmc.onLeftInput[4] = () => {
                FMC_ATC_LogonStatus.ShowPage(fmc);
            }
            
            fmc.onLeftInput[5] = () => {
                store.printCell = 'PRINT' + 'ERROR[s-text]';
                updateView();
                setTimeout(function(){
                    FMC_ATC_Index.ShowPage(fmc, store);
                }, 3000);
            }

            fmc.onRightInput[0] = () => {
                FMC_PosReport.ShowPage(fmc);
            }

            fmc.onRightInput[1] = () => {
                FMC_ATC_WhenCanWe.ShowPage(fmc);
            }
            
            fmc.onRightInput[2] = () => {
                FMC_ATC_VerifyReport.ShowPage(fmc, lines = [], "ATC INDEX");
            }
            
            fmc.onRightInput[3] = () => {
                FMC_ATC_VerifyRequest.ShowPage(fmc, "CLEARANCE", lines = []);
            }
            
            fmc.onRightInput[4] = () => {
                FMC_ATC_VerifyRequest.ShowPage(fmc, "VOICE", lines = []);
            }
            
        } else if (fmc.atcComm.estab && fmc.atcComm.uplinkPeding) {
            FMC_ATC_Log.ShowPage(fmc);
        } else if (!fmc.atcComm.estab) {
            FMC_ATC_LogonStatus.ShowPage(fmc);
        }
    }
}