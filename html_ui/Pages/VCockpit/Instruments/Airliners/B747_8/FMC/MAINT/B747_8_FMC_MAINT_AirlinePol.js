class FMC_MAINT_AirlinePol {
    static ShowPage(fmc) {
		fmc.clearDisplay();
		let costIndexPolicy = 35;
		
		const updateView = () => {
			fmc.setTemplate([
				["AIRLINES POLICY"],
				["\xa0COST INDEX", ""],
				[`[${costIndexPolicy}]`, ""],
				["", ""],
				["", ""],
				["", ""],
				["", ""],
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