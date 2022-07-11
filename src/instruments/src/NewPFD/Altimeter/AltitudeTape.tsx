import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";
import { PFDSimvars } from "../SimVarPublisher";

export class AltitudeTape extends DisplayComponent<{ bus: EventBus }> {
    private originElevation = 0;
    private destinationElevation = 0;
    private isHalfway = false;

    private transform = Subject.create("");
    private bgD = Subject.create("");

    private noTdzVisibility = Subject.create("hidden");
    private tdzVisibility = Subject.create("hidden");
    private tdzD = Subject.create("");

    private handleTdz() {
        const tdzUnavailable = this.originElevation === -1 && this.destinationElevation === -1;

        this.noTdzVisibility.set(tdzUnavailable ? "visible" : "hidden");
        this.tdzVisibility.set(tdzUnavailable ? "hidden" : "visible");
        this.tdzD.set(`M 550 ${
            382 + (this.isHalfway ? this.destinationElevation : this.originElevation) * -0.68
        }, h 100, m -5 0, l 5 5, m -5 -5, m -10.6 0, l 18 18,
            m-18 -18, m-10.6 0, l 28 28, m-28 -28, m-10.6 0, l38 38, m-38 -38,
            m-10.6 0, l38 38, m-38 -38, m-10.6 0, l38 38, m-38 -38, m-10.6 0,
            l38 38, m-38 -38, m-10.6 0, l38 38, m-38 -38, m-10.6 0, l38 38, m-38 -38,
            m-10.6 0, l38 38, m-10.6 0, l-27.5 -27.5, m0 10.6, l16.75 16.75`);
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("altitude")
            .withPrecision(0)
            .handle((altitude) => {
                this.transform.set(`translate(50 ${altitude * 0.68})`);
                this.bgD.set(`M 567 ${332 - altitude * 0.68}, h 73, v 100, h -73, Z`);
            });

        sub.on("originElevation")
            .whenChanged()
            .handle((elevation) => {
                this.originElevation = elevation;
                this.handleTdz();
            });

        sub.on("destinationElevation")
            .whenChanged()
            .handle((elevation) => {
                this.destinationElevation = elevation;
                this.handleTdz();
            });

        sub.on("passedHalfway")
            .whenChanged()
            .handle((halfway) => {
                this.isHalfway = halfway;
                this.handleTdz();
            });
    }

    // TODO: make 500 feet lines shorter
    public render(): VNode {
        const lineStyle = "stroke-linejoin: miter; stroke-linecap: butt; paint-order: stroke;";

        return (
            <g>
                <clipPath id="altitudetape-clip">
                    <path d="M575 100, h125, v560, h-125 Z" />
                </clipPath>

                <g clip-path="url(#altitudetape-clip)">
                    <g transform={this.transform}>
                        {Array.from({ length: 501 }, (_, i) => (
                            <BlackOutlineLine
                                d={`${(i * 200) % 500 === 0 ? "M540" : "M550"} ${i * -68 + 382}, ${(i * 200) % 500 === 0 ? "h25" : "h15"}`}
                                whiteStroke={(i * 200) % 500 === 0 ? 8 : 3}
                                blackStroke={(i * 200) % 500 === 0 ? 10 : 5}
                                styleColor={lineStyle}
                                styleBlack={lineStyle}
                            />
                        ))}
                        {Array.from({ length: 9 }, (_, i) => (
                            <BlackOutlineLine
                                d={`${(i * 200) % 500 === 0 ? "M540" : "M550"} ${i * 68 + 382}, ${(i * 200) % 500 === 0 ? "h25" : "h15"}`}
                                whiteStroke={(i * 200) % 500 === 0 ? 8 : 3}
                                blackStroke={(i * 200) % 500 === 0 ? 10 : 5}
                                styleColor={lineStyle}
                                styleBlack={lineStyle}
                            />
                        ))}
                        {Array.from({ length: 51 }, (_, i) => (
                            <>
                                <BlackOutlineLine d={`M570 ${i * -680 + 365}, h79`} whiteStroke={4} blackStroke={5} />
                                <BlackOutlineLine d={`M570 ${i * -680 + 365 + 34}, h79`} whiteStroke={4} blackStroke={5} />
                            </>
                        ))}
                        {Array.from({ length: 251 }, (_, i) => {
                            const y = i * -136 + 382 + 11;
                            const text = (i * 200).toFixed(0);
                            const hundredsText = text.substring(text.length - 3);
                            let thousandsText = text.substring(0, 2);
                            if (i < 5) {
                                thousandsText = "";
                            } else if (i < 50) {
                                thousandsText = text.substring(0, 1);
                            }
                            return (
                                <>
                                    <text x="640" y={y} class="text-2" fill-opacity={0.9}>
                                        {hundredsText}
                                    </text>
                                    <text x="603" y={y} class="text-3" fill-opacity={0.9}>
                                        {thousandsText}
                                    </text>
                                </>
                            );
                        })}
                        {Array.from({ length: 5 }, (_, i) => {
                            const text = (i * 200).toFixed(0);
                            return (
                                <text x="638" y={i * 136 + 382 + 11} class="text-2" fill-opacity={0.85}>
                                    {i === 0 ? "" : `-${text.substring(text.length - 3)}`}
                                </text>
                            );
                        })}

                        <path class="gray-bg" d={this.bgD} />

                        <g visibility={this.tdzVisibility}>
                            <BlackOutlineLine d={this.tdzD} color="#ffc400" blackStroke={5} />
                        </g>
                    </g>
                </g>

                <g visibility={this.noTdzVisibility}>
                    <text x="722" y="645" class="text-2 amber start">
                        NO
                    </text>
                    <text x="722" y="666" class="text-2 amber start">
                        TDZ
                    </text>
                </g>
            </g>
        );
    }
}
