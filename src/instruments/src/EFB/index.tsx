/**
 * Salty 74S
 * Copyright (C) 2021 Salty Simulations and its contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import "core-js/actual/queue-microtask";
import React, { createContext, FC, ReactNode, useState } from "react";
import { render } from "../Common";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import styled from "styled-components";

import { TopBar, BarProps } from "./components/TopBar";
import { HomeButton } from "./components/HomeButton";
import { AnimatedLoad } from "./components/AnimatedLoad";
import { HomeScreen } from "./apps/Home";
import { Maps } from "./apps/Maps";
import { Settings } from "./apps/Settings";
import { General } from "./apps/Settings/General";
import { IRSAlignment, PilotVisibility, Aircraft } from "./apps/Settings/Aircraft";

import { Acars, AtisSourceOptions, MetarSourceOptions, TafSourceOptions } from "./apps/Settings/Acars";
import { FZPro } from "./apps/FZPro";
import { NavigraphAuthProvider } from "./hooks/useNavigraphAuth";
import { Aircraft as AircraftApp } from "./apps/Aircraft";
import { GroundServices } from "./apps/Aircraft/GroundServices";
import { FuelPayload } from "./apps/Aircraft/FuelPayload";
import { FZProContextProvider } from "./apps/FZPro/AppContext";

import "./index.scss";
import wallpaper from "./img/salty-wallpaper-darkened.jpg";
import { Accounts } from "./apps/Settings/Accounts";
import { SettingsContextProvider } from "./apps/Settings/SettingsContext";
import { About } from "./apps/Settings/About";
import { Weather } from "./apps/Weather";
import { WeatherContextProvider } from "./apps/Weather/WeatherContext";
import { Files } from "./apps/Files";
import { FilesContextProvider } from "./apps/Files/FilesContext";

export const ModalContext = createContext<{ modal: ReactNode | null; setModal: (modal: ReactNode | null) => void }>({
    modal: null,
    setModal: () => {},
});

const EFB: FC = () => {
    const location = useLocation();

    // prevent animations when the subroutes change
    const locationKey = location.pathname?.split("/")[1];

    const [modal, setModal] = useState<ReactNode | null>(null);

    return (
        <Root>
            <ModalContext.Provider value={{ modal, setModal }}>
                <NavigraphAuthProvider>
                    <WeatherContextProvider>
                        <SettingsContextProvider>
                            <FZProContextProvider>
                                <FilesContextProvider>
                                    <AppLoading>
                                        <AnimatePresence>
                                            <Routes location={location} key={locationKey}>
                                                <Route path="/" element={<RouteElement component={<HomeScreen />} noAnimation />} />
                                                <Route
                                                    path="/maps"
                                                    element={
                                                        <RouteElement
                                                            component={<Maps />}
                                                            barProps={{ textColor: "black", backdropFilter: "blur(8px)" }}
                                                        />
                                                    }
                                                />
                                                <Route
                                                    path="/settings"
                                                    element={<RouteElement component={<Settings />} barProps={{ textColor: "black" }} />}
                                                >
                                                    <Route path="general" element={<General />} />
                                                    <Route path="about" element={<About />} />
                                                    <Route path="aircraft" element={<Aircraft />} />
                                                    <Route path="acars" element={<Acars />} />
                                                    <Route path="metar-source" element={<MetarSourceOptions />} />
                                                    <Route path="taf-source" element={<TafSourceOptions />} />
                                                    <Route path="atis-source" element={<AtisSourceOptions />} />
                                                    <Route path="pilot-visibility" element={<PilotVisibility />} />
                                                    <Route path="irs-alignment" element={<IRSAlignment />} />
                                                    <Route path="accounts" element={<Accounts />} />
                                                </Route>
                                                <Route path="/fzpro" element={<RouteElement component={<FZPro />} />} />
                                                <Route
                                                    path="/aircraft"
                                                    element={<RouteElement component={<AircraftApp />} barProps={{ textColor: "black" }} />}
                                                >
                                                    <Route path="ground-services" element={<GroundServices />} />
                                                    <Route path="payload" element={<FuelPayload />} />
                                                </Route>
                                                <Route path="/weather" element={<RouteElement component={<Weather />} />} />
                                                <Route
                                                    path="/files"
                                                    element={<RouteElement component={<Files />} barProps={{ textColor: "black" }} />}
                                                />
                                            </Routes>
                                        </AnimatePresence>
                                    </AppLoading>
                                </FilesContextProvider>
                            </FZProContextProvider>
                        </SettingsContextProvider>
                    </WeatherContextProvider>
                </NavigraphAuthProvider>
                {modal && <ModalOverlay onClick={() => setModal(null)} />}
                {modal}
            </ModalContext.Provider>
        </Root>
    );
};

const RouteElement: FC<{ component: React.ReactNode; barProps?: BarProps; noAnimation?: boolean }> = ({
    component,
    barProps = {},
    noAnimation,
}) => (
    <>
        <TopBar {...barProps} />
        <HomeButton />
        {!noAnimation ? <AnimatedLoad>{component}</AnimatedLoad> : component}
    </>
);

const RouterWrapper: FC = () => (
    <MemoryRouter>
        <EFB />
    </MemoryRouter>
);

const ModalOverlay = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    background: black;
    opacity: 0.6;
`;

const AppLoading = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    background: url(${wallpaper});
    background-position: center;
    background-size: cover;
`;

const Root = styled.div`
    width: 1430px;
    height: 1000px;
`;

render(<RouterWrapper />);
