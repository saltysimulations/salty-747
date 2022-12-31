"use strict";

import ts from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import scss from "rollup-plugin-scss";

const { join } = require("path");

export default {
    input: join(__dirname, "instrument.tsx"),
    output: {
        dir: join(__dirname, "../../../../salty-747/html_ui/Pages/VCockpit/Instruments/74S/PFD"),
        format: "es",
    },
    plugins: [
        scss({ output: join(__dirname, "../../../../salty-747/html_ui/Pages/VCockpit/Instruments/74S/PFD/pfd.css") }),
        resolve(),
        ts({ tsconfig: join(__dirname, "tsconfig.json") }),
    ],
};
