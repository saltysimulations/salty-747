import React, { FC, ReactNode, useContext } from "react";

import { ContentPageContainer } from "./components/ContentPageContainer";
import { ItemGroup } from "../../components/ItemGroup";
import { NavigationItem } from "./components/NavigationItem";
import { SettingsContext } from "./SettingsContext";
import { SelectableItem } from "./components/SelectableItem";
import { AtisSource, MetarSource, TafSource } from "../../lib/weather";
import { BackButtonProps } from "./components/BackButton";

export const Acars: FC = () => (
    <ContentPageContainer title="ACARS">
        <ItemGroup>
            <NavigationItem name="METAR Source" path="/settings/metar-source" />
            <NavigationItem name="TAF Source" path="/settings/taf-source" />
            <NavigationItem name="ATIS Source" path="/settings/atis-source" />
        </ItemGroup>
    </ContentPageContainer>
);

export const MetarSourceOptions: FC = () => {
    const { metarSource, setMetarSource } = useContext(SettingsContext);

    const sources: Record<MetarSource, string> = {
        msfs: "MSFS",
        aviationweather: "AviationWeather",
        vatsim: "Vatsim",
        ivao: "IVAO",
        pilotedge: "PilotEdge",
    } as const;

    return (
        <SourceOptions
            title="METAR Source"
            backProps={{ label: "ACARS", path: "/settings/acars" }}
            items={(Object.keys(sources) as MetarSource[]).map((source, i) => (
                <SelectableItem label={sources[source]} selected={metarSource === source} onClick={() => setMetarSource(source)} key={i} />
            ))}
        />
    );
};

export const TafSourceOptions: FC = () => {
    const { tafSource, setTafSource } = useContext(SettingsContext);

    const sources: Record<TafSource, string> = {
        met: "MET Norway (International Data)",
        aviationweather: "AviationWeather",
        faa: "FAA",
    } as const;

    return (
        <SourceOptions
            title="TAF Source"
            backProps={{ label: "ACARS", path: "/settings/acars" }}
            items={(Object.keys(sources) as TafSource[]).map((source, i) => (
                <SelectableItem label={sources[source]} selected={tafSource === source} onClick={() => setTafSource(source)} key={i} />
            ))}
        />
    );
};

export const AtisSourceOptions: FC = () => {
    const { atisSource, setAtisSource } = useContext(SettingsContext);

    const sources: Record<AtisSource, string> = {
        vatsim: "Vatsim",
        ivao: "IVAO",
        pilotedge: "PilotEdge",
        faa: "FAA",
    } as const;

    return (
        <SourceOptions
            title="ATIS Source"
            backProps={{ label: "ACARS", path: "/settings/acars" }}
            items={(Object.keys(sources) as AtisSource[]).map((source, i) => (
                <SelectableItem label={sources[source]} selected={atisSource === source} onClick={() => setAtisSource(source)} key={i} />
            ))}
        />
    );
};

const SourceOptions: FC<{ title: string; backProps: BackButtonProps | undefined; items: ReactNode[] }> = ({ title, backProps, items }) => (
    <ContentPageContainer title={title} backProps={backProps}>
        <ItemGroup>{items}</ItemGroup>
    </ContentPageContainer>
);
