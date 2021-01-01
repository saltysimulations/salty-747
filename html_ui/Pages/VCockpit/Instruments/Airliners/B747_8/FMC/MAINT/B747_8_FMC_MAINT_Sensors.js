class FMC_MAINT_Sensors {
    static ShowPage(fmc) {
		fmc.clearDisplay();
		
		const updateView = () => {
			fmc.setTemplate([
				["SENSORS"],
				["\xa0OAT", "SAT"],
				[``, ""],
				["FUEL TOTAL QUANTITY", "RADIO ALT"],
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
		
		fmc.onLeftInput[5] = () => {
			FMC_MAINT_Index.ShowPage(fmc);
		}
    }
}