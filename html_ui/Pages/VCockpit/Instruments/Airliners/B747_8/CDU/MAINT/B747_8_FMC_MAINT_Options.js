class FMC_MAINT_AirlinePol {
    static ShowPage(fmc) {
		fmc.activeSystem = "SAT";
		fmc.clearDisplay();
		
		const updateView = () => {
			fmc.setTemplate([
				["OPTIONS"],
				["", ""],
				["<CROSS LOAD", "SENSORS>"],
				["", ""],
				["<AIRLINE POL", "DISCRETES>"],
				["", ""],
				["<IRS MONITOR", "OPTIONS>"],
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
    }
}