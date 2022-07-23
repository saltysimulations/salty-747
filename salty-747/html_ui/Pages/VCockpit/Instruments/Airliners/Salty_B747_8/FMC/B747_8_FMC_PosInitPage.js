class FMCPosInitPage {
    static ShowPage1(fmc) {
        let gpsPos = new LatLong(SimVar.GetSimVarValue("GPS POSITION LAT", "degree latitude"), SimVar.GetSimVarValue("GPS POSITION LON", "degree longitude")).toDegreeString();
        let date = new Date();
        let dateString = date.getHours().toFixed(0).padStart(2, "0") + date.getMinutes().toFixed(0).padStart(2, "0") + "z";
        let lastPos = "";
        if (fmc.lastPos) {
            lastPos = fmc.lastPos;
        }
        let refAirport = "□□□□";
        if (fmc.refAirport && fmc.refAirport.ident) {
            refAirport = fmc.refAirport.ident;
        }
        let refAirportCoordinates = "";
        if (fmc.refAirport && fmc.refAirport.infos && fmc.refAirport.infos.coordinates) {
            refAirportCoordinates = fmc.refAirport.infos.coordinates.toDegreeString();
        }
        let gate = "-----";
        if (fmc.refGate) {
            gate = fmc.refGate;
        }
        let heading = "---°";
        if (fmc.refHeading) {
            heading = fmc.refHeading.toFixed(0).padStart(3, "0") + "°";
        }
        let irsPos = "□□□°□□.□ □□□□°□□.□";
        if (fmc.initCoordinates) {
            irsPos = fmc.initCoordinates;
        }
        fmc.clearDisplay();
        fmc.setTemplate([
            ["POS INIT", "1", "4"],
            ["", "LAST POS"],
            ["", lastPos],
            ["\xa0REF AIRPORT"],
            [refAirport, refAirportCoordinates],
            ["\xa0GATE"],
            [gate],
            ["\xa0UTC (GPS)", "GPS POS"],
            [dateString, gpsPos],
            ["\xa0SET HDG", "SET IRS POS"],
            [heading, irsPos],
            ["__FMCSEPARATOR"],
            ["<INDEX", "ROUTE>"]
        ]);

        fmc.onPrevPage = () => {
            FMCPosInitPage.ShowPage4(fmc);
        };

        fmc.onNextPage = () => {
            FMCPosInitPage.ShowPage2(fmc);
        };

        fmc.onRightInput[0] = () => {
            fmc.inOut = fmc.lastPos;
        };

        fmc.onLeftInput[1] = async () => {
            let value = fmc.inOut;
            fmc.inOut = "";
            if (await fmc.tryUpdateRefAirport(value)) {
                FMCPosInitPage.ShowPage1(fmc);
            }
        };

        fmc.onRightInput[1] = () => {
            fmc.inOut = refAirportCoordinates;
        };

        fmc.onLeftInput[2] = async () => {
            let value = fmc.inOut;
            fmc.inOut = "";
            if (await fmc.tryUpdateGate(value)) {
                FMCPosInitPage.ShowPage1(fmc);
            }
        };

        fmc.onRightInput[3] = () => {
            fmc.inOut = gpsPos;
        };

        fmc.onLeftInput[4] = async () => {
            let value = fmc.inOut;
            fmc.inOut = "";
            if (await fmc.tryUpdateHeading(value)) {
                FMCPosInitPage.ShowPage1(fmc);
            }
        };

        fmc.onRightInput[4] = async () => {
            let value = fmc.inOut;
            fmc.inOut = "";
            if (await fmc.tryUpdateIrsCoordinatesDisplay(value)) {
                FMCPosInitPage.ShowPage1(fmc);
            }
        };

        fmc.onLeftInput[5] = () => {
            B747_8_FMC_InitRefIndexPage.ShowPage1(fmc);
        };
        
        fmc.onRightInput[5] = () => {
            FMCRoutePage.ShowPage1(fmc);
        };
    }

    static ShowPage2(fmc, store = {latBrgSwitch: "LAT/LON"}) {
        fmc.clearDisplay();
        let currPos = new LatLong(SimVar.GetSimVarValue("GPS POSITION LAT", "degree latitude"), SimVar.GetSimVarValue("GPS POSITION LON", "degree longitude")).toDegreeString();
        let irsPos = "";
        if (fmc.initCoordinates) {
            irsPos = fmc.initCoordinates;
        }
        const updateView = () => {
            fmc.setTemplate([
                ["POS REF", "2", "4"],
                ["\xa0FMC (GPS L)", "UPDATE"],
                [currPos, "ARM>"],
                ["\xa0IRS(3)", "0.00NM"],
                [irsPos, ""],
                ["\xa0GPS", "0.00NM"],
                [currPos, ""],
                ["\xa0RADIO", "0.00NM"],
                [currPos, "NOW>"],
                ["\xa0RNP/ACTUAL", "VOR DME"],
                ["0.50NM/0.00NM", ""],
                [""],
                ["<INDEX", `${store.latBrgSwitch}>`]
            ]);
        }
        updateView();
        fmc.onPrevPage = () => {
            FMCPosInitPage.ShowPage1(fmc);
        };
        fmc.onNextPage = () => {
            FMCPosInitPage.ShowPage3(fmc);
        };
        fmc.onLeftInput[5] = () => {
            B747_8_FMC_InitRefIndexPage.ShowPage1(fmc);
        };
        fmc.onRightInput[5] = () => {
            if (store.latBrgSwitch == "LAT/LON") {
                store.latBrgSwitch = "BRG/DIS";
                updateView();
            } else if (store.latBrgSwitch == "BRG/DIS") {
                store.latBrgSwitch = "LAT/LON";
                updateView();
            }
        };
    }

    static ShowPage3(fmc, store = {latBrgSwitch: "LAT/LON"}) {
        fmc.clearDisplay();
        let gpsPos = new LatLong(SimVar.GetSimVarValue("GPS POSITION LAT", "degree latitude"), SimVar.GetSimVarValue("GPS POSITION LON", "degree longitude")).toDegreeString();
        let irsPos = "";
        if (fmc.initCoordinates) {
            irsPos = fmc.initCoordinates;
        }
        const updateView = () => {
            fmc.setTemplate([
                ["POS REF", "3", "4"],
                ["GPS L", ""],
                [gpsPos, ""],
                ["GPS R", ""],
                [gpsPos, ""],
                ["FMC L", ""],
                [irsPos, ""],
                ["FMC R", ""],
                [irsPos, ""],
                ["", ""],
                ["", ""],
                ["__FMCSEPARATOR"],
                ["<INDEX", `${store.latBrgSwitch}>`]
            ]);
        }
        updateView();
        fmc.onPrevPage = () => {
            FMCPosInitPage.ShowPage2(fmc);
        };
        fmc.onNextPage = () => {
            FMCPosInitPage.ShowPage4(fmc);
        };
        fmc.onLeftInput[5] = () => {
            B747_8_FMC_InitRefIndexPage.ShowPage1(fmc);
        };
        fmc.onRightInput[5] = () => {
            if (store.latBrgSwitch == "LAT/LON") {
                store.latBrgSwitch = "BRG/DIS";
                updateView();
            } else if (store.latBrgSwitch == "BRG/DIS") {
                store.latBrgSwitch = "LAT/LON";
                updateView();
            }
        };
    }

    static ShowPage4(fmc, store = {irsPos: "", irsGs: "", infoSwitch: "BRG/DIS"}) {
        fmc.clearDisplay();
        let currPos = new LatLong(SimVar.GetSimVarValue("GPS POSITION LAT", "degree latitude"), SimVar.GetSimVarValue("GPS POSITION LON", "degree longitude")).toDegreeString();
        let irsPos = "";
        if (fmc.initCoordinates) {
            irsPos = fmc.initCoordinates;
        }
        let irsGs = SimVar.GetSimVarValue("SURFACE RELATIVE GROUND SPEED", "knots").toFixed(0) + "KT";
        fmc.setTemplate([
            ["POS REF", "4", "4"],
            ["\xa0IRS L", "GS"],
            [`${irsPos}`, `${irsGs}`],
            ["\xa0IRS C", "GS"],
            [`${irsPos}`, `${irsGs}`],
            ["\xa0IRS R", "GS"],
            [`${irsPos}`, `${irsGs}`],
            [""],
            [""],
            [""],
            [""],
            ["__FMCSEPARATOR"],
            ["<INDEX", `${store.infoSwitch}`]
        ]);
        fmc.onPrevPage = () => {
            FMCPosInitPage.ShowPage3(fmc);
        };
        fmc.onNextPage = () => {
            FMCPosInitPage.ShowPage1(fmc);
        };
        fmc.onLeftInput[5] = () => {
            B747_8_FMC_InitRefIndexPage.ShowPage1(fmc);
        };
        fmc.onRightInput[5] = () => {

        };
    }
}
//# sourceMappingURL=B747_8_FMC_PosInitPage.js.map