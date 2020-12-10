class FMC_ATC_EmergencyReport {
    static ShowPage(fmc, store = {"emergType": 0, "divert": "", "sob": "", "offset": "","fuel": "", "fuelTime": "", "descend": "", "erase": 0}) {
        fmc.clearDisplay();

        let maydayCell = "";
        let panCell = "";
        let divertCell = "----";
        let sobCell = "----";
        let offsetCell = "----";
        let fuelCell = "--.-LB";
        let fuelTimeCell = "HH+MM";
        let descendCell = "----";
		let eraseCell = "";

		if (store.emergType) {
			if (store.emergType == 0) {
				maydayCell = "MAYDAY[s-text]";
				panCell = "PAN[s-text]";
			} else if (store.emergType == 1) {
				maydayCell = "MAYDAY";
				panCell = "PAN[s-text]";
			} else if (store.emergType == 2) {
				maydayCell = "MAYDAY[s-text]";
				panCell = "PAN";
			}
		} else {			
			maydayCell = "MAYDAY[s-text]";
			panCell = "PAN[s-text]";
		}
		if (store.divert) {
			divertCell = store.divert;
		} else {
			if (fmc.flightPlanManager.getDestination()) {
				divertCell = fmc.flightPlanManager.getDestination().ident;
			}
		}
		if (store.sob) {
			sobCell = store.sob;
		}
		if (store.offset) {
			offsetCell = store.offset;
		}
		if (store.fuel) {
			fuelCell = store.fuel;
		}
		if (store.fuelTime) {
			fuelTimeCell = store.fuelTime;
		}
		if (store.descend) {
			descendCell = store.descend;
		} else {
			descendCell = SimVar.GetSimVarValue("AUTOPILOT ALTITUDE LOCK VAR", "feet");
			store.descend = SimVar.GetSimVarValue("AUTOPILOT ALTITUDE LOCK VAR", "feet");
		}
		if (store.erase) {
			if (store.erase == 0) {
				eraseCell = "";
			} else if (store.erase == 1) {
				eraseCell = "<ERASE EMERGENCY";
			} else if (store.erase == 2) {
				eraseCell = "<CANCEL EMERGENCY";
			}
		}

        const updateView = () => {
        	fmc.setTemplate([
	            ["EMERGENCY REPORT"],
	            ["", ""],
	            [`<${maydayCell}`, `${panCell}>`],
	            ["\xa0DIVERT TO", "SOB"],
	            [`<${divertCell}`, `${sobCell}>`],
	            ["\xa0OFFSET", "FUEL REMAINING"],
	            [`${offsetCell}`, `${fuelCell} ${fuelTimeCell}`],
	            ["\xa0DESCEND TO", ""],
	            [`<${descendCell}`, ""],
	            ["", ""],
	            [`${eraseCell}`, ""],
	            ["", "", "__FMCSEPARATOR"],
	            ["<ATC INDEX", "VERIFY>"]
	        ]);
        }
		updateView();
		
        fmc.onLeftInput[0] = () => {
        	if (store.sob) {
        		/*
        			0 = NOT SELECTED
        			1 = MAYDAY
        			2 = PAN
        		*/
				store.emergType = 1;
				FMC_ATC_EmergencyReport.ShowPage(fmc, store);
        	}
		}
		
        fmc.onLeftInput[1] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
        	store.divert = value;
			FMC_ATC_EmergencyReport.ShowPage(fmc, store);
		}
		
        fmc.onLeftInput[2] = () => {
        	let value = fmc.inOut;
        	fmc.clearUserInput();
        	store.offset = value;
			FMC_ATC_EmergencyReport.ShowPage(fmc, store);
		}
		
        fmc.onLeftInput[3] = () => {
        	let value = fmc.inOut;
        	fmc.clearUserInput();
        	store.descend = value;
			FMC_ATC_EmergencyReport.ShowPage(fmc, store);
		}
		
        fmc.onLeftInput[4] = () => {
        	/*
        		0 = BLANK
				1 = ERASE EMERGENCY
				2 = CANCEL EMERGENCY
        	*/
        	if (store.erase == 1) {
	        	maydayActive = false;
	        	panActive = false;
	        	store.divert = "";
	        	store.sob = "";
	        	store.offset = "";
	        	store.fuelTime = "";
				store.descend = "";
				FMC_ATC_EmergencyReport.ShowPage(fmc, store);
	        }
		}
		
        fmc.onLeftInput[5] = () => {
        	FMC_ATC_Index.ShowPage(fmc);
		}
		
        fmc.onRightInput[0] = () => {
        	if (store.sob) {
        		/*
        			0 = NOT SELECTED
        			1 = MAYDAY
        			2 = PAN
        		*/
				store.emergType = 2;
				console.log(store.emergType);
				FMC_ATC_EmergencyReport.ShowPage(fmc, store);
        	}
		}
		
        fmc.onRightInput[1] = () => {
        	let value = fmc.inOut;
        	fmc.clearUserInput();
			store.sob = value;
			store.fuel = (SimVar.GetSimVarValue("FUEL TOTAL QUANTITY WEIGHT", "lbs") / 1000).toFixed(1) + "LB";			
        	FMC_ATC_EmergencyReport.ShowPage(fmc, store);
		}
		
        fmc.onRightInput[2] = () => {
        	let value = fmc.inOut;
        	fmc.clearUserInput();
        	store.fuelTime = value;
			FMC_ATC_EmergencyReport.ShowPage(fmc, store);
		}
		
        fmc.onRightInput[5] = () => {
			if (store.emergType != 0 && store.sob != "" && store.fuelTime != "") {
				const title = "EMERGENCY";
				const lines = [];
				if (store.emergType === 1) {
					lines.push("MAYDAY MAYDAY MAYDAY");
				} else if (store.emergType === 2) {
					lines.push("PAN PAN PAN");
				}
				if (store.descend != "") {
					lines.push("DESCENDING TO " + store.descend + "FT");
				}
				if (store.divert != "") {
					lines.push("DIRECT TO " + store.divert);
				}
				lines.push(store.fuelTime + " OF FUEL REMAINING");
				lines.push("AND " + store.sob + " SOULS ON BOARD.");
				FMC_ATC_VerifyRequest.ShowPage(fmc, title, lines);
			} else {
				fmc.showErrorMessage("SET SOB AND FUEL");
			}
        }
    }
}