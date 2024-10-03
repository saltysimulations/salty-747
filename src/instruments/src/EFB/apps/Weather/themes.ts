import cavok from "./backgrounds/cavok.jpg";
import overcast from "./backgrounds/overcast.jpg";

export type WeatherTheme = {
    background: string;
    widgetColor: string;
    accentTextColor: string;
};

export const cavokTheme: WeatherTheme = {
    background: cavok,
    widgetColor: "#286db2",
    accentTextColor: "#68b6ff",
};

export const overcastTheme: WeatherTheme = {
    background: overcast,
    widgetColor: "#627790",
    accentTextColor: "#ABC2DA",
};
