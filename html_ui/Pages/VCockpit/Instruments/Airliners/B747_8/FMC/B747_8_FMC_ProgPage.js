class B747_8_FMC_ProgPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        B747_8_FMC_ProgPage._timer = 0;
        fmc.pageUpdate = () => {
            B747_8_FMC_ProgPage._timer++;
            if (B747_8_FMC_ProgPage._timer >= 15) {
                B747_8_FMC_ProgPage.ShowPage1(fmc);
            }
        };
        let progressTitle = SimVar.GetSimVarValue("ATC FLIGHT NUMBER", "string") + " PROGRESS";
        let planeCoordinates = new LatLong(SimVar.GetSimVarValue("PLANE LATITUDE", "degree latitude"), SimVar.GetSimVarValue("PLANE LONGITUDE", "degree longitude"));
        let speed = Simplane.getGroundSpeed();
        let currentTime = SimVar.GetGlobalVarValue("ZULU TIME", "seconds");
        let currentFuel = SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "pounds") / 1000;
        let currentFuelFlow = SimVar.GetSimVarValue("TURB ENG FUEL FLOW PPH:1", "pound per hour") + SimVar.GetSimVarValue("TURB ENG FUEL FLOW PPH:2", "pound per hour") + SimVar.GetSimVarValue("TURB ENG FUEL FLOW PPH:3", "pound per hour") + SimVar.GetSimVarValue("TURB ENG FUEL FLOW PPH:4", "pound per hour");
        currentFuelFlow = currentFuelFlow / 1000;
        let machMode = Simplane.getAutoPilotMachModeActive();
        let waypointActiveCell = "";
        let waypointActiveDistanceCell = "";
        let waypointActiveFuelCell = "";
        let waypointActive = fmc.flightPlanManager.getActiveWaypoint();
        let waypointActiveDistance = NaN;
        if (waypointActive) {
            waypointActiveCell = waypointActive.ident;
            waypointActiveDistance = Avionics.Utils.computeGreatCircleDistance(planeCoordinates, waypointActive.infos.coordinates);
            if (isFinite(waypointActiveDistance)) {
                for (let i = 0; i < 3 - Math.log10(waypointActiveDistance); i++) {
                    waypointActiveDistanceCell += "&nbsp";
                }
                waypointActiveDistanceCell += waypointActiveDistance.toFixed(0) + " ";
                let eta = fmc.computeETA(waypointActiveDistance, speed, currentTime);
                if (isFinite(eta)) {
                    let etaHours = Math.floor(eta / 3600);
                    let etaMinutes = Math.floor((eta - etaHours * 3600) / 60);
                    waypointActiveDistanceCell += etaHours.toFixed(0).padStart(2, "0") + etaMinutes.toFixed(0).padStart(2, "0") + "z";
                }
                else {
                    waypointActiveDistanceCell += "&nbsp&nbsp&nbsp&nbsp&nbsp";
                }
                let fuelLeft = fmc.computeFuelLeft(waypointActiveDistance, speed, currentFuel, currentFuelFlow);
                if (isFinite(fuelLeft)) {
                    waypointActiveFuelCell = fuelLeft.toFixed(1);
                }
            }
        }
        let waypointActiveNextCell = "";
        let waypointActiveNext;
        let waypointActiveNextDistanceCell = "";
        let waypointActiveNextFuelCell = "";
        let waypointActiveNextDistance = NaN;
        if (fmc.flightPlanManager.getActiveWaypointIndex() != -1) {
            waypointActiveNext = fmc.flightPlanManager.getNextActiveWaypoint();
            if (waypointActiveNext) {
                waypointActiveNextCell = waypointActiveNext.ident;
                if (waypointActive && isFinite(waypointActiveDistance)) {
                    let d = Avionics.Utils.computeGreatCircleDistance(waypointActive.infos.coordinates, waypointActiveNext.infos.coordinates);
                    if (isFinite(d)) {
                        waypointActiveNextDistance = d + waypointActiveDistance;
                        for (let i = 0; i < 3 - Math.log10(waypointActiveNextDistance); i++) {
                            waypointActiveNextDistanceCell += "&nbsp";
                        }
                        waypointActiveNextDistanceCell += waypointActiveNextDistance.toFixed(0) + " ";
                        let eta = fmc.computeETA(waypointActiveNextDistance, speed, currentTime);
                        if (isFinite(eta)) {
                            let etaHours = Math.floor(eta / 3600);
                            let etaMinutes = Math.floor((eta - etaHours * 3600) / 60);
                            waypointActiveNextDistanceCell += etaHours.toFixed(0).padStart(2, "0") + etaMinutes.toFixed(0).padStart(2, "0") + "z";
                        }
                        else {
                            waypointActiveNextDistanceCell += "&nbsp&nbsp&nbsp&nbsp&nbsp";
                        }
                        let fuelLeft = fmc.computeFuelLeft(waypointActiveNextDistance, speed, currentFuel, currentFuelFlow);
                        if (isFinite(fuelLeft)) {
                            waypointActiveNextFuelCell = fuelLeft.toFixed(1);
                        }
                    }
                }
            }
        }
        let destinationCell = "";
        let destination = fmc.flightPlanManager.getDestination();
        let destinationDistanceCell = "";
        let destinationFuelCell = "";
        let destinationDistance = NaN;
        if (destination) {
            destinationCell = destination.ident;
            destinationDistance = destination.cumulativeDistanceInFP;
            if (waypointActive) {
                destinationDistance -= waypointActive.distanceInFP;
                destinationDistance += fmc.flightPlanManager.getDistanceToActiveWaypoint();
                if (isFinite(destinationDistance)) {
                    for (let i = 0; i < 3 - Math.log10(destinationDistance); i++) {
                        destinationDistanceCell += "&nbsp";
                    }
                    destinationDistanceCell += destinationDistance.toFixed(0) + " ";
                    let eta = fmc.computeETA(destinationDistance, speed, currentTime);
                    if (isFinite(eta)) {
                        let etaHours = Math.floor(eta / 3600);
                        let etaMinutes = Math.floor((eta - etaHours * 3600) / 60);
                        destinationDistanceCell += etaHours.toFixed(0).padStart(2, "0") + etaMinutes.toFixed(0).padStart(2, "0") + "z";
                    }
                    else {
                        destinationDistanceCell += "&nbsp&nbsp&nbsp&nbsp&nbsp";
                    }
                    let fuelLeft = fmc.computeFuelLeft(destinationDistance, speed, currentFuel, currentFuelFlow);
                    if (isFinite(fuelLeft)) {
                        destinationFuelCell = fuelLeft.toFixed(1);
                    }
                }
            }
        }
        //Gets current command speed/mach from FMC    
        let crzSpeedCell = "";
        if (machMode) {
            let crzMachNo = Simplane.getAutoPilotMachHoldValue().toFixed(3);
            var radixPos = crzMachNo.indexOf('.');
            crzSpeedCell = crzMachNo.slice(radixPos);
            } else {
                crzSpeedCell = Simplane.getAutoPilotAirspeedHoldValue().toFixed(0);
            }
        fmc.setTemplate([
            [progressTitle],
            ["\xa0TO", "FUEL", "DTG\xa0\xa0ETA"],
            [waypointActiveCell + "[color]magenta", waypointActiveFuelCell, waypointActiveDistanceCell],
            ["\xa0NEXT", "", "\xa0\xa0\xa0\xa0\xa0ETA"],
            [waypointActiveNextCell, waypointActiveNextFuelCell, waypointActiveNextDistanceCell],
            ["\xa0DEST"],
            [destinationCell, destinationFuelCell, destinationDistanceCell],
            ["\xa0SEL SPD"],
            [crzSpeedCell],
            [],
            [""],
            ["__FMCSEPARATOR"],
            ["<POS REPORT", "POS REF>"]
        ]);
    }
}
B747_8_FMC_ProgPage._timer = 0;
//# sourceMappingURL=B747_8_FMC_ProgPage.js.map