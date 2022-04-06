class B747_8_FMC_SelectWptPage {
    static ShowPage(fmc, waypoints, callback, page = 0) {
        fmc.clearDisplay();
        let rows = [
            [""],
            [""],
            [""],
            [""],
            [""],
            [""],
            [""],
            [""],
            [""],
            [""]
        ];
        const orderedWaypoints = [...waypoints].sort((a, b) => this.calculateDistance(a) - this.calculateDistance(b));

        let alreadyPressed = false;

        for (let i = 0; i < 5; i++) {
            const w = orderedWaypoints[i + 5 * page];
            if (w) {
                let t = "";
                let freq = "";
                if (w.icao[0] === "V") {
                    t = " VOR";
                    freq = (w.infos.frequencyMHz) ? fastToFixed(w.infos.frequencyMHz, 1).toString() : " ";
                }
                else if (w.icao[0] === "N") {
                    t = " NDB";
                    freq = (w.infos.frequencyMHz) ? fastToFixed(w.infos.frequencyMHz, 1).toString() : " ";
                }
                else if (w.icao[0] === "A") {
                    t = " AIRPORT";
                    freq = " ";
                }
                rows[2 * i] = [w.ident + t];
                rows[2 * i + 1] = [freq, w.infos.coordinates.toDegreeString()];

                const onInput = () => {
                    if (!alreadyPressed) {
                        callback(w);
                        alreadyPressed = true;
                    }
                }

                fmc.onLeftInput[i] = () => onInput();
                fmc.onRightInput[i] = () => onInput();
            }
        }
        fmc.setTemplate([
            ["SELECT DESIRED WPT", (page + 1).toFixed(0), (waypoints.length / 5).toFixed(0)],
            ...rows,
            [""]
        ]);
        fmc.onPrevPage = () => {
            if (page > 0) {
                B747_8_FMC_SelectWptPage.ShowPage(fmc, waypoints, callback, page - 1);
            }
        };
        fmc.onNextPage = () => {
            if (page < Math.floor(waypoints.length / 5)) {
                B747_8_FMC_SelectWptPage.ShowPage(fmc, waypoints, callback, page + 1);
            }
        };
    }

    static calculateDistance(wpt) {
        const planeLla = new LatLongAlt(SimVar.GetSimVarValue("PLANE LATITUDE", "degree latitude"), SimVar.GetSimVarValue("PLANE LONGITUDE", "degree longitude"));
        return Avionics.Utils.computeGreatCircleDistance(planeLla, wpt.infos.coordinates);
    }
}
//# sourceMappingURL=B747_8_FMC_SelectWptPage.js.map