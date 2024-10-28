import React, { FC } from "react";
import styled from "styled-components";

export const Modal: FC<{ children: React.ReactNode }> = ({ children }) => (
    <StyledModal>
        <div>
            {children}
        </div>
    </StyledModal>
);

const StyledModal = styled.div`
    position: absolute;
    font-size: 26px;
    color: ${(props) => props.theme.text};
    display: flex;
    justify-content: center;
    align-items: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: ${(props) => props.theme.primary};
    border-radius: 20px;
`;

export const Button = styled.div`
    padding: 20px 0;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props) => props.theme.select};
    font-size: 28px;

    .border {
        border-right: 1px solid ${(props) => props.theme.border};
    }
`;

export const ButtonSection = styled.div`
    display: flex;
    border-top: 1px solid ${(props) => props.theme.border};
`;

export const Title = styled.div`
    font-weight: 500;
    font-size: 28px;
    margin-bottom: 5px;
`;

export const Description = styled.div`
    font-size: 22px;
    text-align: center;
`;

export const TextSection = styled.div`
    padding: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 450px;
`;

export const InsideContainer = styled.div`
    display: flex;
    flex-direction: column;
`;
