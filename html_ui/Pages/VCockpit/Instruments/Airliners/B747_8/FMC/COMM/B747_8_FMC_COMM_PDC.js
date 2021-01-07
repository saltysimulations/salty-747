class FMC_COMM_PDC {
    static ShowPage(fmc, store = {sendStatus: "SEND>"}) {
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();
        let fltNoCell = "------";
        let deptCell = "----";
        let atisCell = "□";
        let standCell = "----";
        let acTypeCell = "B748";
        let destCell = "----";
        let freeTextCell = "<";
        let atsCell = "□□□□";
        let textSelected = false;

        if (SimVar.GetSimVarValue("ATC FLIGHT NUMBER", "string")) {
            fmc.atcComm.fltNo = SimVar.GetSimVarValue("ATC FLIGHT NUMBER", "string");
        }
        if (fmc.flightPlanManager.getOrigin()) {
            fmc.atcComm.origin = fmc.flightPlanManager.getOrigin().ident;
        }
        if (fmc.flightPlanManager.getDestination()) {
            fmc.atcComm.dest = fmc.flightPlanManager.getDestination().ident;
        }
        if (fmc.atcComm.fltNo != "") {
            fltNoCell = fmc.atcComm.fltNo;
        }
        if (fmc.atcComm.origin != "") {
            deptCell = fmc.atcComm.origin;
        }
        if (fmc.pdc.atis != "") {
            atisCell = fmc.pdc.atis;
        }
        if (fmc.pdc.stand != "") {
            standCell = fmc.pdc.stand;
        }
        if (fmc.pdc.acType != "") {
            acTypeCell = fmc.pdc.acType;
        }
        if (fmc.atcComm.dest != "") {
            destCell = fmc.atcComm.dest;
        }
        if (fmc.pdc.freeText != "") {
            freeTextCell = fmc.pdc.freeText;
        }
        if (fmc.pdc.ats != "") {
            atsCell = fmc.pdc.ats;
        }
        if (fmc.pdc.sendStatus != "") {
            sendStatusCell = fmc.pdc.sendStatus;
        }

        const updateView = () => {
            fmc.setTemplate([
                ["PDC REQUEST"],
                ["\xa0FLT NO", "DEPT"],
                [`${fltNoCell}`, `${deptCell}`],
                ["\xa0ATIS", "STAND"],
                [`${atisCell}`, `${standCell}`],
                ["\xa0A/C TYPE", "DEST"],
                [`${acTypeCell}`, `${destCell}`],
                ["\xa0FREE TEXT", ""],
                [`${freeTextCell}`, ""],
                ["----------", "TO ATS UNIT"],
                ["", `${atsCell}`],
                ["\xa0RETURN TO", ""],
                ["<REQUESTS", `${store.sendStatus}[color]inop`]
            ]);
        }
        updateView();

        /** FLIGHT NUMBER */
        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            if (value != "DELETE") {
                fmc.clearUserInput();
                fmc.pdc.fltNo = value;
            } else {
                fmc.pdc.fltNo = "------";
            }
            FMC_COMM_PDC.ShowPage(fmc);
        };

        /** ATIS */
        fmc.onLeftInput[1] = () => {
            let value = fmc.inOut;
            if (value != "DELETE") {
                fmc.clearUserInput();
                fmc.pdc.atis = value;
            } else {
                fmc.pdc.atis = "□";
            }
            FMC_COMM_PDC.ShowPage(fmc);
        };

        /** FREE TEXT */
        fmc.onLeftInput[3] = () => {
            let value = fmc.inOut;
            if (value != "DELETE") {
                fmc.clearUserInput();
                fmc.pdc.freeText = value;
            } else {
                fmc.pdc.freeText = "<";
            }
            FMC_COMM_PDC.ShowPage(fmc);
        };

        fmc.onLeftInput[5] = () => {
            FMC_COMM_Requests.ShowPage(fmc);
        };

        /** DEPT */
        fmc.onRightInput[0] = () => {
            let value = fmc.inOut;
            if (value != "DELETE") {
                fmc.clearUserInput();
                fmc.pdc.dept = value;
            } else {
                fmc.pdc.dept = "----";
            }
            FMC_COMM_PDC.ShowPage(fmc);
        };

        /** STAND */
        fmc.onRightInput[1] = () => {
            let value = fmc.inOut;
            if (value != "DELETE") {
                fmc.clearUserInput();
                fmc.pdc.stand = value;
            } else {
                fmc.pdc.stand = "----";
            }
            FMC_COMM_PDC.ShowPage(fmc);
        };

        /** DEST */
        fmc.onRightInput[2] = () => {
            let value = fmc.inOut;
            if (value != "DELETE") {
                fmc.clearUserInput();
                fmc.pdc.dest = value;
            } else {
                fmc.pdc.dest = "----";
            }
            FMC_COMM_PDC.ShowPage(fmc);
        };

        /** ATS */
        fmc.onRightInput[4] = () => {
            let value = fmc.inOut;
            if (value != "DELETE") {
                fmc.clearUserInput();
                fmc.pdc.ats = value;
            } else {
                fmc.pdc.ats = "□□□□";
            }
            FMC_COMM_PDC.ShowPage(fmc);
        };

        /*fmc.onRightInput[5] = () => {
            store.sendStatus = "SENDING";
            updateView();
            setTimeout(
                function() {
                    store.sendStatus = "SENT";
                    updateView();
                }, 1000
            );
            setTimeout(
                function() {
                    store.sendStatus = "SEND>";
                    updateView();
                }, 5000
            );
        };*/
    }
}