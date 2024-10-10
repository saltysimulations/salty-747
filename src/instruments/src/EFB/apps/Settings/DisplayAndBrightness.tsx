import React, { FC, useContext } from "react";

import { ContentPageContainer } from "./components/ContentPageContainer";
import { ItemGroup } from "../../components/ItemGroup";
import { ListItem } from "../../components/ListItem";
import styled from "styled-components";
import { Range, getTrackBackground } from "react-range";
import { BsBrightnessHighFill, BsBrightnessLowFill } from "react-icons/bs";
import { Toggle } from "./components/Toggle";
import { Checkmark } from "./components/Checkmark";
import { SettingsContext } from "./SettingsContext";

export const DisplayAndBrightness: FC = () => {
    const { brightness, setBrightness } = useContext(SettingsContext);

    const min = 0.1;
    const max = 6;
    const step = 0.05;

    return (
        <ContentPageContainer title="Display & Brightness">
            <ItemGroup label="APPEARANCE">
                <ListItem noMouseDownEffect grow>
                    <ThemeContainer>
                        <Theme>
                            <ThemeExample bg="lightgray" />
                            <div>Light</div>
                            <Checkmark selected={true} />
                        </Theme>
                        <Theme>
                            <ThemeExample bg="#2e2e30" />
                            <div>Dark</div>
                            <Checkmark selected={false} />
                        </Theme>
                    </ThemeContainer>
                </ListItem>
                <Toggle label="Automatic" enabled={false} onClick={() => {}} />
            </ItemGroup>
            <ItemGroup label="BRIGHTNESS">
                <ListItem noMouseDownEffect>
                    <BsBrightnessLowFill fill="gray" size={42} style={{ margin: "20px" }} />
                    <Range
                        step={step}
                        min={min}
                        max={max}
                        values={[brightness]}
                        onChange={(values) => setBrightness(values[0])}
                        renderTrack={({ props, children }) => (
                            <TrackContainer onMouseDown={props.onMouseDown} onTouchStart={props.onTouchStart}>
                                <Track
                                    ref={props.ref}
                                    bg={getTrackBackground({
                                        values: [brightness],
                                        colors: ["#4FA0FC", "#e9e9eb"],
                                        min,
                                        max,
                                    })}
                                >
                                    {children}
                                </Track>
                            </TrackContainer>
                        )}
                        renderThumb={({ props }) => <Thumb {...props} key={props.key} />}
                    />
                    <BsBrightnessHighFill fill="gray" size={42} style={{ margin: "20px" }} />
                </ListItem>
                <Toggle label="Automatic" enabled={false} onClick={() => {}} />
            </ItemGroup>
        </ContentPageContainer>
    );
};

const ThemeExample = styled.div<{ bg: string }>`
    width: 120px;
    height: 170px;
    background: ${({ bg }) => bg};
    border-radius: 15px;
`;

const Theme = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    * {
        margin: 10px 0;
    }
`;

const ThemeContainer = styled.div`
    flex: 1;
    padding: 15px 50px;
    display: flex;
    justify-content: space-around;
`;

const Thumb = styled.div`
    height: 40px;
    width: 40px;
    background-color: white;
    border-radius: 50%;
    box-shadow: 2px 2px 13.5px 7px rgba(0, 0, 0, 0.1);
`;

const Track = styled.div<{ bg: string }>`
    height: 7px;
    width: 100%;
    border-radius: 10px;
    background: ${({ bg }) => bg};
`;

const TrackContainer = styled.div`
    height: 36px;
    display: flex;
    flex: 1;
    align-items: center;
`;
