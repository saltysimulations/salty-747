/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { BlackOutlineLine } from "../../Common/BlackOutlineLine";
import { PFDSimvars } from "../../SimVarPublisher";

export class VSpeedBugs extends DisplayComponent<{ bus: EventBus }> {
    private radioHeight = 0;
    private flightPhase = 0;
    private airspeed = 0;
    private v1 = 0;
    private vR = 0;
    private v2 = 0;

    private v1Visibility = Subject.create("hidden");
    private vRVisibility = Subject.create("hidden");
    private v2Visibility = Subject.create("hidden");

    private v1D = Subject.create("");
    private vRD = Subject.create("");
    private v2D = Subject.create("");

    private v1Y = Subject.create(0);
    private vRY = Subject.create(0);
    private v2Y = Subject.create(0);

    private vRBugText = Subject.create("");

    private handleVSpeedVisibility() {
        this.v1Visibility.set(this.radioHeight < 25 && this.flightPhase <= 2 && this.v1 != 0 ? "visible" : "hidden");
        this.vRVisibility.set(this.radioHeight < 25 && this.flightPhase <= 2 && this.vR != 0 ? "visible" : "hidden");
        this.v2Visibility.set(this.flightPhase <= 2 && this.v2 != 0 ? "visible" : "hidden");
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("altAboveGround")
            .withPrecision(1)
            .handle((height) => {
                this.radioHeight = height;
                this.handleVSpeedVisibility();
            });

        sub.on("flightPhase")
            .whenChanged()
            .handle((phase) => {
                this.flightPhase = phase;
                this.handleVSpeedVisibility();
            });

        sub.on("airspeed")
            .whenChangedBy(0.0625)
            .handle((airspeed) => {
                this.airspeed = airspeed;
                this.v1Y.set(Math.max(529 + this.v1 * -4.6, 520 + (Math.max(this.airspeed, 30) + 54) * -4.6));
            });

        sub.on("v1")
            .whenChanged()
            .handle((v1) => {
                this.v1 = v1;
                this.v1D.set(`M 45 ${520 + v1 * -4.6}, h20`);
                this.v1Y.set(Math.max(529 + v1 * -4.6, 520 + (Math.max(this.airspeed, 30) + 54) * -4.6));
                this.vRBugText.set(this.vR - this.v1 < 4 ? "R" : "VR");
                this.handleVSpeedVisibility();
            });

        sub.on("vR")
            .whenChanged()
            .handle((vR) => {
                this.vR = vR;
                this.vRD.set(`M 55 ${520 + vR * -4.6}, h10`);
                this.vRY.set(529 + vR * -4.6);
                this.vRBugText.set(this.vR - this.v1 < 4 ? "R" : "VR");
                this.handleVSpeedVisibility();
            });

        sub.on("v2")
            .whenChanged()
            .handle((v2) => {
                this.v2 = v2;
                this.v2D.set(`M 55 ${520 + v2 * -4.6}, h10`);
                this.v2Y.set(529 + v2 * -4.6);
                this.handleVSpeedVisibility();
            });
    }

    public render(): VNode {
        return (
            <>
                <g visibility={this.v1Visibility}>
                    <BlackOutlineLine d={this.v1D} blackStroke={6} whiteStroke={5} color="lime" />
                    <text x="93" y={this.v1Y} class="text-2 green">
                        V1
                    </text>
                </g>

                <g visibility={this.vRVisibility}>
                    <BlackOutlineLine d={this.vRD} blackStroke={6} whiteStroke={5} color="lime" />
                    <text x="105" y={this.vRY} class="text-2 green">
                        {this.vRBugText}
                    </text>
                </g>

                <g visibility={this.v2Visibility}>
                    <BlackOutlineLine d={this.v2D} blackStroke={6} whiteStroke={5} color="lime" />
                    <text x="93" y={this.v2Y} class="text-2 green">
                        V2
                    </text>
                </g>
            </>
        );
    }
}
