class AS1000_SpeedBackup extends NavSystem {
    get templateID() { return "AS1000_SpeedBackup"; }
    connectedCallback() {
        super.connectedCallback();
        this.addIndependentElementContainer(new NavSystemElementContainer("Altimeter", "SvgMain", new Backup_Altimeter()));
        this.addIndependentElementContainer(new NavSystemElementContainer("Speed", "SvgMain", new Backup_Airspeed()));
    }
}
class Backup_Airspeed extends NavSystemElement {
    constructor() {
        super();
        this.lastIndicatedSpeed = -10000;
        this.maxSpeed = 0;
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
            this.maxSpeed = cockpitSettings.AirSpeed.highLimit;
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
            this.maxSpeed = designSpeeds.VNe;
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
        let crossSpeed = SimVar.GetGameVarValue("AIRCRAFT CROSSOVER SPEED", "Knots");
        let cruiseMach = SimVar.GetGameVarValue("AIRCRAFT CRUISE MACH", "mach");
        let crossSpeedFactor = Simplane.getCrossoverSpeedFactor(this.maxSpeed, cruiseMach);
        if (crossSpeed != 0) {
            diffAndSetAttribute(this.airspeedElement, "max-speed", (Math.min(crossSpeedFactor, 1) * this.maxSpeed) + '');
        }
    }
    onExit() {
    }
    onEvent(_event) {
    }
}
class Backup_Altimeter extends NavSystemElement {
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
    }
    onUpdate(_deltaTime) {
        var altitude = SimVar.GetSimVarValue("INDICATED ALTITUDE:2", "feet");
        if (altitude != this.lastAltitude) {
            this.lastAltitude = altitude;
            diffAndSetAttribute(this.altimeterElement, "altitude", altitude);
        }
        var pressure = SimVar.GetSimVarValue("KOHLSMAN SETTING HG:2", "inches of mercury");
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
                SimVar.SetSimVarValue("K:KOHLSMAN_INC", "number", 1);
                break;
            case "BARO_DEC":
                SimVar.SetSimVarValue("K:KOHLSMAN_DEC", "number", 1);
                break;
        }
    }
}
registerInstrument("as1000-speedbackup-element", AS1000_SpeedBackup);
//# sourceMappingURL=AS1000_SpeedBackup.js.map