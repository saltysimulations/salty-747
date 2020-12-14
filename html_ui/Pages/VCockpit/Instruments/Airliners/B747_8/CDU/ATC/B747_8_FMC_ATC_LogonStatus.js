class FMC_ATC_LogonStatus {
    static ShowPage(fmc, store = {
			"logonTo": "--------",
			"fltNo": "-------",
			"sendLabel": "",
			"sendStatus": "",
			"atcCtrLabel": "ATC CTR",
			"actCtr": "----",
			"atcCtrLabel": "NEXT CTR",
			"nextCtr": "----",
			"maxUlDelay": "---",
			"atcCommLabel": "",
			"atcCommSelect": "",
			"dlnkStatus": "NO COMM"
		}) {
		fmc.activeSystem = "DLNK";
		fmc.clearDisplay();
		
		let originCell = fmc.flightPlanManager.getOrigin() ? fmc.flightPlanManager.getOrigin().ident : "----";
		let destinationCell = fmc.flightPlanManager.getDestination() ? fmc.flightPlanManager.getDestination().ident : "----";
		let regCell = SimVar.GetSimVarValue("ATC ID", "string") ? SimVar.GetSimVarValue("ATC ID", "string") : "-------";
		const updateView = () => {
			if (SimVar.GetSimVarValue("ATC FLIGHT NUMBER", "string")) {
				store.fltNo = SimVar.GetSimVarValue("ATC FLIGHT NUMBER", "string");
			}
			if (dlnkStatusCell == "NO COMM") {
				atcCtrLabel = "";
				actCtrCell = "";
				nextCtrLabel = "";
				nextCtrCell = "";
			} else {
				store.atcCommLabel = "ATC COMM";
				store.atcCommSelect = "SELECT OFF";
			}
			fmc.setTemplate([
				["ATC LOGON/STATUS", "1", "2"],
				["\xa0LOGON TO", `${store.sendLabel}`],
				[`${store.logonTo}`, `${store.sendStatus}`],
				["\xa0FLT NO", "ORIGIN"],
				[`${store.fltNo}`, `${originCell}`],
				["\xa0TAIL NO", "DESTINATION"],
				[`${regCell}`, `${destinationCell}`],
				["\xa0MAX U/L DELAY", `${store.atcCtrLabel}`],
				[`${store.maxUlDelay}SEC`, `${store.actCtr}`],
				[`\xa0${store.atcCommLabel}`, `${store.nextCtrCell}`],
				[`<${atcCommSelect}`, `${store.nextCtr}`],
				["", "DATA LINK", "__FMCSEPARATOR"],
				["<ATC INDEX", `${dlnkStatusCell}`]
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
			if (store.fltNo) {
				store.sendLabel = "LOGON";
				store.sendStatus = "SEND>";
			}
			updateView();
		}

		fmc.onLeftInput[1] = () => {
        	let value = fmc.inOut;
        	fmc.clearUserInput();
			store.fltNo = value;
			if (store.logonTo) {
				store.sendLabel = "LOGON";
				store.sendStatus = "SEND>";
			}
			updateView();
		}

		fmc.onLeftInput[3] = () => {
        	let value = fmc.inOut;
        	fmc.clearUserInput();
			store.maxUlDelay = value;
			updateView();
		}

		fmc.onLeftInput[5] = () => {
			FMC_ATC_Index.ShowPage(fmc);
		}

		fmc.onRightInput[0] = () => {
        	if (store.logonTo != "" && store.fltNo != "") {
				store.sendLabel = "SENDING";
				store.sendLabel = "SENT";
				fmc.atcComm.estab = true;
				fmc.atcComm.loggedTo = store.logonTo;
				fmc.atcComm.dlnkStatus = "READY";
				updateView();
			}
		}

		fmc.onRightInput[3] = () => {
        	let value = fmc.inOut;
        	fmc.clearUserInput();
			store.nextCtr = value;
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