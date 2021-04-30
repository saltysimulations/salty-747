class FMC_COMM_Requests {
    static ShowPage(fmc) {
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();
        
        const updateView = () => {
            fmc.setTemplate([
                ["ACARS REQUESTS"],
                ["", ""],
                ["<PDC", "WEATHER>"],
                ["", ""],
                ["<ROUTE[color]inop", "ATIS>"],
                ["", ""],
                ["<RELEASE[color]inop", "ARR INFO>[color]inop"],
                ["", ""],
                ["<LOADSHEET[color]inop", "LAND PERF>[color]inop"],
                ["", "FREE TEXT[color]inop"],
                ["<T/O PERF[color]inop", "TELEX>[color]inop"],
                ["\xa0ACARS", "DATA LINK"],
                ["<INDEX", "READY"]
            ]);
        }
        updateView();
        
        fmc.onLeftInput[0] = () => {
            FMC_COMM_PDC.ShowPage(fmc);
        }
        
        fmc.onLeftInput[5] = () => {
            FMC_COMM_Index.ShowPage(fmc);
        }
        
        fmc.onRightInput[0] = () => {
            FMC_COMM_RequestWeather.ShowPage(fmc);
        }
        
        fmc.onRightInput[1] = () => {
            FMC_COMM_RequestAtis.ShowPage(fmc);
        }
    }
}