var B747_8_LowerEICAS_ECL_before_start_checklist;
(function (B747_8_LowerEICAS_ECL_before_start_checklist) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
        }
        get templateID() { return "B747_8LowerEICASECL_before_start_checklistTemplate" }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            this.globalItems = document.querySelector("#global-items");
            this.isInitialised = true; 
        }
        //Main loop
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            var masterCursorIndex = SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum");
            var maxCursorIndex = 10;
            this.beforeStartChecklist(masterCursorIndex);
            this.cursorBoundsHandler(maxCursorIndex);
            this.updateCursorPosition(maxCursorIndex, masterCursorIndex);
            this.clearCursors(maxCursorIndex, masterCursorIndex);
        }
        //Get if cursor index has increased or decreased in order to select last cursor for deletion.
        clearCursors(maxCursorIndex, masterCursorIndex){
            if(SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool")){
                if(masterCursorIndex >= 1){
                    this.lastChecklistCursor = document.querySelector(`#before-start-checklist-cursor${masterCursorIndex+1}`);
                    this.lastChecklistCursor.style.visibility = "hidden";
                    SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool", 0);
                }
                SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool", 0);
            }else if(SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool")){
                if(masterCursorIndex <= maxCursorIndex){
                    this.lastChecklistCursor = document.querySelector(`#before-start-checklist-cursor${masterCursorIndex-1}`);
                    this.lastChecklistCursor.style.visibility = "hidden";
                    SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool", 0);
                }
                SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool", 0);
            }
            return;
        }
        //Draw new cursor based on current index.
        updateCursorPosition(maxCursorIndex, masterCursorIndex){
            let cursorIndex = Math.min(maxCursorIndex, masterCursorIndex);
            cursorIndex = Math.max(cursorIndex, 1);
            this.currentChecklistCursor = document.querySelector(`#before-start-checklist-cursor${cursorIndex}`);
            this.currentChecklistCursor.style.visibility = "visible";
            return;
        }
        //Prevent cursor index being moved to invalid position.
        cursorBoundsHandler(maxCursorIndex){
            if (SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum") < 1 ){
                SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum", 1);
            }
            if (SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum") > maxCursorIndex){
                SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum", maxCursorIndex);
            }
            return;
        }
        //Before Start logic.
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
                SimVar.SetSimVarValue("L:SALTY_ECL_BEFORE_START_COMPLETE", "bool", 1);
            }else{
                this.globalItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_BEFORE_START_COMPLETE", "bool", 0);
            }
            return;
        }
    }B747_8_LowerEICAS_ECL_before_start_checklist.Display = Display;
})(B747_8_LowerEICAS_ECL_before_start_checklist || (B747_8_LowerEICAS_ECL_before_start_checklist = {}));
customElements.define("b747-8-lower-eicas-ecl-before-start-checklist", B747_8_LowerEICAS_ECL_before_start_checklist.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL_before_start_checklist.js.map