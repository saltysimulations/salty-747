/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";
import { PFDSimvars } from "../SimVarPublisher";

//TODO: this should also include some component based on airspeed change vs delta time, not just acceleration
export class SpeedTrendVector extends DisplayComponent<{ bus: EventBus }> {
    private acceleration = 0;
    private airspeed = 0;

    private visibility = Subject.create("hidden");
    private d = Subject.create("");

    private getTrendVector(acceleration: number, airspeed: number): number {
        if (airspeed < 30) return 0;

        return acceleration > 0 ? Math.min(acceleration * 5.925, 60.5) : Math.max(acceleration * 5.925, -60.5);
    }

    private handleTrendVector() {
        this.visibility.set(Math.abs(this.getTrendVector(this.acceleration, this.airspeed)) < 4.5 ? "hidden" : "visible");
        this.d.set(
            `M 96 381, v${this.getTrendVector(this.acceleration, this.airspeed) * -4.6 - (this.acceleration > 0 ? -12 : 12)}, m-6 0, h12, m0 0, l-6 ${
                this.acceleration > 0 ? "-" : ""
            }12, m0 0, l-6 ${this.acceleration < 0 ? "-" : ""}12`
        );
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("acceleration")
            .withPrecision(1)
            .handle((acceleration) => {
                this.acceleration = acceleration / 60;
                this.handleTrendVector();
            });

        sub.on("airspeed")
            .whenChangedBy(0.0625)
            .handle((airspeed) => {
                this.airspeed = airspeed;
                this.handleTrendVector();
            });
    }

    public render(): VNode {
        return (
            <g visibility={this.visibility}>
                <BlackOutlineLine d={this.d} color="lime" blackStroke={5} styleBlack="fill: none;" styleColor="fill: none;" />
            </g>
        );
    }
}
