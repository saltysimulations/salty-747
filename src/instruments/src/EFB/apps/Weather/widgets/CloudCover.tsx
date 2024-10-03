import { CloudQuantity, ICloud } from "@ninjomcs/metar-taf-parser-msfs";
import React, { FC, ReactNode, useContext } from "react";
import { IoMdCloud } from "react-icons/io";
import { RiSunFoggyFill } from "react-icons/ri";
import { BsCloudSunFill, BsCloudFill, BsCloudHaze2Fill } from "react-icons/bs";
import styled from "styled-components";
import { Widget } from "./Widget";
import { WeatherContext } from "../WeatherContext";

export const CloudCover: FC<{ clouds: ICloud[] }> = ({ clouds }) => {
    const { theme } = useContext(WeatherContext);

    const cloudAmountVisualization: Record<CloudQuantity, [string, ReactNode]> = {
        SKC: ["Clear", <></>],
        FEW: ["Few", <RiSunFoggyFill fill="white" size={38} />],
        SCT: ["Scattered", <BsCloudSunFill fill="white" size={38} />],
        BKN: ["Broken", <BsCloudFill fill="white" size={38} />],
        OVC: ["Overcast", <BsCloudHaze2Fill fill="white" size={38} />],
        NSC: ["", <></>],
    };

    return (
        <Widget title="CLOUD COVER" icon={<IoMdCloud fill={theme.accentTextColor} size={18} />} scrollable gridRow="3 / 4" gridColumn="1 / span 2">
            <List>
                {clouds.map((cloud, i) => (
                    <Entry key={i} border={theme.accentTextColor}>
                        <Amount>
                            {cloudAmountVisualization[cloud.quantity][1]}
                            <div>{cloudAmountVisualization[cloud.quantity][0]}</div>
                        </Amount>
                        <Height>{cloud.height}'</Height>
                    </Entry>
                ))}
            </List>
        </Widget>
    );
};

const Amount = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    padding: 10px 0;

    * {
        margin: 0 0 0 10px;
    }
`;

const Height = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex: 1;
    margin: 0 10px 0 0;
`;

const Entry = styled.div`
    display: flex;
    width: 100%;
    font-size: 28px;
    padding: 5px 0;
    border-bottom: 1px solid ${(props: { border: string }) => props.border};

    &:last-child {
        border-bottom: 0;
    }
`;

const List = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 20px 20px 20px;
    flex-shrink: 0;
`;
