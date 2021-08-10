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
            this.test = 0;
            this.normalChecklistSequence = 0;
            this.cursorPosition = 0;
            this.cursor = document.querySelector("#maincursor");
            this.maxCursorIndex = this.getMaxCursorIndex();
            this.buildChecklist();
            this.isInitialised = true;
        }
        onEvent(_event) {
            super.onEvent(_event);
            if (_event === "ECL_KNOB_FWD") {
                this.cursorPosition ++;
                this.test ++;
                this.updateCursor();
            } 
            else if (_event === "ECL_KNOB_BACK") {
                this.cursorPosition --;
                this.test --;
                this.updateCursor();
            }
            console.log(this.test)
        }
        update(_deltaTime) {

        }
        updateCursor() {
            this.cursor.setAttribute("x", cursorBoxCoords[this.cursorPosition * 2]);
            this.cursor.setAttribute("y", cursorBoxCoords[(this.cursorPosition * 2) + 1]);
            console.log("x:" + cursorBoxCoords[this.cursorPosition * 2] + "y:" + cursorBoxCoords[(this.cursorPosition * 2) + 1])
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
        getMaxCursorIndex() {
            return 3 + normalChecklists[this.normalChecklistSequence].itemCount + 6;
        }
    }B747_8_LowerEICAS_ECL.Display = Display;
})(B747_8_LowerEICAS_ECL || (B747_8_LowerEICAS_ECL = {}));
customElements.define("b747-8-lower-eicas-ecl", B747_8_LowerEICAS_ECL.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL.js.map 