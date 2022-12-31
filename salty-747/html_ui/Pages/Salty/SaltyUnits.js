 class SaltyUnits {
    static get metricWeight() {
        return SimVar.GetSimVarValue("L:SALTY_UNIT_IS_METRIC", "bool");
    }

    static userToKg(value) {
        return SaltyUnits.metricWeight ? value : value / 2.204625;
    }

    static kgToUser(value) {
        return SaltyUnits.metricWeight ? value : value * 2.204625;
    }

    static userWeightUnit() {
        return SaltyUnits.metricWeight ? 'KG' : 'LBS';
    }
}
