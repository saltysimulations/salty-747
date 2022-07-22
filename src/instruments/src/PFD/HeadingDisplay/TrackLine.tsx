/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { PFDSimvars } from "../SimVarPublisher";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";

import { getHeadingDelta, getDriftAngle } from "../../Common/utils/heading";

import { arcCorrection } from "./";

export class TrackLine extends DisplayComponent<{ bus: EventBus }> {
    private heading = 0;
    private track = 0;

    private trackLineTransform = Subject.create("");

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("magneticHeading")
            .withPrecision(1)
            .handle((heading) => {
                this.heading = heading;
                this.trackLineTransform.set(
                    `rotate(${getHeadingDelta(this.heading, this.heading - getDriftAngle(this.heading, this.track)) * 1.6} 349 ${
                        900 + arcCorrection(this.heading, this.heading - getDriftAngle(this.heading, this.track))
                    })`
                );
            });

        sub.on("magneticTrack")
            .withPrecision(1)
            .handle((track) => {
                this.track = track;
                this.trackLineTransform.set(
                    `rotate(${getHeadingDelta(this.heading, this.heading - getDriftAngle(this.heading, this.track)) * 1.6} 349 ${
                        900 + arcCorrection(this.heading, this.heading - getDriftAngle(this.heading, this.track))
                    })`
                );
            });
    }

    public render(): VNode {
        return (
            <g transform={this.trackLineTransform}>
                <path class="line" stroke="black" stroke-width="5" d="M349 680, v150" />
                <path class="line" stroke="black" stroke-width="5" d="M343 751, h12" />
                <path class="line" stroke="white" stroke-width="3" d="M349 680, v150" />
                <path class="line" stroke="white" stroke-width="3" d="M343 751, h12" />
            </g>
        );
    }
}
