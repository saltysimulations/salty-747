class GeoCalcInfo {
    constructor(_instrument) {
        this.useMagVar = false;
        this.loadState = 0;
        this.instrument = _instrument;
    }
    SetParams(_lat1, _lon1, _lat2, _lon2, _useMagVar = false) {
        if (this.IsIdle()) {
            if (_lat1 != this.lat1 || _lon1 != this.lon1 || _lat2 != this.lat2 || _lon2 != this.lon2 || _useMagVar != this.useMagVar) {
                this.lat1 = _lat1;
                this.lon1 = _lon1;
                this.lat2 = _lat2;
                this.lon2 = _lon2;
                this.useMagVar = _useMagVar;
                this.loadState = 0;
            }
        }
    }
    Compute(_callback = null) {
        if (this.IsIdle()) {
            this.endCallBack = _callback;
            if (!this.IsUpToDate()) {
                this.LoadData();
                return;
            }
            if (this.endCallBack) {
                this.endCallBack();
            }
        }
    }
    LoadData() {
        var instrId = this.instrument.instrumentIdentifier;
        switch (this.loadState) {
            case 0:
                this.loadState++;
                SimVar.SetSimVarValue("C:fs9gps:GeoCalcLatitude1", "degree", this.lat1, instrId);
                SimVar.SetSimVarValue("C:fs9gps:GeoCalcLongitude1", "degree", this.lon1, instrId);
                SimVar.SetSimVarValue("C:fs9gps:GeoCalcLatitude2", "degree", this.lat2, instrId);
                SimVar.SetSimVarValue("C:fs9gps:GeoCalcLongitude2", "degree", this.lon2, instrId).then(function () {
                    this.bearing = SimVar.GetSimVarValue("C:fs9gps:GeoCalcBearing", "degree", instrId);
                    if (this.useMagVar) {
                        this.bearing -= SimVar.GetSimVarValue("MAGVAR", "degree", instrId);
                    }
                    this.bearing = (this.bearing + 360) % 360;
                    this.distance = SimVar.GetSimVarValue("C:fs9gps:GeoCalcDistance", "nautical miles", instrId);
                    this.loadState++;
                    if (this.endCallBack) {
                        this.endCallBack();
                    }
                }.bind(this));
                break;
        }
    }
    IsUpToDate() {
        return this.loadState == 2;
    }
    IsIdle() {
        return (this.IsUpToDate() || this.loadState == 0);
    }
}
//# sourceMappingURL=GeoCalc.js.map