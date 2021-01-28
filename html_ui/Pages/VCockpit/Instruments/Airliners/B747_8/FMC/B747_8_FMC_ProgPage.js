class B747_8_FMC_ProgPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        B747_8_FMC_ProgPage._timer = 0;
        fmc.pageUpdate = () => {
            B747_8_FMC_ProgPage._timer++;
            if (B747_8_FMC_ProgPage._timer >= 100) {
                B747_8_FMC_ProgPage.ShowPage1(fmc);
            }
        };
        
        let progressTitle = SimVar.GetSimVarValue("ATC FLIGHT NUMBER", "string") + " PROGRESS";
        let currentFuelBurn = (SimVar.GetSimVarValue("TURB ENG CORRECTED FF:1", "pounds per hour") + SimVar.GetSimVarValue("TURB ENG CORRECTED FF:2", "pounds per hour") + SimVar.GetSimVarValue("TURB ENG CORRECTED FF:3", "pounds per hour") + SimVar.GetSimVarValue("TURB ENG CORRECTED FF:4", "pounds per hour") / 1000);
        let utcTime = SimVar.GetGlobalVarValue("ZULU TIME", "seconds");
        let timeToActivePoint = SimVar.GetSimVarValue("GPS WP ETE", "seconds"); 
        let flightPlanIndex = fmc.flightPlanManager.getActiveWaypointIndex(); 
        
        let activeWaypoint = ""
        let activeWaypointDTG = ""
        let activeWaypointDTGCell = ""
        let activeWaypointETACell = ""
        let activeWaypointFuel = ""
        let activeWaypointFuelCell = ""
        
        let nextWaypoint = ""
        let nextWaypointDistance =""
        let nextWaypointDTG = ""
        let nextWaypointDTGCell = ""
        let nextWaypointETACell = ""
        let nextWaypointFuel = ""
        let nextWaypointFuelCell = ""

        let destination = ""
        let destinationDTG = ""
        let destinationDTGCell = ""
        let destinationETACell = ""   
        let destinationFuel = ""
        let destinationFuelCell = ""
        
        let crzSpeedCell = ""
        let distanceToTODCell = ""
        let todETACell = ""

        //Active Waypoint Distance, ETA, Fuel Estimate
        if (fmc.flightPlanManager.getWaypoint(flightPlanIndex, undefined, true)){
            activeWaypoint = fmc.flightPlanManager.getWaypoint(flightPlanIndex, undefined, true);
            activeWaypointDTG = Simplane.getNextWaypointDistance();
            activeWaypointDTGCell = activeWaypointDTG.toFixed(0);
            if (SimVar.GetSimVarValue("SIM ON GROUND", "bool") == 0) {
                let wpETE = timeToActivePoint;
                let utcETA = wpETE > 0 ? (utcTime + wpETE) % 86400 : 0;
                const hours = Math.floor(utcETA / 3600);
                const minutes = Math.floor((utcETA % 3600) / 60);
                activeWaypointETACell = `${hours.toString().padStart(2, "0")}${minutes.toString().padStart(2, "0")}z`;
                activeWaypointFuel = ((SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * 0.0067) - ((wpETE /3600) * (currentFuelBurn / 1000)));
                activeWaypointFuelCell = activeWaypointFuel.toFixed(1);
            }
        }
        //Next Waypoint Distance, ETA, Fuel Estimate
        if (fmc.flightPlanManager.getWaypoint(flightPlanIndex + 1, undefined, true)){
            nextWaypoint = fmc.flightPlanManager.getWaypoint(flightPlanIndex + 1, undefined, true);
            nextWaypointDistance = Avionics.Utils.computeGreatCircleDistance(activeWaypoint.infos.coordinates, nextWaypoint.infos.coordinates);
            nextWaypointDTG = (activeWaypointDTG + nextWaypointDistance);
            nextWaypointDTGCell = nextWaypointDTG.toFixed(0);
            if (SimVar.GetSimVarValue("SIM ON GROUND", "bool") == 0) {
                let wpETE = timeToActivePoint + (nextWaypointDistance / SimVar.GetSimVarValue("GROUND VELOCITY", "knots") * 3600);
                let utcETA = wpETE > 0 ? (utcTime + wpETE) % 86400 : 0;
                const hours = Math.floor(utcETA / 3600);
                const minutes = Math.floor((utcETA % 3600) / 60);
                nextWaypointETACell = `${hours.toString().padStart(2, "0")}${minutes.toString().padStart(2, "0")}z`;
                nextWaypointFuel = ((SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * 0.0067) - ((wpETE /3600) * (currentFuelBurn / 1000)));
                nextWaypointFuelCell = nextWaypointFuel.toFixed(1);
            }        
        }
        //Destination airport, ETA, Fuel Estimate
        if (fmc.flightPlanManager.getDestination()){
            destination = fmc.flightPlanManager.getDestination();
            destinationDTG = destination.infos.totalDistInFP - activeWaypoint.infos.totalDistInFP + activeWaypointDTG;
            destinationDTGCell = destinationDTG.toFixed(0);
            if (SimVar.GetSimVarValue("SIM ON GROUND", "bool") == 0) {
                let wpETE = destinationDTG / SimVar.GetSimVarValue("GROUND VELOCITY", "knots") * 3600; 
                let utcETA = wpETE > 0 ? (utcTime + wpETE) % 86400 : 0;
                const hours = Math.floor(utcETA / 3600);
                const minutes = Math.floor((utcETA % 3600) / 60);
                destinationETACell = `${hours.toString().padStart(2, "0")}${minutes.toString().padStart(2, "0")}z`;
                destinationFuel = ((SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * 0.0067) - ((wpETE /3600) * (currentFuelBurn / 1000)));
                destinationFuelCell = destinationFuel.toFixed(1);
            }
        }
        //Shows TOD when within 200 miles of destination and in cruise flight
        //TOD Calculation based on descent from VNAV crz altitude from FMC to airport elevation - TOD Distance based on 3.5NM per 1000 feet + 12NM deceleration still wind as per FCTM
        if(fmc.flightPlanManager.getDestination() && (destinationDTG <= 200) && (Simplane.getCurrentFlightPhase() === FlightPhase.FLIGHT_PHASE_CRUISE)){
            let crzAlt = fmc.cruiseFlightLevel * 100;
            let destAlt = destination.infos.coordinates.alt;
            let descentAlt = crzAlt - destAlt;
            let descentDistance = (3.5 * descentAlt / 1000) + 12;
            let distanceToTOD = destinationDTG - descentDistance;
            distanceToTODCell = distanceToTOD.toFixed(0) + "NM";
            let todETE = SimVar.GetSimVarValue("GPS WP ETE", "seconds") + ((destinationDTG - descentDistance) / SimVar.GetSimVarValue("GROUND VELOCITY", "knots") * 3600);
            let todETA = todETE > 0 ? (utcTime + todETE) % 86400 : 0;
            const todHours = Math.floor(todETA / 3600);
            const todMinutes = Math.floor((todETA % 3600) / 60);
            todETACell = `${todHours.toString().padStart(2, "0")}${todMinutes.toString().padStart(2, "0")}z/`;
            if (distanceToTOD <= 0){
                todETACell = "";
                distanceToTODCell = "NOW";
            }
            if (((SimVar.GetSimVarValue("INDICATED ALTITUDE", "feet") - 200 ) > crzAlt)){
                todETACell = "";
                distanceToTODCell = "";
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
            [activeWaypoint.ident, activeWaypointFuelCell, activeWaypointDTGCell + "\xa0\xa0\xa0" +  activeWaypointETACell],
            ["NEXT"],
            [nextWaypoint.ident, nextWaypointFuelCell, nextWaypointDTGCell + "\xa0\xa0\xa0" +  nextWaypointETACell],
            ["DEST"],
            [destination.ident, destinationFuelCell, destinationDTGCell + "\xa0\xa0\xa0" + destinationETACell],
            ["SEL SPD", "TO T/D"],
            [crzSpeedCell, todETACell + distanceToTODCell],
            [],
            [],
            ["__FMCSEPARATOR"],
            ["<POS REPORT", "POS REF>"]
        ]);  
    }
}


//# sourceMappingURL=B747_8_FMC_ProgPage.js.map