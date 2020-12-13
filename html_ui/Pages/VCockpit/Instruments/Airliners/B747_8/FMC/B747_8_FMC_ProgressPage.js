class B747_8_FMC_ProgressPage {
    static ShowPage(fmc) {
        fmc.clearDisplay();
        B747_8_FMC_ProgressPage._timer = 0;
        fmc.pageUpdate = () => {
            B747_8_FMC_ProgressPage._timer++;
            if (B747_8_FMC_ProgressPage._timer >= 100) {
                B747_8_FMC_ProgressPage.ShowPage(fmc);
            }
        };
        
        let progressTitle = SimVar.GetSimVarValue("ATC FLIGHT NUMBER", "string") + " PROGRESS";
        let currentFuelBurn = (SimVar.GetSimVarValue("TURB ENG CORRECTED FF:1", "pounds per hour") + SimVar.GetSimVarValue("TURB ENG CORRECTED FF:2", "pounds per hour") + SimVar.GetSimVarValue("TURB ENG CORRECTED FF:3", "pounds per hour") + SimVar.GetSimVarValue("TURB ENG CORRECTED FF:4", "pounds per hour") / 1000);
        let utcTime = SimVar.GetGlobalVarValue("ZULU TIME", "seconds");

        let activeWaypoint = ""
        let activeWaypointDTG = ""
        let activeWaypointETA = ""
        let activeWaypointFuel = ""
        let activeWaypointETACell = ""

        let progressNextWaypoint = ""
        let progressNextWaypointDistance =""
        let progressNextWaypointETACell = ""
        let progressNextWaypointDTGCell = ""
        let progressNextWaypointFuel = ""

        let progressDestination = ""
        let progressDestinationDTG = ""   
        let progressDestinationFuel = ""
        let progressDestinationETACell = ""

        let crzSpeedCell = ""
        let distanceToTOD = ""
        let todETACell = ""
        
        //Active Waypoint Distance, ETA, Fuel Estimate
        if (fmc.flightPlanManager.getActiveWaypoint()){
            activeWaypoint = fmc.flightPlanManager.getActiveWaypoint();
            activeWaypointDTG = Simplane.getNextWaypointDistance();
            activeWaypointETA = Simplane.getNextWaypointETA();

            let wpETE = SimVar.GetSimVarValue("GPS WP ETE", "seconds");
            let utcETA = wpETE > 0 ? (utcTime + wpETE) % 86400 : 0;
            if (SimVar.GetSimVarValue("SIM ON GROUND", "bool") == 0) {
                const hours = Math.floor(utcETA / 3600);
                const minutes = Math.floor((utcETA % 3600) / 60);
                activeWaypointETACell = `${hours.toString().padStart(2, "0")}${minutes.toString().padStart(2, "0")}z`;
                activeWaypointFuel = ((SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * 0.0067) - ((wpETE /3600) * (currentFuelBurn / 1000)));
            }
        }
        //Next Waypoint Distance, ETA, Fuel Estimate
        if (fmc.flightPlanManager.getNextActiveWaypoint()){
            progressNextWaypoint = fmc.flightPlanManager.getNextActiveWaypoint();
            progressNextWaypointDistance = Avionics.Utils.computeGreatCircleDistance(activeWaypoint.infos.coordinates, progressNextWaypoint.infos.coordinates);
            progressNextWaypointDTGCell = activeWaypointDTG + progressNextWaypointDistance;
            if (SimVar.GetSimVarValue("SIM ON GROUND", "bool") == 0) {
                let wpETE = SimVar.GetSimVarValue("GPS WP ETE", "seconds") + (progressNextWaypointDistance / SimVar.GetSimVarValue("GROUND VELOCITY", "knots") * 3600);
                let utcETA = wpETE > 0 ? (utcTime + wpETE) % 86400 : 0;
                const hours = Math.floor(utcETA / 3600);
                const minutes = Math.floor((utcETA % 3600) / 60);
                progressNextWaypointETACell = `${hours.toString().padStart(2, "0")}${minutes.toString().padStart(2, "0")}z`;
                progressNextWaypointFuel = ((SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * 0.0067) - ((wpETE /3600) * (currentFuelBurn / 1000)));
            }        
        }
        //Destination airport, ETA, Fuel Estimate and Top of Descent estimates
        if (fmc.flightPlanManager.getDestination()){
            progressDestination = fmc.flightPlanManager.getDestination();
            progressDestinationDTG = fmc.flightPlanManager.getDestination().infos.totalDistInFP - activeWaypoint.infos.totalDistInFP + activeWaypointDTG;
            if (SimVar.GetSimVarValue("SIM ON GROUND", "bool") == 0) {
                let wpETE = SimVar.GetSimVarValue("GPS WP ETE", "seconds") + (progressDestinationDTG / SimVar.GetSimVarValue("GROUND VELOCITY", "knots") * 3600);
                let utcETA = wpETE > 0 ? (utcTime + wpETE) % 86400 : 0;
                const hours = Math.floor(utcETA / 3600);
                const minutes = Math.floor((utcETA % 3600) / 60);
                progressDestinationETACell = `${hours.toString().padStart(2, "0")}${minutes.toString().padStart(2, "0")}z`;
                progressDestinationFuel = ((SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * 0.0067) - ((wpETE /3600) * (currentFuelBurn / 1000)));
                //TOD Calculation based on descent from VNAV crz altitude from FMC to airport elevation
                let crzAlt = fmc.cruiseFlightLevel * 100;
                let destAlt = progressDestination.infos.coordinates.alt;
                let descentAlt = crzAlt - destAlt;
                //TOD Distance based on 3.5NM per 1000 feet + 12NM deceleration still wind as per FCTM
                let descentDistance = (3.5 * descentAlt / 1000) + 12;
                distanceToTOD = progressDestinationDTG - descentDistance;
                let todETE = SimVar.GetSimVarValue("GPS WP ETE", "seconds") + ((progressDestinationDTG - descentDistance) / SimVar.GetSimVarValue("GROUND VELOCITY", "knots") * 3600);
                let todETA = todETE > 0 ? (utcTime + todETE) % 86400 : 0;
                const todHours = Math.floor(todETA / 3600);
                const todMinutes = Math.floor((todETA % 3600) / 60);
                todETACell = `${todHours.toString().padStart(2, "0")}${todMinutes.toString().padStart(2, "0")}z`;
            }
        }
        //Gets current command speed/mach from FMC    
        let machMode = Simplane.getAutoPilotMachModeActive();
        if (machMode) {
            let crzMachNo = Simplane.getAutoPilotMachHoldValue().toFixed(3);
            var radixPos = crzMachNo.indexOf('.');
            crzSpeedCell = crzMachNo.slice(radixPos);
        } else {
            crzSpeedCell = Simplane.getAutoPilotAirspeedHoldValue().toFixed(0);
        }
        //Draw values to FMC, concatenated strings and forced spaces required due to limitation of setTemplate function to only 3 values per row
        fmc.setTemplate([
            [progressTitle],
            ["TO", "FUEL", "DTG\xa0\xa0\xa0\xa0ETA"],  
            [activeWaypoint.ident, activeWaypointFuel.toFixed(1), activeWaypointDTG.toFixed(0) + "\xa0\xa0\xa0" +  activeWaypointETACell],
            ["NEXT"],
            [progressNextWaypoint.ident, progressNextWaypointFuel.toFixed(1), progressNextWaypointDTGCell.toFixed(0) + "\xa0\xa0\xa0" +  progressNextWaypointETACell],
            ["DEST"],
            [progressDestination.ident, progressDestinationFuel.toFixed(1), progressDestinationDTG.toFixed(0) + "\xa0\xa0\xa0" + progressDestinationETACell],
            ["SEL SPD", "TO T/D"],
            [crzSpeedCell, todETACell + "/" + distanceToTOD.toFixed(0) + "NM"],
            [],
            [],
            ["__FMCSEPARATOR"],
            ["<POS REPORT", "POS REF>"]
        ]);   
    }
}


//# sourceMappingURL=B747_8_FMC_ProgressPage.js.map