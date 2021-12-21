export interface ICustomWaypoint {
    wpt: WayPoint;
    offset: number;
}
export declare class CJ4_FMC_PilotWaypointParser {
    static readonly fullLatLong: RegExp;
    static readonly shorhandLatLongEnd: RegExp;
    static readonly shorthandLatLongMid: RegExp;
    static readonly placeBearingDistance: RegExp;
    static readonly alongTrackOffset: RegExp;
    static parseInput(value: string, referenceIndex: number, fmc: FMCMainDisplay): Promise<ICustomWaypoint | undefined>;
    static parseInputLatLong(value: string, fmc: FMCMainDisplay): WayPoint;
    static parseInputPlaceBearingDistance(value: string, fmc: FMCMainDisplay): Promise<WayPoint>;
    static buildPilotWaypointFromExisting(ident: string, latitude: number, longitude: number, fmc: FMCMainDisplay): WayPoint;
    private static parseFullLatLong;
    private static parseShorthandLatLongEnd;
    private static parseShorthandLatLongMid;
    private static parsePlaceBearingDistance;
    private static procMatch;
    private static getIndexedName;
}
