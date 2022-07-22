/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";
import { PFDSimvars } from "../SimVarPublisher";

export class VerticalDeviationScale extends DisplayComponent<{ bus: EventBus }> {
    private pathRef = FSComponent.createRef<SVGPathElement>();

    private circlesVisibility = Subject.create("hidden");

    private getGsDisplacement(gsError: number): number {
        let boundedY = gsError * -2.44;
        if (boundedY > 2.33) {
            boundedY = 2.33;
        } else if (boundedY < -2.33) {
            boundedY = -2.33;
        }

        return 381 - boundedY * 57;
    }

    private isGsAtMaxDeflection(gsError: number): boolean {
        return Math.abs(gsError) > 0.9553;
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("gsSignal")
            .whenChanged()
            .handle((signal) => (this.pathRef.instance.style.visibility = signal ? "visible" : "hidden"));

        sub.on("gsError")
            .whenChanged()
            .handle((error) => {
                this.pathRef.instance.setAttribute("d", `M 547 ${this.getGsDisplacement(error)}, l10 20, l10 -20, l-10 -20, Z`);
                this.pathRef.instance.style.fill = this.isGsAtMaxDeflection(error) ? "none" : "#d570ff";
            });

        sub.on("locFrequency")
            .whenChanged()
            .handle((frequency) => this.circlesVisibility.set(frequency !== 0 ? "visible" : "hidden"));
    }

    public render(): VNode {
        return (
            <g>
                <path class="line" stroke="#d570ff" stroke-width="3" ref={this.pathRef} />
                <g visibility={this.circlesVisibility}>
                    <BlackOutlineLine d="M542 381, h30" whiteStroke={4} blackStroke={6} />
                    <circle cx="557" cy="438" r="6" fill="none" class="fpv-outline" />
                    <circle cx="557" cy="438" r="6" fill="none" class="fpv-line" />
                    <circle cx="557" cy="495" r="6" fill="none" class="fpv-outline" />
                    <circle cx="557" cy="495" r="6" fill="none" class="fpv-line" />
                    <circle cx="557" cy="324" r="6" fill="none" class="fpv-outline" />
                    <circle cx="557" cy="324" r="6" fill="none" class="fpv-line" />
                    <circle cx="557" cy="267" r="6" fill="none" class="fpv-outline" />
                    <circle cx="557" cy="267" r="6" fill="none" class="fpv-line" />
                </g>
            </g>
        );
    }
}
