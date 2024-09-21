import styled from "styled-components";
import React, { FC } from "react";
import { AiFillCloseCircle } from "react-icons/all";
import { Chart } from "navigraph/charts"
import { ListItemDescription, ListItemLabel, ListItemTitle } from "./components/ListItems";
import { TitleAndClose } from "./components/TitleAndClose";

type ChartSelectorProps = {
    charts: Chart[],
    label: string,
    onClose: () => void,
    onSelect: (chart: Chart) => void,
    selectedChart: Chart | null,
}

export const ChartSelector: FC<ChartSelectorProps> = ({ charts, label, onClose, onSelect, selectedChart }) => (
    <ChartSelectorContainer>
        <TitleAndClose label={label} onClose={onClose} />
        {charts.map((chart) => (
            <ChartSelectorItem
                selected={selectedChart ? selectedChart.id === chart.id : false}
                onClick={() => onSelect(chart)}
            >
                <ListItemDescription>
                    <ListItemTitle>{chart.name}</ListItemTitle>
                    <ListItemLabel>{chart.index_number}</ListItemLabel>
                </ListItemDescription>
            </ChartSelectorItem>
        ))}
    </ChartSelectorContainer>
);

const ChartSelectorItem = styled.div`
    width: 100%;
    display: flex;
    border-bottom: 1px solid #b9b9bb;
    align-items: center;
    background: ${(props: { selected: boolean }) => props.selected ? "#CDE5F4" : "white"};;
`;

const ChartSelectorContainer = styled.div`
    width: 500px;
    height: 100%;
    border: 1px solid #b9b9bb;
    border-radius: 15px;
    position: absolute;
    background: #F0F4F8;
    display: flex;
    flex-direction: column;
    color: black;
    box-shadow: 2px 2px 10px #b9b9bb;
    overflow: hidden;

    * {
        flex-shrink: 0;
    }
`;

