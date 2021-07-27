class EICASCommonDisplay extends Airliners.EICASTemplateElement {
    constructor() {
        super();
        this.isInitialised = false;
    }
    get templateID() { return "EICASCommonDisplayTemplate"; }
    connectedCallback() {
        super.connectedCallback();
    }
    init(_eicas) {
        this.eicas = _eicas;
        this.tatText = this.querySelector("#TATValue");
        this.satText = this.querySelector("#SATValue");
        this.currentSeconds = 0;
        this.currentMinutes = 0;
        this.hoursText = this.querySelector("#HoursValue");
        this.minutesText = this.querySelector("#MinutesValue");
        this.gwUnit = this.querySelector("#GWUnit");
        this.gwValue = this.querySelector("#GWValue");
        this.refreshTAT(0, true);
        this.refreshSAT(0, true);
        this.refreshClock();
        this.refreshGrossWeight(true);
        this.isInitialised = true;
    }
    update(_deltaTime) {
        if (!this.isInitialised) {
            return;
        }
        this.refreshTAT(Math.round(Simplane.getTotalAirTemperature()));
        this.refreshSAT(Math.round(Simplane.getAmbientTemperature()));
        this.refreshClock();
        this.refreshGrossWeight();
    }
    refreshTAT(_value, _force = false) {
        if ((_value != this.currentTAT) || _force) {
            this.currentTAT = _value;
            if (this.tatText != null) {
                if (this.currentTAT > 0) {
                    diffAndSetText(this.tatText, "+" + this.currentTAT + '');
                }
                else {
                    diffAndSetText(this.tatText, this.currentTAT + '');
                }
            }
        }
    }
    refreshSAT(_value, _force = false) {
        if ((_value != this.currentSAT) || _force) {
            this.currentSAT = _value;
            if (this.satText != null) {
                if (this.currentSAT > 0) {
                    diffAndSetText(this.satText, "+" + this.currentSAT + '');
                }
                else {
                    diffAndSetText(this.satText, this.currentSAT + '');
                }
            }
        }
    }
    refreshClock() {
        var seconds = Math.floor(SimVar.GetGlobalVarValue("ZULU TIME", "seconds"));
        if (seconds != this.currentSeconds) {
            this.currentSeconds = seconds;
            var hours = Math.floor(seconds / 3600);
            var minutes = Math.floor((seconds - (hours * 3600)) / 60);
            if (minutes != this.currentMinutes) {
                this.currentMinutes = minutes;
                if (this.hoursText != null) {
                    diffAndSetText(this.hoursText, (hours + '').padStart(2, "0"));
                }
                if (this.minutesText != null) {
                    diffAndSetText(this.minutesText, (minutes + '').padStart(2, "0"));
                }
            }
        }
    }
    refreshGrossWeight(_force = false) {
        let gw = 0;
        let isInMetric = BaseAirliners.unitIsMetric(Aircraft.A320_NEO);
        if (isInMetric) {
            gw = Math.round(SimVar.GetSimVarValue("TOTAL WEIGHT", "kg"));
            if (this.gwUnit)
                diffAndSetText(this.gwUnit, "KG");
        }
        else {
            gw = Math.round(SimVar.GetSimVarValue("TOTAL WEIGHT", "lbs"));
            if (this.gwUnit)
                diffAndSetText(this.gwUnit, "LBS");
        }
        if ((gw != this.currentGW) || _force) {
            this.currentGW = gw;
            if (this.gwValue != null) {
                diffAndSetText(this.gwValue, this.currentGW + '');
            }
        }
    }
}
customElements.define("eicas-common-display", EICASCommonDisplay);
//# sourceMappingURL=EICAS_Common.js.map