import React, { FC } from "react";
import { useMap } from "react-leaflet";
import { ChartControlContainer, ChartControlItem } from "../../components/charts/ChartControls";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { useTheme } from "styled-components";

export const Controls: FC = () => {
    const map = useMap();
    const theme = useTheme();

    return (
        <ChartControlContainer viewerTheme="os">
            <ChartControlItem onClick={() => map.zoomIn()} viewerTheme="os">
                <AiOutlineZoomIn color={theme.select} size={45} />
            </ChartControlItem>
            <ChartControlItem onClick={() => map.zoomOut()} viewerTheme="os">
                <AiOutlineZoomOut color={theme.select} size={45} />
            </ChartControlItem>
        </ChartControlContainer>
    );
};
