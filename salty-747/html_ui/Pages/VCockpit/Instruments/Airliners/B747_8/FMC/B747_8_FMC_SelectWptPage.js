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
        for (let i = 0; i < 5; i++) {
            let w = waypoints[i + 5 * page];
            if (w) {
                let t = "";
                if (w.icao[0] === "V") {
                    t = " VOR";
                }
                else if (w.icao[0] === "N") {
                    t = " NDB";
                }
                else if (w.icao[0] === "A") {
                    t = " AIRPORT";
                }
                rows[2 * i] = [w.ident + t];
                rows[2 * i + 1] = [w.infos.coordinates.toDegreeString()];
                fmc.onLeftInput[i] = () => {
                    callback(w);
                };
                fmc.onRightInput[i] = () => {
                    callback(w);
                };
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
}
//# sourceMappingURL=B747_8_FMC_SelectWptPage.js.map