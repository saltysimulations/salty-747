class FMC_Payload {
    static ShowPage(fmc) {
        fmc.clearDisplay();

        const updateView = () => {
            FMC_Payload.ShowPage(fmc);
        };

        fmc.refreshPageCallback = () => {
            updateView();
        };

        SimVar.SetSimVarValue("L:FMC_UPDATE_CURRENT_PAGE", "number", 1);

        const unit = SaltyUnits.userWeightUnit();

        const boardingStartedByUser = SimVar.GetSimVarValue("L:747_BOARDING_STARTED_BY_USR", "Bool");
        const loadButton = boardingStartedByUser ? "STOP>" : "START>";

        const boardingRate = SaltyDataStore.get("747_CONFIG_BOARDING_RATE", "REAL");

        const desiredCargo = SimVar.GetSimVarValue("L:747_DESIRED_CARGO", "number");
        const desiredCargoText = desiredCargo === 0 ? "□□.□" : `${(desiredCargo / 1000).toFixed(1)}{small}${unit}`;

        const paxTarget = this.getPaxTarget();
        const currentPax = this.getCurrentPax();

        const selectedPaxText = paxTarget === 0 ? "□□□/{small}364" : `${paxTarget}/{small}364`;

        fmc.setTemplate([
            ["PAYLOAD"],
            ["\xa0ACT CARGO", "SEL CARGO"],
            [`${(SaltyUnits.kgToUser(getTotalCargo()) / 1000).toFixed(1)}{small}${unit}`, desiredCargoText],
            ["\xa0PAX BOARDED", "SEL PAX"],
            [`${currentPax}/{small}${paxTarget}`, selectedPaxText],
            ["\xa0TOTAL PAYLOAD", "BOARDING"],
            [`${(SaltyUnits.kgToUser(getTotalPayload()) / 1000).toFixed(1)}{small}${unit}`, loadButton],
            ["\xa0ZFW", "PAX DETAILS"],
            [`${(SaltyUnits.kgToUser(getZfw()) / 1000).toFixed(1)}{small}${unit}`, "SHOW>"],
            ["\xa0ZFW CG", "OFP REQUEST"],
            [`${getZfwcg().toFixed(1)}%`, FMC_Payload.ofpRequestText],
            ["\xa0RETURN TO", "BOARDING RATE"],
            ["<OPTIONS", `${boardingRate}>`],
        ]);

        fmc.onRightInput[0] = () => {
            let value = fmc.inOut;
            if (value) {
                value = parseFloat(value);

                if (SaltyUnits.userToKg(value) < 44) {
                    value = Math.round(value * 1000);
                }
                if (value >= 0 && SaltyUnits.userToKg(value) <= 43900) {
                    SaltyBoarding.setTargetCargo(SaltyUnits.userToKg(value));
                    fmc.clearUserInput();
                } else fmc.showErrorMessage("NOT ALLOWED");
            }
        };

        fmc.onRightInput[1] = () => {
            let value = fmc.inOut;
            if (value) {
                if (value >= 0 && value <= 364) {
                    SaltyBoarding.setTargetPax(value);
                    fmc.clearUserInput();
                } else fmc.showErrorMessage("NOT ALLOWED");
            }
        };

        fmc.onRightInput[2] = () => {
            if (boardingRate !== "INSTANT" && !SaltyFueling.airplaneCanFuel()) {
                fmc.showErrorMessage("BOARDING NOT AVAILABLE");
            } else SimVar.SetSimVarValue("L:747_BOARDING_STARTED_BY_USR", "Bool", !boardingStartedByUser);
        };

        fmc.onRightInput[3] = () => {
            FMC_Payload.ShowPaxDetails(fmc);
        };

        fmc.onRightInput[4] = async () => {
            FMC_Payload.ofpRequestText = "SENDING";

            setTimeout(async () => {
                if (!fmc.simbrief.cargo || !fmc.simbrief.paxCount) await getSimBriefPlan(fmc);

                if (fmc.simbrief.cargo || fmc.simbrief.paxCount) {
                    Coherent.call("PLAY_INSTRUMENT_SOUND", "uplink_chime");

                    SaltyBoarding.setTargetCargo(SaltyUnits.userToKg(parseInt(fmc.simbrief.cargo)));
                    if (fmc.simbrief.paxCount > 364) {
                        SaltyBoarding.setTargetPax(364);
                        fmc.showErrorMessage("USE CUSTOM SB AIRFRAME");
                    } else {
                        SaltyBoarding.setTargetPax(fmc.simbrief.paxCount);
                    }
                } else fmc.showErrorMessage("WRONG PILOT ID");

                FMC_Payload.ofpRequestText = "SEND>";
            }, fmc.getInsertDelay());
        };

        fmc.onRightInput[5] = () => {
            if (boardingRate === "INSTANT") SaltyDataStore.set("747_CONFIG_BOARDING_RATE", "REAL");
            else if (boardingRate === "REAL") SaltyDataStore.set("747_CONFIG_BOARDING_RATE", "FAST");
            else SaltyDataStore.set("747_CONFIG_BOARDING_RATE", "INSTANT");
        };

        fmc.onLeftInput[5] = () => {
            FMCSaltyOptions.ShowPage1(fmc);
        };
    }

    static ShowPaxDetails(fmc) {
        fmc.clearDisplay();

        const updateView = () => {
            FMC_Payload.ShowPaxDetails(fmc);
        };

        fmc.refreshPageCallback = () => {
            updateView();
        };

        SimVar.SetSimVarValue("L:FMC_UPDATE_CURRENT_PAGE", "number", 1);

        const paxTarget = this.getPaxTarget();
        const currentPax = this.getCurrentPax();

        fmc.setTemplate([
            ["PAX DETAILS"],
            [`\xa0${paxStations.businessUpper.name}`, paxStations.rearEconomy.name],
            [this.buildStationValue(paxStations.businessUpper), this.buildStationValue(paxStations.rearEconomy)],
            [`\xa0${paxStations.firstClass.name}`, ""],
            [this.buildStationValue(paxStations.firstClass), ""],
            [`\xa0${paxStations.businessMain.name}`, ""],
            [this.buildStationValue(paxStations.businessMain), ""],
            [`\xa0${paxStations.premiumEconomy.name}`, ""],
            [this.buildStationValue(paxStations.premiumEconomy), ""],
            [`\xa0${paxStations.forwardEconomy.name}`, ""],
            [this.buildStationValue(paxStations.forwardEconomy), ""],
            ["\xa0RETURN TO", "PAX BOARDED"],
            ["<PAYLOAD", `${currentPax}/{small}${paxTarget}`],
        ]);

        fmc.onLeftInput[5] = () => {
            FMC_Payload.ShowPage(fmc);
        };
    }

    static buildStationValue(station) {
        const targetPax = SimVar.GetSimVarValue(`L:${station.simVar}_DESIRED`, "Number");
        const pax = SimVar.GetSimVarValue(`L:${station.simVar}`, "Number");

        return `${pax}/{small}${targetPax}`;
    }

    static getPaxTarget() {
        return Object.values(paxStations)
            .map((station) => SimVar.GetSimVarValue(`L:${station.simVar}_DESIRED`, "Number"))
            .reduce((acc, cur) => acc + cur);
    }

    static getCurrentPax() {
        return Object.values(paxStations)
            .map((station) => SimVar.GetSimVarValue(`L:${station.simVar}`, "Number"))
            .reduce((acc, cur) => acc + cur);
    }
}

FMC_Payload.ofpRequestText = "SEND>";
