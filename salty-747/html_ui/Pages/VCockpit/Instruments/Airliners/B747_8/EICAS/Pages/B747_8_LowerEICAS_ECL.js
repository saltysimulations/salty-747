var B747_8_LowerEICAS_ECL;
(function (B747_8_LowerEICAS_ECL) {
    class Display extends Airliners.EICASTemplateElement {
        constructor() {
            super();
            this.isInitialised = false;
            this.eclIsLoaded = false;
            this.checklistData = [];
            this.eclDatabaseFile = "/ECL/ECLTest.json";
            let loadNormalChecklists = () => {
                if (!this.eclIsLoaded) {
                    this.loadfromJSON(this.eclDatabaseFile, () => {
                        this.eclIsLoaded = true;
                    });
                }
                else {
                    setTimeout(loadNormalChecklists, 200);
                }
            };
            loadNormalChecklists();
        }
        get templateID() { return "B747_8LowerEICASECLTemplate" }
        connectedCallback() {
            super.connectedCallback();
            TemplateElement.call(this, this.init.bind(this));
        }
        init() {
            this.isInitialised = true;
            this.buildChecklist();
            fetch("./ECL/ECLTest.json").then(d => d.json()).then(data => console.log(data['checklistTitle'])).catch(err => console.log(err));
            console.log("ECL IS LOADED");
        }
        update(_deltaTime) {
            if (!this.eclIsLoaded) {
                return;
            }
            //console.log("ECL IS LOADED");
            //console.log(this.checklistData['checklistTitle'])
        }
        buildChecklist() {

        }
        loadfromJSON(path, callback) {
            /*let request = new XMLHttpRequest();
            request.overrideMimeType("application/json");
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        this.checklistData = request.response;
                        console.log(data['checklistTitle']);
                    }
                    if (callback) {
                        callback();
                    }
                }
            };
            request.open("GET", this.eclDatabaseFile);
            request.send();*/
        }
    }B747_8_LowerEICAS_ECL.Display = Display;
})(B747_8_LowerEICAS_ECL || (B747_8_LowerEICAS_ECL = {}));
customElements.define("b747-8-lower-eicas-ecl", B747_8_LowerEICAS_ECL.Display);
//# sourceMappingURL=B747_8_LowerEICAS_ECL.js.map 