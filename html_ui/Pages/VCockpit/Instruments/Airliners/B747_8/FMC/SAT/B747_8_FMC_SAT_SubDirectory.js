class FMC_SAT_SubDirectory {
    static ShowPage(fmc, title) {
		fmc.activeSystem = "SAT";
		fmc.clearDisplay();
		
		const updateView = () => {
			fmc.setTemplate([
				["SAT DIRECTORY", "01", "20"],
				["SAT-L", "SAT-R", title],
				["", "", "<-FLIGHT DISPATCH EDDF-->"],
				["", "", "001-319-829-1728"],
				["", "", "<-MAINT WATCH EDDF-->"],
				["", "", "001-319-829-1728"],
				["", "", "<-ENGINEERING-->"],
				["", "", "001-319-829-1728"],
				["", "", "<-LINE MAINT CENTER-->"],
				["", "", "001-319-829-1728"],
				["", "", "<-STORES EDDF-->"],
				["", "", "001-319-829-1728"],
				["<RETURN", ""]
			]);
		}
		updateView();
		
		fmc.onNextPage = () => {
			FMC_SAT_SubDirectory.ShowPage2(fmc, title);
		};
		
		fmc.onPrevPage = () => {
			FMC_SAT_SubDirectory.ShowPage2(fmc, title);
		};
		
		fmc.onLeftInput[5] = () => {
			FMC_SAT_Directory.ShowPage(fmc);
		}
	}
	
    static ShowPage2(fmc, title) {
		fmc.activeSystem = "SAT";
		fmc.clearDisplay();
		
		const updateView = () => {
			fmc.setTemplate([
				["SAT DIRECTORY", "02", "20"],
				["SAT-L", "SAT-R", title],
				["", "", "<-FLIGHT DISPATCH EDDF-->"],
				["", "", "001-319-829-1728"],
				["", "", "<-MAINT WATCH EDDF-->"],
				["", "", "001-319-829-1728"],
				["", "", "<-ENGINEERING-->"],
				["", "", "001-319-829-1728"],
				["", "", "<-LINE MAINT CENTER-->"],
				["", "", "001-319-829-1728"],
				["", "", "<-STORES EDDF-->"],
				["", "", "001-319-829-1728"],
				["<RETURN", ""]
			]);
		}
		updateView();
		
		fmc.onNextPage = () => {
			FMC_SAT_SubDirectory.ShowPage(fmc, title);
		};
		
		fmc.onPrevPage = () => {
			FMC_SAT_SubDirectory.ShowPage(fmc, title);
		};
		
		fmc.onLeftInput[5] = () => {
			FMC_SAT_Directory.ShowPage(fmc);
		}
    }
}