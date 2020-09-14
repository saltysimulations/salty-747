var B747_8_LowerEICAS_Stat;
(function (B747_8_LowerEICAS_Stat) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
        }
        get templateID() { return "B747_8LowerEICASStatTemplate" }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            this.isInitialised = true;
        }
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
        }
    }
    B747_8_LowerEICAS_Stat.Display = Display;
})(B747_8_LowerEICAS_Stat || (B747_8_LowerEICAS_Stat = {}));
customElements.define("b747-8-lower-eicas-stat", B747_8_LowerEICAS_Stat.Display);
//# sourceMappingURL=B747_8_LowerEICAS_Stat.js.map