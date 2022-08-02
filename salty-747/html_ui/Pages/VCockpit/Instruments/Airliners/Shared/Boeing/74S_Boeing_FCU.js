var Boeing_FCU;
(function (Boeing_FCU) {
    class FCUBase extends BaseAirliners {
        constructor() {
            super();
            this.valueElement = null;
        }
        connectedCallback() {
            super.connectedCallback();
            this.valueElement = this.createValueElement();
            RegisterViewListener("JS_LISTENER_KEYEVENT");
        }
        disconnectedCallback() {
            super.disconnectedCallback();
        }
        onUpdate(_deltaTime) {
            super.onUpdate(_deltaTime);
            if (this.valueElement != null) {
                this.valueElement.refresh();
            }
        }
        createValueElement() {
            return new Airliners.DynamicValueComponent(this.querySelector("#value"), this.getCurrentValue.bind(this), 0, Airliners.DynamicValueComponent.formatValueToString);
        }
        shouldBeVisible() {
            return true;
        }
        onFlightStart() {
            super.onFlightStart();
        }
    }
    Boeing_FCU.FCUBase = FCUBase;
    class IAS extends FCUBase {
        constructor() {
            super(...arguments);
            this.m_isVisible = false;
            this.modeElement = null;
            this.mode2Element = null;
        }
        connectedCallback() {
            super.connectedCallback();
            this.modeElement = this.querySelector("#mode");
            this.mode2Element = this.querySelector("#mode2");
            if (this.modeElement != null) {
                diffAndSetText(this.modeElement, "");
            }
            if (this.mode2Element != null) {
                diffAndSetText(this.mode2Element, "");
            }
            if (this.valueElement != null) {
                this.valueElement.isVisible = false;
            }
        }
        onUpdate(_deltaTime) {
            super.onUpdate(_deltaTime);
            let machChanged = this.updateMachTransition();
            var visible = this.shouldBeVisible();
            if ((visible != this.m_isVisible) || machChanged) {
                this.m_isVisible = visible;
                if (this.modeElement != null) {
                    diffAndSetText(this.modeElement, this.m_isVisible ? (Simplane.getAutoPilotMachModeActive() ? "" : "IAS") : "");
                }
                if (this.mode2Element != null) {
                    diffAndSetText(this.mode2Element, this.m_isVisible ? (Simplane.getAutoPilotMachModeActive() ? "MACH" : "") : "");
                }
                if (this.valueElement != null) {
                    this.valueElement.isVisible = this.m_isVisible;
                }
            }
        }
        createValueElement() {
            return new Airliners.DynamicValueComponent(this.querySelector("#value"), this.getCurrentValue.bind(this), 0, this.formatValueToString.bind(this));
        }
        getCurrentValue() {
            if (Simplane.getAutoPilotMachModeActive())
                return Simplane.getAutoPilotSelectedMachHoldValue();
            return Simplane.getAutoPilotSelectedAirspeedHoldValue();
        }
        formatValueToString(_value, _dp = 0) {
            if (Simplane.getAutoPilotMachModeActive()) {
                if (_value < 1.0) {
                    let fixedMach = fastToFixed(_value, 3);
                    var radixPos = fixedMach.indexOf('.');
                    return fixedMach.slice(radixPos);
                }
                return fastToFixed(_value, 1);
            }
            return fastToFixed(_value, 0);
        }
        shouldBeVisible() {
            if (SimVar.GetSimVarValue("L:AP_SPEED_INTERVENTION_ACTIVE", "number") === 1) {
                return true;
            }
            else if (Simplane.getAPVNAVActive() === 1) {
                return false;
            }
            return true;
        }
    }
    Boeing_FCU.IAS = IAS;
    class HDG extends FCUBase {
        constructor() {
            super(...arguments);
            this.m_isVisible = false;
            this.modeElement = null;
            this.isTRKMode = false;
        }
        connectedCallback() {
            super.connectedCallback();
            this.modeElement = this.querySelector("#mode");
            if (this.modeElement != null) {
                diffAndSetText(this.modeElement, "");
            }
            if (this.valueElement != null) {
                this.valueElement.isVisible = false;
            }
        }
        onFlightStart() {
            super.onFlightStart();
            var simHeading = SimVar.GetSimVarValue("PLANE HEADING DEGREES MAGNETIC", "degree");
            Coherent.call("HEADING_BUG_SET", 1, Math.round(simHeading));
        }
        onUpdate(_deltaTime) {
            super.onUpdate(_deltaTime);
            var visible = this.shouldBeVisible();
            var trkMode = Simplane.getAutoPilotTRKModeActive();
            if ((visible != this.m_isVisible) || (trkMode != this.isTRKMode)) {
                this.m_isVisible = visible;
                this.isTRKMode = trkMode;
                if (this.modeElement != null) {
                    diffAndSetText(this.modeElement, this.m_isVisible ? (this.isTRKMode ? "TRK" : "HDG") : "");
                }
                if (this.valueElement != null) {
                    this.valueElement.isVisible = this.m_isVisible;
                }
            }
        }
        shouldBeVisible() {
            return true;
        }
        createValueElement() {
            return new Airliners.DynamicValueComponent(this.querySelector("#value"), this.getCurrentValue.bind(this), 0, this.formatValueToString.bind(this));
        }
        getCurrentValue() {
            if (this.isTRKMode) {
                return Simplane.getAutoPilotTrackAngle();
            }
            else {
                return Simplane.getAutoPilotSelectedHeadingLockValueDegrees();
            }
        }
        formatValueToString(_value, _dp = 0) {
            return Utils.leadingZeros(_value % 360, 3, _dp);
        }
    }
    Boeing_FCU.HDG = HDG;
    class VSpeed extends FCUBase {
        constructor() {
            super(...arguments);
            this.m_isVisible = false;
            this.modeElement = null;
            this.isFPAMode = false;
        }
        connectedCallback() {
            super.connectedCallback();
            this.modeElement = this.querySelector("#mode");
            if (this.modeElement != null) {
                diffAndSetText(this.modeElement, "V/S");
            }
            if (this.valueElement != null) {
                this.valueElement.isVisible = false;
            }
        }
        onUpdate(_deltaTime) {
            super.onUpdate(_deltaTime);
            var visible = this.shouldBeVisible();
            var fpaMode = Simplane.getAutoPilotFPAModeActive();
            if ((visible != this.m_isVisible) || (fpaMode != this.isFPAMode)) {
                this.m_isVisible = visible;
                this.isFPAMode = fpaMode;
                if (this.modeElement != null) {
                    diffAndSetText(this.modeElement, this.isFPAMode ? "FPA" : "V/S");
                }
                if (this.valueElement != null) {
                    this.valueElement.isVisible = this.m_isVisible;
                }
            }
        }
        createValueElement() {
            return new Airliners.DynamicValueComponent(this.querySelector("#value"), this.getCurrentValue.bind(this), 0, this.formatValueToString.bind(this));
        }
        getCurrentValue() {
            if (this.isFPAMode) {
                return -Simplane.getAutoPilotFlightPathAngle();
            }
            else {
                return Simplane.getAutoPilotVerticalSpeedHoldValue();
            }
        }
        formatValueToString(_value, _dp = 0) {
            if (this.isFPAMode) {
                return ((_value > 0) ? "+" : "") + fastToFixed(_value, 1);
            }
            else {
                return ((_value > 0) ? "+" : "") + fastToFixed(_value, 0);
            }
        }
    }
    Boeing_FCU.VSpeed = VSpeed;
    class ALT extends FCUBase {
        constructor() {
            super(...arguments);
            this.m_isVisible = false;
        }
        connectedCallback() {
            super.connectedCallback();
            if (this.valueElement != null) {
                this.valueElement.isVisible = false;
            }
        }
        onUpdate(_deltaTime) {
            super.onUpdate(_deltaTime);
            var visible = this.shouldBeVisible();
            if (visible != this.m_isVisible) {
                this.m_isVisible = visible;
                if (this.valueElement != null) {
                    this.valueElement.isVisible = this.m_isVisible;
                }
            }
        }
        getCurrentValue() {
            return Math.max(0, Simplane.getAutoPilotDisplayedAltitudeLockValue());
        }
    }
    Boeing_FCU.ALT = ALT;
})(Boeing_FCU || (Boeing_FCU = {}));
//# sourceMappingURL=Boeing_FCU.js.map