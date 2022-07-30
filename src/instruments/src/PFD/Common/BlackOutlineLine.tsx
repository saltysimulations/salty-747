/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, Subscribable } from "msfssdk";

interface BlackOutlineLineProps {
    d: string | Subscribable<string>;
    blackStroke?: number | Subscribable<number>;
    whiteStroke?: number | Subscribable<number>;
    color?: string | Subscribable<string>;
    styleColor?: string;
    styleBlack?: string;
}

export class BlackOutlineLine extends DisplayComponent<BlackOutlineLineProps> {
    public render(): VNode {
        return (
            <>
                <path
                    stroke="black"
                    stroke-width={this.props.blackStroke ?? 4}
                    stroke-linecap="round"
                    d={this.props.d}
                    style={this.props.styleBlack ?? ""}
                    stroke-linejoin="round"
                />
                <path
                    stroke={this.props.color ?? "white"}
                    stroke-width={this.props.whiteStroke ?? 3}
                    stroke-linecap="round"
                    d={this.props.d}
                    style={this.props.styleColor ?? ""}
                    stroke-linejoin="round"
                />
            </>
        );
    }
}
