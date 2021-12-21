import { FlightPlanManager } from "../flightplanning/FlightPlanManager";
export declare class CJ4_SpeedObserver {
    private _fpm;
    private _fpChecksum;
    private _currentSpeedRestriction;
    private _speedProfile;
    private _vnavDescentIas;
    /**
     *
     */
    constructor(_fpm: FlightPlanManager);
    update(): void;
    /** Observes the current speed restriction */
    observeSpeed(): void;
    /** Looks back in the flight plan to build an array of speed restrictions for each leg */
    updateSpeedProfile(): void;
}
