class RadioNav {
    constructor() {
        this.navMode = NavMode.TWO_SLOTS;
        this.navBeacon = new NavBeacon();
    }
    init(_navMode) {
        this.navMode = _navMode;
    }
    get mode() { return this.navMode; }
    setRADIONAVActive(_index, _value) {
        return SimVar.SetSimVarValue("L:RADIONAV ACTIVE:1", "Bool", _value);
    }
    getRADIONAVActive(_index) {
        return SimVar.GetSimVarValue("L:RADIONAV ACTIVE:1", "Bool");
    }
    getRADIONAVSource() {
        return SimVar.GetSimVarValue("L:RADIONAV_SOURCE", "number");
    }
    setRADIONAVSource(_source) {
        return SimVar.SetSimVarValue("L:RADIONAV_SOURCE", "number", _source);
    }
    swapVORFrequencies(_index) {
        return SimVar.SetSimVarValue("K:NAV" + _index + "_RADIO_SWAP", "Bool", 1);
    }
    setVORActiveFrequency(_index, _value) {
        return SimVar.SetSimVarValue("K:NAV" + _index + "_RADIO_SET_HZ", "Hz", _value * 1000000);
    }
    getVORActiveFrequency(_index) {
        return SimVar.GetSimVarValue("NAV ACTIVE FREQUENCY:" + _index, "MHz");
    }
    setVORActiveIdent(_index, _value) {
        return SimVar.SetGameVarValue("RADIO_NAV" + _index + "_ACTIVE_IDENT", "string", _value);
    }
    getVORActiveIdent(_index) {
        return SimVar.GetGameVarValue("RADIO_NAV" + _index + "_ACTIVE_IDENT", "string");
    }
    setVORStandbyFrequency(_index, _value) {
        return SimVar.SetSimVarValue("K:NAV" + _index + "_STBY_SET_HZ", "Hz", _value * 1000000);
    }
    getVORStandbyFrequency(_index) {
        return SimVar.GetSimVarValue("NAV STANDBY FREQUENCY:" + _index, "MHz");
    }
    setVORObs(_index, _value) {
        return SimVar.SetSimVarValue("K:VOR" + _index + "_SET", "degrees", _value);
    }
    getVORObs(_index) {
        let value = SimVar.GetSimVarValue("NAV OBS:" + _index, "degrees");
        if (SimVar.GetSimVarValue("AUTOPILOT BACKCOURSE HOLD", "bool"))
            value += 180;
        return value;
    }
    getVORBeacon(_index) {
        if (this.navMode == NavMode.TWO_SLOTS) {
            let ils = this._getILSBeacon(_index);
            if (ils.id > 0)
                return ils;
        }
        let vor = this._getVORBeacon(_index);
        if (vor.id > 0)
            return vor;
        return this.navBeacon;
    }
    getBestVORBeacon(_useNavSource = UseNavSource.YES_ONLY) {
        let source = this.getRADIONAVSource();
        if (source != NavSource.AUTO && _useNavSource != UseNavSource.NO) {
            this.navBeacon.reset();
            if (source == NavSource.VOR1 || (this.mode == NavMode.TWO_SLOTS && source == NavSource.ILS1))
                this.getVORBeacon(1);
            else if (source == NavSource.VOR2 || (this.mode == NavMode.TWO_SLOTS && source == NavSource.ILS2))
                this.getVORBeacon(2);
            if (_useNavSource == UseNavSource.YES_ONLY || this.navBeacon.id != 0)
                return this.navBeacon;
        }
        let vor1 = this.getVORBeacon(1);
        if (vor1.id != 0)
            return vor1;
        let vor2 = this.getVORBeacon(2);
        if (vor2.id != 0)
            return vor2;
        return this.navBeacon;
    }
    _getVORBeacon(_index) {
        this.navBeacon.reset();
        let hasNav = SimVar.GetSimVarValue("NAV HAS NAV:" + _index, "boolean");
        let hasLocalizer = SimVar.GetSimVarValue("NAV HAS LOCALIZER:" + _index, "Bool");
        if (hasNav && !hasLocalizer) {
            this.navBeacon.id = _index;
            this.navBeacon.freq = SimVar.GetSimVarValue("NAV FREQUENCY:" + _index, "MHz");
            this.navBeacon.course = SimVar.GetSimVarValue("NAV OBS:" + _index, "degree");
            this.navBeacon.radial = SimVar.GetSimVarValue("NAV RADIAL:" + _index, "degree");
            this.navBeacon.name = SimVar.GetSimVarValue("NAV NAME:" + _index, "string");
            this.navBeacon.ident = SimVar.GetSimVarValue("NAV IDENT:" + _index, "string");
            if (SimVar.GetSimVarValue("AUTOPILOT BACKCOURSE HOLD", "bool"))
                this.navBeacon.course += 180;
        }
        return this.navBeacon;
    }
    swapILSFrequencies(_index) {
        let index = (this.navMode == NavMode.FOUR_SLOTS) ? _index + 2 : _index;
        return SimVar.SetSimVarValue("K:NAV" + index + "_RADIO_SWAP", "Bool", 1);
    }
    setILSActiveFrequency(_index, _value) {
        let index = (this.navMode == NavMode.FOUR_SLOTS) ? _index + 2 : _index;
        return SimVar.SetSimVarValue("K:NAV" + index + "_RADIO_SET_HZ", "Hz", _value * 1000000);
    }
    getILSActiveFrequency(_index) {
        let index = (this.navMode == NavMode.FOUR_SLOTS) ? _index + 2 : _index;
        return SimVar.GetSimVarValue("NAV ACTIVE FREQUENCY:" + index, "MHz");
    }
    setILSActiveIdent(_index, _value) {
        let index = (this.navMode == NavMode.FOUR_SLOTS) ? _index + 2 : _index;
        return SimVar.SetGameVarValue("RADIO_NAV" + index + "_ACTIVE_IDENT", "string", _value);
    }
    getILSActiveIdent(_index) {
        let index = (this.navMode == NavMode.FOUR_SLOTS) ? _index + 2 : _index;
        return SimVar.GetGameVarValue("RADIO_NAV" + index + "_ACTIVE_IDENT", "string");
    }
    setILSStandbyFrequency(_index, _value) {
        let index = (this.navMode == NavMode.FOUR_SLOTS) ? _index + 2 : _index;
        return SimVar.SetSimVarValue("K:NAV" + index + "_STBY_SET_HZ", "Hz", _value * 1000000);
    }
    getILSStandbyFrequency(_index) {
        let index = (this.navMode == NavMode.FOUR_SLOTS) ? _index + 2 : _index;
        return SimVar.GetSimVarValue("NAV STANDBY FREQUENCY:" + index, "MHz");
    }
    setILSObs(_index, _value) {
        let index = (this.navMode == NavMode.FOUR_SLOTS) ? _index + 2 : _index;
        return SimVar.SetSimVarValue("K:VOR" + index + "_SET", "degrees", _value);
    }
    getILSObs(_index) {
        let index = (this.navMode == NavMode.FOUR_SLOTS) ? _index + 2 : _index;
        let value = SimVar.GetSimVarValue("NAV OBS:" + index, "degrees");
        if (SimVar.GetSimVarValue("AUTOPILOT BACKCOURSE HOLD", "bool"))
            value += 180;
        return value;
    }
    getILSBeacon(_index) {
        let ils = this._getILSBeacon(_index);
        if (ils.id > 0)
            return ils;
        if (this.navMode == NavMode.TWO_SLOTS) {
            let vor = this._getVORBeacon(_index);
            if (vor.id > 0)
                return vor;
        }
        return this.navBeacon;
    }
    _getILSBeacon(_index) {
        this.navBeacon.reset();
        let index = (this.navMode == NavMode.FOUR_SLOTS) ? _index + 2 : _index;
        let hasLocalizer = SimVar.GetSimVarValue("NAV HAS LOCALIZER:" + index, "Bool");
        if (hasLocalizer) {
            this.navBeacon.id = index;
            this.navBeacon.freq = SimVar.GetSimVarValue("NAV FREQUENCY:" + index, "MHz");
            this.navBeacon.course = SimVar.GetSimVarValue("NAV LOCALIZER:" + index, "degree");
            this.navBeacon.name = SimVar.GetSimVarValue("NAV NAME:" + index, "string");
            this.navBeacon.ident = SimVar.GetSimVarValue("NAV IDENT:" + index, "string");
            this.navBeacon.isILS = true;
        }
        return this.navBeacon;
    }
    getBestILSBeacon(_useNavSource = UseNavSource.YES_ONLY) {
        let source = this.getRADIONAVSource();
        if (source != NavSource.AUTO && _useNavSource != UseNavSource.NO) {
            this.navBeacon.reset();
            if (source == NavSource.ILS1 || (this.mode == NavMode.TWO_SLOTS && source == NavSource.VOR1))
                this.getILSBeacon(1);
            else if (source == NavSource.ILS2 || (this.mode == NavMode.TWO_SLOTS && source == NavSource.VOR2))
                this.getILSBeacon(2);
            if (_useNavSource == UseNavSource.YES_ONLY || this.navBeacon.id != 0)
                return this.navBeacon;
        }
        let ils1 = this.getILSBeacon(1);
        if (ils1.id != 0)
            return ils1;
        let ils2 = this.getILSBeacon(2);
        if (ils2.id != 0)
            return ils2;
        return this.navBeacon;
    }
    getClosestILSBeacon() {
        this.navBeacon.reset();
        let hasCloseLocalizer = SimVar.GetSimVarValue("NAV HAS CLOSE LOCALIZER:1", "Bool");
        if (hasCloseLocalizer) {
            this.navBeacon.id = 1;
            this.navBeacon.freq = SimVar.GetSimVarValue("NAV CLOSE FREQUENCY:1", "MHz");
            this.navBeacon.course = SimVar.GetSimVarValue("NAV CLOSE LOCALIZER:1", "degree");
            this.navBeacon.name = SimVar.GetSimVarValue("NAV CLOSE NAME:1", "string");
            this.navBeacon.ident = SimVar.GetSimVarValue("NAV CLOSE IDENT:1", "string");
        }
        return this.navBeacon;
    }
    tuneClosestILS(_tune) {
        return SimVar.SetSimVarValue("K:NAV1_CLOSE_FREQ_SET", "Bool", _tune);
    }
    getADFActiveFrequency(_index) {
        return SimVar.GetSimVarValue("ADF ACTIVE FREQUENCY:" + _index, "KHz");
    }
    getADFStandbyFrequency(_index) {
        return SimVar.GetSimVarValue("ADF STANDBY FREQUENCY:" + _index, "KHz");
    }
    setADFActiveFrequency(_index, _value) {
        var namePrefix = "K:ADF";
        if (_index > 1)
            namePrefix = namePrefix + _index;
        return SimVar.SetSimVarValue(namePrefix + "_ACTIVE_SET", "Frequency ADF BCD32", Avionics.Utils.make_adf_bcd32(_value * 1000));
    }
    setADFStandbyFrequency(_index, _value) {
        var namePrefix = "K:ADF";
        if (_index > 1)
            namePrefix = namePrefix + _index;
        return SimVar.SetSimVarValue(namePrefix + "_STBY_SET", "Frequency ADF BCD32", Avionics.Utils.make_adf_bcd32(_value * 1000));
    }
    swapADFFrequencies(_index, _vhfIndex) {
        return SimVar.SetSimVarValue("K:ADF" + _index + "_RADIO_SWAP", "Bool", 1);
    }
    getTransponderCode(_index) {
        return SimVar.GetSimVarValue("TRANSPONDER CODE:" + _index, "number");
    }
    setTransponderCode(_index, _value) {
        SimVar.SetSimVarValue("K:XPNDR_SET", "Frequency BCD16", Avionics.Utils.make_xpndr_bcd16(_value));
    }
    swapVHFFrequencies(_userIndex, _vhfIndex) {
        return SimVar.SetSimVarValue("K:COM" + _vhfIndex + "_RADIO_SWAP", "Bool", 1);
    }
    setVHFActiveFrequency(_userIndex, _vhfIndex, _value) {
        var namePrefix = "K:COM";
        if (_vhfIndex > 1)
            namePrefix = namePrefix + _vhfIndex;
        return SimVar.SetSimVarValue(namePrefix + "_RADIO_SET_HZ", "Hz", _value * 1000000);
    }
    getVHFActiveFrequency(_userIndex, _vhfIndex) {
        return SimVar.GetSimVarValue("COM ACTIVE FREQUENCY:" + _vhfIndex, "MHz");
    }
    setVHFStandbyFrequency(_userIndex, _vhfIndex, _value) {
        var namePrefix = "K:COM";
        if (_vhfIndex > 1)
            namePrefix = namePrefix + _vhfIndex;
        return SimVar.SetSimVarValue(namePrefix + "_STBY_RADIO_SET_HZ", "Hz", _value * 1000000);
    }
    getVHFStandbyFrequency(_userIndex, _vhfIndex) {
        return SimVar.GetSimVarValue("COM STANDBY FREQUENCY:" + _vhfIndex, "MHz");
    }
    setVHF1ActiveFrequency(_index, _value) {
        this.setVHFActiveFrequency(_index, 1, _value);
    }
    getVHF1ActiveFrequency(_index) {
        return this.getVHFActiveFrequency(_index, 1);
    }
    setVHF1StandbyFrequency(_index, _value) {
        this.setVHFStandbyFrequency(_index, 1, _value);
    }
    getVHF1StandbyFrequency(_index) {
        return this.getVHFStandbyFrequency(_index, 1);
    }
    setVHF2ActiveFrequency(_index, _value) {
        this.setVHFActiveFrequency(_index, 2, _value);
    }
    getVHF2ActiveFrequency(_index) {
        return this.getVHFActiveFrequency(_index, 2);
    }
    setVHF2StandbyFrequency(_index, _value) {
        this.setVHFStandbyFrequency(_index, 2, _value);
    }
    getVHF2StandbyFrequency(_index) {
        return this.getVHFStandbyFrequency(_index, 2);
    }
    setVHF3ActiveFrequency(_index, _value) {
        this.setVHFActiveFrequency(_index, 3, _value);
    }
    getVHF3ActiveFrequency(_index) {
        return this.getVHFActiveFrequency(_index, 3);
    }
    setVHF3StandbyFrequency(_index, _value) {
        this.setVHFStandbyFrequency(_index, 3, _value);
    }
    getVHF3StandbyFrequency(_index) {
        return this.getVHFStandbyFrequency(_index, 3);
    }
    getRadioDecisionHeight() {
        return SimVar.GetSimVarValue("DECISION HEIGHT", "feet");
    }
    static isHz833Compliant(_MHz) {
        let freq = Math.round(_MHz * 1000) / 1000;
        let mod = Avionics.Utils.fmod(freq * 10, 1);
        mod = Math.floor(mod * 100);
        for (let i = 0; i < RadioNav.Hz833Spacing.length; i++) {
            if (Math.abs(RadioNav.Hz833Spacing[i] - mod) < Number.EPSILON) {
                return true;
            }
        }
        return false;
    }
    static isHz25Compliant(_MHz) {
        let freq = Math.round(_MHz * 1000) / 1000;
        let mod = Avionics.Utils.fmod(freq, 0.025);
        if (mod < 0.001)
            return true;
        return false;
    }
    static isHz50Compliant(_MHz) {
        let freq = Math.round(_MHz * 100) / 100;
        let mod = Avionics.Utils.fmod(freq, 0.05);
        if (mod < 0.001)
            return true;
        return false;
    }
    static isXPDRCompliant(_code) {
        if (_code >= 0 && _code <= 7777) {
            let val = _code;
            while (val > 0) {
                let mod = val % 10;
                if (mod > 7)
                    return false;
                val = Math.floor(val / 10);
            }
            return true;
        }
    }
}
RadioNav.Hz833Spacing = [
    0,
    5, 10, 15,
    25,
    30, 35, 40,
    50,
    55, 60, 65,
    75,
    80, 85, 90
];
var NavMode;
(function (NavMode) {
    NavMode[NavMode["TWO_SLOTS"] = 0] = "TWO_SLOTS";
    NavMode[NavMode["FOUR_SLOTS"] = 1] = "FOUR_SLOTS";
})(NavMode || (NavMode = {}));
var UseNavSource;
(function (UseNavSource) {
    UseNavSource[UseNavSource["NO"] = 0] = "NO";
    UseNavSource[UseNavSource["YES_ONLY"] = 1] = "YES_ONLY";
    UseNavSource[UseNavSource["YES_FALLBACK"] = 2] = "YES_FALLBACK";
})(UseNavSource || (UseNavSource = {}));
var NavSource;
(function (NavSource) {
    NavSource[NavSource["AUTO"] = 0] = "AUTO";
    NavSource[NavSource["GPS"] = 1] = "GPS";
    NavSource[NavSource["VOR1"] = 2] = "VOR1";
    NavSource[NavSource["VOR2"] = 3] = "VOR2";
    NavSource[NavSource["ILS1"] = 4] = "ILS1";
    NavSource[NavSource["ILS2"] = 5] = "ILS2";
})(NavSource || (NavSource = {}));
class NavBeacon {
    constructor() {
        this.id = 0;
        this.freq = 0;
        this.course = 0;
        this.radial = 0;
        this.name = "";
        this.ident = "";
        this.isILS = false;
    }
    reset() {
        this.id = 0;
        this.freq = 0;
        this.course = 0;
        this.radial = 0;
        this.name = "";
        this.ident = "";
        this.isILS = false;
    }
}
//# sourceMappingURL=RadioNav.js.map