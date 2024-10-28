import React, { FC } from "react";
import styled from "styled-components";
import { WeatherTheme } from "../themes";

export const Compass: FC<{ degrees?: number; theme: WeatherTheme }> = ({ degrees, theme }) => (
    <StyledCompass color={theme.accentTextColor}>
        <InnerCompass bg={theme.widgetColor}>
            <Degrees>{degrees ?? "VRB"}</Degrees>
        </InnerCompass>
        <HorizontalAxis>
            <Direction>W</Direction>
            <Direction>E</Direction>
        </HorizontalAxis>
        <VerticalAxis>
            <Direction>N</Direction>
            <Direction>S</Direction>
        </VerticalAxis>
        {degrees && (
            <StyledArrow xmlns="http://www.w3.org/2000/svg" width={80} height={29} rotate={degrees}>
                <path fill="white" d="M61 15H11v-1h49m0-2 9 2.5-9 2.5" />
            </StyledArrow>
        )}
    </StyledCompass>
);

const StyledCompass = styled.div`
    width: 130px;
    height: 130px;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px dotted ${(props: { color: string }) => props.color};
    position: relative;
    text-align: center;
    color: ${(props: { color: string }) => props.color};
    z-index: 1;
`;

const Degrees = styled.div`
    font-size: 24px;
    color: white;
`;

const HorizontalAxis = styled.div`
    height: 95%;
    width: 95%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
`;

const VerticalAxis = styled.div`
    height: 95%;
    width: 95%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: absolute;
`;

const InnerCompass = styled.div`
    width: 50%;
    height: 50%;
    background: ${(props: { bg: string }) => props.bg};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
    box-shadow: 2px 2px 6px 3px rgba(0, 0, 0, 0.1);
    font-weight: 500;
`;

const Direction = styled.div`
    z-index: -1;
`;

const StyledArrow = styled.svg`
    width: 80px;
    height: 29px;
    transform-origin: center;
    transform: scale(2.2) rotate(${(props: { rotate: number }) => props.rotate - 90 + 180}deg);
    position: absolute;
    z-index: -1;
`;
