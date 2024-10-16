import styled from "styled-components";
import React, { FC, useContext } from "react";
import { useMap } from "react-leaflet";
import { ChartControlContainer, ChartControlItem } from "../../../components/charts/ChartControls";
import {  IoIosMoon, IoIosSunny } from "react-icons/io";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { FZProContext } from "../AppContext";
import { NavigraphRasterSource } from "@navigraph/leaflet";

export const Controls: FC = () => {
    const map = useMap();
    const { enrouteChartPreset: preset, setEnrouteChartPreset: setPreset } = useContext(FZProContext);

    const nextSource: Record<NavigraphRasterSource, NavigraphRasterSource> = {
        "IFR HIGH": "VFR",
        VFR: "WORLD",
        WORLD: "IFR LOW",
        "IFR LOW": "IFR HIGH",
    } as const;

    return (
        <ChartControlContainer>
            <ChartControlItem onClick={() => map.zoomIn()}>
                <AiOutlineZoomIn color="white" size={45} />
            </ChartControlItem>
            <ChartControlItem onClick={() => map.zoomOut()}>
                <AiOutlineZoomOut color="white" size={45} />
            </ChartControlItem>
            <ChartControlItem
                onClick={() =>
                    setPreset(
                        preset.theme === "DAY"
                            ? { ...preset, theme: "NIGHT" }
                            : {
                                  ...preset,
                                  theme: "DAY",
                              }
                    )
                }
            >
                {preset.theme === "DAY" ? <IoIosMoon color="white" size={45} /> : <IoIosSunny color="white" size={45} />}
            </ChartControlItem>
            <ChartControlItem onClick={() => setPreset({ ...preset, type: "Navigraph", source: nextSource[preset.source] })}>
                <SourceIcon>
                    {preset.source.split(" ").map((sourceLine, i) => (
                        <div key={i}>{sourceLine}</div>
                    ))}
                </SourceIcon>
            </ChartControlItem>
        </ChartControlContainer>
    );
};

const SourceIcon = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 700;
    color: white;
`;
