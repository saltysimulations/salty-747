import React, { FC } from "react";
import styled from "styled-components";

import checkboxChecked from "../icons/checkbox-checked-icon.png";
import checkboxUnchecked from "../icons/checkbox-unchecked-icon.png";

type CheckboxProps = { enabled: boolean; onClick: (enabled: boolean) => void };

export const Checkbox: FC<CheckboxProps> = ({ enabled, onClick }) => (
  <StyledCheckboxContainer>
    <StyledCheckbox enabled={enabled} onClick={() => onClick(enabled)} />
  </StyledCheckboxContainer>
);

const StyledCheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const StyledCheckbox = styled.div`
  width: 36px;
  height: 36px;
  background: ${(props: { enabled: boolean }) => (props.enabled ? `url(${checkboxChecked})` : `url(${checkboxUnchecked})`)};
  background-size: 36px 36px;
  backgroundRepeat: 'no-repeat',
  align-items: center;
`;
