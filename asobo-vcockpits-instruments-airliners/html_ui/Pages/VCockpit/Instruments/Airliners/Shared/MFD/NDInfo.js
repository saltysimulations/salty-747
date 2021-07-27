class Jet_MFD_NDInfo extends HTMLElement {
    constructor() {
        super(...arguments);
        this.windStrongEnough = false;
        this._navMode = Jet_NDCompass_Navigation.NAV;
        this._navSource = 0;
        this._showILS = false;
        this._showET = false;
        this._dTime = 0;
        this.forcedNavAid1 = undefined;
        this.forcedNavAid2 = undefined;
        this._chronoValue = 0;
        this._chronoStarted = false;
        this._aircraft = Aircraft.A320_NEO;
    }
    get aircraft() {
        return this._aircraft;
    }
    set aircraft(_val) {
        if (this._aircraft != _val) {
            this._aircraft = _val;
        }
    }
    connectedCallback() {
        this.groundSpeed = this.querySelector("#GS_Value");
        this.trueAirSpeed = this.querySelector("#TAS_Value");
        this.windDirection = this.querySelector("#Wind_Direction");
        this.windStrength = this.querySelector("#Wind_Strength");
        this.windArrow = this.querySelector("#Wind_Arrow");
        this.topTitle = this.querySelector("#Title_Text");
        this.approach = this.querySelector("#Approach");
        this.approachType = this.querySelector("#APP_Type");
        this.approachFreq = this.querySelector("#APP_Freq");
        this.approachCourse = this.querySelector("#APP_Course_Value");
        this.approachInfo = this.querySelector("#APP_Info");
        this.waypoint = this.querySelector("#Waypoint");
        this.waypointName = this.querySelector("#WP_Name");
        this.waypointTrack = this.querySelector("#WP_Track_Value");
        this.waypointDistance = this.querySelector("#WP_Distance_Value");
        this.waypointTime = this.querySelector("#WP_Time");
        this.VORLeft = new VORDMENavAid(this.querySelector("#VORDMENavaid_Left"), 1);
        this.VORRight = new VORDMENavAid(this.querySelector("#VORDMENavaid_Right"), 2);
        this.elapsedTime = this.querySelector("#ElapsedTime");
        this.elapsedTimeValue = this.querySelector("#ET_Value");
        this.setGroundSpeed(0, true);
        this.setTrueAirSpeed(0, true);
        this.setWind(0, 0, 0, true);
        this.setWaypoint("", 0, 0, 0, true);
        this.setMode(this._navMode, this._navSource, true);
    }
    update(_dTime) {
        this._dTime = _dTime;
        this.updateTitle();
        this.updateSpeeds();
        this.updateWaypoint();
        this.updateVOR();
        this.updateApproach();
        this.updateElapsedTime();
    }
    onEvent(_event) {
        if (_event == "Push_ET") {
            if (!this._showET) {
                this._showET = true;
                this._chronoValue = 0;
                this._chronoStarted = true;
            }
            else if (this._chronoStarted) {
                this._chronoStarted = false;
            }
            else {
                this._showET = false;
            }
        }
    }
    showILS(_val) {
        this._showILS = _val;
    }
    setMode(_navMode, _navSource, _force = false) {
        if (this._navMode != _navMode || this._navSource != _navSource || _force) {
            this._navMode = _navMode;
            this._navSource = _navSource;
            if (this._navMode == Jet_NDCompass_Navigation.NAV) {
                if (this.waypoint)
                    diffAndSetStyle(this.waypoint, StyleProperty.display, "block");
                if (this.approach) {
                    diffAndSetText(this.approachType, "");
                    diffAndSetText(this.approachFreq, "");
                    diffAndSetText(this.approachCourse, "");
                    diffAndSetText(this.approachInfo, "");
                    diffAndSetStyle(this.approach, StyleProperty.display, "none");
                }
            }
            else if (this._navMode == Jet_NDCompass_Navigation.ILS || this._navMode == Jet_NDCompass_Navigation.VOR) {
                if (this.waypoint) {
                    diffAndSetText(this.waypointName, "");
                    diffAndSetText(this.waypointTrack, "");
                    diffAndSetText(this.waypointDistance, "");
                    diffAndSetText(this.waypointTime, "");
                    diffAndSetStyle(this.waypoint, StyleProperty.display, "none");
                }
                if (this.approach)
                    diffAndSetStyle(this.approach, StyleProperty.display, "block");
            }
        }
    }
    forceNavAid(_index, _state) {
        if (_index == 1)
            this.forcedNavAid1 = _state;
        else if (_index == 2)
            this.forcedNavAid2 = _state;
    }
    updateSpeeds() {
        this.setGroundSpeed(Math.round(Simplane.getGroundSpeed()));
        this.setTrueAirSpeed(Math.round(Simplane.getTrueSpeed()));
        this.setWind(Math.round(Simplane.getWindDirection()), Math.round(Simplane.getWindStrength()), Simplane.getHeadingMagnetic());
    }
    updateWaypoint() {
        this.setWaypoint(Simplane.getNextWaypointName(), Math.round(Simplane.getNextWaypointTrack()), Simplane.getNextWaypointDistance(), Simplane.getNextWaypointETA());
    }
    setGroundSpeed(_speed, _force = false) {
        if ((_speed != this.currentGroundSpeed) || _force) {
            this.currentGroundSpeed = _speed;
            if (this.groundSpeed != null) {
                diffAndSetText(this.groundSpeed, (this.currentGroundSpeed + '').padStart(3, "0"));
            }
        }
    }
    setTrueAirSpeed(_speed, _force = false) {
        if ((_speed != this.currentTrueAirSpeed) || _force) {
            this.currentTrueAirSpeed = _speed;
            if (this.trueAirSpeed != null) {
                diffAndSetText(this.trueAirSpeed, (this.currentTrueAirSpeed + '').padStart(3, "0"));
            }
        }
    }
    setWind(_windAngle, _windStrength, _planeAngle, _force = false) {
        var refreshWindAngle = ((_windAngle != this.currentWindAngle) || _force);
        var refreshWindStrength = ((_windStrength != this.currentWindStrength) || _force);
        var refreshWindArrow = (refreshWindAngle || refreshWindStrength || (_planeAngle != this.currentPlaneAngle) || _force);
        if (Simplane.getIsGrounded()) {
            this.windStrongEnough = false;
        }
        else if (this.windStrongEnough && this.currentWindStrength < Jet_MFD_NDInfo.MIN_WIND_STRENGTH_FOR_ARROW_DISPLAY) {
            this.windStrongEnough = false;
        }
        else if (!this.windStrongEnough && this.currentWindStrength >= (Jet_MFD_NDInfo.MIN_WIND_STRENGTH_FOR_ARROW_DISPLAY + 2)) {
            this.windStrongEnough = true;
        }
        if (refreshWindAngle) {
            let startAngle = this.currentWindAngle;
            let endAngle = _windAngle;
            let delta = endAngle - startAngle;
            if (delta > 180) {
                startAngle += 360;
            }
            else if (delta < -180) {
                endAngle += 360;
            }
            let smoothedAngle = Utils.SmoothSin(startAngle, endAngle, 0.25, this._dTime / 1000);
            this.currentWindAngle = smoothedAngle % 360;
            if (this.windDirection != null) {
                if (this.windStrongEnough)
                    diffAndSetText(this.windDirection, fastToFixed(this.currentWindAngle, 0).padStart(3, "0"));
                else
                    diffAndSetText(this.windDirection, "---");
            }
        }
        if (refreshWindStrength) {
            this.currentWindStrength = _windStrength;
            if (this.windStrength != null) {
                if (this.windStrongEnough)
                    diffAndSetText(this.windStrength, (this.currentWindStrength + '').padStart(2, "0"));
                else
                    diffAndSetText(this.windStrength, "--");
            }
        }
        if (refreshWindArrow) {
            this.currentPlaneAngle = _planeAngle;
            if (this.windArrow != null) {
                if (this.windStrongEnough) {
                    var arrowAngle = this.currentWindAngle - this.currentPlaneAngle;
                    arrowAngle += 180;
                    var transformStr = this.windArrow.getAttribute("transform");
                    if (transformStr) {
                        var split = transformStr.split("rotate");
                        if (split) {
                            transformStr = split[0].trim();
                        }
                        else {
                            transformStr = "";
                        }
                    }
                    if (transformStr)
                        diffAndSetAttribute(this.windArrow, "transform", transformStr + " rotate(" + arrowAngle + ")");
                    else
                        diffAndSetAttribute(this.windArrow, "transform", "rotate(" + arrowAngle + ")");
                    diffAndSetStyle(this.windArrow, StyleProperty.display, "block");
                }
                else {
                    diffAndSetStyle(this.windArrow, StyleProperty.display, "none");
                }
            }
        }
    }
    setWaypoint(_name, _track, _distance, _eta, _force = false) {
        if (this.waypoint) {
            if (this._navMode == Jet_NDCompass_Navigation.NAV) {
                if (_name && _name != "") {
                    if (this.waypointName != null) {
                        diffAndSetText(this.waypointName, _name);
                    }
                    if ((_track != this.currentWaypointTrack) || _force) {
                        this.currentWaypointTrack = _track;
                        if (this.waypointTrack) {
                            diffAndSetText(this.waypointTrack, (this.currentWaypointTrack + '').padStart(3, "0") + String.fromCharCode(176));
                        }
                    }
                    if ((_distance != this.currentWaypointDistance) || _force) {
                        this.currentWaypointDistance = _distance;
                        if (this.waypointDistance != null) {
                            if (this.currentWaypointDistance < 10000)
                                diffAndSetText(this.waypointDistance, fastToFixed(this.currentWaypointDistance, 1));
                            else
                                diffAndSetText(this.waypointDistance, fastToFixed(this.currentWaypointDistance, 0));
                        }
                    }
                    let groundSpeed = Simplane.getGroundSpeed();
                    if (groundSpeed < 10) {
                        if (this.waypointTime != null) {
                            this.waypointTime.textContent = "--:--";
                        }
                    }
                    else if ((_eta != this.currentWaypointTimeETA) || _force) {
                        this.currentWaypointTimeETA = _eta;
                        let localETA = _eta;
                        let timeZoneOffset = Simplane.getCurrentTimeDeviation();
                        localETA += timeZoneOffset;
                        if (this.waypointTime != null) {
                            var hours = Math.floor(localETA / 3600);
                            var minutes = Math.floor((localETA - (hours * 3600)) / 60);
                            diffAndSetText(this.waypointTime, (hours + '').padStart(2, "0") + ":" + (minutes + '').padStart(2, "0"));
                        }
                    }
                }
                else {
                    if (this.waypointName != null) {
                        diffAndSetText(this.waypointName, "");
                    }
                    if (this.waypointTrack != null) {
                        diffAndSetText(this.waypointTrack, "---°");
                    }
                    if (this.waypointDistance != null) {
                        diffAndSetText(this.waypointDistance, "-.-");
                    }
                    if (this.waypointTime != null) {
                        diffAndSetText(this.waypointTime, "--:--");
                    }
                }
            }
        }
    }
    updateTitle() {
        if (this.topTitle != null) {
            switch (this._navMode) {
                case Jet_NDCompass_Navigation.NAV:
                    {
                        let ilsText = null;
                        if (this._showILS) {
                            let localizer = this.gps.radioNav.getBestILSBeacon();
                            if (localizer && localizer.id > 0) {
                                ilsText = localizer.name;
                            }
                        }
                        if (ilsText) {
                            diffAndSetText(this.topTitle, ilsText);
                            diffAndSetAttribute(this.topTitle, "state", "ils");
                        }
                        else {
                            diffAndSetText(this.topTitle, "");
                            this.topTitle.removeAttribute("state");
                        }
                        break;
                    }
                case Jet_NDCompass_Navigation.VOR:
                    {
                        diffAndSetText(this.topTitle, "VOR");
                        if (Simplane.getAutoPilotAPPRHold()) {
                            this.topTitle.textContent += " APP";
                        }
                        this.topTitle.removeAttribute("state");
                        break;
                    }
                case Jet_NDCompass_Navigation.ILS:
                    {
                        diffAndSetText(this.topTitle, "ILS");
                        if (Simplane.getAutoPilotAPPRHold()) {
                            this.topTitle.textContent += " APP";
                        }
                        this.topTitle.removeAttribute("state");
                        break;
                    }
                default:
                    {
                        diffAndSetText(this.topTitle, "");
                        break;
                    }
            }
        }
    }
    updateVOR() {
        if (this.VORLeft != null) {
            this.VORLeft.update(this.gps, this.aircraft, this.forcedNavAid1);
        }
        if (this.VORRight != null) {
            this.VORRight.update(this.gps, this.aircraft, this.forcedNavAid2);
        }
    }
    updateApproach() {
        if (this.approach != null) {
            switch (this._navMode) {
                case Jet_NDCompass_Navigation.VOR:
                    {
                        let vor;
                        if (this._navSource == 0)
                            vor = this.gps.radioNav.getBestVORBeacon();
                        else
                            vor = this.gps.radioNav.getVORBeacon(this._navSource);
                        let suffix = "";
                        if (vor.id == 1 || this._navSource == 1) {
                            if (this.aircraft == Aircraft.A320_NEO || this.aircraft == Aircraft.CJ4)
                                suffix = "1";
                            else
                                suffix = " L";
                        }
                        else if (vor.id == 2 || this._navSource == 2) {
                            if (this.aircraft == Aircraft.A320_NEO || this.aircraft == Aircraft.CJ4)
                                suffix = "2";
                            else
                                suffix = " R";
                        }
                        let type = "VOR";
                        let freq = "--.--";
                        let course = "---°";
                        let ident = "";
                        if (vor.id > 0) {
                            freq = fastToFixed(vor.freq, 2);
                            course = Utils.leadingZeros(Math.round(vor.course % 360), 3) + "°";
                            ident = vor.ident;
                            if (this.aircraft == Aircraft.CJ4) {
                                let hasLocalizer = SimVar.GetSimVarValue("NAV HAS LOCALIZER:" + vor.id, "Bool");
                                if (hasLocalizer)
                                    type = "LOC";
                            }
                        }
                        diffAndSetText(this.approachType, type + suffix);
                        diffAndSetText(this.approachFreq, freq);
                        diffAndSetText(this.approachCourse, course);
                        diffAndSetText(this.approachInfo, ident);
                        if (this.aircraft != Aircraft.CJ4) {
                            diffAndSetAttribute(this.approachFreq, "class", "ValueVor");
                            diffAndSetAttribute(this.approachCourse, "class", "ValueVor");
                            diffAndSetAttribute(this.approachInfo, "class", "ValueVor");
                        }
                        break;
                    }
                case Jet_NDCompass_Navigation.ILS:
                    {
                        let ils;
                        if (this._navSource == 0)
                            ils = this.gps.radioNav.getBestILSBeacon();
                        else
                            ils = this.gps.radioNav.getILSBeacon(this._navSource);
                        let suffix = "";
                        if (ils.id == 1 || ils.id == 3 || this._navSource == 1) {
                            if (this.aircraft == Aircraft.A320_NEO || this.aircraft == Aircraft.CJ4)
                                suffix = "1";
                            else
                                suffix = " L";
                        }
                        else if (ils.id == 2 || ils.id == 4 || this._navSource == 2) {
                            if (this.aircraft == Aircraft.A320_NEO || this.aircraft == Aircraft.CJ4)
                                suffix = "2";
                            else
                                suffix = " R";
                        }
                        let type = "ILS";
                        let freq = "--.--";
                        let course = "---°";
                        let ident = "";
                        if (ils.id > 0) {
                            freq = fastToFixed(ils.freq, 2);
                            course = Utils.leadingZeros(Math.round(ils.course % 360), 3) + "°";
                            ident = ils.name;
                        }
                        diffAndSetText(this.approachType, type + suffix);
                        diffAndSetText(this.approachFreq, freq);
                        diffAndSetText(this.approachCourse, course);
                        diffAndSetText(this.approachInfo, ident);
                        if (this.aircraft != Aircraft.CJ4) {
                            diffAndSetAttribute(this.approachFreq, "class", "ValueIls");
                            diffAndSetAttribute(this.approachCourse, "class", "ValueIls");
                            diffAndSetAttribute(this.approachInfo, "class", "ValueIls");
                        }
                        break;
                    }
            }
        }
    }
    updateElapsedTime() {
        if (this.elapsedTime) {
            if (this._showET) {
                if (this._chronoStarted) {
                    this._chronoValue += this._dTime / 1000;
                }
                var hours = Math.floor(this._chronoValue / 3600);
                var minutes = Math.floor((this._chronoValue - (hours * 3600)) / 60);
                var seconds = Math.floor(this._chronoValue - (minutes * 60) - (hours * 3600));
                let val = "";
                if (hours > 0) {
                    if (hours < 10)
                        val += "0";
                    val += hours;
                    val += ":";
                    if (minutes < 10)
                        val += "0";
                    val += minutes;
                }
                else {
                    if (minutes < 10)
                        val += "0";
                    val += minutes;
                    val += ":";
                    if (seconds < 10)
                        val += "0";
                    val += seconds;
                }
                diffAndSetText(this.elapsedTimeValue, val);
                diffAndSetStyle(this.elapsedTime, StyleProperty.display, "block");
            }
            else {
                diffAndSetStyle(this.elapsedTime, StyleProperty.display, "none");
            }
        }
    }
}
Jet_MFD_NDInfo.MIN_WIND_STRENGTH_FOR_ARROW_DISPLAY = 2;
class VORDMENavAid {
    constructor(_parent, _index) {
        this.parent = _parent;
        this.index = _index;
        if (this.parent != null) {
            this.stateText = _parent.querySelector("#State");
            this.idText = _parent.querySelector("#ID");
            this.modeText = _parent.querySelector("#Mode");
            this.distanceText = _parent.querySelector("#Distance");
            this.unitText = _parent.querySelector("#Unit");
            this.arrowVOR = _parent.querySelector("#ArrowVor");
            this.arrowADF = _parent.querySelector("#ArrowAdf");
        }
        this.setState(NAV_AID_STATE.OFF, true);
        this.setIDValue("---", true);
        this.setMode(NAV_AID_MODE.NONE, true);
        this.setDistanceValue(-1, true);
    }
    update(_gps, _aircraft, _forcedNavAid) {
        this.gps = _gps;
        this.aircraft = _aircraft;
        let state = (_forcedNavAid != undefined) ? _forcedNavAid : Simplane.getAutoPilotNavAidState(_aircraft, 1, this.index);
        this.setState(state);
        if (this.currentState != NAV_AID_STATE.OFF) {
            let idValue = "";
            let distance = -1;
            if (this.currentState == NAV_AID_STATE.VOR) {
                let vor = this.gps.radioNav.getVORBeacon(this.index);
                if (vor.id > 0) {
                    idValue = vor.ident;
                }
                else {
                    let freq = this.gps.radioNav.getVORActiveFrequency(this.index);
                    if (freq > 0) {
                        idValue = fastToFixed(freq, 2);
                    }
                }
                if (idValue != "") {
                    if (SimVar.GetSimVarValue("NAV HAS DME:" + this.index, "Bool")) {
                        distance = SimVar.GetSimVarValue("NAV DME:" + this.index, "nautical miles");
                    }
                }
                else {
                    idValue = "---";
                }
            }
            else {
                let freq = this.gps.radioNav.getADFActiveFrequency(this.index);
                if (freq > 0) {
                    idValue = fastToFixed(freq, 2);
                }
            }
            this.setIDValue(idValue);
            this.setMode(NAV_AID_MODE.MANUAL);
            this.setDistanceValue(distance);
        }
    }
    setState(_state, _force = false) {
        if ((_state != this.currentState) || _force) {
            this.currentState = _state;
            var show = false;
            var type = "";
            switch (this.currentState) {
                case NAV_AID_STATE.ADF:
                    {
                        type = "ADF";
                        if (this.aircraft == Aircraft.A320_NEO || this.aircraft == Aircraft.CJ4)
                            type += this.index + '';
                        else if (this.index == 1)
                            type += " L";
                        else
                            type += " R";
                        if (this.arrowVOR)
                            diffAndSetAttribute(this.arrowVOR, "visibility", "hidden");
                        if (this.arrowADF)
                            diffAndSetAttribute(this.arrowADF, "visibility", "visible");
                        show = true;
                        break;
                    }
                case NAV_AID_STATE.VOR:
                    {
                        type = "VOR";
                        if (this.aircraft == Aircraft.A320_NEO || this.aircraft == Aircraft.CJ4)
                            type += this.index + '';
                        else if (this.index == 1)
                            type += " L";
                        else
                            type += " R";
                        if (this.arrowVOR)
                            diffAndSetAttribute(this.arrowVOR, "visibility", "visible");
                        if (this.arrowADF)
                            diffAndSetAttribute(this.arrowADF, "visibility", "hidden");
                        show = true;
                        break;
                    }
            }
            if (this.parent != null) {
                diffAndSetStyle(this.parent, StyleProperty.display, show ? "block" : "none");
            }
            if (this.stateText != null) {
                diffAndSetText(this.stateText, type);
            }
        }
    }
    setIDValue(_value, _force = false) {
        if ((_value != this.idValue) || _force) {
            this.idValue = _value;
            if (this.idText != null) {
                diffAndSetText(this.idText, this.idValue);
            }
        }
    }
    setMode(_state, _force = false) {
        if ((_state != this.currentMode) || _force) {
            this.currentMode = _state;
            var mode = "";
            switch (this.currentMode) {
                case NAV_AID_MODE.MANUAL:
                    {
                        mode = "M";
                        break;
                    }
                case NAV_AID_MODE.REMOTE:
                    {
                        mode = "R";
                        break;
                    }
            }
            if (this.modeText != null) {
                diffAndSetText(this.modeText, mode);
            }
        }
    }
    setDistanceValue(_value, _force = false) {
        if ((_value != this.distanceValue) || _force) {
            this.distanceValue = _value;
            var showDistance = (this.distanceValue >= 0);
            var displayStr = showDistance ? "block" : "none";
            if (this.distanceText != null) {
                if (showDistance) {
                    diffAndSetText(this.distanceText, fastToFixed(this.distanceValue, 1));
                }
                diffAndSetStyle(this.distanceText, StyleProperty.display, displayStr);
            }
            if (this.unitText != null) {
                diffAndSetStyle(this.unitText, StyleProperty.display, displayStr);
            }
        }
    }
}
customElements.define("jet-mfd-nd-info", Jet_MFD_NDInfo);
//# sourceMappingURL=NDInfo.js.map