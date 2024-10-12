import React, { FC, useState, useEffect } from "react";
import styled from "styled-components";

type ItemProps = { gray?: boolean; noMouseDownEffect?: boolean; grow?: boolean; onClick?: () => void; children: React.ReactNode[] | React.ReactNode };

export const ListItem: FC<ItemProps> = ({ gray, noMouseDownEffect, grow, onClick = () => null, children }) => {
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
            grow={grow}
            onClick={() => onClick()}
            onMouseDown={() => setClicked(true)}
        >
            {children}
        </StyledItem>
    );
};

type StyledItemProps = { gray?: boolean; clicked: boolean; grow?: boolean };

const StyledItem = styled.div<StyledItemProps>`
    width: 100%;
    height: ${(props) => (props.grow ? "auto" : "70px")};
    display: flex;
    background: ${(props) => (props.clicked ? "#b9b9bb" : props.theme.invert.primary)};
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${(props) => props.theme.border};
    color: ${(props) => (props.gray ? "#b9b9bb" : props.theme.text)};
    transition: background 0.1s linear;

    .side {
        margin: 0 25px;
    }

    &:last-child {
        border: none;
    }
`;
