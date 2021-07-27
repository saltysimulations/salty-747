var Boeing;
(function (Boeing) {
    class ThrustModeDisplay {
        constructor(_rootElement) {
            this.rootElement = null;
            this.currentText = "";
            this.rootElement = _rootElement;
            this.refresh("", true);
        }
        getText(phase, mode) {
            let text = "-";
            if (phase <= FlightPhase.FLIGHT_PHASE_TAKEOFF) {
                text = "TO";
                if (mode === 1) {
                    text += " - 1";
                }
                if (mode === 2) {
                    text += " - 2";
                }
            }
            else if (phase <= FlightPhase.FLIGHT_PHASE_CLIMB) {
                text = "CLB";
                if (mode === 1) {
                    text += " - 1";
                }
                if (mode === 2) {
                    text += " - 2";
                }
            }
            else if (phase <= FlightPhase.FLIGHT_PHASE_CRUISE) {
                text = "CRZ";
            }
            return text;
        }
        update() {
            let phase = Simplane.getCurrentFlightPhase();
            let mode = 0;
            if (phase <= FlightPhase.FLIGHT_PHASE_TAKEOFF) {
                mode = Simplane.getEngineThrustTakeOffMode(0);
            }
            else {
                mode = Simplane.getEngineThrustClimbMode(0);
            }
            let tmaText = this.getText(phase, mode);
            this.refresh(tmaText);
        }
        refresh(_text, _force = false) {
            if ((_text != this.currentText) || _force) {
                this.currentText = _text;
                if (this.rootElement != null) {
                    diffAndSetHTML(this.rootElement, this.currentText);
                }
            }
        }
    }
    Boeing.ThrustModeDisplay = ThrustModeDisplay;
    class GearDisplay {
        constructor(_rootElement) {
            this.rootElement = null;
            this.currentValue = 0;
            this.timeout = 0;
            this.rootElement = _rootElement;
            this.refreshValue(0, true);
        }
        update(_deltaTime) {
            this.refreshValue(Simplane.getGearPosition());
            if ((this.currentValue <= 0) && (this.timeout > 0)) {
                this.timeout -= _deltaTime;
                if (this.timeout <= 0) {
                    if (this.rootElement != null) {
                        diffAndSetAttribute(this.rootElement, "class", "inactive");
                    }
                }
            }
        }
        refreshValue(_value, _force = false) {
            if ((_value != this.currentValue) || _force) {
                this.currentValue = _value;
                if (this.rootElement != null) {
                    if (this.currentValue <= 0) {
                        diffAndSetAttribute(this.rootElement, "class", "up");
                    }
                    else if (this.currentValue >= 100) {
                        diffAndSetAttribute(this.rootElement, "class", "down");
                    }
                    else {
                        diffAndSetAttribute(this.rootElement, "class", "transit");
                    }
                }
                if (this.currentValue <= 0) {
                    this.timeout = Boeing.GearDisplay.TIMEOUT_LENGTH;
                }
            }
        }
    }
    GearDisplay.TIMEOUT_LENGTH = 10000;
    Boeing.GearDisplay = GearDisplay;
    class FlapsDisplay {
        constructor(_rootElement, _marker, _valueText, _bar, _gauge) {
            this.barHeight = 0;
            this.barTop = 0;
            this.flapsAngles = [];
            this.flapsHandlePercents = [];
            this.rootElement = _rootElement;
            this.marker = _marker;
            this.valueText = _valueText;
            this.bar = _bar;
            this.gauge = _gauge;
            if (this.bar) {
                this.barTop = this.bar.y.baseVal.value;
                this.barHeight = this.bar.height.baseVal.value;
            }
            let flapsNbHandles = Simplane.getFlapsNbHandles();
            this.flapsHandlePercents = new Array();
            this.flapsAngles = new Array();
            for (let i = 0; i <= flapsNbHandles; i++) {
                this.flapsAngles[i] = Simplane.getFlapsHandleAngle(i);
                this.flapsHandlePercents[i] = i / flapsNbHandles;
            }
            this.cockpitSettings = SimVar.GetGameVarValue("", "GlassCockpitSettings");
            this.refreshValue(0, true);
        }
        update(_deltaTime) {
            this.refreshValue(Simplane.getFlapsAngle());
            if ((this.realFlapsAngle <= 0) && (this.timeout > 0)) {
                this.timeout -= _deltaTime;
                if (this.timeout <= 0) {
                    if (this.rootElement != null) {
                        diffAndSetAttribute(this.rootElement, "class", "inactive");
                    }
                }
            }
        }
        refreshValue(_realFlapsAngle, _force = false) {
            if ((_realFlapsAngle != this.realFlapsAngle) || _force) {
                this.realFlapsAngle = _realFlapsAngle;
                let currentHandlePos = Simplane.getFlapsHandleIndex();
                let targetAnglePercent = Simplane.getFlapsHandlePercent();
                let targetAngle = Simplane.getFlapsHandleAngle(currentHandlePos);
                let currentAngle = this.realFlapsAngle;
                if (this.cockpitSettings && this.cockpitSettings.FlapsLevels.initialised) {
                    targetAngle = this.cockpitSettings.FlapsLevels.flapsAngle[currentHandlePos];
                    for (let i = 0; i < this.flapsAngles.length - 1; i++) {
                        if (this.realFlapsAngle >= this.flapsAngles[i] && this.realFlapsAngle < this.flapsAngles[i + 1]) {
                            let ratio = (this.realFlapsAngle - this.flapsAngles[i]) / (this.flapsAngles[i + 1] - this.flapsAngles[i]);
                            currentAngle = this.cockpitSettings.FlapsLevels.flapsAngle[i] + (this.cockpitSettings.FlapsLevels.flapsAngle[i + 1] - this.cockpitSettings.FlapsLevels.flapsAngle[i]) * ratio;
                            break;
                        }
                    }
                    if (this.realFlapsAngle >= this.flapsAngles[this.flapsAngles.length - 1]) {
                        currentAngle = this.cockpitSettings.FlapsLevels.flapsAngle[this.flapsAngles.length - 1];
                    }
                }
                let currentAnglePercent = 1;
                for (let i = 0; i < this.flapsAngles.length - 1; i++) {
                    if (this.realFlapsAngle >= this.flapsAngles[i] && this.realFlapsAngle < this.flapsAngles[i + 1]) {
                        let ratio = (this.realFlapsAngle - this.flapsAngles[i]) / (this.flapsAngles[i + 1] - this.flapsAngles[i]);
                        currentAnglePercent = this.flapsHandlePercents[i] + (this.flapsHandlePercents[i + 1] - this.flapsHandlePercents[i]) * ratio;
                        break;
                    }
                }
                let markerY = this.barTop + (this.barHeight * targetAnglePercent);
                if (this.marker != null) {
                    diffAndSetAttribute(this.marker, "y1", markerY + '');
                    diffAndSetAttribute(this.marker, "y2", markerY + '');
                }
                if (this.valueText != null) {
                    diffAndSetText(this.valueText, (targetAngle <= 0) ? "UP" : fastToFixed(targetAngle, 0));
                    diffAndSetAttribute(this.valueText, "y", markerY + '');
                }
                if (this.gauge != null) {
                    let height = this.barHeight * currentAnglePercent;
                    diffAndSetAttribute(this.gauge, "height", height + '');
                }
                if (this.rootElement != null) {
                    diffAndSetAttribute(this.rootElement, "class", (currentAngle == targetAngle) ? "static" : "transit");
                }
                if (currentAngle <= 0) {
                    this.timeout = Boeing.FlapsDisplay.TIMEOUT_LENGTH;
                }
            }
        }
    }
    FlapsDisplay.TIMEOUT_LENGTH = 3000;
    Boeing.FlapsDisplay = FlapsDisplay;
    class StabDisplay {
        constructor(_root, _maxValue = 20, _valueDecimals = 2) {
            this.currentValue = 0;
            this.maxValue = 0;
            this.valueDecimals = 0;
            this.valueToArrowY = 0;
            this.takeoffText = null;
            this.valueText = null;
            this.arrow = null;
            this.trimBand = null;
            this.maxValue = _maxValue;
            this.valueDecimals = _valueDecimals;
            if (_root != null) {
                this.takeoffText = _root.querySelector(".takeoff");
                this.valueText = _root.querySelector(".value");
                this.arrow = _root.querySelector(".arrow");
                this.trimBand = _root.querySelector(".trimBand");
                let bar = _root.querySelector(".bar");
                if (bar != null) {
                    let barHeight = bar.y2.baseVal.value - bar.y1.baseVal.value;
                    this.valueToArrowY = (barHeight * 0.5) / this.maxValue;
                }
                if (this.takeoffText != null) {
                    diffAndSetStyle(this.takeoffText, StyleProperty.display, "none");
                }
            }
            this.refreshValue(0, true);
        }
        update(_deltaTime) {
            this.refreshValue(Simplane.getTrimPos());
        }
        refreshValue(_value, _force = false) {
            if ((_value != this.currentValue) || _force) {
                this.currentValue = Utils.Clamp(_value, -this.maxValue, this.maxValue);
                let displayValue = (this.currentValue + this.maxValue) * 0.5;
                if (this.valueText != null) {
                    diffAndSetText(this.valueText, fastToFixed(displayValue, this.valueDecimals));
                }
                if (this.arrow != null) {
                    let arrowY = this.currentValue * this.valueToArrowY;
                    diffAndSetAttribute(this.arrow, "transform", "translate(0," + arrowY + ")");
                }
            }
        }
    }
    Boeing.StabDisplay = StabDisplay;
    class RudderDisplay {
        constructor(_root, _maxValue = 10) {
            this.currentValue = 0;
            this.maxValue = 0;
            this.valueToArrowX = 0;
            this.valueText = null;
            this.leftText = null;
            this.rightText = null;
            this.arrow = null;
            this.maxValue = _maxValue;
            if (_root != null) {
                this.valueText = _root.querySelector(".value");
                this.leftText = _root.querySelector(".left");
                this.rightText = _root.querySelector(".right");
                this.arrow = _root.querySelector(".arrow");
                let bar = _root.querySelector(".bar");
                if (bar != null) {
                    let barLength = bar.x2.baseVal.value - bar.x1.baseVal.value;
                    this.valueToArrowX = (barLength * 0.5) / this.maxValue;
                }
            }
            this.refreshValue(0, true);
        }
        update(_deltaTime) {
            this.refreshValue(Simplane.getRudTrimPos());
        }
        refreshValue(_value, _force = false) {
            if ((_value != this.currentValue) || _force) {
                this.currentValue = Utils.Clamp(_value, -this.maxValue, this.maxValue);
                let bShowLeft = false;
                let bShowRight = false;
                let displayValue = Math.abs(this.currentValue);
                if (displayValue <= 0.05) {
                    displayValue = 0;
                }
                else {
                    bShowLeft = (this.currentValue < 0);
                    bShowRight = !bShowLeft;
                }
                if (this.valueText != null) {
                    diffAndSetText(this.valueText, fastToFixed(displayValue, 1));
                }
                if (this.leftText != null) {
                    diffAndSetStyle(this.leftText, StyleProperty.display, bShowLeft ? "block" : "none");
                }
                if (this.rightText != null) {
                    diffAndSetStyle(this.rightText, StyleProperty.display, bShowRight ? "block" : "none");
                }
                if (this.arrow != null) {
                    let arrowX = this.currentValue * this.valueToArrowX;
                    diffAndSetAttribute(this.arrow, "transform", "translate(" + arrowX + ",0)");
                }
            }
        }
    }
    Boeing.RudderDisplay = RudderDisplay;
    class FuelBaseComponent {
        constructor(_element, _index) {
            this.element = null;
            this.index = 0;
            this.element = _element;
            this.index = _index;
        }
    }
    Boeing.FuelBaseComponent = FuelBaseComponent;
    class FuelEngineState extends FuelBaseComponent {
        constructor() {
            super(...arguments);
            this.isActive = false;
        }
        init() {
            this.refresh(false, true);
        }
        update(_deltaTime) {
            this.refresh(Simplane.getEngFuelFlow(this.index) > 0.05);
        }
        refresh(_isActive, _force = false) {
            if (_force || (this.isActive != _isActive)) {
                this.isActive = _isActive;
                if (this.element != null) {
                    let className = this.isActive ? "active" : "inactive";
                    diffAndSetAttribute(this.element, "class", "fuelengine-" + className);
                }
            }
        }
    }
    Boeing.FuelEngineState = FuelEngineState;
    class FuelPump extends FuelBaseComponent {
        constructor() {
            super(...arguments);
            this.isSwitched = false;
            this.isActive = false;
        }
        init() {
            this.refresh(false, false, true);
        }
        update(_deltaTime) {
            this.refresh(Simplane.getEngFuelPumpSwitch(this.index), Simplane.getEngFuelPumpActive(this.index));
        }
        refresh(_isSwitched, _isActive, _force = false) {
            if (_force || (this.isSwitched != _isSwitched) || (this.isActive != _isActive)) {
                this.isSwitched = _isSwitched;
                this.isActive = _isActive;
                if (this.element != null) {
                    let className = this.isSwitched ? "switched" : "notswitched";
                    className += this.isActive ? "-active" : "-inactive";
                    diffAndSetAttribute(this.element, "class", "fuelpump-" + className);
                }
            }
        }
    }
    Boeing.FuelPump = FuelPump;
    class FuelValve extends FuelBaseComponent {
        constructor() {
            super(...arguments);
            this.isSwitched = false;
            this.isOpen = false;
            this.transformStringClosed = "";
            this.transformStringOpen = "";
        }
        init() {
            if (this.element != null) {
                let baseTransform = this.element.getAttribute("transform");
                let rotateIndex = baseTransform.search("rotate");
                if (rotateIndex < 0) {
                    this.transformStringClosed = baseTransform + " rotate(0)";
                    this.transformStringOpen = baseTransform + " rotate(90)";
                }
                else {
                    this.transformStringClosed = baseTransform;
                    let rotateStartIndex = baseTransform.indexOf("rotate(") + 7;
                    let rotateEndIndex = baseTransform.indexOf(")", rotateStartIndex);
                    let angle = parseFloat(baseTransform.slice(rotateStartIndex, rotateEndIndex));
                    this.transformStringOpen = baseTransform.replace("rotate(" + angle + ")", "rotate(" + (angle + 90) + ")");
                }
            }
            this.refresh(false, 0, true);
        }
        update(_deltaTime) {
            this.refresh(Simplane.getEngFuelValveSwitch(this.index), Simplane.getEngFuelValveOpen(this.index));
        }
        refresh(_isSwitched, _openLevel, _force = false) {
            let open = this.isOpen;
            if (_openLevel >= 1) {
                open = true;
            }
            else if (_openLevel <= 0) {
                open = false;
            }
            if (_force || (this.isSwitched != _isSwitched) || (this.isOpen != open)) {
                this.isSwitched = _isSwitched;
                this.isOpen = open;
                if (this.element != null) {
                    if (this.isSwitched || this.isOpen) {
                        diffAndSetAttribute(this.element, "class", this.isSwitched ? "fuelvalve-open" : "fuelvalve-closing");
                        diffAndSetAttribute(this.element, "transform", this.transformStringOpen);
                    }
                    else {
                        diffAndSetAttribute(this.element, "class", "fuelvalve-closed");
                        diffAndSetAttribute(this.element, "transform", this.transformStringClosed);
                    }
                }
            }
        }
    }
    Boeing.FuelValve = FuelValve;
    class FuelLine extends FuelBaseComponent {
        constructor() {
            super(...arguments);
            this.isActive = false;
        }
        init() {
            this.refresh(false, true);
        }
        update(_deltaTime) {
            this.refresh(Simplane.getEngFuelLineFlow(this.index) > 0);
        }
        refresh(_isActive, _force = false) {
            if (_force || (this.isActive != _isActive)) {
                this.isActive = _isActive;
                if (this.element != null) {
                    let className = this.isActive ? "active" : "inactive";
                    diffAndSetAttribute(this.element, "class", "fuelline-" + className);
                }
            }
        }
    }
    Boeing.FuelLine = FuelLine;
    class InfoPanelsManager extends Airliners.EICASInfoPanelManager {
        init(_panel) {
            this.mainPanel = _panel;
            Coherent.on("AddUpperECAMMessage", this.onInfoPanelEvent.bind(this, Airliners.EICAS_INFO_PANEL_EVENT_TYPE.ADD_MESSAGE));
            Coherent.on("RemoveUpperECAMMessage", this.onInfoPanelEvent.bind(this, Airliners.EICAS_INFO_PANEL_EVENT_TYPE.REMOVE_MESSAGE));
            Coherent.on("ModifyUpperECAMMessage", this.onInfoPanelEvent.bind(this, Airliners.EICAS_INFO_PANEL_EVENT_TYPE.MODIFY_MESSAGE));
            Coherent.on("ClearUpperECAMScreen", this.onInfoPanelEvent.bind(this, Airliners.EICAS_INFO_PANEL_EVENT_TYPE.CLEAR_SCREEN));
        }
        addMessage(_id, _message, _style) {
            if (_message != "") {
                let infoPanel = this.getInfoPanel(_id);
                if (infoPanel) {
                    infoPanel.addMessage(_message, _style);
                }
            }
        }
        removeMessage(_id, _message) {
            if (_message != "") {
                let infoPanel = this.getInfoPanel(_id);
                if (infoPanel) {
                    infoPanel.removeMessage(_message);
                }
            }
        }
        modifyMessage(_id, _currentMessage, _newMessage, _newStyle) {
            let infoPanel = this.getInfoPanel(_id);
            if (infoPanel) {
                if (_newMessage == "")
                    _newMessage = _currentMessage;
                infoPanel.modifyMessage(_currentMessage, _newMessage, _newStyle);
            }
        }
        clearScreen(_id) {
            let infoPanel = this.getInfoPanel(_id);
            if (infoPanel) {
                infoPanel.clearScreen();
            }
        }
        getInfoPanel(_id) {
            switch (_id) {
                case Airliners.EICAS_INFO_PANEL_ID.PRIMARY:
                    return this.mainPanel;
                default:
                    return null;
            }
        }
        onInfoPanelEvent(_type, ..._args) {
            if ((_args != null) && (_args.length > 0)) {
                let strings = _args[0];
                if ((strings != null) && (strings.length > 0)) {
                    let panelId;
                    if (strings[0] == "primary") {
                        panelId = Airliners.EICAS_INFO_PANEL_ID.PRIMARY;
                    }
                    else if (strings[0] == "secondary") {
                        panelId = Airliners.EICAS_INFO_PANEL_ID.PRIMARY;
                    }
                    else {
                        return;
                    }
                    switch (_type) {
                        case Airliners.EICAS_INFO_PANEL_EVENT_TYPE.ADD_MESSAGE:
                            {
                                if (strings.length >= 3) {
                                    this.addMessage(panelId, strings[1], Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE[strings[2]]);
                                }
                                break;
                            }
                        case Airliners.EICAS_INFO_PANEL_EVENT_TYPE.REMOVE_MESSAGE:
                            {
                                if (strings.length >= 2) {
                                    this.removeMessage(panelId, strings[1]);
                                }
                                break;
                            }
                        case Airliners.EICAS_INFO_PANEL_EVENT_TYPE.MODIFY_MESSAGE:
                            {
                                if (strings.length >= 4) {
                                    this.modifyMessage(panelId, strings[1], strings[2], Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE[strings[3]]);
                                }
                                break;
                            }
                        case Airliners.EICAS_INFO_PANEL_EVENT_TYPE.CLEAR_SCREEN:
                            {
                                this.clearScreen(panelId);
                                break;
                            }
                    }
                }
            }
        }
    }
    Boeing.InfoPanelsManager = InfoPanelsManager;
    class InfoPanel {
        constructor(_parent, _divID) {
            this.allDivs = [];
            this.parent = _parent;
            this.divID = _divID;
        }
        init() {
            this.create();
        }
        update(_deltaTime) {
        }
        create() {
            if (this.parent != null) {
                this.divMain = this.createDiv(this.divID);
                this.parent.appendChild(this.divMain);
            }
        }
        createDiv(_id, _class = "", _text = "") {
            let div = document.createElement("div");
            if (_id.length > 0) {
                div.id = _id;
            }
            if (_class.length > 0) {
                div.className = _class;
            }
            if (_text.length > 0) {
                diffAndSetText(div, _text);
            }
            return div;
        }
        getNextAvailableDiv() {
            for (let i = 0; i < this.allDivs.length; ++i) {
                if (this.allDivs[i].textContent.length == 0) {
                    return this.allDivs[i];
                }
            }
            if (this.divMain != null) {
                let newDiv = document.createElement("div");
                this.allDivs.push(newDiv);
                this.divMain.appendChild(newDiv);
                return newDiv;
            }
            return null;
        }
        getDivFromMessage(_message) {
            for (let i = 0; i < this.allDivs.length; ++i) {
                if (this.allDivs[i].textContent == _message) {
                    return this.allDivs[i];
                }
            }
            return null;
        }
        getClassNameFromStyle(_style) {
            switch (_style) {
                case Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.INDICATION: return "InfoIndication";
                case Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.CAUTION: return "InfoCaution";
                case Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.WARNING: return "InfoWarning";
            }
            return "";
        }
        addMessage(_message, _style) {
            let div = this.getNextAvailableDiv();
            if (div != null) {
                diffAndSetText(div, _message);
                div.className = this.getClassNameFromStyle(_style);
            }
        }
        removeMessage(_message) {
            let div = this.getDivFromMessage(_message);
            if (div != null) {
                diffAndSetText(div, "");
                for (let i = 0; i < (this.allDivs.length - 1); ++i) {
                    if (this.allDivs[i].textContent.length == 0) {
                        if (this.allDivs[i + 1].textContent.length > 0) {
                            diffAndSetText(this.allDivs[i], this.allDivs[i + 1].textContent);
                            this.allDivs[i].className = this.allDivs[i + 1].className;
                            diffAndSetText(this.allDivs[i + 1], "");
                        }
                    }
                }
            }
        }
        modifyMessage(_currentMessage, _newMessage, _newStyle) {
            let div = this.getDivFromMessage(_currentMessage);
            if (div != null) {
                diffAndSetText(div, _newMessage);
                div.className = this.getClassNameFromStyle(_newStyle);
            }
        }
        clearScreen() {
            for (let i = 0; i < this.allDivs.length; ++i) {
                diffAndSetText(this.allDivs[i], "");
            }
        }
    }
    Boeing.InfoPanel = InfoPanel;
})(Boeing || (Boeing = {}));
//# sourceMappingURL=Boeing_Common.js.map