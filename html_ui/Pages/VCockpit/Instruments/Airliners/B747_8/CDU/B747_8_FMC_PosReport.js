class FMC_PosReport {
    static ShowPage(fmc) {
		fmc.clearDisplay();
		
		let fltNoCell = SimVar.GetSimVarValue("ATC FLIGHT NUMBER", "string") ? SimVar.GetSimVarValue("ATC FLIGHT NUMBER", "string") : "XXXX";
		let posCell = "4730N110W";
		let altCell = "FL370";
		let ataCell = "1336Z";
		let estCell = "GRF";
		let etaCell = "1335Z";
		let nextCell = "46N120W";
		let destEtaCell = "1530Z";
		let tempCell = `${SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "Celsius")}°C`
		let spdCell = ".80";
		let windCell = `${SimVar.GetSimVarValue("AMBIENT WIND DIRECTION", "Degrees").toFixed(0)}°/ ${SimVar.GetSimVarValue("AMBIENT WIND VELOCITY", "Knots").toFixed(0)}KT`;
		let posFuelCell = "52.3";
		let companySendCell = "SEND";
		let atcSendCell = "SEND";

		fmc.setTemplate([
			[`${fltNoCell} POS REPORT`],
			["\xa0POS", "ALT", "ATA"],
			[`${posCell}`, `${altCell}`, `${ataCell}`],
			["\xa0EST", "ETA"],
			[`${estCell}`, `${etaCell}`],
			["\xa0NEXT", "DEST ETA"],
			[`${nextCell}`, `${destEtaCell}`],
			["\xa0TEMP", "SPD", "WIND"],
			[`${tempCell}`, `${spdCell}`, `${windCell}`],
			["", "POS FUEL"],
			["", `${posFuelCell}`],
			["COMPANY", "ATC", "__FMCSEPARATOR"],
			[`<${companySendCell}`, `${atcSendCell}>`]
		]);

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
    }
}