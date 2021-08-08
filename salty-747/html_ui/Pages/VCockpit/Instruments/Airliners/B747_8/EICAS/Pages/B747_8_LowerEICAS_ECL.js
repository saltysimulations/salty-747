var B747_8_LowerEICAS_ECL;
(function (B747_8_LowerEICAS_ECL) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
            this.normalChecklistSequence = 0;
            this.cursorPosition = 0;
        }
        get templateID() { return "B747_8LowerEICASECLTemplate" }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            this.isInitialised = true;
            this.buildChecklist(this.normalChecklistSequence);

        }
        onEvent(_event) {
            super.onEvent(_event);
        }
        update(_deltaTime) {
            if (!this.eclIsLoaded) {
                return;
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
        buildChecklist(sequence) {
            this.clearChecklist();
            this.buildTitle(sequence);
            this.buildBody(sequence);
        }
        buildTitle(sequence) {
            let title = this.querySelector("#title-text");
            title.textContent = "\u00BB" + normalChecklists[sequence].checklistTitle + "\u00AB";
        }
        buildBody(sequence) {
            for (let i = 0; i < normalChecklists[sequence].items.length; i++) {
                this.buildItem(normalChecklists[sequence].items[i], i);
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
    }B747_8_LowerEICAS_ECL.Display = Display;
})(B747_8_LowerEICAS_ECL || (B747_8_LowerEICAS_ECL = {}));
customElements.define("b747-8-lower-eicas-ecl", B747_8_LowerEICAS_ECL.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL.js.map 