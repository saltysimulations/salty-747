/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";
import { PFDSimvars } from "../SimVarPublisher";

export class AltitudeScroller extends DisplayComponent<{ bus: EventBus }> {
    private tenThousandsTransform = Subject.create("");
    private thousandsTransform = Subject.create("");
    private hundredsTransform = Subject.create("");
    private twentiesTransform = Subject.create("");

    private boxColor = Subject.create("white");
    private boxStroke = Subject.create(3);

    private getTenThousandsScrollerY(altitude: number): number {
        let scroll = Math.floor(altitude / 10000) * 49;

        if (Math.floor(altitude).toString().slice(-4, -1) == "998" || Math.floor(altitude).toString().slice(-4, -1) == "999") {
            const altOver9980 = Math.round(altitude / 10000) * 10000 - 20 - altitude;
            scroll = scroll - altOver9980 * (altitude >= 0 ? 2.45 : -2.45);
        }

        return scroll;
    }

    private getThousandsScrollerY(altitude: number): number {
        const value = altitude % 10000;
        let scroll = altitude >= 0 ? Math.floor(value / 1000) * 49 : Math.ceil(value / 1000) * -49;

        if (Math.floor(value).toString().slice(-3, -1) == "98" || Math.floor(value).toString().slice(-3, -1) == "99") {
            const altOver9980 = Math.round(value / 1000) * 1000 - 20 - value;
            scroll = scroll - altOver9980 * (altitude >= 0 ? 2.45 : -2.45);
        }

        return scroll;
    }

    private getHundredsScrollerY(altitude: number): number {
        const value = altitude % 1000;
        let scroll = altitude >= 0 ? Math.floor(value / 100) * 49 : Math.ceil(value / 100) * -49;

        if (Math.floor(value).toString().slice(-2, -1) == "8" || Math.floor(value).toString().slice(-2, -1) == "9") {
            const altOver80 = Math.round(value / 100) * 100 - 20 - value;
            scroll = scroll - altOver80 * (altitude >= 0 ? 2.45 : -2.45);
        }

        return scroll;
    }

    private getTwentiesScrollerY(altitude: number): number {
        const value = altitude % 100;
        return altitude >= 0 ? value * 1.3 : -value * 1.3;
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("altitude")
            .withPrecision(0)
            .handle((altitude) => {
                this.tenThousandsTransform.set(`translate(0 ${this.getTenThousandsScrollerY(altitude)})`);
                this.thousandsTransform.set(`translate(0 ${this.getThousandsScrollerY(altitude)})`);
                this.hundredsTransform.set(`translate(0 ${this.getHundredsScrollerY(altitude)})`);
                this.twentiesTransform.set(`translate(0 ${this.getTwentiesScrollerY(altitude)})`);
            });

        sub.on("altAlertStatus")
            .whenChanged()
            .handle((status) => {
                this.boxColor.set(status != 2 ? "white" : "#ffc400");
                this.boxStroke.set(status != 0 ? 9 : 3);
            });
    }

    public render(): VNode {
        return (
            <g>
                <BlackOutlineLine
                    d="M 632 342 h 104 v 78 h -104 v -28 l -14 -11 l 14 -11 Z"
                    blackStroke={5}
                    whiteStroke={this.boxStroke}
                    color={this.boxColor}
                />

                <clipPath id="alt-clip">
                    <path d="M 632 350 h 104 v 62 h -104 Z" />
                </clipPath>

                <g clip-path="url(#alt-clip)">
                    <g transform={this.tenThousandsTransform}>
                        {Array.from({ length: 6 }, (_, i) => (
                            <text class={i === 5 ? "tenk-marker" : "text-4"} x={i === 5 ? 658 : 659} y={i === 5 ? 396 : 151 + 49 * i}>
                                {i == 5 ? "@" : (5 - i).toString()}
                            </text>
                        ))}
                        <text class="text-4" x="659" y="445">
                            -
                        </text>
                    </g>

                    <g class="text-4" transform={this.thousandsTransform}>
                        {Array.from({ length: 10 }, (_, i) => (
                            <text x="681" y={-45 + 49 * i}>
                                {(9 - i).toString()}
                            </text>
                        ))}
                        <text x="681" y="-94">
                            0
                        </text>
                    </g>

                    <g class="text-3" transform={this.hundredsTransform}>
                        {Array.from({ length: 10 }, (_, i) => (
                            <text x="700" y={-49 + 49 * i}>
                                {(9 - i).toString()}
                            </text>
                        ))}

                        <text x="700" y="-147">
                            1
                        </text>
                        <text x="700" y="-98">
                            0
                        </text>
                        <text x="700" y="439">
                            9
                        </text>
                    </g>

                    <g class="text-3" transform={this.twentiesTransform}>
                        {Array.from({ length: 5 }, (_, i) => {
                            const text = (((9 - i) * 20) % 100).toFixed(0);
                            return (
                                <text x="732" y={26 * i + 288}>
                                    {text === "0" ? "00" : text}
                                </text>
                            );
                        })}
                        <text x="732" y="236">
                            20
                        </text>
                        <text x="732" y="262">
                            00
                        </text>
                        <text x="732" y="418">
                            80
                        </text>
                    </g>
                </g>
            </g>
        );
    }
}
