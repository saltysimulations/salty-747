class FMC_COMM_Requests {
    static ShowPage(fmc) {
		fmc.activeSystem = "DLNK";
		fmc.clearDisplay();
		
		const updateView = () => {
			fmc.setTemplate([
				["ACARS REQUESTS"],
				["", ""],
				["<PDC", "WEATHER>"],
				["", ""],
				["<ROUTE", "ATIS>"],
				["", ""],
				["<RELEASE", "ARR INFO>"],
				["", ""],
				["<LOADSHEET", "LAND PERF>"],
				["", "FREE TEXT"],
				["<T/O PERF", "TELEX>"],
				["\xa0ACARS", "DATA LINK"],
				["<INDEX", "READY"]
			]);
		}
		updateView();
		
		fmc.onLeftInput[0] = () => {
			FMC_COMM_PDC.ShowPage(fmc);
		}
		
		fmc.onLeftInput[5] = () => {
			FMC_COMM_Index.ShowPage(fmc);
		}
		
		fmc.onRightInput[0] = () => {
			FMC_COMM_RequestWeather.ShowPage(fmc);
		}
		
		fmc.onRightInput[1] = () => {
			FMC_COMM_RequestAtis.ShowPage(fmc);
		}
    }
}