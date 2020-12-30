class FMC_COMM_RequestWeather {
    static ShowPage(fmc, store = {metar: "METAR>", taf: "TAF>", shortTaf: "SHORT TAF>"}) {
		fmc.activeSystem = "DLNK";
		fmc.clearDisplay();
		let fltNo;
		let originCell = "----";
		let destCell = "----";
		let altnCell = "----";
		let arptCell = "----";
		if (fmc.atcComm.fltNo != "") {
			fltNo = fmc.atcComm.fltNo;
		}
		if (fmc.atcComm.origin != "") {
			originCell = fmc.atcComm.origin;
		}
		if (fmc.atcComm.dest != "") {
			destCell = fmc.atcComm.dest;
		}
		
		const updateView = () => {
			fmc.setTemplate([
				["WEATHER REQUEST"],
				["\xa0ORIGIN", "DESTINATION"],
				[`<${originCell}`, `${destCell}>`],
				["\xa0ALTERNATE", "AIRPORT"],
				[`<${altnCell}`, `${arptCell}>`],
				["", ""],
				["", ""],
				["", "REQUEST"],
				["", "METAR>"],
				["\xa0RECEIVED", "REQUEST"],
				["<MESSAGES", "TAF>"],
				["\xa0ACARS", "REQUEST"],
				["<INDEX", "SHORT TAF>"]
			]);
		}
		updateView();
		
		fmc.onLeftInput[5] = () => {
			FMC_COMM_Requests.ShowPage(fmc);
		}
		
		fmc.onRightInput[3] = () => {
			
			const get = async () => {

				getMetar("klax", updateView);
			};

			get()
				.then(() => {
					updateView();
				setTimeout(() => {
				}, 100);
			});
		}
    }
}