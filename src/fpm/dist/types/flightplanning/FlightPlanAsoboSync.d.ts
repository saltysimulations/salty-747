import { FlightPlanManager } from "./FlightPlanManager";
/** A class for syncing a flight plan with the game */
export declare class FlightPlanAsoboSync {
    static fpChecksum: number;
    static fpListenerInitialized: boolean;
    static init(): void;
    static LoadFromGame(fpln: FlightPlanManager): Promise<void>;
    static SaveToGame(fpln: FlightPlanManager): Promise<void>;
}
