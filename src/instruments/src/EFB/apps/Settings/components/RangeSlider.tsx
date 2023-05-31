import React, { FC } from "react";
import styled from "styled-components";


export const RangeSlider: FC = () => {

  return (
    <div style={{width: 600}} >
    <RangeInput type="range" name="slider" min="0" max="11" />
    </div>
  );
};

const RangeInput = styled.input`
  width: 100%;
  height: 10px;
`;