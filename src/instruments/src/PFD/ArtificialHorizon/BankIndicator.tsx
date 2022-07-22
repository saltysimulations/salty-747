/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subscribable, Subject } from "msfssdk";

interface BankIndicatorProps {
    bus: EventBus;
    colour: Subscribable<string>;
}

export class BankIndicator extends DisplayComponent<BankIndicatorProps> {
    private strokeColour = Subject.create("none");

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        this.props.colour.sub((colour) => {
            this.strokeColour.set(colour === "white" ? "none" : "#ffc400");
        });
    }
    public render(): VNode {
        return (
            <>
                <path fill="none" stroke="black" stroke-width="4" d="M349 194, l-16 20, h32, Z" stroke-linejoin="round" />
                <path fill={this.strokeColour} stroke={this.props.colour} stroke-width="3" d="M349 194, l-16 20, h32, Z" stroke-linejoin="round" />
            </>
        );
    }
}
