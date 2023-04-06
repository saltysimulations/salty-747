import React, { FC, useEffect, useRef } from "react";
import styled from "styled-components";
import { TransformComponent, TransformWrapper, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

type AirportChartViewerProps = { chartImage: string, canvasWidth: number; canvasHeight: number; rotation: number; }

export const AirportChartViewer: FC<AirportChartViewerProps> = ({
                                                                    chartImage,
                                                                    canvasWidth,
                                                                    canvasHeight,
                                                                    rotation
                                                                }) => {
    const chartImageRef = useRef<HTMLImageElement>(null);
    const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);

    useEffect(() => {
        if (!chartImageRef.current) return;

        chartImageRef.current.onload = () => {
            if (chartImageRef.current && transformComponentRef.current) {
                if (isHorizontal(rotation)) {
                    const x = (canvasWidth - canvasHeight) / 2;
                    const y = -chartImageRef.current.clientHeight / 2 + canvasHeight / 2;
                    transformComponentRef.current.setTransform(x, y, 1)
                } else {
                    const x = -chartImageRef.current.clientWidth / 2 + canvasWidth / 2
                    transformComponentRef.current.setTransform(x, 0, 1);
                }
            }
        }
    }, [])

    const isHorizontal = (degrees: number) => degrees === 90 || degrees === 270;

    return (
        <TransformWrapper limitToBounds={false} ref={transformComponentRef}>
            <TransformComponent wrapperStyle={{ width: canvasWidth, height: canvasHeight }}>
                <ChartContainer rotation={rotation}>
                    <img src={chartImage} height={isHorizontal(rotation) ? canvasWidth : canvasHeight}
                         ref={chartImageRef} />
                </ChartContainer>
            </TransformComponent>
        </TransformWrapper>
    );
};

const ChartContainer = styled.div`
    transform: rotate(${(props: { rotation: number }) => props.rotation}deg);
    width: auto;
`;
