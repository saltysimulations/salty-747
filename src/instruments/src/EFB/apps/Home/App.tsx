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
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

type AppProps = {
    bg: string;
    name?: string;
    route?: string;
    icon?: React.ReactNode;
};

export const App: FC<AppProps> = ({ name, bg, icon, route }) => (
    <StyledAppContainer name={name}>
        <Link to={route ?? "/"}>
            <StyledApp bg={bg}>{icon}</StyledApp>
        </Link>
        <div>{name}</div>
    </StyledAppContainer>
);

const StyledApp = styled.div`
    width: 100px;
    height: 100px;
    background: ${(props: { bg: string }) => props.bg};
    background-position: center;
    background-size: cover;
    border-radius: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledAppContainer = styled.div`
    width: 100px;
    display: flex;
    flex-direction: column;
    text-align: center;
    color: white;
    font-size: 18px;
    margin: 20px;

    ${(props: { name?: string }) =>
        props.name &&
        css`
            gap: 7px;
        `}
`;
