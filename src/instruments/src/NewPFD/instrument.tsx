import { FSComponent, EventBus } from "msfssdk";
import { PFD } from "./PFD";
import { PFDSimvarPublisher } from "./SimVarPublisher";

import "./index.scss";

class MyInstrument extends BaseInstrument {
    private bus: EventBus;
    private simVarPublisher: PFDSimvarPublisher;

    constructor() {
        super();
        this.bus = new EventBus();
        this.simVarPublisher = new PFDSimvarPublisher(this.bus);
    }

    get templateID(): string {
        return "pfd";
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.simVarPublisher.startPublish();

        FSComponent.render(<PFD bus={this.bus} />, document.getElementById("InstrumentContent"));
    }

    public Update(): void {
        this.simVarPublisher.onUpdate();
    }
}
registerInstrument("salty-pfd", MyInstrument);
