import { CloudQuantity, ICloud } from "@ninjomcs/metar-taf-parser-msfs";
import clear from "./backgrounds/clear.jpg";
import few from "./backgrounds/few.jpg";
import scattered from "./backgrounds/scattered.jpg";
import broken from "./backgrounds/broken.jpg";
import overcast from "./backgrounds/overcast.jpg";
import clearNight from "./backgrounds/clear-night.jpg";

export type WeatherTheme = {
    background: string;
    widgetColor: string;
    accentTextColor: string;
};

export const themes = {
    clear: {
        background: clear,
        widgetColor: "#357AC0",
        accentTextColor: "#7ABAF3",
    },
    few: {
        background: few,
        widgetColor: "#286db2",
        accentTextColor: "#68b6ff",
    },
    scattered: {
        background: scattered,
        widgetColor: "#286db2",
        accentTextColor: "#68b6ff",
    },
    broken: {
        background: broken,
        widgetColor: "#8c8c8c",
        accentTextColor: "#e0e0e0",
    },
    overcast: {
        background: overcast,
        widgetColor: "#627790",
        accentTextColor: "#ABC2DA",
    },
    clearNight: {
        background: clearNight,
        widgetColor: "#181e2e",
        accentTextColor: "#3e4457",
    },
    scatteredNight: {
        background: clearNight,
        widgetColor: "#181e2e",
        accentTextColor: "#3e4457",
    },
};

const cloudOrder: Record<CloudQuantity, number> = {
    SKC: 0,
    FEW: 1,
    SCT: 2,
    BKN: 3,
    OVC: 4,
    NSC: -1,
};

export const determineTheme = (cloudCover: ICloud[], hour: number): WeatherTheme => {
    let highest = CloudQuantity.SKC;

    for (const cloud of cloudCover) {
        if (cloudOrder[cloud.quantity] > cloudOrder[highest]) {
            highest = cloud.quantity;
        }
    }

    const night = hour >= 18 || hour <= 8;

    switch (highest) {
        case CloudQuantity.SKC:
            return night ? themes.clearNight : themes.clear;
        case CloudQuantity.FEW:
            return night ? themes.clearNight : themes.few;
        case CloudQuantity.SCT:
            return night ? themes.scatteredNight : themes.scattered;
        case CloudQuantity.BKN:
            return night ? themes.scatteredNight : themes.broken;
        case CloudQuantity.OVC:
            return night ? themes.scatteredNight : themes.overcast;
    }

    return themes.few;
};
