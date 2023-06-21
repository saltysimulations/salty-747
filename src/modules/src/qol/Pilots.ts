import { Module } from "../module";
import { SaltyDataStore } from "@shared/persistence";

export class Pilots implements Module {
    constructor() {
        SaltyDataStore.getAndSubscribe("PILOT_VISIBILITY", (_, value) => this.updateVar(value), "off")
    }

    private updateVar(visibility: string) {
        if (visibility === "off") {
            SimVar.SetSimVarValue("L:SALTY_VISIBILITY_PILOT_0", "enum", 0);
            SimVar.SetSimVarValue("L:SALTY_VISIBILITY_PILOT_1", "enum", 0);
        } else if (visibility === "captain") {
            SimVar.SetSimVarValue("L:SALTY_VISIBILITY_PILOT_0", "enum", 1);
            SimVar.SetSimVarValue("L:SALTY_VISIBILITY_PILOT_1", "enum", 0);
        } else if (visibility === "fo") {
            SimVar.SetSimVarValue("L:SALTY_VISIBILITY_PILOT_0", "enum", 0);
            SimVar.SetSimVarValue("L:SALTY_VISIBILITY_PILOT_1", "enum", 1);
        } else {
            SimVar.SetSimVarValue("L:SALTY_VISIBILITY_PILOT_0", "enum", 1);
            SimVar.SetSimVarValue("L:SALTY_VISIBILITY_PILOT_1", "enum", 1);
        }
    }

    public update(_dt: number) {}
}