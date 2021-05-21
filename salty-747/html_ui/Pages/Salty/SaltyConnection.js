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
                    lines.push(`METAR ${icao}`);
                    const newLines = wordWrapToStringList(data.metar, 25);
                    newLines.forEach(l => lines.push(l.concat("")));
                    lines.push("");
                    lines.push(msgSep);
                    lines.push("");
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
                    lines.push(`TAF ${icao}`);
                    const newLines = wordWrapToStringList(data.taf, 25);
                    newLines.forEach(l => lines.push(l.concat("")));
                    lines.push("");
                    lines.push(msgSep);
                    lines.push("");
                })
                .catch(() => {
                    lines.push(`TAF ${icao}`);
                    lines.push('STATION NOT AVAILABLE[color]yellow');
                    lines.push(msgSep);
                });
        }
    }
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
                lines.push("");
                lines.push(msgSep);
                lines.push("");
            })
            .catch(() => {
                lines.push(`ATIS ${icao}[color]white`);
                lines.push('D-ATIS NOT AVAILABLE[color]yellow');
                lines.push(msgSep);
            });
    }
};

/*
    GETS SIMBIREF OFP AND SAVES DATA TO FMC MEMORY
*/
const getSimBriefPlan = (fmc, store, updateView) => {
    const userid = SaltyDataStore.get("OPTIONS_SIMBRIEF_ID", "");

    if (!userid) {
        fmc.showErrorMessage("UNABLE TO SEND MESSAGE");
        throw ("No simbrief username provided");
    }

    return SimBriefApi.getFltPlan(userid)
        .then(data => {
            fmc.simbrief["units"] = data.params.units;
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
            return fmc.simbrief;
        })
        .catch(_err => {
            fmc.showErrorMessage("UNABLE TO LOAD CLEARANCE");
            fmc.simbrief.rteUplinkReady = true;
            fmc.simbrief.perfUplinkReady = true;
            updateView();
        });
}

/*
    INSERTS ORIGIN, DESTINATION, FLIGHT NUMBER AND CO ROUTE DATA FROM SIMBRIEF INTO FMC
*/
const insertRteUplink = (fmc, updateView) => {
    const origin = fmc.simbrief.originIcao;
    const destination = fmc.simbrief.destinationIcao;
    const coRoute = fmc.simbrief.originIcao + fmc.simbrief.destinationIcao;
    const fltNbr = fmc.simbrief.icao_airline + fmc.simbrief.flight_number;

    fmc.showErrorMessage(fmc.simbrief.uplinkReady);

    fmc.updateRouteOrigin(origin.toString(), (result) => {
        if (result) {
            fmc.updateRouteDestination(destination.toString(), (result) => {
                if (result) {
                    setTimeout(async () => {
                        await uplinkRoute(fmc)
                            .then(() => {
                                fmc.showErrorMessage("PERF INIT UPLINK");
                            })
                        ;
                    }, fmc.getInsertDelay());
                    fmc.updateFlightNo(fltNbr, (result) => {
                        if (result) {
                            fmc.updateCoRoute(coRoute, (result) => {
                                if (result) {
                                    if (fmc._pageCurrent == "RTE 1") {
                                        updateView();
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}


/*
    INSERTS ZFW, CRUISE LEVEL, COST INDEX AND RES FUEL INTO PERF INIT PAGE
*/
const insertPerfUplink = (fmc, updateView) => {
    let units;
    if (fmc.simbrief.units == "kgs") {
        units = false;
    } else if (fmc.units == "lbs") {
        units = true;
    }
    const zfw = (fmc.simbrief.estZfw / 1000).toString();
    const crz = fmc.simbrief.cruiseAltitude;
    const costIndex = fmc.simbrief.costIndex.toString();
    const resFuel = (parseFloat(fmc.simbrief.finResFuel) + parseFloat(fmc.simbrief.altnFuel)).toFixed(1) / 1000;
    fmc.trySetZeroFuelWeightZFWCG(zfw, units, (result) => {
        if (!result) {
            fmc.showErrorMessage("INVALID PERF INIT UPLINK");
        }
    });
    fmc.tryUpdateCostIndex(costIndex, 9999, (result) => {
        if (!result) {
            fmc.showErrorMessage("INVALID PERF INIT UPLINK");
        }
    });
    fmc.setFuelReserves(resFuel, units, (result) => {
        if (!result) {
            fmc.showErrorMessage("INVALID PERF INIT UPLINK");
        }
    });
    fmc.setCruiseFlightLevelAndTemperature(crz, (result) => {
        if (!result) {
            fmc.showErrorMessage("INVALID PERF INIT UPLINK");
        }
    });
}

const addWaypointAsync = (fix, fmc, routeIdent, via) => {
    const wpIndex = fmc.flightPlanManager.getWaypointsCount() - 1;
    if (via) {
        return new Promise((res, rej) => {
            fmc.insertWaypointsAlongAirway(routeIdent, wpIndex, via, (result) => {
                if (result) {
                    console.log("Inserted waypoint: " + routeIdent + " via " + via);
                    res(true);
                } else {
                    console.log('AWY/WPT MISMATCH ' + routeIdent + " via " + via);
                    fmc.showErrorMessage("PARTIAL ROUTE 1 UPLINK");
                    res(false);
                }
            });
        });
    } else {
        return new Promise((res, rej) => {
            const coords = {
                lat: fix.pos_lat,
                long: fix.pos_long
            };
            getWaypointByIdentAndCoords(fmc, routeIdent, coords, (waypoint) => {
                if (waypoint) {
                    fmc.flightPlanManager.addWaypoint(waypoint.icao, wpIndex, () => {
                        console.log("Inserted waypoint: " + routeIdent);
                        res(true);
                    });
                } else {
                    console.log('NOT IN DATABASE ' + routeIdent);
                    fmc.showErrorMessage("NOT IN DATABASE");
                    res(false);
                }
            });
        });
    }
};

const uplinkRoute = async (fmc) => {
    const {navlog} = fmc.simbrief;
    console.log("navlog: " + navlog);

    const procedures = new Set(navlog.filter(fix => fix.is_sid_star === "1").map(fix => fix.via_airway));

    for (let i = 0; i < navlog.length; i++) {
        const fix = navlog[i];
        const nextFix = navlog[i + 1];

        if (fix.is_sid_star === '1') {
            continue;
        }
        if (["TOP OF CLIMB", "TOP OF DESCENT"].includes(fix.name)) {
            continue;
        }

        console.log('---- ' + fix.ident + ' ----');

        if (procedures.has(fix.via_airway)) {
            // last fix of departure
            console.log("Inserting waypoint last of DEP: " + fix.ident);
            await addWaypointAsync(fix, fmc, fix.ident);
            continue;
        } else {
            if (fix.via_airway === 'DCT') {
                console.log("Inserting waypoint: " + fix.ident);
                await addWaypointAsync(fix, fmc, fix.ident);
                continue;
            }
            if (nextFix.via_airway !== fix.via_airway) {
                // last fix of airway
                console.log("Inserting waypoint: " + fix.ident + " via " + fix.via_airway);
                await addWaypointAsync(fix, fmc, fix.ident, fix.via_airway);
                continue;
            }
        }
    }
};

/**
 * Get the waypoint by ident and coords whitin the threshold
 * @param {string} ident Waypoint ident
 * @param {object} coords Waypoint coords
 * @param {function} callback Return waypoint
 */
function getWaypointByIdentAndCoords(fmc, ident, coords, callback) {
    const DISTANCE_THRESHOLD = 1;
    fmc.dataManager.GetWaypointsByIdent(ident).then((waypoints) => {
        if (!waypoints || waypoints.length === 0) {
            return callback(undefined);
        }

        for (waypoint of waypoints) {
            const distanceToTarget = Avionics.Utils.computeGreatCircleDistance(coords, waypoint.infos.coordinates);
            if (distanceToTarget < DISTANCE_THRESHOLD) {
                return callback(waypoint);
            }
        }

        return callback(undefined);
    });
}
