class FMC_FixInfo {
	static ShowPage(fmc, store = {
		fix: "",
		brgDisFr: "",
		brg1: "",
		eta1: "",
		dtg1: "",
		alt1: "",
		brg2: "",
		eta2: "",
		dtg2: "",
		alt2: "",
		brg3: "",
		eta3: "",
		dtg3: "",
		alt3: "",
		brgAbeam: "",
		etaAbeam: "",
		dtgAbeam: "",
		altAbeam: "",
		eraseFixCell: "",
		predEtaAltLabel: "",
		predEtaAltCell: ""
	}) {
		fmc.activeSystem = "FMC";
		fmc.clearDisplay();
		
		const updateView = () => {
			if (fmc.fixInfo) {
				store.fix = fmc.fixInfo;
			}
			fmc.setTemplate([
				["FIX INFO", "1", "4"],
				["\xa0FIX", "BRG/DIS FR"],
				[`${store.fix}`, `${store.brgDisFr}`],
				["\xa0BRG/DIS ETA", "DTG ALT"],
				[`${store.brg1} ${store.eta1}`, `${store.dtg1} ${store.alt1}`],
				["", ""],
				[`${store.brg2} ${store.eta2}`, `${store.dtg2} ${store.alt2}`],
				["", ""],
				[`${store.brg3} ${store.eta3}`, `${store.dtg3} ${store.alt3}`],
				["\xa0ABEAM", ""],
				[`${store.brgAbeam} ${store.etaAbeam}`, `${store.dtgAbeam} ${store.altAbeam}`],
				["", `${store.predEtaAltLabel}`],
				[`${store.eraseFixCell}`, `${store.predEtaAltCell}`]
			]);
		}
		updateView();

		fmc.onPrevPage = () => {
			fmc.ShowPage4(fmc);
		}
		fmc.onNextPage = () => {
			fmc.ShowPage2(fmc);
		}
		fmc.onLeftInput[0] = () => {
			let value = fmc.inOut;
			fmc.fixInfo[0].push(value);
			FMC_FixInfo.ShowPage(fmc);
		};
		fmc.onLeftInput[5] = () => {
			fmc.fixInfo[0].push("");
			FMC_FixInfo.ShowPage(fmc);
		};
	}
	static ShowPage2(fmc) {
		fmc.activeSystem = "FMC";
		fmc.clearDisplay();
		
		const updateView = () => {
			fmc.setTemplate([
				["FIX INFO", "1", "4"],
				["\xa0FIX", "BRG/DIS FR"],
				["<RTE 1", "111/ 129"],
				["\xa0BRG/DIS ETA", "DTG ALT"],
				["130/24 2000Z", "10 10000"],
				["", ""],
				["---/-- ----Z", "-- -----"],
				["", ""],
				["---/-- ----Z", "-- -----"],
				["\xa0ABEAM", ""],
				["150/23 2006", "18 15500"],
				["", "PRED ETA-ALT"],
				["<ERASE FIX", "112NM 2016Z"]
			]);
		}
		updateView();

		fmc.onPrevPage = () => {
			fmc.ShowPage(fmc);
		}

		fmc.onNextPage = () => {
			fmc.ShowPage3(fmc);
		}

		fmc.setTemplate([])
	}
	static ShowPage3(fmc) {
		fmc.activeSystem = "FMC";
		fmc.clearDisplay();
		
		const updateView = () => {
			fmc.setTemplate([
				["FIX INFO", "1", "4"],
				["\xa0FIX", "BRG/DIS FR"],
				["<RTE 1", "111/ 129"],
				["\xa0BRG/DIS ETA", "DTG ALT"],
				["130/24 2000Z", "10 10000"],
				["", ""],
				["---/-- ----Z", "-- -----"],
				["", ""],
				["---/-- ----Z", "-- -----"],
				["\xa0ABEAM", ""],
				["150/23 2006", "18 15500"],
				["", "PRED ETA-ALT"],
				["<ERASE FIX", "112NM 2016Z"]
			]);
		}
		updateView();

		fmc.onPrevPage = () => {
			fmc.ShowPage2(fmc);
		}

		fmc.onNextPage = () => {
			fmc.ShowPage4(fmc);
		}

		fmc.setTemplate([])
	}
	static ShowPage4(fmc) {
		fmc.activeSystem = "FMC";
		fmc.clearDisplay();
		
		const updateView = () => {
			fmc.setTemplate([
				["FIX INFO", "1", "4"],
				["\xa0FIX", "BRG/DIS FR"],
				["<RTE 1", "111/ 129"],
				["\xa0BRG/DIS ETA", "DTG ALT"],
				["130/24 2000Z", "10 10000"],
				["", ""],
				["---/-- ----Z", "-- -----"],
				["", ""],
				["---/-- ----Z", "-- -----"],
				["\xa0ABEAM", ""],
				["150/23 2006", "18 15500"],
				["", "PRED ETA-ALT"],
				["<ERASE FIX", "112NM 2016Z"]
			]);
		}
		updateView();

		fmc.onPrevPage = () => {
			fmc.ShowPage3(fmc);
		}

		fmc.onNextPage = () => {
			fmc.ShowPage(fmc);
		}

		fmc.setTemplate([])
	}
}