class BaseGPS extends NavSystem {
    constructor() {
        super();
        this.currentlySelectedFreq = 0;
        this.navIndex = 1;
        this.comIndex = 1;
        this.airportWaypointsIcaoSearchField = new SearchFieldWaypointICAO(this, [], this, "A");
        this.addEventAlias("RightSmallKnob_Right", "NavigationSmallInc");
        this.addEventAlias("RightSmallKnob_Left", "NavigationSmallDec");
        this.addEventAlias("RightLargeKnob_Right", "NavigationLargeInc");
        this.addEventAlias("RightLargeKnob_Left", "NavigationLargeDec");
        this.addEventAlias("RightSmallKnob_Push", "NavigationPush");
    }
    connectedCallback() {
        super.connectedCallback();
        this.comActive = this.getChildById("ComActive");
        this.comStandby = this.getChildById("ComStandby");
        this.vlocActive = this.getChildById("VlocActive");
        this.vlocStandby = this.getChildById("VlocStandby");
        this.botRadioPartMid = this.getChildById("BotRadioPartMid");
        this.pagesContainer = this.getChildById("GpsPart");
        this.menuTitle = this.getChildById("MenuTitle");
        this.pagePos = this.getChildById("PagePos");
        this.msgAlert = this.getChildById("MsgAlert");
        this.CDIState = this.getChildById("Gps");
        this.messageList = new MessageList(this);
        this.selectApproachPage = new NavSystemElementContainer("ApproachSelection", "ApproachSelection", new GPS_ApproachSelection());
        this.selectApproachPage.setGPS(this);
        this.selectArrivalPage = new NavSystemElementContainer("ArrivalSelection", "ArrivalSelection", new GPS_ArrivalSelection());
        this.selectArrivalPage.setGPS(this);
        this.selectDeparturePage = new NavSystemElementContainer("DepartureSelection", "DepartureSelection", new GPS_DepartureSelection());
        this.selectDeparturePage.setGPS(this);
        SimVar.SetSimVarValue("L:" + this.templateID + "_SelectedSource", "number", this.currentlySelectedFreq + 1);
    }
    parseXMLConfig() {
        super.parseXMLConfig();
        if (this.instrumentXmlConfig) {
            let comElem = this.instrumentXmlConfig.getElementsByTagName("ComIndex");
            if (comElem.length > 0) {
                this.comIndex = parseInt(comElem[0].textContent);
            }
            let navElem = this.instrumentXmlConfig.getElementsByTagName("NavIndex");
            if (navElem.length > 0) {
                this.navIndex = parseInt(navElem[0].textContent);
            }
        }
    }
    onEvent(_event) {
        super.onEvent(_event);
        if (_event == "LeftSmallKnob_Push") {
            this.currentlySelectedFreq = 1 - this.currentlySelectedFreq;
            SimVar.SetSimVarValue("L:" + this.templateID + "_SelectedSource", "number", this.currentlySelectedFreq + 1);
        }
        if (_event == "LeftSmallKnob_Right") {
            if (this.currentlySelectedFreq == 0) {
                SimVar.SetSimVarValue("K:COM" + (this.comIndex == 1 ? "" : this.comIndex) + "_RADIO_FRACT_INC", "number", 0);
            }
            else {
                SimVar.SetSimVarValue("K:NAV" + this.navIndex + "_RADIO_FRACT_INC", "number", 0);
            }
        }
        if (_event == "LeftSmallKnob_Left") {
            if (this.currentlySelectedFreq == 0) {
                SimVar.SetSimVarValue("K:COM" + (this.comIndex == 1 ? "" : this.comIndex) + "_RADIO_FRACT_DEC", "number", 0);
            }
            else {
                SimVar.SetSimVarValue("K:NAV" + this.navIndex + "_RADIO_FRACT_DEC", "number", 0);
            }
        }
        if (_event == "LeftLargeKnob_Right") {
            if (this.currentlySelectedFreq == 0) {
                SimVar.SetSimVarValue("K:COM" + (this.comIndex == 1 ? "" : this.comIndex) + "_RADIO_WHOLE_INC", "number", 0);
            }
            else {
                SimVar.SetSimVarValue("K:NAV" + this.navIndex + "_RADIO_WHOLE_INC", "number", 0);
            }
        }
        if (_event == "LeftLargeKnob_Left") {
            if (this.currentlySelectedFreq == 0) {
                SimVar.SetSimVarValue("K:COM" + (this.comIndex == 1 ? "" : this.comIndex) + "_RADIO_WHOLE_DEC", "number", 0);
            }
            else {
                SimVar.SetSimVarValue("K:NAV" + this.navIndex + "_RADIO_WHOLE_DEC", "number", 0);
            }
        }
        if (_event == "CLR_Push_Long") {
            this.SwitchToInteractionState(0);
            this.SwitchToPageName("NAV", "DefaultNav");
            this.currentEventLinkedPageGroup = null;
        }
        if (_event == "CLR_Push") {
            let map = this.getChildById("MapInstrument");
            if (map) {
                map.declutterLevel++;
                if (map.declutterLevel > 1) {
                    map.declutterLevel = 0;
                }
            }
        }
        if (_event == "COMSWAP_Push") {
            SimVar.SetSimVarValue("K:COM" + (this.comIndex == 1 ? "_STBY" : this.comIndex) + "_RADIO_SWAP", "boolean", 0);
        }
        if (_event == "NAVSWAP_Push") {
            SimVar.SetSimVarValue("K:NAV" + this.navIndex + "_RADIO_SWAP", "boolean", 0);
        }
        if (_event == "ID") {
            SimVar.SetSimVarValue("K:RADIO_VOR" + this.navIndex + "_IDENT_TOGGLE", "boolean", 0);
        }
    }
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
        diffAndSetText(this.CDIState, SimVar.GetSimVarValue("GPS DRIVES NAV1", "boolean") == 0 ? "VLOC" : "GPS");
        this.messageList.Update();
        if (this.messageList.messages.length > 0) {
            diffAndSetAttribute(this.msgAlert, "style", "visibility: visible");
            if (this.messageList.hasNewMessages()) {
                diffAndSetAttribute(this.msgAlert, "state", this.blinkGetState(1000, 500) ? "Blink" : "None");
            }
            else {
                diffAndSetAttribute(this.msgAlert, "state", "None");
            }
        }
        else {
            diffAndSetAttribute(this.msgAlert, "style", "visibility: hidden");
        }
        diffAndSetHTML(this.comActive, this.frequencyFormat(Simplane.getComActFreq(this.comIndex), SimVar.GetSimVarValue("COM SPACING MODE:" + this.comIndex, "Enum") == 0 ? 2 : 3));
        diffAndSetHTML(this.comStandby, this.frequencyFormat(SimVar.GetSimVarValue("COM STANDBY FREQUENCY:" + this.comIndex, "MHz"), SimVar.GetSimVarValue("COM SPACING MODE:" + this.comIndex, "Enum") == 0 ? 2 : 3));
        diffAndSetHTML(this.vlocActive, this.frequencyFormat(Simplane.getNavActFreq(this.navIndex), 2));
        diffAndSetHTML(this.vlocStandby, this.frequencyFormat(SimVar.GetSimVarValue("NAV STANDBY FREQUENCY:" + this.navIndex, "MHz"), 2));
        if (this.currentlySelectedFreq == 0) {
            diffAndSetAttribute(this.comStandby, "state", "Selected");
            diffAndSetAttribute(this.vlocStandby, "state", "Unselected");
        }
        else {
            diffAndSetAttribute(this.vlocStandby, "state", "Selected");
            diffAndSetAttribute(this.comStandby, "state", "Unselected");
        }
        if (SimVar.GetSimVarValue("C:fs9gps:FlightPlanIsActiveFlightPlan", "Boolean")) {
            var distance = SimVar.GetSimVarValue("GPS WP DISTANCE", "nautical mile");
            if (SimVar.GetSimVarValue("C:fs9gps:FlightPlanIsActiveApproach", "Boolean")) {
                this.currentMode = 3;
                diffAndSetText(this.botRadioPartMid, "APPR");
            }
            else if (SimVar.GetSimVarValue("GPS FLIGHT PLAN WP COUNT", "number") == (SimVar.GetSimVarValue("GPS FLIGHT PLAN WP INDEX", "number") + 1) && distance <= 30) {
                if (distance <= 10) {
                    this.currentMode = 3;
                    diffAndSetText(this.botRadioPartMid, "APPR");
                }
                else {
                    this.currentMode = 2;
                    diffAndSetText(this.botRadioPartMid, "TERM");
                }
            }
            else {
                this.currentMode = 1;
                diffAndSetText(this.botRadioPartMid, "ENR");
            }
        }
        else {
            diffAndSetText(this.botRadioPartMid, "ENR");
            this.currentMode = 0;
        }
        var pagesMenu = "";
        for (var i = 0; i < this.getCurrentPageGroup().pages.length; i++) {
            if (i == this.getCurrentPageGroup().pageIndex) {
                pagesMenu += '<div class="PageSelect" state="Active"></div>';
            }
            else {
                pagesMenu += '<div class="PageSelect" state="Inactive"></div>';
            }
        }
        diffAndSetHTML(this.pagePos, pagesMenu);
        diffAndSetText(this.menuTitle, this.getCurrentPageGroup().name);
    }
}
class GPS_DefaultNavPage extends NavSystemPage {
    constructor(_customValuesNumber = 6, _customValuesDefaults = [4, 3, 0, 9, 10, 7]) {
        var cdiElem = new CDIElement();
        var baseElem = new GPS_DefaultNav(_customValuesNumber, _customValuesDefaults);
        super("DefaultNav", "DefaultNav", new NavSystemElementGroup([baseElem, cdiElem]));
        this.cdiElement = cdiElem;
        this.baseElem = baseElem;
    }
    init() {
        this.defaultMenu = new ContextualMenu("PAGE MENU", [
            new ContextualMenuElement("Crossfill?", null, true),
            new ContextualMenuElement("Change&nbsp;Fields?", this.gps.ActiveSelection.bind(this.gps, this.baseElem.dnCustomSelectableArray), false),
            new ContextualMenuElement("Restore&nbsp;Defaults?", this.baseElem.restoreCustomValues.bind(this.baseElem))
        ]);
    }
}
class GPS_DefaultNav extends NavSystemElement {
    constructor(_customValuesNumber = 6, _customValuesDefaults = [4, 3, 0, 9, 10, 7]) {
        super();
        this.dnCustoms = [];
        this.legSymbol = 0;
        this.name = "DefaultNav";
        this.customValuesNumber = _customValuesNumber;
        this.customValuesDefault = _customValuesDefaults;
    }
    init() {
        this.currBranchFrom = this.gps.getChildById("CurrBranchFrom");
        this.currBranchArrow = this.gps.getChildById("CurrBranchArrow");
        this.currBranchTo = this.gps.getChildById("CurrBranchTo");
        this.dnCustoms = [];
        this.dnCustomSelectableArray = [];
        for (let i = 0; i < this.customValuesNumber; i++) {
            let num = i + 1;
            this.dnCustoms.push(new CustomValue(this.gps, "DNName" + num, "DNValue" + num, "DNUnit" + num));
            this.dnCustomSelectableArray.push(new SelectableElement(this.gps, this.dnCustoms[i].nameDisplay, this.customValueSelect_CB.bind(this, i)));
        }
        this.dnCustomFieldSelectorMenu = new ContextualMenu("SELECT&nbsp;FIELD&nbsp;TYPE", [
            new ContextualMenuElement("BRG&nbsp;&nbsp;-&nbsp;Bearing", this.customValueSet_CB.bind(this, 0)),
            new ContextualMenuElement("CTS&nbsp;&nbsp;-&nbsp;Course&nbsp;To&nbsp;Steer", this.customValueSet_CB.bind(this, 1)),
            new ContextualMenuElement("XTK&nbsp;&nbsp;-&nbsp;Cross&nbsp;Track&nbsp;Err", this.customValueSet_CB.bind(this, 2)),
            new ContextualMenuElement("DTK&nbsp;&nbsp;-&nbsp;Desired&nbsp;Track", this.customValueSet_CB.bind(this, 3)),
            new ContextualMenuElement("DIS&nbsp;&nbsp;-&nbsp;Distance", this.customValueSet_CB.bind(this, 4)),
            new ContextualMenuElement("ESA&nbsp;&nbsp;-&nbsp;Enrte&nbsp;Safe&nbsp;Alt", this.customValueSet_CB.bind(this, 5)),
            new ContextualMenuElement("ETA&nbsp;&nbsp;-&nbsp;Est&nbsp;Time&nbsp;Arvl", this.customValueSet_CB.bind(this, 6)),
            new ContextualMenuElement("ETE&nbsp;&nbsp;-&nbsp;Est&nbsp;Time&nbsp;Enrte", this.customValueSet_CB.bind(this, 7)),
            new ContextualMenuElement("FLOW&nbsp;-&nbsp;Fuel&nbsp;Flow", this.customValueSet_CB.bind(this, 8)),
            new ContextualMenuElement("GS&nbsp;&nbsp;&nbsp;-&nbsp;Ground&nbsp;Speed", this.customValueSet_CB.bind(this, 9)),
            new ContextualMenuElement("TRK&nbsp;&nbsp;-&nbsp;Ground&nbsp;Track", this.customValueSet_CB.bind(this, 10)),
            new ContextualMenuElement("MSA&nbsp;&nbsp;-&nbsp;Min&nbsp;Safe&nbsp;Alt", this.customValueSet_CB.bind(this, 11)),
            new ContextualMenuElement("TKE&nbsp;&nbsp;-&nbsp;Track&nbsp;Angle&nbsp;Err", this.customValueSet_CB.bind(this, 12)),
            new ContextualMenuElement("VSR&nbsp;-&nbsp;Vert&nbsp;Speed&nbsp;Rqrd", this.customValueSet_CB.bind(this, 13)),
        ]);
        this.restoreCustomValues();
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        diffAndSetText(this.currBranchFrom, SimVar.GetSimVarValue("GPS WP PREV ID", "string"));
        if (this.gps.currFlightPlanManager.getIsDirectTo()) {
            if (this.legSymbol != 1) {
                diffAndSetHTML(this.currBranchArrow, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/GPS/direct_to.png" class="imgSizeM"/>');
                this.legSymbol = 1;
            }
        }
        else {
            if (SimVar.GetSimVarValue("GPS IS APPROACH ACTIVE", "Boolean")) {
                let approachType = SimVar.GetSimVarValue("GPS APPROACH WP TYPE", "number");
                switch (approachType) {
                    case 0:
                    case 1:
                    case 8:
                    case 9:
                    case 10:
                        if (this.legSymbol != 2) {
                            diffAndSetHTML(this.currBranchArrow, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/GPS/course_to.png" class="imgSizeM"/>');
                            this.legSymbol = 2;
                        }
                        break;
                    case 2:
                        if (this.legSymbol != 3) {
                            diffAndSetHTML(this.currBranchArrow, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/GPS/left_turn.png" class="imgSizeM"/>');
                            this.legSymbol = 3;
                        }
                        break;
                    case 3:
                        if (this.legSymbol != 4) {
                            diffAndSetHTML(this.currBranchArrow, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/GPS/right_turn.png" class="imgSizeM"/>');
                            this.legSymbol = 4;
                        }
                        break;
                    case 4:
                        if (this.legSymbol != 5) {
                            diffAndSetHTML(this.currBranchArrow, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/GPS/arc_left.png" class="imgSizeM"/>');
                            this.legSymbol = 5;
                        }
                        break;
                    case 5:
                        if (this.legSymbol != 6) {
                            diffAndSetHTML(this.currBranchArrow, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/GPS/arc_right.png" class="imgSizeM"/>');
                            this.legSymbol = 6;
                        }
                        break;
                    case 6:
                        if (this.legSymbol != 7) {
                            diffAndSetHTML(this.currBranchArrow, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/GPS/left_hand.png" class="imgSizeM"/>');
                            this.legSymbol = 7;
                        }
                        break;
                    case 7:
                        if (this.legSymbol != 8) {
                            diffAndSetHTML(this.currBranchArrow, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/GPS/right_hand.png" class="imgSizeM"/>');
                            this.legSymbol = 8;
                        }
                        break;
                    case 11:
                        if (this.legSymbol != 9) {
                            diffAndSetHTML(this.currBranchArrow, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/GPS/vectors_to_final.png" class="imgSizeM"/>');
                            this.legSymbol = 9;
                        }
                        break;
                }
            }
            else {
                if (this.legSymbol != 2) {
                    diffAndSetHTML(this.currBranchArrow, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/GPS/course_to.png" class="imgSizeM"/>');
                    this.legSymbol = 2;
                }
            }
        }
        diffAndSetText(this.currBranchTo, Simplane.getGPSWpNextID());
        for (var i = 0; i < this.dnCustoms.length; i++) {
            this.dnCustoms[i].Update();
        }
    }
    onExit() {
    }
    onEvent(_event) {
    }
    customValueSelect_CB(_param, _event) {
        switch (_event) {
            case "RightSmallKnob_Right":
            case "RightSmallKnob_Left":
                this.selectedCustomValueIndex = _param;
                this.gps.ShowContextualMenu(this.dnCustomFieldSelectorMenu);
                break;
            default:
                return false;
        }
        return true;
    }
    customValueSet_CB(_param) {
        this.dnCustoms[this.selectedCustomValueIndex].valueIndex = _param;
        this.gps.SwitchToInteractionState(1);
        this.gps.cursorIndex = this.selectedCustomValueIndex;
    }
    restoreCustomValues() {
        for (let i = 0; i < this.customValuesNumber; i++) {
            this.dnCustoms[i].valueIndex = this.customValuesDefault[i];
        }
        this.gps.SwitchToInteractionState(0);
    }
}
class GPS_ComNav extends NavSystemElement {
    constructor(_nbFreqMax = 5) {
        super();
        this.airportListOnPlan = [];
        this.airportListIndex = 0;
        this.nbFreqMax = 0;
        this.name = "ComNav";
        this.nbFreqMax = _nbFreqMax;
    }
    init() {
        this.comNavMain = this.gps.getChildById("ComNavMain");
        this.terrainStatus = this.gps.getChildById("TerrainStatus");
        this.terrainCode = this.gps.getChildById("TerrainCode");
        this.terrainType = this.gps.getChildById("TerrainType");
        this.terrainTypeLogo = this.gps.getChildById("TerrainTypeLogo");
        this.comNavSliderCursor = this.gps.getChildById("ComNavSliderCursor");
        this.comNavSlider = this.gps.getChildById("ComNavSlider");
        this.airportSelectionMenu = new ContextualMenu("AIRPORT", []);
        this.frequenciesSelectionGroup = new SelectableElementSliderGroup(this.gps, [], this.comNavSlider, this.comNavSliderCursor);
        for (let i = 0; i < this.nbFreqMax; i++) {
            this.frequenciesSelectionGroup.addElement(new SelectableElement(this.gps, this.gps.getChildById("ComNavFrequency_" + i), this.activeFrequency_CB.bind(this)));
        }
        this.defaultSelectables = [
            new SelectableElement(this.gps, this.terrainCode, this.airportSelection_CB.bind(this)),
            this.frequenciesSelectionGroup
        ];
    }
    airportSelection_CB(_event) {
        if (_event == "RightSmallKnob_Right" || _event == "RightSmallKnob_Left") {
            this.gps.ShowContextualMenu(this.airportSelectionMenu);
        }
        return false;
    }
    activeFrequency_CB(_event, _index) {
        if (_event == "ENT_Push") {
            if (this.airportListOnPlan[this.airportListIndex].GetInfos().frequencies[_index].mhValue >= 118) {
                SimVar.SetSimVarValue("K:COM" + (this.gps.comIndex == 1 ? "" : this.gps.comIndex) + "_STBY_RADIO_SET", "Frequency BCD16", this.airportListOnPlan[this.airportListIndex].GetInfos().frequencies[_index].bcd16Value);
            }
            else {
                SimVar.SetSimVarValue("K:NAV" + this.gps.navIndex + "_STBY_SET", "Frequency BCD16", this.airportListOnPlan[this.airportListIndex].GetInfos().frequencies[_index].bcd16Value);
            }
        }
    }
    onEnter() {
        this.gps.currFlightPlan.FillWithCurrentFP(function () {
            this.airportListOnPlan = this.gps.currFlightPlan.GetAirportList();
            this.airportSelectionMenu.elements = [];
            for (var i = 0; i < this.airportListOnPlan.length; i++) {
                this.airportSelectionMenu.elements.push(new ContextualMenuElement(this.airportListOnPlan[i].GetInfos().ident, this.setComAirtportListIndex_CB.bind(this, i)));
            }
            this.UpdateComDisplay();
        }.bind(this));
    }
    onUpdate(_deltaTime) {
        if (this.airportListOnPlan.length > 0) {
            this.UpdateComDisplay();
            if (this.airportListIndex > this.airportListOnPlan.length) {
                this.airportListIndex = 0;
            }
            if (this.airportListOnPlan[this.airportListIndex].GetInfos().privateType == 0) {
                this.airportListOnPlan[this.airportListIndex].UpdateInfos();
            }
            if (this.airportListIndex == 0) {
                diffAndSetText(this.terrainStatus, "DEPARTURE");
            }
            else if (this.airportListIndex == this.airportListOnPlan.length - 1) {
                diffAndSetText(this.terrainStatus, "ARRIVAL");
            }
            else {
                diffAndSetText(this.terrainStatus, "EN ROUTE");
            }
            diffAndSetText(this.terrainCode, this.airportListOnPlan[this.airportListIndex].GetInfos().ident);
            diffAndSetText(this.terrainType, this.gps.airportPrivateTypeStrFromEnum(this.airportListOnPlan[this.airportListIndex].GetInfos().privateType));
            var logo = this.airportListOnPlan[this.airportListIndex].GetInfos().GetSymbol();
            if (logo != "") {
                diffAndSetHTML(this.terrainTypeLogo, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/' + logo + '"/>');
            }
            else {
                diffAndSetHTML(this.terrainTypeLogo, "");
            }
        }
        else {
            diffAndSetText(this.terrainStatus, "");
            diffAndSetText(this.terrainCode, "");
            diffAndSetText(this.terrainType, "");
            diffAndSetHTML(this.terrainTypeLogo, "");
            this.airportListIndex = 0;
        }
    }
    onExit() {
    }
    onEvent(_event) {
    }
    setComAirtportListIndex_CB(_index) {
        this.airportListIndex = _index;
        this.UpdateComDisplay();
        this.gps.SwitchToInteractionState(0);
    }
    UpdateComDisplay() {
        this.airportListOnPlan[this.airportListIndex].UpdateInfos();
        var infos = this.airportListOnPlan[this.airportListIndex].GetInfos();
        var elements = [];
        if (infos && infos.frequencies) {
            for (let i = 0; i < infos.frequencies.length; i++) {
                elements.push('<div><div class="Align LeftDisplay">' + infos.frequencies[i].name.replace(" ", "&nbsp;").slice(0, 15) + '</div> <div class="Align RightValue SelectableElement">' + this.gps.frequencyFormat(infos.frequencies[i].mhValue, 3) + '</div></div>');
            }
        }
        this.frequenciesSelectionGroup.setStringElements(elements);
    }
}
class GPS_Position extends NavSystemElement {
    constructor() {
        super();
        this.referenceMode = 1;
        this.customValues = [];
        this.name = "Position";
    }
    init() {
        this.compassBackground = this.gps.getChildById("CompassBackground");
        this.positionValueNS = this.gps.getChildById("PositionValueNS");
        this.positionValueEW = this.gps.getChildById("PositionValueEW");
        this.timeValue = this.gps.getChildById("TimeValue");
        this.positionRefBearing = this.gps.getChildById("PositionRefBearing");
        this.positionRefDistance = this.gps.getChildById("PositionRefDistance");
        this.positionRefType = this.gps.getChildById("PositionRefType");
        this.positionRefMode = this.gps.getChildById("PositionRefMode");
        this.geoCalcReferenceRelative = new GeoCalcInfo(this.gps);
        this.posRefSearchField = new SearchFieldWaypointICAO(this.gps, [this.gps.getChildById("PositionRefID")], this.gps);
        this.customValues = [
            new CustomValue(this.gps, "PositionInfos1_Title", "PositionInfos1_Value", "PositionInfos1_Unit"),
            new CustomValue(this.gps, "PositionInfos2_Title", "PositionInfos2_Value", "PositionInfos2_Unit"),
            new CustomValue(this.gps, "PositionInfos3_Title", "PositionInfos3_Value", "PositionInfos3_Unit")
        ];
        this.posCustomSelectableArray = [
            new SelectableElement(this.gps, this.customValues[0].nameDisplay, this.customValueSelect.bind(this, 0)),
            new SelectableElement(this.gps, this.customValues[1].nameDisplay, this.customValueSelect.bind(this, 1)),
            new SelectableElement(this.gps, this.customValues[2].nameDisplay, this.customValueSelect.bind(this, 2)),
            new SelectableElement(this.gps, this.positionRefType, this.refTypeSelect.bind(this)),
            new SelectableElement(this.gps, this.positionRefMode, this.refModeSelect.bind(this)),
        ];
        this.posCustomFieldSelectorMenu = new ContextualMenu("SELECT&nbsp;FIELD&nbsp;TYPE", [
            new ContextualMenuElement("ALT&nbsp;&nbsp;-&nbsp;Altitude", this.customValueSet.bind(this, 14)),
            new ContextualMenuElement("BARO&nbsp;-&nbsp;Baro&nbsp;Pressure", this.customValueSet.bind(this, 15)),
            new ContextualMenuElement("GS&nbsp;&nbsp;&nbsp;-&nbsp;Ground&nbsp;Speed", this.customValueSet.bind(this, 9)),
            new ContextualMenuElement("MSA&nbsp;&nbsp;-&nbsp;Min&nbsp;Safe&nbsp;Alt", this.customValueSet.bind(this, 11)),
            new ContextualMenuElement("TRK&nbsp;&nbsp;-&nbsp;Track", this.customValueSet.bind(this, 10)),
        ]);
        this.posRefTypeSelectorMenu = new ContextualMenu("CATEGORY", [
            new ContextualMenuElement("APT", this.refTypeSet.bind(this, 'A')),
            new ContextualMenuElement("INT", this.refTypeSet.bind(this, 'I')),
            new ContextualMenuElement("NDB", this.refTypeSet.bind(this, 'N')),
            new ContextualMenuElement("VOR", this.refTypeSet.bind(this, 'V')),
            new ContextualMenuElement("USR", this.refTypeSet.bind(this, 'U')),
            new ContextualMenuElement("WPT", this.refTypeSet.bind(this, 'WANV')),
        ]);
        this.posRefModeSelectorMenu = new ContextualMenu("MODE", [
            new ContextualMenuElement("TO", this.refModeSet.bind(this, 0)),
            new ContextualMenuElement("FROM", this.refModeSet.bind(this, 1)),
        ]);
        this.container.defaultMenu = new ContextualMenu("PAGE MENU", [
            new ContextualMenuElement("Change&nbsp;Fields?", this.gps.ActiveSelection.bind(this.gps, this.posCustomSelectableArray), false),
            new ContextualMenuElement("Restore&nbsp;Defaults?", this.restoreCustomValues.bind(this))
        ]);
        this.defaultSelectables = [
            new SelectableElement(this.gps, this.posRefSearchField.elements[0], this.activeRefSearchField.bind(this))
        ];
        this.restoreCustomValues();
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        diffAndSetAttribute(this.compassBackground, "style", "Left:" + fastToFixed(((Simplane.getTrackAngle() * -125 / 90) - 40), 0) + "px");
        for (var i = 0; i < this.customValues.length; i++) {
            this.customValues[i].Update();
        }
        diffAndSetText(this.positionValueNS, this.gps.latitudeFormat(SimVar.GetSimVarValue("GPS POSITION LAT", "degree latitude")));
        diffAndSetText(this.positionValueEW, this.gps.longitudeFormat(SimVar.GetSimVarValue("GPS POSITION LON", "degree longitude")));
        var time = SimVar.GetGlobalVarValue("LOCAL TIME", "seconds");
        var hours = Math.floor(time / 3600);
        var minutes = Math.floor((time % 3600) / 60);
        var seconds = Math.floor(time % 60);
        diffAndSetText(this.timeValue, (hours < 10 ? "0" + fastToFixed(hours, 0) : fastToFixed(hours, 0)) + ":" + (minutes < 10 ? "0" + fastToFixed(minutes, 0) : fastToFixed(minutes, 0)) + ":" + (seconds < 10 ? "0" + fastToFixed(seconds, 0) : fastToFixed(seconds, 0)));
        var reference = this.posRefSearchField.getUpdatedInfos();
        if (this.referenceMode == 0) {
            diffAndSetText(this.positionRefMode, "TO");
        }
        else {
            diffAndSetText(this.positionRefMode, "FROM");
        }
        this.posRefSearchField.Update();
        if (reference.icao && this.geoCalcReferenceRelative.IsIdle()) {
            if (this.referenceMode == 0) {
                this.geoCalcReferenceRelative.SetParams(SimVar.GetSimVarValue("GPS POSITION LAT", "degree latitude"), SimVar.GetSimVarValue("GPS POSITION LON", "degree longitude"), reference.coordinates.lat, reference.coordinates.long);
            }
            else {
                this.geoCalcReferenceRelative.SetParams(reference.coordinates.lat, reference.coordinates.long, SimVar.GetSimVarValue("GPS POSITION LAT", "degree latitude"), SimVar.GetSimVarValue("GPS POSITION LON", "degree longitude"));
            }
            this.geoCalcReferenceRelative.Compute(function () {
                diffAndSetText(this.positionRefBearing, fastToFixed(this.geoCalcReferenceRelative.bearing, 0));
                diffAndSetText(this.positionRefDistance, fastToFixed(this.geoCalcReferenceRelative.distance, 0));
            }.bind(this));
        }
        else {
            diffAndSetText(this.positionRefBearing, "___");
            diffAndSetText(this.positionRefDistance, "__._");
        }
        switch (this.posRefSearchField.wpType) {
            case 'A':
                diffAndSetText(this.positionRefType, "APT");
                break;
            case 'N':
                diffAndSetText(this.positionRefType, "NDB");
                break;
            case 'V':
                diffAndSetText(this.positionRefType, "VOR");
                break;
            case 'W':
                diffAndSetText(this.positionRefType, "WPT");
                break;
            case 'U':
                diffAndSetText(this.positionRefType, "USR");
                break;
            case 'I':
                diffAndSetText(this.positionRefType, "INT");
                break;
            default:
                diffAndSetText(this.positionRefType, "WPT");
                break;
        }
    }
    onExit() {
    }
    onEvent(_event) {
    }
    restoreCustomValues() {
        this.customValues[0].valueIndex = 10;
        this.customValues[1].valueIndex = 9;
        this.customValues[2].valueIndex = 14;
        this.posRefSearchField.wpType = "A";
        this.referenceMode = 1;
        this.posRefSearchField.SetWaypoint("A", "");
        this.gps.SwitchToInteractionState(0);
    }
    customValueSelect(_index, _event) {
        switch (_event) {
            case "RightSmallKnob_Right":
            case "RightSmallKnob_Left":
                this.selectedCustomValueIndex = _index;
                this.gps.ShowContextualMenu(this.posCustomFieldSelectorMenu);
                break;
            default:
                return false;
        }
        return true;
    }
    customValueSet(_index) {
        this.customValues[this.selectedCustomValueIndex].valueIndex = _index;
        this.gps.SwitchToInteractionState(1);
        this.gps.cursorIndex = this.selectedCustomValueIndex;
    }
    refTypeSelect(_event) {
        switch (_event) {
            case "RightSmallKnob_Right":
            case "RightSmallKnob_Left":
                this.gps.ShowContextualMenu(this.posRefTypeSelectorMenu);
                break;
            default:
                return false;
        }
        return true;
    }
    refTypeSet(_type) {
        this.posRefSearchField.wpType = _type;
        this.gps.SwitchToInteractionState(0);
    }
    refModeSelect(_event) {
        switch (_event) {
            case "RightSmallKnob_Right":
            case "RightSmallKnob_Left":
                this.gps.ShowContextualMenu(this.posRefModeSelectorMenu);
                break;
            default:
                return false;
        }
        return true;
    }
    refModeSet(_mode) {
        this.referenceMode = _mode;
        this.gps.SwitchToInteractionState(0);
    }
    activeRefSearchField() {
        this.gps.currentSearchFieldWaypoint = this.posRefSearchField;
        this.gps.SwitchToInteractionState(3);
        this.posRefSearchField.StartSearch(() => {
            this.gps.SwitchToInteractionState(0);
        });
    }
}
class GPS_AirportWaypointLocation extends NavSystemElement {
    constructor(_icaoSearchField) {
        super();
        this.name = "AirportLocation";
        this.icaoSearchField = _icaoSearchField;
    }
    init() {
        this.ident = this.gps.getChildById("APTLocIdent");
        this.privateLogo = this.gps.getChildById("APTLocPrivateLogo");
        this.private = this.gps.getChildById("APTLocPrivate");
        this.facilityName = this.gps.getChildById("APTLocFacilityName");
        this.city = this.gps.getChildById("APTLocCity");
        this.positionNS = this.gps.getChildById("APTLocPositionNS");
        this.positionEW = this.gps.getChildById("APTLocPositionEW");
        this.elev = this.gps.getChildById("APTLocElev");
        this.fuel = this.gps.getChildById("APTLocFuel");
        this.bestApproach = this.gps.getChildById("APTLocBestApproach");
        this.radar = this.gps.getChildById("APTLocRadar");
        this.airspaceType = this.gps.getChildById("APTLocAirspaceType");
        this.region = this.gps.getChildById("APTLocRegion");
        this.defaultSelectables = [
            new SelectableElement(this.gps, this.ident, this.searchField_SelectionCallback.bind(this))
        ];
        this.icaoSearchField.elements.push(this.ident);
    }
    onEnter() {
        if (this.gps.lastRelevantICAO && this.gps.lastRelevantICAOType == "A") {
            this.icaoSearchField.SetWaypoint(this.gps.lastRelevantICAOType, this.gps.lastRelevantICAO);
        }
    }
    onUpdate(_deltaTime) {
        this.icaoSearchField.Update();
        var infos = this.icaoSearchField.getUpdatedInfos();
        if (infos && infos.icao) {
            var logo = infos.GetSymbol();
            if (logo != "") {
                diffAndSetHTML(this.privateLogo, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/' + logo + '"/>');
            }
            switch (infos.privateType) {
                case 0:
                    diffAndSetText(this.private, "Unknown");
                    break;
                case 1:
                    diffAndSetText(this.private, "Public");
                    break;
                case 2:
                    diffAndSetText(this.private, "Military");
                    break;
                case 3:
                    diffAndSetText(this.private, "Private");
                    break;
            }
            diffAndSetText(this.facilityName, infos.name);
            diffAndSetText(this.city, infos.city);
            if (this.region) {
                diffAndSetText(this.region, infos.region);
            }
            diffAndSetText(this.positionNS, this.gps.latitudeFormat(infos.coordinates.lat));
            diffAndSetText(this.positionEW, this.gps.longitudeFormat(infos.coordinates.long));
            if (infos.coordinates.alt) {
                diffAndSetText(this.elev, fastToFixed(infos.coordinates.alt, 0));
            }
            diffAndSetText(this.fuel, infos.fuel);
            diffAndSetText(this.bestApproach, infos.bestApproach);
            switch (infos.radarCoverage) {
                case 0:
                    diffAndSetText(this.radar, "");
                    break;
                case 1:
                    diffAndSetText(this.radar, "No");
                    break;
                case 2:
                    diffAndSetText(this.radar, "Yes");
                    break;
            }
            diffAndSetText(this.airspaceType, infos.airspaceType);
        }
        else {
            diffAndSetText(this.private, "Unknown");
            diffAndSetText(this.facilityName, "______________________");
            diffAndSetText(this.city, "______________________");
            if (this.region) {
                diffAndSetText(this.region, "______");
            }
            diffAndSetText(this.positionNS, "_ __°__.__'");
            diffAndSetText(this.positionEW, "____°__.__'");
            diffAndSetText(this.elev, "____");
            diffAndSetText(this.fuel, "");
            diffAndSetText(this.bestApproach, "");
            diffAndSetText(this.radar, "");
            diffAndSetText(this.airspaceType, "");
        }
    }
    onExit() {
        this.gps.lastRelevantICAO = this.icaoSearchField.getUpdatedInfos().icao;
        this.gps.lastRelevantICAOType = "A";
    }
    onEvent(_event) {
    }
    searchField_SelectionCallback(_event) {
        if (_event == "ENT_Push" || _event == "RightSmallKnob_Right" || _event == "RightSmallKnob_Left") {
            this.gps.currentSearchFieldWaypoint = this.icaoSearchField;
            this.icaoSearchField.StartSearch(function () {
                this.icaoSearchField.getWaypoint().UpdateApproaches();
            }.bind(this));
            this.gps.SwitchToInteractionState(3);
        }
    }
}
class GPS_AirportWaypointRunways extends NavSystemElement {
    constructor(_icaoSearchField) {
        super();
        this.name = "AirportRunway";
        this.icaoSearchField = _icaoSearchField;
    }
    init() {
        this.identElement = this.gps.getChildById("APTRwyIdent");
        this.privateLogoElement = this.gps.getChildById("APTRwyPrivateLogo");
        this.privateElement = this.gps.getChildById("APTRwyPrivate");
        this.nameElement = this.gps.getChildById("APTRwyName");
        this.lengthElement = this.gps.getChildById("APTRwyLength");
        this.widthElement = this.gps.getChildById("APTRwyWidth");
        this.surfaceElement = this.gps.getChildById("APTRwySurface");
        this.lightingElement = this.gps.getChildById("APTRwyLighting");
        this.mapElement = this.gps.getChildById("APTRwyMap");
        this.selectedRunway = 0;
        this.defaultSelectables = [
            new SelectableElement(this.gps, this.identElement, this.searchField_SelectionCallback.bind(this)),
            new SelectableElement(this.gps, this.nameElement, this.runway_SelectionCallback.bind(this))
        ];
        this.icaoSearchField.elements.push(this.identElement);
    }
    onEnter() {
        this.selectedRunway = 0;
        if (this.gps.lastRelevantICAO && this.gps.lastRelevantICAOType == "A") {
            this.icaoSearchField.SetWaypoint(this.gps.lastRelevantICAOType, this.gps.lastRelevantICAO);
        }
    }
    onUpdate(_deltaTime) {
        this.icaoSearchField.Update();
        var infos = this.icaoSearchField.getUpdatedInfos();
        if (infos && infos.icao) {
            var size = infos.GetSize();
            var nmPixelSize = Math.min(130 / size.x, 110 / size.y);
            var context = this.mapElement.getContext("2d");
            context.clearRect(0, 0, 200, 200);
            var logo = infos.GetSymbol();
            if (logo != "") {
                diffAndSetHTML(this.privateLogoElement, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/' + logo + '"/>');
            }
            switch (infos.privateType) {
                case 0:
                    diffAndSetText(this.privateElement, "Unknown");
                    break;
                case 1:
                    diffAndSetText(this.privateElement, "Public");
                    break;
                case 2:
                    diffAndSetText(this.privateElement, "Military");
                    break;
                case 3:
                    diffAndSetText(this.privateElement, "Private");
                    break;
            }
            if (infos.runways && this.selectedRunway >= 0 && this.selectedRunway < infos.runways.length) {
                let runway = infos.runways[this.selectedRunway];
                if (runway) {
                    diffAndSetText(this.nameElement, runway.designation);
                    diffAndSetText(this.lengthElement, fastToFixed(runway.length, 0));
                    diffAndSetText(this.widthElement, fastToFixed(runway.width, 0));
                    switch (runway.surface) {
                        case 0:
                            diffAndSetText(this.surfaceElement, "Unknown");
                            break;
                        case 1:
                            diffAndSetText(this.surfaceElement, "Concrete");
                            break;
                        case 2:
                            diffAndSetText(this.surfaceElement, "Asphalt");
                            break;
                        case 101:
                            diffAndSetText(this.surfaceElement, "Grass");
                            break;
                        case 102:
                            diffAndSetText(this.surfaceElement, "Turf");
                            break;
                        case 103:
                            diffAndSetText(this.surfaceElement, "Dirt");
                            break;
                        case 104:
                            diffAndSetText(this.surfaceElement, "Coral");
                            break;
                        case 105:
                            diffAndSetText(this.surfaceElement, "Gravel");
                            break;
                        case 106:
                            diffAndSetText(this.surfaceElement, "Oil Treated");
                            break;
                        case 107:
                            diffAndSetText(this.surfaceElement, "Steel");
                            break;
                        case 108:
                            diffAndSetText(this.surfaceElement, "Bituminus");
                            break;
                        case 109:
                            diffAndSetText(this.surfaceElement, "Brick");
                            break;
                        case 110:
                            diffAndSetText(this.surfaceElement, "Macadam");
                            break;
                        case 111:
                            diffAndSetText(this.surfaceElement, "Planks");
                            break;
                        case 112:
                            diffAndSetText(this.surfaceElement, "Sand");
                            break;
                        case 113:
                            diffAndSetText(this.surfaceElement, "Shale");
                            break;
                        case 114:
                            diffAndSetText(this.surfaceElement, "Tarmac");
                            break;
                        case 115:
                            diffAndSetText(this.surfaceElement, "Snow");
                            break;
                        case 116:
                            diffAndSetText(this.surfaceElement, "Ice");
                            break;
                        case 201:
                            diffAndSetText(this.surfaceElement, "Water");
                            break;
                        default:
                            diffAndSetText(this.surfaceElement, "Unknown");
                            break;
                    }
                    switch (runway.lighting) {
                        case 0:
                            diffAndSetText(this.lightingElement, "Unknown");
                            break;
                        case 1:
                            diffAndSetText(this.lightingElement, "None");
                            break;
                        case 2:
                            diffAndSetText(this.lightingElement, "Part Time");
                            break;
                        case 3:
                            diffAndSetText(this.lightingElement, "Full Time");
                            break;
                        case 4:
                            diffAndSetText(this.lightingElement, "Frequency");
                            break;
                    }
                }
            }
        }
        else {
            diffAndSetText(this.identElement, "_____");
            diffAndSetHTML(this.privateLogoElement, "");
            diffAndSetText(this.privateElement, "Unknown");
            diffAndSetText(this.nameElement, "");
            diffAndSetText(this.lengthElement, "0");
            diffAndSetText(this.widthElement, "0");
            diffAndSetText(this.surfaceElement, "Unknown");
            diffAndSetText(this.lightingElement, "Unknown");
        }
    }
    onExit() {
        this.gps.lastRelevantICAO = this.icaoSearchField.getUpdatedInfos().icao;
        this.gps.lastRelevantICAOType = "A";
    }
    onEvent(_event) {
    }
    searchField_SelectionCallback(_event) {
        if (_event == "ENT_Push" || _event == "RightSmallKnob_Right" || _event == "RightSmallKnob_Left") {
            this.selectedRunway = 0;
            this.gps.currentSearchFieldWaypoint = this.icaoSearchField;
            this.icaoSearchField.StartSearch(function () {
                this.icaoSearchField.getWaypoint().UpdateApproaches();
            }.bind(this));
            this.gps.SwitchToInteractionState(3);
        }
    }
    runway_SelectionCallback(_event) {
        if (_event == "ENT_Push" || _event == "RightSmallKnob_Right" || _event == "RightSmallKnob_Left") {
            var infos = this.icaoSearchField.getUpdatedInfos();
            if (infos && infos.icao) {
                var menu = new ContextualMenu("RUNWAY", []);
                var callback = function (_index) {
                    this.selectedRunway = _index;
                    this.gps.SwitchToInteractionState(0);
                };
                for (var i = 0; i < infos.runways.length; i++) {
                    menu.elements.push(new ContextualMenuElement(infos.runways[i].designation, callback.bind(this, i)));
                }
                this.gps.ShowContextualMenu(menu);
            }
        }
    }
}
class GPS_AirportWaypointFrequencies extends NavSystemElement {
    constructor(_icaoSearchField, _nbFreqMax = 5) {
        super();
        this.name = "AirportFrequency";
        this.icaoSearchField = _icaoSearchField;
        this.nbFreqMax = _nbFreqMax;
    }
    init() {
        this.identElement = this.gps.getChildById("APTFreqIdent");
        this.logoElement = this.gps.getChildById("APTFreqLogo");
        this.privateElement = this.gps.getChildById("APTFreqPrivate");
        this.mainElement = this.gps.getChildById("APTFreqMain");
        this.sliderElement = this.gps.getChildById("APTFreqSlider");
        this.sliderCursorElement = this.gps.getChildById("APTFreqSliderCursor");
        this.frequenciesSelectionGroup = new SelectableElementSliderGroup(this.gps, [], this.sliderElement, this.sliderCursorElement);
        for (let i = 0; i < this.nbFreqMax; i++) {
            this.frequenciesSelectionGroup.addElement(new SelectableElement(this.gps, this.gps.getChildById("APTFrequency_" + i), this.activeFrequency_SelectionCallback.bind(this)));
        }
        this.defaultSelectables = [
            new SelectableElement(this.gps, this.identElement, this.searchField_SelectionCallback.bind(this)),
            this.frequenciesSelectionGroup
        ];
        this.icaoSearchField.elements.push(this.identElement);
    }
    onEnter() {
        if (this.gps.lastRelevantICAO && this.gps.lastRelevantICAOType == "A") {
            this.icaoSearchField.SetWaypoint(this.gps.lastRelevantICAOType, this.gps.lastRelevantICAO);
        }
    }
    onUpdate(_deltaTime) {
        this.icaoSearchField.Update();
        var infos = this.icaoSearchField.getUpdatedInfos();
        if (infos && infos.icao) {
            var logo = infos.GetSymbol();
            if (logo != "") {
                diffAndSetHTML(this.logoElement, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/' + logo + '"/>');
            }
            switch (infos.privateType) {
                case 0:
                    diffAndSetText(this.privateElement, "Unknown");
                    break;
                case 1:
                    diffAndSetText(this.privateElement, "Public");
                    break;
                case 2:
                    diffAndSetText(this.privateElement, "Military");
                    break;
                case 3:
                    diffAndSetText(this.privateElement, "Private");
                    break;
            }
            var elements = [];
            if (infos && infos.frequencies) {
                for (let i = 0; i < infos.frequencies.length; i++) {
                    elements.push('<div><div class="Align LeftDisplay">' + infos.frequencies[i].name.replace(" ", "&nbsp;").slice(0, 15) + '</div> <div class="Align RightValue SelectableElement">' + this.gps.frequencyFormat(infos.frequencies[i].mhValue, 3) + '</div></div>');
                }
            }
            this.frequenciesSelectionGroup.setStringElements(elements);
        }
        else {
            diffAndSetText(this.identElement, "_____");
            diffAndSetHTML(this.logoElement, "");
            diffAndSetText(this.privateElement, "Unknown");
        }
    }
    onExit() {
        this.gps.lastRelevantICAO = this.icaoSearchField.getUpdatedInfos().icao;
        this.gps.lastRelevantICAOType = "A";
    }
    onEvent(_event) {
    }
    activeFrequency_SelectionCallback(_event, _index) {
        if (_event == "ENT_Push") {
            var infos = this.icaoSearchField.getUpdatedInfos();
            if (infos.frequencies[_index].mhValue >= 118) {
                SimVar.SetSimVarValue("K:COM" + (this.gps.comIndex == 1 ? "" : this.gps.comIndex) + "_STBY_RADIO_SET", "Frequency BCD16", infos.frequencies[_index].bcd16Value);
            }
            else {
                SimVar.SetSimVarValue("K:NAV" + this.gps.navIndex + "_STBY_SET", "Frequency BCD16", infos.frequencies[_index].bcd16Value);
            }
        }
    }
    searchField_SelectionCallback(_event) {
        if (_event == "ENT_Push" || _event == "RightSmallKnob_Right" || _event == "RightSmallKnob_Left") {
            this.gps.currentSearchFieldWaypoint = this.icaoSearchField;
            this.icaoSearchField.StartSearch(function () {
                this.icaoSearchField.getWaypoint().UpdateApproaches();
            }.bind(this));
            this.gps.SwitchToInteractionState(3);
        }
    }
}
class GPS_AirportWaypointApproaches extends NavSystemElement {
    constructor(_icaoSearchField) {
        super();
        this.name = "AirportApproach";
        this.icaoSearchField = _icaoSearchField;
    }
    init() {
        this.identElement = this.gps.getChildById("APTApproachIdent");
        this.privateLogoElement = this.gps.getChildById("APTApproachPrivateLogo");
        this.privateElement = this.gps.getChildById("APTApproachPrivate");
        this.approachElement = this.gps.getChildById("APTApproachApproach");
        this.transitionElement = this.gps.getChildById("APTApproachTransition");
        this.selectedApproach = 0;
        this.selectedTransition = 0;
        this.container.defaultMenu = new ContextualMenu("PAGE MENU", [
            new ContextualMenuElement("Load&nbsp;into&nbsp;Active&nbsp;FPL?", this.loadApproachIntoFPL.bind(this)),
            new ContextualMenuElement("Load&nbsp;and&nbsp;Activate?", this.loadApproachAndActivate.bind(this)),
        ]);
        this.defaultSelectables = [
            new SelectableElement(this.gps, this.identElement, this.ident_SelectionCallback.bind(this)),
            new SelectableElement(this.gps, this.approachElement, this.approach_SelectionCallback.bind(this)),
            new SelectableElement(this.gps, this.transitionElement, this.transtion_SelectionCallback.bind(this))
        ];
        this.icaoSearchField.elements.push(this.identElement);
    }
    onEnter() {
        this.selectedApproach = 0;
        this.selectedTransition = 0;
        if (this.gps.lastRelevantICAO && this.gps.lastRelevantICAOType == "A") {
            this.icaoSearchField.SetWaypoint(this.gps.lastRelevantICAOType, this.gps.lastRelevantICAO);
        }
        this.icaoSearchField.getWaypoint().UpdateApproaches();
    }
    getSelectedApproach(airport) {
        if (airport && airport.approaches && this.selectedApproach >= 0 && this.selectedApproach < airport.approaches.length) {
            return airport.approaches[this.selectedApproach];
        }
        return null;
    }
    onUpdate(_deltaTime) {
        this.icaoSearchField.Update();
        var infos = this.icaoSearchField.getUpdatedInfos();
        if (infos && infos.icao) {
            var logo = infos.GetSymbol();
            if (logo != "") {
                diffAndSetHTML(this.privateLogoElement, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/' + logo + '"/>');
            }
            switch (infos.privateType) {
                case 0:
                    diffAndSetText(this.privateElement, "Unknown");
                    break;
                case 1:
                    diffAndSetText(this.privateElement, "Public");
                    break;
                case 2:
                    diffAndSetText(this.privateElement, "Military");
                    break;
                case 3:
                    diffAndSetText(this.privateElement, "Private");
                    break;
            }
            let approach = this.getSelectedApproach(infos);
            if (approach) {
                diffAndSetText(this.approachElement, approach.name);
                if (approach.transitions && this.selectedTransition >= 0 && approach.transitions.length > this.selectedTransition) {
                    diffAndSetText(this.transitionElement, approach.transitions[this.selectedTransition].name);
                }
                else {
                    diffAndSetText(this.transitionElement, "");
                }
            }
            else {
                diffAndSetText(this.approachElement, "");
                diffAndSetText(this.transitionElement, "");
            }
        }
        else {
            diffAndSetText(this.identElement, "_____");
            diffAndSetText(this.privateElement, "Unknown");
            diffAndSetText(this.approachElement, "");
            diffAndSetText(this.transitionElement, "");
        }
    }
    onExit() {
        this.gps.lastRelevantICAO = this.icaoSearchField.getUpdatedInfos().icao;
        this.gps.lastRelevantICAOType = "A";
    }
    onEvent(_event) {
    }
    loadApproachIntoFPL() {
        SimVar.SetSimVarValue("C:fs9gps:FlightPlanNewApproachAirport", "string", this.icaoSearchField.getUpdatedInfos().icao);
        SimVar.SetSimVarValue("C:fs9gps:FlightPlanNewApproachApproach", "number", this.selectedApproach);
        SimVar.SetSimVarValue("C:fs9gps:FlightPlanNewApproachTransition", "number", this.selectedTransition);
        SimVar.SetSimVarValue("C:fs9gps:FlightPlanLoadApproach", "number", 1);
        this.gps.currFlightPlan.FillWithCurrentFP();
        this.gps.SwitchToMenuName("FPL");
        this.gps.SwitchToInteractionState(0);
    }
    loadApproachAndActivate() {
        SimVar.SetSimVarValue("C:fs9gps:FlightPlanNewApproachAirport", "string", this.icaoSearchField.getUpdatedInfos().icao);
        SimVar.SetSimVarValue("C:fs9gps:FlightPlanNewApproachApproach", "number", this.selectedApproach);
        SimVar.SetSimVarValue("C:fs9gps:FlightPlanNewApproachTransition", "number", this.selectedTransition);
        SimVar.SetSimVarValue("C:fs9gps:FlightPlanLoadApproach", "number", 2);
        this.gps.currFlightPlan.FillWithCurrentFP();
        this.gps.SwitchToMenuName("FPL");
        this.gps.SwitchToInteractionState(0);
    }
    ident_SelectionCallback(_event) {
        if (_event == "ENT_Push" || _event == "RightSmallKnob_Right" || _event == "RightSmallKnob_Left") {
            this.gps.currentSearchFieldWaypoint = this.icaoSearchField;
            this.selectedApproach = 0;
            this.selectedTransition = 0;
            this.icaoSearchField.StartSearch(function () {
                this.selectedRunway = 0;
                this.icaoSearchField.getWaypoint().UpdateApproaches();
            }.bind(this));
            this.gps.SwitchToInteractionState(3);
        }
    }
    approach_SelectionCallback(_event) {
        if (_event == "ENT_Push" || _event == "RightSmallKnob_Right" || _event == "RightSmallKnob_Left") {
            var infos = this.icaoSearchField.getUpdatedInfos();
            if (infos && infos.icao) {
                var menu = new ContextualMenu("APR", []);
                var callback = function (_index) {
                    this.selectedApproach = _index;
                    this.selectedTransition = 0;
                    this.gps.SwitchToInteractionState(0);
                };
                for (var i = 0; i < infos.approaches.length; i++) {
                    menu.elements.push(new ContextualMenuElement(infos.approaches[i].name, callback.bind(this, i)));
                }
                this.gps.ShowContextualMenu(menu);
            }
        }
    }
    transtion_SelectionCallback(_event) {
        if (_event == "ENT_Push" || _event == "RightSmallKnob_Right" || _event == "RightSmallKnob_Left") {
            var infos = this.icaoSearchField.getUpdatedInfos();
            if (infos && infos.icao) {
                var menu = new ContextualMenu("TRANS", []);
                var callback = function (_index) {
                    this.selectedTransition = _index;
                    this.gps.SwitchToInteractionState(0);
                };
                let approach = this.getSelectedApproach(infos);
                if (approach) {
                    for (var i = 0; i < approach.transitions.length; i++) {
                        menu.elements.push(new ContextualMenuElement(approach.transitions[i].name, callback.bind(this, i)));
                    }
                }
                this.gps.ShowContextualMenu(menu);
            }
        }
    }
}
class GPS_IntersectionWaypoint extends NavSystemElement {
    constructor() {
        super();
        this.name = "Intersection";
    }
    init() {
        this.identElement = this.gps.getChildById("INTIdent");
        this.symbolElement = this.gps.getChildById("INTSymbol");
        this.regionElement = this.gps.getChildById("INTRegion");
        this.posNSElement = this.gps.getChildById("INTPosNS");
        this.posEWElement = this.gps.getChildById("INTPosEW");
        this.nearestVORElement = this.gps.getChildById("INTNearestVOR");
        this.nearestVORSymbolElement = this.gps.getChildById("INTNearestVORSymbol");
        this.radialFromNearVORElement = this.gps.getChildById("INTRadialFromNearVOR");
        this.distanceFromNearVORElement = this.gps.getChildById("INTDistanceFromNearVOR");
        this.icaoSearchField = new SearchFieldWaypointICAO(this.gps, [this.identElement], this.gps, 'W');
        this.defaultSelectables = [
            new SelectableElement(this.gps, this.identElement, this.ident_SelectionCallback.bind(this))
        ];
    }
    onEnter() {
        if (this.gps.lastRelevantICAO && this.gps.lastRelevantICAOType == "W") {
            this.icaoSearchField.SetWaypoint(this.gps.lastRelevantICAOType, this.gps.lastRelevantICAO);
        }
    }
    onUpdate(_deltaTime) {
        this.icaoSearchField.Update();
        var infos = this.icaoSearchField.getUpdatedInfos();
        if (infos && infos.icao) {
            var logo = infos.GetSymbol();
            if (logo != "") {
                diffAndSetHTML(this.symbolElement, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/' + logo + '"/>');
            }
            diffAndSetText(this.regionElement, infos.region);
            diffAndSetText(this.posNSElement, this.gps.latitudeFormat(infos.coordinates.lat));
            diffAndSetText(this.posEWElement, this.gps.longitudeFormat(infos.coordinates.long));
            diffAndSetText(this.nearestVORElement, infos.nearestVORIdent);
            diffAndSetText(this.radialFromNearVORElement, fastToFixed(infos.nearestVORMagneticRadial, 0));
            diffAndSetText(this.distanceFromNearVORElement, fastToFixed(infos.nearestVORDistance / 1852, 1));
        }
        else {
            diffAndSetText(this.posNSElement, "_ __°__.__'");
            diffAndSetText(this.posEWElement, "____°__.__'");
            diffAndSetText(this.nearestVORElement, "_____");
            diffAndSetText(this.radialFromNearVORElement, "___");
            diffAndSetText(this.distanceFromNearVORElement, "____");
        }
    }
    onExit() {
        this.gps.lastRelevantICAO = this.icaoSearchField.getUpdatedInfos().icao;
        this.gps.lastRelevantICAOType = "W";
    }
    onEvent(_event) {
    }
    ident_SelectionCallback(_event) {
        if (_event == "ENT_Push" || _event == "RightSmallKnob_Right" || _event == "RightSmallKnob_Left") {
            this.gps.currentSearchFieldWaypoint = this.icaoSearchField;
            this.icaoSearchField.StartSearch();
            this.gps.SwitchToInteractionState(3);
        }
    }
}
class GPS_NDBWaypoint extends NavSystemElement {
    constructor() {
        super();
        this.name = "NDB";
    }
    init() {
        this.identElement = this.gps.getChildById("NDBIdent");
        this.symbolElement = this.gps.getChildById("NDBSymbol");
        this.facilityElement = this.gps.getChildById("NDBFacility");
        this.cityElement = this.gps.getChildById("NDBCity");
        this.regionElement = this.gps.getChildById("NDBRegion");
        this.latitudeElement = this.gps.getChildById("NDBLatitude");
        this.longitudeElement = this.gps.getChildById("NDBLongitude");
        this.frequencyElement = this.gps.getChildById("NDBFrequency");
        this.weatherBroadcastElement = this.gps.getChildById("NDBWeatherBroadcast");
        this.icaoSearchField = new SearchFieldWaypointICAO(this.gps, [this.identElement], this.gps, 'N');
        this.defaultSelectables = [
            new SelectableElement(this.gps, this.identElement, this.ident_SelectionCallback.bind(this))
        ];
    }
    onEnter() {
        if (this.gps.lastRelevantICAO && this.gps.lastRelevantICAOType == "N") {
            this.icaoSearchField.SetWaypoint(this.gps.lastRelevantICAOType, this.gps.lastRelevantICAO);
        }
    }
    onUpdate(_deltaTime) {
        this.icaoSearchField.Update();
        var infos = this.icaoSearchField.getUpdatedInfos();
        if (infos && infos.icao) {
            var logo = infos.GetSymbol();
            if (logo != "") {
                diffAndSetHTML(this.symbolElement, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/' + logo + '"/>');
            }
            diffAndSetText(this.facilityElement, infos.name);
            diffAndSetText(this.cityElement, infos.city);
            diffAndSetText(this.regionElement, infos.region);
            diffAndSetText(this.latitudeElement, this.gps.latitudeFormat(infos.coordinates.lat));
            diffAndSetText(this.longitudeElement, this.gps.longitudeFormat(infos.coordinates.long));
            diffAndSetText(this.frequencyElement, fastToFixed(infos.frequencyMHz, 1));
            if (infos.weatherBroadcast == 2) {
                diffAndSetText(this.weatherBroadcastElement, "Wx Brdcst");
            }
            else {
                diffAndSetText(this.weatherBroadcastElement, "");
            }
        }
        else {
            diffAndSetText(this.identElement, "_____");
            diffAndSetHTML(this.symbolElement, "");
            diffAndSetText(this.facilityElement, "______________________");
            diffAndSetText(this.cityElement, "______________________");
            diffAndSetText(this.regionElement, "__________");
            diffAndSetText(this.latitudeElement, "_ __°__.__'");
            diffAndSetText(this.longitudeElement, "____°__.__'");
            diffAndSetText(this.frequencyElement, "___._");
            diffAndSetText(this.weatherBroadcastElement, "");
        }
    }
    onExit() {
        this.gps.lastRelevantICAO = this.icaoSearchField.getUpdatedInfos().icao;
        this.gps.lastRelevantICAOType = "N";
    }
    onEvent(_event) {
    }
    ident_SelectionCallback(_event) {
        if (_event == "ENT_Push" || _event == "RightSmallKnob_Right" || _event == "RightSmallKnob_Left") {
            this.gps.currentSearchFieldWaypoint = this.icaoSearchField;
            this.icaoSearchField.StartSearch();
            this.gps.SwitchToInteractionState(3);
        }
    }
}
class GPS_VORWaypoint extends NavSystemElement {
    constructor() {
        super();
        this.name = "VOR";
    }
    init() {
        this.identElement = this.gps.getChildById("VORIdent");
        this.symbolElement = this.gps.getChildById("VORSymbol");
        this.facilityElement = this.gps.getChildById("VORFacility");
        this.cityElement = this.gps.getChildById("VORCity");
        this.regionElement = this.gps.getChildById("VORRegion");
        this.latitudeElement = this.gps.getChildById("VORLatitude");
        this.longitudeElement = this.gps.getChildById("VORLongitude");
        this.frequencyElement = this.gps.getChildById("VORFrequency");
        this.weatherBroadcastElement = this.gps.getChildById("VORWeatherBroadcast");
        this.magneticDeviationElement = this.gps.getChildById("VORMagneticDeviation");
        this.icaoSearchField = new SearchFieldWaypointICAO(this.gps, [this.identElement], this.gps, 'V');
        this.defaultSelectables = [
            new SelectableElement(this.gps, this.identElement, this.ident_SelectionCallback.bind(this))
        ];
    }
    onEnter() {
        if (this.gps.lastRelevantICAO && this.gps.lastRelevantICAOType == "V") {
            this.icaoSearchField.SetWaypoint(this.gps.lastRelevantICAOType, this.gps.lastRelevantICAO);
        }
    }
    onUpdate(_deltaTime) {
        this.icaoSearchField.Update();
        var infos = this.icaoSearchField.getUpdatedInfos();
        if (infos && infos.icao) {
            var logo = infos.GetSymbol();
            if (logo != "") {
                diffAndSetHTML(this.symbolElement, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/' + logo + '"/>');
            }
            diffAndSetText(this.facilityElement, infos.name);
            diffAndSetText(this.cityElement, infos.city);
            diffAndSetText(this.regionElement, infos.region);
            diffAndSetText(this.latitudeElement, this.gps.latitudeFormat(infos.coordinates.lat));
            diffAndSetText(this.longitudeElement, this.gps.longitudeFormat(infos.coordinates.long));
            diffAndSetText(this.frequencyElement, fastToFixed(infos.frequencyMHz, 2));
            if (infos.weatherBroadcast == 2) {
                diffAndSetText(this.weatherBroadcastElement, "Wx Brdcst");
            }
            else {
                diffAndSetText(this.weatherBroadcastElement, "");
            }
            var magVar = infos.magneticVariation;
            if (infos.magneticVariation > 0) {
                diffAndSetText(this.magneticDeviationElement, 'W' + fastToFixed(magVar, 0) + "°");
            }
            else {
                diffAndSetText(this.magneticDeviationElement, "E" + fastToFixed((0 - magVar), 0) + "°");
            }
        }
        else {
            diffAndSetText(this.identElement, "_____");
            diffAndSetHTML(this.symbolElement, "");
            diffAndSetText(this.facilityElement, "______________________");
            diffAndSetText(this.cityElement, "______________________");
            diffAndSetText(this.regionElement, "__________");
            diffAndSetText(this.latitudeElement, "_ __°__.__'");
            diffAndSetText(this.longitudeElement, "____°__.__'");
            diffAndSetText(this.frequencyElement, "___.__");
            diffAndSetText(this.weatherBroadcastElement, "");
            diffAndSetText(this.magneticDeviationElement, "____°");
        }
    }
    onExit() {
        this.gps.lastRelevantICAO = this.icaoSearchField.getUpdatedInfos().icao;
        this.gps.lastRelevantICAOType = "V";
    }
    onEvent(_event) {
    }
    ident_SelectionCallback(_event) {
        if (_event == "ENT_Push" || _event == "RightSmallKnob_Right" || _event == "RightSmallKnob_Left") {
            this.gps.currentSearchFieldWaypoint = this.icaoSearchField;
            this.icaoSearchField.StartSearch();
            this.gps.SwitchToInteractionState(3);
        }
    }
}
class GPS_NearestAirports extends NavSystemElement {
    constructor(_nbElemsMax = 3) {
        super();
        this.name = "NRSTAirport";
        this.nbElemsMax = _nbElemsMax;
    }
    init() {
        this.sliderElement = this.gps.getChildById("SliderNRSTAirport");
        this.sliderCursorElement = this.gps.getChildById("SliderNRSTAirportCursor");
        this.nearestAirportList = new NearestAirportList(this.gps);
        this.airportsSliderGroup = new SelectableElementSliderGroup(this.gps, [], this.sliderElement, this.sliderCursorElement, 2);
        for (let i = 0; i < this.nbElemsMax; i++) {
            this.airportsSliderGroup.addElement(new SelectableElement(this.gps, this.gps.getChildById("NRSTAirport_" + i), this.airportName_SelectionCallback.bind(this)));
            this.airportsSliderGroup.addElement(new SelectableElement(this.gps, this.gps.getChildById("NRSTAirport_Freq_" + i), this.airportFrequency_SelectionCallback.bind(this)));
        }
        this.defaultSelectables = [this.airportsSliderGroup];
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        this.nearestAirportList.Update();
        var airportListStrings = [];
        for (var i = 0; i < this.nearestAirportList.airports.length; i++) {
            var firstLine = "";
            var secondLine = "";
            var logo = "";
            if (this.nearestAirportList.airports[i].airportClass == 2 || this.nearestAirportList.airports[i].airportClass == 3) {
                logo = "Airport_Soft.png";
            }
            else if (this.nearestAirportList.airports[i].airportClass == 1) {
                switch (Math.round((this.nearestAirportList.airports[i].longestRunwayDirection % 180) / 45.0)) {
                    case 0:
                    case 4:
                        logo = "Airport_Hard_NS.png";
                        break;
                    case 1:
                        logo = "Airport_Hard_NE_SW.png";
                        break;
                    case 2:
                        logo = "Airport_Hard_EW.png";
                        break;
                    case 3:
                        logo = "Airport_Hard_NW_SE.png";
                        break;
                }
            }
            else if (this.nearestAirportList.airports[i].airportClass == 4) {
                logo = "Helipad.png";
            }
            else if (this.nearestAirportList.airports[i].airportClass == 5) {
                logo = "Private_Airfield.png";
            }
            firstLine += '<td class="SelectableElement">' + this.nearestAirportList.airports[i].ident + '</td>';
            firstLine += '<td><img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/GPS/' + logo + '" class="imgSizeS"/> </td>';
            firstLine += '<td>' + fastToFixed(this.nearestAirportList.airports[i].bearing, 0) + '<div class="Align unit">o<br />M</div></td>';
            firstLine += '<td>' + fastToFixed(this.nearestAirportList.airports[i].distance, 1) + '<div class="Align unit">n<br />m</div></td>';
            firstLine += '<td>' + this.nearestAirportList.airports[i].bestApproach + '</td>';
            secondLine += '<td>' + this.nearestAirportList.airports[i].frequencyName + '</td>';
            secondLine += '<td colspan="2" class="SelectableElement">' + fastToFixed(this.nearestAirportList.airports[i].frequencyMHz, 3) + '</td>';
            secondLine += '<td>rwy</td>';
            secondLine += '<td>' + fastToFixed(this.nearestAirportList.airports[i].longestRunwayLength, 0) + '<div class="Align unit">f<br />t</div></td>';
            secondLine += "</tr>";
            airportListStrings.push(firstLine);
            airportListStrings.push(secondLine);
        }
        this.airportsSliderGroup.setStringElements(airportListStrings);
    }
    onExit() {
        if (this.gps.currentInteractionState == 1) {
            this.gps.lastRelevantICAO = this.nearestAirportList.airports[Math.floor(this.airportsSliderGroup.getIndex() / 2)].icao;
            this.gps.lastRelevantICAOType = "A";
        }
    }
    onEvent(_event) {
    }
    airportName_SelectionCallback(_event, _index) {
        switch (_event) {
            case "ENT_Push":
                this.gps.SwitchToPageName("WPT", "AirportLocation");
                this.gps.SwitchToInteractionState(0);
                return true;
        }
    }
    airportFrequency_SelectionCallback(_event, _index) {
        switch (_event) {
            case "ENT_Push":
                if (this.nearestAirportList.airports[Math.floor(_index / 2)].frequencyMHz >= 118) {
                    SimVar.SetSimVarValue("K:COM" + (this.gps.comIndex == 1 ? "" : this.gps.comIndex) + "_STBY_RADIO_SET", "Frequency BCD16", this.nearestAirportList.airports[Math.floor(_index / 2)].frequencyBCD16);
                }
                else {
                    SimVar.SetSimVarValue("K:NAV" + this.gps.navIndex + "_STBY_SET", "Frequency BCD16", this.nearestAirportList.airports[Math.floor(_index / 2)].frequencyBCD16);
                }
                break;
        }
    }
}
class GPS_NearestIntersection extends NavSystemElement {
    constructor(_nbElemsMax = 5) {
        super();
        this.name = "NRSTIntersection";
        this.nbElemsMax = _nbElemsMax;
    }
    init() {
        this.sliderElement = this.gps.getChildById("SliderNRSTIntersection");
        this.sliderCursorElement = this.gps.getChildById("SliderNRSTIntersectionCursor");
        this.nearestIntersectionList = new NearestIntersectionList(this.gps);
        this.intersectionsSliderGroup = new SelectableElementSliderGroup(this.gps, [], this.sliderElement, this.sliderCursorElement);
        for (let i = 0; i < this.nbElemsMax; i++) {
            this.intersectionsSliderGroup.addElement(new SelectableElement(this.gps, this.gps.getChildById("NRST_Intersection_" + i), this.intersection_SelectionCallback.bind(this)));
        }
        this.defaultSelectables = [this.intersectionsSliderGroup];
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        this.nearestIntersectionList.Update();
        var lines = [];
        for (var i = 0; i < this.nearestIntersectionList.intersections.length; i++) {
            var line = "";
            line += '<td class="SelectableElement">' + this.nearestIntersectionList.intersections[i].ident + '</td>';
            line += '<td><img src="/Pages/VCockpit/Instruments/Shared/Map/Images/' + this.nearestIntersectionList.intersections[i].imageFileName() + '"/></td>';
            line += '<td>' + fastToFixed(this.nearestIntersectionList.intersections[i].bearing, 0) + '<div class="Align unit">o<br />M</div></td>';
            line += '<td>' + fastToFixed(this.nearestIntersectionList.intersections[i].distance, 1) + '<div class="Align unit">n<br />m</div></td>';
            lines.push(line);
        }
        this.intersectionsSliderGroup.setStringElements(lines);
    }
    onExit() {
        if (this.gps.currentInteractionState == 1) {
            this.gps.lastRelevantICAO = this.nearestIntersectionList.intersections[this.intersectionsSliderGroup.getIndex()].icao;
            this.gps.lastRelevantICAOType = "W";
        }
    }
    onEvent(_event) {
    }
    intersection_SelectionCallback(_event, _index) {
        switch (_event) {
            case "ENT_Push":
                this.gps.SwitchToPageName("WPT", "Intersection");
                this.gps.SwitchToInteractionState(0);
                return true;
        }
    }
}
class GPS_NearestNDB extends NavSystemElement {
    constructor(_nbElemsMax = 5) {
        super();
        this.name = "NRSTNDB";
        this.nbElemsMax = _nbElemsMax;
    }
    init() {
        this.sliderElement = this.gps.getChildById("SliderNRSTNDB");
        this.sliderCursorElement = this.gps.getChildById("SliderNRSTNDBCursor");
        this.nearestNDBList = new NearestNDBList(this.gps);
        this.ndbsSliderGroup = new SelectableElementSliderGroup(this.gps, [], this.sliderElement, this.sliderCursorElement);
        for (let i = 0; i < this.nbElemsMax; i++) {
            this.ndbsSliderGroup.addElement(new SelectableElement(this.gps, this.gps.getChildById("NRST_NDB_" + i), this.ndb_SelectionCallback.bind(this)));
        }
        this.defaultSelectables = [this.ndbsSliderGroup];
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        this.nearestNDBList.Update();
        var lines = [];
        for (var i = 0; i < this.nearestNDBList.ndbs.length; i++) {
            var line = "";
            line += '<td class="SelectableElement">' + this.nearestNDBList.ndbs[i].ident + '</td>';
            line += '<td><img src="/Pages/VCockpit/Instruments/Shared/Map/Images/' + this.nearestNDBList.ndbs[i].imageFileName() + '"/></td>';
            line += '<td>' + fastToFixed(this.nearestNDBList.ndbs[i].bearing, 0) + '<div class="Align unit">o<br />M</div></td>';
            line += '<td>' + fastToFixed(this.nearestNDBList.ndbs[i].distance, 1) + '<div class="Align unit">n<br />m</div></td>';
            line += '<td>' + fastToFixed(this.nearestNDBList.ndbs[i].frequencyMHz, 1) + '</td>';
            lines.push(line);
        }
        this.ndbsSliderGroup.setStringElements(lines);
    }
    onExit() {
        if (this.gps.currentInteractionState == 1) {
            this.gps.lastRelevantICAO = this.nearestNDBList.ndbs[this.ndbsSliderGroup.getIndex()].icao;
            this.gps.lastRelevantICAOType = "N";
        }
    }
    onEvent(_event) {
    }
    ndb_SelectionCallback(_event, _index) {
        switch (_event) {
            case "ENT_Push":
                this.gps.SwitchToPageName("WPT", "NDB");
                this.gps.SwitchToInteractionState(0);
                return true;
        }
    }
}
class GPS_NearestVOR extends NavSystemElement {
    constructor(_nbElemsMax = 5) {
        super();
        this.name = "NRSTVOR";
        this.nbElemsMax = _nbElemsMax;
    }
    init() {
        this.sliderElement = this.gps.getChildById("SliderNRSTVOR");
        this.sliderCursorElement = this.gps.getChildById("SliderNRSTVORCursor");
        this.nearestVORList = new NearestVORList(this.gps);
        this.vorsSliderGroup = new SelectableElementSliderGroup(this.gps, [], this.sliderElement, this.sliderCursorElement);
        for (let i = 0; i < this.nbElemsMax; i++) {
            this.vorsSliderGroup.addElement(new SelectableElementGroup(this.gps, this.gps.getChildById("NRST_VOR_" + i), [
                this.vor_SelectionCallback.bind(this),
                this.frequency_SelectionCallback.bind(this),
            ]));
        }
        this.defaultSelectables = [this.vorsSliderGroup];
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        this.nearestVORList.Update();
        var lines = [];
        for (var i = 0; i < this.nearestVORList.vors.length; i++) {
            var line = "";
            line += '<td class="SelectableElement Select0">' + this.nearestVORList.vors[i].ident + '</td>';
            var image = this.nearestVORList.vors[i].imageFileName();
            line += '<td> <img src="/Pages/VCockpit/Instruments/Shared/Map/Images/' + image + '"></td>';
            line += '<td>' + fastToFixed(this.nearestVORList.vors[i].bearing, 0) + '<div class="Align unit">o<br />M</div></td>';
            line += '<td>' + fastToFixed(this.nearestVORList.vors[i].distance, 1) + '<div class="Align unit">n<br />m</div></td>';
            line += '<td class="SelectableElement Select1">' + fastToFixed(this.nearestVORList.vors[i].frequencyMHz, 2) + '</td>';
            lines.push(line);
        }
        this.vorsSliderGroup.setStringElements(lines);
    }
    onExit() {
        if (this.gps.currentInteractionState == 1) {
            this.gps.lastRelevantICAO = this.nearestVORList.vors[this.vorsSliderGroup.getIndex()].icao;
            this.gps.lastRelevantICAOType = "V";
        }
    }
    onEvent(_event) {
    }
    vor_SelectionCallback(_event, _index) {
        switch (_event) {
            case "ENT_Push":
                this.gps.SwitchToPageName("WPT", "VOR");
                this.gps.SwitchToInteractionState(0);
                return true;
        }
    }
    frequency_SelectionCallback(_event, _index) {
        switch (_event) {
            case "ENT_Push":
                SimVar.SetSimVarValue("K:NAV" + this.gps.navIndex + "_STBY_SET", "Frequency BCD16", this.nearestVORList.vors[_index].frequencyBCD16);
                return true;
        }
    }
}
class GPS_NearestAirpaces extends NavSystemElement {
    constructor() {
        super();
        this.name = "NRSTAirspace";
    }
    init() {
        this.nrstAirspaceName1 = this.gps.getChildById("NRST_Airspace_Name_1");
        this.nrstAirspaceStatus1 = this.gps.getChildById("NRST_Airspace_Status_1");
        this.nrstAirspaceName2 = this.gps.getChildById("NRST_Airspace_Name_2");
        this.nrstAirspaceStatus2 = this.gps.getChildById("NRST_Airspace_Status_2");
        this.nrstAirspaceName3 = this.gps.getChildById("NRST_Airspace_Name_3");
        this.nrstAirspaceStatus3 = this.gps.getChildById("NRST_Airspace_Status_3");
        this.nearestAirspacesList = new NearestAirspaceList(this.gps);
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        this.nearestAirspacesList.Update();
        var nbAirspaces = this.nearestAirspacesList.airspaces.length;
        if (nbAirspaces > 0) {
            let airspace = this.nearestAirspacesList.airspaces[0];
            diffAndSetText(this.nrstAirspaceName1, airspace.name);
            diffAndSetText(this.nrstAirspaceStatus1, airspace.GetStatus());
        }
        else {
            diffAndSetText(this.nrstAirspaceName1, "____________________");
            diffAndSetText(this.nrstAirspaceStatus1, "___________________");
        }
        if (nbAirspaces > 1) {
            let airspace = this.nearestAirspacesList.airspaces[1];
            diffAndSetText(this.nrstAirspaceName2, airspace.name);
            diffAndSetText(this.nrstAirspaceStatus2, airspace.GetStatus());
        }
        else {
            diffAndSetText(this.nrstAirspaceName2, "____________________");
            diffAndSetText(this.nrstAirspaceStatus2, "___________________");
        }
        if (nbAirspaces > 2) {
            let airspace = this.nearestAirspacesList.airspaces[2];
            diffAndSetText(this.nrstAirspaceName3, airspace.name);
            diffAndSetText(this.nrstAirspaceStatus3, airspace.GetStatus());
        }
        else {
            diffAndSetText(this.nrstAirspaceName3, "____________________");
            diffAndSetText(this.nrstAirspaceStatus3, "___________________");
        }
        this.nearestAirspacesList.airspaces;
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
class GPS_DirectTo extends NavSystemElement {
    constructor() {
        super();
        this.name = "DRCT";
    }
    init() {
        this.icao = this.gps.getChildById("DRCTIcao");
        this.airportPrivateLogo = this.gps.getChildById("DRCTAirportPrivateLogo");
        this.region = this.gps.getChildById("DRCTRegion");
        this.facilityName = this.gps.getChildById("DRCTFacilityName");
        this.city = this.gps.getChildById("DRCTCity");
        this.fpl = this.gps.getChildById("DRCTFpl");
        this.nrst = this.gps.getChildById("DRCTNrst");
        this.posNS = this.gps.getChildById("DRCTPosNS");
        this.posEW = this.gps.getChildById("DRCTPosEW");
        this.crs = this.gps.getChildById("DRCTCrs");
        this.activate = this.gps.getChildById("DRCTActivate");
        this.icaoSearchField = new SearchFieldWaypointICAO(this.gps, [this.icao], this.gps, 'WANV');
        this.currentFPLWpSelected = 0;
        this.geoCalc = new GeoCalcInfo(this.gps);
        this.defaultSelectables = [
            new SelectableElement(this.gps, this.icao, this.searchField_SelectionCallback.bind(this)),
            new SelectableElement(this.gps, this.fpl, this.flightPlan_SelectionCallback.bind(this)),
            new SelectableElement(this.gps, this.activate, this.activateButton_SelectionCallback.bind(this))
        ];
        this.duplicateWaypoints = new NavSystemElementContainer("Duplicate Waypoints", "DuplicateWaypointWindow", new MFD_DuplicateWaypoint());
        this.duplicateWaypoints.setGPS(this.gps);
        this.duplicateWaypoints.element.icaoSearchField = this.icaoSearchField;
    }
    onEnter() {
        this.currentFPLWpSelected = 0;
        this.gps.currFlightPlan.FillWithCurrentFP();
        if (this.gps.lastRelevantICAO) {
            this.icaoSearchField.SetWaypoint(this.gps.lastRelevantICAOType, this.gps.lastRelevantICAO);
        }
    }
    onUpdate(_deltaTime) {
        var infos = this.icaoSearchField.getWaypoint() ? this.icaoSearchField.getWaypoint().infos : null;
        if (infos && infos.icao != '') {
            diffAndSetText(this.icao, infos.icao);
            var logo = infos.GetSymbol();
            if (logo != "") {
                diffAndSetHTML(this.airportPrivateLogo, '<img src="/Pages/VCockpit/Instruments/NavSystems/Shared/Images/' + logo + '">');
            }
            diffAndSetText(this.region, infos.region);
            diffAndSetText(this.facilityName, infos.name);
            diffAndSetText(this.city, infos.city);
            diffAndSetText(this.posNS, this.gps.latitudeFormat(infos.coordinates.lat));
            diffAndSetText(this.posEW, this.gps.longitudeFormat(infos.coordinates.long));
            if (this.geoCalc.IsIdle()) {
                this.geoCalc.SetParams(SimVar.GetSimVarValue("GPS POSITION LAT", "degree latitude"), SimVar.GetSimVarValue("GPS POSITION LON", "degree longitude"), infos.coordinates.lat, infos.coordinates.long, true);
                this.geoCalc.Compute(function () {
                    if (this.drctCrs) {
                        diffAndSetText(this.drctCrs, fastToFixed(this.geoCalc.bearing, 0));
                    }
                }.bind(this));
            }
        }
        else {
            diffAndSetText(this.icao, "_____");
            diffAndSetText(this.region, "__________");
            diffAndSetText(this.facilityName, "______________________");
            diffAndSetText(this.city, "______________________");
            diffAndSetText(this.posNS, "_ __°__.__'");
            diffAndSetText(this.posEW, "____°__.__'");
            diffAndSetText(this.crs, "___");
        }
        this.icaoSearchField.Update();
        if (this.currentFPLWpSelected < this.gps.currFlightPlan.wayPoints.length) {
            diffAndSetText(this.fpl, this.gps.currFlightPlan.wayPoints[this.currentFPLWpSelected].GetInfos().ident);
        }
    }
    onExit() {
    }
    onEvent(_event) {
    }
    searchField_SelectionCallback(_event) {
        if (_event == "ENT_Push" || _event == "RightSmallKnob_Right" || _event == "RightSmallKnob_Left") {
            this.gps.currentSearchFieldWaypoint = this.icaoSearchField;
            this.icaoSearchField.StartSearch(this.onSearchEnd.bind(this));
            this.gps.SwitchToInteractionState(3);
        }
    }
    onSearchEnd() {
        if (this.icaoSearchField.duplicates.length > 0) {
            this.gps.switchToPopUpPage(this.duplicateWaypoints, () => {
                this.icaoSearchField.getWaypoint().SetICAO(this.gps.lastRelevantICAO);
                this.gps.ActiveSelection(this.defaultSelectables);
                this.gps.cursorIndex = 2;
            });
        }
        else {
            this.gps.ActiveSelection(this.defaultSelectables);
            this.gps.cursorIndex = 2;
        }
    }
    flightPlan_SelectionCallback(_event) {
        if (_event == "ENT_Push" || _event == "RightSmallKnob_Right" || _event == "RightSmallKnob_Left") {
            var elements = [];
            for (var i = 0; i < this.gps.currFlightPlan.wayPoints.length; i++) {
                elements.push(new ContextualMenuElement(this.gps.currFlightPlan.wayPoints[i].GetInfos().ident, function (_index) {
                    this.currentFPLWpSelected = _index;
                    this.icaoSearchField.SetWaypoint(this.gps.currFlightPlan.wayPoints[_index].type, this.gps.currFlightPlan.wayPoints[_index].GetInfos().icao);
                    this.gps.SwitchToInteractionState(0);
                }.bind(this, i)));
            }
            if (this.gps.currFlightPlan.wayPoints.length > 0) {
                this.gps.ShowContextualMenu(new ContextualMenu("FPL", elements));
            }
        }
    }
    activateButton_SelectionCallback(_event) {
        if (_event == "ENT_Push") {
            this.gps.currFlightPlanManager.activateDirectTo(this.icaoSearchField.getWaypoint().infos.icao, () => {
                this.gps.SwitchToInteractionState(0);
                this.gps.leaveEventPage();
            });
        }
    }
}
class GPS_WaypointLine extends MFD_WaypointLine {
    getString() {
        if (this.waypoint) {
            let infos = this.waypoint.GetInfos();
            return '<td class="SelectableElement Select0">' + (infos.ident != "" ? infos.ident : this.waypoint.ident) + '</td><td>'
                + (isNaN(this.waypoint.cumulativeDistanceInFP) ? "" : fastToFixed(this.waypoint.cumulativeDistanceInFP, 0) + '<div class="Align unit">n<br/>m</div>') + '</td><td>'
                + fastToFixed(this.waypoint.distanceInFP, 1) + '<div class="Align unit">n<br/>m</div></td>';
        }
        else if (this.element.emptyLine != "") {
            return this.element.emptyLine;
        }
        else {
            return '<td class="SelectableElement Select0"></td><td> </td><td> </td>';
        }
    }
    onEvent(_subindex, _event) {
        super.onEvent(_subindex, _event);
        switch (_event) {
            case "MENU_Push":
                this.element.selectedLine = this;
                break;
            case "ActivateWaypoint":
                SimVar.SetSimVarValue("C:fs9gps:FlightPlanActiveWaypoint", "number", this.index);
                break;
        }
        return false;
    }
}
class GPS_ApproachWaypointLine extends MFD_ApproachWaypointLine {
    getString() {
        if (this.waypoint) {
            return '<td class="SelectableElement Select0">' + this.waypoint.ident + '</td><td>'
                + (isNaN(this.waypoint.cumulativeDistanceInFP) ? "" : fastToFixed(this.waypoint.cumulativeDistanceInFP, 0) + '<div class="Align unit">n<br/>m</div>') + '</td><td>'
                + fastToFixed(this.waypoint.distanceInFP, 1) + '<div class="Align unit">n<br/>m</div></td>';
        }
        else {
            return '<td class="SelectableElement Select0"></td><td> </td><td> </td>';
        }
    }
}
class GPS_ActiveFPL extends MFD_ActiveFlightPlan_Element {
    constructor() {
        super(GPS_WaypointLine, GPS_ApproachWaypointLine, 4, 3);
        this.emptyLine = '<td class="SelectableElement Select0">_____</td><td>___<div class="Align unit">n<br/>m</div></td><td>__._<div class="Align unit">n<br/> m </div></td>';
        this.name = "ActiveFPL";
    }
    init(_root) {
        super.init(_root);
        this.container.defaultMenu = new ContextualMenu("PAGE MENU", [
            new ContextualMenuElement("Activate&nbsp;Leg?", this.FPLActivateLeg_CB.bind(this), this.activateStateCB.bind(this)),
            new ContextualMenuElement("Crossfill?", this.FPLCrossfill_CB.bind(this), true),
            new ContextualMenuElement("Copy&nbsp;Flight&nbsp;Plan?", this.FPLCopyFlightPlan_CB.bind(this), true),
            new ContextualMenuElement("Invert&nbsp;Flight&nbsp;Plan?", this.FPLInvertFlightPlan_CB.bind(this)),
            new ContextualMenuElement("Delete&nbsp;Flight&nbsp;Plan?", this.FPLDeleteFlightPlan_CB.bind(this)),
            new ContextualMenuElement("Select&nbsp;Approach?", this.FPLSelectApproach_CB.bind(this)),
            new ContextualMenuElement("Select&nbsp;Arrival?", this.FPLSelectArrival_CB.bind(this)),
            new ContextualMenuElement("Select&nbsp;Departure?", this.FPLSelectDeparture_CB.bind(this)),
            new ContextualMenuElement("Remove&nbsp;Approach?", this.FPLRemoveApproach_CB.bind(this), this.removeApproachStateCB.bind(this)),
            new ContextualMenuElement("Remove&nbsp;Arrival?", this.FPLRemoveArrival_CB.bind(this), this.removeArrivalStateCB.bind(this)),
            new ContextualMenuElement("Remove&nbsp;Departure?", this.FPLRemoveDeparture_CB.bind(this), this.removeDepartureStateCB.bind(this)),
            new ContextualMenuElement("Closest&nbsp;Point&nbsp;of&nbsp;FPL?", this.FPLClosestPoint_CB.bind(this), true),
            new ContextualMenuElement("Change&nbsp;Fields?", this.FPLChangeFields_CB.bind(this), true),
            new ContextualMenuElement("Restore&nbsp;Defaults?", this.FPLRestoreDefaults_CB.bind(this), true),
        ]);
        this.newWaypointPage = new NavSystemPage("WaypointSelection", "WaypointSelection", new GPS_FPLWaypointSelection());
        this.newWaypointPage.pageGroup = (this.container).pageGroup;
        this.newWaypointPage.gps = this.gps;
        this.waypointWindow = this.newWaypointPage;
    }
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
        if (this.gps.currentInteractionState != 2) {
            this.selectedLine = null;
        }
    }
    activateStateCB() {
        return this.selectedLine == null;
    }
    removeApproachStateCB() {
        return this.gps.currFlightPlanManager.getApproachIndex() == -1;
    }
    removeArrivalStateCB() {
        return this.gps.currFlightPlanManager.getArrivalProcIndex() == -1;
    }
    removeDepartureStateCB() {
        return this.gps.currFlightPlanManager.getDepartureProcIndex() == -1;
    }
    FPLActivateLeg_CB() {
        if (this.selectedLine) {
            this.selectedLine.onEvent(0, "ActivateWaypoint");
        }
        this.gps.SwitchToInteractionState(0);
    }
    FPLCrossfill_CB() {
        this.gps.SwitchToInteractionState(0);
    }
    FPLCopyFlightPlan_CB() {
        this.gps.SwitchToInteractionState(0);
    }
    FPLInvertFlightPlan_CB() {
        this.gps.currFlightPlanManager.invertActiveFlightPlan(() => {
            this.gps.currFlightPlanManager.updateFlightPlan(this.updateWaypoints.bind(this));
        });
        this.gps.SwitchToInteractionState(0);
    }
    FPLDeleteFlightPlan_CB() {
        this.gps.currFlightPlanManager.clearFlightPlan();
        this.gps.SwitchToInteractionState(0);
        this.fplSliderGroup.updateDisplay();
    }
    FPLSelectApproach_CB(_param) {
        this.gps.switchToPopUpPage(this.gps.selectApproachPage);
    }
    FPLSelectArrival_CB() {
        this.gps.switchToPopUpPage(this.gps.selectArrivalPage);
    }
    FPLSelectDeparture_CB() {
        this.gps.switchToPopUpPage(this.gps.selectDeparturePage);
    }
    FPLRemoveApproach_CB() {
        this.gps.currFlightPlanManager.setArrivalProcIndex(-1);
    }
    FPLRemoveArrival_CB() {
        this.gps.currFlightPlanManager.removeArrival();
    }
    FPLRemoveDeparture_CB() {
        this.gps.currFlightPlanManager.removeDeparture();
    }
    FPLClosestPoint_CB() {
        this.gps.SwitchToInteractionState(0);
    }
    FPLChangeFields_CB() {
        this.gps.SwitchToInteractionState(0);
    }
    FPLRestoreDefaults_CB() {
        this.gps.SwitchToInteractionState(0);
    }
    onWaypointSelectionEnd() {
        if (this.gps.lastRelevantICAO) {
            this.gps.currFlightPlanManager.addWaypoint(this.gps.lastRelevantICAO, this.selectedIndex);
        }
        if (!this.gps.popUpElement) {
            this.gps.ActiveSelection(this.defaultSelectables);
        }
    }
    FPLConfirmDeleteYes_CB() {
        SimVar.SetSimVarValue("C:fs9gps:FlightPlanDeleteWaypoint", "number", this.fplSliderGroup.getIndex());
        this.gps.currFlightPlan.FillWithCurrentFP();
        this.gps.SwitchToInteractionState(0);
    }
    FPLConfirmDeleteNo_CB() {
        this.gps.SwitchToInteractionState(0);
    }
}
class GPS_Messages extends NavSystemElement {
    constructor() {
        super();
        this.name = "MSG";
    }
    init() {
        this.messages = this.gps.getChildById("Messages");
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        var html = "";
        diffAndSetHTML(this.messages, html);
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
class GPS_FPLWaypointSelection extends NavSystemElement {
    constructor() {
        super();
        this.name = "WaypointSelection";
    }
    init(_root) {
        this.root = _root;
        this.wpSIdent = this.gps.getChildById("WPSIdent");
        this.wpSRegion = this.gps.getChildById("WPSIdent2");
        this.wpSFacility1 = this.gps.getChildById("WPSFacility1");
        this.wpSFacility2 = this.gps.getChildById("WPSFacility2");
        this.wpSPosNS = this.gps.getChildById("WPSPosNS");
        this.wpSPosEW = this.gps.getChildById("WPSPosEW");
        this.waypointSelectionSearchField = new SearchFieldWaypointICAO(this.gps, [this.wpSIdent], this.gps, "AWNV");
        this.duplicateWaypoints = new NavSystemElementContainer("Duplicate Waypoints", "DuplicateWaypointWindow", new MFD_DuplicateWaypoint());
        this.duplicateWaypoints.setGPS(this.gps);
        this.duplicateWaypoints.element.icaoSearchField = this.waypointSelectionSearchField;
    }
    onEnter() {
        diffAndSetAttribute(this.root, "state", "Active");
        this.gps.SwitchToInteractionState(3);
        this.gps.currentSearchFieldWaypoint = this.waypointSelectionSearchField;
        this.waypointSelectionSearchField.StartSearch(this.onSearchFieldValidation.bind(this));
    }
    onUpdate(_deltaTime) {
        var infos = this.waypointSelectionSearchField.getUpdatedInfos();
        diffAndSetText(this.wpSRegion, infos.region ? infos.region : '');
        diffAndSetText(this.wpSFacility1, infos.name ? infos.name : '');
        diffAndSetText(this.wpSFacility2, infos.city ? infos.city : '');
        if (infos.coordinates && infos.coordinates.lat && infos.coordinates.long) {
            diffAndSetText(this.wpSPosNS, this.gps.latitudeFormat(infos.coordinates.lat));
            diffAndSetText(this.wpSPosEW, this.gps.longitudeFormat(infos.coordinates.long));
        }
        else {
            diffAndSetText(this.wpSPosNS, '');
            diffAndSetText(this.wpSPosEW, '');
        }
        this.waypointSelectionSearchField.Update();
    }
    onExit() {
        diffAndSetAttribute(this.root, "state", "Inactive");
    }
    onSearchFieldValidation() {
        if (this.waypointSelectionSearchField.duplicates.length > 0) {
            this.gps.lastRelevantICAO = null;
            this.gps.lastRelevantICAOType = null;
            this.gps.switchToPopUpPage(this.duplicateWaypoints, this.gps.popUpCloseCallback);
        }
        else {
            var infos = this.waypointSelectionSearchField.getUpdatedInfos();
            this.gps.lastRelevantICAO = infos.icao;
            this.gps.lastRelevantICAOType = infos.getWaypointType();
            this.gps.closePopUpElement();
        }
    }
    onEvent(_event) {
        if (_event == "DRCT_Push"
            || _event == "FPL_Push"
            || _event == "PROC_Push"
            || _event == "MSG_Push"
            || _event == "CLR_Push_Long"
            || _event == "CLR_Push") {
            this.gps.lastRelevantICAO = null;
            this.gps.lastRelevantICAOType = null;
            this.gps.closePopUpElement();
        }
    }
}
class GPS_Procedures extends NavSystemElement {
    init(root) {
        this.ActivateVTF = this.gps.getChildById("ActivateVTF");
        this.ActivateApproach = this.gps.getChildById("ActivateApproach");
        this.SelectApproach = this.gps.getChildById("SelectApproach");
        this.SelectArrival = this.gps.getChildById("SelectArrival");
        this.SelectDeparture = this.gps.getChildById("SelectDeparture");
        this.defaultSelectables = [
            new SelectableElement(this.gps, this.ActivateApproach, this.activateApproach_CB.bind(this)),
            new SelectableElement(this.gps, this.SelectApproach, this.selectApproach_CB.bind(this)),
            new SelectableElement(this.gps, this.SelectArrival, this.selectArrival_CB.bind(this)),
            new SelectableElement(this.gps, this.SelectDeparture, this.selectDeparture_CB.bind(this)),
        ];
    }
    onEnter() {
        this.gps.ActiveSelection(this.defaultSelectables);
    }
    onUpdate(_deltaTime) {
    }
    onExit() {
    }
    onEvent(_event) {
    }
    activateVTF_CB(_event) {
    }
    activateApproach_CB(_event) {
    }
    selectApproach_CB(_event) {
        if (_event == "ENT_Push") {
            this.gps.switchToPopUpPage(this.gps.selectApproachPage);
        }
    }
    selectArrival_CB(_event) {
        if (_event == "ENT_Push") {
            this.gps.switchToPopUpPage(this.gps.selectArrivalPage);
        }
    }
    selectDeparture_CB(_event) {
        if (_event == "ENT_Push") {
            this.gps.switchToPopUpPage(this.gps.selectDeparturePage);
        }
    }
}
class GPS_ApproachSelection extends MFD_ApproachSelection {
    init(root) {
        super.init(root);
        this.approachSelectionGroup = new SelectableElementSliderGroup(this.gps, [
            new SelectableElement(this.gps, this.approachList.getElementsByClassName("L1")[0], this.approach_CB.bind(this)),
            new SelectableElement(this.gps, this.approachList.getElementsByClassName("L2")[0], this.approach_CB.bind(this)),
            new SelectableElement(this.gps, this.approachList.getElementsByClassName("L3")[0], this.approach_CB.bind(this)),
            new SelectableElement(this.gps, this.approachList.getElementsByClassName("L4")[0], this.approach_CB.bind(this)),
            new SelectableElement(this.gps, this.approachList.getElementsByClassName("L5")[0], this.approach_CB.bind(this)),
            new SelectableElement(this.gps, this.approachList.getElementsByClassName("L6")[0], this.approach_CB.bind(this)),
        ], this.approachList.getElementsByClassName("Slider")[0], this.approachList.getElementsByClassName("SliderCursor")[0]);
        this.approachSelectables = [this.approachSelectionGroup];
        this.transitionSelectionGroup = new SelectableElementSliderGroup(this.gps, [
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L1")[0], this.transition_CB.bind(this)),
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L2")[0], this.transition_CB.bind(this)),
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L3")[0], this.transition_CB.bind(this)),
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L4")[0], this.transition_CB.bind(this)),
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L5")[0], this.transition_CB.bind(this)),
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L6")[0], this.transition_CB.bind(this)),
        ], this.transitionList.getElementsByClassName("Slider")[0], this.transitionList.getElementsByClassName("SliderCursor")[0]);
        this.transitionSelectables = [this.transitionSelectionGroup];
    }
    onEvent(_event) {
        super.onEvent(_event);
        if (_event == "DRCT_Push"
            || _event == "FPL_Push"
            || _event == "PROC_Push"
            || _event == "MSG_Push"
            || _event == "CLR_Push_Long"
            || _event == "CLR_Push") {
            this.gps.closePopUpElement();
        }
    }
    approach_CB(_event, _index) {
        if (_event == "ENT_Push") {
            this.selectApproach(_index, _event);
            this.gps.ActiveSelection(this.defaultSelectables);
            this.gps.cursorIndex = 1;
        }
    }
    transition_CB(_event, _index) {
        if (_event == "ENT_Push") {
            this.selectTransition(_index, _event);
            this.gps.ActiveSelection(this.defaultSelectables);
            this.gps.cursorIndex = 2;
        }
    }
    openApproachList(_event) {
        if (_event == "ENT_Push" || _event == "NavigationSmallInc" || _event == "NavigationSmallDec") {
            let infos = this.icaoSearchField.getUpdatedInfos();
            if (infos && infos.icao) {
                let elems = new Array();
                for (let i = 0; i < infos.approaches.length; i++) {
                    elems.push(infos.approaches[i].name);
                }
                this.approachSelectionGroup.setStringElements(elems);
                if (elems.length > 0) {
                    diffAndSetAttribute(this.approachList, "state", "Active");
                    this.gps.ActiveSelection(this.approachSelectables);
                }
            }
        }
    }
    getSelectedApproach(airport) {
        if (airport && airport.approaches && this.selectedApproach >= 0 && this.selectedApproach < airport.approaches.length) {
            return airport.approaches[this.selectedApproach];
        }
        return null;
    }
    openTransitionList(_event) {
        if (_event == "ENT_Push" || _event == "NavigationSmallInc" || _event == "NavigationSmallDec") {
            let infos = this.icaoSearchField.getUpdatedInfos();
            if (infos && infos.icao) {
                let elems = new Array();
                let approach = this.getSelectedApproach(infos);
                if (approach) {
                    for (let i = 0; i < approach.transitions.length; i++) {
                        elems.push(approach.transitions[i].name);
                    }
                }
                this.transitionSelectionGroup.setStringElements(elems);
                if (elems.length > 0) {
                    diffAndSetAttribute(this.transitionList, "state", "Active");
                    this.gps.ActiveSelection(this.transitionSelectables);
                }
            }
        }
    }
    onExit() {
        super.onExit();
        diffAndSetAttribute(this.approachList, "state", "Inactive");
        diffAndSetAttribute(this.transitionList, "state", "Inactive");
    }
}
class GPS_ArrivalSelection extends MFD_ArrivalSelection {
    init(root) {
        super.init(root);
        this.arrivalSelectionGroup = new SelectableElementSliderGroup(this.gps, [
            new SelectableElement(this.gps, this.arrivalList.getElementsByClassName("L1")[0], this.arrival_CB.bind(this)),
            new SelectableElement(this.gps, this.arrivalList.getElementsByClassName("L2")[0], this.arrival_CB.bind(this)),
            new SelectableElement(this.gps, this.arrivalList.getElementsByClassName("L3")[0], this.arrival_CB.bind(this)),
            new SelectableElement(this.gps, this.arrivalList.getElementsByClassName("L4")[0], this.arrival_CB.bind(this)),
            new SelectableElement(this.gps, this.arrivalList.getElementsByClassName("L5")[0], this.arrival_CB.bind(this)),
            new SelectableElement(this.gps, this.arrivalList.getElementsByClassName("L6")[0], this.arrival_CB.bind(this)),
        ], this.arrivalList.getElementsByClassName("Slider")[0], this.arrivalList.getElementsByClassName("SliderCursor")[0]);
        this.arrivalSelectables = [this.arrivalSelectionGroup];
        this.runwaySelectionGroup = new SelectableElementSliderGroup(this.gps, [
            new SelectableElement(this.gps, this.runwayList.getElementsByClassName("L1")[0], this.runway_CB.bind(this)),
            new SelectableElement(this.gps, this.runwayList.getElementsByClassName("L2")[0], this.runway_CB.bind(this)),
            new SelectableElement(this.gps, this.runwayList.getElementsByClassName("L3")[0], this.runway_CB.bind(this)),
            new SelectableElement(this.gps, this.runwayList.getElementsByClassName("L4")[0], this.runway_CB.bind(this)),
            new SelectableElement(this.gps, this.runwayList.getElementsByClassName("L5")[0], this.runway_CB.bind(this)),
            new SelectableElement(this.gps, this.runwayList.getElementsByClassName("L6")[0], this.runway_CB.bind(this)),
        ], this.runwayList.getElementsByClassName("Slider")[0], this.runwayList.getElementsByClassName("SliderCursor")[0]);
        this.runwaySelectables = [this.runwaySelectionGroup];
        this.transitionSelectionGroup = new SelectableElementSliderGroup(this.gps, [
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L1")[0], this.transition_CB.bind(this)),
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L2")[0], this.transition_CB.bind(this)),
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L3")[0], this.transition_CB.bind(this)),
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L4")[0], this.transition_CB.bind(this)),
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L5")[0], this.transition_CB.bind(this)),
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L6")[0], this.transition_CB.bind(this)),
        ], this.transitionList.getElementsByClassName("Slider")[0], this.transitionList.getElementsByClassName("SliderCursor")[0]);
        this.transitionSelectables = [this.transitionSelectionGroup];
    }
    onEvent(_event) {
        super.onEvent(_event);
        if (_event == "DRCT_Push"
            || _event == "FPL_Push"
            || _event == "PROC_Push"
            || _event == "MSG_Push"
            || _event == "CLR_Push_Long"
            || _event == "CLR_Push") {
            this.gps.closePopUpElement();
        }
    }
    arrival_CB(_event, _index) {
        if (_event == "ENT_Push") {
            this.selectArrival(_index, _event);
            this.gps.ActiveSelection(this.defaultSelectables);
            this.gps.cursorIndex = 1;
        }
    }
    runway_CB(_event, _index) {
        if (_event == "ENT_Push") {
            this.selectRunway(_index, _event);
            this.gps.ActiveSelection(this.defaultSelectables);
            this.gps.cursorIndex = 2;
        }
    }
    transition_CB(_event, _index) {
        if (_event == "ENT_Push") {
            this.selectTransition(_index, _event);
            this.gps.ActiveSelection(this.defaultSelectables);
            this.gps.cursorIndex = 3;
        }
    }
    openArrivalList(_event) {
        if (_event == "ENT_Push" || _event == "NavigationSmallInc" || _event == "NavigationSmallDec") {
            let infos = this.icaoSearchField.getUpdatedInfos();
            if (infos && infos.icao) {
                let elems = new Array();
                for (let i = 0; i < infos.arrivals.length; i++) {
                    elems.push(infos.arrivals[i].name);
                }
                this.arrivalSelectionGroup.setStringElements(elems);
                if (elems.length > 0) {
                    diffAndSetAttribute(this.arrivalList, "state", "Active");
                    this.gps.ActiveSelection(this.arrivalSelectables);
                }
            }
        }
    }
    getSelectedArrival(airport) {
        if (airport && airport.arrivals && this.selectedArrival >= 0 && this.selectedArrival < airport.arrivals.length) {
            return airport.arrivals[this.selectedArrival];
        }
        return null;
    }
    openRunwaysList(_event) {
        if (_event == "ENT_Push" || _event == "NavigationSmallInc" || _event == "NavigationSmallDec") {
            let infos = this.icaoSearchField.getUpdatedInfos();
            if (infos && infos.icao) {
                let elems = new Array();
                let arrival = this.getSelectedArrival(infos);
                if (arrival) {
                    for (let i = 0; i < arrival.runwayTransitions.length; i++) {
                        elems.push(arrival.runwayTransitions[i].name);
                    }
                }
                this.runwaySelectionGroup.setStringElements(elems);
                if (elems.length > 0) {
                    diffAndSetAttribute(this.runwayList, "state", "Active");
                    this.gps.ActiveSelection(this.runwaySelectables);
                }
            }
        }
    }
    openTransitionList(_event) {
        if (_event == "ENT_Push" || _event == "NavigationSmallInc" || _event == "NavigationSmallDec") {
            let infos = this.icaoSearchField.getUpdatedInfos();
            if (infos && infos.icao) {
                let elems = new Array();
                let arrival = this.getSelectedArrival(infos);
                if (arrival) {
                    for (let i = 0; i < arrival.enRouteTransitions.length; i++) {
                        elems.push(arrival.enRouteTransitions[i].name);
                    }
                }
                this.transitionSelectionGroup.setStringElements(elems);
                if (elems.length > 0) {
                    diffAndSetAttribute(this.transitionList, "state", "Active");
                    this.gps.ActiveSelection(this.transitionSelectables);
                }
            }
        }
    }
}
class GPS_DepartureSelection extends MFD_DepartureSelection {
    init(root) {
        super.init(root);
        this.departureSelectionGroup = new SelectableElementSliderGroup(this.gps, [
            new SelectableElement(this.gps, this.departureList.getElementsByClassName("L1")[0], this.departure_CB.bind(this)),
            new SelectableElement(this.gps, this.departureList.getElementsByClassName("L2")[0], this.departure_CB.bind(this)),
            new SelectableElement(this.gps, this.departureList.getElementsByClassName("L3")[0], this.departure_CB.bind(this)),
            new SelectableElement(this.gps, this.departureList.getElementsByClassName("L4")[0], this.departure_CB.bind(this)),
            new SelectableElement(this.gps, this.departureList.getElementsByClassName("L5")[0], this.departure_CB.bind(this)),
            new SelectableElement(this.gps, this.departureList.getElementsByClassName("L6")[0], this.departure_CB.bind(this)),
        ], this.departureList.getElementsByClassName("Slider")[0], this.departureList.getElementsByClassName("SliderCursor")[0]);
        this.departureSelectables = [this.departureSelectionGroup];
        this.runwaySelectionGroup = new SelectableElementSliderGroup(this.gps, [
            new SelectableElement(this.gps, this.runwayList.getElementsByClassName("L1")[0], this.runway_CB.bind(this)),
            new SelectableElement(this.gps, this.runwayList.getElementsByClassName("L2")[0], this.runway_CB.bind(this)),
            new SelectableElement(this.gps, this.runwayList.getElementsByClassName("L3")[0], this.runway_CB.bind(this)),
            new SelectableElement(this.gps, this.runwayList.getElementsByClassName("L4")[0], this.runway_CB.bind(this)),
            new SelectableElement(this.gps, this.runwayList.getElementsByClassName("L5")[0], this.runway_CB.bind(this)),
            new SelectableElement(this.gps, this.runwayList.getElementsByClassName("L6")[0], this.runway_CB.bind(this)),
        ], this.runwayList.getElementsByClassName("Slider")[0], this.runwayList.getElementsByClassName("SliderCursor")[0]);
        this.runwaySelectables = [this.runwaySelectionGroup];
        this.transitionSelectionGroup = new SelectableElementSliderGroup(this.gps, [
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L1")[0], this.transition_CB.bind(this)),
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L2")[0], this.transition_CB.bind(this)),
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L3")[0], this.transition_CB.bind(this)),
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L4")[0], this.transition_CB.bind(this)),
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L5")[0], this.transition_CB.bind(this)),
            new SelectableElement(this.gps, this.transitionList.getElementsByClassName("L6")[0], this.transition_CB.bind(this)),
        ], this.transitionList.getElementsByClassName("Slider")[0], this.transitionList.getElementsByClassName("SliderCursor")[0]);
        this.transitionSelectables = [this.transitionSelectionGroup];
    }
    onEvent(_event) {
        super.onEvent(_event);
        if (_event == "DRCT_Push"
            || _event == "FPL_Push"
            || _event == "PROC_Push"
            || _event == "MSG_Push"
            || _event == "CLR_Push_Long"
            || _event == "CLR_Push") {
            this.gps.closePopUpElement();
        }
    }
    departure_CB(_event, _index) {
        this.selectDeparture(_index, _event);
        if (_event == "ENT_Push") {
            this.gps.ActiveSelection(this.defaultSelectables);
            this.gps.cursorIndex = 1;
        }
    }
    runway_CB(_event, _index) {
        this.selectRunway(_index, _event);
        if (_event == "ENT_Push") {
            this.gps.ActiveSelection(this.defaultSelectables);
            this.gps.cursorIndex = 2;
        }
    }
    transition_CB(_event, _index) {
        this.selectTransition(_index, _event);
        if (_event == "ENT_Push") {
            this.gps.ActiveSelection(this.defaultSelectables);
            this.gps.cursorIndex = 3;
        }
    }
    openDepartureList(_event) {
        if (_event == "ENT_Push" || _event == "NavigationSmallInc" || _event == "NavigationSmallDec") {
            let infos = this.icaoSearchField.getUpdatedInfos();
            if (infos && infos.icao) {
                let elems = new Array();
                for (let i = 0; i < infos.departures.length; i++) {
                    elems.push(infos.departures[i].name);
                }
                this.departureSelectionGroup.setStringElements(elems);
                if (elems.length > 0) {
                    diffAndSetAttribute(this.departureList, "state", "Active");
                    this.gps.ActiveSelection(this.departureSelectables);
                }
            }
        }
    }
    getSelectedDeparture(airport) {
        if (airport && airport.departures && this.selectedDeparture >= 0 && this.selectedDeparture < airport.departures.length) {
            return airport.departures[this.selectedDeparture];
        }
        return null;
    }
    openRunwaysList(_event) {
        if (_event == "ENT_Push" || _event == "NavigationSmallInc" || _event == "NavigationSmallDec") {
            let infos = this.icaoSearchField.getUpdatedInfos();
            if (infos && infos.icao) {
                let elems = new Array();
                let departure = this.getSelectedDeparture(infos);
                if (departure) {
                    for (let i = 0; i < departure.runwayTransitions.length; i++) {
                        elems.push(departure.runwayTransitions[i].name);
                    }
                }
                this.runwaySelectionGroup.setStringElements(elems);
                if (elems.length > 0) {
                    diffAndSetAttribute(this.runwayList, "state", "Active");
                    this.gps.ActiveSelection(this.runwaySelectables);
                }
            }
        }
    }
    openTransitionList(_event) {
        if (_event == "ENT_Push" || _event == "NavigationSmallInc" || _event == "NavigationSmallDec") {
            let infos = this.icaoSearchField.getUpdatedInfos();
            if (infos && infos.icao) {
                let elems = new Array();
                let departure = this.getSelectedDeparture(infos);
                if (departure) {
                    for (let i = 0; i < departure.enRouteTransitions.length; i++) {
                        elems.push(departure.enRouteTransitions[i].name);
                    }
                }
                this.transitionSelectionGroup.setStringElements(elems);
                if (elems.length > 0) {
                    diffAndSetAttribute(this.transitionList, "state", "Active");
                    this.gps.ActiveSelection(this.transitionSelectables);
                }
            }
        }
    }
}
class GPS_MapInfos extends NavSystemElement {
    init(root) {
        this.wpt = this.gps.getChildById("WPT");
        this.dtkMap = this.gps.getChildById("DTKMap");
        this.disMap = this.gps.getChildById("DISMap");
        this.gsMap = this.gps.getChildById("GSMap");
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        let flightPlanActive = SimVar.GetSimVarValue("GPS IS ACTIVE FLIGHT PLAN", "boolean");
        diffAndSetText(this.wpt, Simplane.getGPSWpNextID());
        diffAndSetText(this.dtkMap, !flightPlanActive ? "___" : fastToFixed(SimVar.GetSimVarValue("GPS WP DESIRED TRACK", "degree"), 0));
        diffAndSetText(this.disMap, !flightPlanActive ? "___._" : fastToFixed(SimVar.GetSimVarValue("GPS WP DISTANCE", "nautical mile"), 1));
        diffAndSetText(this.gsMap, fastToFixed(Simplane.getGroundSpeed(), 0));
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
class GPS_COMSetup extends NavSystemElement {
    init(root) {
        this.channelSpacingValue = this.gps.getChildById("ChannelSpacing_Value");
        this.channelSpacingMenu = new ContextualMenu("SPACING", [
            new ContextualMenuElement("8.33 KHZ", this.channelSpacingSet.bind(this, 1)),
            new ContextualMenuElement("25.0 KHZ", this.channelSpacingSet.bind(this, 0))
        ]);
        this.defaultSelectables = [
            new SelectableElement(this.gps, this.channelSpacingValue, this.channelSpacingCB.bind(this))
        ];
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        diffAndSetText(this.channelSpacingValue, SimVar.GetSimVarValue("COM SPACING MODE:" + this.gps.comIndex, "Enum") == 0 ? "25.0 KHZ" : "8.33 KHZ");
    }
    onExit() {
    }
    onEvent(_event) {
    }
    channelSpacingCB(_event) {
        if (_event == "ENT_Push" || _event == "NavigationSmallInc" || _event == "NavigationSmallDec") {
            this.gps.ShowContextualMenu(this.channelSpacingMenu);
        }
    }
    channelSpacingSet(_mode) {
        if (SimVar.GetSimVarValue("COM SPACING MODE:" + this.gps.comIndex, "Enum") != _mode) {
            SimVar.SetSimVarValue("K:COM_" + this.gps.comIndex + "_SPACING_MODE_SWITCH", "number", 0);
        }
        this.gps.SwitchToInteractionState(0);
    }
}
//# sourceMappingURL=BaseGPS.js.map