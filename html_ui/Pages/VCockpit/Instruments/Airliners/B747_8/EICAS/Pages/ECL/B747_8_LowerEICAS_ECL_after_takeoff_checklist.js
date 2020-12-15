var B747_8_LowerEICAS_ECL_after_takeoff_checklist;
(function (B747_8_LowerEICAS_ECL_after_takeoff_checklist) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
        }
        get templateID() { return "B747_8LowerEICASECL_after_takeoff_checklistTemplate" }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {;
            this.globalItems = document.querySelector("#global-items");
            this.isInitialised = true; 
        }
        //Main loop
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            var masterCursorIndex = SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum");
            var maxCursorIndex = 5;
            this.afterTakeoffChecklist();
            this.cursorBoundsHandler(maxCursorIndex);
            this.updateCursorPosition(maxCursorIndex, masterCursorIndex);
            this.clearCursors(maxCursorIndex, masterCursorIndex);
        }
        //Get if cursor index has increased or decreased in order to select last cursor for deletion.
        clearCursors(maxCursorIndex, masterCursorIndex){
            if(SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool")){
                if(masterCursorIndex >= 1){
                    this.lastChecklistCursor = document.querySelector(`#after-takeoff-checklist-cursor${masterCursorIndex+1}`);
                    this.lastChecklistCursor.style.visibility = "hidden";
                    SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool", 0);
                }
                SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool", 0);
            }else if(SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool")){
                if(masterCursorIndex <= maxCursorIndex){
                    this.lastChecklistCursor = document.querySelector(`#after-takeoff-checklist-cursor${masterCursorIndex-1}`);
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
            this.currentChecklistCursor = document.querySelector(`#after-takeoff-checklist-cursor${cursorIndex}`);
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
        //After Takeoff logic.
        afterTakeoffChecklist(){
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
                SimVar.SetSimVarValue("L:SALTY_ECL_AFTER_TAKEOFF_COMPLETE", "bool", 1);
            }else{
                this.globalItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_AFTER_TAKEOFF_COMPLETE", "bool", 0);
            }
            return;
        }
    }B747_8_LowerEICAS_ECL_after_takeoff_checklist.Display = Display;
})(B747_8_LowerEICAS_ECL_after_takeoff_checklist || (B747_8_LowerEICAS_ECL_after_takeoff_checklist = {}));
customElements.define("b747-8-lower-eicas-ecl-after-takeoff-checklist", B747_8_LowerEICAS_ECL_after_takeoff_checklist.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL_after_takeoff_checklist.js.map