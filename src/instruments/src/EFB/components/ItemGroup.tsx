import React, { FC, Children } from "react";
import styled from "styled-components";

export const ItemGroup: FC<{ children: React.ReactNode | React.ReactNode[], style?: React.CSSProperties}> = ({ children, style }) => (
    <StyledItemGroup single={Children.count(children) === 1} style={style}>{children}</StyledItemGroup>
);

export const StyledItemGroup = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 15px;
    margin: 55px 0;

    .item:nth-child(1) {
        border-radius: 15px 15px 0 0;
    }

    .item:last-child {
        border-radius: ${(props: { single?: boolean }) => (props.single ? "15px" : "0 0 15px 15px")};
    }
`;
