class B747_8_EICAS extends Airliners.BaseEICAS {
    init(){
        super.init();
        this.currentPage = "B747_8_EICAS_fuel";
    }
    onEvent(_event) {
        super.onEvent(_event);
        if (_event == "EICAS_CHANGE_PAGE_chkl"){
            let eclToDraw = this.sequenceElectronicChecklist();
            this.changePage(`CHKL-${eclToDraw}`)
            this.currentPage = `CHKL-${eclToDraw}`;
        } else if (this.currentPage !== _event){
            this.currentPage = _event;
        } else {
            this.changePage("BLANK");
            this.currentPage = "blank";
            return;
        }
        var prefix = this.getLowerScreenChangeEventNamePrefix();
        if (_event.indexOf(prefix) >= 0) {
            var pageName = _event.replace(prefix, "");
            this.changePage(pageName);
        }
        else {
            for (let i = 0; i < this.lowerScreenPages.length; i++) {
                this.lowerScreenPages[i].onEvent(_event);
            }
        }
    }
    get templateID() {
        return "B747_8_EICAS";
    }
    createUpperScreenPage() {
        this.upperTopScreen = new Airliners.EICASScreen("TopScreen", "TopScreen", "b747-8-upper-eicas");
        this.annunciations = new Cabin_Annunciations();
        this.upperTopScreen.addIndependentElement(this.annunciations);
        this.warnings = new Cabin_Warnings();
        this.upperTopScreen.addIndependentElement(this.warnings);
        this.addIndependentElementContainer(this.upperTopScreen);
    }
    createLowerScreenPages() {
        this.createLowerScreenPage("FUEL", "BottomScreen", "b747-8-lower-eicas-fuel");
        this.createLowerScreenPage("ENG", "BottomScreen", "b747-8-lower-eicas-engine");
        this.createLowerScreenPage("STAT", "BottomScreen", "b747-8-lower-eicas-stat");
        this.createLowerScreenPage("FCTL", "BottomScreen", "b747-8-lower-eicas-fctl");
        this.createLowerScreenPage("DRS", "BottomScreen", "b747-8-lower-eicas-drs");
        this.createLowerScreenPage("ELEC", "BottomScreen", "b747-8-lower-eicas-elec");
        this.createLowerScreenPage("GEAR", "BottomScreen", "b747-8-lower-eicas-gear");
        this.createLowerScreenPage("CHKL-preflight-checklist", "BottomScreen", "b747-8-lower-eicas-ecl-preflight-checklist");
        this.createLowerScreenPage("CHKL-before-start-checklist", "BottomScreen", "b747-8-lower-eicas-ecl-before-start-checklist");
        this.createLowerScreenPage("CHKL-before-taxi-checklist", "BottomScreen", "b747-8-lower-eicas-ecl-before-taxi-checklist");
        this.createLowerScreenPage("CHKL-before-takeoff-checklist", "BottomScreen", "b747-8-lower-eicas-ecl-before-takeoff-checklist");
        this.createLowerScreenPage("CHKL-after-takeoff-checklist", "BottomScreen", "b747-8-lower-eicas-ecl-after-takeoff-checklist");
        this.createLowerScreenPage("CHKL-descent-checklist", "BottomScreen", "b747-8-lower-eicas-ecl-descent-checklist");
        this.createLowerScreenPage("CHKL-approach-checklist", "BottomScreen", "b747-8-lower-eicas-ecl-approach-checklist");
        this.createLowerScreenPage("CHKL-landing-checklist", "BottomScreen", "b747-8-lower-eicas-ecl-landing-checklist");
        this.createLowerScreenPage("CHKL-shutdown-checklist", "BottomScreen", "b747-8-lower-eicas-ecl-shutdown-checklist");
        this.createLowerScreenPage("CHKL-secure-checklist", "BottomScreen", "b747-8-lower-eicas-ecl-secure-checklist");
        this.createLowerScreenPage("BLANK", "BottomScreen", "b747-8-lower-eicas-blank"); // To blank the bottom eicas when selecting same page again
    }
    getLowerScreenChangeEventNamePrefix() {
        return "EICAS_CHANGE_PAGE_";
    }
    sequenceElectronicChecklist() {
        let eclNextPage = "";
        if (SimVar.GetSimVarValue("L:SALTY_ECL_PREFLIGHT_COMPLETE", "bool") == 0){
            eclNextPage = "preflight-checklist";
        } else if (SimVar.GetSimVarValue("L:SALTY_ECL_BEFORE_START_COMPLETE", "bool") == 0){
            eclNextPage = "before-start-checklist";
        } else if (SimVar.GetSimVarValue("L:SALTY_ECL_BEFORE_TAXI_COMPLETE", "bool") == 0){
            eclNextPage = "before-taxi-checklist";
        } else if (SimVar.GetSimVarValue("L:SALTY_ECL_BEFORE_TAKEOFF_COMPLETE", "bool") == 0){
            eclNextPage = "before-takeoff-checklist";
        } else if (SimVar.GetSimVarValue("L:SALTY_ECL_AFTER_TAKEOFF_COMPLETE", "bool") == 0){
            eclNextPage = "after-takeoff-checklist";
        } else if (SimVar.GetSimVarValue("L:SALTY_ECL_DESCENT_COMPLETE", "bool") == 0){
            eclNextPage = "descent-checklist";
        } else if (SimVar.GetSimVarValue("L:SALTY_ECL_APPROACH_COMPLETE", "bool") == 0){
            eclNextPage = "approach-checklist";
        } else if (SimVar.GetSimVarValue("L:SALTY_ECL_LANDING_COMPLETE", "bool") == 0){
            eclNextPage = "landing-checklist";
        } else if (SimVar.GetSimVarValue("L:SALTY_ECL_SHUTDOWN_COMPLETE", "bool") == 0){
            eclNextPage = "shutdown-checklist";
        } else if (SimVar.GetSimVarValue("L:SALTY_ECL_SECURE_COMPLETE", "bool") == 0){
            eclNextPage = "secure-checklist";
        } else {
            this.resetECLSequence();
        }
    return eclNextPage;
    }
    resetECLSequence() {
        SimVar.SetSimVarValue("L:SALTY_ECL_PREFLIGHT_COMPLETE", "bool", 0);
        SimVar.SetSimVarValue("L:SALTY_ECL_BEFORE_START_COMPLETE", "bool", 0);
        SimVar.SetSimVarValue("L:SALTY_ECL_BEFORE_TAXI_COMPLETE", "bool", 0);
        SimVar.SetSimVarValue("L:SALTY_ECL_BEFORE_TAKEOFF_COMPLETE", "bool", 0);
        SimVar.SetSimVarValue("L:SALTY_ECL_AFTER_TAKEOFF_COMPLETE", "bool", 0);
        SimVar.SetSimVarValue("L:SALTY_ECL_DESCENT_COMPLETE", "bool", 0);
        SimVar.SetSimVarValue("L:SALTY_ECL_APPROACH_COMPLETE", "bool", 0);
        SimVar.SetSimVarValue("L:SALTY_ECL_LANDING_COMPLETE", "bool", 0);
        SimVar.SetSimVarValue("L:SALTY_ECL_SHUTDOWN_COMPLETE", "bool", 0);
        SimVar.SetSimVarValue("L:SALTY_ECL_SECURE_COMPLETE", "bool", 0);
        return;
    }
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
        this.updateAnnunciations();
    }
    updateAnnunciations() {
        let infoPanelManager = this.upperTopScreen.getInfoPanelManager();
        if (infoPanelManager) {
            infoPanelManager.clearScreen(Airliners.EICAS_INFO_PANEL_ID.PRIMARY);
            if (this.warnings) {
                let text = this.warnings.getCurrentWarningText();
                if (text && text != "") {
                    let level = this.warnings.getCurrentWarningLevel();
                    switch (level) {
                        case 0:
                            infoPanelManager.addMessage(Airliners.EICAS_INFO_PANEL_ID.PRIMARY, text, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.INDICATION);
                            break;
                        case 1:
                            infoPanelManager.addMessage(Airliners.EICAS_INFO_PANEL_ID.PRIMARY, text, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.CAUTION);
                            break;
                        case 2:
                            infoPanelManager.addMessage(Airliners.EICAS_INFO_PANEL_ID.PRIMARY, text, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.WARNING);
                            break;
                    }
                }
            }
            if (this.annunciations) {
                for (let i = this.annunciations.displayWarning.length - 1; i >= 0; i--) {
                    if (!this.annunciations.displayWarning[i].Acknowledged)
                        infoPanelManager.addMessage(
                            Airliners.EICAS_INFO_PANEL_ID.PRIMARY,
                            this.annunciations.displayWarning[i].Text,
                            Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.WARNING
                        );
                }
                for (let i = this.annunciations.displayCaution.length - 1; i >= 0; i--) {
                    if (!this.annunciations.displayCaution[i].Acknowledged)
                        infoPanelManager.addMessage(
                            Airliners.EICAS_INFO_PANEL_ID.PRIMARY,
                            this.annunciations.displayCaution[i].Text,
                            Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.CAUTION
                        );
                }
                for (let i = this.annunciations.displayAdvisory.length - 1; i >= 0; i--) {
                    if (!this.annunciations.displayAdvisory[i].Acknowledged)
                        infoPanelManager.addMessage(
                            Airliners.EICAS_INFO_PANEL_ID.PRIMARY,
                            this.annunciations.displayAdvisory[i].Text,
                            Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.INDICATION
                        );
                }
            }
        }
    }
}
registerInstrument("b747-8-eicas-element", B747_8_EICAS);
//# sourceMappingURL=B747_8_EICAS.js.map
