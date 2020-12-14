class FMC_MAINT_Index {
    static ShowPage(fmc) {
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
		
		fmc.onRightInput[2] = () => {
			FMC_MAINT_Options.ShowPage(fmc);
		}
    }
}