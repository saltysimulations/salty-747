var B747_8_LowerEICAS_ECL;
(function (B747_8_LowerEICAS_ECL) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
        }
        get templateID() { return "B747_8LowerEICASECLTemplate" }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            this.allChecklists = document.querySelector("#all-checklists");
            this.globalItems = document.querySelector("#global-items");
            this.isInitialised = true; 
            this.allChecklists.style.visibility = "hidden";
        }
        onEvent(_event) {
            super.onEvent(_event);
            if(SimVar.GetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool")){
                SimVar.SetSimVarValue("L:SALTY_ECL_PREFLIGHT_COMPLETE", "bool", 1);
            }
        }
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            var masterCursorIndex = SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum");
            var checklistParams = this.getActiveChecklist();
            this.cursorBoundsHandler(checklistParams[1]);
            this.clearLastChecklist();
            this.updateCursorPosition(checklistParams[0],checklistParams[1],masterCursorIndex);
            this.clearCursors(checklistParams[0],checklistParams[1],masterCursorIndex);
            this.drawChecklist(checklistParams[0]);
            this.runChecklist(checklistParams[0],masterCursorIndex);
        }        
        getActiveChecklist(){
            if(SimVar.GetSimVarValue("L:SALTY_ECL_PREFLIGHT_COMPLETE", "bool") == 0){
                let currentChecklist = "preflight-checklist";
                let maxCursorIndex = 7;
                let checklistParams = [currentChecklist, maxCursorIndex];
                return checklistParams;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_BEFORE_START_COMPLETE", "bool") == 0){
                let currentChecklist = "before-start-checklist";
                let maxCursorIndex = 10;
                let checklistParams = [currentChecklist, maxCursorIndex];
                return checklistParams;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_BEFORE_TAXI_COMPLETE", "bool") == 0){
                let currentChecklist = "before-taxi-checklist";
                let maxCursorIndex = 8;
                let checklistParams = [currentChecklist, maxCursorIndex];
                return checklistParams;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_BEFORE_TAKEOFF_COMPLETE", "bool") == 0){
                let currentChecklist = "before-takeoff-checklist";
                let maxCursorIndex = 4;
                let checklistParams = [currentChecklist, maxCursorIndex];
                return checklistParams;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_AFTER_TAKEOFF_COMPLETE", "bool") == 0){
                let currentChecklist = "after-takeoff-checklist";
                let maxCursorIndex = 5;
                let checklistParams = [currentChecklist, maxCursorIndex];
                return checklistParams;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_DESCENT_COMPLETE", "bool") == 0){
                let currentChecklist = "descent-checklist";
                let maxCursorIndex = 7;
                let checklistParams = [currentChecklist, maxCursorIndex];
                return checklistParams;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_APPROACH_COMPLETE", "bool") == 0){
                let currentChecklist = "approach-checklist";
                let maxCursorIndex = 5;
                let checklistParams = [currentChecklist, maxCursorIndex];
                return checklistParams;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_LANDING_COMPLETE", "bool") == 0){
                let currentChecklist = "landing-checklist";
                let maxCursorIndex = 6;
                let checklistParams = [currentChecklist, maxCursorIndex];
                return checklistParams;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_SHUTDOWN_COMPLETE", "bool") == 0){
                let currentChecklist = "shutdown-checklist";
                let maxCursorIndex = 9;
                let checklistParams = [currentChecklist, maxCursorIndex];
                return checklistParams;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_SECURE_COMPLETE", "bool") == 0){
                let currentChecklist = "secure-checklist";
                let maxCursorIndex = 6;
                let checklistParams = [currentChecklist, maxCursorIndex];
                return checklistParams;
            }
        }
        drawChecklist(checklistToDraw){
            this.currentChecklist = document.querySelector(`#${checklistToDraw}`);
            this.allChecklists.style.visibility = "hidden";   
            this.currentChecklist.style.visibility = "visible";
            return;
        }
        clearLastChecklist(){
            this.lastChecklist = document.querySelector("#preflight-checklist");
            this.lastChecklist.style.visibility = "hidden";
            return;
        }
        clearLastCursors(){
            this.lastCursors = document.querySelector("#preflight-checklist-cursor-positions");
            this.lastCursors.style.visibility = "hidden";
            return;
        }
        clearCursors(checklistToDraw, maxCursorIndex, masterCursorIndex){
            if(SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool")){
                if(masterCursorIndex >= 1){
                    this.lastChecklistCursor = document.querySelector(`#${checklistToDraw}-cursor${masterCursorIndex+1}`);
                    this.lastChecklistCursor.style.visibility = "hidden";
                    SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool", 0);
                }
                SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool", 0);
            }else if(SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool")){
                if(masterCursorIndex <= maxCursorIndex){
                    this.lastChecklistCursor = document.querySelector(`#${checklistToDraw}-cursor${masterCursorIndex-1}`);
                    this.lastChecklistCursor.style.visibility = "hidden";
                    SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool", 0);
                }
                SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool", 0);
            }
            return;
        }
        updateCursorPosition(checklistToDraw, maxCursorIndex, masterCursorIndex){
            let cursorIndex = Math.min(maxCursorIndex, masterCursorIndex);
            cursorIndex = Math.max(cursorIndex, 1);
            this.currentChecklistCursor = document.querySelector(`#${checklistToDraw}-cursor${cursorIndex}`);
            this.currentChecklistCursor.style.visibility = "visible";
            return;
        }
        cursorBoundsHandler(maxCursorIndex){
            if (SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum") < 1 ){
                SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum", 1);
            }
            if (SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum") > maxCursorIndex){
                SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum", maxCursorIndex);
            }
            return;
        }
        runChecklist(currentChecklist, masterCursorIndex){
            if(currentChecklist == "preflight-checklist"){
                this.preflightChecklist(masterCursorIndex);
            }else if(currentChecklist == "before-start-checklist"){
                this.beforeStartChecklist(masterCursorIndex);
            }else if(currentChecklist == "before-taxi-checklist"){
                this.beforeTaxiChecklist(masterCursorIndex); 
            }else if(currentChecklist == "before-takeoff-checklist"){
                this.beforeTakeoffChecklist(masterCursorIndex);
            }else if(currentChecklist == "after-takeoff-checklist"){
                this.afterTakeoffChecklist(masterCursorIndex);
            }else if(currentChecklist == "descent-checklist"){
                this.descentChecklist(masterCursorIndex);
            }else if(currentChecklist == "approach-checklist"){
                this.approachChecklist(masterCursorIndex);
            }else if(currentChecklist == "landing-checklist"){
                this.landingChecklist(masterCursorIndex);
            }else if(currentChecklist == "shutdown-checklist"){
                this.shutdownChecklist(masterCursorIndex);
            }else if(currentChecklist == "secure-checklist"){
                this.secureChecklist(masterCursorIndex);
            }
            return;
        }
        preflightChecklist(masterCursorIndex){
            let fuelSwitchStatus;
            this.oxygenTick = document.querySelector("#preflight-checklist-tick1");
            this.oxygenText = document.querySelector("#preflight-checklist4");
            this.instrumentsTick = document.querySelector("#preflight-checklist-tick2");
            this.instrumentsText1 = document.querySelector("#preflight-checklist5");
            this.instrumentsText2 = document.querySelector("#preflight-checklist6");
            this.parkBrakeTick = document.querySelector("#preflight-checklist-tick3");
            this.parkBrakeText = document.querySelector("#preflight-checklist7");
            this.fuelControlSwitchTick = document.querySelector("#preflight-checklist-tick4");
            this.fuelControlSwitchText = document.querySelector("#preflight-checklist8"); 
            if(SimVar.GetSimVarValue("L:SALTY_ECL_BTN", "bool")){
                switch(masterCursorIndex) {
                    case 4:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_4", "bool")){
                            this.oxygenTick.style.visibility = "visible";
                            this.oxygenText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_OXYGEN_CHK", "bool", 1)
                        } else {
                            this.oxygenTick.style.visibility = "hidden";
                            this.oxygenText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_OXYGEN_CHK", "bool", 0)
                        }    
                    break;
                    case 5:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_5", "bool")){
                            this.instrumentsTick.style.visibility = "visible";
                            this.instrumentsText1.style.fill = "lime";
                            this.instrumentsText2.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_5", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_INSTRUMENTS_CHK", "bool", 1)
                        } else {
                            this.instrumentsTick.style.visibility = "hidden";
                            this.instrumentsText1.style.fill = "white";
                            this.instrumentsText2.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_5", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_INSTRUMENTS_CHK", "bool", 0)
                        }    
                    break;
                }           
            }
            SimVar.SetSimVarValue("L:SALTY_ECL_BTN", "bool", 0);
            if(SimVar.GetSimVarValue("BRAKE PARKING INDICATOR","bool")){
                this.parkBrakeText.style.fill = "lime";
                this.parkBrakeTick.style.visibility = "visible";
            }else{
                this.parkBrakeText.style.fill = "white";
                this.parkBrakeTick.style.visibility = "hidden";
            }
            if((SimVar.GetSimVarValue("FUELSYSTEM VALVE OPEN:5","bool") || SimVar.GetSimVarValue("FUELSYSTEM VALVE OPEN:6","bool") || SimVar.GetSimVarValue("FUELSYSTEM VALVE OPEN:7","bool") || SimVar.GetSimVarValue("FUELSYSTEM VALVE OPEN:8","bool"))){
                this.fuelControlSwitchText.style.fill = "white";
                this.fuelControlSwitchTick.style.visibility = "hidden";
                fuelSwitchStatus = 0;
            }else{
                this.fuelControlSwitchText.style.fill = "lime";
                this.fuelControlSwitchTick.style.visibility = "visible";
                fuelSwitchStatus = 1;
            }   
            if((SimVar.GetSimVarValue("L:SALTY_ECL_OXYGEN_CHK", "bool")) && (SimVar.GetSimVarValue("L:SALTY_ECL_INSTRUMENTS_CHK", "bool")) 
                && (SimVar.GetSimVarValue("BRAKE PARKING INDICATOR","bool")) && (fuelSwitchStatus)){
                this.globalItems.style.visibility = "visible";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 1);
                SimVar.SetSimVarValue("L:SALTY_ECL_PREFLIGHT_COMPLETE", "bool", 1);
            }else{
                this.globalItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 0);
            }
            return;
        }
        beforeStartChecklist(masterCursorIndex){
            this.gearPinsTick = document.querySelector("#before-start-checklist-tick1");
            this.gearPinsText = document.querySelector("#before-start-checklist4");
            this.seatBeltsTick = document.querySelector("#before-start-checklist-tick2");
            this.seatBeltsText = document.querySelector("#before-start-checklist5");
            this.mcpTick = document.querySelector("#before-start-checklist-tick3");
            this.mcpText = document.querySelector("#before-start-checklist6");
            this.cduTick = document.querySelector("#before-start-checklist-tick4");
            this.cduText = document.querySelector("#before-start-checklist7");
            this.trimTick = document.querySelector("#before-start-checklist-tick5");
            this.trimText = document.querySelector("#before-start-checklist8");
            this.takeoffBriefingTick = document.querySelector("#before-start-checklist-tick6");
            this.takeoffBriefingText = document.querySelector("#before-start-checklist9");
            this.beaconTick = document.querySelector("#before-start-checklist-tick7");
            this.beaconText = document.querySelector("#before-start-checklist10");        
            if(SimVar.GetSimVarValue("L:SALTY_ECL_BTN", "bool")){
                switch(masterCursorIndex) {
                    case 4:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_4", "bool")){
                            this.gearPinsTick.style.visibility = "visible";
                            this.gearPinsText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_GEAR_PINS_CHK", "bool", 1)
                        } else {
                            this.gearPinsTick.style.visibility = "hidden";
                            this.gearPinsText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_GEAR_PINS_CHK", "bool", 0)
                        }    
                    break;
                    case 6:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_6", "bool")){
                            this.mcpTick.style.visibility = "visible";
                            this.mcpText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_6", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_MCP_CHK", "bool", 1)
                        } else {
                            this.mcpTick.style.visibility = "hidden";
                            this.mcpText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_6", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_MCP_CHK", "bool", 0)
                        }    
                    break;
                    case 7:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_7", "bool")){
                            this.cduTick.style.visibility = "visible";
                            this.cduText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_7", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_CDU_CHK", "bool", 1)
                        } else {
                            this.cduTick.style.visibility = "hidden";
                            this.cduText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_7", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_CDU_CHK", "bool", 0)
                        }    
                    break;
                    case 8:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_8", "bool")){
                            this.trimTick.style.visibility = "visible";
                            this.trimText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_8", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_TRIM_CHK", "bool", 1)
                        } else {
                            this.trimTick.style.visibility = "hidden";
                            this.trimText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_8", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_TRIM_CHK", "bool", 0)
                        }    
                    break;    
                    case 9:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_9", "bool")){
                            this.takeoffBriefingTick.style.visibility = "visible";
                            this.takeoffBriefingText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_9", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_TAKEOFF_BRIEFING_CHK", "bool", 1)
                        } else {
                            this.takeoffBriefingTick.style.visibility = "hidden";
                            this.takeoffBriefingText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_9", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_TAKEOFF_BRIEFING_CHK", "bool", 0)
                        }  
                    break;                
                }           
            }
            SimVar.SetSimVarValue("L:SALTY_ECL_BTN", "bool", 0);
            if(SimVar.GetSimVarValue("L:SALTY_KNOB_SEATBELT","bool")){
                this.seatBeltsText.style.fill = "lime";
                this.seatBeltsTick.style.visibility = "visible";
            }else{
                this.seatBeltsText.style.fill = "white";
                this.seatBeltsTick.style.visibility = "hidden";
            }
            if(SimVar.GetSimVarValue("LIGHT BEACON ON","bool")){
                this.beaconText.style.fill = "lime";
                this.beaconTick.style.visibility = "visible";
            }else{
                this.beaconText.style.fill = "white";
                this.beaconTick.style.visibility = "hidden";
            }   
            if((SimVar.GetSimVarValue("L:SALTY_ECL_GEAR_PINS_CHK", "bool")) && (SimVar.GetSimVarValue("L:SALTY_KNOB_SEATBELT", "bool")) 
                && (SimVar.GetSimVarValue("L:SALTY_ECL_MCP_CHK","bool")) && (SimVar.GetSimVarValue("L:SALTY_ECL_CDU_CHK","bool")
                && (SimVar.GetSimVarValue("L:SALTY_ECL_TRIM_CHK","bool")) && (SimVar.GetSimVarValue("LIGHT BEACON ON","bool")))){
                this.globalItems.style.visibility = "visible";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 1);
                SimVar.SetSimVarValue("L:SALTY_ECL_BEFORE_START_COMPLETE", "bool", 1);
            }else{
                this.globalItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 0);
            }
            return;
        }
        beforeTaxiChecklist(masterCursorIndex){
            this.antiIceTick = document.querySelector("#before-taxi-checklist-tick1");
            this.antiIceText = document.querySelector("#before-taxi-checklist4");
            this.recallTick = document.querySelector("#before-taxi-checklist-tick2");
            this.recallText = document.querySelector("#before-taxi-checklist5");
            this.autobrakeTick = document.querySelector("#before-taxi-checklist-tick3");
            this.autobrakeText = document.querySelector("#before-taxi-checklist6");
            this.flightControlsTick = document.querySelector("#before-taxi-checklist-tick4");
            this.flightControlsText = document.querySelector("#before-taxi-checklist7");
            this.groundEquipmentTick = document.querySelector("#before-taxi-checklist-tick5");
            this.groundEquipmentText = document.querySelector("#before-taxi-checklist8");      
            if(SimVar.GetSimVarValue("L:SALTY_ECL_BTN", "bool")){
                switch(masterCursorIndex) {
                    case 4:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_4", "bool")){
                            this.antiIceTick.style.visibility = "visible";
                            this.antiIceText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_ANTI_ICE_CHK", "bool", 1)
                        } else {
                            this.antiIceTick.style.visibility = "hidden";
                            this.antiIceText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_ANTI_ICE_CHK", "bool", 0)
                        }    
                    break;
                    case 5:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_5", "bool")){
                            this.recallTick.style.visibility = "visible";
                            this.recallText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_6", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_RECALL_CHK", "bool", 1)
                        } else {
                            this.recallTick.style.visibility = "hidden";
                            this.recallText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_5", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_RECALL_CHK", "bool", 0)
                        }    
                    break;
                    case 7:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_7", "bool")){
                            this.flightControlsTick.style.visibility = "visible";
                            this.flightControlsText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_7", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_CONTROLS_CHK", "bool", 1)
                        } else {
                            this.flightControlsTick.style.visibility = "hidden";
                            this.flightControlsText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_7", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_CONTROLS_CHK", "bool", 0)
                        }    
                    break;
                    case 8:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_8", "bool")){
                            this.groundEquipmentTick.style.visibility = "visible";
                            this.groundEquipmentText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_8", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_GROUND_CHK", "bool", 1)
                        } else {
                            this.groundEquipmentTick.style.visibility = "hidden";
                            this.groundEquipmentText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_8", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_GROUND_CHK", "bool", 0)
                        }    
                    break;                
                }           
            }
            SimVar.SetSimVarValue("L:SALTY_ECL_BTN", "bool", 0);
            if(SimVar.GetSimVarValue("AUTO BRAKE SWITCH CB", "Enum") == 0){
                this.autobrakeText.style.fill = "lime";
                this.autobrakeTick.style.visibility = "visible";
            }else{
                this.autobrakeText.style.fill = "white";
                this.autobrakeTick.style.visibility = "hidden";
            }
            if((SimVar.GetSimVarValue("L:SALTY_ECL_ANTI_ICE_CHK", "bool")) && (SimVar.GetSimVarValue("L:SALTY_ECL_RECALL_CHK", "bool")) 
                && (SimVar.GetSimVarValue("L:SALTY_ECL_CONTROLS_CHK","bool")) && (SimVar.GetSimVarValue("L:SALTY_ECL_GROUND_CHK","bool")
                && (SimVar.GetSimVarValue("AUTO BRAKE SWITCH CB", "Enum") == 0))){
                this.globalItems.style.visibility = "visible";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 1);
                SimVar.SetSimVarValue("L:SALTY_ECL_BEFORE_TAXI_COMPLETE", "bool", 1);
            }else{
                this.globalItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 0);
            }
            return;
        }
        beforeTakeoffChecklist(masterCursorIndex){
            let fmcTakeOffFlap = SimVar.GetSimVarValue("L:SALTY_TAKEOFF_FLAP_VALUE", "number").toFixed(0);
            this.flapsTick = document.querySelector("#before-takeoff-checklist-tick1");
            this.flapsText = document.querySelector("#before-takeoff-checklist4");
            this.flapsText.textContent = `Flaps........................................${fmcTakeOffFlap}`
            let flapsSet = 0;
            if(((SimVar.GetSimVarValue("L:SALTY_TAKEOFF_FLAP_VALUE", "number") == 10) && (SimVar.GetSimVarValue("TRAILING EDGE FLAPS LEFT ANGLE", "radians").toFixed(3) == 0.175))
                || (SimVar.GetSimVarValue("L:SALTY_TAKEOFF_FLAP_VALUE", "number") == 20) && (SimVar.GetSimVarValue("TRAILING EDGE FLAPS LEFT ANGLE", "radians").toFixed(3) == 0.349)){
                this.flapsText.style.fill = "lime";
                this.flapsTick.style.visibility = "visible";
                flapsSet = 1;
            }else{
                this.flapsText.style.fill = "white";
                this.flapsTick.style.visibility = "hidden";
                flapsSet = 0;
            }
            if(flapsSet){
                this.globalItems.style.visibility = "visible";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 1);
                SimVar.SetSimVarValue("L:SALTY_ECL_BEFORE_TAKEOFF_COMPLETE", "bool", 1);
            }else{
                this.globalItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 0);
            }
            return;
        }
        afterTakeoffChecklist(masterCursorIndex){
            this.gearUpTick = document.querySelector("#after-takeoff-checklist-tick1");
            this.gearUpText = document.querySelector("#after-takeoff-checklist4");
            this.flapsUpTick = document.querySelector("#after-takeoff-checklist-tick2");
            this.flapsUpText = document.querySelector("#after-takeoff-checklist5");
            if(SimVar.GetSimVarValue("GEAR ANIMATION POSITION", "percent") == 0){
                this.gearUpText.style.fill = "lime";
                this.gearUpTick.style.visibility = "visible";
            }else{
                this.gearUpText.style.fill = "white";
                this.gearUpTick.style.visibility = "hidden";
            }
            if(SimVar.GetSimVarValue("TRAILING EDGE FLAPS LEFT ANGLE", "radians") == 0.000){
                this.flapsUpText.style.fill = "lime";
                this.flapsUpTick.style.visibility = "visible";
            }else{
                this.flapsUpText.style.fill = "white";
                this.flapsUpTick.style.visibility = "hidden";
            }
            if((SimVar.GetSimVarValue("TRAILING EDGE FLAPS LEFT ANGLE", "radians") == 0.000) && (SimVar.GetSimVarValue("GEAR ANIMATION POSITION", "percent") == 0)){
                this.globalItems.style.visibility = "visible";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 1);
                SimVar.SetSimVarValue("L:SALTY_ECL_AFTER_TAKEOFF_COMPLETE", "bool", 1);
            }else{
                this.globalItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 0);
            }
            return;
        }
        descentChecklist(masterCursorIndex){
            this.descentRecallTick = document.querySelector("#descent-checklist-tick1");
            this.descentRecallText = document.querySelector("#descent-checklist4");
            this.descentAutobrakeTick = document.querySelector("#descent-checklist-tick2");
            this.descentAutobrakeText = document.querySelector("#descent-checklist5");
            this.landingDataTick = document.querySelector("#descent-checklist-tick3");
            this.landingDataText = document.querySelector("#descent-checklist6");
            this.approachBriefingTick = document.querySelector("#descent-checklist-tick4");
            this.approachBriefingText = document.querySelector("#descent-checklist7");    
            if(SimVar.GetSimVarValue("L:SALTY_ECL_BTN", "bool")){
                switch(masterCursorIndex) {
                    case 4:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_4", "bool")){
                            this.descentRecallTick.style.visibility = "visible";
                            this.descentRecallText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_DESCENT_RECALL_CHK", "bool", 1)
                        } else {
                            this.descentRecallTick.style.visibility = "hidden";
                            this.descentRecallText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_DESCENT_RECALL_CHK", "bool", 0)
                        }    
                    break;
                    case 5:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_5", "bool")){
                            this.descentAutobrakeTick.style.visibility = "visible";
                            this.descentAutobrakeText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_5", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_DESCENT_BRAKE_CHK", "bool", 1)
                        } else {
                            this.descentAutobrakeTick.style.visibility = "hidden";
                            this.descentAutobrakeText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_5", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_DESCENT_BRAKE_CHK", "bool", 0)
                        }    
                    break;
                    case 6:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_6", "bool")){
                            this.landingDataTick.style.visibility = "visible";
                            this.landingDataText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_6", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_LANDING_DATA_CHK", "bool", 1)
                        } else {
                            this.landingDataTick.style.visibility = "hidden";
                            this.landingDataText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_6", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_LANDING_DATA_CHK", "bool", 0)
                        }    
                    break;
                    case 7:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_7", "bool")){
                            this.approachBriefingTick.style.visibility = "visible";
                            this.approachBriefingText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_7", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_APPROACH_BRIEFING_CHK", "bool", 1)
                        } else {
                            this.approachBriefingTick.style.visibility = "hidden";
                            this.approachBriefingText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_7", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_APPROACH_BRIEFING_CHK", "bool", 0)
                        }    
                    break;                
                }           
            }
            SimVar.SetSimVarValue("L:SALTY_ECL_BTN", "bool", 0);
            if((SimVar.GetSimVarValue("L:SALTY_ECL_DESCENT_RECALL_CHK", "bool")) && (SimVar.GetSimVarValue("L:SALTY_ECL_DESCENT_BRAKE_CHK", "bool")) 
                && (SimVar.GetSimVarValue("L:SALTY_ECL_LANDING_DATA_CHK","bool")) && (SimVar.GetSimVarValue("L:SALTY_ECL_APPROACH_BRIEFING_CHK","bool"))){
                this.globalItems.style.visibility = "visible";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 1);
                SimVar.SetSimVarValue("L:SALTY_ECL_DESCENT_COMPLETE", "bool", 1);
            }else{
                this.globalItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 0);
            }
            return;
        }
        approachChecklist(masterCursorIndex){
            this.altimetersTick = document.querySelector("#approach-checklist-tick1");
            this.altimetersText = document.querySelector("#approach-checklist4");
            this.approachSeatBeltsTick = document.querySelector("#approach-checklist-tick2");
            this.approachSeatBeltsText = document.querySelector("#approach-checklist5");  
            if(SimVar.GetSimVarValue("L:SALTY_ECL_BTN", "bool")){
                switch(masterCursorIndex) {
                    case 4:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_4", "bool")){
                            this.altimetersTick.style.visibility = "visible";
                            this.altimetersText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_DESCENT_ALTIMETERS_CHK", "bool", 1)
                        } else {
                            this.altimetersTick.style.visibility = "hidden";
                            this.altimetersText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_DESCENT_ALTIMETERS_CHK", "bool", 0)
                        }    
                    break;             
                }           
            }
            SimVar.SetSimVarValue("L:SALTY_ECL_BTN", "bool", 0);
            if(SimVar.GetSimVarValue("L:SALTY_KNOB_SEATBELT","bool")){
                this.approachSeatBeltsText.style.fill = "lime";
                this.approachSeatBeltsTick.style.visibility = "visible";
            }else{
                this.approachSeatBeltsText.style.fill = "white";
                this.approachSeatBeltsTick.style.visibility = "hidden";
            }
            if((SimVar.GetSimVarValue("L:SALTY_ECL_DESCENT_ALTIMETERS_CHK", "bool") && SimVar.GetSimVarValue("L:SALTY_KNOB_SEATBELT","bool"))){
                this.globalItems.style.visibility = "visible";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 1);
                SimVar.SetSimVarValue("L:SALTY_ECL_APPROACH_COMPLETE", "bool", 1);
            }else{
                this.globalItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 0);
            }
            return;
        }
        landingChecklist(masterCursorIndex){
            let fmcLandingFlap = SimVar.GetSimVarValue("L:SALTY_SELECTED_APPROACH_FLAP", "number").toFixed(0);
            this.speedbrakeTick = document.querySelector("#landing-checklist-tick1");
            this.speedbrakeText = document.querySelector("#landing-checklist4");
            this.landingGearTick = document.querySelector("#landing-checklist-tick2");
            this.landingGearText = document.querySelector("#landing-checklist5");
            this.landingFlapsTick = document.querySelector("#landing-checklist-tick3");
            this.landingFlapsText = document.querySelector("#landing-checklist6");
            this.landingFlapsText.textContent = `Flaps........................................${fmcLandingFlap}`
            let landingFlapSet = 0;   
            if(SimVar.GetSimVarValue("SPOILERS ARMED","bool")){
                this.speedbrakeText.style.fill = "lime";
                this.speedbrakeTick.style.visibility = "visible";
            }else{
                this.speedbrakeText.style.fill = "white";
                this.speedbrakeTick.style.visibility = "hidden";
            }
            if(SimVar.GetSimVarValue("GEAR POSITION","bool")){
                this.landingGearText.style.fill = "lime";
                this.landingGearTick.style.visibility = "visible";
            }else{
                this.landingGearText.style.fill = "white";
                this.landingGearTick.style.visibility = "hidden";
            }
            if(((SimVar.GetSimVarValue("L:SALTY_SELECTED_APPROACH_FLAP", "number") == 25 ) && ((SimVar.GetSimVarValue("TRAILING EDGE FLAPS LEFT ANGLE", "radians").toFixed(3) == 0.436))
                || ((SimVar.GetSimVarValue("L:SALTY_SELECTED_APPROACH_FLAP", "number") == 30 ) && ((SimVar.GetSimVarValue("TRAILING EDGE FLAPS LEFT ANGLE", "radians").toFixed(3) == 0.524))))){
                this.landingFlapsText.style.fill = "lime";
                this.landingFlapsTick.style.visibility = "visible";
                landingFlapSet = 1;
            }else{
                this.landingFlapsText.style.fill = "white";
                this.landingFlapsTick.style.visibility = "hidden";
                landingFlapSet = 0;
            }
            if(landingFlapSet && SimVar.GetSimVarValue("SPOILERS ARMED","bool") && SimVar.GetSimVarValue("GEAR POSITION","bool")){
                this.globalItems.style.visibility = "visible";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 1);
                SimVar.SetSimVarValue("L:SALTY_ECL_LANDING_COMPLETE", "bool", 1);
            }else{
                this.globalItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 0);
            }
            return;
        }
        shutdownChecklist(masterCursorIndex){
            this.hydraulicTick = document.querySelector("#shutdown-checklist-tick1");
            this.hydraulicText = document.querySelector("#shutdown-checklist4");
            this.fuelPumpsTick = document.querySelector("#shutdown-checklist-tick2");
            this.fuelPumpsText = document.querySelector("#shutdown-checklist5");
            this.shutdownFlapsTick = document.querySelector("#shutdown-checklist-tick3");
            this.shutdownFlapsText = document.querySelector("#shutdown-checklist6");
            this.shutdownBrakeTick = document.querySelector("#shutdown-checklist-tick4");
            this.shutdownBrakeText = document.querySelector("#shutdown-checklist7");
            this.shutdownCutoffTick = document.querySelector("#shutdown-checklist-tick5");
            this.shutdownCutoffText = document.querySelector("#shutdown-checklist8");    
            this.wxrTick = document.querySelector("#shutdown-checklist-tick6");
            this.wxrText = document.querySelector("#shutdown-checklist9");        
            if(SimVar.GetSimVarValue("L:SALTY_ECL_BTN", "bool")){
                switch(masterCursorIndex) {
                    case 4:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_4", "bool")){
                            this.hydraulicTick.style.visibility = "visible";
                            this.hydraulicText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_HYDRAULIC_CHK", "bool", 1)
                        } else {
                            this.hydraulicTick.style.visibility = "hidden";
                            this.hydraulicText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_HYDRAULIC_CHK", "bool", 0)
                        }    
                    break;
                    case 7:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_7", "bool")){
                            this.shutdownBrakeTick.style.visibility = "visible";
                            this.shutdownBrakeText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_7", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_SHUTDOWN_BRAKE_CHK", "bool", 1)
                        } else {
                            this.shutdownBrakeTick.style.visibility = "hidden";
                            this.shutdownBrakeText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_7", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_SHUTDOWN_BRAKE_CHK", "bool", 0)
                        }    
                    break;               
                }
            }
            SimVar.SetSimVarValue("L:SALTY_ECL_BTN", "bool", 0);           
            let loopCounter = 1;
            let activePumpCounter = 0;
            let fuelPumpsOff = 0;
            do {
                if(SimVar.GetSimVarValue(`FUELSYSTEM PUMP ACTIVE:${loopCounter}`, "bool")){
                    activePumpCounter++;
                }
                loopCounter++;
            }
            while (loopCounter < 17);
            if(activePumpCounter){
                this.fuelPumpsText.style.fill = "white";
                this.fuelPumpsTick.style.visibility = "hidden";
                fuelPumpsOff = 0;

            }else{
                this.fuelPumpsText.style.fill = "lime";
                this.fuelPumpsTick.style.visibility = "visible";
                fuelPumpsOff = 1;
            }
            if(SimVar.GetSimVarValue("TRAILING EDGE FLAPS LEFT ANGLE", "radians") == 0.000){
                this.shutdownFlapsText.style.fill = "lime";
                this.shutdownFlapsTick.style.visibility = "visible";
            }else{
                this.shutdownFlapsText.style.fill = "white";
                this.shutdownFlapsTick.style.visibility = "hidden";
            }
            let fuelSwitchCutoff = 0;
            if((SimVar.GetSimVarValue("FUELSYSTEM VALVE OPEN:5","bool") || SimVar.GetSimVarValue("FUELSYSTEM VALVE OPEN:6","bool") 
                || SimVar.GetSimVarValue("FUELSYSTEM VALVE OPEN:7","bool") || SimVar.GetSimVarValue("FUELSYSTEM VALVE OPEN:8","bool"))){
                this.shutdownCutoffText.style.fill = "white";
                this.shutdownCutoffTick.style.visibility = "hidden";
                fuelSwitchCutoff = 0;
            }else{
                this.shutdownCutoffText.style.fill = "lime";
                this.shutdownCutoffTick.style.visibility = "visible";
                fuelSwitchCutoff = 1;
            }    
            if(!SimVar.GetSimVarValue("L:BTN_WX_ACTIVE","bool")){
                this.wxrText.style.fill = "lime";
                this.wxrTick.style.visibility = "visible";
            }else{
                this.wxrText.style.fill = "white";
                this.wxrTick.style.visibility = "hidden";
            }
            if((SimVar.GetSimVarValue("L:SALTY_ECL_HYDRAULIC_CHK", "bool") && SimVar.GetSimVarValue("L:SALTY_ECL_SHUTDOWN_BRAKE_CHK","bool") && (fuelPumpsOff)
                && (SimVar.GetSimVarValue("TRAILING EDGE FLAPS LEFT ANGLE", "radians") == 0.000) && !SimVar.GetSimVarValue("L:BTN_WX_ACTIVE","bool") && (fuelSwitchCutoff))){
                this.globalItems.style.visibility = "visible";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 1);
                SimVar.SetSimVarValue("L:SALTY_ECL_SHUTDOWN_COMPLETE", "bool", 1);
            }else{
                this.globalItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 0);
            }
            return;           
        }
        secureChecklist(masterCursorIndex){
            this.irsTick = document.querySelector("#secure-checklist-tick1");
            this.irsText = document.querySelector("#secure-checklist4");
            this.emerLightsTick = document.querySelector("#secure-checklist-tick2");
            this.emerLightsText = document.querySelector("#secure-checklist5"); 
            this.packsTick = document.querySelector("#secure-checklist-tick3");
            this.packsText = document.querySelector("#secure-checklist6");  
            if(SimVar.GetSimVarValue("L:SALTY_ECL_BTN", "bool")){
                switch(masterCursorIndex) {
                    case 4:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_4", "bool")){
                            this.irsTick.style.visibility = "visible";
                            this.irsText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_IRS_CHK", "bool", 1)
                        } else {
                            this.irsTick.style.visibility = "hidden";
                            this.irsText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_IRS_CHK", "bool", 0)
                        }    
                    break;  
                    case 5:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_5", "bool")){
                            this.emerLightsTick.style.visibility = "visible";
                            this.emerLightsText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_5", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_EMERLIGHTS_CHK", "bool", 1)
                        } else {
                            this.emerLightsTick.style.visibility = "hidden";
                            this.emerLightsText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_5", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_EMERLIGHTS_CHK", "bool", 0)
                        }    
                    break;
                    case 6:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_6", "bool")){
                            this.packsTick.style.visibility = "visible";
                            this.packsText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_6", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_PACKS_CHK", "bool", 1)
                        } else {
                            this.packsTick.style.visibility = "hidden";
                            this.packsText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_6", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_PACKS_CHK", "bool", 0)
                        }    
                    break;              
                }           
            }
            SimVar.SetSimVarValue("L:SALTY_ECL_BTN", "bool", 0);
            if(SimVar.GetSimVarValue("L:SALTY_ECL_IRS_CHK", "bool") && SimVar.GetSimVarValue("L:SALTY_ECL_EMERLIGHTS_CHK","bool") && SimVar.GetSimVarValue("L:SALTY_ECL_PACKS_CHK","bool")){
                this.globalItems.style.visibility = "visible";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 1);
                SimVar.SetSimVarValue("L:SALTY_ECL_APPROACH_COMPLETE", "bool", 1);
            }else{
                this.globalItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 0);
            }
            return;
        }
    }B747_8_LowerEICAS_ECL.Display = Display;
})(B747_8_LowerEICAS_ECL || (B747_8_LowerEICAS_ECL = {}));
customElements.define("b747-8-lower-eicas-ecl", B747_8_LowerEICAS_ECL.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL.js.map