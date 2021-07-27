var B747_8_UpperEICAS;
(function (B747_8_UpperEICAS) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
            this.tmaDisplay = null;
            this.allValueComponents = new Array();
            this.allEngineInfos = new Array();
            this.gearDisplay = null;
            this.flapsDisplay = null;
            this.stabDisplay = null;
            this.allAntiIceStatus = new Array();
            this.gallonToMegagrams = 0;
            this.gallonToMegapounds = 0;
        }
        get templateID() { return "B747_8UpperEICASTemplate"; }
        connectedCallback() {
            super.connectedCallback();
        }
        init(_eicas) {
            this.eicas = _eicas;
            this.unitTextSVG = this.querySelector("#TOTAL_FUEL_Units");
            this.tmaDisplay = new Boeing.ThrustModeDisplay(this.querySelector("#TMA_Value"));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#TAT_Value"), Simplane.getTotalAirTemperature, 0, Airliners.DynamicValueComponent.formatValueToPosNegTemperature));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#SAT_Value"), Simplane.getAmbientTemperature, 0, Airliners.DynamicValueComponent.formatValueToPosNegTemperature));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#THROTTLE1_Value"), Simplane.getEngineThrottleMaxThrust.bind(this, 0), 1, Airliners.DynamicValueComponent.formatValueToThrottleDisplay));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#THROTTLE2_Value"), Simplane.getEngineThrottleMaxThrust.bind(this, 1), 1, Airliners.DynamicValueComponent.formatValueToThrottleDisplay));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#THROTTLE3_Value"), Simplane.getEngineThrottleMaxThrust.bind(this, 2), 1, Airliners.DynamicValueComponent.formatValueToThrottleDisplay));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#THROTTLE4_Value"), Simplane.getEngineThrottleMaxThrust.bind(this, 3), 1, Airliners.DynamicValueComponent.formatValueToThrottleDisplay));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#CAB_ALT_Value"), Simplane.getPressurisationCabinAltitude));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#RATE_Value"), Simplane.getPressurisationCabinAltitudeRate));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#DELTAP_Value"), Simplane.getPressurisationDifferential, 1, Airliners.DynamicValueComponent.formatValueToString));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#GROSS_WEIGHT_Value"), this.getGrossWeightInMegagrams.bind(this), 1));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#TOTAL_FUEL_Value"), this.getTotalFuelInMegagrams.bind(this), 1));
            var n1Parent = this.querySelector("#N1Gauges");
            var egtParent = this.querySelector("#EGTGauges");
            for (var engine = 1; engine <= Simplane.getEngineCount(); ++engine) {
                this.allEngineInfos.push(new EngineInfo(engine, this.eicas, n1Parent, egtParent));
                this.allAntiIceStatus.push(new EngineAntiIceStatus(this.querySelector("#EAI" + engine + "_Value"), engine));
            }
            this.infoPanel = new Boeing.InfoPanel(this, "InfoPanel");
            this.infoPanel.init();
            this.infoPanelsManager = new Boeing.InfoPanelsManager();
            this.infoPanelsManager.init(this.infoPanel);
            this.gearDisplay = new Boeing.GearDisplay(this.querySelector("#GearInfo"));
            this.flapsDisplay = new Boeing.FlapsDisplay(this.querySelector("#FlapsInfo"), this.querySelector("#FlapsLine"), this.querySelector("#FlapsValue"), this.querySelector("#FlapsBar"), this.querySelector("#FlapsGauge"));
            this.stabDisplay = new Boeing.StabDisplay(this.querySelector("#StabInfo"), 15, 1);
            this.allAntiIceStatus.push(new WingAntiIceStatus(this.querySelector("#WAI1_Value"), 1));
            this.allAntiIceStatus.push(new WingAntiIceStatus(this.querySelector("#WAI2_Value"), 2));
            this.gallonToMegagrams = SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilogram") * 0.001;
            this.gallonToMegapounds = SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "lbs") * 0.001;
            this.isInitialised = true;
        }
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            if (this.tmaDisplay) {
                this.tmaDisplay.update();
            }
            if (this.allValueComponents != null) {
                for (var i = 0; i < this.allValueComponents.length; ++i) {
                    this.allValueComponents[i].refresh();
                }
            }
            if (this.allEngineInfos != null) {
                for (var i = 0; i < this.allEngineInfos.length; ++i) {
                    this.allEngineInfos[i].refresh();
                }
            }
            if (this.gearDisplay != null) {
                this.gearDisplay.update(_deltaTime);
            }
            if (this.flapsDisplay != null) {
                this.flapsDisplay.update(_deltaTime);
            }
            if (this.stabDisplay != null) {
                this.stabDisplay.update(_deltaTime);
            }
            if (this.allAntiIceStatus != null) {
                for (var i = 0; i < this.allAntiIceStatus.length; ++i) {
                    if (this.allAntiIceStatus[i] != null) {
                        this.allAntiIceStatus[i].refresh();
                    }
                }
            }
            if (this.infoPanel) {
                this.infoPanel.update(_deltaTime);
            }
            if (this.unitTextSVG) {
                if (BaseAirliners.unitIsMetric(Aircraft.B747_8))
                    diffAndSetText(this.unitTextSVG, "KGS X");
                else
                    diffAndSetText(this.unitTextSVG, "LBS X");
            }
        }
        getGrossWeightInMegagrams() {
            if (BaseAirliners.unitIsMetric(Aircraft.B747_8))
                return Simplane.getWeight() * 0.001;
            return Simplane.getWeight() * 2.20462 * 0.001;
        }
        getTotalFuelInMegagrams() {
            let factor = this.gallonToMegapounds;
            if (BaseAirliners.unitIsMetric(Aircraft.B747_8))
                factor = this.gallonToMegagrams;
            return (Simplane.getFuelcQuantity() * factor);
        }
        getInfoPanelManager() {
            return this.infoPanelsManager;
        }
    }
    B747_8_UpperEICAS.Display = Display;
    class EngineInfo {
        constructor(_engine, _eicas, _n1Parent, _egtParent) {
            this.isVNavActive = false;
            this.engine = _engine;
            this.eicas = _eicas;
            this.n1Gauge = window.document.createElement("b747-8-eicas-gauge");
            this.n1Gauge.init(this.createN1GaugeDefinition(_engine));
            this.egtGauge = window.document.createElement("b747-8-eicas-gauge");
            this.egtGauge.init(this.createEGTGaugeDefinition(_engine));
            if (_n1Parent != null) {
                _n1Parent.appendChild(this.n1Gauge);
            }
            if (_egtParent != null) {
                _egtParent.appendChild(this.egtGauge);
            }
        }
        createN1GaugeDefinition(_engine) {
            var definition = new B747_8_EICAS_Common.GaugeDefinition();
            definition.getValue = this.getN1Value.bind(this);
            definition.maxValue = 110;
            definition.valueBoxWidth = 80;
            definition.valueTextPrecision = 1;
            definition.barHeight = 80;
            definition.addLineDefinition(110, 40, "gaugeMarkerDanger");
            definition.addLineDefinition(100, 32, "gaugeMarkerWarning");
            definition.addLineDefinition(0, 32, "gaugeMarkerCurrent", this.getN1CommandedValue.bind(this));
            definition.addLineDefinition(0, 50, "gaugeMarkerNormal", this.getN1LimitValue.bind(this));
            return definition;
        }
        getN1Value() {
            return Simplane.getEngineRPMJetPC(this.engine);
        }
        getN1CommandedValue() {
            return Math.abs(Simplane.getEngineThrottleCommandedN1(this.engine - 1));
        }
        getN1LimitValue() {
            return Math.abs(Simplane.getEngineThrottleMaxThrust(this.engine - 1));
        }
        createEGTGaugeDefinition(_engine) {
            var definition = new B747_8_EICAS_Common.GaugeDefinition();
            definition.getValue = this.getEGTValue.bind(this);
            definition.maxValue = 1000;
            definition.valueBoxWidth = 60;
            definition.barHeight = 60;
            definition.addLineDefinition(1000, 40, "gaugeMarkerDanger");
            definition.addLineDefinition(950, 32, "gaugeMarkerWarning");
            definition.addLineDefinition(0, 32, "gaugeMarkerDanger", this.getEGTLimitValue.bind(this));
            definition.addLineDefinition(0, 32, "gaugeMarkerCurrent", this.getEGTValue.bind(this));
            return definition;
        }
        getEGTValue() {
            return Simplane.getEngineEGT(this.engine);
        }
        getEGTLimitValue() {
            return 750;
        }
        refresh() {
            if (this.n1Gauge != null) {
                let VNavActive = Simplane.getAPVNAVActive() == 1;
                if (VNavActive != this.isVNavActive) {
                    this.isVNavActive = VNavActive;
                    let n1Limit = this.n1Gauge.getDynamicLine(1);
                    if (n1Limit) {
                        if (VNavActive) {
                            diffAndSetAttribute(n1Limit.line, "class", "gaugeMarkerManaged");
                        }
                        else {
                            diffAndSetAttribute(n1Limit.line, "class", "gaugeMarkerNormal");
                        }
                    }
                }
                this.n1Gauge.refresh();
            }
            if (this.egtGauge != null) {
                let egtLimit = this.egtGauge.getDynamicLine(0);
                if (egtLimit) {
                    if (this.eicas.getFuelValveOpen(this.engine) && Math.round(this.eicas.getN2Value(this.engine)) >= this.eicas.getN2IdleValue()) {
                        diffAndSetAttribute(egtLimit.line, "display", "none");
                    }
                    else {
                        diffAndSetAttribute(egtLimit.line, "display", "block");
                    }
                }
                this.egtGauge.refresh();
            }
        }
    }
    class AntiIceStatus {
        constructor(_element, _index) {
            this.element = null;
            this.index = -1;
            this.isActive = false;
            this.element = _element;
            this.index = _index;
            this.setState(false);
        }
        refresh() {
            var active = this.getCurrentActiveState();
            if (active != this.isActive) {
                this.setState(active);
            }
        }
        setState(_active) {
            if (this.element != null) {
                diffAndSetStyle(this.element, StyleProperty.display, _active ? "block" : "none");
            }
            this.isActive = _active;
        }
    }
    class EngineAntiIceStatus extends AntiIceStatus {
        getCurrentActiveState() {
            return Simplane.getEngineAntiIce(this.index);
        }
    }
    class WingAntiIceStatus extends AntiIceStatus {
        getCurrentActiveState() {
            return Simplane.getStructuralDeiceSwitch();
        }
    }
})(B747_8_UpperEICAS || (B747_8_UpperEICAS = {}));
customElements.define("b747-8-upper-eicas", B747_8_UpperEICAS.Display);
//# sourceMappingURL=B747_8_UpperEICAS.js.map