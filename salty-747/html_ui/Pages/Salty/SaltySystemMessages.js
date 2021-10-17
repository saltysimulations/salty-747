class FmcMessage {
    /*
        Type: 
            Alert = 0
            Communication = 1
            Advisory = 2
    */
    constructor(_text, _type = 0, _replace = "") {
        this.cText = _text;
        this._type = _type;
        this.replace = _replace;
    }

    /**
     * `set text(_t) {}` is not allowed to ensure thread safety, editing the original definition should never be allowed
     * Both NXSystemMessages and NXFictionalMessages messages shall always be readable ONLY
     */

    get text() {
        return this.cText;
    }

    /**
     * Only returning a "copy" of the object to ensure thread safety when trying to edit the original message
     */
    getSetMessage(t) {
        return {
            text: !!t ? this.cText.replace(this.replace, "" + t) : this.cText,
            type: this._type
        };
    }
}

/**
    SystemMessages only holds real messages
*/
const SaltySystemMessages = {
    /* Alert messages */
    unableLoadUplink: new FmcMessage("UNABLE TO LOAD CLEARANCE", 0),
    unableSendDownlink: new FmcMessage("UNABLE TO SEND MESSAGE", 0)
};

const SaltyFictionalMessages = {
    noSimBriefUser:         new FmcMessage("NO SIMBRIEF USER", 0),
    noAirportSpecified:     new FmcMessage("NO AIRPORT SPECIFIED", 0),
    fltNbrInUse:            new FmcMessage("FLT NBR IN USE", 0)
};
