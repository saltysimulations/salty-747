class CustomValue {
    constructor(_gps, _nameID, _valueID, _unitID) {
        this.valueIndex = 0;
        this.nameDisplay = _gps.getChildById(_nameID);
        this.valueDisplay = _gps.getChildById(_valueID);
        this.unitDisplay = _gps.getChildById(_unitID);
    }
    Update() {
        let flightPlanActive = SimVar.GetSimVarValue("GPS IS ACTIVE FLIGHT PLAN", "boolean");
        switch (this.valueIndex) {
            case 0:
                diffAndSetText(this.nameDisplay, "BRG");
                diffAndSetHTML(this.unitDisplay, "o<br/>M");
                diffAndSetText(this.valueDisplay, !flightPlanActive ? "___" : fastToFixed(SimVar.GetSimVarValue("GPS WP BEARING", "degree"), 0));
                break;
            case 1:
                diffAndSetText(this.nameDisplay, "CTS");
                diffAndSetHTML(this.unitDisplay, "o<br/>M");
                diffAndSetText(this.valueDisplay, !flightPlanActive ? "___" : fastToFixed(SimVar.GetSimVarValue("GPS COURSE TO STEER", "degree"), 0));
                break;
            case 2:
                diffAndSetText(this.nameDisplay, "XTK");
                diffAndSetHTML(this.unitDisplay, "n<br/>m");
                diffAndSetText(this.valueDisplay, !flightPlanActive ? "___._" : fastToFixed(SimVar.GetSimVarValue("GPS WP CROSS TRK", "nautical mile"), 1));
                break;
            case 3:
                diffAndSetText(this.nameDisplay, "DTK");
                diffAndSetHTML(this.unitDisplay, "o<br/>M");
                diffAndSetText(this.valueDisplay, !flightPlanActive ? "___" : fastToFixed(SimVar.GetSimVarValue("GPS WP DESIRED TRACK", "degree"), 0));
                break;
            case 4:
                diffAndSetText(this.nameDisplay, "DIS");
                diffAndSetHTML(this.unitDisplay, "n<br/>m");
                diffAndSetText(this.valueDisplay, !flightPlanActive ? "___._" : fastToFixed(SimVar.GetSimVarValue("GPS WP DISTANCE", "nautical mile"), 1));
                break;
            case 5:
                diffAndSetText(this.nameDisplay, "ESA");
                diffAndSetHTML(this.unitDisplay, "f<br/>t");
                diffAndSetText(this.valueDisplay, "___");
                break;
            case 6:
                diffAndSetText(this.nameDisplay, "ETA");
                diffAndSetHTML(this.unitDisplay, "");
                var ETA = SimVar.GetSimVarValue("GPS ETA", "minutes");
                diffAndSetText(this.valueDisplay, !flightPlanActive ? "__:__" : Math.floor(ETA / 60) + ":" + Math.floor(ETA % 60));
                break;
            case 7:
                diffAndSetText(this.nameDisplay, "ETE");
                diffAndSetHTML(this.unitDisplay, "");
                var ETE = SimVar.GetSimVarValue("GPS ETE", "seconds");
                diffAndSetText(this.valueDisplay, !flightPlanActive ? "__:__" : ETE >= 3600 ? Math.floor(ETE / 3600) + ":" + (Math.floor((ETE % 3600) / 60) + '').padStart(2, "0") : Math.floor(ETE / 60) + ":" + (Math.floor(ETE % 60) + '').padStart(2, "0"));
                break;
            case 8:
                diffAndSetText(this.nameDisplay, "FLOW");
                diffAndSetHTML(this.unitDisplay, "lb<br/>/h");
                diffAndSetText(this.valueDisplay, fastToFixed(SimVar.GetSimVarValue("ESTIMATED FUEL FLOW", "pound per hour"), 0));
                break;
            case 9:
                diffAndSetText(this.nameDisplay, "GS");
                diffAndSetHTML(this.unitDisplay, "k<br/>t");
                diffAndSetText(this.valueDisplay, fastToFixed(Simplane.getGroundSpeed(), 0));
                break;
            case 10:
                diffAndSetText(this.nameDisplay, "TRK");
                diffAndSetHTML(this.unitDisplay, "o<br/>M");
                diffAndSetText(this.valueDisplay, fastToFixed(Simplane.getTrackAngle(), 0));
                break;
            case 11:
                diffAndSetText(this.nameDisplay, "MSA");
                diffAndSetHTML(this.unitDisplay, "f<br/>t");
                diffAndSetText(this.valueDisplay, "___");
                break;
            case 12:
                diffAndSetText(this.nameDisplay, "TKE");
                diffAndSetHTML(this.unitDisplay, "o<br/>M");
                diffAndSetText(this.valueDisplay, !flightPlanActive ? "___" : fastToFixed(SimVar.GetSimVarValue("GPS WP TRACK ANGLE ERROR", "degrees"), 0));
                break;
            case 13:
                diffAndSetText(this.nameDisplay, "VSR");
                diffAndSetHTML(this.unitDisplay, "ft<br/>/s");
                diffAndSetText(this.valueDisplay, !flightPlanActive ? "___" : fastToFixed(SimVar.GetSimVarValue("GPS WP VERTICAL SPEED", "feet per second"), 0));
                break;
            case 14:
                diffAndSetText(this.nameDisplay, "ALT");
                diffAndSetHTML(this.unitDisplay, "f<br/>t");
                diffAndSetText(this.valueDisplay, fastToFixed(SimVar.GetSimVarValue("GPS POSITION ALT", "feet"), 0));
                break;
            case 15:
                diffAndSetText(this.nameDisplay, "BARO");
                diffAndSetHTML(this.unitDisplay, "m<br/>b");
                diffAndSetText(this.valueDisplay, fastToFixed(SimVar.GetSimVarValue("BAROMETER PRESSURE", "Millibars"), 0));
                break;
        }
    }
}
//# sourceMappingURL=CustomValue.js.map