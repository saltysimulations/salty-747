import React, { FC, useContext } from "react";
import { FaDroplet } from "react-icons/fa6";
import { BigValue, Widget } from "./Widget";
import { WeatherContext } from "../WeatherContext";

export const DewPoint: FC<{ dewPoint: number; temperature: number }> = ({ dewPoint, temperature }) => {
    const { theme } = useContext(WeatherContext);

    const calculateRelativeHumidity = (dewPoint: number, temperature: number): number => {
        const beta = 17.625;
        const lambda = 243.04;

        const humidity = Math.pow(Math.E, (beta * dewPoint) / (lambda + dewPoint)) / Math.pow(Math.E, (beta * temperature) / (lambda + temperature));

        return Math.round(humidity * 100);
    };

    return (
        <Widget title="DEW POINT" icon={<FaDroplet fill={theme.accentTextColor} size={18} />}>
            <div>
                <BigValue>{dewPoint}° C</BigValue>
            </div>
            <div>The relative humidity is {calculateRelativeHumidity(dewPoint, temperature)}%.</div>
        </Widget>
    );
};
