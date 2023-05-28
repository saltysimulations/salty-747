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

import React, { FC } from "react";
import { render } from "../Common";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";

import { TopBar, BarProps } from "./components/TopBar";
import { HomeButton } from "./components/HomeButton";
import { HomeScreen } from "./apps/Home";
import { Maps } from "./apps/Maps";
import { Settings } from "./apps/Settings";
import { General } from "./apps/Settings/General";
import { Aircraft, Units } from "./apps/Settings/Aircraft";
import { IRSAlignment, PilotVisibility, Simulation } from "./apps/Settings/Simulation";

import "./index.scss";
import { Acars } from "./apps/Settings/Acars";
import { FZPro } from "./apps/FZPro";
import { NavigraphAuthProvider } from "./hooks/useNavigraphAuth";

const EFB: FC = () => {
    return (
        <Root>
            <NavigraphAuthProvider>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={<RouteElement component={<HomeScreen />} />} />
                        <Route
                            path="/maps"
                            element={<RouteElement component={<Maps />}
                                                   barProps={{textColor: "black", backdropFilter: "blur(8px)"}} />}
                        />
                        <Route path="/settings"
                               element={<RouteElement component={<Settings />} barProps={{textColor: "black"}} />}>
                            <Route path="general" element={<General />} />
                            <Route path="aircraft" element={<Aircraft />} />
                            <Route path="simulation" element={<Simulation />} />
                            <Route path="acars" element={<Acars />} />
                            <Route path="units" element={<Units />} />
                            <Route path="pilot-visibility" element={<PilotVisibility />} />
                            <Route path="irs-alignment" element={<IRSAlignment />} />
                        </Route>
                        <Route path="/fzpro" element={<RouteElement component={<FZPro />} />} />
                    </Routes>
                </MemoryRouter>
            </NavigraphAuthProvider>
        </Root>
    );
};

const RouteElement: FC<{ component: React.ReactNode; barProps?: BarProps }> = ({ component, barProps = {} }) => (
    <>
        <TopBar {...barProps} />
        <HomeButton />
        {component}
    </>
);

const Root = styled.div`
    width: 1430px;
    height: 1000px;
`;

render(<EFB />);
