import React, { FC, useContext } from "react";
import { IoIosSpeedometer } from "react-icons/io";
import { BigValue, Unit, Widget } from "./Widget";
import { WeatherContext } from "../WeatherContext";

export const Qnh: FC<{ value: number, unit: string }> = ({ value, unit }) => {
    const { theme } = useContext(WeatherContext);

    return (
        <Widget title="QNH" icon={<IoIosSpeedometer fill={theme.accentTextColor} size={18} />}>
            <div>
                <BigValue>{unit === "inHg" ? value.toFixed(2) : value}</BigValue>
                <Unit>{unit}</Unit>
            </div>
        </Widget>
    );
};
