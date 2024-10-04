import React, { FC, useContext } from "react";
import { FaEye } from "react-icons/fa";
import { BigValue, Unit, Widget } from "./Widget";
import { WeatherContext } from "../WeatherContext";

export const Visibility: FC<{ visibility: number; unit: string }> = ({ visibility, unit }) => {
    const { theme } = useContext(WeatherContext);

    const getText = () => {
        let inMeters = visibility;

        if (unit === "SM") {
            inMeters = visibility * 1609.34;
        }

        if (inMeters >= 8000) {
            return "Perfectly clear view."
        } else if (inMeters >= 3000) {
            return "Relatively clear view."
        } else if (inMeters >= 1500) {
            return "Slightly obstructed view."
        } else if (inMeters < 1000) {
            return "Obstructed view."
        }
    };

    return (
        <Widget title="VISIBILITY" icon={<FaEye fill={theme.accentTextColor} size={18} />}>
            <div>
                <BigValue>{visibility === 9999 ? ">9999" : visibility}</BigValue>
                <Unit>{unit}</Unit>
            </div>
            <div>{getText()}</div>
        </Widget>
    );
};
