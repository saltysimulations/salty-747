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
            this.drawChecklist(checklistParams[0]);
            this.updateCursorPosition(checklistParams[0],checklistParams[1],masterCursorIndex);
            this.clearCursors(checklistParams[0],checklistParams[1],masterCursorIndex);
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
            this.oxygenTick = this.querySelector("#preflight-checklist-tick1");
            this.oxygenText = this.querySelector("#preflight-checklist4");
            this.instrumentsTick = this.querySelector("#preflight-checklist-tick2");
            this.instrumentsText1 = this.querySelector("#preflight-checklist5");
            this.instrumentsText2 = this.querySelector("#preflight-checklist6");
            this.parkBrakeTick = this.querySelector("#preflight-checklist-tick3");
            this.parkBrakeText = this.querySelector("#preflight-checklist7");
            this.fuelControlSwitchTick = this.querySelector("#preflight-checklist-tick4");
            this.fuelControlSwitchText = this.querySelector("#preflight-checklist8"); 
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
            this.gearPinsTick = this.querySelector("#before-start-checklist-tick1");
            this.gearPinsText = this.querySelector("#before-start-checklist4");
            this.seatBeltsTick = this.querySelector("#before-start-checklist-tick2");
            this.seatBeltsText = this.querySelector("#before-start-checklist5");
            this.mcpTick = this.querySelector("#before-start-checklist-tick3");
            this.mcpText = this.querySelector("#before-start-checklist6");
            this.cduTick = this.querySelector("#before-start-checklist-tick4");
            this.cduText = this.querySelector("#before-start-checklist7");
            this.trimTick = this.querySelector("#before-start-checklist-tick5");
            this.trimText = this.querySelector("#before-start-checklist8");
            this.takeoffBriefingTick = this.querySelector("#before-start-checklist-tick6");
            this.takeoffBriefingText = this.querySelector("#before-start-checklist9");
            this.beaconTick = this.querySelector("#before-start-checklist-tick7");
            this.beaconText = this.querySelector("#before-start-checklist10");        
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
            this.antiIceTick = this.querySelector("#before-taxi-checklist-tick1");
            this.antiIceText = this.querySelector("#before-taxi-checklist4");
            this.recallTick = this.querySelector("#before-taxi-checklist-tick2");
            this.recallText = this.querySelector("#before-taxi-checklist5");
            this.autobrakeTick = this.querySelector("#before-taxi-checklist-tick3");
            this.autobrakeText = this.querySelector("#before-taxi-checklist6");
            this.flightControlsTick = this.querySelector("#before-taxi-checklist-tick4");
            this.flightControlsText = this.querySelector("#before-taxi-checklist7");
            this.groundEquipmentTick = this.querySelector("#before-taxi-checklist-tick5");
            this.groundEquipmentText = this.querySelector("#before-taxi-checklist8");      
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
            this.flapsTick = this.querySelector("#before-takeoff-checklist-tick1");
            this.flapsText = this.querySelector("#before-takeoff-checklist4");
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
            this.gearUpTick = this.querySelector("#after-takeoff-checklist-tick1");
            this.gearUpText = this.querySelector("#after-takeoff-checklist4");
            this.flapsUpTick = this.querySelector("#after-takeoff-checklist-tick2");
            this.flapsUpText = this.querySelector("#after-takeoff-checklist5");
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
            this.descentRecallTick = this.querySelector("#descent-checklist-tick1");
            this.descentRecallText = this.querySelector("#descent-checklist4");
            this.descentAutobrakeTick = this.querySelector("#descent-checklist-tick2");
            this.descentAutobrakeText = this.querySelector("#descent-checklist5");
            this.landingDataTick = this.querySelector("#descent-checklist-tick3");
            this.landingDataText = this.querySelector("#descent-checklist6");
            this.approachBriefingTick = this.querySelector("#descent-checklist-tick4");
            this.approachBriefingText = this.querySelector("#descent-checklist7");    
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
    }
    B747_8_LowerEICAS_ECL.Display = Display;
})(B747_8_LowerEICAS_ECL || (B747_8_LowerEICAS_ECL = {}));
customElements.define("b747-8-lower-eicas-ecl", B747_8_LowerEICAS_ECL.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL.js.map