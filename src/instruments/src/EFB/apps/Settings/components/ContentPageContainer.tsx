import React, { FC } from "react";
import styled from "styled-components";
import { BackButton, BackButtonProps } from "./BackButton";

type ContentPageContainerProps = { title: string; children: React.ReactNode[] | React.ReactNode; backProps?: BackButtonProps };

export const ContentPageContainer: FC<ContentPageContainerProps> = ({ title, children, backProps }) => (
    <StyledContentPageContainer>
        <TitleGrid>
            {backProps && <BackButton {...backProps} />}
            <ContentPageLabel>{title}</ContentPageLabel>
        </TitleGrid>
        {children}
    </StyledContentPageContainer>
);

const TitleGrid = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 48px;
    align-items: center;
    justify-items: start;
    margin-bottom: 20px;
`;

const StyledContentPageContainer = styled.div`
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 28px;
    margin-top: 60px;
`;

export const ContentPageLabel = styled.div`
    font-weight: 700;
    justify-self: center;
    grid-column-start: 2;
    grid-column-end: 3;
`;
