class FMC_ATC_Log {
    static ShowPage(fmc) {
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();

        for (const msg of fmc.messages) {
            console.log(msg);
        }

        fmc.setTemplate([
            ["ATC LOG", "1", "2"],
            ["1658Z", "OPEN"],
            ["↑ CLIMB TO AND MAINTA..", ">"],
            ["1648Z", "RESPONSE RCVD"],
            ["↓ REQUEST CLIMB TO FL", ">"],
            ["1630Z", "RESPONSE RCVD"],
            ["↓ REQUEST CLIMB TO FL..", ">"],
            ["1619Z", "SENT"],
            ["↓ PRESENT POSITION N4..", ">"],
            ["1618Z", "OLD"],
            ["↑ CONFIRM POSITION", ">"],
            ["", "", "__FMCSEPARATOR"],
            ["<ATC INDEX", "ERASE LOG>"]
        ]);

        fmc.onLeftInput[5] = () => {
            FMC_ATC_Index.ShowPage(fmc);
        }
    }
}