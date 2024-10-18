import React, { FC, useContext } from "react";

import { ContentPageContainer } from "./components/ContentPageContainer";
import { ItemGroup } from "../../components/ItemGroup";
import { ListItem } from "../../components/ListItem";
import styled, { useTheme } from "styled-components";
import { Range, getTrackBackground } from "react-range";
import { BsBrightnessHighFill, BsBrightnessLowFill } from "react-icons/bs";
import { Toggle } from "./components/Toggle";
import { Checkmark } from "./components/Checkmark";
import { ThemeSwitchContext } from "../../lib/Theme";
import { BrightnessContext } from "../../lib/BrightnessContext";

import lightThemeExample from "./img/theme-light.jpg";
import darkThemeExample from "./img/theme-dark.jpg";

export const DisplayAndBrightness: FC = () => {
    const { brightness, setBrightness } = useContext(BrightnessContext);
    const { theme: selectedTheme, setTheme } = useContext(ThemeSwitchContext);
    const theme = useTheme();

    const min = 0.1;
    const max = 4;
    const step = 0.05;

    return (
        <ContentPageContainer title="Display & Brightness">
            <ItemGroup label="APPEARANCE">
                <ListItem noMouseDownEffect grow>
                    <ThemeContainer>
                        <Theme>
                            <ThemeExample bg={`url(${lightThemeExample})`} forTheme="light">
                                <div>9:42</div>
                                <div className="rect" />
                                <div className="rect" />
                            </ThemeExample>
                            <div>Light</div>
                            <Checkmark selected={selectedTheme === "light"} onClick={() => setTheme("light")} />
                        </Theme>
                        <Theme>
                            <ThemeExample bg={`url(${darkThemeExample})`} forTheme="dark">
                                <div>9:42</div>
                                <div className="rect" />
                                <div className="rect" />
                            </ThemeExample>
                            <div>Dark</div>
                            <Checkmark selected={selectedTheme === "dark"} onClick={() => setTheme("dark")} />
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
                                        colors: [theme.select, theme.border],
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

const ThemeExample = styled.div<{ bg: string; forTheme: "light" | "dark" }>`
    width: 120px;
    height: 170px;
    background: ${({ bg }) => bg};
    background-position: center;
    background-size: cover;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    padding: 10px 18px;
    font-size: 18px;

    .rect {
        background: ${({ forTheme }) => (forTheme === "light" ? "#e9e9eb" : "#1C1C1E")};
        width: 100%;
        height: 15px;
        opacity: 0.7;
        margin: 1px;
        border-radius: 5px;
    }

    * {
        margin: 3px;
    }
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
