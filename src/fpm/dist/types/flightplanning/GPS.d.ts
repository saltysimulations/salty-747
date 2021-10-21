/**
 * Methods for interacting with the FS9GPS subsystem.
 */
export declare class GPS {
    /**
     * Clears the FS9GPS flight plan.
     */
    static clearPlan(): Promise<void>;
    /**
     * Adds a waypoint to the FS9GPS flight plan by ICAO designation.
     * @param icao The MSFS ICAO to add to the flight plan.
     * @param index The index of the waypoint to add in the flight plan.
     */
    static addIcaoWaypoint(icao: string, index: number): Promise<void>;
    /**
     * Adds a user waypoint to the FS9GPS flight plan.
     * @param lat The latitude of the user waypoint.
     * @param lon The longitude of the user waypoint.
     * @param index The index of the waypoint to add in the flight plan.
     * @param ident The ident of the waypoint.
     */
    static addUserWaypoint(lat: number, lon: number, index: number, ident: string): Promise<void>;
    /**
     * Deletes a waypoint from the FS9GPS flight plan.
     * @param index The index of the waypoint in the flight plan to delete.
     */
    static deleteWaypoint(index: number): Promise<void>;
    /**
     * Sets the active FS9GPS waypoint.
     * @param {Number} index The index of the waypoint to set active.
     */
    static setActiveWaypoint(index: number): Promise<void>;
    /**
     * Gets the active FS9GPS waypoint.
     */
    static getActiveWaypoint(): number;
    /**
     * Logs the current FS9GPS flight plan.
     */
    static logCurrentPlan(): Promise<void>;
}
