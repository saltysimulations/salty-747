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
            var currentChecklist = this.getActiveChecklist();
            this.drawChecklist(currentChecklist);
            this.updateCursorPosition(currentChecklist);    
        }        
        getActiveChecklist(){
            if(SimVar.GetSimVarValue("L:SALTY_ECL_PREFLIGHT_COMPLETE", "bool") == 0){
                let currentChecklist = "preflight-checklist";
                return currentChecklist;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_BEFORE_START_COMPLETE", "bool") == 0){
                let currentChecklist = "before-start-checklist"
                return currentChecklist;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_BEFORE_TAXI_COMPLETE", "bool") == 0){
                let currentChecklist = "before-taxi-checklist"
                return currentChecklist;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_BEFORE_TAKEOFF_COMPLETE", "bool") == 0){
                let currentChecklist = "before-takeoff-checklist"
                return currentChecklist;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_AFTER_TAKEOFF_COMPLETE", "bool") == 0){
                let currentChecklist = "after-takeoff-checklist"
                return currentChecklist;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_DESCENT_COMPLETE", "bool") == 0){
                let currentChecklist = "descent-checklist"
                return currentChecklist;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_APPROACH_COMPLETE", "bool") == 0){
                let currentChecklist = "approach-checklist"
                return currentChecklist;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_LANDING_COMPLETE", "bool") == 0){
                let currentChecklist = "landing-checklist"
                return currentChecklist;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_SHUTDOWN_COMPLETE", "bool") == 0){
                let currentChecklist = "shutdown-checklist"
                return currentChecklist;
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_SECURE_COMPLETE", "bool") == 0){
                let currentChecklist = "secure-checklist"
                return currentChecklist;
            }
        }
        drawChecklist(checklistToDraw){
            this.currentChecklist = document.querySelector(`#${checklistToDraw}`);
            this.allChecklists.style.visibility = "hidden";   
            this.currentChecklist.style.visibility = "visible";
            return;
        }
        updateCursorPosition(checklistToDraw){
            this.text = document.querySelector("#change");
            var cursorIndex = SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum");
            this.currentChecklistCursor = document.querySelector(`#${checklistToDraw}${cursorIndex}`);
            this.currentChecklistCursor.style.outline = "2px solid magenta";
            return;
        }
    }
    B747_8_LowerEICAS_ECL.Display = Display;
})(B747_8_LowerEICAS_ECL || (B747_8_LowerEICAS_ECL = {}));
customElements.define("b747-8-lower-eicas-ecl", B747_8_LowerEICAS_ECL.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL.js.map