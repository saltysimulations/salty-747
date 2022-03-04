class FMC_COMM_Message {
    static ShowPage(fmc, message, offset = 0, store = {currPage: 1}) {
        fmc.activeSystem = "DLNK";
        fmc.clearDisplay();
        const lines = message["content"];
        if (!message["opened"]) {
            let timeValue = SimVar.GetGlobalVarValue("ZULU TIME", "seconds");
            if (timeValue) {
                const seconds = Number.parseInt(timeValue);
                const displayTime = Utils.SecondsToDisplayTime(seconds, true, true, false);
                timeValue = displayTime.toString();
            }
            message["opened"] = timeValue.substring(0, 5);
            const cMsgCnt = SimVar.GetSimVarValue("L:SALTY_747_COMPANY_MSG_COUNT", "Number");
            SimVar.SetSimVarValue("L:SALTY_747_COMPANY_MSG_COUNT", "Number", cMsgCnt <= 1 ? 0 : cMsgCnt - 1);
        }

        const currentMesssageIndex = fmc.getMessageIndex(message["id"]);
        const currentMesssageCount = currentMesssageIndex + 1;
        const msgArrows = fmc.messages.length > 1 ? " {}" : "";
        let totalPages = Math.ceil((lines.length) / 10);

        fmc.setTemplate([
            ["ACARS MESSAGE", `${store.currPage}`, `${totalPages}`],
            [`{small}${lines[offset] ? lines[offset] : ""}`],
            [`{small}${lines[offset + 1] ? lines[offset + 1] : ""}`],
            [`{small}${lines[offset + 2] ? lines[offset + 2] : ""}`],
            [`{small}${lines[offset + 3] ? lines[offset + 3] : ""}`],
            [`{small}${lines[offset + 4] ? lines[offset + 4] : ""}`],
            [`{small}${lines[offset + 5] ? lines[offset + 5] : ""}`],
            [`{small}${lines[offset + 6] ? lines[offset + 6] : ""}`],
            [`{small}${lines[offset + 7] ? lines[offset + 7] : ""}`],
            [`{small}${lines[offset + 8] ? lines[offset + 8] : ""}`],
            [`{small}${lines[offset + 9] ? lines[offset + 9] : ""}`],
            ["\xa0RETURN TO", ""],
            ["<MESSAGES", ""]
        ]);

        if (lines.length > 9) {
            fmc.onPrevPage = () => {
                if (lines[offset - 10]) {
                    offset -= 10;
                    console.log(offset) ;
                    store.currPage = store.currPage - 1;
                }
                FMC_COMM_Message.ShowPage(fmc, message, offset, store);
            };
            fmc.onNextPage = () => {
                if (lines[offset + 10]) {
                    offset += 10;
                    console.log(offset) ;
                    store.currPage = store.currPage + 1;
                }
                FMC_COMM_Message.ShowPage(fmc, message, offset, store);
            };
        }

        fmc.onLeftInput[5] = () => {
            FMC_COMM_Log.ShowPage(fmc);
        }
    }
}