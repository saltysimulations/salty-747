import { FSComponent, DisplayComponent, VNode, ComponentProps, EventBus } from "msfssdk";
import { PFDSimvars } from "../SimVarPublisher";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";

export class Horizon extends DisplayComponent<{ bus: EventBus }> {
    private horizonGroup = FSComponent.createRef<SVGGElement>();

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("pitch")
            .whenChanged()
            .handle((pitch) => {
                this.horizonGroup.instance.style.transform = `translate(0px, -18px) translate(0px, ${(-Math.round(pitch * 10) / 10) * 8}px)`;
            });

        sub.on("roll")
            .whenChanged()
            .handle((roll) => (this.horizonGroup.instance.style.transform += ` rotate(${Math.round(roll * 10) / 10}deg)`));
    }

    public render(): VNode {
        return (
            <g>
                <g>
                    <clipPath id="ah-clip">
                        <path d="M156 350, h30, v-40 c 83 -115 243 -115 323 0, v40, h30, v280, h-383 Z" />
                    </clipPath>

                    <g ref={this.horizonGroup} class="horizon-group">
                        <rect x={0} y={-800} width={800} height={1200} fill="#1469BC" />
                        <rect x={0} y={400} width={800} height={1200} fill="#764D17" />
                        <rect x={0} y={397.5} width={800} height={4} fill="#fff" stroke="black" stroke-width="1" />
                        <g clipPath="url(#ah-clip)" transform="translate(349, 400)">
                            <GraduationLines />
                        </g>
                    </g>
                </g>
                <path d="M0 0, h799, v410 h-260 v-190 a-44,44 -44 0, 0 -44,-44 l-295,0 a-44,44 -44 0, 0 -44,44 v190, H0 Z" />
                <path d="M156 410 v123 a-44,44 -44 0, 0 44,44 h295, a-44,44 -44 0, 0 44,-44 v-123 H800 L800, 800, H0, V410 Z" />
            </g>
        );
    }
}

class GraduationLines extends DisplayComponent<any> {
    private indexToGraduationLineType(i: number): GraduationLineType {
        if (i == 0) return "invisible";
        else if (i % 4 == 0) return "large";
        else if (!(i % 2 == 0)) return "small";
        else return "half-size";
    }

    public render(): VNode {
        return (
            <>
                {Array.from({ length: 37 }, (_, i) => {
                    const number = ((i + 1) / 4) * 10 - 2.5;
                    return (
                        <>
                            <GraduationLine type={this.indexToGraduationLineType(i)} y={i * 20} text={number} />
                            <GraduationLine type={this.indexToGraduationLineType(i)} y={i * -20} text={number} />
                        </>
                    );
                })}
            </>
        );
    }
}

type GraduationLineType = "large" | "half-size" | "small" | "invisible";
interface GraduationLineProps extends ComponentProps {
    type: GraduationLineType;
    y: number;
    text?: number;
}

class GraduationLine extends DisplayComponent<GraduationLineProps> {
    private getLine(length: number): VNode {
        const style = `transform: translate(-${length / 2}px, ${this.props.y}px); stroke-linejoin: round;`;

        return <BlackOutlineLine d={`M0 0,h${length}`} blackStroke={5} styleColor={`${style} opacity: 0.9;`} styleBlack={style} />;
    }

    public render(): VNode {
        switch (this.props.type) {
            case "large":
                return (
                    <>
                        {this.getLine(164)}
                        <text fillOpacity={0.9} class="text-2" x={-88} y={this.props.y + 8.5}>
                            {this.props.text?.toString()}
                        </text>
                        <text fillOpacity={0.9} class="text-2" x={109} y={this.props.y + 8.5}>
                            {this.props.text?.toString()}
                        </text>
                    </>
                );
            case "half-size":
                return this.getLine(82);
            case "small":
                return this.getLine(41);
            default:
                return <></>;
        }
    }
}
