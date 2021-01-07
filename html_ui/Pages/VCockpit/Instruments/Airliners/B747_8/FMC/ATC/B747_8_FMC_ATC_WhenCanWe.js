class FMC_ATC_WhenCanWe {
    static ShowPage(fmc, store = {crzClbTo: "-----", climbTo: "-----", descendTo: "-----", speed: "---", higherAlt: "HIGHER ALT>[s-text]", lowerAlt: "LOWER ALT>[s-text]", backOnRte: "BACK ON RTE>[s-text]", higherAltActive: 0, lowerAltActive: 0, backOnRteActive: 0}) {
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();
        fmc.setTemplate([
            ["WHEN CAN WE EXPECT"],
            ["\xa0CRZ CLB TO", ""],
            [`${store.crzClbTo}`, ""],
            ["\xa0CLIMB TO", ""],
            [`${store.climbTo}`, `${store.higherAlt}`],
            ["\xa0DESCEND TO", ""],
            [`${store.descendTo}`, `${store.lowerAlt}`],
            ["\xa0SPEED", ""],
            [`${store.speed}`, `${store.backOnRte}`],
            ["", ""],
            ["<ERASE WHEN CAN WE", ""],
            ["", "", "__FMCSEPARATOR"],
            ["<ATC INDEX", "VERIFY>"]
        ]);

        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            store.crzClbTo = value;
            FMC_ATC_WhenCanWe.ShowPage(fmc, store);
        }

        fmc.onLeftInput[1] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            store.climbTo = value;
            FMC_ATC_WhenCanWe.ShowPage(fmc, store);
        }

        fmc.onLeftInput[2] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            store.descendTo = value;
            FMC_ATC_WhenCanWe.ShowPage(fmc, store);
        }

        fmc.onLeftInput[3] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            store.speed = value;
            FMC_ATC_WhenCanWe.ShowPage(fmc, store);
        }

        fmc.onLeftInput[4] = () => {
            FMC_ATC_WhenCanWe.ShowPage(fmc);
        }

        fmc.onLeftInput[5] = () => {
            FMC_ATC_Index.ShowPage(fmc);
        }
            
        fmc.onRightInput[1] = () => {
            if (store.higherAltActive == 1) {
                store.higherAltActive = 0;
                store.higherAlt = 'HIGHER ALT>[s-text]';
                FMC_ATC_WhenCanWe.ShowPage(fmc, store);
            } else {
                store.higherAltActive = 1;
                store.higherAlt = 'HIGHER ALT';
                FMC_ATC_WhenCanWe.ShowPage(fmc, store);
            }
        }
            
        fmc.onRightInput[2] = () => {
            if (store.lowerAltActive == 1) {
                store.lowerAltActive = 0;
                store.lowerAlt = 'LOWER ALT>[s-text]';
                FMC_ATC_WhenCanWe.ShowPage(fmc, store);
            } else {
                store.lowerAltActive = 1;
                store.lowerAlt = 'LOWER ALT';
                FMC_ATC_WhenCanWe.ShowPage(fmc, store);
            }
        }
            
        fmc.onRightInput[3] = () => {
            if (store.backOnRteActive == 1) {
                store.backOnRteActive = 0;
                store.backOnRte = 'BACK ON RTE>[s-text]';
                FMC_ATC_WhenCanWe.ShowPage(fmc, store);
            } else {
                store.backOnRteActive = 1;
                store.backOnRte = 'BACK ON RTE';
                FMC_ATC_WhenCanWe.ShowPage(fmc, store);
            }
        }
    }
}