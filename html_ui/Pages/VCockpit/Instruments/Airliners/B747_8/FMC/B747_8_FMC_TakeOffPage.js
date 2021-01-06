class FMCTakeOffPage {
	static ShowPage1(fmc, store = {requestData: "<SEND"}) {
		fmc.clearDisplay();
		fmc.updateVSpeeds();
		FMCTakeOffPage._timer = 0;
		fmc.pageUpdate = () => {
			FMCTakeOffPage._timer++;
			if (FMCTakeOffPage._timer >= 15) {
				FMCTakeOffPage.ShowPage1(fmc);
			}
		};
		let v1 = "---";
		if (fmc.v1Speed) {
			v1 = fmc.v1Speed + "KT";
		}
		fmc.onRightInput[0] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			if (value === FMCMainDisplay.clrValue) {
				fmc.trySetV1Speed(undefined);
				FMCTakeOffPage.ShowPage1(fmc);
			}
			else if (value === "") {
				fmc._computeV1Speed();
				FMCTakeOffPage.ShowPage1(fmc);
			}
			else {
				if (fmc.trySetV1Speed(value)) {
					FMCTakeOffPage.ShowPage1(fmc);
				}
			}
		};
		let vR = "---";
		if (fmc.vRSpeed) {
			vR = fmc.vRSpeed + "KT";
		}
		fmc.onRightInput[1] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			if (value === FMCMainDisplay.clrValue) {
				fmc.trySetVRSpeed(undefined);
				FMCTakeOffPage.ShowPage1(fmc);
			}
			else if (value === "") {
				fmc._computeVRSpeed();
				FMCTakeOffPage.ShowPage1(fmc);
			}
			else {
				if (fmc.trySetVRSpeed(value)) {
					FMCTakeOffPage.ShowPage1(fmc);
				}
			}
		};
		let v2 = "---";
		if (fmc.v2Speed) {
			v2 = fmc.v2Speed + "KT";
		}
		fmc.onRightInput[2] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			if (value === FMCMainDisplay.clrValue) {
				fmc.trySetV2Speed(undefined);
				FMCTakeOffPage.ShowPage1(fmc);
			}
			else if (value === "") {
				fmc._computeV2Speed();
				FMCTakeOffPage.ShowPage1(fmc);
			}
			else {
				if (fmc.trySetV2Speed(value)) {
					FMCTakeOffPage.ShowPage1(fmc);
				}
			}
		};
		let flapsCell = "---";
		let flapsAngle = fmc.getTakeOffFlap();
		if (isFinite(flapsAngle) && flapsAngle >= 0) {
			flapsCell = flapsAngle.toFixed(0) + "°";
		}
		else {
			flapsCell = "□□°";
		}
		fmc.onLeftInput[0] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			if (fmc.setTakeOffFlap(value)) {
				if (Simplane.getIsGrounded() && Simplane.getV1Airspeed() <= 0 && Simplane.getVRAirspeed() <= 0 && Simplane.getV2Airspeed() <= 0) {
                    fmc.currentFlightPhase = FlightPhase.FLIGHT_PHASE_TAKEOFF;
                }
				FMCTakeOffPage.ShowPage1(fmc);
			}
		};
		let thrRedCell = "";
		if (isFinite(fmc.thrustReductionAltitude)) {
			thrRedCell = fmc.thrustReductionAltitude.toFixed(0);
		}
		else {
			thrRedCell = "---";
		}
		thrRedCell += "FT";
		fmc.onLeftInput[2] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			if (fmc.trySetThrustReductionAccelerationAltitude(value)) {
				FMCTakeOffPage.ShowPage1(fmc);
			}
		};
		let runwayCell = "---";
		let posCell = "----";
		let selectedRunway = fmc.flightPlanManager.getDepartureRunway();
		if (selectedRunway) {
			runwayCell = Avionics.Utils.formatRunway(selectedRunway.designation);
		}

		let cgCell = "--%";
		if (isFinite(fmc.zeroFuelWeightMassCenter)) {
			cgCell = fmc.zeroFuelWeightMassCenter.toFixed(0) + "%";
		}
		fmc.onRightInput[3] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			fmc.setZeroFuelCG(value, (result) => {
				if (result) {
					FMCTakeOffPage.ShowPage1(fmc);
				}
			});
		};

		let trimCell = "";
		if (isFinite(fmc.takeOffTrim)) {
			trimCell = fmc.takeOffTrim.toFixed(1);
		}

		let thrustCell = fmc.getThrustTakeOffTemp() + "°";
		let thrustTOMode = fmc.getThrustTakeOffMode();
		if (thrustTOMode === 0) {
			thrustTOMode = "TO[s-text]"
		} else if (thrustTOMode === 1) {
			thrustTOMode = "TO 1[s-text]"
		} else if (thrustTOMode === 2) {
			thrustTOMode = "TO 2[s-text]"
		}
		
		let grossWeightCell = "---.-";
		if (isFinite(fmc.getWeight(true))) {
			grossWeightCell = fmc.getWeight(true).toFixed(1);
		}
		
		let TOgrossWeightCell = "---.-";
		let taxiFuel = 0.6;
		if (isFinite(fmc.getWeight(true))) {
			if (fmc.simbrief.taxiFuel) {
				taxiFuel = fmc.simbrief.taxiFuel / 1000;
			}
			TOgrossWeightCell = (fmc.getWeight(true) - taxiFuel).toFixed(1);
		}

		let refSpdsCell = "off←→ON";
		const updateView = () => {
			fmc.setTemplate([
				["TAKEOFF REF", "1", "2"],
				["\xa0FLAPS", "V1"],
				[flapsCell, v1],
				["\xa0THRUST", "VR"],
				[`${thrustCell}\xa0\xa0${thrustTOMode}`, vR],
				["\xa0CG\xa0\xa0\xa0TRIM", "V2"],
				[`${cgCell}\xa0\xa0\xa0${trimCell}`, v2],
				["\xa0RWY/POS", "TOGW", "GR WT"],
				[`${runwayCell}/${posCell}`, `${TOgrossWeightCell}`, `${grossWeightCell}[s-text]`],
				["\xa0REQUEST", "REF SPDS"],
				[`${store.requestData}`, `${refSpdsCell}`],
				["__FMCSEPARATOR"],
				["<INDEX", "THRUST LIM>"]
			]);
		}
		updateView();

		fmc.onPrevPage = () => {
			FMCTakeOffPage.ShowPage2(fmc);
		};
		fmc.onNextPage = () => {
			FMCTakeOffPage.ShowPage2(fmc);
		};

		/* LSK5 */
		fmc.onLeftInput[4] = () => {
			store.requestData = "\xa0SENDING";
			updateView();
			setTimeout(
				function() {					
					fmc._TORwyWindHdg = parseFloat(SimVar.GetSimVarValue("AMBIENT WIND DIRECTION", "degrees")).toFixed(0);
					fmc._TORwyWindSpd = parseFloat(SimVar.GetSimVarValue("AMBIENT WIND VELOCITY", "knots")).toFixed(0);
					updateView();
				}, 1000
			);
		}
		
		fmc.onLeftInput[5] = () => { B747_8_FMC_InitRefIndexPage.ShowPage1(fmc); };
		fmc.onRightInput[5] = () => { FMCThrustLimPage.ShowPage1(fmc); };
	}
	static ShowPage2(fmc) {        
		fmc.clearDisplay();
		let altnThrust = "TO";
		let oat = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius") + "°C";

		/*
			RSK1
			SET ENGINE OUT OFF ACCEL HEIGHT
		*/
		let eoAccelHt = SaltyDataStore.get("TO_EO_ACCEL_HT", 1000);
		fmc.onRightInput[0] = () => {
			let value = fmc.inOut;
			value = parseInt(value);
			if (value >= 400 && value <= 9999) {				
				SaltyDataStore.get("TO_EO_ACCEL_HT", 1000);
				fmc.clearUserInput();
			} else {
				fmc.showErrorMessage(fmc.defaultInputErrorMessage);
			}
		}


		/*
			RSK2
			SET ENGINE ACCEL HT OR Q CLB HT
		*/
		let accelHt = SaltyDataStore.get("TO_ACCEL_HT", 1000);
		let qClb = SaltyDataStore.get("TO_Q_CLB_AT", 1000);
		if (!qClbActive) {
			fmc.onRightInput[1] = () => {
				let value = fmc.inOut;
				value = parseInt(value);
				if (value >= 400 && value <= 9999) {				
					SaltyDataStore.get("TO_ACCEL_HT", 1000);
					fmc.clearUserInput();
				} else {
					fmc.showErrorMessage(fmc.defaultInputErrorMessage);
				}
			}
		} else {
			fmc.onRightInput[1] = () => {
				let value = fmc.inOut;
				value = parseInt(value);
				if (value >= 800 && value <= 9999) {				
					SaltyDataStore.get("TO_EO_ACCEL_HT", 1000);
					fmc.clearUserInput();
				} else {
					fmc.showErrorMessage(fmc.defaultInputErrorMessage);
				}
			}
		}

		/*
			RSK3
			SET CLB AT, THR REDUCTION OR CLIMB BY
		*/
		let clbAt = SaltyDataStore.get("TO_CLB_AT", 3000);
		if (!qClbActive) {
			fmc.onRightInput[2] = () => {
				let value = fmc.inOut;
				value = parseInt(value);
				if (value >= 400 && value <= 9999) {				
					SaltyDataStore.get("TO_THR_REDUCTION", 3000);
					fmc.clearUserInput();
				} else {
					fmc.showErrorMessage(fmc.defaultInputErrorMessage);
				}
			}
		}

		/*
			LSK3
			SET WINDS
		*/
		let windCell = "---°/--KT";
		let rwyHdg;
		let rwyHdWnd;
		let rwyXWnd;
		let rwyHdWndCell = "--KT";
		let rwyXWndCell = "--KT";
		fmc.onLeftInput[2] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			if (value.length >= 5 && value.length <= 6) {
				value = value.split("/");
				if (value[0]) {
					console.log("---- VALUE 0 ----");
					console.log(value[0]);
					fmc._TORwyWindHdg = parseFloat(value[0]);
				}
				if (value[1]) {
					console.log("---- VALUE 1 ----");
					console.log(value[1]);            
					fmc._TORwyWindSpd = parseFloat(value[1]);
				}
			} else if (value == "") {
				fmc.inOut =  fmc._TORwyWindHdg + "/" +  fmc._TORwyWindSpd;
			} else {
				fmc.showErrorMessage(fmc.defaultInputErrorMessage);
			}
			FMCTakeOffPage.ShowPage2(fmc);
		}
		if (fmc._TORwyWindHdg != "" && fmc._TORwyWindSpd != "" && fmc.flightPlanManager.getDepartureRunway()) {
			windCell = parseFloat(fmc._TORwyWindHdg).toFixed(0) + "°/" + parseFloat(fmc._TORwyWindSpd).toFixed(0) + "KT";
			if (fmc.flightPlanManager.getDepartureRunway()) {
				rwyHdg = fmc.flightPlanManager.getDepartureRunway().direction;
				rwyHdg = parseFloat(rwyHdg).toFixed(0);
				rwyHdWnd = rwyHdg - fmc._TORwyWindHdg;
				rwyXWnd = rwyHdg - fmc._TORwyWindHdg;
				rwyHdWnd = Math.cos(rwyHdWnd * Math.PI / 180);
				console.log("---- HEADWIND ----");
				console.log(rwyHdWnd);
				rwyXWnd = Math.sin(rwyXWnd * Math.PI / 180);
				rwyHdWnd = Math.round(rwyHdWnd * fmc._TORwyWindSpd);
				rwyXWnd = Math.round(rwyXWnd * fmc._TORwyWindSpd);
				if (rwyHdWnd > 0) {
					rwyHdWndCell = rwyHdWnd + "KTH";
				} else if (rwyHdWnd == 0) {
					rwyHdWndCell = rwyHdWnd + "KT";
				} else if (rwyHdWnd < 0) {
					rwyHdWndCell = rwyHdWnd + "KTT";
				}
				if (rwyXWnd < 0) {
					rwyXWndCell = rwyXWnd + "KTR";
				} else if (rwyHdWnd == 0) {
					rwyXWndCell = rwyXWnd + "KT";
				} else if (rwyHdWnd > 0) {
					rwyXWndCell = rwyXWnd + "KTL";
				}
			}
		}

		let restoreRate = "SLOW←→FAST>";
		let slopeCond = "U0.0/DRY"
		let stdLimToGw = "987.0"
		let qClbArmed = "OFF←→ARMED>";
		let n1Pct = fmc.getThrustTakeOffLimit().toFixed(1) + "%";
		
		const updateView = () => {
			fmc.setTemplate([
				["TAKEOFF REF", "2", "2"],
				["ALTN THRUST", "EO ACCEL HT"],
				[`<${altnThrust}[color]inop`, `${eoAccelHt}FT`],
				["\xa0REF OAT", "ACCEL HT"],
				[`${oat}`, `${accelHt}FT`],
				["\xa0WIND", "THR REDUCTION"],
				[`${windCell}`, `${clbAt}FT`],
				["\xa0RWY WIND", "RESTORE RATE"],
				[`${rwyHdWndCell}\xa0\xa0${rwyXWndCell}`, `${restoreRate}[s-text][color]inop`],
				["\xa0SLOPE/COND", "STD LIM TOGW"],
				[`${slopeCond}[color]inop`, `${stdLimToGw}[color]inop`],
				["", "Q_CLB", "N1"],
				["<INDEX", `${qClbArmed}[s-text][color]inop`, `${n1Pct}`]
			]);
		}
		updateView();

		fmc.onPrevPage = () => {
			FMCTakeOffPage.ShowPage1(fmc);
		};
		fmc.onNextPage = () => {
			FMCTakeOffPage.ShowPage1(fmc);
		};

		fmc.onLeftInput[5] = () => { B747_8_FMC_InitRefIndexPage.ShowPage1(fmc); };
	}
}
FMCTakeOffPage._timer = 0;
//# sourceMappingURL=B747_8_FMC_TakeOffPage.js.map