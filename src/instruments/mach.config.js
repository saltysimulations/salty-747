const imageInline = require("esbuild-plugin-inline-image");
const postcss = require("esbuild-style-plugin");

/** @type { import('@synaptic-simulations/mach').MachConfig } */
module.exports = {
    packageName: "b74s",
    packageDir: "/../../salty-747",
    plugins: [imageInline({ limit: -1 }), postcss()],
    instruments: [
        {
            name: "efb",
            index: "src/EFB/index.tsx",
            simulatorPackage: {
                type: "react",
                imports: ["/JS/dataStorage.js"]
            }
        }
    ]
}
