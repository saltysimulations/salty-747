class B747_8_FMC_LegsPage {
    static ShowPage1(fmc, currentPage = 1, step = 0) {
        fmc.clearDisplay();
        fmc.refreshPageCallback = () => {
            B747_8_FMC_LegsPage.ShowPage1(fmc, currentPage, step);
        };
        let pageCount = 1;
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
        let offset = Math.floor((currentPage - 1) * 5);
        let activeWaypoint = 0;
        let flightPlanManagerWaypoints = fmc.flightPlanManager.getWaypoints();
        if (flightPlanManagerWaypoints) {
            let waypoints = [...fmc.flightPlanManager.getWaypoints()];
            if (waypoints.length > 2) {
                activeWaypoint = fmc.flightPlanManager.getActiveWaypointIndex();
                waypoints.pop();
                let firstApproachWaypointIndex = waypoints.length;
                let approachWaypoints = fmc.flightPlanManager.getApproachWaypoints();
                if (fmc.flightPlanManager.isActiveApproach()) {
                    activeWaypoint += waypoints.length;
                    firstApproachWaypointIndex = 0;
                }
                for (let i = 0; i < approachWaypoints.length; i++) {
                    waypoints.push(approachWaypoints[i]);
                }
                waypoints.splice(0, activeWaypoint);
                pageCount = Math.floor((waypoints.length - 1) / 5) + 1;
                for (let i = 0; i < 5; i++) {
                    let waypointFPIndex = i + offset + 1;
                    let waypoint = waypoints[i + offset];
                    if (waypoint) {
                        let prevWaypoint = fmc.flightPlanManager.getWaypoint(waypointFPIndex - 1, undefined, true);
                        let nextWaypoint = fmc.flightPlanManager.getWaypoint(waypointFPIndex + 1, undefined, true);
                        let isEnRouteWaypoint = false;
                        let isDepartureWaypoint = false;
                        let isLastDepartureWaypoint = false;
                        let isArrivalWaypoint = false;
                        let isFirstArrivalWaypoint = false;
                        let isApproachWaypoint = false;
                        if (i + offset >= fmc.flightPlanManager.getDepartureWaypointsCount() - activeWaypoint) {
                            if (i + offset < fmc.flightPlanManager.getEnRouteWaypointsLastIndex() - activeWaypoint) {
                                isEnRouteWaypoint = true;
                            }
                            else {
                                if (i + offset < firstApproachWaypointIndex) {
                                    if (waypointFPIndex === fmc.flightPlanManager.getEnRouteWaypointsLastIndex() + 1 - activeWaypoint) {
                                        isFirstArrivalWaypoint = true;
                                    }
                                    isArrivalWaypoint = true;
                                }
                                else {
                                    isApproachWaypoint = true;
                                }
                            }
                        }
                        else {
                            if (waypointFPIndex === fmc.flightPlanManager.getDepartureWaypointsCount() - activeWaypoint) {
                                isLastDepartureWaypoint = true;
                            }
                            isDepartureWaypoint = true;
                        }
                        let bearing = isFinite(waypoint.bearingInFP) ? waypoint.bearingInFP.toFixed(0) + "°" : "";
                        let distance = isFinite(waypoint.cumulativeDistanceInFP) ? waypoint.cumulativeDistanceInFP.toFixed(0) + "NM" : "";
                        rows[2 * i] = [bearing, distance];
                        rows[2 * i + 1] = [waypoint.ident != "" ? waypoint.ident : "USR"];
                        let ii = i;
                        fmc.onLeftInput[i] = () => {
                            let value = fmc.inOut;
                            if (value === "DELETE") {
                                fmc.inOut = "";
                                fmc.removeWaypoint(waypointFPIndex, () => {
                                    B747_8_FMC_LegsPage.ShowPage1(fmc, currentPage);
                                });
                            }
                            else if (value.length > 0) {
                                fmc.clearUserInput();
                                fmc.setBoeingDirectTo(value, ii + 1, (result) => {
                                    if (result) {
                                        fmc.activateRoute();
                                        B747_8_FMC_LegsPage.ShowPage1(fmc);
                                    }
                                });
                            }
                            else {
                                fmc.inOut = waypoint.ident;
                            }
                        };
                        if (B747_8_FMC_LegsPage.DEBUG_SHOW_WAYPOINT_PHASE) {
                            if (isDepartureWaypoint) {
                                rows[2 * i + 1][0] += " [DP]";
                                if (isLastDepartureWaypoint) {
                                    rows[2 * i + 1][0] += "*";
                                }
                            }
                            else if (isEnRouteWaypoint) {
                                rows[2 * i + 1][0] += " [ER]";
                            }
                            else if (isArrivalWaypoint) {
                                rows[2 * i + 1][0] += " [AR]";
                                if (isFirstArrivalWaypoint) {
                                    rows[2 * i + 1][0] += "*";
                                }
                            }
                            else if (isApproachWaypoint) {
                                rows[2 * i + 1][0] += " [AP]";
                            }
                        }
                        if (isEnRouteWaypoint) {
                            rows[2 * i + 1][1] = Math.round(fmc.getCrzManagedSpeed(true)) + "/ FL" + fmc.cruiseFlightLevel;
                        }
                        else {
                            let speedConstraint = "---";
                            if (waypoint.speedConstraint > 0) {
                                speedConstraint = waypoint.speedConstraint.toFixed(0);
                            }
                            else {
                                if (isLastDepartureWaypoint || isArrivalWaypoint) {
                                    speedConstraint = fmc.getCrzManagedSpeed().toFixed(0);
                                }
                                else if (isDepartureWaypoint) {
                                    let d = (waypointFPIndex - 1) / (fmc.flightPlanManager.getDepartureWaypointsCount() - 1 - activeWaypoint);
                                    speedConstraint = (fmc.v2Speed * (1 - d) + fmc.getCrzManagedSpeed() * d).toFixed(0);
                                }
                                else if (isApproachWaypoint) {
                                    let predictedFlapsIndex = i + offset - (waypoints.length - 1) + 2;
                                    predictedFlapsIndex = Math.max(0, predictedFlapsIndex);
                                    console.log(waypoint.ident + " " + predictedFlapsIndex);
                                    speedConstraint = fmc.getManagedApproachSpeed(predictedFlapsIndex).toFixed(0);
                                }
                            }
                            let altitudeConstraint = "-----";
                            if (waypoint.legAltitudeDescription !== 0) {
                                if (waypoint.legAltitudeDescription === 1) {
                                    if (waypoint.legAltitude1 >= 15000) {
                                        altitudeConstraint = "FL" + (waypoint.legAltitude1 / 100).toFixed(0);
                                    }
                                    else {
                                        altitudeConstraint = waypoint.legAltitude1.toFixed(0);
                                    }
                                }
                                if (waypoint.legAltitudeDescription === 2) {
                                    altitudeConstraint = waypoint.legAltitude1.toFixed(0) + "A";
                                }
                                if (waypoint.legAltitudeDescription === 3) {
                                    altitudeConstraint = waypoint.legAltitude1.toFixed(0) + "B";
                                }
                                else if (waypoint.legAltitudeDescription === 4) {
                                    altitudeConstraint = "FL" + ((waypoint.legAltitude1 + waypoint.legAltitude2) * 0.5 / 100).toFixed(0);
                                }
                            }
                            else if (isDepartureWaypoint) {
                                if (isLastDepartureWaypoint) {
                                    altitudeConstraint = "FL" + fmc.cruiseFlightLevel;
                                }
                                else {
                                    altitudeConstraint = Math.floor(waypoint.cumulativeDistanceInFP * 0.14 * 6076.118 / 10).toFixed(0) + "0";
                                }
                            }
                            else {
                                if (isLastDepartureWaypoint || isFirstArrivalWaypoint) {
                                    altitudeConstraint = "FL" + fmc.cruiseFlightLevel;
                                }
                            }
                            rows[2 * i + 1][1] = speedConstraint + "/ " + altitudeConstraint;
                        }
                    }
                }
            }
        }
        fmc.currentFlightPlanWaypointIndex = activeWaypoint + offset + step;
        let isMapModePlan = SimVar.GetSimVarValue("L:B747_MAP_MODE", "number") === 3;
        if (isMapModePlan) {
            if (rows[2 * step + 1][0] != "") {
                if (!rows[2 * step + 1][1]) {
                    rows[2 * step + 1][1] = "";
                }
                rows[2 * step + 1][2] = "<CTR>";
            }
            else {
                return B747_8_FMC_LegsPage.ShowPage1(fmc, 1, 0);
            }
            fmc.onRightInput[5] = () => {
                let newStep = step + 1;
                let newPage = currentPage;
                if (newStep > 4) {
                    newStep = 0;
                    newPage++;
                }
                if (newPage > pageCount) {
                    newPage = 1;
                }
                B747_8_FMC_LegsPage.ShowPage1(fmc, newPage, newStep);
            };
        }
        else {
            fmc.onRightInput[5] = () => {
                FMCRoutePage.ShowPage2(fmc);
            };
        }
        fmc.setTemplate([
            [(fmc.getIsRouteActivated() ? "MOD" : "ACT") + " RTE 1 LEGS", currentPage.toFixed(0), pageCount.toFixed(0)],
            ...rows,
            ["__FMCSEPARATOR"],
            ["\<RTE 2 LEGS", isMapModePlan ? "STEP>" : "RTE DATA>"]
        ]);
        fmc.onPrevPage = () => {
            if (currentPage > 1) {
                B747_8_FMC_LegsPage.ShowPage1(fmc, currentPage - 1);
            }
        };
        fmc.onNextPage = () => {
            if (currentPage < pageCount) {
                B747_8_FMC_LegsPage.ShowPage1(fmc, currentPage + 1);
            }
        };
    }
}
B747_8_FMC_LegsPage.DEBUG_SHOW_WAYPOINT_PHASE = false;
//# sourceMappingURL=B747_8_FMC_LegsPage.js.map