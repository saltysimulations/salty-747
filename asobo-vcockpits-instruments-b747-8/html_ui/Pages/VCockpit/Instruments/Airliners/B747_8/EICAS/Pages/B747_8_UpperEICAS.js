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
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            this.unitTextSVG = this.querySelector("#TOTAL_FUEL_Units");
            this.tmaDisplay = new Boeing.ThrustModeDisplay(this.querySelector("#TMA_Value"));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#TAT_Value"), Simplane.getTotalAirTemperature, 0, Airliners.DynamicValueComponent.formatValueToPosNegTemperature));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#SAT_Value"), Simplane.getAmbientTemperature, 0, Airliners.DynamicValueComponent.formatValueToPosNegTemperature));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#THROTTLE1_Value"), Simplane.getEngineThrottleCommandedN1.bind(this, 0), 1, Airliners.DynamicValueComponent.formatValueToThrottleDisplay));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#THROTTLE2_Value"), Simplane.getEngineThrottleCommandedN1.bind(this, 1), 1, Airliners.DynamicValueComponent.formatValueToThrottleDisplay));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#THROTTLE3_Value"), Simplane.getEngineThrottleCommandedN1.bind(this, 2), 1, Airliners.DynamicValueComponent.formatValueToThrottleDisplay));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#THROTTLE4_Value"), Simplane.getEngineThrottleCommandedN1.bind(this, 3), 1, Airliners.DynamicValueComponent.formatValueToThrottleDisplay));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#CAB_ALT_Value"), Simplane.getPressurisationCabinAltitude));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#RATE_Value"), Simplane.getPressurisationCabinAltitudeRate));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#DELTAP_Value"), Simplane.getPressurisationDifferential, 1, Airliners.DynamicValueComponent.formatValueToString));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#GROSS_WEIGHT_Value"), this.getGrossWeightInMegagrams.bind(this), 1));
            this.allValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#TOTAL_FUEL_Value"), this.getTotalFuelInMegagrams.bind(this), 1));
            var n1Parent = this.querySelector("#N1Gauges");
            var egtParent = this.querySelector("#EGTGauges");
            for (var engine = 1; engine <= Simplane.getEngineCount(); ++engine) {
                this.allEngineInfos.push(new EngineInfo(engine, n1Parent, egtParent));
                this.allAntiIceStatus.push(new EngineAntiIceStatus(this.querySelector("#EAI" + engine + "_Value"), engine));
            }
            this.infoPanel = new Boeing.InfoPanel(this, "InfoPanel");
            this.infoPanel.init();
            this.infoPanelsManager = new Boeing.InfoPanelsManager();
            this.infoPanelsManager.init(this.infoPanel);
            this.gearDisplay = new Boeing.GearDisplay(this.querySelector("#GearInfo"));
            this.flapsDisplay = new Boeing.FlapsDisplay(this.querySelector("#FlapsInfo"), this.querySelector("#FlapsLine"), this.querySelector("#FlapsValue"), this.querySelector("#FlapsBar"), this.querySelector("#FlapsGauge"), new Array(0, 1, 5, 10, 20, 25, 30));
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
                    this.unitTextSVG.textContent = "KGS X";
                else
                    this.unitTextSVG.textContent = "LBS X";
            }
        }
        getGrossWeightInMegagrams() {
            if (BaseAirliners.unitIsMetric(Aircraft.B747_8))
                return SimVar.GetSimVarValue("TOTAL WEIGHT", "kg") * 0.001;
            return SimVar.GetSimVarValue("TOTAL WEIGHT", "lbs") * 0.001;
        }
        getTotalFuelInMegagrams() {
            let factor = this.gallonToMegapounds;
            if (BaseAirliners.unitIsMetric(Aircraft.B747_8))
                factor = this.gallonToMegagrams;
            return (SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * factor);
        }
        getInfoPanelManager() {
            return this.infoPanelsManager;
        }
    }
    B747_8_UpperEICAS.Display = Display;
    class EngineInfo {
        constructor(_engine, _n1Parent, _egtParent) {
            this.engine = _engine;
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
            definition.addLineDefinition(0, 40, "gaugeMarkerNormal", this.getN1LimitValue.bind(this));
            definition.addLineDefinition(100, 32, "gaugeMarkerWarning");
            return definition;
        }
        getN1Value() {
            return SimVar.GetSimVarValue("ENG N1 RPM:" + this.engine, "percent");
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
            definition.addLineDefinition(975, 32, "gaugeMarkerWarning");
            return definition;
        }
        getEGTValue() {
            return SimVar.GetSimVarValue("ENG EXHAUST GAS TEMPERATURE:" + this.engine, "celsius");
        }
        refresh() {
            if (this.n1Gauge != null) {
                this.n1Gauge.refresh();
            }
            if (this.egtGauge != null) {
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
                this.element.style.display = _active ? "block" : "none";
            }
            this.isActive = _active;
        }
    }
    class EngineAntiIceStatus extends AntiIceStatus {
        getCurrentActiveState() {
            return SimVar.GetSimVarValue("ENG ANTI ICE:" + this.index, "bool");
        }
    }
    class WingAntiIceStatus extends AntiIceStatus {
        getCurrentActiveState() {
            return SimVar.GetSimVarValue("STRUCTURAL DEICE SWITCH", "bool");
        }
    }
})(B747_8_UpperEICAS || (B747_8_UpperEICAS = {}));
customElements.define("b747-8-upper-eicas", B747_8_UpperEICAS.Display);
//# sourceMappingURL=B747_8_UpperEICAS.js.map