import { FSComponent, DisplayComponent, VNode, EventBus } from "msfssdk";
import { Horizon } from "./ArtificialHorizon/Horizon";
import { VerticalSpeedIndicator } from "./VerticalSpeedIndicator";
import { HeadingDisplay } from "./HeadingDisplay";
import { AirspeedScroller } from "./AirspeedIndicator/AirspeedScroller";
import { SpeedTape } from "./AirspeedIndicator/SpeedTape";
import { AltitudeScroller } from "./Altimeter/AltitudeScroller";
import { AltitudeTape } from "./Altimeter/AltitudeTape";

export class PFD extends DisplayComponent<{ bus: EventBus }> {
    public render(): VNode {
        return (
            <svg className="pfd-svg" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                <Horizon bus={this.props.bus} />
                <VerticalSpeedIndicator bus={this.props.bus} />
                <HeadingDisplay bus={this.props.bus} />

                <path class="gray-bg" d="M13 100, h100 v560 h -100 Z" />
                <path class="gray-bg" d="M600 100, h100 v560 h-100 Z" />
                <path class="gray-bg" d="M130 10, h450, v50, h-450 Z" />
                <SpeedTape bus={this.props.bus} />
                <AirspeedScroller bus={this.props.bus} />

                <AltitudeTape bus={this.props.bus} />
                <AltitudeScroller bus={this.props.bus} />
            </svg>
        );
    }
}