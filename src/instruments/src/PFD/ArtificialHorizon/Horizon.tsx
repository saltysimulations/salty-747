/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, ComponentProps, EventBus, Subject } from "msfssdk";
import { PFDSimvars } from "../SimVarPublisher";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";
import { SlipIndicator } from "./SlipIndicator";
import { BankIndicator } from "./BankIndicator";
import { PitchLimitIndicator } from "./PitchLimitIndicator";
import { FlightDirector } from "./FlightDirector";
import { FlightPathVector } from "./FlightPathVector";
import { MarkerBeacon } from "./MarkerBeacon";

export class Horizon extends DisplayComponent<{ bus: EventBus }> {
    private horizonPitchGroup = FSComponent.createRef<SVGGElement>();
    private horizonRollGroup = FSComponent.createRef<SVGGElement>();
    private clipRef = FSComponent.createRef<SVGClipPathElement>();

    private horizonVisibility = Subject.create("visible");
    private horizonFailVisibility = Subject.create("hidden");

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("pitch")
            .withPrecision(2)
            .handle((pitch) => {
                this.horizonPitchGroup.instance.style.transform = `translate(0px, -18px) translate(0px, ${-pitch * 8}px)`;
                this.clipRef.instance.style.transform = `translate(0px, 18px) translate(0px, ${pitch * 8}px)`;
            });

        sub.on("roll")
            .withPrecision(2)
            .handle((roll) => (this.horizonRollGroup.instance.style.transform = `rotate(${roll}deg)`));

        sub.on("irsState")
            .whenChanged()
            .handle((state) => {
                this.horizonVisibility.set(state >= 2 ? "visible" : "hidden");
                this.horizonFailVisibility.set(state < 2 ? "visible" : "hidden");
            });
    }

    public render(): VNode {
        return (
            <g>
                <g visibility={this.horizonVisibility}>
                    <clipPath ref={this.clipRef} id="ah-clip">
                        <path d="M156 350, h30, v-40 c 83 -115 243 -115 323 0, v40, h30, v280, h-383 Z" />
                    </clipPath>
                    <g ref={this.horizonRollGroup} class="horizon-group">
                        <g ref={this.horizonPitchGroup} class="horizon-group">
                            <rect x={0} y={-800} width={800} height={1200} fill="#1469BC" />
                            <rect x={0} y={400} width={800} height={1200} fill="#764D17" />
                            <rect x={0} y={397.5} width={800} height={4} fill="#fff" stroke="black" stroke-width="1" />
                            <g clip-path="url(#ah-clip)">
                                <GraduationLines />
                            </g>
                        </g>
                    </g>
                    <BankSlipIndicator bus={this.props.bus} />
                    <FlightPathVector bus={this.props.bus} />
                </g>

                <path d="M0 0, h799, v410 h-260 v-190 a-44,44 -44 0, 0 -44,-44 l-295,0 a-44,44 -44 0, 0 -44,44 v190, H0 Z" />
                <path d="M156 410 v123 a-44,44 -44 0, 0 44,44 h295, a-44,44 -44 0, 0 44,-44 v-123 H800 L800, 800, H0, V410 Z" />

                <BlackOutlineLine d="M190 377, h84, v30 h-11 v-20 h-73 Z" blackStroke={5} styleColor="fill: black;" />
                <BlackOutlineLine d="M422 377, h84, v11, h-73, v20, h-11 Z" blackStroke={5} styleColor="fill: black;" />

                <BlackOutlineLine d="M163 275, l17 10" />
                <BlackOutlineLine d="M534 275, l-17 10" />
                <BlackOutlineLine d="M201 236, l10 10" />
                <BlackOutlineLine d="M497 236, l-10 10" />
                <BlackOutlineLine d="M236 189, l15 25" />
                <BlackOutlineLine d="M462 189, l-15 25" />
                <BlackOutlineLine d="M278 189, l4 11" />
                <BlackOutlineLine d="M420 189, l-4 11" />
                <BlackOutlineLine d="M313 179, l3 13" />
                <BlackOutlineLine d="M385 179, l-3 13" />
                <path fill="white" stroke="black" strokeWidth="0.5" d="M349 191 l-11 -15 l22 0 Z" />

                <PitchLimitIndicator bus={this.props.bus} />
                <FlightDirector bus={this.props.bus} />
                <MarkerBeacon bus={this.props.bus} />

                <g visibility={this.horizonFailVisibility}>
                    <rect x="322" y="299.5" width="52" height="27" class="line" fill="none" stroke-width="3" stroke="#ffc400" />
                    <text x="348" y="324" class="text-3 amber middle">
                        ATT
                    </text>
                </g>

                <BlackOutlineLine d="M343 377, h11, v11, h-11, Z" styleBlack="fill: transparent;" styleColor="fill: transparent;" blackStroke={5} />
            </g>
        );
    }
}

class BankSlipIndicator extends DisplayComponent<{ bus: EventBus }> {
    private bankGroup = FSComponent.createRef<SVGGElement>();
    private colour = Subject.create("white");

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("roll")
            .withPrecision(2)
            .handle((roll) => {
                this.bankGroup.instance.style.transform = `rotate(${roll}deg)`;
                this.colour.set(Math.abs(roll) > 35 ? "#ffc400" : "white");
            });
    }

    public render(): VNode {
        return (
            <g ref={this.bankGroup} class="horizon-group">
                <SlipIndicator bus={this.props.bus} colour={this.colour} />
                <BankIndicator bus={this.props.bus} colour={this.colour} />
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
            <g transform="translate(349, 400)">
                {Array.from({ length: 37 }, (_, i) => {
                    const number = ((i + 1) / 4) * 10 - 2.5;
                    return (
                        <>
                            <GraduationLine type={this.indexToGraduationLineType(i)} y={i * 20} text={number} />
                            <GraduationLine type={this.indexToGraduationLineType(i)} y={i * -20} text={number} />
                        </>
                    );
                })}
            </g>
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
