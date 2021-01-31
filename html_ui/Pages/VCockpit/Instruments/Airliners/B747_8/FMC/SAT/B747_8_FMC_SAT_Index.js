class FMC_SAT_Index {
    static ShowPage(fmc) {
		fmc.activeSystem = "SAT";
		fmc.clearDisplay();
		
		const updateView = () => {
			fmc.setTemplate([
				["SAT-PHONE", "1", "2"],
				["SAT-L:ANSWERED", "PRIORITY"],
				["<END CALL", "LOW>"],
				["EURO OPNS", ""],
				["<QUEUE CALL", "DIRECTORY>"],
				["", ""],
				["", ""],
				["SAT-R:READY", "PRIORITY"],
				["<MAKE CALL", "SBB PUB"],
				["ASIA OPNS", ""],
				["", ""],
				["", ""],
				["", ""]
			]);
		}
		updateView();
		
		fmc.onNextPage = () => {
			FMC_SAT_Index.ShowPage2(fmc);
		};
		
		fmc.onPrevPage = () => {
			FMC_SAT_Index.ShowPage2(fmc);
		};
		
		fmc.onRightInput[1] = () => {
			FMC_SAT_Directory.ShowPage(fmc);
		}
	}
	
    static ShowPage2(fmc) {
		fmc.activeSystem = "SAT";
		fmc.clearDisplay();
		
		const updateView = () => {
			fmc.setTemplate([
				["SAT-PHONE", "2", "2"],
				["", ""],
				["", ""],
				["", ""],
				["<LOG", "BITE ON>"],
				["", ""],
				["<DIR DETAILS", "CONFIG>"],
				["", ""],
				["", "SWIFT>"],
				["\xa0CIU CALLS", ""],
				["<ENABLED", ""],
				["", ""],
				["", ""]
			]);
		}
		updateView();
		
		fmc.onNextPage = () => {
			FMC_SAT_Index.ShowPage(fmc);
		};
		
		fmc.onPrevPage = () => {
			FMC_SAT_Index.ShowPage(fmc);
		};
		
		fmc.onRightInput[1] = () => {
			FMC_SAT_Directory.ShowPage(fmc);
		}
    }
}