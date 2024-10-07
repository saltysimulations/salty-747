import styled from "styled-components";

export const ChartControlContainer = styled.div<{ theme?: "os" | "fzpro" }>`
    background: ${({ theme }) => (theme === "os" ? "white" : "#40444D")};
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 60px;
    right: 20px;
    border-radius: 15px;
    z-index: 999;
    ${({ theme }) => theme === "os" && "border: 1px solid lightgray;"}
    ${({ theme }) => theme === "os" && "box-shadow: 2px 2px 13.5px 7px rgba(0, 0, 0, 0.1);"}
`;

export const ChartControlItem = styled.div<{ theme?: "os" | "fzpro" }>`
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

export const PdfPageSelector = styled.div<{ theme?: "os" | "fzpro" }>`
    background: ${({ theme }) => (theme === "os" ? "white" : "#40444D")};
    display: flex;
    position: absolute;
    top: 60px;
    left: 20px;
    border-radius: 15px;
    z-index: 999;
    font-size: 26px;
    color: ${({ theme }) => (theme === "os" ? "#4FA0FC" : "white")};
    ${({ theme }) => theme === "os" && "border: 1px solid lightgray;"}
    ${({ theme }) => theme === "os" && "box-shadow: 2px 2px 10px #b9b9bb;"}

    .count {
        border-left: 1px solid lightgray;
        border-right: 1px solid lightgray;
        padding: 15px;
    }

    .button {
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
