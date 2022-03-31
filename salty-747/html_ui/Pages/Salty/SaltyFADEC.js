class SaltyFADEC {
    constructor() {
        console.log('Salty FADEC loaded');

    }
    init() {
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
        SimVar.SetSimVarValue(`L:SALTY_TLA:${index}`, "percent", tla);
        return tla;
    }
    getIdleN1(index){
        //let flaps = this.getFlaps();
        let eai = this.getEAI(index);
        //let reverser = this.getReverser(index);
        let idleN1 = 20.2;
        if (eai /*|| flaps >= 20 || reverser*/) {
            idleN1 = 29.2;
        }
        SimVar.SetSimVarValue(`L:SALTY_IDLE_N1:${index}`, "percent", idleN1);
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
        SimVar.SetSimVarValue("L:SALTY_MAX_N1_TEST", "percent", maxN1);
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
        let comN1 = Math.min(Math.max(idleN1, 20.2) +  86.5 * tla * 0.01, maxN1);
        SimVar.SetSimVarValue(`L:SALTY_COM_N1:${index}`, "percent", comN1);
        SimVar.SetSimVarValue(`TURB ENG COMMANDED N1:${index}`, "percent", comN1);
        SimVar.SetSimVarValue(`TURB ENG THROTTLE COMMANDED N1:${index}`, "percent", comN1);
        return;
    }
    update() {

        for (let i = 1; i < 5; i++){
            let index = i;
            /*RegisterViewListener("JS_LISTENER_KEYEVENT");
            this.keyListener = RegisterViewListener('JS_LISTENER_KEYEVENT', () => {
                Coherent.call('INTERCEPT_KEY_EVENT', 'INCREASE_THROTTLE', 0);
                Coherent.call('INTERCEPT_KEY_EVENT', 'DECREASE_THROTTLE', 0);
                Coherent.call('INTERCEPT_KEY_EVENT', 'THROTTLE_CUT', 0);
                this.keyListener.on('keyIntercepted', keyEventName => {
                    if (keyEventName === 'THROTTLE_CUT')  {
                        if (SimVar.GetSimVarValue("GPS OBS ACTIVE", "boolean")) {
                            SimVar.SetSimVarValue("K:GPS_OBS_SET", "degrees", SimVar.GetSimVarValue("NAV OBS:1", "degree"));
                        }
                        console.log('THROTTLE CUT INTERCEPTED');
                        SimVar.SetSimVarValue("K:AXIS_THROTTLE_SET", "position 16K", 5995);
                    }
                    if (keyEventName === 'VOR1_OBI_DEC')  {
                        if (SimVar.GetSimVarValue("GPS OBS ACTIVE", "boolean")) {
                            SimVar.SetSimVarValue("K:GPS_OBS_SET", "degrees", SimVar.GetSimVarValue("NAV OBS:1", "degree"));
                        }
                    }
                });
    
            });*/
            //this.getEAI(index);
            //this.getBleed(index);
            //this.getAlternate(index);
            //this.getTLA(index);
            //this.getIdleN1(index);
            //this.getMaxN1(index);
            this.setCommandedN1(index);
        }
    return;
    }
}