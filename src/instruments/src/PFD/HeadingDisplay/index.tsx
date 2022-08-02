/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { PFDSimvars } from "../SimVarPublisher";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";

import { getHeadingDelta } from "../../Common/utils/heading";

import { HeadingBug } from "./HeadingBug";
import { TrackLine } from "./TrackLine";

export const arcCorrection = (heading: number, indicatorHeading: number): number =>
    Math.min(Math.abs(getHeadingDelta(heading, indicatorHeading) * 100), 30);

export class HeadingDisplay extends DisplayComponent<{ bus: EventBus }> {
    private visibilityAligning = Subject.create("visible");
    private visibilityAligned = Subject.create("visible");
    private hdgFailVisibility = Subject.create("hidden");

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("irsState")
            .whenChanged()
            .handle((state) => {
                this.visibilityAligning.set(state >= 1 ? "visible" : "hidden");
                this.visibilityAligned.set(state === 2 ? "visible" : "hidden");
                this.hdgFailVisibility.set(state === 0 ? "visible" : "hidden");
            });
    }

    public render(): VNode {
        return (
            <g>
                <g visibility={this.visibilityAligning}>
                    <path class="gray-bg" d="M142 785, h412, c -103 -140, -306 -140, -412 0 Z" />
                    <BlackOutlineLine d="M349 677 l-11 -20 l22 0 Z" blackStroke={6} whiteStroke={4} />

                    <HeadingLines bus={this.props.bus} />

                    <text x="435" y="777" class="text-2 green">
                        MAG
                    </text>
                </g>

                <g visibility={this.visibilityAligned}>
                    <HeadingBug bus={this.props.bus} />
                    <TrackLine bus={this.props.bus} />
                </g>

                <rect x="200" y="785" width="300" height="5" fill="black" />
                <rect x="110" y="789" width="480" height="15" fill="black" />

                <g visibility={this.hdgFailVisibility}>
                    <rect x="322" y="749.5" width="52" height="27" class="line" fill="none" stroke-width="3" stroke="#ffc400" />
                    <text x="348" y="774" class="text-3 amber middle">
                        HDG
                    </text>
                </g>
            </g>
        );
    }
}

class HeadingLineElement extends DisplayComponent<{ bus: EventBus; rotation: number; text?: boolean }> {
    private transform = Subject.create("");
    private visibility = Subject.create("visible");

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("magneticHeading")
            .withPrecision(1)
            .handle((heading) => {
                this.transform.set(
                    `rotate(${-getHeadingDelta(heading, this.props.rotation) * 1.6} 349 ${900 + arcCorrection(heading * 10, this.props.rotation)})`
                );
            });

        sub.on("irsState")
            .whenChanged()
            .handle((state) => this.visibility.set(state === 2 ? "visible" : "hidden"));
    }

    public render(): VNode {
        return (
            <g transform={this.transform}>
                <BlackOutlineLine d={`M349 680.5, v${this.props.text ? 11 : 5.5}`} />
                {this.props.text && (
                    <text
                        x="349"
                        y={this.props.rotation % 3 === 0 ? 718 : 712}
                        class={`${this.props.rotation % 3 === 0 ? "text-3" : "text-2"} middle`}
                        fill-opacity={`${this.props.rotation % 3 === 0 ? "1" : "0.9"}`}
                        visibility={this.visibility}
                    >
                        {this.props.rotation == 360 ? "0" : (this.props.rotation / 10).toString()}
                    </text>
                )}
            </g>
        );
    }
}

class HeadingLines extends DisplayComponent<{ bus: EventBus }> {
    public render(): VNode {
        return (
            <>
                {Array.from({ length: 36 }, (_, i) => {
                    const rotation = (i + 1) * 10;
                    return (
                        <>
                            <HeadingLineElement bus={this.props.bus} rotation={rotation} text />
                            <HeadingLineElement bus={this.props.bus} rotation={rotation - 5} />
                        </>
                    );
                })}
            </>
        );
    }
}
