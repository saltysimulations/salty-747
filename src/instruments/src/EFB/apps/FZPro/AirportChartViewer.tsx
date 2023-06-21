import React, { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { TransformComponent, TransformWrapper, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import {
    AiOutlineRotateLeft,
    AiOutlineRotateRight,
    AiOutlineZoomIn,
    AiOutlineZoomOut,
} from "react-icons/all";

type AirportChartViewerProps = {
    chartImage: string;
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
                            <img
                                src={chartImage}
                                height={canvasHeight}
                                ref={chartImageRef}
                            />
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

const ChartControlContainer = styled.div`
    background: #40444D;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 60px;
    right: 20px;
    border-radius: 15px;
`;

const ChartControlItem = styled.div`
    width: 75px;
    height: 75px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #b9b9bb;

    &:last-child {
        border: none;
    }
`;

const ChartContainer = styled.div`
    transform: rotate(${(props: { rotation: number }) => props.rotation}deg);
    transition: all 0.2s;
`;
