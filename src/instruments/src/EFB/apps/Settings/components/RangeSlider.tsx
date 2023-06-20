import React, { FC, useState } from "react";
import { useSimVar } from "react-msfs";
import {
  usePersistentNumberProperty,
  usePersistentProperty,
} from "@instruments/common/persistence";

import "../styles/RangeSliderStyle.css";

const MAX = 100;

type StyledRangeSliderProps = {
  simVarName: string;
  simVarType: string;
  defaultValue: number;
};

export const StyledRangeSlider: FC<StyledRangeSliderProps> = ({
  simVarName,
  simVarType,
  defaultValue,
}) => {
  const [simVar, setSimVar] = useSimVar(simVarName, simVarType);
  const [value, setValue] = useState(defaultValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    setValue(value);
    setSimVar(value);
    //console.log(value)
  };

  const getBackgroundSize = () => {
    return { backgroundSize: `${(value * 100) / MAX}% 100%` };
  };

  return (
    <div style={{ width: 650, marginTop: -12 }}>
      <input
        type="range"
        min="0"
        max={MAX}
        onChange={onChange}
        style={getBackgroundSize()}
        value={value}
      />
    </div>
  );
};
