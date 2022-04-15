class FMC_Menu {
    static ShowPage(fmc, store = {act: "<ACT>"}) {
        fmc.clearDisplay();
        const updateView = () => {
            fmc.setTemplate([
                ["MENU"],
                ["", "EFIS CP[color]inop"],
                ["\<FMC", "", fmc.activeSystem == "FMC" ? store.act : ""],
                ["", "EICAS CP[color]inop"],
                ["\<DLNK", "", fmc.activeSystem == "DLNK" ? store.act : ""],
                ["", "CTL PNL[color]inop"],
                ["\<SAT[color]inop", "OFF←→ON>[color]inop", fmc.activeSystem == "SAT" ? store.act : ""],
                ["", ""],
                ["", "PA/CI>[color]inop"],
                ["", ""],
                ["\<ACMS[color]inop", "SALTY>", fmc.activeSystem == "ACMS" ? store.act : ""],
                ["", ""],
                ["\<CMC[color]inop", "MAINT>", fmc.activeSystem == "CMC" ? store.act : ""]
            ]);
        }
        updateView();

        fmc.onLeftInput[0] = () => {
            fmc.activeSystem = "FMC";
            store.act = "<REQ>";
            updateView();
            setTimeout(
                function() {
                    FMCIdentPage.ShowPage1(fmc);
                }, 500
            );
        };

        fmc.onLeftInput[1] = () => {
            fmc.activeSystem = "DLNK";
            store.act = "<REQ>";
            updateView();
            setTimeout(
                function() {
                    FMC_ATC_Index.ShowPage(fmc);
                }, 500
            );
        };

        /*fmc.onLeftInput[2] = () => {
            FMC_SAT_Index.ShowPage(fmc);
        };*/
        
        /*fmc.onLeftInput[3] = () => {
            fmc.infoPanelsManager.addMessage("*ATC", "InfoIndication");
        }*/

        /*fmc.onLeftInput[5] = () => {
            FMC_CMC_Index.ShowPage(fmc);
        };*/
        
        /*fmc.onRightInput[3] = () => {
            FMC_PACI_Index.ShowPage(fmc);
        };*/

        fmc.onRightInput[4] = () => {
            fmc.activeSystem = "SALTY";
            store.act = "<REQ>";
            updateView();
            setTimeout(
                function() {
                    FMCSaltyOptions.ShowPage1(fmc);
                }, 500
            );
        };
        
        fmc.onRightInput[5] = () => {
            updateView();
            setTimeout(
                function() {
                    FMC_MAINT_Index.ShowPage(fmc);
                }, 500
            );
        };
    }
}