class FMC_COMM_Index {
    static ShowPage(fmc) {
		fmc.activeSystem = "FMC";
		fmc.clearDisplay();
		
		const updateView = () => {
			fmc.setTemplate([
				["ATC INDEX"],
				["\xa0UPLINK", ""],
				["<RTE 1", "POS REPORT>"],
				["\xa0UPLINK (2)", ""],
				["<ALTN", "REQUESTS>"],
				["", ""],
				["<PERF", ""],
				["", ""],
				["<TAKEOFF", ""],
				["", ""],
				["<WIND", ""],
				["", "DATA LINK", "__FMCSEPARATOR"],
				["<DES FORECAST", "READY"]
			]);
		}
		updateView();

		fmc.onLeftInput[0] = () => {
			FMC_COMM_Preflight.ShowPage(fmc);
		}

		fmc.onLeftInput[1] = () => {
			FMC_COMM_Altn.ShowPage(fmc);
		}
		
		fmc.onLeftInput[2] = () => {
			FMC_COMM_Perf.ShowPage(fmc);
		}
		
		fmc.onLeftInput[3] = () => {
			FMC_COMM_Takeoff.ShowPage(fmc);
		}
		
		fmc.onLeftInput[4] = () => {
			FMC_COMM_Wind.ShowPage(fmc);
		}
		
		fmc.onLeftInput[5] = () => {
			FMC_Menu.ShowPage(fmc);
		}
		
		fmc.onRightInput[2] = () => {
			FMC_COMM_Requests.ShowPage(fmc);
		}
		
		fmc.onRightInput[0] = () => {
			FMC_PosReport.ShowPage(fmc);
		}
    }
}