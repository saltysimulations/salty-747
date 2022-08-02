/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject, Subscribable } from "msfssdk";
import { PFDSimvars } from "../SimVarPublisher";

interface SlipIndicatorProps {
    bus: EventBus;
    colour: Subscribable<string>;
}

export class SlipIndicator extends DisplayComponent<SlipIndicatorProps> {
    private slipGroup = FSComponent.createRef<SVGGElement>();
    private fillOpacity = Subject.create(0);

    private angleToDisplacement(sideslip: number): number {
        return Math.min(sideslip * 1.25, 33);
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("sideslip")
            .whenChangedBy(0.05)
            .handle((sideslip) => {
                const angle = this.angleToDisplacement(sideslip);
                this.slipGroup.instance.style.transform = `translate(${angle}px, 0px)`;
                this.fillOpacity.set(Math.abs(angle) >= 33 ? 1 : 0);
            });
    }
    public render(): VNode {
        return (
            <g ref={this.slipGroup}>
                <path fill="none" stroke="black" stroke-width="4" d="M333 214, h32, v 6, h-32, Z" stroke-linejoin="round" />
                <path
                    fill={this.props.colour}
                    fill-opacity={this.fillOpacity}
                    stroke={this.props.colour}
                    stroke-width="3"
                    d="M333 214, h32, v 6, h-32, Z"
                    stroke-linejoin="round"
                />
            </g>
        );
    }
}
