import { FSComponent, EventBus, HEventPublisher } from "msfssdk";
import { PFD } from "./PFD";
import { PFDSimvarPublisher } from "./SimVarPublisher";

import "./index.scss";

class MyInstrument extends BaseInstrument {
    private bus: EventBus;
    private simVarPublisher: PFDSimvarPublisher;
    private hEventPublisher: HEventPublisher;

    constructor() {
        super();
        this.bus = new EventBus();
        this.simVarPublisher = new PFDSimvarPublisher(this.bus);
        this.hEventPublisher = new HEventPublisher(this.bus);
    }

    get templateID(): string {
        return "pfd";
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.simVarPublisher.startPublish();
        this.hEventPublisher.startPublish();

        FSComponent.render(<PFD bus={this.bus} />, document.getElementById("InstrumentContent"));
    }

    public onInteractionEvent(args: string[]): void {
        this.hEventPublisher.dispatchHEvent(args[0]);
    }

    public Update(): void {
        this.simVarPublisher.onUpdate();
    }
}
registerInstrument("salty-pfd", MyInstrument);