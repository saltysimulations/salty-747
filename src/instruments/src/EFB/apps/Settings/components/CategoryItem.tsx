import React, { FC } from "react";
import styled from "styled-components";

type CategoryItemProps = {
  label: string;
};

export const CategoryItem: FC<CategoryItemProps> = ({ label }) => (
  <StyledCategoryItem>{label}</StyledCategoryItem>
);

const StyledCategoryItem = styled.p`
  height: 40px;
  margin-left: 10px;
  margin-top: 5px;
  color: #9999;
  font-size: 20px;
  display: flex;
  align-items: center;
  overflow-wrap: break-word;
`;
