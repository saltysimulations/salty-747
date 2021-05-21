var B747_8_LowerEICAS_GEAR;
(function (B747_8_LowerEICAS_GEAR) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
        }
        get templateID() { return "B747_8LowerEICASGEARTemplate" }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            this.isInitialised = true;
            this.gearDoorOpenLines = document.querySelector("#open-labels");
            this.gearDoorClosedText = document.querySelector("#closed-labels");
        }
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            var GearDoorsOpen = SimVar.GetSimVarValue("GEAR POSITION", "enum");
            var GearAnimClosed = SimVar.GetSimVarValue("GEAR ANIMATION POSITION", "percent");
        		
            if ((GearDoorsOpen == 1) || (GearAnimClosed == 0)) {
            	this.gearDoorOpenLines.style.visibility = "hidden";
            	this.gearDoorClosedText.style.visibility = "visible";
            } else {
            	this.gearDoorOpenLines.style.visibility = "visible";   
            	this.gearDoorClosedText.style.visibility = "hidden";
            }
        }
    }
    B747_8_LowerEICAS_GEAR.Display = Display;
})(B747_8_LowerEICAS_GEAR || (B747_8_LowerEICAS_GEAR = {}));
customElements.define("b747-8-lower-eicas-gear", B747_8_LowerEICAS_GEAR.Display);
//# sourceMappingURL=B747_8_LowerEICAS_GEAR.js.map