var B747_8_EICAS_Common;
(function (B747_8_EICAS_Common) {
    class GaugeDefinition {
        constructor() {
            this.getValue = null;
            this.minValue = 0;
            this.maxValue = 0;
            this.valueBoxWidth = 0;
            this.valueTextPrecision = 0;
            this.barHeight = 0;
            this.linesDefs = new Array();
        }
        addLineDefinition(_value, _length, _classStr, _getValue = null) {
            var lineDef = new GaugeLineDefinition();
            lineDef.value = _value;
            lineDef.length = _length;
            lineDef.classStr = _classStr;
            lineDef.getValue = _getValue;
            this.linesDefs.push(lineDef);
        }
    }
    GaugeDefinition.VALUE_TEXT_BOX_HEIGHT = 15;
    GaugeDefinition.VALUE_TEXT_X_OFFSET_FROM_BOX = 3;
    GaugeDefinition.GAUGE_TOP = 20;
    GaugeDefinition.GAUGE_WIDTH = 16;
    B747_8_EICAS_Common.GaugeDefinition = GaugeDefinition;
    class GaugeLineDefinition {
        constructor() {
            this.value = 0;
            this.length = 0;
            this.classStr = "";
            this.getValue = null;
        }
    }
    class GaugeDynamicLine {
        constructor(_line, _getValue) {
            this.line = null;
            this.getValue = null;
            this.currentValue = 0;
            this.line = _line;
            this.getValue = _getValue;
            this.currentValue = 0;
        }
    }
    class Gauge extends HTMLElement {
        constructor() {
            super(...arguments);
            this.rootSVG = null;
            this.valueText = null;
            this.valuePrecision = 0;
            this.gauge = null;
            this.bar = null;
            this.barHeight = 0;
            this.gaugeValueToHeight = 0;
            this.minValue = 0;
            this.maxValue = 0;
            this.currentValue = 0;
            this.getValue = null;
            this.dynamicLines = new Array();
        }
        init(_definition) {
            if (_definition != null) {
                this.getValue = _definition.getValue;
                this.minValue = _definition.minValue;
                this.maxValue = _definition.maxValue;
                this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                this.rootSVG.setAttribute("viewBox", "0 0 100 200");
                this.appendChild(this.rootSVG);
                if (_definition.valueBoxWidth > 0) {
                    this.createValueDisplay(_definition.valueBoxWidth, _definition.valueTextPrecision);
                }
                if (_definition.barHeight > 0) {
                    this.createGaugeDisplay(_definition.barHeight);
                }
                if ((_definition.linesDefs != null) && (_definition.linesDefs.length > 0)) {
                    for (var line = 0; line < _definition.linesDefs.length; ++line) {
                        this.rootSVG.appendChild(this.createLine(_definition.linesDefs[line]));
                    }
                }
            }
        }
        createValueDisplay(_boxWidth, _valuePrecision) {
            this.valuePrecision = _valuePrecision;
            if (this.rootSVG != null) {
                var boxX = ((100 - _boxWidth) * 0.5);
                var textX = 100 - boxX - GaugeDefinition.VALUE_TEXT_X_OFFSET_FROM_BOX;
                var textY = GaugeDefinition.VALUE_TEXT_BOX_HEIGHT * 0.5;
                this.rootSVG.appendChild(this.createRect(boxX + "%", "0%", _boxWidth + "%", GaugeDefinition.VALUE_TEXT_BOX_HEIGHT + "%", "value"));
                this.valueText = document.createElementNS(Avionics.SVG.NS, "text");
                this.valueText.setAttribute("x", textX + "%");
                this.valueText.setAttribute("y", textY + "%");
                this.valueText.setAttribute("class", "value");
                this.valueText.textContent = this.currentValue.toFixed(this.valuePrecision);
                this.rootSVG.appendChild(this.valueText);
            }
        }
        createGaugeDisplay(_barHeight) {
            if (this.rootSVG != null) {
                var width = GaugeDefinition.GAUGE_WIDTH;
                var widthStr = width + "%";
                var x = 50 - (width * 0.5);
                var xStr = x + "%";
                this.barHeight = _barHeight;
                var heightStr = this.barHeight + "%";
                this.bar = this.createRect(xStr, GaugeDefinition.GAUGE_TOP + "%", widthStr, heightStr, "bar");
                this.gauge = this.createRect(xStr, (GaugeDefinition.GAUGE_TOP + this.barHeight) + "%", widthStr, "0%", "gauge");
                this.rootSVG.appendChild(this.gauge);
                this.rootSVG.appendChild(this.bar);
                this.gaugeValueToHeight = (1 / (this.maxValue - this.minValue)) * this.barHeight;
            }
        }
        createRect(_x, _y, _width, _height, _class) {
            var rect = document.createElementNS(Avionics.SVG.NS, "rect");
            rect.setAttribute("x", _x);
            rect.setAttribute("y", _y);
            rect.setAttribute("width", _width);
            rect.setAttribute("height", _height);
            rect.setAttribute("class", _class);
            return rect;
        }
        createLine(_lineDef) {
            var x1 = 50 - (_lineDef.length * 0.5);
            var x2 = x1 + _lineDef.length;
            var y = this.valueToGaugePosY(_lineDef.value);
            var yStr = y + "%";
            var line = document.createElementNS(Avionics.SVG.NS, "line");
            line.setAttribute("x1", x1 + "%");
            line.setAttribute("x2", x2 + "%");
            line.setAttribute("y1", yStr);
            line.setAttribute("y2", yStr);
            line.setAttribute("class", _lineDef.classStr);
            if (_lineDef.getValue != null) {
                this.dynamicLines.push(new GaugeDynamicLine(line, _lineDef.getValue));
            }
            return line;
        }
        valueToGaugeHeight(_value) {
            return ((_value - this.minValue) * this.gaugeValueToHeight);
        }
        valueToGaugePosY(_value) {
            return (GaugeDefinition.GAUGE_TOP + (this.barHeight - this.valueToGaugeHeight(_value)));
        }
        refresh() {
            if (this.getValue != null) {
                var value = this.getValue();
                if (value != this.currentValue) {
                    this.currentValue = Utils.Clamp(value, this.minValue, this.maxValue);
                    if (this.valueText != null) {
                        this.valueText.textContent = this.currentValue.toFixed(this.valuePrecision);
                    }
                    if (this.gauge != null) {
                        this.gauge.setAttribute("height", Math.max(this.valueToGaugeHeight(this.currentValue), 0.001) + "%");
                        this.gauge.setAttribute("y", this.valueToGaugePosY(this.currentValue) + "%");
                    }
                }
            }
            if ((this.dynamicLines != null) && (this.dynamicLines.length > 0)) {
                for (var line = 0; line < this.dynamicLines.length; ++line) {
                    if (this.dynamicLines[line].getValue != null) {
                        value = this.dynamicLines[line].getValue();
                        if (value != this.dynamicLines[line].currentValue) {
                            this.dynamicLines[line].currentValue = Utils.Clamp(value, this.minValue, this.maxValue);
                            ;
                            var yStr = this.valueToGaugePosY(this.dynamicLines[line].currentValue) + "%";
                            this.dynamicLines[line].line.setAttribute("y1", yStr);
                            this.dynamicLines[line].line.setAttribute("y2", yStr);
                        }
                    }
                }
            }
        }
    }
    B747_8_EICAS_Common.Gauge = Gauge;
    class GaugeDualDefinition {
        constructor() {
            this.useDoubleDisplay = false;
            this.getValueLeft = null;
            this.getValueRight = null;
            this.valueTextPrecision = 0;
            this.minValue = 0;
            this.maxValue = 0;
            this.barTop = 0;
            this.barHeight = 100;
        }
    }
    GaugeDualDefinition.VALUE_TEXT_X_OFFSET = 20;
    GaugeDualDefinition.VALUE_INDICATOR_X_OFFSET = 7;
    GaugeDualDefinition.VALUE_INDICATOR_LENGTH = 16;
    GaugeDualDefinition.VALUE_INDICATOR_HEIGHT = 8;
    B747_8_EICAS_Common.GaugeDualDefinition = GaugeDualDefinition;
    class GaugeDualValueDisplay {
        constructor(_parent, _definition, _isLeft) {
            this.text = null;
            this.valueTextPrecision = 0;
            this.indicator = null;
            this.barTop = 0;
            this.barHeight = 0;
            this.valueToIndicatorHeight = 0;
            this.getValue = null;
            this.currentValue = 0;
            this.minValue = 0;
            this.maxValue = 0;
            if ((_parent != null) && (_definition != null)) {
                var textX = _isLeft ? GaugeDualDefinition.VALUE_TEXT_X_OFFSET : (100 - GaugeDualDefinition.VALUE_TEXT_X_OFFSET);
                this.text = document.createElementNS(Avionics.SVG.NS, "text");
                this.text.setAttribute("x", textX + "%");
                this.text.setAttribute("y", "50%");
                this.text.setAttribute("class", "normal");
                this.text.style.textAnchor = _isLeft ? "end" : "start";
                _parent.appendChild(this.text);
                if (_definition.barHeight > 0) {
                    var x1 = 0;
                    var x2 = 0;
                    if (_definition.useDoubleDisplay) {
                        if (_isLeft) {
                            x1 = 25 + GaugeDualDefinition.VALUE_INDICATOR_X_OFFSET;
                            x2 = x1 + GaugeDualDefinition.VALUE_INDICATOR_LENGTH;
                        }
                        else {
                            x1 = 75 - GaugeDualDefinition.VALUE_INDICATOR_X_OFFSET;
                            x2 = x1 - GaugeDualDefinition.VALUE_INDICATOR_LENGTH;
                        }
                    }
                    else {
                        if (_isLeft) {
                            x1 = 50 - GaugeDualDefinition.VALUE_INDICATOR_X_OFFSET;
                            x2 = x1 - GaugeDualDefinition.VALUE_INDICATOR_LENGTH;
                        }
                        else {
                            x1 = 50 + GaugeDualDefinition.VALUE_INDICATOR_X_OFFSET;
                            x2 = x1 + GaugeDualDefinition.VALUE_INDICATOR_LENGTH;
                        }
                    }
                    var halfHeight = GaugeDualDefinition.VALUE_INDICATOR_HEIGHT * 0.5;
                    this.indicator = document.createElementNS(Avionics.SVG.NS, "polygon");
                    var points = [
                        x1, 0,
                        x2, -halfHeight,
                        x2, halfHeight
                    ].join(" ");
                    this.indicator.setAttribute("points", points);
                    this.indicator.setAttribute("class", "indicatorNormal");
                    _parent.appendChild(this.indicator);
                    this.barTop = _definition.barTop;
                    this.barHeight = _definition.barHeight;
                    this.minValue = _definition.minValue;
                    this.maxValue = _definition.maxValue;
                    this.valueToIndicatorHeight = (1 / (this.maxValue - this.minValue)) * this.barHeight;
                }
            }
            this.valueTextPrecision = _definition.valueTextPrecision;
            this.getValue = _isLeft ? _definition.getValueLeft : _definition.getValueRight;
            this.trySetValue(0, true);
        }
        refresh() {
            if (this.getValue != null) {
                this.trySetValue(this.getValue());
            }
        }
        trySetValue(_value, _force = false) {
            if ((_value != this.currentValue) || _force) {
                this.currentValue = _value;
                if (this.text != null) {
                    this.text.textContent = _value.toFixed(this.valueTextPrecision);
                }
                if (this.indicator != null) {
                    var clampValue = Utils.Clamp(this.currentValue, this.minValue, this.maxValue);
                    var y = (this.barTop + (this.barHeight - ((clampValue - this.minValue) * this.valueToIndicatorHeight)));
                    this.indicator.setAttribute("transform", "translate(0," + y + ")");
                }
            }
        }
    }
    class GaugeDual extends HTMLElement {
        constructor() {
            super(...arguments);
            this.rootSVG = null;
            this.leftValue = null;
            this.rightValue = null;
        }
        init(_definition) {
            this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
            this.rootSVG.setAttribute("viewBox", "0 0 100 100");
            this.appendChild(this.rootSVG);
            if (_definition != null) {
                if (_definition.getValueLeft != null) {
                    this.leftValue = new GaugeDualValueDisplay(this.rootSVG, _definition, true);
                }
                if (_definition.getValueRight != null) {
                    this.rightValue = new GaugeDualValueDisplay(this.rootSVG, _definition, false);
                }
                if (_definition.barHeight > 0) {
                    if (_definition.useDoubleDisplay) {
                        this.rootSVG.appendChild(this.createBar(25, _definition.barTop, _definition.barHeight));
                        this.rootSVG.appendChild(this.createBar(75, _definition.barTop, _definition.barHeight));
                    }
                    else {
                        this.rootSVG.appendChild(this.createBar(50, _definition.barTop, _definition.barHeight));
                    }
                }
            }
        }
        createBar(_x, _top, _height) {
            var bar = document.createElementNS(Avionics.SVG.NS, "line");
            bar.setAttribute("x1", _x + "%");
            bar.setAttribute("x2", _x + "%");
            bar.setAttribute("y1", _top + "%");
            bar.setAttribute("y2", (_top + _height) + "%");
            bar.setAttribute("class", "bar");
            return bar;
        }
        refresh() {
            if (this.leftValue != null) {
                this.leftValue.refresh();
            }
            if (this.rightValue != null) {
                this.rightValue.refresh();
            }
        }
    }
    B747_8_EICAS_Common.GaugeDual = GaugeDual;
})(B747_8_EICAS_Common || (B747_8_EICAS_Common = {}));
customElements.define('b747-8-eicas-gauge', B747_8_EICAS_Common.Gauge);
customElements.define('b747-8-eicas-gauge-dual', B747_8_EICAS_Common.GaugeDual);
//# sourceMappingURL=B747_8_EICASGauge.js.map