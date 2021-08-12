var B747_8_LowerEICAS_ECL;
(function (B747_8_LowerEICAS_ECL) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
        }
        get templateID() { return "B747_8LowerEICASECLTemplate" }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            this.checklistItems = [];
            this.nextChecklistIsPending = false;
            this.normalChecklistSequence = 0;
            this.cursorPosition = 3;
            this.cursor = document.querySelector("#maincursor");
            this.nextItemPosition = 3;
            this.nextItemBox = document.querySelector("#currentBox");
            this.completeGroup = document.querySelector("#checklist-complete");
            this.maxCursorIndex = 0;
            this.cursorHasJumped = false;
            this.buildChecklist();
            this.eventTimeout = 0;
            this.isInitialised = true;
        }
        //Event Handler for Cursor Control - 100ms timeout to limit cursor scroll rate caused by duplicate events.
        onEvent(_event) {
            super.onEvent(_event);
            setTimeout(() => {
                this.eventTimeout = 0;
            }, 100);
            if (this.eventTimeout == 0) {
                if (_event === "EICAS_CHANGE_PAGE_chkl" && this.nextChecklistIsPending === true) {
                    this.nextChecklistIsPending = false;
                    SimVar.SetSimVarValue("H:B747_8_EICAS_2_EICAS_CHANGE_PAGE_chkl", "bool", 1);
                    setTimeout(() => {
                        this.normalChecklistSequence ++;
                        this.buildChecklist();
                        this.update();
                        this.cursorPosition = this.nextItemPosition;
                        this.updateCursor();
                    }, 100);
                }
                else if (_event === "ECL_KNOB_FWD" && this.cursorPosition < this.maxCursorIndex - 1) {
                    this.cursorPosition ++;
                    this.updateCursor();
                } 
                else if (_event === "ECL_KNOB_BACK" && this.cursorPosition != 0) {
                    this.cursorPosition --;
                    this.updateCursor();
                }
                else if (_event === "ECL_SEL_PUSH") {
                    let cursorTarget = this.getCursorTarget();
                    if (this.cursorPosition === this.getMaxCursorIndex() - 5) {
                        this.itemOverride();
                    }
                    else if (cursorTarget != -1) {
                        this.toggleItem(cursorTarget);
                    }
                }
                this.eventTimeout = 1;
            }
        }
        //Main update loop controls UI elements based on checklist item completion state.
        update(_deltaTime) {
            this.updateClosedLoopItems();
            this.updateChecklistStatus();
            this.updateNextLineItem();
            for (let i = 0; i < normalChecklists[this.normalChecklistSequence].items.length; i++) {
                let text = document.querySelector("#item" + i + "-text");
                let tick = document.querySelector("#tick" + i);
                if (this.checklistItems[i].status == "checked") {
                    text.style.fill = "lime";
                    tick.style.visibility = "visible";
                }
                else if (this.checklistItems[i].status == "overridden") {
                    text.style.fill = "cyan";
                    tick.style.visibility = "visible";
                }
                else {
                    text.style.fill = "white";
                    tick.style.visibility = "hidden";
                }
            }
        }
        //Iterates through current closed loop checklist items and updates state to match if Simvar conditions met or not.
        updateClosedLoopItems() {
            let conditionsSatCounter = [];
            let conditionsTargetNum = [];
            for (let i = 0; i < this.checklistItems.length; i++) {
                conditionsSatCounter[i] = 0;
                if (this.checklistItems[i].conditionType === "closed") {
                    for (let j = 0; j < this.checklistItems[i].conditions.length; j++) {
                        conditionsTargetNum[i] = this.checklistItems[i].conditions.length;
                        if (SimVar.GetSimVarValue(this.checklistItems[i].conditions[j].simvar, this.checklistItems[i].conditions[j].simvarType) === this.checklistItems[i].conditions[j].simvarTrueCondition) {
                            conditionsSatCounter[i] ++;
                        }
                        if (this.checklistItems[i].status === "overridden") {

                        }
                        else if (conditionsSatCounter[i] === conditionsTargetNum[i]) {
                            this.checklistItems[i].status = "checked";
                        }
                        else {
                            this.checklistItems[i].status = "pending";
                        }
                    }
                }
            }
        }
        updateChecklistStatus() {
            let completeItemsCounter = 0;
            for (let i = 0; i < normalChecklists[this.normalChecklistSequence].items.length; i++) {
                if (this.checklistItems[i].status === "checked" || this.checklistItems[i].status === "overridden") {
                    completeItemsCounter ++;
                }
            }
            if (completeItemsCounter === normalChecklists[this.normalChecklistSequence].itemCount) {
                this.completeGroup.style.visibility = "visible";
                this.nextChecklistIsPending = true;
                if (this.cursorHasJumped === false) {
                    this.cursorPosition = this.getMaxCursorIndex() - 6;
                    this.cursorHasJumped = true;
                    this.updateCursor();
                }
            }
            else {
                this.completeGroup.style.visibility = "hidden";
                this.nextChecklistIsPending = false;
                this.cursorHasJumped = false;
            }
        }
        //Updates position and size of cursor UI elements.
        updateCursor() {
            this.cursor.setAttribute("x", cursorMap[this.cursorPosition * 2]);
            this.cursor.setAttribute("y", cursorMap[(this.cursorPosition * 2) + 1]);
            if (this.cursorPosition > -1 && this.cursorPosition < 3) {
                this.cursor.setAttribute("width", cursorSizes.largeBox.width + "px");
                this.cursor.setAttribute("height", cursorSizes.largeBox.height + "px");
            }
            else if (this.cursorPosition <= this.maxCursorIndex && this.cursorPosition >= this.maxCursorIndex - 6) {
                this.cursor.setAttribute("width", cursorSizes.smallBox.width + "px");
                this.cursor.setAttribute("height", cursorSizes.smallBox.height + "px");
            }
            else {
                this.cursor.setAttribute("width", cursorSizes.items.width + "px");
                this.cursor.setAttribute("height", cursorSizes.items.height + "px");
            }
        }
        updateNextLineItem() {
            for (let i = 0; i < normalChecklists[this.normalChecklistSequence].items.length; i++) {
                if (this.checklistItems[i].status === "pending") {
                    this.nextItemPosition = i + 3;
                    this.nextItemBox.style.visibility = "visible";
                    break;
                }
                else {
                    this.nextItemPosition = -1;
                    this.nextItemBox.style.visibility = "hidden";
                }
            }
            if (this.nextItemPosition !== -1) {
                this.nextItemBox.setAttribute("y", cursorMap[(this.nextItemPosition * 2) + 1] + 4);
            }
        }
        //Clears display elements and main logic array.
        clearChecklist() {
            for (let i = 0; i < 8; i++) {
                let text = this.querySelector("#item" + i + "-text");
                let box = this.querySelector("#box" + i);
                let tick = this.querySelector("#tick" + i);
                text.style.visibility = "hidden";
                box.style.visibility = "hidden";
                tick.style.visibility = "hidden";
            }
            this.checklistItems = [];
            this.completeItemsCounter = 0;
            this.cursorHasJumped = false;
            SimVar.SetSimVarValue("L:SALTY_ECL_WAS_BLANKED", "bool", 0);
        }
        //Main checklist build function.
        buildChecklist() {
            this.clearChecklist();
            this.buildCursorMap();
            this.updateCursor();
            this.buildTitle();
            this.buildBody();
        }
        //Builds Checklist Title.
        buildTitle() {
            let title = this.querySelector("#title-text");
            title.textContent = "\u00BB" + normalChecklists[this.normalChecklistSequence].checklistTitle + "\u00AB";
        }
        //Iterates through each item on checklist and calls the build for each.
        buildBody() {
            for (let i = 0; i < normalChecklists[this.normalChecklistSequence].items.length; i++) {
                this.buildItem(normalChecklists[this.normalChecklistSequence].items[i], i);
            }
        }
        //Builds initial state and UI elements for individual checklist items.
        buildItem(item, i) {
            //Set Item state Properties and push to main logic array checklistItems.
            let lineItem = {};
            lineItem.status = "pending";
            lineItem.conditionType = item.conditionType;
            lineItem.conditions = [];
            if (lineItem.conditionType === "closed") {
                for (let j = 0; j < item.conditions.length; j++) {
                    lineItem.conditions[j] = item.conditions[j];
                }
            }
            else {
                lineItem.conditions[0] = "";
            }
            this.checklistItems.push(lineItem);

            //Create Item text.
            let text = this.querySelector("#item" + i + "-text");
            text.setAttribute("x", "9%");
            text.setAttribute("y", item.y);
            text.textContent = item.name;
            text.style.visibility = "visible";

            //Create Item grey box if closed loop.
            let box = this.querySelector("#box" + i);
            if (item.conditionType === "open") {
                box.setAttribute("x", "2%");
                box.setAttribute("y", item.y - 23);
                box.style.visibility = "visible";
            }
            else {
                box.style.visibility = "hidden";
            }
            //Create Item tick.
            let tick = this.querySelector("#tick" + i);
            tick.setAttribute("d", "M 18," + (item.y - 8) + "l 6.4 8 l 12.8 -16 l -1.6 -1.6 l -11.2 14.4 l -4.8 -6.4 Z");
        }
        //Builds an array from the currently loaded checklist of valid x/y coord positions for the cursor and sets upper bound.
        buildCursorMap() {
            let itemsCoords = [];
            for (let i = 0; i < normalChecklists[this.normalChecklistSequence].items.length; i++) {
                itemsCoords.splice(i, 0, 5);
            }
            for (let i = 0; i < normalChecklists[this.normalChecklistSequence].items.length; i++) {
                itemsCoords.splice(i * 2 + 1, 0, normalChecklists[this.normalChecklistSequence].items[i].y - 28);
            }
            cursorMap = cursorPosTop.concat(itemsCoords.concat(cursorPosBottom));
            this.maxCursorIndex = this.getMaxCursorIndex();
        }
        //Gets upper bound for cursor scrolling.
        getMaxCursorIndex() {
            return 3 + normalChecklists[this.normalChecklistSequence].itemCount + 6;
        }
        //Gets value corresponding to currently selected checklist line item.
        getCursorTarget() {
            if (this.cursorPosition > 2 && this.cursorPosition < this.maxCursorIndex - 6) {
                return this.cursorPosition - 3;
            }
            else {
                return -1;
            }
        }
        //Toggles open loop items between pending and checked states and pushes cursor to next unchecked item.
        toggleItem(cPos) {
            if (this.checklistItems[cPos].conditionType === "open") {
                if (this.checklistItems[cPos].status == "pending") {
                    this.checklistItems[cPos].status = "checked";
                    if (this.nextItemPosition !== -1) {
                        this.updateNextLineItem();
                        console.log(this.nextItemPosition)
                        if (this.cursorPosition < this.nextItemPosition) {
                            this.cursorPosition = this.nextItemPosition;
                        }
                    }
                    this.updateChecklistStatus();
                    if (this.nextChecklistIsPending === true) {
                        this.cursorPosition = this.getMaxCursorIndex() - 6;
                    }
                    this.updateCursor();
                }
                else {
                    this.checklistItems[cPos].status = "pending";
                }
            }
        }
        itemOverride() {
            if (this.nextItemPosition === -1) {
                return;
            }
            if (this.checklistItems[this.nextItemPosition - 3].status == "pending") {
                this.checklistItems[this.nextItemPosition - 3].status = "overridden";
            }
            else if (this.checklistItems[this.nextItemPosition - 3].status == "overridden") {
                this.checklistItems[this.nextItemPosition - 3].status = "pending";
            }
        }
    }B747_8_LowerEICAS_ECL.Display = Display;
})(B747_8_LowerEICAS_ECL || (B747_8_LowerEICAS_ECL = {}));
customElements.define("b747-8-lower-eicas-ecl", B747_8_LowerEICAS_ECL.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL.js.map 