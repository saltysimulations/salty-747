/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { PFDSimvars } from "../SimVarPublisher";

export class BaroSetting extends DisplayComponent<{ bus: EventBus }> {
    private units = false;
    private baroHg = 0;
    private preselBaro = 0;

    private stdVisibility = Subject.create("hidden");

    private valueRef = FSComponent.createRef<SVGTextElement>();
    private unitsRef = FSComponent.createRef<SVGTextElement>();

    private preselVisibility = Subject.create("hidden");
    private preselContent = Subject.create("");

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("isStd")
            .whenChanged()
            .handle((std) => {
                this.stdVisibility.set(std ? "visible" : "hidden");
                this.valueRef.instance.style.visibility = std ? "hidden" : "visible";
                this.unitsRef.instance.style.visibility = std ? "hidden" : "visible";
            });

        sub.on("baroUnits")
            .whenChanged()
            .handle((units) => {
                this.units = units;
                this.valueRef.instance.setAttribute("x", units ? "680" : "685");
                this.valueRef.instance.innerHTML = this.units ? (this.baroHg * 33.86).toFixed(0) : this.baroHg.toFixed(2);

                this.unitsRef.instance.setAttribute("x", units ? "725" : "715");
                this.unitsRef.instance.innerHTML = units ? " HPA" : " IN";

                this.preselContent.set(this.units ? (this.preselBaro / 1600).toFixed(0) + " HPA" : (this.preselBaro / 54182.4).toFixed(2) + " IN");
            });

        sub.on("baroHg")
            .whenChanged()
            .handle((baro) => {
                this.baroHg = baro;
                this.valueRef.instance.innerHTML = this.units ? (this.baroHg * 33.86).toFixed(0) : this.baroHg.toFixed(2);
            });

        sub.on("preselBaroVisible")
            .whenChanged()
            .handle((presel) => this.preselVisibility.set(presel ? "visible" : "hidden"));

        sub.on("preselBaro")
            .whenChanged()
            .handle((baro) => {
                this.preselBaro = baro;
                this.preselContent.set(this.units ? (this.preselBaro / 1600).toFixed(0) + " HPA" : (this.preselBaro / 54182.4).toFixed(2) + " IN");
            });
    }

    public render(): VNode {
        return (
            <g>
                <text x="682" y="710" class="text-4 green" visibility={this.stdVisibility}>
                    STD
                </text>
                <text y="710" class="text-3 green" ref={this.valueRef} />
                <text y="710" class="text-2 green" ref={this.unitsRef} />
                <text x="720" y="745" visibility={this.preselVisibility} class="text-2">
                    {this.preselContent}
                </text>
            </g>
        );
    }
}
