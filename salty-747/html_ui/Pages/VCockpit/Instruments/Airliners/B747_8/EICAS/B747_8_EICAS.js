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
        super.onEvent(_event);
        if (this.currentPage !== _event) {
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
                if (text && text != "") {
                    let level = this.warnings.getCurrentWarningLevel();
                    switch (level) {
                        case 1:
                            infoPanelManager.addMessage(Airliners.EICAS_INFO_PANEL_ID.PRIMARY, text, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.INDICATION);
                        break;
                        case 2:
                            infoPanelManager.addMessage(Airliners.EICAS_INFO_PANEL_ID.PRIMARY, text, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.CAUTION);
                        break;
                        case 3:
                            infoPanelManager.addMessage(Airliners.EICAS_INFO_PANEL_ID.PRIMARY, text, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.WARNING);
                        break;
                    }
                }
            }
            if (this.annunciations) {
                for (let i = this.annunciations.displayWarning.length - 1; i >= 0; i--) {
                    if (!this.annunciations.displayWarning[i].Acknowledged)
                        infoPanelManager.addMessage(Airliners.EICAS_INFO_PANEL_ID.PRIMARY, this.annunciations.displayWarning[i].Text, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.WARNING);
                }
                for (let i = this.annunciations.displayCaution.length - 1; i >= 0; i--) {
                    if (!this.annunciations.displayCaution[i].Acknowledged)
                        infoPanelManager.addMessage(Airliners.EICAS_INFO_PANEL_ID.PRIMARY, this.annunciations.displayCaution[i].Text, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.CAUTION);
                }
                for (let i = this.annunciations.displayAdvisory.length - 1; i >= 0; i--) {
                    if (!this.annunciations.displayAdvisory[i].Acknowledged) 
                        infoPanelManager.addMessage(Airliners.EICAS_INFO_PANEL_ID.PRIMARY, this.annunciations.displayAdvisory[i].Text, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.INDICATION);
                }
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
        let density = SimVar.GetSimVarValue("AMBIENT DENSITY", "kilogram per cubic meter");
        let N2 = 214 * Math.pow(density, 6) - 1051.8 * Math.pow(density, 5) + 2087.1 * Math.pow(density, 4) - 2129.8 * Math.pow(density, 3) + 1167.7 * Math.pow(density, 2) - 315.83 * density + 87.453;
        return N2;
    }
    getN2Value(_engineId) {
        return SimVar.GetSimVarValue("ENG N2 RPM:" + _engineId, "percent");
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
                        if (N2Value >= this.getN2IdleValue()) {
                            this.changeState(i, B747_8_EngineState.RUNNING);
                        }
                        else if (N2Value >= 0.05) {
                            this.changeState(i, B747_8_EngineState.AUTOSTART);
                        }
                    }
                break;
                case B747_8_EngineState.AUTOSTART:
                    if (this.getFuelValveOpen(i + 1)) {
                        if (N2Value >= this.getN2IdleValue()) {
                            this.changeState(i, B747_8_EngineState.RUNNING);
                        }
                    }
                    else {
                        this.changeState(i, B747_8_EngineState.DECELERATE);
                    }
                break;
                case B747_8_EngineState.RUNNING:
                    if (N2Value >= this.getN2IdleValue()) {
                        if (this.engines[i].timeInState > 30) {
                            this.changeState(i, B747_8_EngineState.READY);
                        }
                        else {
                            this.changeState(i, B747_8_EngineState.DECELERATE);
                        }
                    }
                break;
                case B747_8_EngineState.READY:
                    if (N2Value < this.getN2IdleValue()) {
                        this.changeState(i, B747_8_EngineState.AUTORELIGHT);
                    }
                break;
                case B747_8_EngineState.DECELERATE:
                    if (N2Value < this.getN2IdleValue() && this.getFuelValveOpen()) {
                        this.changeState(i, B747_8_EngineState.AUTORELIGHT);
                    }
                    else if (N2Value < 0.05) {
                        this.changeState(i, B747_8_EngineState.IDLE);
                    }
                    else if (N2Value >= this.getN2IdleValue()) {
                        this.changeState(i, B747_8_EngineState.RUNNING);
                    }
                break;
                case B747_8_EngineState.AUTORELIGHT:
                    if (N2Value >= this.getN2IdleValue()) {
                        this.changeState(i, B747_8_EngineState.RUNNING);
                    }
                    else if (N2Value < 0.05) {
                        this.changeState(i, B747_8_EngineState.IDLE);
                    }
                    else if (!this.getFuelValveOpen()) {
                        this.changeState(i, B747_8_EngineState.DECELERATE);
                    }
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
    B747_8_EngineState[B747_8_EngineState["AUTORELIGHT"] = 5] = "AUTORELIGHT";
})(B747_8_EngineState || (B747_8_EngineState = {}));
class B747_8_Engine {
    constructor() {
        this.currentState = B747_8_EngineState.IDLE;
        this.timeInState = 0;
    }
}
registerInstrument("b747-8-eicas-element", B747_8_EICAS);
//# sourceMappingURL=B747_8_EICAS.js.map
