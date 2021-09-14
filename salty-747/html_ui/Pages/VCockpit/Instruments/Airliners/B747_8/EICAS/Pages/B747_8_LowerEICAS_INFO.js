var B747_8_LowerEICAS_INFO;
(function (B747_8_LowerEICAS_INFO) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
        }
        get templateID() { return "B747_8LowerEICASINFOTemplate" }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            this.debug1 = document.querySelector("#debug1");
            this.debug2 = document.querySelector("#debug2");
            this.debug3 = document.querySelector("#debug3");
            this.debug4 = document.querySelector("#debug4");
            this.debug5 = document.querySelector("#debug5");
            this.debug6 = document.querySelector("#debug6");
            this.debug7 = document.querySelector("#debug7");
            this.isInitialised = true;
        }
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            const fmaValues = localStorage.getItem("CJ4_fmaValues");
            if (fmaValues) {
                const parsedFmaValues = JSON.parse(fmaValues);
                const approachActive = parsedFmaValues.approachActive;
                const lateralMode = parsedFmaValues.lateralMode;
                const lateralArmed = parsedFmaValues.lateralArmed;
                const verticalMode = parsedFmaValues.verticalMode;
                const altitudeArmed = parsedFmaValues.altitudeArmed;
                const vnavArmed = parsedFmaValues.vnavArmed;
                const approachVerticalArmed = parsedFmaValues.approachVerticalArmed;

                this.debug1.textContent = "ACTIVE PITCH MODE: " + verticalMode;
                this.debug2.textContent = "ARMED ALTITUDE: " + altitudeArmed;
                this.debug3.textContent = "ACTIVE ROLL MODE: " + lateralMode;
                this.debug4.textContent = "ARMED ROLL MODE: " + lateralArmed;
                this.debug5.textContent = "VNAV ARMED STATE: " + vnavArmed;
                this.debug6.textContent = "APPROACH VERT ARMED: " + approachVerticalArmed;
                this.debug7.textContent = "APPROACH ACTIVE: " + approachActive;
            }
        }
    }
    B747_8_LowerEICAS_INFO.Display = Display;
})(B747_8_LowerEICAS_INFO || (B747_8_LowerEICAS_INFO = {}));
customElements.define("b747-8-lower-eicas-info", B747_8_LowerEICAS_INFO.Display);
//# sourceMappingURL=B747_8_LowerEICAS_INFO.js.map