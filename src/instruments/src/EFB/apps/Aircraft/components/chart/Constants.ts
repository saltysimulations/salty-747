// Copyright (c) 2023-2024 FlyByWire Simulations
// SPDX-License-Identifier: GPL-3.0

import { AirframePerformanceEnvelope, PayloadChartLimits } from "./ChartWidget";

export const CanvasConst = Object.freeze({
    yScale: 200,
    cgAngle: Math.PI / 224,
    diamondWidth: 10,
    diamondHeight: 10,
    cgAxis: {
        xOffset: 0.02,
        xSpacing: 0.20,
        y: -0.08,
    },
    weightAxis: {
        x: -0.09,
        yOffset: -0.02,
        ySpacing: 0.22,
        units: {
            x: -0.17,
            y: 0.95,
        },
    },
});

export interface PerformanceEnvelope {
    mlw: number[][];
    mzfw: number[][];
    mtow: number[][];
    flight: number[][];
}

export interface ChartLimitsWeight {
    min: number;
    max: number;
    lines: number;
    scale: number;
    values: number[];
}

export interface ChartLimitsCg {
    angleRad: number;
    min: number;
    max: number;
    lines: number;
    scale: number;
    values: number[];
    overlap: number;
    highlight: number;
}

export interface ChartLabels {
    mtow: EnvelopeLabel;
    mlw: EnvelopeLabel;
    mzfw: EnvelopeLabel;
}

export interface EnvelopeLabel {
    x1: number;
    x2: number;
    y: number;
}
export interface ChartLimits {
    weight: ChartLimitsWeight;
    cg: ChartLimitsCg;
    labels: ChartLabels;
}

export const envelope: AirframePerformanceEnvelope = {
    mlw: [
        [13, 182345],
        [13, 341555],
        [18.3, 346090],
        [33, 346090],
        [33, 224528],
        [29, 204117],
        [27.8, 189148],
        [13, 182345],
    ],
    mzfw: [
        [13, 182345],
        [13, 325226],
        [16, 327684],
        [18.5, 329761],
        [33, 329761],
        [33, 224528],
        [29, 204117],
        [27.8, 189148],
        [13, 182345],
    ],
    mtow: [
        [13, 182345],
        [13, 318875],
        [11, 328854],
        [11, 352894],
        [15.2, 443250],
        [19, 447695],
        [24.1, 447695],
        [33, 426376],
        [33, 317515],
        [33, 272155],
        [29, 204117],
        [27.9, 189148],
        [13, 182345],
    ],
    flight: [
        [13, 182345],
    ],
};

export const chartLimits: PayloadChartLimits = {
    weight: {
        min: 137500,
        max: 475000,
        lines: 9,
        scale: 37500,
        values: [475, 400, 325, 250, 175],
    },
    cg: {
        angleRad: 0.014025,
        min: 8,
        max: 37,
        overlap: 32,
        highlight: 5,
        lines: 30,
        scale: 1,
        values: [10, 15, 20, 25, 30, 35],
    },
    labels: {
        mtow: { x1: 0.65, x2: 0.22, y: 0.05 },
        mlw: { x1: 0.65, x2: 0.22, y: 0.33 },
        mzfw: { x1: 0.65, x2: 0.22, y: 0.45 },
    },
};