/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";
import { PFDSimvars } from "../SimVarPublisher";

export class SpeedBands extends DisplayComponent<{ bus: EventBus }> {
    private airspeed = 0;
    private maneuveringSpeed = 0;
    private maxSpeed = 0;
    private minSpeed = 0;
    private onGround = false;
    private takeoffFlaps = 0;
    private actualFlapAngle = 0;

    private maneuveringSpeedBandVisibility = Subject.create("hidden");
    private minMaxSpeedBandVisibility = Subject.create("hidden");

    private maneuveringSpeedBandTransform = Subject.create("");
    private minimumSpeedBandTransform = Subject.create("");
    private maximumSpeedBandTransform = Subject.create("");

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("onGround")
            .whenChanged()
            .handle((onGround) => {
                this.onGround = onGround;
                this.minMaxSpeedBandVisibility.set(!onGround ? "visible" : "hidden");
                this.maneuveringSpeedBandVisibility.set(!this.onGround && this.takeoffFlaps !== this.actualFlapAngle ? "visible" : "hidden");
            });

        sub.on("takeoffFlaps")
            .whenChanged()
            .handle((flaps) => {
                this.takeoffFlaps = flaps;
                this.maneuveringSpeedBandVisibility.set(!this.onGround && this.takeoffFlaps !== this.actualFlapAngle ? "visible" : "hidden");
            });

        sub.on("actualFlapAngle")
            .whenChanged()
            .handle((angle) => {
                this.actualFlapAngle = angle;
                this.maneuveringSpeedBandVisibility.set(!this.onGround && this.takeoffFlaps !== this.actualFlapAngle ? "visible" : "hidden");
            });

        sub.on("airspeed")
            .whenChangedBy(0.0625)
            .handle((speed) => {
                this.airspeed = speed;
                this.maneuveringSpeedBandTransform.set(`translate(50 ${(Math.max(this.airspeed, 30) - this.maneuveringSpeed) * 4.6})`);
                this.maximumSpeedBandTransform.set(`translate(50 ${(Math.max(this.airspeed, 30) - this.maxSpeed) * 4.6})`);
                this.minimumSpeedBandTransform.set(`translate(50 ${(Math.max(this.airspeed, 30) - this.minSpeed) * 4.6})`);
            });

        sub.on("maneuveringSpeed")
            .whenChangedBy(0.25)
            .handle((speed) => {
                this.maneuveringSpeed = speed;
                this.maneuveringSpeedBandTransform.set(`translate(50 ${(Math.max(this.airspeed, 30) - this.maneuveringSpeed) * 4.6})`);
            });

        sub.on("maxSpeed")
            .withPrecision(0)
            .handle((speed) => {
                this.maxSpeed = speed;
                this.maximumSpeedBandTransform.set(`translate(50 ${(Math.max(this.airspeed, 30) - this.maxSpeed) * 4.6})`);
            });

        sub.on("minSpeed")
            .withPrecision(0)
            .handle((speed) => {
                this.minSpeed = speed;
                this.minimumSpeedBandTransform.set(`translate(50 ${(Math.max(this.airspeed, 30) - this.minSpeed) * 4.6})`);
            });
    }

    public render(): VNode {
        return (
            <>
                <g visibility={this.maneuveringSpeedBandVisibility} transform={this.maneuveringSpeedBandTransform}>
                    <BlackOutlineLine d="M 62 382, h7, v 1800" color="#ffc400" blackStroke={5} />
                </g>

                <g visibility={this.minMaxSpeedBandVisibility} transform={this.maximumSpeedBandTransform}>
                    <path class="red-band" d="M 67 -1826, v 2209" />
                </g>

                <g visibility={this.minMaxSpeedBandVisibility} transform={this.minimumSpeedBandTransform}>
                    <path d="M 63 382, h9, v 1800, h-9, Z" fill="black" />
                    <path class="red-band" d="M 67 382, v 1800" fill="none" />
                </g>
            </>
        );
    }
}
