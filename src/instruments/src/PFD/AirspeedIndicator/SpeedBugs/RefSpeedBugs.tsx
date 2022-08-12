/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { BlackOutlineLine } from "../../Common/BlackOutlineLine";
import { PFDSimvars } from "../../SimVarPublisher";

export class RefSpeedBugs extends DisplayComponent<{ bus: EventBus }> {
    private airspeed = 0;
    private vRef = 0;

    private bugVisibility = Subject.create("hidden");
    private bugLineVisibility = Subject.create("hidden");
    private bugY = Subject.create(0);
    private bugLineD = Subject.create("");

    private handleRefBug() {
        this.bugVisibility.set(this.vRef != 0 && Math.max(this.airspeed, 30) - this.vRef < 52.5 ? "visible" : "hidden");
        this.bugY.set(Math.min(529 + this.vRef * -4.6, 529 + (Math.max(this.airspeed, 30) - 52.5) * -4.6));
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("airspeed")
            .whenChangedBy(0.0625)
            .handle((airspeed) => {
                this.airspeed = airspeed;
                this.handleRefBug();
            });

        sub.on("vRef")
            .whenChanged()
            .handle((vRef) => {
                this.vRef = vRef;
                this.handleRefBug();
                this.bugLineVisibility.set(this.vRef != 0 ? "visible" : "hidden");
                this.bugLineD.set(`M 45 ${520 + this.vRef * -4.6}, h20`);
            });
    }

    public render(): VNode {
        return (
            <>
                <g visibility={this.bugLineVisibility}>
                    <text x="71" y={this.bugY} class="text-2 green start">
                        REF
                    </text>
                </g>

                <g visibility={this.bugLineVisibility}>
                    <BlackOutlineLine d={this.bugLineD} blackStroke={6} whiteStroke={5} color="lime" />
                </g>
            </>
        );
    }
}
