class FMC_COMM_Preflight {
    static ShowPage(fmc) {
        fmc.activeSystem = "FMC";
        fmc.clearDisplay();
        let fltNoCell = "------";
        let originCell = "----";
        let planDepCell = "□□□□";
        let destCell = "----";
        let etaCell = "□□□□";
        let altnCell = "□□□□";
        let companyCell =  "□□□";
        let currUTC = fmc.getTimeString(new Date());
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
            originCell = fmc.atcComm.origin;
        }
        if (fmc.atcComm.planDep != "") {
            planDepCell = fmc.atcComm.planDep;
        }
        if (fmc.atcComm.dest != "") {
            destCell = fmc.atcComm.dest;
        }
        if (fmc.atcComm.eta != "") {
            etaCell = fmc.atcComm.eta;
        }
        if (fmc.atcComm.altn != "") {
            altnCell = fmc.atcComm.altn;
        }
        if (fmc.atcComm.company != "") {
            companyCell = fmc.atcComm.company;
        }
        
        const updateView = () => {
            fmc.setTemplate([
                [`${currUTC} ACARS PREFLIGHT`],
                ["", "FLT NO"],
                ["", `${fltNoCell}`],
                ["\xa0ORIGIN", "PLAN DEP"],
                [`${originCell}`, `${planDepCell}Z`],
                ["\xa0DEST", "ETA"],
                [`${destCell}`, `${etaCell}Z`],
                ["\xa0ALTN", "COMPANY"],
                [`${altnCell}`, `${companyCell}`],
                ["\xa0RECEIVED", ""],
                ["<MESSAGES", "REQUESTS>"],
                ["\xa0ACARS", ""],
                ["<INDEX", "INFLIGHT>"],
            ]);
        }
        updateView();

        /* LSK5 */
        fmc.onLeftInput[4] = () => {
            FMC_COMM_Log.ShowPage(fmc);
        }
        
        /** ALTN */
        fmc.onLeftInput[3] = () => {
            let value = fmc.inOut;
            if (value != "DELETE") {
                fmc.clearUserInput();
                fmc.atcComm.altn = value;
            } else {
                fmc.atcComm.altn = "";
                fmc.clearUserInput();
            }
            FMC_COMM_Preflight.ShowPage(fmc);
        };

        fmc.onLeftInput[4] = () => {
            FMC_ATC_Log.ShowPage(fmc);
        };

        fmc.onLeftInput[5] = () => {
            FMC_COMM_Index.ShowPage(fmc);
        };

        /** PLAN DEP */
        fmc.onRightInput[1] = () => {
            let value = fmc.inOut;
            if (value != "DELETE") {
                fmc.clearUserInput();
                fmc.atcComm.planDep = value;
            } else {
                fmc.atcComm.planDep = "";
                fmc.clearUserInput();
            }
            FMC_COMM_Preflight.ShowPage(fmc);
        };

        /** ETA */
        fmc.onRightInput[2] = () => {
            let value = fmc.inOut;
            if (value != "DELETE") {
                fmc.clearUserInput();
                fmc.atcComm.eta = value;
            } else {
                fmc.atcComm.eta = "";
                fmc.clearUserInput();
            }
            FMC_COMM_Preflight.ShowPage(fmc);
        };

        /** COMPANY */
        fmc.onRightInput[3] = () => {
            let value = fmc.inOut;
            if (value != "DELETE") {
                fmc.clearUserInput();
                fmc.atcComm.company = value;
            } else {
                fmc.atcComm.company = "";
                fmc.clearUserInput();
            }
            FMC_COMM_Preflight.ShowPage(fmc);
        };
        
        fmc.onRightInput[4] = () => {
            FMC_COMM_Requests.ShowPage(fmc);
        }
        
        fmc.onRightInput[5] = () => {
            FMC_COMM_Inflight.ShowPage(fmc);
        }
    }
}