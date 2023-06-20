import React, { FC, useState } from "react";

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
  const [trueTone, setTrueTone] = usePersistentNumberProperty("TRUE_TONE", 0);
  const [autoBrightness, setAutoBrightness] = usePersistentNumberProperty("AUTO_BRIGHTNESS", 0);

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return (
    <ContentPageContainer title="Display & Brightness">
      <ItemGroup>
        <CategoryItem label="APPEARANCE" />
        <StyledBigItem>
          <div
            style={{
              width: 400,
              height: 350,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <img src={lightModeIcon} width="200" height="200" />
            <p style={{ color: "black", fontSize: 25 }}>Light</p>
            <Checkbox checked={true} onChange={handleCheckboxChange} />
          </div>
          <div
            style={{
              width: 400,
              height: 350,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <img src={darkModeIcon} width="200" height="200" />
            <p style={{ color: "black", fontSize: 25 }}>Dark</p>
            <Checkbox checked={false} onChange={handleCheckboxChange} />
          </div>
        </StyledBigItem>

        <SettingsItem noMouseDownEffect>
          <Toggle label="Automatic" enabled={autoBrightness === 1} onClick={(enabled) => setAutoBrightness(enabled ? 0 : 1)} />
        </SettingsItem>
      </ItemGroup>
      <ItemGroup>
        <CategoryItem label="BRIGHTNESS" />

        <SettingsItem noMouseDownEffect>
          <Container>
            <IconContainer icon={brightnessLow} marginLeft="2%" marginRight="auto" />

            <StyledRangeSlider simVarName="L:74S_EFB_BRIGHTNESS" simVarType="Number" defaultValue={50} />

            <IconContainer icon={brightnessFull} marginLeft="auto" marginRight="2%" />
          </Container>
        </SettingsItem>

        <Toggle label="True Tone" enabled={trueTone === 1} onClick={(enabled) => setTrueTone(enabled ? 0 : 1)} />
        <CategoryItem label="Automatically adapt saltPad based on ambient lighting conditions." />
      </ItemGroup>
    </ContentPageContainer>
  );
};

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
