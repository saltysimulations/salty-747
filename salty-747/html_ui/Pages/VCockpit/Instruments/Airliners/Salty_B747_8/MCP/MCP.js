var b748mcp = (function (exports) {
    'use strict';

    /** VS/FPA MCP Window */
    class B748MCPHdgTrkWindow {
        /**
         * Constructs a new instance of the window.
         * @param instrument the containing instrument
         */
        constructor(instrument) {
            this.instrument = instrument;
            this.value = null;
            this.isPowered = false;
        }
        /** @inheritdoc */
        connectedCallback() {
            // do stuff?
        }
        /** @inheritdoc */
        onPowerStateChanged(powered) {
            this.isPowered = powered;
        }
        /** @inheritdoc */
        onUpdate() {
            if (this.isPowered) {
                const hdgValue = SimVar.GetSimVarValue('AUTOPILOT HEADING LOCK DIR:1', 'degree');
                if (hdgValue < 0.5) {
                    this.value = '360';
                }
                else {
                    this.value = hdgValue.toFixed(0).padStart(3, '0');
                }
            }
            else {
                this.value = null;
            }
        }
        /** @inheritdoc */
        get valueText() {
            return this.value;
        }
        /** @inheritdoc */
        get modeText() {
            return null;
        }
    }

    /** VS/FPA MCP Window */
    class B748MCPVsFpaWindow {
        /**
         * Constructs a new instance of the window.
         * @param instrument the containing instrument
         */
        constructor(instrument) {
            this.instrument = instrument;
            this.value = null;
            this.isPowered = false;
        }
        /** @inheritdoc */
        connectedCallback() {
            // do stuff?
        }
        /** @inheritdoc */
        onPowerStateChanged(powered) {
            this.isPowered = powered;
        }
        /** @inheritdoc */
        onUpdate() {
            if (this.isPowered) {
                if (this.isActive()) {
                    const value = SimVar.GetSimVarValue('AUTOPILOT VERTICAL HOLD VAR:1', 'feet per minute');
                    const sign = value < 0 ? '-' : '+';
                    if (Math.abs(value) < 0.05) {
                        this.value = '0000';
                    }
                    else {
                        const absValue = Math.abs(value).toFixed(0);
                        this.value = sign + absValue.padStart(4);
                    }
                }
                else {
                    this.value = null;
                }
            }
            else {
                this.value = null;
            }
        }
        /**
         * Is VS or FPA mode active?
         * @returns true if active
         */
        isActive() {
            return SimVar.GetSimVarValue('AUTOPILOT VERTICAL HOLD', 'bool') > 0;
        }
        /** @inheritdoc */
        get valueText() {
            return this.value;
        }
        /** @inheritdoc */
        get modeText() {
            return null;
        }
    }

    /** VS/FPA MCP Window */
    class B748MCPSpdWindow {
        /**
         * Constructs a new instance of the window.
         * @param instrument the containing instrument
         */
        constructor(instrument) {
            this.instrument = instrument;
            this.value = null;
            this.mode = null;
            this.isPowered = false;
        }
        /** @inheritdoc */
        connectedCallback() {
            // do stuff?
        }
        /** @inheritdoc */
        onPowerStateChanged(powered) {
            this.isPowered = powered;
        }
        /** @inheritdoc */
        onUpdate() {
            if (this.isPowered) {
                const machActive = SimVar.GetSimVarValue('L:XMLVAR_AirSpeedIsInMach', 'bool') > 0;
                if (this.isActive()) {
                    const value = machActive ? this.getMach() : this.getIas();
                    this.mode = machActive ? 'MACH' : 'IAS';
                    if (machActive) {
                        this.value = '.' + (value * 1000).toFixed(0);
                    }
                    else {
                        this.value = value.toFixed(0);
                    }
                    // if (this.isActive()) {
                    //   const value = fpaActive
                    //     ? SimVar.GetSimVarValue('L:WT_AP_FPA_Target:1', 'degree')
                    //     : SimVar.GetSimVarValue('AUTOPILOT VERTICAL HOLD VAR:1', 'feet per minute');
                    //   const sign = value < 0 ? '-' : '+';
                    //   if (Math.abs(value) < 0.05) {
                    //     this.value = fpaActive ? '0.0' : '0000';
                    //   } else {
                    //     const absValue = Math.abs(value).toFixed(fpaActive ? 1 : 0);
                    //     this.value = sign + absValue.padStart(4);
                    //   }
                }
                else {
                    this.value = null;
                    this.mode = null;
                }
            }
            else {
                this.mode = null;
                this.value = null;
            }
        }
        /**
         * Is VS or FPA mode active?
         * @returns true if active
         */
        isActive() {
            return SimVar.GetSimVarValue('L:XMLVAR_SpeedIsManuallySet', 'bool') > 0;
        }
        /**
         * Gets the mach value.
         * @returns MACH
         */
        getMach() {
            return SimVar.GetSimVarValue('AUTOPILOT MACH HOLD VAR:1', 'number');
        }
        /**
         * Gets the ias value.
         * @returns IAS
         */
        getIas() {
            return SimVar.GetSimVarValue('AUTOPILOT AIRSPEED HOLD VAR:1', 'knots');
        }
        /** @inheritdoc */
        get valueText() {
            return this.value;
        }
        /** @inheritdoc */
        get modeText() {
            return this.mode;
        }
    }

    /// <reference types="@microsoft/msfs-types/Pages/VCockpit/Instruments/Shared/BaseInstrument" />
    var McpWindowTypes;
    (function (McpWindowTypes) {
        McpWindowTypes[McpWindowTypes["IasMach"] = 1] = "IasMach";
        McpWindowTypes[McpWindowTypes["HdgTrk"] = 2] = "HdgTrk";
        McpWindowTypes[McpWindowTypes["VsFpa"] = 3] = "VsFpa";
        McpWindowTypes[McpWindowTypes["Altitude"] = 4] = "Altitude";
    })(McpWindowTypes || (McpWindowTypes = {}));
    /**
     *
     */
    class WTB748_MCP extends BaseInstrument {
        constructor() {
            super(...arguments);
            this.valueElement = null;
            this.modeElement = null;
            this.value = null;
            this.mode = null;
            this.window = null;
            this.windowType = 0;
        }
        /**
         * The instrument template ID.
         * @returns The instrument template ID.
         */
        get templateID() {
            return 'WTB748_MCP';
        }
        /**
         * A callback called when the element is attached to the DOM.
         */
        connectedCallback() {
            var _a, _b;
            super.connectedCallback();
            this.modeElement = this.querySelector('#mode');
            this.valueElement = this.querySelector('#value');
            this.windowType = this.instrumentIndex;
            switch (this.windowType) {
                case McpWindowTypes.HdgTrk:
                    this.window = new B748MCPHdgTrkWindow(this);
                    break;
                case McpWindowTypes.IasMach:
                    this.window = new B748MCPSpdWindow(this);
                    break;
                case McpWindowTypes.VsFpa:
                    this.window = new B748MCPVsFpaWindow(this);
                    // Asobo hack to fix V/S window model scale
                    this.classList.add('b748-vspeed-element');
                    break;
            }
            (_b = (_a = this.window) === null || _a === void 0 ? void 0 : _a.connectedCallback) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
        /**
         * Update method called by BaseInstrument
         */
        Update() {
            var _a, _b, _c, _d, _e;
            super.Update();
            (_a = this.window) === null || _a === void 0 ? void 0 : _a.onUpdate();
            const mode = (_c = (_b = this.window) === null || _b === void 0 ? void 0 : _b.modeText) !== null && _c !== void 0 ? _c : null;
            const value = (_e = (_d = this.window) === null || _d === void 0 ? void 0 : _d.valueText) !== null && _e !== void 0 ? _e : null;
            if (this.modeElement && this.mode !== mode) {
                this.mode = mode;
                this.modeElement.innerText = mode !== null && mode !== void 0 ? mode : '';
            }
            if (this.valueElement && this.value !== value) {
                this.value = value;
                this.valueElement.innerText = value !== null && value !== void 0 ? value : '';
            }
        }
        /** @inheritdoc */
        onPowerOn() {
            var _a, _b;
            super.onPowerOn();
            (_b = (_a = this.window) === null || _a === void 0 ? void 0 : _a.onPowerStateChanged) === null || _b === void 0 ? void 0 : _b.call(_a, true);
        }
        /** @inheritdoc */
        onShutDown() {
            var _a, _b;
            super.onShutDown();
            (_b = (_a = this.window) === null || _a === void 0 ? void 0 : _a.onPowerStateChanged) === null || _b === void 0 ? void 0 : _b.call(_a, false);
        }
        /**
         * Whether or not the instrument is interactive (a touchscreen instrument).
         * @returns True if touchscreen
         */
        get isInteractive() {
            return false;
        }
    }
    registerInstrument('wt-b748-mcp', WTB748_MCP);

    exports.WTB748_MCP = WTB748_MCP;

    return exports;

})({});
