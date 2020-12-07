class FMC_ATC_VerifyRequest {
    static ShowPage(fmc, lines) {
        fmc.clearDisplay();

        const updateView = () => {
        	fmc.setTemplate([
	            [`VERIFY ${lines[0]}`, "1", "N"],
	            ["", ""],
	            [`${lines[1]}`],
	            [`${lines[2]}`],
	            [`${lines[3]}`],
	            [`${lines[4]}`],
	            ["\xa0FREE TEXT"],
	            ["DECOMPRESSION"],
	            ["<"],
	            ["", "REPORT"],
	            ["<", "SEND>"],
	            ["", "", "__FMCSEPARATOR"],
	            ["<EMERGENCY"]
	        ]);
        }
        updateView();

        /*
			Pages 1/N to N/N display data from the EMERGENCY REPORT page and provide at least one line for free text entry. Page 1/N line 1 displays MAYDAY MAYDAY MAYDAY message or PAN PAN PAN message as selected on EMERGENCY REPORT page.•   MAYDAY MAYDAY MAYDAY message and PAN PAN PAN messages may be deleted•   deletion of MAYDAY MAYDAY MAYDAY message deletes DESCENDING TO line
            When multiple VERIFY EMERGENCY pages exist, the line title shows CONTINUED.Push - displays EMERGENCY REPORT page.
        */
        fmc.onLeftInput[5] = () => {
        	FMC_ATC_EmergencyReport.ShowPage(fmc);
        }

        /*
			Displays on last VERIFY EMERGENCY page.Push - •   transmits an emergency report message containing the information on the VERIFY EMERGENCY page•   when MAYDAY selected and when enabled in airline policy file: transmits ATC position report, activates ADS in emergency mode, and transmits an AOC emergency report
        */
        fmc.onRightInput[5] = () => {
        	FMC_ATC_VerifyRequest.ShowPage(fmc, emergType, divert, sob, offset, fuelTime, descend);
        }
    }
}