"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CJ4_MapSymbols = exports.CJ4_MapSymbol = void 0;
var CJ4_MapSymbol;
(function (CJ4_MapSymbol) {
    CJ4_MapSymbol[CJ4_MapSymbol["TRAFFIC"] = 0] = "TRAFFIC";
    CJ4_MapSymbol[CJ4_MapSymbol["CONSTRAINTS"] = 1] = "CONSTRAINTS";
    CJ4_MapSymbol[CJ4_MapSymbol["AIRSPACES"] = 2] = "AIRSPACES";
    CJ4_MapSymbol[CJ4_MapSymbol["AIRWAYS"] = 3] = "AIRWAYS";
    CJ4_MapSymbol[CJ4_MapSymbol["AIRPORTS"] = 4] = "AIRPORTS";
    CJ4_MapSymbol[CJ4_MapSymbol["INTERSECTS"] = 5] = "INTERSECTS";
    CJ4_MapSymbol[CJ4_MapSymbol["NAVAIDS"] = 6] = "NAVAIDS";
    CJ4_MapSymbol[CJ4_MapSymbol["NDBS"] = 7] = "NDBS";
    CJ4_MapSymbol[CJ4_MapSymbol["TERMWPTS"] = 8] = "TERMWPTS";
    CJ4_MapSymbol[CJ4_MapSymbol["MISSEDAPPR"] = 9] = "MISSEDAPPR";
})(CJ4_MapSymbol = exports.CJ4_MapSymbol || (exports.CJ4_MapSymbol = {}));
class CJ4_MapSymbols {
    static toggleSymbol(_symbol) {
        return new Promise(function (resolve) {
            let symbols = SimVar.GetSimVarValue("L:CJ4_MAP_SYMBOLS", "number");
            if (symbols == -1) {
                resolve();
            } // if it fails, it fails
            symbols ^= (1 << _symbol);
            SimVar.SetSimVarValue("L:CJ4_MAP_SYMBOLS", "number", symbols).then(() => {
                resolve();
            });
        });
    }
    static hasSymbol(_symbol) {
        const symbols = SimVar.GetSimVarValue("L:CJ4_MAP_SYMBOLS", "number");
        if (symbols == -1) {
            return 0;
        }
        if (symbols & (1 << _symbol)) {
            return 1;
        }
        return 0;
    }
}
exports.CJ4_MapSymbols = CJ4_MapSymbols;
//# sourceMappingURL=CJ4_MapSymbols.js.map