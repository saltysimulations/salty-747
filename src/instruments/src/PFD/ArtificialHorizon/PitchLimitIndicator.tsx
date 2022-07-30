/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { PFDSimvars } from "../SimVarPublisher";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";

export class PitchLimitIndicator extends DisplayComponent<{ bus: EventBus }> {
    private airspeed = 0;
    private maneuveringSpeed = 0;
    private flapsHandle = 0;
    private altAboveGround = 0;
    private incidenceAlpha = 0;
    private stallAlpha = 0;

    private pliTransformRef = FSComponent.createRef<SVGGElement>();
    private visibility = Subject.create("hidden");

    // TODO: airspeed logic for flaps up pli
    private pliPitch(alpha: number, stallAlpha: number): number {
        return stallAlpha - alpha;
    }

    private isPliOn(airspeed: number, manSpeed: number, flapsHandle: number, alt: number) {
        return (airspeed < manSpeed || flapsHandle != 0) && alt > 10;
    }

    private degreesToPixels(angle: number): number {
        return angle < 0 ? Math.max(angle * 8, -12 * 8) : Math.min(angle * 8, 12 * 8);
    }

    private handlePitchLimitTransform() {
        this.pliTransformRef.instance.style.transform = `translate(0px, ${this.degreesToPixels(
            Math.max(-1 * this.pliPitch(this.incidenceAlpha, this.stallAlpha), -30)
        )}px)`;
    }

    private handleVisibility() {
        this.visibility.set(this.isPliOn(this.airspeed, this.maneuveringSpeed, this.flapsHandle, this.altAboveGround) ? "visible" : "hidden");
    }

    // wondering how i'm gonna find a way
    // it's over
    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("airspeed")
            .whenChangedBy(0.0625)
            .handle((airspeed) => {
                this.airspeed = airspeed;
                this.handleVisibility();
            });

        sub.on("maneuveringSpeed")
            .whenChangedBy(0.25)
            .handle((manSpeed) => {
                this.maneuveringSpeed = manSpeed;
                this.handleVisibility();
            });

        sub.on("flapsHandle")
            .whenChanged()
            .handle((flaps) => {
                this.flapsHandle = flaps;
                this.handleVisibility();
            });

        sub.on("altAboveGround")
            .withPrecision(1)
            .handle((altitude) => {
                this.altAboveGround = altitude;
                this.handleVisibility();
            });

        sub.on("incidenceAlpha")
            .whenChangedBy(0.05)
            .handle((alpha) => {
                this.incidenceAlpha = alpha;
                this.handlePitchLimitTransform();
            });

        sub.on("stallAlpha")
            .whenChangedBy(0.05)
            .handle((stallAlpha) => {
                this.stallAlpha = stallAlpha;
                this.handlePitchLimitTransform();
            });
    }

    public render(): VNode {
        return (
            <g ref={this.pliTransformRef} visibility={this.visibility}>
                <BlackOutlineLine
                    d="M416 382, h33, m 0 0, h-8, l9 -14, m-9 14, m-9 0, l9 -14, m-18 14, l9 -14, m-17 14, v10"
                    blackStroke={5}
                    color="#ffc400"
                    styleBlack="fill: none;"
                    styleColor="fill: none;"
                />
                <BlackOutlineLine
                    d="M282 382, h-33, m 0 0, h8, l-9 -14, m9 14, m9 0, l-9 -14, m18 14, l-9 -14, m17 14, v10"
                    blackStroke={5}
                    color="#ffc400"
                    styleBlack="fill: none;"
                    styleColor="fill: none;"
                />
            </g>
        );
    }
}
