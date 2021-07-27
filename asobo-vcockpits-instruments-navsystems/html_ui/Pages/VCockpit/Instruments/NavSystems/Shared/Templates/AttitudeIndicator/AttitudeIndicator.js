class AttitudeIndicator extends HTMLElement {
    constructor() {
        super();
        this.bankSizeRatio = -24;
        this.backgroundVisible = true;
        this.flightDirectorActive = false;
        this.flightDirectorPitch = 0;
        this.flightDirectorBank = 0;
        this.aspectRatio = 1.0;
        this.isBackup = false;
        this.horizonTopColor = "#00569d";
        this.horizonBottomColor = "#48432e";
    }
    static get observedAttributes() {
        return [
            "pitch",
            "bank",
            "slip_skid",
            "background",
            "flight_director-active",
            "flight_director-pitch",
            "flight_director-bank",
            "bank_size_ratio",
            "aspect-ratio",
            "is-backup",
        ];
    }
    connectedCallback() {
        this.construct();
    }
    buildGraduations() {
        if (!this.attitude_pitch)
            return;
        this.attitude_pitch.innerHTML = "";
        let maxDash = 80;
        let fullPrecisionLowerLimit = -20;
        let fullPrecisionUpperLimit = 20;
        let halfPrecisionLowerLimit = -30;
        let halfPrecisionUpperLimit = 45;
        let unusualAttitudeLowerLimit = -30;
        let unusualAttitudeUpperLimit = 50;
        let bigWidth = 120;
        let bigHeight = 3;
        let mediumWidth = 60;
        let mediumHeight = 3;
        let smallWidth = 40;
        let smallHeight = 2;
        let fontSize = 20;
        let angle = -maxDash;
        let nextAngle;
        let width;
        let height;
        let text;
        while (angle <= maxDash) {
            if (angle % 10 == 0) {
                width = bigWidth;
                height = bigHeight;
                text = true;
                if (angle >= fullPrecisionLowerLimit && angle < fullPrecisionUpperLimit) {
                    nextAngle = angle + 2.5;
                }
                else if (angle >= halfPrecisionLowerLimit && angle < halfPrecisionUpperLimit) {
                    nextAngle = angle + 5;
                }
                else {
                    nextAngle = angle + 10;
                }
            }
            else {
                if (angle % 5 == 0) {
                    width = mediumWidth;
                    height = mediumHeight;
                    text = true;
                    if (angle >= fullPrecisionLowerLimit && angle < fullPrecisionUpperLimit) {
                        nextAngle = angle + 2.5;
                    }
                    else {
                        nextAngle = angle + 5;
                    }
                }
                else {
                    width = smallWidth;
                    height = smallHeight;
                    nextAngle = angle + 2.5;
                    text = false;
                }
            }
            if (angle != 0) {
                let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(rect, "fill", "white");
                diffAndSetAttribute(rect, "x", (-width / 2) + '');
                diffAndSetAttribute(rect, "y", (this.bankSizeRatio * angle - height / 2) + '');
                diffAndSetAttribute(rect, "width", width + '');
                diffAndSetAttribute(rect, "height", height + '');
                this.attitude_pitch.appendChild(rect);
                if (text) {
                    let leftText = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(leftText, Math.abs(angle) + '');
                    diffAndSetAttribute(leftText, "x", ((-width / 2) - 5) + '');
                    diffAndSetAttribute(leftText, "y", (this.bankSizeRatio * angle - height / 2 + fontSize / 2) + '');
                    diffAndSetAttribute(leftText, "text-anchor", "end");
                    diffAndSetAttribute(leftText, "font-size", fontSize + '');
                    diffAndSetAttribute(leftText, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(leftText, "fill", "white");
                    this.attitude_pitch.appendChild(leftText);
                    let rightText = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(rightText, Math.abs(angle) + '');
                    diffAndSetAttribute(rightText, "x", ((width / 2) + 5) + '');
                    diffAndSetAttribute(rightText, "y", (this.bankSizeRatio * angle - height / 2 + fontSize / 2) + '');
                    diffAndSetAttribute(rightText, "text-anchor", "start");
                    diffAndSetAttribute(rightText, "font-size", fontSize + '');
                    diffAndSetAttribute(rightText, "font-family", "Roboto-Bold");
                    diffAndSetAttribute(rightText, "fill", "white");
                    this.attitude_pitch.appendChild(rightText);
                }
                if (angle < unusualAttitudeLowerLimit) {
                    let chevron = document.createElementNS(Avionics.SVG.NS, "path");
                    let path = "M" + -smallWidth / 2 + " " + (this.bankSizeRatio * nextAngle - bigHeight / 2) + " l" + smallWidth + "  0 ";
                    path += "L" + bigWidth / 2 + " " + (this.bankSizeRatio * angle - bigHeight / 2) + " l" + -smallWidth + " 0 ";
                    path += "L0 " + (this.bankSizeRatio * nextAngle + 20) + " ";
                    path += "L" + (-bigWidth / 2 + smallWidth) + " " + (this.bankSizeRatio * angle - bigHeight / 2) + " l" + -smallWidth + " 0 Z";
                    diffAndSetAttribute(chevron, "d", path);
                    diffAndSetAttribute(chevron, "fill", "red");
                    this.attitude_pitch.appendChild(chevron);
                }
                if (angle >= unusualAttitudeUpperLimit && nextAngle <= maxDash) {
                    let chevron = document.createElementNS(Avionics.SVG.NS, "path");
                    let path = "M" + -smallWidth / 2 + " " + (this.bankSizeRatio * angle - bigHeight / 2) + " l" + smallWidth + "  0 ";
                    path += "L" + (bigWidth / 2) + " " + (this.bankSizeRatio * nextAngle + bigHeight / 2) + " l" + -smallWidth + " 0 ";
                    path += "L0 " + (this.bankSizeRatio * angle - 20) + " ";
                    path += "L" + (-bigWidth / 2 + smallWidth) + " " + (this.bankSizeRatio * nextAngle + bigHeight / 2) + " l" + -smallWidth + " 0 Z";
                    diffAndSetAttribute(chevron, "d", path);
                    diffAndSetAttribute(chevron, "fill", "red");
                    this.attitude_pitch.appendChild(chevron);
                }
            }
            angle = nextAngle;
        }
    }
    construct() {
        Utils.RemoveAllChildren(this);
        {
            this.horizon = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.horizon, "width", "100%");
            diffAndSetAttribute(this.horizon, "height", "100%");
            diffAndSetAttribute(this.horizon, "viewBox", "-200 -200 400 300");
            diffAndSetAttribute(this.horizon, "x", "-100");
            diffAndSetAttribute(this.horizon, "y", "-100");
            diffAndSetAttribute(this.horizon, "overflow", "visible");
            diffAndSetAttribute(this.horizon, "style", "position:absolute; z-index: -2; width: 100%; height:100%;");
            this.appendChild(this.horizon);
            this.horizonTop = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.horizonTop, "fill", (this.backgroundVisible) ? this.horizonTopColor : "transparent");
            diffAndSetAttribute(this.horizonTop, "x", "-1000");
            diffAndSetAttribute(this.horizonTop, "y", "-1000");
            diffAndSetAttribute(this.horizonTop, "width", "2000");
            diffAndSetAttribute(this.horizonTop, "height", "2000");
            this.horizon.appendChild(this.horizonTop);
            this.bottomPart = document.createElementNS(Avionics.SVG.NS, "g");
            this.horizon.appendChild(this.bottomPart);
            this.horizonBottom = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.horizonBottom, "fill", (this.backgroundVisible) ? this.horizonBottomColor : "transparent");
            diffAndSetAttribute(this.horizonBottom, "x", "-1500");
            diffAndSetAttribute(this.horizonBottom, "y", "0");
            diffAndSetAttribute(this.horizonBottom, "width", "3000");
            diffAndSetAttribute(this.horizonBottom, "height", "3000");
            this.bottomPart.appendChild(this.horizonBottom);
            let separator = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(separator, "fill", "#e0e0e0");
            diffAndSetAttribute(separator, "x", "-1500");
            diffAndSetAttribute(separator, "y", "-3");
            diffAndSetAttribute(separator, "width", "3000");
            diffAndSetAttribute(separator, "height", "6");
            this.bottomPart.appendChild(separator);
        }
        let attitudeContainer = document.createElement("div");
        diffAndSetAttribute(attitudeContainer, "id", "Attitude");
        attitudeContainer.style.width = "100%";
        attitudeContainer.style.height = "100%";
        attitudeContainer.style.position = "absolute";
        this.appendChild(attitudeContainer);
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "-200 -200 400 300");
        diffAndSetAttribute(this.root, "overflow", "visible");
        diffAndSetAttribute(this.root, "style", "position:absolute");
        attitudeContainer.appendChild(this.root);
        var refHeight = (this.isBackup) ? 330 : 230;
        let attitude_pitch_container = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(attitude_pitch_container, "width", "230");
        diffAndSetAttribute(attitude_pitch_container, "height", refHeight + '');
        diffAndSetAttribute(attitude_pitch_container, "x", "-115");
        diffAndSetAttribute(attitude_pitch_container, "y", "-130");
        diffAndSetAttribute(attitude_pitch_container, "viewBox", "-115 -130 230 " + refHeight + '');
        diffAndSetAttribute(attitude_pitch_container, "overflow", "hidden");
        this.root.appendChild(attitude_pitch_container);
        this.attitude_pitch = document.createElementNS(Avionics.SVG.NS, "g");
        attitude_pitch_container.appendChild(this.attitude_pitch);
        this.buildGraduations();
        this.flightDirector = document.createElementNS(Avionics.SVG.NS, "g");
        attitude_pitch_container.appendChild(this.flightDirector);
        let triangleOuterLeft = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(triangleOuterLeft, "d", "M-140 30 l50 0 L0 0 Z");
        diffAndSetAttribute(triangleOuterLeft, "fill", "#d12bc7");
        this.flightDirector.appendChild(triangleOuterLeft);
        let triangleOuterRight = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(triangleOuterRight, "d", "M140 30 l-50 0 L0 0 Z");
        diffAndSetAttribute(triangleOuterRight, "fill", "#d12bc7");
        this.flightDirector.appendChild(triangleOuterRight);
        {
            this.attitude_bank = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(this.attitude_bank);
            let topTriangle = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(topTriangle, "d", "M0 -170 l-20 -30 l40 0 Z");
            diffAndSetAttribute(topTriangle, "fill", "white");
            this.attitude_bank.appendChild(topTriangle);
            let bigDashes = [-60, -30, 30, 60];
            let smallDashes = [-45, -20, -10, 10, 20, 45];
            let radius = 170;
            let width = 4;
            let height = 30;
            for (let i = 0; i < bigDashes.length; i++) {
                let dash = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(dash, "x", (-width / 2) + '');
                diffAndSetAttribute(dash, "y", (-radius - height) + '');
                diffAndSetAttribute(dash, "height", height + '');
                diffAndSetAttribute(dash, "width", width + '');
                diffAndSetAttribute(dash, "fill", "white");
                diffAndSetAttribute(dash, "transform", "rotate(" + bigDashes[i] + ",0,0)");
                this.attitude_bank.appendChild(dash);
            }
            width = 4;
            height = 20;
            for (let i = 0; i < smallDashes.length; i++) {
                let dash = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(dash, "x", (-width / 2) + '');
                diffAndSetAttribute(dash, "y", (-radius - height) + '');
                diffAndSetAttribute(dash, "height", height + '');
                diffAndSetAttribute(dash, "width", width + '');
                diffAndSetAttribute(dash, "fill", "white");
                diffAndSetAttribute(dash, "transform", "rotate(" + smallDashes[i] + ",0,0)");
                this.attitude_bank.appendChild(dash);
            }
        }
        {
            let cursors = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(cursors);
            let leftLower = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(leftLower, "d", "M-190 0 l-10 12 l50 0 l10 -12 Z");
            diffAndSetAttribute(leftLower, "fill", "#cccc00");
            cursors.appendChild(leftLower);
            let leftUpper = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(leftUpper, "d", "M-190 0 l-10 -12 l50 0 l10 12 Z");
            diffAndSetAttribute(leftUpper, "fill", "#ffff00");
            cursors.appendChild(leftUpper);
            let rightLower = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(rightLower, "d", "M190 0 l10 12 l-50 0 l-10 -12 Z");
            diffAndSetAttribute(rightLower, "fill", "#cccc00");
            cursors.appendChild(rightLower);
            let rightUpper = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(rightUpper, "d", "M190 0 l10 -12 l-50 0 l-10 12 Z");
            diffAndSetAttribute(rightUpper, "fill", "#ffff00");
            cursors.appendChild(rightUpper);
            let triangleInnerLeft = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(triangleInnerLeft, "d", "M-90 30 l30 0 L0 0 Z");
            diffAndSetAttribute(triangleInnerLeft, "fill", "#ffff00");
            cursors.appendChild(triangleInnerLeft);
            let triangleInnerRight = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(triangleInnerRight, "d", "M90 30 l-30 0 L0 0 Z");
            diffAndSetAttribute(triangleInnerRight, "fill", "#ffff00");
            cursors.appendChild(triangleInnerRight);
            let topTriangle = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(topTriangle, "d", "M0 -170 l-13 20 l26 0 Z");
            diffAndSetAttribute(topTriangle, "fill", "white");
            this.root.appendChild(topTriangle);
            this.slipSkid = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(this.slipSkid, "d", "M-20 -140 L-16 -146 L16 -146 L20 -140 Z");
            diffAndSetAttribute(this.slipSkid, "fill", "white");
            this.root.appendChild(this.slipSkid);
        }
        this.applyAttributes();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "is-backup":
                this.isBackup = newValue == "true";
                break;
            case "aspect-ratio":
                this.aspectRatio = parseFloat(newValue);
                this.construct();
                break;
            case "pitch":
                this.pitch = parseFloat(newValue);
                break;
            case "bank":
                this.bank = parseFloat(newValue);
                break;
            case "slip_skid":
                this.slipSkidValue = parseFloat(newValue);
                break;
            case "background":
                if (newValue == "false")
                    this.backgroundVisible = false;
                else
                    this.backgroundVisible = true;
                break;
            case "flight_director-active":
                this.flightDirectorActive = newValue == "true";
                break;
            case "flight_director-pitch":
                this.flightDirectorPitch = parseFloat(newValue);
                break;
            case "flight_director-bank":
                this.flightDirectorBank = parseFloat(newValue);
                break;
            case "bank_size_ratio":
                this.bankSizeRatio = parseFloat(newValue);
                this.buildGraduations();
                break;
            default:
                return;
        }
        this.applyAttributes();
    }
    applyAttributes() {
        if (this.bottomPart)
            diffAndSetAttribute(this.bottomPart, "transform", "rotate(" + this.bank + ", 0, 0) translate(0," + (this.pitch * this.bankSizeRatio) + ")");
        if (this.attitude_pitch)
            diffAndSetAttribute(this.attitude_pitch, "transform", "rotate(" + this.bank + ", 0, 0) translate(0," + (this.pitch * this.bankSizeRatio) + ")");
        if (this.attitude_bank)
            diffAndSetAttribute(this.attitude_bank, "transform", "rotate(" + this.bank + ", 0, 0)");
        if (this.slipSkid)
            diffAndSetAttribute(this.slipSkid, "transform", "translate(" + (this.slipSkidValue * 40) + ", 0)");
        if (this.horizonTop) {
            if (this.backgroundVisible) {
                diffAndSetAttribute(this.horizonTop, "fill", this.horizonTopColor);
                diffAndSetAttribute(this.horizonBottom, "fill", this.horizonBottomColor);
            }
            else {
                diffAndSetAttribute(this.horizonTop, "fill", "transparent");
                diffAndSetAttribute(this.horizonBottom, "fill", "transparent");
            }
        }
        if (this.flightDirector) {
            if (this.flightDirectorActive) {
                diffAndSetAttribute(this.flightDirector, "transform", "rotate(" + (this.bank - this.flightDirectorBank) + ") translate(0 " + ((this.pitch - this.flightDirectorPitch) * this.bankSizeRatio) + ")");
                diffAndSetAttribute(this.flightDirector, "display", "");
            }
            else {
                diffAndSetAttribute(this.flightDirector, "display", "none");
            }
        }
    }
}
customElements.define('glasscockpit-attitude-indicator', AttitudeIndicator);
//# sourceMappingURL=AttitudeIndicator.js.map