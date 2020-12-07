class FMC_ATC_VerifyReport {
    static ShowPage(fmc) {
        fmc.clearDisplay();
        if (atcConnection && noPendingUplink) {
	        fmc.setTemplate([
	            ["VERIFY REPORT"],
	            ["", ""],
	            ["<EMERGENCY", "POS REPORT>"],
	            ["", ""],
	            ["<REQUEST", "WHEN CAN WE>"],
	            ["", ""],
	            ["<REPORT", "FREE TEXT>"],
	            ["", ""],
	            ["<LOG", "CLEARANCE>"],
	            ["", ""],
	            ["<LOGON/STATUS", "VOICE>"],
	            ["", "", "__FMCSEPARATOR"],
	            ["<PRINT LOG", ""]
	        ]);

	        /*
				Push - displays EMERGENCY REPORT page.
	        */
	        fmc.onLeftInput[0] = () => {
	        	FMC_ATC_EmergencyReport.ShowPage(fmc);
	        }

	        /*
				Push - displays ATC REQUEST page.
	        */
	        fmc.onLeftInput[1] = () => {
	        	FMC_ATC_Request.ShowPage(fmc);
	        }

	        /*
				Push - displays ATC REPORT page.
	        */
	        fmc.onLeftInput[2] = () => {
	        	FMC_ATC_Report.ShowPage(fmc);
	        }

	        /*
				Push - displays ATC LOG page.
	        */
	        fmc.onLeftInput[3] = () => {
	        	FMC_ATC_Log.ShowPage(fmc);
	        }

	        /*
				Push - displays ATC LOGON/STATUS page.
	        */
	        fmc.onLeftInput[4] = () => {
	        	FMC_ATC_LogonStatus.ShowPage(fmc);
	        }

	        /*
				Push - transmits contents of ATC log to printer when <PRINT LOG or <PRINTERROR displayed.The following display descriptions are the same for all PRINT prompts in Section 5.33.Displays <PRINTERROR when the printer has an error.Displays PRINTING when the printer is busy and the print prompt is selected.Displays BUSY when the printer is busy and the printer prompt has not been selected. The title line displays small font PRINT.Displays FAIL when the printer has failed. The title line displays PRINT.
	        */
	        fmc.onLeftInput[5] = () => {
	        	FMC_ATC_PrintLog.ShowPage(fmc);
	        }

	        /*
				Push - displays POS REPORT page.
	        */
	        fmc.onRightInput[0] = () => {
	        	FMC_ATC_PosReport.ShowPage(fmc);
	        }

	        /*
				Push - displays WHEN CAN WE EXPECT page.
	        */
	        fmc.onRightInput[1] = () => {
	        	FMC_ATC_WhenCanWe.ShowPage(fmc);
	        }

	        /*
				Push - displays the VERIFY REPORT page with only the free text message element.
	        */
	        fmc.onRightInput[2] = () => {
	        	FMC_ATC_VerifyReport.ShowPage(fmc);
	        }

	        /*
				Push - displays VERIFY REQUEST pages for clearance request.
	        */
	        fmc.onRightInput[3] = () => {
	        	FMC_ATC_VerifyRequest.ShowPage(fmc);
	        }

	        /*
				Push - displays VERIFY REQUEST page for voice contact request.
	        */
	        fmc.onRightInput[4] = () => {
	        	FMC_ATC_VerifyRequest.ShowPage(fmc);
	        }
	    } else if (atcConnection && !noPendingUplink) {
	    	FMC_ATC_Log.ShowPage(fmc);
	    } else if (!atcConnection) {
	    	FMC_ATC_LogonStatus.ShowPage(fmc);
	    }
    }
}