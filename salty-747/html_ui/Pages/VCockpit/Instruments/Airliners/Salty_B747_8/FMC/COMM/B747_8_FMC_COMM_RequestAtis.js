class FMC_COMM_RequestAtis {
    static ShowPage(fmc, store = {arpt1: "", arpt2: "", arpt3: "", arpt4: "", depAtis: "DEP ATIS>", arrAtis: "ARR ATIS>"}) {
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();
        let labelTimeout;
        let arpt1Cell = "----";
        let arpt2Cell = "----";
        let arpt3Cell = "----";
        let arpt4Cell = "----";

        store.arpt1 = fmc.flightPlanManager.getOrigin() ? fmc.flightPlanManager.getOrigin().ident : "";
        store.arpt2 = fmc.flightPlanManager.getDestination() ? fmc.flightPlanManager.getDestination().ident : "";
        if (store.arpt1 != "") {
            arpt1Cell = store.arpt1;
        }
        if (store.arpt2 != "") {
            arpt2Cell = store.arpt2;
        }
        if (store.arpt3 != "") {
            arpt3Cell = store.arpt3;
        }
        if (store.arpt4 != "") {
            arpt4Cell = store.arpt4;
        }
        
        const updateView = () => {
            fmc.setTemplate([
                ["ATIS REQUEST"],
                ["\xa0ORIGIN", "DESTINATION"],
                [`<${arpt1Cell}`, `${arpt2Cell}>`],
                ["\xa0ALTERNATE", "AIRPORT"],
                [`<${arpt3Cell}`, `${arpt4Cell}`],
                ["", ""],
                ["", ""],
                ["", "REQUEST"],
                ["", `${store.depAtis}`],
                ["\xa0RECEIVED", "REQUEST"],
                ["<MESSAGES", `${store.arrAtis}`],
                ["\xa0RETURN TO", ""],
                ["<REQUESTS", ""]
            ]);
        }
        updateView();
        
        /* RSK4 */
        fmc.onRightInput[3] = () => {
            let icaos = [];
            /* get origin airport */
            if (store.arpt1 != "") {
                icaos.push(store.arpt1);
            }
            const lines = [];
            const newMessage = { "id": Date.now(), "time": '00:00', "opened": null, "type": 'D-ATIS', "content": lines, };
            const getInfo = async () => {
                getATIS(icaos, lines, "dep", store, updateView);
            };

            getInfo().then(() => {
                store.depAtis = "SENDING\xa0";
                updateView();
                setTimeout(
                    function() {
                    }
                );
                setTimeout(() => {
                    newMessage["time"] = fetchTimeValue();
                    fmc.addMessage(newMessage);
                }, Math.floor(Math.random()  * 1000) + 750);
                labelTimeout = setTimeout(() => {
                    store.depAtis = "DEP ATIS>";
                    fmc.showErrorMessage("ACARS UPLINK");
                    updateView();
                }, 2000);
            });
        }

        /* LSK5 */
        fmc.onLeftInput[4] = () => {
            FMC_COMM_Log.ShowPage(fmc);
        }
        
        /* RSK5 */
        fmc.onRightInput[4] = () => {
            let icaos = [];
            /* get arrival airport */
            if (store.arpt2 != "") {
                icaos.push(store.arpt2);
            }
            const lines = [];
            const newMessage = { "id": Date.now(), "time": '00:00', "opened": null, "type": 'D-ATIS', "content": lines, };
            const getInfo = async () => {
                getATIS(icaos, lines, "arr", store, updateView);
            };

            getInfo().then(() => {
                store.arrAtis = "SENDING\xa0";
                updateView();
                setTimeout(
                    function() {
                    }
                );
                setTimeout(() => {
                    newMessage["time"] = fetchTimeValue();
                    fmc.addMessage(newMessage);
                }, Math.floor(Math.random()  * 1000) + 750);
                labelTimeout = setTimeout(() => {
                    store.arrAtis = "ARR ATIS>";
                    fmc.showErrorMessage("ACARS UPLINK");
                    updateView();
                }, 2000);
            });
        }
        
        /* LSK6 */
        fmc.onLeftInput[5] = () => {
            FMC_COMM_Requests.ShowPage(fmc);
        }
    }
}