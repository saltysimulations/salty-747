class FMC_MAINT_Options {
    static ShowPage(fmc) {
		fmc.activeSystem = "SAT";
		fmc.clearDisplay();
		let simbriefId = SaltyDataStore.get("OPTIONS_SIMBRIEF_ID", "");
		
		const updateView = () => {
			fmc.setTemplate([
				["COMPANY OPTIONS"],
				["\xa0SIMBRIEF ID", ""],
				[`[${simbriefId}]`, ""],
				["", ""],
				["<AIRLINE POL", "DISCRETES>"],
				["", ""],
				["<IRS MONITOR", ""],
				["", ""],
				["", ""],
				["", ""],
				["", ""],
				["", "", "__FMCSEPARATOR"],
				["<INDEX", ""]
			]);
		}
		updateView();
		
		fmc.onLeftInput[0] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			SaltyDataStore.set("OPTIONS_SIMBRIEF_ID", value);
			FMC_MAINT_Options.ShowPage(fmc);
		}
		
		fmc.onLeftInput[5] = () => {
			FMC_MAINT_Index.ShowPage(fmc);
		}
    }
}