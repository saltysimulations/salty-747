var B747_8_LowerEICAS_ELEC;
(function(B747_8_LowerEICAS_ELEC) {
	class Display extends Airliners.EICASTemplateElement {
		constructor() {
			super();
			this.isInitialised = false;
		}
		get templateID() {
			return "B747_8LowerEICASELECTemplate"
		}
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

			//APU CONNECTION LOGIC
			if ((SimVar.GetSimVarValue("APU GENERATOR ACTIVE:1", "bool")) && (SimVar.GetSimVarValue("APU GENERATOR SWITCH:1", "bool"))) {
				this.querySelector("#apu1-greenpath").style.visibility = "visible";
			} else {

				this.querySelector("#apu1-greenpath").style.visibility = "hidden";
			}
			if ((SimVar.GetSimVarValue("APU GENERATOR ACTIVE:2", "bool")) && (SimVar.GetSimVarValue("APU GENERATOR SWITCH:2", "bool"))) {
				this.querySelector("#apu2-greenpath").style.visibility = "visible";
			} else {

				this.querySelector("#apu2-greenpath").style.visibility = "hidden";
			}

			//EXTERNAL POWER CONNECTION LOGIC
			if ((SimVar.GetSimVarValue("EXTERNAL POWER ON:1", "bool")) && (SimVar.GetSimVarValue("EXTERNAL POWER AVAILABLE:1", "bool"))) {
				this.querySelector("#ext1-greenpath").style.visibility = "visible";
			} else {

				this.querySelector("#ext1-greenpath").style.visibility = "hidden";
			}
			if ((SimVar.GetSimVarValue("EXTERNAL POWER ON:2", "bool")) && (SimVar.GetSimVarValue("EXTERNAL POWER AVAILABLE:2", "bool"))) {
				this.querySelector("#ext2-greenpath").style.visibility = "visible";
			} else {

				this.querySelector("#ext2-greenpath").style.visibility = "hidden";
			}

			//SSB LOGIC - SSB OPENS WHEN MORE THAN ONE EXT OR APU IS ACTIVE & CONNECTED TO SYNC BUS
			if (((SimVar.GetSimVarValue("APU GENERATOR ACTIVE:1", "bool")) && (SimVar.GetSimVarValue("APU GENERATOR SWITCH:1", "bool"))) && (((SimVar.GetSimVarValue("APU GENERATOR ACTIVE:2", "bool")) && (SimVar.GetSimVarValue("APU GENERATOR SWITCH:2", "bool"))) || ((SimVar.GetSimVarValue("EXTERNAL POWER ON:2", "bool") && (SimVar.GetSimVarValue("EXTERNAL POWER AVAILABLE:2", "bool")))))) {
				this.querySelector("#ssboff-rect").style.visibility = "visible";
				this.querySelector("#ssbon-rect").style.visibility = "hidden";
				this.querySelector("#ssb-greenpath").style.visibility = "hidden";
			} else if (((SimVar.GetSimVarValue("EXTERNAL POWER ON:1", "bool")) && (SimVar.GetSimVarValue("EXTERNAL POWER AVAILABLE:1", "bool"))) && (((SimVar.GetSimVarValue("APU GENERATOR ACTIVE:2", "bool")) && (SimVar.GetSimVarValue("APU GENERATOR SWITCH:2", "bool"))) || ((SimVar.GetSimVarValue("EXTERNAL POWER ON:2", "bool") && (SimVar.GetSimVarValue("EXTERNAL POWER AVAILABLE:2", "bool")))))) {
				this.querySelector("#ssboff-rect").style.visibility = "visible";
				this.querySelector("#ssbon-rect").style.visibility = "hidden";
				this.querySelector("#ssb-greenpath").style.visibility = "hidden";
			} else if (((SimVar.GetSimVarValue("EXTERNAL POWER ON:2", "bool")) && (SimVar.GetSimVarValue("EXTERNAL POWER AVAILABLE:2", "bool"))) && (((SimVar.GetSimVarValue("APU GENERATOR ACTIVE:1", "bool")) && (SimVar.GetSimVarValue("APU GENERATOR SWITCH:1", "bool"))) || ((SimVar.GetSimVarValue("EXTERNAL POWER ON:1", "bool") && (SimVar.GetSimVarValue("EXTERNAL POWER AVAILABLE:1", "bool")))))) {
				this.querySelector("#ssboff-rect").style.visibility = "visible";
				this.querySelector("#ssbon-rect").style.visibility = "hidden";
				this.querySelector("#ssb-greenpath").style.visibility = "hidden";
			} else if (((SimVar.GetSimVarValue("APU GENERATOR ACTIVE:2", "bool")) && (SimVar.GetSimVarValue("APU GENERATOR SWITCH:2", "bool"))) && (((SimVar.GetSimVarValue("APU GENERATOR ACTIVE:1", "bool")) && (SimVar.GetSimVarValue("APU GENERATOR SWITCH:1", "bool"))) || ((SimVar.GetSimVarValue("EXTERNAL POWER ON:1", "bool") && (SimVar.GetSimVarValue("EXTERNAL POWER AVAILABLE:1", "bool")))))) {
				this.querySelector("#ssboff-rect").style.visibility = "visible";
				this.querySelector("#ssbon-rect").style.visibility = "hidden";
				this.querySelector("#ssb-greenpath").style.visibility = "hidden";
			} else {
				this.querySelector("#ssboff-rect").style.visibility = "hidden";
				this.querySelector("#ssbon-rect").style.visibility = "visible";
				this.querySelector("#ssb-greenpath").style.visibility = "visible";
			}

			//BUS TIE BREAKER LOGIC - CHECK IF EACH BUS TIE BREAKER IS CLOSED
			if (SimVar.GetSimVarValue("BUS CONNECTION ON:2", "bool")) {
				this.querySelector("#bustie1-rect").style.stroke = "white";
				this.querySelector("#bustie1outline-left").style.visibility = "visible";
				this.querySelector("#bustie1outline-right").style.visibility = "visible";
				this.querySelector("#bustie1-greenpath").style.visibility = "visible";
				this.querySelector("#bus1tobustie-greenpath").style.visibility = "visible";
				this.querySelector("#bus1iso-text").style.visibility = "hidden";
				this.querySelector("#blank5-rect").style.visibility = "visible";
			} else {

				this.querySelector("#bustie1-rect").style.stroke = "#db7200";
				this.querySelector("#bustie1outline-left").style.visibility = "hidden";
				this.querySelector("#bustie1outline-right").style.visibility = "hidden";
				this.querySelector("#bustie1-greenpath").style.visibility = "hidden";
				this.querySelector("#bus1tobustie-greenpath").style.visibility = "hidden";
				this.querySelector("#bus1iso-text").style.visibility = "visible";
				this.querySelector("#blank5-rect").style.visibility = "hidden";
			}

			if (SimVar.GetSimVarValue("BUS CONNECTION ON:3", "bool")) {
				this.querySelector("#bustie2-rect").style.stroke = "white";
				this.querySelector("#bustie2outline-left").style.visibility = "visible";
				this.querySelector("#bustie2outline-right").style.visibility = "visible";
				this.querySelector("#bustie2-greenpath").style.visibility = "visible";
				this.querySelector("#bus2tobustie-greenpath").style.visibility = "visible";
				this.querySelector("#bus2iso-text").style.visibility = "hidden";
				this.querySelector("#blank6-rect").style.visibility = "visible";
			} else {

				this.querySelector("#bustie2-rect").style.stroke = "#db7200";
				this.querySelector("#bustie2outline-left").style.visibility = "hidden";
				this.querySelector("#bustie2outline-right").style.visibility = "hidden";
				this.querySelector("#bustie2-greenpath").style.visibility = "hidden";
				this.querySelector("#bus2tobustie-greenpath").style.visibility = "hidden";
				this.querySelector("#bus2iso-text").style.visibility = "visible";
				this.querySelector("#blank6-rect").style.visibility = "hidden";
			}

			if (SimVar.GetSimVarValue("BUS CONNECTION ON:4", "bool")) {
				this.querySelector("#bustie3-rect").style.stroke = "white";
				this.querySelector("#bustie3outline-left").style.visibility = "visible";
				this.querySelector("#bustie3outline-right").style.visibility = "visible";
				this.querySelector("#bustie3-greenpath").style.visibility = "visible";
				this.querySelector("#bus3tobustie-greenpath").style.visibility = "visible";
				this.querySelector("#bus3iso-text").style.visibility = "hidden";
				this.querySelector("#blank7-rect").style.visibility = "visible";
			} else {

				this.querySelector("#bustie3-rect").style.stroke = "#db7200";
				this.querySelector("#bustie3outline-left").style.visibility = "hidden";
				this.querySelector("#bustie3outline-right").style.visibility = "hidden";
				this.querySelector("#bustie3-greenpath").style.visibility = "hidden";
				this.querySelector("#bus3tobustie-greenpath").style.visibility = "hidden";
				this.querySelector("#bus3iso-text").style.visibility = "visible";
				this.querySelector("#blank7-rect").style.visibility = "hidden";
			}

			if (SimVar.GetSimVarValue("BUS CONNECTION ON:5", "bool")) {
				this.querySelector("#bustie4-rect").style.stroke = "white";
				this.querySelector("#bustie4outline-left").style.visibility = "visible";
				this.querySelector("#bustie4outline-right").style.visibility = "visible";
				this.querySelector("#bustie4-greenpath").style.visibility = "visible";
				this.querySelector("#bus4tobustie-greenpath").style.visibility = "visible";
				this.querySelector("#bus4iso-text").style.visibility = "hidden";
				this.querySelector("#blank8-rect").style.visibility = "visible";
			} else {

				this.querySelector("#bustie4-rect").style.stroke = "#db7200";
				this.querySelector("#bustie4outline-left").style.visibility = "hidden";
				this.querySelector("#bustie4outline-right").style.visibility = "hidden";
				this.querySelector("#bustie4-greenpath").style.visibility = "hidden";
				this.querySelector("#bus4tobustie-greenpath").style.visibility = "hidden";
				this.querySelector("#bus4iso-text").style.visibility = "visible";
				this.querySelector("#blank8-rect").style.visibility = "hidden";
			}

			//BUS DISPLAY LOGIC - EACH BUS IS SHOWN AS POWERED IF ASSOCIATED GEN IS ON OR BUS TIE IS CLOSED AND SYNC BUS IS POWERED
			if (((SimVar.GetSimVarValue("GENERAL ENG MASTER ALTERNATOR:1", "bool")) && (SimVar.GetSimVarValue("TURB ENG N2:1", "percent") >= 50)) || ((SimVar.GetSimVarValue("ELECTRICAL MAIN BUS VOLTAGE:1", "volts") > 0) && (SimVar.GetSimVarValue("BUS CONNECTION ON:2", "bool")))) {
				this.querySelector("#bus1label-rect").style.stroke = "lime";
				this.querySelector("#bus1off-text").style.fill = "lime";
				this.querySelector("#utilityline1a").style.stroke = "lime";
				this.querySelector("#utilityline1b").style.stroke = "lime";
				this.querySelector("#utility1-text").style.fill = "lime";
				this.querySelector("#galleyline1a").style.stroke = "lime";
				this.querySelector("#galleyline1b").style.stroke = "lime";
				this.querySelector("#galley1-text").style.fill = "lime";
			} else {
				this.querySelector("#bus1label-rect").style.stroke = "#db7200";
				this.querySelector("#bus1off-text").style.fill = "#db7200";
				this.querySelector("#utilityline1a").style.stroke = "#db7200";
				this.querySelector("#utilityline1b").style.stroke = "#db7200";
				this.querySelector("#utility1-text").style.fill = "#db7200";
				this.querySelector("#galleyline1a").style.stroke = "#db7200";
				this.querySelector("#galleyline1b").style.stroke = "#db7200";
				this.querySelector("#galley1-text").style.fill = "#db7200";
			}

			if (((SimVar.GetSimVarValue("GENERAL ENG MASTER ALTERNATOR:2", "bool")) && (SimVar.GetSimVarValue("TURB ENG N2:2", "percent") >= 50)) || ((SimVar.GetSimVarValue("ELECTRICAL MAIN BUS VOLTAGE:1", "volts") > 0) && (SimVar.GetSimVarValue("BUS CONNECTION ON:3", "bool")))) {
				this.querySelector("#bus2label-rect").style.stroke = "lime";
				this.querySelector("#bus2off-text").style.fill = "lime";
				this.querySelector("#utilityline2a").style.stroke = "lime";
				this.querySelector("#utilityline2b").style.stroke = "lime";
				this.querySelector("#utility2-text").style.fill = "lime";
				this.querySelector("#galleyline2a").style.stroke = "lime";
				this.querySelector("#galleyline2b").style.stroke = "lime";
				this.querySelector("#galley2-text").style.fill = "lime";
			} else {
				this.querySelector("#bus2label-rect").style.stroke = "#db7200";
				this.querySelector("#bus2off-text").style.fill = "#db7200";
				this.querySelector("#utilityline2a").style.stroke = "#db7200";
				this.querySelector("#utilityline2b").style.stroke = "#db7200";
				this.querySelector("#utility2-text").style.fill = "#db7200";
				this.querySelector("#galleyline2a").style.stroke = "#db7200";
				this.querySelector("#galleyline2b").style.stroke = "#db7200";
				this.querySelector("#galley2-text").style.fill = "#db7200";
			}

			if (((SimVar.GetSimVarValue("GENERAL ENG MASTER ALTERNATOR:3", "bool")) && (SimVar.GetSimVarValue("TURB ENG N2:3", "percent") >= 50)) || ((SimVar.GetSimVarValue("ELECTRICAL MAIN BUS VOLTAGE:1", "volts") > 0) && (SimVar.GetSimVarValue("BUS CONNECTION ON:4", "bool")))) {
				this.querySelector("#bus3label-rect").style.stroke = "lime";
				this.querySelector("#bus3off-text").style.fill = "lime";
				this.querySelector("#utilityline3a").style.stroke = "lime";
				this.querySelector("#utilityline3b").style.stroke = "lime";
				this.querySelector("#utility3-text").style.fill = "lime";
				this.querySelector("#galleyline3a").style.stroke = "lime";
				this.querySelector("#galleyline3b").style.stroke = "lime";
				this.querySelector("#galley3-text").style.fill = "lime";
			} else {
				this.querySelector("#bus3label-rect").style.stroke = "#db7200";
				this.querySelector("#bus3off-text").style.fill = "#db7200";
				this.querySelector("#utilityline3a").style.stroke = "#db7200";
				this.querySelector("#utilityline3b").style.stroke = "#db7200";
				this.querySelector("#utility3-text").style.fill = "#db7200";
				this.querySelector("#galleyline3a").style.stroke = "#db7200";
				this.querySelector("#galleyline3b").style.stroke = "#db7200";
				this.querySelector("#galley3-text").style.fill = "#db7200";
			}

			if (((SimVar.GetSimVarValue("GENERAL ENG MASTER ALTERNATOR:4", "bool")) && (SimVar.GetSimVarValue("TURB ENG N2:4", "percent") >= 50)) || ((SimVar.GetSimVarValue("ELECTRICAL MAIN BUS VOLTAGE:1", "volts") > 0) && (SimVar.GetSimVarValue("BUS CONNECTION ON:5", "bool")))) {
				this.querySelector("#bus4label-rect").style.stroke = "lime";
				this.querySelector("#bus4off-text").style.fill = "lime";
				this.querySelector("#utilityline4a").style.stroke = "lime";
				this.querySelector("#utilityline4b").style.stroke = "lime";
				this.querySelector("#utility4-text").style.fill = "lime";
				this.querySelector("#galleyline4a").style.stroke = "lime";
				this.querySelector("#galleyline4b").style.stroke = "lime";
				this.querySelector("#galley4-text").style.fill = "lime";
			} else {
				this.querySelector("#bus4label-rect").style.stroke = "#db7200";
				this.querySelector("#bus4off-text").style.fill = "#db7200";
				this.querySelector("#utilityline4a").style.stroke = "#db7200";
				this.querySelector("#utilityline4b").style.stroke = "#db7200";
				this.querySelector("#utility4-text").style.fill = "#db7200";
				this.querySelector("#galleyline4a").style.stroke = "#db7200";
				this.querySelector("#galleyline4b").style.stroke = "#db7200";
				this.querySelector("#galley4-text").style.fill = "#db7200";
			}

			//GEN DISPLAY LOGIC - CHECK EACH GEN IS ON AND N2 RPM ABOVE 50%
			if ((SimVar.GetSimVarValue("GENERAL ENG MASTER ALTERNATOR:1", "bool")) && (SimVar.GetSimVarValue("TURB ENG N2:1", "percent") >= 50)) {
				this.querySelector("#gen1-rect").style.stroke = "white";
				this.querySelector("#gen1outline-left").style.visibility = "visible";
				this.querySelector("#gen1outline-right").style.visibility = "visible";
				this.querySelector("#gen1-greenpath").style.visibility = "visible";
				this.querySelector("#gen1tobus-greenpath").style.visibility = "visible";
				this.querySelector("#blank1-rect").style.visibility = "visible";
				this.querySelector("#gen1off-text").style.visibility = "hidden";
			} else {
				this.querySelector("#gen1-rect").style.stroke = "#db7200";
				this.querySelector("#gen1outline-left").style.visibility = "hidden";
				this.querySelector("#gen1outline-right").style.visibility = "hidden";
				this.querySelector("#gen1-greenpath").style.visibility = "hidden";
				this.querySelector("#gen1tobus-greenpath").style.visibility = "hidden";
				this.querySelector("#blank1-rect").style.visibility = "hidden";
				this.querySelector("#gen1off-text").style.visibility = "visible";
			}

			if ((SimVar.GetSimVarValue("GENERAL ENG MASTER ALTERNATOR:2", "bool")) && (SimVar.GetSimVarValue("TURB ENG N2:2", "percent") >= 50)) {
				this.querySelector("#gen2-rect").style.stroke = "white";
				this.querySelector("#gen2outline-left").style.visibility = "visible";
				this.querySelector("#gen2outline-right").style.visibility = "visible";
				this.querySelector("#gen2-greenpath").style.visibility = "visible";
				this.querySelector("#gen2tobus-greenpath").style.visibility = "visible";
				this.querySelector("#blank2-rect").style.visibility = "visible";
				this.querySelector("#gen2off-text").style.visibility = "hidden";
			} else {
				this.querySelector("#gen2-rect").style.stroke = "#db7200";
				this.querySelector("#gen2outline-left").style.visibility = "hidden";
				this.querySelector("#gen2outline-right").style.visibility = "hidden";
				this.querySelector("#gen2-greenpath").style.visibility = "hidden";
				this.querySelector("#gen2tobus-greenpath").style.visibility = "hidden";
				this.querySelector("#blank2-rect").style.visibility = "hidden";
				this.querySelector("#gen2off-text").style.visibility = "visible";
			}

			if ((SimVar.GetSimVarValue("GENERAL ENG MASTER ALTERNATOR:3", "bool")) && (SimVar.GetSimVarValue("TURB ENG N2:3", "percent") >= 50)) {
				this.querySelector("#gen3-rect").style.stroke = "white";
				this.querySelector("#gen3outline-left").style.visibility = "visible";
				this.querySelector("#gen3outline-right").style.visibility = "visible";
				this.querySelector("#gen3-greenpath").style.visibility = "visible";
				this.querySelector("#gen3tobus-greenpath").style.visibility = "visible";
				this.querySelector("#blank3-rect").style.visibility = "visible";
				this.querySelector("#gen3off-text").style.visibility = "hidden";
			} else {
				this.querySelector("#gen3-rect").style.stroke = "#db7200";
				this.querySelector("#gen3outline-left").style.visibility = "hidden";
				this.querySelector("#gen3outline-right").style.visibility = "hidden";
				this.querySelector("#gen3-greenpath").style.visibility = "hidden";
				this.querySelector("#gen3tobus-greenpath").style.visibility = "hidden";
				this.querySelector("#blank3-rect").style.visibility = "hidden";
				this.querySelector("#gen3off-text").style.visibility = "visible";
			}
			if ((SimVar.GetSimVarValue("GENERAL ENG MASTER ALTERNATOR:4", "bool")) && (SimVar.GetSimVarValue("TURB ENG N2:4", "percent") >= 50)) {
				this.querySelector("#gen4-rect").style.stroke = "white";
				this.querySelector("#gen4outline-left").style.visibility = "visible";
				this.querySelector("#gen4outline-right").style.visibility = "visible";
				this.querySelector("#gen4-greenpath").style.visibility = "visible";
				this.querySelector("#gen4tobus-greenpath").style.visibility = "visible";
				this.querySelector("#blank4-rect").style.visibility = "visible";
				this.querySelector("#gen4off-text").style.visibility = "hidden";
			} else {
				this.querySelector("#gen4-rect").style.stroke = "#db7200";
				this.querySelector("#gen4outline-left").style.visibility = "hidden";
				this.querySelector("#gen4outline-right").style.visibility = "hidden";
				this.querySelector("#gen4-greenpath").style.visibility = "hidden";
				this.querySelector("#gen4tobus-greenpath").style.visibility = "hidden";
				this.querySelector("#blank4-rect").style.visibility = "hidden";
				this.querySelector("#gen4off-text").style.visibility = "visible";
			}

			//GEN DRIVE LOGIC - CHECK EACH ENG N2 RPM ABOVE 50%
			if (SimVar.GetSimVarValue("TURB ENG N2:1", "percent") >= 50) {
				this.querySelector("#drive1-rect").style.stroke = "lime";
				this.querySelector("#drive1offupper-text").style.visibility = "hidden";
				this.querySelector("#drive1offmiddle-text").style.visibility = "hidden";
				this.querySelector("#drive1offlower-text").style.visibility = "hidden";
			} else {
				this.querySelector("#drive1-rect").style.stroke = "#db7200";
				this.querySelector("#drive1offupper-text").style.visibility = "visible";
				this.querySelector("#drive1offmiddle-text").style.visibility = "visible";
				this.querySelector("#drive1offlower-text").style.visibility = "visible";
			}

			if (SimVar.GetSimVarValue("TURB ENG N2:2", "percent") >= 50) {
				this.querySelector("#drive2-rect").style.stroke = "lime";
				this.querySelector("#drive2offupper-text").style.visibility = "hidden";
				this.querySelector("#drive2offmiddle-text").style.visibility = "hidden";
				this.querySelector("#drive2offlower-text").style.visibility = "hidden";
			} else {
				this.querySelector("#drive2-rect").style.stroke = "#db7200";
				this.querySelector("#drive2offupper-text").style.visibility = "visible";
				this.querySelector("#drive2offmiddle-text").style.visibility = "visible";
				this.querySelector("#drive2offlower-text").style.visibility = "visible";
			}
			if (SimVar.GetSimVarValue("TURB ENG N2:3", "percent") >= 50) {
				this.querySelector("#drive3-rect").style.stroke = "lime";
				this.querySelector("#drive3offupper-text").style.visibility = "hidden";
				this.querySelector("#drive3offmiddle-text").style.visibility = "hidden";
				this.querySelector("#drive3offlower-text").style.visibility = "hidden";
			} else {
				this.querySelector("#drive3-rect").style.stroke = "#db7200";
				this.querySelector("#drive3offupper-text").style.visibility = "visible";
				this.querySelector("#drive3offmiddle-text").style.visibility = "visible";
				this.querySelector("#drive3offlower-text").style.visibility = "visible";
			}
			if (SimVar.GetSimVarValue("TURB ENG N2:4", "percent") >= 50) {
				this.querySelector("#drive4-rect").style.stroke = "lime";
				this.querySelector("#drive4offupper-text").style.visibility = "hidden";
				this.querySelector("#drive4offmiddle-text").style.visibility = "hidden";
				this.querySelector("#drive4offlower-text").style.visibility = "hidden";
			} else {
				this.querySelector("#drive4-rect").style.stroke = "#db7200";
				this.querySelector("#drive4offupper-text").style.visibility = "visible";
				this.querySelector("#drive4offmiddle-text").style.visibility = "visible";
				this.querySelector("#drive4offlower-text").style.visibility = "visible";
			}

		}
	}
	B747_8_LowerEICAS_ELEC.Display = Display;
})(B747_8_LowerEICAS_ELEC || (B747_8_LowerEICAS_ELEC = {}));
customElements.define("b747-8-lower-eicas-elec", B747_8_LowerEICAS_ELEC.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ELEC.js.map
