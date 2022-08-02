import { Module } from "../module";

export class PauseAtTD implements Module {
    constructor() {}

    public update(_dt: number) {
        if (this.shouldPause()) {
            SimVar.SetSimVarValue("K:PAUSE_ON", "number", 0);
            SimVar.SetSimVarValue("L:74S_ALREADY_PAUSED", "boolean", 1);
        }
    }

    private shouldPause(): boolean {
        const hasAlreadyPaused = SimVar.GetSimVarValue("L:74S_ALREADY_PAUSED", "boolean");
        const isOnGround = SimVar.GetSimVarValue("SIM ON GROUND", "boolean");
        const distanceTillTd = SimVar.GetSimVarValue("L:WT_CJ4_TOD_REMAINING", "number");

        const distanceOk = distanceTillTd < 5 && distanceTillTd > 2;

        return this.enabled() && distanceOk && !hasAlreadyPaused && !isOnGround;
    }

    private enabled(): boolean {
        return WTDataStore.get("PAUSE_AT_TD", 0) >= 1;
    }
}
