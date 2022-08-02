/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { BlackOutlineLine } from "../../Common/BlackOutlineLine";
import { PFDSimvars } from "../../SimVarPublisher";

import { VSpeedBugs } from "./VSpeedBugs";
import { FlapSpeedBugs } from "./FlapSpeedBugs";
import { RefSpeedBugs } from "./RefSpeedBugs";

export class SpeedBugs extends DisplayComponent<{ bus: EventBus }> {
    public render(): VNode {
        return (
            <>
                <VSpeedBugs bus={this.props.bus} />
                <FlapSpeedBugs bus={this.props.bus} />
                <RefSpeedBugs bus={this.props.bus} />
                <SelectedSpeedBug bus={this.props.bus} />
            </>
        );
    }
}

class SelectedSpeedBug extends DisplayComponent<{ bus: EventBus }> {
    private airspeed = 0;
    private selectedSpeed = 0;

    private d = Subject.create("");

    private handleSpeedBug() {
        this.d.set(
            `M 49 ${Math.max(
                520 + (Math.max(this.airspeed, 30) + 61.5) * -4.6,
                Math.min(520 + this.selectedSpeed * -4.6, 520 + (Math.max(this.airspeed, 30) - 60.5) * -4.6)
            )}, l 15 11.5, h32, v-23, h-32, Z`
        );
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("airspeed")
            .whenChangedBy(0.0625)
            .handle((speed) => {
                this.airspeed = speed;
                this.handleSpeedBug();
            });

        sub.on("selectedSpeed")
            .whenChanged()
            .handle((speed) => {
                this.selectedSpeed = speed;
                this.handleSpeedBug();
            });
    }

    public render(): VNode {
        return <BlackOutlineLine d={this.d} color="#d570ff" blackStroke={5} styleBlack="fill: none;" styleColor="fill: none;" />;
    }
}
