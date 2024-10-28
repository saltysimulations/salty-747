import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        bg: string;
        primary: string;
        accent: string;
        text: string;
        select: string;
        border: string;
        selectLighter: string;

        invert: {
            bg: string;
            primary: string;
        }
    };
}
