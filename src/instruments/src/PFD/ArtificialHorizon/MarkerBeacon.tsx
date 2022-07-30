/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { PFDSimvars } from "../SimVarPublisher";

export class MarkerBeacon extends DisplayComponent<{ bus: EventBus }> {
    private classSub = Subject.create("hidden");
    private colourSub = Subject.create("");
    private textSub = Subject.create("");

    private markers = [
        ["", "", "hidden"],
        ["cyan", "OM", "outer-marker-blink"],
        ["#ffc400", "MM", "middle-marker-blink"],
        ["white", "IM", "inner-marker-blink"],
    ];

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("markerBeaconState")
            .whenChanged()
            .handle((state) => {
                this.colourSub.set(this.markers[state][0]);
                this.textSub.set(this.markers[state][1]);
                this.classSub.set(this.markers[state][2]);
            });
    }

    public render(): VNode {
        return (
            <g class={this.classSub}>
                <circle cx="507" cy="213" r="20" fill="black" class="fpv-outline" />
                <circle cx="507" cy="213" r="20" fill="black" stroke-width="3px" stroke={this.colourSub} />

                <text
                    x="507"
                    y="224"
                    font-size="30"
                    letter-spacing="-0.25"
                    text-anchor="middle"
                    stroke="black"
                    stroke-width="1.5px"
                    paint-order="stroke"
                    fillOpacity={0.9}
                    fill={this.colourSub}
                >
                    {this.textSub}
                </text>
            </g>
        );
    }
}
