import React from "react";
import ReactDOM from "react-dom";
import { SimVarProvider, getRenderTarget } from "react-msfs";

export const render = (instrument: React.ReactElement) => {
    ReactDOM.render(<SimVarProvider>{instrument}</SimVarProvider>, getRenderTarget());
};
