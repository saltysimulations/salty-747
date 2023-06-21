import React, { FC } from "react";
import { IoMdCheckmark } from "react-icons/io";

import { SettingsItem } from "./SettingsItem";

type SelectableItemProps = { label: string; selected?: boolean; onClick: () => void };

export const SelectableItem: FC<SelectableItemProps> = ({ label, selected, onClick }) => (
    <SettingsItem onClick={() => onClick()}>
        <div className="side">{label}</div>
        {selected && <IoMdCheckmark color="#1476fb" size={40} className="side" />}
    </SettingsItem>
);
