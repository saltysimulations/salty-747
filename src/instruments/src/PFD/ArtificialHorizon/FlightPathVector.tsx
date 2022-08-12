/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject, HEvent } from "msfssdk";
import { PFDSimvars } from "../SimVarPublisher";

export class FlightPathVector extends DisplayComponent<{ bus: EventBus }> {
    private groundSpeed = 0;
    private verticalVelocity = 0;
    private horizontalVelocity = 0;
    private pitch = 0;
    private heading = 0;
    private track = 0;
    private irsState = 0;
    private isFpvOn = false;

    private fpvTransformRef = FSComponent.createRef<SVGGElement>();
    private fpvRotateSub = Subject.create("rotate(0deg)");
    private visibility = Subject.create("hidden");

    private fpvFailVisibility = Subject.create("hidden");

    private degreesToPixels(angle: number): number {
        let newAngle = angle;
        if (this.groundSpeed < 1) {
            newAngle = 0;
        }

        return newAngle < 0 ? Math.max(newAngle * 8, -16 * 8) : Math.min(newAngle * 8, 22.5 * 8);
    }

    private vertVecToPixels(): number {
        const fpa = (180 / Math.PI) * Math.asin(this.verticalVelocity / 60 / (this.horizontalVelocity / 60));
        return this.degreesToPixels(this.groundSpeed < 1 ? 0 : fpa + this.pitch);
    }

    private trackToPixels(): number {
        let driftAngle = this.heading - this.track;

        if (driftAngle > 180) {
            driftAngle -= 360;
        } else if (driftAngle < -180) {
            driftAngle += 360;
        }
        driftAngle = driftAngle > 0 ? Math.min(driftAngle, 35) : Math.max(driftAngle, -35);

        return this.degreesToPixels(driftAngle * -0.25);
    }

    private handleTransform() {
        this.fpvTransformRef.instance.style.transform = `translate(${this.trackToPixels()}px, ${-this.vertVecToPixels()}px)`;
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("groundSpeed")
            .whenChangedBy(0.125)
            .handle((gs) => {
                this.groundSpeed = gs;
                this.handleTransform();
            });

        sub.on("verticalVelocity")
            .withPrecision(1)
            .handle((verticalVelocity) => {
                this.verticalVelocity = verticalVelocity;
                this.handleTransform();
            });

        sub.on("horizontalVelocity")
            .withPrecision(1)
            .handle((horizontalVelocity) => {
                this.horizontalVelocity = horizontalVelocity;
                this.handleTransform();
            });

        sub.on("pitch")
            .withPrecision(2)
            .handle((pitch) => {
                this.pitch = pitch;
                this.handleTransform();
            });

        sub.on("trueHeading")
            .whenChangedBy(0.05)
            .handle((heading) => {
                this.heading = heading;
                this.handleTransform();
            });

        sub.on("trueTrack")
            .whenChangedBy(0.05)
            .handle((track) => {
                this.track = track;
                this.handleTransform();
            });

        sub.on("roll")
            .withPrecision(2)
            .handle((roll) => this.fpvRotateSub.set(`rotate(${-roll}deg)`));

        sub.on("irsState")
            .whenChanged()
            .handle((state) => {
                this.irsState = state;
                this.visibility.set(this.irsState === 2 && this.isFpvOn ? "visible" : "hidden");
                this.fpvFailVisibility.set(this.irsState === 0 && this.isFpvOn ? "visible" : "hidden");
            });

        sub.on("fpvOn")
            .whenChanged()
            .handle((fpvOn) => {
                this.isFpvOn = fpvOn;
                this.visibility.set(this.irsState === 2 && this.isFpvOn ? "visible" : "hidden");
                this.fpvFailVisibility.set(this.irsState === 0 && this.isFpvOn ? "visible" : "hidden");
            });

        const hEventSub = this.props.bus.getSubscriber<HEvent>();

        hEventSub.on("hEvent").handle((event) => {
            if (event === "B747_8_PFD_FPV") {
                SimVar.SetSimVarValue("L:SALTY_FPV_ON", "Bool", !this.isFpvOn);
            }
        });
    }

    public render(): VNode {
        return (
            <g>
                <g ref={this.fpvTransformRef}>
                    <g transform={this.fpvRotateSub} class="horizon-group" visibility={this.visibility}>
                        <path class="fpv-outline" d="M311 382, h28" />
                        <path class="fpv-outline" d="M359 382, h28" />
                        <path class="fpv-outline" d="M349 372, v-14" />
                        <circle class="fpv-outline" cx="349" cy="382" r="10" stroke="white" fill="none" />
                        <path class="fpv-line" d="M311 382, h28" />
                        <path class="fpv-line" d="M359 382, h28" />
                        <path class="fpv-line" d="M349 372, v-14" />
                        <circle class="fpv-line" cx="349" cy="382" r="10" fill="none" />
                    </g>
                </g>
                <g visibility={this.fpvFailVisibility}>
                    <rect x="196" y="270" width="52" height="27" class="line" fill="none" stroke-width="3" stroke="#ffc400" />
                    <text x="222" y="294" class="text-3 amber middle">
                        FPV
                    </text>
                </g>
            </g>
        );
    }
}
