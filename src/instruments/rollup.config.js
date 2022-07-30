"use strict";

const os = require("os");
const fs = require("fs");
const path = require("path");
const image = require("@rollup/plugin-image");
const { babel } = require("@rollup/plugin-babel");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");
const postcss = require("rollup-plugin-postcss");
const tailwindcss = require("tailwindcss");
import tsPathsResolve from "rollup-plugin-ts-paths-resolve";

const template = require("@flybywiresim/rollup-plugin-msfs");

const TMPDIR = `${__dirname}../../../bundles/`;

const extensions = [".ts", ".tsx", ".js", ".jsx", ".mjs"];

const extraInstruments = [];

function makePostcssPluginList(instrumentPath) {
    const usesTailwind = fs.existsSync(`${__dirname}/src/${instrumentPath}/tailwind.config.js`);

    return [tailwindcss(usesTailwind ? `${__dirname}/src/${instrumentPath}/tailwind.config.js` : undefined)];
}

function getInstrumentsToCompile() {
    const baseInstruments = fs
        .readdirSync(`${__dirname}/src`, { withFileTypes: true })
        .filter((d) => d.isDirectory() && fs.existsSync(`${__dirname}/src/${d.name}/config.json`));

    return [
        ...baseInstruments.map(({ name }) => ({ path: name, name, isInstrument: true })),
        ...extraInstruments.map((def) => ({ ...def, isInstrument: false })),
    ];
}

function getTemplatePlugin({ name, config, imports = [], isInstrument }) {
    return template({
        name,
        elementName: `salty-74s-${name.toLowerCase()}`,
        config,
        imports,
        elementName: `salty-${name}`.toLowerCase(),
        getCssBundle() {
            return fs.readFileSync(`${TMPDIR}/${name}/bundle.css`).toString();
        },
        outputDir: path.join(__dirname, "/../../salty-747/html_ui/Pages/VCockpit/Instruments/74s"),
    });
    // eslint-disable-next-line no-else-return
}

module.exports = getInstrumentsToCompile().map(({ path, name, isInstrument }) => {
    const config = JSON.parse(fs.readFileSync(`${__dirname}/src/${path}/config.json`));

    return {
        input: `${__dirname}/src/${path}/${config.index}`,
        output: {
            file: `${TMPDIR}/${name}/bundle.js`,
            format: "iife",
        },
        plugins: [
            tsPathsResolve({ tsConfigPath: `${__dirname}/../tsconfig.json` }),
            image(),
            nodeResolve({ extensions }),
            commonjs({ include: /node_modules/ }),
            babel({
                presets: [
                    ["@babel/preset-env", { targets: { safari: "11" } }],
                    ["@babel/preset-react", { runtime: "automatic" }],
                    ["@babel/preset-typescript"],
                ],
                plugins: ["@babel/plugin-proposal-class-properties", ["@babel/plugin-transform-runtime", { regenerator: true }]],
                babelHelpers: "runtime",
                compact: false,
                extensions,
            }),
            replace({ "process.env.NODE_ENV": '"production"' }),
            postcss({
                use: { sass: {} },
                plugins: makePostcssPluginList(path),
                extract: `${TMPDIR}/${name}/bundle.css`,
            }),
            getTemplatePlugin({
                name,
                elementName: `salty-${name}`,
                path,
                imports: [],
                config,
                isInstrument,
            }),
        ],
    };
});
