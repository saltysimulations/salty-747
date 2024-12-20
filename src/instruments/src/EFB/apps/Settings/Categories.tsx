import React, { FC, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { SignIn } from "./SignIn";

import aircraft from "./icons/aircraft.svg";
import acars from "./icons/acars.svg";
import displayAndBrightness from "./icons/display_brightness.svg";
import general from "./icons/general.svg";

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
            <SignIn selected={selectedCategory === "accounts"} onClick={() => selectCategory("accounts")} />
            <CategoryGroup>
                <Category name="General" icon={general} selected={selectedCategory === "general"} selectCategory={() => selectCategory("general")} />
                <Category
                    name="Display & Brightness"
                    icon={displayAndBrightness}
                    selected={selectedCategory === "display"}
                    selectCategory={() => selectCategory("display")}
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
                    name="ACARS"
                    icon={acars}
                    selected={selectedCategory === "acars"}
                    selectCategory={() => selectCategory("acars")}
                />
            </CategoryGroup>
        </StyledCategories>
    );
};

const SettingsHeader = styled.div`
    font-size: 55px;
    font-weight: 700;
    color: ${(props) => props.theme.text};
    margin-bottom: 20px;
`;

const StyledCategories = styled.div`
    width: 90%;
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
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

const StyledCategory = styled.div<{ selected?: boolean }>`
    width: 100%;
    height: 70px;
    background: ${(props) => (props.selected ? props.theme.select : props.theme.invert.primary)};
    color: ${(props) => (props.selected ? "white" : props.theme.text)};
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${(props) => props.theme.border};
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
