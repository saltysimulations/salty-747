/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, Subject, Subscribable } from "msfssdk";

interface FMAColumnProps {
    x: number;
    y: number;
    topText: Subscribable<string>;
    bottomText?: Subscribable<string>;
    extraHighlightVar?: Subscribable<any>;
}

export class FMAColumn extends DisplayComponent<FMAColumnProps> {
    private topText = "";

    private greenBoxVisibility = Subject.create("hidden");

    private handleBox(text: string) {
        if (text) {
            this.greenBoxVisibility.set("visible");
            setTimeout(() => this.greenBoxVisibility.set("hidden"), 10000);
        } else this.greenBoxVisibility.set("hidden");
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        this.props.topText?.sub((text) => {
            this.topText = text;
            this.handleBox(text);
        });

        this.props.extraHighlightVar?.sub((_) => this.handleBox(this.topText));
    }

    public render(): VNode {
        return (
            <g>
                <g visibility={this.greenBoxVisibility}>
                    <rect x={this.props.x - 65} y={this.props.y} width="130" height="27" fill="none" class="line" stroke="black" stroke-width="5" />
                    <rect x={this.props.x - 65} y={this.props.y} width="130" height="27" fill="none" class="line" stroke="lime" stroke-width="3" />
                </g>
                <text x={this.props.x} y={this.props.y + 25} class="text-3 green middle">
                    {this.props.topText}
                </text>
                <text x={this.props.x} y={this.props.y + 48} class="text-2 middle">
                    {this.props.bottomText}
                </text>
            </g>
        );
    }
}
