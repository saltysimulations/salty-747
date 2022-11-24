const fragmenter = require("@flybywiresim/fragmenter");
const fs = require("fs");

const execute = async () => {
    try {
        const result = await fragmenter.pack({
            baseDir: "./salty-747",
            outDir: "./build-modules",
            modules: [
                {
                    name: "html_ui",
                    sourceDir: "./html_ui",
                },
                {
                    name: "ModelBehaviorDefs",
                    sourceDir: "./ModelBehaviorDefs",
                },
                {
                    name: "Textures",
                    sourceDir: "./SimObjects/Airplanes/Salty_B747_8i/TEXTURE",
                },
                {
                    name: "Livery",
                    sourceDir: "./SimObjects/Airplanes/_Salty_B747_8i-livery",
                },
                {
                    name: "Sound",
                    sourceDir: "./SimObjects/Airplanes/Salty_B747_8i/sound",
                },
                {
                    name: "Model",
                    sourceDir: "./SimObjects/Airplanes/Salty_B747_8i/model",
                },
                {
                    name: "Panel",
                    sourceDir: "./SimObjects/Airplanes/Salty_B747_8i/panel",
                }
            ],
        });
        console.log(result);
        console.log(fs.readFileSync("./build-modules/modules.json").toString());
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

execute();
