import React, { FC, ReactNode } from "react";
import { usePersistentPropertyWithDefault } from "react-msfs";
import { ThemeProvider } from "styled-components";

type Themes = "light" | "dark";

type ThemeSwitchContextProps = {
    theme: Themes;
    setTheme: (theme: Themes) => void;
};

export const ThemeSwitchContext = React.createContext<ThemeSwitchContextProps>({ theme: "light", setTheme: () => {} });

const themes = {
    light: {
        bg: "#ffffff",
        primary: "#f2f1f6",
        accent: "#e9e9eb",
        text: "#000000",
        select: "#4FA0FC",
        border: "lightgray",
        selectLighter: "#CDE5F4",

        invert: {
            bg: "#f2f2f7",
            primary: "#ffffff",
        },
    },
    dark: {
        bg: "#000000",
        primary: "#1C1C1E",
        accent: "#3D3D3D",
        text: "#ffffff",
        select: "#0E64BC",
        border: "#505050",
        selectLighter: "#0E64BC",

        invert: {
            bg: "#000000",
            primary: "#1C1C1E",
        },
    },
};

export const Theme: FC<{ children?: ReactNode | ReactNode[]}> = ({ children }) => {
    const [theme, setTheme] = usePersistentPropertyWithDefault("SALTY_EFB_THEME", "light") as [
        Themes,
        (t: Themes) => void
    ];

    return (
        <ThemeSwitchContext.Provider value={{ theme, setTheme }}>
            <ThemeProvider theme={themes[theme]}>{children}</ThemeProvider>
        </ThemeSwitchContext.Provider>
    );
};
