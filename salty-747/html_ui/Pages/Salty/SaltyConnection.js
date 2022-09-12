const msgSep = "---------------------------[color]white";
const srcMap = {
    FAA: "faa",
    IVAO: "ivao",
    MSFS: "ms",
    NOAA: "aviationweather",
    PILOTEDGE: "pilotedge",
    VATSIM: "vatsim",
};

function wordWrapToStringList(text, maxLength) {
    const result = [];
    let line = [];
    let length = 0;
    text.split(" ").forEach(function (word) {
        if (length + word.length >= maxLength) {
            result.push(line.join(" "));
            line = [];
            length = 0;
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
                    newLines.forEach((l) => lines.push(l.concat("")));
                    lines.push("");
                    lines.push(msgSep);
                    lines.push("");
                })
                .catch(() => {
                    lines.push(`${icao}`);
                    lines.push("STATION NOT AVAILABLE[color]yellow");
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
                    newLines.forEach((l) => lines.push(l.concat("")));
                    lines.push("");
                    lines.push(msgSep);
                    lines.push("");
                })
                .catch(() => {
                    lines.push(`TAF ${icao}`);
                    lines.push("STATION NOT AVAILABLE[color]yellow");
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
                newLines.forEach((l) => lines.push(l.concat("")));
                lines.push("");
                lines.push(msgSep);
                lines.push("");
            })
            .catch(() => {
                lines.push(`ATIS ${icao}[color]white`);
                lines.push("D-ATIS NOT AVAILABLE[color]yellow");
                lines.push(msgSep);
            });
    }
};

/*
    GETS SIMBIREF OFP AND SAVES DATA TO FMC MEMORY
*/
const getSimBriefPlan = (fmc, store) => {
    const userid = SaltyDataStore.get("OPTIONS_SIMBRIEF_ID", "");

    if (!userid) {
        fmc.showErrorMessage("NO PILOT ID");
        throw "No simbrief username provided";
    }

    return SimBriefApi.getFltPlan(userid)
        .then((data) => {
            fmc.simbrief["units"] = data.params.units;
            fmc.simbrief["route"] = data.general.route;
            fmc.simbrief["cruiseAltitude"] = data.general.initial_altitude;
            fmc.simbrief["originIcao"] = data.origin.icao_code;
            fmc.simbrief["destinationIcao"] = data.destination.icao_code;
            fmc.simbrief["payload"] = data.weights.payload;
            fmc.simbrief["estZfw"] = data.weights.est_zfw;
            fmc.simbrief["costIndex"] = data.general.costindex;
            fmc.simbrief["navlog"] = data.navlog.fix;
            fmc.simbrief["icao_airline"] = typeof data.general.icao_airline === "string" ? data.general.icao_airline : "";
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
            fmc.simbrief["blockFuel"] = data.fuel.plan_ramp;
            /* DISTANCE */
            fmc.simbrief["route_distance"] = data.general.route_distance;
            /* PAYLOAD */
            fmc.simbrief["paxCount"] = data.weights.pax_count;
            fmc.simbrief["cargo"] = data.weights.cargo;

            fmc.simbrief.rteUplinkReady = true;
            fmc.simbrief.perfUplinkReady = true;
            return fmc.simbrief;
        })
        .catch((_err) => {
            fmc.simbrief.rteUplinkReady = true;
            fmc.simbrief.perfUplinkReady = true;
            return null;
        });
};

/**
 * Convert unsupported coordinate formats in a waypoint ident to supported ones
 * @param {string} ident Waypoint ident
 */
const convertWaypointIdentCoords = (ident) => {
    // SimBrief formats coordinate waypoints differently to MSFS:
    //  - 60N045W = 60* 00'N 045* 00'W
    //  - 3050N12022W = 30* 50'N 120* 22'W

    let latDeg;
    let latDir;
    let lonDeg;
    let lonDir;

    if (ident.length === 7) {
        latDeg = ident.substring(0, 2);
        latDir = ident.substring(2, 3);
        lonDeg = ident.substring(3, 6);
        lonDir = ident.substring(6, 7);
    } else if (ident.length === 11) {
        latDeg = ident.substring(0, 4);
        latDir = ident.substring(4, 5);
        lonDeg = ident.substring(5, 10);
        lonDir = ident.substring(10, 11);
    } else return ident;

    if (isNaN(parseInt(latDeg)) || isNaN(parseInt(lonDeg))) {
        return ident;
    }

    // ARINC 424 format is either xxyyZ or xxZyy, where xx is 2 digit lat, yy
    // is last 2 digits of lon, and Z is N/E/S/W respectively for NW/NE/SE/SW,
    // and is at the end if lat was less than 100 or in the middle if 100 or
    // greater.
    if (ident.length === 7) {
        const largeLon = lonDeg.substring(0, 1) == "1";
        const lonSub = lonDeg.substring(1, 3);
        switch (latDir + lonDir) {
            case "NW":
                return latDeg + (largeLon ? "N" + lonSub : lonSub + "N");
            case "NE":
                return latDeg + (largeLon ? "E" + lonSub : lonSub + "E");
            case "SE":
                return latDeg + (largeLon ? "S" + lonSub : lonSub + "S");
            case "SW":
                return latDeg + (largeLon ? "W" + lonSub : lonSub + "W");
        }
    } else {
        const charArray = ident.split("");

        // Move N/E/S/W to before digits
        charArray.splice(10, 1);
        charArray.splice(4, 1);
        charArray.splice(0, 0, latDir);
        charArray.splice(5, 0, lonDir);

        return charArray.join("");
    }

    return ident;
};

const getFplnFromSimBrief = async (fmc) => {
    let routeArr = fmc.simbrief.route.split(" ");
    let partial = false;
    const fixCoords = new Map();

    for (const fix of fmc.simbrief.navlog) {
        fixCoords.set(fix.ident, new LatLongAlt(fix.pos_lat, fix.pos_long));
    }

    const isCoordinate = async (icao) => {
        if (await CJ4_FMC_PilotWaypointParser.parseInput(convertWaypointIdentCoords(icao), 0, fmc)) {
            return true;
        }
        return false;
    };

    const cleanSimBriefRoute = async () => {
        let cleanedRoute = [];

        // Inserting DCT between coordinates
        for (let i = 0; i < routeArr.length; i++) {
            if ((await isCoordinate(routeArr[i])) && routeArr[i - 1] !== "DCT") {
                cleanedRoute.push("DCT", routeArr[i]);
            } else {
                cleanedRoute.push(routeArr[i]);
            }
        }

        routeArr = cleanedRoute;
    };

    const parseAirport = (icao) => {
        if (/K.*\d.*/.test(icao)) {
            icao = icao.substring(1).padEnd(4, " ");
        }

        return icao;
    };

    // HINT: defining these methods here in the order they will be called by the callbacks
    const updateFrom = () => {
        console.log("UPDATE FROMTO");
        const from = fmc.simbrief.originIcao;
        fmc.flightPlanManager.setActiveWaypointIndex(0, () => {
            fmc.eraseTemporaryFlightPlan(() => {
                fmc.flightPlanManager.clearFlightPlan(() => {
                    fmc.ensureCurrentFlightPlanIsTemporary(() => {
                        fmc.updateRouteOrigin(parseAirport(from), updateDestination);
                    });
                });
            });
        });
    };

    const updateDestination = () => {
        console.log("UPDATE DESTINATION");
        const dest = fmc.simbrief.destinationIcao;
        fmc.updateRouteDestination(parseAirport(dest), updateFlightNumber);
    };

    const updateFlightNumber = () => {
        let flightNo = fmc.simbrief.flight_number;
        if (flightNo) {
            if (typeof fmc.simbrief.icao_airline === "string") {
                flightNo = `${fmc.simbrief.icao_airline}${flightNo}`;
            }
            fmc.updateFlightNo(flightNo);
            fmc.setMsg("FLT NUMBER UPLINK");
        }

        updateRoute();
    }

    const updateRoute = () => {
        console.log("UPDATE ROUTE");
        let idx = 0; // TODO starting from 1 to skip departure trans for now

        console.log(routeArr);

        const addWaypoint = async () => {
            if (idx >= routeArr.length - 1) {
                // DONE
                fmc.flightPlanManager.resumeSync();
                fmc.flightPlanManager.setActiveWaypointIndex(1);
                SimVar.SetSimVarValue("L:WT_CJ4_INHIBIT_SEQUENCE", "number", 0);
                if (partial) {
                    fmc.setMsg("PARTIAL ROUTE 1 UPLINK");
                }
                FMCRoutePage.ShowPage1(fmc);
                return;
            }
            let icao = routeArr[idx];

            if (idx == 0 && icao !== "DCT") {
                // if first waypoint is no dct it must be a departure
                icao = "DCT";
            }

            // let isWaypoint = await fmc.dataManager.IsWaypointValid(icao);
            idx++;

            const wptIndex = fmc.flightPlanManager.getWaypointsCount() - 1;
            console.log("MOD INDEX " + wptIndex);

            if (icao === "DCT") {
                icao = convertWaypointIdentCoords(routeArr[idx]);

                const userWaypoint = await CJ4_FMC_PilotWaypointParser.parseInput(icao, wptIndex, fmc);
                if (userWaypoint) {
                    console.log("adding as user waypoint " + icao);
                    fmc.ensureCurrentFlightPlanIsTemporary(() => {
                        fmc.flightPlanManager.addUserWaypoint(userWaypoint.wpt, wptIndex, () => {
                            idx++;
                            addWaypoint();
                        });
                    });

                } else {
                    // should be a normal waypoint then
                    console.log("adding as waypoint " + icao);
                    fmc.insertWaypoint(icao, wptIndex, (res) => {
                        idx++;
                        if (res) {
                            addWaypoint();
                        } else {
                            fmc.flightPlanManager.resumeSync();
                            fmc.setMsg("ERROR WPT " + icao);
                            partial = true;
                        }
                    }, fixCoords.get(icao));
                }
            } else {
                // probably an airway
                console.log("adding as airway " + icao);
                const exitWpt = routeArr[idx];

                // try preloading data like tscharlii seems to do
                const lastWaypoint = fmc.flightPlanManager.getWaypoints()[fmc.flightPlanManager.getEnRouteWaypointsLastIndex()];
                if (lastWaypoint.infos instanceof WayPointInfo) {
                    lastWaypoint.infos.UpdateAirway(icao).then(() => {
                        const airway = lastWaypoint.infos.airways.find((a) => {
                            return a.name === icao;
                        });
                        if (airway) {
                            // Load the fixes of the selected airway and their infos.airways
                            // set the outgoing airway of the last enroute or departure waypoint of the flightplan
                            lastWaypoint.infos.airwayOut = airway.name;
                            FMCRoutePage.insertWaypointsAlongAirway(fmc, exitWpt, wptIndex - 1, icao, (res) => {
                                idx++;
                                if (res) {
                                    addWaypoint();
                                } else {
                                    fmc.flightPlanManager.resumeSync();
                                    fmc.setMsg("ERROR AIRWAY " + icao);
                                    partial = true;
                                    addWaypoint();
                                }
                            });
                        } else {
                            // TODO hmm, so if no airway found, just continue and add exit as wpt?
                            partial = true;
                            routeArr.splice(idx, 0, "DCT");
                            addWaypoint();
                        }
                    });
                }
            }
        };
        addWaypoint();
    };

    fmc.flightPlanManager.pauseSync();
    cleanSimBriefRoute();
    updateFrom();
};

/*
    INSERTS ZFW, CRUISE LEVEL, COST INDEX AND RES FUEL INTO PERF INIT PAGE
*/
const insertPerfUplink = (fmc) => {
    const units = fmc.simbrief.units == "kgs" ? false : true;

    // const zfw = (fmc.simbrief.estZfw / 1000).toString();
    const crz = fmc.simbrief.cruiseAltitude;
    const costIndex = fmc.simbrief.costIndex.toString();
    const resFuel = (parseFloat(fmc.simbrief.finResFuel) + parseFloat(fmc.simbrief.altnFuel)).toFixed(1) / 1000;

    // fmc.trySetZeroFuelWeightZFWCG(zfw, units);
    fmc.tryUpdateCostIndex(costIndex, 9999);
    fmc.setFuelReserves(resFuel, units);
    fmc.setCruiseFlightLevelAndTemperature(crz);
};
