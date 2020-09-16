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
            this.months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            this.date = document.querySelector("#date"),
            this.utcTime = document.querySelector("#utctime");
            this.elapsedTime = document.querySelector("#time");
        }
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            this.updateClock();
        }
        updateClock() {
            var utc = new Date();
            if (utc.getUTCHours() <= 9) {
                var utcHours = "0" + utc.getUTCHours();
            } else {
                var utcHours = utc.getUTCHours();
            }
            if (utc.getUTCMinutes() <= 9) {
                var utcMinutes = "0" + utc.getUTCMinutes();
            } else {
                var utcMinutes = utc.getUTCMinutes();
            }
            if (utc.getUTCSeconds() <= 9) {
                var utcSeconds = "0" + utc.getUTCSeconds();
            } else {
                var utcSeconds = utc.getUTCSeconds();
            }
            var combinedUTC = utcHours + ":" + utcMinutes + ":" + utcSeconds;
            var combinedDate = utc.getUTCDate() + " " + this.months[utc.getUTCMonth()] + " " + utc.getUTCFullYear();
            this.utcTime.textContent = combinedUTC;
            this.date.textContent = combinedDate;
        }
    }
        
    B747_8_LowerEICAS_Stat.Display = Display;
})(B747_8_LowerEICAS_Stat || (B747_8_LowerEICAS_Stat = {}));
customElements.define("b747-8-lower-eicas-stat", B747_8_LowerEICAS_Stat.Display);
//# sourceMappingURL=B747_8_LowerEICAS_Stat.js.map