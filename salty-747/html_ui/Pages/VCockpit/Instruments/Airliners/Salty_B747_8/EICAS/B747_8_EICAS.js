class B747_8_EICAS extends Airliners.BaseEICAS {
    constructor() {
        super(...arguments);
        this.engines = new Array();
    }

    Init() {
        super.Init();
        for (let i = 0; i < Simplane.getEngineCount(); i++) {
            this.engines.push(new B747_8_Engine());
        }
        this.currentPage = "B747_8_EICAS_fuel";
    }

    reboot() {
        super.reboot();
        if (this.warnings)
            this.warnings.reset();
        if (this.annunciations)
            this.annunciations.reset();
    }

    onEvent(_event) {
        var prefix = this.getLowerScreenChangeEventNamePrefix();
        super.onEvent(_event);
        if (this.currentPage !== _event) {
            this.currentPage = _event;
        } 
        else if (_event.substring(0,18) == prefix) {
            this.changePage("BLANK");
            SimVar.SetSimVarValue("L:XMLVAR_EICAS_CURRENT_PAGE", "Enum", -1);
            this.currentPage = "blank";
            return;
        }

        // if the event contains "EICAS_CHANGE_PAGE_{x}", the EICAS will display the page indicated by {x}; e.g. EICAS_CHANGE_PAGE_FUEL shows the fuel page
        if (_event.indexOf(prefix) >= 0) {
            var pageName = _event.replace(prefix, "");
            this.changePage(pageName);
        }
        else {
            // else the event is not a CHANGE_PAGE event, and therefore needs to be passed to the lower screen event handlers
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
        this.createLowerScreenPage("CHKL", "BottomScreen", "b747-8-lower-eicas-ecl");
        this.createLowerScreenPage("INFO", "BottomScreen", "b747-8-lower-eicas-info");
        this.createLowerScreenPage("BLANK", "BottomScreen", "b747-8-lower-eicas-blank"); // To blank the bottom eicas when selecting same page again
    }

    getLowerScreenChangeEventNamePrefix() {
        return "EICAS_CHANGE_PAGE_";
    }

    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
        this.updateAnnunciations();
        this.updateEngines(_deltaTime);
    }

    updateAnnunciations() {
        let infoPanelManager = this.upperTopScreen.getInfoPanelManager();
        if (infoPanelManager) {
            infoPanelManager.clearScreen(Airliners.EICAS_INFO_PANEL_ID.PRIMARY);

            if (this.warnings) {
                let text = this.warnings.getCurrentWarningText();
                if (text) {
                    let level = this.warnings.getCurrentWarningLevel();
                    switch (level) {
                        case 1:
                            infoPanelManager.addMessage(Airliners.EICAS_INFO_PANEL_ID.PRIMARY, text, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.MEMO);
                            break;
                        case 2:
                            infoPanelManager.addMessage(Airliners.EICAS_INFO_PANEL_ID.PRIMARY, text, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.ADVISORY);
                            break;
                        case 3:
                            infoPanelManager.addMessage(Airliners.EICAS_INFO_PANEL_ID.PRIMARY, text, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.CAUTION);
                            break;
                        case 4:
                            infoPanelManager.addMessage(Airliners.EICAS_INFO_PANEL_ID.PRIMARY, text, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.WARNING);
                            break;
                    }
                }
            }

            if (this.annunciations) {
                // arrow function declared to DRY this section
                let displayListAnnunc = (_annuncList, _infoMsgStyle) => {
                    for (let i = _annuncList.length - 1; i >= 0; i--) {
                        if (!_annuncList[i].Acknowledged)
                            infoPanelManager.addMessage(
                                Airliners.EICAS_INFO_PANEL_ID.PRIMARY,
                                _annuncList[i].Text,
                                _infoMsgStyle
                            );
                    }
                };

                // display WARNING, CAUTION, ADVISORY, and MEMO annunciations
                displayListAnnunc(this.annunciations.displayWarning, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.WARNING);
                displayListAnnunc(this.annunciations.displayCaution, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.CAUTION);
                displayListAnnunc(this.annunciations.displayAdvisory, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.ADVISORY);
                displayListAnnunc(this.annunciations.displayMemo, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.MEMO);

            }
        }
    }

    getEngineState(_engineId) {
        let index = _engineId - 1;
        if (index >= 0 && index < this.engines.length) {
            return this.engines[index].currentState;
        }
        return B747_8_EngineState.IDLE;
    }
    
    getN2IdleValue() {
        return 600;
    }
    getN2Value(_engineId) {
        return SimVar.GetSimVarValue("ENG N2 RPM:" + _engineId, "percent") * 10;
    }
    getFuelValveOpen(_engineId) {
        return SimVar.GetSimVarValue("FUELSYSTEM VALVE OPEN:" + (4 + _engineId), "boolean");
    }
    
    updateEngines(_deltaTime) {
        for (var i = 0; i < this.engines.length; i++) {
            let N2Value = this.getN2Value(i + 1);
            switch (this.engines[i].currentState) {
                
                case B747_8_EngineState.IDLE:
                    if (this.getFuelValveOpen(i + 1)) {
                        if (N2Value >= this.getN2IdleValue())
                            this.changeState(i, B747_8_EngineState.RUNNING);
                        else if (N2Value >= 0.05)
                            this.changeState(i, B747_8_EngineState.AUTOSTART);
                    }
                    break;

                case B747_8_EngineState.AUTOSTART:
                    if (!this.getFuelValveOpen(i + 1))
                        this.changeState(i, B747_8_EngineState.DECELERATE);
                    else if (N2Value >= this.getN2IdleValue())
                        this.changeState(i, B747_8_EngineState.RUNNING);
                    break;

                case B747_8_EngineState.RUNNING:
                    if (N2Value < this.getN2IdleValue())
                        this.changeState(i, B747_8_EngineState.DECELERATE);
                    else if (this.engines[i].timeInState > 30)
                        this.changeState(i, B747_8_EngineState.READY);
                    break;

                case B747_8_EngineState.READY:
                    if (N2Value < this.getN2IdleValue())
                        this.changeState(i, B747_8_EngineState.DECELERATE);
                    break;

                case B747_8_EngineState.DECELERATE:
                    if (N2Value < 0.05)
                        this.changeState(i, B747_8_EngineState.IDLE);
                    else if (N2Value >= this.getN2IdleValue())
                        this.changeState(i, B747_8_EngineState.RUNNING);
                    break;
            }
            this.engines[i].timeInState += _deltaTime / 1000;
        }
    }
    changeState(_index, _state) {
        if (this.engines[_index].currentState == _state)
            return;
        this.engines[_index].currentState = _state;
        this.engines[_index].timeInState = 0;
    }
}
var B747_8_EngineState;
(function (B747_8_EngineState) {
    B747_8_EngineState[B747_8_EngineState["IDLE"] = 0] = "IDLE";
    B747_8_EngineState[B747_8_EngineState["AUTOSTART"] = 1] = "AUTOSTART";
    B747_8_EngineState[B747_8_EngineState["RUNNING"] = 2] = "RUNNING";
    B747_8_EngineState[B747_8_EngineState["READY"] = 3] = "READY";
    B747_8_EngineState[B747_8_EngineState["DECELERATE"] = 4] = "DECELERATE";
})(B747_8_EngineState || (B747_8_EngineState = {}));
class B747_8_Engine {
    constructor() {
        this.currentState = B747_8_EngineState.IDLE;
        this.timeInState = 0;
    }
}
registerInstrument("b747-8-eicas-element", B747_8_EICAS);
//# sourceMappingURL=B747_8_EICAS.js.map
