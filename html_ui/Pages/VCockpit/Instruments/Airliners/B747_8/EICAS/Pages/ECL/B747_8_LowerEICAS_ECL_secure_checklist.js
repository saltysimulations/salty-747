var B747_8_LowerEICAS_ECL_secure_checklist;
(function (B747_8_LowerEICAS_ECL_secure_checklist) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
        }
        get templateID() { return "B747_8LowerEICASECL_secure_checklistTemplate" }
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
            var maxCursorIndex = 6;
            this.secureChecklist(masterCursorIndex);
            this.cursorBoundsHandler(maxCursorIndex);
            this.updateCursorPosition(maxCursorIndex, masterCursorIndex);
            this.clearCursors(maxCursorIndex, masterCursorIndex);
        }
        //Get if cursor index has increased or decreased in order to select last cursor for deletion.
        clearCursors(maxCursorIndex, masterCursorIndex){
            if(SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool")){
                if(masterCursorIndex >= 1){
                    this.lastChecklistCursor = document.querySelector(`#secure-checklist-cursor${masterCursorIndex+1}`);
                    this.lastChecklistCursor.style.visibility = "hidden";
                    SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool", 0);
                }
                SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool", 0);
            }else if(SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool")){
                if(masterCursorIndex <= maxCursorIndex){
                    this.lastChecklistCursor = document.querySelector(`#secure-checklist-cursor${masterCursorIndex-1}`);
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
            this.currentChecklistCursor = document.querySelector(`#secure-checklist-cursor${cursorIndex}`);
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
        //Secure logic.
        secureChecklist(masterCursorIndex){
            this.irsTick = document.querySelector("#secure-checklist-tick1");
            this.irsText = document.querySelector("#secure-checklist4");
            this.emerLightsTick = document.querySelector("#secure-checklist-tick2");
            this.emerLightsText = document.querySelector("#secure-checklist5"); 
            this.packsTick = document.querySelector("#secure-checklist-tick3");
            this.packsText = document.querySelector("#secure-checklist6");  
            if(SimVar.GetSimVarValue("L:SALTY_ECL_BTN", "bool")){
                switch(masterCursorIndex) {
                    case 4:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_4", "bool")){
                            this.irsTick.style.visibility = "visible";
                            this.irsText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_IRS_CHK", "bool", 1)
                        } else {
                            this.irsTick.style.visibility = "hidden";
                            this.irsText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_4", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_IRS_CHK", "bool", 0)
                        }    
                    break;  
                    case 5:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_5", "bool")){
                            this.emerLightsTick.style.visibility = "visible";
                            this.emerLightsText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_5", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_EMERLIGHTS_CHK", "bool", 1)
                        } else {
                            this.emerLightsTick.style.visibility = "hidden";
                            this.emerLightsText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_5", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_EMERLIGHTS_CHK", "bool", 0)
                        }    
                    break;
                    case 6:
                        if(SimVar.GetSimVarValue("L:SALTY_ECL_INDEX_6", "bool")){
                            this.packsTick.style.visibility = "visible";
                            this.packsText.style.fill = "lime";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_6", "bool", 0)
                            SimVar.SetSimVarValue("L:SALTY_ECL_PACKS_CHK", "bool", 1)
                        } else {
                            this.packsTick.style.visibility = "hidden";
                            this.packsText.style.fill = "white";
                            SimVar.SetSimVarValue("L:SALTY_ECL_INDEX_6", "bool", 1)
                            SimVar.SetSimVarValue("L:SALTY_ECL_PACKS_CHK", "bool", 0)
                        }    
                    break;              
                }           
            }
            SimVar.SetSimVarValue("L:SALTY_ECL_BTN", "bool", 0);
            if(SimVar.GetSimVarValue("L:SALTY_ECL_IRS_CHK", "bool") && SimVar.GetSimVarValue("L:SALTY_ECL_EMERLIGHTS_CHK","bool") && SimVar.GetSimVarValue("L:SALTY_ECL_PACKS_CHK","bool")){
                this.globalItems.style.visibility = "visible";
                SimVar.SetSimVarValue("L:SALTY_ECL_SECURE_COMPLETE", "bool", 1);
            }else{
                this.globalItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_SECURE_COMPLETE", "bool", 0);
            }
            return;
        }
    }B747_8_LowerEICAS_ECL_secure_checklist.Display = Display;
})(B747_8_LowerEICAS_ECL_secure_checklist || (B747_8_LowerEICAS_ECL_secure_checklist = {}));
customElements.define("b747-8-lower-eicas-ecl-secure-checklist", B747_8_LowerEICAS_ECL_secure_checklist.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL_secure_checklist.js.map