class FMC_COMM_Index {
    static ShowPage(fmc) {
		fmc.activeSystem = "DLNK";
		fmc.clearDisplay();
		
		const updateView = () => {
			fmc.setTemplate([
				["ACARS INDEX"],
				["", ""],
				["<PREFLIGHT", ""],
				["", ""],
				["<INFLIGHT", ""],
				["", ""],
				["<POSTFLIGHT", ""],
				["", ""],
				["", ""],
				["", ""],
				["", ""],
				["", "LINK\xa0"],
				["", "STATUS>"]
			]);
		}
		updateView();

		fmc.onLeftInput[0] = () => {
			FMC_COMM_Preflight.ShowPage(fmc);
		}

		fmc.onLeftInput[1] = () => {
			FMC_COMM_Inflight.ShowPage(fmc);
		}
		
		fmc.onLeftInput[2] = () => {
			FMC_COMM_Postflight.ShowPage(fmc);
		}
		
		fmc.onRightInput[5] = () => {
			FMC_COMM_LinkStatus.ShowPage(fmc);
		}
    }
}