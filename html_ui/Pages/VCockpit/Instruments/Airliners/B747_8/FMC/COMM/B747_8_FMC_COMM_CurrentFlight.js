class FMC_COMM_CurrentFlight {
    static ShowPage(fmc) {
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();
        
        const updateView = () => {
            fmc.setTemplate([
                ["ACARS CURRENT FLIGHT"],
                ["\xa0FLT NO", "DEPT/DEST"],
                ["□□□□□□", "□□□□/□□□□"],
                ["\xa0DATE", "ETA"],
                ["30DEC20", "----Z"],
                ["\xa0OUT", "OFF"],
                ["----Z", "----Z"],
                ["\xa0IN", "ON"],
                ["----Z", "----Z"],
                ["\xa0BLOCK", "FLIGHT"],
                ["--H--M", "--H--M"],
                ["\xa0RETURN TO", "MANUAL"],
                ["<POSTFLIGHT", "SEND>"],
            ]);
        }
        updateView();
        
        fmc.onLeftInput[5] = () => {
            FMC_COMM_Postflight.ShowPage(fmc);
        }
    }
}