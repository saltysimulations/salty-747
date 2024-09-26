import React, { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { AiOutlineRotateLeft, AiOutlineRotateRight, AiOutlineZoomIn, AiOutlineZoomOut, } from "react-icons/ai";
import { ChartControlContainer, ChartControlItem } from "./components/ChartControls";

type AirportChartViewerProps = {
    chartImage: Blob;
    canvasWidth: number;
    canvasHeight: number;
}

export const AirportChartViewer: FC<AirportChartViewerProps> = ({ chartImage, canvasWidth, canvasHeight }) => {
    const chartImageRef = useRef<HTMLImageElement>(null);
    const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);

    const [rotation, setRotation] = useState<number>(0);

    const chartControlIconProps = { color: "white", size: 45 };

    useEffect(() => {
        if (!chartImageRef.current || !transformComponentRef.current) return;

        chartImageRef.current.onload = () => {
            if (chartImageRef.current && transformComponentRef.current) {
                const x = -chartImageRef.current.clientWidth / 2 + canvasWidth / 2
                transformComponentRef.current.setTransform(x, 0, 1);
            }
        }
    }, [])

    return (
        <TransformWrapper limitToBounds={false} ref={transformComponentRef} minScale={0.5}>
            {({ zoomIn, zoomOut }) => (
                <StyledChartViewer>
                    <TransformComponent wrapperStyle={{ width: canvasWidth, height: canvasHeight }}>
                        <ChartContainer rotation={rotation}>
                            <img src={URL.createObjectURL(chartImage)} height={canvasHeight} ref={chartImageRef} />
                        </ChartContainer>
                    </TransformComponent>
                    <ChartControlContainer>
                        <ChartControlItem onClick={() => zoomIn()}>
                            <AiOutlineZoomIn {...chartControlIconProps} />
                        </ChartControlItem>
                        <ChartControlItem onClick={() => zoomOut()}>
                            <AiOutlineZoomOut {...chartControlIconProps} />
                        </ChartControlItem>
                        <ChartControlItem onClick={() => setRotation(rotation + 90)}>
                            <AiOutlineRotateRight {...chartControlIconProps} />
                        </ChartControlItem>
                        <ChartControlItem onClick={() => setRotation(rotation - 90)}>
                            <AiOutlineRotateLeft {...chartControlIconProps} />
                        </ChartControlItem>
                    </ChartControlContainer>
                </StyledChartViewer>
            )}
        </TransformWrapper>
    );
};

const StyledChartViewer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

const ChartContainer = styled.div`
    transform: rotate(${(props: { rotation: number }) => props.rotation}deg);
    transition: all 0.2s;
`;
