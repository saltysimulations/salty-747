class B747_8_MFD extends BaseAirliners {
    constructor() {
        super();
        this.initDuration = 11000;
    }
    get templateID() { return "B747_8_MFD"; }
    get IsGlassCockpit() { return true; }
    connectedCallback() {
        super.connectedCallback();
        this.pageGroups = [
            new NavSystemPageGroup("Main", this, [
                new B747_8_MFD_MainPage()
            ]),
        ];
    }
    disconnectedCallback() {
    }
    onEvent(_event) {
        switch (_event) {
            case "CLR_Long":
                this.currentInteractionState = 0;
                this.popUpElement = null;
                this.overridePage = null;
                this.currentEventLinkedPageGroup = null;
                this.currentPageGroupIndex = 0;
                this.getCurrentPageGroup().pageIndex = 0;
                break;
        }
    }
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
    }
}
class B747_8_MFD_MainElement extends NavSystemElement {
    init(root) {
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
class B747_8_MFD_MainPage extends NavSystemPage {
    constructor() {
        super("Main", "Mainframe", new B747_8_MFD_MainElement());
        this.forceMapUpdate = false;
        this.mapIsCentered = false;
        this.wxRadarOn = false;
        this.terrainOn = false;
        this.mapMode = -1;
        this.mapRange = -1;
        this.mapConfigId = 0;
        this.modeChangeTimer = -1;
        this.map = new B747_8_MFD_Map();
        this.compass = new B747_8_MFD_Compass();
        this.info = new B747_8_MFD_NDInfo();
        this.element = new NavSystemElementGroup([
            this.map,
            this.compass,
            this.info
        ]);
    }
    init() {
        super.init();
        this.modeChangeMask = this.gps.getChildById("ModeChangeMask");
        this.map.instrument.showRoads = false;
        this.map.instrument.showObstacles = false;
        this.map.instrument.showVORs = false;
        this.map.instrument.showIntersections = false;
        this.map.instrument.showNDBs = false;
        this.map.instrument.showAirports = false;
        this.map.instrument.showAirspaces = false;
        this.map.instrument.intersectionMaxRange = Infinity;
        this.map.instrument.vorMaxRange = Infinity;
        this.map.instrument.ndbMaxRange = Infinity;
        this.map.instrument.smallAirportMaxRange = 0;
        this.map.instrument.medAirportMaxRange = 0;
        this.map.instrument.largeAirportMaxRange = Infinity;
        SimVar.SetSimVarValue("L:B747_8_MFD_NAV_MODE", "number", 2);

        this.trkBox = document.querySelector("#trk-box");
        this.mapBox = document.querySelector("#map-box");
        this.mapInstrument = document.querySelector("map-instrument");
        this.irsTimes = document.querySelector("#irs-times");
        this.leftIRSValue = document.querySelector("#l-irs-value");
        this.centerIRSValue = document.querySelector("#c-irs-value");
        this.rightIRSValue = document.querySelector("#r-irs-value");
        this.deviationItems = document.querySelector("#PathDeviationScale");
        this.deviationPointer = document.querySelector("#pathDevPointer");
        this.deviationTextTop = document.querySelector("#pathTopText");
        this.deviationTextBottom = document.querySelector("#pathBottomText");
    }
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
        this.updateMap(_deltaTime);
        this.updateNDInfo(_deltaTime);
        this.updateDeviationScale(_deltaTime);

        const IRSState = SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum");
        const IRSMinutesLeft = Math.floor(SimVar.GetSimVarValue("L:SALTY_IRS_TIME_LEFT", "Enum") / 60);

        if (IRSState == 0) {
            this.mapBox.style.display = "";
            this.trkBox.style.display = "";
            this.irsTimes.style.display = "none";
            this.mapInstrument.style.display = "none";
        }
        if (IRSState == 1) {
            this.trkBox.style.display = "none";
            this.mapInstrument.style.display = "none";
            this.irsTimes.style.display = "";
            this.leftIRSValue.textContent = IRSMinutesLeft;
            this.centerIRSValue.textContent = IRSMinutesLeft;
            this.rightIRSValue.textContent = IRSMinutesLeft;
        }
        if (IRSState == 2) {
            this.mapBox.style.display = "none";
            this.trkBox.style.display = "none";
            this.mapInstrument.style.display = "";
            this.irsTimes.style.display = "none";
        }
    }
    onEvent(_event) {
        switch (_event) {
            case "KNOB_AUTOPILOT_CTR":
                if (this.mapMode != Jet_NDCompass_Display.PLAN) {
                    this.mapIsCentered = !this.mapIsCentered;
                    SimVar.SetSimVarValue("L:BTN_CTR_ACTIVE", "bool", this.mapIsCentered);
                    this.forceMapUpdate = true;
                }
                break;
            case "KNOB_RANGE_TFC":
                this.map.instrument.showTraffic = !this.map.instrument.showTraffic;
                break;
            case "BTN_WXR":
                if (this.wxRadarOn) {
                    SimVar.SetSimVarValue("L:BTN_WX_ACTIVE", "number", 0);
                }
                else {
                    SimVar.SetSimVarValue("L:BTN_WX_ACTIVE", "number", 1);
                    SimVar.SetSimVarValue("L:BTN_TERRONND_ACTIVE", "number", 0);
                }
                break;
            case "BTN_STA":
                this.map.instrument.showVORs = !this.map.instrument.showVORs;
                this._updateNDFiltersStatuses();
                break;
            case "BTN_WPT":
                this.map.instrument.showIntersections = !this.map.instrument.showIntersections;
                this._updateNDFiltersStatuses();
                break;
            case "BTN_ARPT":
                this.map.instrument.showAirports = !this.map.instrument.showAirports;
                this._updateNDFiltersStatuses();
                break;
            case "BTN_DATA":
                //this.map.instrument.showConstraints = !this.map.instrument.showConstraints;
                //this._updateNDFiltersStatuses();
                break;
            case "BTN_POS":
                break;
            case "BTN_TERR":
                if (this.terrainOn) {
                    SimVar.SetSimVarValue("L:BTN_TERRONND_ACTIVE", "number", 0);
                }
                else {
                    SimVar.SetSimVarValue("L:BTN_TERRONND_ACTIVE", "number", 1);
                    SimVar.SetSimVarValue("L:BTN_WX_ACTIVE", "number", 0);
                }
                break;
        }
    }
    _updateNDFiltersStatuses() {
        SimVar.SetSimVarValue("L:BTN_CSTR_FILTER_ACTIVE", "number", this.map.instrument.showConstraints ? 1 : 0);
        SimVar.SetSimVarValue("L:BTN_VORD_FILTER_ACTIVE", "number", this.map.instrument.showVORs ? 1 : 0);
        SimVar.SetSimVarValue("L:BTN_WPT_FILTER_ACTIVE", "number", this.map.instrument.showIntersections ? 1 : 0);
        SimVar.SetSimVarValue("L:BTN_NDB_FILTER_ACTIVE", "number", this.map.instrument.showVORs ? 1 : 0);
        SimVar.SetSimVarValue("L:BTN_ARPT_FILTER_ACTIVE", "number", this.map.instrument.showAirports ? 1 : 0);
    }
    updateMap(_deltaTime) {
        if (this.modeChangeMask && this.modeChangeTimer >= 0) {
            this.modeChangeTimer -= _deltaTime / 1000;
            if (this.modeChangeTimer <= 0) {
                this.modeChangeMask.style.display = "none";
                this.modeChangeTimer = -1;
            }
        }
        var wxRadarOn = SimVar.GetSimVarValue("L:BTN_WX_ACTIVE", "bool");
        var terrainOn = SimVar.GetSimVarValue("L:BTN_TERRONND_ACTIVE", "number");
        var mapMode = SimVar.GetSimVarValue("L:B747_8_MFD_NAV_MODE", "number");
        var mapRange = SimVar.GetSimVarValue("L:B747_8_MFD_Range", "number");
        if (this.wxRadarOn != wxRadarOn || this.terrainOn != terrainOn || this.mapMode != mapMode || this.forceMapUpdate) {
            this.wxRadarOn = wxRadarOn;
            this.terrainOn = terrainOn;
            this.mapMode = mapMode;
            this.forceMapUpdate = false;
            this.setMapMode(this.mapIsCentered, this.mapMode);
            if (this.terrainOn) {
                this.mapConfigId = 1;
                this.map.instrument.bingMap.setVisible(false);
            }
            else if (this.wxRadarOn && mapMode != 3) {
                this.showWeather();
                this.map.instrument.bingMap.setVisible(true);
            }
            else {
                this.mapConfigId = 0;
            }
            if (this.compass.svg.displayMode === Jet_NDCompass_Display.ARC) {
                this.map.showCompassMask();
                this.map.hidePlanMask();
            }
            else {
                this.map.showPlanMask();
                this.map.hideCompassMask();
            }
            if (this.modeChangeMask) {
                this.modeChangeMask.style.display = "block";
                this.modeChangeTimer = 0.15;
            }
        } else if (!this.wxRadarOn && !this.terrainOn && this.map.instrument.showAirports) {
            //this.map.instrument.bingMap.setVisible(true);
        } else if (!this.wxRadarOn && !this.terrainOn) {
            this.map.instrument.bingMap.setVisible(false);
        }
        switch (this.mapConfigId) {
            case 0:
                if (this.map.instrument.mapConfigId != 0) {
                    this.map.instrument.mapConfigId = 0;
                    this.map.instrument.bingMapRef = EBingReference.SEA;
                }
                break;
            case 1:
                let altitude = Simplane.getAltitudeAboveGround();
                if (altitude >= 500 && this.map.instrument.mapConfigId != 1) {
                    this.map.instrument.mapConfigId = 1;
                    this.map.instrument.bingMapRef = EBingReference.PLANE;
                }
                else if (altitude < 490 && this.map.instrument.mapConfigId != 0) {
                    this.map.instrument.mapConfigId = 0;
                    this.map.instrument.bingMapRef = EBingReference.SEA;
                }
                break;
        }
        if (this.mapRange != mapRange) {
            this.mapRange = mapRange;
            this.map.instrument.setZoom(this.mapRange);
            this.compass.svg.mapRange = this.map.zoomRanges[this.mapRange];
        }
    }
    
    setMapMode(_centered, _mode) {
        SimVar.SetSimVarValue("L:B747_MAP_MODE", "number", _mode);

        const modeSwitch = {
            0: Jet_NDCompass_Navigation.ILS,
            1: Jet_NDCompass_Navigation.VOR,
            2: Jet_NDCompass_Navigation.NAV,
            3: Jet_NDCompass_Navigation.NAV
        };

        var navStyle = modeSwitch[_mode];

        var compassStyle;

        if (_mode === 3) {
            compassStyle = Jet_NDCompass_Display.PLAN;
            this.gps.setAttribute("mapstyle", "plan");
        } else if (_centered) {
            compassStyle = Jet_NDCompass_Display.ROSE;
            this.gps.setAttribute("mapstyle", "rose");
        } else {
            compassStyle = Jet_NDCompass_Display.ARC;
            this.gps.setAttribute("mapstyle", "arc");
        }

        this.compass.svg.setMode(compassStyle, navStyle);
        this.map.setMode(compassStyle);
        this.info.setMode(navStyle);

        
        this.compass.svg.showArcRange(false);
        SimVar.SetSimVarValue("L:FMC_UPDATE_CURRENT_PAGE", "number", 1);
    }

    showWeather() {
        this.setMapMode(this.mapIsCentered, this.mapMode);
        this.compass.svg.showArcRange(true);
        this.map.showWeather();
    }
    updateNDInfo(_deltaTime) {
        this.info.showSymbol(B747_8_ND_Symbol.WXR, this.wxRadarOn);
        this.info.showSymbol(B747_8_ND_Symbol.WXRINFO, this.wxRadarOn);
        this.info.showSymbol(B747_8_ND_Symbol.TERR, this.terrainOn);
        this.info.showSymbol(B747_8_ND_Symbol.STA, this.map.instrument.showVORs);
        this.info.showSymbol(B747_8_ND_Symbol.WPT, this.map.instrument.showIntersections);
        this.info.showSymbol(B747_8_ND_Symbol.ARPT, this.map.instrument.showAirports);
        this.info.showSymbol(B747_8_ND_Symbol.TFC, this.map.instrument.showTraffic);
    }
    updateDeviationScale() {
        if (SimVar.GetSimVarValue("L:AIRLINER_FLIGHT_PHASE", "number") === 5 || SimVar.GetSimVarValue("L:AIRLINER_FLIGHT_PHASE", "number") === 6) {
            const mapMode = SimVar.GetSimVarValue("L:B747_8_MFD_NAV_MODE", "number");
            if (mapMode === 3) {
                this.deviationItems.style.visibility = "hidden";
                return;
            }
            let pathDeviation = SimVar.GetSimVarValue("L:WT_CJ4_VPATH_ALT_DEV", "feet");
            let correctedDeviation = pathDeviation / 6.67;
            let absDeviation = Math.abs(pathDeviation);
            this.deviationItems.style.visibility = "visible";
            this.deviationPointer.setAttribute("d", "M 560 " + Utils.Clamp((430 + correctedDeviation), 370, 490) + " l 8 -5 l 8 5 l -8 5 Z");
            if (pathDeviation > 0) {
                this.deviationTextTop.style.visibility = "hidden";
                this.deviationTextBottom.style.visibility = "visible";
                if (absDeviation >= 100) {
                    this.deviationTextBottom.textContent = Math.min(Math.abs(Math.round(pathDeviation / 10) * 10), 9999).toFixed(0);
                }
                else {
                    this.deviationTextBottom.textContent = Math.min(pathDeviation.toFixed(0), 9999);
                }
            }
            else {
                this.deviationTextBottom.style.visibility = "hidden";
                this.deviationTextTop.style.visibility = "visible";
                if (absDeviation >= 100) {
                    this.deviationTextTop.textContent = Math.min(Math.abs(Math.round(pathDeviation / 10) * 10), 9999).toFixed(0);
                }
                else {
                    this.deviationTextTop.textContent = Math.min(Math.abs(pathDeviation), 9999).toFixed(0);
                }
            }
            if (absDeviation <= 20) {
                this.deviationTextTop.style.visibility = "hidden";
                this.deviationTextBottom.style.visibility = "hidden";
            }
        }
        else {
            this.deviationItems.style.visibility = "hidden";
        }
    }
}
class B747_8_MFD_Compass extends NavSystemElement {
    init(root) {
        this.svg = this.gps.getChildById("Compass");
        this.svg.aircraft = Aircraft.B747_8;
        this.svg.gps = this.gps;
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        this.svg.update(_deltaTime);
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
class B747_8_MFD_Map extends MapInstrumentElement {
    constructor() {
        super(...arguments);
        this.zoomRanges = [0.25, 0.5, 1, 2, 5, 10, 20, 40, 80, 160, 320, 640];
    }
    init(root) {
        super.init(root);
    }
    onTemplateLoaded() {
        super.onTemplateLoaded();
        this.compassModeMask = new SvgBottomMaskElement("b747-compass-mask", 0, 30);
        this.planModeMask = new SvgPlanMaskElement("b747-plan-mask", 0, -45);
    }
    getAdaptiveRanges(_factor) {
        let ranges = Array.from(this.zoomRanges);
        for (let i = 0; i < ranges.length; i++)
            ranges[i] *= _factor;
        return ranges;
    }
    setMode(display) {
        this.hideWeather();
        this.display = display;
        switch (display) {
            case Jet_NDCompass_Display.ROSE:
                {
                    this.instrument.zoomRanges = this.getAdaptiveRanges(2.0);
                    this.instrument.style.top = "0%";
                    this.instrument.rotateWithPlane(true);
                    this.instrument.centerOnActiveWaypoint(false);
                    this.instrument.setPlaneScale(2.25);
                    break;
                }
            case Jet_NDCompass_Display.ARC:
                {
                    this.instrument.zoomRanges = this.getAdaptiveRanges(2.15);
                    this.instrument.style.top = "25%";
                    this.instrument.rotateWithPlane(true);
                    this.instrument.centerOnActiveWaypoint(false);
                    this.instrument.setPlaneScale(2.75);
                    break;
                }
            case Jet_NDCompass_Display.PLAN:
                {
                    this.instrument.zoomRanges = this.getAdaptiveRanges(2.2);
                    this.instrument.style.top = "0%";
                    this.instrument.rotateWithPlane(false);
                    this.instrument.centerOnActiveWaypoint(true);
                    this.instrument.setPlaneScale(1.5);
                    break;
                }
            default:
                this.instrument.style.top = "0%";
                this.instrument.rotateWithPlane(false);
                this.instrument.centerOnActiveWaypoint(false);
                this.instrument.setPlaneScale(1.0);
                break;
        }
    }
    showWeather() {
        this.instrument.showWeatherWithGPS(EWeatherRadar.HORIZONTAL, Math.PI * 2);
        this.instrument.setBingMapStyle("2.25%", "4.0%", "92%", "92%");
    }
    hideWeather() {
        if (this.instrument.getWeather() != EWeatherRadar.OFF) {
            this.instrument.showWeather(EWeatherRadar.OFF);
        }
    }
    showCompassMask() {
        if (this.compassModeMask) {
            if (this.instrument.maskElements.indexOf(this.compassModeMask) === -1) {
                this.instrument.maskElements.push(this.compassModeMask);
            }
        }
    }
    hideCompassMask() {
        if (this.compassModeMask) {
            let maskIndex = this.instrument.maskElements.indexOf(this.compassModeMask);
            if (maskIndex !== -1) {
                this.instrument.maskElements.splice(maskIndex, 1);
            }
        }
    }
    showPlanMask() {
        if (this.planModeMask) {
            if (this.instrument.maskElements.indexOf(this.planModeMask) === -1) {
                this.instrument.maskElements.push(this.planModeMask);
            }
            if (this.display == Jet_NDCompass_Display.ROSE)
                this.planModeMask.offset(0, -45);
            else
                this.planModeMask.offset(0, -15);
        }
    }
    hidePlanMask() {
        if (this.planModeMask) {
            let maskIndex = this.instrument.maskElements.indexOf(this.planModeMask);
            if (maskIndex !== -1) {
                this.instrument.maskElements.splice(maskIndex, 1);
            }
        }
    }
}
var B747_8_ND_Symbol;
(function (B747_8_ND_Symbol) {
    B747_8_ND_Symbol[B747_8_ND_Symbol["ARPT"] = 0] = "ARPT";
    B747_8_ND_Symbol[B747_8_ND_Symbol["WPT"] = 1] = "WPT";
    B747_8_ND_Symbol[B747_8_ND_Symbol["STA"] = 2] = "STA";
    B747_8_ND_Symbol[B747_8_ND_Symbol["TERR"] = 3] = "TERR";
    B747_8_ND_Symbol[B747_8_ND_Symbol["WXR"] = 4] = "WXR";
    B747_8_ND_Symbol[B747_8_ND_Symbol["WXRINFO"] = 5] = "WXRINFO";
    B747_8_ND_Symbol[B747_8_ND_Symbol["TFC"] = 6] = "TFC";
})(B747_8_ND_Symbol || (B747_8_ND_Symbol = {}));
class B747_8_MFD_NDInfo extends NavSystemElement {
    constructor() {
        super(...arguments);
        this.allSymbols = new Array();
    }
    init(root) {
        this.ndInfo = this.gps.getChildById("NDInfo");
        this.gs = this.ndInfo.querySelector("#GS_Value");
        this.tasText = this.ndInfo.querySelector("#TAS_Text");
        this.tasVal = this.ndInfo.querySelector("#TAS_Value");
        this.windDirection = this.ndInfo.querySelector("#Wind_Direction");
        this.windStrength = this.ndInfo.querySelector("#Wind_Strength");
        this.windArrow = this.ndInfo.querySelector("#Wind_Arrow");
        this.windSeperator = this.ndInfo.querySelector("#Wind_Separator");
        this.wpData = this.ndInfo.querySelector("#WP_Data");
        this.zuluETA = document.querySelector("#WP_ZuluTime");
        this.zuluClock = document.querySelector("#ZuluClock_Time");
        this.waypointDistance = document.querySelector("#WP_Distance_Value");
        this.ndInfo.aircraft = Aircraft.B747_8;
        this.ndInfo.gps = this.gps;
        this.allSymbols.push(this.ndInfo.querySelector("#ARPT"));
        this.allSymbols.push(this.ndInfo.querySelector("#WPT"));
        this.allSymbols.push(this.ndInfo.querySelector("#STA"));
        this.allSymbols.push(this.ndInfo.querySelector("#TERR"));
        this.allSymbols.push(this.ndInfo.querySelector("#WXR"));
        this.allSymbols.push(this.ndInfo.querySelector("#WXRInfo"));
        this.allSymbols.push(this.ndInfo.querySelector("#TFC"));
        this.greenArc = document.querySelector("#greenArc");
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        if (this.ndInfo != null) {
            this.ndInfo.update(_deltaTime);
        }

        const IRSState = SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum");
        const groundSpeed = Math.round(Simplane.getGroundSpeed());
        const utcTime = SimVar.GetGlobalVarValue("ZULU TIME", "seconds");
        let showData;

        this.zuluETA.textContent = "------";
        if (Simplane.getNextWaypointName() && !SimVar.GetSimVarValue("SIM ON GROUND", "bool")) {
            const wpETE = Simplane.getNextWaypointETA();
            const utcETA = wpETE > 0 ? (utcTime + wpETE) % 86400 : 0;
            const hours = Math.floor(utcETA / 3600);
            const minutes = Math.floor((utcETA % 3600) / 60);
            const tenths = Math.floor((utcETA % 3600) / 600);
            this.zuluETA.textContent = `${hours.toString().padStart(2, "0")}${minutes.toString().padStart(2, "0")}.${tenths.toString().padStart(1, "0")}`;
        }
        const seconds = Number.parseInt(utcTime);
        const time = Utils.SecondsToDisplayTime(seconds, true, true, false);

        this.zuluClock.textContent = time.toString();
        this.waypointDistance.textContent = "---"

        if (Simplane.getNextWaypointName()) {
            const nextWaypointDistance = Simplane.getNextWaypointDistance();
            if (nextWaypointDistance > 100) {
                this.waypointDistance.textContent = nextWaypointDistance.toFixed(0);
            } else {
                this.waypointDistance.textContent = nextWaypointDistance.toFixed(1);
            }
        }
        if (IRSState != 2 || groundSpeed < 100) {
            showData = false; 
        }
        else {
            showData = true;
        }

        this.tasText.setAttribute("visibility", showData ? "visible" : "hidden");
        this.tasVal.setAttribute("visibility", showData ? "visible" : "hidden");
        this.windSeperator.setAttribute("visibility", showData ? "visible" : "hidden");
        this.windDirection.setAttribute("visibility", showData ? "visible" : "hidden");
        this.windStrength.setAttribute("visibility", showData ? "visible" : "hidden");
        this.windArrow.setAttribute("visibility", showData ? "visible" : "hidden");

        if (IRSState != 2) {
            this.gs.textContent = "---";
            this.wpData.setAttribute("visibility", "hidden");
        }
        else {
            this.gs.textContent = groundSpeed.toString().padStart(3); 
            this.wpData.setAttribute("visibility", "visible"); 
        }
    }

    onExit() {
    }
    onEvent(_event) {
    }
    setMode(display) {
        if (this.ndInfo) {
            this.ndInfo.setMode(display, 0);
        }
    }
    showSymbol(_symbol, _show) {
        if (this.allSymbols[_symbol])
            this.allSymbols[_symbol].setAttribute("visibility", (_show) ? "visible" : "hidden");
    }
}
registerInstrument("b747-8-mfd-element", B747_8_MFD);
//# sourceMappingURL=B747_8_MFD.js.map