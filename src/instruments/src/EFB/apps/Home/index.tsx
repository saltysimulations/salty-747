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
import { FaMapMarkerAlt, FaSafari, FaTruckLoading } from "react-icons/fa";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { AiFillClockCircle, AiFillHome } from "react-icons/ai";
import { IoPaperPlane, IoCloud, IoFolder } from "react-icons/io5";

import { App } from "./App";
import { PageIndicators, PageIndicator } from "./PageIndicator";

import wallpaper from "../../img/salty-wallpaper-darkened.jpg";
import opt from "../../img/opt.svg";
import { motion } from "framer-motion";

export const HomeScreen: FC = () => (
    <Home initial={{ transform: "scale(0)" }} animate={{ transform: "scale(1)" }} exit={{ transform: "scale(1)" }}>
        <AppSection>
            <App
                name="Charts"
                bg="linear-gradient(0deg, rgba(121,117,255,1) 0%, rgba(92,70,255,1) 100%)"
                icon={<IoPaperPlane style={{ fill: "lightgray", transform: "scale(3.3)" }} />}
                route="/fzpro"
            />
            <App name="Maps" bg="#6eff88" icon={<FaMapMarkerAlt style={{ fill: "white", transform: "scale(3.3)" }} />} route="/maps" />
            <App
                name="Ground"
                bg="white"
                icon={<FaTruckLoading style={{ fill: "black", transform: "scale(3.5)" }} />}
                route="/aircraft/ground-services"
            />
        </AppSection>
        <PageIndicators>
            <PageIndicator highlighted />
            <PageIndicator />
        </PageIndicators>
        <FavoriteAppsContainer>
            <App
                bg="linear-gradient(0deg, rgba(148,146,143,1) 0%, rgba(211,227,233,1) 100%)"
                icon={<BsGearWideConnected style={{ fill: "#2C3233", transform: "scale(3.5)" }} />}
                route="/settings/general"
            />
            <App
                bg="linear-gradient(0deg, rgba(48,160,232,1) 0%, rgba(14,85,173,1) 100%)"
                icon={<IoCloud style={{ fill: "white", transform: "scale(3.3)" }} />}
                route="/weather"
            />
            <App bg="white" icon={<IoFolder style={{ fill: "218FF3", transform: "scale(3.5)" }} />} route="/files" />
        </FavoriteAppsContainer>
    </Home>
);

const Home = styled(motion.div)`
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
    padding: 0 4px;
`;
