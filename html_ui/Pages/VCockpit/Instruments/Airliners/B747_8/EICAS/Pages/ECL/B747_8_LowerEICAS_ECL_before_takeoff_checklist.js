var B747_8_LowerEICAS_ECL_before_takeoff_checklist;
(function (B747_8_LowerEICAS_ECL_before_takeoff_checklist) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
        }
        get templateID() { return "B747_8LowerEICASECL_before_takeoff_checklistTemplate" }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            this.checklistCompleteItems = document.querySelector("#before-takeoff-checklist-complete");
            this.isInitialised = true; 
        }
        //Main loop
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            var masterCursorIndex = SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum");
            var maxCursorIndex = 4;
            this.beforeTakeoffChecklist();
            this.cursorBoundsHandler(maxCursorIndex);
            this.updateCursorPosition(maxCursorIndex, masterCursorIndex);
            this.clearCursors(maxCursorIndex, masterCursorIndex);
        }
        //If current checklist is flagged as completed, sequence next one to be drawn and reset flag.
        sequenceChecklist() {
            if(SimVar.GetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool")){
                if (SimVar.GetSimVarValue("L:SALTY_ECL_BEFORE_START_COMPLETE", "bool") == 0){
                    SimVar.SetSimVarValue("L:SALTY_ECL_PREFLIGHT_COMPLETE", "bool", 1);
                } else if (SimVar.GetSimVarValue("L:SALTY_ECL_BEFORE_TAXI_COMPLETE", "bool") == 0){
                    SimVar.SetSimVarValue("L:SALTY_ECL_BEFORE_START_COMPLETE", "bool", 1);
                } else if (SimVar.GetSimVarValue("L:SALTY_ECL_BEFORE_TAKEOFF_COMPLETE", "bool") == 0){
                    SimVar.SetSimVarValue("L:SALTY_ECL_BEFORE_TAXI_COMPLETE", "bool", 1);
                } else if (SimVar.GetSimVarValue("L:SALTY_ECL_AFTER_TAKEOFF_COMPLETE", "bool") == 0){
                    SimVar.SetSimVarValue("L:SALTY_ECL_BEFORE_TAKEOFF_COMPLETE", "bool", 1);
                } else if (SimVar.GetSimVarValue("L:SALTY_ECL_DESCENT_COMPLETE", "bool") == 0){
                    SimVar.SetSimVarValue("L:SALTY_ECL_AFTER_TAKEOFF_COMPLETE", "bool", 1);
                } else if (SimVar.GetSimVarValue("L:SALTY_ECL_APPROACH_COMPLETE", "bool") == 0){
                    SimVar.SetSimVarValue("L:SALTY_ECL_DESCENT_COMPLETE", "bool", 1);
                } else if (SimVar.GetSimVarValue("L:SALTY_ECL_LANDING_COMPLETE", "bool") == 0){
                    SimVar.SetSimVarValue("L:SALTY_ECL_APPROACH_COMPLETE", "bool", 1);
                } else if (SimVar.GetSimVarValue("L:SALTY_ECL_SHUTDOWN_COMPLETE", "bool") == 0){
                    SimVar.SetSimVarValue("L:SALTY_ECL_LANDING_COMPLETE", "bool", 1);
                } else if (SimVar.GetSimVarValue("L:SALTY_ECL_SECURE_COMPLETE", "bool") == 0){
                    SimVar.SetSimVarValue("L:SALTY_ECL_SHUTDOWN_COMPLETE", "bool", 1);
                }
                SimVar.SetSimVarValue("L:SALTY_ECL_CHECKLIST_COMPLETE", "bool", 0);
            }
            return;
        }
        //Uses pre-initialised SimVars to determine current active checklist and also returns associated maximum cursor position.        
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
        //Get if cursor index has increased or decreased in order to select last cursor for deletion.
        clearCursors(maxCursorIndex, masterCursorIndex){
            if(SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool")){
                if(masterCursorIndex >= 1){
                    this.lastChecklistCursor = document.querySelector(`#before-takeoff-checklist-cursor${masterCursorIndex+1}`);
                    this.lastChecklistCursor.style.visibility = "hidden";
                    SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool", 0);
                }
                SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool", 0);
            }else if(SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool")){
                if(masterCursorIndex <= maxCursorIndex){
                    this.lastChecklistCursor = document.querySelector(`#before-takeoff-checklist-cursor${masterCursorIndex-1}`);
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
            this.currentChecklistCursor = document.querySelector(`#before-takeoff-checklist-cursor${cursorIndex}`);
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
        //Before Takeoff logic. 
        beforeTakeoffChecklist(){
            //Get Takeoff Flap setting from L:SALTY_TAKEOFF_FLAP_VALUE which is set in FMC Takeoff page. 
            let fmcTakeOffFlap = SimVar.GetSimVarValue("L:SALTY_TAKEOFF_FLAP_VALUE", "number").toFixed(0);
            this.flapsTick = document.querySelector("#before-takeoff-checklist-tick1");
            this.flapsText = document.querySelector("#before-takeoff-checklist4");
            //Display on ECL selected takeoff Flap setting.
            this.flapsText.textContent = `Flaps........................................${fmcTakeOffFlap}`
            let flapsSet = 0;
            //Check if Flap Angle matches selected Takeoff Flap. 10 and 20 are valid settings.
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
                this.checklistCompleteItems.style.visibility = "visible";
                SimVar.SetSimVarValue("L:SALTY_ECL_BEFORE_TAKEOFF_COMPLETE", "bool", 1);
            }else{
                this.checklistCompleteItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_BEFORE_TAKEOFF_COMPLETE", "bool", 0);
            }
            return;
        }
    }B747_8_LowerEICAS_ECL_before_takeoff_checklist.Display = Display;
})(B747_8_LowerEICAS_ECL_before_takeoff_checklist || (B747_8_LowerEICAS_ECL_before_takeoff_checklist = {}));
customElements.define("b747-8-lower-eicas-ecl-before-takeoff-checklist", B747_8_LowerEICAS_ECL_before_takeoff_checklist.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL_before_takeoff_checklist.js.map