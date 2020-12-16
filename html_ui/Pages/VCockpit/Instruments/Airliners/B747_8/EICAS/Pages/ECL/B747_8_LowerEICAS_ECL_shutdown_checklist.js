var B747_8_LowerEICAS_ECL_shutdown_checklist;
(function (B747_8_LowerEICAS_ECL_shutdown_checklist) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
        }
        get templateID() { return "B747_8LowerEICASECL_shutdown_checklistTemplate" }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            this.checklistCompleteItems = document.querySelector("#shutdown-checklist-complete");
            this.isInitialised = true; 
        }
        //Main loop
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            var masterCursorIndex = SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum");
            var maxCursorIndex = 9;
            this.shutdownChecklist(masterCursorIndex);
            this.cursorBoundsHandler(maxCursorIndex);
            this.updateCursorPosition(maxCursorIndex, masterCursorIndex);
            this.clearCursors(maxCursorIndex, masterCursorIndex);
        }
        //Get if cursor index has increased or decreased in order to select last cursor for deletion.
        clearCursors(maxCursorIndex, masterCursorIndex){
            if (SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool")){
                if (masterCursorIndex >= 1){
                    this.lastChecklistCursor = document.querySelector(`#shutdown-checklist-cursor${masterCursorIndex+1}`);
                    this.lastChecklistCursor.style.visibility = "hidden";
                    SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool", 0);
                }
                SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool", 0);
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool")){
                if (masterCursorIndex <= maxCursorIndex){
                    this.lastChecklistCursor = document.querySelector(`#shutdown-checklist-cursor${masterCursorIndex-1}`);
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
            this.currentChecklistCursor = document.querySelector(`#shutdown-checklist-cursor${cursorIndex}`);
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
        //Shutdown logic
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
            if (SimVar.GetSimVarValue("L:SALTY_ECL_BTN", "bool")){
                switch (masterCursorIndex) {
                    case 4:
                        if (!SimVar.GetSimVarValue("L:SALTY_ECL_HYDRAULIC_CHK", "bool")){
                            this.hydraulicTick.style.visibility = "visible";
                            this.hydraulicText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_HYDRAULIC_CHK", "bool", 1);
                        } else {
                            this.hydraulicTick.style.visibility = "hidden";
                            this.hydraulicText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_HYDRAULIC_CHK", "bool", 0);
                        }    
                    break;
                    case 7:
                        if (!SimVar.GetSimVarValue("L:SALTY_ECL_SHUTDOWN_BRAKE_CHK", "bool")){
                            this.shutdownBrakeTick.style.visibility = "visible";
                            this.shutdownBrakeText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_SHUTDOWN_BRAKE_CHK", "bool", 1);
                        } else {
                            this.shutdownBrakeTick.style.visibility = "hidden";
                            this.shutdownBrakeText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_SHUTDOWN_BRAKE_CHK", "bool", 0);
                        }    
                    break;               
                }
            }
            SimVar.SetSimVarValue("L:SALTY_ECL_BTN", "bool", 0);           
            //For FUEL PUMPS -- OFF condition. Loops to count number of main fuel pumps running by SimVar index(16 total).
            let loopCounter = 1;
            let activePumpCounter = 0;
            let fuelPumpsOff = 0;
            do {
                if (SimVar.GetSimVarValue(`FUELSYSTEM PUMP ACTIVE:${loopCounter}`, "bool")){
                    activePumpCounter++;
                }
                loopCounter++;
            }
            while (loopCounter < 17);
            //Condition met if no pumps are counted as on.
            if (activePumpCounter){
                this.fuelPumpsText.style.fill = "white";
                this.fuelPumpsTick.style.visibility = "hidden";
                fuelPumpsOff = 0;
            } else {
                this.fuelPumpsText.style.fill = "lime";
                this.fuelPumpsTick.style.visibility = "visible";
                fuelPumpsOff = 1;
            }
            if (SimVar.GetSimVarValue("TRAILING EDGE FLAPS LEFT ANGLE", "radians") == 0.000){
                this.shutdownFlapsText.style.fill = "lime";
                this.shutdownFlapsTick.style.visibility = "visible";
            } else {
                this.shutdownFlapsText.style.fill = "white";
                this.shutdownFlapsTick.style.visibility = "hidden";
            }
            let fuelSwitchCutoff = 0;
            if ((SimVar.GetSimVarValue("FUELSYSTEM VALVE OPEN:5","bool") || SimVar.GetSimVarValue("FUELSYSTEM VALVE OPEN:6","bool") 
                || SimVar.GetSimVarValue("FUELSYSTEM VALVE OPEN:7","bool") || SimVar.GetSimVarValue("FUELSYSTEM VALVE OPEN:8","bool"))){
                this.shutdownCutoffText.style.fill = "white";
                this.shutdownCutoffTick.style.visibility = "hidden";
                fuelSwitchCutoff = 0;
            } else {
                this.shutdownCutoffText.style.fill = "lime";
                this.shutdownCutoffTick.style.visibility = "visible";
                fuelSwitchCutoff = 1;
            }    
            if (!SimVar.GetSimVarValue("L:BTN_WX_ACTIVE","bool")){
                this.wxrText.style.fill = "lime";
                this.wxrTick.style.visibility = "visible";
             }else {
                this.wxrText.style.fill = "white";
                this.wxrTick.style.visibility = "hidden";
            }
            if ((SimVar.GetSimVarValue("L:SALTY_ECL_HYDRAULIC_CHK", "bool") && SimVar.GetSimVarValue("L:SALTY_ECL_SHUTDOWN_BRAKE_CHK","bool") && (fuelPumpsOff)
                && (SimVar.GetSimVarValue("TRAILING EDGE FLAPS LEFT ANGLE", "radians") == 0.000) && !SimVar.GetSimVarValue("L:BTN_WX_ACTIVE","bool") && (fuelSwitchCutoff))){
                this.checklistCompleteItems.style.visibility = "visible";
                SimVar.SetSimVarValue("L:SALTY_ECL_SHUTDOWN_COMPLETE", "bool", 1);
            } else {
                this.checklistCompleteItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_SHUTDOWN_COMPLETE", "bool", 0);
            }
            return;           
        }
    }B747_8_LowerEICAS_ECL_shutdown_checklist.Display = Display;
})(B747_8_LowerEICAS_ECL_shutdown_checklist || (B747_8_LowerEICAS_ECL_shutdown_checklist = {}));
customElements.define("b747-8-lower-eicas-ecl-shutdown-checklist", B747_8_LowerEICAS_ECL_shutdown_checklist.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL_shutdown_checklist.js.map