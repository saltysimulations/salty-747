class FMCSaltyOptions_Taf {
	static ShowPage(fmc) {
		fmc.clearDisplay();

		var IRSState = SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum");
		if (IRSState == 0) { IRSState = "NOT ALIGNED[color]red"; }
		if (IRSState == 1) { IRSState = "ALIGNING[color]yellow"; }
		if (IRSState == 2) { IRSState = "ALIGNED[color]green"; }
		/* Simbrief Options */
		let simbriefId = SaltyDataStore.get("OPTIONS_SIMBRIEF_ID", "");
		let simbriefUser = SaltyDataStore.get("OPTIONS_SIMBRIEF_USER", "");

		fmc.setTemplate([
			["SALTY OPTIONS"],
			["", ""],
			["<IRS", ""],
			["", ""],
			["", ""],
			["", ""],
			["<METAR SRC", "ATIS SRC>"],
			["SIMBRIEF ID", "USERNAME"],
			[`<SIMBRIEF`, ""],
			["", ""],
			["", ""],
			["", ""],
			["", ""]
		]);

		/* LSK1 */
		fmc.onLeftInput[0] = () => {
			FMCSaltyOptions.IrsStatus(fmc);
		}

		/* LSK2 */
		fmc.onLeftInput[2] = () => {
		 	FMCSaltyOptions.MetarSrc(fmc);
		};

		/* RSK2 */
		fmc.onRightInput[2] = () => {
		  	FMCSaltyOptions.AtisSrc(fmc);
		};
		
		/* LSK4 */
		fmc.onLeftInput[3] = () => {
		  	FMCSaltyOptions.Simbrief(fmc);
		}
	}
}
//# sourceMappingURL=B747_8_FMC_SaltyOptions.js.map