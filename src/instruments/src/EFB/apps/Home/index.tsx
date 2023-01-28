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
import styled from "styled-components";
import { SiWikipedia } from "react-icons/si";
import { BsYoutube, BsCameraFill, BsGearWideConnected } from "react-icons/bs";
import { FaMapMarkerAlt, FaSafari } from "react-icons/fa";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { AiFillClockCircle, AiFillHome } from "react-icons/ai";

import { App } from "./App";
import { PageIndicators, PageIndicator } from "./PageIndicator";

import wallpaper from "../../img/salty-wallpaper-darkened.jpg";
import opt from "../../img/opt.png";

export const HomeScreen: FC = () => (
    <Home>
        <AppSection>
            <App name="Camera" bg="lightgray" icon={<BsCameraFill style={{ fill: "black", transform: "scale(3.5)" }} />} />
            <App name="Home" bg="white" icon={<AiFillHome style={{ fill: "#f2ba3f", transform: "scale(4.5)" }} />} />
            <App name="Clock" bg="black" icon={<AiFillClockCircle style={{ fill: "white", transform: "scale(4.5)" }} />} />
            <App name="HeadTime" bg="#30d140" icon={<BsFillCameraVideoFill style={{ fill: "white", transform: "scale(3.5)" }} />} />
        </AppSection>
        <PageIndicators>
            <PageIndicator highlighted />
            <PageIndicator />
        </PageIndicators>
        <FavoriteAppsContainer>
            <App bg="white" icon={<FaSafari style={{ fill: "#2ca3e8", transform: "scale(4.5)" }} />} />
            <App bg="#24b3e3" icon={<FaMapMarkerAlt style={{ fill: "white", transform: "scale(3.5)" }} />} route="/maps" />
            <App bg={`url(${opt})`} />
            <App bg="white" icon={<SiWikipedia style={{ fill: "black", transform: "scale(3.5)" }} />} />
            <App bg="white" icon={<BsYoutube style={{ fill: "red", transform: "scale(3.5)" }} />} />
            <App bg="gray" icon={<BsGearWideConnected style={{ fill: "white", transform: "scale(3.5)" }} />} route="/settings" />
        </FavoriteAppsContainer>
    </Home>
);

const Home = styled.div`
    background-image: url(${wallpaper});
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: cover;
    display: grid;
    grid-template-rows: 85% 0 auto;
    justify-items: center;
    align-items: center;
`;

const AppSection = styled.div`
    width: 85%;
    height: 80%;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(4, 1fr);
    justify-items: center;
    align-items: center;
`;

const FavoriteAppsContainer = styled.div`
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 35px;
    display: flex;
`;
