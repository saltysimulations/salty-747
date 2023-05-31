import React, { FC } from "react";

import { ContentPageContainer } from "./components/ContentPageContainer";
import { usePersistentNumberProperty, usePersistentProperty } from "@instruments/common/persistence";
import { ItemGroup } from "./components/ItemGroup";
import { Toggle } from "./components/Toggle";
import { RangeSlider } from "./components/RangeSlider";
import { SettingsItem } from "./components/SettingsItem";
import styled from "styled-components";

import brightnessLow from "../../img/brightness-low.png";
import brightnessFull from "../../img/brightness-full.png";

interface IconContainerProps {
    icon: string;
    marginLeft: string;
    marginRight: string;
  }
  //<SliderContainer />
export const Display: FC = () => {
    const [trueTone, setTrueTone] = usePersistentNumberProperty("TRUE_TONE", 0);
    //const [brightnessSetting, setBrightnessSetting] = usePersistentNumberProperty('EFB_BRIGHTNESS', 0);
    const [defaultBrightness] = usePersistentNumberProperty('L:S747_EFB_BRIGHTNESS', 80); // Default Brightness Value here
    //<Slider enabled={true} onClick={handleSlider} value={defaultBrightness}  />
    const handleSlider = () => {
        return;
      };

      return (
        <ContentPageContainer title="Display">
            <ItemGroup>
            <SettingsItem noMouseDownEffect>
            <Container>

            <IconContainer icon={brightnessLow} marginLeft = "2%" marginRight="auto" /> 

            <RangeSlider />

            <IconContainer icon={brightnessFull} marginLeft = "auto" marginRight="2%" /> 

            </Container>

           </SettingsItem>

            <Toggle label="True Tone" enabled={trueTone === 1} onClick={(enabled) => setTrueTone(enabled ? 0 : 1) } />
            </ItemGroup>
        </ContentPageContainer>
    );
};

const Container = styled.div`
width: 95%;
height: 90%;
margin: 0 auto;
display: flex;
align-items: center;
justify-content: center;
`;

const SliderContainer = styled.input`
width: 85%;
height: 50%;
background: black;
`;

const IconContainer = styled.div<IconContainerProps>`
width: 36px;
height: 36px;
background: url(${(props) => props.icon});
background-size: 36px 36px;
margin-left: ${(props) => props.marginLeft};
margin-right: ${(props) => props.marginRight};
`;