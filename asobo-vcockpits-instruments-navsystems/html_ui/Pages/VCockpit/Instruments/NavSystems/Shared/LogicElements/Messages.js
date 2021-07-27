class Message {
    SetAirspaceMessageType(_airspaceMsgType) {
        this.airspaceMessageType = _airspaceMsgType;
        switch (this.airspaceMessageType) {
            case 0:
                this.message = "";
                break;
            case 1:
                this.message = "Near airspace less than 2nm";
                break;
            case 2:
                this.message = "Airpsace ahead -- less than 10 minutes";
                break;
            case 3:
                this.message = "Airspace near and ahead";
                break;
            case 4:
                this.message = "Inside airspace";
                break;
        }
    }
}
class MessageList {
    constructor(_instrument) {
        this.newMessagesAlert = 0;
        this.instrument = _instrument;
        this.messages = [];
        this.newMessagesAlert = 0;
        this.batch = new SimVar.SimVarBatch("C:fs9gps:MessageItemsNumber", "C:fs9gps:MessageCurrentLine");
        this.batch.add("C:fs9gps:MessageCurrentType", "number", "number");
    }
    Update() {
        if (this.IsIdle()) {
            if (this.newMessagesAlert > 0) {
                this.newMessagesAlert -= this.instrument.deltaTime;
            }
            else {
                let hasNewMessages = (SimVar.GetSimVarValue("C:fs9gps:NewMessagesNumber", "number") > 0);
                if (hasNewMessages) {
                    this.loadState = 0;
                }
            }
        }
        if (!this.IsUpToDate()) {
            this.LoadData();
        }
    }
    hasNewMessages() {
        return this.newMessagesAlert > 0;
    }
    LoadData() {
        switch (this.loadState) {
            case 0:
                this.loadState++;
                SimVar.GetSimVarArrayValues(this.batch, function (_values) {
                    for (var i = 0; i < _values.length; i++) {
                        let message = new Message();
                        message.SetAirspaceMessageType(_values[i][0]);
                        this.messages.push(message);
                    }
                    if (this.messages.length > 5) {
                        this.messages.splice(0, this.messages.length - 5);
                    }
                    this.loadState++;
                }.bind(this));
                break;
            case 2:
                SimVar.SetSimVarValue("C:fs9gps:NewMessagesConfirm", "number", 0).then(function () {
                    this.newMessagesAlert = 10000;
                    this.loadState++;
                }.bind(this));
                break;
        }
    }
    IsUpToDate() {
        return this.loadState == 3;
    }
    IsIdle() {
        return (this.IsUpToDate() || this.loadState == 0);
    }
}
//# sourceMappingURL=Messages.js.map