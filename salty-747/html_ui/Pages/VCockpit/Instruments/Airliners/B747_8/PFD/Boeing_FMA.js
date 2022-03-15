var Boeing;
(function (Boeing) {
    class FMA extends TemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
            this.allAnnunciations = new Array();
            this._aircraft = Aircraft.B747_8;
        }
        get templateID() { return "BoeingFMATemplate"; }
        get aircraft() {
            return this._aircraft;
        }
        set aircraft(_val) {
            if (this._aircraft != _val) {
                this._aircraft = _val;
            }
        }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            if (this.allAnnunciations != null) {
                this.allAnnunciations.push(new Boeing_FMA.Column1Top(this, this.querySelector("#COL1_TOP"), this.querySelector("#COL1_TOP_HIGHLIGHT")));
                this.allAnnunciations.push(new Boeing_FMA.Column2Top(this, this.querySelector("#COL2_TOP"), this.querySelector("#COL2_TOP_HIGHLIGHT")));
                this.allAnnunciations.push(new Boeing_FMA.Column2Middle(this, this.querySelector("#COL2_MIDDLE"), null));
                this.allAnnunciations.push(new Boeing_FMA.Column2Bottom(this, this.querySelector("#COL2_BOTTOM"), this.querySelector("#COL2_BOTTOM_HIGHLIGHT"), this.querySelector("#COL2_BOTTOM_ARROWS")));
                this.allAnnunciations.push(new Boeing_FMA.Column3Top(this, this.querySelector("#COL3_TOP"), this.querySelector("#COL3_TOP_HIGHLIGHT")));
                this.allAnnunciations.push(new Boeing_FMA.Column3Middle(this, this.querySelector("#COL3_MIDDLE"), null));
            }
            this.isInitialised = true;
        }
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            Boeing_FMA.ApproachStatus.update(_deltaTime);
            if (this.allAnnunciations != null) {
                for (var i = 0; i < this.allAnnunciations.length; ++i) {
                    if (this.allAnnunciations[i] != null) {
                        this.allAnnunciations[i].update(_deltaTime);
                    }
                }
            }
        }
    }
    Boeing.FMA = FMA;
})(Boeing || (Boeing = {}));
var Boeing_FMA;
(function (Boeing_FMA) {
    class ApproachStatus {
        static get isFlareArmed() {
            return (this.flareState == 1);
        }
        static get isFlareActive() {
            return (this.flareState == 2);
        }
        static get isRolloutArmed() {
            return (this.rolloutState == 1);
        }
        static get isRolloutActive() {
            return (this.rolloutState == 2);
        }
        static update(_deltaTime) {
            this.flareState = 0;
            this.rolloutState = 0;
            if (Simplane.getCurrentFlightPhase() == FlightPhase.FLIGHT_PHASE_APPROACH) {
                var alt = Simplane.getAltitudeAboveGround();
                if (alt <= 1500) {
                    if (alt < 1.5) {
                        this.rolloutDelay += _deltaTime;
                        this.rolloutState = (this.rolloutDelay >= 1000) ? 2 : 1;
                    }
                    else {
                        this.rolloutDelay = 0;
                        this.rolloutState = 1;
                    }
                    if (!this.isRolloutActive && Simplane.getAutoPilotActive()) {
                        this.flareState = (alt <= 60) ? 2 : 1;
                    }
                }
            }
        }
    }
    ApproachStatus.flareState = 0;
    ApproachStatus.rolloutState = 0;
    ApproachStatus.rolloutDelay = 0;
    Boeing_FMA.ApproachStatus = ApproachStatus;
    class Annunciation {
        constructor(_fma, _divElement, _highlightElement) {
            this.divElement = null;
            this.currentMode = -1;
            this.highlightElement = null;
            this.highlightTimer = 0;
            this.fma = _fma;
            this.divElement = _divElement;
            this.highlightElement = _highlightElement;
            this.approachActive = "";
            this.lateralMode = "";
            this.lateralArmed = "";
            this.verticalMode = "";
            this.altitudeArmed = "";
            this.vnavArmed = "";
            this.approachVerticalArmed = "";
            this.approachType = "";
        }
        update(_deltaTime) {
            const fmaValues = localStorage.getItem("CJ4_fmaValues");
            if (fmaValues) {
                const parsedFmaValues = JSON.parse(fmaValues);
                this.approachActive = parsedFmaValues.approachActive;
                this.lateralMode = parsedFmaValues.lateralMode;
                this.lateralArmed = parsedFmaValues.lateralArmed;
                this.verticalMode = parsedFmaValues.verticalMode;
                this.altitudeArmed = parsedFmaValues.altitudeArmed;
                this.vnavArmed = parsedFmaValues.vnavArmed;  
                this.approachVerticalArmed = parsedFmaValues.approachVerticalArmed;
                this.approachType = parsedFmaValues.approachType;
            }

            var mode = this.getActiveMode();
            if (mode != this.currentMode) {
                this.changeMode(mode);
            }
            this.updateHighlight(_deltaTime);
        }
        updateHighlight(_deltaTime) {
            if (this.highlightTimer > 0) {
                this.highlightTimer -= _deltaTime;
                if (this.highlightTimer <= 0) {
                    this.setHighlightVisibility(false);
                }
            }
        }
        changeMode(_mode) {
            this.currentMode = _mode;
            if (this.divElement != null)
                this.divElement.innerHTML = "<span>" + this.getCurrentModeText() + "</span>";
            this.setHighlightVisibility(this.currentMode >= 0);
        }
        setHighlightVisibility(_show) {
            if (this.highlightElement != null) {
                this.highlightElement.style.display = _show ? "block" : "none";
                if (_show) {
                    this.highlightTimer = Annunciation.HIGHLIGHT_LENGTH;
                }
            }
        }
    }
    Annunciation.HIGHLIGHT_LENGTH = 10 * 1000;
    Boeing_FMA.Annunciation = Annunciation;
    class Column1Top extends Annunciation {
        constructor() {
            super(...arguments);
            this.leftThrottleArmed = false;
            this.rightThrottleArmed = false;
            this.flagTOGA = false;
        }
        update(_deltaTime) {
            const fmaValues = localStorage.getItem("CJ4_fmaValues");
            if (fmaValues) {
                const parsedFmaValues = JSON.parse(fmaValues);
                this.autoThrottleStatus = parsedFmaValues.autoThrottle;
                this.approachType = parsedFmaValues.approachType;
            }
            var left = Simplane.getAutoPilotThrottleArmed(1);
            var right = Simplane.getAutoPilotThrottleArmed(2);
            var mode = this.getActiveMode();
            if ((mode != this.currentMode) || (left != this.leftThrottleArmed) || (right != this.rightThrottleArmed)) {
                this.leftThrottleArmed = left;
                this.rightThrottleArmed = right;
                this.changeMode(mode);
            }
            this.updateHighlight(_deltaTime);
        }
        getActiveMode() {
            if (!Simplane.getAutoPilotThrottleArmed()) {
                return -1;
            }
            if (this.autoThrottleStatus == "SPD") {
                return 2;
            }
            else if (this.autoThrottleStatus == "THR" ) {
                return 3;
            }
            else if (this.autoThrottleStatus == "THRREF") {
                return 4;
            }
            else if (this.autoThrottleStatus == "HOLD") {
                return 0;
            }
            else if (this.autoThrottleStatus == "IDLE") {
                return 1;
            }
            return -1;
        }

        getCurrentModeText() {
            /*
            this commented out block of code does nothing (empty if-else)
            var modeText = "";
            if (this.leftThrottleArmed && !this.rightThrottleArmed) {
            }
            else if (!this.leftThrottleArmed && this.rightThrottleArmed) {
            }
            */

            if (typeof this.currentMode !== "number" || this.currentMode < 0 || this.currentMode > 4)
                return "";

            const modeEnumToText = {
                0: "HOLD",
                1: "IDLE",
                2: "SPD",
                3: "THR",
                4: "THR REF"
            };

            return modeEnumToText[this.currentMode];
        }
    }
    Boeing_FMA.Column1Top = Column1Top;
    class Column2Top extends Annunciation {
        getActiveMode() {
            if(!Simplane.getAutoPilotActive(0) && !Simplane.getAutoPilotFlightDirectorActive(1)){
                return -1;
            }
            else if (this.lateralMode == "HDGHOLD") {
                return 2;
            }
            else if (this.lateralMode == "HDG") {
                return 3;
            }
            else if (this.lateralMode == "LNV1") {
                return 5;
            }
            else if (this.lateralMode == "APPR LNV1") {
                return 1;
            }
            else if (this.lateralMode == "APPR LOC1") {
                return 6;
            }
            else if (this.lateralMode == "TO" || this.lateralMode == "GA" || this.lateralMode == "ROLL") {
                return 8;
            }
            return -1;
        }
        getCurrentModeText() {
            switch (this.currentMode) {
                case 0: return "B/CRS";
                case 1: return "FAC";
                case 2: return "HDG HOLD";
                case 3: return "HDG SEL";
                case 4: return "HUD TO/GA";
                case 5: return "LNAV";
                case 6: return "LOC";
                case 7: return "ROLLOUT";
                case 8: return "TO/GA";
                case 9: return "TRK HOLD";
                case 10: return "TRK SEL";
                case 11: return "ATT";
                default: return "";
            }
        }
    }
    Boeing_FMA.Column2Top = Column2Top;
    class Column2Middle extends Annunciation {
        getActiveMode() {
            if(!Simplane.getAutoPilotActive(0) && !Simplane.getAutoPilotFlightDirectorActive(1)){
                return -1;
            }
            else if (this.lateralArmed === "APPR LNV1") {
                return 1;
            }
            else if (this.lateralArmed === "APPR LOC1") {
                return 3;
            }
            else if (this.lateralArmed === "LNV1") {
                return 2;
            }
            return -1;
        }
        getCurrentModeText() {
            switch (this.currentMode) {
                case 0: return "B/CRS";
                case 1: return "FAC";
                case 2: return "LNAV";
                case 3: return "LOC";
                case 4: return "ROLLOUT";
                default: return "";
            }
        }
    }
    Boeing_FMA.Column2Middle = Column2Middle;
    class Column2Bottom extends Annunciation {
        constructor(_parent, _divElement, _highlightElement, _arrowsElement) {
            super(_parent, _divElement, _highlightElement);
            this.arrowsElement = null;
            this.arrowsElement = _arrowsElement;
        }
        changeMode(_mode) {
            super.changeMode(_mode);
            if (this.divElement != null) {
                var className = "bottom";
                if (_mode == 4) {
                    className += " warning";
                }
                this.divElement.className = className;
            }
            if (this.arrowsElement != null) {
                this.arrowsElement.style.display = (_mode == 3) ? "block" : "none";
            }
        }
        getActiveMode() {
            if (Simplane.getAutoPilotActive()) {
                return 0;
            }
            else if (Simplane.getAutoPilotFlightDirectorActive(1)) {
                return 1;
            }
            return -1;
        }
        getCurrentModeText() {
            switch (this.currentMode) {
                case 0: return ((this.fma.aircraft == Aircraft.B747_8) ? "CMD" : "A/P");
                case 1: return ((this.fma.aircraft == Aircraft.B747_8) ? "FD" : "FLT DIR");
                case 2: return "LAND 3";
                case 3: return "LAND 2";
                case 4: return "NO AUTOLAND";
                default: return "";
            }
        }
    }
    Boeing_FMA.Column2Bottom = Column2Bottom;
    class Column3Top extends Annunciation {
        getActiveMode() {
            let roundedAlt = Math.round(Simplane.getAltitude() / 100) * 100;
            let targetAlt = SimVar.GetSimVarValue("AUTOPILOT ALTITUDE LOCK VAR:3", "feet");
            let crzAlt = SimVar.GetSimVarValue("L:AIRLINER_CRUISE_ALTITUDE", "number");
            if(!Simplane.getAutoPilotActive(0) && !Simplane.getAutoPilotFlightDirectorActive(1)){
                return -1;
            }
            else if (this.verticalMode === "VPATH" || this.verticalMode === "VALTV CAP" || this.verticalMode === "VALTV" 
                || this.verticalMode === "VALTS" && (targetAlt === crzAlt)
                || this.verticalMode === "VALTS CAP" && (targetAlt === crzAlt)
                || this.verticalMode === "VALT" && (roundedAlt === crzAlt)) {
                return 7;
            }
            else if (this.verticalMode === "VALTS" || this.verticalMode === "VALTS CAP" || this.verticalMode === "VALT") {
                return 9;
            }
            else if (this.verticalMode === "VFLC") {
                return 8;
            }
            else if (this.verticalMode === "ALTS CAP" || this.verticalMode === "ALTS" || this.verticalMode === "ALT") {
                return 0;
            }
            else if (this.verticalMode === "FLC") {
                return 2;
            }
            else if (this.verticalMode === "VS") {
                return 10;
            }
            else if (this.verticalMode === "TO" || this.verticalMode === "GA") {
                return 6;
            }
            else if (this.verticalMode === "GP") {
                return 5;
            }
            else if (this.verticalMode === "GS") {
                return 4;
            }
            return -1;
        }
        getCurrentModeText() {
            switch (this.currentMode) {
                case 0: return "ALT";
                case 1: return "FLARE";
                case 2: return "FLCH SPD";
                case 3: return "FPA";
                case 4: return "G/S";
                case 5: return "G/P";
                case 6: return "TO/GA";
                case 7: return "VNAV PTH";
                case 8: return "VNAV SPD";
                case 9: return "VNAV ALT";
                case 10: return "V/S";
                default: return "";
            }
        }
    }
    Boeing_FMA.Column3Top = Column3Top;
    class Column3Middle extends Annunciation {
        getActiveMode() {
            if(!Simplane.getAutoPilotActive(0) && !Simplane.getAutoPilotFlightDirectorActive(1)){
                return -1;
            }
            else if (SimVar.GetSimVarValue("L:AP_APP_ARMED", "bool") === 1) {
                if (this.approachType === "rnav" && this.verticalMode !== "GP") {
                    return 1;
                }
                else if (this.verticalMode !== "GS" && this.verticalMode !== "GP") {
                    return 2;
                }
            }
            else if (SimVar.GetSimVarValue("L:AP_VNAV_ARMED", "number") === 1 && SimVar.GetSimVarValue("L:WT_CJ4_VNAV_ON", "number") === 0) {
                return 3;
            }
            return -1;
        }
        getCurrentModeText() {
            switch (this.currentMode) {
                case 0: return "FLARE";
                case 1: return "G/P";
                case 2: return "G/S";
                case 3: return "VNAV";
                default: return "";
            }
        }
    }
    Boeing_FMA.Column3Middle = Column3Middle;
})(Boeing_FMA || (Boeing_FMA = {}));
customElements.define("boeing-fma", Boeing.FMA);
//# sourceMappingURL=Boeing_FMA.js.map