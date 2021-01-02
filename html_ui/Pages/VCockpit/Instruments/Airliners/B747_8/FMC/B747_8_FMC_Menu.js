class FMC_Menu {
    static ShowPage(fmc) {
        fmc.clearDisplay();
        fmc.setTemplate([
            ["MENU"],
            ["", "EFIS CP[color]inop"],
            ["\<FMC", "", fmc.activeSystem == "FMC" ? "<ACT>" : ""],
            ["", "EICAS CP[color]inop"],
            ["\<DLNK", "", fmc.activeSystem == "DLNK" ? "<ACT>" : ""],
            ["", "CTL PNL[color]inop"],
            ["\<SAT", "OFF←→ON>[color]inop", fmc.activeSystem == "SAT" ? "<ACT>" : ""],
            ["", ""],
            ["", "PA/CI>[color]inop"],
            ["", ""],
            ["\<ACMS[color]inop", "SALTY>", fmc.activeSystem == "ACMS" ? "<ACT>" : ""],
            ["", ""],
            ["\<CMC[color]inop", "MAINT>", fmc.activeSystem == "CMC" ? "<ACT>" : ""]
        ]);

        fmc.onLeftInput[0] = () => {
            FMCIdentPage.ShowPage1(fmc);
        };

        fmc.onLeftInput[1] = () => {
            FMC_ATC_Index.ShowPage(fmc);
        };

        /*fmc.onLeftInput[2] = () => {
            FMC_SAT_Index.ShowPage(fmc);
        };*/
		
        fmc.onLeftInput[3] = () => {
			fmc.infoPanelsManager.addMessage("*ATC", "InfoIndication");
		}

        /*fmc.onLeftInput[5] = () => {
            FMC_CMC_Index.ShowPage(fmc);
        };*/
        
        /*fmc.onRightInput[3] = () => {
            FMC_PACI_Index.ShowPage(fmc);
        };*/

        fmc.onRightInput[4] = () => {
            FMCSaltyOptions.ShowPage1(fmc);
        };
        
        fmc.onRightInput[5] = () => {
            FMC_MAINT_Index.ShowPage(fmc);
        };
    }
}