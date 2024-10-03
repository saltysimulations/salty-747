import React, { FC } from "react";
import styled from "styled-components";
import { Widget } from "./Widget";

export const Metar: FC<{ message: string }> = ({ message }) => (
    <Widget title="RAW METAR" scrollable gridRow="2 / 3" gridColumn="3 / span 2">
        <RawData>{message}</RawData>
    </Widget>
);

const RawData = styled.div`
    font-size: 26px;
`;
