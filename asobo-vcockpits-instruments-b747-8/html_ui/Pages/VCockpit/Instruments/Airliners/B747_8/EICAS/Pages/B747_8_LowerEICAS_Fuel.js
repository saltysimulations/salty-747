var B747_8_LowerEICAS_Fuel;
(function (B747_8_LowerEICAS_Fuel) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.allTextValueComponents = new Array();
            this.allFuelComponents = new Array();
            this.gallonToMegagrams = 0;
            this.gallonToMegapounds = 0;
            this.isInitialised = false;
        }
        get templateID() { return "B747_8LowerEICASFuelTemplate"; }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            this.unitTextSVG = this.querySelector("#TotalFuelUnits");
            this.allTextValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#TotalFuelValue"), this.getTotalFuelInMegagrams.bind(this), 1));
            this.allTextValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#CenterValue"), this.getMainTankFuelInMegagrams.bind(this, 1), 1));
            this.allTextValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#StabValue"), this.getMainTankFuelInMegagrams.bind(this, 8), 1));
            this.allTextValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#Main1Value"), this.getMainTankFuelInMegagrams.bind(this, 2), 1));
            this.allTextValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#Main2Value"), this.getMainTankFuelInMegagrams.bind(this, 3), 1));
            this.allTextValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#Main3Value"), this.getMainTankFuelInMegagrams.bind(this, 4), 1));
            this.allTextValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#Main4Value"), this.getMainTankFuelInMegagrams.bind(this, 5), 1));
            this.allTextValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#Res1Value"), this.getMainTankFuelInMegagrams.bind(this, 6), 1));
            this.allTextValueComponents.push(new Airliners.DynamicValueComponent(this.querySelector("#Res4Value"), this.getMainTankFuelInMegagrams.bind(this, 7), 1));
            var engine1 = this.querySelector("#Engine1");
            if (engine1 != null) {
                var enginePathD = engine1.getAttribute("d");
                this.applyPathDString("#Engine2", enginePathD);
                this.applyPathDString("#Engine3", enginePathD);
                this.applyPathDString("#Engine4", enginePathD);
            }
            for (var engine = 1; engine <= 4; ++engine) {
                this.allFuelComponents.push(new Boeing.FuelEngineState(this.querySelector("#Engine" + engine), engine));
            }
            var smallPumpTemplate = this.querySelector("#SmallPumpTemplate");
            var largePumpTemplate = this.querySelector("#LargePumpTemplate");
            this.createPumps(this.querySelector("#MainPumps"), smallPumpTemplate);
            this.createPumps(this.querySelector("#OvrdPumps"), largePumpTemplate);
            this.createPumps(this.querySelector("#StabPumps"), largePumpTemplate);
            if (smallPumpTemplate != null) {
                smallPumpTemplate.remove();
            }
            if (largePumpTemplate != null) {
                largePumpTemplate.remove();
            }
            var valvesGroup = this.querySelector("#Valves");
            if (valvesGroup != null) {
                var valveTemplate = this.querySelector("#ValveTemplate");
                if (valveTemplate != null) {
                    var allValves = valvesGroup.querySelectorAll("g");
                    if (allValves != null) {
                        for (var i = 0; i < allValves.length; ++i) {
                            var clonedValve = valveTemplate.cloneNode(true);
                            clonedValve.removeAttribute("id");
                            allValves[i].appendChild(clonedValve);
                            var id = parseInt(allValves[i].id.replace("Valve", ""));
                            if ((id != NaN) && (id > 0)) {
                                this.allFuelComponents.push(new Boeing.FuelValve(allValves[i], id));
                            }
                        }
                    }
                    valveTemplate.remove();
                }
            }
            var smallPumpFlowLineTemplate = this.querySelector("#SmallPumpFlowLineTemplate");
            var largePumpFlowLineTemplate = this.querySelector("#LargePumpFlowLineTemplate");
            this.createFlowLines(this.querySelector("#MainPumpFlowLines"), smallPumpFlowLineTemplate);
            this.createFlowLines(this.querySelector("#OvrdPumpFlowLines"), largePumpFlowLineTemplate);
            this.createFlowLines(this.querySelector("#StabPumpFlowLines"), largePumpFlowLineTemplate);
            this.createFlowLines(this.querySelector("#MainFlowLines"));
            if (smallPumpFlowLineTemplate != null) {
                smallPumpFlowLineTemplate.remove();
            }
            if (largePumpFlowLineTemplate != null) {
                largePumpFlowLineTemplate.remove();
            }
            if (this.allFuelComponents != null) {
                for (var i = 0; i < this.allFuelComponents.length; ++i) {
                    if (this.allFuelComponents[i] != null) {
                        this.allFuelComponents[i].init();
                    }
                }
            }
            this.gallonToMegagrams = SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "kilogram") * 0.001;
            this.gallonToMegapounds = SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "lbs") * 0.001;
            this.isInitialised = true;
        }
        createPumps(_pumpsGroup, _pumpTemplate) {
            if ((_pumpsGroup != null) && (_pumpTemplate != null) && (this.allFuelComponents != null)) {
                var allPumps = _pumpsGroup.querySelectorAll("g");
                if (allPumps != null) {
                    for (var i = 0; i < allPumps.length; ++i) {
                        var lineIndex = parseInt(allPumps[i].textContent.replace("FuelLine", ""));
                        allPumps[i].textContent = "";
                        var clonedPump = _pumpTemplate.cloneNode(true);
                        clonedPump.removeAttribute("id");
                        allPumps[i].appendChild(clonedPump);
                        var id = parseInt(allPumps[i].id.replace("Pump", ""));
                        if ((id != NaN) && (id > 0)) {
                            if ((lineIndex != NaN) && (lineIndex > 0)) {
                                this.allFuelComponents.push(new StabOvrdFuelPump(allPumps[i], id, lineIndex));
                            }
                            else {
                                this.allFuelComponents.push(new Boeing.FuelPump(allPumps[i], id));
                            }
                        }
                    }
                }
            }
        }
        createFlowLines(_linesGroup, _lineTemplate = null) {
            if ((_linesGroup != null) && (this.allFuelComponents != null)) {
                var allLines = _linesGroup.querySelectorAll("g, line");
                if (allLines != null) {
                    for (var i = 0; i < allLines.length; ++i) {
                        if (_lineTemplate != null) {
                            var clonedLine = _lineTemplate.cloneNode(true);
                            clonedLine.removeAttribute("id");
                            allLines[i].appendChild(clonedLine);
                        }
                        var id = parseInt(allLines[i].id.replace("FlowLine", ""));
                        if ((id != NaN) && (id > 0)) {
                            this.allFuelComponents.push(new Boeing.FuelLine(allLines[i], id));
                        }
                    }
                }
            }
        }
        applyPathDString(_selector, _d) {
            var pathElement = this.querySelector(_selector);
            if (pathElement != null) {
                pathElement.setAttribute("d", _d);
            }
        }
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            if (this.allTextValueComponents != null) {
                for (var i = 0; i < this.allTextValueComponents.length; ++i) {
                    if (this.allTextValueComponents[i] != null) {
                        this.allTextValueComponents[i].refresh();
                    }
                }
            }
            if (this.allFuelComponents != null) {
                for (var i = 0; i < this.allFuelComponents.length; ++i) {
                    if (this.allFuelComponents[i] != null) {
                        this.allFuelComponents[i].update(_deltaTime);
                    }
                }
            }
            if (this.unitTextSVG) {
                if (BaseAirliners.unitIsMetric(Aircraft.B747_8))
                    this.unitTextSVG.textContent = "KGS X 1000";
                else
                    this.unitTextSVG.textContent = "LBS X 1000";
            }
        }
        getTotalFuelInMegagrams() {
            let factor = this.gallonToMegapounds;
            if (BaseAirliners.unitIsMetric(Aircraft.B747_8))
                factor = this.gallonToMegagrams;
            return (SimVar.GetSimVarValue("FUEL TOTAL QUANTITY", "gallons") * factor);
        }
        getMainTankFuelInMegagrams(_index) {
            let factor = this.gallonToMegapounds;
            if (BaseAirliners.unitIsMetric(Aircraft.B747_8))
                factor = this.gallonToMegagrams;
            return (SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:" + _index, "gallons") * factor);
        }
    }
    B747_8_LowerEICAS_Fuel.Display = Display;
    class StabOvrdFuelPump extends Boeing.FuelBaseComponent {
        constructor(_element, _pumpIndex, _lineIndex) {
            super(_element, _pumpIndex);
            this.isPumpSwitched = false;
            this.isPumpActive = false;
            this.lineIndex = 0;
            this.isLineActive = false;
            this.lineIndex = _lineIndex;
        }
        init() {
            this.refresh(false, false, false, true);
        }
        update(_deltaTime) {
            this.refresh(SimVar.GetSimVarValue("FUELSYSTEM PUMP SWITCH:" + this.index, "Bool"), SimVar.GetSimVarValue("FUELSYSTEM PUMP ACTIVE:" + this.index, "Bool"), (SimVar.GetSimVarValue("FUELSYSTEM LINE FUEL FLOW:" + this.lineIndex, "number") > 0));
        }
        refresh(_isPumpSwitched, _isPumpActive, _isLineActive, _force = false) {
            if (_force || (this.isPumpSwitched != _isPumpSwitched) || (this.isPumpActive != _isPumpActive) || (this.isLineActive != _isLineActive)) {
                this.isPumpSwitched = _isPumpSwitched;
                this.isPumpActive = _isPumpActive;
                this.isLineActive = _isLineActive;
                if (this.element != null) {
                    var className = this.isPumpSwitched ? "switched" : "notswitched";
                    if (this.isPumpActive) {
                        className += this.isLineActive ? "-active-withflow" : "-active";
                    }
                    else {
                        className += "-inactive";
                    }
                    this.element.setAttribute("class", "fuelpump-" + className);
                }
            }
        }
    }
})(B747_8_LowerEICAS_Fuel || (B747_8_LowerEICAS_Fuel = {}));
customElements.define("b747-8-lower-eicas-fuel", B747_8_LowerEICAS_Fuel.Display);
//# sourceMappingURL=B747_8_LowerEICAS_Fuel.js.map