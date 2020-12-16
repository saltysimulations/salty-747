var B747_8_LowerEICAS_ECL_before_taxi_checklist;
(function (B747_8_LowerEICAS_ECL_before_taxi_checklist) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
        }
        get templateID() { return "B747_8LowerEICASECL_before_taxiTemplate" }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            this.checklistCompleteItems = document.querySelector("#before-taxi-checklist-complete");
            this.isInitialised = true; 
        }
        //Main loop
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            var masterCursorIndex = SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum");
            var maxCursorIndex = 8;
            this.beforeTaxiChecklist(masterCursorIndex);
            this.cursorBoundsHandler(maxCursorIndex);
            this.updateCursorPosition(maxCursorIndex, masterCursorIndex);
            this.clearCursors(maxCursorIndex, masterCursorIndex);
        }
        //Get if cursor index has increased or decreased in order to select last cursor for deletion.
        clearCursors(maxCursorIndex, masterCursorIndex){
            if (SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool")){
                if (masterCursorIndex >= 1){
                    this.lastChecklistCursor = document.querySelector(`#before-taxi-checklist-cursor${masterCursorIndex+1}`);
                    this.lastChecklistCursor.style.visibility = "hidden";
                    SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool", 0);
                }
                SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool", 0);
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool")){
                if (masterCursorIndex <= maxCursorIndex){
                    this.lastChecklistCursor = document.querySelector(`#before-taxi-checklist-cursor${masterCursorIndex-1}`);
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
            this.currentChecklistCursor = document.querySelector(`#before-taxi-checklist-cursor${cursorIndex}`);
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
        //Before Taxi logic.
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
            if (SimVar.GetSimVarValue("L:SALTY_ECL_BTN", "bool")){
                switch (masterCursorIndex) {
                    case 4:
                        if (!SimVar.GetSimVarValue("L:SALTY_ECL_ANTI_ICE_CHK", "bool")){
                            this.antiIceTick.style.visibility = "visible";
                            this.antiIceText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_ANTI_ICE_CHK", "bool", 1);
                        } else {
                            this.antiIceTick.style.visibility = "hidden";
                            this.antiIceText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_ANTI_ICE_CHK", "bool", 0);
                        }    
                    break;
                    case 5:
                        if (!SimVar.GetSimVarValue("L:SALTY_ECL_RECALL_CHK", "bool")){
                            this.recallTick.style.visibility = "visible";
                            this.recallText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_RECALL_CHK", "bool", 1);
                        } else {
                            this.recallTick.style.visibility = "hidden";
                            this.recallText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_RECALL_CHK", "bool", 0);
                        }    
                    break;
                    case 7:
                        if (!SimVar.GetSimVarValue("L:SALTY_ECL_CONTROLS_CHK", "bool")){
                            this.flightControlsTick.style.visibility = "visible";
                            this.flightControlsText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_CONTROLS_CHK", "bool", 1);
                        } else {
                            this.flightControlsTick.style.visibility = "hidden";
                            this.flightControlsText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_CONTROLS_CHK", "bool", 0);
                        }    
                    break;
                    case 8:
                        if (!SimVar.GetSimVarValue("L:SALTY_ECL_GROUND_CHK", "bool")){
                            this.groundEquipmentTick.style.visibility = "visible";
                            this.groundEquipmentText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_GROUND_CHK", "bool", 1);
                        } else {
                            this.groundEquipmentTick.style.visibility = "hidden";
                            this.groundEquipmentText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_GROUND_CHK", "bool", 0);
                        }    
                    break;                
                }           
            }
            SimVar.SetSimVarValue("L:SALTY_ECL_BTN", "bool", 0);
            if (SimVar.GetSimVarValue("AUTO BRAKE SWITCH CB", "Enum") == 0){
                this.autobrakeText.style.fill = "lime";
                this.autobrakeTick.style.visibility = "visible";
            } else {
                this.autobrakeText.style.fill = "white";
                this.autobrakeTick.style.visibility = "hidden";
            }
            if ((SimVar.GetSimVarValue("L:SALTY_ECL_ANTI_ICE_CHK", "bool")) && (SimVar.GetSimVarValue("L:SALTY_ECL_RECALL_CHK", "bool")) 
                && (SimVar.GetSimVarValue("L:SALTY_ECL_CONTROLS_CHK","bool")) && (SimVar.GetSimVarValue("L:SALTY_ECL_GROUND_CHK","bool")
                && (SimVar.GetSimVarValue("AUTO BRAKE SWITCH CB", "Enum") == 0))){
                this.checklistCompleteItems.style.visibility = "visible";
                SimVar.SetSimVarValue("L:SALTY_ECL_BEFORE_TAXI_COMPLETE", "bool", 1);
            } else {
                this.checklistCompleteItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_BEFORE_TAXI_COMPLETE", "bool", 0);
            }
            return;
        }
    }B747_8_LowerEICAS_ECL_before_taxi_checklist.Display = Display;
})(B747_8_LowerEICAS_ECL_before_taxi_checklist || (B747_8_LowerEICAS_ECL_before_taxi_checklist = {}));
customElements.define("b747-8-lower-eicas-ecl-before-taxi-checklist", B747_8_LowerEICAS_ECL_before_taxi_checklist.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL_before_taxi_checklist.js.map