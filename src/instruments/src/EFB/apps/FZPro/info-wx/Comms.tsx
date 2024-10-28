import { AirportFacility, FacilityFrequencyType } from "@microsoft/msfs-sdk";
import React, { FC } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import styled from "styled-components";
import { InfoField, InfoFieldContainer, SectionLabel } from ".";

export const Comms: FC<{ airport: AirportFacility }> = ({ airport }) => {
    const getFrequenciesByType = () => {
        const frequencies: Partial<Record<FacilityFrequencyType, string[]>> = {};

        for (const freq of airport.frequencies) {
            if (freq.type !== FacilityFrequencyType.None) {
                if (!frequencies[freq.type]) {
                    frequencies[freq.type] = [];
                }
                frequencies[freq.type]?.push(freq.freqMHz.toFixed(3));
            }
        }

        return frequencies;
    };

    return (
        <ScrollContainer style={{ width: "100%" }}>
            <CommsContainer>
                {Object.entries(getFrequenciesByType()).map((freqEntry, i) => (
                    <React.Fragment key={i}>
                        <SectionLabel>{FacilityFrequencyType[parseInt(freqEntry[0])]}</SectionLabel>
                        <InfoFieldContainer>
                            <InfoField>{freqEntry[1].join(", ")}</InfoField>
                        </InfoFieldContainer>
                    </React.Fragment>
                ))}
            </CommsContainer>
        </ScrollContainer>
    );
};

const CommsContainer = styled.div`
    width: 100%;
    flex: 1 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;

    * {
        flex-shrink: 0;
    }
`;
