var B747_8_RadioManagement;
(function (B747_8_RadioManagement) {
    let FREQUENCY_TYPE;
    (function (FREQUENCY_TYPE) {
        FREQUENCY_TYPE[FREQUENCY_TYPE["NONE"] = -1] = "NONE";
        FREQUENCY_TYPE[FREQUENCY_TYPE["VHF_L"] = 0] = "VHF_L";
        FREQUENCY_TYPE[FREQUENCY_TYPE["VHF_C"] = 1] = "VHF_C";
        FREQUENCY_TYPE[FREQUENCY_TYPE["VHF_R"] = 2] = "VHF_R";
        FREQUENCY_TYPE[FREQUENCY_TYPE["HF_L"] = 3] = "HF_L";
        FREQUENCY_TYPE[FREQUENCY_TYPE["HF_R"] = 4] = "HF_R";
        FREQUENCY_TYPE[FREQUENCY_TYPE["NB"] = 5] = "NB";
    })(FREQUENCY_TYPE = B747_8_RadioManagement.FREQUENCY_TYPE || (B747_8_RadioManagement.FREQUENCY_TYPE = {}));
    class FrequencyHandler {
        constructor(_index, _frequencyDisplayName, _radioNav) {
            this.index = 0;
            this.frequencyDisplayName = "";
            this.active = 0;
            this.stby = 0;
            this.editModeActive = false;
            this.editedValueString = "";
            this.getActiveSimVar = null;
            this.setActiveSimVar = null;
            this.getStbySimVar = null;
            this.setStbySimVar = null;
            this.index = _index;
            this.frequencyDisplayName = _frequencyDisplayName;
            this.radioNav = _radioNav;
        }
        linkActiveToSimVars(_get, _set) {
            this.getActiveSimVar = _get.bind(this.radioNav);
            this.setActiveSimVar = _set.bind(this.radioNav);
        }
        linkStbyToSimVars(_get, _set) {
            this.getStbySimVar = _get.bind(this.radioNav);
            this.setStbySimVar = _set.bind(this.radioNav);
        }
        show(_frequencyText, _activeText, _stbyText) {
            if (this.getActiveSimVar != null) {
                this.active = this.getActiveSimVar(this.index);
            }
            this.active = Utils.Clamp(this.active, this.min, this.max);
            if (this.getStbySimVar != null) {
                this.stby = this.getStbySimVar(this.index);
            }
            this.stby = Utils.Clamp(this.stby, this.min, this.max);
            if (_frequencyText != null) {
                diffAndSetText(_frequencyText, this.frequencyDisplayName);
            }
            if (_activeText != null) {
                diffAndSetText(_activeText, fastToFixed(this.active, this.displayDP));
            }
            if (_stbyText != null) {
                diffAndSetText(_stbyText, fastToFixed(this.stby, this.displayDP));
            }
        }
        transfer(_activeText, _stbyText) {
            if (this.editModeActive) {
                this.editModeActive = false;
                var editedValue = parseFloat(this.editedValueString);
                if (isNaN(editedValue) || (editedValue < this.min) || (editedValue > this.max) || (this.use833Hz && !RadioNav.isHz833Compliant(editedValue))) {
                    if (_stbyText != null) {
                        diffAndSetText(_stbyText, "ERR");
                    }
                    return;
                }
                else {
                    this.stby = editedValue;
                }
            }
            var temp = this.active;
            this.active = this.stby;
            this.stby = temp;
            this.setActiveValueSimVar();
            this.setStbyValueSimVar();
            if (_activeText != null) {
                diffAndSetText(_activeText, fastToFixed(this.active, this.displayDP));
            }
            if (_stbyText != null) {
                diffAndSetText(_stbyText, fastToFixed(this.stby, this.displayDP));
            }
        }
        makeEdit(_value, _stbyText) {
            if (!this.editModeActive) {
                if (_value < 0) {
                    this.editedValueString = fastToFixed(this.stby, this.displayDP).padStart(this.defaultEditValueString.length, "0");
                }
                else {
                    this.editedValueString = this.defaultEditValueString;
                }
                this.editModeActive = true;
            }
            var firstEmpty = this.editedValueString.indexOf("_");
            if (_value < 0) {
                if (firstEmpty > 0) {
                    if (this.editedValueString[firstEmpty - 1] == ".") {
                        this.setEditValueDigit(firstEmpty - 2, "_");
                    }
                    else {
                        this.setEditValueDigit(firstEmpty - 1, "_");
                    }
                }
                else if (firstEmpty < 0) {
                    this.setEditValueDigit(this.editedValueString.length - 1, "_");
                }
            }
            else {
                if (firstEmpty >= 0) {
                    this.setEditValueDigit(firstEmpty, _value + '');
                }
            }
            if (_stbyText != null) {
                diffAndSetText(_stbyText, this.editedValueString);
            }
        }
        setEditValueDigit(_digit, _value) {
            this.editedValueString = this.editedValueString.substr(0, _digit) + _value + this.editedValueString.substr(_digit + _value.length);
        }
        cancelEdit(_stbyText) {
            if (this.editModeActive) {
                if (_stbyText != null) {
                    diffAndSetText(_stbyText, fastToFixed(this.stby, this.displayDP));
                }
                this.editModeActive = false;
            }
        }
        setActiveValueSimVar() {
            if (this.setActiveSimVar != null) {
                this.setActiveSimVar(this.index, this.active);
            }
        }
        setStbyValueSimVar() {
            if (this.setStbySimVar != null) {
                this.setStbySimVar(this.index, this.stby);
            }
        }
        isDifferentFromSimVarValues() {
            if (this.getActiveSimVar != null) {
                if (this.active != this.getActiveSimVar(this.index)) {
                    return true;
                }
            }
            if (this.getStbySimVar != null) {
                if (this.stby != this.getStbySimVar(this.index)) {
                    return true;
                }
            }
            return false;
        }
        get displayDP() { return 3; }
    }
    B747_8_RadioManagement.FrequencyHandler = FrequencyHandler;
    class VHFFrequencyHandler extends FrequencyHandler {
        get min() { return 118; }
        get max() { return 136.975; }
        get defaultEditValueString() { return "___.___"; }
        get use833Hz() { return true; }
    }
    B747_8_RadioManagement.VHFFrequencyHandler = VHFFrequencyHandler;
    class HFFrequencyHandler extends FrequencyHandler {
        get min() { return 2.8; }
        get max() { return 28; }
        get defaultEditValueString() { return "__.___"; }
        get use833Hz() { return false; }
    }
    B747_8_RadioManagement.HFFrequencyHandler = HFFrequencyHandler;
})(B747_8_RadioManagement || (B747_8_RadioManagement = {}));
class B747_8_Com extends BaseAirliners {
    constructor() {
        super();
        this.frequencyText = null;
        this.statusText = null;
        this.activeText = null;
        this.standbyText = null;
        this.frequencyHandlers = new Array(B747_8_RadioManagement.FREQUENCY_TYPE.NB);
        this.currentFrequencyVarName = "";
        this.currentFrequencyHandler = null;
    }
    get templateID() { return "B747_8_Com"; }
    connectedCallback() {
        super.connectedCallback();
        this.frequencyText = this.querySelector("#Frequency");
        this.statusText = this.querySelector("#Status");
        this.activeText = this.querySelector("#Active");
        this.standbyText = this.querySelector("#Standby");
        this.frequencyHandlers[B747_8_RadioManagement.FREQUENCY_TYPE.VHF_L] = new B747_8_RadioManagement.VHFFrequencyHandler(this.instrumentIndex, "VHFL", this.radioNav);
        this.frequencyHandlers[B747_8_RadioManagement.FREQUENCY_TYPE.VHF_L].linkActiveToSimVars(this.radioNav.getVHF1ActiveFrequency, this.radioNav.setVHF1ActiveFrequency);
        this.frequencyHandlers[B747_8_RadioManagement.FREQUENCY_TYPE.VHF_L].linkStbyToSimVars(this.radioNav.getVHF1StandbyFrequency, this.radioNav.setVHF1StandbyFrequency);
        this.frequencyHandlers[B747_8_RadioManagement.FREQUENCY_TYPE.VHF_C] = new B747_8_RadioManagement.VHFFrequencyHandler(this.instrumentIndex, "VHFC", this.radioNav);
        this.frequencyHandlers[B747_8_RadioManagement.FREQUENCY_TYPE.VHF_C].linkActiveToSimVars(this.radioNav.getVHF2ActiveFrequency, this.radioNav.setVHF2ActiveFrequency);
        this.frequencyHandlers[B747_8_RadioManagement.FREQUENCY_TYPE.VHF_C].linkStbyToSimVars(this.radioNav.getVHF2StandbyFrequency, this.radioNav.setVHF2StandbyFrequency);
        this.frequencyHandlers[B747_8_RadioManagement.FREQUENCY_TYPE.VHF_R] = new B747_8_RadioManagement.VHFFrequencyHandler(this.instrumentIndex, "VHFR", this.radioNav);
        this.frequencyHandlers[B747_8_RadioManagement.FREQUENCY_TYPE.VHF_R].linkActiveToSimVars(this.radioNav.getVHF3ActiveFrequency, this.radioNav.setVHF3ActiveFrequency);
        this.frequencyHandlers[B747_8_RadioManagement.FREQUENCY_TYPE.VHF_R].linkStbyToSimVars(this.radioNav.getVHF3StandbyFrequency, this.radioNav.setVHF3StandbyFrequency);
        this.frequencyHandlers[B747_8_RadioManagement.FREQUENCY_TYPE.HF_L] = new B747_8_RadioManagement.HFFrequencyHandler(this.instrumentIndex, "HFL", this.radioNav);
        this.frequencyHandlers[B747_8_RadioManagement.FREQUENCY_TYPE.HF_R] = new B747_8_RadioManagement.HFFrequencyHandler(this.instrumentIndex, "HFR", this.radioNav);
        this.currentFrequencyVarName = "L:XMLVAR_COM" + this.instrumentIndex + "_CURRENT_FREQ";
        this.currentFrequencyHandler = this.getCurrentFrequencyHandler();
        if (this.currentFrequencyHandler != null) {
            this.currentFrequencyHandler.show(this.frequencyText, this.activeText, this.standbyText);
        }
    }
    getCurrentFrequencyHandler() {
        var freq = SimVar.GetSimVarValue(this.currentFrequencyVarName, "number");
        if ((freq > B747_8_RadioManagement.FREQUENCY_TYPE.NONE) && (freq < B747_8_RadioManagement.FREQUENCY_TYPE.NB)) {
            return this.frequencyHandlers[freq];
        }
        return null;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
        if (this.currentFrequencyHandler != null) {
            if (this.currentFrequencyHandler.isDifferentFromSimVarValues()) {
                this.currentFrequencyHandler.cancelEdit(null);
                this.currentFrequencyHandler.show(null, this.activeText, this.standbyText);
            }
        }
    }
    onEvent(_event) {
        var btnRef = _event.replace("BTN_", "");
        var btnNum = parseInt(btnRef);
        if (isNaN(btnNum)) {
            if ((btnRef == "vhf") || (btnRef == "hf")) {
                this.currentFrequencyHandler = this.getCurrentFrequencyHandler();
                if (this.currentFrequencyHandler != null) {
                    this.currentFrequencyHandler.show(this.frequencyText, this.activeText, this.standbyText);
                }
            }
            else if (btnRef == "clr") {
                if (this.currentFrequencyHandler != null) {
                    this.currentFrequencyHandler.makeEdit(-1, this.standbyText);
                }
            }
            else if (btnRef == "rcl") {
                if (this.currentFrequencyHandler != null) {
                    this.currentFrequencyHandler.cancelEdit(this.standbyText);
                }
            }
            else if (btnRef == "swap") {
                if (this.currentFrequencyHandler != null) {
                    this.currentFrequencyHandler.transfer(this.activeText, this.standbyText);
                }
            }
        }
        else if ((btnNum >= 0) && (btnNum <= 9)) {
            if (this.currentFrequencyHandler != null) {
                this.currentFrequencyHandler.makeEdit(btnNum, this.standbyText);
            }
        }
    }
}
registerInstrument("b747-8-com-element", B747_8_Com);
//# sourceMappingURL=B747_8_Com.js.map