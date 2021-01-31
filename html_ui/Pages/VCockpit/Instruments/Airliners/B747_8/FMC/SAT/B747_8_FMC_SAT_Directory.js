class FMC_SAT_Directory {
    static ShowPage(fmc) {
		fmc.activeSystem = "SAT";
		fmc.clearDisplay();
		
		const updateView = () => {
			fmc.setTemplate([
				["SAT DIRECTORY INDEX", "1", "2"],
				["", ""],
				["<EMERGENCY", "COMPANY>"],
				["", ""],
				["<ATL ATS", "OPERATIONS>"],
				["", ""],
				["<PAC ATS", "8>"],
				["", ""],
				["<IND ATS", "9>"],
				["", ""],
				["<5", "10>"],
				["", ""],
				["<RETURN", ""]
			]);
		}
		updateView();
		
		fmc.onNextPage = () => {
			FMC_SAT_Directory.ShowPage2(fmc);
		};
		
		fmc.onPrevPage = () => {
			FMC_SAT_Directory.ShowPage2(fmc);
		};
		
		fmc.onLeftInput[5] = () => {
			FMC_SAT_Index.ShowPage(fmc);
		};
		
		fmc.onRightInput[0] = () => {
			FMC_SAT_SubDirectory.ShowPage(fmc, "COMPANY");
		};
	}
	
    static ShowPage2(fmc) {
		fmc.activeSystem = "SAT";
		fmc.clearDisplay();
		
		const updateView = () => {
			fmc.setTemplate([
				["SAT DIRECTORY INDEX", "2", "2"],
				["", ""],
				["<11", "12>"],
				["", ""],
				["<13", "14>"],
				["", ""],
				["<15", "16>"],
				["", ""],
				["<17", "18>"],
				["", ""],
				["<19", "20>"],
				["", ""],
				["<RETURN", ""]
			]);
		}
		updateView();
		
		fmc.onNextPage = () => {
			FMC_SAT_Directory.ShowPage(fmc);
		};
		
		fmc.onPrevPage = () => {
			FMC_SAT_Directory.ShowPage(fmc);
		};
		
		fmc.onLeftInput[5] = () => {
			FMC_SAT_Index.ShowPage(fmc);
		};
		
		fmc.onRightInput[0] = () => {
			FMC_SAT_SubDirectory.ShowPage(fmc, "12");
		};
    }
}