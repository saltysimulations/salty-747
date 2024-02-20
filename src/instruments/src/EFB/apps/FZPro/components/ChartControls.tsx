import styled from "styled-components";

export const ChartControlContainer = styled.div`
    background: #40444D;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 60px;
    right: 20px;
    border-radius: 15px;
    z-index: 999;
`;
export const ChartControlItem = styled.div`
    width: 75px;
    height: 75px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #b9b9bb;

    &:last-child {
        border: none;
    }
`;