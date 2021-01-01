const msgSep = "---------------------------[color]white";
const srcMap = {
    "FAA": "faa",
    "IVAO": "ivao",
    "MSFS": "ms",
    "NOAA": "aviationweather",
    "PILOTEDGE": "pilotedge",
    "VATSIM": "vatsim"
};

function wordWrapToStringList(text, maxLength) {
    const result = [];
    let line = [];
    let length = 0;
    text.split(" ").forEach(function (word) {
        if ((length + word.length) >= maxLength) {
            result.push(line.join(" "));
            line = []; length = 0;
        }
        length += word.length + 1;
        line.push(word);
    });
    if (line.length > 0) {
        result.push(line.join(" "));
    }
    return result;
}

function fetchTimeValue() {
    let timeValue = SimVar.GetGlobalVarValue("ZULU TIME", "seconds");
    if (timeValue) {
        const seconds = Number.parseInt(timeValue);
        const displayTime = Utils.SecondsToDisplayTime(seconds, true, true, false);
        timeValue = displayTime.toString();
        timeValue = timeValue.replace(":", "");
        return timeValue.substring(0, 4);
    }
    return null;
}

const getMETAR = async (icaos, lines, store, updateView) => {    
    const storedMetarSrc = SaltyDataStore.get("OPTIONS_METAR_SRC", "MSFS");
    for (const icao of icaos) {
        if (icao !== "") {
            await NXApi.getMetar(icao, srcMap[storedMetarSrc])
                .then((data) => {
                    lines.push(`${icao}`);
                    const newLines = wordWrapToStringList(data.metar, 25);
                    newLines.forEach(l => lines.push(l.concat("")));
                    lines.push(msgSep);
                    lines.push(msgSep);
                    lines.push(msgSep);
                })
                .catch(() => {
                    lines.push(`${icao}`);
                    lines.push('STATION NOT AVAILABLE[color]yellow');
                    lines.push(msgSep);
                });
        }
    }
};

const getTAF = async (icaos, lines, store, updateView) => {
    const storedTafSrc = SaltyDataStore.get("OPTIONS_TAF_SRC", "NOAA");
    for (const icao of icaos) {
        if (icao !== "") {
            await NXApi.getTaf(icao, srcMap[storedTafSrc])
                .then((data) => {
                    lines.push(`TAF ${icao}[color]white`);
                    const newLines = wordWrapToStringList(data.taf, 25);
                    newLines.forEach(l => lines.push(l.concat("")));
                    lines.push(msgSep);
                })
                .catch(() => {
                    lines.push(`TAF ${icao}[color]white`);
                    lines.push('STATION NOT AVAILABLE[color]yellow');
                    lines.push(msgSep);
                });
        }
    }
    store["sendStatus"] = "SENT";
    updateView();
};

const getATIS = async (icao, lines, type, store, updateView) => {
    const storedAtisSrc = SaltyDataStore.get("OPTIONS_ATIS_SRC", "FAA");
    if (icao !== "") {
        await NXApi.getAtis(icao, srcMap[storedAtisSrc])
            .then((data) => {
                let atisData;
                switch (type) {
                    case 0:
                        if ("arr" in data) {
                            atisData = data.arr;
                        } else {
                            atisData = data.combined;
                        }
                        break;
                    case 1:
                        if ("dep" in data) {
                            atisData = data.dep;
                        } else {
                            atisData = data.combined;
                        }
                        break;
                    default:
                        atisData = data.combined;
                }
                lines.push(`ATIS ${icao}[color]white`);
                const newLines = wordWrapToStringList(atisData, 25);
                newLines.forEach(l => lines.push(l.concat("")));
                lines.push(msgSep);
            })
            .catch(() => {
                lines.push(`ATIS ${icao}[color]white`);
                lines.push('D-ATIS NOT AVAILABLE[color]yellow');
                lines.push(msgSep);
            });
    }
    store["sendStatus"] = "SENT";
    updateView();
};

const getSimBriefPlan = (fmc, store, updateView) => {
    const userid = SaltyDataStore.get("OPTIONS_SIMBRIEF_ID", "");

    if (!userid) {
        fmc.showErrorMessage("INVALID ROUTE UPLINK");
        throw ("No simbrief username provided");
    }

    return SimBriefApi.getFltPlan(userid)
        .then(data => {
            setTimeout(() => {
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
                /* TIMES */
                fmc.simbrief["ete"] = data.times.est_time_enroute;
                fmc.simbrief["blockTime"] = data.times.est_block;
                fmc.simbrief["outTime"] = data.times.est_out;
                fmc.simbrief["onTime"] = data.times.est_on;
                fmc.simbrief["inTime"] = data.times.est_in;
                fmc.simbrief["offTime"] = data.times.est_off;
                /* FUEL */
                fmc.simbrief["taxiFuel"] = data.fuel.taxi;
                fmc.simbrief["tripFuel"] = data.fuel.enroute_burn;
                fmc.simbrief["altnFuel"] = data.fuel.alternate_burn;
                fmc.simbrief["finResFuel"] = data.fuel.reserve;
                fmc.simbrief["contFuel"] = data.fuel.contingency;
                /* DISTANCE */
                fmc.simbrief["route_distance"] = data.general.route_distance;
                fmc.simbrief.rteUplinkReady = true;
                fmc.simbrief.perfUplinkReady = true;
                store.requestData = "SENT\xa0";
                store.rteUplinkReady = true;
                updateView();
            }, 2000);
            return fmc.simbrief;
        })
        .catch(_err => {
            fmc.showErrorMessage("INVALID ROUTE UPLINK");
            store.requestData = "FAILED\xa0";
            store.rteUplinkReady = false;
            updateView();
        });
}