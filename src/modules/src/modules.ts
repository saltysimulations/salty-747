import { Module } from "./module";
import { SoundManager } from "./sound/soundmanager";

export class SaltyModules extends Module {
    private modules: Module[];

    constructor() {
        super();
        this.modules = [new SoundManager()];
    }

    public update(dt: number) {
        for (const module of this.modules) {
            module.update(dt);
        }
    }
}
