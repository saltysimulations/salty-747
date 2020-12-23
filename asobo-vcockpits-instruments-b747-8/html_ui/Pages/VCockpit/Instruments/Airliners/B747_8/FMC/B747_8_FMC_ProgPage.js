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
        let planeCoordinates = new LatLong(SimVar.GetSimVarValue("PLANE LATITUDE", "degree latitude"), SimVar.GetSimVarValue("PLANE LONGITUDE", "degree longitude"));
        let waypointFromCell = "";
        let waypointFromAltAtaCell = "";
        let waypointFromFuelCell = "";
        let waypointFrom;
        if (fmc.flightPlanManager.getActiveWaypointIndex() === -1) {
            waypointFrom = fmc.flightPlanManager.getOrigin();
        }
        else {
            waypointFrom = fmc.flightPlanManager.getPreviousActiveWaypoint();
        }
        if (waypointFrom) {
            waypointFromCell = waypointFrom.ident;
            if (isFinite(waypointFrom.altitudeWasReached) && isFinite(waypointFrom.timeWasReached)) {
                let t = waypointFrom.timeWasReached;
                let hours = Math.floor(t / 3600);
                let minutes = Math.floor((t - hours * 3600) / 60);
                for (let i = 0; i < 4 - Math.log10(waypointFrom.altitudeWasReached); i++) {
                    waypointFromAltAtaCell += "&nbsp";
                }
                waypointFromAltAtaCell += waypointFrom.altitudeWasReached.toFixed(0) + " " + hours.toFixed(0).padStart(2, "0") + minutes.toFixed(0).padStart(2, "0") + "&nbsp";
            }
            if (isFinite(waypointFrom.fuelWasReached)) {
                waypointFromFuelCell = waypointFrom.getFuelWasReached(true).toFixed(0);
            }
        }
        let speed = Simplane.getGroundSpeed();
        let currentTime = SimVar.GetGlobalVarValue("LOCAL TIME", "seconds");
        let currentFuel = SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "pounds") / 1000;
        let currentFuelFlow = SimVar.GetSimVarValue("TURB ENG FUEL FLOW PPH:1", "pound per hour") + SimVar.GetSimVarValue("TURB ENG FUEL FLOW PPH:2", "pound per hour") + SimVar.GetSimVarValue("TURB ENG FUEL FLOW PPH:3", "pound per hour") + SimVar.GetSimVarValue("TURB ENG FUEL FLOW PPH:4", "pound per hour");
        currentFuelFlow = currentFuelFlow / 1000;
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
                    waypointActiveDistanceCell += etaHours.toFixed(0).padStart(2, "0") + etaMinutes.toFixed(0).padStart(2, "0") + "&nbsp";
                }
                else {
                    waypointActiveDistanceCell += "&nbsp&nbsp&nbsp&nbsp&nbsp";
                }
                let fuelLeft = fmc.computeFuelLeft(waypointActiveDistance, speed, currentFuel, currentFuelFlow);
                if (isFinite(fuelLeft)) {
                    waypointActiveFuelCell = fuelLeft.toFixed(0);
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
                            waypointActiveNextDistanceCell += etaHours.toFixed(0).padStart(2, "0") + etaMinutes.toFixed(0).padStart(2, "0") + "&nbsp";
                        }
                        else {
                            waypointActiveNextDistanceCell += "&nbsp&nbsp&nbsp&nbsp&nbsp";
                        }
                        let fuelLeft = fmc.computeFuelLeft(waypointActiveNextDistance, speed, currentFuel, currentFuelFlow);
                        if (isFinite(fuelLeft)) {
                            waypointActiveNextFuelCell = fuelLeft.toFixed(0);
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
                        destinationDistanceCell += etaHours.toFixed(0).padStart(2, "0") + etaMinutes.toFixed(0).padStart(2, "0") + "&nbsp";
                    }
                    else {
                        destinationDistanceCell += "&nbsp&nbsp&nbsp&nbsp&nbsp";
                    }
                    let fuelLeft = fmc.computeFuelLeft(destinationDistance, speed, currentFuel, currentFuelFlow);
                    if (isFinite(fuelLeft)) {
                        destinationFuelCell = fuelLeft.toFixed(0);
                    }
                }
            }
        }
        fmc.setTemplate([
            ["PROGRESS"],
            ["FROM", "FUEL", "ALT ATA"],
            [waypointFromCell, waypointFromFuelCell, waypointFromAltAtaCell],
            ["", "FUEL", "DTG ETA"],
            [waypointActiveCell, waypointActiveFuelCell, waypointActiveDistanceCell],
            [""],
            [waypointActiveNextCell, waypointActiveNextFuelCell, waypointActiveNextDistanceCell],
            [""],
            [destinationCell, destinationFuelCell, destinationDistanceCell],
            ["TO T/D", "FUEL QTY"],
            [""],
            ["WIND"],
            ["", "NAV STATUS>"]
        ]);
    }
}
B747_8_FMC_ProgPage._timer = 0;
//# sourceMappingURL=B747_8_FMC_ProgPage.js.map