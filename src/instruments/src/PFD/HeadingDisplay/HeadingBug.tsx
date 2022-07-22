/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { PFDSimvars } from "../SimVarPublisher";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";

import { getHeadingDelta } from "../../Common/utils/heading";

import { arcCorrection } from "./";

export class HeadingBug extends DisplayComponent<{ bus: EventBus }> {
    private heading = 0;
    private mcpHeading = 0;

    private selectedHeadingString = Subject.create("");
    private bugTransform = Subject.create("");

    private setSelectedHeadingString(heading: number) {
        let hdgString = heading.toFixed(0);
        if (hdgString.length === 2) {
            hdgString = "0" + hdgString;
        } else if (hdgString.length === 1) {
            hdgString = "00" + hdgString;
        }

        this.selectedHeadingString.set(hdgString);
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("magneticHeading")
            .withPrecision(1)
            .handle((heading) => {
                this.heading = heading;
                this.bugTransform.set(
                    `rotate(${Math.min(-Math.min(getHeadingDelta(this.heading, this.mcpHeading) * 1.6, 55), 55)} 349 ${
                        900 + arcCorrection(heading, this.mcpHeading)
                    })`
                );
            });

        sub.on("selectedHeading")
            .withPrecision(0)
            .handle((heading) => {
                this.mcpHeading = heading;
                this.bugTransform.set(
                    `rotate(${Math.min(-Math.min(getHeadingDelta(this.heading, this.mcpHeading) * 1.6, 55), 55)} 349 ${
                        900 + arcCorrection(heading, this.mcpHeading)
                    })`
                );
                this.setSelectedHeadingString(heading);
            });
    }

    public render(): VNode {
        return (
            <>
                <text x="305" y="777" class="text-3 magenta">
                    {this.selectedHeadingString}
                </text>
                <text x="319" y="777" class="text-2 magenta">
                    H
                </text>
                <g transform={this.bugTransform}>
                    <BlackOutlineLine d="M 335 679, h28, v-14, h-4, l-7 14, h-6, l-7 -14, h-4, Z" blackStroke={5} color="#d570ff" />
                </g>
            </>
        );
    }
}
