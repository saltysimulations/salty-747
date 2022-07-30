/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FSComponent, DisplayComponent, VNode, EventBus } from "msfssdk";
import { Horizon } from "./ArtificialHorizon/Horizon";
import { VerticalSpeedIndicator } from "./VerticalSpeedIndicator";
import { HeadingDisplay } from "./HeadingDisplay";
import { AirspeedScroller } from "./AirspeedIndicator/AirspeedScroller";
import { SpeedTape } from "./AirspeedIndicator/SpeedTape";
import { AltitudeScroller } from "./Altimeter/AltitudeScroller";
import { AltitudeTape } from "./Altimeter/AltitudeTape";
import { LateralDeviationScale } from "./DeviationScales/Lateral";
import { VerticalDeviationScale } from "./DeviationScales/Vertical";
import { ApproachInfo } from "./ApproachInfo";
import { FMA } from "./FMA";

export class PFD extends DisplayComponent<{ bus: EventBus }> {
    public render(): VNode {
        return (
            <svg className="pfd-svg" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                <Horizon bus={this.props.bus} />
                <LateralDeviationScale bus={this.props.bus} />
                <VerticalDeviationScale bus={this.props.bus} />
                <VerticalSpeedIndicator bus={this.props.bus} />
                <HeadingDisplay bus={this.props.bus} />
                <SpeedTape bus={this.props.bus} />
                <AirspeedScroller bus={this.props.bus} />
                <AltitudeTape bus={this.props.bus} />
                <AltitudeScroller bus={this.props.bus} />
                <ApproachInfo bus={this.props.bus} />
                <FMA bus={this.props.bus} />
            </svg>
        );
    }
}
