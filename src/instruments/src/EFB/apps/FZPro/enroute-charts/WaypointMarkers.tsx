import { SimbriefNavlogFix } from "@microsoft/msfs-sdk";
import { NavigraphTheme } from "@navigraph/leaflet";
import React, { FC } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { GiStarShuriken } from "react-icons/all";
import styled from "styled-components";

type WaypointMarkersProps = {
    fixes: SimbriefNavlogFix[];
    theme: NavigraphTheme;
};
export const WaypointMarkers: FC<WaypointMarkersProps> = ({ fixes, theme }) => (
    <>
        {fixes.map(
            (fix, i) =>
                fix.ident !== "TOD" &&
                fix.ident !== "TOC" && (
                    <Marker
                        position={[parseFloat(fix.pos_lat), parseFloat(fix.pos_long)]}
                        icon={L.divIcon({
                            html: ReactDOMServer.renderToString(
                                <Waypoint>
                                    <GiStarShuriken size={35} fill={theme === "DAY" ? "black" : "white"} style={{ position: "absolute" }} />
                                    <div style={{ color: theme === "DAY" ? "black" : "white" }}>{fix.ident}</div>
                                </Waypoint>
                            ),
                            iconAnchor: [17.5, 17.5],
                        })}
                        key={i}
                    />
                )
        )}
    </>
);
const Waypoint = styled.div`
    font-size: 20px;
    font-weight: 500;

    div {
        margin-left: 35px;
    }
`;
