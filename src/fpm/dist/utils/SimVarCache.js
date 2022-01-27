"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// simvar cache experiment
const svCache = new Map();
let svCacheTs = Date.now();
class SimVarObject {
    setValue(value, timestamp) {
        this._value = value;
        this._timestamp = timestamp;
    }
    getValue(timestamp) {
        if (this._timestamp === timestamp) {
            return this._value;
        }
        return undefined;
    }
}
const oldGetSimVar = SimVar.GetSimVarValue;
SimVar.GetSimVarValue = (name, unit, dataSource = "") => {
    const key = name + unit;
    let svObj = svCache.get(key);
    if (svObj === undefined) {
        svObj = new SimVarObject();
        svCache.set(key, svObj);
    }
    const svVal = svObj.getValue(svCacheTs);
    if (svVal !== undefined) {
        return svVal;
    }
    else {
        const newVal = oldGetSimVar(name, unit, dataSource);
        svObj.setValue(newVal, svCacheTs);
        return newVal;
    }
};
const oldSetSimvar = SimVar.SetSimVarValue;
SimVar.SetSimVarValue = (name, unit, value, dataSource) => {
    if (!name.startsWith("K:") && !name.startsWith("A:") && !name.startsWith("C:")) {
        const key = name + unit;
        let svObj = svCache.get(key);
        if (svObj === undefined) {
            svObj = new SimVarObject();
            svCache.set(key, new SimVarObject());
        }
        svObj.setValue(value, svCacheTs);
    }
    return oldSetSimvar(name, unit, value, dataSource);
};
const clearSv = () => {
    // svCache.clear();
    svCacheTs = Date.now();
    requestAnimationFrame(clearSv);
};
clearSv();
//# sourceMappingURL=SimVarCache.js.map