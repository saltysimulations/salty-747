import { Module } from "./module";
import { SoundManager } from "./sound/soundmanager";
import { PauseAtTD } from "./qol/PauseAtTD";
import { FireTest } from "./FireTest";

export class SaltyModules implements Module {
    private modules: Module[];

    constructor() {
        this.modules = [new SoundManager(), new PauseAtTD(), new FireTest()];
    }

    public update(dt: number) {
        for (const module of this.modules) {
            module.update(dt);
        }
    }
}
