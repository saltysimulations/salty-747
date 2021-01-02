class FMCSaltyOptions_Cpdlc {
	static ShowPage(fmc) {
		fmc.clearDisplay();

        const storedCpdlcNet = SaltyDataStore.get("OPTIONS_CPDLC_NETWORK", "HOPPIE");

        let hoppie = "*HOPPIE[color]white";
        let poscon = "*POSCON[color]white";

        switch (storedCpdlcNet) {
            case "POSCON":
                vatsim = "POSCON[color]green";
                break;
            default:
                faa = "HOPPIE[color]green";
        }

		fmc.setTemplate([
			["CPDLC NETWORK"],
			["", ""],
			[hoppie, ""],
			["", ""],
			[poscon, ""],
			["", ""],
			["", ""],
			["", ""],
			["", ""],
			["", ""],
			["", ""],
			["\xa0RETURN TO", ""],
			["<OPTIONS", ""]
		]);
		
		/* LSK1 */
		fmc.onLeftInput[0] = () => {
		  	let value = fmc.inOut;
		  	fmc.clearUserInput();
		  	SaltyDataStore.set("OPTIONS_CPDLC_NETWORK", "HOPPIE");
		  	FMCSaltyOptions_Simbrief.ShowPage(fmc);
		}
		
		/* RSK1 */
		fmc.onLeftInput[1] = () => {
	  		let value = fmc.inOut;
		  	fmc.clearUserInput();
		  	SaltyDataStore.set("OPTIONS_CPDLC_NETWORK", "POSCON");
		  	FMCSaltyOptions_Simbrief.ShowPage(fmc);
		}

		/* LSK6 */
		fmc.onLeftInput[5] = () => {
			FMCSaltyOptions.ShowPage1(fmc);
		}
	}
}
//# sourceMappingURL=B747_8_FMC_SaltyOptions.js.map