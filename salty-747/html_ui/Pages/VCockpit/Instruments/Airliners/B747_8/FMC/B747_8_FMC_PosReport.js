class FMC_PosReport {
    static ShowPage(fmc, store = {sendCompany: "<SEND", sendAtc: "SEND>"}) {
        fmc.activeSystem = "FMC";
        fmc.clearDisplay();

        let fltNoCell = SimVar.GetSimVarValue("ATC FLIGHT NUMBER", "string") ? SimVar.GetSimVarValue("ATC FLIGHT NUMBER", "string") : "XXXX";
        let currPos = new LatLong(SimVar.GetSimVarValue("GPS POSITION LAT", "degree latitude"), SimVar.GetSimVarValue("GPS POSITION LON", "degree longitude")).toDegreeString();
        let posCell = "---";
        let ataCell = "----Z";
        let altCell = "-----";
        let estCell = "---";
        let etaCell = "----Z";
        let nextCell = "---";
        if (fmc.flightPlanManager.getWaypoint(fmc.flightPlanManager.getActiveWaypointIndex() - 1, undefined, true)) {
            posCell = fmc.flightPlanManager.getWaypoint(fmc.flightPlanManager.getActiveWaypointIndex() - 1, undefined, true).ident;
            ataCell = getUTC("ata");
            var currAlt = SimVar.GetSimVarValue("PLANE ALTITUDE", "feet").toFixed(0);
            altCell = currAlt > fmc.transitionAltitude ? "FL" + currAlt > 100 : currAlt;
        }
        if (fmc.flightPlanManager.getWaypoint(fmc.flightPlanManager.getActiveWaypointIndex(), undefined, true)) {
            estCell = fmc.flightPlanManager.getWaypoint(fmc.flightPlanManager.getActiveWaypointIndex(), undefined, true).ident;
            etaCell = getUTC("eta");
        }
        if (fmc.flightPlanManager.getWaypoint(fmc.flightPlanManager.getActiveWaypointIndex() + 1, undefined, true)) {
            nextCell = fmc.flightPlanManager.getWaypoint(fmc.flightPlanManager.getActiveWaypointIndex() + 1, undefined, true).ident;
        }
        let tempCell = `${SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "Celsius").toFixed(0)}°C`
        let spdCell = SimVar.GetSimVarValue("AUTOPILOT AIRSPEED HOLD VAR", "mach").toFixed(0);
        let windCell = `${SimVar.GetSimVarValue("AMBIENT WIND DIRECTION", "Degrees").toFixed(0)}°/ ${SimVar.GetSimVarValue("AMBIENT WIND VELOCITY", "Knots").toFixed(0)}KT`;
        let posFuelCell = fmc.getBlockFuel(true).toFixed(1);
        let companySendCell = "SEND";
        let atcSendCell = "SEND";

        let speed = Simplane.getGroundSpeed();
        let currentTime = SimVar.GetGlobalVarValue("LOCAL TIME", "seconds");
        let currentFuel = SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "pounds") / 1000;
        let currentFuelFlow = SimVar.GetSimVarValue("TURB ENG FUEL FLOW PPH:1", "pound per hour") + SimVar.GetSimVarValue("TURB ENG FUEL FLOW PPH:2", "pound per hour") + SimVar.GetSimVarValue("TURB ENG FUEL FLOW PPH:3", "pound per hour") + SimVar.GetSimVarValue("TURB ENG FUEL FLOW PPH:4", "pound per hour");
        currentFuelFlow = currentFuelFlow / 1000;
        let destinationCell = "";
        let destination = fmc.flightPlanManager.getDestination();
        let destEtaCell = "";
        let destinationDistance = NaN;
        let waypointActive = fmc.flightPlanManager.getActiveWaypoint();
        if (destination) {
            destinationCell = destination.ident;
            destinationDistance = destination.cumulativeDistanceInFP;
            if (waypointActive) {
                destinationDistance -= waypointActive.distanceInFP;
                destinationDistance += fmc.flightPlanManager.getDistanceToActiveWaypoint();
                if (isFinite(destinationDistance)) {
                    for (let i = 0; i < 3 - Math.log10(destinationDistance); i++) {
                        destEtaCell += "&nbsp";
                    }
                    destEtaCell += destinationDistance.toFixed(0) + " ";
                    let eta = fmc.computeETA(destinationDistance, speed, currentTime);
                    if (isFinite(eta)) {
                        let etaHours = Math.floor(eta / 3600);
                        let etaMinutes = Math.floor((eta - etaHours * 3600) / 60);
                        destEtaCell += etaHours.toFixed(0).padStart(2, "0") + etaMinutes.toFixed(0).padStart(2, "0") + "&nbsp";
                    }
                    else {
                        destEtaCell += "&nbsp&nbsp&nbsp&nbsp&nbsp";
                    }
                }
            }
        }
        const updateView = () => {
            fmc.setTemplate([
                [`${fltNoCell} POS REPORT`],
                ["\xa0POS", "ALT", "ATA"],
                [`${posCell}`, `${altCell}`, `${ataCell}`],
                ["\xa0EST", "ETA"],
                [`${estCell}[color]magenta`, `${etaCell}`],
                ["\xa0NEXT", "DEST ETA"],
                [`${nextCell}`, `${destEtaCell}`],
                ["\xa0TEMP", "SPD", "WIND"],
                [`${tempCell}`, `.${spdCell}`, `${windCell}`],
                ["", "POS FUEL"],
                ["", `${posFuelCell}`],
                ["COMPANY", "ATC", "---------"],
                [`${store.sendCompany}`, `${store.sendAtc}`]
            ]);
        }
        updateView();

        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            store.altitude = value;
            FMC_ATC_Request.ShowPage(fmc, store);
        }

        fmc.onLeftInput[1] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            store.speed = value;
            FMC_ATC_Request.ShowPage(fmc, store);
        }

        fmc.onLeftInput[2] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            store.offset = value;
            FMC_ATC_Request.ShowPage(fmc, store);
        }

        fmc.onLeftInput[4] = () => {
            store.altitude = "";
            store.speed = "";
            store.offset = "";
            FMC_ATC_Request.ShowPage(fmc, store);
        }

        fmc.onLeftInput[5] = () => {
            store.sendCompany = "SENDING";
            updateView();
            setTimeout(
                function() {
                    store.sendCompany = "SENT";
                    updateView();
                }, 1000
            );
            setTimeout(
                function() {
                    store.sendCompany = "<SEND";
                    updateView();
                }, 5000
            );
        };

        fmc.onRightInput[5] = () => {
            store.sendAtc = "SENDING";
            updateView();
            setTimeout(
                function() {
                    store.sendAtc = "SENT";
                    updateView();
                }, 1000
            );
            setTimeout(
                function() {
                    store.sendAtc = "SEND>";
                    updateView();
                }, 5000
            );
        };

        function getUTC(p) {
            if (p == "ata" || p == "ete" || p == "dest") {
                var utc = new Date();
                if (utc.getUTCHours() <= 9) {
                    var utcHours = "0" + utc.getUTCHours();
                } else {
                    var utcHours = utc.getUTCHours();
                }
                if (utc.getUTCMinutes() <= 9) {
                    var utcMinutes = "0" + utc.getUTCMinutes();
                } else {
                    var utcMinutes = utc.getUTCMinutes();
                }
                return utcHours.toString() + utcMinutes.toString() + "Z";
            }
        }
    }
}
