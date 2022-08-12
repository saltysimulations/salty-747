/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { PFDSimvars } from "../SimVarPublisher";

export class AFDSStatus extends DisplayComponent<{ bus: EventBus }> {
    private afdsStatus = Subject.create(0);
    private afdsStatusText = Subject.create("");

    private autolandClass = Subject.create("");
    private noAutolandVisibility = Subject.create("hidden");

    private greenBoxVisibility = Subject.create("hidden");
    private amberBoxVisibility = Subject.create("hidden");

    private afdsStatuses = ["", "FD", "CMD", "LAND 2", "LAND 3", "AUTOLAND"];

    private handleAFDSBoxes(text: string) {
        // sunday morning is every day for all i care
        if (text) {
            if (text === "AUTOLAND") {
                this.greenBoxVisibility.set("hidden");
                this.amberBoxVisibility.set("visible");
                setTimeout(() => this.amberBoxVisibility.set("hidden"), 10000);
            }
            this.amberBoxVisibility.set("hidden");
            this.greenBoxVisibility.set("visible");
            setTimeout(() => this.greenBoxVisibility.set("hidden"), 10000);
        } else {
            this.greenBoxVisibility.set("hidden");
            this.amberBoxVisibility.set("hidden");
        }
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("afdsStatus")
            .whenChanged()
            .handle((status) => {
                const text = status < this.afdsStatuses.length ? this.afdsStatuses[status] : "";

                this.afdsStatus.set(status);
                this.afdsStatusText.set(text);

                this.autolandClass.set(text === "AUTOLAND" ? "text-4 amber middle" : "text-4 green middle");
                this.noAutolandVisibility.set(text === "AUTOLAND" ? "visible" : "hidden");

                this.handleAFDSBoxes(text);
            });
    }

    public render(): VNode {
        return (
            <g>
                <text x="349" y="165" class={this.autolandClass}>
                    {this.afdsStatusText}
                </text>
                <text x="349" y="133" visibility={this.noAutolandVisibility} class={this.autolandClass}>
                    NO
                </text>
                <rect
                    x="267"
                    y="133"
                    visibility={this.greenBoxVisibility}
                    width="164"
                    height="34"
                    fill="none"
                    class="line"
                    stroke="lime"
                    stroke-width="3"
                />
                <path
                    d="M 267 133, h59, v-34, h46, v34, h59, v34, h-164, Z"
                    visibility={this.amberBoxVisibility}
                    class="line"
                    stroke="#ffc400"
                    stroke-width="3"
                    fill="none"
                />
            </g>
        );
    }
}
