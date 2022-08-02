/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { BlackOutlineLine } from "../../Common/BlackOutlineLine";
import { PFDSimvars } from "../../SimVarPublisher";

export class FlapSpeedBugs extends DisplayComponent<{ bus: EventBus }> {
    private radioHeight = 0;
    private flightPhase = 0;
    private selectedFlaps = 0;
    private vRef25 = 0;
    private vRef30 = 0;
    private landingFlaps = 0;

    private visibility = Subject.create("hidden");

    private currentFlapSpeedBugD = Subject.create("");
    private currentFlapSpeedBugY = Subject.create(0);
    private currentFlapSpeedBugText = Subject.create("");

    private nextFlapSpeedBugD = Subject.create("");
    private nextFlapSpeedBugY = Subject.create(0);
    private nextFlapSpeedBugText = Subject.create("");

    private flapMarkerText = ["UP", "1\xa0", "5\xa0", "10", "20", "25"];
    private flapMarkerSpeed = [80, 60, 40, 20, 10];

    private currentFlapMarkerSpeed(flapsHandle: number, vRef30: number, vRef25: number, landingFlaps: number): number {
        if (flapsHandle === 5 && landingFlaps !== 25) return vRef25;

        return flapsHandle > 5 || (flapsHandle === 5 && landingFlaps === 25) ? -1 : vRef30 + this.flapMarkerSpeed[flapsHandle];
    }

    private nextFlapMarkerSpeed(flapsHandle: number, vRef30: number, landingFlaps: number): number {
        if (flapsHandle === 5 && landingFlaps !== 25) return vRef30 + 10;

        return flapsHandle > 5 || flapsHandle < 1 || (flapsHandle === 5 && landingFlaps === 25) ? -1 : vRef30 + this.flapMarkerSpeed[flapsHandle - 1];
    }

    private handleFlapsBugs() {
        this.currentFlapSpeedBugD.set(
            `M 55 ${520 + this.currentFlapMarkerSpeed(this.selectedFlaps, this.vRef30, this.vRef25, this.landingFlaps) * -4.6}, h10`
        );
        this.currentFlapSpeedBugY.set(529 + this.currentFlapMarkerSpeed(this.selectedFlaps, this.vRef30, this.vRef25, this.landingFlaps) * -4.6);
        this.nextFlapSpeedBugD.set(`M 55 ${520 + this.nextFlapMarkerSpeed(this.selectedFlaps, this.vRef30, this.landingFlaps) * -4.6}, h10`);
        this.nextFlapSpeedBugY.set(529 + this.nextFlapMarkerSpeed(this.selectedFlaps, this.vRef30, this.landingFlaps) * -4.6);
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("altAboveGround")
            .withPrecision(1)
            .handle((height) => {
                this.radioHeight = height;
                this.visibility.set(this.flightPhase >= 2 && this.radioHeight > 25 && this.radioHeight < 20000 ? "visible" : "hidden");
            });

        sub.on("onGround")
            .whenChanged()
            .handle((_) => {
                this.currentFlapSpeedBugText.set(this.selectedFlaps <= 5 ? this.flapMarkerText[this.selectedFlaps] : "");
                this.nextFlapSpeedBugText.set(
                    this.selectedFlaps < 1 || (this.selectedFlaps === 5 && this.landingFlaps === 25) || this.selectedFlaps > 5
                        ? ""
                        : this.flapMarkerText[this.selectedFlaps - 1]
                );
            });

        sub.on("flightPhase")
            .whenChanged()
            .handle((phase) => {
                this.flightPhase = phase;
                this.visibility.set(this.flightPhase >= 2 && this.radioHeight > 25 ? "visible" : "hidden");
            });

        sub.on("flapsHandle")
            .whenChanged()
            .handle((flaps) => {
                this.selectedFlaps = flaps;
                this.handleFlapsBugs();
                this.currentFlapSpeedBugText.set(flaps <= 5 ? this.flapMarkerText[flaps] : "");
                this.nextFlapSpeedBugText.set(
                    flaps < 1 || (flaps === 5 && this.landingFlaps === 25) || flaps > 5 ? "" : this.flapMarkerText[flaps - 1]
                );
            });

        sub.on("vRef25")
            .whenChanged()
            .handle((vRef25) => {
                this.vRef25 = vRef25;
                this.handleFlapsBugs();
            });

        sub.on("vRef30")
            .whenChanged()
            .handle((vRef30) => {
                this.vRef30 = vRef30;
                this.handleFlapsBugs();
            });

        sub.on("landingFlaps")
            .whenChanged()
            .handle((flaps) => {
                this.landingFlaps = flaps;
                this.handleFlapsBugs();
                this.nextFlapSpeedBugText.set(
                    flaps < 1 || (flaps === 5 && this.landingFlaps === 25) || flaps > 5 ? "" : this.flapMarkerText[flaps - 1]
                );
            });
    }

    public render(): VNode {
        return (
            <>
                <g visibility={this.visibility}>
                    <BlackOutlineLine d={this.currentFlapSpeedBugD} blackStroke={6} whiteStroke={5} color="lime" />
                    <text x="93" y={this.currentFlapSpeedBugY} class="text-2 green">
                        {this.currentFlapSpeedBugText}
                    </text>
                </g>

                <g visibility={this.visibility}>
                    <BlackOutlineLine d={this.nextFlapSpeedBugD} blackStroke={6} whiteStroke={5} color="lime" />
                    <text x="93" y={this.nextFlapSpeedBugY} class="text-2 green">
                        {this.nextFlapSpeedBugText}
                    </text>
                </g>
            </>
        );
    }
}
