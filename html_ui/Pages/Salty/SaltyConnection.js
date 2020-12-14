class SaltyConnection {

    static setConnection(company, fltNo, reg) {
        return true;
    }

}

const getSimBriefPlan = (fmc, updateView) => {
    const userid = SaltyDataStore.get("OPTIONS_SIMBRIEF_ID", "");
    console.log(userid);

    if (!userid) {
        fmc.showErrorMessage("NO COMPANY LOGON");
        throw ("No simbrief username provided");
    }

    return SimBriefApi.getFltPlan(userid)
        .then(data => {
            fmc.simbrief["route"] = data.general.route;
            fmc.simbrief["cruiseAltitude"] = data.general.initial_altitude;
            fmc.simbrief["originIcao"] = data.origin.icao_code;
            fmc.simbrief["destinationIcao"] = data.destination.icao_code;
            fmc.simbrief["blockFuel"] = data.fuel.plan_ramp;
            fmc.simbrief["payload"] = data.weights.payload;
            fmc.simbrief["estZfw"] = data.weights.est_zfw;
            fmc.simbrief["costIndex"] = data.general.costindex;
            fmc.simbrief["navlog"] = data.navlog.fix;
            fmc.simbrief["icao_airline"] = typeof data.general.icao_airline === 'string' ? data.general.icao_airline : "";
            fmc.simbrief["flight_number"] = data.general.flight_number;
            fmc.simbrief["alternateIcao"] = data.alternate.icao_code;
            fmc.simbrief["avgTropopause"] = data.general.avg_tropopause;
            fmc.simbrief["ete"] = data.times.est_time_enroute;
            fmc.simbrief["blockTime"] = data.times.est_block;
            fmc.simbrief["outTime"] = data.times.est_out;
            fmc.simbrief["onTime"] = data.times.est_on;
            fmc.simbrief["inTime"] = data.times.est_in;
            fmc.simbrief["offTime"] = data.times.est_off;
            fmc.simbrief["taxiFuel"] = data.fuel.taxi;
            fmc.simbrief["tripFuel"] = data.fuel.enroute_burn;
            fmc.simbrief["route_distance"] = data.general.route_distance;
            insertUplink(fmc);
            updateView();     
            return fmc.simbrief;
        })
        .catch(_err => {
            console.log(_err.message);
            updateView();
        });
}

const insertUplink = (fmc) => {
    const {
        originIcao,
        destinationIcao,
        cruiseAltitude,
        costIndex,
        alternateIcao,
        avgTropopause,
        icao_airline,
        flight_number
    } = fmc.simbrief;

    const coRoute = `${originIcao}${destinationIcao}`
    const fltNbr = `${icao_airline}${flight_number}`;

    const uplinkReady = "ROUTE 1 UPLINK READY";
    const aocActFplnUplink = "AOC ACT F-PLN UPLINK";
    const perfDataUplink = "PERF DATA UPLINK";

    fmc.showErrorMessage(uplinkReady);

    fmc.updateFlightNo(fltNbr, (result) => {
        if (result) {
            FMCRoutePage.ShowPage1(fmc);
        }
    });

    fmc.updateCoRoute(coRoute, (result) => {
        if (result) {
            FMCRoutePage.ShowPage1(fmc);
        }
    });
}