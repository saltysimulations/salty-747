import styled, { css } from "styled-components";

const button = css`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 20px;
    border-radius: 30px;
    font-size: 26px;

    * {
        margin: 0 7.5px;
    }
`;

export const PrimaryButton = styled.div`
    ${button}
    background: #4fa0fc;
    color: white;
`;

export const SecondaryButton = styled.div`
    ${button}
    background: #dfecff;
    color: #4fa0fc;
`;
