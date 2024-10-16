import React, { FC, useContext, useEffect, useState } from "react";
import { TbWindsock } from "react-icons/tb";
import { BigValue, Widget } from "./Widget";
import { WeatherContext } from "../WeatherContext";

type ObservedAtProps = {
    day: number;
    hour: number;
    minute: number;
};

export const ObservedAt: FC<ObservedAtProps> = ({ day, hour, minute }) => {
    const [now, setNow] = useState<Date>(new Date());

    const { theme } = useContext(WeatherContext);

    const getTimeDifferenceInMinutes = (day: number, hour: number, minute: number) => {
        const nowZulu = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes());

        const metarTimeZulu = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), day, hour, minute);

        return Math.abs((nowZulu - metarTimeZulu) / 60000);
    };

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000);

        return () => clearInterval(interval);
    }, [])

    return (
        <Widget title="OBSERVED AT" icon={<TbWindsock fill={theme.accentTextColor} size={18} />}>
            <div>
                <BigValue>{`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}Z`}</BigValue>
            </div>
            <div>{getTimeDifferenceInMinutes(day, hour, minute)} minutes ago</div>
        </Widget>
    );
};
