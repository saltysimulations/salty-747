var B747_8_LowerEICAS_FCTL;
(function (B747_8_LowerEICAS_FCTL) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
        }
        get templateID() {
            return "B747_8LowerEICASFCTLTemplate";
        }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            this.leftAilOutbd = this.querySelector("#leftAilOutbd");
            this.leftAilInbd = this.querySelector("#leftAilInbd");

            this.leftSpoilersInbd_1 = this.querySelector("#LeSpInbdGauge-1");
            this.leftSpoilersInbd_2 = this.querySelector("#LeSpInbdGauge-2");

            this.leftSpoilersOutbd_1 = this.querySelector("#LeSpOutbdGauge-1");
            this.leftSpoilersOutbd_2 = this.querySelector("#LeSpOutbdGauge-2");
            this.leftSpoilersOutbd_3 = this.querySelector("#LeSpOutbdGauge-3");
            this.leftSpoilersOutbd_4 = this.querySelector("#LeSpOutbdGauge-4");

            this.leftElev_1 = this.querySelector("#leftElev-1");
            this.leftElev_2 = this.querySelector("#leftElev-2");

            this.rightElev_1 = this.querySelector("#rightElev-1");
            this.rightElev_2 = this.querySelector("#rightElev-2");

            this.rudder_1 = this.querySelector("#rudder-1");
            this.rudder_2 = this.querySelector("#rudder-2");

            this.righttAilOutbd = this.querySelector("#rightAilOutbd");
            this.rightAilInbd = this.querySelector("#rightAilInbd");

            this.rightSpoilersInbd_1 = this.querySelector("#reSpInbdGauge-1");
            this.rightSpoilersInbd_2 = this.querySelector("#reSpInbdGauge-2");

            this.rightpoilersOutbd_1 = this.querySelector("#reSpOutbdGauge-1");
            this.rightpoilersOutbd_2 = this.querySelector("#reSpOutbdGauge-2");
            this.rightpoilersOutbd_3 = this.querySelector("#reSpOutbdGauge-3");
            this.rightpoilersOutbd_4 = this.querySelector("#reSpOutbdGauge-4");

            this.stab = new Boeing.StabDisplay(this.querySelector("#trim"), 15, 1);
            this.stabDecimalPoint = this.querySelector("#stabDecimalPoint");
            this.isInitialised = true;
        }
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }

            var spoilersHandle = SimVar.GetSimVarValue("SPOILERS HANDLE POSITION", "percent over 100");
            let spoilersHandleNormalized = spoilersHandle * 56;

            //Left aileron
            var leftAilPCT = SimVar.GetSimVarValue("AILERON LEFT DEFLECTION PCT", "percent over 100");
            let leftAilPCTNormalized = leftAilPCT * 36;
            this.leftAilOutbd.setAttribute("transform", "translate(34 " + (230 + leftAilPCTNormalized) + ")");
            this.leftAilInbd.setAttribute("transform", "translate(179 " + (207 + leftAilPCTNormalized) + ")");

            var leftSpoilerPCT = SimVar.GetSimVarValue("SPOILERS LEFT POSITION", "percent over 100");

            //Left inbd spoilers
            let leftSpoilersInbdNormalized = leftSpoilerPCT * 11.2;
            let leftFinalInbd = leftSpoilersInbdNormalized + spoilersHandleNormalized;
            if (leftFinalInbd > 56) {
                leftFinalInbd = 56;
            }
            this.leftSpoilersInbd_1.setAttribute("d", "M0 " + (56 + leftFinalInbd) + "L16 " + (56 + leftFinalInbd) + "L16 56L0 56L0 " + (56 + leftFinalInbd) + "Z");
            this.leftSpoilersInbd_2.setAttribute("d", "M0 " + (56 + leftFinalInbd) + "L16 " + (56 + leftFinalInbd) + "L16 56L0 56L0 " + (56 + leftFinalInbd) + "Z");

            //Left outbd spoilers
            let leftSpoilersOutdbNormalized = leftSpoilerPCT * 44.8;
            let leftFinalOutdb = leftSpoilersOutdbNormalized + spoilersHandleNormalized;
            if (leftFinalOutdb > 56) {
                leftFinalOutdb = 56;
            }
            this.leftSpoilersOutbd_1.setAttribute("d", "M0 " + (56 + leftFinalOutdb) + "L16 " + (56 + leftFinalOutdb) + "L16 56L0 56L0 " + (56 + leftFinalOutdb) + "Z");
            this.leftSpoilersOutbd_2.setAttribute("d", "M0 " + (56 + leftFinalOutdb) + "L16 " + (56 + leftFinalOutdb) + "L16 56L0 56L0 " + (56 + leftFinalOutdb) + "Z");
            this.leftSpoilersOutbd_3.setAttribute("d", "M0 " + (56 + leftFinalOutdb) + "L16 " + (56 + leftFinalOutdb) + "L16 56L0 56L0 " + (56 + leftFinalOutdb) + "Z");
            this.leftSpoilersOutbd_4.setAttribute("d", "M0 " + (56 + leftFinalOutdb) + "L16 " + (56 + leftFinalOutdb) + "L16 56L0 56L0 " + (56 + leftFinalOutdb) + "Z");

            var elevator = SimVar.GetSimVarValue("ELEVATOR DEFLECTION PCT", "percent over 100");
            let elevatorNormalized = elevator * 36;

            //left elev
            this.leftElev_1.setAttribute("transform", "translate(184 " + (460.5 + elevatorNormalized) + ")");
            this.leftElev_2.setAttribute("transform", "translate(199 " + (460.75 + elevatorNormalized) + ")");

            //Right elev
            this.rightElev_1.setAttribute("transform", "translate(394 " + (461.5 + elevatorNormalized) + ")");
            this.rightElev_2.setAttribute("transform", "translate(409 " + (461.75 + elevatorNormalized) + ")");

            var rudder = SimVar.GetSimVarValue("RUDDER DEFLECTION PCT", "percent over 100");
            let rudderNormalized = rudder * 56;
            this.rudder_1.setAttribute("transform", "translate(" + (296 + rudderNormalized) + " 490)");
            this.rudder_2.setAttribute("transform", "translate(" + (296.75 + rudderNormalized) + " 503.5)");

            //Right aileron
            var rightAilPCT = SimVar.GetSimVarValue("AILERON RIGHT DEFLECTION PCT", "percent over 100");
            let rightAilPCTNormalized = rightAilPCT * 36;
            this.righttAilOutbd.setAttribute("transform", "translate(561 " + (230.5 - rightAilPCTNormalized) + ")");
            this.rightAilInbd.setAttribute("transform", "translate(416 " + (208.5 - rightAilPCTNormalized) + ")");

            var rightSpoilerPCT = SimVar.GetSimVarValue("SPOILERS RIGHT POSITION", "percent over 100");

            //Right inbd spoilers
            let rightSpoilersInbdNormalized = rightSpoilerPCT * 11.2;
            let rightFinalInbd = rightSpoilersInbdNormalized + spoilersHandleNormalized;
            if (rightFinalInbd > 56) {
                rightFinalInbd = 56;
            }
            this.rightSpoilersInbd_1.setAttribute("d", "M0 " + (56 - rightFinalInbd) + "L16 " + (56 - rightFinalInbd) + "L16 56L0 56L0 " + (56 - rightFinalInbd) + "Z");
            this.rightSpoilersInbd_2.setAttribute("d", "M0 " + (56 - rightFinalInbd) + "L16 " + (56 - rightFinalInbd) + "L16 56L0 56L0 " + (56 - rightFinalInbd) + "Z");

            //Right outdb spoilers
            let rightSpoilersOutdbNormalized = rightSpoilerPCT * 44.8;
            let rightFinalOutdb = rightSpoilersOutdbNormalized + spoilersHandleNormalized;
            if (rightFinalOutdb > 56) {
                rightFinalOutdb = 56;
            }
            this.rightpoilersOutbd_1.setAttribute("d", "M0 " + (56 - rightFinalOutdb) + "L16 " + (56 - rightFinalOutdb) + "L16 56L0 56L0 " + (56 - rightFinalOutdb) + "Z");
            this.rightpoilersOutbd_2.setAttribute("d", "M0 " + (56 - rightFinalOutdb) + "L16 " + (56 - rightFinalOutdb) + "L16 56L0 56L0 " + (56 - rightFinalOutdb) + "Z");
            this.rightpoilersOutbd_3.setAttribute("d", "M0 " + (56 - rightFinalOutdb) + "L16 " + (56 - rightFinalOutdb) + "L16 56L0 56L0 " + (56 - rightFinalOutdb) + "Z");
            this.rightpoilersOutbd_4.setAttribute("d", "M0 " + (56 - rightFinalOutdb) + "L16 " + (56 - rightFinalOutdb) + "L16 56L0 56L0 " + (56 - rightFinalOutdb) + "Z");

            if (SimVar.GetSimVarValue("SIM ON GROUND", "bool")) {
                this.querySelector("#trim").style.stroke = "lime";
                this.querySelector(".value").style.fill = "lime";
            } else {
                this.querySelector("#trim").style.stroke = "White";
                this.querySelector(".value").style.fill = "White";
                this.querySelector("#trim").style.display = "block";
            }

            if (this.stab != null) {
                this.stab.update(_deltaTime, 1);
            }
        }
    }
    B747_8_LowerEICAS_FCTL.Display = Display;
})(B747_8_LowerEICAS_FCTL || (B747_8_LowerEICAS_FCTL = {}));
customElements.define("b747-8-lower-eicas-fctl", B747_8_LowerEICAS_FCTL.Display);
//# sourceMappingURL=B747_8_LowerEICAS_FCTL.js.map
