import { SaltyDataStore } from "@shared/persistence";

import { initializeApp, Scope, NavigraphApp } from "navigraph/app";
import { getAuth } from "navigraph/auth";
import { Chart, ChartCategory, getChartsAPI } from "navigraph/charts";

const config: NavigraphApp = {
    clientId: process.env.CLIENT_ID as string,
    clientSecret: process.env.CLIENT_SECRET as string,
    scopes: [Scope.CHARTS, Scope.TILES]
};

initializeApp(config);

export const auth = getAuth({
    storage: {
        getItem: (key) => SaltyDataStore.get("NG" + key, ""),
        setItem: (key, value) => SaltyDataStore.set("NG" + key, value)
    },
    keys: {
        accessToken: "ACCESS_TOKEN",
        refreshToken: "REFRESH_TOKEN",
    },
});

export const charts = getChartsAPI();

export const getChartsByCategory = (chartIndex: Chart[], category: ChartCategory): Chart[] => {
    return chartIndex.filter((chart) => chart.category === category);
}
