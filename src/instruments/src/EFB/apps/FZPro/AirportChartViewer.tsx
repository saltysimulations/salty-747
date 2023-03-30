import React, { FC, useEffect, useRef } from "react";
import styled from "styled-components";

type AirportChartViewerProps = { chartImage: string, canvasWidth: number; canvasHeight: number; }
export const AirportChartViewer: FC<AirportChartViewerProps> = ({ chartImage, canvasWidth, canvasHeight }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas && canvas.getContext("2d");

        if (!context) return;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        draw(context);
    }, []);

    const draw = (ctx: CanvasRenderingContext2D) => {
        drawImage(ctx, 0);
    };

    const drawImage = (ctx: CanvasRenderingContext2D, rotation: number) => {
        const image = new Image();
        image.src = chartImage;

        image.onload = () => {
            ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2);

            const adjustedWidth = ctx.canvas.height * (image.width / image.height);
            const dx = ctx.canvas.width / 2 - adjustedWidth / 2;

            ctx.drawImage(image, 0, 0, image.width, image.height, dx, 0, adjustedWidth, ctx.canvas.height);

            ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
            ctx.rotate(-rotation * Math.PI / 180);
            ctx.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2);
        }
    };

    return <Canvas ref={canvasRef} />;
};

const Canvas = styled.canvas`
    flex-grow: 1;
`;