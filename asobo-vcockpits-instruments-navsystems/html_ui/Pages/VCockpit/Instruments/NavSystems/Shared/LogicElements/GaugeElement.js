class GaugeElement extends NavSystemElement {
    constructor() {
        super(...arguments);
        this.maxValue = 100;
        this.minValue = 0;
        this.lowRedArcBegin = 0;
        this.lowRedArcEnd = 0;
        this.lowYellowArcBegin = 0;
        this.lowYellowArcEnd = 0;
        this.greenArcBegin = 0;
        this.greenArcEnd = 0;
        this.whiteArcBegin = 0;
        this.whiteArcEnd = 0;
        this.yellowArcBegin = 0;
        this.yellowArcEnd = 0;
        this.redArcBegin = 0;
        this.redArcEnd = 0;
        this.lowLimit = 0;
        this.highLimit = 0;
        this.takeOffValue = 0;
    }
    Set(_gauge, _range, _CurrValueCB, _title, _unit, _valuePrecision = 0, _secondValueCB = null) {
        if (_range) {
            if (_range.__Type == "ColorRangeDisplay4") {
                this.SetColorRange4(_range);
            }
            else if (_range.__Type == "ColorRangeDisplay3") {
                this.SetColorRange3(_range);
            }
            else if (_range.__Type == "ColorRangeDisplay2") {
                this.SetColorRange2(_range);
            }
            else if (_range.__Type == "ColorRangeDisplay") {
                this.SetColorRange(_range);
            }
            else if (_range.__Type == "FlapsRangeDisplay") {
                this.setFlapsRange(_range);
            }
            else if (_range.__Type == "RangeDisplay") {
                this.SetRange(_range);
            }
        }
        this.gauge = _gauge;
        this.title = _title;
        this.unit = _unit;
        this.valuePrecision = _valuePrecision;
        this.getCurrentValue = _CurrValueCB;
        this.getCurrentValue2 = _secondValueCB;
    }
    init() {
        if (this.gauge) {
            diffAndSetAttribute(this.gauge, "max-value", this.maxValue + '');
            diffAndSetAttribute(this.gauge, "min-value", this.minValue + '');
            diffAndSetAttribute(this.gauge, "red-start", this.redArcBegin + '');
            diffAndSetAttribute(this.gauge, "red-end", this.redArcEnd + '');
            diffAndSetAttribute(this.gauge, "yellow-start", this.yellowArcBegin + '');
            diffAndSetAttribute(this.gauge, "yellow-end", this.yellowArcEnd + '');
            diffAndSetAttribute(this.gauge, "green-start", this.greenArcBegin + '');
            diffAndSetAttribute(this.gauge, "green-end", this.greenArcEnd + '');
            diffAndSetAttribute(this.gauge, "white-start", this.whiteArcBegin + '');
            diffAndSetAttribute(this.gauge, "white-end", this.whiteArcEnd + '');
            diffAndSetAttribute(this.gauge, "low-yellow-start", this.lowYellowArcBegin + '');
            diffAndSetAttribute(this.gauge, "low-yellow-end", this.lowYellowArcEnd + '');
            diffAndSetAttribute(this.gauge, "low-red-start", this.lowRedArcBegin + '');
            diffAndSetAttribute(this.gauge, "low-red-end", this.lowRedArcEnd + '');
            diffAndSetAttribute(this.gauge, "limit-low", (this.lowLimit > 0) ? this.lowLimit + '' : "undefined");
            diffAndSetAttribute(this.gauge, "limit-high", (this.highLimit > 0) ? this.highLimit + '' : "undefined");
            diffAndSetAttribute(this.gauge, "take-off-value", this.takeOffValue + '');
            diffAndSetAttribute(this.gauge, "title", this.title);
            diffAndSetAttribute(this.gauge, "unit", this.unit);
            diffAndSetAttribute(this.gauge, "value-precision", this.valuePrecision + '');
        }
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        if (this.gauge) {
            var val = this.getCurrentValue();
            var clampedVal = Math.min(Math.max(val, this.minValue), this.maxValue);
            var roundedVal = fastToFixed(clampedVal, this.valuePrecision);
            diffAndSetAttribute(this.gauge, "value", "" + roundedVal);
            if (this.getCurrentValue2) {
                var val2 = this.getCurrentValue2();
                var clampedVal2 = Math.min(Math.max(val2, this.minValue), this.maxValue);
                var roundedVal2 = fastToFixed(clampedVal2, this.valuePrecision);
                diffAndSetAttribute(this.gauge, "value2", "" + roundedVal2);
            }
        }
    }
    onExit() {
    }
    onEvent(_event) {
    }
    redraw() {
        if (this.gauge && (this.gauge instanceof AbstractGauge))
            this.gauge._redraw();
    }
    SetRange(_range) {
        this.maxValue = _range.max;
        this.minValue = _range.min;
        this.lowLimit = _range.lowLimit;
        this.highLimit = _range.highLimit;
    }
    SetColorRange(_range) {
        this.SetRange(_range);
        this.greenArcBegin = _range.greenStart;
        this.greenArcEnd = _range.greenEnd;
    }
    SetColorRange2(_range) {
        this.SetColorRange(_range);
        this.yellowArcBegin = _range.yellowStart;
        this.yellowArcEnd = _range.yellowEnd;
        this.redArcBegin = _range.redStart;
        this.redArcEnd = _range.redEnd;
    }
    SetColorRange3(_range) {
        this.SetColorRange2(_range);
        this.lowRedArcBegin = _range.lowRedStart;
        this.lowRedArcEnd = _range.lowRedEnd;
        this.lowYellowArcBegin = _range.lowYellowStart;
        this.lowYellowArcEnd = _range.lowYellowEnd;
    }
    SetColorRange4(_range) {
        this.SetColorRange2(_range);
        this.whiteArcBegin = _range.whiteStart;
        this.whiteArcEnd = _range.whiteEnd;
    }
    setFlapsRange(_range) {
        this.SetRange(_range);
        this.takeOffValue = _range.takeOffValue;
    }
}
class TextElement extends NavSystemElement {
    constructor() {
        super(...arguments);
        this.value = "";
    }
    Set(_elem, _CurrValueCB) {
        this.elem = _elem;
        this.getCurrentValue = _CurrValueCB;
    }
    init() {
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        var val = this.getCurrentValue();
        if (this.elem && this.value != val) {
            diffAndSetText(this.elem, val);
            this.value = val;
        }
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
//# sourceMappingURL=GaugeElement.js.map