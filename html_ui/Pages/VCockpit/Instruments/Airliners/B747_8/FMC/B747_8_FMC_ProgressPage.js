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
        
        let progressActiveWaypoint = ""
        let progressActiveWaypointDTG = ""
        let progressActiveWaypointETA = ""
        let progressActiveWaypointETE = ""
        let progressActiveWaypointFuel = ""
        let progressActiveWaypointETACell = ""

        let progressNextWaypoint = ""
        let progressNextWaypointDistance =""
        let progressNextWaypointETACell = ""
        let progressNextWaypointDTGCell = ""
        let progressNextWaypointFuel = ""

        let progressDestination = ""
        let progressDestinationDTG = ""   
        let progressDestinationETA = ""
        let progressDestinationETE = ""
        let progressDestinationFuel = ""
        let progressDestinationETACell = ""

        let crzSpeedCell = ""
    


        var utcTime = SimVar.GetGlobalVarValue("ZULU TIME", "seconds");
        

        if (fmc.flightPlanManager.getActiveWaypoint()){
            progressActiveWaypoint = fmc.flightPlanManager.getActiveWaypoint();
            progressActiveWaypointDTG = Simplane.getNextWaypointDistance();
            progressActiveWaypointETA = Simplane.getNextWaypointETA();
            progressActiveWaypointETE = fmc.flightPlanManager.getETEToActiveWaypoint()
            let wpETE = SimVar.GetSimVarValue("GPS WP ETE", "seconds");
            let utcETA = wpETE > 0 ? (utcTime + wpETE) % 86400 : 0;
            if (SimVar.GetSimVarValue("SIM ON GROUND", "bool") == 0) {
                const hours = Math.floor(utcETA / 3600);
                const minutes = Math.floor((utcETA % 3600) / 60);
                progressActiveWaypointETACell = `${hours.toString().padStart(2, "0")}${minutes.toString().padStart(2, "0")}Z`;
                progressActiveWaypointFuel = ((SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * 0.0067) - ((wpETE /3600) * (currentFuelBurn / 1000)));
            }

        }

        if (fmc.flightPlanManager.getNextActiveWaypoint()){
            progressNextWaypoint = fmc.flightPlanManager.getNextActiveWaypoint();
            progressNextWaypointDistance = Avionics.Utils.computeGreatCircleDistance(progressActiveWaypoint.infos.coordinates, progressNextWaypoint.infos.coordinates);
            progressNextWaypointDTGCell = progressActiveWaypointDTG + progressNextWaypointDistance;
            if (SimVar.GetSimVarValue("SIM ON GROUND", "bool") == 0) {
                let wpETE = SimVar.GetSimVarValue("GPS WP ETE", "seconds") + (progressNextWaypointDistance / SimVar.GetSimVarValue("GROUND VELOCITY", "knots") * 3600);
                let utcETA = wpETE > 0 ? (utcTime + wpETE) % 86400 : 0;
                const hours = Math.floor(utcETA / 3600);
                const minutes = Math.floor((utcETA % 3600) / 60);
                progressNextWaypointETACell = `${hours.toString().padStart(2, "0")}${minutes.toString().padStart(2, "0")}Z`;
                progressNextWaypointFuel = ((SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * 0.0067) - ((wpETE /3600) * (currentFuelBurn / 1000)));
            }
            
          
        } else {
        }
        
        if (fmc.flightPlanManager.getDestination()){
            progressDestination = fmc.flightPlanManager.getDestination();
            progressDestinationDTG = fmc.flightPlanManager.getDestination().infos.totalDistInFP.toFixed(0);

            progressDestinationETACell = FMCMainDisplay.secondsTohhmm(fmc.flightPlanManager.getDestination().estimatedTimeOfArrivalFP);




            progressDestinationFuel = ((SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * 0.0067) - ((progressActiveWaypointETE /3600) * (currentFuelBurn / 1000)));
        }
            
        
        let machMode = Simplane.getAutoPilotMachModeActive();
        if (machMode) {
            let crzMachNo = Simplane.getAutoPilotMachHoldValue().toFixed(3);
            var radixPos = crzMachNo.indexOf('.');
            crzSpeedCell = crzMachNo.slice(radixPos);
        } else {
            crzSpeedCell = Simplane.getAutoPilotAirspeedHoldValue().toFixed(0);
        }



        
        fmc.setTemplate([
            [progressTitle],
            ["TO", "FUEL", "DTG\xa0\xa0\xa0\xa0ETA"],  
            [progressActiveWaypoint.ident, progressActiveWaypointFuel.toFixed(1), progressActiveWaypointDTG.toFixed(0) + "\xa0\xa0\xa0\xa0" + progressActiveWaypointETACell],
            ["NEXT"],
            [progressNextWaypoint.ident, progressNextWaypointFuel.toFixed(1), progressNextWaypointDTGCell.toFixed(0) + "\xa0\xa0\xa0\xa0" + progressNextWaypointETACell],
            ["DEST"],
            [progressDestination.ident],
            ["SEL SPD", "TO T/D"],
            [crzSpeedCell],
            [],
            [currentFuelBurn.toFixed(0)],
            ["__FMCSEPARATOR"],
            ["<POS REPORT", "POS REF>"]
        ]);   
    }
}


//# sourceMappingURL=B747_8_FMC_ProgressPage.js.map