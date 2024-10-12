import styled from "styled-components";

export const ChartControlContainer = styled.div<{ viewerTheme?: "os" | "fzpro" }>`
    background: ${(props) => (props.viewerTheme === "os" ? props.theme.invert.primary : "#40444D")};
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 60px;
    right: 20px;
    border-radius: 15px;
    z-index: 999;
    ${(props) => props.viewerTheme === "os" && `border: 1px solid ${props.theme.border};`}
    ${(props) => props.viewerTheme === "os" && "box-shadow: 2px 2px 13.5px 7px rgba(0, 0, 0, 0.1);"}
`;

export const ChartControlItem = styled.div<{ viewerTheme?: "os" | "fzpro" }>`
    width: 75px;
    height: 75px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid ${(props) => props.theme.border};

    &:last-child {
        border: none;
    }
`;

export const PdfPageSelector = styled.div<{ viewerTheme?: "os" | "fzpro" }>`
    background: ${(props) => (props.viewerTheme === "os" ? props.theme.invert.primary : "#40444D")};
    display: flex;
    position: absolute;
    top: 60px;
    left: 20px;
    border-radius: 15px;
    z-index: 999;
    font-size: 26px;
    color: ${(props) => (props.viewerTheme === "os" ? props.theme.select : "white")};
    ${(props) => props.viewerTheme === "os" && `border: 1px solid ${props.theme.border};`}
    ${({ viewerTheme }) => viewerTheme === "os" && "box-shadow: 2px 2px 10px #b9b9bb;"}

    .count {
        border-left: 1px solid ${(props) => props.theme.border};
        border-right: 1px solid ${(props) => props.theme.border};
        padding: 15px;
    }

    .button {
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
