var B747_8_LowerEICAS_Engine;
(function (B747_8_LowerEICAS_Engine) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
            this.allEngineInfos = new Array();
            this.allGaugeDuals = new Array();
        }
        get templateID() { return "B747_8LowerEICASEngineTemplate"; }
        connectedCallback() {
            super.connectedCallback();
        }
        init(_eicas) {
            this.eicas = _eicas;
            var stateParent = this.querySelector("#EngineStates");
            var n2Parent = this.querySelector("#N2Gauges");
            var ffParent = this.querySelector("#FFGauges");
            for (var engine = 1; engine <= Simplane.getEngineCount(); ++engine) {
                this.allEngineInfos.push(new EngineInfo(this.eicas, engine, stateParent, n2Parent, ffParent));
            }
            this.createOilPGauges();
            this.createOilTGauges();
            this.createOilQGauges();
            this.createVIBGauges();
            this.isInitialised = true;
        }
        createOilPGauges() {
            var definition = new B747_8_EICAS_Common.GaugeDualDefinition();
            definition.maxValue = 500;
            definition.barTop = 6;
            definition.barHeight = 88;
            var parent = this.querySelector("#OilPGauges");
            definition.getValueLeft = this.allEngineInfos[0].getOilPValue.bind(this.allEngineInfos[0]);
            definition.getValueRight = this.allEngineInfos[1].getOilPValue.bind(this.allEngineInfos[1]);
            this.createGaugeDual(parent, definition);
            definition.getValueLeft = this.allEngineInfos[2].getOilPValue.bind(this.allEngineInfos[2]);
            definition.getValueRight = this.allEngineInfos[3].getOilPValue.bind(this.allEngineInfos[3]);
            this.createGaugeDual(parent, definition);
        }
        createOilTGauges() {
            var definition = new B747_8_EICAS_Common.GaugeDualDefinition();
            definition.maxValue = 200;
            definition.barTop = 6;
            definition.barHeight = 88;
            var parent = this.querySelector("#OilTGauges");
            definition.getValueLeft = this.allEngineInfos[0].getOilTValue.bind(this.allEngineInfos[0]);
            definition.getValueRight = this.allEngineInfos[1].getOilTValue.bind(this.allEngineInfos[1]);
            this.createGaugeDual(parent, definition);
            definition.getValueLeft = this.allEngineInfos[2].getOilTValue.bind(this.allEngineInfos[2]);
            definition.getValueRight = this.allEngineInfos[3].getOilTValue.bind(this.allEngineInfos[3]);
            this.createGaugeDual(parent, definition);
        }
        createOilQGauges() {
            var definition = new B747_8_EICAS_Common.GaugeDualDefinition();
            definition.barHeight = 0;
            var parent = this.querySelector("#OilQGauges");
            definition.getValueLeft = this.allEngineInfos[0].getOilQValue.bind(this.allEngineInfos[0]);
            definition.getValueRight = this.allEngineInfos[1].getOilQValue.bind(this.allEngineInfos[1]);
            this.createGaugeDual(parent, definition);
            definition.getValueLeft = this.allEngineInfos[2].getOilQValue.bind(this.allEngineInfos[2]);
            definition.getValueRight = this.allEngineInfos[3].getOilQValue.bind(this.allEngineInfos[3]);
            this.createGaugeDual(parent, definition);
        }
        createVIBGauges() {
            var definition = new B747_8_EICAS_Common.GaugeDualDefinition();
            definition.useDoubleDisplay = true;
            definition.valueTextPrecision = 1;
            definition.maxValue = 4;
            definition.barTop = 6;
            definition.barHeight = 88;
            var parent = this.querySelector("#VIBGauges");
            definition.getValueLeft = this.allEngineInfos[0].getVIBValue.bind(this.allEngineInfos[0]);
            definition.getValueRight = this.allEngineInfos[1].getVIBValue.bind(this.allEngineInfos[1]);
            this.createGaugeDual(parent, definition);
            definition.getValueLeft = this.allEngineInfos[2].getVIBValue.bind(this.allEngineInfos[2]);
            definition.getValueRight = this.allEngineInfos[3].getVIBValue.bind(this.allEngineInfos[3]);
            this.createGaugeDual(parent, definition);
        }
        createGaugeDual(_parent, _definition) {
            var gauge = window.document.createElement("b747-8-eicas-gauge-dual");
            gauge.init(_definition);
            _parent.appendChild(gauge);
            this.allGaugeDuals.push(gauge);
        }
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            if (this.allEngineInfos != null) {
                for (var i = 0; i < this.allEngineInfos.length; ++i) {
                    this.allEngineInfos[i].refresh(_deltaTime);
                }
            }
            if (this.allGaugeDuals != null) {
                for (var i = 0; i < this.allGaugeDuals.length; ++i) {
                    this.allGaugeDuals[i].refresh();
                }
            }
        }
    }
    B747_8_LowerEICAS_Engine.Display = Display;
    class EngineInfo {
        constructor(_eicas, _engineId, _engineStateParent, _n2Parent, _ffParent) {
            this.eicas = _eicas;
            this.engineId = _engineId;
            if (_engineStateParent != null) {
                this.stateText = _engineStateParent.querySelector("#Engine" + this.engineId + "_State");
            }
            this.n2Gauge = window.document.createElement("b747-8-eicas-gauge");
            this.n2Gauge.init(this.createN2GaugeDefinition());
            this.ffGauge = window.document.createElement("b747-8-eicas-gauge");
            this.ffGauge.init(this.createFFGaugeDefinition());
            if (_n2Parent != null) {
                _n2Parent.appendChild(this.n2Gauge);
            }
            if (_ffParent != null) {
                _ffParent.appendChild(this.ffGauge);
            }
        }
        createN2GaugeDefinition() {
            var definition = new B747_8_EICAS_Common.GaugeDefinition();
            definition.getValue = this.eicas.getN2Value.bind(this, this.engineId);
            definition.maxValue = 1100;
            definition.valueBoxWidth = 70;
            definition.valueTextPrecision = 0;
            definition.barHeight = 40;
            definition.type = 2;
            definition.addLineDefinition(1100, 32, "gaugeMarkerDanger");
            definition.addLineDefinition(0, 40, "gaugeMarkerNormal", this.eicas.getN2IdleValue.bind(this));
            return definition;
        }
        createFFGaugeDefinition() {
            var definition = new B747_8_EICAS_Common.GaugeDefinition();
            definition.getValue = this.getFFValue.bind(this);
            definition.maxValue = 1000;
            definition.valueBoxWidth = 55;
            definition.valueTextPrecision = 0;
            definition.type = 3;
            return definition;
        }
        getFFValue() {
            if (SimVar.GetSimVarValue("L:SALTY_UNIT_IS_METRIC", "bool")) {
                return (SimVar.GetSimVarValue("ENG FUEL FLOW GPH:" + this.engineId, "gallons per hour") * SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilogram") / 100);
            }
            return (SimVar.GetSimVarValue("ENG FUEL FLOW GPH:" + this.engineId, "gallons per hour") * SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "pounds") / 100);
        }
        getOilPValue() {
            return SimVar.GetSimVarValue("ENG OIL PRESSURE:" + this.engineId, "psi");
        }
        getOilTValue() {
            return SimVar.GetSimVarValue("ENG OIL TEMPERATURE:" + this.engineId, "celsius");
        }
        getOilQValue() {
            return (SimVar.GetSimVarValue("ENG OIL QUANTITY:" + this.engineId, "percent scaler 16k") * 0.001);
        }
        getVIBValue() {
            return Math.abs(SimVar.GetSimVarValue("ENG VIBRATION:" + this.engineId, "Number"));
        }
        refresh(_deltaTime) {
            let state = this.eicas.getEngineState(this.engineId);
            switch (state) {
                case B747_8_EngineState.AUTOSTART:
                    this.stateText.textContent = "AUTOSTART";
                    this.stateText.setAttribute("class", "white");
                    break;
                case B747_8_EngineState.RUNNING:
                    this.stateText.textContent = "RUNNING";
                    this.stateText.setAttribute("class", "");
                    break;
                default:
                    this.stateText.textContent = "";
                    break;
            }
            if (this.n2Gauge != null) {
                let n2IdleLine = this.n2Gauge.getDynamicLine(0);
                if (n2IdleLine) {
                    let currentN2 = this.eicas.getN2Value(this.engineId);
                    let idleN2 = n2IdleLine.currentValue;
                    if (Math.round(currentN2) >= idleN2)
                        n2IdleLine.line.setAttribute("display", "none");
                    else
                        n2IdleLine.line.setAttribute("display", "block");
                }
                this.n2Gauge.refresh();
            }
            if (this.ffGauge != null) {
                this.ffGauge.refresh(false);
            }
        }
    }
})(B747_8_LowerEICAS_Engine || (B747_8_LowerEICAS_Engine = {}));
customElements.define("b747-8-lower-eicas-engine", B747_8_LowerEICAS_Engine.Display);
//# sourceMappingURL=B747_8_LowerEICAS_Engine.js.map