import React, { FC, useContext } from "react";
import { FaWind } from "react-icons/fa6";
import styled from "styled-components";
import { BigValue, Unit, Widget } from "./Widget";
import { WeatherContext } from "../WeatherContext";
import { Compass } from "../components/Compass";

export const Wind: FC<{ direction?: number; speed: number; gust?: number }> = ({ direction, speed, gust }) => {
    const { theme } = useContext(WeatherContext);

    return (
        <Widget title="WIND" icon={<FaWind fill={theme.accentTextColor} size={18} />} gridRow="1 / 2" gridColumn="3 / span 2">
            <WindContainer>
                <TextContainer>
                    {gust ? (
                        <>
                            <TextSection style={{ borderBottom: gust ? `1px solid ${theme.accentTextColor}` : "" }}>
                                <BigValue>{speed}</BigValue>
                                <WindType>
                                    <SmallUnit color={theme.accentTextColor}>KTS</SmallUnit>
                                    <div>Wind</div>
                                </WindType>
                            </TextSection>
                            <TextSection>
                                <BigValue>{gust}</BigValue>
                                <WindType>
                                    <SmallUnit color={theme.accentTextColor}>KTS</SmallUnit>
                                    <div>Gusting</div>
                                </WindType>
                            </TextSection>
                        </>
                    ) : (
                        <SingleTextSection>
                            <BigValue>{speed}</BigValue>
                            <Unit>KTS</Unit>
                        </SingleTextSection>
                    )}
                </TextContainer>
                <CompassContainer>
                    <Compass degrees={direction} theme={theme} />
                </CompassContainer>
            </WindContainer>
        </Widget>
    );
};

const WindType = styled.div`
    margin-left: 10px;
`;

const SmallUnit = styled.div`
    color: ${(props: { color: string }) => props.color};
    font-weight: 700;
    margin-bottom: 2px;
    font-size: 16px;
`;

const SingleTextSection = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    margin-left: 5px;
`;

const TextSection = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    font-size: 18px;
`;

const WindContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
`;

const TextContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 10px;
`;

const CompassContainer = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;

