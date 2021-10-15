class FmcMessage {
    constructor(_text, _isAmber = false, _isTypeTwo = false, _replace = "") {
        this.cText = _text;
        this.isAmber = _isAmber;
        this.isTypeTwo = _isTypeTwo;
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
            isAmber: this.isAmber,
            isTypeTwo: this.isTypeTwo
        };
    }
}

/**
 NXSystemMessages only holds real messages
 */
const SaltySystemMessages = {
    aocActFplnUplink:       new FmcMessage("AOC ACT F-PLN UPLINK", false, true),
    awyWptMismatch:         new FmcMessage("AWY/WPT MISMATCH", false, false),
    checkMinDestFob:        new FmcMessage("CHECK MIN DEST FOB", false, true),
    checkToData:            new FmcMessage("CHECK TAKE OFF DATA", true, true),
    destEfobBelowMin:       new FmcMessage("DEST EFOB BELOW MIN", true, true),
    enterDestData:          new FmcMessage("ENTER DEST DATA", true, true),
    entryOutOfRange:        new FmcMessage("ENTRY OUT OF RANGE", false, false),
    formatError:            new FmcMessage("FORMAT ERROR", false, false),
    // gpsPrimary:             new FmcMessage("GPS PRIMARY", false, true),
    gpsPrimaryLost:         new FmcMessage("GPS PRIMARY LOST", true, true),
    initializeWeightOrCg:   new FmcMessage("INITIALIZE WEIGHT/CG", true, true),
    newCrzAlt:              new FmcMessage("NEW CRZ ALT - HHHHH", false, true, "HHHHH"),
    noIntersectionFound:    new FmcMessage("NO INTERSECTION FOUND", false, false),
    notAllowed:             new FmcMessage("NOT ALLOWED", false, false),
    notAllowedInNav:        new FmcMessage("NOT ALLOWED IN NAV", false, false),
    acPositionInvalid:      new FmcMessage("A/C POSITION INVALID", false, false),
    notInDatabase:          new FmcMessage("NOT IN DATABASE", false, false),
    selectDesiredSystem:    new FmcMessage("SELECT DESIRED SYSTEM", false, false),
    uplinkInsertInProg:     new FmcMessage("UPLINK INSERT IN PROG", false, true),
    vToDisagree:            new FmcMessage("V1/VR/V2 DISAGREE", true, true),
    waitForSystemResponse:  new FmcMessage("WAIT FOR SYSTEM RESPONSE", false, false)
};

const SaltyFictionalMessages = {
    noSimBriefUser:         new FmcMessage("NO SIMBRIEF USER", false, false),
    noAirportSpecified:     new FmcMessage("NO AIRPORT SPECIFIED", false, false),
    fltNbrInUse:            new FmcMessage("FLT NBR IN USE", false, false),
    notYetImplemented:      new FmcMessage("NOT YET IMPLEMENTED", false, false),
    recipientNotFound:      new FmcMessage("RECIPIENT NOT FOUND", false, false),
    authErr:                new FmcMessage("AUTH ERR", false, false),
    invalidMsg:             new FmcMessage("INVALID MSG", false, false),
    unknownDownlinkErr:     new FmcMessage("UNKNOWN DOWNLINK ERR", false, false),
    telexNotEnabled:        new FmcMessage("TELEX NOT ENABLED", false, false),
    freeTextDisabled:       new FmcMessage("FREE TEXT DISABLED", false, false),
    freetextEnabled:        new FmcMessage("FREE TEXT ENABLED", false, false),
    enabledFltNbrInUse:     new FmcMessage("ENABLED. FLT NBR IN USE", false, false),
    noOriginApt:            new FmcMessage("NO ORIGIN AIRPORT", false, false),
    noOriginSet:            new FmcMessage("NO ORIGIN SET", false, false),
    secondIndexNotFound:    new FmcMessage("2ND INDEX NOT FOUND", false, false),
    firstIndexNotFound:     new FmcMessage("1ST INDEX NOT FOUND", false, false),
    noRefWpt:               new FmcMessage("NO REF WAYPOINT", false, false),
    noWptInfos:             new FmcMessage("NO WAYPOINT INFOS", false, false),
    emptyMessage:           new FmcMessage(""),
    reloadPlaneApply:       new FmcMessage("RELOAD A/C TO APPLY", true, true)
};
