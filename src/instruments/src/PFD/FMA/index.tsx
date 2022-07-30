/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus, Subject } from "msfssdk";
import { BlackOutlineLine } from "../Common/BlackOutlineLine";
import { PFDSimvars } from "../SimVarPublisher";

import { FMAColumn } from "./FMAColumn";
import { AFDSStatus } from "./AFDSStatus";

export class FMA extends DisplayComponent<{ bus: EventBus }> {
    private apOn = false;
    private fdOn = Subject.create(false);

    private autothrottleModes = ["", "THR REF", "THR", "IDLE", "SPD", "HOLD"];
    private autothrottleArmed = Subject.create(false);
    private autothrottleMode = Subject.create(0);
    private activeAutothrottleText = Subject.create("");

    private activeRollModes = ["", "TO/GA", "HDG HOLD", "HDG SEL", "LNAV", "LOC", "FAC", "ROLLOUT", "ATT"];
    private armedRollModes = ["", "LOC", "FAC", "LNAV", "ROLLOUT"];
    private activeRollMode = 0;
    private armedRollText = Subject.create("");
    private activeRollText = Subject.create("");

    private activePitchModes = ["", "TO/GA", "ALT", "VNAV ALT", "VNAV PTH", "VNAV SPD", "VNAV", "FLCH SPD", "V/S", "G/S", "G/P", "FLARE"];
    private armedPitchModes = ["", "G/S", "G/P", "VNAV", "FLARE"];
    private activePitchText = Subject.create("");
    private armedPitchText = Subject.create("");

    private handleAutothrottleMode() {
        this.activeAutothrottleText.set(
            this.autothrottleMode.get() < this.autothrottleModes.length && this.autothrottleArmed.get()
                ? this.autothrottleModes[this.autothrottleMode.get()]
                : ""
        );
    }
    private handleActiveRollMode() {
        this.activeRollText.set(
            this.activeRollMode < this.activeRollModes.length && (this.fdOn.get() || this.apOn) ? this.activeRollModes[this.activeRollMode] : ""
        );
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on("autothrottleArmed")
            .whenChanged()
            .handle((armed) => {
                this.autothrottleArmed.set(armed);
                this.handleAutothrottleMode();
            });

        sub.on("autothrottleMode")
            .whenChanged()
            .handle((mode) => {
                this.autothrottleMode.set(mode);
                this.handleAutothrottleMode();
            });

        sub.on("armedRollMode")
            .whenChanged()
            .handle((mode) => this.armedRollText.set(mode < this.armedRollModes.length ? this.armedRollModes[mode] : ""));

        sub.on("activeRollMode")
            .whenChanged()
            .handle((mode) => {
                this.activeRollMode = mode;
                this.handleActiveRollMode();
            });

        sub.on("fdOn")
            .whenChanged()
            .handle((fdOn) => {
                this.fdOn.set(fdOn);
                this.handleActiveRollMode();
            });

        sub.on("apOn")
            .whenChanged()
            .handle((apOn) => {
                this.apOn = apOn;
                this.handleActiveRollMode();
            });

        sub.on("activePitchMode")
            .whenChanged()
            .handle((mode) => this.activePitchText.set(mode < this.activePitchModes.length ? this.activePitchModes[mode] : ""));

        sub.on("armedPitchMode")
            .whenChanged()
            .handle((mode) => this.armedPitchText.set(mode < this.armedPitchModes.length ? this.armedPitchModes[mode] : ""));
    }

    public render(): VNode {
        return (
            <g>
                <path class="gray-bg" d="M130 10, h450, v50, h-450 Z" />

                <FMAColumn x={208} y={10} topText={this.activeAutothrottleText} />
                <FMAColumn x={356} y={10} topText={this.activeRollText} bottomText={this.armedRollText} extraHighlightVar={this.fdOn} />
                <FMAColumn x={505} y={10} topText={this.activePitchText} bottomText={this.armedPitchText} extraHighlightVar={this.fdOn} />
                <AFDSStatus bus={this.props.bus} />

                <BlackOutlineLine d="M286 10, v50" />
                <BlackOutlineLine d="M428 10, v50" />
            </g>
        );
    }
}
