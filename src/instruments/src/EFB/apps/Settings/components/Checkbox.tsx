import React, { FC } from "react";
import styled from "styled-components";

import checkboxChecked from "../icons/checkbox-checked-icon.png";
import checkboxUnchecked from "../icons/checkbox-unchecked-icon.png";

type CheckboxProps = {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Checkbox: FC<CheckboxProps> = ({ checked, onChange }) => {
  return (
    <CheckboxContainer>
      <HiddenCheckbox checked={checked} onChange={onChange} />
      <StyledCheckbox checked={checked} />
    </CheckboxContainer>
  );
};

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledCheckbox = styled.label<{ checked: boolean }>`
  display: inline-block;
  width: 30px;
  height: 30px;
  background: ${(props) =>
    props.checked ? `url(${checkboxChecked})` : `url(${checkboxUnchecked})`};
  background-size: 100% 100%; /* Utilizza l'intera area del background */
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    cursor: pointer;
  }

  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2);
  }

  &:after {
    content: "";
    display: ${(props) => (props.checked ? "block" : "none")};
    position: absolute;
    top: 6px;
    left: 6px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #fff;
  }
`;
