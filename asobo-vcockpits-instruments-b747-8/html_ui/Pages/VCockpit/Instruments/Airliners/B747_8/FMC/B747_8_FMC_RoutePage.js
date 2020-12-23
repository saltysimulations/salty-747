class FMCRoutePage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        let originCell = "□□□□";
        if (fmc && fmc.flightPlanManager) {
            let origin = fmc.flightPlanManager.getOrigin();
            if (origin) {
                originCell = origin.ident;
            }
            else if (fmc.tmpOrigin) {
                originCell = fmc.tmpOrigin;
            }
        }
        fmc.onLeftInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            fmc.updateRouteOrigin(value, (result) => {
                if (result) {
                    FMCRoutePage.ShowPage1(fmc);
                }
            });
        };
        let destinationCell = "□□□□";
        if (fmc && fmc.flightPlanManager) {
            let destination = fmc.flightPlanManager.getDestination();
            if (destination) {
                destinationCell = destination.ident;
            }
            else if (fmc.tmpDestination) {
                destinationCell = fmc.tmpDestination;
            }
        }
        fmc.onRightInput[0] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            fmc.updateRouteDestination(value, (result) => {
                if (result) {
                    FMCRoutePage.ShowPage1(fmc);
                }
            });
        };
        let flightNoCell = "--------";
        let flightNoValue = SimVar.GetSimVarValue("ATC FLIGHT NUMBER", "string");
        if (flightNoValue) {
            flightNoCell = flightNoValue;
        }
        fmc.onRightInput[1] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            fmc.updateFlightNo(value, (result) => {
                if (result) {
                    FMCRoutePage.ShowPage1(fmc);
                }
            });
        };
        let coRouteCell = "--------";
        if (fmc.coRoute) {
            coRouteCell = fmc.coRoute;
        }
        fmc.onRightInput[2] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            fmc.updateCoRoute(value, (result) => {
                if (result) {
                    FMCRoutePage.ShowPage1(fmc);
                }
            });
        };
        let allRows = FMCRoutePage._GetAllRows(fmc);
        let pageCount = (Math.floor(allRows.length / 4) + 2);
        let activateCell = "";
        if (fmc.flightPlanManager.getCurrentFlightPlanIndex() === 1) {
            if (!fmc.getIsRouteActivated()) {
                activateCell = "ACTIVATE>";
                fmc.onRightInput[5] = () => {
                    fmc.activateRoute();
                    FMCRoutePage.ShowPage1(fmc);
                };
            }
        }
        if (activateCell === "") {
            activateCell = "PERF INIT>";
            fmc.onRightInput[5] = () => {
                fmc.activateRoute();
                FMCPerfInitPage.ShowPage1(fmc);
            };
        }
        let runwayCell = "";
        let runway = fmc.flightPlanManager.getDepartureRunway();
        if (runway) {
            runwayCell = Avionics.Utils.formatRunway(runway.designation);
        }
        fmc.onLeftInput[1] = () => {
            let value = fmc.inOut;
            fmc.clearUserInput();
            fmc.setOriginRunway(value, (result) => {
                if (result) {
                    FMCRoutePage.ShowPage1(fmc);
                }
            });
        };
        fmc.setTemplate([
            ["RTE 1", "1", pageCount.toFixed(0)],
            ["ORIGIN", "DEST"],
            [originCell, destinationCell],
            ["RUNWAY", "FLT NO"],
            [runwayCell, flightNoCell],
            ["REQUEST", "CO ROUTE"],
            ["\<SEND", coRouteCell],
            ["__FMCSEPARATOR"],
            [""],
            [""],
            [""],
            [""],
            ["\<RTE 2", activateCell]
        ]);
        fmc.onNextPage = () => {
            FMCRoutePage.ShowPage2(fmc);
        };
    }
    static ShowPage2(fmc, offset = 0, pendingAirway, discontinuity = -1) {
        fmc.clearDisplay();
        let rows = [["----"], [""], [""], [""], [""]];
        let allRows = FMCRoutePage._GetAllRows(fmc);
        let page = (2 + (Math.floor(offset / 4)));
        let pageCount = (Math.floor(allRows.length / 4) + 2);
        console.log(fmc.flightPlanManager.getEnRouteWaypoints());
        let showInput = false;
        let discontinued = false;
        if (discontinuity >= allRows.length) {
            discontinuity = -1;
        }
        for (let i = 0; i < rows.length; i++) {
            let ii = i + offset + (discontinued ? -1 : 0);
            if (allRows[ii]) {
                rows[i] = allRows[ii];
                let waypointFlightPlanIndex = ii + fmc.flightPlanManager.getDepartureWaypointsCount() + (fmc.flightPlanManager.getDepartureProcIndex() > -1 ? 0 : 1);
                if (!discontinued && i + offset === discontinuity) {
                    rows[i] = ["-----", "-----"];
                    discontinued = true;
                    fmc.onRightInput[i] = () => {
                        let value = fmc.inOut;
                        if (value.length > 0) {
                            fmc.clearUserInput();
                            fmc.insertWaypoint(value, waypointFlightPlanIndex, () => {
                                FMCRoutePage.ShowPage2(fmc, offset);
                            });
                        }
                    };
                }
                else {
                    fmc.onLeftInput[i] = () => {
                        let value = fmc.inOut;
                        if (value === "DELETE") {
                            fmc.inOut = "";
                            fmc.removeWaypoint(waypointFlightPlanIndex, () => {
                                FMCRoutePage.ShowPage2(fmc, offset, pendingAirway, ii);
                            });
                        }
                    };
                    fmc.onRightInput[i] = () => {
                        let value = fmc.inOut;
                        if (value === "DELETE") {
                            fmc.inOut = "";
                            fmc.removeWaypoint(waypointFlightPlanIndex, () => {
                                FMCRoutePage.ShowPage2(fmc, offset, pendingAirway, ii);
                            });
                        }
                        else if (value.length > 0) {
                            fmc.clearUserInput();
                            fmc.insertWaypoint(value, waypointFlightPlanIndex, () => {
                                FMCRoutePage.ShowPage2(fmc, offset);
                            });
                        }
                    };
                }
            }
            else if (!showInput) {
                showInput = true;
                if (!pendingAirway) {
                    rows[i] = ["-----", "-----"];
                    fmc.onRightInput[i] = async () => {
                        let value = fmc.inOut;
                        if (value.length > 0) {
                            fmc.clearUserInput();
                            fmc.insertWaypoint(value, fmc.flightPlanManager.getEnRouteWaypointsLastIndex() + 1, () => {
                                FMCRoutePage.ShowPage2(fmc, offset);
                            });
                        }
                    };
                    fmc.onLeftInput[i] = async () => {
                        let value = fmc.inOut;
                        if (value.length > 0) {
                            fmc.clearUserInput();
                            let lastWaypoint = fmc.flightPlanManager.getWaypoints()[fmc.flightPlanManager.getEnRouteWaypointsLastIndex()];
                            if (lastWaypoint.infos instanceof IntersectionInfo) {
                                let airway = lastWaypoint.infos.airways.find(a => { return a.name === value; });
                                if (airway) {
                                    FMCRoutePage.ShowPage2(fmc, offset, airway);
                                }
                                else {
                                    fmc.showErrorMessage("NOT IN DATABASE");
                                }
                            }
                        }
                    };
                }
                else {
                    rows[i] = [pendingAirway.name, "-----"];
                    fmc.onRightInput[i] = () => {
                        let value = fmc.inOut;
                        if (value.length > 0) {
                            fmc.clearUserInput();
                            fmc.insertWaypointsAlongAirway(value, fmc.flightPlanManager.getEnRouteWaypointsLastIndex() + 1, pendingAirway.name, (result) => {
                                if (result) {
                                    FMCRoutePage.ShowPage2(fmc, offset);
                                }
                            });
                        }
                    };
                    if (rows[i + 1]) {
                        rows[i + 1] = ["-----"];
                    }
                }
            }
        }
        let activateCell = "";
        if (fmc.flightPlanManager.getCurrentFlightPlanIndex() === 1) {
            if (!fmc.getIsRouteActivated()) {
                activateCell = "ACTIVATE>";
                fmc.onRightInput[5] = () => {
                    fmc.activateRoute();
                    FMCRoutePage.ShowPage2(fmc);
                };
            }
        }
        else {
            activateCell = "PERF INIT>";
            fmc.onRightInput[5] = () => {
                fmc.activateRoute();
                FMCPerfInitPage.ShowPage1(fmc);
            };
        }
        fmc.setTemplate([
            ["RTE 1", page.toFixed(0), pageCount.toFixed(0)],
            ["VIA", "TO"],
            rows[0],
            [""],
            rows[1],
            [""],
            rows[2],
            [""],
            rows[3],
            [""],
            rows[4],
            [""],
            ["\<RTE 2", activateCell]
        ]);
        fmc.onPrevPage = () => {
            if (offset === 0) {
                FMCRoutePage.ShowPage1(fmc);
            }
            else {
                FMCRoutePage.ShowPage2(fmc, offset - 4, pendingAirway, discontinuity);
            }
        };
        fmc.onNextPage = () => {
            if (offset + 4 < allRows.length) {
                FMCRoutePage.ShowPage2(fmc, offset + 4, pendingAirway, discontinuity);
            }
        };
    }
    static _GetAllRows(fmc) {
        let allRows = [];
        let flightPlan = fmc.flightPlanManager;
        if (flightPlan) {
            let departure = flightPlan.getDeparture();
            let lastDepartureWaypoint;
            if (departure) {
                let departureWaypoints = flightPlan.getDepartureWaypointsMap();
                lastDepartureWaypoint = departureWaypoints[departureWaypoints.length - 1];
                if (lastDepartureWaypoint) {
                    allRows.push([departure.name, lastDepartureWaypoint.ident]);
                }
            }
            let routeWaypoints = flightPlan.getEnRouteWaypoints();
            for (let i = 0; i < routeWaypoints.length; i++) {
                let prev = routeWaypoints[i - 1];
                if (i === 0 && lastDepartureWaypoint) {
                    prev = lastDepartureWaypoint;
                }
                let wp = routeWaypoints[i];
                if (wp) {
                    let prevAirway = IntersectionInfo.GetCommonAirway(prev, wp);
                    if (!prevAirway) {
                        allRows.push(["DIRECT", wp.ident]);
                    }
                    else {
                        allRows.push([prevAirway.name, wp.ident]);
                    }
                }
            }
        }
        return allRows;
    }
}
//# sourceMappingURL=B747_8_FMC_RoutePage.js.map