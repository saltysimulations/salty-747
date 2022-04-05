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
                    this.waypoint.style.display = "block";
                if (this.approach) {
                    this.approachType.textContent = "";
                    this.approachFreq.textContent = "";
                    this.approachCourse.textContent = "";
                    this.approachInfo.textContent = "";
                    this.approach.style.display = "none";
                }
            }
            else if (this._navMode == Jet_NDCompass_Navigation.ILS || this._navMode == Jet_NDCompass_Navigation.VOR) {
                if (this.waypoint) {
                    this.waypointName.textContent = "";
                    this.waypointTrack.textContent = "";
                    this.waypointDistance.textContent = "";
                    this.waypoint.style.display = "none";
                }
                if (this.approach)
                    this.approach.style.display = "block";
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
                this.groundSpeed.textContent = this.currentGroundSpeed.toString().padStart(3, "0");
            }
        }
    }
    setTrueAirSpeed(_speed, _force = false) {
        if ((_speed != this.currentTrueAirSpeed) || _force) {
            this.currentTrueAirSpeed = _speed;
            if (this.trueAirSpeed != null) {
                this.trueAirSpeed.textContent = this.currentTrueAirSpeed.toString().padStart(3, "0");
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
                    this.windDirection.textContent = this.currentWindAngle.toFixed(0).padStart(3, "0");
                else
                    this.windDirection.textContent = "---";
            }
        }
        if (refreshWindStrength) {
            this.currentWindStrength = _windStrength;
            if (this.windStrength != null) {
                if (this.windStrongEnough)
                    this.windStrength.textContent = this.currentWindStrength.toString().padStart(2, "0");
                else
                    this.windStrength.textContent = "--";
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
                            transformStr = split[0];
                        }
                        else {
                            transformStr = "";
                        }
                    }
                    if (transformStr)
                        this.windArrow.setAttribute("transform", transformStr + " rotate(" + arrowAngle + ")");
                    else
                        this.windArrow.setAttribute("transform", "rotate(" + arrowAngle + ")");
                    this.windArrow.style.display = "block";
                }
                else {
                    this.windArrow.style.display = "none";
                }
            }
        }
    }
    setWaypoint(_name, _track, _distance, _eta, _force = false) {
        if (this.waypoint) {
            if (this._navMode == Jet_NDCompass_Navigation.NAV) {
                if (_name && _name != "") {
                    if (this.waypointName != null) {
                        this.waypointName.textContent = _name;
                    }
                    if ((_track != this.currentWaypointTrack) || _force) {
                        this.currentWaypointTrack = _track;
                        if (this.waypointTrack) {
                            this.waypointTrack.textContent = this.currentWaypointTrack.toString().padStart(3, "0") + String.fromCharCode(176);
                        }
                    }
                    if ((_distance != this.currentWaypointDistance) || _force) {
                        this.currentWaypointDistance = _distance;
                        if (this.waypointDistance != null) {
                            if (this.currentWaypointDistance < 10000)
                                this.waypointDistance.textContent = this.currentWaypointDistance.toFixed(1);
                            else
                                this.waypointDistance.textContent = this.currentWaypointDistance.toFixed(0);
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
                            this.waypointTime.textContent = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
                        }
                    }
                }
                else {
                    if (this.waypointName != null) {
                        this.waypointName.textContent = "";
                    }
                    if (this.waypointTrack != null) {
                        this.waypointTrack.textContent = "---°";
                    }
                    if (this.waypointDistance != null) {
                        this.waypointDistance.textContent = "-.-";
                    }
                    if (this.waypointTime != null) {
                        this.waypointTime.textContent = "--:--";
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
                            this.topTitle.textContent = ilsText;
                            this.topTitle.setAttribute("state", "ils");
                        }
                        else {
                            this.topTitle.textContent = "";
                            this.topTitle.removeAttribute("state");
                        }
                        break;
                    }
                case Jet_NDCompass_Navigation.VOR:
                    {
                        this.topTitle.textContent = "VOR";
                        if (Simplane.getAutoPilotAPPRHold()) {
                            this.topTitle.textContent += " APP";
                        }
                        this.topTitle.removeAttribute("state");
                        break;
                    }
                case Jet_NDCompass_Navigation.ILS:
                    {
                        this.topTitle.textContent = "ILS";
                        if (Simplane.getAutoPilotAPPRHold()) {
                            this.topTitle.textContent += " APP";
                        }
                        this.topTitle.removeAttribute("state");
                        break;
                    }
                default:
                    {
                        this.topTitle.textContent = "";
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
                            freq = vor.freq.toFixed(2);
                            course = Utils.leadingZeros(Math.round(vor.course % 360), 3) + "°";
                            ident = vor.ident;
                            if (this.aircraft == Aircraft.CJ4) {
                                let hasLocalizer = SimVar.GetSimVarValue("NAV HAS LOCALIZER:" + vor.id, "Bool");
                                if (hasLocalizer)
                                    type = "LOC";
                            }
                        }
                        this.approachType.textContent = type + suffix;
                        this.approachFreq.textContent = freq;
                        this.approachCourse.textContent = course;
                        this.approachInfo.textContent = ident;
                        if (this.aircraft != Aircraft.CJ4) {
                            this.approachFreq.setAttribute("class", "ValueVor");
                            this.approachCourse.setAttribute("class", "ValueVor");
                            this.approachInfo.setAttribute("class", "ValueVor");
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
                            freq = ils.freq.toFixed(2);
                            course = Utils.leadingZeros(Math.round(ils.course % 360), 3) + "°";
                            ident = ils.name;
                        }
                        this.approachType.textContent = type + suffix;
                        this.approachFreq.textContent = freq;
                        this.approachCourse.textContent = course;
                        this.approachInfo.textContent = ident;
                        if (this.aircraft != Aircraft.CJ4) {
                            this.approachFreq.setAttribute("class", "ValueIls");
                            this.approachCourse.setAttribute("class", "ValueIls");
                            this.approachInfo.setAttribute("class", "ValueIls");
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
                this.elapsedTimeValue.textContent = val;
                this.elapsedTime.style.display = "block";
            }
            else {
                this.elapsedTime.style.display = "none";
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
        }
        this.setState(NAV_AID_STATE.OFF, true);
        this.setIDValue("", true);
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
            let distanceDisplay = -1;
            if (this.currentState == NAV_AID_STATE.VOR) {
                let vor = this.gps.radioNav.getVORBeacon(this.index);
                if (vor.id > 0) {
                    idValue = vor.ident;
                }
                else {
                    let freq = this.gps.radioNav.getVORActiveFrequency(this.index);
                    if (freq > 0) {
                        idValue = freq.toFixed(2);
                    }
                }
                if (idValue != "") {
                    if (SimVar.GetSimVarValue("NAV HAS DME:" + this.index, "Bool")) {
                        let distance = SimVar.GetSimVarValue("NAV DME:" + this.index, "nautical miles");
                        if (distance >= 100) {
                            distanceDisplay = distance.toFixed(0);
                        }
                        else {
                            distanceDisplay = distance.toFixed(1);
                        }
                    }
                }
                else {
                    idValue = "";
                }
            }
            else {
                let freq = this.gps.radioNav.getADFActiveFrequency(this.index);
                if (freq > 0) {
                    idValue = freq.toFixed(2);
                }
            }
            this.setIDValue(idValue);
            this.setMode(NAV_AID_MODE.MANUAL);
            this.setDistanceValue(distanceDisplay);
        }
    }
    setState(_state, _force = false) {
        if ((_state != this.currentState) || _force) {
            this.currentState = _state;
            var show = false;
            var type = "";
            var colour = "";
            switch (this.currentState) {
                case NAV_AID_STATE.ADF:
                    {
                        type = "ADF";
                        if (this.aircraft == Aircraft.A320_NEO || this.aircraft == Aircraft.CJ4)
                            type += this.index.toString();
                        else if (this.index == 1)
                            type += " L";
                        else
                            type += " R";
                        show = true;
                        colour = "cyan";
                        break;
                    }
                case NAV_AID_STATE.VOR:
                    {
                        type = "VOR";
                        if (this.aircraft == Aircraft.A320_NEO || this.aircraft == Aircraft.CJ4)
                            type += this.index.toString();
                        else if (this.index == 1)
                            type += " L";
                        else
                            type += " R";
                        show = true;
                        colour = "lime";
                        break;
                    }
            }
            if (this.parent != null) {
                this.parent.style.display = show ? "block" : "none";
            }
            if (this.stateText != null) {
                this.stateText.textContent = type;
                this.stateText.setAttribute("fill", colour);
            }
            if (this.idText != null) {
                this.idText.setAttribute("fill", colour);
            }
        }
    }
    setIDValue(_value, _force = false) {
        if ((_value != this.idValue) || _force) {
            this.idValue = _value;
            if (this.idText != null) {
                this.idText.textContent = this.idValue;
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
                this.modeText.textContent = mode;
            }
        }
    }
    setDistanceValue(_value, _force = false) {
        if ((_value != this.distanceValue) || _force) {
            this.distanceValue = _value;
            var showDistance = (this.distanceValue > 0);
            var displayStr = showDistance ? "block" : "none";
            if (this.distanceText != null) {
                if (showDistance) {
                    this.distanceText.textContent = this.distanceValue;
                }
                this.distanceText.style.display = displayStr;
            }
            if (this.unitText != null) {
                this.unitText.style.display = displayStr;
            }
        }
    }
}
customElements.define("jet-mfd-nd-info", Jet_MFD_NDInfo);
//# sourceMappingURL=NDInfo.js.map