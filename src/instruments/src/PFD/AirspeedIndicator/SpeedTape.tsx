/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";
import { PFDSimvars } from "../SimVarPublisher";

import { SpeedBugs } from "./SpeedBugs";
import { ValuePreviews } from "./SpeedBugs/ValuePreviews";
import { SpeedBands } from "./SpeedBands";
import { SpeedTrendVector } from "./SpeedTrendVector";

export class SpeedTape extends DisplayComponent<{ bus: EventBus }> {
    private transform = Subject.create("translate(50 0)");

    private noVSpeed = Subject.create("hidden");

    private airspeedY(airspeed: number): number {
        return Math.max(airspeed - 30, 0) * 4.6;
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("airspeed")
            .whenChangedBy(0.0625)
            .handle((speed) => {
                this.transform.set(`translate(50 ${this.airspeedY(Math.max(speed, 30))})`);
            });

        sub.on("v1")
            .whenChanged()
            .handle((v1) => this.noVSpeed.set(v1 == 0 ? "visible" : "hidden"));
    }

    public render(): VNode {
        return (
            <g>
                <g visibility={this.noVSpeed}>
                    <text x="135" y="238" class="text-3 amber middle">
                        NO
                    </text>
                    <text x="135" y="270" class="text-3 amber middle">
                        V
                    </text>
                    <text x="135" y="302" class="text-3 amber middle">
                        S
                    </text>
                    <text x="135" y="327" class="text-3 amber middle">
                        P
                    </text>
                    <text x="135" y="352" class="text-3 amber middle">
                        D
                    </text>
                </g>

                <path class="gray-bg" d="M13 100, h100 v560 h -100 Z" />

                <clipPath id="speedtape-clip">
                    <path d="M13 100, h200 v560 h -200 Z" />
                </clipPath>

                <g clip-path="url(#speedtape-clip)">
                    <g transform={this.transform}>
                        {Array.from({ length: 40 }, (_, i) => (
                            <BlackOutlineLine d={`M47 ${i * -46 + 382}, h15`} />
                        ))}
                        {Array.from({ length: 21 }, (_, i) => (
                            <text x="32" y={i * -92 + 428 + 11} class="text-3 white" fill-opacity={0.9} letter-spacing={-0.5}>
                                {i === 0 ? "" : ((i + 1) * 20).toFixed(0)}
                            </text>
                        ))}

                        <SpeedBugs bus={this.props.bus} />
                    </g>
                    <SpeedBands bus={this.props.bus} />
                </g>
                <ValuePreviews bus={this.props.bus} />

                <path class="gray-bg" d="M 14 332, h 71, v 100, h -71, Z" />

                <CommandSpeed bus={this.props.bus} />
                <MachGS bus={this.props.bus} />
                <SpeedTrendVector bus={this.props.bus} />
            </g>
        );
    }
}

class CommandSpeed extends DisplayComponent<{ bus: EventBus }> {
    private selectedSpeed = 0;
    private machSpeed = 0;
    private isInMach = false;

    private textContent = Subject.create("");

    private handleCommandSpeed() {
        this.textContent.set(this.isInMach ? this.machSpeed.toFixed(3).replace("0", "") : this.selectedSpeed.toFixed(0));
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("selectedSpeed")
            .whenChangedBy(0.0625)
            .handle((speed) => {
                this.selectedSpeed = speed;
                this.handleCommandSpeed();
            });

        sub.on("selectedMachSpeed")
            .whenChanged()
            .handle((speed) => {
                this.machSpeed = speed;
                this.handleCommandSpeed();
            });

        sub.on("isInMach")
            .whenChanged()
            .handle((isInMach) => {
                this.isInMach = isInMach;
                this.handleCommandSpeed();
            });
    }

    public render(): VNode {
        return (
            <text x="105" y="80" class="text-4 magenta">
                {this.textContent}
            </text>
        );
    }
}

class MachGS extends DisplayComponent<{ bus: EventBus }> {
    private machVisibility = Subject.create("hidden");
    private gsVisibility = Subject.create("visible");
    private machText = Subject.create(".000");
    private gsText = Subject.create("0");

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("machSpeed")
            .whenChangedBy(0.002)
            .handle((mach) => {
                this.machVisibility.set(mach >= 0.4 ? "visible" : "hidden");
                this.gsVisibility.set(mach < 0.4 ? "visible" : "hidden");
                this.machText.set(mach.toFixed(3).replace("0", ""));
            });

        sub.on("groundSpeed")
            .whenChangedBy(0.125)
            .handle((gs) => this.gsText.set(Math.round(gs).toString()));
    }
    public render(): VNode {
        return (
            <g>
                <text x="100" y="730" class="text-4" visibility={this.machVisibility}>
                    {this.machText}
                </text>
                <g visibility={this.gsVisibility}>
                    <text x="46" y="730" class="text-3">
                        GS
                    </text>
                    <text x="110" y="730" class="text-4">
                        {this.gsText}
                    </text>
                </g>
            </g>
        );
    }
}
