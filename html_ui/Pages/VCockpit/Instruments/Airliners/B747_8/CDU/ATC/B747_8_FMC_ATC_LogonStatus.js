class FMC_ATC_LogonStatus {
    static ShowPage(fmc, store = {"logonTo": "", "fltNo": "", "actCtr": "", "nextCtr": "", "maxUlDelay": "", "dlnkStatus": ""}) {
		fmc.activeSystem = "DLNK";
		fmc.clearDisplay();
		/*
		* Remove after testing
		*/
		store.logonTo = "PANC";
		store.actCtr = "KZAK";
		store.nextCtr = "PANC";
		store.maxUlDelay = 150;
		/*"READY, ATN READY, NO COMM, VOICE, or FAIL"*/
		store.dlnkStatus = "READY";
		
		let logonToCell = store.logonTo ? store.logonTo : "--------";
		let originCell = fmc.flightPlanManager.getOrigin() ? fmc.flightPlanManager.getOrigin().ident : "----";
		let destinationCell = fmc.flightPlanManager.getDestination() ? fmc.flightPlanManager.getDestination().ident : "----";
		let fltNoCell = SimVar.GetSimVarValue("ATC FLIGHT NUMBER", "string") ? SimVar.GetSimVarValue("ATC FLIGHT NUMBER", "string") : "-------";
		let regCell = SimVar.GetSimVarValue("ATC ID", "string") ? SimVar.GetSimVarValue("ATC ID", "string") : "-------";
		let maxUlDelayCell = store.maxUlDelay ? store.maxUlDelay + 'SEC' : "---SEC";
		let actCtrCell = store.actCtr ? store.actCtr : "----";
		let nextCtrCell = store.nextCtr ? store.nextCtr : "----";
		let dlnkStatusCell = store.dlnkStatus ? store.dlnkStatus : "NO COMM";

		fmc.setTemplate([
			["ATC LOGON/STATUS", "1", "2"],
			["\xa0LOGON TO", ""],
			[`${logonToCell}`, ""],
			["\xa0FLT NO", "ORIGIN"],
			[`${fltNoCell}`, `${originCell}`],
			["\xa0TAIL NO", "DESTINATION"],
			[`${regCell}`, `${destinationCell}`],
			["\xa0MAX U/L DELAY", "ATC CTR"],
			[`${maxUlDelayCell}`, `${actCtrCell}`],
			["\xa0ATC COMM", "NEXT CTR"],
			["<SELECT OFF", `${nextCtrCell}`],
			["", "DATA LINK", "__FMCSEPARATOR"],
			["<ATC INDEX", `${dlnkStatusCell}`]
		]);
		
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
			FMC_ATC_LogonStatus.ShowPage(fmc, store);
		}

		fmc.onLeftInput[3] = () => {
        	let value = fmc.inOut;
        	fmc.clearUserInput();
			store.maxUlDelay = value;
			FMC_ATC_LogonStatus.ShowPage(fmc, store);
		}

		fmc.onLeftInput[5] = () => {
			FMC_ATC_Index.ShowPage(fmc);
		}

		fmc.onRightInput[3] = () => {
        	let value = fmc.inOut;
        	fmc.clearUserInput();
			store.nextCtr = value;
			FMC_ATC_LogonStatus.ShowPage(fmc, store);
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