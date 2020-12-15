var B747_8_LowerEICAS_ECL_descent_checklist;
(function (B747_8_LowerEICAS_ECL_descent_checklist) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
        }
        get templateID() { return "B747_8LowerEICASECL_descent_checklistTemplate" }
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
        //Main loop
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            var masterCursorIndex = SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum");
            var maxCursorIndex = 7;
            this.descentChecklist(masterCursorIndex);
            this.cursorBoundsHandler(maxCursorIndex);
            this.updateCursorPosition(maxCursorIndex, masterCursorIndex);
            this.clearCursors(maxCursorIndex, masterCursorIndex);
        }
        //Get if cursor index has increased or decreased in order to select last cursor for deletion.
        clearCursors(maxCursorIndex, masterCursorIndex){
            if(SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool")){
                if(masterCursorIndex >= 1){
                    this.lastChecklistCursor = document.querySelector(`#descent-checklist-cursor${masterCursorIndex+1}`);
                    this.lastChecklistCursor.style.visibility = "hidden";
                    SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool", 0);
                }
                SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool", 0);
            }else if(SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool")){
                if(masterCursorIndex <= maxCursorIndex){
                    this.lastChecklistCursor = document.querySelector(`#descent-checklist-cursor${masterCursorIndex-1}`);
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
            this.currentChecklistCursor = document.querySelector(`#descent-checklist-cursor${cursorIndex}`);
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
        //Descent logic.
        descentChecklist(masterCursorIndex){
            this.descentRecallTick = document.querySelector("#descent-checklist-tick1");
            this.descentRecallText = document.querySelector("#descent-checklist4");
            this.descentAutobrakeTick = document.querySelector("#descent-checklist-tick2");
            this.descentAutobrakeText = document.querySelector("#descent-checklist5");
            this.landingDataTick = document.querySelector("#descent-checklist-tick3");
            this.landingDataText = document.querySelector("#descent-checklist6");
            this.approachBriefingTick = document.querySelector("#descent-checklist-tick4");
            this.approachBriefingText = document.querySelector("#descent-checklist7");    
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
                SimVar.SetSimVarValue("L:SALTY_ECL_DESCENT_COMPLETE", "bool", 1);
            }else{
                this.globalItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_DESCENT_COMPLETE", "bool", 0);
            }
            return;
        }
    }B747_8_LowerEICAS_ECL_descent_checklist.Display = Display;
})(B747_8_LowerEICAS_ECL_descent_checklist || (B747_8_LowerEICAS_ECL_descent_checklist = {}));
customElements.define("b747-8-lower-eicas-ecl-descent-checklist", B747_8_LowerEICAS_ECL_descent_checklist.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL_descent_checklist.js.map