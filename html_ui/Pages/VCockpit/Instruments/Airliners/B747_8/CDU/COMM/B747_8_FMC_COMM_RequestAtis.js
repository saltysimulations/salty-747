class FMC_COMM_RequestWeather {
    static ShowPage(fmc) {
		fmc.activeSystem = "FMC";
		fmc.clearDisplay();
		
		const updateView = () => {
			fmc.setTemplate([
				["COMPANY REQUEST"],
				["", ""],
				["<WEATHER", "ARR INFO>"],
				["", ""],
				["<ATIS", "LOADSHEET>"],
				["", ""],
				["", ""],
				["", ""],
				["", ""],
				["", ""],
				["", ""],
				["", "DATA LINK", "__FMCSEPARATOR"],
				["<DES FORECAST", "READY"]
			]);
		}
		updateView();
		
		fmc.onLeftInput[5] = () => {
			FMC_Menu.ShowPage(fmc);
		}
    }
}