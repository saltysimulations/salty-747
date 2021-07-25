var B747_8_LowerEICAS_ECL_landing_checklist;
(function (B747_8_LowerEICAS_ECL_landing_checklist) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
        }
        get templateID() { return "B747_8LowerEICASECL_landing_checklistTemplate" }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            this.checklistCompleteItems = document.querySelector("#landing-checklist-complete");
            this.isInitialised = true; 
        }
        //Main loop
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            var masterCursorIndex = SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX", "Enum");
            var maxCursorIndex = 6;
            this.landingChecklist();
            this.cursorBoundsHandler(maxCursorIndex);
            this.updateCursorPosition(maxCursorIndex, masterCursorIndex);
            this.clearCursors(maxCursorIndex, masterCursorIndex);
        }
        //Get if cursor index has increased or decreased in order to select last cursor for deletion.
        clearCursors(maxCursorIndex, masterCursorIndex){
            if (SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool")){
                if (masterCursorIndex >= 1){
                    this.lastChecklistCursor = document.querySelector(`#landing-checklist-cursor${masterCursorIndex+1}`);
                    this.lastChecklistCursor.style.visibility = "hidden";
                    SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_DEC", "bool", 0);
                }
                SimVar.SetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool", 0);
            } else if (SimVar.GetSimVarValue("L:SALTY_ECL_CURSOR_INDEX_INC", "bool")){
                if (masterCursorIndex <= maxCursorIndex){
                    this.lastChecklistCursor = document.querySelector(`#landing-checklist-cursor${masterCursorIndex-1}`);
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
            this.currentChecklistCursor = document.querySelector(`#landing-checklist-cursor${cursorIndex}`);
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
        //Landing logic.
        landingChecklist(){
            //Get selected landing flap value from L:SALTY_SELECTED_APPROACH_FLAP which is set in FMC Approach page.
            let fmcLandingFlap = SimVar.GetSimVarValue("L:SALTY_SELECTED_APPROACH_FLAP", "number").toFixed(0);
            this.speedbrakeTick = document.querySelector("#landing-checklist-tick1");
            this.speedbrakeText = document.querySelector("#landing-checklist4");
            this.landingGearTick = document.querySelector("#landing-checklist-tick2");
            this.landingGearText = document.querySelector("#landing-checklist5");
            this.landingFlapsTick = document.querySelector("#landing-checklist-tick3");
            this.landingFlapsText = document.querySelector("#landing-checklist6");
            //Display landing flap value on ECL.
            this.landingFlapsText.textContent = `Flaps........................................${fmcLandingFlap}`
            let landingFlapSet = 0;
            //Spoilers modelled and SimVar set incorrectly by Asobo. Should be armed when lever is pulled slightly out.
            if (SimVar.GetSimVarValue("SPOILERS ARMED","bool")){
                this.speedbrakeText.style.fill = "lime";
                this.speedbrakeTick.style.visibility = "visible";
            } else {
                this.speedbrakeText.style.fill = "white";
                this.speedbrakeTick.style.visibility = "hidden";
            }
            if (SimVar.GetSimVarValue("GEAR POSITION","bool")){
                this.landingGearText.style.fill = "lime";
                this.landingGearTick.style.visibility = "visible";
            } else {
                this.landingGearText.style.fill = "white";
                this.landingGearTick.style.visibility = "hidden";
            }
            //Compares FMC approach flap value with actual flap position. Flaps 25 and 30 are valid landing flaps.
            if (((SimVar.GetSimVarValue("L:SALTY_SELECTED_APPROACH_FLAP", "number") == 25 ) && ((SimVar.GetSimVarValue("TRAILING EDGE FLAPS LEFT ANGLE", "radians").toFixed(3) > 0.418))
                || ((SimVar.GetSimVarValue("L:SALTY_SELECTED_APPROACH_FLAP", "number") == 30 ) && ((SimVar.GetSimVarValue("TRAILING EDGE FLAPS LEFT ANGLE", "radians").toFixed(3) > 0.506))))){
                this.landingFlapsText.style.fill = "lime";
                this.landingFlapsTick.style.visibility = "visible";
                landingFlapSet = 1;
            } else {
                this.landingFlapsText.style.fill = "white";
                this.landingFlapsTick.style.visibility = "hidden";
                landingFlapSet = 0;
            }
            if (landingFlapSet && SimVar.GetSimVarValue("SPOILERS ARMED","bool") && SimVar.GetSimVarValue("GEAR POSITION","bool")){
                this.checklistCompleteItems.style.visibility = "visible";
                SimVar.SetSimVarValue("L:SALTY_ECL_LANDING_COMPLETE", "bool", 1);
            } else {
                this.checklistCompleteItems.style.visibility = "hidden";
                SimVar.SetSimVarValue("L:SALTY_ECL_LANDING_COMPLETE", "bool", 0);
            }
            return;
        }
    }B747_8_LowerEICAS_ECL_landing_checklist.Display = Display;
})(B747_8_LowerEICAS_ECL_landing_checklist || (B747_8_LowerEICAS_ECL_landing_checklist = {}));
customElements.define("b747-8-lower-eicas-ecl-landing-checklist", B747_8_LowerEICAS_ECL_landing_checklist.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL_landing_checklist.js.map