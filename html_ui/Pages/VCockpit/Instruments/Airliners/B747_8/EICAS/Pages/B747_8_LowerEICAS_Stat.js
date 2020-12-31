var B747_8_LowerEICAS_Stat;
(function (B747_8_LowerEICAS_Stat) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
            this.lastN = 0;
            this.APUWarm = false;
            this.hydTempVariation1 = Math.floor(Math.random() * 35) + 10;
            this.hydTempVariation2 = Math.floor(Math.random() * 35) + 10;
            this.hydTempVariation3 = Math.floor(Math.random() * 35) + 10;
            this.hydTempVariation4 = Math.floor(Math.random() * 35) + 10;
        }
        get templateID() { return "B747_8LowerEICASStatTemplate" }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            Include.addScript("/JS/debug.js", function () {
                g_modDebugMgr.AddConsole(null);
            });
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
            this.hydTemp1 = document.querySelector("#hydTemp1");
            this.hydTemp2 = document.querySelector("#hydTemp2");
            this.hydTemp3 = document.querySelector("#hydTemp3");
            this.hydTemp4 = document.querySelector("#hydTemp4");
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
            this.mainBattChg = document.querySelector("#mainBattChg");
            /* DATE */
            this.navDataRange = document.querySelector("#navDataRange");
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
            let oat = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");

            /* QTY */
            var hydQty1 = SimVar.GetSimVarValue("HYDRAULIC RESERVOIR PERCENT:1", "").toFixed(2);
            var hydQty2 = SimVar.GetSimVarValue("HYDRAULIC RESERVOIR PERCENT:2", "").toFixed(2);
            var hydQty3 = SimVar.GetSimVarValue("HYDRAULIC RESERVOIR PERCENT:3", "").toFixed(2);
            var hydQty4 = SimVar.GetSimVarValue("HYDRAULIC RESERVOIR PERCENT:4", "").toFixed(2);
            this.hydQty1.textContent = hydQty1;
            this.hydQty2.textContent = hydQty2;
            this.hydQty3.textContent = hydQty3;
            this.hydQty4.textContent = hydQty4;
            /* PRESS*/
            var hydPress1 = Math.ceil(SimVar.GetSimVarValue("HYDRAULIC PRESSURE:1", "psi").toFixed(0) / 10) * 10;
            var hydPress2 = Math.ceil(SimVar.GetSimVarValue("HYDRAULIC PRESSURE:2", "psi").toFixed(0) / 10) * 10;
            var hydPress3 = Math.ceil(SimVar.GetSimVarValue("HYDRAULIC PRESSURE:3", "psi").toFixed(0) / 10) * 10;
            var hydPress4 = Math.ceil(SimVar.GetSimVarValue("HYDRAULIC PRESSURE:4", "psi").toFixed(0) / 10) * 10;
            this.hydPress1.textContent = hydPress1;
            this.hydPress2.textContent = hydPress2;
            this.hydPress3.textContent = hydPress3;
            this.hydPress4.textContent = hydPress4;
            /* TEMP */
            this.hydTemp1.textContent = Math.ceil((oat + this.hydTempVariation1) / 10) * 10;
            this.hydTemp2.textContent = Math.ceil((oat + this.hydTempVariation2) / 10) * 10;
            this.hydTemp3.textContent = Math.ceil((oat + this.hydTempVariation3) / 10) * 10;
            this.hydTemp4.textContent = Math.ceil((oat + this.hydTempVariation4) / 10) * 10;
        }

        updateApu() {
            var apuEgt;
            var apuN1;
            var apuN2;
            var apuOilQty = 0.95;
            if (SimVar.GetSimVarValue("APU PCT RPM", "") > 0) {
                apuEgt = this.getAPUEGT();
                apuN1 = (this.getAPUN() / 100).toFixed(2);
                apuN2 = (this.getAPUN() / 100).toFixed(2);
                apuOilQty = 0.95;
            } else {
                apuEgt = "";
                apuN1 = "";
                apuN2 = "";
                apuOilQty = "";
            }
            this.apuEgt.textContent = apuEgt;
            this.apuN1.textContent = apuN1;
            this.apuN2.textContent = apuN2;
            this.apuOilQty.textContent = apuOilQty;
        }

        updateElec() {
            var mainBatV = SimVar.GetSimVarValue("ELECTRICAL BATTERY BUS VOLTAGE", "volts").toFixed(0);
            var mainBatA = 15;
            if (SimVar.GetSimVarValue("APU PCT RPM", "") > 0.95) {
                var apuBatV = SimVar.GetSimVarValue("ELECTRICAL BATTERY BUS VOLTAGE", "volts").toFixed(0);
                var apuBatA = 15;
            } else {
                var apuBatV = 0;
                var apuBatA = 0;
            }
            this.mainBatV.textContent = mainBatV;
            this.mainBatA.textContent = mainBatA;
            this.apuBatV.textContent = apuBatV;
            this.apuBatA.textContent = apuBatA;
            if (
                SimVar.GetSimVarValue("EXTERNAL POWER ON:1", "") || 
                SimVar.GetSimVarValue("EXTERNAL POWER ON:2", "") || 
                SimVar.GetSimVarValue("APU GENERATOR SWITCH:1", "") || 
                SimVar.GetSimVarValue("APU GENERATOR SWITCH:2", "") || 
                SimVar.GetSimVarValue("GENERAL ENG MASTER ALTERNATOR:1", "") || 
                SimVar.GetSimVarValue("GENERAL ENG MASTER ALTERNATOR:2", "") || 
                SimVar.GetSimVarValue("GENERAL ENG MASTER ALTERNATOR:3", "") || 
                SimVar.GetSimVarValue("GENERAL ENG MASTER ALTERNATOR:4", "")
                ) {
                this.mainBattChg.textContent = "CHG";
            } else {
                this.mainBattChg.textContent = "DIS";
            }
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

        getAPUEGTRaw(startup) {
            var n = this.getAPUN();
            if (startup) {
                if (n < 10) {
                    return 10;
                } else if(n <14){
                    return ((90/6*n)- 140);
                } else if (n < 20) {
                    return ((215/4*n)-760);
                } else if(n < 32){
                    return ((420/11*n)-481.8);
                } else if (n < 36) {
                    return (20/3*n)+525;
                } else if (n < 43) {
                    return ((-15/6*n)+888.3);
                } else if(n < 50){
                    return ((3*n)+618)
                } else if(n < 74){
                    return ((-100/13)*n+1152.3);
                } else {
                    return ((-104/10*n)+1430);
                }
            } else {
                return ((18/5)*n)+35;
            }
        }

        getAPUEGT() {
            let ambient = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");

            var n = this.getAPUN();
            var egt = (Math.round(this.getAPUEGTRaw(this.lastN <= n)));
            this.lastN = n;
            if (this.APUWarm && egt < 100) {
                return 100;
            } else {
                if (n > 1) this.APUWarm = false;
                return ambient + (egt - 10);
            }
        }
    }
        
    B747_8_LowerEICAS_Stat.Display = Display;
})(B747_8_LowerEICAS_Stat || (B747_8_LowerEICAS_Stat = {}));
customElements.define("b747-8-lower-eicas-stat", B747_8_LowerEICAS_Stat.Display);
//# sourceMappingURL=B747_8_LowerEICAS_Stat.js.map
