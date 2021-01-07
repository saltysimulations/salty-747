class FMC_ATC_Report {
    static ShowPage(fmc) {
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();
        fmc.setTemplate([
            ["ATC REPORT", "1", "2"],
            ["", ""],
            ["<CONFIRM ALTITUDE", ""],
            ["", ""],
            ["<REPORT PASSING ---", ""],
            ["", ""],
            ["<WHEN CAN WE EXPECT F..", ""],
            ["", ""],
            ["<REPORT REACHING FL---", ""],
            ["", ""],
            ["", ""],
            ["", "", "__FMCSEPARATOR"],
            ["<ATC INDEX", ""]
        ]);

        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            store.altitude = value;
            FMC_ATC_Request.ShowPage(fmc, store);
        }

        fmc.onLeftInput[1] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            store.speed = value;
            FMC_ATC_Request.ShowPage(fmc, store);
        }

        fmc.onLeftInput[2] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            store.offset = value;
            FMC_ATC_Request.ShowPage(fmc, store);
        }

        fmc.onLeftInput[4] = () => {
            store.altitude = "";
            store.speed = "";
            store.offset = "";
            FMC_ATC_Request.ShowPage(fmc, store);
        }

        fmc.onLeftInput[5] = () => {
            FMC_ATC_Index.ShowPage(fmc);
        }
    }
}