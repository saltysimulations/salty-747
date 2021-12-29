"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CJ4_SpeedObserver = void 0;
class CJ4_SpeedObserver {
    /**
     *
     */
    constructor(_fpm) {
        this._fpm = _fpm;
        this._fpChecksum = 0;
        this._currentSpeedRestriction = 0;
        this._vnavDescentIas = 290;
    }
    update() {
        if (this._fpChecksum !== this._fpm.getFlightPlan(0).checksum) {
            this.updateSpeedProfile();
            this._vnavDescentIas = WTDataStore.get('CJ4_vnavDescentIas', 290);
            this._fpChecksum = this._fpm.getFlightPlan(0).checksum;
        }
        this.observeSpeed();
    }
    /** Observes the current speed restriction */
    observeSpeed() {
        // check if vnav is on
        const isVnavOn = SimVar.GetSimVarValue("L:WT_CJ4_VNAV_ON", "number") == 1;
        if (isVnavOn) {
            this._currentSpeedRestriction = this._speedProfile[this._fpm.getActiveWaypointIndex()];
            // TODO if VPATH is active check for descent target speed
        }
    }
    /** Looks back in the flight plan to build an array of speed restrictions for each leg */
    updateSpeedProfile() {
        // ...
        this._speedProfile = new Array(this._fpm.getFlightPlan(0).waypoints.length).fill(999);
        const wpts = this._fpm.getFlightPlan(0).waypoints;
        let activeRestriction = 999;
        for (let i = 0; i < wpts.length; i++) {
            const wpt = wpts[i];
            let constraint = wpt.speedConstraint;
            if (constraint === -1) {
                constraint = 999;
            }
            if (constraint !== 999 && constraint !== activeRestriction) {
                activeRestriction = constraint;
            }
            this._speedProfile[i] = activeRestriction;
        }
    }
}
exports.CJ4_SpeedObserver = CJ4_SpeedObserver;
//# sourceMappingURL=CJ4_SpeedObserver.js.map