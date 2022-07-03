import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { PFDSimvars } from "../SimVarPublisher";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";

export class VerticalSpeedIndicator extends DisplayComponent<{ bus: EventBus }> {
    private bgVisibility = Subject.create("visible");
    private indicatorVisibility = Subject.create("visible");
    private indicatorLineD = Subject.create("");
    private textRef = FSComponent.createRef<SVGTextElement>();

    public static fpmToPixels(fpm: number) {
        const seg1 = 0.08 * Math.min(Math.abs(fpm), 1000);
        const seg2 = 0.06 * Math.min(Math.max(Math.abs(fpm) - 1000, 0), 1000);
        const seg3 = 0.01 * Math.max(Math.abs(fpm) - 2000, 0);
        const pixels = fpm > 6000 || fpm < -6000 ? 180 : seg1 + seg2 + seg3;
        return fpm > 0 ? -pixels : pixels;
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("irsState")
            .whenChanged()
            .handle((state) => {
                this.bgVisibility.set(state >= 1 ? "visible" : "hidden");
                this.indicatorVisibility.set(state >= 2 ? "visible" : "hidden");
            });

        sub.on("verticalSpeed")
            .withPrecision(0)
            .handle((vs) => {
                this.indicatorLineD.set(`M 825 381, l -73 ${VerticalSpeedIndicator.fpmToPixels(vs)}`);
                this.textRef.instance.setAttribute("y", `${vs > 0 ? 170 - 7.33 : 630 - 7.33}`);
                this.textRef.instance.style.visibility = Math.abs(vs) > 400 ? "visible" : "hidden";
                this.textRef.instance.innerHTML = (Math.abs(vs) > 9975 ? 9999 : Math.round(Math.abs(Math.round(vs)) / 50) * 50).toString();
            });
    }

    public render(): VNode {
        return (
            <g>
                <path
                    class="gray-bg"
                    d="M 723 184 h 35 l 34 97 v 200 l -34 97 h -35 v -130 l 20 -10 v -114 l -20 -10 Z"
                    visibility={this.bgVisibility}
                />

                <g visibility={this.indicatorVisibility}>
                    <VSIScale />
                    <BlackOutlineLine d={this.indicatorLineD} whiteStroke={5} blackStroke={6} />
                    <SelectedVSBug bus={this.props.bus} />
                    <text x={785} class="text-3" ref={this.textRef} />
                </g>

                <rect x={792} y={290} width={9} height={190} fill="black" />
            </g>
        );
    }
}

class SelectedVSBug extends DisplayComponent<{ bus: EventBus }> {
    private visibility = Subject.create("hidden");
    private transform = Subject.create("");

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("vsActive")
            .whenChanged()
            .handle((active) => this.visibility.set(active ? "visible" : "hidden"));

        // mjøøød det daglige brød
        sub.on("selectedVs")
            .withPrecision(0)
            .handle((vs) => this.transform.set(`translate(0 ${VerticalSpeedIndicator.fpmToPixels(vs)})`));
    }

    public render(): VNode {
        return (
            <g transform={this.transform} visibility={this.visibility}>
                <BlackOutlineLine d="M 749 383 h 14" color="#d570ff" />
                <BlackOutlineLine d="M 749 379 h 14" color="#d570ff" />
            </g>
        );
    }
}

class VSIScale extends DisplayComponent<any> {
    public render(): VNode {
        return (
            <g>
                <g transform="translate(740.5 209.33)">
                    <text x={0} y={0} class="text-2" fill-opacity={0.9} letter-spacing={1.2}>
                        6
                    </text>
                    <text x={0} y={40} class="text-2" fill-opacity={0.9} letter-spacing={1.2}>
                        2
                    </text>
                    <text x={0} y={100} class="text-2" fill-opacity={0.9} letter-spacing={1.2}>
                        1
                    </text>
                    <text x={0} y={260} class="text-2" fill-opacity={0.9} letter-spacing={1.2}>
                        1
                    </text>
                    <text x={0} y={320} class="text-2" fill-opacity={0.9} letter-spacing={1.2}>
                        2
                    </text>
                    <text x={0} y={360} class="text-2" fill-opacity={0.9} letter-spacing={1.2}>
                        6
                    </text>
                </g>

                <BlackOutlineLine d="M 743 201, h 8" whiteStroke={4} blackStroke={5} />
                <BlackOutlineLine d="M 743 221, h 8" />
                <BlackOutlineLine d="M 743 241, h 8" whiteStroke={4} blackStroke={5} />
                <BlackOutlineLine d="M 743 271, h 8" />
                <BlackOutlineLine d="M 743 301, h 8" whiteStroke={4} blackStroke={5} />
                <BlackOutlineLine d="M 743 341, h 8" />
                <BlackOutlineLine d="M 743 381, h 18" whiteStroke={4} blackStroke={5} />
                <BlackOutlineLine d="M 743 421, h 8" />
                <BlackOutlineLine d="M 743 461, h 8" whiteStroke={4} blackStroke={5} />
                <BlackOutlineLine d="M 743 491, h 8" />
                <BlackOutlineLine d="M 743 521, h 8" whiteStroke={4} blackStroke={5} />
                <BlackOutlineLine d="M 743 541, h 8" />
                <BlackOutlineLine d="M 743 561, h 8" whiteStroke={4} blackStroke={5} />
            </g>
        );
    }
}
