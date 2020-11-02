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
            this.allChecklists.style.visibility = "hidden";
            this.isInitialised = true; 
        }
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            var masterCursorIndex = SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum");
            var checklistParams = this.getActiveChecklist();
            this.cursorBoundsHandler(checklistParams[1]);
            this.drawChecklist(checklistParams[0]);
            this.clearCursors(checklistParams[0],checklistParams[1],masterCursorIndex);
            this.updateCursorPosition(checklistParams[0],checklistParams[1],masterCursorIndex); 
            this.runChecklist(checklistParams[0]);  
        }        
        getActiveChecklist(){
            if(SimVar.GetSimVarValue("L:SALTY_ECL_PREFLIGHT_COMPLETE", "bool") == 0){
                let currentChecklist = "preflight-checklist";
                let maxCursorIndex = 7;
                let checklistParams = [currentChecklist, maxCursorIndex];
                return checklistParams;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_BEFORE_START_COMPLETE", "bool") == 0){
                let currentChecklist = "before-start-checklist";
                return currentChecklist;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_BEFORE_TAXI_COMPLETE", "bool") == 0){
                let currentChecklist = "before-taxi-checklist";
                return currentChecklist;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_BEFORE_TAKEOFF_COMPLETE", "bool") == 0){
                let currentChecklist = "before-takeoff-checklist";
                return currentChecklist;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_AFTER_TAKEOFF_COMPLETE", "bool") == 0){
                let currentChecklist = "after-takeoff-checklist";
                return currentChecklist;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_DESCENT_COMPLETE", "bool") == 0){
                let currentChecklist = "descent-checklist";
                return currentChecklist;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_APPROACH_COMPLETE", "bool") == 0){
                let currentChecklist = "approach-checklist";
                return currentChecklist;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_LANDING_COMPLETE", "bool") == 0){
                let currentChecklist = "landing-checklist";
                return currentChecklist;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_SHUTDOWN_COMPLETE", "bool") == 0){
                let currentChecklist = "shutdown-checklist";
                return currentChecklist;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_SECURE_COMPLETE", "bool") == 0){
                let currentChecklist = "secure-checklist";
                return currentChecklist;
            }
        }
        drawChecklist(checklistToDraw){
            this.currentChecklist = document.querySelector(`#${checklistToDraw}`);
            this.allChecklists.style.visibility = "hidden";   
            this.currentChecklist.style.visibility = "visible";
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
        runChecklist(currentChecklist){
            return;
        }
    }
    B747_8_LowerEICAS_ECL.Display = Display;
})(B747_8_LowerEICAS_ECL || (B747_8_LowerEICAS_ECL = {}));
customElements.define("b747-8-lower-eicas-ecl", B747_8_LowerEICAS_ECL.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL.js.map