class FMC_ATC_XRequest {
    static ShowPage(fmc, store = {"altitude": "", "speed": "", "offset": "", "route": ""}) {
		fmc.clearDisplay();

		const altPage = () => {
			fmc.setTemplate([
				[`ATC ALT REQUEST`, "1", "4"],
				["\xa0ALTITUDE", "REQUEST"],
				[`<${store.altitude}`, "CRZ CLB>[s-text]"],
				["\xa0STEP AT", "MAINTAIN OWN"],
				["-----", "SEPARATION/VMC>[s-text]"],
				["", "DUE TO"],
				["", "PERFORMANCE>[s-text]"],
				["", "DUE TO"],
				["<AT PILOT DISC[s-text]", "WEATHER>[s-text]"],
				["", ""],
				["", ""],
				["", "", "__FMCSEPARATOR"],
				["<REQUEST", "VERIFY>"]
			])
		
			fmc.onNextPage = () => {
				speedPage();
			};
			
			fmc.onPrevPage = () => {
				rtePage();
			}
		};

		const speedPage = () => {
			fmc.setTemplate([
				[`ATC SPEED REQUEST`, "2", "4"],
				["\xa0SPEED", ""],
				[`<${store.speed}`, ""],
				["", ""],
				["", ""],
				["", "DUE TO"],
				["", "PERFORMANCE>[s-text]"],
				["", "DUE TO"],
				["", "WEATHER>[s-text]"],
				["", ""],
				["", ""],
				["", "", "__FMCSEPARATOR"],
				["<REQUEST", "VERIFY>"]
			])
		
			fmc.onNextPage = () => {
				offsetPage();
			};
			
			fmc.onPrevPage = () => {
				altPage();
			}
		};

		const offsetPage = () => {
			fmc.setTemplate([
				[`ATC OFFSET REQUEST`, "3", "4"],
				["\xa0OFFSET", ""],
				[`<${store.offset}`, ""],
				["\xa0OFFSET AT", ""],
				["-----", ""],
				["", ""],
				["", ""],
				["", "DUE TO"],
				["", "WEATHER>[s-text]"],
				["", ""],
				["", ""],
				["", "", "__FMCSEPARATOR"],
				["<REQUEST", "VERIFY>"]
			])
		
			fmc.onNextPage = () => {
				rtePage();
			};
			
			fmc.onPrevPage = () => {
				offsetPage();
			}
		};

		const rtePage = () => {
			fmc.setTemplate([
				[`ATC ROUTE REQUEST`, "4", "4"],
				["\xa0DIRECT TO", "HEADING"],
				[`<${store.route}`, "---"],
				["\xa0OFFSET AT", "GROUND TRACK"],
				["-----", "---"],
				["\xa0REQUEST", "REQUEST"],
				["<RTE 1[s-text]", "RTE 2>[s-text]"],
				["", "DUE TO"],
				["", "WEATHER>[s-text]"],
				["\xa0REQUEST DEP/ARR", ""],
				["<LACRE5.VANFS[s-text]", ""],
				["", "", "__FMCSEPARATOR"],
				["<REQUEST", "VERIFY>"]
			])
		
			fmc.onNextPage = () => {
				altPage();
			};
			
			fmc.onPrevPage = () => {
				offsetPage();
			}
		};

		if (store.altitude != "") {
			altPage();
		} else if (store.altitude == "" && store.speed != "") {
			speedPage();
		} else if (store.altitude == "" && store.speed == "" && store.offset != "") {
			offsetPage();
		}

		fmc.onLeftInput[0] = () => {
        	let value = fmc.inOut;
        	fmc.clearUserInput();
			store.altitude = value;
			FMC_ATC_Request.ShowPage(fmc, store);
		}

		fmc.onLeftInput[1] = () => {
        	let value = fmc.inOut;
        	fmc.clearUserInput();
			store.speed = value;
			FMC_ATC_Request.ShowPage(fmc, store);
		}

		fmc.onLeftInput[2] = () => {
        	let value = fmc.inOut;
        	fmc.clearUserInput();
			store.offset = value;
			FMC_ATC_Request.ShowPage(fmc, store);
		}

		fmc.onLeftInput[4] = () => {
			store.altitude = "";
			store.speed = "";
			store.offset = "";
			FMC_ATC_Request.ShowPage(fmc, store);
		}

		fmc.onLeftInput[5] = () => {
			FMC_ATC_Index.ShowPage(fmc);
		}

		fmc.onRightInput[5] = () => {
			FMC_ATC_VerifyRequest.ShowPage(fmc, title, lines);
		}

    }
}