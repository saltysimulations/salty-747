class SaltyFuel {
    constructor() {
        this.lastTime = 0;
        this.xFeed1Open = 0;
        this.xFeed2Open = 0;
        this.xFeed3Open = 0;
        this.xFeed4Open = 0;
        this.leftCtrRunning = 0;
        this.rightCtrRunning = 0;
        this.ovrd2FwdRunning = 0;
        this.ovrd2AftRunning = 0;
        this.ovrd3FwdRunning = 0;
        this.ovrd3AftRunning = 0;
        this.anyMain1Running = 0;
        this.anyMain2Running = 0;
        this.anyMain3Running = 0;
        this.anyMain4Running = 0;
        console.log("SaltyFuel loaded");
    }
    init() {
        
    }

    update() {
        const t0 = performance.now();
        const dt = t0 - this.lastTime;
        this.getFuelSystemState();
        const engTankConfig = [];
        engTankConfig[1] = this.getEng1Tank();
        engTankConfig[2] = this.getEng2Tank();
        engTankConfig[3] = this.getEng3Tank();
        engTankConfig[4] = this.getEng4Tank();
        for (let i = 1; i < 5; i++) {
            this.updateEngines(i, engTankConfig[i], dt);
        }
        this.lastTime = t0;
    }

    getFuelSystemState() {
        this.xFeed1Open = SimVar.GetSimVarValue(`FUELSYSTEM VALVE OPEN:1`, "bool");
        this.xFeed2Open = SimVar.GetSimVarValue(`FUELSYSTEM VALVE OPEN:2`, "bool");
        this.xFeed3Open = SimVar.GetSimVarValue(`FUELSYSTEM VALVE OPEN:3`, "bool");
        this.xFeed4Open = SimVar.GetSimVarValue(`FUELSYSTEM VALVE OPEN:4`, "bool");
        this.leftCtrRunning = SimVar.GetSimVarValue(`FUELSYSTEM LINE FUEL FLOW:1`, "gallon per hour");
        this.rightCtrRunning = SimVar.GetSimVarValue(`FUELSYSTEM LINE FUEL FLOW:2`, "gallon per hour");
        this.ovrd2FwdRunning = SimVar.GetSimVarValue(`FUELSYSTEM LINE FUEL FLOW:50`, "gallon per hour");
        this.ovrd2AftRunning = SimVar.GetSimVarValue(`FUELSYSTEM LINE FUEL FLOW:52`, "gallon per hour");
        this.ovrd3FwdRunning = SimVar.GetSimVarValue(`FUELSYSTEM LINE FUEL FLOW:55`, "gallon per hour");
        this.ovrd3AftRunning = SimVar.GetSimVarValue(`FUELSYSTEM LINE FUEL FLOW:57`, "gallon per hour");
        this.anyMain1Running = SimVar.GetSimVarValue(`FUELSYSTEM LINE FUEL FLOW:9`, "gallon per hour");
        this.anyMain2Running = SimVar.GetSimVarValue(`FUELSYSTEM LINE FUEL FLOW:24`, "gallon per hour");
        this.anyMain3Running = SimVar.GetSimVarValue(`FUELSYSTEM LINE FUEL FLOW:34`, "gallon per hour");
        this.anyMain4Running = SimVar.GetSimVarValue(`FUELSYSTEM LINE FUEL FLOW:45`, "gallon per hour");
    }

    getEng1Tank() {
        if (!this.xFeed1Open) {
            return FuelTank.MAIN1;
        }
        else if (this.leftCtrRunning > 100 || this.rightCtrRunning > 100) {
            return FuelTank.CENTER;
        }
        else if (this.ovrd2AftRunning > 100 || this.ovrd2FwdRunning > 100) {
            return FuelTank.MAIN2;
        }
        else if (this.ovrd3AftRunning > 100 || this.ovrd3FwdRunning > 100) {
            return FuelTank.MAIN3;
        }
        else if (this.anyMain1Running > 100) {
            return FuelTank.MAIN1;
        }
        else if (this.xFeed1Open && this.xFeed2Open && this.anyMain2Running > 100) {
            return FuelTank.MAIN2;
        }
        else if (this.xFeed1Open && this.xFeed3Open && this.anyMain3Running > 100) {
            return FuelTank.MAIN3;
        }
        else if (this.xFeed1Open && this.xFeed4Open && this.anyMain4Running > 100) {
            return FuelTank.MAIN4;
        }
        else {
            return FuelTank.MAIN1;
        }
    }

    getEng2Tank() {
        if (!this.xFeed2Open) {
            return FuelTank.MAIN2;
        }
        else if (this.leftCtrRunning > 100 || this.rightCtrRunning > 100) {
            return FuelTank.CENTER;
        }
        else if (this.ovrd2AftRunning > 100 || this.ovrd2FwdRunning > 100) {
            return FuelTank.MAIN2;
        }
        else if (this.ovrd3AftRunning > 100 || this.ovrd3FwdRunning > 100) {
            return FuelTank.MAIN3;
        }
        else if (this.anyMain2Running > 100) {
            return FuelTank.MAIN2;
        }
        else if (this.xFeed2Open && this.xFeed1Open && this.anyMain1Running > 100) {
            return FuelTank.MAIN1;
        }
        else if (this.xFeed3Open && this.xFeed2Open && this.anyMain3Running > 100) {
            return FuelTank.MAIN3;
        }
        else if (this.xFeed4Open && this.xFeed2Open && this.anyMain4Running > 100) {
            return FuelTank.MAIN4;
        }
        else {
            return FuelTank.MAIN2;
        }
    }

    getEng3Tank() {
        if (!this.xFeed3Open) {
            return FuelTank.MAIN3;
        }
        else if (this.leftCtrRunning > 100 || this.rightCtrRunning > 100) {
            return FuelTank.CENTER;
        }
        else if (this.ovrd3AftRunning > 100 || this.ovrd3FwdRunning > 100) {
            return FuelTank.MAIN3;
        }
        else if (this.ovrd2AftRunning > 100 || this.ovrd2FwdRunning > 100) {
            return FuelTank.MAIN2;
        }
        else if (this.anyMain3Running > 100) {
            return FuelTank.MAIN3;
        }
        else if (this.xFeed3Open && this.xFeed4Open && this.anyMain4Running > 100) {
            return FuelTank.MAIN4;
        }
        else if (this.xFeed3Open && this.xFeed2Open && this.anyMain2Running > 100) {
            return FuelTank.MAIN2;
        }
        else if (this.xFeed1Open && this.xFeed4Open && this.anyMain1Running > 100) {
            return FuelTank.MAIN1;
        }
        else {
            return FuelTank.MAIN3;
        }
    }

    getEng4Tank() {
        if (!this.xFeed4Open) {
            return FuelTank.MAIN4;
        }
        else if (this.leftCtrRunning > 100 || this.rightCtrRunning > 100) {
            return FuelTank.CENTER;
        }
        else if (this.ovrd3AftRunning > 100 || this.ovrd3FwdRunning > 100) {
            return FuelTank.MAIN3;
        }
        else if (this.ovrd2AftRunning > 100 || this.ovrd2FwdRunning > 100) {
            return FuelTank.MAIN2;
        }
        else if (this.anyMain4Running > 100) {
            return FuelTank.MAIN4;
        }
        else if (this.xFeed3Open && this.xFeed4Open && this.anyMain3Running > 100) {
            return FuelTank.MAIN3;
        }
        else if (this.xFeed4Open && this.xFeed2Open && this.anyMain2Running > 100) {
            return FuelTank.MAIN2;
        }
        else if (this.xFeed1Open && this.xFeed4Open && this.anyMain1Running > 100) {
            return FuelTank.MAIN1;
        }
        else {
            return FuelTank.MAIN4;
        }
    }

    updateEngines(engineNo, tank, dt) {
        const mach = SimVar.GetSimVarValue("AIRSPEED MACH", "mach");
        const oat = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "kelvin");
        const p = SimVar.GetSimVarValue("AMBIENT PRESSURE", "hectopascal");
        const delta = p / 1013.25;
        const delta2 = delta * (1 + 0.2 * mach ** 2) ** 3.5;
        const theta = oat / 288.15;
        const theta2 = theta * (1 + 0.2 * mach ** 2);
        const CFF = SimVar.GetSimVarValue(`TURB ENG CORRECTED FF:${engineNo}`, "pound per hour");
        const FF = CFF * delta2 * theta2 ** 0.5;
        const fuelWeight = SimVar.GetSimVarValue("FUEL WEIGHT PER GALLON", "pounds");
        const simRate = SimVar.GetGlobalVarValue('SIMULATION RATE', 'number');
        const correction = FF * dt * 2.7777777777778E-7 / fuelWeight * simRate;
        const fuelQty = SimVar.GetSimVarValue(`FUEL TANK ${tank} QUANTITY`, "gallons");
        SimVar.SetSimVarValue(`FUEL TANK ${tank} QUANTITY`, "gallons", fuelQty - correction);
        SimVar.SetSimVarValue(`L:74S_ENG_${engineNo}_FUEL_FLOW`, "pound per hour", FF);
    }
}

class FuelTank { }
FuelTank.CENTER = 'CENTER';
FuelTank.MAIN1 = 'LEFT AUX';
FuelTank.MAIN2 = 'LEFT MAIN';
FuelTank.MAIN3 = 'RIGHT MAIN';
FuelTank.MAIN4 = 'RIGHT AUX';
