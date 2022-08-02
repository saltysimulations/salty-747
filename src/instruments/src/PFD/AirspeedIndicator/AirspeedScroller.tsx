/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";
import { PFDSimvars } from "../SimVarPublisher";

export class AirspeedScroller extends DisplayComponent<{ bus: EventBus }> {
    private hundredsTransform = Subject.create("");
    private tensTransform = Subject.create(`translate(0 ${this.getTensScrollerY(30)})`);
    private digitTransform = Subject.create(`translate(0 ${this.getDigitScrollerY(30)})`);

    private getHundredsScrollerY(airspeed: number): number {
        let scroll = Math.floor(airspeed / 100) * 49;

        if (Math.floor(airspeed).toString().slice(-1) === "9" && Math.floor(airspeed).toString().slice(-2, -1) === "9") {
            let speedOver99Int = Math.round(airspeed / 100) * 100 - 1 - airspeed;
            scroll = scroll + -speedOver99Int * 49;
        }

        return scroll;
    }

    private getTensScrollerY(airspeed: number): number {
        const value = Math.max(airspeed, 30) % 100;
        let scroll = Math.floor(value / 10) * 49;

        if (Math.floor(value).toString().slice(-1) === "9") {
            const speedOver9Int = Math.round(value / 10) * 10 - 1 - value;
            scroll = scroll + -speedOver9Int * 49;
        }

        return scroll;
    }

    private getDigitScrollerY(airspeed: number): number {
        return ((Math.max(airspeed, 30) % 100) % 10) * 33;
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("airspeed")
            .whenChangedBy(0.0625)
            .handle((airspeed) => {
                this.hundredsTransform.set(`translate(0 ${this.getHundredsScrollerY(airspeed)})`);
                this.tensTransform.set(`translate(0 ${this.getTensScrollerY(airspeed)})`);
                this.digitTransform.set(`translate(0 ${this.getDigitScrollerY(airspeed)})`);
            });
    }

    public render(): VNode {
        return (
            <g>
                <ScrollerBox bus={this.props.bus} />

                <clipPath id="asi-clip">
                    <path d="M 14 348, h64, v65, h-64 Z" />
                </clipPath>

                <g class="text-4" clip-path="url(#asi-clip)">
                    <g transform={this.hundredsTransform}>
                        {Array.from({ length: 5 }, (_, i) => (
                            <text x="35" y={200 + 49 * i}>
                                {(i == 4 ? "" : 4 - i).toString()}
                            </text>
                        ))}
                    </g>

                    <g transform={this.tensTransform}>
                        {Array.from({ length: 10 }, (_, i) => (
                            <text x="56" y={-45 + 49 * i}>
                                {(9 - i).toString()}
                            </text>
                        ))}
                        <text x="57" y="-94">
                            0
                        </text>
                    </g>

                    <g transform={this.digitTransform}>
                        {Array.from({ length: 10 }, (_, i) => (
                            <text x="77" y={99 + 33 * i}>
                                {(9 - i).toString()}
                            </text>
                        ))}
                        <text x="77" y="33">
                            1
                        </text>
                        <text x="77" y="66">
                            0
                        </text>
                        <text x="77" y="99">
                            9
                        </text>
                        <text x="77" y="429">
                            9
                        </text>
                    </g>
                </g>
            </g>
        );
    }
}

class ScrollerBox extends DisplayComponent<{ bus: EventBus }> {
    private airspeed = 0;
    private maneuveringSpeed = 0;
    private radioHeight = 0;

    private strokeWidth = Subject.create(3);
    private colour = Subject.create("white");

    private handleLowAirspeedIndication() {
        this.strokeWidth.set(Math.max(this.airspeed, 30) < this.maneuveringSpeed && this.radioHeight > 25 ? 9 : 3);
        this.colour.set(Math.max(this.airspeed, 30) < this.maneuveringSpeed && this.radioHeight > 25 ? "#ffc400" : "white");
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("airspeed")
            .whenChangedBy(0.0625)
            .handle((airspeed) => {
                this.airspeed = airspeed;
                this.handleLowAirspeedIndication();
            });

        sub.on("maneuveringSpeed")
            .whenChangedBy(0.25)
            .handle((manSpeed) => {
                this.maneuveringSpeed = manSpeed;
                this.handleLowAirspeedIndication();
            });

        sub.on("altAboveGround")
            .withPrecision(1)
            .handle((height) => {
                this.radioHeight = height;
                this.handleLowAirspeedIndication();
            });
    }

    public render(): VNode {
        return (
            <BlackOutlineLine
                d="M 10 342 h 72 v 28 l 14 11 l -14 11 v 28 h -72 Z"
                blackStroke={5}
                whiteStroke={this.strokeWidth}
                color={this.colour}
            />
        );
    }
}
