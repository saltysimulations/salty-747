/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { PFDSimvars } from "../../SimVarPublisher";

export class ValuePreviews extends DisplayComponent<{ bus: EventBus }> {
    private airspeed = 0;
    private vRef = 0;
    private v1 = 0;
    private landingFlaps = 0;
    private flightPhase = 0;

    private refTextVisibility = Subject.create("hidden");

    private refValuePreviewVisibility = Subject.create("hidden");
    private refValuePreview = Subject.create("");

    private v1PreviewVisibility = Subject.create("hidden");
    private v1PreviewText = Subject.create(0);

    private refValueText(vRef: number, landingFlaps: number): string {
        if (vRef) {
            switch (landingFlaps) {
                case 20:
                    return `--/${vRef.toString()}`;
                case 25:
                    return `25/${vRef.toString()}`;
                case 30:
                    return `30/${vRef.toString()}`;
            }
        }

        return "";
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("flightPhase")
            .whenChanged()
            .handle((phase) => {
                this.flightPhase = phase;
                this.v1PreviewVisibility.set(this.v1 - Math.max(this.airspeed, 30) > 55 && this.flightPhase <= 2 ? "visible" : "hidden");
            });

        sub.on("airspeed")
            .whenChangedBy(0.0625)
            .handle((airspeed) => {
                this.airspeed = airspeed;
                this.v1PreviewVisibility.set(this.v1 - Math.max(this.airspeed, 30) > 55 && this.flightPhase <= 2 ? "visible" : "hidden");
                this.refValuePreviewVisibility.set(Math.max(this.airspeed, 30) - this.vRef > 52.5 && this.vRef != 0 ? "visible" : "hidden");
            });

        sub.on("v1")
            .whenChanged()
            .handle((v1) => {
                this.v1 = v1;
                this.v1PreviewText.set(v1);
                this.v1PreviewVisibility.set(this.v1 - Math.max(this.airspeed, 30) > 55 && this.flightPhase <= 2 ? "visible" : "hidden");
            });

        sub.on("vRef")
            .whenChanged()
            .handle((vRef) => {
                this.vRef = vRef;
                this.refTextVisibility.set(this.vRef != 0 ? "visible" : "hidden");
                this.refValuePreview.set(this.refValueText(this.vRef, this.landingFlaps));
                this.refValuePreviewVisibility.set(Math.max(this.airspeed, 30) - this.vRef > 52.5 && this.vRef != 0 ? "visible" : "hidden");
            });

        sub.on("landingFlaps")
            .whenChanged()
            .handle((flaps) => {
                this.landingFlaps = flaps;
                this.refValuePreview.set(this.refValueText(this.vRef, this.landingFlaps));
            });
    }

    public render(): VNode {
        return (
            <>
                <text visibility={this.v1PreviewVisibility} x="155" y={155} class="text-2 green">
                    {this.v1PreviewText}
                </text>
                <text x="121" y={632} class="text-2 green start" visibility={this.refValuePreviewVisibility}>
                    REF
                </text>
                <text x="121" y={654} class="text-2 green start" visibility={this.refTextVisibility}>
                    {this.refValuePreview}
                </text>
            </>
        );
    }
}
