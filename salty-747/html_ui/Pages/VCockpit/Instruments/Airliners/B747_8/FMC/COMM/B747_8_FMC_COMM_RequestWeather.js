class FMC_COMM_RequestWeather {
    static ShowPage(fmc, store = {arpt1: "", arpt2: "", arpt3: "", arpt4: "", metar: "METAR>", taf: "TAF>", shortTaf: "SHORT TAF>"}) {
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();
        let labelTimeout;
        let arpt1Cell = "----";
        let arpt2Cell = "----";
        let arpt3Cell = "----";
        let arpt4Cell = "----";

        store.arpt1 = fmc.flightPlanManager.getOrigin() ? fmc.flightPlanManager.getOrigin().ident : "";
        store.arpt2 = fmc.flightPlanManager.getDestination() ? fmc.flightPlanManager.getDestination().ident : "";
        
        const updateView = () => {
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

            fmc.setTemplate([
                ["WEATHER REQUEST"],
                ["\xa0ORIGIN", "DESTINATION"],
                [`<${arpt1Cell}`, `${arpt2Cell}>`],
                ["\xa0ALTERNATE", "AIRPORT"],
                [`<${arpt3Cell}`, `${arpt4Cell}>`],
                ["", ""],
                ["", ""],
                ["", "REQUEST"],
                ["", store.metar],
                ["\xa0RECEIVED", "REQUEST"],
                ["<MESSAGES", `${store.taf}`],
                ["\xa0RETURN TO", "REQUEST"],
                ["<REQUESTS", `${store.shortTaf}[color]inop`]
            ]);
        }
        updateView();
        
        /* LSK1 */
        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (value.length == 4) {
                store.arpt1 = value;
                updateView();
            } else if (value == "DELETE") {
                store.arpt1 = "";
            } else {
                fmc.showErrorMessage(fmc.defaultInputErrorMessage);
            }            
        }
        
        /* RSK1 */
        fmc.onRightInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (value.length == 4) {
                store.arpt2 = value;
                updateView();
            } else if (value == "DELETE") {
                store.arpt2 = "";
            } else {
                fmc.showErrorMessage(fmc.defaultInputErrorMessage);
            }            
        }        
        
        /* LSK2 */
        fmc.onLeftInput[1] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (value.length == 4) {
                store.arpt3 = value;
                updateView();
            } else if (value == "DELETE") {
                store.arpt3 = "";
            } else {
                fmc.showErrorMessage(fmc.defaultInputErrorMessage);
            }            
        }
        
        /* RSK2 */
        fmc.onRightInput[1] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            if (value.length == 4) {
                store.arpt4 = value;
                updateView();
            } else if (value == "DELETE") {
                store.arpt4 = "";
            } else {
                fmc.showErrorMessage(fmc.defaultInputErrorMessage);
            }            
        }
        
        /* RSK4 */
        fmc.onRightInput[3] = () => {
            let icaos = [];
            if (store.arpt1 != "") {
                icaos.push(store.arpt1);
            }
            if (store.arpt2 != "") {
                icaos.push(store.arpt2);
            }
            if (store.arpt3 != "") {
                icaos.push(store.arpt3);
            }
            if (store.arpt4 != "") {
                icaos.push(store.arpt4);
            }
            const lines = [];
            const newMessage = { "id": Date.now(), "time": '00:00', "opened": null, "type": 'METAR', "content": lines, };
            const getInfo = async () => {
                getMETAR(icaos, lines, store, updateView);
            };

            getInfo().then(() => {
                store.metar = "SENDING\xa0";
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
                    store.metar = "METAR>";
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
            const icaos = [];
            if (store.arpt1 != "") {
                icaos.push(store.arpt1);
            }
            if (store.arpt2 != "") {
                icaos.push(store.arpt2);
            }
            if (store.arpt3 != "") {
                icaos.push(store.arpt3);
            }
            if (store.arpt4 != "") {
                icaos.push(store.arpt4);
            }
            const lines = [];
            const newMessage = { "id": Date.now(), "time": '00:00', "opened": null, "type": 'TAF', "content": lines, };
            const getInfo = async () => {
                getTAF(icaos, lines, store, updateView);
            };

            getInfo().then(() => {
                store.taf = "SENDING\xa0";
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
                    store.taf = "TAF>";
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