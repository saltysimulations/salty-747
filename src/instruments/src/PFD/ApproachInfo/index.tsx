/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { PFDSimvars } from "../SimVarPublisher";

// TODO: RNP/ANP source
export class ApproachInfo extends DisplayComponent<{ bus: EventBus }> {
    private locFrequency = 0;
    private ilsIdent = "";
    private ilsHasSignal = false;
    private locCourse = 0;
    private dmeHasSignal = false;
    private dmeDistance = 0;

    private visibility = Subject.create("hidden");

    private ilsText = Subject.create("");
    private dmeText = Subject.create("");

    private getILSText(frequency: number, ident: string, hasSignal: boolean, course: number): string {
        let courseString = "";
        if (course < 10) {
            courseString = `00${course.toFixed(0)}°`;
        } else if (course < 100) {
            courseString = `0${course.toFixed(0)}°`;
        } else {
            courseString = `${course.toFixed(0)}°`;
        }
        return `${hasSignal ? ident : frequency.toFixed(2)}/${courseString}`;
    }

    private getDMEText(hasSignal: boolean, distance: number): string {
        const roundedDist = distance < 100 ? distance.toFixed(1) : distance.toFixed(0);
        return `DME\xa0${hasSignal && distance > 0 ? roundedDist : "---"}`;
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("locFrequency")
            .whenChanged()
            .handle((frequency) => {
                this.locFrequency = frequency;
                this.visibility.set(frequency !== 0 ? "visible" : "hidden");
                this.ilsText.set(this.getILSText(this.locFrequency, this.ilsIdent, this.ilsHasSignal, this.locCourse));
            });

        sub.on("ilsIdent")
            .whenChanged()
            .handle((ident) => {
                this.ilsIdent = ident;
                this.ilsText.set(this.getILSText(this.locFrequency, this.ilsIdent, this.ilsHasSignal, this.locCourse));
            });

        sub.on("locSignal")
            .whenChanged()
            .handle((signal) => {
                this.ilsHasSignal = signal;
                this.ilsText.set(this.getILSText(this.locFrequency, this.ilsIdent, this.ilsHasSignal, this.locCourse));
            });

        sub.on("locCourse")
            .whenChanged()
            .handle((course) => {
                this.locCourse = course;
                this.ilsText.set(this.getILSText(this.locFrequency, this.ilsIdent, this.ilsHasSignal, this.locCourse));
            });

        sub.on("dmeSignal")
            .whenChanged()
            .handle((signal) => {
                this.dmeHasSignal = signal;
                this.dmeText.set(this.getDMEText(this.dmeHasSignal, this.dmeDistance));
            });

        sub.on("dmeDistance")
            .withPrecision(1)
            .handle((distance) => {
                this.dmeDistance = distance;
                this.dmeText.set(this.getDMEText(this.dmeHasSignal, this.dmeDistance));
            });
    }

    public render(): VNode {
        return (
            <g visibility={this.visibility}>
                <text x="160" y="100" class="text-2 start">
                    {this.ilsText}
                </text>
                <text x="160" y="127" class="text-2 start">
                    {this.dmeText}
                </text>
            </g>
        );
    }
}
