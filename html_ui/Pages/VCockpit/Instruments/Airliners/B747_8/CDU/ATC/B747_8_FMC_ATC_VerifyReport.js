class FMC_ATC_VerifyReport {
    static ShowPage(fmc, lines) {
		fmc.activeSystem = "DLNK";
		fmc.clearDisplay();
		
		lines.push("\xa0FREE TEXT");
		lines.push("<");
		lines.push("");
		lines.push("<");

        const updateView = () => {
        	fmc.setTemplate([
	            [`VERIFY REPORT`],
	            ["", ""],
	            [lines[0] ? lines[0] : ""],
	            [lines[1] ? lines[1] : ""],
	            [lines[2] ? lines[2] : ""],
	            [lines[3] ? lines[3] : ""],
	            [lines[4] ? lines[4] : ""],
	            [lines[5] ? lines[5] : ""],
	            [lines[6] ? lines[6] : ""],
	            [lines[7] ? lines[7] : "", "REPORT"],
	            [lines[8] ? lines[8] : "", "SEND>"],
	            ["", "", "__FMCSEPARATOR"],
	            [`<REPORT`]
	        ]);
        }
		updateView();
		
        fmc.onLeftInput[5] = () => {
			FMC_ATC_Report.ShowPage(fmc);
		}
    }
}