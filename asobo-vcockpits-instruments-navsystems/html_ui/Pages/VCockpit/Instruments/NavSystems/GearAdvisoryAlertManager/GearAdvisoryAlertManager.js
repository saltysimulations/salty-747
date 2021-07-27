class GearAdvisoryAlertManager extends NavSystem {
    get templateID() { return "GearAdvisoryAlertManager"; }
    get IsGlassCockpit() { return false; }
    get manageFlightPlan() { return false; }
    Init() {
        super.Init();
        this.warnings = new GearAdvisoryWarnings();
        this.addIndependentElementContainer(new NavSystemElementContainer("Warnings", "Warnings", this.warnings));
    }
}
class GearAdvisoryWarnings extends Cabin_Warnings {
    constructor() {
        super(...arguments);
        this.activeWarning = null;
    }
    init(root) {
        super.init(root);
        this.alwaysUpdate = true;
        SimVar.SetSimVarValue("L:Generic_Gear_Advisory_Active", "number", 0);
        SimVar.SetSimVarValue("L:Generic_Gear_Advisory_Pushed", "number", 0);
    }
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
        let warning = this.getCurrentWarning();
        if (warning != this.activeWarning) {
            if (warning) {
                if (warning.soundEvent == "aural_landing_gear_up" || warning.soundEvent == "aural_landing_gear_down") {
                    this.activeWarning = warning;
                    SimVar.SetSimVarValue("L:Generic_Gear_Advisory_Pushed", "number", 0);
                    SimVar.SetSimVarValue("L:Generic_Gear_Advisory_Active", "number", 1);
                }
            }
            else {
                if (this.activeWarning && !this.activeWarning.callback()) {
                    this.activeWarning = null;
                    SimVar.SetSimVarValue("L:Generic_Gear_Advisory_Active", "number", 0);
                }
            }
        }
    }
    onEvent(_event) {
        super.onEvent(_event);
        switch (_event) {
            case "Gear_Advisory_Push":
                SimVar.SetSimVarValue("L:Generic_Gear_Advisory_Pushed", "number", 1);
                SimVar.SetSimVarValue("L:Generic_Gear_Advisory_Active", "number", 0);
                break;
        }
    }
}
registerInstrument("gear-advisory-alert-manager", GearAdvisoryAlertManager);
//# sourceMappingURL=GearAdvisoryAlertManager.js.map