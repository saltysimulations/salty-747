class FMC_ATC_EmergencyReport {
    static ShowPage(fmc) {
        fmc.clearDisplay();

        let mayday = "MAYDAY[s-label]";
        let pan = "PAN[s-label]";
        let emergType = 0;
        let divert;
        let divertCell = "----";
        let sob;
        let sobCell = "----";
        let offset;
        let offsetCell = "----";
        let fuel;
        let fuelCell = "--.-LB";
        let fuelTime;
        let fuelTimeCell = "HH+MM";
        let descend;
        let descendCell = "140000";
        let erase = 0;
        let eraseCell = "<ERASE EMERGENCY";

        const updateView = () => {
        	fmc.setTemplate([
	            ["EMERGENCY REPORT"],
	            ["", ""],
	            [`${mayday}`, `${pan}`],
	            ["\xa0DIVERT TO", "SOB"],
	            [`<${divert}`, `${sob}>`],
	            ["\xa0OFFSET", "FUEL REMAINING"],
	            [`${offset}`, `${fuel} ${fuelTime}`],
	            ["\xa0DESCEND TO", ""],
	            [`<${descend}`, ""],
	            ["", ""],
	            [`${erase}`, ""],
	            ["", "", "__FMCSEPARATOR"],
	            ["<ATC INDEX", "VERIFY>"]
	        ]);
        }
        updateView();

        /*
			Before selecting <MAYDAY or PAN>, entering a number in SOB line displays fuel remaining data for inclusion in the downlink message.
			Push - •displays MAYDAY MAYDAY MAYDAY on the VERIFY EMERGENCY page•   selects, but does not display, additional POSITION REPORT message elements for inclusion in the emergency report downlink•   when current altitude more than 150 feet above altitude in 4L, displays DESCENDING TO on VERIFY EMERGENCY page
        */
        fmc.onLeftInput[0] = () => {
        	if (sob) {
        		/*
        			0 = NOT SELECTED
        			1 = MAYDAY
        			2 = PAN
        		*/
        		emergType = 1;
        	}
        }

        /*
			Displays active destination airport.Valid entries are: waypoint, navaid, airport, latitude-longitude, or place bearing/distance.Entered position may be deleted.Push -•   message includes direct to routing if entered position displayed•   message includes remainder of route if active destination airport displayed
        */
        fmc.onLeftInput[1] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
        	divert = value;
        }

        /*
			Valid entry is L (or R) XX, or just XX.  (XX is any number from 1 to 99).Message includes entered offset.Entered offset may be deleted.
        */
        fmc.onLeftInput[2] = () => {
        	let value = fmc.inOut;
        	fmc.clearUserInput();
        	offset = value;
        }

        /*
			Displays MCP altitude.Valid entry is XXX or FLXXX (flight level), XXXXX (feet), or XXXXXM.Deletion of a large font altitude displays the default MCP altitude.Push - message indicates crew intention to descend to displayed altitude.
        */
        fmc.onLeftInput[3] = () => {
        	let value = fmc.inOut;
        	fmc.clearUserInput();
        	descend = value;
        }

        /*
			Initial display is blank.Entry or selection of data on any line displays ERASE EMERGENCY.Displays CANCEL EMERGENCY after EMERGENCY REPORT sent.<ERASE EMERGENCYPush - erases all emergency data.<CANCEL EMERGENCYPush - selects CANCEL EMERGENCY message.
        */
        fmc.onLeftInput[4] = () => {
        	/*
        		0 = BLANK
				1 = ERASE EMERGENCY
				2 = CANCEL EMERGENCY
        	*/
        	if (erase == 1) {
	        	maydayActive = false;
	        	panActive = false;
	        	divert = "";
	        	sob = "";
	        	offset = "";
	        	fuelTime = "";
	        	descend = "";
	        }
        }

        /*
			Push - displays ATC INDEX page. This description is the same for all CDU displays in Section 5.33 having the ATC INDEX prompt.
        */
        fmc.onLeftInput[5] = () => {
        	FMC_ATC_Index.ShowPage(fmc);
        }

        /*
			Push - •displays PAN PAN PAN on the VERIFY EMERGENCY page•   selects, but does not display, additional POSITION REPORT message elements for inclusion in the emergency report downlink
        */
        fmc.onRightInput[0] = () => {
        	if (sob) {
        		/*
        			0 = NOT SELECTED
        			1 = MAYDAY
        			2 = PAN
        		*/
        		emergType = 2;
        	}
        }

        /*
			Entry of number of persons on airplane displays the lesser of the totalizer or FMC computed fuel remaining and souls on board message elements for inclusion in the emergency report downlink.Causes remaining fuel quantity to display.Deletion of SOB deselects the message elements.
        */
        fmc.onRightInput[1] = () => {
        	let value = fmc.inOut;
        	fmc.clearUserInput();
        	sob = value;
        }

        /*
			Initial display is blank.Displays lesser of the totalizer fuel or the FMC computed fuel remaining in quantity and time.Valid entry is HH+MM (hours and minutes).
        */
        fmc.onRightInput[2] = () => {
        	let value = fmc.inOut;
        	fmc.clearUserInput();
        	fuelTime = value;
        }

        /*
			Push - displays VERIFY EMERGENCY page.
        */
        fmc.onRightInput[4] = () => {
        	FMC_ATC_VerifyRequest.ShowPage(
        		fmc,
        		lines = {
        			[0] : "EMERGENCY",
        			[1] : "MAYDAY MAYDAY MAYDAY.",
        			[2] : "DESCENDING TO" + descend + "FT.",
        			[3] : fuelTime + " OF FUEL REMAINING",
        			[4] : "AND" + sob + " SOULS ON BOARD."
        		});
        }
    }
}