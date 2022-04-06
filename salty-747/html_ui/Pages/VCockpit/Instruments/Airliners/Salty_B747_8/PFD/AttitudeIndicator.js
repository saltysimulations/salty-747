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
        this.isFPVon = false;
        this._aircraft = Aircraft.A320_NEO;
    }
    static get dynamicAttributes() {
        return [
            "pitch",
            "bank",
            "horizon",
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
        if (!this.isFPVon) {
            SimVar.SetSimVarValue("L:SALTY_FPV_ON", "bool", true);
            this.isFPVon = true;
        }
        else {
            SimVar.SetSimVarValue("L:SALTY_FPV_ON", "bool", false);
            this.isFPVon = false;
        }
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
    }
    construct() {
        this.destroyLayout();
        if (this.aircraft == Aircraft.CJ4)
            this.construct_CJ4();
        else if (this.aircraft == Aircraft.B747_8)
            this.construct_B747_8();
        else if (this.aircraft == Aircraft.AS01B)
            this.construct_AS01B();
        else
            this.construct_A320_Neo();
    }
    construct_A320_Neo() {
    }
    construct_B747_8() {
        SimVar.SetSimVarValue("L:SALTY_FD_TAKEOFF_PHASE", "Enum", 0);
        let pitchFactor = -6.5;
        this.pitchAngleFactor = pitchFactor;
        this.horizonAngleFactor = pitchFactor * 1.2;
        {
            this.horizon_root = document.createElementNS(Avionics.SVG.NS, "svg");
            this.horizon_root.setAttribute("id", "Background");
            this.horizon_root.setAttribute("width", "100%");
            this.horizon_root.setAttribute("height", "100%");
            this.horizon_root.setAttribute("viewBox", "-200 -200 400 300");
            this.horizon_root.setAttribute("x", "-100");
            this.horizon_root.setAttribute("y", "-100");
            this.horizon_root.setAttribute("overflow", "visible");
            this.horizon_root.setAttribute("style", "position:absolute; z-index: -3; width: 100%; height:100%;");
            this.appendChild(this.horizon_root);
            this.horizonTopColor = "#1469BC"; // #135B82
            this.horizonBottomColor = "#764D17"; // #726B31
            this.horizon_top_bg = document.createElementNS(Avionics.SVG.NS, "rect");
            this.horizon_top_bg.setAttribute("fill", (this.horizonVisible) ? this.horizonTopColor : "transparent");
            this.horizon_top_bg.setAttribute("x", "-1000");
            this.horizon_top_bg.setAttribute("y", "-1000");
            this.horizon_top_bg.setAttribute("width", "2000");
            this.horizon_top_bg.setAttribute("height", "2000");
            this.horizon_root.appendChild(this.horizon_top_bg);
            this.horizon_bottom = document.createElementNS(Avionics.SVG.NS, "g");
            this.horizon_root.appendChild(this.horizon_bottom);
            {
                this.horizon_bottom_bg = document.createElementNS(Avionics.SVG.NS, "rect");
                this.horizon_bottom_bg.setAttribute("fill", (this.horizonVisible) ? this.horizonBottomColor : "transparent");
                this.horizon_bottom_bg.setAttribute("x", "-1500");
                this.horizon_bottom_bg.setAttribute("y", "-3");
                this.horizon_bottom_bg.setAttribute("width", "3000");
                this.horizon_bottom_bg.setAttribute("height", "3000");
                this.horizon_bottom.appendChild(this.horizon_bottom_bg);
                let separator = document.createElementNS(Avionics.SVG.NS, "rect");
                separator.setAttribute("fill", "white");
                separator.setAttribute("x", "-1500");
                separator.setAttribute("y", "-3");
                separator.setAttribute("width", "3000");
                separator.setAttribute("height", "3");
                this.horizon_bottom.appendChild(separator);
            }
        }
        {
            let pitchContainer = document.createElement("div");
            pitchContainer.setAttribute("id", "Pitch");
            pitchContainer.style.top = "-14%";
            pitchContainer.style.left = "-11%";
            pitchContainer.style.width = "120%";
            pitchContainer.style.height = "120%";
            pitchContainer.style.position = "absolute";
            this.appendChild(pitchContainer);
            this.attitude_pitch_root = document.createElementNS(Avionics.SVG.NS, "svg");
            this.attitude_pitch_root.setAttribute("width", "100%");
            this.attitude_pitch_root.setAttribute("height", "100%");
            this.attitude_pitch_root.setAttribute("viewBox", "-200 -200 400 300");
            this.attitude_pitch_root.setAttribute("overflow", "visible");
            this.attitude_pitch_root.setAttribute("style", "position:absolute; z-index: -2;");
            pitchContainer.appendChild(this.attitude_pitch_root);
            {
                this.attitude_pitch = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_pitch_root.appendChild(this.attitude_pitch);
                var x = -115;
                var y = -110;
                var w = 230;
                var h = 265;
                let pitchGraduations = document.createElementNS(Avionics.SVG.NS, "svg");
                pitchGraduations.setAttribute("width", w.toString());
                pitchGraduations.setAttribute("height", h.toString());
                pitchGraduations.setAttribute("x", x.toString());
                pitchGraduations.setAttribute("y", y.toString());
                pitchGraduations.setAttribute("viewBox", x + " " + y + " " + w + " " + h);
                pitchGraduations.setAttribute("overflow", "hidden");
                this.attitude_pitch.appendChild(pitchGraduations);
                this.attitude_pitch_grads.push(document.createElementNS(Avionics.SVG.NS, "g"));
                pitchGraduations.appendChild(this.attitude_pitch_grads[0]);
                let maxDash = 80;
                let fullPrecisionLowerLimit = -80;
                let fullPrecisionUpperLimit = 80;
                let halfPrecisionLowerLimit = -30;
                let halfPrecisionUpperLimit = 45;
                let bigWidth = 110;
                let bigHeight = 2;
                let mediumWidth = 60;
                let mediumHeight = 2;
                let smallWidth = 40;
                let smallHeight = 2;
                let fontSize = 15;
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
                        rect.setAttribute("fill", "white");
                        rect.setAttribute("x", (-width / 2).toString());
                        rect.setAttribute("y", (pitchFactor * angle - height / 2).toString());
                        rect.setAttribute("width", width.toString());
                        rect.setAttribute("height", height.toString());
                        this.attitude_pitch_grads[0].appendChild(rect);
                        if (text) {
                            let leftText = document.createElementNS(Avionics.SVG.NS, "text");
                            leftText.textContent = Math.abs(angle).toString();
                            leftText.setAttribute("x", ((-width / 2) - 5).toString());
                            leftText.setAttribute("y", ((pitchFactor * angle - height / 2 + fontSize / 2) - 1).toString());
                            leftText.setAttribute("text-anchor", "end");
                            leftText.setAttribute("font-size", fontSize.toString());
                            leftText.setAttribute("font-family", "BoeingEFIS");
                            leftText.setAttribute("fill", "white");
                            this.attitude_pitch_grads[0].appendChild(leftText);
                            let rightText = document.createElementNS(Avionics.SVG.NS, "text");
                            rightText.textContent = Math.abs(angle).toString();
                            rightText.setAttribute("x", ((width / 2) + 5).toString());
                            rightText.setAttribute("y", ((pitchFactor * angle - height / 2 + fontSize / 2) - 1).toString());
                            rightText.setAttribute("text-anchor", "start");
                            rightText.setAttribute("font-size", fontSize.toString());
                            rightText.setAttribute("font-family", "BoeingEFIS");
                            rightText.setAttribute("fill", "white");
                            this.attitude_pitch_grads[0].appendChild(rightText);
                        }
                    }
                    angle = nextAngle;
                }
            }
        }
        {
            this.masks = document.createElementNS(Avionics.SVG.NS, "svg");
            this.masks.setAttribute("id", "Masks");
            this.masks.setAttribute("viewBox", "0 0 500 500");
            this.masks.setAttribute("overflow", "visible");
            this.masks.setAttribute("style", "position:absolute; z-index: -1; top:-61%; left: -68.3%; width: 250%; height:250%;");
            this.appendChild(this.masks);
            {
                let topMask = document.createElementNS(Avionics.SVG.NS, "path");
                topMask.setAttribute("d", "M 0 0 L 0 250 L 123 250 L 123 157 C 123 157, 125 137, 143 137 L 233 137 L 315 137 C 315 137, 333 137, 335 157 L 335 250 L 500 250 L 500 0 Z");
                topMask.setAttribute("fill", "black");
                topMask.setAttribute("stroke", "black");
                this.masks.appendChild(topMask);
                let bottomMask = document.createElementNS(Avionics.SVG.NS, "path");
                bottomMask.setAttribute("d", "M 0 500 L 0 250 L 123 250 L 123 343 C 123 343, 125 363, 143 363 L 233 363 L 315 363 C 315 363, 333 363, 335 343 L 335 250 L 500 250 L 500 500 Z");
                bottomMask.setAttribute("fill", "black");
                bottomMask.setAttribute("stroke", "black");
                this.masks.appendChild(bottomMask);
            }
        }
        {
            let attitudeContainer = document.createElement("div");
            attitudeContainer.setAttribute("id", "Attitude");
            attitudeContainer.style.top = "-14%";
            attitudeContainer.style.left = "-11%";
            attitudeContainer.style.width = "120%";
            attitudeContainer.style.height = "120%";
            attitudeContainer.style.position = "absolute";
            this.appendChild(attitudeContainer);
            this.attitude_bank_root = document.createElementNS(Avionics.SVG.NS, "svg");
            this.attitude_bank_root.setAttribute("width", "100%");
            this.attitude_bank_root.setAttribute("height", "100%");
            this.attitude_bank_root.setAttribute("viewBox", "-200 -218 400 300");
            this.attitude_bank_root.setAttribute("overflow", "visible");
            this.attitude_bank_root.setAttribute("style", "position:absolute; z-index: 0");
            attitudeContainer.appendChild(this.attitude_bank_root);
            {
                this.attitude_bank = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_bank_root.appendChild(this.attitude_bank);
                let topTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                topTriangle.setAttribute("d", "M0 -152 l-8 -12 l16 0 Z");
                topTriangle.setAttribute("fill", "white");
                this.attitude_bank.appendChild(topTriangle);
                let smallDashesAngle = [-60, -45, -30, -20, -10, 10, 20, 30, 45, 60];
                let smallDashesHeight = [13, 13, 26, 13, 13, 13, 13, 26, 13, 13];
                let radius = 131;
                let offsetY = 22;
                for (let i = 0; i < smallDashesAngle.length; i++) {
                    let dash = document.createElementNS(Avionics.SVG.NS, "line");
                    dash.setAttribute("x1", "0");
                    dash.setAttribute("y1", (-radius - offsetY).toString());
                    dash.setAttribute("x2", "0");
                    dash.setAttribute("y2", (-radius - smallDashesHeight[i] - offsetY).toString());
                    dash.setAttribute("stroke", "white");
                    dash.setAttribute("stroke-width", "2");
                    dash.setAttribute("transform", "rotate(" + smallDashesAngle[i] + " 0 " + (-offsetY).toString() + ")");
                    this.attitude_bank.appendChild(dash);
                }
            }
            {

                let cursors = document.createElementNS(Avionics.SVG.NS, "g");
                this.attitude_bank_root.appendChild(cursors);
                
                
                let centerRectBG = document.createElementNS(Avionics.SVG.NS, "rect");
                centerRectBG.setAttribute("x", "-4");
                centerRectBG.setAttribute("y", "-23");
                centerRectBG.setAttribute("height", "8");
                centerRectBG.setAttribute("width", "8");
                centerRectBG.setAttribute("stroke", "none");
                centerRectBG.setAttribute("fill", "black");
                cursors.appendChild(centerRectBG); 
                let leftUpper = document.createElementNS(Avionics.SVG.NS, "path");
                leftUpper.setAttribute("d", "M-105 -15 l0 -8 l55 0 l0 22 l-7 0 l0 -14 l-40 0 Z");
                leftUpper.setAttribute("fill", "black");
                leftUpper.setAttribute("stroke", "white");
                leftUpper.setAttribute("stroke-width", "1.5");
                leftUpper.setAttribute("stroke-opacity", "1.0");
                cursors.appendChild(leftUpper);
                let rightUpper = document.createElementNS(Avionics.SVG.NS, "path");
                rightUpper.setAttribute("d", "M105 -15 l0 -8 l-55 0 l0 22 l7 0 l0 -14 l40 -0 Z");
                rightUpper.setAttribute("fill", "black");
                rightUpper.setAttribute("stroke", "white");
                rightUpper.setAttribute("stroke-width", "1.5");
                rightUpper.setAttribute("stroke-opacity", "1.0");
                cursors.appendChild(rightUpper);
                this.slipSkidTriangle = document.createElementNS(Avionics.SVG.NS, "path");
                this.slipSkidTriangle.setAttribute("d", "M0 -151 l-10 15 l20 0 Z");
                this.slipSkidTriangle.setAttribute("fill", "transparent");
                this.slipSkidTriangle.setAttribute("stroke", "white");
                this.slipSkidTriangle.setAttribute("stroke-width", "1.5");
                this.attitude_bank_root.appendChild(this.slipSkidTriangle);
                this.slipSkid = document.createElementNS(Avionics.SVG.NS, "path");
                this.slipSkid.setAttribute("d", "M-10 -136 L-10 -131 L10 -131 L10 -136 Z");
                this.slipSkid.setAttribute("fill", "transparent");
                this.slipSkid.setAttribute("stroke", "white");
                this.slipSkid.setAttribute("stroke-width", "1.5");
                this.attitude_bank_root.appendChild(this.slipSkid);
            }
            {
                this.pitchLimitIndicatorGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.leftPLI = document.createElementNS(Avionics.SVG.NS, "path");
                this.leftPLI.setAttribute("d", "M -70 -20 L -64 -20 L -70 -29 L -64 -20 L -58 -20 L -64 -29 L -58 -20 L -52 -20 L -58 -29 L -52 -20 L -46 -20 L -46 -14 L -46 -20 Z");
                this.rightPLI = document.createElementNS(Avionics.SVG.NS, "path");
                this.rightPLI.setAttribute("d", "M 70 -20 L 64 -20 L 70 -29 L 64 -20 L 58 -20 L 64 -29 L 58 -20 L 52 -20 L 58 -29 L 52 -20 L 46 -20 L 46 -14 L 46 -20 Z");
                this.pitchLimitIndicatorGroup.setAttribute("stroke", "#ffc400");
                this.pitchLimitIndicatorGroup.setAttribute("stroke-width", "2");
                this.pitchLimitIndicatorGroup.setAttribute("stroke-opacity", "1.0");
                this.pitchLimitIndicatorGroup.appendChild(this.leftPLI);
                this.pitchLimitIndicatorGroup.appendChild(this.rightPLI);
                this.attitude_bank_root.appendChild(this.pitchLimitIndicatorGroup);
            }
            //New CenterRectGroup allows FD bars to be drawn correctly underneath center rect.
            {
                let centerRectGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.flightDirector = new Jet_PFD_FlightDirector.B747_8_Handler();
                this.flightDirector.init(this.attitude_bank_root);
                this.applyAttributes();
                this.attitude_bank_root.appendChild(centerRectGroup);
                let centerRect = document.createElementNS(Avionics.SVG.NS, "rect");
                centerRect.setAttribute("x", "-4");
                centerRect.setAttribute("y", "-23");
                centerRect.setAttribute("height", "8");
                centerRect.setAttribute("width", "8");
                centerRect.setAttribute("stroke", "white");
                centerRect.setAttribute("stroke-width", "2");
                centerRect.setAttribute("fill", "transparent");
                centerRectGroup.appendChild(centerRect);
            }
            {
                this.radioAltitudeGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.radioAltitudeGroup.setAttribute("id", "RadioAltitude");
                this.attitude_bank_root.appendChild(this.radioAltitudeGroup);
                this.radioDecisionHeight = document.createElementNS(Avionics.SVG.NS, "text");
                this.radioDecisionHeight.textContent = "";
                this.radioDecisionHeight.setAttribute("x", "140");
                this.radioDecisionHeight.setAttribute("y", "-192");
                this.radioDecisionHeight.setAttribute("text-anchor", "end");
                this.radioDecisionHeight.setAttribute("font-size", "14");
                this.radioDecisionHeight.setAttribute("font-family", "BoeingEFIS");
                this.radioDecisionHeight.setAttribute("fill", "lime");
                this.radioAltitudeGroup.appendChild(this.radioDecisionHeight);
                this.radioAltitude = document.createElementNS(Avionics.SVG.NS, "text");
                this.radioAltitude.textContent = "";
                this.radioAltitude.setAttribute("x", "135");
                this.radioAltitude.setAttribute("y", "-190");
                this.radioAltitude.setAttribute("text-anchor", "end");
                this.radioAltitude.setAttribute("font-size", "26");
                this.radioAltitude.setAttribute("font-family", "BoeingEFIS");
                this.radioAltitude.setAttribute("fill", "white");
                this.radioAltitudeGroup.appendChild(this.radioAltitude);
            }
        }
    }
    construct_AS01B() {
    }
    construct_CJ4() {
    }
    applyAttributes() {
        if (this.horizon_bottom)
            this.horizon_bottom.setAttribute("transform", "rotate(" + this.bankAngle + ", 0, 0) translate(0," + ((this.pitchAngle * this.horizonAngleFactor)) + ")");
        if (this.attitude_pitch)
            this.attitude_pitch.setAttribute("transform", "rotate(" + this.bankAngle + ", 0, 0)");
        for (let i = 0; i < this.attitude_pitch_grads.length; i++)
            this.attitude_pitch_grads[i].setAttribute("transform", "translate(0," + (this.pitchAngle * this.pitchAngleFactor) + ")");
        if (this.slipSkid)
            this.slipSkid.setAttribute("transform", "rotate(" + this.bankAngle + ", 0, 0) translate(" + (this.slipSkidValue * 40) + ", 0)");
        if (this.slipSkidTriangle)
            this.slipSkidTriangle.setAttribute("transform", "rotate(" + this.bankAngle + ", 0, 0)");
        if (this.radioAltitude && this.radioAltitudeRotate)
            this.radioAltitude.setAttribute("transform", "rotate(" + this.bankAngle + ", 0, 0)");
        if (this.cj4_FlightDirector != null) {
            if (this.cj4_FlightDirectorActive) {
                this.cj4_FlightDirector.setAttribute("transform", "rotate(" + (-this.cj4_FlightDirectorBank) + ") translate(0 " + ((this.pitchAngle - this.cj4_FlightDirectorPitch) * this.pitchAngleFactor) + ")");
                this.cj4_FlightDirector.setAttribute("display", "");
            }
            else {
                this.cj4_FlightDirector.setAttribute("display", "none");
            }
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
                const correctionFactor = 0.833;
                this.bankAngle = this.bankAngle * correctionFactor;
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
                    this.radioDecisionHeight.textContent = fastToFixed(val, 0);
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
        this.updatePLI();
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
                    if (absVal <= 100) {
                        textVal = absVal - (absVal % 2);
                    }        
                    else {
                        textVal = absVal - (absVal % 10);
                    }     
                }
                this.radioAltitude.textContent = (textVal * Math.sign(val)).toString();
                if (this.radioAltitudeColorLimit > 0) {
                    if (val >= this.radioAltitudeColorLimit)
                        this.radioAltitude.setAttribute("fill", this.radioAltitudeColorOk);
                    else
                        this.radioAltitude.setAttribute("fill", this.radioAltitudeColorBad);
                }
                this.radioAltitudeGroup.setAttribute("visibility", "visible");
            }
        }
        else {
            this.radioAltitudeGroup.setAttribute("visibility", "hidden");
            this.radioRefreshTimer = 0.0;
        }
    }
    updatePLI() {
        const IRSState = SimVar.GetSimVarValue("L:SALTY_IRS_STATE", "Enum");
        if (IRSState == 2) {
            if ((SimVar.GetSimVarValue("TRAILING EDGE FLAPS LEFT ANGLE", "percent over 100") > 0) || Simplane.getIndicatedSpeed() < SimVar.GetSimVarValue("L:SALTY_VREF30", "knots") + 60) {
                let alpha = SimVar.GetSimVarValue("INCIDENCE ALPHA", "degrees");
                if(Simplane.getGroundSpeed() < 5) {
                    alpha = 0;
                }
                let stallAlpha = SimVar.GetSimVarValue("STALL ALPHA", "degrees");
                let pitchDiff = stallAlpha - alpha;
                let y = Utils.Clamp(pitchDiff * 6.5, -100, 100);
                this.pitchLimitIndicatorGroup.setAttribute("transform", "translate(0, " + -y + ")");
                this.pitchLimitIndicatorGroup.style.visibility = "visible";
            }
            else {
                this.pitchLimitIndicatorGroup.style.visibility = "hidden";
            }
        }
        else {
            this.pitchLimitIndicatorGroup.style.visibility = "hidden";
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
                this.group.setAttribute("id", this.getGroupName());
                this.group.setAttribute("display", "none");
                this.create();
                _root.appendChild(this.group);
            }
        }
        set active(_active) {
            if (_active != this.isActive) {
                this.isActive = _active;
                if (this.group != null) {
                    this.group.setAttribute("display", this.isActive ? "block" : "none");
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
            circle.setAttribute("cx", "0");
            circle.setAttribute("cy", "-20");
            circle.setAttribute("r", _radius.toString());
            this.applyStyle(circle);
            return circle;
        }
        createLine(_x1, _y1, _x2, _y2) {
            var line = document.createElementNS(Avionics.SVG.NS, "line");
            line.setAttribute("x1", _x1.toString());
            line.setAttribute("y1", (_y1 - 20).toString());
            line.setAttribute("x2", _x2.toString());
            line.setAttribute("y2", (_y2 - 20).toString());
            this.applyStyle(line);
            return line;
        }
        applyStyle(_element) {
            if (_element != null) {
                _element.setAttribute("stroke", this.getColour());
                _element.setAttribute("stroke-width", this.getStrokeWidth());
                _element.setAttribute("fill", "none");
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
                this.headingLine.setAttribute("transform", "translate(" + lineX + ", 0)");
            }
            if (this.pitchLine != null) {
                let currentPlanePitch = Simplane.getPitch();
                let currentFDPitch = Simplane.getFlightDirectorPitch();
                //Special FD Takeoff Phase Logic
                if (Simplane.getIsGrounded()) {
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
                this.pitchLine.setAttribute("transform", "translate(0, " + lineY + ")");
            }
        }
        getLineLength() { return 150; }
        getStrokeWidth() { return "4"; }
        getFDBankLimit() { return 30; }
        getFDBankDisplayLimit() { return 75; }
    }
    class CommandBarsDisplay_Airbus extends CommandBarsDisplay {
    }
    class CommandBarsDisplay_B747 extends CommandBarsDisplay {
        getColour() { return "#D570FF"; }
        getFDBankLimit() { return 30; }
        getFDBankDisplayLimit() { return 50; }
    }
    class CommandBarsDisplay_AS01B extends CommandBarsDisplay {
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
        calculatePosYFromPitchFPV(_startPitch, _targetPitch) {
            var pitchDiff = _targetPitch - _startPitch;
            var currentPlanePitch = Simplane.getPitch();
            var y = (pitchDiff + currentPlanePitch) * 6.475;
            var yLimited = Utils.Clamp(y, -140, 140);
            return yLimited;
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
                    var x = this.calculatePosXFromBank(currentHeading, 0);
                    var y = this.calculatePosYFromPitchFPV(currentPitch, 0);
                    this.group.setAttribute("transform", "translate(" + -x + ", " + -y + ")");
                }
                else {
                    this.group.setAttribute("transform", "translate(0, 0)");
                }
            }
        }
    }
    PathVectorDisplay.MIN_SPEED_TO_DISPLAY = 25;
    class FPV_Airbus extends PathVectorDisplay {
    }
    class FPV_Boeing extends PathVectorDisplay {
        getColour() { return "white"; }
        getCircleRadius() { return 6; }
        getVerticalLineLength() { return 10; }
        getHorizontalLineLength() { return 20; }
    }
    class FPD_Airbus extends DisplayBase {
    }
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
            path.setAttribute("d", d);
            this.applyStyle(path);
            this.group.appendChild(path);
        }
        refresh(_deltaTime) {
            if (this.group != null) {
                var y = this.calculatePosYFromPitch(0, Simplane.getAutoPilotFlightPathAngle());
                this.group.setAttribute("transform", "translate(0, " + y + ") rotate(0)");
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
                group.setAttribute("id", "FlightDirectorDisplay");
                group.setAttribute("transform", "translate(0, " + this.fFDPitchOffset + ")");
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
    }
    Jet_PFD_FlightDirector.A320_Neo_Handler = A320_Neo_Handler;
    class B747_8_Handler extends Handler {
        createDisplayModes(_group) {
            this.displayMode.push(new CommandBarsDisplay_B747(_group));
            this.displayMode.push(new FPV_Boeing(_group));
        }
        refreshActiveModes() {
            var fdActive = (Simplane.getAutoPilotFlightDirectorActive(1));
            var fpvActive = SimVar.GetSimVarValue("L:SALTY_FPV_ON", "bool");
            this.setModeActive(0, fdActive);
            this.setModeActive(1, fpvActive);
        }
        initDefaultValues() {
            this.fFDPitchOffset = 1.75;
        }
    }
    Jet_PFD_FlightDirector.B747_8_Handler = B747_8_Handler;
    class AS01B_Handler extends Handler {
    }
    Jet_PFD_FlightDirector.AS01B_Handler = AS01B_Handler;
})(Jet_PFD_FlightDirector || (Jet_PFD_FlightDirector = {}));
customElements.define("jet-pfd-attitude-indicator", Jet_PFD_AttitudeIndicator);
//# sourceMappingURL=AttitudeIndicator.js.map