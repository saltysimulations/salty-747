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
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #F0F4F8;
    border-radius: 20px;
    
    &:first-child {
        
    }
`;
