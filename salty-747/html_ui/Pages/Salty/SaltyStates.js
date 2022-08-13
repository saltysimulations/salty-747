class SaltyStates {
    constructor() {
        this.flightHasLoaded = false;

        this.main1stored = SaltyDataStore.get("747_MAIN1_LAST_QUANTITY", "") ? parseFloat(SaltyDataStore.get("747_MAIN1_LAST_QUANTITY", "")) : "";
        this.main2stored = SaltyDataStore.get("747_MAIN2_LAST_QUANTITY", "") ? parseFloat(SaltyDataStore.get("747_MAIN2_LAST_QUANTITY", "")) : "";
        this.main3stored = SaltyDataStore.get("747_MAIN3_LAST_QUANTITY", "") ? parseFloat(SaltyDataStore.get("747_MAIN3_LAST_QUANTITY", "")) : "";
        this.main4stored = SaltyDataStore.get("747_MAIN4_LAST_QUANTITY", "") ? parseFloat(SaltyDataStore.get("747_MAIN4_LAST_QUANTITY", "")) : "";
        this.res1stored = SaltyDataStore.get("747_RES1_LAST_QUANTITY", "") ? parseFloat(SaltyDataStore.get("747_RES1_LAST_QUANTITY", "")) : "";
        this.res2stored = SaltyDataStore.get("747_RES2_LAST_QUANTITY", "") ? parseFloat(SaltyDataStore.get("747_RES2_LAST_QUANTITY", "")) : "";
        this.centerstored = SaltyDataStore.get("747_CENTER_LAST_QUANTITY", "") ? parseFloat(SaltyDataStore.get("747_CENTER_LAST_QUANTITY", "")) : "";
        this.stabstored = SaltyDataStore.get("747_STAB_LAST_QUANTITY", "") ? parseFloat(SaltyDataStore.get("747_STAB_LAST_QUANTITY", "")) : "";
    }

    onFlightStart() {
        SimVar.SetSimVarValue("FUEL TANK LEFT AUX QUANTITY", "Gallons", this.main1stored);
        SimVar.SetSimVarValue("FUEL TANK LEFT MAIN QUANTITY", "Gallons", this.main2stored);
        SimVar.SetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "Gallons", this.main3stored);
        SimVar.SetSimVarValue("FUEL TANK RIGHT AUX QUANTITY", "Gallons", this.main4stored);
        SimVar.SetSimVarValue("FUEL TANK LEFT TIP QUANTITY", "Gallons", this.res1stored);
        SimVar.SetSimVarValue("FUEL TANK RIGHT TIP QUANTITY", "Gallons", this.res2stored);
        SimVar.SetSimVarValue("FUEL TANK CENTER QUANTITY", "Gallons", this.centerstored);
        SimVar.SetSimVarValue("FUEL TANK CENTER2 QUANTITY", "Gallons", this.stabstored);

        window.setInterval(this.saveState, 10000);
    }

    saveState() {
        const main1CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK LEFT AUX QUANTITY", "Gallons");
        const main2CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK LEFT MAIN QUANTITY", "Gallons");
        const main3CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "Gallons");
        const main4CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK RIGHT AUX QUANTITY", "Gallons");
        const res1CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK LEFT TIP QUANTITY", "Gallons");
        const res2CurrentSimVar = SimVar.GetSimVarValue("FUEL TANK RIGHT TIP QUANTITY", "Gallons");
        const centerCurrentSimVar = SimVar.GetSimVarValue("FUEL TANK CENTER QUANTITY", "Gallons");
        const stabCurrentSimVar = SimVar.GetSimVarValue("FUEL TANK CENTER2 QUANTITY", "Gallons");

        SaltyDataStore.set("747_MAIN1_LAST_QUANTITY", main1CurrentSimVar.toString());
        SaltyDataStore.set("747_MAIN2_LAST_QUANTITY", main2CurrentSimVar.toString());
        SaltyDataStore.set("747_MAIN3_LAST_QUANTITY", main3CurrentSimVar.toString());
        SaltyDataStore.set("747_MAIN4_LAST_QUANTITY", main4CurrentSimVar.toString());
        SaltyDataStore.set("747_RES1_LAST_QUANTITY", res1CurrentSimVar.toString());
        SaltyDataStore.set("747_RES2_LAST_QUANTITY", res2CurrentSimVar.toString());
        SaltyDataStore.set("747_CENTER_LAST_QUANTITY", centerCurrentSimVar.toString());
        SaltyDataStore.set("747_STAB_LAST_QUANTITY", stabCurrentSimVar.toString());
        console.log(SaltyDataStore.get("747_MAIN1_LAST_QUANTITY") + " main1");
    }
}