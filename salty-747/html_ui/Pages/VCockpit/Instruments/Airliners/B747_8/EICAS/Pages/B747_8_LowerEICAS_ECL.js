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
            this.normalChecklistSequence = 0;
            this.cursorPosition = 0;
            this.cursor = document.querySelector("#maincursor");
            this.maxCursorIndex = this.getMaxCursorIndex();
            this.buildChecklist();
            this.isInitialised = true;
            this.eventTimeout = 0;
        }
        onEvent(_event) {
            super.onEvent(_event);
            setTimeout(() => {
                this.eventTimeout = 0;
            }, 100);
            if (this.eventTimeout == 0) {
                if (_event === "ECL_KNOB_FWD" && this.cursorPosition < this.maxCursorIndex - 1) {
                    this.cursorPosition ++;
                    this.updateCursor();
                    console.log("ECL FWD!" + this.cursorPosition + " " + this.maxCursorIndex);
                } 
                else if (_event === "ECL_KNOB_BACK" && this.cursorPosition != 0) {
                    this.cursorPosition --;
                    this.updateCursor();
                    console.log("ECL BACK!");
                }
                else if (_event === "ECL_SEL_PUSH") {
                    console.log("ECL PUSHED!");
                }
                this.eventTimeout = 1;
            }
        }
        update(_deltaTime) {

        }
        updateCursor() {
            this.cursor.setAttribute("x", cursorMap[this.cursorPosition * 2]);
            this.cursor.setAttribute("y", cursorMap[(this.cursorPosition * 2) + 1]);
            console.log("x:" + cursorMap[this.cursorPosition * 2] + " y:" + cursorMap[(this.cursorPosition * 2) + 1])
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
        clearChecklist() {
            for (let i = 0; i < 8; i++) {
                let text = this.querySelector("#item" + i + "-text");
                let box = this.querySelector("#box" + i);
                text.style.visibility = "hidden";
                box.style.visibility = "hidden";
            }
        }
        buildChecklist() {
            this.buildCursorMap();
            this.clearChecklist();
            this.buildTitle();
            this.buildBody();
        }
        buildTitle() {
            let title = this.querySelector("#title-text");
            title.textContent = "\u00BB" + normalChecklists[this.normalChecklistSequence].checklistTitle + "\u00AB";
        }
        buildBody() {
            for (let i = 0; i < normalChecklists[this.normalChecklistSequence].items.length; i++) {
                this.buildItem(normalChecklists[this.normalChecklistSequence].items[i], i);
            }
        }
        buildItem(item, i) {
            let text = this.querySelector("#item" + i + "-text");
            let box = this.querySelector("#box" + i);
            text.setAttribute("x", "11%");
            text.setAttribute("y", item.y);
            text.textContent = item.name;
            text.style.visibility = "visible";
            if (item.conditionType === "open") {
                box.setAttribute("x", "2%");
                box.setAttribute("y", item.y - 27);
                box.style.visibility = "visible";
            }
            else {
                box.style.visibility = "hidden";
            }
        }
        buildCursorMap() {
            let itemsCoords = [];
            for (let i = 0; i < normalChecklists[this.normalChecklistSequence].items.length; i++) {
                itemsCoords.splice(i, 0, 5);
            }
            for (let i = 0; i < normalChecklists[this.normalChecklistSequence].items.length; i++) {
                itemsCoords.splice(i * 2 + 1, 0, normalChecklists[this.normalChecklistSequence].items[i].y - 28);
            }
            cursorMap = cursorPosTop.concat(itemsCoords.concat(cursorPosBottom));
            for (let i = 0; i < cursorMap.length; i++) {
                console.log(cursorMap[i]);
            }           
        }
        getMaxCursorIndex() {
            return 3 + normalChecklists[this.normalChecklistSequence].itemCount + 6;
        }
    }B747_8_LowerEICAS_ECL.Display = Display;
})(B747_8_LowerEICAS_ECL || (B747_8_LowerEICAS_ECL = {}));
customElements.define("b747-8-lower-eicas-ecl", B747_8_LowerEICAS_ECL.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL.js.map 