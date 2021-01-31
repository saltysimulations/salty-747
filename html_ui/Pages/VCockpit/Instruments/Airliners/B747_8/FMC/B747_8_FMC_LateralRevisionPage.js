class B747_8_FMC_LateralRevisionPage {
    static ShowPage(fmc, waypoint, waypointIndexFP) {
        fmc.clearDisplay();
        let waypointIdent = "---";
        if (waypoint) {
            waypointIdent = waypoint.ident;
        }
        let coordinates = "---";
        console.log(waypoint);
        if (waypoint && waypoint.infos && waypoint.infos.coordinates) {
            coordinates = waypoint.infos.coordinates.toDegreeString();
        }
        let departureArrival = "";
        if (waypoint === fmc.flightPlanManager.getOrigin()) {
            departureArrival = "<DEPARTURE";
            fmc.onLeftInput[0] = () => {
                FMCDeparturesPage.ShowPage(fmc, waypoint);
            };
        }
        else if (waypoint === fmc.flightPlanManager.getDestination()) {
            departureArrival = "<ARRIVAL";
            fmc.onLeftInput[0] = () => {
                FMCArrivalsPage.ShowPage(fmc, waypoint);
            };
        }
        fmc.setTemplate([
            ["LAT REV FROM " + waypointIdent],
            ["", "", coordinates + "[color]green"],
            [departureArrival, "FIX INFO>"],
            ["", "LL WING/INCR/NO"],
            ["[][color]blue", "[ ]°/[ ]°/[][color]blue"],
            ["", "NEXT WPT"],
            ["<HOLD", "[ ][color]blue"],
            ["ENABLE[color]blue", "NEW DEST"],
            ["←ALTN[color]blue", "[ ][color]blue"],
            [""],
            ["", "AIRWAYS>"],
            [""],
            ["<RETURN"]
        ]);
        fmc.onRightInput[2] = async () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            console.log("Alpha");
            fmc.insertWaypoint(value, waypointIndexFP + 1, (result) => {
                if (result) {
                    B747_8_FMC_LegsPage.ShowPage1(fmc);
                }
            });
        };
        fmc.onLeftInput[5] = () => { B747_8_FMC_LegsPage.ShowPage1(fmc); };
    }
}
//# sourceMappingURL=B747_8_FMC_LateralRevisionPage.js.map