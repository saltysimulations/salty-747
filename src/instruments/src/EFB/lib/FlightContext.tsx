import React, { createContext, FC, ReactNode, useState } from "react";
import { SimbriefOfp } from "@microsoft/msfs-sdk";

export const FlightContext = createContext<{ ofp: SimbriefOfp | null; setOfp: (ofp: SimbriefOfp | null) => void }>({ ofp: null, setOfp: () => {} });

export const FlightProvider: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
    const [ofp, setOfp] = useState<SimbriefOfp | null>(null);

    return (
        <FlightContext.Provider
            value={{
                ofp,
                setOfp,
            }}
        >
            {children}
        </FlightContext.Provider>
    );
};
