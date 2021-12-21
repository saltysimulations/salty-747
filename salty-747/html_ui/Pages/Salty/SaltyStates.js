class SaltyStates {
    constructor() {
        var title = SimVar.GetSimVarValue("TITLE", "string");
        this.livery = title.replace(/\s+/g, '_');
        this.main1stored = parseFloat(SaltyDataStore.get("747_MAIN1_LAST_QUANTITY" + this.livery, ''));
        this.main2stored = parseFloat(SaltyDataStore.get("747_MAIN2_LAST_QUANTITY" + this.livery, ''));
        this.main3stored = parseFloat(SaltyDataStore.get("747_MAIN3_LAST_QUANTITY" + this.livery, ''));
        this.main4stored = parseFloat(SaltyDataStore.get("747_MAIN4_LAST_QUANTITY" + this.livery, ''));
        this.res1stored = parseFloat(SaltyDataStore.get("747_RES1_LAST_QUANTITY" + this.livery, ''));
        this.res2stored = parseFloat(SaltyDataStore.get("747_RES2_LAST_QUANTITY" + this.livery, ''));
        this.centerstored = parseFloat(SaltyDataStore.get("747_CENTER_LAST_QUANTITY" + this.livery, ''));
        this.stabstored = parseFloat(SaltyDataStore.get("747_STAB_LAST_QUANTITY" + this.livery, ''));
        this.flightHasLoaded = false;
    }

    Init() {

    }

    onFlightStart() {

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
    }

    update(_deltaTime) {
        const main1CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK LEFT AUX QUANTITY", "Gallons");
        const main2CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK LEFT MAIN QUANTITY", "Gallons");
        const main3CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "Gallons");
        const main4CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK RIGHT AUX QUANTITY", "Gallons");
        const res1CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK LEFT TIP QUANTITY", "Gallons");
        const res2CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK RIGHT TIP QUANTITY", "Gallons");
        const centerCurrentSimVar = SimVar.GetSimVarValue("FUEL TANK CENTER QUANTITY", "Gallons");
        const stabCurrentSimVar = SimVar.GetSimVarValue("FUEL TANK CENTER2 QUANTITY", "Gallons");
        /*console.log(this.flightHasLoaded);*/
        
        var timerMilSecs = 10000;
        if (this.flightHasLoaded) {
            var timer = window.setInterval(saveAcftState, timerMilSecs);

            function saveAcftState() {
                // Stores last fuel quantity
                SaltyDataStore.set("747_MAIN1_LAST_QUANTITY" + this.livery, main1CurrentSimVar.toString());
                SaltyDataStore.set("747_MAIN2_LAST_QUANTITY" + this.livery, main2CurrentSimVar.toString());
                SaltyDataStore.set("747_MAIN3_LAST_QUANTITY" + this.livery, main3CurrentSimVar.toString());
                SaltyDataStore.set("747_MAIN4_LAST_QUANTITY" + this.livery,  main4CurrentSimVar.toString());
                SaltyDataStore.set("747_RES1_LAST_QUANTITY" + this.livery, res1CurrentSimVar.toString());
                SaltyDataStore.set("747_RES2_LAST_QUANTITY" + this.livery, res2CurrentSimVar.toString());
                SaltyDataStore.set("747_CENTER_LAST_QUANTITY" + this.livery, centerCurrentSimVar.toString());
                SaltyDataStore.set("747_STAB_LAST_QUANTITY" + this.livery, stabCurrentSimVar.toString());
                console.log("747_STAB_LAST_QUANTITY" + this.livery);
                /*console.log(main1CurrentSimVar + " main1");
                console.log(main2CurrentSimVar + " main2");
                console.log(main3CurrentSimVar + " main3");
                console.log(main4CurrentSimVar + " main4");
                console.log(res1CurrentSimVar + " res1");
                console.log(res2CurrentSimVar + " res2");
                console.log(centerCurrentSimVar + " center");
                console.log(stabCurrentSimVar + " stab");*/
    
                clearInterval();    
            }
        }

    }
}