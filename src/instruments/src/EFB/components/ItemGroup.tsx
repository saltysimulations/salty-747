import React, { FC, Children } from "react";
import styled from "styled-components";

export const ItemGroup: FC<{ children: React.ReactNode | React.ReactNode[]; style?: React.CSSProperties; label?: string; spacing?: number }> = ({
    children,
    style,
    label,
    spacing = 55,
}) => (
    <ItemGroupContainer spacing={spacing}>
        {label && <Label>{label}</Label>}
        <StyledItemGroup single={Children.count(children) === 1} style={style}>
            {children}
        </StyledItemGroup>
    </ItemGroupContainer>
);

export const StyledItemGroup = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 15px;

    .item:nth-child(1) {
        border-radius: 15px 15px 0 0;
    }

    .item:last-child {
        border-radius: ${(props: { single?: boolean }) => (props.single ? "15px" : "0 0 15px 15px")};
    }
`;

const ItemGroupContainer = styled.div<{ spacing: number }>`
    width: 100%;
    margin: ${({ spacing }) => spacing}px 0;
`;

const Label = styled.div`
    font-size: 20px;
    color: gray;
    font-weight: 300;
    padding: 10px 20px;
`;