import React, { FC, useState, useEffect } from "react";
import styled from "styled-components";

type ItemProps = { gray?: boolean; noMouseDownEffect?: boolean; onClick?: () => void; children: React.ReactNode[] | React.ReactNode };

export const SettingsItem: FC<ItemProps> = ({ gray, noMouseDownEffect, onClick = () => null, children }) => {
    const [clicked, setClicked] = useState<boolean>(false);

    useEffect(() => {
        const mouseUp = () => setClicked(false);

        window.addEventListener("mouseup", mouseUp);

        return () => {
            window.removeEventListener("mouseup", mouseUp);
        };
    }, []);

    return (
        <StyledItem
            className="item"
            gray={gray}
            clicked={noMouseDownEffect ? false : clicked}
            onClick={() => onClick()}
            onMouseDown={() => setClicked(true)}
        >
            {children}
        </StyledItem>
    );
};

type StyledItemProps = { gray?: boolean; clicked: boolean };

const StyledItem = styled.div`
    width: 100%;
    height: 70px;
    display: flex;
    background: ${(props: StyledItemProps) => (props.clicked ? "#b9b9bb" : "white")};
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #b9b9bb;
    color: ${(props: StyledItemProps) => (props.gray ? "#b9b9bb" : "black")};
    transition: background 0.1s linear;

    .side {
        margin: 0 25px;
    }

    &:last-child {
        border: none;
    }
`;
