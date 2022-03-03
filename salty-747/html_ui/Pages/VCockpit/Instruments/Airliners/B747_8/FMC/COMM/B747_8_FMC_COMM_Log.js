class FMC_COMM_Log {
    static ShowPage(fmc, messages = null, offset = 5) {
        fmc.activeSystem = "DLNK";
        if (!messages) {
            messages = fmc.getMessages();
        }
        fmc.clearDisplay();

        const msgTimeHeaders = [];
        msgTimeHeaders.length = 6;
        for (let i = 5; i > 0; i--) {
            let header = "";
            if (messages[offset - i]) {
                header += messages[offset - i]["time"];
                if (messages[offset - i]["opened"]) {
                    header += "[s-text]";
                } else {
                    header += "";
                }
            }
            msgTimeHeaders[i] = header;
        }
        let lines = [];
        if (messages[offset - 5]) {
            lines.push("<" + messages[offset - 5]["time"] + "Z\xa0" + messages[offset - 5]["type"]);
        } else {
            lines.push("NO MESSAGES RECEIVED");
        }
        if (messages[offset - 4]) {
            lines.push("<" + messages[offset - 4]["time"] + "Z\xa0" + messages[offset - 4]["type"]);
        }
        if (messages[offset - 3]) {
            lines.push("<" + messages[offset - 3]["time"] + "Z\xa0" + messages[offset - 3]["type"]);
        }
        if (messages[offset - 2]) {
            lines.push("<" + messages[offset - 2]["time"] + "Z\xa0" + messages[offset - 2]["type"]);
        }
        if (messages[offset - 1]) {
            lines.push("<" + messages[offset - 1]["time"] + "Z\xa0" + messages[offset - 1]["type"]);
        }

        fmc.setTemplate([
            ["RECEIVED MESSAGES", "1", "2"],
            ["", ""],
            [`${lines[0]}`, ""],
            ["", ""],
            [`${lines[1] ? lines[1] : ""}`, ""],
            ["", ""],
            [`${lines[2] ? lines[2] : ""}`, ""],
            ["", ""],
            [`${lines[3] ? lines[3] : ""}`, ""],
            ["", ""],
            [`${lines[4] ? lines[4] : ""}`, ""],
            ["\xa0ACARS", ""],
            ["<INDEX", `${messages[offset - 5] ? "ERASE MESSAGES>" : ""}`]
        ]);

        /* LSK1 */
        fmc.onLeftInput[0] = (value) => {
            if (messages[offset - 5]) {
                FMC_COMM_Message.ShowPage(fmc, messages[offset - 5]);
            }
        };

        /* LSK2 */
        fmc.onLeftInput[1] = (value) => {
            if (messages[offset - 4]) {
                FMC_COMM_Message.ShowPage(fmc, messages[offset - 4]);
            }
        };

        /* LSK3 */
        fmc.onLeftInput[2] = (value) => {
            if (messages[offset - 3]) {
                FMC_COMM_Message.ShowPage(fmc, messages[offset - 3]);
            }
        };

        /* LSK4 */
        fmc.onLeftInput[3] = (value) => {
            if (messages[offset - 2]) {
                FMC_COMM_Message.ShowPage(fmc, messages[offset - 2]);
            }
        };

        /* LSK5 */
        fmc.onLeftInput[4] = (value) => {
            if (messages[offset - 1]) {
                FMC_COMM_Message.ShowPage(fmc, messages[offset - 1]);
            }
        };

        /* LSK6 */
        fmc.onLeftInput[5] = () => {
            FMC_COMM_Index.ShowPage(fmc);
        }

        /* RSK6 */
        fmc.onRightInput[5] = () => {
            fmc.messages = [];
            FMC_COMM_Log.ShowPage(fmc);
        }
    }
}