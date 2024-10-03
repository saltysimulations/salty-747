import React, { ReactNode, FC, useContext } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import styled from "styled-components";
import { WeatherContext } from "../WeatherContext";

type WidgetProps = {
    title: string;
    icon?: ReactNode;
    gridRow?: string;
    gridColumn?: string;
    scrollable?: boolean;
    children?: ReactNode | ReactNode[];
};

export const Widget: FC<WidgetProps> = ({ title, icon, gridRow, gridColumn, scrollable, children }) => {
    const { theme } = useContext(WeatherContext);

    return (
        <StyledWidget bg={theme.widgetColor} gridRow={gridRow ?? "auto"} gridColumn={gridColumn ?? "auto"}>
            <Title color={theme.accentTextColor}>
                {icon}
                <div>{title}</div>
            </Title>
            <ValueContainer>{scrollable ? <ScrollContainer className="widget-no-scroll">{children}</ScrollContainer> : children}</ValueContainer>
        </StyledWidget>
    );
};

export const BigValue = styled.div`
    font-size: 48px;
`;

export const Unit = styled.div`
    font-size: 32px;
`;

const ValueContainer = styled.div`
    height: 100%;
    padding: 10px 0 20px 0;
    font-size: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

type StyledWidgetProps = {
    bg: string;
    gridRow: string;
    gridColumn: string;
};

const StyledWidget = styled.div`
    border-radius: 25px;
    background: ${(props: StyledWidgetProps) => props.bg};
    box-shadow: 2px 2px 13.5px 7px rgba(0, 0, 0, 0.1);
    padding: 15px;
    color: white;
    overflow: hidden;
    grid-row: ${(props: StyledWidgetProps) => props.gridRow};
    grid-column: ${(props: StyledWidgetProps) => props.gridColumn};
`;

const Title = styled.div`
    display: flex;
    font-size: 18px;
    font-weight: 500;
    color: ${(props: { color: string }) => props.color};
    align-items: center;

    * {
        margin: 0 4px;
    }
`;
