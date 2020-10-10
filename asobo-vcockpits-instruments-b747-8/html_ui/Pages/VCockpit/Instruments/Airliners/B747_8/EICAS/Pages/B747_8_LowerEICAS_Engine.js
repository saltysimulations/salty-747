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
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            var stateParent = this.querySelector("#EngineStates");
            var n2Parent = this.querySelector("#N2Gauges");
            var ffParent = this.querySelector("#FFGauges");
            for (var engine = 1; engine <= Simplane.getEngineCount(); ++engine) {
                this.allEngineInfos.push(new EngineInfo(engine, stateParent, n2Parent, ffParent));
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
    let EngineInfoState;
    (function (EngineInfoState) {
        EngineInfoState[EngineInfoState["IDLE"] = 0] = "IDLE";
        EngineInfoState[EngineInfoState["AUTOSTART"] = 1] = "AUTOSTART";
        EngineInfoState[EngineInfoState["RUNNING"] = 2] = "RUNNING";
        EngineInfoState[EngineInfoState["READY"] = 3] = "READY";
        EngineInfoState[EngineInfoState["DECELERATE"] = 4] = "DECELERATE";
    })(EngineInfoState || (EngineInfoState = {}));
    class EngineInfo {
        constructor(_engine, _engineStateParent, _n2Parent, _ffParent) {
            this.currentState = EngineInfoState.IDLE;
            this.timeInState = 0;
            this.ffGPHToKGPHX1000 = 0;
            this.engine = _engine;
            if (_engineStateParent != null) {
                this.stateText = _engineStateParent.querySelector("#Engine" + this.engine + "_State");
            }
            this.n2Gauge = window.document.createElement("b747-8-eicas-gauge");
            this.n2Gauge.init(this.createN2GaugeDefinition(_engine));
            this.ffGauge = window.document.createElement("b747-8-eicas-gauge");
            this.ffGauge.init(this.createFFGaugeDefinition(_engine));
            if (_n2Parent != null) {
                _n2Parent.appendChild(this.n2Gauge);
            }
            if (_ffParent != null) {
                _ffParent.appendChild(this.ffGauge);
            }
            this.ffGPHToKGPHX1000 = SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilogram") / 1000;
        }
        createN2GaugeDefinition(_engine) {
            var definition = new B747_8_EICAS_Common.GaugeDefinition();
            definition.getValue = this.getN2Value.bind(this);
            definition.maxValue = 110;
            definition.valueBoxWidth = 80;
            definition.valueTextPrecision = 1;
            definition.barHeight = 60;
            definition.addLineDefinition(110, 40, "gaugeMarkerDanger");
            definition.addLineDefinition(0, 40, "gaugeMarkerNormal", this.getN2IdleValue.bind(this));
            return definition;
        }
        getN2IdleValue() {
            return 50;
        }
        getN2Value() {
            return SimVar.GetSimVarValue("ENG N2 RPM:" + this.engine, "percent");
        }
        createFFGaugeDefinition(_engine) {
            var definition = new B747_8_EICAS_Common.GaugeDefinition();
            definition.getValue = this.getFFValue.bind(this);
            definition.maxValue = 1000;
            definition.valueBoxWidth = 60;
            definition.valueTextPrecision = 1;
            return definition;
        }
        getFFValue() {
            return (SimVar.GetSimVarValue("ENG FUEL FLOW GPH:" + this.engine, "gallons per hour") * this.ffGPHToKGPHX1000);
        }
        getOilPValue() {
            return SimVar.GetSimVarValue("ENG OIL PRESSURE:" + this.engine, "psi");
        }
        getOilTValue() {
            return SimVar.GetSimVarValue("ENG OIL TEMPERATURE:" + this.engine, "celsius");
        }
        getOilQValue() {
            return (SimVar.GetSimVarValue("ENG OIL QUANTITY:" + this.engine, "percent scaler 16k") * 0.001);
        }
        getVIBValue() {
            return SimVar.GetSimVarValue("ENG VIBRATION:" + this.engine, "Number");
        }
        refresh(_deltaTime) {
            this.timeInState += _deltaTime / 1000;
            let N2Value = this.getN2Value();
            switch (this.currentState) {
                case EngineInfoState.IDLE:
                    if (N2Value >= 50.0)
                        this.changeState(EngineInfoState.RUNNING);
                    else if (N2Value >= 0.05)
                        this.changeState(EngineInfoState.AUTOSTART);
                    break;
                case EngineInfoState.AUTOSTART:
                    if (N2Value >= 50.0)
                        this.changeState(2);
                    break;
                case EngineInfoState.RUNNING:
                    if (N2Value >= 50.0) {
                        if (this.timeInState > 30)
                            this.changeState(EngineInfoState.READY);
                    }
                    else
                        this.changeState(4);
                    break;
                case EngineInfoState.READY:
                    if (N2Value < 50.0)
                        this.changeState(EngineInfoState.DECELERATE);
                    break;
                case EngineInfoState.DECELERATE:
                    if (N2Value < 0.05)
                        this.changeState(EngineInfoState.IDLE);
                    else if (N2Value >= 50.0)
                        this.changeState(EngineInfoState.RUNNING);
                    break;
            }
            if (this.n2Gauge != null) {
                this.n2Gauge.refresh();
            }
            if (this.ffGauge != null) {
                this.ffGauge.refresh();
            }
        }
        changeState(_state) {
            if (this.currentState == _state)
                return;
            this.currentState = _state;
            this.timeInState = 0;
            switch (this.currentState) {
                case EngineInfoState.AUTOSTART:
                    this.stateText.textContent = "AUTOSTART";
                    break;
                case EngineInfoState.RUNNING:
                    this.stateText.textContent = "RUNNING";
                    break;
                default:
                    this.stateText.textContent = "";
                    break;
            }
        }
    }
})(B747_8_LowerEICAS_Engine || (B747_8_LowerEICAS_Engine = {}));
customElements.define("b747-8-lower-eicas-engine", B747_8_LowerEICAS_Engine.Display);
//# sourceMappingURL=B747_8_LowerEICAS_Engine.js.map