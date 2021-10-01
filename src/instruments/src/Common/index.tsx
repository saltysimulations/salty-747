import React, { FC } from "react";
import ReactDOM from "react-dom";
import { SimVarProvider, getRenderTarget } from "react-msfs";

export const render = (instrument: React.ReactElement) => {
    ReactDOM.render(<SimVarProvider>{instrument}</SimVarProvider>, getRenderTarget());
};

type GroupProps = {
    x: number;
    y: number;
    children: React.ReactNode;
};

export const SvgGroup: FC<GroupProps> = ({ x, y, children }) => <g transform={`translate(${x}, ${y})`}>{children}</g>;
