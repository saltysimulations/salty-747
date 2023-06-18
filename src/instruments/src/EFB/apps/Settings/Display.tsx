import React, { FC } from "react";

import { useSimVar } from "react-msfs";
import { ContentPageContainer } from "./components/ContentPageContainer";
import { usePersistentNumberProperty, usePersistentProperty } from "@instruments/common/persistence";
import { ItemGroup } from "./components/ItemGroup";
import { Toggle } from "./components/Toggle";
import { SettingsItem } from "./components/SettingsItem";
import styled from "styled-components";

import { StyledRangeSlider } from "./components/RangeSlider";


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
    const [brightness, setBrightness] = useSimVar("L:74S_EFB_BRIGHTNESS", "number")
  
      return (
        <ContentPageContainer title="Display">
            <ItemGroup>
            <SettingsItem noMouseDownEffect>
            <Container>

            <IconContainer icon={brightnessLow} marginLeft = "2%" marginRight="auto" /> 

            <StyledRangeSlider simVarName="L:74S_EFB_BRIGHTNESS" simVarType="Number" defaultValue={50} />

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