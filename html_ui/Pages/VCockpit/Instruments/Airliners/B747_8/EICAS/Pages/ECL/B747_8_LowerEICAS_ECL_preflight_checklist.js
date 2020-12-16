var B747_8_LowerEICAS_ECL_preflight_checklist;
(function (B747_8_LowerEICAS_ECL_preflight_checklist) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
        }
        get templateID() { return "B747_8LowerEICASECL_preflight_checklistTemplate" }
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
            var maxCursorIndex = 7;
            this.preflightChecklist(masterCursorIndex);
            this.cursorBoundsHandler(maxCursorIndex);
            this.updateCursorPosition(maxCursorIndex, masterCursorIndex);
            this.clearCursors(maxCursorIndex, masterCursorIndex);
        }
        //Get if cursor index has increased or decreased in order to select last cursor for deletion.
        clearCursors(maxCursorIndex, masterCursorIndex){
            if(SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool")){
                if(masterCursorIndex >= 1){
                    this.lastChecklistCursor = document.querySelector(`#preflight-checklist-cursor${masterCursorIndex+1}`);
                    this.lastChecklistCursor.style.visibility = "hidden";
                    SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool", 0);
                }
                SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool", 0);
            }else if(SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool")){
                if(masterCursorIndex <= maxCursorIndex){
                    this.lastChecklistCursor = document.querySelector(`#preflight-checklist-cursor${masterCursorIndex-1}`);
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
            this.currentChecklistCursor = document.querySelector(`#preflight-checklist-cursor${cursorIndex}`);
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
        //Preflight logic - Oxygen/Instruments manually set - Park Brake/Fuel Switches automatically sensed by checklist.
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
            //Manually set items - Captures input from L:SALTY_ECL_BTN to toggle checklist state at current Cursor Index.
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
            //Reset input.
            SimVar.SetSimVarValue("L:SALTY_ECL_BTN", "bool", 0);
            //Automatically sensed items Brake and Fuel Switches through SimVars.
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
            //Check if all checklist conditions have been met, then display CHECKLIST COMPLETE globalItem. Also set L:SALTY_ECL_CHECKLIST_COMPLETE flag for use by sequenceChecklist().
            if((SimVar.GetSimVarValue("L:SALTY_ECL_OXYGEN_CHK", "bool")) && (SimVar.GetSimVarValue("L:SALTY_ECL_INSTRUMENTS_CHK", "bool")) 
                && (SimVar.GetSimVarValue("BRAKE PARKING INDICATOR","bool")) && (fuelSwitchStatus)){
                this.globalItems.style.visibility = "visible";
                SimVar.SetSimVarValue("L:SALTY_ECL_PREFLIGHT_COMPLETE", "bool", 1);
            }else{
                this.globalItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_PREFLIGHT_COMPLETE", "bool", 0);
            }
            return;
        }
    }B747_8_LowerEICAS_ECL_preflight_checklist.Display = Display;
})(B747_8_LowerEICAS_ECL_preflight_checklist || (B747_8_LowerEICAS_ECL_preflight_checklist = {}));
customElements.define("b747-8-lower-eicas-ecl-preflight-checklist", B747_8_LowerEICAS_ECL_preflight_checklist.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL_preflight-checklist.js.map 