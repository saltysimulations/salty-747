class AS1000_AttitudeBackup extends NavSystem {
    get templateID() { return "AS1000_AttitudeBackup"; }
    connectedCallback() {
        super.connectedCallback();
        this.addIndependentElementContainer(new NavSystemElementContainer("Horizon", "Horizon", new Backup_Attitude()));
    }
}
class Backup_Attitude extends NavSystemElement {
    constructor() {
        super();
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
registerInstrument("as1000-attitudebackup-element", AS1000_AttitudeBackup);
//# sourceMappingURL=AS1000_AttitudeBackup.js.map