class FMC_ATC_XRequest {
    static ShowPage(fmc, store = {"altitude": "", "speed": "", "offset": "", "showRte": 0}) {
		fmc.activeSystem = "DLNK";
		fmc.clearDisplay();

		const altPage = () => {

			store.altitude = store.altitude ? store.altitude : "-----";

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

			store.speed = store.speed ? store.speed : "---";

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

		const offsetPage = (store = {offsetAt: "-----" ,offsetWeather: "WEATHER[s-text]", offsetWeatherStatus: 0}) => {
			store.offset = store.offset ? store.offset : "---";
			fmc.setTemplate([
				[`ATC OFFSET REQUEST`, "3", "4"],
				["\xa0OFFSET", ""],
				[`${store.offset}NM`, ""],
				["\xa0OFFSET AT", ""],
				[`${store.offsetAt}`, ""],
				["", ""],
				["", ""],
				["", "DUE TO"],
				["", `${store.offsetWeather}>`],
				["", ""],
				["", ""],
				["", "", "__FMCSEPARATOR"],
				["<REQUEST", "VERIFY>"]
			])
		
			fmc.onNextPage = () => {
				rtePage();
			};
			
			fmc.onPrevPage = () => {
				speedPage();
			}
			
			fmc.onLeftInput[0] = () => {
				let value = fmc.inOut;
				fmc.clearUserInput();
				store.offset = value;
				offsetPage(store);
			}
			
			fmc.onLeftInput[1] = () => {
				let value = fmc.inOut;
				fmc.clearUserInput();
				store.offsetAt = value;
				offsetPage(store);
			}
			
			fmc.onRightInput[3] = () => {
				if (store.offsetWeatherStatus == 1) {
					store.offsetWeatherStatus = 0;
					store.offsetWeather = 'WEATHER[s-text]';
					offsetPage(store);
				} else {
					store.offsetWeatherStatus = 1;
					store.offsetWeather = 'WEATHER';
					offsetPage(store);
				}
			}
		};

		const rtePage = (store = {dctTo: "-----", hdg: "---", offsetAt: "-----", gndTrk: "---", rte1: "RTE 1[s-text]", rte2: "RTE 2[s-text]", depArr: "LACRE5.VANFS[s-text]",}) => {

			fmc.setTemplate([
				[`ATC ROUTE REQUEST`, "4", "4"],
				["\xa0DIRECT TO", "HEADING"],
				[`${store.dctTo}`, `${store.hdg}`],
				["\xa0OFFSET AT", "GROUND TRACK"],
				[`${store.offsetAt}`, `${store.gndTrk}`],
				["\xa0REQUEST", "REQUEST"],
				[`<${store.rte1}`, `${store.rte2}>`],
				["", ""],
				["", ""],
				["\xa0REQUEST DEP/ARR", ""],
				[`<${store.depArr}`, ""],
				["", "", "__FMCSEPARATOR"],
				["<REQUEST", "VERIFY>"]
			])
		
			fmc.onNextPage = () => {
				altPage();
			};
			
			fmc.onPrevPage = () => {
				offsetPage();
			}
			
			fmc.onLeftInput[0] = () => {
				let value = fmc.inOut;
				fmc.clearUserInput();
				store.dctTo = value;
				rtePage(store);
			}
			
			fmc.onLeftInput[1] = () => {
				let value = fmc.inOut;
				fmc.clearUserInput();
				store.offsetAt = value;
				rtePage(store);
			}
			
			fmc.onLeftInput[2] = () => {
				store.rte1 = 'RTE 1';
				store.rte2 = 'RTE 2[s-text]';
				rtePage(store);
			}
			
			fmc.onLeftInput[4] = () => {
				let value = fmc.inOut;
				fmc.clearUserInput();
				store.depArr = value;
				rtePage(store);
			}
			
			fmc.onRightInput[0] = () => {
				let value = fmc.inOut;
				fmc.clearUserInput();
				store.hdg = value;
				rtePage(store);
			}
			
			fmc.onRightInput[1] = () => {
				let value = fmc.inOut;
				fmc.clearUserInput();
				store.gndTrk = value;
				rtePage(store);
			}
			
			fmc.onRightInput[2] = () => {
				store.rte1 = 'RTE 1[s-text]';
				store.rte2 = 'RTE 2';
				rtePage(store);
			}
		};
		
		if (store.showRte == 1) {
			rtePage();
		} else {
			if (store.altitude != "") {
				altPage();
			} else if (store.altitude == "" && store.speed != "") {
				speedPage();
			} else if (store.altitude == "" && store.speed == "" && store.offset != "") {
				offsetPage();
			}
		}

		fmc.onLeftInput[5] = () => {
			FMC_ATC_Request.ShowPage(fmc, store);
		}

		fmc.onRightInput[5] = () => {
			FMC_ATC_VerifyRequest.ShowPage(fmc, title, lines);
		}

    }
}