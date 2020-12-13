var B747_8_LowerEICAS_Stat;
(function (B747_8_LowerEICAS_Stat) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
            this.lastN = 0;
            this.APUWarm = false;
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
            /* HYD */
            this.hydQty1 = document.querySelector("#hydQty1");
            this.hydQty2 = document.querySelector("#hydQty2");
            this.hydQty3 = document.querySelector("#hydQty3");
            this.hydQty4 = document.querySelector("#hydQty4");
            this.hydPress1 = document.querySelector("#hydPress1");
            this.hydPress2 = document.querySelector("#hydPress2");
            this.hydPress3 = document.querySelector("#hydPress3");
            this.hydPress4 = document.querySelector("#hydPress4");
            /* APU */
            this.apuEgt = document.querySelector("#apuEgt");
            this.apuN1 = document.querySelector("#apuN1");
            this.apuN2 = document.querySelector("#apuN2");
            this.apuOilQty = document.querySelector("#apuOilQty");
            /* ELEC */
            this.mainBatV = document.querySelector("#mainBatV");
            this.apuBatV = document.querySelector("#apuBatV");
            this.mainBatA = document.querySelector("#mainBatA");
            this.apuBatA = document.querySelector("#apuBatA");
            /* DATE */
            this.navDataRange = document.querySelector("#navDataRange");
            Include.addScript("/JS/debug.js", function () {
                g_modDebugMgr.AddConsole(null);
            });
        }
        update(_deltaTime) {
            if (!this.isInitialised) {
                return;
            }
            this.updateHydraulics();
            this.updateApu();
            this.updateElec();
            this.updateNavDataDateRange();
            this.updateClock();
        }
        updateHydraulics() {
            var hydQty1 = SimVar.GetSimVarValue("HYDRAULIC RESERVOIR PERCENT:1", "").toFixed(2);
            var hydQty2 = SimVar.GetSimVarValue("HYDRAULIC RESERVOIR PERCENT:2", "").toFixed(2);
            var hydQty3 = SimVar.GetSimVarValue("HYDRAULIC RESERVOIR PERCENT:3", "").toFixed(2);
            var hydQty4 = SimVar.GetSimVarValue("HYDRAULIC RESERVOIR PERCENT:4", "").toFixed(2);
            this.hydQty1.textContent = hydQty1;
            this.hydQty2.textContent = hydQty2;
            this.hydQty3.textContent = hydQty3;
            this.hydQty4.textContent = hydQty4;


            var hydPress1 = Math.ceil(SimVar.GetSimVarValue("HYDRAULIC PRESSURE:1", "psi").toFixed(0) / 10) * 10;
            var hydPress2 = Math.ceil(SimVar.GetSimVarValue("HYDRAULIC PRESSURE:2", "psi").toFixed(0) / 10) * 10;
            var hydPress3 = Math.ceil(SimVar.GetSimVarValue("HYDRAULIC PRESSURE:3", "psi").toFixed(0) / 10) * 10;
            var hydPress4 = Math.ceil(SimVar.GetSimVarValue("HYDRAULIC PRESSURE:4", "psi").toFixed(0) / 10) * 10;
            this.hydPress1.textContent = hydPress1;
            this.hydPress2.textContent = hydPress2;
            this.hydPress3.textContent = hydPress3;
            this.hydPress4.textContent = hydPress4;
        }

        updateApu() {
            var apuEgt = getAPUEGT();
            var apuN1 = SimVar.GetSimVarValue("APU PCT RPM", "").toFixed(2);            
            var apuN2 = (SimVar.GetSimVarValue("APU PCT RPM", "") - 5).toFixed(2);
            var apuOilQty = 0.95;
            this.apuEgt.textContent = apuEgt;
            this.apuN1.textContent = apuN1;
            this.apuN2.textContent = apuN2;
            this.apuOilQty.textContent = apuOilQty;
        }

        updateElec() {
            var mainBatV = SimVar.GetSimVarValue("ELECTRICAL BATTERY BUS VOLTAGE", "volts").toFixed(0);
            var mainBatA = SimVar.GetSimVarValue("ELECTRICAL BATTERY BUS AMPS", "amperes").toFixed(0);
            if (SimVar.GetSimVarValue("APU PCT RPM", "") > 95) {
                var apuBatV = SimVar.GetSimVarValue("ELECTRICAL BATTERY BUS VOLTAGE", "volts").toFixed(0);
                var apuBatA = SimVar.GetSimVarValue("ELECTRICAL BATTERY BUS AMPS", "volts").toFixed(0);
            } else {
                var apuBatA = 0;
                var apuBatA = 0;
            }
            this.mainBatV.textContent = mainBatV;
            this.mainBatA.textContent = mainBatA;
            this.apuBatV.textContent = apuBatV;
            this.apuBatA.textContent = apuBatA;
        }

        updateNavDataDateRange() {
            var navDataRange = SimVar.GetGameVarValue("FLIGHT NAVDATA DATE RANGE", "string");
            this.navDataRange.textContent = navDataRange.toString();
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

        getAPUN() {
            return SimVar.GetSimVarValue("APU PCT RPM", "percent");
            
        }

        //Calculates the APU EGT Based on the RPM
        getAPUEGTRaw(startup) {
            var n = this.getAPUN();
            if (startup) {
                if (n < 10) {
                    return 10;
                } else if (n < 16) {
                    return (135*n)-1320;
                } else if (n < 20) {
                    return -1262 + (224*n) - (5.8 * (n*n));
                } else if (n < 36) {
                    return ((-5/4)*n) + 925;
                } else if (n < 42) {
                    return -2062 + (151.7*n) - (1.94 * (n*n));
                } else {
                    return ((-425/58)*n) + (34590/29);
                }
            } else {
                return ((18/5)*n)+100;
            }
        }

        getAPUEGT() {
            let ambient = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");

            var n = this.getAPUN();
            var egt = (Math.round(this.getAPUEGTRaw(this.lastN <= n)/5)*5);
            this.lastN = n;
            if (this.APUWarm && egt < 100) {
                return 100;
            } else {
                if (n > 1) this.APUWarm = false;
                // range from getAPUEGTRaw is 10~900 C
                return ambient + (egt - 10);
            }
        }
    }
        
    B747_8_LowerEICAS_Stat.Display = Display;
})(B747_8_LowerEICAS_Stat || (B747_8_LowerEICAS_Stat = {}));
customElements.define("b747-8-lower-eicas-stat", B747_8_LowerEICAS_Stat.Display);
//# sourceMappingURL=B747_8_LowerEICAS_Stat.js.map
