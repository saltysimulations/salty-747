import { AirportFacility } from "@microsoft/msfs-sdk";
import React, { FC } from "react";
import { IoMdCheckmark } from "react-icons/io";
import styled from "styled-components";
import { getIdentFromIcao } from "../../lib/facility";
import { ListItemDescription, ListItemTitle, ListItemLabel } from "../TitleDescriptionItems";

type AirportSelectorItemProps = { airport: AirportFacility; isSelected: boolean; label?: string; single?: boolean; onClick: () => void };

export const AirportSelectorItem: FC<AirportSelectorItemProps> = ({ airport, isSelected, label, single, onClick }) => (
    <>
        {label && <AirportTypeLabel>{label}</AirportTypeLabel>}
        <StyledAirportSelectorItem onClick={onClick} single={single}>
            <ListItemDescription>
                <ListItemTitle>{getIdentFromIcao(airport.icao)}</ListItemTitle>
                <ListItemLabel>{Utils.Translate(airport.name)}</ListItemLabel>
            </ListItemDescription>
            {isSelected && <IoMdCheckmark color="#1476fb" size={40} style={{ margin: "0 25px" }} />}
        </StyledAirportSelectorItem>
    </>
);

const AirportTypeLabel = styled.div`
    font-size: 24px;
    color: gray;
    font-weight: 500;
    padding: 8px 25px;
    margin: 20px 0 0 0;
`;

const StyledAirportSelectorItem = styled.div<{ single?: boolean }>`
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid ${(props) => props.theme.border};
    ${(props) => props.single && `border-top: 1px solid ${props.theme.border};`}
    align-items: center;
    background: ${(props) => props.theme.invert.primary};
    flex-shrink: 0;
`;
