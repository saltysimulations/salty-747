class FMC_ATC_WhenCanWe{
    static ShowPage(fmc) {
        fmc.clearDisplay();
		fmc.setTemplate([
			["WHEN CAN WE EXPECT"],
			["\xa0CRZ CLB TO", ""],
			["-----", ""],
			["\xa0CLIMB TO", ""],
			["-----", "HIGHER ALT>[s-text]"],
			["\xa0DESCEND TO", ""],
			["-----", "HIGHER ALT>[s-text]"],
			["\xa0SPEED", ""],
			["---", "BACK ON RTE>[s-text]"],
			["", "OLD"],
			["<ERASE WHEN CAN WE", ""],
			["", "", "__FMCSEPARATOR"],
			["<ATC INDEX", "VERIFY>"]
		]);

		fmc.onLeftInput[5] = () => {
			FMC_ATC_Index.ShowPage(fmc);
		}
    }
}