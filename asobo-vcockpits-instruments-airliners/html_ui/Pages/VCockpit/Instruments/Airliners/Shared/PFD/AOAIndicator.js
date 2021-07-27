class Jet_PFD_AOAIndicator extends HTMLElement {
    constructor() {
        super(...arguments);
        this.fontSize = 25;
        this.cursorWidth = 0;
        this.cursorHeight = 0;
        this.cursorMinY = 0;
        this.cursorMaxY = 0;
        this._aircraft = Aircraft.A320_NEO;
    }
    static get observedAttributes() {
        return [
            "angle"
        ];
    }
    get aircraft() {
        return this._aircraft;
    }
    set aircraft(_val) {
        if (this._aircraft != _val) {
            this._aircraft = _val;
            this.construct();
        }
    }
    connectedCallback() {
        this.construct();
    }
    construct() {
        if (this.aircraft == Aircraft.CJ4) {
            this.construct_CJ4();
        }
    }
    construct_CJ4() {
        this.rootSVG = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.rootSVG, "id", "ViewBox");
        diffAndSetAttribute(this.rootSVG, "viewBox", "0 0 250 500");
        var width = 70.5;
        var centerHeight = 380;
        var posX = width * 0.5;
        var posY = 435;
        if (!this.rootGroup) {
            this.rootGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.rootGroup, "id", "AoA");
        }
        else {
            Utils.RemoveAllChildren(this.rootGroup);
        }
        if (!this.centerGroup) {
            this.centerGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.centerGroup, "id", "CenterGroup");
        }
        else {
            Utils.RemoveAllChildren(this.centerGroup);
        }
        posY -= centerHeight;
        {
            var _top = posY;
            var _left = posX - width * 0.5;
            var _width = width;
            var _height = centerHeight;
            var bg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(bg, "x", _left + '');
            diffAndSetAttribute(bg, "y", _top + '');
            diffAndSetAttribute(bg, "width", _width + '');
            diffAndSetAttribute(bg, "height", _height + '');
            diffAndSetAttribute(bg, "fill", "black");
            diffAndSetAttribute(bg, "fill-opacity", "0.5");
            this.centerGroup.appendChild(bg);
            var text = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(text, "AOA");
            diffAndSetAttribute(text, "x", (_left + _width * 0.75) + '');
            diffAndSetAttribute(text, "y", (_top + 20) + '');
            diffAndSetAttribute(text, "fill", "white");
            diffAndSetAttribute(text, "font-size", (this.fontSize) + '');
            diffAndSetAttribute(text, "font-family", "Roboto-Light");
            diffAndSetAttribute(text, "text-anchor", "end");
            diffAndSetAttribute(text, "alignment-baseline", "central");
            this.centerGroup.appendChild(text);
            var _graduationStartY = _top + 60;
            var _graduationHeight = (_top + 325) - _graduationStartY;
            if (!this.graduationsGroup) {
                this.graduationsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.graduationsGroup, "id", "GraduationsGroup");
            }
            else {
                Utils.RemoveAllChildren(this.graduationsGroup);
            }
            var _nbGrads = 9;
            var _gradSpacing = _graduationHeight / (_nbGrads - 1);
            var _gradTexts = ["1.0", ".8", ".6", ".4", ".2"];
            var _textId = 0;
            var _gradX = (_left + _width * 0.75);
            for (var i = 0; i < _nbGrads; i++) {
                var isPrimary = (i % 2) ? false : true;
                var y = _graduationStartY + (_gradSpacing * i);
                var len = isPrimary ? 12 : 6;
                var line = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(line, "x", (_gradX - len) + '');
                diffAndSetAttribute(line, "y", y + '');
                diffAndSetAttribute(line, "width", len + '');
                diffAndSetAttribute(line, "height", "2");
                diffAndSetAttribute(line, "fill", "white");
                this.graduationsGroup.appendChild(line);
                if (isPrimary) {
                    var text = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(text, _gradTexts[_textId]);
                    diffAndSetAttribute(text, "x", (_gradX - len - 5) + '');
                    diffAndSetAttribute(text, "y", y + '');
                    diffAndSetAttribute(text, "fill", "white");
                    diffAndSetAttribute(text, "font-size", (this.fontSize * 0.7) + '');
                    diffAndSetAttribute(text, "font-family", "Roboto-Light");
                    diffAndSetAttribute(text, "text-anchor", "end");
                    diffAndSetAttribute(text, "alignment-baseline", "central");
                    this.graduationsGroup.appendChild(text);
                    _textId++;
                }
            }
            var graduationVLine = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(graduationVLine, "x1", _gradX + '');
            diffAndSetAttribute(graduationVLine, "y1", _graduationStartY + '');
            diffAndSetAttribute(graduationVLine, "x2", _gradX + '');
            diffAndSetAttribute(graduationVLine, "y2", (_graduationStartY + (_gradSpacing * (_nbGrads - 1))) + '');
            diffAndSetAttribute(graduationVLine, "fill", "none");
            diffAndSetAttribute(graduationVLine, "stroke", "white");
            diffAndSetAttribute(graduationVLine, "stroke-width", "2");
            this.graduationsGroup.appendChild(graduationVLine);
            this.centerGroup.appendChild(this.graduationsGroup);
            this.bottomText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(this.bottomText, ".");
            diffAndSetAttribute(this.bottomText, "x", (_left + _width * 0.75) + '');
            diffAndSetAttribute(this.bottomText, "y", (_top + _height - 20) + '');
            diffAndSetAttribute(this.bottomText, "fill", "white");
            diffAndSetAttribute(this.bottomText, "font-size", (this.fontSize * 0.83) + '');
            diffAndSetAttribute(this.bottomText, "font-family", "Roboto-Light");
            diffAndSetAttribute(this.bottomText, "text-anchor", "end");
            diffAndSetAttribute(this.bottomText, "alignment-baseline", "central");
            this.centerGroup.appendChild(this.bottomText);
            this.cursorMinY = _graduationStartY + _graduationHeight;
            this.cursorMaxY = _graduationStartY;
            this.cursorWidth = 40;
            this.cursorHeight = 16;
            var cursorPosX = _gradX - this.cursorWidth * 0.5;
            var cursorPosY = this.cursorMinY;
            if (!this.cursorSVG) {
                this.cursorSVG = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(this.cursorSVG, "id", "CursorGroup");
            }
            else
                Utils.RemoveAllChildren(this.cursorSVG);
            diffAndSetAttribute(this.cursorSVG, "x", cursorPosX + '');
            diffAndSetAttribute(this.cursorSVG, "y", (cursorPosY - this.cursorHeight * 0.5) + '');
            diffAndSetAttribute(this.cursorSVG, "width", this.cursorWidth + '');
            diffAndSetAttribute(this.cursorSVG, "height", this.cursorHeight + '');
            diffAndSetAttribute(this.cursorSVG, "viewBox", "0 0 " + this.cursorWidth + " " + this.cursorHeight);
            {
                if (!this.cursorSVGShape)
                    this.cursorSVGShape = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.cursorSVGShape, "fill", "white");
                diffAndSetAttribute(this.cursorSVGShape, "d", "M10 0 l25 0 l-4 8 l5 8 l-25 0 l-5 -8 l5 -8 Z");
                diffAndSetAttribute(this.cursorSVGShape, "fill", "none");
                diffAndSetAttribute(this.cursorSVGShape, "stroke", "white");
                diffAndSetAttribute(this.cursorSVGShape, "stroke-width", "2");
                this.cursorSVG.appendChild(this.cursorSVGShape);
            }
            this.centerGroup.appendChild(this.cursorSVG);
            this.rootGroup.appendChild(this.centerGroup);
        }
        this.rootSVG.appendChild(this.rootGroup);
        this.appendChild(this.rootSVG);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "angle":
                let angle = parseFloat(newValue);
                angle = Math.min(Math.max(angle, 0), 16) / 16;
                if (this.cursorSVG) {
                    var posY = this.cursorMinY + (this.cursorMaxY - this.cursorMinY) * angle;
                    diffAndSetAttribute(this.cursorSVG, "y", (posY - this.cursorHeight * 0.5) + '');
                }
                var fixedAngle = fastToFixed(angle, 2);
                if (angle < 1.0) {
                    var radixPos = fixedAngle.indexOf('.');
                    diffAndSetText(this.bottomText, fixedAngle.slice(radixPos));
                }
                else {
                    diffAndSetText(this.bottomText, fixedAngle);
                }
                break;
        }
    }
}
customElements.define("jet-pfd-aoa-indicator", Jet_PFD_AOAIndicator);
//# sourceMappingURL=AOAIndicator.js.map