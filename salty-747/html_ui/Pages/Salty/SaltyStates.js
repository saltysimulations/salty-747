class SaltyStates {
    constructor() {
        console.log("SaltyStates loaded");
        this.flightHasLoaded = false;

        this.main1stored = SaltyDataStore.get("747_MAIN1_LAST_QUANTITY_" + this.livery, '') ? parseFloat(SaltyDataStore.get("747_MAIN1_LAST_QUANTITY_" + this.livery, '')) : "";
        console.log(this.main1stored + " main1 on construct")
        this.main2stored = SaltyDataStore.get("747_MAIN1_LAST_QUANTITY_" + this.livery, '') ? parseFloat(SaltyDataStore.get("747_MAIN2_LAST_QUANTITY_" + this.livery, '')) : "";
        this.main3stored = SaltyDataStore.get("747_MAIN1_LAST_QUANTITY_" + this.livery, '') ? parseFloat(SaltyDataStore.get("747_MAIN3_LAST_QUANTITY_" + this.livery, '')) : "";
        this.main4stored = SaltyDataStore.get("747_MAIN1_LAST_QUANTITY_" + this.livery, '') ? parseFloat(SaltyDataStore.get("747_MAIN4_LAST_QUANTITY_" + this.livery, '')) : "";
        this.res1stored = SaltyDataStore.get("747_MAIN1_LAST_QUANTITY_" + this.livery, '') ? parseFloat(SaltyDataStore.get("747_RES1_LAST_QUANTITY_" + this.livery, '')) : "";
        this.res2stored = SaltyDataStore.get("747_MAIN1_LAST_QUANTITY_" + this.livery, '') ? parseFloat(SaltyDataStore.get("747_RES2_LAST_QUANTITY_" + this.livery, '')) : "";
        this.centerstored = SaltyDataStore.get("747_MAIN1_LAST_QUANTITY_" + this.livery, '') ? parseFloat(SaltyDataStore.get("747_CENTER_LAST_QUANTITY_" + this.livery, '')) : "";
        this.stabstored = SaltyDataStore.get("747_MAIN1_LAST_QUANTITY_" + this.livery, '') ? parseFloat(SaltyDataStore.get("747_STAB_LAST_QUANTITY_" + this.livery, '')) : "";
        this.livery;
    }// ends constructor

    Init() {

    }

    onFlightStart() {
        var liverySimVar = SimVar.GetSimVarValue("TITLE", "string");
        this.livery = liverySimVar.replace(/\s+/g, '_');
        console.log("The livery is " + this.livery);
        console.log("main1 stored on flight start " + this.main1stored);
        
        // Load last fuel quantity
        SimVar.SetSimVarValue("FUEL TANK LEFT AUX QUANTITY", "Gallons", this.main1stored);
        SimVar.SetSimVarValue("FUEL TANK LEFT MAIN QUANTITY", "Gallons", this.main2stored);
        SimVar.SetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "Gallons", this.main3stored);
        SimVar.SetSimVarValue("FUEL TANK RIGHT AUX QUANTITY", "Gallons", this.main4stored);
        SimVar.SetSimVarValue("FUEL TANK LEFT TIP QUANTITY", "Gallons", this.res1stored);
        SimVar.SetSimVarValue("FUEL TANK RIGHT TIP QUANTITY", "Gallons", this.res2stored);
        SimVar.SetSimVarValue("FUEL TANK CENTER QUANTITY", "Gallons", this.centerstored);
        SimVar.SetSimVarValue("FUEL TANK CENTER2 QUANTITY", "Gallons", this.stabstored);
        this.flightHasLoaded = true;
        
        var timerMilSecs = 10000;
        if (this.flightHasLoaded) {
            var timer = window.setInterval(saveAcftState, timerMilSecs);

            function saveAcftState() {
                // Stores last fuel quantity
        
                const main1CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK LEFT AUX QUANTITY", "Gallons");
                const main2CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK LEFT MAIN QUANTITY", "Gallons");
                const main3CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "Gallons");
                const main4CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK RIGHT AUX QUANTITY", "Gallons");
                const res1CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK LEFT TIP QUANTITY", "Gallons");
                const res2CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK RIGHT TIP QUANTITY", "Gallons");
                const centerCurrentSimVar = SimVar.GetSimVarValue("FUEL TANK CENTER QUANTITY", "Gallons");
                const stabCurrentSimVar = SimVar.GetSimVarValue("FUEL TANK CENTER2 QUANTITY", "Gallons");
                
                SaltyDataStore.set("747_MAIN1_LAST_QUANTITY_" + this.livery, main1CurrentSimVar.toString());
                SaltyDataStore.set("747_MAIN2_LAST_QUANTITY_" + this.livery, main2CurrentSimVar.toString());
                SaltyDataStore.set("747_MAIN3_LAST_QUANTITY_" + this.livery, main3CurrentSimVar.toString());
                SaltyDataStore.set("747_MAIN4_LAST_QUANTITY_" + this.livery,  main4CurrentSimVar.toString());
                SaltyDataStore.set("747_RES1_LAST_QUANTITY_" + this.livery, res1CurrentSimVar.toString());
                SaltyDataStore.set("747_RES2_LAST_QUANTITY_" + this.livery, res2CurrentSimVar.toString());
                SaltyDataStore.set("747_CENTER_LAST_QUANTITY_" + this.livery, centerCurrentSimVar.toString());
                SaltyDataStore.set("747_STAB_LAST_QUANTITY_" + this.livery, stabCurrentSimVar.toString());
                console.log(SaltyDataStore.get("747_MAIN1_LAST_QUANTITY_" + this.livery) + " main1");
                /*console.log(main2CurrentSimVar + " main2");
                console.log(main3CurrentSimVar + " main3");
                console.log(main4CurrentSimVar + " main4");
                console.log(res1CurrentSimVar + " res1");
                console.log(res2CurrentSimVar + " res2");
                console.log(centerCurrentSimVar + " center");
                console.log(stabCurrentSimVar + " stab");*/
    
                clearInterval();    
            }
        }// ends if flighthasstarted
    }// ends onflightstart

    update(_deltaTime) {

    }// ends update
}