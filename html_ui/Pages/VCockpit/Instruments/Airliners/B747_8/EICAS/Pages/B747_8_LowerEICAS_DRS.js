var B747_8_LowerEICAS_DRS;
(function (B747_8_LowerEICAS_DRS) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
        }
        get templateID() { return "B747_8LowerEICASDRSTemplate" }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            this.isInitialised = true;
            this.entry1Status = document.querySelector("#entry1-status");
        }
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            
        }
    }
    B747_8_LowerEICAS_DRS.Display = Display;
})(B747_8_LowerEICAS_DRS || (B747_8_LowerEICAS_DRS = {}));
customElements.define("b747-8-lower-eicas-drs", B747_8_LowerEICAS_DRS.Display);
//# sourceMappingURL=B747_8_LowerEICAS_DRS.js.map