var B747_8_LowerEICAS_ECL_approach_checklist;
(function (B747_8_LowerEICAS_ECL_approach_checklist) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
        }
        get templateID() { return "B747_8LowerEICASECL_approach_checklistTemplate" }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            this.checklistCompleteItems = document.querySelector("#approach-checklist-complete");
            this.isInitialised = true; 
        }
        //Main loop
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            var masterCursorIndex = SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum");
            var maxCursorIndex = 5;
            this.approachChecklist(masterCursorIndex);
            this.cursorBoundsHandler(maxCursorIndex);
            this.updateCursorPosition(maxCursorIndex, masterCursorIndex);
            this.clearCursors(maxCursorIndex, masterCursorIndex);
        }
        //Get if cursor index has increased or decreased in order to select last cursor for deletion.
        clearCursors(maxCursorIndex, masterCursorIndex){
            if (SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool")){
                if (masterCursorIndex >= 1){
                    this.lastChecklistCursor = document.querySelector(`#approach-checklist-cursor${masterCursorIndex+1}`);
                    this.lastChecklistCursor.style.visibility = "hidden";
                    SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool", 0);
                }
                SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool", 0);
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool")){
                if (masterCursorIndex <= maxCursorIndex){
                    this.lastChecklistCursor = document.querySelector(`#approach-checklist-cursor${masterCursorIndex-1}`);
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
            this.currentChecklistCursor = document.querySelector(`#approach-checklist-cursor${cursorIndex}`);
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
        //Approach logic.
        approachChecklist(masterCursorIndex){
            this.altimetersTick = document.querySelector("#approach-checklist-tick1");
            this.altimetersText = document.querySelector("#approach-checklist4");
            this.approachSeatBeltsTick = document.querySelector("#approach-checklist-tick2");
            this.approachSeatBeltsText = document.querySelector("#approach-checklist5");  
            if (SimVar.GetSimVarValue("L:SALTY_ECL_BTN", "bool")){
                switch (masterCursorIndex) {
                    case 4:
                        if (SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_4", "bool")){
                            this.altimetersTick.style.visibility = "visible";
                            this.altimetersText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 0);
                            SimVar.SetSimVarValue("L:SALTY_ECL_DESCENT_ALTIMETERS_CHK", "bool", 1);
                        } else {
                            this.altimetersTick.style.visibility = "hidden";
                            this.altimetersText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 1);
                            SimVar.SetSimVarValue("L:SALTY_ECL_DESCENT_ALTIMETERS_CHK", "bool", 0);
                        }    
                    break;             
                }           
            }
            SimVar.SetSimVarValue("L:SALTY_ECL_BTN", "bool", 0);
            if (SimVar.GetSimVarValue("L:SALTY_KNOB_SEATBELT","bool")){
                this.approachSeatBeltsText.style.fill = "lime";
                this.approachSeatBeltsTick.style.visibility = "visible";
            } else {
                this.approachSeatBeltsText.style.fill = "white";
                this.approachSeatBeltsTick.style.visibility = "hidden";
            }
            if ((SimVar.GetSimVarValue("L:SALTY_ECL_DESCENT_ALTIMETERS_CHK", "bool") && SimVar.GetSimVarValue("L:SALTY_KNOB_SEATBELT","bool"))){
                this.checklistCompleteItems.style.visibility = "visible";
                SimVar.SetSimVarValue("L:SALTY_ECL_APPROACH_COMPLETE", "bool", 1);
            } else {
                this.checklistCompleteItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_APPROACH_COMPLETE", "bool", 0);
            }
            return;
        }
    }B747_8_LowerEICAS_ECL_approach_checklist.Display = Display;
})(B747_8_LowerEICAS_ECL_approach_checklist || (B747_8_LowerEICAS_ECL_approach_checklist = {}));
customElements.define("b747-8-lower-eicas-ecl-approach-checklist", B747_8_LowerEICAS_ECL_approach_checklist.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL_approach_checklist.js.map