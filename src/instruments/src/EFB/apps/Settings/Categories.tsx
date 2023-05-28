import React, { FC, useState } from "react";
import styled from "styled-components";
import { Outlet, useNavigate } from "react-router-dom";
import { SignIn } from "./SignIn";

import opt from "../../img/opt.png";
import aircraft from "./icons/aircraft.png";
import acars from "./icons/acars.png";
import displayAndBrightness from "./icons/display_brightness.png";
import general from "./icons/general.png";
import simulation from "./icons/simulation.png";

type CategoryProps = { name: string; icon: string; selected: boolean; selectCategory: () => void };

const Category: FC<CategoryProps> = ({ name, icon, selected, selectCategory }) => (
    <StyledCategory className="category" selected={selected} onClick={() => selectCategory()}>
        <CategoryIcon icon={icon} />
        <div>{name}</div>
    </StyledCategory>
);

export const Categories: FC = () => {
    const [selectedCategory, setSelectedCategory] = useState("general");
    const navigate = useNavigate();

    const selectCategory = (category: string) => {
        setSelectedCategory(category);
        navigate(`/settings/${category}`);
    };

    return (
        <StyledCategories>
            <SettingsHeader>Settings</SettingsHeader>
            <SignIn />
            <CategoryGroup>
                <Category name="General" icon={general} selected={selectedCategory === "general"} selectCategory={() => selectCategory("general")} />
                <Category
                    name="Display & Brightness"
                    icon={displayAndBrightness}
                    selected={selectedCategory === "display"}
                    selectCategory={() => selectCategory("display")}
                />
                <Category
                    name="Wallpaper"
                    icon={acars}
                    selected={selectedCategory === "wallpaper"}
                    selectCategory={() => selectCategory("wallpaper")}
                />
            </CategoryGroup>
            <CategoryGroup>
                <Category
                    name="Aircraft"
                    icon={aircraft}
                    selected={selectedCategory === "aircraft"}
                    selectCategory={() => selectCategory("aircraft")}
                />
                <Category
                    name="Simulation"
                    icon={simulation}
                    selected={selectedCategory === "simulation"}
                    selectCategory={() => selectCategory("simulation")}
                />
                <Category name="ACARS" icon={acars} selected={selectedCategory === "acars"} selectCategory={() => selectCategory("acars")} />
            </CategoryGroup>
        </StyledCategories>
    );
};

const SettingsHeader = styled.div`
    font-size: 55px;
    font-weight: 700;
    color: black;
    margin-bottom: 20px;
`;

const StyledCategories = styled.div`
    width: 90%;
    margin-top: 100px;
    display: flex;
    flex-direction: column;
`;

const CategoryGroup = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 20%;
    margin: 30px 0;

    .category:nth-child(1) {
        border-radius: 15px 15px 0 0;
    }

    .category:last-child {
        border-radius: 0 0 15px 15px;
    }
`;

const StyledCategory = styled.div`
    width: 100%;
    height: 70px;
    background: ${(props: { selected?: boolean }) => (props.selected ? "#4FA0FC" : "white")};
    color: ${(props: { selected?: boolean }) => (props.selected ? "white" : "black")};
    display: flex;
    align-items: center;
    border-bottom: 1px solid #b9b9bb;
    font-size: 26px;

    div:nth-child(2) {
        flex-grow: 1;
    }

    &:last-child {
        border: none;
    }
`;

const CategoryIcon = styled.div`
    width: 45px;
    height: 45px;
    background: url(${(props: { icon: string }) => props.icon});
    background-position: center;
    background-size: cover;
    border-radius: 20%;
    margin: 0 25px;
`;
