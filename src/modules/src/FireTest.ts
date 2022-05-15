import { Module } from "./module";

enum FireTestStage {
    Off,
    InProgress,
    Pass
}

export class FireTest implements Module {
    private timer = 0;

    public update(dt: number): void {
        if (SimVar.GetSimVarValue("L:SALTY_FIRE_TEST_PRESSED", "boolean")) {
            this.timer += dt;
            if (this.timer / 1000 >= 11.7) {
                SimVar.SetSimVarValue("L:SALTY_FIRE_TEST", "enum", FireTestStage.Pass);
            } else if (this.timer / 1000 >= 3.7) {
                SimVar.SetSimVarValue("L:SALTY_FIRE_TEST", "enum", FireTestStage.InProgress);
            }
        } else {
            if (SimVar.GetSimVarValue("L:SALTY_FIRE_TEST", "enum") !== FireTestStage.Off) {
                SimVar.SetSimVarValue("L:SALTY_FIRE_TEST", "enum", FireTestStage.Off);
                this.timer = 0;
            }
        }
    }

}
