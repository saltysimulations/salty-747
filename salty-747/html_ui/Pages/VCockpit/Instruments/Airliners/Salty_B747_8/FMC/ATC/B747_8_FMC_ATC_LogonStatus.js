class FMC_ATC_LogonStatus {
    static ShowPage(fmc, store = {
            "logonTo": "",
            "fltNo": "",
            "sendLabel": "",
            "sendStatus": "",
            "atcCtrLabel": "ATC CTR",
            "actCtr": "",
            "nextCtrLabel": "NEXT CTR",
            "nextCtr": "",
            "maxUlDelay": "",
            "atcCommLabel": "",
            "atcCommSelect": "",
            "dlnkStatus": "NO COMM"
        }) {
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();
        
        let originCell = fmc.flightPlanManager.getOrigin() ? fmc.flightPlanManager.getOrigin().ident : "----";
        let destinationCell = fmc.flightPlanManager.getDestination() ? fmc.flightPlanManager.getDestination().ident : "----";
        let regCell = SimVar.GetSimVarValue("ATC ID", "string") ? SimVar.GetSimVarValue("ATC ID", "string") : "-------";
        let logonToCell = "--------";
        let fltNoCell = "-------";
        let atcCtrCell = "----";
        let nextCtrCell = "----";
        let maxUlDelayCell = "----";

        /* REMOVE AFTER TESTING */
        /* END REMOVE */

        const updateView = () => {
            if (SimVar.GetSimVarValue("ATC FLIGHT NUMBER", "string")) {
                store.fltNo = SimVar.GetSimVarValue("ATC FLIGHT NUMBER", "string");
            }
            if (!fmc.atcComm.estab) {
                store.atcCtrLabel = "";
                atcCtrCell = "";
                store.nextCtrLabel = "";
                nextCtrCell = "";
            } else {
                store.actCtr = fmc.atcComm.loggedTo;
                store.nextCtr = fmc.atcComm.nextCtr != "" ? fmc.atcComm.nextCtr : "----";
                store.atcCommLabel = "ATC COMM";
                store.atcCommSelect = "<SELECT OFF";
                store.nextCtrLabel = "NEXT CTR";
                store.dlnkStatus = fmc.atcComm.dlnkStatus;
                store.maxUlDelay = fmc.atcComm.maxUlDelay;
            }
            if (store.logonTo != "") {
                logonToCell = store.logonTo
            }
            if (store.fltNo != "") {
                fltNoCell = store.fltNo
            }
            if (store.at != "") {
                atcCtrCell = store.actCtr
            }
            if (store.nextCtr != "") {
                nextCtrCell = store.nextCtr
            }
            if (store.maxUlDelay != "") {
                maxUlDelayCell = store.maxUlDelay
            }
            fmc.setTemplate([
                ["ATC LOGON/STATUS", "1", "2"],
                ["\xa0LOGON TO", `${store.sendLabel}`],
                [`${logonToCell}`, `${store.sendStatus}`],
                ["\xa0FLT NO", "ORIGIN"],
                [`${fltNoCell}`, `${originCell}`],
                ["\xa0TAIL NO", "DESTINATION"],
                [`${regCell}`, `${destinationCell}`],
                ["\xa0MAX U/L DELAY", `${store.atcCtrLabel}`],
                [`${maxUlDelayCell}SEC`, `${atcCtrCell}`],
                [`\xa0${store.atcCommLabel}`, `${store.nextCtrLabel}`],
                [`${store.atcCommSelect}`, `${nextCtrCell}`],
                ["----------------", "DATA LINK"],
                ["<ATC INDEX", `${store.dlnkStatus}`]
            ]);
        }
        updateView();
        
        fmc.onNextPage = () => {
            FMC_ATC_LogonStatus.ShowPage2(fmc);
        };
        
        fmc.onPrevPage = () => {
            FMC_ATC_LogonStatus.ShowPage2(fmc);
        }

        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            store.logonTo = value;
            if (store.logonTo != "" && store.fltNo != "" && fmc.atcComm.maxUlDelay != "") {
                store.sendLabel = "LOGON";
                store.sendStatus = "SEND>";
            }
            updateView();
        }

        fmc.onLeftInput[3] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            store.maxUlDelay = value;
            fmc.atcComm.maxUlDelay = value;
            if (store.logonTo != "" && store.fltNo != "" && fmc.atcComm.maxUlDelay != "") {
                store.sendLabel = "LOGON";
                store.sendStatus = "SEND>";
            }
            updateView();
        }

        fmc.onLeftInput[4] = () => {
            if (fmc.atcComm.estab) {
                fmc.atcComm.estab = false;
            }
            FMC_ATC_LogonStatus.ShowPage(fmc);
        }

        fmc.onLeftInput[5] = () => {
            FMC_ATC_Index.ShowPage(fmc);
        }

        fmc.onRightInput[0] = () => {
            if (store.logonTo != "" && store.fltNo != "" && fmc.atcComm.maxUlDelay != "") {
                store.sendStatus = "SENDING\xa0";
                updateView();
                setTimeout(function () {
                    store.sendStatus = "SENT\xa0";
                    fmc.atcComm.estab = true;
                    fmc.atcComm.loggedTo = store.logonTo;
                    fmc.atcComm.maxUlDelay = store.maxUlDelay;
                    fmc.atcComm.dlnkStatus = "READY";
                    updateView();
                }, fmc.getInsertDelay());
                setTimeout(function () {
                    FMC_ATC_Index.ShowPage(fmc)
                }, fmc.getUplinkDelay());
            }
        }

        fmc.onRightInput[4] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            fmc.atcComm.nextCtr = value;
            updateView();
        }
    }
    
    static ShowPage2(fmc, store = {"dlnkStatus": "NO COMM"}) {
        fmc.clearDisplay();
        
        let adsCell = "<OFF ←→ ARM";
        let adsEmergCell = "<OFF ←→ ON";
        let dlnkStatusCell = store.dlnkStatus ? store.dlnkStatus : "NO COMM";

        fmc.setTemplate([
            ["ATC LOGON/STATUS", "2", "2"],
            ["", ""],
            ["", ""],
            ["\xa0ADS (ACT)", "ADS EMERG"],
            [`${adsCell}`, `${adsEmergCell}`],
            ["", ""],
            ["", ""],
            ["", ""],
            ["", ""],
            ["", ""],
            ["", ""],
            ["", "DATA LINK", "__FMCSEPARATOR"],
            ["<ATC INDEX", `${dlnkStatusCell}`]
        ]);
        
        fmc.onNextPage = () => {
            FMC_ATC_LogonStatus.ShowPage(fmc);
        };
        
        fmc.onPrevPage = () => {
            FMC_ATC_LogonStatus.ShowPage(fmc);
        }

        fmc.onLeftInput[5] = () => {
            FMC_ATC_Index.ShowPage(fmc);
        }
    }
}