class FMC_ATC_VerifyReport {
    static ShowPage(fmc, lines, returnTo) {
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
                [lines[8] ? lines[8] : "", "SEND>[color]inop"],
                ["", "", "__FMCSEPARATOR"],
                [`<${returnTo}`]
            ]);
        }
        updateView();
        
        fmc.onLeftInput[5] = () => {
            if (returnTo == "ATC INDEX") {
                FMC_ATC_Index.ShowPage(fmc);
            } else if (returnTo == "REPORT") {
                FMC_ATC_Report.ShowPage(fmc);
            }
        }
        
        fmc.onRightInput[4] = () => {
            Boeing.infoPanelManager.addMessage("*ATC", Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.INDICATION);
        }
    }
}