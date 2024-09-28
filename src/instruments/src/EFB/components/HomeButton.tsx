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
import { Link } from "react-router-dom";

import HomeButtonImage from "../img/home.svg";

const StyledHomeButton = styled.img`
    height: 100px;
    width: 100px;
    position: absolute;
    right: 25px;
    bottom: 200px;
    z-index: 999;
`;

export const HomeButton: FC = () => (
    <Link to="/">
        <StyledHomeButton src={HomeButtonImage} alt="" />
    </Link>
);
