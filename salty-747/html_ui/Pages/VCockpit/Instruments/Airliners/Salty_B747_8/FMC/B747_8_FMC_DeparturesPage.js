class FMCDeparturesPage {
    static ShowPage(fmc, airport, pageCurrent = 0, selectedRunwayIndex = NaN) {
        let airportInfo = airport.infos;
        console.log(airportInfo);
        if (airportInfo instanceof AirportInfo) {
            fmc.clearDisplay();
            let selectedRunwayCell = "---";
            let selectedRunway;
            if (isNaN(selectedRunwayIndex)) {
                selectedRunway = fmc.flightPlanManager.getDepartureRunway();
            }
            else {
                selectedRunway = airportInfo.oneWayRunways[selectedRunwayIndex];
            }
            if (selectedRunway) {
                selectedRunwayCell = Avionics.Utils.formatRunway(selectedRunway.designation);
            }
            let selectedSidCell = "------";
            let selectedDeparture = airportInfo.departures[fmc.flightPlanManager.getDepartureProcIndex()];
            if (selectedDeparture) {
                selectedSidCell = selectedDeparture.name;
            }
            let runways = airportInfo.oneWayRunways;
            let rows = [[""], [""], [""], [""], [""], [""], [""], [""]];
            if (isNaN(selectedRunwayIndex)) {
                for (let i = 0; i < 4; i++) {
                    let index = i + pageCurrent;
                    let runway = runways[index];
                    if (runway) {
                        rows[2 * i] = ["←" + Avionics.Utils.formatRunway(runway.designation) + "[color]blue", fastToFixed(runway.length, 0) + "M[color]blue"];
                        rows[2 * i + 1] = ["042[color]blue"];
                        fmc.onLeftInput[i + 1] = async () => {
                            FMCDeparturesPage.ShowPage(fmc, airport, 0, index);
                        };
                    }
                }
            }
            else {
                for (let i = 0; i < 4; i++) {
                    let index = i + pageCurrent;
                    let sid = airportInfo.departures[index];
                    if (sid) {
                        rows[2 * i] = ["←" + sid.name + "[color]blue"];
                        rows[2 * i + 1] = ["042[color]blue"];
                        fmc.onLeftInput[i + 1] = () => {
                            fmc.setRunwayIndex(selectedRunwayIndex, (success) => {
                                fmc.setDepartureIndex(index, () => {
                                    B747_8_FMC_LegsPage.ShowPage1(fmc);
                                });
                            });
                        };
                    }
                }
            }
            fmc.setTemplate([
                ["DEPARTURES FROM " + airport.ident + " →"],
                ["RWY", "TRANS", "SID"],
                [selectedRunwayCell, "------", selectedSidCell],
                ["", "", "AVAILABLE " + (isFinite(selectedRunwayIndex) ? "SIDS" : "RUNWAYS")],
                rows[0],
                rows[1],
                rows[2],
                rows[3],
                rows[4],
                rows[5],
                rows[6],
                rows[7],
                ["\<RETURN"]
            ]);
            fmc.onLeftInput[5] = () => { B747_8_FMC_LegsPage.ShowPage1(fmc); };
            fmc.onPrevPage = () => {
                pageCurrent++;
                if (isFinite(selectedRunwayIndex)) {
                    pageCurrent = Math.min(pageCurrent, airportInfo.departures.length - 3);
                }
                else {
                    pageCurrent = Math.min(pageCurrent, airportInfo.runways.length - 3);
                }
                if (pageCurrent < 0) {
                    pageCurrent = 0;
                }
                FMCDeparturesPage.ShowPage(fmc, airport, pageCurrent, selectedRunwayIndex);
            };
            fmc.onNextPage = () => {
                pageCurrent--;
                if (pageCurrent < 0) {
                    pageCurrent = 0;
                }
                FMCDeparturesPage.ShowPage(fmc, airport, pageCurrent, selectedRunwayIndex);
            };
        }
    }
}
//# sourceMappingURL=B747_8_FMC_DeparturesPage.js.map