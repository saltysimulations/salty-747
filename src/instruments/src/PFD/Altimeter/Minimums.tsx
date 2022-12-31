/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { PFDSimvars } from "../SimVarPublisher";

export class Minimums extends DisplayComponent<{ bus: EventBus }> {
    private radioAltitude = 0;
    private radioMinimums = 0;

    private baroMinsVisibility = Subject.create("hidden");
    private radioMinsVisibility = Subject.create("hidden");

    private baroMinimumsValue = Subject.create(0);
    private radioMinimumsValue = Subject.create(0);

    private radioLabelClass = Subject.create("");
    private radioValueClass = Subject.create("");

    private handleRadioMinimumsClass() {
        const classes = this.radioAltitude <= this.radioMinimums && this.radioAltitude > 1 ? "amber radio-mins-blink" : "green";
        this.radioLabelClass.set(`text-2 ${classes}`);
        this.radioValueClass.set(`text-3 ${classes}`);
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("baroMinimums")
            .whenChanged()
            .handle((minimums) => {
                this.baroMinsVisibility.set(minimums >= -100 ? "visible" : "hidden");
                this.baroMinimumsValue.set(minimums);
            });

        sub.on("radioMinimums")
            .whenChanged()
            .handle((minimums) => {
                this.radioMinimums = minimums;
                this.handleRadioMinimumsClass();
                this.radioMinsVisibility.set(minimums > 0 ? "visible" : "hidden");
                this.radioMinimumsValue.set(minimums);
            });

        sub.on("altAboveGround")
            .withPrecision(0)
            .handle((altitude) => {
                this.radioAltitude = altitude;
                this.handleRadioMinimumsClass();
            });
    }

    public render(): VNode {
        return (
            <g>
                <g visibility={this.baroMinsVisibility}>
                    <text x="530" y="638" class="text-2 green">
                        BARO
                    </text>
                    <text x="530" y="668" class="text-3 green">
                        {this.baroMinimumsValue}
                    </text>
                </g>

                <g visibility={this.radioMinsVisibility}>
                    <text x="550" y="85" class={this.radioLabelClass}>
                        RADIO
                    </text>
                    <text x="550" y="113" class={this.radioValueClass}>
                        {this.radioMinimumsValue}
                    </text>
                </g>
            </g>
        );
    }
}
