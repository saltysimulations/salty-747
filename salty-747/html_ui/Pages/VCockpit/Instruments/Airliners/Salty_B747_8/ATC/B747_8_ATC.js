class B747_8_ATC extends Airliners.BaseATC {
    get templateID() { return "B747_8_ATC"; }
    Init() {
        super.Init();
        this.emptySlot = "";
    }
    refreshValue() {
        super.refreshValue();
        if (this.valueText != null && this.valueText.textContent == "") {
            diffAndSetText(this.valueText, "0000");
        }
    }
}
registerInstrument("b747-8-atc", B747_8_ATC);
//# sourceMappingURL=B747_8_ATC.js.map