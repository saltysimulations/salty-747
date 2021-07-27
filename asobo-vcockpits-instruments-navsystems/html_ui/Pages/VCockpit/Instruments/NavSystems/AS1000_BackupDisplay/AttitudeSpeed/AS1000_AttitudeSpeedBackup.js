class AS1000_AttitudeSpeedBackup extends NavSystem {
    constructor() {
        super(...arguments);
        this.altimeterIndex = 2;
    }
    get templateID() { return "AS1000_AttitudeSpeedBackup"; }
    connectedCallback() {
        super.connectedCallback();
        this.addIndependentElementContainer(new NavSystemElementContainer("Altimeter", "SvgMain", new ASBackup_Altimeter()));
        this.addIndependentElementContainer(new NavSystemElementContainer("Speed", "SvgMain", new ASBackup_Airspeed()));
        this.addIndependentElementContainer(new NavSystemElementContainer("Horizon", "Horizon", new ASBackup_Attitude()));
    }
    parseXMLConfig() {
        super.parseXMLConfig();
        if (this.instrumentXmlConfig) {
            let altimeterIndexElems = this.instrumentXmlConfig.getElementsByTagName("AltimeterIndex");
            if (altimeterIndexElems.length > 0) {
                this.altimeterIndex = parseInt(altimeterIndexElems[0].textContent) + 1;
            }
        }
    }
}
class ASBackup_Airspeed extends NavSystemElement {
    constructor() {
        super();
        this.lastIndicatedSpeed = -10000;
    }
    init(root) {
        this.airspeedElement = this.gps.getChildById("SvgMain");
        diffAndSetAttribute(this.airspeedElement, "is-backup", "true");
        var cockpitSettings = SimVar.GetGameVarValue("", "GlassCockpitSettings");
        if (cockpitSettings && cockpitSettings.AirSpeed.Initialized) {
            diffAndSetAttribute(this.airspeedElement, "min-speed", cockpitSettings.AirSpeed.lowLimit + '');
            diffAndSetAttribute(this.airspeedElement, "green-begin", cockpitSettings.AirSpeed.greenStart + '');
            diffAndSetAttribute(this.airspeedElement, "green-end", cockpitSettings.AirSpeed.greenEnd + '');
            diffAndSetAttribute(this.airspeedElement, "flaps-begin", cockpitSettings.AirSpeed.whiteStart + '');
            diffAndSetAttribute(this.airspeedElement, "flaps-end", cockpitSettings.AirSpeed.whiteEnd + '');
            diffAndSetAttribute(this.airspeedElement, "yellow-begin", cockpitSettings.AirSpeed.yellowStart + '');
            diffAndSetAttribute(this.airspeedElement, "yellow-end", cockpitSettings.AirSpeed.yellowEnd + '');
            diffAndSetAttribute(this.airspeedElement, "red-begin", cockpitSettings.AirSpeed.redStart + '');
            diffAndSetAttribute(this.airspeedElement, "red-end", cockpitSettings.AirSpeed.redEnd + '');
            diffAndSetAttribute(this.airspeedElement, "max-speed", cockpitSettings.AirSpeed.highLimit + '');
        }
        else {
            var designSpeeds = Simplane.getDesignSpeeds();
            diffAndSetAttribute(this.airspeedElement, "green-begin", designSpeeds.VS1 + '');
            diffAndSetAttribute(this.airspeedElement, "green-end", designSpeeds.VNo + '');
            diffAndSetAttribute(this.airspeedElement, "flaps-begin", designSpeeds.VS0 + '');
            diffAndSetAttribute(this.airspeedElement, "flaps-end", designSpeeds.VFe + '');
            diffAndSetAttribute(this.airspeedElement, "yellow-begin", designSpeeds.VNo + '');
            diffAndSetAttribute(this.airspeedElement, "yellow-end", designSpeeds.VNe + '');
            diffAndSetAttribute(this.airspeedElement, "red-begin", designSpeeds.VNe + '');
            diffAndSetAttribute(this.airspeedElement, "red-end", designSpeeds.VMax + '');
            diffAndSetAttribute(this.airspeedElement, "max-speed", designSpeeds.VNe + '');
        }
        if (this.gps) {
            var aspectRatio = this.gps.getAspectRatio();
            diffAndSetAttribute(this.airspeedElement, "aspect-ratio", aspectRatio + '');
        }
    }
    onEnter() {
    }
    isReady() {
        return true;
    }
    onUpdate(_deltaTime) {
        var indicatedSpeed = Simplane.getIndicatedSpeed();
        if (indicatedSpeed != this.lastIndicatedSpeed) {
            diffAndSetAttribute(this.airspeedElement, "airspeed", fastToFixed(indicatedSpeed, 1));
            this.lastIndicatedSpeed = indicatedSpeed;
        }
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
class ASBackup_Altimeter extends NavSystemElement {
    constructor() {
        super();
        this.lastAltitude = -10000;
        this.lastPressure = -10000;
    }
    init(root) {
        this.altimeterElement = this.gps.getChildById("SvgMain");
        diffAndSetAttribute(this.altimeterElement, "is-backup", "true");
        if (this.gps) {
            var aspectRatio = this.gps.getAspectRatio();
            diffAndSetAttribute(this.altimeterElement, "aspect-ratio", aspectRatio + '');
        }
    }
    onEnter() {
    }
    isReady() {
        return true;
        ;
    }
    onUpdate(_deltaTime) {
        var altitude = SimVar.GetSimVarValue("INDICATED ALTITUDE:" + this.gps.altimeterIndex, "feet");
        if (altitude != this.lastAltitude) {
            this.lastAltitude = altitude;
            diffAndSetAttribute(this.altimeterElement, "altitude", altitude);
        }
        var pressure = SimVar.GetSimVarValue("KOHLSMAN SETTING HG:" + this.gps.altimeterIndex, "inches of mercury");
        pressure = fastToFixed(pressure, 2);
        if (pressure != this.lastPressure) {
            this.lastPressure = pressure;
            diffAndSetAttribute(this.altimeterElement, "pressure", pressure);
        }
    }
    onExit() {
    }
    onEvent(_event) {
        switch (_event) {
            case "BARO_INC":
                SimVar.SetSimVarValue("K:KOHLSMAN_INC", "number", this.gps.altimeterIndex);
                break;
            case "BARO_DEC":
                SimVar.SetSimVarValue("K:KOHLSMAN_DEC", "number", this.gps.altimeterIndex);
                break;
        }
    }
}
class ASBackup_Attitude extends NavSystemElement {
    constructor() {
        super(...arguments);
        this.vDir = new Vec2();
    }
    init(root) {
        this.attitudeElement = this.gps.getChildById("Horizon");
        diffAndSetAttribute(this.attitudeElement, "is-backup", "true");
        if (this.gps) {
            var aspectRatio = this.gps.getAspectRatio();
            diffAndSetAttribute(this.attitudeElement, "aspect-ratio", aspectRatio + '');
        }
    }
    onEnter() {
    }
    onUpdate(_deltaTime) {
        var xyz = Simplane.getOrientationAxis();
        if (xyz) {
            diffAndSetAttribute(this.attitudeElement, "pitch", (xyz.pitch / Math.PI * 180) + '');
            diffAndSetAttribute(this.attitudeElement, "bank", (xyz.bank / Math.PI * 180) + '');
            diffAndSetAttribute(this.attitudeElement, "slip_skid", Simplane.getInclinometer() + '');
        }
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
registerInstrument("as1000-attitudespeedbackup-element", AS1000_AttitudeSpeedBackup);
//# sourceMappingURL=AS1000_AttitudeSpeedBackup.js.map