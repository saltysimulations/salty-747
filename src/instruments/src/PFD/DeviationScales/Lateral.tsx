/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";
import { PFDSimvars } from "../SimVarPublisher";

export class LateralDeviationScale extends DisplayComponent<{ bus: EventBus }> {
    private inboundLocCourse = 0;
    private locRadial = 0;
    private locSignal = false;
    private locFrequency = 0;
    private radioHeight = 0;
    private flightPhase = 0;

    private diamondRef = FSComponent.createRef<SVGPathElement>();

    private risingRunwayTransform = Subject.create("");
    private risingRunwayVisibility = Subject.create("hidden");
    private risingRunwayD = Subject.create("");
    private risingRunwayD2 = Subject.create("");

    private circlesGroupVisibility = Subject.create("hidden");
    private circlesVisibility = Subject.create("hidden");

    private expandedLocVisibility = Subject.create("hidden");

    private getRisingRunwayY(height: number): number {
        return height <= 200 ? -112 + Math.max(height * 0.56, -112) : 0;
    }

    private showExpandedLoc(locIndbCourse: number, locRadial: number): boolean {
        return Math.abs(locIndbCourse - (locRadial + 180 > 360 ? locRadial - 360 : locRadial + 180)) < 0.6;
    }

    private isLocAtMaxDeflection(locIndbCourse: number, locRadial: number): boolean {
        return Math.abs(locIndbCourse - (locRadial + 180 > 360 ? locRadial - 360 : locRadial + 180)) > 2.33;
    }

    private getLocDisplacement(locIndbCourse: number, locRadial: number): number {
        let x = locIndbCourse - (locRadial + 180 > 360 ? locRadial - 360 : locRadial + 180);
        if (x > 2.33) {
            x = 2.33;
        } else if (x < -2.33) {
            x = -2.33;
        }
        const sensitivity = this.showExpandedLoc(locIndbCourse, locRadial) ? 182 : 57;

        return 349 - x * sensitivity;
    }

    private handleDeviationScale() {
        this.diamondRef.instance.style.transform = `translate(${this.getLocDisplacement(this.inboundLocCourse, this.locRadial)}px, 0px)`;
        this.diamondRef.instance.style.fill = this.isLocAtMaxDeflection(this.inboundLocCourse, this.locRadial) ? "none" : "#d570ff";
        this.risingRunwayTransform.set(
            `translate(${this.getLocDisplacement(this.inboundLocCourse, this.locRadial)}, ${this.getRisingRunwayY(this.radioHeight)})`
        );
        this.circlesVisibility.set(!this.showExpandedLoc(this.inboundLocCourse, this.locRadial) && this.locFrequency !== 0 ? "visible" : "hidden");
        this.expandedLocVisibility.set(this.showExpandedLoc(this.inboundLocCourse, this.locRadial) ? "visible" : "hidden");
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("inboundLocCourse")
            .whenChanged()
            .handle((course) => {
                this.inboundLocCourse = course;
                this.handleDeviationScale();
            });

        sub.on("locRadial")
            .whenChanged()
            .handle((radial) => {
                this.locRadial = radial;
                this.handleDeviationScale();
            });

        sub.on("locSignal")
            .whenChanged()
            .handle((signal) => {
                this.locSignal = signal;
                this.diamondRef.instance.style.visibility = this.locSignal ? "visible" : "hidden";
                this.risingRunwayVisibility.set(this.flightPhase >= 3 && this.radioHeight < 2500 && this.locSignal ? "visible" : "hidden");
            });

        sub.on("altAboveGround")
            .withPrecision(0)
            .handle((altitude) => {
                this.radioHeight = altitude;
                this.handleDeviationScale();
                this.risingRunwayTransform.set(
                    `translate(${this.getLocDisplacement(this.inboundLocCourse, this.locRadial)}, ${this.getRisingRunwayY(this.radioHeight)})`
                );
                this.risingRunwayVisibility.set(this.flightPhase >= 3 && this.radioHeight < 2500 && this.locSignal ? "visible" : "hidden");
                this.risingRunwayD.set(`M -3 550, V${575 - this.getRisingRunwayY(this.radioHeight)}`);
                this.risingRunwayD2.set(`M 3 550, V${575 - this.getRisingRunwayY(this.radioHeight)}`);
            });

        sub.on("flightPhase")
            .whenChanged()
            .handle((phase) => {
                this.flightPhase = phase;
                this.risingRunwayVisibility.set(this.flightPhase >= 3 && this.radioHeight < 2500 && this.locSignal ? "visible" : "hidden");
            });

        sub.on("locFrequency")
            .whenChanged()
            .handle((frequency) => {
                this.locFrequency = frequency;
                this.handleDeviationScale();
                this.circlesGroupVisibility.set(frequency !== 0 ? "visible" : "hidden");
            });
    }

    public render(): VNode {
        return (
            <g>
                <path d="M 0 585, l-20 10, l20 10, l20, -10, Z" class="line" stroke="#d570ff" stroke-width="3" ref={this.diamondRef} />

                <g transform={this.risingRunwayTransform} visibility={this.risingRunwayVisibility} fill="none">
                    <BlackOutlineLine d="M 0 545, h-100, l10 -20, h180, l10 20, h-100, v-20 Z" color="lime" blackStroke={5} />
                    <BlackOutlineLine d={this.risingRunwayD} color="#d570ff" blackStroke={5} />
                    <BlackOutlineLine d={this.risingRunwayD2} color="#d570ff" blackStroke={5} />
                </g>

                <g visibility={this.circlesGroupVisibility}>
                    <BlackOutlineLine d="M349 580, v30" blackStroke={6} whiteStroke={4} />
                    <g visibility={this.circlesVisibility}>
                        <circle cx="292" cy="595" r="6" fill="none" class="fpv-outline" />
                        <circle cx="292" cy="595" r="6" fill="none" class="fpv-line" />
                        <circle cx="235" cy="595" r="6" fill="none" class="fpv-outline" />
                        <circle cx="235" cy="595" r="6" fill="none" class="fpv-line" />
                        <circle cx="406" cy="595" r="6" fill="none" class="fpv-outline" />
                        <circle cx="406" cy="595" r="6" fill="none" class="fpv-line" />
                        <circle cx="463" cy="595" r="6" fill="none" class="fpv-outline" />
                        <circle cx="463" cy="595" r="6" fill="none" class="fpv-line" />
                    </g>
                    <g visibility={this.expandedLocVisibility}>
                        <BlackOutlineLine
                            d="M252 589, h12, v12, h-12, Z"
                            blackStroke={6}
                            whiteStroke={4}
                            styleBlack="fill: none;"
                            styleColor="fill: none;"
                        />
                        <BlackOutlineLine
                            d="M446 589, h-12, v12, h12, Z"
                            blackStroke={6}
                            whiteStroke={4}
                            styleBlack="fill: none;"
                            styleColor="fill: none;"
                        />
                    </g>
                </g>
                <path d="M111 175, h45, v405, h-45 Z" />
                <path d="M539 175, h45, v405, h-45 Z" />
            </g>
        );
    }
}
