export declare enum CJ4_MapSymbol {
    TRAFFIC = 0,
    CONSTRAINTS = 1,
    AIRSPACES = 2,
    AIRWAYS = 3,
    AIRPORTS = 4,
    INTERSECTS = 5,
    NAVAIDS = 6,
    NDBS = 7,
    TERMWPTS = 8,
    MISSEDAPPR = 9
}
export declare class CJ4_MapSymbols {
    static toggleSymbol(_symbol: any): Promise<void>;
    static hasSymbol(_symbol: CJ4_MapSymbol): number;
}
