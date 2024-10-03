import React, { FC, useContext } from "react";
import { FaEye } from "react-icons/fa";
import { BigValue, Unit, Widget } from "./Widget";
import { WeatherContext } from "../WeatherContext";

export const Visibility: FC<{ visibility: number; unit: string }> = ({ visibility, unit }) => {
    const { theme } = useContext(WeatherContext);

    return (
        <Widget title="VISIBILITY" icon={<FaEye fill={theme.accentTextColor} size={18} />}>
            <div>
                <BigValue>{visibility === 9999 ? ">9999" : visibility}</BigValue>
                <Unit>{unit}</Unit>
            </div>
            <div>Perfectly clear view.</div>
        </Widget>
    );
};
