/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";
import { PFDSimvars } from "../SimVarPublisher";

import { MetresDisplay } from "./MetresDisplay";
import { BaroSetting } from "./BaroSetting";
import { Minimums } from "./Minimums";
import { RadioAltimeter } from "./RadioAltimeter";

export class AltitudeTape extends DisplayComponent<{ bus: EventBus }> {
    private originElevation = 0;
    private destinationElevation = 0;
    private isHalfway = false;

    private transform = Subject.create("");
    private bgD = Subject.create("");

    private noTdzVisibility = Subject.create("hidden");
    private tdzVisibility = Subject.create("hidden");
    private tdzD = Subject.create("");

    private handleTdz() {
        const tdzUnavailable = this.originElevation === -1 && this.destinationElevation === -1;

        this.noTdzVisibility.set(tdzUnavailable ? "visible" : "hidden");
        this.tdzVisibility.set(tdzUnavailable ? "hidden" : "visible");
        this.tdzD.set(`M 550 ${
            382 + (this.isHalfway ? this.destinationElevation : this.originElevation) * -0.68
        }, h 100, m -5 0, l 5 5, m -5 -5, m -10.6 0, l 18 18,
            m-18 -18, m-10.6 0, l 28 28, m-28 -28, m-10.6 0, l38 38, m-38 -38,
            m-10.6 0, l38 38, m-38 -38, m-10.6 0, l38 38, m-38 -38, m-10.6 0,
            l38 38, m-38 -38, m-10.6 0, l38 38, m-38 -38, m-10.6 0, l38 38, m-38 -38,
            m-10.6 0, l38 38, m-10.6 0, l-27.5 -27.5, m0 10.6, l16.75 16.75`);
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("altitude")
            .withPrecision(0)
            .handle((altitude) => {
                this.transform.set(`translate(50 ${altitude * 0.68})`);
                this.bgD.set(`M 567 ${332 - altitude * 0.68}, h 73, v 100, h -73, Z`);
            });

        sub.on("originElevation")
            .whenChanged()
            .handle((elevation) => {
                this.originElevation = elevation;
                this.handleTdz();
            });

        sub.on("destinationElevation")
            .whenChanged()
            .handle((elevation) => {
                this.destinationElevation = elevation;
                this.handleTdz();
            });

        sub.on("passedHalfway")
            .whenChanged()
            .handle((halfway) => {
                this.isHalfway = halfway;
                this.handleTdz();
            });
    }

    // TODO: make 500 feet lines shorter
    public render(): VNode {
        const lineStyle = "stroke-linejoin: miter; stroke-linecap: butt; paint-order: stroke;";
        return (
            <g>
                <clipPath id="altitudetape-clip">
                    <path d="M575 100, h125, v560, h-125 Z" />
                </clipPath>

                <path class="gray-bg" d="M600 100, h100 v560 h-100 Z" />

                <g clip-path="url(#altitudetape-clip)">
                    <g transform={this.transform}>
                        {Array.from({ length: 501 }, (_, i) => (
                            <BlackOutlineLine
                                d={`${(i * 200) % 500 === 0 ? "M540" : "M550"} ${i * -68 + 382}, ${(i * 200) % 500 === 0 ? "h25" : "h15"}`}
                                whiteStroke={(i * 200) % 500 === 0 ? 8 : 3}
                                blackStroke={(i * 200) % 500 === 0 ? 10 : 5}
                                styleColor={lineStyle}
                                styleBlack={lineStyle}
                            />
                        ))}
                        {Array.from({ length: 9 }, (_, i) => (
                            <BlackOutlineLine
                                d={`${(i * 200) % 500 === 0 ? "M540" : "M550"} ${i * 68 + 382}, ${(i * 200) % 500 === 0 ? "h25" : "h15"}`}
                                whiteStroke={(i * 200) % 500 === 0 ? 8 : 3}
                                blackStroke={(i * 200) % 500 === 0 ? 10 : 5}
                                styleColor={lineStyle}
                                styleBlack={lineStyle}
                            />
                        ))}
                        {Array.from({ length: 51 }, (_, i) => (
                            <>
                                <BlackOutlineLine d={`M570 ${i * -680 + 365}, h79`} whiteStroke={4} blackStroke={5} />
                                <BlackOutlineLine d={`M570 ${i * -680 + 365 + 34}, h79`} whiteStroke={4} blackStroke={5} />
                            </>
                        ))}

                        {Array.from({ length: 251 }, (_, i) => {
                            const y = i * -136 + 382 + 11;
                            const text = (i * 200).toFixed(0);
                            const hundredsText = text.substring(text.length - 3);
                            let thousandsText = text.substring(0, 2);
                            if (i < 5) {
                                thousandsText = "";
                            } else if (i < 50) {
                                thousandsText = text.substring(0, 1);
                            }
                            return (
                                <>
                                    <text x="640" y={y} class="text-2" fill-opacity={0.9}>
                                        {hundredsText}
                                    </text>
                                    <text x="603" y={y} class="text-3" fill-opacity={0.9}>
                                        {thousandsText}
                                    </text>
                                </>
                            );
                        })}
                        {Array.from({ length: 5 }, (_, i) => {
                            const text = (i * 200).toFixed(0);
                            return (
                                <text x="638" y={i * 136 + 382 + 11} class="text-2" fill-opacity={0.85}>
                                    {i === 0 ? "" : `-${text.substring(text.length - 3)}`}
                                </text>
                            );
                        })}

                        <path class="gray-bg" d={this.bgD} />

                        <g visibility={this.tdzVisibility}>
                            <BlackOutlineLine d={this.tdzD} color="#ffc400" blackStroke={5} />
                        </g>

                        <AltitudeBugs bus={this.props.bus} />
                    </g>
                </g>

                <g visibility={this.noTdzVisibility}>
                    <text x="722" y="645" class="text-2 amber start">
                        NO
                    </text>
                    <text x="722" y="666" class="text-2 amber start">
                        TDZ
                    </text>
                </g>

                <MetresDisplay bus={this.props.bus} />
                <CommandAlt bus={this.props.bus} />
                <BaroSetting bus={this.props.bus} />
                <Minimums bus={this.props.bus} />
                <RadioAltimeter bus={this.props.bus} />
            </g>
        );
    }
}

class AltitudeBugs extends DisplayComponent<{ bus: EventBus }> {
    private altitude = 0;
    private selectedAltitude = 0;

    private altitudeBugD = Subject.create("");
    private minimumsBugD = Subject.create("");

    private handleAltitudeBug() {
        this.altitudeBugD.set(
            `M 550 ${Math.max(
                382 + (this.altitude + 420) * -0.68,
                Math.min(382 + this.selectedAltitude * -0.68, 382 + (this.altitude - 410) * -0.68)
            )}, l -10 15, v23, h50, v-76, h-50, v23, Z`
        );
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("altitude")
            .withPrecision(0)
            .handle((altitude) => {
                this.altitude = altitude;
                this.handleAltitudeBug();
            });

        sub.on("selectedAltitude")
            .withPrecision(0)
            .handle((altitude) => {
                this.selectedAltitude = altitude;
                this.handleAltitudeBug();
            });

        sub.on("baroMinimums")
            .whenChanged()
            .handle((minimums) => this.minimumsBugD.set(`M 650 ${382 + minimums * -0.68}, h -100, l-20 20, v -40, l20, 20`));
    }
    public render(): VNode {
        return (
            <>
                <BlackOutlineLine d={this.minimumsBugD} color="lime" whiteStroke={5} blackStroke={6} />
                <BlackOutlineLine d={this.altitudeBugD} color="#d570ff" blackStroke={5} styleBlack="fill: none;" styleColor="fill: none;" />
            </>
        );
    }
}

class CommandAlt extends DisplayComponent<{ bus: EventBus }> {
    private smallSelAltText = Subject.create("");
    private largeSelAltText = Subject.create("");

    private altAlertVisibility = Subject.create("hidden");

    private getSmallSelAltText(altitude: number): string {
        const string = altitude.toString();
        return string.substring(string.length - 3);
    }

    private getLargeSelAltText(altitude: number): string {
        return altitude < 1000 ? "" : altitude.toString().substring(0, altitude >= 10000 ? 2 : 1);
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("selectedAltitude")
            .withPrecision(0)
            .handle((altitude) => {
                this.smallSelAltText.set(this.getSmallSelAltText(altitude));
                this.largeSelAltText.set(this.getLargeSelAltText(altitude));
            });

        sub.on("altAlertStatus")
            .whenChanged()
            .handle((status) => this.altAlertVisibility.set(status === 1 ? "visible" : "hidden"));
    }

    public render(): VNode {
        return (
            <g>
                <text x="649" y="80" class="text-4 magenta">
                    {this.largeSelAltText}
                </text>
                <text x="695" y="80" class="text-3 magenta">
                    {this.smallSelAltText}
                </text>
                <path
                    stroke="white"
                    stroke-width="3"
                    stroke-linejoin="round"
                    d="M 602 48, h 96, v35, h-96, Z"
                    fill="none"
                    visibility={this.altAlertVisibility}
                />
            </g>
        );
    }
}
