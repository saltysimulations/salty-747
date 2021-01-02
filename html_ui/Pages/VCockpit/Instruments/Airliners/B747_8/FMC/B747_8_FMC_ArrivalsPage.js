class FMCArrivalsPage {
    static ShowPage(fmc, airport, pageCurrent = 0, starSelection = false, selectedStarIndex = -1) {
        let airportInfo = airport.infos;
        if (airportInfo instanceof AirportInfo) {
            fmc.clearDisplay();
            console.log(airport);
            let selectedApproachCell = "---";
            let selectedApproach = fmc.flightPlanManager.getApproach();
            console.log(selectedApproach);
            if (selectedApproach) {
                selectedApproachCell = Avionics.Utils.formatRunway(selectedApproach.name);
            }
            let selectedStarCell = "------";
            let selectedDeparture = airportInfo.arrivals[fmc.flightPlanManager.getArrivalProcIndex()];
            if (selectedDeparture) {
                selectedStarCell = selectedDeparture.name;
            }
            let selectedTransitionCell = "NONE";
            let approaches = airportInfo.approaches;
            let rows = [[""], [""], [""], [""], [""], [""], [""], [""]];
            if (!starSelection) {
                for (let i = 0; i < 3; i++) {
                    let index = i + pageCurrent;
                    let approach = approaches[index];
                    if (approach) {
                        rows[2 * i] = ["←" + Avionics.Utils.formatRunway(approach.name) + "[color]blue", "4242M[color]blue"];
                        rows[2 * i + 1] = ["042[color]blue"];
                        fmc.onLeftInput[i + 2] = () => {
                            fmc.setApproachIndex(index, () => {
                                FMCArrivalsPage.ShowPage(fmc, airport, 0, true);
                            });
                        };
                    }
                }
            }
            else {
                for (let i = 0; i < 3; i++) {
                    let index = i + pageCurrent;
                    let star = airportInfo.arrivals[index];
                    if (star) {
                        let color = "blue";
                        if (selectedStarIndex === index) {
                            color = "green";
                        }
                        rows[2 * i] = ["←" + star.name + "[color]" + color];
                        rows[2 * i + 1] = ["042[color]" + color];
                        fmc.onLeftInput[i + 2] = () => {
                            FMCArrivalsPage.ShowPage(fmc, airport, 0, true, index);
                        };
                    }
                }
                rows[0][1] = "NONE→[color]blue";
                fmc.onRightInput[2] = () => {
                    fmc.setArrivalIndex(selectedStarIndex, -1, () => {
                        B747_8_FMC_LegsPage.ShowPage1(fmc);
                    });
                };
                console.log(selectedApproach);
                for (let i = 0; i < 2; i++) {
                    let index = i + pageCurrent;
                    let transition = selectedApproach.transitions[index];
                    if (transition) {
                        let name = transition.waypoints[0].infos.icao.substr(5);
                        rows[2 * (i + 1)][1] = name + "→[color]blue";
                        fmc.onRightInput[i + 1 + 2] = () => {
                            fmc.setArrivalIndex(selectedStarIndex, index, () => {
                                B747_8_FMC_LegsPage.ShowPage1(fmc);
                            });
                        };
                    }
                }
            }
            fmc.setTemplate([
                ["ARRIVAL TO " + airport.ident + " →"],
                ["APPR", "STAR", "VIA"],
                [selectedApproachCell + "[color]green", selectedStarCell + "[color]green", "NONE[color]green"],
                ["", "TRANS"],
                ["", selectedTransitionCell + "[color]green"],
                [starSelection ? "STAR" : "APPR", starSelection ? "TRANS" : "", "AVAILABLE"],
                rows[0],
                rows[1],
                rows[2],
                rows[3],
                rows[4],
                rows[5],
                ["\<RETURN"]
            ]);
            fmc.onLeftInput[5] = () => { B747_8_FMC_LegsPage.ShowPage1(fmc); };
            fmc.onPrevPage = () => {
                pageCurrent++;
                if (starSelection) {
                    pageCurrent = Math.min(pageCurrent, airportInfo.arrivals.length - 3);
                }
                else {
                    pageCurrent = Math.min(pageCurrent, airportInfo.approaches.length - 3);
                }
                if (pageCurrent < 0) {
                    pageCurrent = 0;
                }
                FMCArrivalsPage.ShowPage(fmc, airport, pageCurrent, starSelection, selectedStarIndex);
            };
            fmc.onNextPage = () => {
                pageCurrent--;
                if (pageCurrent < 0) {
                    pageCurrent = 0;
                }
                FMCArrivalsPage.ShowPage(fmc, airport, pageCurrent, starSelection, selectedStarIndex);
            };
        }
    }
}
//# sourceMappingURL=B747_8_FMC_ArrivalsPage.js.map