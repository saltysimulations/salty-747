class FMC_COMM_RequestAtis {
    static ShowPage(fmc, store = {arpt1: "", arpt2: "", arpt3: "", arpt4: "", depAtis: "DEP ATIS>", arrAtis: "ARR ATIS>"}) {
		fmc.activeSystem = "DLNK";
		fmc.clearDisplay();
        let labelTimeout;
		let aprt1Cell = "----";
		let aprt2Cell = "----";
		let aprt3Cell = "----";
		let aprt4Cell = "----";

		store.arpt1 = fmc.flightPlanManager.getOrigin() ? fmc.flightPlanManager.getOrigin().ident : "";
		store.arpt2 = fmc.flightPlanManager.getDestination() ? fmc.flightPlanManager.getDestination().ident : "";
		if (store.arpt1 != "") {
			aprt1Cell = store.arpt1;
		}
		if (store.arpt2 != "") {
			aprt2Cell = store.arpt2;
		}
		if (store.arpt3 != "") {
			aprt3Cell = store.arpt3;
		}
		if (store.arpt4 != "") {
			aprt4Cell = store.arpt4;
		}
		
		const updateView = () => {
			fmc.setTemplate([
				["ATIS REQUEST"],
				["\xa0ORIGIN", "DESTINATION"],
				[`<${aprt1Cell}`, `${aprt2Cell}>`],
				["", ""],
				["", ""],
				["", ""],
				["", ""],
				["", "REQUEST"],
				["", `${store.depAtis}`],
				["\xa0RECEIVED", "REQUEST"],
				["<MESSAGES", `${store.arrAtis}`],
				["\xa0ACARS", ""],
				["<INDEX", ""]
			]);
		}
		updateView();
		
		/* RSK4 */
		fmc.onRightInput[3] = () => {
			const icaos = [aprt1Cell, aprt2Cell];
			const lines = [];
            const newMessage = { "id": Date.now(), "time": '00:00', "opened": null, "type": 'D-ATIS', "content": lines, };
			const getInfo = async () => {
				getATIS(store.arpt1, lines, "dep", store, updateView);
			};

            getInfo().then(() => {
    			store.depAtis = "SENDING\xa0";
    			updateView();
            	setTimeout(
            		function() {
            		}
        		);
                setTimeout(() => {
                    newMessage["time"] = fetchTimeValue();
                    fmc.addMessage(newMessage);
                }, Math.floor(Math.random()  * 1000) + 750);
                labelTimeout = setTimeout(() => {
                    store.depAtis = "DEP ATIS>";
                    fmc.showErrorMessage("ACARS UPLINK");
                    updateView();
                }, 2000);
            });
		}

		/* LSK5 */
		fmc.onLeftInput[4] = () => {
			FMC_COMM_Log.ShowPage(fmc);
		}
		
		/* RSK5 */
		fmc.onRightInput[4] = () => {
			const icaos = [aprt1Cell, aprt2Cell];
			const lines = [];
            const newMessage = { "id": Date.now(), "time": '00:00', "opened": null, "type": 'D-ATIS', "content": lines, };
			const getInfo = async () => {
				getATIS(store.arpt2, lines, "arr", store, updateView);
			};

            getInfo().then(() => {
    			store.arrAtis = "SENDING\xa0";
    			updateView();
            	setTimeout(
            		function() {
            		}
        		);
                setTimeout(() => {
                    newMessage["time"] = fetchTimeValue();
                    fmc.addMessage(newMessage);
                }, Math.floor(Math.random()  * 1000) + 750);
                labelTimeout = setTimeout(() => {
                    store.arrAtis = "ARR ATIS>";
                    fmc.showErrorMessage("ACARS UPLINK");
                    updateView();
                }, 2000);
            });
		}
		
		/* LSK6 */
		fmc.onLeftInput[5] = () => {
			FMC_COMM_Requests.ShowPage(fmc);
		}
    }
}