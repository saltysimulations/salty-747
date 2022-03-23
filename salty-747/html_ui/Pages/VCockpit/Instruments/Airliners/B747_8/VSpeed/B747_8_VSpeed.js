class B747_8_VSpeed extends Boeing_FCU.VSpeed {
    get templateID() { return "B747_8_VSpeed"; }
    shouldBeVisible() {
        return SimVar.GetSimVarValue("L:AP_VS_ACTIVE", "number") === 1;
    }
}
registerInstrument("b747-8-vspeed-element", B747_8_VSpeed);
//# sourceMappingURL=B747_8_VSpeed.js.map