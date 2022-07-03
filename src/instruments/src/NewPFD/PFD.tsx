import { FSComponent, DisplayComponent, VNode, EventBus } from "msfssdk";
import { Horizon } from "./ArtificialHorizon/Horizon";
import { VerticalSpeedIndicator } from "./VerticalSpeedIndicator";
import { HeadingDisplay } from "./HeadingDisplay";

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
            </svg>
        );
    }
}
