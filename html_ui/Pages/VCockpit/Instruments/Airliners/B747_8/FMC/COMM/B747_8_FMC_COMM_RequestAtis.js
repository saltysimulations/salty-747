class FMC_COMM_RequestAtis {
    static ShowPage(fmc, store = {atis: "ATIS>"}) {
		fmc.activeSystem = "DLNK";
		fmc.clearDisplay();
		let fltNo;
		let originCell = "----";
		let destCell = "----";
		let altnCell = "----";
		let arptCell = "----";
		if (fmc.atcComm.fltNo != "") {
			fltNoCell = fmc.atcComm.fltNo;
		}
		if (fmc.atcComm.origin != "") {
			originCell = fmc.atcComm.origin;
		}
		if (fmc.atcComm.dest != "") {
			destCell = fmc.atcComm.dest;
		}
		
		const updateView = () => {
			fmc.setTemplate([
				["ATIS REQUEST"],
				["\xa0ORIGIN", "DESTINATION"],
				[`<${originCell}`, `${destCell}>`],
				["\xa0ALTERNATE", "AIRPORT"],
				[`<${altnCell}`, `${arptCell}>`],
				["", ""],
				["", ""],
				["", "REQUEST"],
				["", `${store.atis}`],
				["\xa0RECEIVED", ""],
				["<MESSAGES", ""],
				["\xa0ACARS", ""],
				["<INDEX", ""]
			]);
		}
		updateView();
		
		fmc.onLeftInput[5] = () => {
			FMC_COMM_Requests.ShowPage(fmc);
		}
		
		fmc.onRightInput[3] = () => {		
			store.atis = "SENDING";
			updateView();	
			const get = async () => {
				getAtis("klax", store, updateView);
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