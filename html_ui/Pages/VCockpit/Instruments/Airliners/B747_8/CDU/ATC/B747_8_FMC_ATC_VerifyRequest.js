class FMC_ATC_VerifyRequest {
    static ShowPage(fmc, title, lines) {
		fmc.clearDisplay();
		
		lines.push("\xa0FREE TEXT");
		lines.push("DECOMPRESSION");
		lines.push("<");
		lines.push("");
		lines.push("<");

		let linesCount = lines.length + 5;
		let pagesCount = Math.round(linesCount / 10);
		let titleCell = title == "EMERGENCY" ? "VERIFY EMERGENCY" : "VERIFY REQUEST";
		let returnPage = title == "EMERGENCY" ? "EMERGENCY" : "REQUEST";

        const updateView = () => {
        	fmc.setTemplate([
	            [`${titleCell}`, "1", pagesCount.toFixed(0)],
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
	            [`<${returnPage}`]
	        ]);
        }
		updateView();
		
        fmc.onLeftInput[5] = () => {
			if (title == "EMERGENCY") {
				FMC_ATC_EmergencyReport.ShowPage(fmc);
			} else {
				FMC_ATC_Request.ShowPage(fmc);
			}
		}
    }
}