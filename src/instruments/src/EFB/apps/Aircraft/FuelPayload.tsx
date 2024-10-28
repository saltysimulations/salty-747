import React, { FC, useContext, useState } from "react";
import styled, { useTheme } from "styled-components";

import { ItemGroup } from "../../components/ItemGroup";
import { Input } from "../../components/Input";
import { ListItem } from "../../components/ListItem";
import { ChartWidget } from "./components/chart/ChartWidget";
import { chartLimits, envelope } from "./components/chart/Constants";
import { useSimVar } from "react-msfs";
import { PrimaryButton, SecondaryButton } from "../../components/Buttons";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { SimbriefClient } from "@microsoft/msfs-sdk";
import { InfoModal } from "../../components/InfoModal";
import { FlightContext } from "../../lib/FlightContext";
import { ModalContext } from "../..";
import { useSetting } from "../../hooks/useSettings";

export const FuelPayload: FC = () => {
    const [plannedPax, setPlannedPax] = useState<number>();
    const [plannedCargo, setPlannedCargo] = useState<number>();
    const [plannedZfw, setPlannedZfw] = useState<number>();
    const [plannedFuel, setPlannedFuel] = useState<number>();

    const { setOfp } = useContext(FlightContext);
    const { setModal } = useContext(ModalContext);

    const [simbriefUsername] = useSetting("boeingMsfsSimbriefUsername");

    const [cg] = useSimVar("CG PERCENT", "percent");
    const [gw] = useSimVar("TOTAL WEIGHT", "lbs");
    const metric = SimVar.GetGameVarValue("GAME UNIT IS METRIC", "boolean");
    const [pax, setPax] = useSimVar("L:SALTY_EFB_PAX_COUNT", "enum");
    const [cargo, setCargo] = useSimVar("L:SALTY_EFB_CARGO_WEIGHT", "enum");
    const [zfw, setZfw] = useSimVar("L:SALTY_EFB_ZFW", "enum");
    const [fuel, setFuel] = useSimVar("L:SALTY_EFB_FUEL_WEIGHT", "enum");

    const theme = useTheme();

    const itemGroupStyle = { boxShadow: "2px 2px 13.5px 7px rgba(0, 0, 0, 0.1)", margin: 0 };

    const weightInputFilter = (val: string) => {
        if (!val || parseInt(val) < 0) return "";

        if (val.includes("kg") || val.includes("lbs")) {
            return val;
        } else {
            return `${val} ${metric ? "kg" : "lbs"}`
        }
    };

    const paxInputFilter = (val: string) => {
        if (!val || parseInt(val) < 0) return "";

        if (val.includes("/")) {
            return Math.min(parseInt(val.split("/")[0]), 363).toString();
        } else {
            return `${Math.min(parseInt(val), 363)}/363`;
        }
    };

    const handleUplink = async () => {
        try {
            const newOfp = await SimbriefClient.getOfp(await SimbriefClient.getSimbriefUserIDFromUsername(simbriefUsername as string));
            setOfp(newOfp);

            let convert = 1;

            if (newOfp.params.units === "kgs" && !metric) {
                convert = 2.205;
            } else if (newOfp.params.units === "lbs" && metric) {
                convert = 0.453;
            }

            setPlannedPax(parseInt(newOfp.weights.pax_count));
            setPlannedCargo(Math.round(parseInt(newOfp.weights.cargo) * convert));
            setPlannedZfw(Math.round(parseInt(newOfp.weights.est_zfw) * convert));
            setPlannedFuel(Math.round(parseInt(newOfp.fuel.plan_ramp) * convert));
        } catch (_) {
            setModal(<InfoModal title="Error" description="Failed to fetch SimBrief OFP" />);
        }
    };

    const load = () => {
        if (!plannedZfw) {
            plannedPax && setPax(plannedPax);
            plannedCargo && setCargo(metric ? plannedCargo * 2.205 : plannedCargo);
        } else {
            setZfw(metric ? plannedZfw * 2.205 : plannedZfw);
        }

        plannedFuel && setFuel(metric ? plannedFuel * 2.205 : plannedFuel);
    };

    return (
        <Container>
            <ChartWidgetContainer>
                <ChartWidget
                    width={525}
                    height={511}
                    envelope={envelope}
                    limits={chartLimits}
                    cg={cg}
                    gw={metric ? gw / 2.205 : gw}
                    mldwCg={cg}
                    mldw={metric ? gw / 2.205 : gw}
                    zfwCg={cg}
                    zfw={metric ? zfw / 2.205 : zfw}
                />
            </ChartWidgetContainer>

            <ValueSection>
                <WeightInputContainer>
                    <ItemGroupContainer>
                        <Label>Actual</Label>
                        <ItemGroup style={itemGroupStyle} spacing={0}>
                            <InfoColumn label="Pax" value={`${Math.round(pax)}/363`} />
                            <InfoColumn label="Cargo" value={`${metric ? Math.round(cargo / 2.205) : cargo} kg`} />
                            <InfoColumn label="ZFW" value={`${metric ? Math.round(zfw / 2.205) : zfw} kg`} />
                            <InfoColumn label="CG" value={`${cg.toFixed(2)}%`} />
                        </ItemGroup>
                    </ItemGroupContainer>
                    <ItemGroupContainer>
                        <Label>Planned</Label>
                        <ItemGroup style={itemGroupStyle} spacing={0}>
                            <InputColumn label="Pax" placeholder="0/363" value={plannedPax} setter={setPlannedPax} filterFn={paxInputFilter} />
                            <InputColumn
                                label="Cargo"
                                placeholder={`0 ${metric ? "kg" : "lbs"}`}
                                value={plannedCargo}
                                setter={setPlannedCargo}
                                filterFn={weightInputFilter}
                            />
                            <InputColumn
                                label="ZFW"
                                placeholder={`0 ${metric ? "kg" : "lbs"}`}
                                value={plannedZfw}
                                setter={setPlannedZfw}
                                filterFn={weightInputFilter}
                            />
                            <InfoColumn label="CG" value={`${cg.toFixed(2)}%`} />
                        </ItemGroup>
                    </ItemGroupContainer>
                </WeightInputContainer>
                <WeightInputContainer>
                    <ItemGroupContainer>
                        <ItemGroup style={itemGroupStyle} spacing={0}>
                            <InfoColumn label="Fuel" value={`${metric ? Math.round(fuel / 2.205) : fuel} ${metric ? "kg" : "lbs"}`} />
                        </ItemGroup>
                    </ItemGroupContainer>
                    <ItemGroupContainer>
                        <ItemGroup style={itemGroupStyle} spacing={0}>
                            <InputColumn
                                label="Fuel"
                                placeholder={`0 ${metric ? "kg" : "lbs"}`}
                                value={plannedFuel}
                                setter={setPlannedFuel}
                                filterFn={weightInputFilter}
                            />
                        </ItemGroup>
                    </ItemGroupContainer>
                </WeightInputContainer>
                <Buttons>
                    <SecondaryButton style={{ marginRight: "25px" }} onClick={handleUplink}>
                        <AiOutlineCloudDownload size={35} color={theme.select} style={{ padding: 0, margin: 0 }} />
                        <div>SimBrief</div>
                    </SecondaryButton>
                    <PrimaryButton onClick={load}>Refuel & Load</PrimaryButton>
                </Buttons>
            </ValueSection>
        </Container>
    );
};

const InfoColumn: FC<{ label: string; value: string }> = ({ label, value }) => (
    <ListItem>
        <WeightLabel>{label}</WeightLabel>
        <WeightLabel>{value}</WeightLabel>
    </ListItem>
);

type InputColumnProps = {
    label: string;
    placeholder: string;
    value: number | undefined;
    setter: (val: number | undefined) => void;
    filterFn: (val: string) => string;
};

const InputColumn: FC<InputColumnProps> = ({ label, placeholder, value, setter, filterFn }) => (
    <ListItem>
        <WeightLabel>{label}</WeightLabel>
        <Input
            placeholder={placeholder}
            centerPlaceholder={false}
            placeholderAlign="right"
            style={{ borderBottom: "none", padding: "0 15px", width: "100%", textAlign: "right", fontSize: "26px" }}
            applyFilters={filterFn}
            onFocusOut={(val) => setter(isNaN(parseInt(val)) ? undefined : parseInt(val))}
            onFocus={() => setter(undefined)}
            manualValue={value?.toString()}
        />
    </ListItem>
);

const Buttons = styled.div`
    display: flex;
    align-self: start;
    margin: 20px 30px;
`;

const ValueSection = styled.div`
    display: flex;
    flex: 1 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const ItemGroupContainer = styled.div`
    flex: 1 0;
    margin: 30px 30px;
`;

const WeightLabel = styled.div`
    padding: 0 15px;
`;

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    background: ${(props) => props.theme.bg};
`;

const WeightInputContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 26px;
    width: 100%;
`;

const Label = styled.div`
    font-size: 22px;
    font-weight: 500;
    color: ${(props) => props.theme.select};
    margin: 10px 0;
`;

const ChartWidgetContainer = styled.div`
    flex: 1 0;
    display: flex;
    justify-content: center;
    align-items: center;
`;
