/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus } from "msfssdk";
import { PFDSimvars } from "../SimVarPublisher";

export class RadioAltimeter extends DisplayComponent<{ bus: EventBus }> {
    private radioAltitude = 0;
    private radioMinimums = 0;

    private radioAltimeterRef = FSComponent.createRef<SVGTextElement>();

    private handleClass() {
        if (this.radioAltitude <= this.radioMinimums && this.radioAltitude > 1) {
            this.radioAltimeterRef.instance.classList.add("amber");
        } else {
            this.radioAltimeterRef.instance.classList.remove("amber");
        }
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("altAboveGround")
            .withPrecision(0)
            .handle((altitude) => {
                this.radioAltitude = altitude;

                let displayAltitude = 0;
                if (altitude > 500) {
                    displayAltitude = Math.round(altitude / 20) * 20;
                } else if (altitude > 100) {
                    displayAltitude = Math.round(altitude / 10) * 10;
                } else {
                    displayAltitude = Math.round(altitude / 2) * 2;
                }

                this.radioAltimeterRef.instance.innerHTML = displayAltitude.toString();
                this.radioAltimeterRef.instance.style.visibility = altitude <= 2500 ? "visible" : "hidden";

                this.handleClass();
            });

        sub.on("radioMinimums")
            .whenChanged()
            .handle((minimums) => {
                this.radioMinimums = minimums;
                this.handleClass();
            });
    }

    public render(): VNode {
        return <text x="550" y="150" class="text-4" ref={this.radioAltimeterRef} />;
    }
}
