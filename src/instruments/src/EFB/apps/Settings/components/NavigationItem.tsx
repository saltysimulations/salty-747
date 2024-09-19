import React, { FC } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import { ListItem } from "../../../components/ListItem";

type NavigationItemProps = { name: string; path?: string; gray?: boolean };

export const NavigationItem: FC<NavigationItemProps> = ({ name, path, gray }) => {
    const navigate = useNavigate();

    return (
        <ListItem gray={gray} onClick={() => path && navigate(path)}>
            <div className="side">{name}</div>
            <IoIosArrowForward color="#b9b9bb" className="side" />
        </ListItem>
    );
};
