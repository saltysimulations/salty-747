import { PresetConfig } from "@navigraph/leaflet";
import styled from "styled-components";
import React, { FC, useContext } from "react";
import { useMap } from "react-leaflet";
import { ChartControlContainer, ChartControlItem } from "../components/ChartControls";
import { AiOutlineZoomIn, AiOutlineZoomOut, IoIosMoon, IoIosSunny } from "react-icons/all";
import { FZProContext } from "../AppContext";

export const Controls: FC = () => {
    const map = useMap();
    const { enrouteChartPreset: preset, setEnrouteChartPreset: setPreset } = useContext(FZProContext);

    const nextSource = {
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
                    {preset.source.split(" ").map((sourceLine) => (
                        <div>{sourceLine}</div>
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
