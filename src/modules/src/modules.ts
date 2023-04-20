import { Module } from "./module";
import { SoundManager } from "./sound/soundmanager";
import { PauseAtTD } from "./qol/PauseAtTD";
import { AutoFuel } from "./qol/AutoFuel";

export class SaltyModules implements Module {
    private modules: Module[];

    constructor() {
        this.modules = [new SoundManager(), new PauseAtTD(), new AutoFuel()];
    }

    public update(dt: number) {
        for (const module of this.modules) {
            module.update(dt);
        }
    }
}
