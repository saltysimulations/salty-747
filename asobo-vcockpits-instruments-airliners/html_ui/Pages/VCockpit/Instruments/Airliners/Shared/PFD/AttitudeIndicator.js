class Jet_PFD_AttitudeIndicator extends HTMLElement {
    constructor() {
        super();
        this.attitude_pitch_grads = [];
        this.radioAltitudeColorOk = "white";
        this.radioAltitudeColorBad = "white";
        this.radioAltitudeColorLimit = 0;
        this.radioAltitudeRotate = false;
        this.radioAltitudeValue = 0;
        this.radioRefreshTimer = 0.0;
        this.cj4_FlightDirectorActive = true;
        this.cj4_FlightDirectorPitch = 0;
        this.cj4_FlightDirectorBank = 0;
        this.horizonAngleFactor = 1.0;
        this.pitchAngleFactor = 1.0;
        this.horizonTopColor = "";
        this.horizonBottomColor = "";
        this.horizonVisible = true;
        this.isHud = false;
        this._aircraft = Aircraft.A320_NEO;
    }
    static get dynamicAttributes() {
        return [
            "pitch",
            "bank",
            "slip_skid",
            "flight_director-active",
            "flight_director-pitch",
            "flight_director-bank",
            "radio_altitude",
            "decision_height"
        ];
    }
    static get observedAttributes() {
        return this.dynamicAttributes.concat([
            "background",
            "hud"
        ]);
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
    showFPV(_active) {
    }
    destroyLayout() {
        Utils.RemoveAllChildren(this);
        for (let i = 0; i < Jet_PFD_AttitudeIndicator.dynamicAttributes.length; i++) {
            this.removeAttribute(Jet_PFD_AttitudeIndicator.dynamicAttributes[i]);
        }
        this.horizonAngleFactor = 1.0;
        this.pitchAngleFactor = 1.0;
        this.radioAltitudeRotate = false;
        this.radioAltitudeColorLimit = 0;
        this.attitude_pitch_grads = [];
        this.hiddenElementsWithBackground = [];
    }
    construct() {
        this.destroyLayout();
        if (this.aircraft == Aircraft.CJ4)
            this.construct_CJ4();
        else if (this.aircraft == Aircraft.B747_8)
            this.construct_B747_8();
        else if (this.aircraft == Aircraft.AS01B)
            this.construct_AS01B();
        else if (this.aircraft == Aircraft.AS03D)
            this.construct_AS03D();
        else
            this.construct_A320_Neo();
    }
    construct_A320_Neo() {
        let pitchFactor = -7;
        this.pitchAngleFactor = pitchFactor;
        this.horizonAngleFactor = pitchFactor;
        {
            this.horizon_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.horizon_root, "id", "Background");
            diffAndSetAttribute(this.horizon_root, "width", "100%");
            diffAndSetAttribute(this.horizon_root, "height", "100%");
            diffAndSetAttribute(this.horizon_root, "viewBox", "-200 -200 400 300");
            diffAndSetAttribute(this.horizon_root, "x", "-100");
            diffAndSetAttribute(this.horizon_root, "y", "-100");
            diffAndSetAttribute(this.horizon_root, "overflow", "visible");
            diffAndSetAttribute(this.horizon_root, "style", "position:absolute; z-index: -3; width: 100%; height:100%;");
            this.appendChild(this.horizon_root);
            this.horizonTopColor = "#5384EC";
            this.horizonBottomColor = "#612C27";
            this.horizon_top_bg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.horizon_top_bg, "fill", (this.horizonVisible) ? this.horizonTopColor : "transparent");
            diffAndSetAttribute(this.horizon_top_bg, "x", "-1000");
            diffAndSetAttribute(this.horizon_top_bg, "y", "-1000");
            diffAndSetAttribute(this.horizon_top_bg, "width", "2000");
            diffAndSetAttribute(this.horizon_top_bg, "height", "2000");
            this.horizon_root.appendChild(this.horizon_top_bg);
            this.horizon_bottom = document.createElementNS(Avionics.SVG.NS, "g");
            this.horizon_root.appendChild(this.horizon_bottom);
            {
                this.horizon_bottom_bg = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(this.horizon_bottom_bg, "fill", (this.horizonVisible) ? this.horizonBottomColor : "transparent");
                diffAndSetAttribute(this.horizon_bottom_bg, "x", "-1500");
                diffAndSetAttribute(this.horizon_bottom_bg, "y", "0");
                diffAndSetAttribute(this.horizon_bottom_bg, "width", "3000");
                diffAndSetAttribute(this.horizon_bottom_bg, "height", "3000");
                this.horizon_bottom.appendChild(this.horizon_bottom_bg);
                let separator = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(separator, "fill", "white");
                diffAndSetAttribute(separator, "x", "-1500");
                diffAndSetAttribute(separator, "y", "-3");
                diffAndSetAttribute(separator, "width", "3000");
                diffAndSetAttribute(separator, "height", "6");
                this.horizon_bottom.appendChild(separator);
            }
        }
        {
            let pitchContainer = document.createElement("div");
            diffAndSetAttribute(pitchContainer, "id", "Pitch");
            pitchContainer.style.top = "-13%";
            pitchContainer.style.left = "-10%";
            pitchContainer.style.width = "120%";
            pitchContainer.style.height = "120%";
            pitchContainer.style.position = "absolute";
            this.appendChild(pitchContainer);
            this.attitude_pitch_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.attitude_pitch_root, "width", "100%");
            diffAndSetAttribute(this.attitude_pitch_root, "height", "100%");
            diffAndSetAttribute(this.attitude_pitch_root, "viewBox", "-200 -200 400 300");
            diffAndSetAttribute(this.attitude_pitch_root, "overflow", "visible");
            diffAndSetAttribute(this.attitude_pitch_root, "style", "position:absolute; z-index: -2;");
            pitchContainer.appendChild(this.attitude_pitch_root);
            {
                this.attitude_pitch = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_pitch_root.appendChild(this.attitude_pitch);
                let borders = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(borders, "x", "-200");
                diffAndSetAttribute(borders, "y", "-125");
                diffAndSetAttribute(borders, "width", "400");
                diffAndSetAttribute(borders, "height", "255");
                diffAndSetAttribute(borders, "fill", "transparent");
                diffAndSetAttribute(borders, "stroke", "white");
                diffAndSetAttribute(borders, "stroke-width", "3");
                diffAndSetAttribute(borders, "stroke-opacity", "1");
                this.attitude_pitch.appendChild(borders);
                var x = -115;
                var y = -122;
                var w = 230;
                var h = 235;
                let pitchGraduations = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(pitchGraduations, "width", w + '');
                diffAndSetAttribute(pitchGraduations, "height", h + '');
                diffAndSetAttribute(pitchGraduations, "x", x + '');
                diffAndSetAttribute(pitchGraduations, "y", y + '');
                diffAndSetAttribute(pitchGraduations, "viewBox", x + " " + y + " " + w + " " + h);
                diffAndSetAttribute(pitchGraduations, "overflow", "hidden");
                this.attitude_pitch.appendChild(pitchGraduations);
                this.attitude_pitch_grads.push(document.createElementNS(Avionics.SVG.NS, "g"));
                pitchGraduations.appendChild(this.attitude_pitch_grads[0]);
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
                            text = false;
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
                        diffAndSetAttribute(rect, "y", (pitchFactor * angle - height / 2) + '');
                        diffAndSetAttribute(rect, "width", width + '');
                        diffAndSetAttribute(rect, "height", height + '');
                        this.attitude_pitch_grads[0].appendChild(rect);
                        if (text) {
                            let leftText = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetText(leftText, Math.abs(angle) + '');
                            diffAndSetAttribute(leftText, "x", ((-width / 2) - 5) + '');
                            diffAndSetAttribute(leftText, "y", (pitchFactor * angle - height / 2 + fontSize / 2) + '');
                            diffAndSetAttribute(leftText, "text-anchor", "end");
                            diffAndSetAttribute(leftText, "font-size", fontSize + '');
                            diffAndSetAttribute(leftText, "font-family", "Roboto-Light");
                            diffAndSetAttribute(leftText, "fill", "white");
                            this.attitude_pitch_grads[0].appendChild(leftText);
                            let rightText = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetText(rightText, Math.abs(angle) + '');
                            diffAndSetAttribute(rightText, "x", ((width / 2) + 5) + '');
                            diffAndSetAttribute(rightText, "y", (pitchFactor * angle - height / 2 + fontSize / 2) + '');
                            diffAndSetAttribute(rightText, "text-anchor", "start");
                            diffAndSetAttribute(rightText, "font-size", fontSize + '');
                            diffAndSetAttribute(rightText, "font-family", "Roboto-Light");
                            diffAndSetAttribute(rightText, "fill", "white");
                            this.attitude_pitch_grads[0].appendChild(rightText);
                        }
                        if (angle < unusualAttitudeLowerLimit) {
                            let chevron = document.createElementNS(Avionics.SVG.NS, "path");
                            let path = "M" + -smallWidth / 2 + " " + (pitchFactor * nextAngle - bigHeight / 2) + " l" + smallWidth + "  0 ";
                            path += "L" + bigWidth / 2 + " " + (pitchFactor * angle - bigHeight / 2) + " l" + -smallWidth + " 0 ";
                            path += "L0 " + (pitchFactor * nextAngle + 20) + " ";
                            path += "L" + (-bigWidth / 2 + smallWidth) + " " + (pitchFactor * angle - bigHeight / 2) + " l" + -smallWidth + " 0 Z";
                            diffAndSetAttribute(chevron, "d", path);
                            diffAndSetAttribute(chevron, "fill", "red");
                            this.attitude_pitch_grads[0].appendChild(chevron);
                        }
                        if (angle >= unusualAttitudeUpperLimit && nextAngle <= maxDash) {
                            let chevron = document.createElementNS(Avionics.SVG.NS, "path");
                            let path = "M" + -smallWidth / 2 + " " + (pitchFactor * angle - bigHeight / 2) + " l" + smallWidth + "  0 ";
                            path += "L" + (bigWidth / 2) + " " + (pitchFactor * nextAngle + bigHeight / 2) + " l" + -smallWidth + " 0 ";
                            path += "L0 " + (pitchFactor * angle - 20) + " ";
                            path += "L" + (-bigWidth / 2 + smallWidth) + " " + (pitchFactor * nextAngle + bigHeight / 2) + " l" + -smallWidth + " 0 Z";
                            diffAndSetAttribute(chevron, "d", path);
                            diffAndSetAttribute(chevron, "fill", "red");
                            this.attitude_pitch_grads[0].appendChild(chevron);
                        }
                    }
                    angle = nextAngle;
                }
            }
        }
        {
            this.masks = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.masks, "id", "Masks");
            diffAndSetAttribute(this.masks, "viewBox", "0 0 500 500");
            diffAndSetAttribute(this.masks, "overflow", "visible");
            diffAndSetAttribute(this.masks, "style", "position:absolute; z-index: -1; top:-58%; left: -68.3%; width: 250%; height:250%;");
            this.appendChild(this.masks);
            {
                let topMask = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(topMask, "d", "M 0 0 L 0 250 L 123 250 L 123 190 C 123 190, 143 120, 233 120 C 233 120, 323 120, 343 190 L 343 250 L 500 250 L 500 0 Z");
                diffAndSetAttribute(topMask, "fill", "black");
                this.masks.appendChild(topMask);
                let bottomMask = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(bottomMask, "d", "M 0 500 L 0 250 L 123 250 L 123 310 C 123 310, 143 380, 233 380 C 233 380, 323 380, 343 310 L 343 250 L 500 250 L 500 500 Z");
                diffAndSetAttribute(bottomMask, "fill", "black");
                this.masks.appendChild(bottomMask);
            }
        }
        {
            let attitudeContainer = document.createElement("div");
            diffAndSetAttribute(attitudeContainer, "id", "Attitude");
            attitudeContainer.style.top = "-12%";
            attitudeContainer.style.left = "-10%";
            attitudeContainer.style.width = "120%";
            attitudeContainer.style.height = "120%";
            attitudeContainer.style.position = "absolute";
            this.appendChild(attitudeContainer);
            this.attitude_bank_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.attitude_bank_root, "width", "100%");
            diffAndSetAttribute(this.attitude_bank_root, "height", "100%");
            diffAndSetAttribute(this.attitude_bank_root, "viewBox", "-200 -200 400 300");
            diffAndSetAttribute(this.attitude_bank_root, "overflow", "visible");
            diffAndSetAttribute(this.attitude_bank_root, "style", "position:absolute; z-index: 0");
            attitudeContainer.appendChild(this.attitude_bank_root);
            {
                this.attitude_bank = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_bank_root.appendChild(this.attitude_bank);
                let topTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(topTriangle, "d", "M0 -180 l-10 -18 l20 0 Z");
                diffAndSetAttribute(topTriangle, "fill", "transparent");
                diffAndSetAttribute(topTriangle, "stroke", "yellow");
                diffAndSetAttribute(topTriangle, "stroke-width", "3");
                diffAndSetAttribute(topTriangle, "stroke-opacity", "1");
                this.attitude_bank.appendChild(topTriangle);
                let smallDashesAngle = [-45, -30, -20, -10, 10, 20, 30, 45];
                let smallDashesWidth = [1, 6, 6, 6, 6, 6, 6, 1];
                let smallDashesHeight = [13, 13, 8, 8, 8, 8, 13, 13];
                let radius = 180;
                for (let i = 0; i < smallDashesAngle.length; i++) {
                    let dash = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(dash, "x", (-smallDashesWidth[i] / 2) + '');
                    diffAndSetAttribute(dash, "y", (-radius - smallDashesHeight[i]) + '');
                    diffAndSetAttribute(dash, "height", smallDashesHeight[i] + '');
                    diffAndSetAttribute(dash, "width", smallDashesWidth[i] + '');
                    diffAndSetAttribute(dash, "stroke", "white");
                    diffAndSetAttribute(dash, "stroke-width", "3");
                    diffAndSetAttribute(dash, "transform", "rotate(" + smallDashesAngle[i] + ",0,0)");
                    this.attitude_bank.appendChild(dash);
                }
            }
            {
                let cursors = document.createElementNS(Avionics.SVG.NS, "g");
                {
                    let leftUpper = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(leftUpper, "d", "M-135 1 l0 -6 l55 0 l0 28 l-5 0 l0 -22 l-40 0 Z");
                    diffAndSetAttribute(leftUpper, "fill", "black");
                    diffAndSetAttribute(leftUpper, "stroke", "yellow");
                    diffAndSetAttribute(leftUpper, "stroke-width", "1");
                    diffAndSetAttribute(leftUpper, "stroke-opacity", "1.0");
                    cursors.appendChild(leftUpper);
                    let rightUpper = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(rightUpper, "d", "M135 1 l0 -6 l-55 0 l0 28 l5 0 l0 -22 l40 0 Z");
                    diffAndSetAttribute(rightUpper, "fill", "black");
                    diffAndSetAttribute(rightUpper, "stroke", "yellow");
                    diffAndSetAttribute(rightUpper, "stroke-width", "1");
                    diffAndSetAttribute(rightUpper, "stroke-opacity", "1.0");
                    cursors.appendChild(rightUpper);
                    let centerRect = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(centerRect, "x", "-4");
                    diffAndSetAttribute(centerRect, "y", "-7");
                    diffAndSetAttribute(centerRect, "height", "8");
                    diffAndSetAttribute(centerRect, "width", "8");
                    diffAndSetAttribute(centerRect, "stroke", "white");
                    diffAndSetAttribute(centerRect, "stroke-width", "3");
                    cursors.appendChild(centerRect);
                }
                this.attitude_bank_root.appendChild(cursors);
                this.slipSkidTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.slipSkidTriangle, "d", "M0 -170 l-13 20 l26 0 Z");
                diffAndSetAttribute(this.slipSkidTriangle, "fill", "white");
                this.attitude_bank_root.appendChild(this.slipSkidTriangle);
                this.slipSkid = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.slipSkid, "d", "M-20 -140 L-16 -146 L16 -146 L20 -140 Z");
                diffAndSetAttribute(this.slipSkid, "fill", "white");
                this.attitude_bank_root.appendChild(this.slipSkid);
            }
            {
                this.radioAltitudeGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.radioAltitudeGroup, "id", "RadioAltitude");
                this.attitude_bank_root.appendChild(this.radioAltitudeGroup);
                this.radioAltitudeColorOk = "rgb(36,255,0)";
                this.radioAltitudeColorBad = "orange";
                this.radioAltitudeColorLimit = 400;
                this.radioAltitudeRotate = true;
                this.radioAltitude = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.radioAltitude, "");
                diffAndSetAttribute(this.radioAltitude, "x", "0");
                diffAndSetAttribute(this.radioAltitude, "y", "165");
                diffAndSetAttribute(this.radioAltitude, "text-anchor", "middle");
                diffAndSetAttribute(this.radioAltitude, "font-size", "30");
                diffAndSetAttribute(this.radioAltitude, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.radioAltitude, "fill", "white");
                this.radioAltitudeGroup.appendChild(this.radioAltitude);
            }
        }
        this.flightDirector = new Jet_PFD_FlightDirector.A320_Neo_Handler();
        this.flightDirector.init(this.attitude_bank_root);
        this.applyAttributes();
    }
    construct_B747_8() {
        let pitchFactor = -6.5;
        this.pitchAngleFactor = pitchFactor;
        this.horizonAngleFactor = pitchFactor;
        {
            this.horizon_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.horizon_root, "id", "Background");
            diffAndSetAttribute(this.horizon_root, "width", "100%");
            diffAndSetAttribute(this.horizon_root, "height", "100%");
            diffAndSetAttribute(this.horizon_root, "viewBox", "-200 -200 400 300");
            diffAndSetAttribute(this.horizon_root, "x", "-100");
            diffAndSetAttribute(this.horizon_root, "y", "-100");
            diffAndSetAttribute(this.horizon_root, "overflow", "visible");
            diffAndSetAttribute(this.horizon_root, "style", "position:absolute; z-index: -3; width: 100%; height:100%;");
            this.appendChild(this.horizon_root);
            this.horizonTopColor = "#135B82";
            this.horizonBottomColor = "#726B31";
            this.horizon_top_bg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.horizon_top_bg, "fill", (this.horizonVisible) ? this.horizonTopColor : "transparent");
            diffAndSetAttribute(this.horizon_top_bg, "x", "-1000");
            diffAndSetAttribute(this.horizon_top_bg, "y", "-1000");
            diffAndSetAttribute(this.horizon_top_bg, "width", "2000");
            diffAndSetAttribute(this.horizon_top_bg, "height", "2000");
            this.horizon_root.appendChild(this.horizon_top_bg);
            this.horizon_bottom = document.createElementNS(Avionics.SVG.NS, "g");
            this.horizon_root.appendChild(this.horizon_bottom);
            {
                this.horizon_bottom_bg = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(this.horizon_bottom_bg, "fill", (this.horizonVisible) ? this.horizonBottomColor : "transparent");
                diffAndSetAttribute(this.horizon_bottom_bg, "x", "-1500");
                diffAndSetAttribute(this.horizon_bottom_bg, "y", "0");
                diffAndSetAttribute(this.horizon_bottom_bg, "width", "3000");
                diffAndSetAttribute(this.horizon_bottom_bg, "height", "3000");
                this.horizon_bottom.appendChild(this.horizon_bottom_bg);
                let separator = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(separator, "fill", "white");
                diffAndSetAttribute(separator, "x", "-1500");
                diffAndSetAttribute(separator, "y", "-3");
                diffAndSetAttribute(separator, "width", "3000");
                diffAndSetAttribute(separator, "height", "6");
                this.horizon_bottom.appendChild(separator);
            }
        }
        {
            let pitchContainer = document.createElement("div");
            diffAndSetAttribute(pitchContainer, "id", "Pitch");
            pitchContainer.style.top = "-14%";
            pitchContainer.style.left = "-10%";
            pitchContainer.style.width = "120%";
            pitchContainer.style.height = "120%";
            pitchContainer.style.position = "absolute";
            this.appendChild(pitchContainer);
            this.attitude_pitch_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.attitude_pitch_root, "width", "100%");
            diffAndSetAttribute(this.attitude_pitch_root, "height", "100%");
            diffAndSetAttribute(this.attitude_pitch_root, "viewBox", "-200 -200 400 300");
            diffAndSetAttribute(this.attitude_pitch_root, "overflow", "visible");
            diffAndSetAttribute(this.attitude_pitch_root, "style", "position:absolute; z-index: -2;");
            pitchContainer.appendChild(this.attitude_pitch_root);
            {
                this.attitude_pitch = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_pitch_root.appendChild(this.attitude_pitch);
                var x = -115;
                var y = -120;
                var w = 230;
                var h = 265;
                let pitchGraduations = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(pitchGraduations, "width", w + '');
                diffAndSetAttribute(pitchGraduations, "height", h + '');
                diffAndSetAttribute(pitchGraduations, "x", x + '');
                diffAndSetAttribute(pitchGraduations, "y", y + '');
                diffAndSetAttribute(pitchGraduations, "viewBox", x + " " + y + " " + w + " " + h);
                diffAndSetAttribute(pitchGraduations, "overflow", "hidden");
                this.attitude_pitch.appendChild(pitchGraduations);
                this.attitude_pitch_grads.push(document.createElementNS(Avionics.SVG.NS, "g"));
                pitchGraduations.appendChild(this.attitude_pitch_grads[0]);
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
                            text = false;
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
                        diffAndSetAttribute(rect, "y", (pitchFactor * angle - height / 2) + '');
                        diffAndSetAttribute(rect, "width", width + '');
                        diffAndSetAttribute(rect, "height", height + '');
                        this.attitude_pitch_grads[0].appendChild(rect);
                        if (text) {
                            let leftText = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetText(leftText, Math.abs(angle) + '');
                            diffAndSetAttribute(leftText, "x", ((-width / 2) - 5) + '');
                            diffAndSetAttribute(leftText, "y", (pitchFactor * angle - height / 2 + fontSize / 2) + '');
                            diffAndSetAttribute(leftText, "text-anchor", "end");
                            diffAndSetAttribute(leftText, "font-size", fontSize + '');
                            diffAndSetAttribute(leftText, "font-family", "Roboto-Light");
                            diffAndSetAttribute(leftText, "fill", "white");
                            this.attitude_pitch_grads[0].appendChild(leftText);
                            let rightText = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetText(rightText, Math.abs(angle) + '');
                            diffAndSetAttribute(rightText, "x", ((width / 2) + 5) + '');
                            diffAndSetAttribute(rightText, "y", (pitchFactor * angle - height / 2 + fontSize / 2) + '');
                            diffAndSetAttribute(rightText, "text-anchor", "start");
                            diffAndSetAttribute(rightText, "font-size", fontSize + '');
                            diffAndSetAttribute(rightText, "font-family", "Roboto-Light");
                            diffAndSetAttribute(rightText, "fill", "white");
                            this.attitude_pitch_grads[0].appendChild(rightText);
                        }
                        if (angle < unusualAttitudeLowerLimit) {
                            let chevron = document.createElementNS(Avionics.SVG.NS, "path");
                            let path = "M" + -smallWidth / 2 + " " + (pitchFactor * nextAngle - bigHeight / 2) + " l" + smallWidth + "  0 ";
                            path += "L" + bigWidth / 2 + " " + (pitchFactor * angle - bigHeight / 2) + " l" + -smallWidth + " 0 ";
                            path += "L0 " + (pitchFactor * nextAngle + 20) + " ";
                            path += "L" + (-bigWidth / 2 + smallWidth) + " " + (pitchFactor * angle - bigHeight / 2) + " l" + -smallWidth + " 0 Z";
                            diffAndSetAttribute(chevron, "d", path);
                            diffAndSetAttribute(chevron, "fill", "red");
                            this.attitude_pitch_grads[0].appendChild(chevron);
                        }
                        if (angle >= unusualAttitudeUpperLimit && nextAngle <= maxDash) {
                            let chevron = document.createElementNS(Avionics.SVG.NS, "path");
                            let path = "M" + -smallWidth / 2 + " " + (pitchFactor * angle - bigHeight / 2) + " l" + smallWidth + "  0 ";
                            path += "L" + (bigWidth / 2) + " " + (pitchFactor * nextAngle + bigHeight / 2) + " l" + -smallWidth + " 0 ";
                            path += "L0 " + (pitchFactor * angle - 20) + " ";
                            path += "L" + (-bigWidth / 2 + smallWidth) + " " + (pitchFactor * nextAngle + bigHeight / 2) + " l" + -smallWidth + " 0 Z";
                            diffAndSetAttribute(chevron, "d", path);
                            diffAndSetAttribute(chevron, "fill", "red");
                            this.attitude_pitch_grads[0].appendChild(chevron);
                        }
                    }
                    angle = nextAngle;
                }
            }
        }
        {
            this.masks = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.masks, "id", "Masks");
            diffAndSetAttribute(this.masks, "viewBox", "0 0 500 500");
            diffAndSetAttribute(this.masks, "overflow", "visible");
            diffAndSetAttribute(this.masks, "style", "position:absolute; z-index: -1; top:-61%; left: -68.9%; width: 250%; height:250%;");
            this.appendChild(this.masks);
            {
                let topMask = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(topMask, "d", "M 0 0 L 0 250 L 123 250 L 123 142 C 123 142, 125 122, 143 122 L 233 122 L 315 122 C 315 122, 343 122, 345 142 L 345 250 L 500 250 L 500 0 Z");
                diffAndSetAttribute(topMask, "fill", "black");
                diffAndSetAttribute(topMask, "stroke", "none");
                this.masks.appendChild(topMask);
                let bottomMask = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(bottomMask, "d", "M 0 500 L 0 250 L 123 250 L 123 358 C 123 358, 125 378, 143 378 L 233 378 L 315 378 C 315 378, 343 378, 345 358 L 345 250 L 500 250 L 500 500 Z");
                diffAndSetAttribute(bottomMask, "fill", "black");
                diffAndSetAttribute(bottomMask, "stroke", "none");
                this.masks.appendChild(bottomMask);
            }
        }
        {
            let attitudeContainer = document.createElement("div");
            diffAndSetAttribute(attitudeContainer, "id", "Attitude");
            attitudeContainer.style.top = "-14%";
            attitudeContainer.style.left = "-10%";
            attitudeContainer.style.width = "120%";
            attitudeContainer.style.height = "120%";
            attitudeContainer.style.position = "absolute";
            this.appendChild(attitudeContainer);
            this.attitude_bank_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.attitude_bank_root, "width", "100%");
            diffAndSetAttribute(this.attitude_bank_root, "height", "100%");
            diffAndSetAttribute(this.attitude_bank_root, "viewBox", "-200 -200 400 300");
            diffAndSetAttribute(this.attitude_bank_root, "overflow", "visible");
            diffAndSetAttribute(this.attitude_bank_root, "style", "position:absolute; z-index: 0");
            attitudeContainer.appendChild(this.attitude_bank_root);
            {
                this.attitude_bank = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_bank_root.appendChild(this.attitude_bank);
                let topTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(topTriangle, "d", "M0 -152 l-8 -12 l16 0 Z");
                diffAndSetAttribute(topTriangle, "fill", "white");
                this.attitude_bank.appendChild(topTriangle);
                let smallDashesAngle = [-60, -45, -30, -20, -10, 10, 20, 30, 45, 60];
                let smallDashesHeight = [22, 13, 26, 13, 13, 13, 13, 26, 13, 22];
                let radius = 133;
                let offsetY = 22;
                for (let i = 0; i < smallDashesAngle.length; i++) {
                    let correction = Math.abs(smallDashesAngle[i] / 3.5);
                    let dash = document.createElementNS(Avionics.SVG.NS, "line");
                    diffAndSetAttribute(dash, "x1", "0");
                    diffAndSetAttribute(dash, "y1", (-radius - offsetY + correction) + '');
                    diffAndSetAttribute(dash, "x2", "0");
                    diffAndSetAttribute(dash, "y2", (-radius - smallDashesHeight[i] - offsetY + correction) + '');
                    diffAndSetAttribute(dash, "stroke", "white");
                    diffAndSetAttribute(dash, "stroke-width", "3");
                    diffAndSetAttribute(dash, "transform", "rotate(" + smallDashesAngle[i] + " 0 0)");
                    this.attitude_bank.appendChild(dash);
                }
            }
            {
                let cursors = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_bank_root.appendChild(cursors);
                let leftUpper = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(leftUpper, "d", "M-110 4.5 l0 -6 l55 0 l0 28 l-5 0 l0 -22 l-40 0 Z");
                diffAndSetAttribute(leftUpper, "fill", "black");
                diffAndSetAttribute(leftUpper, "stroke", "white");
                diffAndSetAttribute(leftUpper, "stroke-width", "1");
                diffAndSetAttribute(leftUpper, "stroke-opacity", "1.0");
                cursors.appendChild(leftUpper);
                let rightUpper = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(rightUpper, "d", "M110 4.5 l0 -6 l-55 0 l0 28 l5 0 l0 -22 l40 0 Z");
                diffAndSetAttribute(rightUpper, "fill", "black");
                diffAndSetAttribute(rightUpper, "stroke", "white");
                diffAndSetAttribute(rightUpper, "stroke-width", "1");
                diffAndSetAttribute(rightUpper, "stroke-opacity", "1.0");
                cursors.appendChild(rightUpper);
                let centerRect = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(centerRect, "x", "-4");
                diffAndSetAttribute(centerRect, "y", "-2.5");
                diffAndSetAttribute(centerRect, "height", "8");
                diffAndSetAttribute(centerRect, "width", "8");
                diffAndSetAttribute(centerRect, "stroke", "white");
                diffAndSetAttribute(centerRect, "stroke-width", "3");
                cursors.appendChild(centerRect);
                this.slipSkidTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.slipSkidTriangle, "d", "M0 -149 l-13 18 l26 0 Z");
                diffAndSetAttribute(this.slipSkidTriangle, "fill", "transparent");
                diffAndSetAttribute(this.slipSkidTriangle, "stroke", "white");
                diffAndSetAttribute(this.slipSkidTriangle, "stroke-width", "1.5");
                this.attitude_bank_root.appendChild(this.slipSkidTriangle);
                this.slipSkid = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.slipSkid, "d", "M-14 -122 L-14 -128 L14 -128 L14 -122 Z");
                diffAndSetAttribute(this.slipSkid, "fill", "transparent");
                diffAndSetAttribute(this.slipSkid, "stroke", "white");
                diffAndSetAttribute(this.slipSkid, "stroke-width", "1.5");
                this.attitude_bank_root.appendChild(this.slipSkid);
            }
            {
                this.radioAltitudeGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.radioAltitudeGroup, "id", "RadioAltitude");
                this.attitude_bank_root.appendChild(this.radioAltitudeGroup);
                let decisionHeightTitle = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(decisionHeightTitle, "RADIO");
                diffAndSetAttribute(decisionHeightTitle, "x", "140");
                diffAndSetAttribute(decisionHeightTitle, "y", "-208");
                diffAndSetAttribute(decisionHeightTitle, "text-anchor", "end");
                diffAndSetAttribute(decisionHeightTitle, "font-size", "14");
                diffAndSetAttribute(decisionHeightTitle, "font-family", "Roboto-Bold");
                diffAndSetAttribute(decisionHeightTitle, "fill", "lime");
                this.radioAltitudeGroup.appendChild(decisionHeightTitle);
                this.radioDecisionHeight = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.radioDecisionHeight, "");
                diffAndSetAttribute(this.radioDecisionHeight, "x", "140");
                diffAndSetAttribute(this.radioDecisionHeight, "y", "-192");
                diffAndSetAttribute(this.radioDecisionHeight, "text-anchor", "end");
                diffAndSetAttribute(this.radioDecisionHeight, "font-size", "14");
                diffAndSetAttribute(this.radioDecisionHeight, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.radioDecisionHeight, "fill", "lime");
                this.radioAltitudeGroup.appendChild(this.radioDecisionHeight);
                this.radioAltitude = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.radioAltitude, "");
                diffAndSetAttribute(this.radioAltitude, "x", "140");
                diffAndSetAttribute(this.radioAltitude, "y", "-172");
                diffAndSetAttribute(this.radioAltitude, "text-anchor", "end");
                diffAndSetAttribute(this.radioAltitude, "font-size", "18");
                diffAndSetAttribute(this.radioAltitude, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.radioAltitude, "fill", "white");
                this.radioAltitudeGroup.appendChild(this.radioAltitude);
            }
        }
        this.flightDirector = new Jet_PFD_FlightDirector.B747_8_Handler();
        this.flightDirector.init(this.attitude_bank_root);
        this.applyAttributes();
    }
    construct_AS01B() {
        let pitchFactor = (this.isHud) ? -19.5 : -6.5;
        this.pitchAngleFactor = pitchFactor;
        this.horizonAngleFactor = (this.isHud) ? pitchFactor * 1.18 : pitchFactor;
        {
            this.horizon_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.horizon_root, "id", "Background");
            diffAndSetAttribute(this.horizon_root, "width", "100%");
            diffAndSetAttribute(this.horizon_root, "height", "100%");
            diffAndSetAttribute(this.horizon_root, "viewBox", "-200 -200 400 300");
            diffAndSetAttribute(this.horizon_root, "overflow", "visible");
            diffAndSetAttribute(this.horizon_root, "style", "position:absolute; z-index:-3; width:100%; height:100%;");
            this.appendChild(this.horizon_root);
            this.horizonTopColor = (this.horizonVisible && !this.isHud) ? "#0B3B82" : "transparent";
            this.horizonBottomColor = (this.horizonVisible && !this.isHud) ? "#4F371E" : "transparent";
            if (!this.isHud) {
                this.horizon_top_bg = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(this.horizon_top_bg, "fill", this.horizonTopColor);
                diffAndSetAttribute(this.horizon_top_bg, "x", "-1000");
                diffAndSetAttribute(this.horizon_top_bg, "y", "-1000");
                diffAndSetAttribute(this.horizon_top_bg, "width", "2000");
                diffAndSetAttribute(this.horizon_top_bg, "height", "2000");
                this.horizon_root.appendChild(this.horizon_top_bg);
            }
            this.horizon_bottom = document.createElementNS(Avionics.SVG.NS, "g");
            this.horizon_root.appendChild(this.horizon_bottom);
            {
                if (!this.isHud) {
                    this.horizon_bottom_bg = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(this.horizon_bottom_bg, "fill", this.horizonBottomColor);
                    diffAndSetAttribute(this.horizon_bottom_bg, "x", "-1500");
                    diffAndSetAttribute(this.horizon_bottom_bg, "y", "0");
                    diffAndSetAttribute(this.horizon_bottom_bg, "width", "3000");
                    diffAndSetAttribute(this.horizon_bottom_bg, "height", "3000");
                    this.horizon_bottom.appendChild(this.horizon_bottom_bg);
                }
                let separator = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(separator, "fill", (this.isHud) ? "lime" : "white");
                diffAndSetAttribute(separator, "x", (this.isHud) ? "-400" : "-1500");
                diffAndSetAttribute(separator, "y", (this.isHud) ? "-110" : "0");
                diffAndSetAttribute(separator, "width", (this.isHud) ? "765" : "3000");
                diffAndSetAttribute(separator, "height", (this.isHud) ? "3" : "6");
                this.horizon_bottom.appendChild(separator);
            }
        }
        {
            let pitchContainer = document.createElement("div");
            diffAndSetAttribute(pitchContainer, "id", "Pitch");
            pitchContainer.style.top = (this.isHud) ? "-50%" : "-14%";
            pitchContainer.style.left = "-10%";
            pitchContainer.style.width = "120%";
            pitchContainer.style.height = "120%";
            pitchContainer.style.position = "absolute";
            this.appendChild(pitchContainer);
            this.attitude_pitch_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.attitude_pitch_root, "width", "100%");
            diffAndSetAttribute(this.attitude_pitch_root, "height", "100%");
            diffAndSetAttribute(this.attitude_pitch_root, "viewBox", "-200 -200 400 300");
            diffAndSetAttribute(this.attitude_pitch_root, "overflow", "visible");
            diffAndSetAttribute(this.attitude_pitch_root, "style", "position:absolute; z-index: -2;");
            pitchContainer.appendChild(this.attitude_pitch_root);
            {
                if (this.isHud) {
                    this.attitude_pitch = document.createElementNS(Avionics.SVG.NS, "g");
                    this.attitude_pitch_root.appendChild(this.attitude_pitch);
                    {
                        let x = -130;
                        let y = -65;
                        let w = 260;
                        let h = 330;
                        let pitchGraduations = document.createElementNS(Avionics.SVG.NS, "svg");
                        diffAndSetAttribute(pitchGraduations, "width", w + '');
                        diffAndSetAttribute(pitchGraduations, "height", h + '');
                        diffAndSetAttribute(pitchGraduations, "x", x + '');
                        diffAndSetAttribute(pitchGraduations, "y", y + '');
                        diffAndSetAttribute(pitchGraduations, "viewBox", x + " " + y + " " + w + " " + h);
                        diffAndSetAttribute(pitchGraduations, "overflow", "hidden");
                        this.attitude_pitch.appendChild(pitchGraduations);
                        this.attitude_pitch_grads.push(document.createElementNS(Avionics.SVG.NS, "g"));
                        pitchGraduations.appendChild(this.attitude_pitch_grads[0]);
                        let maxDash = 80;
                        let bigWidth = 120;
                        let bigHeight = 3;
                        let fontSize = 20;
                        let angle = -maxDash;
                        let nextAngle;
                        let width;
                        let height;
                        while (angle <= maxDash) {
                            width = bigWidth;
                            height = bigHeight;
                            nextAngle = angle + 5;
                            if (angle > 0) {
                                let leftText = document.createElementNS(Avionics.SVG.NS, "text");
                                diffAndSetText(leftText, angle + '');
                                diffAndSetAttribute(leftText, "x", ((-width / 2) - 35) + '');
                                diffAndSetAttribute(leftText, "y", (pitchFactor * angle - height / 2 + fontSize / 2) + '');
                                diffAndSetAttribute(leftText, "text-anchor", "end");
                                diffAndSetAttribute(leftText, "font-size", fontSize + '');
                                diffAndSetAttribute(leftText, "font-family", "Roboto-Bold");
                                diffAndSetAttribute(leftText, "fill", "lime");
                                this.attitude_pitch_grads[0].appendChild(leftText);
                                let leftHLine = document.createElementNS(Avionics.SVG.NS, "line");
                                diffAndSetAttribute(leftHLine, "x1", ((-width / 2) - 30) + '');
                                diffAndSetAttribute(leftHLine, "y1", (pitchFactor * angle - height / 2) + '');
                                diffAndSetAttribute(leftHLine, "x2", "-35");
                                diffAndSetAttribute(leftHLine, "y2", (pitchFactor * angle - height / 2) + '');
                                diffAndSetAttribute(leftHLine, "stroke", "lime");
                                diffAndSetAttribute(leftHLine, "stroke-width", "3");
                                if (angle < 0)
                                    diffAndSetAttribute(leftHLine, "stroke-dasharray", "18 2");
                                this.attitude_pitch_grads[0].appendChild(leftHLine);
                                let leftVLine = document.createElementNS(Avionics.SVG.NS, "line");
                                diffAndSetAttribute(leftVLine, "x1", ((-width / 2) - 30) + '');
                                diffAndSetAttribute(leftVLine, "y1", (pitchFactor * angle - height / 2) + '');
                                diffAndSetAttribute(leftVLine, "x2", ((-width / 2) - 30) + '');
                                diffAndSetAttribute(leftVLine, "y2", ((angle > 0) ? (pitchFactor * angle - height / 2 + 8) : (pitchFactor * angle - height / 2 - 8)) + '');
                                diffAndSetAttribute(leftVLine, "stroke", "lime");
                                diffAndSetAttribute(leftVLine, "stroke-width", "3");
                                this.attitude_pitch_grads[0].appendChild(leftVLine);
                                let rightText = document.createElementNS(Avionics.SVG.NS, "text");
                                diffAndSetText(rightText, angle + '');
                                diffAndSetAttribute(rightText, "x", ((width / 2) + 35) + '');
                                diffAndSetAttribute(rightText, "y", (pitchFactor * angle - height / 2 + fontSize / 2) + '');
                                diffAndSetAttribute(rightText, "text-anchor", "start");
                                diffAndSetAttribute(rightText, "font-size", fontSize + '');
                                diffAndSetAttribute(rightText, "font-family", "Roboto-Bold");
                                diffAndSetAttribute(rightText, "fill", "lime");
                                this.attitude_pitch_grads[0].appendChild(rightText);
                                let rightHLine = document.createElementNS(Avionics.SVG.NS, "line");
                                diffAndSetAttribute(rightHLine, "x1", ((width / 2) + 30) + '');
                                diffAndSetAttribute(rightHLine, "y1", (pitchFactor * angle - height / 2) + '');
                                diffAndSetAttribute(rightHLine, "x2", "35");
                                diffAndSetAttribute(rightHLine, "y2", (pitchFactor * angle - height / 2) + '');
                                diffAndSetAttribute(rightHLine, "stroke", "lime");
                                diffAndSetAttribute(rightHLine, "stroke-width", "3");
                                if (angle < 0)
                                    diffAndSetAttribute(rightHLine, "stroke-dasharray", "18 2");
                                this.attitude_pitch_grads[0].appendChild(rightHLine);
                                let rightVLine = document.createElementNS(Avionics.SVG.NS, "line");
                                diffAndSetAttribute(rightVLine, "x1", ((width / 2) + 30) + '');
                                diffAndSetAttribute(rightVLine, "y1", (pitchFactor * angle - height / 2) + '');
                                diffAndSetAttribute(rightVLine, "x2", ((width / 2) + 30) + '');
                                diffAndSetAttribute(rightVLine, "y2", ((angle > 0) ? (pitchFactor * angle - height / 2 + 8) : (pitchFactor * angle - height / 2 - 8)) + '');
                                diffAndSetAttribute(rightVLine, "stroke", "lime");
                                diffAndSetAttribute(rightVLine, "stroke-width", "3");
                                this.attitude_pitch_grads[0].appendChild(rightVLine);
                            }
                            angle = nextAngle;
                        }
                    }
                    {
                        let x = -130;
                        let y = -65;
                        let w = 260;
                        let h = 305;
                        let pitchGraduations = document.createElementNS(Avionics.SVG.NS, "svg");
                        diffAndSetAttribute(pitchGraduations, "width", w + '');
                        diffAndSetAttribute(pitchGraduations, "height", h + '');
                        diffAndSetAttribute(pitchGraduations, "x", x + '');
                        diffAndSetAttribute(pitchGraduations, "y", y + '');
                        diffAndSetAttribute(pitchGraduations, "viewBox", x + " " + y + " " + w + " " + h);
                        diffAndSetAttribute(pitchGraduations, "overflow", "hidden");
                        this.attitude_pitch.appendChild(pitchGraduations);
                        this.attitude_pitch_grads.push(document.createElementNS(Avionics.SVG.NS, "g"));
                        pitchGraduations.appendChild(this.attitude_pitch_grads[1]);
                        let maxDash = 80;
                        let bigWidth = 120;
                        let bigHeight = 3;
                        let fontSize = 20;
                        let angle = -maxDash;
                        let nextAngle;
                        let width;
                        let height;
                        while (angle <= maxDash) {
                            width = bigWidth;
                            height = bigHeight;
                            nextAngle = angle + 5;
                            if (angle < 0) {
                                let leftText = document.createElementNS(Avionics.SVG.NS, "text");
                                diffAndSetText(leftText, angle + '');
                                diffAndSetAttribute(leftText, "x", ((-width / 2) - 35) + '');
                                diffAndSetAttribute(leftText, "y", (pitchFactor * angle - height / 2 + fontSize / 2) + '');
                                diffAndSetAttribute(leftText, "text-anchor", "end");
                                diffAndSetAttribute(leftText, "font-size", fontSize + '');
                                diffAndSetAttribute(leftText, "font-family", "Roboto-Bold");
                                diffAndSetAttribute(leftText, "fill", "lime");
                                this.attitude_pitch_grads[1].appendChild(leftText);
                                let leftHLine = document.createElementNS(Avionics.SVG.NS, "line");
                                diffAndSetAttribute(leftHLine, "x1", ((-width / 2) - 30) + '');
                                diffAndSetAttribute(leftHLine, "y1", (pitchFactor * angle - height / 2) + '');
                                diffAndSetAttribute(leftHLine, "x2", "-35");
                                diffAndSetAttribute(leftHLine, "y2", (pitchFactor * angle - height / 2) + '');
                                diffAndSetAttribute(leftHLine, "stroke", "lime");
                                diffAndSetAttribute(leftHLine, "stroke-width", "3");
                                if (angle < 0)
                                    diffAndSetAttribute(leftHLine, "stroke-dasharray", "18 2");
                                this.attitude_pitch_grads[1].appendChild(leftHLine);
                                let leftVLine = document.createElementNS(Avionics.SVG.NS, "line");
                                diffAndSetAttribute(leftVLine, "x1", ((-width / 2) - 30) + '');
                                diffAndSetAttribute(leftVLine, "y1", (pitchFactor * angle - height / 2) + '');
                                diffAndSetAttribute(leftVLine, "x2", ((-width / 2) - 30) + '');
                                diffAndSetAttribute(leftVLine, "y2", ((angle > 0) ? (pitchFactor * angle - height / 2 + 8) : (pitchFactor * angle - height / 2 - 8)) + '');
                                diffAndSetAttribute(leftVLine, "stroke", "lime");
                                diffAndSetAttribute(leftVLine, "stroke-width", "3");
                                this.attitude_pitch_grads[1].appendChild(leftVLine);
                                let rightText = document.createElementNS(Avionics.SVG.NS, "text");
                                diffAndSetText(rightText, angle + '');
                                diffAndSetAttribute(rightText, "x", ((width / 2) + 35) + '');
                                diffAndSetAttribute(rightText, "y", (pitchFactor * angle - height / 2 + fontSize / 2) + '');
                                diffAndSetAttribute(rightText, "text-anchor", "start");
                                diffAndSetAttribute(rightText, "font-size", fontSize + '');
                                diffAndSetAttribute(rightText, "font-family", "Roboto-Bold");
                                diffAndSetAttribute(rightText, "fill", "lime");
                                this.attitude_pitch_grads[1].appendChild(rightText);
                                let rightHLine = document.createElementNS(Avionics.SVG.NS, "line");
                                diffAndSetAttribute(rightHLine, "x1", ((width / 2) + 30) + '');
                                diffAndSetAttribute(rightHLine, "y1", (pitchFactor * angle - height / 2) + '');
                                diffAndSetAttribute(rightHLine, "x2", "35");
                                diffAndSetAttribute(rightHLine, "y2", (pitchFactor * angle - height / 2) + '');
                                diffAndSetAttribute(rightHLine, "stroke", "lime");
                                diffAndSetAttribute(rightHLine, "stroke-width", "3");
                                if (angle < 0)
                                    diffAndSetAttribute(rightHLine, "stroke-dasharray", "18 2");
                                this.attitude_pitch_grads[1].appendChild(rightHLine);
                                let rightVLine = document.createElementNS(Avionics.SVG.NS, "line");
                                diffAndSetAttribute(rightVLine, "x1", ((width / 2) + 30) + '');
                                diffAndSetAttribute(rightVLine, "y1", (pitchFactor * angle - height / 2) + '');
                                diffAndSetAttribute(rightVLine, "x2", ((width / 2) + 30) + '');
                                diffAndSetAttribute(rightVLine, "y2", ((angle > 0) ? (pitchFactor * angle - height / 2 + 8) : (pitchFactor * angle - height / 2 - 8)) + '');
                                diffAndSetAttribute(rightVLine, "stroke", "lime");
                                diffAndSetAttribute(rightVLine, "stroke-width", "3");
                                this.attitude_pitch_grads[1].appendChild(rightVLine);
                            }
                            angle = nextAngle;
                        }
                    }
                }
                else {
                    this.attitude_pitch = document.createElementNS(Avionics.SVG.NS, "g");
                    this.attitude_pitch_root.appendChild(this.attitude_pitch);
                    var x = (this.isHud) ? -130 : -115;
                    var y = (this.isHud) ? -65 : -120;
                    var w = (this.isHud) ? 260 : 230;
                    var h = (this.isHud) ? 305 : 280;
                    let pitchGraduations = document.createElementNS(Avionics.SVG.NS, "svg");
                    diffAndSetAttribute(pitchGraduations, "width", w + '');
                    diffAndSetAttribute(pitchGraduations, "height", h + '');
                    diffAndSetAttribute(pitchGraduations, "x", x + '');
                    diffAndSetAttribute(pitchGraduations, "y", y + '');
                    diffAndSetAttribute(pitchGraduations, "viewBox", x + " " + y + " " + w + " " + h);
                    diffAndSetAttribute(pitchGraduations, "overflow", "hidden");
                    this.attitude_pitch.appendChild(pitchGraduations);
                    this.attitude_pitch_grads.push(document.createElementNS(Avionics.SVG.NS, "g"));
                    pitchGraduations.appendChild(this.attitude_pitch_grads[0]);
                    let maxDash = 80;
                    let fullPrecisionLowerLimit = -25;
                    let fullPrecisionUpperLimit = 25;
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
                                text = false;
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
                            diffAndSetAttribute(rect, "y", (pitchFactor * angle - height / 2) + '');
                            diffAndSetAttribute(rect, "width", width + '');
                            diffAndSetAttribute(rect, "height", height + '');
                            this.attitude_pitch_grads[0].appendChild(rect);
                            if (text) {
                                let leftText = document.createElementNS(Avionics.SVG.NS, "text");
                                diffAndSetText(leftText, Math.abs(angle) + '');
                                diffAndSetAttribute(leftText, "x", ((-width / 2) - 5) + '');
                                diffAndSetAttribute(leftText, "y", (pitchFactor * angle - height / 2 + fontSize / 2) + '');
                                diffAndSetAttribute(leftText, "text-anchor", "end");
                                diffAndSetAttribute(leftText, "font-size", fontSize + '');
                                diffAndSetAttribute(leftText, "font-family", "Roboto-Light");
                                diffAndSetAttribute(leftText, "fill", "white");
                                this.attitude_pitch_grads[0].appendChild(leftText);
                                let rightText = document.createElementNS(Avionics.SVG.NS, "text");
                                diffAndSetText(rightText, Math.abs(angle) + '');
                                diffAndSetAttribute(rightText, "x", ((width / 2) + 5) + '');
                                diffAndSetAttribute(rightText, "y", (pitchFactor * angle - height / 2 + fontSize / 2) + '');
                                diffAndSetAttribute(rightText, "text-anchor", "start");
                                diffAndSetAttribute(rightText, "font-size", fontSize + '');
                                diffAndSetAttribute(rightText, "font-family", "Roboto-Light");
                                diffAndSetAttribute(rightText, "fill", "white");
                                this.attitude_pitch_grads[0].appendChild(rightText);
                            }
                        }
                        angle = nextAngle;
                    }
                }
            }
        }
        {
            let attitudeContainer = document.createElement("div");
            diffAndSetAttribute(attitudeContainer, "id", "Attitude");
            attitudeContainer.style.top = (this.isHud) ? "-40%" : "-13%";
            attitudeContainer.style.left = "-10%";
            attitudeContainer.style.width = "120%";
            attitudeContainer.style.height = "120%";
            attitudeContainer.style.position = "absolute";
            this.appendChild(attitudeContainer);
            this.attitude_bank_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.attitude_bank_root, "width", "100%");
            diffAndSetAttribute(this.attitude_bank_root, "height", "100%");
            diffAndSetAttribute(this.attitude_bank_root, "viewBox", "-200 -200 400 300");
            diffAndSetAttribute(this.attitude_bank_root, "overflow", "visible");
            diffAndSetAttribute(this.attitude_bank_root, "style", "position:absolute; z-index: 0");
            attitudeContainer.appendChild(this.attitude_bank_root);
            {
                this.attitude_bank = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_bank_root.appendChild(this.attitude_bank);
                let topTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(topTriangle, "d", "M0 -152 l-8 -12 l16 0 Z");
                diffAndSetAttribute(topTriangle, "fill", (this.isHud) ? "lime" : "white");
                this.attitude_bank.appendChild(topTriangle);
                let smallDashesAngle;
                let smallDashesHeight;
                if (this.isHud) {
                    smallDashesAngle = [-30, -20, -10, 10, 20, 30];
                    smallDashesHeight = [13, 13, 13, 13, 13, 13];
                }
                else {
                    smallDashesAngle = [-60, -45, -30, -20, -10, 10, 20, 30, 45, 60];
                    smallDashesHeight = [26, 13, 26, 13, 13, 13, 13, 26, 13, 26];
                }
                let radius = 150;
                for (let i = 0; i < smallDashesAngle.length; i++) {
                    let dash = document.createElementNS(Avionics.SVG.NS, "line");
                    diffAndSetAttribute(dash, "x1", "0");
                    diffAndSetAttribute(dash, "y1", (-radius) + '');
                    diffAndSetAttribute(dash, "x2", "0");
                    diffAndSetAttribute(dash, "y2", (-radius - smallDashesHeight[i]) + '');
                    diffAndSetAttribute(dash, "stroke", (this.isHud) ? "lime" : "white");
                    diffAndSetAttribute(dash, "stroke-width", "3");
                    diffAndSetAttribute(dash, "transform", "rotate(" + smallDashesAngle[i] + ",0,0)");
                    this.attitude_bank.appendChild(dash);
                }
            }
            {
                let cursors = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_bank_root.appendChild(cursors);
                if (this.isHud) {
                    let planeSymbol = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(planeSymbol, "d", "M-45 -23 l40 0 l5 5 l5 -5 l40 0 l0 7 l-40 0 l-5 5 l-5 -5 l-40 0 Z");
                    diffAndSetAttribute(planeSymbol, "fill", "transparent");
                    diffAndSetAttribute(planeSymbol, "stroke", "lime");
                    diffAndSetAttribute(planeSymbol, "stroke-width", "2.5");
                    cursors.appendChild(planeSymbol);
                }
                else {
                    let leftUpper = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(leftUpper, "d", "M-125 2 l0 -6 l55 0 l0 28 l-5 0 l0 -22 l-40 0 Z");
                    diffAndSetAttribute(leftUpper, "fill", "black");
                    diffAndSetAttribute(leftUpper, "stroke", "white");
                    diffAndSetAttribute(leftUpper, "stroke-width", "1");
                    diffAndSetAttribute(leftUpper, "stroke-opacity", "1.0");
                    cursors.appendChild(leftUpper);
                    let rightUpper = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(rightUpper, "d", "M125 2 l0 -6 l-55 0 l0 28 l5 0 l0 -22 l40 0 Z");
                    diffAndSetAttribute(rightUpper, "fill", "black");
                    diffAndSetAttribute(rightUpper, "stroke", "white");
                    diffAndSetAttribute(rightUpper, "stroke-width", "1");
                    diffAndSetAttribute(rightUpper, "stroke-opacity", "1.0");
                    cursors.appendChild(rightUpper);
                    let centerRect = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(centerRect, "x", "-4");
                    diffAndSetAttribute(centerRect, "y", "-5");
                    diffAndSetAttribute(centerRect, "height", "8");
                    diffAndSetAttribute(centerRect, "width", "8");
                    diffAndSetAttribute(centerRect, "stroke", "white");
                    diffAndSetAttribute(centerRect, "stroke-width", "3");
                    cursors.appendChild(centerRect);
                }
                this.slipSkidTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.slipSkidTriangle, "d", "M0 -149 l-13 18 l26 0 Z");
                diffAndSetAttribute(this.slipSkidTriangle, "fill", "transparent");
                diffAndSetAttribute(this.slipSkidTriangle, "stroke", (this.isHud) ? "lime" : "white");
                diffAndSetAttribute(this.slipSkidTriangle, "stroke-width", "1.5");
                this.attitude_bank_root.appendChild(this.slipSkidTriangle);
                this.slipSkid = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.slipSkid, "d", "M-14 -122 L-14 -128 L14 -128 L14 -122 Z");
                diffAndSetAttribute(this.slipSkid, "fill", "transparent");
                diffAndSetAttribute(this.slipSkid, "stroke", (this.isHud) ? "lime" : "white");
                diffAndSetAttribute(this.slipSkid, "stroke-width", "1.5");
                this.attitude_bank_root.appendChild(this.slipSkid);
            }
            if (!this.isHud) {
                this.radioAltitudeGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.radioAltitudeGroup, "id", "RadioAltitude");
                this.attitude_bank_root.appendChild(this.radioAltitudeGroup);
                let x = 0;
                let y = 225;
                let w = 90;
                let h = 38;
                let bg = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(bg, "x", (x - w * 0.5) + '');
                diffAndSetAttribute(bg, "y", (y - h * 0.5) + '');
                diffAndSetAttribute(bg, "width", w + '');
                diffAndSetAttribute(bg, "height", h + '');
                diffAndSetAttribute(bg, "fill", "black");
                this.radioAltitudeGroup.appendChild(bg);
                this.radioAltitude = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(this.radioAltitude, "");
                diffAndSetAttribute(this.radioAltitude, "x", x + '');
                diffAndSetAttribute(this.radioAltitude, "y", y + '');
                diffAndSetAttribute(this.radioAltitude, "text-anchor", "middle");
                diffAndSetAttribute(this.radioAltitude, "font-size", "32");
                diffAndSetAttribute(this.radioAltitude, "font-family", "Roboto-Bold");
                diffAndSetAttribute(this.radioAltitude, "fill", "white");
                diffAndSetAttribute(this.radioAltitude, "alignment-baseline", "central");
                this.radioAltitudeGroup.appendChild(this.radioAltitude);
            }
        }
        this.flightDirector = new Jet_PFD_FlightDirector.AS01B_Handler();
        this.flightDirector.init(this.attitude_bank_root);
        this.applyAttributes();
    }
    construct_CJ4() {
        let pitchFactor = -7;
        this.pitchAngleFactor = pitchFactor;
        this.horizonAngleFactor = pitchFactor * 1.67;
        {
            this.horizon_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.horizon_root, "id", "Background");
            diffAndSetAttribute(this.horizon_root, "width", "100%");
            diffAndSetAttribute(this.horizon_root, "height", "100%");
            diffAndSetAttribute(this.horizon_root, "viewBox", "-200 -200 400 300");
            diffAndSetAttribute(this.horizon_root, "x", "-100");
            diffAndSetAttribute(this.horizon_root, "y", "-100");
            diffAndSetAttribute(this.horizon_root, "overflow", "visible");
            diffAndSetAttribute(this.horizon_root, "style", "position:absolute; z-index: -3; width: 100%; height:100%;");
            this.appendChild(this.horizon_root);
            this.horizonTopColor = "#045CEB";
            this.horizonBottomColor = "#9E6345";
            this.horizon_top_bg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.horizon_top_bg, "fill", (this.horizonVisible) ? this.horizonTopColor : "transparent");
            diffAndSetAttribute(this.horizon_top_bg, "x", "-1000");
            diffAndSetAttribute(this.horizon_top_bg, "y", "-1000");
            diffAndSetAttribute(this.horizon_top_bg, "width", "2000");
            diffAndSetAttribute(this.horizon_top_bg, "height", "2000");
            this.horizon_root.appendChild(this.horizon_top_bg);
            this.horizon_bottom = document.createElementNS(Avionics.SVG.NS, "g");
            this.horizon_root.appendChild(this.horizon_bottom);
            {
                this.horizon_bottom_bg = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(this.horizon_bottom_bg, "fill", (this.horizonVisible) ? this.horizonBottomColor : "transparent");
                diffAndSetAttribute(this.horizon_bottom_bg, "x", "-1500");
                diffAndSetAttribute(this.horizon_bottom_bg, "y", "0");
                diffAndSetAttribute(this.horizon_bottom_bg, "width", "3000");
                diffAndSetAttribute(this.horizon_bottom_bg, "height", "3000");
                this.horizon_bottom.appendChild(this.horizon_bottom_bg);
                let separator = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(separator, "fill", "white");
                diffAndSetAttribute(separator, "x", "-1500");
                diffAndSetAttribute(separator, "y", "-3");
                diffAndSetAttribute(separator, "width", "3000");
                diffAndSetAttribute(separator, "height", "6");
                this.horizon_bottom.appendChild(separator);
            }
        }
        {
            let pitchContainer = document.createElement("div");
            diffAndSetAttribute(pitchContainer, "id", "Pitch");
            pitchContainer.style.top = "-21%";
            pitchContainer.style.left = "-10%";
            pitchContainer.style.width = "120%";
            pitchContainer.style.height = "120%";
            pitchContainer.style.position = "absolute";
            pitchContainer.style.transform = "scale(1.4)";
            this.appendChild(pitchContainer);
            this.attitude_pitch_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.attitude_pitch_root, "width", "100%");
            diffAndSetAttribute(this.attitude_pitch_root, "height", "100%");
            diffAndSetAttribute(this.attitude_pitch_root, "viewBox", "-200 -200 400 300");
            diffAndSetAttribute(this.attitude_pitch_root, "overflow", "visible");
            diffAndSetAttribute(this.attitude_pitch_root, "style", "position:absolute; z-index: -2;");
            pitchContainer.appendChild(this.attitude_pitch_root);
            {
                this.attitude_pitch = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_pitch_root.appendChild(this.attitude_pitch);
                var x = -215;
                var y = -175;
                var w = 530;
                var h = 365;
                let pitchGraduations = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(pitchGraduations, "width", w + '');
                diffAndSetAttribute(pitchGraduations, "height", h + '');
                diffAndSetAttribute(pitchGraduations, "x", x + '');
                diffAndSetAttribute(pitchGraduations, "y", y + '');
                diffAndSetAttribute(pitchGraduations, "viewBox", x + " " + y + " " + w + " " + h);
                diffAndSetAttribute(pitchGraduations, "overflow", "hidden");
                this.attitude_pitch.appendChild(pitchGraduations);
                {
                    this.attitude_pitch_grads.push(document.createElementNS(Avionics.SVG.NS, "g"));
                    pitchGraduations.appendChild(this.attitude_pitch_grads[0]);
                    let maxDash = 80;
                    let fullPrecisionLowerLimit = -20;
                    let fullPrecisionUpperLimit = 20;
                    let halfPrecisionLowerLimit = -30;
                    let halfPrecisionUpperLimit = 45;
                    let unusualAttitudeLowerLimit = -30;
                    let unusualAttitudeUpperLimit = 50;
                    let bigWidth = 60;
                    let bigHeight = 3;
                    let mediumWidth = 32.5;
                    let mediumHeight = 3;
                    let smallWidth = 10;
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
                                text = false;
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
                            diffAndSetAttribute(rect, "y", (pitchFactor * angle - height / 2) + '');
                            diffAndSetAttribute(rect, "width", width + '');
                            diffAndSetAttribute(rect, "height", height + '');
                            this.attitude_pitch_grads[0].appendChild(rect);
                            if (text) {
                                let leftText = document.createElementNS(Avionics.SVG.NS, "text");
                                diffAndSetText(leftText, Math.abs(angle) + '');
                                diffAndSetAttribute(leftText, "x", ((-width / 2) - 5) + '');
                                diffAndSetAttribute(leftText, "y", (pitchFactor * angle - height / 2 + fontSize / 2) + '');
                                diffAndSetAttribute(leftText, "text-anchor", "end");
                                diffAndSetAttribute(leftText, "font-size", fontSize + '');
                                diffAndSetAttribute(leftText, "font-family", "Roboto-Light");
                                diffAndSetAttribute(leftText, "fill", "white");
                                this.attitude_pitch_grads[0].appendChild(leftText);
                                let rightText = document.createElementNS(Avionics.SVG.NS, "text");
                                diffAndSetText(rightText, Math.abs(angle) + '');
                                diffAndSetAttribute(rightText, "x", ((width / 2) + 5) + '');
                                diffAndSetAttribute(rightText, "y", (pitchFactor * angle - height / 2 + fontSize / 2) + '');
                                diffAndSetAttribute(rightText, "text-anchor", "start");
                                diffAndSetAttribute(rightText, "font-size", fontSize + '');
                                diffAndSetAttribute(rightText, "font-family", "Roboto-Light");
                                diffAndSetAttribute(rightText, "fill", "white");
                                this.attitude_pitch_grads[0].appendChild(rightText);
                            }
                            if (angle < unusualAttitudeLowerLimit) {
                                let chevron = document.createElementNS(Avionics.SVG.NS, "path");
                                let path = "M" + -smallWidth / 2 + " " + (pitchFactor * nextAngle - bigHeight / 2) + " l" + smallWidth + "  0 ";
                                path += "L" + bigWidth / 2 + " " + (pitchFactor * angle - bigHeight / 2) + " l" + -smallWidth + " 0 ";
                                path += "L0 " + (pitchFactor * nextAngle + 20) + " ";
                                path += "L" + (-bigWidth / 2 + smallWidth) + " " + (pitchFactor * angle - bigHeight / 2) + " l" + -smallWidth + " 0 Z";
                                diffAndSetAttribute(chevron, "d", path);
                                diffAndSetAttribute(chevron, "fill", "red");
                                this.attitude_pitch_grads[0].appendChild(chevron);
                            }
                            if (angle >= unusualAttitudeUpperLimit && nextAngle <= maxDash) {
                                let chevron = document.createElementNS(Avionics.SVG.NS, "path");
                                let path = "M" + -smallWidth / 2 + " " + (pitchFactor * angle - bigHeight / 2) + " l" + smallWidth + "  0 ";
                                path += "L" + (bigWidth / 2) + " " + (pitchFactor * nextAngle + bigHeight / 2) + " l" + -smallWidth + " 0 ";
                                path += "L0 " + (pitchFactor * angle - 20) + " ";
                                path += "L" + (-bigWidth / 2 + smallWidth) + " " + (pitchFactor * nextAngle + bigHeight / 2) + " l" + -smallWidth + " 0 Z";
                                diffAndSetAttribute(chevron, "d", path);
                                diffAndSetAttribute(chevron, "fill", "red");
                                this.attitude_pitch_grads[0].appendChild(chevron);
                            }
                        }
                        angle = nextAngle;
                    }
                }
                {
                    this.cj4_FlightDirector = document.createElementNS(Avionics.SVG.NS, "g");
                    pitchGraduations.appendChild(this.cj4_FlightDirector);
                    let triangleOuterLeft = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(triangleOuterLeft, "d", "M-110 23 l20 7 L0 0 Z");
                    diffAndSetAttribute(triangleOuterLeft, "fill", "#F8A2DE");
                    diffAndSetAttribute(triangleOuterLeft, "stroke", "black");
                    diffAndSetAttribute(triangleOuterLeft, "stroke-width", "0.5");
                    this.cj4_FlightDirector.appendChild(triangleOuterLeft);
                    let triangleBottomLeft = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(triangleBottomLeft, "d", "M-110 23 l20 7 l-20 7 Z");
                    diffAndSetAttribute(triangleBottomLeft, "fill", "#F8A2DE");
                    diffAndSetAttribute(triangleBottomLeft, "stroke", "black");
                    diffAndSetAttribute(triangleBottomLeft, "stroke-width", "0.5");
                    this.cj4_FlightDirector.appendChild(triangleBottomLeft);
                    let triangleOuterRight = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(triangleOuterRight, "d", "M110 23 l-20 7 L0 0 Z");
                    diffAndSetAttribute(triangleOuterRight, "fill", "#F8A2DE");
                    diffAndSetAttribute(triangleOuterRight, "stroke", "black");
                    diffAndSetAttribute(triangleOuterRight, "stroke-width", "0.5");
                    this.cj4_FlightDirector.appendChild(triangleOuterRight);
                    let triangleBottomRight = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(triangleBottomRight, "d", "M110 23 l-20 7 l20 7 Z");
                    diffAndSetAttribute(triangleBottomRight, "fill", "#F8A2DE");
                    diffAndSetAttribute(triangleBottomRight, "stroke", "black");
                    diffAndSetAttribute(triangleBottomRight, "stroke-width", "0.5");
                    this.cj4_FlightDirector.appendChild(triangleBottomRight);
                }
            }
        }
        {
            let attitudeContainer = document.createElement("div");
            diffAndSetAttribute(attitudeContainer, "id", "Attitude");
            attitudeContainer.style.top = "-21%";
            attitudeContainer.style.left = "-10%";
            attitudeContainer.style.width = "120%";
            attitudeContainer.style.height = "120%";
            attitudeContainer.style.position = "absolute";
            attitudeContainer.style.transform = "scale(1.4)";
            this.appendChild(attitudeContainer);
            this.attitude_bank_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.attitude_bank_root, "width", "100%");
            diffAndSetAttribute(this.attitude_bank_root, "height", "100%");
            diffAndSetAttribute(this.attitude_bank_root, "viewBox", "-200 -200 400 300");
            diffAndSetAttribute(this.attitude_bank_root, "overflow", "visible");
            diffAndSetAttribute(this.attitude_bank_root, "style", "position:absolute; z-index: 0");
            attitudeContainer.appendChild(this.attitude_bank_root);
            {
                this.attitude_bank = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_bank_root.appendChild(this.attitude_bank);
                let topTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(topTriangle, "d", "M0 -180 l-7.5 -10 l15 0 Z");
                diffAndSetAttribute(topTriangle, "fill", "transparent");
                diffAndSetAttribute(topTriangle, "stroke", "white");
                diffAndSetAttribute(topTriangle, "stroke-width", "1");
                diffAndSetAttribute(topTriangle, "stroke-opacity", "1");
                this.attitude_bank.appendChild(topTriangle);
                let smallDashesAngle = [-60, -30, -20, -10, 10, 20, 30, 60];
                let smallDashesHeight = [18, 18, 11, 11, 11, 11, 18, 18];
                let radius = 178;
                for (let i = 0; i < smallDashesAngle.length; i++) {
                    let dash = document.createElementNS(Avionics.SVG.NS, "line");
                    diffAndSetAttribute(dash, "x1", "0");
                    diffAndSetAttribute(dash, "y1", (-radius) + '');
                    diffAndSetAttribute(dash, "x2", "0");
                    diffAndSetAttribute(dash, "y2", (-radius - smallDashesHeight[i]) + '');
                    diffAndSetAttribute(dash, "fill", "none");
                    diffAndSetAttribute(dash, "stroke", "white");
                    diffAndSetAttribute(dash, "stroke-width", "2");
                    diffAndSetAttribute(dash, "transform", "rotate(" + smallDashesAngle[i] + ",0,0)");
                    this.attitude_bank.appendChild(dash);
                }
                let leftTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(leftTriangle, "d", "M0 -180 l-7.5 -10 l15 0 Z");
                diffAndSetAttribute(leftTriangle, "fill", "transparent");
                diffAndSetAttribute(leftTriangle, "stroke", "white");
                diffAndSetAttribute(leftTriangle, "stroke-width", "1");
                diffAndSetAttribute(leftTriangle, "stroke-opacity", "1");
                diffAndSetAttribute(leftTriangle, "transform", "rotate(45,0,0)");
                this.attitude_bank.appendChild(leftTriangle);
                let rightTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(rightTriangle, "d", "M0 -180 l-7.5 -10 l15 0 Z");
                diffAndSetAttribute(rightTriangle, "fill", "transparent");
                diffAndSetAttribute(rightTriangle, "stroke", "white");
                diffAndSetAttribute(rightTriangle, "stroke-width", "1");
                diffAndSetAttribute(rightTriangle, "stroke-opacity", "1");
                diffAndSetAttribute(rightTriangle, "transform", "rotate(-45,0,0)");
                this.attitude_bank.appendChild(rightTriangle);
            }
            {
                let cursors = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_bank_root.appendChild(cursors);
                let leftUpper1 = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(leftUpper1, "fill", "black");
                diffAndSetAttribute(leftUpper1, "stroke", "white");
                diffAndSetAttribute(leftUpper1, "stroke-width", "2");
                diffAndSetAttribute(leftUpper1, "x", "130");
                diffAndSetAttribute(leftUpper1, "y", "-4");
                diffAndSetAttribute(leftUpper1, "width", "32");
                diffAndSetAttribute(leftUpper1, "height", "9");
                cursors.appendChild(leftUpper1);
                let rightUpper1 = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(rightUpper1, "fill", "black");
                diffAndSetAttribute(rightUpper1, "stroke", "white");
                diffAndSetAttribute(rightUpper1, "stroke-width", "2");
                diffAndSetAttribute(rightUpper1, "x", "-162");
                diffAndSetAttribute(rightUpper1, "y", "-4");
                diffAndSetAttribute(rightUpper1, "width", "32");
                diffAndSetAttribute(rightUpper1, "height", "9");
                cursors.appendChild(rightUpper1);
                let triangleInnerLeft = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(triangleInnerLeft, "d", "M-90 30 l30 0 L0 0 Z");
                diffAndSetAttribute(triangleInnerLeft, "fill", "#black");
                diffAndSetAttribute(triangleInnerLeft, "stroke", "white");
                diffAndSetAttribute(triangleInnerLeft, "stroke-width", "0.5");
                cursors.appendChild(triangleInnerLeft);
                let triangleInnerRight = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(triangleInnerRight, "d", "M90 30 l-30 0 L0 0 Z");
                diffAndSetAttribute(triangleInnerRight, "fill", "#black");
                diffAndSetAttribute(triangleInnerRight, "stroke", "white");
                diffAndSetAttribute(triangleInnerRight, "stroke-width", "0.5");
                cursors.appendChild(triangleInnerRight);
                this.slipSkidTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.slipSkidTriangle, "d", "M0 -170 l-13 20 l26 0 Z");
                diffAndSetAttribute(this.slipSkidTriangle, "fill", "white");
                this.attitude_bank_root.appendChild(this.slipSkidTriangle);
                this.slipSkid = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.slipSkid, "d", "M-20 -140 L-16 -146 L16 -146 L20 -140 Z");
                diffAndSetAttribute(this.slipSkid, "fill", "white");
                this.attitude_bank_root.appendChild(this.slipSkid);
            }
        }
        this.applyAttributes();
    }
    construct_AS03D() {
        let pitchFactor = -6.1;
        this.pitchAngleFactor = pitchFactor;
        this.horizonAngleFactor = pitchFactor;
        {
            this.horizon_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.horizon_root, "id", "Background");
            diffAndSetAttribute(this.horizon_root, "width", "100%");
            diffAndSetAttribute(this.horizon_root, "height", "100%");
            diffAndSetAttribute(this.horizon_root, "viewBox", "-200 -150 400 300");
            diffAndSetAttribute(this.horizon_root, "overflow", "visible");
            diffAndSetAttribute(this.horizon_root, "style", "position:absolute; z-index: -3; width: 100%; height:100%;");
            this.appendChild(this.horizon_root);
            this.horizonTopColor = "#2f4962";
            this.horizonBottomColor = "#4b6657";
            this.horizon_top_bg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.horizon_top_bg, "fill", (this.horizonVisible) ? this.horizonTopColor : "transparent");
            diffAndSetAttribute(this.horizon_top_bg, "x", "-500");
            diffAndSetAttribute(this.horizon_top_bg, "y", "-500");
            diffAndSetAttribute(this.horizon_top_bg, "width", "1000");
            diffAndSetAttribute(this.horizon_top_bg, "height", "1000");
            this.horizon_root.appendChild(this.horizon_top_bg);
            this.horizon_bottom = document.createElementNS(Avionics.SVG.NS, "g");
            this.horizon_root.appendChild(this.horizon_bottom);
            {
                this.horizon_bottom_bg = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(this.horizon_bottom_bg, "fill", (this.horizonVisible) ? this.horizonBottomColor : "transparent");
                diffAndSetAttribute(this.horizon_bottom_bg, "x", "-500");
                diffAndSetAttribute(this.horizon_bottom_bg, "y", "0");
                diffAndSetAttribute(this.horizon_bottom_bg, "width", "1000");
                diffAndSetAttribute(this.horizon_bottom_bg, "height", "1000");
                this.horizon_bottom.appendChild(this.horizon_bottom_bg);
                let separator = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(separator, "fill", "white");
                diffAndSetAttribute(separator, "x", "-500");
                diffAndSetAttribute(separator, "y", "-1.5");
                diffAndSetAttribute(separator, "width", "1000");
                diffAndSetAttribute(separator, "height", "3");
                this.horizon_bottom.appendChild(separator);
            }
        }
        {
            let pitchContainer = document.createElement("div");
            diffAndSetAttribute(pitchContainer, "id", "Pitch");
            pitchContainer.style.top = "0%";
            pitchContainer.style.left = "0%";
            pitchContainer.style.width = "100%";
            pitchContainer.style.height = "100%";
            pitchContainer.style.position = "absolute";
            this.appendChild(pitchContainer);
            this.attitude_pitch_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.attitude_pitch_root, "width", "100%");
            diffAndSetAttribute(this.attitude_pitch_root, "height", "100%");
            diffAndSetAttribute(this.attitude_pitch_root, "viewBox", "-200 -150 400 300");
            diffAndSetAttribute(this.attitude_pitch_root, "overflow", "visible");
            diffAndSetAttribute(this.attitude_pitch_root, "style", "position:absolute; z-index: -2;");
            pitchContainer.appendChild(this.attitude_pitch_root);
            {
                this.attitude_pitch = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_pitch_root.appendChild(this.attitude_pitch);
                var x = -80;
                var y = -100;
                var w = 160;
                var h = 160;
                let pitchGraduations = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(pitchGraduations, "width", w + '');
                diffAndSetAttribute(pitchGraduations, "height", h + '');
                diffAndSetAttribute(pitchGraduations, "x", x + '');
                diffAndSetAttribute(pitchGraduations, "y", y + '');
                diffAndSetAttribute(pitchGraduations, "viewBox", x + " " + y + " " + w + " " + h);
                diffAndSetAttribute(pitchGraduations, "overflow", "hidden");
                this.attitude_pitch.appendChild(pitchGraduations);
                this.attitude_pitch_grads.push(document.createElementNS(Avionics.SVG.NS, "g"));
                pitchGraduations.appendChild(this.attitude_pitch_grads[0]);
                let maxDash = 80;
                let fontSize = 20;
                let angle = -maxDash;
                let nextAngle;
                let leftGraduationX = -26;
                let rightGraduationX = -leftGraduationX;
                let circleRadius = 4;
                while (angle <= maxDash) {
                    nextAngle = angle + 10;
                    if (angle != 0) {
                        let leftCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                        diffAndSetAttribute(leftCircle, "fill", "white");
                        diffAndSetAttribute(leftCircle, "cx", leftGraduationX + '');
                        diffAndSetAttribute(leftCircle, "cy", (pitchFactor * angle) + '');
                        diffAndSetAttribute(leftCircle, "r", circleRadius + '');
                        this.attitude_pitch_grads[0].appendChild(leftCircle);
                        let rightCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                        diffAndSetAttribute(rightCircle, "fill", "white");
                        diffAndSetAttribute(rightCircle, "cx", rightGraduationX + '');
                        diffAndSetAttribute(rightCircle, "cy", (pitchFactor * angle) + '');
                        diffAndSetAttribute(rightCircle, "r", circleRadius + '');
                        this.attitude_pitch_grads[0].appendChild(rightCircle);
                        let leftText = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetText(leftText, Math.abs(angle) + '');
                        diffAndSetAttribute(leftText, "x", (leftGraduationX - 25) + '');
                        diffAndSetAttribute(leftText, "y", (pitchFactor * angle - circleRadius + fontSize / 2) + '');
                        diffAndSetAttribute(leftText, "text-anchor", "end");
                        diffAndSetAttribute(leftText, "font-size", fontSize + '');
                        diffAndSetAttribute(leftText, "fill", "white");
                        this.attitude_pitch_grads[0].appendChild(leftText);
                        let rightText = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetText(rightText, Math.abs(angle) + '');
                        diffAndSetAttribute(rightText, "x", (rightGraduationX + 25) + '');
                        diffAndSetAttribute(rightText, "y", (pitchFactor * angle - circleRadius + fontSize / 2) + '');
                        diffAndSetAttribute(rightText, "text-anchor", "start");
                        diffAndSetAttribute(rightText, "font-size", fontSize + '');
                        diffAndSetAttribute(rightText, "fill", "white");
                        this.attitude_pitch_grads[0].appendChild(rightText);
                    }
                    angle = nextAngle;
                }
            }
        }
        {
            let attitudeContainer = document.createElement("div");
            diffAndSetAttribute(attitudeContainer, "id", "Attitude");
            attitudeContainer.style.top = "-10%";
            attitudeContainer.style.left = "-10%";
            attitudeContainer.style.width = "120%";
            attitudeContainer.style.height = "120%";
            attitudeContainer.style.position = "absolute";
            this.appendChild(attitudeContainer);
            this.attitude_bank_root = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.attitude_bank_root, "width", "100%");
            diffAndSetAttribute(this.attitude_bank_root, "height", "100%");
            diffAndSetAttribute(this.attitude_bank_root, "viewBox", "-200 -150 400 300");
            diffAndSetAttribute(this.attitude_bank_root, "overflow", "visible");
            diffAndSetAttribute(this.attitude_bank_root, "style", "position:absolute; z-index: 0");
            attitudeContainer.appendChild(this.attitude_bank_root);
            {
                this.attitude_bank = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_bank_root.appendChild(this.attitude_bank);
                let smallDashesAngle = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50];
                let bigDashesAngle = [-40, 0, 40];
                let dashHeight = 8;
                let dashWidth = 2;
                let radius = 90;
                for (let i = 0; i < smallDashesAngle.length; i++) {
                    let dash = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(dash, "x", (-dashWidth / 2) + '');
                    diffAndSetAttribute(dash, "y", (radius) + '');
                    diffAndSetAttribute(dash, "height", dashHeight + '');
                    diffAndSetAttribute(dash, "width", dashWidth + '');
                    diffAndSetAttribute(dash, "fill", "white");
                    diffAndSetAttribute(dash, "transform", "rotate(" + smallDashesAngle[i] + ",0,0)");
                    this.attitude_bank.appendChild(dash);
                }
                for (let i = 0; i < bigDashesAngle.length; i++) {
                    let dash = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(dash, "x", (-dashWidth / 2) + '');
                    diffAndSetAttribute(dash, "y", (radius - dashHeight - 5) + '');
                    diffAndSetAttribute(dash, "height", dashHeight + '');
                    diffAndSetAttribute(dash, "width", dashWidth + '');
                    diffAndSetAttribute(dash, "fill", "white");
                    diffAndSetAttribute(dash, "transform", "rotate(" + bigDashesAngle[i] + ",0,0)");
                    this.attitude_bank.appendChild(dash);
                }
            }
            {
                let cursors = document.createElementNS(Avionics.SVG.NS, "g");
                {
                    let leftUpper = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(leftUpper, "d", "M-21 -1.5 h-50 v3 h47 v10 h3 Z");
                    diffAndSetAttribute(leftUpper, "fill", "white");
                    cursors.appendChild(leftUpper);
                    let rightUpper = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(rightUpper, "d", "M21 -1.5 h50 v3 h-47 v10 h-3 Z");
                    diffAndSetAttribute(rightUpper, "fill", "white");
                    cursors.appendChild(rightUpper);
                    let centerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(centerCircle, "cx", "0");
                    diffAndSetAttribute(centerCircle, "cy", "-0.75");
                    diffAndSetAttribute(centerCircle, "r", "16");
                    diffAndSetAttribute(centerCircle, "fill", "white");
                    cursors.appendChild(centerCircle);
                    this.hiddenElementsWithBackground.push(centerCircle);
                    let centerOutsideCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(centerOutsideCircle, "cx", "0");
                    diffAndSetAttribute(centerOutsideCircle, "cy", "-0.75");
                    diffAndSetAttribute(centerOutsideCircle, "r", "32");
                    diffAndSetAttribute(centerOutsideCircle, "fill", "transparent");
                    diffAndSetAttribute(centerOutsideCircle, "stroke", "white");
                    diffAndSetAttribute(centerOutsideCircle, "stroke-width", "3");
                    cursors.appendChild(centerOutsideCircle);
                    this.hiddenElementsWithBackground.push(centerOutsideCircle);
                }
                this.attitude_bank_root.appendChild(cursors);
                this.slipSkidTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.slipSkidTriangle, "d", "M0 100 l-5 10 h10 Z");
                diffAndSetAttribute(this.slipSkidTriangle, "fill", "white");
                this.attitude_bank_root.appendChild(this.slipSkidTriangle);
                this.slipSkid = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(this.slipSkid, "d", "M-5 111 l-2 3 h14 l-2 -3 Z");
                diffAndSetAttribute(this.slipSkid, "fill", "white");
                this.attitude_bank_root.appendChild(this.slipSkid);
            }
        }
        this.applyAttributes();
    }
    applyAttributes() {
        if (this.horizon_bottom)
            diffAndSetAttribute(this.horizon_bottom, "transform", "rotate(" + this.bankAngle + ", 0, 0) translate(0," + (this.pitchAngle * this.horizonAngleFactor) + ")");
        if (this.horizon_bottom_bg)
            diffAndSetAttribute(this.horizon_bottom_bg, "fill", (this.horizonVisible) ? this.horizonBottomColor : "transparent");
        if (this.horizon_top_bg)
            diffAndSetAttribute(this.horizon_top_bg, "fill", (this.horizonVisible) ? this.horizonTopColor : "transparent");
        if (this.attitude_pitch)
            diffAndSetAttribute(this.attitude_pitch, "transform", "rotate(" + this.bankAngle + ", 0, 0)");
        for (let i = 0; i < this.attitude_pitch_grads.length; i++)
            diffAndSetAttribute(this.attitude_pitch_grads[i], "transform", "translate(0," + (this.pitchAngle * this.pitchAngleFactor) + ")");
        if (this.slipSkid)
            diffAndSetAttribute(this.slipSkid, "transform", "rotate(" + this.bankAngle + ", 0, 0) translate(" + (this.slipSkidValue * 40) + ", 0)");
        if (this.slipSkidTriangle)
            diffAndSetAttribute(this.slipSkidTriangle, "transform", "rotate(" + this.bankAngle + ", 0, 0)");
        if (this.radioAltitude && this.radioAltitudeRotate)
            diffAndSetAttribute(this.radioAltitude, "transform", "rotate(" + this.bankAngle + ", 0, 0)");
        if (this.cj4_FlightDirector != null) {
            if (this.cj4_FlightDirectorActive) {
                diffAndSetAttribute(this.cj4_FlightDirector, "transform", "rotate(" + (-this.cj4_FlightDirectorBank) + ") translate(0 " + ((this.pitchAngle - this.cj4_FlightDirectorPitch) * this.pitchAngleFactor) + ")");
                diffAndSetAttribute(this.cj4_FlightDirector, "display", "");
            }
            else {
                diffAndSetAttribute(this.cj4_FlightDirector, "display", "none");
            }
        }
        for (let i in this.hiddenElementsWithBackground) {
            diffAndSetAttribute(this.hiddenElementsWithBackground[i], "visibility", (this.horizonVisible) ? "visible" : "hidden");
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "pitch":
                this.pitchAngle = parseFloat(newValue);
                break;
            case "bank":
                this.bankAngle = parseFloat(newValue);
                break;
            case "slip_skid":
                this.slipSkidValue = parseFloat(newValue);
                break;
            case "hud":
                this.isHud = newValue == "true";
                break;
            case "background":
                this.horizonVisible = newValue == "true";
                break;
            case "flight_director-active":
                this.cj4_FlightDirectorActive = newValue == "true";
                break;
            case "flight_director-pitch":
                this.cj4_FlightDirectorPitch = parseFloat(newValue);
                break;
            case "flight_director-bank":
                this.cj4_FlightDirectorBank = parseFloat(newValue);
                break;
            case "radio_altitude":
                this.radioAltitudeValue = parseFloat(newValue);
                break;
            case "decision_height":
                if (this.radioDecisionHeight) {
                    let val = parseFloat(newValue);
                    diffAndSetText(this.radioDecisionHeight, fastToFixed(val, 0));
                }
                break;
            default:
                return;
        }
        this.applyAttributes();
    }
    update(_deltaTime) {
        if (this.flightDirector != null) {
            this.flightDirector.refresh(_deltaTime);
        }
        this.updateRadioAltitude(_deltaTime);
    }
    updateRadioAltitude(_dt) {
        let val = Math.floor(this.radioAltitudeValue);
        var xyz = Simplane.getOrientationAxis();
        if ((val <= 2500) && (Math.abs(xyz.bank) < Math.PI * 0.35)) {
            this.radioRefreshTimer -= _dt / 1000;
            if (this.radioRefreshTimer <= 0) {
                this.radioRefreshTimer = 0.15;
                let textVal;
                {
                    let absVal = Math.abs(val);
                    if (absVal <= 10)
                        textVal = absVal;
                    else if (absVal <= 50)
                        textVal = absVal - (absVal % 5);
                    else
                        textVal = absVal - (absVal % 10);
                }
                diffAndSetText(this.radioAltitude, (textVal * Math.sign(val)) + '');
                if (this.radioAltitudeColorLimit > 0) {
                    if (val >= this.radioAltitudeColorLimit)
                        diffAndSetAttribute(this.radioAltitude, "fill", this.radioAltitudeColorOk);
                    else
                        diffAndSetAttribute(this.radioAltitude, "fill", this.radioAltitudeColorBad);
                }
                diffAndSetAttribute(this.radioAltitudeGroup, "visibility", "visible");
            }
        }
        else {
            diffAndSetAttribute(this.radioAltitudeGroup, "visibility", "hidden");
            this.radioRefreshTimer = 0.0;
        }
    }
}
var Jet_PFD_FlightDirector;
(function (Jet_PFD_FlightDirector) {
    class DisplayBase {
        constructor(_root) {
            this.group = null;
            this.isActive = false;
            if (_root != null) {
                this.group = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.group, "id", this.getGroupName());
                diffAndSetAttribute(this.group, "display", "none");
                this.create();
                _root.appendChild(this.group);
            }
        }
        set active(_active) {
            if (_active != this.isActive) {
                this.isActive = _active;
                if (this.group != null) {
                    diffAndSetAttribute(this.group, "display", this.isActive ? "block" : "none");
                }
            }
        }
        get active() {
            return this.isActive;
        }
        calculatePosXFromBank(_startBank, _targetBank) {
            var bankDiff = _targetBank - _startBank;
            var angleDiff = Math.abs(bankDiff) % 360;
            if (angleDiff > 180) {
                angleDiff = 360 - angleDiff;
            }
            if (angleDiff > DisplayBase.HEADING_MAX_ANGLE) {
                angleDiff = DisplayBase.HEADING_MAX_ANGLE;
            }
            var sign = (((bankDiff >= 0) && (bankDiff <= 180)) || ((bankDiff <= -180) && (bankDiff >= -360))) ? -1 : 1;
            angleDiff *= sign;
            var x = angleDiff * DisplayBase.HEADING_ANGLE_TO_POS;
            return x;
        }
        calculatePosYFromPitch(_startPitch, _targetPitch) {
            var pitchDiff = _targetPitch - _startPitch;
            var y = Utils.Clamp(pitchDiff * DisplayBase.PITCH_ANGLE_TO_POS, -DisplayBase.PITCH_MAX_POS_Y, DisplayBase.PITCH_MAX_POS_Y);
            return y;
        }
        createCircle(_radius) {
            var circle = document.createElementNS(Avionics.SVG.NS, "circle");
            diffAndSetAttribute(circle, "cx", "0");
            diffAndSetAttribute(circle, "cy", "0");
            diffAndSetAttribute(circle, "r", _radius + '');
            this.applyStyle(circle);
            return circle;
        }
        createLine(_x1, _y1, _x2, _y2) {
            var line = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(line, "x1", _x1 + '');
            diffAndSetAttribute(line, "y1", _y1 + '');
            diffAndSetAttribute(line, "x2", _x2 + '');
            diffAndSetAttribute(line, "y2", _y2 + '');
            this.applyStyle(line);
            return line;
        }
        applyStyle(_element) {
            if (_element != null) {
                diffAndSetAttribute(_element, "stroke", this.getColour());
                diffAndSetAttribute(_element, "stroke-width", this.getStrokeWidth());
                diffAndSetAttribute(_element, "fill", "none");
            }
        }
        getStrokeWidth() { return "2.5"; }
    }
    DisplayBase.HEADING_MAX_POS_X = 60;
    DisplayBase.HEADING_MAX_ANGLE = 10;
    DisplayBase.HEADING_ANGLE_TO_POS = DisplayBase.HEADING_MAX_POS_X / DisplayBase.HEADING_MAX_ANGLE;
    DisplayBase.PITCH_MAX_POS_Y = 100;
    DisplayBase.PITCH_MAX_ANGLE = 15;
    DisplayBase.PITCH_ANGLE_TO_POS = DisplayBase.PITCH_MAX_POS_Y / DisplayBase.PITCH_MAX_ANGLE;
    class CommandBarsDisplay extends DisplayBase {
        constructor() {
            super(...arguments);
            this._pitchIsNotReadyYet = true;
            this._fdPitch = 0;
            this._fdBank = 0;
        }
        getGroupName() {
            return "CommandBars";
        }
        create() {
            var halfLineLength = this.getLineLength() * 0.5;
            this.headingLine = this.createLine(0, -halfLineLength, 0, halfLineLength);
            this.group.appendChild(this.headingLine);
            this.pitchLine = this.createLine(-halfLineLength, 0, halfLineLength, 0);
            this.group.appendChild(this.pitchLine);
        }
        refresh(_deltaTime) {
            if (this.headingLine != null) {
                let currentPlaneBank = Simplane.getBank();
                let currentFDBank = Simplane.getFlightDirectorBank();
                let altAboveGround = Simplane.getAltitudeAboveGround();
                if (altAboveGround > 0 && altAboveGround < 10) {
                    currentFDBank = 0;
                }
                this._fdBank += (currentFDBank - this._fdBank) * Math.min(1.0, _deltaTime * 0.001);
                var lineX = Math.max(-1.0, Math.min(1.0, (currentPlaneBank - this._fdBank) / this.getFDBankLimit())) * this.getFDBankDisplayLimit();
                diffAndSetAttribute(this.headingLine, "transform", "translate(" + lineX + ", 0)");
            }
            if (this.pitchLine != null) {
                let currentPlanePitch = Simplane.getPitch();
                let currentFDPitch = Simplane.getFlightDirectorPitch();
                let altAboveGround = Simplane.getAltitudeAboveGround();
                let _bForcedFdPitchThisFrame = false;
                if (altAboveGround > 0 && altAboveGround < 10) {
                    currentFDPitch = -8;
                }
                if (this._pitchIsNotReadyYet) {
                    this._pitchIsNotReadyYet = Math.abs(currentFDPitch) < 2;
                }
                if (this._pitchIsNotReadyYet) {
                    currentFDPitch = currentPlanePitch;
                }
                this._fdPitch += (currentFDPitch - this._fdPitch) * Math.min(1.0, _deltaTime * 0.001);
                var lineY = this.calculatePosYFromPitch(currentPlanePitch, this._fdPitch);
                diffAndSetAttribute(this.pitchLine, "transform", "translate(0, " + lineY + ")");
            }
        }
        getLineLength() { return 140; }
        getStrokeWidth() { return "4"; }
        getFDBankLimit() { return 30; }
        getFDBankDisplayLimit() { return 75; }
    }
    class CommandBarsDisplay_Airbus extends CommandBarsDisplay {
        getLineLength() { return 160; }
        getColour() { return "#24FF00"; }
        getFDBankLimit() { return 30; }
        getFDBankDisplayLimit() { return 75; }
    }
    class CommandBarsDisplay_B747 extends CommandBarsDisplay {
        getColour() { return "magenta"; }
        getFDBankLimit() { return 30; }
        getFDBankDisplayLimit() { return 50; }
    }
    class CommandBarsDisplay_AS01B extends CommandBarsDisplay {
        getLineLength() { return 175; }
        getColour() { return "magenta"; }
        getFDBankLimit() { return 30; }
        getFDBankDisplayLimit() { return 50; }
    }
    class PathVectorDisplay extends DisplayBase {
        getGroupName() {
            return "PathVector";
        }
        create() {
            var circleRadius = this.getCircleRadius();
            var verticalLineLength = this.getVerticalLineLength();
            var horizontalLineLength = this.getHorizontalLineLength();
            this.group.appendChild(this.createCircle(circleRadius));
            this.group.appendChild(this.createLine(-circleRadius, 0, -(circleRadius + horizontalLineLength), 0));
            this.group.appendChild(this.createLine(circleRadius, 0, (circleRadius + horizontalLineLength), 0));
            this.group.appendChild(this.createLine(0, -circleRadius, 0, -(circleRadius + verticalLineLength)));
        }
        refresh(_deltaTime) {
            if (this.group != null) {
                var originalBodyVelocityZ = SimVar.GetSimVarValue("VELOCITY BODY Z", "feet per second");
                if (originalBodyVelocityZ >= PathVectorDisplay.MIN_SPEED_TO_DISPLAY) {
                    var originalBodyVelocityX = SimVar.GetSimVarValue("VELOCITY BODY X", "feet per second");
                    var originalBodyVelocityY = SimVar.GetSimVarValue("VELOCITY WORLD Y", "feet per second");
                    var originalBodyVelocityXSquared = originalBodyVelocityX * originalBodyVelocityX;
                    var originalBodyVelocityYSquared = originalBodyVelocityY * originalBodyVelocityY;
                    var originalBodyVelocityZSquared = originalBodyVelocityZ * originalBodyVelocityZ;
                    var currentHeading = 0;
                    {
                        var bodyNorm = Math.sqrt(originalBodyVelocityXSquared + originalBodyVelocityZSquared);
                        var bodyNormInv = 1 / bodyNorm;
                        var bodyVelocityX = originalBodyVelocityX * bodyNormInv;
                        var bodyVelocityZ = originalBodyVelocityZ * bodyNormInv;
                        bodyNorm = Math.sqrt((bodyVelocityX * bodyVelocityX) + (bodyVelocityZ * bodyVelocityZ));
                        var angle = bodyVelocityZ / bodyNorm;
                        angle = Utils.Clamp(angle, -1, 1);
                        currentHeading = Math.acos(angle) * (180 / Math.PI);
                        if (bodyVelocityX > 0) {
                            currentHeading *= -1;
                        }
                    }
                    var currentPitch = 0;
                    {
                        var bodyNorm = Math.sqrt(originalBodyVelocityYSquared + originalBodyVelocityZSquared);
                        var bodyNormInv = 1 / bodyNorm;
                        var bodyVelocityY = originalBodyVelocityY * bodyNormInv;
                        var bodyVelocityZ = originalBodyVelocityZ * bodyNormInv;
                        bodyNorm = Math.sqrt((bodyVelocityY * bodyVelocityY) + (bodyVelocityZ * bodyVelocityZ));
                        var angle = bodyVelocityZ / bodyNorm;
                        angle = Utils.Clamp(angle, -1, 1);
                        currentPitch = Math.acos(angle) * (180 / Math.PI);
                        if (bodyVelocityY > 0) {
                            currentPitch *= -1;
                        }
                    }
                    var x = this.calculatePosXFromBank(0, currentHeading);
                    var y = this.calculatePosYFromPitch(Simplane.getPitch(), currentPitch);
                    diffAndSetAttribute(this.group, "transform", "translate(" + x + ", " + y + ")");
                }
                else {
                    diffAndSetAttribute(this.group, "transform", "translate(0, 0)");
                }
            }
        }
    }
    PathVectorDisplay.MIN_SPEED_TO_DISPLAY = 25;
    class FPV_Airbus extends PathVectorDisplay {
        getColour() { return "#24FF00"; }
        getCircleRadius() { return 10; }
        getVerticalLineLength() { return 15; }
        getHorizontalLineLength() { return 15; }
    }
    class FPV_Boeing extends PathVectorDisplay {
        getColour() { return "white"; }
        getCircleRadius() { return 10; }
        getVerticalLineLength() { return 15; }
        getHorizontalLineLength() { return 40; }
    }
    class FPD_Airbus extends DisplayBase {
        getGroupName() {
            return "FlightPathDirector";
        }
        create() {
            this.group.appendChild(this.createCircle(FPD_Airbus.CIRCLE_RADIUS));
            var path = document.createElementNS(Avionics.SVG.NS, "path");
            var d = [
                "M", -(FPD_Airbus.LINE_LENGTH * 0.5), ", 0",
                " l", -FPD_Airbus.TRIANGLE_LENGTH, ",", -(FPD_Airbus.TRIANGLE_HEIGHT * 0.5),
                " l0,", FPD_Airbus.TRIANGLE_HEIGHT,
                " l", FPD_Airbus.TRIANGLE_LENGTH, ",", -(FPD_Airbus.TRIANGLE_HEIGHT * 0.5),
                " l", FPD_Airbus.LINE_LENGTH, ",0",
                " l", FPD_Airbus.TRIANGLE_LENGTH, ",", -(FPD_Airbus.TRIANGLE_HEIGHT * 0.5),
                " l0,", FPD_Airbus.TRIANGLE_HEIGHT,
                " l", -FPD_Airbus.TRIANGLE_LENGTH, ",", -(FPD_Airbus.TRIANGLE_HEIGHT * 0.5)
            ].join("");
            diffAndSetAttribute(path, "d", d);
            this.applyStyle(path);
            this.group.appendChild(path);
        }
        refresh(_deltaTime) {
            if (this.group != null) {
                var x = this.calculatePosXFromBank(Simplane.getBank(), Simplane.getFlightDirectorBank());
                var y = this.calculatePosYFromPitch(Simplane.getPitch(), Simplane.getFlightDirectorPitch());
                var angle = -Simplane.getBank();
                diffAndSetAttribute(this.group, "transform", "translate(" + x + ", " + y + ") rotate(" + angle + ")");
            }
        }
        getColour() { return "#24FF00"; }
    }
    FPD_Airbus.CIRCLE_RADIUS = 5;
    FPD_Airbus.LINE_LENGTH = 40;
    FPD_Airbus.TRIANGLE_LENGTH = 20;
    FPD_Airbus.TRIANGLE_HEIGHT = 10;
    class FPA_Boeing extends DisplayBase {
        getGroupName() {
            return "FlightPathAngle";
        }
        create() {
            var path = document.createElementNS(Avionics.SVG.NS, "path");
            var d = [
                "M", -FPA_Boeing.LINE_OFFSET.x, ",", -FPA_Boeing.LINE_OFFSET.y,
                " l", -FPA_Boeing.LINE_LENGTH, ",0",
                " m0,", (FPA_Boeing.LINE_OFFSET.y * 2),
                " l", FPA_Boeing.LINE_LENGTH, ",0",
                " m", (FPA_Boeing.LINE_OFFSET.x * 2), ",0",
                " l", FPA_Boeing.LINE_LENGTH, ",0",
                " m0,", -(FPA_Boeing.LINE_OFFSET.y * 2),
                " l", -FPA_Boeing.LINE_LENGTH, ",0",
            ].join("");
            diffAndSetAttribute(path, "d", d);
            this.applyStyle(path);
            this.group.appendChild(path);
        }
        refresh(_deltaTime) {
            if (this.group != null) {
                var y = this.calculatePosYFromPitch(0, Simplane.getAutoPilotFlightPathAngle());
                diffAndSetAttribute(this.group, "transform", "translate(0, " + y + ") rotate(0)");
            }
        }
        getColour() { return "white"; }
    }
    FPA_Boeing.LINE_LENGTH = 30;
    FPA_Boeing.LINE_OFFSET = new Vec2(30, 6);
    class Handler {
        constructor() {
            this.root = null;
            this.displayMode = new Array();
            this.fFDPitchOffset = 0.0;
        }
        init(_root) {
            this.root = _root;
            if (this.root != null) {
                this.initDefaultValues();
                var group = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(group, "id", "FlightDirectorDisplay");
                diffAndSetAttribute(group, "transform", "translate(0, " + this.fFDPitchOffset + ")");
                this.createDisplayModes(group);
                this.root.appendChild(group);
            }
        }
        refresh(_deltaTime) {
            this.refreshActiveModes();
            for (var mode = 0; mode < this.displayMode.length; ++mode) {
                if ((this.displayMode[mode] != null) && this.displayMode[mode].active) {
                    this.displayMode[mode].refresh(_deltaTime);
                }
            }
        }
        setModeActive(_mode, _active) {
            if ((_mode >= 0) && (_mode < this.displayMode.length) && (this.displayMode[_mode] != null)) {
                this.displayMode[_mode].active = _active;
            }
        }
    }
    Jet_PFD_FlightDirector.Handler = Handler;
    class A320_Neo_Handler extends Handler {
        createDisplayModes(_group) {
            this.displayMode.push(new CommandBarsDisplay_Airbus(_group));
            this.displayMode.push(new FPV_Airbus(_group));
            this.displayMode.push(new FPD_Airbus(_group));
        }
        refreshActiveModes() {
            var fdActive = (Simplane.getAutoPilotFlightDirectorActive(1));
            var trkfpaMode = Simplane.getAutoPilotTRKFPAModeActive();
            this.setModeActive(0, fdActive && !trkfpaMode);
            this.setModeActive(1, trkfpaMode);
            this.setModeActive(2, fdActive && trkfpaMode);
        }
        initDefaultValues() {
            this.fFDPitchOffset = -2.5;
        }
    }
    Jet_PFD_FlightDirector.A320_Neo_Handler = A320_Neo_Handler;
    class B747_8_Handler extends Handler {
        createDisplayModes(_group) {
            this.displayMode.push(new CommandBarsDisplay_B747(_group));
            this.displayMode.push(new FPV_Boeing(_group));
        }
        refreshActiveModes() {
            var fdActive = (Simplane.getAutoPilotFlightDirectorActive(1));
            this.setModeActive(0, fdActive);
            this.setModeActive(1, fdActive && Simplane.getAutoPilotFPAModeActive());
        }
        initDefaultValues() {
            this.fFDPitchOffset = 1.75;
        }
    }
    Jet_PFD_FlightDirector.B747_8_Handler = B747_8_Handler;
    class AS01B_Handler extends Handler {
        createDisplayModes(_group) {
            this.displayMode.push(new CommandBarsDisplay_AS01B(_group));
            this.displayMode.push(new FPV_Boeing(_group));
            this.displayMode.push(new FPA_Boeing(_group));
        }
        refreshActiveModes() {
            var fdActive = (Simplane.getAutoPilotFlightDirectorActive(1));
            var fpaMode = Simplane.getAutoPilotFPAModeActive();
            this.setModeActive(0, fdActive);
            this.setModeActive(1, fdActive && fpaMode);
            this.setModeActive(2, fdActive && fpaMode);
        }
        initDefaultValues() {
            this.fFDPitchOffset = -1.75;
        }
    }
    Jet_PFD_FlightDirector.AS01B_Handler = AS01B_Handler;
})(Jet_PFD_FlightDirector || (Jet_PFD_FlightDirector = {}));
customElements.define("jet-pfd-attitude-indicator", Jet_PFD_AttitudeIndicator);
//# sourceMappingURL=AttitudeIndicator.js.map