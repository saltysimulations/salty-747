class FMC_ATC_Request {
    static ShowPage(fmc, store = {"altitude": "", "speed": "", "offset": ""}) {		
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();
        
        let lines = [];
        let altitudeCell = "-----";
        let speedCell = "---";
        let offsetCell = "---";

        if (store.altitude) {
            altitudeCell = store.altitude;
        }
        if (store.speed) {
            speedCell = store.speed;
        }
        if (store.offset) {
            offsetCell = store.offset;
        }

        fmc.setTemplate([
            ["ATC REQUEST"],
            ["\xa0ALTITUDE", ""],
            [`<${altitudeCell}`, ""],
            ["\xa0SPEED", ""],
            [`<${speedCell}`, ""],
            ["\xa0OFFSET", ""],
            [`<${offsetCell}`, ""],
            ["", ""],
            ["<ROUTE REQUEST", ""],
            ["", ""],
            ["<ERASE REQUEST", ""],
            ["", "", "__FMCSEPARATOR"],
            ["<ATC INDEX", "VERIFY>"]
        ]);

        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            store.altitude = value;
            FMC_ATC_XRequest.ShowPage(fmc, store);
        }

        fmc.onLeftInput[1] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            store.speed = value;
            FMC_ATC_XRequest.ShowPage(fmc, store);
        }

        fmc.onLeftInput[2] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            store.offset = value;
            FMC_ATC_XRequest.ShowPage(fmc, store);
        }

        fmc.onLeftInput[3] = () => {
            let newStore = {
                showRte: 1
            };
            FMC_ATC_XRequest.ShowPage(fmc, newStore);
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

        fmc.onRightInput[5] = () => {
            if (store.altitude || store.speed || store.offset) {
                FMC_ATC_XRequest.ShowPage(fmc, store);
            } else {
                fmc.showErrorMessage("PARAMS NOT SET")
            }
        }

    }
}