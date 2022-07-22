/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject, HEvent } from "msfssdk";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";
import { PFDSimvars } from "../SimVarPublisher";

export class MetresDisplay extends DisplayComponent<{ bus: EventBus }> {
    private isMetresOn = false;

    private visibility = Subject.create("hidden");

    private metresText = Subject.create(0);
    private selectedMetresText = Subject.create(0);

    private feetToMeters(feet: number): number {
        return Math.round(feet * 0.3048);
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("isMetresOn")
            .whenChanged()
            .handle((isMetresOn) => {
                this.isMetresOn = isMetresOn;
                this.visibility.set(isMetresOn ? "visible" : "hidden");
            });

        sub.on("altitude")
            .withPrecision(0)
            .handle((altitude) => {
                this.metresText.set(this.feetToMeters(altitude));
            });

        sub.on("selectedAltitude")
            .withPrecision(0)
            .handle((altitude) => {
                this.selectedMetresText.set(this.feetToMeters(altitude));
            });

        const hEventSub = this.props.bus.getSubscriber<HEvent>();

        hEventSub.on("hEvent").handle((event) => {
            if (event === "B747_8_PFD_MTRS") {
                SimVar.SetSimVarValue("L:74S_EFIS_METRES_ON", "Bool", !this.isMetresOn);
            }
        });
    }

    public render(): VNode {
        return (
            <g visibility={this.visibility}>
                <g>
                    <BlackOutlineLine d="M 632 314, h 104, v 30, h-104, Z" blackStroke={5} />
                    <text x="715" y="339" class="text-3 end">
                        {this.metresText}
                    </text>
                    <text x="728" y="339" class="text-2 cyan end">
                        M
                    </text>
                </g>

                <g>
                    <text x="681" y="41" class="text-3 magenta end">
                        {this.selectedMetresText}
                    </text>
                    <text x="682" y="41" class="text-2 cyan start">
                        M
                    </text>
                </g>
            </g>
        );
    }
}
