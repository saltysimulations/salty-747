class FMC_ATC_XRequest {
    static ShowPage(fmc, store = {
        altitude: "",
        speed: "",
        offset: "",
        showRte: 0,
        offsetAt: "",
        offsetWeather: "WEATHER[s-text]",
        offsetWeatherActive: 0
    }) {
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();

        function altPage() {
            store.altitude = store.altitude ? store.altitude : "---";
            store.altStepAt = store.altStepAt ? store.altStepAt : ["-----"];
            store.altPerf = store.altPerf ? store.altPerf : "PERFORMANCE>[s-text]";
            store.altPerfActive = store.altPerfActive ? store.altPerfActive : 0;
            store.altWeather = store.altWeather ? store.altWeather : "WEATHER>[s-text]";
            store.altWeatherActive = store.altWeatherActive ? store.altWeatherActive : 0;
            store.altCrzClb = store.altCrzClb ? store.altCrzClb : "CRZ CLB>[s-text]";
            store.altCrzClbActive = store.altCrzClbActive ? store.altCrzClbActive : 0;
            store.altSep = store.altSep ? store.altSep : "SEPARATION/VMC>[s-text]";
            store.altSepActive = store.altSepActive ? store.altSepActive : 0;
            store.altAtPilotDisc = store.altAtPilotDisc ? store.altAtPilotDisc : "<AT PILOT DISC[s-text]";
            store.altAtPilotDiscActive = store.altAtPilotDiscActive ? store.altAtPilotDiscActive : 0;

            store.altitude = store.altitude ? store.altitude : "-----";

            fmc.setTemplate([
                [`ATC ALT REQUEST`, "1", "4"],
                ["\xa0ALTITUDE", "REQUEST"],
                [`<${store.altitude}`, `${store.altCrzClb}`],
                ["\xa0STEP AT", "MAINTAIN OWN"],
                [`${store.altStepAt}`, `${store.altSep}`],
                ["", "DUE TO"],
                ["", `${store.altPerf}`],
                ["", "DUE TO"],
                [`${store.altAtPilotDisc}`, `${store.altWeather}`],
                ["", ""],
                ["", ""],
                ["", "", "__FMCSEPARATOR"],
                ["<REQUEST", "VERIFY>"]
            ]);

            fmc.onNextPage = () => {
                speedPage();
            };

            fmc.onPrevPage = () => {
                rtePage();
            };

            fmc.onLeftInput[0] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                store.altitude = value;
                altPage(store);
            };

            fmc.onLeftInput[1] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                store.altStepAt = value;
                altPage(store);
            };

            fmc.onLeftInput[3] = () => {
                if (store.altAtPilotDiscActive == 1) {
                    store.altAtPilotDiscActive = 0;
                    store.altAtPilotDisc = '<AT PILOT DISC[s-text]';
                    altPage(store);
                } else {
                    store.altAtPilotDiscActive = 1;
                    store.altAtPilotDisc = 'AT PILOT DISC';
                    altPage(store);
                }
            };

            fmc.onRightInput[0] = () => {
                if (store.altCrzClbActive == 1) {
                    store.altCrzClbActive = 0;
                    store.altCrzClb = 'CRZ CLB>[s-text]';
                    altPage(store);
                } else {
                    store.altCrzClbActive = 1;
                    store.altCrzClb = 'CRZ CLB';
                    altPage(store);
                }
            };

            fmc.onRightInput[1] = () => {
                if (store.altSepActive == 1) {
                    store.altSepActive = 0;
                    store.altSep = 'SEPARATION/VMC>[s-text]';
                    altPage(store);
                } else {
                    store.altSepActive = 1;
                    store.altSep = 'SEPARATION/VMC';
                    altPage(store);
                }
            };

            fmc.onRightInput[2] = () => {
                if (store.altPerfActive == 1) {
                    store.altPerfActive = 0;
                    store.altPerf = 'PERFORMANCE>[s-text]';
                    altPage(store);
                } else {
                    store.altPerfActive = 1;
                    store.altPerf = 'PERFORMANCE';
                    altPage(store);
                }
            };

            fmc.onRightInput[3] = () => {
                if (store.altWeatherActive == 1) {
                    store.altWeatherActive = 0;
                    store.altWeather = 'WEATHER>[s-text]';
                    altPage(store);
                } else {
                    store.altWeatherActive = 1;
                    store.altWeather = 'WEATHER';
                    altPage(store);
                }
            };

            fmc.onRightInput[5] = () => {
                const title = "";
                let lines = [];
                if (store.altitude != "") {
                    if (store.altAtPilotDiscActive == 1) {
                        lines.push("\xa0AT PILOTS DISCRETION");
                        lines.push("");
                    }
                    if (store.altCrzClbActive == 1) {
                        lines.push("\xa0REQUEST CRZ CLB TO");
                        lines.push(store.altitude);
                    } else {
                        lines.push("\xa0REQUEST CLIMB TO");
                        lines.push(store.altitude);
                    }
                    if (store.altSepActive == 1) {
                        lines.push("\xa0MAINTAIN OWN");
                        lines.push("SEPARATION AND VMC");
                    }
                    if (store.altPerfActive == 1) {
                        lines.push("/ DUE TO");
                        lines.push("AIRCRAFT PERFORMANCE");
                    }
                    if (store.altWeatherActive == 1) {
                        lines.push("/ DUE TO");
                        lines.push("WEATHER");
                    }
                }
                FMC_ATC_VerifyRequest.ShowPage(fmc, title, lines);
            };
        }

        function speedPage() {
            store.speed = store.speed ? store.speed : "---";
            store.speedPerf = store.speedPerf ? store.speedPerf : "PERFORMANCE>[s-text]";
            store.speedPerfActive = store.speedPerfActive ? store.speedPerfActive : 0;
            store.speedWeather = store.speedWeather ? store.speedWeather : "WEATHER>[s-text]";
            store.speedWeatherActive = store.speedWeatherActive ? store.speedWeatherActive : 0;

            fmc.setTemplate([
                [`ATC SPEED REQUEST`, "2", "4"],
                ["\xa0SPEED", ""],
                [`<${store.speed}`, ""],
                ["", ""],
                ["", ""],
                ["", "DUE TO"],
                ["", `${store.speedPerf}`],
                ["", "DUE TO"],
                ["", `${store.speedWeather}`],
                ["", ""],
                ["", ""],
                ["", "", "__FMCSEPARATOR"],
                ["<REQUEST", "VERIFY>"]
            ]);

            fmc.onNextPage = () => {
                offsetPage();
            };

            fmc.onPrevPage = () => {
                altPage();
            };

            fmc.onLeftInput[0] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                store.speed = value;
                speedPage(store);
            };

            fmc.onRightInput[2] = () => {
                if (store.speedPerfActive == 1) {
                    store.speedPerfActive = 0;
                    store.speedPerf = 'PERFORMANCE>[s-text]';
                    speedPage(store);
                } else {
                    store.speedPerfActive = 1;
                    store.speedPerf = 'PERFORMANCE';
                    speedPage(store);
                }
            };

            fmc.onRightInput[3] = () => {
                if (store.speedWeatherActive == 1) {
                    store.speedWeatherActive = 0;
                    store.speedWeather = 'WEATHER>[s-text]';
                    speedPage(store);
                } else {
                    store.speedWeatherActive = 1;
                    store.speedWeather = 'WEATHER';
                    speedPage(store);
                }
            };

            fmc.onRightInput[5] = () => {
                const title = "";
                let lines = [];
                if (store.speed != "") {
                    lines.push("\xa0REQUEST SPEED ");
                    lines.push(store.speed);
                    if (store.speedPerfActive == 1) {
                        lines.push("/ DUE TO");
                        lines.push("AIRCRAFT PERFORMANCE");
                    }
                    if (store.speedWeatherActive == 1) {
                        lines.push("/ DUE TO");
                        lines.push("WEATHER");
                    }
                }
                FMC_ATC_VerifyRequest.ShowPage(fmc, title, lines);
            };
        }

        function offsetPage() {

            let offsetCell = store.offset ? store.offset : "---";
            let offsetAtCell = "";
            store.offsetWeather = store.offsetWeather ? store.offsetWeather : "WEATHER>[s-text]";
            store.offsetWeatherActive = store.offsetWeatherActive ? store.offsetWeatherActive : 0;
            if (store.offsetWeatherActive == 1) {
                store.offsetAtLabel = "";
                store.offsetAt = "";
                store.offsetAtCell = "";
            } else {	
                store.offsetAtLabel = "\xa0OFFSET AT";
                offsetAtCell = store.offsetAt ? store.offsetAt : "-----";
            }
            fmc.setTemplate([
                [`ATC OFFSET REQUEST`, "3", "4"],
                ["\xa0OFFSET", ""],
                [`${store.offset}NM`, ""],
                [`${store.offsetAtLabel}`, ""],
                [`${offsetAtCell}`, ""],
                ["", ""],
                ["", ""],
                ["", "DUE TO"],
                ["", `${store.offsetWeather}`],
                ["", ""],
                ["", ""],
                ["", "", "__FMCSEPARATOR"],
                ["<REQUEST", "VERIFY>"]
            ]);

            fmc.onNextPage = () => {
                rtePage();
            };

            fmc.onPrevPage = () => {
                speedPage();
            };

            fmc.onLeftInput[0] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                store.offset = value;
                offsetPage(store);
            };

            fmc.onLeftInput[1] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                store.offsetAt = value;
                offsetPage(store);
            };

            fmc.onRightInput[3] = () => {
                if (store.offsetWeatherActive == 1) {
                    store.offsetWeatherActive = 0;
                    store.offsetWeather = 'WEATHER[s-text]';
                    offsetPage(store);
                } else {
                    store.offsetWeatherActive = 1;
                    store.offsetWeather = 'WEATHER';
                    offsetPage(store);
                }
            };

            fmc.onRightInput[5] = () => {
                const title = "";
                let lines = [];
                console.log(store.offsetAt);
                if (store.offset != "") {
                    if (store.offsetWeatherActive == 0) {
                        if (store.offsetAt) {
                            lines.push("\xa0AT");
                            lines.push(store.offsetAt);
                        }
                        lines.push("\xa0REQUEST OFFSET");
                        lines.push(store.offset + "NM")
                    }
                    if (store.offsetWeatherActive == 1) {
                        lines.push("\xa0REQUEST WEATHER");
                        lines.push("");
                        lines.push("\xa0DEVIATION UP TO");
                        lines.push(store.offset + "NM");
                    }
                }
                FMC_ATC_VerifyRequest.ShowPage(fmc, title, lines);
            };
        }

        const rtePage = (store = {dctTo: "-----", hdg: "---", offsetAt: "-----", gndTrk: "---", rte1: "RTE 1[s-text]", rte2: "RTE 2[s-text]", depArr: "------.-----",}) => {

            fmc.setTemplate([
                [`ATC ROUTE REQUEST`, "4", "4"],
                ["\xa0DIRECT TO", "HEADING"],
                [`${store.dctTo}`, `${store.hdg}`],
                ["\xa0OFFSET AT", "GROUND TRACK"],
                [`${store.offsetAt}`, `${store.gndTrk}`],
                ["\xa0REQUEST", "REQUEST"],
                [`<${store.rte1}`, `${store.rte2}>`],
                ["", ""],
                ["", ""],
                ["\xa0REQUEST DEP/ARR", ""],
                [`<${store.depArr}`, ""],
                ["", "", "__FMCSEPARATOR"],
                ["<REQUEST", "VERIFY>"]
            ])
        
            fmc.onNextPage = () => {
                altPage();
            };
            
            fmc.onPrevPage = () => {
                offsetPage();
            }
            
            fmc.onLeftInput[0] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                store.dctTo = value;
                rtePage(store);
            }
            
            fmc.onLeftInput[1] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                store.offsetAt = value;
                rtePage(store);
            }
            
            fmc.onLeftInput[2] = () => {
                store.rte1 = 'RTE 1';
                store.rte2 = 'RTE 2[s-text]';
                rtePage(store);
            }
            
            fmc.onLeftInput[4] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                store.depArr = value;
                rtePage(store);
            }
            
            fmc.onRightInput[0] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                store.hdg = value;
                rtePage(store);
            }
            
            fmc.onRightInput[1] = () => {
                let value = fmc.inOut;
                fmc.clearUserInput();
                store.gndTrk = value;
                rtePage(store);
            }
            
            fmc.onRightInput[2] = () => {
                store.rte1 = 'RTE 1[s-text]';
                store.rte2 = 'RTE 2';
                rtePage(store);
            }

            fmc.onRightInput[5] = () => {
                const title = "";
                let lines = [];
                if (store.dcTo != "") {
                    lines.push("\xa0REQUEST DIRECT TO");
                    lines.push(store.dcTo);
                }
                if (store.hdg != "") {
                    lines.push("\xa0REQUEST HEADING");
                    lines.push(store.hdg);
                }
                if (store.gndTrk != "") {
                    lines.push("\xa0REQUEST GROUND TRACK");
                    lines.push(store.gndTrk);
                }
                if (store.depArr != "") {
                    lines.push("\xa0REQUEST");
                    lines.push(store.depArr);
                }
                FMC_ATC_VerifyRequest.ShowPage(fmc, title, lines);
            };
        };
        
        if (store.showRte == 1) {
            rtePage();
        } else {
            if (store.altitude != "") {
                altPage();
            } else if (store.altitude == "" && store.speed != "") {
                speedPage();
            } else if (store.altitude == "" && store.speed == "" && store.offset != "") {
                offsetPage();
            }
        }

        fmc.onLeftInput[5] = () => {
            FMC_ATC_Request.ShowPage(fmc, store);
        }

    }
}