import React, { FC, useContext } from "react";

import { ContentPageContainer } from "./components/ContentPageContainer";
import { usePersistentProperty } from "@instruments/common/persistence";
import { ItemGroup } from "../../components/ItemGroup";
import { Toggle } from "./components/Toggle";
import { NavigationItem } from "./components/NavigationItem";
import { SelectableItem } from "./components/SelectableItem";

import { BoeingAutoFuelMode, BoeingIrsAlignTimeMode, BoeingNdHdgTrkUpMode } from "../../lib/settings";
import { useSetting } from "../../hooks/useSettings";
import { SettingsContext } from "./SettingsContext";
import { ListItem } from "../../components/ListItem";
import { Input } from "../../components/Input";
import { ModalContext } from "../..";
import { InfoModal } from "../../components/InfoModal";
import { useSimVar } from "react-msfs";

export const Aircraft: FC = () => {
    const { simbridgePort, setSimbridgePort } = useContext(SettingsContext);
    const { setModal } = useContext(ModalContext);

    const [trkUp, setTrkUp] = useSetting("boeingMsfsNdHdgTrkUpMode");
    const [autoFuelManagement, setAutoFuelManagement] = useSetting("boeingMsfsAutoFuelManagement");

    const handlePort = (val: string) => {
        const parsed = parseInt(val);
        if (!isNaN(parsed) && parsed.toString().length <= 5) {
            setSimbridgePort(parsed);
        } else {
            setModal(<InfoModal title="Error" description="Invalid port"/>)
        }
    };

    return (
        <ContentPageContainer title="Aircraft">
            <ItemGroup>
                <Toggle
                    label="ND Track Up"
                    enabled={trkUp === BoeingNdHdgTrkUpMode.TRK}
                    onClick={(enabled) => setTrkUp(enabled ? BoeingNdHdgTrkUpMode.HDG : BoeingNdHdgTrkUpMode.TRK)}
                />
                <Toggle
                    label="Automatic Fuel Management"
                    enabled={autoFuelManagement === BoeingAutoFuelMode.ON}
                    onClick={(enabled) => setAutoFuelManagement(enabled ? BoeingAutoFuelMode.OFF : BoeingAutoFuelMode.ON)}
                />
            </ItemGroup>
            <ItemGroup>
                <ListItem>
                    <div className="side">SimBridge Port</div>
                    <Input
                        placeholder={simbridgePort.toString()}
                        centerPlaceholder={false}
                        placeholderAlign="right"
                        style={{ borderBottom: "none", textAlign: "right", margin: "0 15px", fontSize: "26px" }}
                        onFocusOut={handlePort}
                        clearOnFocusOut
                    />
                </ListItem>
            </ItemGroup>
            <ItemGroup>
                <NavigationItem name="IRS Alignment Time" path="/settings/irs-alignment" />
            </ItemGroup>
        </ContentPageContainer>
    );
};

export const IRSAlignment: FC = () => {
    const [irsAlignmentTime, setirsAlignmentTime] = useSetting("boeingMsfsIrsAlignTime");

    return (
        <ContentPageContainer title="IRS Alignment Time" backProps={{ label: "Aircraft", path: "/settings/aircraft" }}>
            <ItemGroup>
                <SelectableItem label="Realistic" selected={irsAlignmentTime === BoeingIrsAlignTimeMode.Realistic} onClick={() => setirsAlignmentTime(BoeingIrsAlignTimeMode.Realistic)} />
                <SelectableItem label="Accelerated" selected={irsAlignmentTime === BoeingIrsAlignTimeMode.Accelerated} onClick={() => setirsAlignmentTime(BoeingIrsAlignTimeMode.Accelerated)} />
                <SelectableItem label="Instant" selected={irsAlignmentTime === BoeingIrsAlignTimeMode.Instant} onClick={() => setirsAlignmentTime(BoeingIrsAlignTimeMode.Instant)} />
            </ItemGroup>
        </ContentPageContainer>
    );
};
