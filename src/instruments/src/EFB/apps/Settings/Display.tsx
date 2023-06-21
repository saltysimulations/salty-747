import React, { FC } from "react";

import { useSimVar } from "react-msfs";
import { ContentPageContainer } from "./components/ContentPageContainer";
import { usePersistentNumberProperty, usePersistentProperty } from "@instruments/common/persistence";
import { ItemGroup } from "./components/ItemGroup";
import { Toggle } from "./components/Toggle";
import { SettingsItem } from "./components/SettingsItem";
import { CategoryItem } from "./components/CategoryItem";
import { Checkbox } from "./components/Checkbox";
import { StyledRangeSlider } from "./components/RangeSlider";

import styled from "styled-components";

import brightnessLow from "./icons/brightness-low.png";
import brightnessFull from "./icons/brightness-full.png";
import lightModeIcon from "./icons/light-mode-icon.png";
import darkModeIcon from "./icons/dark-mode-icon.png";

interface IconContainerProps {
  icon: string;
  marginLeft: string;
  marginRight: string;
}

export const Display: FC = () => {
  const [trueTone, setTrueTone] = usePersistentNumberProperty("74S_EFB_TRUE_TONE", 0);
  const [autoBrightness, setAutoBrightness] = usePersistentNumberProperty("74S_EFB_AUTO_BRIGHTNESS", 0);
  const [lightMode, setLightMode] = usePersistentNumberProperty("74S_EFB_LIGHT_MODE", 0); // 0 MEANS TRUE OR ENABLED!!
  const [darkMode, setDarkMode] = usePersistentNumberProperty("74S_EFB_DARK_MODE", 1);

  function setDisplayMode(mode: "light" | "dark") {
    if (mode === "light") {
      // Enable darkmode and disable lightmode
      setLightMode(1);
      setDarkMode(0);
    } else if (mode === "dark") {
      // Enable lightmode and disable darkmode
      setLightMode(0);
      setDarkMode(1);
    }
    //console.log(lightMode, darkMode);
  }
  return (
    <ContentPageContainer title="Display & Brightness">
      <ItemGroup>
        <CategoryItem label="APPEARANCE" />
        <StyledBigItem>
          <BigItemContainer>
            <img src={lightModeIcon} width="200" height="200" />
            <p style={{ color: "black", fontSize: 25 }}>Light</p>
            <Checkbox enabled={Boolean(lightMode)} onClick={() => setDisplayMode("light")} />
          </BigItemContainer>
          <BigItemContainer>
            <img src={darkModeIcon} width="200" height="200" />
            <p style={{ color: "black", fontSize: 25 }}>Dark</p>
            <Checkbox enabled={Boolean(darkMode)} onClick={() => setDisplayMode("dark")} />
          </BigItemContainer>
        </StyledBigItem>
        <SettingsItem noMouseDownEffect>
          <Toggle label="Automatic" enabled={Boolean(autoBrightness)} onClick={(enabled) => setAutoBrightness(enabled ? 0 : 1)} />
        </SettingsItem>
      </ItemGroup>
      <ItemGroup>
        <CategoryItem label="BRIGHTNESS" />

        <SettingsItem noMouseDownEffect>
          <Container>
            <IconContainer icon={brightnessLow} marginLeft="2%" marginRight="auto" />

            <StyledRangeSlider simVarName="L:74S_EFB_BRIGHTNESS" simVarType="Number" defaultValue={100} />

            <IconContainer icon={brightnessFull} marginLeft="auto" marginRight="2%" />
          </Container>
        </SettingsItem>

        <Toggle label="True Tone" enabled={Boolean(trueTone)} onClick={(enabled) => setTrueTone(enabled ? 0 : 1)} />
        <CategoryItem label="Automatically adapt saltPad based on ambient lighting conditions." />
      </ItemGroup>
    </ContentPageContainer>
  );
};

const BigItemContainer = styled.div`
  width: 400px;
  height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const StyledBigItem = styled.div`
  width: 100%;
  height: 350px;
  display: flex;
  flex-direction: row;
  background: #fff;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #b9b9bb;
  color: #000;
  transition: background 0.1s linear;

  .side {
    margin: 0 25px;
  }

  &:last-child {
    border: none;
  }
`;

const Container = styled.div`
  width: 95%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconContainer = styled.div<IconContainerProps>`
  width: 36px;
  height: 36px;
  background: url(${(props) => props.icon});
  background-size: 36px 36px;
  margin-left: ${(props) => props.marginLeft};
  margin-right: ${(props) => props.marginRight};
`;
