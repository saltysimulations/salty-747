class FMC_MAINT_Index {
    static ShowPage(fmc) {
		fmc.activeSystem = "MAINT";
		fmc.clearDisplay();
		let simbriefId = SaltyDataStore.get("OPTIONS_SIMBRIEF_ID", "");
		
		const updateView = () => {
			fmc.setTemplate([
				["MAINTENANCE"],
				["", ""],
				["<CROSS LOAD", "SENSORS>"],
				["", ""],
				["<AIRLINE POL", "DISCRETES>"],
				["", "SIMBRIEF ID"],
				["<IRS MONITOR", `[${simbriefId}]`],
				["", ""],
				["", ""],
				["", ""],
				["", ""],
				["", "", "__FMCSEPARATOR"],
				["<INDEX", ""]
			]);
		}
		updateView();
		
		fmc.onLeftInput[5] = () => {
			FMC_Menu.ShowPage(fmc);
		}
		
		fmc.onRightInput[2] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			SaltyDataStore.set("OPTIONS_SIMBRIEF_ID", value);
			FMC_MAINT_Options.ShowPage(fmc);
		}
    }
}