var Jet_NDCompass_Display;
(function (Jet_NDCompass_Display) {
    Jet_NDCompass_Display[Jet_NDCompass_Display["NONE"] = 0] = "NONE";
    Jet_NDCompass_Display[Jet_NDCompass_Display["ROSE"] = 1] = "ROSE";
    Jet_NDCompass_Display[Jet_NDCompass_Display["ARC"] = 2] = "ARC";
    Jet_NDCompass_Display[Jet_NDCompass_Display["PLAN"] = 3] = "PLAN";
})(Jet_NDCompass_Display || (Jet_NDCompass_Display = {}));
var Jet_NDCompass_Navigation;
(function (Jet_NDCompass_Navigation) {
    Jet_NDCompass_Navigation[Jet_NDCompass_Navigation["NONE"] = 0] = "NONE";
    Jet_NDCompass_Navigation[Jet_NDCompass_Navigation["VOR"] = 1] = "VOR";
    Jet_NDCompass_Navigation[Jet_NDCompass_Navigation["NAV"] = 2] = "NAV";
    Jet_NDCompass_Navigation[Jet_NDCompass_Navigation["ILS"] = 3] = "ILS";
})(Jet_NDCompass_Navigation || (Jet_NDCompass_Navigation = {}));
var Jet_NDCompass_Reference;
(function (Jet_NDCompass_Reference) {
    Jet_NDCompass_Reference[Jet_NDCompass_Reference["NONE"] = 0] = "NONE";
    Jet_NDCompass_Reference[Jet_NDCompass_Reference["HEADING"] = 1] = "HEADING";
    Jet_NDCompass_Reference[Jet_NDCompass_Reference["TRACK"] = 2] = "TRACK";
})(Jet_NDCompass_Reference || (Jet_NDCompass_Reference = {}));
class Jet_NDCompass_Range {
}
class Jet_NDCompass extends HTMLElement {
    constructor() {
        super(...arguments);
        this.lastSelectedHeading = -1;
        this.showSelectedHeadingTimer = 0;
        this.mapRanges = [];
        this.bearing1_State = NAV_AID_STATE.OFF;
        this.isBearing1Displayed = false;
        this.forcedNavAid1 = undefined;
        this.bearing2_State = NAV_AID_STATE.OFF;
        this.isBearing2Displayed = false;
        this.forcedNavAid2 = undefined;
        this._showILS = false;
        this._fullscreen = true;
        this.isHud = false;
        this._displayMode = Jet_NDCompass_Display.NONE;
        this._navigationMode = Jet_NDCompass_Navigation.NONE;
        this._referenceMode = Jet_NDCompass_Reference.NONE;
        this._aircraft = Aircraft.A320_NEO;
        this._mapRange = 0;
    }
    static get dynamicAttributes() {
        return [
            "rotation",
            "tracking_bug_rotation",
            "heading_bug_rotation",
            "selected_heading_bug_rotation",
            "selected_tracking_bug_rotation",
            "ils_bug_rotation",
            "course",
            "course_deviation",
            "show_bearing1",
            "show_bearing2",
            "toggle_bearing1",
            "toggle_bearing2",
            "bearing1_bearing",
            "bearing2_bearing",
            "display_course_deviation",
            "vertical_deviation",
            "display_vertical_deviation"
        ];
    }
    static get observedAttributes() {
        return this.dynamicAttributes.concat([
            "hud"
        ]);
    }
    get displayMode() {
        return this._displayMode;
    }
    get navigationMode() {
        return this._navigationMode;
    }
    get referenceMode() {
        return this._referenceMode;
    }
    setMode(d, n) {
        if (this.displayMode !== d || this.navigationMode != n) {
            this._displayMode = d;
            this._navigationMode = n;
            this.construct();
        }
    }
    get aircraft() {
        return this._aircraft;
    }
    set aircraft(_val) {
        if (this._aircraft != _val) {
            this._aircraft = _val;
            this.construct();
        }
    }
    get mapRange() {
        return this._mapRange;
    }
    set mapRange(_val) {
        this._mapRange = _val;
    }
    showArcRange(_show) {
        if (this.arcRangeGroup)
            diffAndSetAttribute(this.arcRangeGroup, "visibility", (_show) ? "visible" : "hidden");
    }
    showArcMask(_val) {
        if (this.arcMaskGroup)
            diffAndSetAttribute(this.arcMaskGroup, "visibility", (_val) ? "visible" : "hidden");
    }
    setFullscreen(_val) {
        if (this._fullscreen != _val) {
            this._fullscreen = _val;
            this.construct();
        }
    }
    forceNavAid(_index, _state) {
        if (_index == 1)
            this.forcedNavAid1 = _state;
        else if (_index == 2)
            this.forcedNavAid2 = _state;
    }
    connectedCallback() {
        if (this.hasAttribute("display-mode")) {
            let modeValue = this.getAttribute("display-mode").toLocaleLowerCase();
            if (modeValue === "rose") {
                this._displayMode = Jet_NDCompass_Display.ROSE;
            }
            else if (modeValue === "arc") {
                this._displayMode = Jet_NDCompass_Display.ARC;
            }
            else if (modeValue === "plan") {
                this._displayMode = Jet_NDCompass_Display.PLAN;
            }
            else {
                this._displayMode = Jet_NDCompass_Display.NONE;
            }
        }
        if (this.hasAttribute("navigation-mode")) {
            let modeValue = this.getAttribute("navigation-mode").toLocaleLowerCase();
            if (modeValue === "ils") {
                this._navigationMode = Jet_NDCompass_Navigation.ILS;
            }
            else if (modeValue === "vor") {
                this._navigationMode = Jet_NDCompass_Navigation.VOR;
            }
            else if (modeValue === "nav") {
                this._navigationMode = Jet_NDCompass_Navigation.NAV;
            }
            else {
                this._navigationMode = Jet_NDCompass_Navigation.NONE;
            }
        }
        this.construct();
    }
    init() {
    }
    construct() {
        this.destroyLayout();
        switch (this.displayMode) {
            case Jet_NDCompass_Display.ROSE:
                {
                    this.constructRose();
                    break;
                }
            case Jet_NDCompass_Display.ARC:
                {
                    this.constructArc();
                    break;
                }
            case Jet_NDCompass_Display.PLAN:
                {
                    this.constructPlan();
                    break;
                }
        }
    }
    constructArc() {
    }
    constructRose() {
    }
    constructPlan() {
    }
    destroyLayout() {
        if (this.root) {
            this.root.remove();
        }
        for (let i = 0; i < Jet_NDCompass.dynamicAttributes.length; i++) {
            this.removeAttribute(Jet_NDCompass.dynamicAttributes[i]);
        }
        this.rotatingCircle = null;
        this.rotatingCircleTrs = "";
        this.graduations = null;
        this.mapRanges = [];
        this.headingGroup = null;
        this.headingBug = null;
        this.headingLine = null;
        this.trackingGroup = null;
        this.trackingBug = null;
        this.trackingLine = null;
        this.ilsGroup = null;
        this.selectedHeadingGroup = null;
        this.selectedHeadingBug = null;
        this.selectedHeadingLine = null;
        this.selectedHeadingLeftText = null;
        this.selectedHeadingRightText = null;
        this.selectedTrackGroup = null;
        this.selectedTrackBug = null;
        this.selectedTrackLine = null;
        this.currentRefGroup = null;
        this.currentRefSelected = null;
        this.currentRefMode = null;
        this.currentRefType = null;
        this.currentRefValue = null;
        this.selectedRefGroup = null;
        this.selectedRefMode = null;
        this.selectedRefValue = null;
        this.arcMaskGroup = null;
        this.arcRangeGroup = null;
        this.courseGroup = null;
        this.course = null;
        this.courseTO = null;
        this.courseTOLine = null;
        this.courseDeviation = null;
        this.courseFROM = null;
        this.courseFROMLine = null;
        this.glideSlopeGroup = null;
        this.glideSlopeCursor = null;
        this.bearingCircle = null;
        this.bearing1_State = NAV_AID_STATE.OFF;
        this.bearing1_Vor = null;
        this.bearing1_Adf = null;
        this.isBearing1Displayed = false;
        this.bearing2_State = NAV_AID_STATE.OFF;
        this.bearing2_Vor = null;
        this.bearing2_Adf = null;
        this.isBearing2Displayed = false;
    }
    update(_deltaTime) {
        this.updateCompass(_deltaTime);
        this.updateNavigationInfo();
        this.updateMapRange();
    }
    updateCompass(_deltaTime) {
        var simHeading = Simplane.getHeadingMagnetic();
        var simSelectedHeading = 0;
        if (this.aircraft === Aircraft.B747_8 || this.aircraft === Aircraft.AS01B) {
            simSelectedHeading = Simplane.getAutoPilotSelectedHeadingLockValue(false);
        }
        else if (this.aircraft === Aircraft.CJ4) {
            simSelectedHeading = Simplane.getAutoPilotHeadingLockValueDegrees();
        }
        else {
            simSelectedHeading = Simplane.getAutoPilotDisplayedHeadingValue(false);
        }
        var simTrack = Simplane.getTrackAngle();
        var simSelectedTrack = Simplane.getAutoPilotDisplayedHeadingValue(false);
        var simGroundSpeed = Simplane.getGroundSpeed();
        if (Simplane.getAutoPilotTRKModeActive() || Simplane.getAutoPilotTRKFPAModeActive())
            this._referenceMode = Jet_NDCompass_Reference.TRACK;
        else
            this._referenceMode = Jet_NDCompass_Reference.HEADING;
        let headingChanged = false;
        if (Math.round(simSelectedHeading) != this.lastSelectedHeading) {
            if (this.lastSelectedHeading >= 0)
                headingChanged = true;
            this.lastSelectedHeading = Math.round(simSelectedHeading);
        }
        var compass = 0;
        if (this.displayMode !== Jet_NDCompass_Display.PLAN) {
            if (this.referenceMode == Jet_NDCompass_Reference.TRACK) {
                compass = simTrack;
                if (this.currentRefMode) {
                    diffAndSetText(this.currentRefMode, "TRK");
                }
            }
            else {
                compass = simHeading;
                if (this.currentRefMode) {
                    diffAndSetText(this.currentRefMode, "HDG");
                }
            }
            var roundedCompass = fastToFixed(compass, 2);
            diffAndSetAttribute(this, "rotation", roundedCompass);
            if (this.currentRefGroup)
                this.currentRefGroup.classList.toggle('hide', false);
            if (this.currentRefValue)
                diffAndSetText(this.currentRefValue, Utils.leadingZeros(compass % 360, 3, 0));
        }
        else {
            diffAndSetAttribute(this, "rotation", "0");
            if (this.currentRefGroup)
                this.currentRefGroup.classList.toggle('hide', true);
        }
        let showSelectedHeading = false;
        let selectedHeading = 0;
        if (this.referenceMode == Jet_NDCompass_Reference.HEADING) {
            if (this.aircraft == Aircraft.A320_NEO) {
                selectedHeading = simSelectedHeading;
                showSelectedHeading = Simplane.getAutoPilotHeadingSelected();
                let showTrackLine = showSelectedHeading;
                if (!showSelectedHeading) {
                    showSelectedHeading = SimVar.GetSimVarValue("L:A320_FCU_SHOW_SELECTED_HEADING", "number") === 1;
                    if (showSelectedHeading)
                        selectedHeading = Simplane.getAutoPilotDisplayedHeadingValue(false);
                }
                var roundedSelectedHeading = fastToFixed(selectedHeading, 3);
                diffAndSetAttribute(this, "selected_heading_bug_rotation", roundedSelectedHeading);
                if (this.trackingLine)
                    this.trackingLine.classList.toggle('hide', !showTrackLine);
                if (this.navigationMode == Jet_NDCompass_Navigation.NAV) {
                    if (this.selectedHeadingGroup)
                        this.selectedHeadingGroup.classList.toggle('hide', !showSelectedHeading);
                }
                else {
                    if (this.selectedHeadingGroup)
                        this.selectedHeadingGroup.classList.toggle('hide', true);
                }
                if (this.selectedTrackGroup)
                    this.selectedTrackGroup.classList.toggle('hide', true);
                if (this.selectedRefGroup) {
                    if (this.selectedRefValue)
                        diffAndSetText(this.selectedRefValue, selectedHeading + '');
                    this.selectedRefGroup.classList.toggle('hide', false);
                }
                if (this.headingGroup)
                    this.headingGroup.classList.toggle('hide', true);
            }
            else if (this.aircraft == Aircraft.B747_8 || this.aircraft == Aircraft.AS01B) {
                selectedHeading = simSelectedHeading;
                showSelectedHeading = Simplane.getAutoPilotHeadingLockActive();
                if (!showSelectedHeading) {
                    if (headingChanged) {
                        showSelectedHeading = true;
                        this.showSelectedHeadingTimer = 5;
                    }
                    else if (this.showSelectedHeadingTimer > 0) {
                        this.showSelectedHeadingTimer -= _deltaTime / 1000;
                        if (this.showSelectedHeadingTimer <= 0)
                            this.showSelectedHeadingTimer = 0;
                        else
                            showSelectedHeading = true;
                    }
                }
                else {
                    this.showSelectedHeadingTimer = 0;
                }
                var roundedSelectedHeading = fastToFixed(selectedHeading, 3);
                diffAndSetAttribute(this, "selected_heading_bug_rotation", roundedSelectedHeading);
                if (this.navigationMode == Jet_NDCompass_Navigation.NAV) {
                    if (this.selectedHeadingGroup)
                        this.selectedHeadingGroup.classList.toggle('hide', false);
                    if (this.selectedHeadingLine)
                        this.selectedHeadingLine.classList.toggle('hide', !showSelectedHeading);
                }
                else {
                    if (this.selectedHeadingGroup)
                        this.selectedHeadingGroup.classList.toggle('hide', true);
                }
                if (this.selectedTrackGroup)
                    this.selectedTrackGroup.classList.toggle('hide', true);
                if (this.selectedRefGroup) {
                    if (this.selectedRefValue)
                        diffAndSetText(this.selectedRefValue, selectedHeading + '');
                    this.selectedRefGroup.classList.toggle('hide', false);
                }
            }
            else {
                showSelectedHeading = Simplane.getAutoPilotHeadingLockActive();
                if (!showSelectedHeading) {
                    if (headingChanged) {
                        showSelectedHeading = true;
                        this.showSelectedHeadingTimer = 5;
                    }
                    else if (this.showSelectedHeadingTimer > 0) {
                        this.showSelectedHeadingTimer -= _deltaTime / 1000;
                        if (this.showSelectedHeadingTimer <= 0)
                            this.showSelectedHeadingTimer = 0;
                        else
                            showSelectedHeading = true;
                    }
                }
                else {
                    this.showSelectedHeadingTimer = 0;
                }
                if (showSelectedHeading) {
                    selectedHeading = simSelectedHeading;
                    diffAndSetAttribute(this, "selected_heading_bug_rotation", fastToFixed(selectedHeading, 3));
                    if (this.navigationMode == Jet_NDCompass_Navigation.NAV) {
                        if (this.selectedHeadingGroup)
                            this.selectedHeadingGroup.classList.toggle('hide', false);
                        if (this.selectedHeadingLine) {
                            if (this.aircraft == Aircraft.CJ4 && this.displayMode == Jet_NDCompass_Display.ARC) {
                                let CompassAngle = this.degreeToArc(compass);
                                let selectedAngle = this.degreeToArc(simSelectedHeading);
                                let delta = Math.abs(CompassAngle - selectedAngle);
                                this.selectedHeadingLine.classList.toggle('hide', (delta > 65) ? false : true);
                                this.selectedHeadingBug.classList.toggle('hide', (delta > 90) ? true : false);
                            }
                            else
                                this.selectedHeadingLine.classList.toggle('hide', false);
                        }
                    }
                    else {
                        if (this.selectedHeadingGroup)
                            this.selectedHeadingGroup.classList.toggle('hide', true);
                    }
                    if (this.selectedTrackGroup)
                        this.selectedTrackGroup.classList.toggle('hide', true);
                    if (this.selectedRefGroup) {
                        if (this.selectedRefValue)
                            diffAndSetText(this.selectedRefValue, selectedHeading + '');
                        this.selectedRefGroup.classList.toggle('hide', false);
                    }
                }
                else {
                    if (this.selectedHeadingGroup)
                        this.selectedHeadingGroup.classList.toggle('hide', true);
                    if (this.selectedTrackGroup)
                        this.selectedTrackGroup.classList.toggle('hide', true);
                    if (this.selectedRefGroup)
                        this.selectedRefGroup.classList.toggle('hide', true);
                }
            }
        }
        else {
            showSelectedHeading = true;
            selectedHeading = simSelectedTrack;
            diffAndSetAttribute(this, "selected_tracking_bug_rotation", fastToFixed(selectedHeading, 3));
            if (this.trackingLine)
                this.trackingLine.classList.toggle('hide', false);
            if (this.selectedHeadingGroup)
                this.selectedHeadingGroup.classList.toggle('hide', true);
            if (this.selectedTrackGroup)
                this.selectedTrackGroup.classList.toggle('hide', false);
            if (this.selectedRefGroup) {
                if (this.selectedRefValue)
                    diffAndSetText(this.selectedRefValue, selectedHeading + '');
                this.selectedRefGroup.classList.toggle('hide', false);
            }
            if (this.headingGroup)
                this.headingGroup.classList.toggle('hide', true);
        }
        if (this.selectedHeadingLeftText || this.selectedHeadingRightText) {
            if (this.displayMode == Jet_NDCompass_Display.ARC) {
                if (showSelectedHeading) {
                    let delta = selectedHeading - simHeading;
                    if (Math.abs(delta) > 180)
                        delta -= 360 * Math.sign(delta);
                    if (delta > 45) {
                        this.selectedHeadingLeftText.classList.toggle('hide', true);
                        this.selectedHeadingRightText.classList.toggle('hide', false);
                    }
                    else if (delta < -45) {
                        this.selectedHeadingLeftText.classList.toggle('hide', false);
                        this.selectedHeadingRightText.classList.toggle('hide', true);
                    }
                    else {
                        this.selectedHeadingLeftText.classList.toggle('hide', true);
                        this.selectedHeadingRightText.classList.toggle('hide', true);
                    }
                    let text = fastToFixed(selectedHeading, 0).padStart(3, "0");
                    diffAndSetText(this.selectedHeadingLeftText, text);
                    diffAndSetText(this.selectedHeadingRightText, text);
                }
                else {
                    this.selectedHeadingLeftText.classList.toggle('hide', true);
                    this.selectedHeadingRightText.classList.toggle('hide', true);
                }
            }
            else {
                this.selectedHeadingLeftText.classList.toggle('hide', true);
                this.selectedHeadingRightText.classList.toggle('hide', true);
            }
        }
        var heading = simHeading;
        var roundedHeading = fastToFixed(heading, 3);
        diffAndSetAttribute(this, "heading_bug_rotation", roundedHeading);
        if (simGroundSpeed <= 10)
            simTrack = simHeading;
        var roundedTracking = fastToFixed(simTrack, 3);
        diffAndSetAttribute(this, "tracking_bug_rotation", roundedTracking);
        if (this.ilsGroup) {
            if (this._showILS || this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                let localizer = this.gps.radioNav.getBestILSBeacon();
                if (localizer && localizer.id > 0) {
                    var roundedCourse = fastToFixed(localizer.course, 3);
                    diffAndSetAttribute(this, "ils_bug_rotation", roundedCourse);
                    this.ilsGroup.classList.toggle('hide', false);
                }
                else
                    this.ilsGroup.classList.toggle('hide', true);
            }
            else
                this.ilsGroup.classList.toggle('hide', true);
        }
        this.applyRotation();
    }
    updateMapRange() {
        if (this.mapRanges) {
            for (let i = 0; i < this.mapRanges.length; i++) {
                let range = this.mapRange * this.mapRanges[i].factor;
                if (range < 1.0 && this.mapRanges[i].removeInteger) {
                    let rangeText = fastToFixed((Math.floor(range * 100) / 100), 2);
                    var radixPos = rangeText.indexOf('.');
                    diffAndSetText(this.mapRanges[i].text, rangeText.slice(radixPos));
                }
                else {
                    diffAndSetText(this.mapRanges[i].text, range + '');
                }
            }
        }
    }
    updateNavigationInfo() {
        if (this.courseGroup) {
            if (this.course) {
                if (this.navigationMode == Jet_NDCompass_Navigation.ILS || this.navigationMode == Jet_NDCompass_Navigation.VOR) {
                    let compass = Number(this.getAttribute('rotation'));
                    let beacon;
                    if (this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                        beacon = this.gps.radioNav.getBestILSBeacon();
                    }
                    else if (this.navigationMode === Jet_NDCompass_Navigation.VOR) {
                        beacon = this.gps.radioNav.getBestVORBeacon();
                    }
                    let displayCourseDeviation = false;
                    let displayVerticalDeviation = false;
                    if (beacon.id > 0) {
                        displayCourseDeviation = true;
                        let deviation = (SimVar.GetSimVarValue("NAV CDI:" + beacon.id, "number") / 127);
                        let backCourse = SimVar.GetSimVarValue("AUTOPILOT BACKCOURSE HOLD", "bool");
                        if (backCourse)
                            deviation = -deviation;
                        diffAndSetAttribute(this, "course", beacon.course + '');
                        diffAndSetAttribute(this, "course_deviation", deviation + '');
                        if (SimVar.GetSimVarValue("NAV HAS GLIDE SLOPE:" + beacon.id, "Bool")) {
                            displayVerticalDeviation = true;
                            diffAndSetAttribute(this, "vertical_deviation", (SimVar.GetSimVarValue("NAV GSI:" + beacon.id, "number") / 127.0) + '');
                        }
                    }
                    else {
                        diffAndSetAttribute(this, "course", compass + '');
                        diffAndSetAttribute(this, "course_deviation", "0");
                    }
                    diffAndSetAttribute(this, "display_course_deviation", displayCourseDeviation ? "True" : "False");
                    diffAndSetAttribute(this, "display_vertical_deviation", displayVerticalDeviation ? "True" : "False");
                    this.course.classList.toggle('hide', false);
                }
                else {
                    this.course.classList.toggle('hide', true);
                }
            }
            let state1 = (this.forcedNavAid1 != undefined) ? this.forcedNavAid1 : Simplane.getAutoPilotNavAidState(this.aircraft, 1, 1);
            this.updateBearing(1, state1);
            let state2 = (this.forcedNavAid2 != undefined) ? this.forcedNavAid2 : Simplane.getAutoPilotNavAidState(this.aircraft, 1, 2);
            this.updateBearing(2, state2);
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "toggle_bearing1":
                this.showBearing(1, !this.isBearing1Displayed);
                break;
            case "toggle_bearing2":
                this.showBearing(2, !this.isBearing2Displayed);
                break;
            case "show_bearing1":
                this.showBearing(1, (newValue == "true") ? true : false);
                break;
            case "show_bearing2":
                this.showBearing(2, (newValue == "true") ? true : false);
                break;
        }
        if (oldValue == newValue)
            return;
        let factor = (this.displayMode === Jet_NDCompass_Display.ARC) ? 1 : 10;
        switch (name) {
            case "vertical_deviation":
                if (this.glideSlopeCursor) {
                    let y = (parseFloat(newValue) * 25 * factor) + (50 * factor);
                    diffAndSetAttribute(this.glideSlopeCursor, "transform", "translate(" + (95 * factor) + " " + fastToFixed(y, 0) + ")");
                }
                break;
            case "display_vertical_deviation":
                if (newValue == "True") {
                    if (this.glideSlopeCursor)
                        diffAndSetAttribute(this.glideSlopeCursor, "visibility", "visible");
                }
                else {
                    if (this.glideSlopeCursor) {
                        diffAndSetAttribute(this.glideSlopeCursor, "visibility", "hidden");
                    }
                }
                break;
            case "display_course_deviation":
                if (newValue == "True") {
                    diffAndSetAttribute(this.courseTO, "fill", this.courseColor + '');
                    diffAndSetAttribute(this.courseDeviation, "visibility", "visible");
                    diffAndSetAttribute(this.courseFROM, "fill", this.courseColor + '');
                    if (this.courseTOLine)
                        diffAndSetAttribute(this.courseTOLine, "visibility", "visible");
                    if (this.courseFROMLine)
                        diffAndSetAttribute(this.courseFROMLine, "visibility", "visible");
                }
                else {
                    diffAndSetAttribute(this.courseTO, "fill", "none");
                    diffAndSetAttribute(this.courseDeviation, "visibility", "hidden");
                    diffAndSetAttribute(this.courseFROM, "fill", "none");
                    if (this.courseTOLine)
                        diffAndSetAttribute(this.courseTOLine, "visibility", "hidden");
                    if (this.courseFROMLine)
                        diffAndSetAttribute(this.courseFROMLine, "visibility", "hidden");
                }
                break;
            case "course":
                if (this.course) {
                    diffAndSetAttribute(this.course, "transform", "rotate(" + (newValue) + " " + (50 * factor) + " " + (50 * factor) + ")");
                }
                break;
            case "course_deviation":
                if (this.courseDeviation) {
                    if (this.displayMode == Jet_NDCompass_Display.ARC)
                        diffAndSetAttribute(this.courseDeviation, "transform", "translate(" + (Math.min(Math.max(parseFloat(newValue), -1), 1) * 100 * factor) + ")");
                    else
                        diffAndSetAttribute(this.courseDeviation, "transform", "translate(" + (Math.min(Math.max(parseFloat(newValue), -1), 1) * 20 * factor) + ")");
                }
                break;
            case "bearing1_bearing":
                if (newValue != "") {
                    if (this.bearing1_Vor)
                        diffAndSetAttribute(this.bearing1_Vor, "transform", "rotate(" + newValue + " " + (50 * factor) + " " + (50 * factor) + ")");
                    if (this.bearing1_Adf)
                        diffAndSetAttribute(this.bearing1_Adf, "transform", "rotate(" + newValue + " " + (50 * factor) + " " + (50 * factor) + ")");
                }
                break;
            case "bearing2_bearing":
                if (newValue != "") {
                    if (this.bearing1_Vor)
                        diffAndSetAttribute(this.bearing2_Vor, "transform", "rotate(" + newValue + " " + (50 * factor) + " " + (50 * factor) + ")");
                    if (this.bearing1_Adf)
                        diffAndSetAttribute(this.bearing2_Adf, "transform", "rotate(" + newValue + " " + (50 * factor) + " " + (50 * factor) + ")");
                }
                break;
            case "hud":
                this.isHud = newValue == "true";
                break;
        }
    }
    showBearing(_id, _show) {
        if (_id == 1) {
            this.isBearing1Displayed = _show;
            if (this.bearingCircle) {
                if (this.isBearing1Displayed || this.isBearing2Displayed) {
                    diffAndSetAttribute(this.bearingCircle, "visibility", "visible");
                }
                else {
                    diffAndSetAttribute(this.bearingCircle, "visibility", "hidden");
                }
            }
            if (this.bearing1_Vor || this.bearing1_Adf) {
                if (this.isBearing1Displayed && this.bearing1_State == NAV_AID_STATE.VOR) {
                    diffAndSetAttribute(this.bearing1_Vor, "visibility", "visible");
                    diffAndSetAttribute(this.bearing1_Adf, "visibility", "hidden");
                }
                else if (this.isBearing1Displayed && this.bearing1_State == NAV_AID_STATE.ADF) {
                    diffAndSetAttribute(this.bearing1_Vor, "visibility", "hidden");
                    diffAndSetAttribute(this.bearing1_Adf, "visibility", "visible");
                }
                else {
                    diffAndSetAttribute(this.bearing1_Vor, "visibility", "hidden");
                    diffAndSetAttribute(this.bearing1_Adf, "visibility", "hidden");
                }
            }
        }
        else if (_id == 2) {
            this.isBearing2Displayed = _show;
            if (this.bearingCircle) {
                if (this.isBearing1Displayed || this.isBearing2Displayed) {
                    diffAndSetAttribute(this.bearingCircle, "visibility", "visible");
                }
                else {
                    diffAndSetAttribute(this.bearingCircle, "visibility", "hidden");
                }
            }
            if (this.bearing2_Vor || this.bearing2_Adf) {
                if (this.isBearing2Displayed && this.bearing2_State == NAV_AID_STATE.VOR) {
                    diffAndSetAttribute(this.bearing2_Vor, "visibility", "visible");
                    diffAndSetAttribute(this.bearing2_Adf, "visibility", "hidden");
                }
                else if (this.isBearing2Displayed && this.bearing2_State == NAV_AID_STATE.ADF) {
                    diffAndSetAttribute(this.bearing2_Vor, "visibility", "hidden");
                    diffAndSetAttribute(this.bearing2_Adf, "visibility", "visible");
                }
                else {
                    diffAndSetAttribute(this.bearing2_Vor, "visibility", "hidden");
                    diffAndSetAttribute(this.bearing2_Adf, "visibility", "hidden");
                }
            }
        }
    }
    updateBearing(_index, _state) {
        let wantedState = NAV_AID_STATE.OFF;
        if (_state == NAV_AID_STATE.VOR) {
            let beacon = this.gps.radioNav.getVORBeacon(_index);
            if (beacon.id > 0) {
                wantedState = NAV_AID_STATE.VOR;
                let degree = (180 + beacon.radial) % 360;
                diffAndSetAttribute(this, "bearing" + _index + "_bearing", degree + '');
            }
        }
        else if (_state == NAV_AID_STATE.ADF) {
            let hasNav = SimVar.GetSimVarValue("ADF SIGNAL:" + _index, "number");
            if (hasNav) {
                wantedState = NAV_AID_STATE.ADF;
                let degree = (180 + SimVar.GetSimVarValue("ADF RADIAL MAG:" + _index, "degree")) % 360;
                diffAndSetAttribute(this, "bearing" + _index + "_bearing", degree + '');
            }
        }
        if (_index == 1 && wantedState != this.bearing1_State) {
            this.bearing1_State = wantedState;
            diffAndSetAttribute(this, "show_bearing1", (wantedState == NAV_AID_STATE.OFF) ? "false" : "true");
        }
        else if (_index == 2 && wantedState != this.bearing2_State) {
            this.bearing2_State = wantedState;
            diffAndSetAttribute(this, "show_bearing2", (wantedState == NAV_AID_STATE.OFF) ? "false" : "true");
        }
    }
    applyRotation() {
        let course = Number(this.getAttribute('rotation'));
        let trackingBug = Number(this.getAttribute('tracking_bug_rotation'));
        let headingBug = Number(this.getAttribute('heading_bug_rotation'));
        let selectedHeadingBug = Number(this.getAttribute('selected_heading_bug_rotation'));
        let selectedTrackingBug = Number(this.getAttribute('selected_tracking_bug_rotation'));
        let ilsBug = Number(this.getAttribute('ils_bug_rotation'));
        let factor = 500;
        if (this.displayMode === Jet_NDCompass_Display.ARC) {
            factor = 50;
            trackingBug = this.degreeToArc(trackingBug);
            headingBug = this.degreeToArc(headingBug);
            selectedHeadingBug = this.degreeToArc(selectedHeadingBug);
            selectedTrackingBug = this.degreeToArc(selectedTrackingBug);
            ilsBug = this.degreeToArc(ilsBug);
        }
        if (this.rotatingCircle)
            diffAndSetAttribute(this.rotatingCircle, "transform", this.rotatingCircleTrs + " rotate(" + (-course) + " " + factor + " " + factor + ")");
        if (this.graduations)
            diffAndSetAttribute(this.graduations, "transform", "rotate(" + (-course) + " " + factor + " " + factor + ")");
        if (this.trackingGroup)
            diffAndSetAttribute(this.trackingGroup, "transform", "rotate(" + trackingBug + " " + factor + " " + factor + ")");
        if (this.headingGroup)
            diffAndSetAttribute(this.headingGroup, "transform", "rotate(" + headingBug + " " + factor + " " + factor + ")");
        if (this.selectedHeadingGroup)
            diffAndSetAttribute(this.selectedHeadingGroup, "transform", "rotate(" + selectedHeadingBug + " " + factor + " " + factor + ")");
        if (this.selectedTrackGroup)
            diffAndSetAttribute(this.selectedTrackGroup, "transform", "rotate(" + selectedTrackingBug + " " + factor + " " + factor + ")");
        if (this.ilsGroup)
            diffAndSetAttribute(this.ilsGroup, "transform", "rotate(" + ilsBug + " " + factor + " " + factor + ")");
    }
    degreeToArc(_wantedAngle) {
        let tracking = _wantedAngle;
        let angle = (tracking + 180) % 360;
        return angle;
    }
    getExternalTextZonePath(radius, beginAngle, endAngle, xEnd, reverse = false) {
        let beginX = 50 - (radius * Math.cos(beginAngle));
        let beginY = 50 - (radius * Math.sin(beginAngle));
        let endX = 50 - (radius * Math.cos(endAngle));
        let endY = 50 - (radius * Math.sin(endAngle));
        let path = "M" + beginX + " " + beginY + "L" + xEnd + " " + beginY + "L" + xEnd + " " + endY + "L" + endX + " " + endY;
        path += "A " + radius + " " + radius + " 0 0 " + (reverse ? 0 : 1) + " " + beginX + " " + beginY;
        return path;
    }
    addMapRange(_parent, _x, _y, _color, _size, _withBg, _rangeFactor, _removeInteger) {
        let range = new Jet_NDCompass_Range();
        {
            range.text = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(range.text, "");
            diffAndSetAttribute(range.text, "x", _x + '');
            diffAndSetAttribute(range.text, "y", _y + '');
            diffAndSetAttribute(range.text, "fill", _color);
            diffAndSetAttribute(range.text, "font-size", _size + '');
            diffAndSetAttribute(range.text, "font-family", "Roboto-Light");
            diffAndSetAttribute(range.text, "text-anchor", "middle");
            diffAndSetAttribute(range.text, "alignment-baseline", "central");
            range.factor = _rangeFactor;
            range.removeInteger = _removeInteger;
            this.mapRanges.push(range);
        }
        if (_withBg) {
            let w = 80;
            let h = 40;
            let bg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(bg, "x", (_x - w * 0.5) + '');
            diffAndSetAttribute(bg, "y", (_y - h * 0.5) + '');
            diffAndSetAttribute(bg, "width", w + '');
            diffAndSetAttribute(bg, "height", h + '');
            diffAndSetAttribute(bg, "fill", "black");
            _parent.appendChild(bg);
        }
        _parent.appendChild(range.text);
        return range.text;
    }
    onEvent(_event) {
    }
    onExit() {
    }
    showILS(_val) {
        this._showILS = _val;
    }
}
//# sourceMappingURL=BaseNDCompass.js.map