import React, { FC } from "react";
import styled from "styled-components";
import { Toggle } from "../Settings/components/Toggle";
import { ItemGroup } from "../../components/ItemGroup";
import { useSimVar } from "react-msfs";
import { PrimaryButton } from "../../components/Buttons";
import { ListItem } from "../../components/ListItem";

export const GroundServices: FC = () => {
    const [left1Door, setLeft1Door] = useSimVar("INTERACTIVE POINT GOAL:10", "Percent over 100");
    const [right5Door, setRight5Door] = useSimVar("INTERACTIVE POINT GOAL:1", "Percent over 100");
    const [cargoFwd, setCargoFwd] = useSimVar("INTERACTIVE POINT GOAL:12", "Percent over 100");
    const [, toggleFuelTruck] = useSimVar("K:REQUEST_FUEL_KEY", "");
    const [, toggleBaggageTruck] = useSimVar("K:REQUEST_LUGGAGE", "");
    const [, toggleCateringTruck] = useSimVar("K:REQUEST_CATERING", "");
    const [, toggleJetway] = useSimVar("K:TOGGLE_JETWAY", "");

    const itemGroupStyle = { boxShadow: "2px 2px 13.5px 7px rgba(0, 0, 0, 0.1)", margin: 0 };

    return (
        <Container>
            <StyledOptionsContainer>
                <div>
                    <ItemGroupContainer>
                        <Label>Pax Doors</Label>
                        <ItemGroup style={itemGroupStyle} spacing={0}>
                            <Toggle label="1 Left" enabled={left1Door >= 1} onClick={() => setLeft1Door(left1Door >= 1 ? 0 : 1)} />
                            <Toggle label="5 Right" enabled={right5Door >= 1} onClick={() => setRight5Door(right5Door >= 1 ? 0 : 1)} />
                        </ItemGroup>
                    </ItemGroupContainer>
                    <ItemGroupContainer>
                        <Label>Cargo Doors</Label>
                        <ItemGroup style={itemGroupStyle} spacing={0}>
                            <Toggle label="Cargo Fwd" enabled={cargoFwd >= 1} onClick={() => setCargoFwd(cargoFwd >= 1 ? 0 : 1)} />
                        </ItemGroup>
                    </ItemGroupContainer>
                </div>
                <ItemGroupContainer>
                    <Label>Services</Label>
                    <ItemGroup style={itemGroupStyle} spacing={0}>
                        <Service name="Jetway" onRequest={() => toggleJetway(1)} />
                        <Service name="Fuel Truck" onRequest={() => toggleFuelTruck(1)} />
                        <Service name="Baggage Truck" onRequest={() => toggleBaggageTruck(1)} />
                        <Service name="Catering" onRequest={() => toggleCateringTruck(1)} />
                    </ItemGroup>
                </ItemGroupContainer>
            </StyledOptionsContainer>
        </Container>
    );
}

const Service: FC<{ name: string, onRequest: () => void }> = ({ name, onRequest }) => (
    <ListItem noMouseDownEffect>
        <div style={{ padding: "0 25px" }}>{name}</div>
        <PrimaryButton style={{ justifySelf: "end", margin: "0 15px", transform: "scale(0.85)" }} onClick={onRequest} >Request</PrimaryButton>
    </ListItem>
);

const Label = styled.div`
    font-size: 22px;
    font-weight: 500;
    color: #4FA0FC;
    margin: 10px 0;
`;

const ItemGroupContainer = styled.div`
    margin: 60px 0;
`;

const StyledAircraftContainer = styled.div`
    height: 100%;
    width: 55%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledOptionsContainer = styled.div`
    height: 100%;
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 26px;
`;

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    background: ${(props) => props.theme.bg};
`;
