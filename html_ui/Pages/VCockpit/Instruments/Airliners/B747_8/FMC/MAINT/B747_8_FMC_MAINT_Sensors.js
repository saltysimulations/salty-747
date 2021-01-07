class FMC_MAINT_Sensors {

    static ShowPage(fmc) {
        fmc.clearDisplay();
        const oat = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius").toFixed(0);
        const tat = SimVar.GetSimVarValue("TOTAL AIR TEMPERATURE", "celsius").toFixed(0);
        const pressAlt = SimVar.GetSimVarValue("PRESSURE ALTITUDE", "meters").toFixed(0);



        const updateView = () => {
            fmc.setTemplate([
                ["SENSORS", "1", "3"],
                ["", "", "AMBIENT"],
                ["", ""],
                ["\xa0OAT", "SAT"],
                [`${oat}°C`, `${tat}°C`],
                ["\xa0PRESS ALT", ""],
                [`${pressAlt} M`, ``],
                ["", ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["\xa0MAINT", "", "__FMCSEPARATOR"],
                ["<INDEX", ""]
            ]);
        }
        updateView();

        fmc.onNextPage = () => {
            FMC_MAINT_Sensors.ShowPage2(fmc);			
        }
        
        fmc.onLeftInput[5] = () => {
            FMC_MAINT_Index.ShowPage(fmc);
        }
    }

    static ShowPage2(fmc) {
        fmc.clearDisplay();
        const centerQty = (SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:1", "kg") * 1000).toFixed(0);
        const main1Qty = (SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:2", "kg") * 1000).toFixed(0);
        const main2Qty = (SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:3", "kg") * 1000).toFixed(0);
        const main3Qty = (SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:4", "kg") * 1000).toFixed(0);
        const main4Qty = (SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:5", "kg") * 1000).toFixed(0);
        const res1Qty = (SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:6", "kg") * 1000).toFixed(0);
        const res2Qty = (SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:7", "kg") * 1000).toFixed(0);
        const stabQty = (SimVar.GetSimVarValue("FUELSYSTEM TANK QUANTITY:8", "kg") * 1000).toFixed(0);

        
        const updateView = () => {
            fmc.setTemplate([
                ["SENSORS", "2", "3"],
                ["", "", "FUEL"],
                ["", ""],
                ["\xa0MAIN 2", "MAIN 3", "CENTER"],
                [`${main2Qty}`, `${main3Qty}`, `${centerQty}`],
                ["\xa0MAIN 1", "MAIN 4"],
                [`${main1Qty}`, `${main4Qty}`],
                ["\xa0RES 1", "RES 2", "STAB"],
                [`${res1Qty}`, `${res2Qty}`, `${stabQty}`],
                ["", ""],
                ["", ""],
                ["\xa0MAINT", "", "__FMCSEPARATOR"],
                ["<INDEX", ""]
            ]);
        }
        updateView();

        fmc.onPrevPage = () => {
            FMC_MAINT_Sensors.ShowPage(fmc);
        }

        fmc.onNextPage = () => {
            FMC_MAINT_Sensors.ShowPage3(fmc);
        }
        
        fmc.onLeftInput[5] = () => {
            FMC_MAINT_Index.ShowPage(fmc);
        }
    }

    static ShowPage3(fmc) {
        fmc.clearDisplay();
        
        const updateView = () => {
            fmc.setTemplate([
                ["SENSORS", "3", "3"],
                ["", "", "MISC"],
                ["", ""],
                ["\xa0FLIGHT PHASE", ""],
                [`${fmc.currentFlightPhase}`, ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["", ""],
                ["\xa0MAINT", "", "__FMCSEPARATOR"],
                ["<INDEX", ""]
            ]);
        }
        updateView();

        fmc.onPrevPage = () => {
            FMC_MAINT_Sensors.ShowPage2(fmc);			
        }		
        
        fmc.onLeftInput[5] = () => {
            FMC_MAINT_Index.ShowPage(fmc);
        }
    }
}