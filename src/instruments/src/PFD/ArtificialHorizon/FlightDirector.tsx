/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { PFDSimvars } from "../SimVarPublisher";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";

export class FlightDirector extends DisplayComponent<{ bus: EventBus }> {
    private pitch = 0;
    private roll = 0;
    private height = 0;
    private fdPitch = 0;
    private fdRoll = 0;
    private irsState = 0;
    private fdOn = false;

    private pitchGroup = FSComponent.createRef<SVGGElement>();
    private rollGroup = FSComponent.createRef<SVGGElement>();
    private visibility = Subject.create("hidden");

    private degreesToPixels(angle: number): number {
        return angle < 0 ? Math.max(angle * 8, -12 * 8) : Math.min(angle * 8, 12 * 8);
    }

    private handleTransform() {
        this.pitchGroup.instance.style.transform = `translate(0px, ${this.degreesToPixels((this.height < 5 ? -8 : this.fdPitch) - this.pitch)}px)`;

        this.rollGroup.instance.style.transform = `translate(${this.degreesToPixels((-this.fdRoll + this.roll) / 4)}px, 0px)`;
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("pitch")
            .withPrecision(2)
            .handle((pitch) => {
                this.pitch = pitch;
                this.handleTransform();
            });

        sub.on("roll")
            .withPrecision(2)
            .handle((roll) => {
                this.roll = roll;
                this.handleTransform();
            });

        sub.on("altAboveGround")
            .withPrecision(1)
            .handle((height) => {
                this.height = height;
                this.handleTransform();
            });

        sub.on("fdPitch")
            .whenChangedBy(0.05)
            .handle((fdPitch) => {
                this.fdPitch = fdPitch;
                this.handleTransform();
            });

        sub.on("fdRoll")
            .whenChangedBy(0.05)
            .handle((fdRoll) => {
                this.fdRoll = fdRoll;
                this.handleTransform();
            });

        sub.on("irsState")
            .whenChanged()
            .handle((irsState) => {
                this.irsState = irsState;
                this.visibility.set(this.fdOn && this.irsState === 2 ? "visible" : "hidden");
            });

        sub.on("fdOn")
            .whenChanged()
            .handle((fdOn) => {
                this.fdOn = fdOn;
                this.visibility.set(this.fdOn && this.irsState === 2 ? "visible" : "hidden");
            });
    }

    public render(): VNode {
        return (
            <g>
                <g ref={this.pitchGroup} visibility={this.visibility}>
                    <BlackOutlineLine d="M239 382, h220" color="#d570ff" whiteStroke={5} blackStroke={7} />
                </g>

                <g ref={this.rollGroup} visibility={this.visibility}>
                    <BlackOutlineLine d="M349 272, v220" color="#d570ff" whiteStroke={5} blackStroke={7} />
                </g>
            </g>
        );
    }
}
