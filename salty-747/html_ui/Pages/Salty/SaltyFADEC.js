class SaltyFADEC {
    constructor() {
        console.log('Salty FADEC loaded');

    }
    init() {
        var t = 0;
        return;
    }
    getEAI(index) {
        let eai = SimVar.GetSimVarValue(`ENGINE ANTI ICE:${index}`, "bool");
        return eai;
    }
    getBleed(index) {
        let bleed = SimVar.GetSimVarValue(`BLEED AIR ENGINE:${index}`, "bool");
        return bleed;
    }
    getAlternate(index) {
        SimVar.SetSimVarValue(`L:SALTY_ALT_ENG_MODE:${index}`, "bool", false);
        let alternate = SimVar.GetSimVarValue(`L:SALTY_ALT_ENG_MODE:${index}`, "bool");
        return alternate;
    }
    getTLA(index) {
        let tla = SimVar.GetSimVarValue(`GENERAL ENG THROTTLE LEVER POSITION:${index}`, "percent");
        SimVar.SetSimVarValue(`L:SALTY_EEC_TLA:${index}`, "percent", tla);
        return tla;
    }
    getIdleN1(index){
        //let flaps = this.getFlaps();
        let eai = this.getEAI(index);
        //let reverser = this.getReverser(index);
        let idleN1 = 20.2;
        if (eai /*|| flaps >= 20 || reverser*/) {
            idleN1 += 14.1;
        }
        SimVar.SetSimVarValue(`L:SALTY_EEC_IDLE_N1:${index}`, "percent", idleN1);
        return idleN1;
    }
    getMaxN1(index) {
        //let eai = this.getEAI(index);
        let bleed = this.getBleed(index);
        let alternate = this.getAlternate(index);
        let maxN1 = 98.5;
        if (bleed) {
            maxN1 -= 0.6; 
        }
        if (alternate) {
            maxN1 = 106.7;
        }
        //SimVar.SetGameVarValue(`ENG MAX N1${index}`, "percent", maxN1);
        //let test = SimVar.GetGameVarValue(`ENG MAX N1${index}`, "percent");
        SimVar.SetSimVarValue("L:SALTY_EEC_MAX_N1", "percent", maxN1);
        //console.log(test);
        return maxN1;
    }
    setCommandedN1(index) {
        //let alt = SimVar.GetSimVarValue("PRESSURE ALTITUDE", "feet");
        let tat = SimVar.GetSimVarValue("TOTAL AIR TEMPERATURE", "kelvin");
        let theta2 = tat / 288.15;
        let tla = this.getTLA(index);
        let idleN1 = this.getIdleN1(index);
        let maxN1 = this.getMaxN1(index);
        let comN1 = 0.01 * (maxN1 - idleN1) * tla + idleN1;
        SimVar.SetSimVarValue(`L:SALTY_EEC_COM_N1:${index}`, "number", comN1);
        //SimVar.SetSimVarValue(`TURB ENG COMMANDED N1:${index}`, "percent", comN1);
        //SimVar.SetSimVarValue(`TURB ENG THROTTLE COMMANDED N1:${index}`, "percent", comN1);
        return;
    }
    /*setN1(index) {
        let tat = SimVar.GetSimVarValue("TOTAL AIR TEMPERATURE", "kelvin");
        let theta2 = tat / 288.15;
        let targetN1 = SimVar.GetSimVarValue(`L:SALTY_EEC_COM_N1:${index}`, "number"); //target N1 set by thrust lever position
        let n1 = SimVar.GetSimVarValue(`TURB ENG N1:${index}`, "number") * 100; //actual N1 on the engine
        SimVar.SetSimVarValue(`L:SALTY_EEC_N1:${index}`, "percent", n1); //for debugging
        let tspool = 7.574 * (Math.log(targetN1) - Math.log(n1)); //time required in seconds
        SimVar.SetSimVarValue(`L:SALTY_EEC_SPOOL_TIME:${index}`, "number", tspool); //for debugging
        n1 *= Math.exp(0.001 * tspool * 0.132);
        SimVar.SetSimVarValue(`L:SALTY_EEC_N1:${index}`, "percent", n1);
        //SimVar.SetSimVarValue(`TURB ENG CORRECTED N1:${index}`, "percent", n1);
        SimVar.SetSimVarValue(`TURB ENG N1:${index}`, "percent", n1);
    }*/
    /*setN2(index) {
        let tat = SimVar.GetSimVarValue("TOTAL AIR TEMPERATURE", "kelvin");
        let theta2 = tat / 288.15;
        let tla = this.getTLA(index);
        let maxN2 = (this.getMaxN1(index) + 117.5) / 2.025;
        let idleN2 = (this.getIdleN1(index) + 117.5) / 2.025;
        let n2 = 0.01 * (maxN2 - idleN2) * tla + idleN2;
        SimVar.SetSimVarValue(`L:SALTY_COM_N2:${index}`, "percent", n2);
        SimVar.SetSimVarValue(`TURB ENG CORRECTED N2:${index}`, "percent", (n2 / (theta2 ** 0.5)));
        SimVar.SetSimVarValue(`TURB ENG N2:${index}`, "percent", n2);
        return;
    }*/
    /*setN2 (index) {
        let tat = SimVar.GetSimVarValue("TOTAL AIR TEMPERATURE", "kelvin");
        let theta2 = tat / 288.15;
        let targetN1 = SimVar.GetSimVarValue(`L:SALTY_EEC_COM_N1:${index}`, "number"); //target N1 set by thrust lever position
        let targetN2 = (targetN1 + 117.5) / 2.025;
        SimVar.SetSimVarValue(`L:SALTY_EEC_COM_N2:${index}`, "percent", targetN2);
        //let n2 = SimVar.GetSimVarValue(`TURB ENG N2:${index}`, "number") * 100; //actual N2 on the engine
        //SimVar.SetSimVarValue(`L:SALTY_EEC_N2:${index}`, "percent", n2); //for debugging
        //let tspool = 26.636 * (Math.log(targetN2) - Math.log(n2)); //time required in seconds
        //SimVar.SetSimVarValue(`L:SALTY_EEC_SPOOL_TIME:${index}`, "number", tspool); //for debugging
        //n2 *= Math.exp(0.001 * tspool * 0.0375);
        //SimVar.SetSimVarValue("L:SALTY_EEC_N1", "percent", n1);
        //SimVar.SetSimVarValue("L:SALTY_EEC_N12", "percent", n12);
        //SimVar.SetSimVarValue(`TURB ENG CORRECTED N2:${index}`, "percent", n2 / (theta2 ** 0.5));
        //SimVar.SetSimVarValue(`TURB ENG N2:${index}`, "percent", n2);
    }*/
    setCommandedN2(index) {
        let CommandedN1 = SimVar.GetSimVarValue(`L:SALTY_EEC_COM_N1:${index}`, "number");
        let CommandedN2 = (CommandedN1 + 117.5) / 2.025;
        SimVar.SetSimVarValue(`L:SALTY_EEC_COM_N2:${index}`, "percent", CommandedN2);
        return;
    }
    setCommandedFF(index) {
        let CommandedN2 = SimVar.GetSimVarValue(`L:SALTY_EEC_COM_N2:${index}`, "percent");
        let CommandedFF = 0.0004 * Math.exp(0.0616 * CommandedN2) * 67523;
        SimVar.SetSimVarValue(`L:SALTY_EEC_COM_FF:${index}`, "number", CommandedFF);
        return;
    }

    setFuelFlow(index) {
        let targetFF = SimVar.GetSimVarValue(`L:SALTY_EEC_COM_FF:${index}`, "number");
        let FF = SimVar.GetSimVarValue(`TURB ENG FUEL FLOW:${index}`, "pound per hour");
        let error = targetFF - FF;
        /*while (error =! 0) {
            //FF += 
        }*/
    }

    /*setFuelFlow(index) {
        let p = SimVar.GetSimVarValue("AMBIENT PRESSURE", "hectopascal");
        let p0 = 1013.25;
        let oat = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "kelvin");
        let tat = SimVar.GetSimVarValue("TOTAL AIR TEMPERATURE", "kelvin");
        let t0 = 288.15;
        let mach = SimVar.GetSimVarValue("AIRSPEED MACH", "mach");
        let delta = p / p0;
        let delta2 = delta * (1 + 0.2 * mach ** 2) ** 3.5;
        let theta = oat / t0;
        let theta2 = tat / t0;
        let cff = SimVar.GetSimVarValue(`TURB ENG CORRECTED FF:${index}`, "pound per hour");
        let ff = cff * delta2 * theta2 ** 0.5;
        SimVar.SetSimVarValue(`TURB ENG FUEL FLOW:${index}`, "pound per hour", ff);
        //SimVar.SetSimVarValue(`TURB ENG CORRECTED FF:${index}`, "pound per hour", ff);
        return;
    }*/


    update() {
        //t += 0.001;
        for (let i = 1; i < 5; i++){
            let index = i;
            RegisterViewListener("JS_LISTENER_KEYEVENT");
            this.keyListener = RegisterViewListener('JS_LISTENER_KEYEVENT', () => {
                Coherent.call('INTERCEPT_KEY_EVENT', 'INCREASE_THROTTLE', 0);
                Coherent.call('INTERCEPT_KEY_EVENT', 'DECREASE_THROTTLE', 0);
                Coherent.call('INTERCEPT_KEY_EVENT', 'THROTTLE_CUT', 0);
                //Coherent.call('INTERCEPT_KEY_EVENT', '')
                /*this.keyListener.on('keyIntercepted', keyEventName => {
                    if (keyEventName === 'THROTTLE_CUT')  {
                        console.log('THROTTLE CUT INTERCEPTED');
                        SimVar.SetSimVarValue("K:AXIS_THROTTLE_SET", "position 16K", 5995);
                    }
                });*/
    
            });
            //this.getEAI(index);
            //this.getBleed(index);
            //this.getAlternate(index);
            //this.getTLA(index);
            //this.getIdleN1(index);
            //this.getMaxN1(index);
            this.setCommandedN1(index);
            this.setCommandedN2(index);
            this.setCommandedFF(index);
            //this.setN2(index);
            //this.setN1(index);
            //this.setFuelFlow(index);
        }
    return;
    }
}