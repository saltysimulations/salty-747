import styled from "styled-components";
import React, { FC } from "react";
import { AiFillCloseCircle } from "react-icons/all";
import { Chart } from "navigraph/charts"
import { ListItemDescription, ListItemLabel, ListItemTitle } from "./components/ListItems";
import { TitleAndClose } from "./components/TitleAndClose";
import ScrollContainer from "react-indiana-drag-scroll";

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
        <ScrollContainer style={{ width: "100%" }}>
            {charts.map((chart, i) => (
                <ChartSelectorItem selected={selectedChart ? selectedChart.id === chart.id : false} onClick={() => onSelect(chart)} key={i}>
                    <ListItemDescription>
                        <ListItemTitle>{chart.name}</ListItemTitle>
                        <ListItemLabel>{chart.index_number}</ListItemLabel>
                    </ListItemDescription>
                </ChartSelectorItem>
            ))}
        </ScrollContainer>
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
    background: #F0F4F8;
    display: flex;
    flex-direction: column;
    color: black;
    box-shadow: 2px 2px 10px #b9b9bb;
    overflow: hidden;
    z-index: 999;
`;

