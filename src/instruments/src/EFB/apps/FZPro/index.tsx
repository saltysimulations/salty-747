import React, { FC, useEffect, useRef, useState } from "react";

import { useNavigraphAuth } from "../../hooks/useNavigraphAuth";
import styled from "styled-components";

import { AirportChartViewer } from "./AirportChartViewer";
import { SignInPrompt } from "./SignInPrompt";
import { TopBar } from "./TopBar";

export const FZPro: FC = () => {
    const { user, initialized } = useNavigraphAuth();

    return (
        <RootContainer>
            {!initialized && <div>Loading</div>}

            {(initialized && !user) ? <SignInPrompt /> : (user && <App />)}
        </RootContainer>
    );
};

const App: FC = () => {
    const { getChartImage, getChartIndex } = useNavigraphAuth();

    const [chartImage, setChartImage] = useState<string | null>(null);

    const mainSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchChartUrl = async () => {
            const index = await getChartIndex("ENZV");
            const chart = index.apt[3];

            setChartImage(await getChartImage(chart.imageDayUrl));
        }

        void fetchChartUrl();
    }, [])

    return (
        <>
            <TopBar />
            <SideAndMainContainer>
                <SideBar />
                <MainSection ref={mainSectionRef}>
                    {chartImage && mainSectionRef.current && <AirportChartViewer
                        chartImage={chartImage}
                        canvasWidth={mainSectionRef.current.clientWidth}
                        canvasHeight={mainSectionRef.current.clientHeight}
                    />}
                </MainSection>
            </SideAndMainContainer>
        </>
    );
};

const RootContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const MainSection = styled.div`
    background: #F0F4F8;
    flex-grow: 1;
    display: flex;
`;

const SideAndMainContainer = styled.div`
    display: flex;
    width: 100%;
    flex-grow: 1;
`;

const SideBar: FC = () => {
    return <StyledSideBar />;
};

const StyledSideBar = styled.div`
    background: #22242D;
    width: 120px;
    border-top: 1px solid #40444D;
`;
