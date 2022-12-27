import { Module } from "../module";

export class AutoFuel implements Module {
    private ovrdPumps = [7, 8, 11, 12];
    private xfeedValves = [1, 4];

    public update(_dt: number) {
        const enabled = WTDataStore.get("AUTO_FUEL", 0) >= 1;
        if (!enabled) return;

        const leftOutboardQuantity =
            SimVar.GetSimVarValue("FUEL TANK LEFT AUX QUANTITY", "gallon") + SimVar.GetSimVarValue("FUEL TANK LEFT TIP QUANTITY", "gallon");
        const leftInboardQuantity = SimVar.GetSimVarValue("FUEL TANK LEFT MAIN QUANTITY", "gallon");

        const rightOutboardQuantity =
            SimVar.GetSimVarValue("FUEL TANK RIGHT AUX QUANTITY", "gallon") + SimVar.GetSimVarValue("FUEL TANK RIGHT TIP QUANTITY", "gallon");
        const rightInboardQuantity = SimVar.GetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "gallon");

        const tanksBalanced = leftInboardQuantity <= leftOutboardQuantity || rightInboardQuantity <= rightOutboardQuantity;

        this.closePumpsAfterEmpty([15, 16], "FUEL TANK CENTER2 QUANTITY");
        this.closePumpsAfterEmpty([1, 2], "FUEL TANK CENTER QUANTITY");

        // Switch off OVRD/JETTISON pumps 2 & 3 and close crossfeed valves 1 & 4 when outboard + reserve tanks and inboard tanks balanced
        this.ovrdPumps.forEach((pump) => SimVar.SetSimVarValue(`K:FUELSYSTEM_PUMP_${tanksBalanced ? "OFF" : "ON"}`, "number", pump));
        this.xfeedValves.forEach((valve) => SimVar.SetSimVarValue(`K:FUELSYSTEM_VALVE_${tanksBalanced ? "CLOSE" : "OPEN"}`, "number", valve));
    }

    private closePumpsAfterEmpty(pumps: number[], quantityVar: string) {
        const quantity = SimVar.GetSimVarValue(quantityVar, "Gallons");

        for (const pump of pumps) {
            const pumpActive = SimVar.GetSimVarValue(`FUELSYSTEM PUMP SWITCH:${pump}`, "bool");
            if (quantity > 0 && !pumpActive) {
                SimVar.SetSimVarValue("K:FUELSYSTEM_PUMP_ON", "number", pump);
            } else if (quantity === 0 && pumpActive) {
                SimVar.SetSimVarValue("K:FUELSYSTEM_PUMP_OFF", "number", pump);
            }
        }
    }
}
